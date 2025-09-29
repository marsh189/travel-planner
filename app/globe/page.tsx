'use client';

import TripGlobeItem from '@/components/TripGlobeItem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, MapPin } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';

export interface TransformedLocation {
  lat: number;
  lng: number;
  name: string;
  title: string;
  tripId: string;
  country: string;
}

export default function GlobePage() {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);

  const [locations, setLocations] = useState<TransformedLocation[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [showCountryTrips, setShowCountryTrips] = useState<string>('');

  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.5;
    }
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('/api/trips');
        const data = await response.json();

        setLocations(data);
      } catch (err) {
        console.error('error', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const tripsByCountry: { country: string; trips: TransformedLocation[] }[] =
    [];

  locations.forEach((loc: TransformedLocation) => {
    let countryObj = tripsByCountry.find(
      (item) => item.country === loc.country
    );
    if (!countryObj) {
      tripsByCountry.push({ country: loc.country, trips: [loc] });
    } else {
      tripsByCountry.find((item, index) => {
        if (
          !item.trips.find((l: TransformedLocation) => l.tripId === loc.tripId)
        ) {
          if (item.country === loc.country) {
            tripsByCountry[index] = {
              country: loc.country,
              trips: [...tripsByCountry[index].trips, loc],
            };
          }
        }
      });
    }
  });

  const handleCountryClick = (country: string) => {
    if (showCountryTrips === country) {
      setShowCountryTrips('');
    } else {
      setShowCountryTrips(country);
    }
  };

  console.log(tripsByCountry);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-center text-4xl font-bold mb-12">Your Travels</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">
                  Check Out Where You Have Been!
                </h2>
                <div className="h-[600px] w-full relative">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                    </div>
                  ) : (
                    <Globe
                      ref={globeRef}
                      globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                      bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                      backgroundColor="rgba(0,0,0,0)"
                      pointColor={() => '#FF5733'}
                      pointLabel="name"
                      pointsData={locations}
                      pointRadius={0.5}
                      pointAltitude={0.1}
                      pointsMerge={true}
                      width={800}
                      height={600}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <Card className="sticky-top-8">
                <CardHeader>
                  <CardTitle>Countries Visited</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-800">
                          You've Visited{' '}
                          <span className="font-bold">
                            {tripsByCountry.length}
                          </span>{' '}
                          countries.
                        </p>
                      </div>
                      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                        {tripsByCountry.sort().map((item, key) => (
                          <div key={key}>
                            <div
                              className="flex justify-between p-3 rounded-lg hover:bg-gray-100 transition-colors border border-gray-100 cursor-pointer"
                              onClick={() => {
                                handleCountryClick(item.country);
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-red-500" />
                                <span className="font-medium">
                                  {item.country}
                                </span>
                              </div>
                              <ChevronDown />
                            </div>
                            {showCountryTrips === item.country && (
                              <div className="mx-4">
                                <TripGlobeItem trips={item.trips} />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
