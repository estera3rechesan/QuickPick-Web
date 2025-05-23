import ResultsList from "@/components/ResultsList";
import { parseUserPrompt } from '@/utils/parseUserPrompt'; // asigură-te că calea e corectă
import { fetchPlacesFromMaps } from '@/utils/fetchPlacesFromMaps';

export default async function ResultsPage({ searchParams }: { searchParams: any }) {
  const params = await searchParams;
  const query = params.query || "";

  // 1. Procesează promptul cu AI
 const { category, specifications, location } = await parseUserPrompt(query);

  // 2. Construiește query-ul pentru Google Places
  let searchQuery = category;
  if (specifications) searchQuery += ` ${specifications}`;
  if (location) searchQuery += ` ${location}`;

  // 3. Caută pe Google Places
  const places = await fetchPlacesFromMaps({ query: searchQuery });

  // 4. Afișează rezultatele
  return (
  <main className="pt-18 min-h-screen bg-[#FFECEC] p-4">
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-[#353935] mb-4 text-center">
        Rezultate pentru: <span className="text-[#FF8787]">{query}</span>
      </h1>
      <ResultsList places={places || []} />
    </div>
  </main>
);

}

