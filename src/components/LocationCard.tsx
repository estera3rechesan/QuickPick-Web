import Image from "next/image";

export interface LocationCardProps {
  name: string;
  address: string;
  rating?: number;
  price_level?: number;
  types?: string[];
  user_ratings_total?: number;
  photo_reference?: string;
  googleMapsUrl?: string;
}

export default function LocationCard(props: LocationCardProps) {
  const {
    name,
    address,
    rating,
    price_level,
    user_ratings_total,
    photo_reference,
    googleMapsUrl,
  } = props;

  // Pentru poze, construiește URL-ul dacă ai photo_reference
  const photoUrl = photo_reference
    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo_reference}&key=${process.env.GOOGLE_PLACES_API_KEY}`
    : "/placeholder.png";

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
        <h3 className="text-xl font-bold text-[#353935]">{name}</h3>
        <p className="text-[#353935] text-sm mb-2">{address}</p>
        <div className="flex items-center gap-3 mb-2">
          {rating && (
            <span className="text-[#89AC46] font-bold">
              ★ {rating} ({user_ratings_total})
            </span>
          )}
          {price_level !== undefined && (
            <span className="text-[#FF8787]">
              {"€".repeat(price_level + 1)}
            </span>
          )}
        </div>
        {googleMapsUrl && (
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#89AC46] underline hover:text-[#353935] text-sm"
          >
            Vezi pe Google Maps
          </a>
        )}
      </div>
    </div>
  );
}
