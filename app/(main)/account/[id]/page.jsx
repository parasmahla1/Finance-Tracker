import { getAccountWithTransactions } from '@/actions/account';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react';
import { BarLoader } from 'react-spinners';
import { TransactionTable } from '../_components/transaction-table';
import { AccountChart } from '../_components/account-chart';

const AccountPage = async ({ params }) => {
  const accountData = await getAccountWithTransactions(params.id);

  if (!accountData) {
    notFound();
  }

  const {transactions, ...account} = accountData;
  return (
    <div className="space-y-8 px-4 md:px-6">
      <div className="flex gap-4 items-end justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight gradient-title capitalize">
            {account.name}
          </h1>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium">
              {account.type.charAt(0) + account.type.slice(1).toLowerCase()} Account
            </span>
            {account.isDefault && (
              <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                Default Account
              </span>
            )}
          </div>
        </div>

        <div className="text-right pb-2">
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            ${parseFloat(account.balance).toFixed(2)}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {account._count.transactions} {account._count.transactions === 1 ? 'Transaction' : 'Transactions'}
          </p>
        </div>
      </div>

      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="#6366f1" />}
      >
        <div className="bg-gradient-to-br from-white to-indigo-50/30 dark:from-slate-800 dark:to-indigo-900/20 rounded-2xl p-6 border border-indigo-100/50 dark:border-indigo-800/30">
          <AccountChart transactions={transactions} />
        </div>
      </Suspense>

      {/* Transactions Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Transaction History</h2>
          <p className="text-muted-foreground">{transactions.length} transactions</p>
        </div>
        <Suspense
          fallback={<BarLoader className="mt-4" width={"100%"} color="#6366f1" />}
        >
          <div className="bg-gradient-to-br from-white to-purple-50/30 dark:from-slate-800 dark:to-purple-900/20 rounded-2xl border border-purple-100/50 dark:border-purple-800/30 overflow-hidden">
            <TransactionTable transactions={transactions} />
          </div>
        </Suspense>
      </div>
      
    </div>
  );
};

export default AccountPage;