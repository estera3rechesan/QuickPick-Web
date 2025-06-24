"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { FaUserCircle } from "react-icons/fa";
import Image from "next/image";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
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
          <Link href="/login" className="flex items-center gap-2">
            <FaUserCircle size={24} className="text-[#ccc]" />
            <span className="text-[#353935] text-sm">Conecteaza-te</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
