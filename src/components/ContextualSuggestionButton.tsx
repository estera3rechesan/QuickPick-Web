/**
 * ContextualSuggestionButton.tsx - Buton pentru sugestii contextuale in QuickPick
 * 
 * Acest component genereaza si afiseaza un buton care propune automat o sugestie de loc/activitate pe baza contextului utilizatorului.
 * Functii principale:
 *  - Obtine coordonatele geografice ale utilizatorului folosind geolocatia browserului.
 *  - Interogheaza API-ul Open-Meteo pentru a afla vremea curenta in locatia utilizatorului.
 *  - Genereaza o sugestie si un prompt inteligent tinand cont de vreme, ora si zi (ex: soare, ploaie, weekend, dimineata, seara).
 *  - La click pe buton, redirectioneaza utilizatorul catre pagina de rezultate cu promptul generat.
 * Elemente cheie:
 *  - Folosire useEffect pentru a obtine si reactualiza datele contextuale la montare si la schimbare vreme.
 *  - UI cu feedback vizual (dot live, spinner la loading).
 *  - Functie helper pentru interpretarea codului meteo si a contextului temporal.
 *  - Integrare cu router-ul Next.js pentru navigare programatica.
 */

"use client"; // Activeaza functionalitatea client-side in Next.js

import { useEffect, useState } from "react"; // Hook-uri pentru stare si efecte
import { useRouter } from "next/navigation"; // Hook pentru navigare programatica

// Functie helper pentru a prelua vremea de la Open-Meteo
async function fetchWeather(lat: number, lng: number) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weathercode`;
  const res = await fetch(url); // Trimite request catre API
  const data = await res.json(); // Parseaza raspunsul ca JSON
  return data.current; // Returneaza datele despre vreme
}

// Functie pentru generarea sugestiei si a promptului pe baza vremii, orei si zilei
function getSuggestionAndPrompt(weather: any, hour: number, day: number) {
  if (!weather) return {
    suggestion: "Descopera cele mai bune locuri din apropiere!",
    prompt: "locuri de vizitat in apropiere"
  };
  // Daca e vreme insorita
  if ([0, 1, 2].includes(weather.weathercode)) {
    if (hour >= 10 && hour < 18) return {
      suggestion: "E soare afara! Vezi parcurile sau terasele din apropiere.",
      prompt: "parcuri sau terase in apropiere"
    };
    if (hour < 10) return {
      suggestion: "Dimineata insorita! Incepe ziua cu o cafenea buna.",
      prompt: "cafenele in apropiere"
    };
  }
  // Daca ploua
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weather.weathercode)) {
    return {
      suggestion: "Ploua afara? Descopera cafenele, muzee sau spatii interioare!",
      prompt: "cafenele sau muzee in apropiere"
    };
  }
  // Daca e weekend
  if (day === 0 || day === 6) return {
    suggestion: "Weekend! Vezi ce evenimente sau locuri speciale sunt azi.",
    prompt: "evenimente sau locuri speciale weekend"
  };
  // Daca e seara
  if (hour >= 18) return {
    suggestion: "Seara relaxanta? Incearca un restaurant sau un bar cozy!",
    prompt: "restaurante sau baruri in apropiere"
  };
  // Sugestie generica
  return {
    suggestion: "Descopera cele mai bune locuri din apropiere!",
    prompt: "locuri de vizitat in apropiere"
  };
}

export default function ContextualSuggestionButton() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null); // Stare pentru coordonatele userului
  const [weather, setWeather] = useState<any>(null); // Stare pentru datele despre vreme
  const [suggestion, setSuggestion] = useState<string>(""); // Sugestia afisata pe buton
  const [prompt, setPrompt] = useState<string>(""); // Promptul folosit la cautare
  const [loading, setLoading] = useState(false); // Stare pentru loading la click
  const router = useRouter(); // Hook pentru navigare

  // Obtine coordonatele userului la montarea componentului
  useEffect(() => {
    if (!coords && typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }), // Salveaza coordonatele
        err => setSuggestion("Nu am putut obtine locatia ta pentru sugestii contextuale.") // Afiseaza mesaj daca nu merge
      );
    }
  }, [coords]);

  // Ia vremea daca exista coordonate
  useEffect(() => {
    if (coords) {
      fetchWeather(coords.lat, coords.lng).then(setWeather); // Preia vremea si salveaza in state
    }
  }, [coords]);

  // Genereaza sugestia si promptul la schimbare vreme/oră/zi
  useEffect(() => {
    const now = new Date();
    const hour = now.getHours(); // Ora curenta
    const day = now.getDay(); // Ziua curenta (0 = duminica, 6 = sambata)
    const { suggestion, prompt } = getSuggestionAndPrompt(weather, hour, day); // Genereaza sugestia
    setSuggestion(suggestion); // Salveaza sugestia
    setPrompt(prompt); // Salveaza promptul
  }, [weather]);

  if (!suggestion) return null; // Nu afisa nimic daca nu exista sugestie

  // Stiluri pentru punctul live (dot animat)
  const liveDot = (
    <span className="relative flex h-3 w-3 mr-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF8787] opacity-75"></span>
      <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FF8787]"></span>
    </span>
  );

  // Spinner SVG pentru loading
  const loadingSpinner = (
    <svg className="animate-spin h-5 w-5 text-[#FF8787] mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );

  // Functie pentru redirect cu loader la click pe buton
  const handleClick = () => {
    if (prompt) {
      setLoading(true); // Porneste loading-ul
      router.push(`/results?query=${encodeURIComponent(prompt)}`); // Navigheaza la pagina de rezultate cu promptul generat
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
        onClick={handleClick} // La click se porneste cautarea contextuala
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
