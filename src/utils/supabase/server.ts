/**
 * server.ts - Functie pentru initializarea clientului Supabase pe server (SSR)
 * 
 * Acest fisier exporta o functie asincrona care creeaza si returneaza un client Supabase configurat pentru mediul server-side (SSR).
 * Functii principale:
 *  - Foloseste createServerClient din @supabase/ssr pentru a crea un client compatibil cu Next.js pe server.
 *  - Preia cookie-urile din contextul Next.js pentru autentificare persistenta si sesiuni.
 *  - Citeste URL-ul si cheia anonima din variabilele de mediu (.env.local).
 * Elemente cheie:
 *  - Integrare cu cookies pentru a mentine sesiunea utilizatorului pe server.
 *  - Initializare sigura a clientului Supabase pentru operatii SSR/API.
 */

import { createServerClient } from '@supabase/ssr'; // Importa functia pentru client server Supabase
import { cookies } from 'next/headers'; // Importa utilitarul pentru accesarea cookie-urilor in Next.js

export async function createClient() {
  const cookieStore = await cookies(); // Ia toate cookie-urile disponibile (await este obligatoriu)

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, // URL-ul Supabase din .env.local
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // Cheia anonima din .env.local
    {
      cookies: {
        getAll() {
          return cookieStore.getAll(); // Returneaza toate cookie-urile pentru sesiune
        },
      },
    }
  );
}
