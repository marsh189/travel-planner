import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function TripsPage() {
  const session = await auth();

  if (!session) {
    return (
      <div className="flex justifty-center items-center h-screen text-gray-700 text-xl">
        Please Sign In.
      </div>
    );
  }

  const trips = await prisma.trip.findMany({
    where: { userId: session.user?.id },
  });

  const sortedTrips = [...trips].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingTrips = sortedTrips.filter(
    (trip) => new Date(trip.startDate) >= today
  );

  const prevTrips = sortedTrips.filter(
    (trip) => new Date(trip.startDate) < today
  );

  return (
    <div className="space-y-6 container mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Link href={'/trips/new'}>
          <Button>New Trip</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Welcome Back, {session.user?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            {trips.length == 0
              ? 'Start planning your first trip now!'
              : `You have ${upcomingTrips.length} ${
                  upcomingTrips.length == 1 ? 'trip' : 'trips'
                } planned!`}
          </p>
        </CardContent>
      </Card>

      <div>
        {trips.length == 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <h3 className="text-xl font-medium mb-2">No Trips Planned.</h3>
              <Link href={'/trips/new'}>
                <Button>Create My First Trip</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-4">Upcoming Trips</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
              {upcomingTrips.slice(0, 6).map((trip, key) => (
                <Link key={key} href={`/trips/${trip.id}`}>
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="line-clamp-1 pb-2">
                        {trip.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm line-clamp-2 mb-2">
                        {trip.description}
                      </p>
                      <div className="text-sm">
                        {new Date(trip.startDate).toLocaleDateString()} -
                        {new Date(trip.endDate).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            <h2 className="text-xl font-semibold mb-4">Previous Trips</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {prevTrips.slice(0, 6).map((trip, key) => (
                <Link key={key} href={`/trips/${trip.id}`}>
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="line-clamp-1 pb-2">
                        {trip.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm line-clamp-2 mb-2">
                        {trip.description}
                      </p>
                      <div className="text-sm">
                        {new Date(trip.startDate).toLocaleDateString()} -
                        {new Date(trip.endDate).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
