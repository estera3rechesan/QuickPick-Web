'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchInput() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length === 0) return;
    // Redirectează către pagina de rezultate cu query-ul ca parametru
    router.push(`/results?query=${encodeURIComponent(query)}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-lg mx-auto"
    >
      <input
        type="text"
        placeholder="Ce vrei să cauți? (ex: restaurant vegan, muzeu, parc...)"
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
