"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import LocationCard from "@/components/LocationCard";

interface Favorite {
  id: number;
  place_id: string;
  name: string;
  address: string;
  photo_reference?: string;
  google_maps_url?: string;
  website?: string;
  created_at: string;
}

interface SearchHistory {
  id: number;
  query: string;
  created_at: string;
}

export default function AccountPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [history, setHistory] = useState<SearchHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setErrorMsg(null);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setErrorMsg("Trebuie să fii autentificat pentru a vedea favoritele și istoricul.");
        setLoading(false);
        return;
      }
      // Favorite
      const { data: favs, error: favErr } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (favErr) setErrorMsg(favErr.message);
      else setFavorites(favs || []);
      // Istoric
      const { data: hist, error: histErr } = await supabase
        .from("search_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);
      if (histErr) setErrorMsg(histErr.message);
      else setHistory(hist || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  async function handleDeleteFavorite(id: number) {
    const { error } = await supabase.from("favorites").delete().eq("id", id);
    if (!error) setFavorites(favorites.filter(fav => fav.id !== id));
    else alert("Eroare la ștergere: " + error.message);
  }

  async function handleDeleteHistory(id: number) {
    const { error } = await supabase.from("search_history").delete().eq("id", id);
    if (!error) setHistory(history.filter(h => h.id !== id));
    else alert("Eroare la ștergere: " + error.message);
  }

return (
  <main className="max-w-2xl mx-auto p-4">
    <h1 className="text-2xl font-bold text-[#353935] mb-4">Contul meu</h1>
    <h2 className="text-lg font-semibold mb-2">Locații favorite</h2>
    {loading && <p>Se încarcă...</p>}
    {errorMsg && <p className="text-red-600">{errorMsg}</p>}
    {!loading && !favorites.length && (
      <p className="text-[#353935]">Nu ai locații favorite salvate.</p>
    )}
    <div className="flex flex-col gap-6">
      {favorites.map(fav => (
        <div key={fav.id} className="relative">
          <LocationCard
            place_id={fav.place_id}
            name={fav.name}
            address={fav.address}
            photo_reference={fav.photo_reference}
            googleMapsUrl={fav.google_maps_url || ""}
            website={fav.website}
          />
          <button
            onClick={() => handleDeleteFavorite(fav.id)}
            className="absolute top-2 right-2 bg-[#FF8787] hover:bg-[#ffb0b0] text-white px-3 py-1 rounded text-xs"
          >
            Șterge
          </button>
        </div>
      ))}
    </div>
    <h2 className="text-lg font-semibold mt-8 mb-2">Istoric prompturi AI</h2>
    {!loading && !history.length && (
      <p className="text-[#353935]">Nu ai prompturi recente.</p>
    )}
    {/* TAGURI ISTORIC */}
    <ul className="flex flex-wrap gap-2">
      {history.map(h => (
        <li key={h.id} className="flex items-center bg-[#F6F6F6] rounded-full px-3 py-1 text-sm shadow">
          <button
            onClick={() => {
              // Navighează către pagina principală cu query precompletat
              window.location.href = `/?query=${encodeURIComponent(h.query)}`;
            }}
            className="mr-2 text-[#353935] hover:underline bg-transparent border-none cursor-pointer"
            title="Reia această căutare"
          >
            {h.query}
          </button>
          <button
            onClick={() => handleDeleteHistory(h.id)}
            className="ml-1 text-[#FF8787] text-lg bg-transparent border-none cursor-pointer"
            title="Șterge"
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  </main>
);

}
