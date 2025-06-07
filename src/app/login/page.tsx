/**
 * page.tsx - Pagina de login pentru QuickPick
 * 
 * Acest component afiseaza formularul de autentificare pentru utilizatorii QuickPick.
 * Functii principale:
 *  - Permite autentificarea cu email si parola folosind Supabase.
 *  - Afiseaza si gestioneaza starea pentru inputuri, erori, loading si vizibilitatea parolei.
 *  - Ofera functionalitate de resetare parola prin email.
 *  - Afiseaza logo-ul si link catre pagina de inregistrare (sign-up).
 * Elemente cheie:
 *  - Integrare cu Supabase pentru login si resetare parola.
 *  - UI modern cu Tailwind CSS, iconite pentru vizibilitate parola.
 *  - Gestionare stari pentru inputuri, erori, loading, resetare parola.
 *  - Formular accesibil si responsive.
 */

'use client'; // Activeaza functionalitatea client-side in Next.js

import { useState } from 'react'; // Hook pentru gestionarea starii locale
import Image from 'next/image'; // Component pentru afisarea imaginilor optimizate
import { useRouter } from 'next/navigation'; // Hook pentru navigare programatica
import { createClient } from '@/utils/supabase/client'; // Functie pentru initializarea clientului Supabase
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Iconite pentru afisarea/ascunderea parolei

export default function LoginPage() {
  const [email, setEmail] = useState(''); // Stare pentru email
  const [password, setPassword] = useState(''); // Stare pentru parola
  const [errorMsg, setErrorMsg] = useState(''); // Stare pentru mesaj de eroare
  const [loading, setLoading] = useState(false); // Stare pentru loading la login
  const [showPassword, setShowPassword] = useState(false); // Stare pentru afisarea/ascunderea parolei

  // Pentru resetare parola
  const [showForgot, setShowForgot] = useState(false); // Arata/ascunde formularul de resetare parola
  const [resetMsg, setResetMsg] = useState(''); // Mesaj informativ dupa resetare parola
  const [resetLoading, setResetLoading] = useState(false); // Loading pentru resetare parola
  const [resetEmail, setResetEmail] = useState(''); // Email pentru resetare parola

  const router = useRouter(); // Hook pentru navigare
  const supabase = createClient(); // Creeaza clientul Supabase

  // Functie pentru login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Previne submit-ul default al formularului
    setErrorMsg(''); // Reseteaza mesajul de eroare
    setLoading(true); // Porneste loading-ul
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    }); // Incearca login cu email si parola
    setLoading(false); // Opreste loading-ul
    if (error) {
      setErrorMsg(error.message); // Afiseaza mesajul de eroare daca exista
    } else {
      router.push('/?refresh=1'); // Redirectioneaza la home dupa login reusit
    }
  };

  // Functie pentru resetarea parolei
  const handleForgotPassword = async () => {
    setResetMsg(''); // Reseteaza mesajul de resetare
    setResetLoading(true); // Porneste loading-ul de resetare
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail); // Trimite email de resetare parola
    setResetLoading(false); // Opreste loading-ul
    if (error) {
      setResetMsg(error.message); // Afiseaza mesaj de eroare daca exista
    } else {
      setResetMsg('Ti-am trimis un email cu instructiuni de resetare a parolei!'); // Mesaj de succes
    }
  };

  // Functie pentru refresh la click pe logo (opțional)
  const handleLogoClick = () => {
    setEmail(''); // Reseteaza emailul
    setPassword(''); // Reseteaza parola
    setErrorMsg(''); // Reseteaza mesajul de eroare
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FFECEC] p-4">
      <form
        onSubmit={handleLogin} // La submit se apeleaza login
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

        {/* Titlu si subtitlu */}
        <h1 className="text-3xl font-bold text-[#353935] mb-1">QuickPick</h1>
        <p className="text-base text-[#353935] mb-6">Scrii ce vrei. Gasesti ce-ti trebuie.</p>

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
        <div className="relative w-full mb-2">
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

        {/* Link "Ti-ai uitat parola?" */}
        <div className="w-full flex justify-end mb-4">
          <button
            type="button"
            className="text-[#89AC46] hover:underline text-sm"
            onClick={() => setShowForgot(v => !v)} // Afiseaza/ascunde formularul de resetare parola
          >
            Ti-ai uitat parola?
          </button>
        </div>

        {/* Formular resetare parola */}
        {showForgot && (
          <div className="w-full mb-4 bg-[#F6F6F6] rounded px-4 py-3">
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Email pentru resetare"
                className="w-full px-3 py-2 border-2 border-[#89AC46] rounded-md text-[#353935] bg-white focus:outline-none focus:ring-2 focus:ring-[#D3E671] transition"
                value={resetEmail}
                onChange={e => setResetEmail(e.target.value)} // Actualizeaza emailul pentru resetare
                required
              />
              <button
                type="button"
                disabled={resetLoading}
                onClick={handleForgotPassword} // Trimite email de resetare parola
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
          {loading ? 'Se conecteaza...' : 'Login'}
        </button>

        {/* Link catre sign-up */}
        <p className="mt-2 text-sm text-[#353935]">
          Nu ai cont?{' '}
          <a href="/signup" className="text-[#89AC46] underline hover:text-[#353935]">
            Inregistreaza-te
          </a>
        </p>
      </form>
    </main>
  );
}
