"use client";

import Image from "next/image";
import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

export interface LocationCardProps {
  place_id: string;
  name: string;
  address: string;
  rating?: number;
  price_level?: number;
  types?: string[];
  user_ratings_total?: number;
  photo_reference?: string;
  googleMapsUrl: string;
  website?: string;
  showFavorite?: boolean;
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
    showFavorite = true,
  } = props;

  const photoUrl = photo_reference
    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}`
    : "/placeholder.png";

  const isValidUrl = (url?: string) =>
    url && (url.startsWith("http://") || url.startsWith("https://"));

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [reviewSummary, setReviewSummary] = useState<string | null>(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  // Functie pentru salvarea locatiei la favorite
  async function handleSave() {
    setErrorMsg(null);
    setLoading(true);
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
    setLoading(false);
    if (res.ok) {
      setSaved(true);
    } else {
      const data = await res.json();
      setErrorMsg(data.error || "Eroare la salvare!");
    }
  }

  // Functie pentru generarea sumarului AI al recenziilor Google
  async function handleGenerateReviewSummary() {
    setReviewError(null);
    setReviewLoading(true);
    try {
      const res = await fetch(`/api/reviewSummary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ place_id }),
      });
      const data = await res.json();
      setReviewSummary(data.summary);
    } catch (e) {
      setReviewError("Nu s-a putut genera rezumatul recenziilor.");
    }
    setReviewLoading(false);
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col sm:flex-row gap-4 items-center">
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
        
        <h3 className="text-xl font-bold text-[#353935]">{name}</h3>
        <p className="text-[#353935] text-sm mb-2">{address}</p>
        <div className="flex items-center gap-3 mb-2">
          {rating && (
            <span className="text-[#89AC46] font-bold">
              ★ {rating} ({user_ratings_total?.toLocaleString()})
            </span>
          )}
          {price_level !== undefined && (
            <span className="text-[#353935]">{getPriceRange(price_level)}</span>
          )}
        </div>
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

        {/* Sumar AI recenzii Google*/}
        <div className="mt-3">
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
          {reviewLoading && (
            <div className="flex items-center gap-2 mt-2">
              <svg className="animate-spin h-5 w-5 text-[#89AC46]" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              <span className="text-[#353935]">Se genereaza rezumatul...</span>
            </div>
          )}
          {reviewSummary && (
            <div className="bg-[#F6F6F6] rounded p-3 mt-2">
              <h4 className="font-semibold mb-1 text-[#353935]">Conform opiniilor fostilor clienti:</h4>
              <pre className="whitespace-pre-line text-sm text-[#353935]">{reviewSummary}</pre>
            </div>
          )}
          {reviewError && (
            <div className="text-red-600 text-sm mt-1">{reviewError}</div>
          )}
        </div>

        {/* Buton favorite*/}
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
