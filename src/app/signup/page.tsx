'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg('Cont creat! Verifică emailul pentru confirmare.');
      // Poți redirecționa automat după câteva secunde, dacă vrei:
      setTimeout(() => router.push('/login'), 2000);
    }
  };

  // Opțional: refresh la click pe logo
  const handleLogoClick = () => {
    setEmail('');
    setPassword('');
    setErrorMsg('');
    setSuccessMsg('');
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FFECEC] p-4">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-sm bg-white/70 rounded-xl shadow-md px-8 pt-8 pb-6 flex flex-col items-center"
      >
        {/* Logo */}
        <button type="button" onClick={handleLogoClick} className="mb-4">
          <Image
            src="/LogoQP_roz.png"
            alt="QuickPick Logo"
            width={80}
            height={80}
            className="rounded-full"
            priority
          />
        </button>

        <h1 className="text-3xl font-bold text-[#353935] mb-1">QuickPick</h1>
        <p className="text-base text-[#353935] mb-6">Creează un cont nou</p>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 border-2 border-[#89AC46] rounded-md text-[#353935] bg-white focus:outline-none focus:ring-2 focus:ring-[#D3E671] transition"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Parolă"
          className="w-full mb-4 px-4 py-2 border-2 border-[#89AC46] rounded-md text-[#353935] bg-white focus:outline-none focus:ring-2 focus:ring-[#D3E671] transition"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        {errorMsg && (
          <div className="w-full mb-4 bg-[#D3E671] text-[#353935] text-sm rounded px-3 py-2 text-center">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="w-full mb-4 bg-[#89AC46] text-white text-sm rounded px-3 py-2 text-center">
            {successMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-[#FF8787] hover:bg-[#ffb0b0] text-[#353935] font-bold rounded-md transition text-lg mb-2"
        >
          {loading ? 'Se creează...' : 'Creează cont'}
        </button>

        <p className="mt-2 text-sm text-[#353935]">
          Ai deja cont?{' '}
          <a href="/login" className="text-[#89AC46] underline hover:text-[#353935]">
            Autentifică-te
          </a>
        </p>
      </form>
    </main>
  );
}
