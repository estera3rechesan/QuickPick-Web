import axios from "axios";

export interface ParsedPrompt {
  category: string;
  specifications: string;
  location: string;
}

export async function parseUserPromptPerplexity(prompt: string): Promise<ParsedPrompt> {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) throw new Error("PERPLEXITY_API_KEY is missing!");

  const response = await axios.post(
    "https://api.perplexity.ai/chat/completions",
    {
      model: "sonar-medium-online", // sau "sonar-small-online", vezi ce model ai acces
      messages: [
        {
          role: "system",
          content: "You are an assistant that extracts category, specifications, and location from a user prompt. Return only a JSON object with keys: category, specifications, location.",
        },
        {
          role: "user",
          content: `Extract the category, specifications, and location from this prompt: "${prompt}".`,
        },
      ],
      max_tokens: 300,
      temperature: 0.2,
    },
    {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    }
  );

  // Perplexity returnează răspunsul în choices[0].message.content
  const content = response.data?.choices?.[0]?.message?.content;
  if (!content) throw new Error("No response from Perplexity");

  try {
    return JSON.parse(content) as ParsedPrompt;
  } catch {
    throw new Error("Failed to parse Perplexity response as JSON");
  }
}
