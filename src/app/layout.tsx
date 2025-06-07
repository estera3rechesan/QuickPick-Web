/**
 * layout.tsx - Layout-ul principal pentru aplicatia QuickPick
 * 
 * Acest fisier defineste structura de baza (root layout) pentru toate paginile aplicatiei.
 * Functii principale:
 *  - Seteaza metadata implicita pentru titlu si descriere (folosita pentru SEO).
 *  - Importeaza stilurile globale si fonturile custom.
 *  - Include componenta Navbar pe toate paginile.
 *  - Aplica clase globale pentru font, culoare text si fundal.
 * Elemente cheie:
 *  - Folosire Metadata din Next.js pentru SEO.
 *  - Import global CSS si fonturi custom.
 *  - Structura HTML cu limba romana.
 *  - Toate paginile (children) sunt randate sub Navbar.
 */

import type { Metadata } from "next"; // Tip pentru metadata paginii Next.js
import "./globals.css"; // Importa stilurile globale
import "@/styles/fonts.css"; // Importa fonturile custom definite in fonts.css
import Navbar from "@/components/Navbar"; // Importa componenta Navbar

export const metadata: Metadata = {
  title: "QuickPick", // Titlul paginii (SEO)
  description: "Scrii ce vrei. Gasesti ce-ti trebuie.", // Descrierea paginii (SEO)
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode; // Tip pentru continutul paginii (toate paginile copil)
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
