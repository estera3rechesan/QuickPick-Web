/**
 * next.config.ts - Configurare Next.js pentru proiectul QuickPick
 * 
 * Acest fisier defineste configurarea custom pentru Next.js, in special pentru gestionarea imaginilor externe.
 * Functii principale:
 *  - Permite incarcarea imaginilor de la maps.googleapis.com (folosite pentru pozele locatiilor din Google Places).
 *  - Specifica pattern-ul de remote pentru imaginile acceptate (protocol, hostname, pathname).
 * Elemente cheie:
 *  - images.remotePatterns: lista de surse externe permise pentru imagini.
 *  - Export default cu tip NextConfig pentru compatibilitate si siguranta tipurilor.
 */

import type { NextConfig } from "next"; // Importa tipul pentru configurarea Next.js

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https", // Doar imagini servite prin HTTPS
        hostname: "maps.googleapis.com", // Doar de la maps.googleapis.com
        pathname: "/**", // Orice path de pe acest domeniu
      },
    ],
  },
};

export default nextConfig;
