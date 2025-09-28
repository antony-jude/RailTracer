"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Loader2 } from 'lucide-react';

export function Geolocation() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoading(false);
      },
      () => {
        setError('Unable to retrieve your location. Please enable location services.');
        setLoading(false);
      }
    );
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <MapPin className="text-accent" /> Current Location
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
          <div className="text-sm">
            <p>
              <span className="font-semibold">Latitude:</span> {location.latitude.toFixed(4)}
            </p>
            <p>
              <span className="font-semibold">Longitude:</span> {location.longitude.toFixed(4)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
