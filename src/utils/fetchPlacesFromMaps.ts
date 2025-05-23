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
  website?: string;
  googleMapsUrl: string;
}

export interface FetchPlacesOptions {
  query: string;
  location?: { lat: number; lng: number };
  radius?: number;
  minRating?: number;
  maxPriceLevel?: number;
}

export async function fetchPlacesFromMaps(options: FetchPlacesOptions): Promise<PlaceResult[]> {
  const { query, location, radius = 3000, minRating = 0, maxPriceLevel } = options;
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

  if (!apiKey) throw new Error('NEXT_PUBLIC_GOOGLE_PLACES_API_KEY is not set');

  // Text Search request
  let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`;
  if (location) url += `&location=${location.lat},${location.lng}&radius=${radius}`;

  const response = await axios.get(url);
  const results = response.data.results;

  // Get details for each place (doar website și url)
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

  // Filtrare
  const filtered = placesWithDetails.filter((place) => {
    const ratingOK = place.rating >= minRating;
    const priceOK = maxPriceLevel === undefined || (place.price_level <= maxPriceLevel);
    return ratingOK && priceOK;
  });

  // Mapare rezultate
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
