/**
 * route.ts - API pentru procesarea prompturilor text introduse de utilizator
 * 
 * Acest endpoint proceseaza cererile POST pentru a interpreta promptul text dat de utilizator.
 * Functii principale:
 *  - Preia promptul din body-ul cererii si valideaza tipul acestuia.
 *  - Apeleaza functia utilitara parseUserPrompt pentru a interpreta promptul (extragere intentii, locatii, timp etc).
 *  - Returneaza rezultatul procesarii sau un mesaj de eroare daca apare o problema.
 * Elemente cheie:
 *  - Validare prompt (sa existe si sa fie string).
 *  - Integrare cu functia utilitara parseUserPrompt pentru logica de NLP.
 *  - Gestionare erori cu try/catch si raspunsuri HTTP corespunzatoare.
 */

import { NextRequest, NextResponse } from 'next/server'; // Importa tipurile pentru request si response din Next.js
import { parseUserPrompt } from '@/utils/parseUserPrompt'; // Importa functia de procesare prompturi

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json(); // Extrage promptul din body-ul cererii
    // Valideaza ca promptul exista si este string
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required and must be a string' }, { status: 400 });
    }

    const parsed = await parseUserPrompt(prompt); // Proceseaza promptul cu functia utilitara

    return NextResponse.json(parsed); // Returneaza rezultatul procesarii
  } catch (error: any) {
    // Daca apare o eroare, returneaza mesaj de eroare si status 500
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
