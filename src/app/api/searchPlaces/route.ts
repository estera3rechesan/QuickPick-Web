import { NextRequest, NextResponse } from "next/server";
import { parseUserPrompt } from '@/utils/parseUserPrompt';
import { fetchPlacesFromMaps } from "@/utils/fetchPlacesFromMaps";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt) return NextResponse.json({ error: "Introducerea unei cerințe este obligatorie" }, { status: 400 });

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Salvare in istoricul personal
    if (user && prompt) {
     const { data, error } = await supabase
    .from("search_history")
    .insert([{ user_id: user.id, query: prompt }]);
    if (error) {
    console.error("Eroare la inserarea în tabelul search_history:", error);
  }
    }
    const { category, specifications, location } = await parseUserPrompt(prompt);
    let query = category;
    if (specifications) query += ` ${specifications}`;
    if (location) query += ` ${location}`;

    // Caută locații relevante folosind Google Places API
    const places = await fetchPlacesFromMaps({ query });
    return NextResponse.json({ places });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Eroare internă" }, { status: 500 });
  }
}
