import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { SessionProviderWrapper } from "@/components/SessionProviderWrapper";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "わくわくプラント | こどもAI発明家",
  description:
    "子どもたちのAIアイデアの種をまき、みんなで育てよう。アイデアを投稿して投票を集め、種から芽へ、木へ、花へ、実へと成長させよう！",
  keywords: ["こどもAI", "発明", "アイデア", "投票", "植物", "成長"],
  openGraph: {
    title: "わくわくプラント | こどもAI発明家",
    description: "アイデアの種をまき、みんなで育てよう",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${nunito.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-parchment">
        <SessionProviderWrapper>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster richColors position="bottom-right" />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
