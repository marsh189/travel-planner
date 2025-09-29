import { TransformedLocation } from '@/app/globe/page';
import Link from 'next/link';

export default function TripGlobeItem({
  trips,
}: {
  trips: TransformedLocation[];
}) {
  return trips.map((trip: TransformedLocation, key) => (
    <div
      key={key}
      className="flex justify-between p-3 my-1 rounded-lg hover:bg-gray-100 transition-colors border border-gray-100 cursor-pointer justify-center"
    >
      <Link href={`/trips/${trip.tripId}`}>
        <h3>{trip.title}</h3>
      </Link>
    </div>
  ));
}
