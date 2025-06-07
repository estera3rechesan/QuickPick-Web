/**
 * client.ts - Functie pentru initializarea clientului Supabase in browser
 * 
 * Acest fisier exporta o functie care creeaza si returneaza un client Supabase configurat pentru mediul browser.
 * Functii principale:
 *  - Foloseste createBrowserClient din @supabase/ssr pentru a crea un client compatibil SSR/browser.
 *  - Citeste URL-ul si cheia anonima din variabilele de mediu (.env.local).
 * Elemente cheie:
 *  - Initializare rapida si sigura a clientului Supabase pentru interactiunea cu baza de date din frontend.
 *  - Cheile sunt preluate din variabilele de mediu pentru securitate si flexibilitate.
 */

import { createBrowserClient } from '@supabase/ssr'; // Importa functia pentru client browser Supabase

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, // URL-ul Supabase din .env.local
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Cheia anonima din .env.local
  );
}
// Creeaza o functie care returneaza un client Supabase configurat pentru browser, folosind cheile tale din .env.local
