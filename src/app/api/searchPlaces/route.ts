import { NextRequest, NextResponse } from "next/server";
import { parseUserPrompt } from '@/utils/parseUserPrompt'; // asigură-te că calea e corectă
import { fetchPlacesFromMaps } from "@/utils/fetchPlacesFromMaps";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt) return NextResponse.json({ error: "Prompt is required" }, { status: 400 });

    // 1. Procesează promptul cu AI
    const { category, specifications, location } = await parseUserPrompt(prompt);

    // 2. Construiește query-ul pentru Google Places
    let query = category;
    if (specifications) query += ` ${specifications}`;
    if (location) query += ` ${location}`;

    // 3. (Opțional) Transformă locația în coordonate cu Google Geocoding API dacă vrei să folosești radius

    // 4. Caută pe Google Places
    const places = await fetchPlacesFromMaps({ query });

    // 5. Returnează rezultatele
    return NextResponse.json({ places });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Eroare internă" }, { status: 500 });
  }
}
