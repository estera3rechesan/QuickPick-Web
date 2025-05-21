import LocationCard, { LocationCardProps } from "./LocationCard";

interface ResultsListProps {
  places: LocationCardProps[];
}

export default function ResultsList({ places }: ResultsListProps) {
  if (!places.length) {
    return <p className="text-[#353935] text-center mt-8">Nu am găsit rezultate relevante.</p>;
  }

  return (
    <div className="flex flex-col gap-6 mt-8">
      {places.map((place, idx) => (
        <LocationCard key={place.name + idx} {...place} />
      ))}
    </div>
  );
}
