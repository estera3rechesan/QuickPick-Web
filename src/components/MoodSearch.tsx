"use client";

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
} from "react-icons/fa";
import { MdFamilyRestroom } from "react-icons/md";

interface MoodSearchProps {
  onMoodSelect: (prompt: string) => void;
}

const iconClass = "text-3xl text-[#93c572]";

// Lista de mood-uri cu label, prompt, icon si descriere
const moods = [
  {
    label: "Familie & Copii",
    prompt:
      "Recomanda locuri de petrecut timpul cu familia, potrivite pentru copii, cum ar fi parcuri, locuri de joaca, restaurante cu spatiu pentru copii.",
    icon: <MdFamilyRestroom className={iconClass} />,
    description: "Locații pentru copii si parinti.",
  },
  {
    label: "Romantic",
    prompt:
      "Recomanda locuri romantice pentru cupluri, cu atmosfera placuta si linistita, cum ar fi restaurante elegante, muzee, parcuri frumoase, sau locuri cu privelisti spectaculoase.",
    icon: <FaHeart className={iconClass} />,
    description: "Pentru cupluri, atmosfera intima.",
  },
  {
    label: "Prieteni & Socializare",
    prompt:
      "Recomanda locuri potrivite pentru socializare cu prietenii, cu atmosfera relaxata si prietenoasa, cum ar fi cafenele, bistrouri, fast-food-uri, baruri, locuri cu jocuri de societate, sau locuri cu activitati interactive.",
    icon: <FaUsers className={iconClass} />,
    description: "Pentru grupuri, atmosfera relaxata.",
  },
  {
    label: "Mancare & Restaurante",
    prompt:
      "Recomanda restaurante sau localuri cu mancare buna, potrivite pentru o iesire relaxata la masa.",
    icon: <FaUtensils className={iconClass} />,
    description: "Restaurante, terase, bistro-uri.",
  },
  {
    label: "Vegan/Vegetarian",
    prompt:
      "Recomanda restaurante cu optiuni vegane sau vegetariene, evita fast-food-uri clasice.",
    icon: <FaLeaf className={iconClass} />,
    description: "Meniu vegan sau vegetarian.",
  },
  {
    label: "Natura & Plimbare",
    prompt:
      "Recomanda locuri in aer liber, parcuri sau gradini pentru plimbare si relaxare in natura.",
    icon: <FaTree className={iconClass} />,
    description: "Parcuri, gradini, natura.",
  },
  {
    label: "Pet Friendly",
    prompt:
      "Recomanda locuri unde animalele de companie sunt binevenite, cum ar fi restaurante sau cafenele.",
    icon: <FaPaw className={iconClass} />,
    description: "Locuri unde poti merge cu animalele de companie.",
  },
  {
    label: "Cafenea & Relaxare",
    prompt:
      "Recomanda cafenele sau ceainarii cu atmosfera relaxanta, cum ar fi cafenele de specialitate si ceainarii.",
    icon: <FaCoffee className={iconClass} />,
    description: "Cafenele, ceainarii, locuri linistite.",
  },
  {
    label: "Citit",
    prompt:
      "Recomanda un loc linistit si confortabil pentru citit, cum ar fi cafenele, ceainarii, biblioteci, librarii.",
    icon: <FaBook className={iconClass} />,
    description: "Locuri linistite pentru citit.",
  },
  {
    label: "Sport & Activitati",
    prompt:
      "Recomanda locuri pentru activitati sportive sau de fitness, evita spitale sau clinici.",
    icon: <FaDumbbell className={iconClass} />,
    description: "Sali de sport, activitati fizice.",
  },
  {
    label: "Cultural & Arta",
    prompt:
      "Recomanda locuri culturale, muzee, galerii de arta sau expozitii interesante.",
    icon: <FaPalette className={iconClass} />,
    description: "Muzee, galerii, expozitii.",
  },
  {
    label: "Noapte & Distractie",
    prompt:
      "Recomanda baruri, cluburi sau locuri pentru distractie de noapte.",
    icon: <FaGlassCheers className={iconClass} />,
    description: "Baruri, cluburi, viata de noapte.",
  },
  {
    label: "Buget redus",
    prompt:
      "Recomanda locuri bune cu preturi accesibile, potrivite pentru un buget redus, cum ar fi fast-food-uri, restaurante ieftine, muzee gratuite, parcuri.",
    icon: <FaMoneyBillWave className={iconClass} />,
    description: "Optiuni accesibile, preturi mici.",
  },
];

// Componenta MoodSearch
export default function MoodSearch({ onMoodSelect }: MoodSearchProps) {
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
      </div>
    </div>
  );
}
