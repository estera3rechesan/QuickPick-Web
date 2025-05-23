"use client";
import { useState, useEffect, useRef } from "react";
import LocationCard, { LocationCardProps } from "./LocationCard";

interface ResultsListProps {
  places: LocationCardProps[];
}

// Dacă ai lat/lng în altă structură, modifică aici!
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

export default function ResultsList({ places }: ResultsListProps) {
  const [sortBy, setSortBy] = useState<"rating" | "price" | "distance" | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [sortedPlaces, setSortedPlaces] = useState<LocationCardProps[]>(places);

  // Dropdown close on click outside
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      newPlaces.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "price") {
      newPlaces.sort((a, b) => (a.price_level || 0) - (b.price_level || 0));
    } else if (sortBy === "distance" && coords) {
      // Verifică dacă ai lat/lng pe fiecare place (modifică dacă structura diferă!)
      newPlaces = newPlaces
        .map(place => {
          const lat = (place as any).lat || (place as any).latitude;
          const lng = (place as any).lng || (place as any).longitude;
          let distance = Infinity;
          if (lat && lng) {
            distance = getDistanceKm(coords.lat, coords.lng, lat, lng);
          }
          return { ...place, _distance: distance };
        })
        .sort((a, b) => (a._distance || Infinity) - (b._distance || Infinity));
    }
    setSortedPlaces(newPlaces);
  }, [sortBy, coords, places]);

  if (!places.length) {
    return <p className="text-[#353935] text-center mt-8">Nu am găsit rezultate relevante.</p>;
  }

  return (
    <div>
      {/* Dropdown filtrare */}
      <div className="relative inline-block text-left mb-4" ref={dropdownRef}>
        <button
          className="bg-[#FF8787] text-white px-4 py-2 rounded-lg font-semibold"
          onClick={() => setShowDropdown((v) => !v)}
        >
          Filtrează după
        </button>
        {showDropdown && (
          <div className="absolute mt-2 w-40 rounded-md shadow-lg bg-white z-10">
            <button
              className="block w-full text-left px-4 py-2 hover:bg-[#FFECEC]"
              onClick={() => { setSortBy('rating'); setShowDropdown(false); }}
            >
              Rating
            </button>
            <button
              className="block w-full text-left px-4 py-2 hover:bg-[#FFECEC]"
              onClick={() => { setSortBy('price'); setShowDropdown(false); }}
            >
              Preț
            </button>
            <button
              className="block w-full text-left px-4 py-2 hover:bg-[#FFECEC]"
              onClick={() => { setSortBy('distance'); setShowDropdown(false); }}
            >
              Distanță
            </button>
          </div>
        )}
      </div>
      {/* Lista de rezultate */}
      <div className="flex flex-col gap-6 mt-8">
        {sortedPlaces.map((place, idx) => (
          <LocationCard key={place.name + idx} {...place} />
        ))}
      </div>
    </div>
  );
}
