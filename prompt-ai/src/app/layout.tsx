import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "./providers";
import "./globals.css";
import "./style.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PromptSmith - AI Prompt Generator",
  description:
    "PromptSmith is an AI prompt generator that helps you create AI prompts for your projects.",
  icons: {
    icon: "/response ai.svg",
  },
  keywords: [
    "PromptSmith",
    "AI prompts",
    "prompt engineering",
    "community prompts",
    "AI tools",
    "prompt sharing",
    "artificial intelligence",
    "prompt library",
    "AI community",
    "promptsmith",
    "chatgpt prompts",
    "ai assistance",
    "prompt templates",
  ],
  authors: [{ name: "PromptSmith Team" }],
  creator: "PromptSmith",
  publisher: "PromptSmith",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://promptsmith.com"),
  alternates: {
    canonical: "/community",
  },
  openGraph: {
    title: "PromptSmith - AI Prompt Generator",
    description:
      "Join the PromptSmith Community to discover, share, and like AI prompts from creators worldwide. Explore public prompts and get inspired by our collaborative platform.",
    url: "https://promptsmith.com/community",
    siteName: "PromptSmith",
    images: [
      {
        url: "/group-meta.png",
        width: 1200,
        height: 630,
        alt: "PromptSmith Community - AI Prompts Sharing Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PromptSmith - AI Prompt Generator",
    description:
      "Join the PromptSmith Community to discover, share, and like AI prompts from creators worldwide.",
    images: ["/twitter-community.jpg"],
    creator: "@promptsmith",
    site: "@promptsmith",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  category: "technology",
  classification: "AI Tools & Prompts",
  other: {
    "theme-color": "#8B5CF6",
    "color-scheme": "dark",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "PromptSmith Community",
    "application-name": "PromptSmith Community",
    "msapplication-TileColor": "#8B5CF6",
    "msapplication-config": "/browserconfig.xml",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script src="https://js.puter.com/v2/" strategy="beforeInteractive" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
