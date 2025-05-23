"use client";
import { useState } from "react";
import { FaBook, FaHeart, FaUsers, FaPlus } from "react-icons/fa";
import { MdFamilyRestroom } from "react-icons/md";

interface MoodSearchProps {
  onMoodSelect: (prompt: string) => void;
}

const moods = [
  {
    label: "Citit",
    prompt: "Vreau un loc liniștit pentru citit",
    icon: <FaBook />,
  },
  {
    label: "Romantic",
    prompt: "Vreau ceva romantic pentru o întâlnire",
    icon: <FaHeart />,
  },
  {
    label: "Copii",
    prompt: "Vreau un loc potrivit pentru familie sau copii",
    icon: <MdFamilyRestroom />,
  },
  {
    label: "Distracție",
    prompt: "Vreau ceva distractiv cu prietenii",
    icon: <FaUsers />,
  },
];

export default function MoodSearch({ onMoodSelect }: MoodSearchProps) {
  const [showCustom, setShowCustom] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");

  return (
    <div className="w-full max-w-lg mx-auto mt-6">
      <h3 className="text-[#353935] font-semibold mb-2">Mood search</h3>
      <div className="flex flex-wrap gap-3 mb-3">
        {moods.map((mood) => (
          <button
            key={mood.label}
            className="flex items-center gap-2 bg-[#89AC46] text-white rounded-full px-5 py-2 shadow hover:bg-[#6e8f32] transition text-base font-medium"
            onClick={() => onMoodSelect(mood.prompt)}
            type="button"
          >
            <span className="text-lg">{mood.icon}</span>
            {mood.label}
          </button>
        ))}
        {/* Buton Personalizează */}
        <button
          className="flex items-center gap-2 bg-[#89AC46] text-white rounded-full px-5 py-2 shadow hover:bg-[#6e8f32] transition text-base font-medium"
          onClick={() => setShowCustom((v) => !v)}
          type="button"
        >
          <span className="text-lg"><FaPlus /></span>
          Personalizează
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
          className="flex gap-2 mt-2"
        >
          <input
            type="text"
            className="flex-1 px-4 py-2 border-2 border-[#89AC46] rounded-lg bg-white text-[#353935] focus:outline-none focus:ring-2 focus:ring-[#D3E671] transition text-base"
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
