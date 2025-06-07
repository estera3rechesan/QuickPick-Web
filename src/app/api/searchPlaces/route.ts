/**
 * route.ts - API pentru cautarea locatiilor pe baza unui prompt inteligent
 * 
 * Acest endpoint POST primeste un prompt text de la utilizator si returneaza o lista de locatii relevante.
 * Functii principale:
 *  - Preia promptul din body-ul cererii si valideaza existenta acestuia.
 *  - Daca userul este autentificat, salveaza promptul in istoricul personal (search_history).
 *  - Proceseaza promptul cu AI (parseUserPrompt) pentru a extrage categoria, specificatii si locatie.
 *  - Construieste query-ul pentru cautare folosind aceste informatii.
 *  - Cauta locatii relevante folosind Google Places API (fetchPlacesFromMaps).
 *  - Returneaza lista de locatii gasite sau mesaj de eroare.
 * Elemente cheie:
 *  - Integrare cu Supabase pentru autentificare si stocare istoric cautari.
 *  - Procesare prompt inteligenta cu AI (NLP).
 *  - Cautare dinamica pe Google Places pe baza unui query compus.
 *  - Gestionare robusta a erorilor si raspunsuri clare pentru client.
 */

import { NextRequest, NextResponse } from "next/server"; // Importa tipurile pentru request si response din Next.js
import { parseUserPrompt } from '@/utils/parseUserPrompt'; // Importa functia pentru procesarea promptului
import { fetchPlacesFromMaps } from "@/utils/fetchPlacesFromMaps"; // Importa functia pentru cautarea locatiilor pe Google Places
import { createClient } from "@/utils/supabase/server"; // Importa functia pentru initializarea clientului Supabase

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json(); // Extrage promptul din body-ul cererii
    // Verifica daca promptul exista
    if (!prompt) return NextResponse.json({ error: "Prompt is required" }, { status: 400 });

    // Creeaza clientul Supabase si ia userul curent
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // AICI adaugi logurile de debug:
    console.log("user:", user);
    console.log("user.id:", user?.id);

    // Daca userul este logat si exista prompt, salveaza cautarea in istoric
    if (user && prompt) {
     const { data, error } = await supabase
    .from("search_history")
    .insert([{ user_id: user.id, query: prompt }]);
    if (error) {
    console.error("Eroare la insert search_history:", error);
  }
    }

    // Proceseaza promptul cu AI pentru a extrage categoria, specificatii si locatie
    const { category, specifications, location } = await parseUserPrompt(prompt);

    // Construieste query-ul pentru cautare pe Google Places
    let query = category;
    if (specifications) query += ` ${specifications}`; // Adauga specificatii daca exista
    if (location) query += ` ${location}`; // Adauga locatie daca exista

    // Cauta locatii relevante folosind Google Places API
    const places = await fetchPlacesFromMaps({ query });

    // Returneaza lista de locatii gasite
    return NextResponse.json({ places });
  } catch (err: any) {
    // In caz de eroare, returneaza mesaj de eroare si status 500
    return NextResponse.json({ error: err.message || "Eroare interna" }, { status: 500 });
  }
}
