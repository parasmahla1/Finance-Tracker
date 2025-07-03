import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "WealthFlow - Smart Finance Tracker",
  description: "Modern financial management platform for tracking expenses, budgets, and investments",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
          <link rel="icon" href="/logo-sm.png" sizes="any" />
        </head>
        <body className={`${jakarta.className} min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/30`}>
          <Header />
          <main className="min-h-screen pt-20">{children}</main>
          <Toaster richColors position="top-right" />

          <footer className="bg-gradient-to-r from-slate-100 to-indigo-100/50 dark:from-slate-800 dark:to-indigo-900/20 py-12 border-t border-border/50">
            <div className="container mx-auto px-4 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="text-muted-foreground">
                  <p className="font-medium">Built with ❤️ for better financial management</p>
                </div>
                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <span>© 2025 WealthFlow</span>
                  <span>•</span>
                  <span>Privacy</span>
                  <span>•</span>
                  <span>Terms</span>
                </div>
              </div>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
