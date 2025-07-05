import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowRight } from "lucide-react";
import responseai from "@/assets/images/response ai.svg";

import Image from "next/image";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="gradient-text ">Forge Perfect Prompts</span>
              <br />
              <span className="arabic-text  rtl inline-block mt-2">
                صانع البرومبت
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10">
              Craft powerful AI prompts with our intuitive platform, designed
              for creators, developers, and businesses looking to harness the
              full potential of AI.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <Link href="/SignUp">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/features">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Learn More
                </Button>
              </Link>
            </div>

            <div className="relative max-w-5xl mx-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-promptsmith-purple to-promptsmith-teal rounded-xl blur-lg opacity-30 animate-pulse-slow"></div>
              <div className="relative bg-white dark:bg-promptsmith-dark rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                <div className="p-6 md:p-8 bg-muted">
                  <div className="rounded-lg bg-card p-6 md:p-8 shadow-inner">
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <span className="w-12">
                          <Image
                            src={responseai}
                            alt="response ai"
                            className="mr-2"
                          />
                        </span>
                        <div className="ml-4 bg-muted p-4 rounded-lg rounded-tl-none">
                          <p className="text-sm md:text-base">
                            I&apos;m your AI assistant. How can I help you
                            today?
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start justify-end">
                        <div className="mr-4 bg-primary/10 p-4 rounded-lg rounded-tr-none max-w-lg">
                          <p className="text-sm md:text-base">
                            <span className="font-medium">Context:</span> I need
                            to write engaging product descriptions for my
                            e-commerce store.
                          </p>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-secondary flex-shrink-0 flex items-center justify-center">
                          <span className="text-white font-bold text-xs">
                            U
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <span className="w-12">
                          <Image
                            src={responseai}
                            alt="response ai"
                            className="mr-2"
                          />
                        </span>
                        <div className="ml-4 bg-muted p-4 rounded-lg rounded-tl-none">
                          <p className="text-sm md:text-base">
                            I&apos;xd be happy to help with your product
                            descriptions. To create the most compelling content,
                            could you tell me more about:
                            <br />
                            <br />
                            1. The type of products you sell
                            <br />
                            2. Your target audience
                            <br />
                            3. Your brand&apos;s unique selling proposition
                            <br />
                            4. Any specific tone or style you prefer
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-2 gradient-text decorative-border inline-block">
                Features
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mt-6">
                Our platform provides powerful tools to help you create, test,
                and optimize your AI prompts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="prompt-card hover:animate-float">
                <div className="h-12 w-12 rounded-full bg-promptsmith-purple/20 flex items-center justify-center mb-4">
                  <span className="text-promptsmith-purple text-xl font-bold">
                    1
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Prompt Builder</h3>
                <p className="text-muted-foreground">
                  Intuitive interface to craft and structure prompts with
                  built-in templates and best practices.
                </p>
              </div>

              <div className="prompt-card hover:animate-float">
                <div className="h-12 w-12 rounded-full bg-promptsmith-teal/20 flex items-center justify-center mb-4">
                  <span className="text-promptsmith-teal text-xl font-bold">
                    2
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Real-Time Testing
                </h3>
                <p className="text-muted-foreground">
                  Test your prompts instantly and see how AI responds, allowing
                  for rapid iteration and refinement.
                </p>
              </div>

              <div className="prompt-card hover:animate-float">
                <div className="h-12 w-12 rounded-full bg-promptsmith-gold/20 flex items-center justify-center mb-4">
                  <span className="text-promptsmith-gold text-xl font-bold">
                    3
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Prompt Library</h3>
                <p className="text-muted-foreground">
                  Save, organize, and share your best prompts. Build a personal
                  collection of effective prompts.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">
              Ready to craft powerful AI prompts?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Join PromptSmith today and unlock the full potential of AI through
              expertly crafted prompts.
            </p>
            <Link href="/SignUp">
              <Button size="lg">
                Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
