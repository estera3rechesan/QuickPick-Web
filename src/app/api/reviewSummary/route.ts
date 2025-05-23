import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { place_id } = await req.json();
    if (!place_id) {
      return NextResponse.json({ summary: "ID-ul locației lipsește." }, { status: 400 });
    }

    // Ia review-urile de la Google Places Details
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=reviews&key=${apiKey}`;
    const detailsRes = await fetch(detailsUrl);
    const details = await detailsRes.json();
    const reviews = details.result?.reviews || [];
    const reviewTexts: string[] = reviews.slice(0, 5).map((r: any) => r.text?.slice(0, 200)).filter(Boolean);

    if (!reviewTexts.length) {
      return NextResponse.json({ summary: "Nu există suficiente recenzii pentru această locație." }, { status: 200 });
    }

    // Trimite la AI (OpenRouter)
    const prompt = `
      Rezumă următoarele recenzii Google pentru această locație.
      - Oferă o listă cu principalele puncte forte menționate de clienți.
      - Oferă o listă cu principalele dezavantaje menționate de clienți.
      Scrie răspunsul într-un stil obiectiv și profesional, sub forma:
      Conform opiniilor foștilor clienți:
      - Puncte forte: ...
      - Dezavantaje: ...
      Recenzii:
      ${reviewTexts.map((r: string, i: number) => `${i + 1}. "${r}"`).join("\n")}
    `;

    const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
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
