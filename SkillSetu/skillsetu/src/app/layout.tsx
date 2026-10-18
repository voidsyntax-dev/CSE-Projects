import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "SkillSetu | Master Engineering Careers",
    template: "%s | SkillSetu"
  },
  description: "Accelerate your engineering career with personalized mastery paths, AI mentorship, and real-world internship mapping.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://skillsetu.com",
    siteName: "SkillSetu",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "SkillSetu" }]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen flex flex-col antialiased dark:from-black dark:to-zinc-950 dark:text-zinc-100`}
      >
        <Navbar />
        <main className="flex-grow min-h-screen">
          {children}
        </main>
        <footer className="text-center text-sm text-gray-500 py-8 border-t border-black/[.08] dark:border-white/[.145] dark:text-zinc-500">
          <p>© 2026 SkillSetu</p>
          <p>Built for engineering students.</p>
        </footer>
      </body>
    </html>
  );
}
