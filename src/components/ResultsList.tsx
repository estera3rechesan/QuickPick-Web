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

// Helper pentru extragerea coordonatelor din orice structură
function extractLatLng(place: any) {
  return {
    lat: place.lat ?? place.latitude ?? place.location?.lat,
    lng: place.lng ?? place.longitude ?? place.location?.lng,
  };
}

export default function ResultsList({ places }: ResultsListProps) {
  const [sortBy, setSortBy] = useState<"rating" | "price_asc" | "price_desc" | "distance" | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [sortedPlaces, setSortedPlaces] = useState<LocationCardProps[]>(places);

  // DEBUG: vezi ce coordonate ai și ce date primești
  useEffect(() => {
    console.log("DEBUG: Coordonate user:", coords);
    console.log("DEBUG: Lista locații:", places);
    if (places.length > 0) {
      console.log("DEBUG: Exemplu structură locație:", places[0]);
    }
  }, [coords, places]);

  // Obține coordonatele userului când selectezi "distanță"
  useEffect(() => {
    if (sortBy === "distance" && !coords && typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          console.log("DEBUG: Coordonate obținute:", pos.coords.latitude, pos.coords.longitude);
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        err => alert("Nu am putut obține locația: " + err.message)
      );
    }
  }, [sortBy, coords]);

  // Sortează rezultatele după criteriul ales
  useEffect(() => {
    let newPlaces = [...places];

    if (sortBy === "rating") {
      newPlaces = newPlaces
        .filter(p => typeof p.rating === "number")
        .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    } else if (sortBy === "price_asc") {
      newPlaces = newPlaces
        .filter(p => typeof p.price_level === "number")
        .sort((a, b) => (a.price_level ?? 0) - (b.price_level ?? 0));
    } else if (sortBy === "price_desc") {
      newPlaces = newPlaces
        .filter(p => typeof p.price_level === "number")
        .sort((a, b) => (b.price_level ?? 0) - (a.price_level ?? 0));
    } else if (sortBy === "distance" && coords) {
  // Filtrează locațiile care au coordonate valide
  const placesWithCoords = newPlaces.filter(place => {
    const lat =
      (place as any).lat ??
      (place as any).latitude ??
      (place as any).location?.lat;
    const lng =
      (place as any).lng ??
      (place as any).longitude ??
      (place as any).location?.lng;
    return typeof lat === "number" && typeof lng === "number";
  });

  if (placesWithCoords.length === 0) {
    console.warn("DEBUG: Nicio locație nu are coordonate valide (lat/lng sau latitude/longitude sau location.lat/lng).");
  }

  newPlaces = placesWithCoords
    .map(place => {
      const lat =
        (place as any).lat ??
        (place as any).latitude ??
        (place as any).location?.lat;
      const lng =
        (place as any).lng ??
        (place as any).longitude ??
        (place as any).location?.lng;
      let distance = Infinity;
      if (typeof lat === "number" && typeof lng === "number") {
        distance = getDistanceKm(coords.lat, coords.lng, lat, lng);
      }
      return { ...place, _distance: distance };
    });

  // DEBUG: vezi ce distanțe s-au calculat pentru fiecare locație
  console.log("DEBUG: Distanțe calculate pentru fiecare locație:");
  newPlaces.forEach(p => {
    console.log({
      name: p.name,
      _distance: (p as any)._distance,
      lat:
        (p as any).lat ??
        (p as any).latitude ??
        (p as any).location?.lat,
      lng:
        (p as any).lng ??
        (p as any).longitude ??
        (p as any).location?.lng
    });
  });

  newPlaces = newPlaces
    .filter(place => typeof (place as any)._distance === "number" && (place as any)._distance <= 30)
    .sort((a, b) => ((a as any)._distance ?? Infinity) - ((b as any)._distance ?? Infinity));
}


    setSortedPlaces(newPlaces);
  }, [sortBy, coords, places]);

  // Mesaj dacă nu există locuri cu coordonate valide
  if (
    sortBy === "distance" &&
    coords &&
    places.length > 0 &&
    places.every(
      place => {
        const { lat, lng } = extractLatLng(place);
        return typeof lat !== "number" || typeof lng !== "number";
      }
    )
  ) {
    return (
      <p className="text-[#353935] text-center mt-8">
        Nicio locație nu are coordonate valide (lat/lng, latitude/longitude sau location.lat/lng).
        <br />
        <span style={{ fontSize: 14, color: "#FF8787" }}>
          (Verifică structura obiectelor locație în consola browserului!)
        </span>
      </p>
    );
  }

  // Mesaj dacă nu există locuri în apropiere la filtrarea pe distanță
  if (sortBy === "distance" && coords && !sortedPlaces.length) {
    return (
      <p className="text-[#353935] text-center mt-8">
        Nu am găsit rezultate în apropierea ta (maxim 30 km).
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
