/**
 * route.ts - API pentru sumarizarea recenziilor Google Places cu ajutorul AI
 * 
 * Acest endpoint POST primeste un place_id si returneaza un rezumat AI al recenziilor Google pentru acea locatie.
 * Functii principale:
 *  - Valideaza existenta place_id in body-ul cererii.
 *  - Preia primele 5 recenzii de la Google Places Details API pentru locatia respectiva.
 *  - Trimite recenziile la un model AI (OpenRouter, GPT-3.5-turbo) pentru a genera un sumar obiectiv cu puncte forte si dezavantaje.
 *  - Returneaza rezumatul generat sau un mesaj de eroare daca nu exista recenzii sau apare o problema.
 * Elemente cheie:
 *  - Integrare cu Google Places API pentru extragerea recenziilor.
 *  - Prompt AI specializat pentru sumarizare profesionala, obiectiva.
 *  - Folosire variabile de mediu pentru chei API.
 *  - Gestionare robusta a erorilor si raspunsuri clare pentru client.
 */

import { NextRequest, NextResponse } from "next/server"; // Importa tipurile pentru request si response din Next.js

export async function POST(req: NextRequest) {
  try {
    const { place_id } = await req.json(); // Extrage place_id din body-ul cererii
    // Verifica daca place_id exista
    if (!place_id) {
      return NextResponse.json({ summary: "ID-ul locatiei lipseste." }, { status: 400 });
    }

    // Preia recenziile de la Google Places Details API
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY; // Cheia API din variabile de mediu
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=reviews&key=${apiKey}`; // URL pentru detalii locatie
    const detailsRes = await fetch(detailsUrl); // Trimite request catre Google Places
    const details = await detailsRes.json(); // Parseaza raspunsul ca JSON
    // Extrage recenziile (maxim 5, doar textul, maxim 200 caractere fiecare)
    const reviews = details.result?.reviews || [];
    const reviewTexts: string[] = reviews.slice(0, 5).map((r: any) => r.text?.slice(0, 200)).filter(Boolean);

    // Daca nu exista recenzii, returneaza mesaj informativ
    if (!reviewTexts.length) {
      return NextResponse.json({ summary: "Nu exista suficiente recenzii pentru aceasta locatie." }, { status: 200 });
    }

    // Creeaza promptul pentru AI cu instructiuni clare
    const prompt = `
      Rezuma urmatoarele recenzii Google pentru aceasta locatie.
      - Ofera o lista cu principalele puncte forte mentionate de clienti.
      - Ofera o lista cu principalele dezavantaje mentionate de clienti.
      Scrie raspunsul intr-un stil obiectiv si profesional, sub forma:
      Conform opiniilor fostilor clienti:
      - Puncte forte: ...
      - Dezavantaje: ...
      Recenzii:
      ${reviewTexts.map((r: string, i: number) => `${i + 1}. "${r}"`).join("\n")}
    `;

    // Trimite promptul si recenziile la AI (OpenRouter, GPT-3.5-turbo)
    const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`, // Cheia API pentru OpenRouter
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo", // Modelul folosit pentru sumarizare
        messages: [{ role: "user", content: prompt }], // Mesajul userului catre AI
        temperature: 0.3, // Temperature mica pentru raspunsuri consistente
      }),
    });
    const aiData = await aiRes.json(); // Parseaza raspunsul AI ca JSON
    // Extrage continutul sumarului din raspunsul AI
    const summary = aiData.choices?.[0]?.message?.content || "Nu s-a putut genera rezumatul recenziilor.";
    return NextResponse.json({ summary }); // Returneaza sumarul catre client
  } catch (e: any) {
    // In caz de eroare, returneaza mesaj standard
    return NextResponse.json({ summary: "Nu s-a putut genera rezumatul recenziilor." }, { status: 500 });
  }
}
