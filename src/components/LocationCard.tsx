/**
 * LocationCard.tsx - Card vizual pentru afisarea unei locatii in QuickPick
 * 
 * Acest component afiseaza detalii relevante despre o locatie (ex: nume, adresa, rating, pret, linkuri, poza) si permite salvarea la favorite.
 * Functii principale:
 *  - Afiseaza imaginea locatiei (sau un placeholder daca nu exista poza).
 *  - Afiseaza numele, adresa, ratingul, pretul, linkuri catre website si Google Maps.
 *  - Permite salvarea locatiei la favorite cu feedback vizual (inima plina/goala).
 *  - Genereaza si afiseaza sumar AI al recenziilor Google la cerere ("Recenzii pe scurt").
 * Elemente cheie:
 *  - Integrare cu API-ul Google Places pentru poza locatiei.
 *  - Lazy loading pentru sumarul recenziilor (fetch doar la click).
 *  - Gestionare stare pentru loading, erori, favorite, review summary.
 *  - UI modern, responsive, cu feedback vizual pentru interactiuni.
 */

"use client"; // Activeaza functionalitatea client-side in Next.js

import Image from "next/image"; // Component pentru afisarea imaginilor optimizate
import { useState } from "react"; // Hook pentru gestionarea starii locale
import { FaHeart, FaRegHeart } from "react-icons/fa"; // Iconite pentru favorite (inima plina/goala)

// Tipurile de props pentru cardul locatiei
export interface LocationCardProps {
  place_id: string; // ID-ul locatiei din Google Places
  name: string; // Numele locatiei
  address: string; // Adresa locatiei
  rating?: number; // Ratingul locatiei (optional)
  price_level?: number; // Nivelul de pret (optional)
  types?: string[]; // Tipuri de locatie (optional)
  user_ratings_total?: number; // Numar total de recenzii (optional)
  photo_reference?: string; // Referinta pentru poza locatiei (optional)
  googleMapsUrl: string; // Link catre Google Maps
  website?: string; // Website oficial (optional)
  showFavorite?: boolean; // Afiseaza sau nu butonul de favorite (default: true)
}

export default function LocationCard(props: LocationCardProps) {
  const {
    place_id,
    name,
    address,
    rating,
    price_level,
    user_ratings_total,
    photo_reference,
    googleMapsUrl,
    website,
    showFavorite = true, // Implicit afiseaza butonul de favorite
  } = props;

  // Genereaza URL-ul pentru poza locatiei sau fallback la placeholder
  const photoUrl = photo_reference
    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}`
    : "/placeholder.png";

  // Verifica daca un link este valid (incepe cu http/https)
  const isValidUrl = (url?: string) =>
    url && (url.startsWith("http://") || url.startsWith("https://"));

  // Stare pentru favorite si erori favorite
  const [saved, setSaved] = useState(false); // Daca locatia este salvata la favorite
  const [loading, setLoading] = useState(false); // Loading la salvare
  const [errorMsg, setErrorMsg] = useState<string | null>(null); // Mesaj de eroare la salvare

  // Stare pentru sumar recenzii AI (lazy loading)
  const [reviewSummary, setReviewSummary] = useState<string | null>(null); // Textul sumarului AI
  const [reviewLoading, setReviewLoading] = useState(false); // Loading la generare sumar
  const [reviewError, setReviewError] = useState<string | null>(null); // Mesaj de eroare la sumar

  // Functie pentru salvarea locatiei la favorite
  async function handleSave() {
    setErrorMsg(null); // Reseteaza eroarea
    setLoading(true); // Porneste loading-ul
    const res = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        place_id,
        name,
        address,
        photo_reference,
        google_maps_url: googleMapsUrl,
        website,
      }),
    });
    setLoading(false); // Opreste loading-ul
    if (res.ok) {
      setSaved(true); // Marcheaza ca salvat
    } else {
      const data = await res.json();
      setErrorMsg(data.error || "Eroare la salvare!"); // Afiseaza eroare daca exista
    }
  }

  // Functie pentru generarea sumarului AI al recenziilor Google (lazy loading)
  async function handleGenerateReviewSummary() {
    setReviewError(null); // Reseteaza eroarea
    setReviewLoading(true); // Porneste loading-ul
    try {
      const res = await fetch(`/api/reviewSummary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ place_id }),
      });
      const data = await res.json();
      setReviewSummary(data.summary); // Salveaza sumarul AI
    } catch (e) {
      setReviewError("Nu s-a putut genera rezumatul recenziilor."); // Afiseaza eroare la fetch
    }
    setReviewLoading(false); // Opreste loading-ul
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col sm:flex-row gap-4 items-center">
      {/* Poza locatiei */}
      <div className="w-28 h-28 rounded-lg overflow-hidden flex-shrink-0 bg-[#FFECEC] flex items-center justify-center">
        <Image
          src={photoUrl}
          alt={name}
          width={112}
          height={112}
          className="object-cover w-full h-full"
        />
      </div>

      <div className="flex-1">
        {/* Titlu locatie */}
        <h3 className="text-xl font-bold text-[#353935]">{name}</h3>

        {/* Adresa locatiei */}
        <p className="text-[#353935] text-sm mb-2">{address}</p>

        <div className="flex items-center gap-3 mb-2">
          {/* Rating si numar recenzii */}
          {rating && (
            <span className="text-[#89AC46] font-bold">
              ★ {rating} ({user_ratings_total?.toLocaleString()})
            </span>
          )}

          {/* Pret estimativ */}
          {price_level !== undefined && (
            <span className="text-[#353935]">{getPriceRange(price_level)}</span>
          )}
        </div>

        {/* Linkuri catre website si Google Maps */}
        <div className="flex gap-4">
          {isValidUrl(website) && (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#89AC46] underline hover:text-[#353935] text-sm"
            >
              Website oficial
            </a>
          )}

          {isValidUrl(googleMapsUrl) && (
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#89AC46] underline hover:text-[#353935] text-sm"
            >
              Vezi pe Google Maps
            </a>
          )}
        </div>

        {/* Sumar AI recenzii Google (lazy loading) */}
        <div className="mt-3">
          {/* Buton pentru generare sumar */}
          {!reviewSummary && !reviewLoading && (
            <button
              className="
                bg-black text-white
                px-3 py-1
                text-sm
                rounded-full font-semibold
                transition
                border-2 border-black
                hover:bg-white hover:text-black
              "
              onClick={handleGenerateReviewSummary}
              disabled={reviewLoading}
            >
              Recenzii pe scurt
            </button>
          )}
          {/* Loader pentru sumar */}
          {reviewLoading && (
            <div className="flex items-center gap-2 mt-2">
              <svg className="animate-spin h-5 w-5 text-[#89AC46]" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              <span className="text-[#353935]">Se genereaza rezumatul...</span>
            </div>
          )}
          {/* Afisare sumar AI daca exista */}
          {reviewSummary && (
            <div className="bg-[#F6F6F6] rounded p-3 mt-2">
              <h4 className="font-semibold mb-1 text-[#353935]">Conform opiniilor fostilor clienti:</h4>
              <pre className="whitespace-pre-line text-sm text-[#353935]">{reviewSummary}</pre>
            </div>
          )}
          {/* Afisare eroare la sumar */}
          {reviewError && (
            <div className="text-red-600 text-sm mt-1">{reviewError}</div>
          )}
        </div>

        {/* Buton favorite (inima) - doar daca showFavorite !== false */}
        {showFavorite && (
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={handleSave}
              disabled={saved || loading}
              aria-label={saved ? "Locatie salvata la favorite" : "Salveaza ca favorit"}
              className="p-1 rounded-full border-none bg-transparent hover:scale-110 transition"
              style={{
                color: saved ? "#FF8787" : "#ccc",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: 28,
                lineHeight: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {saved ? <FaHeart /> : <FaRegHeart />}
            </button>
            <span className="text-sm text-[#353935]">
              {saved ? "Salvat la favorite" : "Salveaza ca favorit"}
            </span>
          </div>
        )}
        {/* Afisare eroare la favorite */}
        {errorMsg && (
          <div className="text-red-600 text-sm mt-1">{errorMsg}</div>
        )}
      </div>
    </div>
  );
}

// Functie pentru afisarea pretului estimativ in lei in functie de price_level
function getPriceRange(priceLevel: number): string {
  switch (priceLevel) {
    case 0:
      return "1-20";
    case 1:
      return "30-50 lei";
    case 2:
      return "50-70 lei";
    case 3:
      return "70-90 lei";
    case 4:
      return "100+ lei";
    default:
      return "";
  }
}
