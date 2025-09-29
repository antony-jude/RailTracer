"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Loader2, Train } from 'lucide-react';
import { findNearestStation, Station } from '@/lib/stations';

export function Geolocation() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [nearestStation, setNearestStation] = useState<{ station: Station, distance: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      const userLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      setLocation(userLocation);
      const nearest = findNearestStation(userLocation.latitude, userLocation.longitude);
      setNearestStation(nearest);
      setLoading(false);
      setError(null);
    };

    const handleError = (error: GeolocationPositionError) => {
      setLoading(false);
      switch(error.code) {
        case error.PERMISSION_DENIED:
          setError("User denied the request for Geolocation.");
          break;
        case error.POSITION_UNAVAILABLE:
          setError("Location information is unavailable.");
          break;
        case error.TIMEOUT:
          setError("The request to get user location timed out.");
          break;
        default:
          setError("An unknown error occurred.");
          break;
      }
    };

    const watcherId = navigator.geolocation.watchPosition(handleSuccess, handleError, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    });

    return () => {
      navigator.geolocation.clearWatch(watcherId);
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <MapPin className="text-primary" /> Current Location
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Fetching location...
          </div>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
        {location && (
          <div className="space-y-4">
            <div className="text-sm">
                <p>
                <span className="font-semibold">Latitude:</span> {location.latitude.toFixed(4)}
                </p>
                <p>
                <span className="font-semibold">Longitude:</span> {location.longitude.toFixed(4)}
                </p>
            </div>
            {nearestStation && (
                <div className="flex items-start gap-3 rounded-lg border bg-muted/50 p-3">
                    <Train className="h-5 w-5 mt-1 text-primary" />
                    <div>
                        <p className="font-semibold text-sm">Nearest Station</p>
                        <p className="text-sm text-primary font-bold">{nearestStation.station.name}</p>
                        <p className="text-xs text-muted-foreground">{nearestStation.distance.toFixed(2)} km away</p>
                    </div>
                </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
