"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Helper pentru vreme
async function fetchWeather(lat: number, lng: number) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weathercode`;
  const res = await fetch(url);
  const data = await res.json();
  return data.current;
}

function getSuggestionAndPrompt(weather: any, hour: number, day: number) {
  if (!weather) return {
    suggestion: "Descoperă cele mai bune locuri din apropiere!",
    prompt: "locuri de vizitat în apropiere"
  };
  if ([0, 1, 2, 3].includes(weather.weathercode)) {
    if (hour >= 10 && hour <= 19) return {
      suggestion: "E soare afară! Vezi parcurile sau terasele din apropiere.",
      prompt: "parcuri sau terase în apropiere"
    };
    if (hour < 10) return {
      suggestion: "Dimineață însorită! Începe ziua cu o cafenea bună.",
      prompt: "cafenele în apropiere"
    };
  }
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weather.weathercode)) {
    return {
      suggestion: "Plouă afară? Descoperă cafenele, muzee sau spații interioare!",
      prompt: "cafenele sau muzee în apropiere"
    };
  }
  if (day === 0 || day === 6) return {
    suggestion: "Weekend! Vezi ce evenimente sau locuri speciale sunt azi.",
    prompt: "evenimente sau locuri speciale weekend"
  };
  if (hour >= 18) return {
    suggestion: "Seară relaxantă? Încearcă un restaurant sau un bar cozy!",
    prompt: "restaurante sau baruri în apropiere"
  };
  return {
    suggestion: "Descoperă cele mai bune locuri din apropiere!",
    prompt: "locuri de vizitat în apropiere"
  };
}

export default function ContextualSuggestionButton() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [weather, setWeather] = useState<any>(null);
  const [suggestion, setSuggestion] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Obține coordonatele userului la montare
  useEffect(() => {
    if (!coords && typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        err => setSuggestion("Nu am putut obține locația ta pentru sugestii contextuale.")
      );
    }
  }, [coords]);

  // Ia vremea dacă ai coords
  useEffect(() => {
    if (coords) {
      fetchWeather(coords.lat, coords.lng).then(setWeather);
    }
  }, [coords]);

  // Generează sugestia și promptul la schimbare vreme/oră/zi
  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay(); // 0 = duminică, 6 = sâmbătă
    const { suggestion, prompt } = getSuggestionAndPrompt(weather, hour, day);
    setSuggestion(suggestion);
    setPrompt(prompt);
  }, [weather]);

  if (!suggestion) return null;

  // Stiluri pentru puls live
  const liveDot = (
    <span className="relative flex h-3 w-3 mr-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF8787] opacity-75"></span>
      <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FF8787]"></span>
    </span>
  );

  // Spinner SVG Tailwind style
  const loadingSpinner = (
    <svg className="animate-spin h-5 w-5 text-[#FF8787] mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );

  // Redirect cu loader
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
        title="Sugestie generată pe baza vremii și orei"
      >
        {loading ? loadingSpinner : liveDot}
        <span>
          <span className="uppercase font-extrabold text-[10px] tracking-widest mr-1 align-middle">
            {loading ? "CĂUTARE..." : "LIVE"}
          </span>
          <span className="align-middle">{suggestion}</span>
        </span>
      </button>
    </div>
  );
}
