"use client";

import Image from 'next/image';
import SearchInput from '@/components/SearchInput';
import MoodSearch from '@/components/MoodSearch';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ContextualSuggestionButton from '@/components/ContextualSuggestionButton';

export default function Home() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  //Refresh automat dupa login
  useEffect(() => {
    if (searchParams.get("refresh") === "1") {
      window.history.replaceState({}, document.title, "/");
      window.location.reload();
    }
  }, [searchParams]);

  //Detectarea query-ului si pornirea cautarii automat
  useEffect(() => {
    const urlQuery = searchParams.get("query");
    if (urlQuery && urlQuery !== query) {
      setQuery(urlQuery);
      setLoading(true);
      router.push(`/results?query=${encodeURIComponent(urlQuery)}`);
    }
  }, [searchParams]);

  // Functie pentru cautareAa din search bar
  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/searchPlaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query }),
      });
      const data = await response.json();
      router.push(`/results?query=${encodeURIComponent(query)}`);
    } catch (error) {
      console.error("Eroare la cautare:", error);
    } finally {
      setLoading(false);
    }
  };

  // Functie pentru mood search
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
