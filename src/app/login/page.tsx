'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Pentru resetare parolă
  const [showForgot, setShowForgot] = useState(false);
  const [resetMsg, setResetMsg] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setErrorMsg(error.message);
    } else {
      router.push('/');
    }
  };

  const handleForgotPassword = async () => {
    setResetMsg('');
    setResetLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail);
    setResetLoading(false);
    if (error) {
      setResetMsg(error.message);
    } else {
      setResetMsg('Ți-am trimis un email cu instrucțiuni de resetare a parolei!');
    }
  };

  // Funcție pentru refresh la click pe logo (opțional)
  const handleLogoClick = () => {
    setEmail('');
    setPassword('');
    setErrorMsg('');
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FFECEC] p-4">
      <form
        onSubmit={handleLogin}
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

        {/* Titlu și subtitlu */}
        <h1 className="text-3xl font-bold text-[#353935] mb-1">QuickPick</h1>
        <p className="text-base text-[#353935] mb-6">Explore & Choose</p>

        {/* Input Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 border-2 border-[#89AC46] rounded-md text-[#353935] bg-white focus:outline-none focus:ring-2 focus:ring-[#D3E671] transition"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        {/* Input Parolă cu ochișor */}
        <div className="relative w-full mb-2">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Parolă"
            className="w-full px-4 py-2 border-2 border-[#89AC46] rounded-md text-[#353935] bg-white focus:outline-none focus:ring-2 focus:ring-[#D3E671] transition pr-10"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[#353935] bg-transparent border-none cursor-pointer"
            tabIndex={-1}
            aria-label={showPassword ? "Ascunde parola" : "Arată parola"}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Link "Ți-ai uitat parola?" */}
        <div className="w-full flex justify-end mb-4">
          <button
            type="button"
            className="text-[#89AC46] hover:underline text-sm"
            onClick={() => setShowForgot(v => !v)}
          >
            Ți-ai uitat parola?
          </button>
        </div>

        {/* Formular resetare parolă */}
        {showForgot && (
          <div className="w-full mb-4 bg-[#F6F6F6] rounded px-4 py-3">
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Email pentru resetare"
                className="w-full px-3 py-2 border-2 border-[#89AC46] rounded-md text-[#353935] bg-white focus:outline-none focus:ring-2 focus:ring-[#D3E671] transition"
                value={resetEmail}
                onChange={e => setResetEmail(e.target.value)}
                required
              />
              <button
                type="button"
                disabled={resetLoading}
                onClick={handleForgotPassword}
                className="bg-[#FF8787] hover:bg-[#ffb0b0] text-white font-bold rounded-md transition px-4 py-2 text-sm"
              >
                {resetLoading ? "Se trimite..." : "Trimite link de resetare"}
              </button>
              {resetMsg && (
                <div className="text-center text-[#353935] text-sm mt-1">{resetMsg}</div>
              )}
            </div>
          </div>
        )}

        {/* Mesaj eroare */}
        {errorMsg && (
          <div className="w-full mb-4 bg-[#D3E671] text-[#353935] text-sm rounded px-3 py-2 text-center">
            {errorMsg}
          </div>
        )}

        {/* Buton Login */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-[#FF8787] hover:bg-[#ffb0b0] text-[#353935] font-bold rounded-md transition text-lg mb-2"
        >
          {loading ? 'Se conectează...' : 'Login'}
        </button>

        {/* Link către sign-up (opțional) */}
        <p className="mt-2 text-sm text-[#353935]">
          Nu ai cont?{' '}
          <a href="/signup" className="text-[#89AC46] underline hover:text-[#353935]">
            Înregistrează-te
          </a>
        </p>
      </form>
    </main>
  );
}
