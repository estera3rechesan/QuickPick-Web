'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

interface SearchInputProps {
  query: string;
  setQuery: (q: string) => void;
}

export default function SearchInput({ query, setQuery }: SearchInputProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Dacă vrei să sincronizezi promptul cu URL-ul (opțional)
  useEffect(() => {
    const queryFromUrl = searchParams.get('query') || '';
    if (queryFromUrl && queryFromUrl !== query) {
      setQuery(queryFromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    // Redirect către pagina de rezultate
    router.push(`/results?query=${encodeURIComponent(query)}`);
  };

  return (
    <>
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
      {/* Loader animat sub search */}
      {loading && (
        <div className="flex justify-center w-full mt-4">
          <svg
            className="animate-spin h-8 w-8 text-[#89AC46]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        </div>
      )}
    </>
  );
}
