/**
 * page.tsx - Pagina de inregistrare (signup) pentru QuickPick
 * 
 * Acest component afiseaza formularul pentru crearea unui cont nou in platforma QuickPick.
 * Functii principale:
 *  - Permite crearea unui cont nou cu email si parola folosind Supabase.
 *  - Afiseaza si gestioneaza starea pentru inputuri, erori, loading, succes.
 *  - Ofera optiune de afisare/ascundere parola cu iconita.
 *  - Afiseaza logo-ul si link catre pagina de login.
 * Elemente cheie:
 *  - Integrare cu Supabase pentru signup.
 *  - UI modern cu Tailwind CSS, iconite pentru vizibilitate parola.
 *  - Gestionare stari pentru inputuri, erori, succes, loading.
 *  - Redirect automat catre login dupa creare cont cu succes.
 */

'use client'; // Activeaza functionalitatea client-side in Next.js

import { useState } from 'react'; // Hook pentru gestionarea starii locale
import Image from 'next/image'; // Component pentru afisarea imaginilor optimizate
import { useRouter } from 'next/navigation'; // Hook pentru navigare programatica
import { createClient } from '@/utils/supabase/client'; // Functie pentru initializarea clientului Supabase
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Iconite pentru afisarea/ascunderea parolei

export default function SignupPage() {
  const [email, setEmail] = useState(''); // Stare pentru email
  const [password, setPassword] = useState(''); // Stare pentru parola
  const [showPassword, setShowPassword] = useState(false); // Stare pentru afisarea/ascunderea parolei
  const [errorMsg, setErrorMsg] = useState(''); // Stare pentru mesaj de eroare
  const [loading, setLoading] = useState(false); // Stare pentru loading la signup
  const [successMsg, setSuccessMsg] = useState(''); // Stare pentru mesaj de succes
  const router = useRouter(); // Hook pentru navigare
  const supabase = createClient(); // Creeaza clientul Supabase

  // Functie pentru signup (creare cont nou)
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault(); // Previne submit-ul default al formularului
    setErrorMsg(''); // Reseteaza mesajul de eroare
    setSuccessMsg(''); // Reseteaza mesajul de succes
    setLoading(true); // Porneste loading-ul
    const { error } = await supabase.auth.signUp({
      email,
      password,
    }); // Incearca inregistrarea cu email si parola
    setLoading(false); // Opreste loading-ul
    if (error) {
      setErrorMsg(error.message); // Afiseaza mesajul de eroare daca exista
    } else {
      setSuccessMsg('Cont creat! Verifica emailul pentru confirmare.'); // Mesaj de succes
      setTimeout(() => router.push('/login'), 2000); // Dupa 2 secunde redirect la login
    }
  };

  // Functie pentru refresh la click pe logo (opțional)
  const handleLogoClick = () => {
    setEmail(''); // Reseteaza emailul
    setPassword(''); // Reseteaza parola
    setErrorMsg(''); // Reseteaza mesajul de eroare
    setSuccessMsg(''); // Reseteaza mesajul de succes
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FFECEC] p-4">
      <form
        onSubmit={handleSignup} // La submit se apeleaza signup
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
        <p className="text-base text-[#353935] mb-6">Creeaza un cont nou</p>

        {/* Input Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 border-2 border-[#89AC46] rounded-md text-[#353935] bg-white focus:outline-none focus:ring-2 focus:ring-[#D3E671] transition"
          value={email}
          onChange={e => setEmail(e.target.value)} // Actualizeaza emailul la schimbare
          required
        />

        {/* Input Parola cu ochisor */}
        <div className="relative w-full mb-4">
          <input
            type={showPassword ? "text" : "password"} // Afiseaza sau ascunde parola
            placeholder="Parola"
            className="w-full px-4 py-2 border-2 border-[#89AC46] rounded-md text-[#353935] bg-white focus:outline-none focus:ring-2 focus:ring-[#D3E671] transition pr-10"
            value={password}
            onChange={e => setPassword(e.target.value)} // Actualizeaza parola la schimbare
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)} // Toggle vizibilitate parola
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[#353935] bg-transparent border-none cursor-pointer"
            tabIndex={-1}
            aria-label={showPassword ? "Ascunde parola" : "Arata parola"}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Afisare mesaj de eroare daca exista */}
        {errorMsg && (
          <div className="w-full mb-4 bg-[#D3E671] text-[#353935] text-sm rounded px-3 py-2 text-center">
            {errorMsg}
          </div>
        )}
        {/* Afisare mesaj de succes daca exista */}
        {successMsg && (
          <div className="w-full mb-4 bg-[#89AC46] text-white text-sm rounded px-3 py-2 text-center">
            {successMsg}
          </div>
        )}

        {/* Buton Signup */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-[#FF8787] hover:bg-[#ffb0b0] text-[#353935] font-bold rounded-md transition text-lg mb-2"
        >
          {loading ? 'Se creeaza...' : 'Creeaza cont'}
        </button>

        {/* Link catre login */}
        <p className="mt-2 text-sm text-[#353935]">
          Ai deja cont?{' '}
          <a href="/login" className="text-[#89AC46] underline hover:text-[#353935]">
            Autentifica-te
          </a>
        </p>
      </form>
    </main>
  );
}
