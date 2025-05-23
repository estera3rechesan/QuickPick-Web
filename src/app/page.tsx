"use client";
import Image from 'next/image';
import SearchInput from '@/components/SearchInput';
import MoodSearch from '@/components/MoodSearch';
import { useState } from 'react';
import { useRouter } from 'next/navigation';


export default function Home() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleMoodPrompt = (prompt: string) => {
    setQuery(prompt);
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
      <SearchInput query={query} setQuery={setQuery} />

      {/* Mood search sub search bar */}
      <div className="mt-3">
        <MoodSearch onMoodSelect={handleMoodPrompt} />
      </div>
    </main>
  );
}

