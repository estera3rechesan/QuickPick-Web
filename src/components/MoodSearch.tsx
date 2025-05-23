"use client";
import { useState } from "react";
import {
  FaBook,
  FaHeart,
  FaUsers,
  FaUtensils,
  FaLeaf,
  FaTree,
  FaPaw,
  FaCoffee,
  FaDumbbell,
  FaPalette,
  FaGlassCheers,
  FaMoneyBillWave,
  FaPlus,
} from "react-icons/fa";
import { MdFamilyRestroom } from "react-icons/md";

interface MoodSearchProps {
  onMoodSelect: (prompt: string) => void;
}

const iconClass = "text-3xl text-[#93c572]"; // Toate iconițele verzi și puțin mai mari

const moods = [
  {
    label: "Familie & Copii",
    prompt:
      "Recomandă locuri de petrecut timpul cu familia, potrivite pentru copii, fără spitale, clinici sau locuri medicale.",
    icon: <MdFamilyRestroom className={iconClass} />,
    description: "Locuri sigure și distractive pentru copii și părinți.",
  },
  {
    label: "Romantic",
    prompt:
      "Recomandă locuri romantice pentru cupluri, cu atmosferă plăcută și liniștită, evită locurile aglomerate sau nepotrivite.",
    icon: <FaHeart className={iconClass} />,
    description: "Pentru cupluri, atmosferă intimă.",
  },
  {
    label: "Prieteni & Socializare",
    prompt:
      "Recomandă locuri potrivite pentru socializare cu prietenii, cu atmosferă relaxată și prietenoasă.",
    icon: <FaUsers className={iconClass} />,
    description: "Pentru grupuri, atmosferă relaxată.",
  },
  {
    label: "Mâncare & Restaurante",
    prompt:
      "Recomandă restaurante sau localuri cu mâncare bună, potrivite pentru o ieșire relaxată la masă.",
    icon: <FaUtensils className={iconClass} />,
    description: "Restaurante, terase, bistro-uri.",
  },
  {
    label: "Vegan/Vegetarian",
    prompt:
      "Recomandă restaurante cu opțiuni vegane sau vegetariene, evită fast-food-uri clasice.",
    icon: <FaLeaf className={iconClass} />,
    description: "Meniu vegan sau vegetarian.",
  },
  {
    label: "Natură & Plimbare",
    prompt:
      "Recomandă locuri în aer liber, parcuri sau grădini pentru plimbare și relaxare în natură.",
    icon: <FaTree className={iconClass} />,
    description: "Parcuri, grădini, natură.",
  },
  {
    label: "Pet Friendly",
    prompt:
      "Recomandă locuri unde animalele de companie sunt binevenite.",
    icon: <FaPaw className={iconClass} />,
    description: "Locuri unde poți merge cu animalele de companie.",
  },
  {
    label: "Cafenea & Relaxare",
    prompt:
      "Recomandă cafenele sau ceainării cu atmosferă relaxantă, potrivite pentru citit sau lucrat.",
    icon: <FaCoffee className={iconClass} />,
    description: "Cafenele, ceainării, locuri liniștite.",
  },
  {
    label: "Citit",
    prompt:
      "Recomandă un loc liniștit și confortabil pentru citit, cu atmosferă relaxantă.",
    icon: <FaBook className={iconClass} />,
    description: "Locuri liniștite pentru citit.",
  },
  {
    label: "Sport & Activități",
    prompt:
      "Recomandă locuri pentru activități sportive sau de fitness, evită spitale sau clinici.",
    icon: <FaDumbbell className={iconClass} />,
    description: "Săli de sport, activități fizice.",
  },
  {
    label: "Cultural & Artă",
    prompt:
      "Recomandă locuri culturale, muzee, galerii de artă sau expoziții interesante.",
    icon: <FaPalette className={iconClass} />,
    description: "Muzee, galerii, expoziții.",
  },
  {
    label: "Noapte & Distracție",
    prompt:
      "Recomandă baruri, cluburi sau locuri pentru distracție de noapte, evită locurile pentru copii.",
    icon: <FaGlassCheers className={iconClass} />,
    description: "Baruri, cluburi, viață de noapte.",
  },
  {
    label: "Buget redus",
    prompt:
      "Recomandă locuri bune cu prețuri accesibile, potrivite pentru un buget redus.",
    icon: <FaMoneyBillWave className={iconClass} />,
    description: "Opțiuni accesibile, prețuri mici.",
  },
];

export default function MoodSearch({ onMoodSelect }: MoodSearchProps) {
  const [showCustom, setShowCustom] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");

  return (
    <div className="w-full max-w-4xl mx-auto mt-10 text-center">
      <h3 className="text-[#353935] font-bold text-2xl mb-5">Mood search</h3>
      <div className="flex flex-wrap gap-4 mb-3 justify-center">
        {moods.map((mood) => (
          <button
            key={mood.label}
            className="flex flex-col items-center bg-white rounded-xl shadow px-5 py-4 hover:bg-[#c9e2b8] transition w-40 h-36 justify-center"
            onClick={() => onMoodSelect(mood.prompt)}
            type="button"
            title={mood.description}
          >
            {mood.icon}
            <span className="font-semibold mt-2 text-[#353935] text-lg">{mood.label}</span>
            <span className="text-xs text-[#353935] opacity-70 mt-1 text-center">{mood.description}</span>
          </button>
        ))}
        {/* Buton Personalizează */}
        <button
          className="flex flex-col items-center bg-white rounded-xl shadow px-5 py-4 hover:bg-[#c9e2b8] transition w-40 h-36 justify-center"
          onClick={() => setShowCustom((v) => !v)}
          type="button"
          title="Creează un prompt personalizat"
        >
          <span className={iconClass}><FaPlus /></span>
          <span className="font-semibold mt-2 text-[#353935] text-lg">Personalizează</span>
          <span className="text-xs text-[#353935] opacity-70 mt-1 text-center">Creează promptul tău</span>
        </button>
      </div>
      {showCustom && (
        <form
          onSubmit={e => {
            e.preventDefault();
            if (customPrompt.trim()) {
              onMoodSelect(customPrompt.trim());
              setShowCustom(false);
              setCustomPrompt("");
            }
          }}
          className="flex gap-2 mt-2 justify-center"
        >
          <input
            type="text"
            className="flex-1 max-w-xs px-4 py-2 border-2 border-[#89AC46] rounded-lg bg-white text-[#353935] focus:outline-none focus:ring-2 focus:ring-[#D3E671] transition text-base"
            placeholder="Scrie promptul tău..."
            value={customPrompt}
            onChange={e => setCustomPrompt(e.target.value)}
            autoFocus
          />
          <button
            type="submit"
            className="bg-[#FF8787] text-white rounded-lg px-4 py-2 font-semibold hover:bg-[#ffb0b0] transition"
          >
            Caută
          </button>
        </form>
      )}
    </div>
  );
}
