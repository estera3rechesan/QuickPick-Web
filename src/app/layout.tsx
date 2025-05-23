import type { Metadata } from "next";
import "./globals.css";
import "@/styles/fonts.css"; // <-- importă fonturile custom (creează acest fișier)
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "QuickPick",
  description: "Scrii ce vrei. Găsești ce-ți trebuie.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body className="font-body text-text bg-background antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
