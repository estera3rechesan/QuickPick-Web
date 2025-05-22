'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function SearchInput() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Inițializează cu valoarea din query string, dacă există
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const queryFromUrl = searchParams.get('query') || '';
    setQuery(queryFromUrl);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length === 0) return;
    setLoading(true);

    // Fetch către API-ul tău cu credentials: "include"
    const res = await fetch("/api/searchPlaces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: query }),
      credentials: "include", // <-- esențial!
    });
    const data = await res.json();
    setResults(data.places || []);
    setLoading(false);

    // Dacă vrei să păstrezi redirectul, folosește router.push aici
    //router.push(`/results?query=${encodeURIComponent(query)}`);
    router.push(`/results?query=${encodeURIComponent(query)}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-lg mx-auto"
    >
      <input
        type="text"
        placeholder="Ce vrei să cauți? (ex: restaurant, muzeu, parc...)"
        className="flex-1 px-4 py-3 border-2 border-[#89AC46] rounded-lg bg-white text-[#353935] placeholder-[#353935] focus:outline-none focus:ring-2 focus:ring-[#D3E671] transition text-lg"
        value={query}
        onChange={e => setQuery(e.target.value)}
        autoFocus
        required
      />
      <button
        type="submit"
        className="px-6 py-3 bg-[#FF8787] hover:bg-[#ffb0b0] text-[#353935] font-bold rounded-lg transition text-lg"
      >
        Caută
      </button>
      
    </form>
  );
}
