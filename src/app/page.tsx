/**
 * page.tsx - Pagina principala (home) pentru QuickPick
 * 
 * Acest component afiseaza landing page-ul aplicatiei, unde utilizatorul poate incepe rapid cautarea de locuri si activitati.
 * Functii principale:
 *  - Afiseaza logo-ul, titlul si sloganul aplicatiei.
 *  - Ofera doua moduri principale de cautare: search bar clasic si mood search (cautare pe baza starii de spirit).
 *  - Permite cautari contextuale rapide prin ContextualSuggestionButton.
 *  - Detecteaza automat query-ul din URL (ex: cand utilizatorul vine din istoric) si redirectioneaza catre pagina de rezultate.
 *  - Gestioneaza refresh-ul automat dupa login pentru a reincarca datele utilizatorului.
 * Elemente cheie:
 *  - Integrare cu router-ul Next.js pentru navigare programatica.
 *  - Folosire useState si useEffect pentru gestionarea starii si efectelor secundare.
 *  - Componente custom pentru input, mood search si sugestii contextuale.
 *  - UI modern, centrat, cu branding vizibil si interactiune rapida.
 */

"use client"; // Activeaza functionalitatea client-side in Next.js

import Image from 'next/image'; // Component pentru afisarea imaginilor optimizate
import SearchInput from '@/components/SearchInput'; // Component custom pentru search bar
import MoodSearch from '@/components/MoodSearch'; // Component custom pentru mood search
import { useState, useEffect } from 'react'; // Hook-uri pentru stare si efecte
import { useRouter, useSearchParams } from 'next/navigation'; // Hook-uri pentru navigare si parametri URL
import ContextualSuggestionButton from '@/components/ContextualSuggestionButton'; // Component pentru sugestii contextuale

export default function Home() {
  const [query, setQuery] = useState(''); // Stare pentru textul cautat
  const [loading, setLoading] = useState(false); // Stare pentru loading la cautare
  const router = useRouter(); // Hook pentru navigare programatica
  const searchParams = useSearchParams(); // Hook pentru citirea parametrilor din URL

  // Efect pentru refresh dupa login (cand URL-ul contine ?refresh=1)
  useEffect(() => {
    if (searchParams.get("refresh") === "1") {
      window.history.replaceState({}, document.title, "/"); // Curata URL-ul
      window.location.reload(); // Reincarca pagina complet
    }
  }, [searchParams]);

  // Efect pentru detectarea query-ului in URL si pornirea cautarii automat
  useEffect(() => {
    const urlQuery = searchParams.get("query");
    if (urlQuery && urlQuery !== query) {
      setQuery(urlQuery); // Seteaza query-ul din URL in state
      setLoading(true); // Porneste loading-ul
      router.push(`/results?query=${encodeURIComponent(urlQuery)}`); // Navigheaza la pagina de rezultate
    }
    // eslint-disable-next-line
  }, [searchParams]);

  // Functie pentru cautarea din search bar (fetch catre API-ul tau)
  /*const handleSearch = () => {
    setLoading(true); // Porneste loading-ul
    router.push(`/results?query=${encodeURIComponent(query)}`); // Navigheaza la pagina de rezultate cu query
  };*/
  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/searchPlaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query }),
      });
      const data = await response.json();
      // Poti folosi data.places aici daca vrei sa afisezi direct rezultatele in Home
      // Dar in fluxul tau actual, redirectionezi catre pagina de rezultate
      router.push(`/results?query=${encodeURIComponent(query)}`);
    } catch (error) {
      // Poti afisa o eroare in UI daca vrei
      console.error("Eroare la cautare:", error);
    } finally {
      setLoading(false);
    }
  };

  // Functie pentru mood search (cautare pe baza starii de spirit)
  const handleMoodPrompt = async (prompt: string) => {
    setQuery(prompt);
    setLoading(true);
    try {
      const response = await fetch('/api/searchPlaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      router.push(`/results?query=${encodeURIComponent(prompt)}`);
    } catch (error) {
      console.error("Eroare la cautare mood:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-24 flex flex-col items-center justify-center min-h-screen bg-[#FFECEC] p-4">
      {/* Logo si titlu */}
      <div className="flex flex-col items-center mb-8">
        <Image
          src="/LogoQP_roz.png"
          alt="QuickPick Logo"
          width={100}
          height={100}
          className="rounded-full mb-2"
          priority
        />
        <h1 className="text-4xl font-bold text-[#353935] mb-1">QuickPick</h1>
        <p className="text-lg text-[#353935]">Scrii ce vrei. Gasesti ce-ti trebuie.</p>
      </div>

      {/* Search Bar principal */}
      <SearchInput
        query={query}
        setQuery={setQuery}
        onSearch={handleSearch}
        loading={loading}
      />

      {/* Buton pentru sugestii contextuale */}
      <ContextualSuggestionButton />

      {/* Mood search sub search bar */}
      <div className="w-full flex justify-center">
        <MoodSearch onMoodSelect={handleMoodPrompt} />
      </div>
    </main>
  );
}
