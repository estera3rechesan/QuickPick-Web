/**
 * parseUserPrompt.ts - Functie utilitara pentru interpretarea promptului utilizatorului cu AI
 * 
 * Acest fisier exporta functia parseUserPrompt care foloseste un model AI (OpenRouter, GPT-3.5-turbo) pentru a extrage informatii structurate dintr-un prompt text.
 * Functii principale:
 *  - Trimite promptul utilizatorului catre API-ul OpenRouter (GPT-3.5-turbo) cu instructiuni clare pentru extragerea categoriei, specificatiilor si locatiei.
 *  - Primeste un raspuns JSON cu cheile: category, specifications, location.
 *  - Intoarce un obiect ParsedPrompt cu aceste informatii, sau arunca eroare daca raspunsul nu este valid.
 * Elemente cheie:
 *  - Integrare cu OpenRouter API si modelul AI pentru NLP.
 *  - Parsare si validare robusta a raspunsului AI.
 *  - Structura standardizata pentru rezultate (ParsedPrompt).
 */

import axios from "axios"; // Importa axios pentru requesturi HTTP

// Tipul rezultatului dupa parsarea promptului
export interface ParsedPrompt {
  category: string; // Categoria extrasa din prompt
  specifications: string; // Specificatii suplimentare extrase
  location: string; // Locatia extrasa
}

// Functia principala pentru parsarea promptului cu AI
export async function parseUserPrompt(prompt: string): Promise<ParsedPrompt> {
  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "openai/gpt-3.5-turbo", // Modelul AI folosit
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
      temperature: 0.2 // Temperature mica pentru raspunsuri consistente
    },
    {
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`, // Cheia API OpenRouter
        "Content-Type": "application/json",
        "HTTP-Referer": "https://your-domain.com", // Optional, pentru tracking
        "X-Title": "QuickPick" // Optional, pentru identificare
      }
    }
  );

  const content = response.data.choices[0]?.message?.content; // Extrage continutul raspunsului AI
  if (!content) throw new Error("Nu am primit raspuns de la API"); // Eroare daca nu exista continut

  try {
    return JSON.parse(content) as ParsedPrompt; // Parseaza si returneaza obiectul ParsedPrompt
  } catch {
    throw new Error("Raspuns invalid de la AI"); // Eroare la parsare JSON
  }
}
