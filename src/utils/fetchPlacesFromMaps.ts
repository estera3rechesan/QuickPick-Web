import axios from 'axios';

export interface PlaceResult {
  place_id: string;
  name: string;
  address: string;
  rating?: number;
  price_level?: number;
  types?: string[];
  user_ratings_total?: number;
  location: { lat: number; lng: number };
  photo_reference?: string;
}

export interface FetchPlacesOptions {
  query: string; // ex: "restaurant italian"
  location?: { lat: number; lng: number }; // opțional, pentru căutare localizată
  radius?: number; // în metri, ex: 3000 pentru 3km
  minRating?: number; // ex: 4.0
  maxPriceLevel?: number; // 0 (ieftin) - 4 (scump)
}

export async function fetchPlacesFromMaps(options: FetchPlacesOptions): Promise<PlaceResult[]> {
  const { query, location, radius = 3000, minRating = 0, maxPriceLevel } = options;
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) throw new Error('GOOGLE_PLACES_API_KEY is not set in .env.local');

  // Construiește URL-ul pentru Places Text Search
  let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`;
  if (location) {
    url += `&location=${location.lat},${location.lng}&radius=${radius}`;
  }

  // Apelează API-ul
  const response = await axios.get(url);
  const results = response.data.results as any[];

  // Filtrare după rating și preț
  let filtered = results.filter((place) => {
    const ratingOK = !minRating || (place.rating && place.rating >= minRating);
    const priceOK = maxPriceLevel === undefined || (place.price_level !== undefined && place.price_level <= maxPriceLevel);
    return ratingOK && priceOK;
  });

  // Mapare la structura proprie
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
  }));
}
