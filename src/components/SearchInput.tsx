'use client';

interface SearchInputProps {
  query: string;
  setQuery: (q: string) => void;
  onSearch: () => void;
  loading: boolean;
}

export default function SearchInput({ query, setQuery, onSearch, loading }: SearchInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length === 0) return;
    onSearch();
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
          disabled={loading}
          className="px-6 py-3 bg-[#FF8787] hover:bg-[#ffb0b0] text-[#353935] font-bold rounded-lg transition text-lg"
        >
          {loading ? "Caută..." : "Caută"}
        </button>
      </form>
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
