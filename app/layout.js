import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "WealthFlow - Smart Finance Tracker",
  description: "A calm, focused workspace for understanding your money.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
          <link rel="icon" href="/logo-sm.png" sizes="any" />
        </head>
        <body className={`${jakarta.className} min-h-screen bg-background text-foreground antialiased`}>
          <ThemeProvider>
            <Header />
            <main className="min-h-screen pt-16">{children}</main>
            <Toaster richColors position="top-right" />

            <footer className="border-t border-border/70 bg-card/60">
              <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                <p>WealthFlow · A clearer view of your money.</p>
                <p>© {new Date().getFullYear()} WealthFlow</p>
              </div>
            </footer>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
