import { auth } from '@/auth';
import TripDetailClient, { TripWithLocation } from '@/components/TripDetails';
import { prisma } from '@/lib/prisma';

export default async function TripDetail({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;

  const session = await auth();

  if (!session) {
    return <div>Please Sign In</div>;
  }
  const trip = await prisma.trip.findFirst({
    where: { id: tripId, userId: session.user?.id },
    include: { locations: true },
  });

  if (!trip) {
    return <div>Trip Not Found</div>;
  }

  return <TripDetailClient trip={trip} />;
}
