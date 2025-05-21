import Image from "next/image";

export interface LocationCardProps {
  name: string;
  address: string;
  rating?: number;
  price_level?: number;
  types?: string[];
  user_ratings_total?: number;
  photo_reference?: string;
  googleMapsUrl: string;
  website?: string;
}

export default function LocationCard(props: LocationCardProps) {
  const { name, address, rating, price_level, user_ratings_total, photo_reference, googleMapsUrl, website } = props;

  // Generare URL imagine
  const photoUrl = photo_reference
    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}`
    : "/placeholder.png";

  // Verificare linkuri valide
  const isValidUrl = (url?: string) => url && (url.startsWith('http://') || url.startsWith('https://'));

  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col sm:flex-row gap-4 items-center">
      <div className="w-28 h-28 rounded-lg overflow-hidden flex-shrink-0 bg-[#FFECEC] flex items-center justify-center">
        <Image
          src={photoUrl}
          alt={name}
          width={112}
          height={112}
          className="object-cover"
        />
      </div>
      
      <div className="flex-1">
        {/* Nume cu link */}
        {isValidUrl(website) ? (
          <a href={website} target="_blank" rel="noopener noreferrer" className="text-xl font-bold text-[#353935] hover:text-[#FF8787] transition">
            {name}
          </a>
        ) : (
          <h3 className="text-xl font-bold text-[#353935]">{name}</h3>
        )}

        <p className="text-[#353935] text-sm mb-2">{address}</p>

        <div className="flex items-center gap-3 mb-2">
          {rating && (
            <span className="text-[#89AC46] font-bold">
              ★ {rating} ({user_ratings_total?.toLocaleString()})
            </span>
          )}
          
          {price_level !== undefined && (
            <span className="text-[#FF8787]">
              {getPriceRange(price_level)}
            </span>
          )}
        </div>

        {/* Linkuri */}
        <div className="flex gap-4">
          {isValidUrl(website) && (
            <a href={website} target="_blank" rel="noopener noreferrer" className="text-[#89AC46] underline hover:text-[#353935] text-sm">
              Website oficial
            </a>
          )}
          
          {isValidUrl(googleMapsUrl) && (
            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-[#89AC46] underline hover:text-[#353935] text-sm">
              Vezi pe Google Maps
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// Actualizare pentru lei
function getPriceRange(priceLevel: number): string {
  switch (priceLevel) {
    case 0: return "Gratis";
    case 1: return "10-30 lei";
    case 2: return "30-60 lei";
    case 3: return "60-100 lei";
    case 4: return "100+ lei";
    default: return "";
  }
}
