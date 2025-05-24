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

  // Pentru refresh după login
  useEffect(() => {
    if (searchParams.get("refresh") === "1") {
      window.history.replaceState({}, document.title, "/");
      window.location.reload();
    }
  }, [searchParams]);

  // Detectează query în URL (ex: când vii din istoric) și pornește căutarea automat
  useEffect(() => {
    const urlQuery = searchParams.get("query");
    if (urlQuery && urlQuery !== query) {
      setQuery(urlQuery);
      setLoading(true);
      router.push(`/results?query=${encodeURIComponent(urlQuery)}`);
    }
    // eslint-disable-next-line
  }, [searchParams]);

  // Pentru căutarea din search bar
  const handleSearch = () => {
    setLoading(true);
    router.push(`/results?query=${encodeURIComponent(query)}`);
  };

  // Pentru mood search
  const handleMoodPrompt = (prompt: string) => {
    setQuery(prompt);
    setLoading(true);
    router.push(`/results?query=${encodeURIComponent(prompt)}`);
  };

  return (
    <main className="pt-24 flex flex-col items-center justify-center min-h-screen bg-[#FFECEC] p-4">
      {/* Logo și titlu */}
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
        <p className="text-lg text-[#353935]">Scrii ce vrei. Găsești ce-ți trebuie.</p>
      </div>

      {/* Search Bar */}
      <SearchInput
        query={query}
        setQuery={setQuery}
        onSearch={handleSearch}
        loading={loading}
      />

      {/* Buton contextual cu spațiu generos */}
      <ContextualSuggestionButton />

      {/* Mood search sub search bar */}
      <div className="w-full flex justify-center">
        <MoodSearch onMoodSelect={handleMoodPrompt} />
      </div>
    </main>
  );
}
