import axios from "axios";

export interface ParsedPrompt {
  category: string;
  specifications: string;
  location: string;
}

// Functia principala pentru procesarea promptului cu AI
export async function parseUserPrompt(prompt: string): Promise<ParsedPrompt> {
  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "openai/gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Extrage categoria, specificatiile si locatia din promptul utilizatorului. Returneaza doar un JSON cu cheile: category, specifications, location."
        },
        {
          role: "user",
          content: `Extrage informatiile din: "${prompt}"`
        }
      ],
      temperature: 0.2
    },
    {
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://your-domain.com",
        "X-Title": "QuickPick"
      }
    }
  );

  const content = response.data.choices[0]?.message?.content;
  if (!content) throw new Error("Nu am primit raspuns de la API");

  try {
    return JSON.parse(content) as ParsedPrompt;
  } catch {
    throw new Error("Raspuns invalid de la AI");
  }
}
