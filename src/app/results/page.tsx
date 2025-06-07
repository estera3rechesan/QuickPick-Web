/**
 * page.tsx - Pagina de afisare rezultate cautare pentru QuickPick
 * 
 * Acest component afiseaza rezultatele cautarii pe baza unui prompt inteligent introdus de utilizator.
 * Functii principale:
 *  - Preia parametrii de cautare din URL (searchParams).
 *  - Proceseaza promptul cu AI (parseUserPrompt) pentru a extrage categoria, specificatii si locatie.
 *  - Construieste query-ul pentru cautare pe Google Places combinand aceste informatii.
 *  - Cauta locatii relevante folosind Google Places API (fetchPlacesFromMaps).
 *  - Afiseaza rezultatele folosind componenta ResultsList.
 * Elemente cheie:
 *  - Procesare prompt inteligenta cu AI.
 *  - Cautare dinamica pe Google Places pe baza unui query compus.
 *  - UI modern si responsive pentru afisarea rezultatelor.
 */

import ResultsList from "@/components/ResultsList"; // Importa componenta pentru afisarea listei de rezultate
import { parseUserPrompt } from '@/utils/parseUserPrompt'; // Importa functia pentru procesarea promptului
import { fetchPlacesFromMaps } from '@/utils/fetchPlacesFromMaps'; // Importa functia pentru cautarea locatiilor pe Google Places

export default async function ResultsPage({ searchParams }: { searchParams: any }) {
  const params = await searchParams; // Preia parametrii de cautare din props
  const query = params.query || ""; // Extrage query-ul (promptul) din parametri

  // Proceseaza promptul cu AI pentru a extrage categoria, specificatii si locatie
  const { category, specifications, location } = await parseUserPrompt(query);

  // Construieste query-ul pentru cautare pe Google Places
  let searchQuery = category;
  if (specifications) searchQuery += ` ${specifications}`; // Adauga specificatii daca exista
  if (location) searchQuery += ` ${location}`; // Adauga locatie daca exista

  // Cauta locatii relevante folosind Google Places API
  const places = await fetchPlacesFromMaps({ query: searchQuery });

  // Returneaza UI-ul cu lista de rezultate
  return (
    <main className="pt-18 min-h-screen bg-[#FFECEC] p-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-[#353935] mb-4 text-center">
          Rezultate pentru: <span className="text-[#FF8787]">{query}</span>
        </h1>
        <ResultsList places={places || []} /> {/* Afiseaza lista de locatii gasite */}
      </div>
    </main>
  );
}