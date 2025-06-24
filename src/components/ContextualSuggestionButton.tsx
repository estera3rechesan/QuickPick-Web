"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Functie pentru a prelua vremea de la Open-Meteo
async function fetchWeather(lat: number, lng: number) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weathercode`;
  const res = await fetch(url);
  const data = await res.json();
  return data.current;
}

// Funcție pentru generarea sugestilor
function getSuggestionAndPrompt(weather: any, hour: number, day: number) {
  if (!weather) return {
    suggestion: "Descoperă cele mai bune locuri din apropiere!",
    prompt: "locuri de vizitat in apropiere"
  };
  if ([0, 1, 2].includes(weather.weathercode)) {
    if (hour >= 10 && hour < 18) return {
      suggestion: "E soare afară! Vezi parcurile sau terasele din apropiere.",
      prompt: "parcuri sau terase in apropiere"
    };
    if (hour < 10) return {
      suggestion: "Dimineața însorită! Începe ziua cu o cafenea bună.",
      prompt: "cafenele in apropiere"
    };
  }
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weather.weathercode)) {
    return {
      suggestion: "Plouă afară? Descoperă cafenele, muzee sau spații interioare!",
      prompt: "cafenele sau muzee in apropiere"
    };
  }
  if (day === 0 || day === 6) return {
    suggestion: "Weekend! Vezi ce evenimente sau locuri speciale sunt azi.",
    prompt: "evenimente sau locuri speciale weekend"
  };
  if (hour >= 18) return {
    suggestion: "Seara relaxanta? Incearca un restaurant sau un bar cozy!",
    prompt: "restaurante sau baruri in apropiere"
  };
  return {
    suggestion: "Descoperă cele mai bune locuri din apropiere!",
    prompt: "locuri de vizitat in apropiere"
  };
}

export default function ContextualSuggestionButton() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [weather, setWeather] = useState<any>(null);
  const [suggestion, setSuggestion] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Obtine coordonatele userului
  useEffect(() => {
    if (!coords && typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        err => setSuggestion("Nu am putut obtine locatia ta pentru sugestii contextuale.")
      );
    }
  }, [coords]);

  // Preia vremea in functie de coordonatele obtinute
  useEffect(() => {
    if (coords) {
      fetchWeather(coords.lat, coords.lng).then(setWeather);
    }
  }, [coords]);

  // Genereaza sugestia
  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    const { suggestion, prompt } = getSuggestionAndPrompt(weather, hour, day);
    setSuggestion(suggestion);
    setPrompt(prompt);
  }, [weather]);

  if (!suggestion) return null;

  const liveDot = (
    <span className="relative flex h-3 w-3 mr-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF8787] opacity-75"></span>
      <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FF8787]"></span>
    </span>
  );

  const loadingSpinner = (
    <svg className="animate-spin h-5 w-5 text-[#FF8787] mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );

  const handleClick = () => {
    if (prompt) {
      setLoading(true);
      router.push(`/results?query=${encodeURIComponent(prompt)}`);
    }
  };

  return (
    <div className="flex flex-col items-center w-full mt-5 mb-0">
      <button
        className={`
          flex items-center justify-center gap-2
          rounded-full
          bg-white text-[#FF8787] font-bold text-sm
          shadow-lg transition
          border-2 border-[#FF8787]
          hover:bg-[#FF8787] hover:text-white
          focus:outline-none focus:ring-2 focus:ring-[#FF8787]
          animate-fade-in
        `}
        style={{ minWidth: 180, minHeight: 40, padding: "0 16px" }}
        onClick={handleClick}
        disabled={loading}
        title="Sugestie generata pe baza vremii si orei"
      >
        {loading ? loadingSpinner : liveDot}
        <span>
          <span className="uppercase font-extrabold text-[10px] tracking-widest mr-1 align-middle">
            {loading ? "CAUTARE..." : "LIVE"}
          </span>
          <span className="align-middle">{suggestion}</span>
        </span>
      </button>
    </div>
  );
}
