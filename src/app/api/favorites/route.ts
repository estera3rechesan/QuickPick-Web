/**
 * route.ts - API pentru adaugarea unei locatii la favorite
 * 
 * Acest endpoint proceseaza cererile POST pentru a salva o locatie in lista de favorite a utilizatorului.
 * Functii principale:
 *  - Verifica daca utilizatorul este autentificat folosind Supabase.
 *  - Preia datele locatiei din body-ul cererii (place_id, name, address, etc).
 *  - Insereaza o noua inregistrare in tabela 'favorites' din baza de date.
 *  - Returneaza un raspuns JSON cu succes sau mesaj de eroare.
 * Elemente cheie:
 *  - Integrare cu Supabase pentru autentificare si insert in baza de date.
 *  - Validare autentificare user inainte de orice operatie.
 *  - Folosire Next.js API route cu NextRequest si NextResponse.
 */

import { NextRequest, NextResponse } from 'next/server'; // Importa tipurile pentru request si response din Next.js
import { createClient } from '@/utils/supabase/server'; // Importa functia pentru initializarea clientului Supabase

export async function POST(req: NextRequest) {
    const supabase = await createClient(); // Creeaza clientul Supabase (cu await pentru initializare corecta)
    const { data: { user } } = await supabase.auth.getUser(); // Preia userul curent din sesiune

    // Daca nu exista user logat, returneaza eroare 401
    if (!user) {
        return NextResponse.json({ error: 'Nu esti autentificat.' }, { status: 401 });
    }

    const body = await req.json(); // Parseaza body-ul cererii ca JSON
    // Extrage datele locatiei din body
    const { place_id, name, address, photo_reference, google_maps_url, website } = body;

    // Incearca sa inserezi locatia in tabela 'favorites'
    const { data, error } = await supabase
        .from('favorites')
        .insert([{
            user_id: user.id, // ID-ul userului
            place_id,         // ID-ul locatiei din Google Places
            name,             // Numele locatiei
            address,          // Adresa locatiei
            photo_reference,  // Referinta poza (optional)
            google_maps_url,  // Link Google Maps (optional)
            website,          // Site oficial (optional)
        }]);

    // Daca apare o eroare la insert, returneaza eroare 500
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Daca totul este ok, returneaza succes si datele inserate
    return NextResponse.json({ success: true, data });
}
