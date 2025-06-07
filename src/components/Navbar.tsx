/**
 * Navbar.tsx - Bara de navigatie principala pentru QuickPick
 * 
 * Acest component afiseaza bara de navigatie fixa in partea de sus a aplicatiei.
 * Functii principale:
 *  - Afiseaza logo-ul QuickPick cu link catre homepage.
 *  - Afiseaza avatarul si emailul utilizatorului daca este autentificat.
 *  - Daca utilizatorul nu este logat, afiseaza butonul de login.
 * Elemente cheie:
 *  - Integrare cu Supabase pentru a detecta userul autentificat.
 *  - UI minimalist, responsive, cu shadow si pozitionare fixa.
 *  - Iconita user (FaUserCircle) si logo vizibil pe toate paginile.
 */

"use client"; // Activeaza functionalitatea client-side in Next.js

import Link from "next/link"; // Link pentru navigare intre pagini Next.js
import { useEffect, useState } from "react"; // Hook-uri pentru stare si efecte
import { createClient } from "@/utils/supabase/client"; // Functie pentru initializarea clientului Supabase
import { FaUserCircle } from "react-icons/fa"; // Iconita user
import Image from "next/image"; // Component pentru afisarea logo-ului

export default function Navbar() {
  const [user, setUser] = useState<any>(null); // Stare pentru userul autentificat

  useEffect(() => {
    const supabase = createClient(); // Creeaza clientul Supabase
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user)); // Ia userul curent si seteaza in state
  }, []);

  return (
    <nav className="w-full flex items-center justify-between px-6 py-1 bg-white shadow fixed top-0 left-0 z-50 h-12">
      {/* Logo cu link catre homepage */}
      <Link href="/" className="flex items-center">
        <Image
          src="/LogoQP_roz.png"
          alt="QuickPick Logo"
          width={32}
          height={32}
          className="rounded-full"
          priority
        />
      </Link>
      <div>
        {/* Daca userul este logat, afiseaza emailul si avatarul cu link catre cont */}
        {user ? (
          <Link href="/account" className="flex items-center gap-2">
            <FaUserCircle size={24} className="text-[#89AC46]" />
            <span className="text-[#353935] text-sm">{user.email}</span>
          </Link>
        ) : (
          // Daca nu este logat, afiseaza butonul de login
          <Link href="/login" className="flex items-center gap-2">
            <FaUserCircle size={24} className="text-[#ccc]" />
            <span className="text-[#353935] text-sm">Conecteaza-te</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
