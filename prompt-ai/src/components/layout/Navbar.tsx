"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="relative z-50 bg-white/90 dark:bg-promptsmith-dark/90 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-promptsmith-purple flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="ml-2 text-xl font-bold gradient-text">
              PromptSmith
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/features"
            className="text-foreground hover:text-promptsmith-purple transition-colors"
          >
            Features
          </Link>
          <Link
            href="/templates"
            className="text-foreground hover:text-promptsmith-purple transition-colors"
          >
            Templates
          </Link>
          <Link
            href="/pricing"
            className="text-foreground hover:text-promptsmith-purple transition-colors"
          >
            Pricing
          </Link>
          <div className="flex items-center space-x-2">
            <Link href="/SignIn">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/SignUp">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-border shadow-lg">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link
              href="/features"
              className="text-foreground hover:text-promptsmith-purple transition-colors py-2"
              onClick={toggleMenu}
            >
              Features
            </Link>
            <Link
              href="/templates"
              className="text-foreground hover:text-promptsmith-purple transition-colors py-2"
              onClick={toggleMenu}
            >
              Templates
            </Link>
            <Link
              href="/pricing"
              className="text-foreground hover:text-promptsmith-purple transition-colors py-2"
              onClick={toggleMenu}
            >
              Pricing
            </Link>
            <div className="flex flex-col space-y-2 pt-2 border-t border-border">
              <Link href="/SignIn" onClick={toggleMenu}>
                <Button variant="outline" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link href="/SignUp" onClick={toggleMenu}>
                <Button className="w-full">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
