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

const iconClass = "text-3xl text-[#93c572]"; // Toate iconițele verzi și puțin mai mari

const moods = [
  {
    label: "Familie & Copii",
    prompt:
      "Recomandă locuri de petrecut timpul cu familia, potrivite pentru copii, cum ar fi parcuri, locuri de joaca, restaurante cu spatiu pentru copii.",
    icon: <MdFamilyRestroom className={iconClass} />,
    description: "Locuri distractive pentru copii și părinți.",
  },
  {
    label: "Romantic",
    prompt:
      "Recomandă locuri romantice pentru cupluri, cu atmosferă plăcută și liniștită, cum ar fi restaurante elegante, muzeuri, parcuri frumoase, sau locuri cu priveliști spectaculoase.",
    icon: <FaHeart className={iconClass} />,
    description: "Pentru cupluri, atmosferă intimă.",
  },
  {
    label: "Prieteni & Socializare",
    prompt:
      "Recomandă locuri potrivite pentru socializare cu prietenii, cu atmosferă relaxată și prietenoasă, cum ar fi cafenele, bistrouri, fast-food-uri, baruri, locuri cu jocuri de societate, sau locuri cu activități interactive.",
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
      "Recomandă locuri unde animalele de companie sunt binevenite, cum ar fi restaurante sau cafenele.",
    icon: <FaPaw className={iconClass} />,
    description: "Locuri unde poți merge cu animalele de companie.",
  },
  {
    label: "Cafenea & Relaxare",
    prompt:
      "Recomandă cafenele sau ceainării cu atmosferă relaxantă, cum ar fi cafenele de specialitate și ceainării.",
    icon: <FaCoffee className={iconClass} />,
    description: "Cafenele, ceainării, locuri liniștite.",
  },
  {
    label: "Citit",
    prompt:
      "Recomandă un loc liniștit și confortabil pentru citit, cum ar fi cafenele, ceainării, biblioteci, librării.",
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
      "Recomandă baruri, cluburi sau locuri pentru distracție de noapte.",
    icon: <FaGlassCheers className={iconClass} />,
    description: "Baruri, cluburi, viață de noapte.",
  },
  {
    label: "Buget redus",
    prompt:
      "Recomandă locuri bune cu prețuri accesibile, potrivite pentru un buget redus, cum ar fi fast-food-uri, restaurante ieftine, muzee gratuite, parcuri.",
    icon: <FaMoneyBillWave className={iconClass} />,
    description: "Opțiuni accesibile, prețuri mici.",
  },
];

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
