import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { place_id } = await req.json();
    if (!place_id) {
      return NextResponse.json({ summary: "ID-ul locatiei lipseste." }, { status: 400 });
    }

    //Preia recenziile pentru locatia specificata folosind Google Places API
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=reviews&key=${apiKey}`;
    const detailsRes = await fetch(detailsUrl);
    const details = await detailsRes.json();
    const reviews = details.result?.reviews || [];
    const reviewTexts: string[] = reviews.slice(0, 5).map((r: any) => r.text?.slice(0, 200)).filter(Boolean);

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
      ${reviewTexts.map((r: string, i: number) => `${i + 1}. "${r}"`).join("\n")}
    `;

    // Trimite promptul si recenziile la AI (OpenRouter, GPT-3.5-turbo)
    const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-haiku",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      }),
    });
    const aiData = await aiRes.json();
    const summary = aiData.choices?.[0]?.message?.content || "Nu s-a putut genera rezumatul recenziilor.";
    return NextResponse.json({ summary });
  } catch (e: any) {
    return NextResponse.json({ summary: "Nu s-a putut genera rezumatul recenziilor." }, { status: 500 });
  }
}
