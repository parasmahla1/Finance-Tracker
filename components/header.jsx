import React from "react";
import { Button } from "./ui/button";
import { PenBox, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { checkUser } from "@/lib/checkUser";
import Logo from "./logo";

const Header = async () => {
  await checkUser();

  return (
    <header className="fixed top-0 w-full bg-white/70 dark:bg-black/70 backdrop-blur-xl z-50 border-b border-border/50">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="transition-transform hover:scale-105">
          <Logo />
        </Link>

        {/* Navigation Links - Different for signed in/out users */}
        <div className="hidden md:flex items-center space-x-8">
          <SignedOut>
            <a href="#features" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              Features
            </a>
            <a
              href="#testimonials"
              className="text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              Testimonials
            </a>
          </SignedOut>
        </div>

     
        <div className="flex items-center space-x-3">
          <SignedIn>
            <Link
              href="/dashboard"
              className="text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors"
            >
              <Button variant="outline" className="shadow-sm hover:shadow-md transition-all">
                <LayoutDashboard size={18} />
                <span className="hidden md:inline">Dashboard</span>
              </Button>
            </Link>
            <a href="/transaction/create">
              <Button className="flex items-center gap-2 shadow-sm hover:shadow-md transition-all bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                <PenBox size={18} />
                <span className="hidden md:inline">Add Transaction</span>
              </Button>
            </a>
          </SignedIn>
          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant="outline" className="shadow-sm hover:shadow-md transition-all">Login</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10 ring-2 ring-primary/20 hover:ring-primary/40 transition-all",
                },
              }}
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Header;
