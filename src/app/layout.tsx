import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GudWin BI",
  description: "GudWin BI — AI-операционная система для малого и среднего бизнеса"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
