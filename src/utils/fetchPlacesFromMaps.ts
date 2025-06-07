/**
 * fetchPlacesFromMaps.ts - Functie utilitara pentru cautarea locatiilor cu Google Places API
 * 
 * Acest fisier exporta functia fetchPlacesFromMaps care cauta locatii relevante pe baza unui query text, folosind Google Places Text Search si Details API.
 * Functii principale:
 *  - Trimite un request catre Google Places Text Search API cu query-ul si (optional) coordonatele si raza.
 *  - Pentru fiecare rezultat, ia detalii suplimentare (website, url) folosind Google Places Details API.
 *  - Filtreaza rezultatele dupa rating si nivel de pret (daca sunt specificate).
 *  - Returneaza o lista de obiecte PlaceResult cu date standardizate pentru afisare in aplicatie.
 * Elemente cheie:
 *  - Integrare cu Google Places API (Text Search + Details).
 *  - Filtrare avansata dupa rating si pret.
 *  - Mapare consistenta a rezultatelor pentru UI.
 */

import axios from 'axios'; // Importa axios pentru requesturi HTTP

// Tipul rezultatului pentru o locatie
export interface PlaceResult {
  place_id: string; // ID-ul locatiei din Google Places
  name: string; // Numele locatiei
  address: string; // Adresa locatiei
  rating?: number; // Ratingul locatiei (optional)
  price_level?: number; // Nivelul de pret (optional)
  types?: string[]; // Tipuri de locatie (optional)
  user_ratings_total?: number; // Numar total de recenzii (optional)
  location: { lat: number; lng: number }; // Coordonatele locatiei
  photo_reference?: string; // Referinta pentru poza locatiei (optional)
  website?: string; // Website oficial (optional)
  googleMapsUrl: string; // URL Google Maps al locatiei
}

// Optiuni pentru cautare
export interface FetchPlacesOptions {
  query: string; // Textul cautat
  location?: { lat: number; lng: number }; // Coordonate pentru cautare (optional)
  radius?: number; // Raza de cautare in metri (optional, default 3000)
  minRating?: number; // Rating minim (optional, default 0)
  maxPriceLevel?: number; // Nivel maxim de pret (optional)
}

// Functia principala pentru cautare locatii cu Google Places
export async function fetchPlacesFromMaps(options: FetchPlacesOptions): Promise<PlaceResult[]> {
  const { query, location, radius = 3000, minRating = 0, maxPriceLevel } = options;
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

  if (!apiKey) throw new Error('NEXT_PUBLIC_GOOGLE_PLACES_API_KEY is not set'); // Verifica existenta cheii API

  // Creeaza URL-ul pentru Text Search
  let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`;
  if (location) url += `&location=${location.lat},${location.lng}&radius=${radius}`;

  const response = await axios.get(url); // Trimite request catre Text Search API
  const results = response.data.results; // Extrage rezultatele

  // Pentru fiecare locatie, ia detalii suplimentare (website, url) cu Details API
  const placesWithDetails = await Promise.all(
    results.map(async (place: any) => {
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=website,url&key=${apiKey}`;
      const detailsResponse = await axios.get(detailsUrl);

      return {
        ...place,
        website: detailsResponse.data.result?.website,
        googleMapsUrl: detailsResponse.data.result?.url || `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
      };
    })
  );

  // Filtreaza rezultatele dupa rating si pret
  const filtered = placesWithDetails.filter((place) => {
    const ratingOK = place.rating >= minRating;
    const priceOK = maxPriceLevel === undefined || (place.price_level <= maxPriceLevel);
    return ratingOK && priceOK;
  });

  // Mapare rezultate la structura standardizata PlaceResult
  return filtered.map((place) => ({
    place_id: place.place_id,
    name: place.name,
    address: place.formatted_address,
    rating: place.rating,
    price_level: place.price_level,
    types: place.types,
    user_ratings_total: place.user_ratings_total,
    location: place.geometry.location,
    photo_reference: place.photos?.[0]?.photo_reference,
    website: place.website,
    googleMapsUrl: place.googleMapsUrl,
  }));
}
