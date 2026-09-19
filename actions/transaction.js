"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import aj from "@/lib/arcjet";
import { request } from "@arcjet/next";
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const serializeAmount = (obj) => ({
  ...obj,
  amount: obj.amount?.toNumber?.() ?? obj.amount,
});

export async function createTransaction(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const req = await request();

    const decision = await aj.protect(req, {
      userId,
      requested: 1,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        const { remaining, reset } = decision.reason;
        console.error({
          code: "RATE_LIMIT_EXCEEDED",
          details: {
            remaining,
            resetInSeconds: reset,
          },
        });

        throw new Error("Too many requests. Please try again later.");
      }

      throw new Error("Request blocked");
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const account = await db.account.findUnique({
      where: {
        id: data.accountId,
        userId: user.id,
      },
    });

    if (!account) {
      throw new Error("Account not found");
    }

    const amount = Number(data.amount);
    const transactionDate = new Date(data.date);
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("Amount must be greater than zero");
    }
    if (Number.isNaN(transactionDate.getTime())) {
      throw new Error("Invalid transaction date");
    }

    const balanceChange = data.type === "EXPENSE" ? -amount : amount;
    const newBalance = account.balance.toNumber() + balanceChange;

    const transaction = await db.$transaction(async (tx) => {
      const newTransaction = await tx.transaction.create({
        data: {
          type: data.type,
          amount,
          description: data.description?.trim() || null,
          date: transactionDate,
          category: data.category,
          accountId: data.accountId,
          isRecurring: Boolean(data.isRecurring),
          recurringInterval: data.isRecurring ? data.recurringInterval : null,
          userId: user.id,
          nextRecurringDate:
            data.isRecurring && data.recurringInterval
              ? calculateNextRecurringDate(transactionDate, data.recurringInterval)
              : null,
        },
      });

      await tx.account.update({
        where: { id: data.accountId },
        data: { balance: newBalance },
      });

      return newTransaction;
    });

    revalidatePath("/dashboard");
    revalidatePath(`/account/${transaction.accountId}`);

    return { success: true, data: serializeAmount(transaction) };
  } catch (error) {
    throw new Error(error.message);
  }
}

function calculateNextRecurringDate(startDate, interval) {
  const date = new Date(startDate);

  switch (interval) {
    case "DAILY":
      date.setDate(date.getDate() + 1);
      break;
    case "WEEKLY":
      date.setDate(date.getDate() + 7);
      break;
    case "MONTHLY":
      date.setMonth(date.getMonth() + 1);
      break;
    case "YEARLY":
      date.setFullYear(date.getFullYear() + 1);
      break;
  }

  return date;
}


export async function scanReceipt(file) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Receipt scanning is not configured");
    }
    if (!file?.type?.startsWith("image/")) {
      throw new Error("Please upload an image receipt");
    }

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    // Convert ArrayBuffer to Base64
    const base64String = Buffer.from(arrayBuffer).toString("base64");

    const prompt = `
      Analyze this receipt image and extract the following information in JSON format:
      - Total amount (just the number)
      - Date (in ISO format)
      - Description or items purchased (brief summary)
      - Merchant/store name
      - Suggested category (one of: housing,transportation,groceries,utilities,entertainment,food,shopping,healthcare,education,personal,travel,insurance,gifts,bills,other-expense )
      
      Only respond with valid JSON in this exact format:
      {
        "amount": number,
        "date": "ISO date string",
        "description": "string",
        "merchantName": "string",
        "category": "string"
      }

      If its not a recipt, return an empty object
    `;

    const response = await genAI.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: [
        {
          inlineData: {
            data: base64String,
            mimeType: file.type,
          },
        },
        prompt,
      ],
    });

    const text = response.text || "";
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    try {
      const data = JSON.parse(cleanedText);
      const amount = Number(data.amount);
      const date = new Date(data.date);
      if (!Number.isFinite(amount) || Number.isNaN(date.getTime())) {
        throw new Error("Receipt is missing a valid amount or date");
      }

      return {
        amount,
        date,
        description: data.description,
        category: data.category,
        merchantName: data.merchantName,
      };
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      throw new Error("Invalid response format from Gemini");
    }
  } catch (error) {
    console.error("Error scanning receipt:", error);
    throw new Error("Failed to scan receipt");
  }
}




export async function getTransaction(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const transaction = await db.transaction.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!transaction) throw new Error("Transaction not found");

  return serializeAmount(transaction);
}


export async function updateTransaction(id, data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    const originalTransaction = await db.transaction.findUnique({
      where: {
        id,
        userId: user.id,
      },
      include: {
        account: true,
      },
    });

    if (!originalTransaction) throw new Error("Transaction not found");

    const oldBalanceChange =
      originalTransaction.type === "EXPENSE"
        ? -originalTransaction.amount.toNumber()
        : originalTransaction.amount.toNumber();

    const amount = Number(data.amount);
    const transactionDate = new Date(data.date);
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("Amount must be greater than zero");
    }
    if (Number.isNaN(transactionDate.getTime())) {
      throw new Error("Invalid transaction date");
    }

    const nextAccount = await db.account.findFirst({
      where: { id: data.accountId, userId: user.id },
      select: { id: true },
    });
    if (!nextAccount) throw new Error("Account not found");

    const newBalanceChange =
      data.type === "EXPENSE" ? -amount : amount;

    const netBalanceChange = newBalanceChange - oldBalanceChange;

    const transaction = await db.$transaction(async (tx) => {
      const updated = await tx.transaction.update({
        where: {
          id,
          userId: user.id,
        },
        data: {
          type: data.type,
          amount,
          description: data.description?.trim() || null,
          date: transactionDate,
          category: data.category,
          accountId: data.accountId,
          isRecurring: Boolean(data.isRecurring),
          recurringInterval: data.isRecurring ? data.recurringInterval : null,
          nextRecurringDate:
            data.isRecurring && data.recurringInterval
              ? calculateNextRecurringDate(transactionDate, data.recurringInterval)
              : null,
        },
      });

      if (originalTransaction.accountId === data.accountId) {
        await tx.account.update({
          where: { id: data.accountId },
          data: { balance: { increment: netBalanceChange } },
        });
      } else {
        await tx.account.update({
          where: { id: originalTransaction.accountId },
          data: { balance: { increment: -oldBalanceChange } },
        });
        await tx.account.update({
          where: { id: data.accountId },
          data: { balance: { increment: newBalanceChange } },
        });
      }

      return updated;
    });

    revalidatePath("/dashboard");
    revalidatePath(`/account/${data.accountId}`);
    revalidatePath(`/account/${originalTransaction.accountId}`);

    return { success: true, data: serializeAmount(transaction) };
  } catch (error) {
    throw new Error(error.message);
  }
}
