import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-promptsmith-purple flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="ml-2 text-2xl font-bold gradient-text">
                PromptSmith
              </span>
            </Link>
            <p className="mt-4 text-muted-foreground max-w-md">
              Craft powerful AI prompts with our intuitive platform. Perfect for
              creators, developers, and businesses seeking to harness the power
              of AI.
            </p>
            <p className="mt-4 text-muted-foreground">
              <span className="arabic-text rtl inline-block mr-2">
                صانع البرومبت
              </span>
              منصة لتجربة وصناعة برومبتات الذكاء الاصطناعي
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/features"
                  className="text-muted-foreground hover:text-promptsmith-purple transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/templates"
                  className="text-muted-foreground hover:text-promptsmith-purple transition-colors"
                >
                  Templates
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-muted-foreground hover:text-promptsmith-purple transition-colors"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-promptsmith-purple transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-promptsmith-purple transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-promptsmith-purple transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-promptsmith-purple transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border text-center text-muted-foreground text-sm">
          <p>© {currentYear} PromptSmith. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
