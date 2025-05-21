import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ParsedPrompt {
  category: string;
  specifications: string;
  location: string;
}

export async function parseUserPrompt(prompt: string): Promise<ParsedPrompt> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4', // sau 'gpt-4', dacă nu ai acces la gpt-4o
    messages: [
      {
        role: 'system',
        content: 'You are an assistant that extracts category, specifications, and location from a user prompt.',
      },
      {
        role: 'user',
        content: `Extract the category, specifications, and location from this prompt: "${prompt}". Return a JSON object with keys: category, specifications, location.`,
      },
    ],
    temperature: 0.2,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('No response from OpenAI');

  try {
    return JSON.parse(content) as ParsedPrompt;
  } catch {
    throw new Error('Failed to parse OpenAI response as JSON');
  }
}
