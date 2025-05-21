import axios from "axios";

export interface ParsedPrompt {
  category: string;
  specifications: string;
  location: string;
}

export async function parseUserPrompt(prompt: string): Promise<ParsedPrompt> {
  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "openai/gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Extrage categoria, specificațiile și locația din promptul utilizatorului. Returnează doar un JSON cu cheile: category, specifications, location."
        },
        {
          role: "user",
          content: `Extrage informațiile din: "${prompt}"`
        }
      ],
      temperature: 0.2
    },
    {
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://your-domain.com", // Opțional
        "X-Title": "QuickPick" // Opțional
      }
    }
  );

  const content = response.data.choices[0]?.message?.content;
  if (!content) throw new Error("Nu am primit răspuns de la API");

  try {
    return JSON.parse(content) as ParsedPrompt;
  } catch {
    throw new Error("Răspuns invalid de la AI");
  }
}
