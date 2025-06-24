import type { Metadata } from "next";
import "./globals.css";
import "@/styles/fonts.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "QuickPick",
  description: "Scrii ce vrei. Gasesti ce-ti trebuie.",
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
