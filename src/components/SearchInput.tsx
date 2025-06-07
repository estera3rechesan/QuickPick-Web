/**
 * SearchInput.tsx - Component pentru bara de cautare principala in QuickPick
 * 
 * Acest component afiseaza un formular de cautare cu input text si buton, folosit pentru a introduce prompturi sau cautari libere.
 * Functii principale:
 *  - Permite utilizatorului sa introduca un text de cautare (prompt).
 *  - La submit, apeleaza functia onSearch daca inputul nu este gol.
 *  - Afiseaza un loader animat cand loading este true.
 * Elemente cheie:
 *  - Input text controlat (query, setQuery).
 *  - Buton de submit cu stare loading si stilizare moderna.
 *  - Loader SVG animat afisat sub formular cand loading este activ.
 */

'use client'; // Activeaza functionalitatea client-side in Next.js

// Tipul props pentru componenta SearchInput
interface SearchInputProps {
  query: string; // Textul cautat
  setQuery: (q: string) => void; // Functie pentru actualizarea query-ului
  onSearch: () => void; // Functie apelata la submit
  loading: boolean; // Stare loading pentru buton si loader
}

export default function SearchInput({ query, setQuery, onSearch, loading }: SearchInputProps) {
  // Functie pentru submit formular
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Previne comportamentul default de submit
    if (query.trim().length === 0) return; // Nu cauta daca inputul e gol
    onSearch(); // Apeleaza functia de cautare
  };

  return (
    <>
      <form
        onSubmit={handleSubmit} // La submit se apeleaza handleSubmit
        className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-lg mx-auto"
      >
        <input
          type="text"
          placeholder="Ce vrei sa cauti? (ex: restaurant, muzeu, parc...)"
          className="flex-1 px-4 py-3 border-2 border-[#89AC46] rounded-lg bg-white text-[#353935] placeholder-[#353935] focus:outline-none focus:ring-2 focus:ring-[#D3E671] transition text-lg"
          value={query}
          onChange={e => setQuery(e.target.value)} // Actualizeaza query-ul la schimbare
          autoFocus
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-[#FF8787] hover:bg-[#ffb0b0] text-[#353935] font-bold rounded-lg transition text-lg"
        >
          {loading ? "Cauta..." : "Cauta"}
        </button>
      </form>
      {/* Loader animat cand loading este activ */}
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
