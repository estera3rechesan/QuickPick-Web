import ResultsList from "@/components/ResultsList";

interface ResultsPageProps {
  searchParams: Promise<{ query?: string }>;
}

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  const { query = "" } = await searchParams;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (!baseUrl) {
    throw new Error("Environment variable NEXT_PUBLIC_BASE_URL (or NEXT_PUBLIC_SITE_URL) is not defined");
  }

  const normalizedBase = baseUrl.replace(/\/$/, "");
  const apiUrl = new URL("/api/searchPlaces", normalizedBase).toString();

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: query }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`SearchPlaces API error: ${res.status} ${res.statusText}`);
  }

  const { places } = await res.json();  // așteptăm { places: [...] }

  return (
    <main className="pt-18 min-h-screen bg-[#FFECEC] p-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-[#353935] mb-4 text-center">
          Rezultate pentru: <span className="text-[#FF8787]">{query}</span>
        </h1>
        <ResultsList places={places ?? []} />
      </div>
    </main>
  );
}
