"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { FaUserCircle } from "react-icons/fa";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  return (
    <nav className="w-full flex items-center justify-between px-6 py-3 bg-white shadow">
      <Link href="/" className="text-2xl font-bold text-[#FF8787]">QuickPick</Link>
      <div>
        {user ? (
          <Link href="/account" className="flex items-center gap-2">
            <FaUserCircle size={28} className="text-[#89AC46]" />
            <span className="text-[#353935] text-sm">{user.email}</span>
          </Link>
        ) : (
          <Link href="/login" className="flex items-center gap-2">
            <FaUserCircle size={28} className="text-[#ccc]" />
            <span className="text-[#353935] text-sm">Conectează-te</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
