import ResultsList from "@/components/ResultsList";
import { parseUserPrompt } from '@/utils/parseUserPrompt';
import { fetchPlacesFromMaps } from '@/utils/fetchPlacesFromMaps';

// Pagina de rezultate care afiseaza locatiile gasite in urma cautarii
export default async function ResultsPage({ searchParams }: { searchParams: any }) {
  const params = await searchParams;
  const query = params.query || "";

  const { category, specifications, location } = await parseUserPrompt(query);
  let searchQuery = category;
  if (specifications) searchQuery += ` ${specifications}`;
  if (location) searchQuery += ` ${location}`;
  const places = await fetchPlacesFromMaps({ query: searchQuery });

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