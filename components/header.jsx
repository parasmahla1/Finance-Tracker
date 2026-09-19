import { Button } from "./ui/button";
import { LayoutDashboard, PenBox } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Logo from "./logo";
import { ThemeToggle } from "./theme-toggle";

const Header = async () => {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Logo />
        </Link>

        {/* Navigation Links - Different for signed in/out users */}
        <div className="hidden items-center gap-7 md:flex">
          <SignedOut>
            <a href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Features
            </a>
            <a
              href="#testimonials"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Testimonials
            </a>
          </SignedOut>
        </div>

     
        <div className="flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />
          <SignedIn>
            <Button variant="outline" asChild className="hidden sm:inline-flex">
              <Link href="/dashboard">
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
            </Button>
            <Button asChild>
              <Link href="/transaction/create">
                <PenBox size={18} />
                <span className="hidden sm:inline">Add transaction</span>
                <span className="sm:hidden">Add</span>
              </Link>
            </Button>
          </SignedIn>
          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant="outline">Sign in</Button>
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
