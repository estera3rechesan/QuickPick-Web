"use client";
import { useState, useEffect } from "react";
import LocationCard, { LocationCardProps } from "./LocationCard";

interface ResultsListProps {
  places: LocationCardProps[];
}

// Calculează distanța în km între două coordonate
function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const FILTERS = [
  { key: "rating", label: "Rating" },
  { key: "price_asc", label: "Preț crescător" },
  { key: "price_desc", label: "Preț descrescător" },
  { key: "distance", label: "Distanță" },
];

export default function ResultsList({ places }: ResultsListProps) {
  const [sortBy, setSortBy] = useState<"rating" | "price_asc" | "price_desc" | "distance" | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [sortedPlaces, setSortedPlaces] = useState<LocationCardProps[]>(places);

  // Obține coordonatele userului când selectezi "distanță"
  useEffect(() => {
    if (sortBy === "distance" && !coords && typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        err => alert("Nu am putut obține locația: " + err.message)
      );
    }
  }, [sortBy, coords]);

  // Sortează rezultatele după criteriul ales
  useEffect(() => {
    let newPlaces = [...places];

    if (sortBy === "rating") {
      // Sortează descrescător după rating, ignoră undefined
      newPlaces = newPlaces
        .filter(p => typeof p.rating === "number")
        .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    } else if (sortBy === "price_asc") {
      // Sortează crescător după price_level, ignoră undefined
      newPlaces = newPlaces
        .filter(p => typeof p.price_level === "number")
        .sort((a, b) => (a.price_level ?? 0) - (b.price_level ?? 0));
    } else if (sortBy === "price_desc") {
      // Sortează descrescător după price_level, ignoră undefined
      newPlaces = newPlaces
        .filter(p => typeof p.price_level === "number")
        .sort((a, b) => (b.price_level ?? 0) - (a.price_level ?? 0));
    } else if (sortBy === "distance" && coords) {
      // Calculează distanța, filtrează doar locurile cu coordonate și la max 25 km
      newPlaces = newPlaces
        .map(place => {
          const lat = (place as any).lat ?? (place as any).latitude;
          const lng = (place as any).lng ?? (place as any).longitude;
          let distance = Infinity;
          if (typeof lat === "number" && typeof lng === "number") {
            distance = getDistanceKm(coords.lat, coords.lng, lat, lng);
          }
          return { ...place, _distance: distance };
        })
        .filter(place => typeof place._distance === "number" && place._distance <= 25)
        .sort((a, b) => (a._distance ?? Infinity) - (b._distance ?? Infinity));
    }

    setSortedPlaces(newPlaces);
  }, [sortBy, coords, places]);

  // Mesaj dacă nu există locuri în apropiere la filtrarea pe distanță
  if (sortBy === "distance" && coords && !sortedPlaces.length) {
    return (
      <p className="text-[#353935] text-center mt-8">
        Nu am găsit rezultate în apropierea ta (maxim 25 km).
      </p>
    );
  }

  if (!places.length) {
    return <p className="text-[#353935] text-center mt-8">Nu am găsit rezultate relevante.</p>;
  }

  return (
    <div className="flex w-full max-w-5xl mx-auto">
      {/* Sidebar de filtrare */}
      <aside className="hidden md:flex flex-col gap-2 w-52 mr-8 pt-2 sticky top-14 h-fit bg-white/80 rounded-xl shadow">
        <h3 className="text-[#353935] font-bold mb-2 px-4 pt-4">Filtrează după</h3>
        {FILTERS.map((filter) => (
          <button
            key={filter.key}
            className={`text-left px-4 py-2 rounded-lg font-medium transition
              ${sortBy === filter.key
                ? "bg-[#93c572] text-white"
                : "hover:bg-[#c9e2b8] text-[#353935]"}
            `}
            onClick={() => setSortBy(filter.key as any)}
          >
            {filter.label}
          </button>
        ))}
      </aside>
      {/* Lista de rezultate */}
      <div className="flex-1 flex flex-col gap-6 mt-2">
        {/* Pe mobil: dropdown pentru filtrare */}
        <div className="md:hidden flex gap-2 mb-4">
          <span className="text-[#353935] font-semibold">Filtrează după:</span>
          <select
            className="border px-2 py-1 rounded"
            value={sortBy || ""}
            onChange={e => setSortBy(e.target.value as any)}
          >
            <option value="">--</option>
            {FILTERS.map(f => (
              <option key={f.key} value={f.key}>{f.label}</option>
            ))}
          </select>
        </div>
        {sortedPlaces.map((place, idx) => (
          <LocationCard key={place.name + idx} {...place} />
        ))}
      </div>
    </div>
  );
}
