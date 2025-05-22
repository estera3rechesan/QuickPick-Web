import { NextRequest, NextResponse } from "next/server";
import { parseUserPrompt } from '@/utils/parseUserPrompt'; 
import { fetchPlacesFromMaps } from "@/utils/fetchPlacesFromMaps";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt) return NextResponse.json({ error: "Prompt is required" }, { status: 400 });

    // Creează clientul Supabase și ia userul
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Salvează în istoric dacă userul e logat
    if (user && prompt) {
      await supabase.from("search_history").insert([
        { user_id: user.id, query: prompt }
      ]);
    }

    // 1. Procesează promptul cu AI
    const { category, specifications, location } = await parseUserPrompt(prompt);

    // 2. Construiește query-ul pentru Google Places
    let query = category;
    if (specifications) query += ` ${specifications}`;
    if (location) query += ` ${location}`;

    // 4. Caută pe Google Places
    const places = await fetchPlacesFromMaps({ query });

    // 5. Returnează rezultatele
    return NextResponse.json({ places });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Eroare internă" }, { status: 500 });
  }
}
