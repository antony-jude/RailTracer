export interface Station {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

export const stations: Station[] = [
  { id: 'NDLS', name: 'New Delhi Railway Station', latitude: 28.6428, longitude: 77.2219 },
  { id: 'CSTM', name: 'Chhatrapati Shivaji Maharaj Terminus, Mumbai', latitude: 18.9403, longitude: 72.8355 },
  { id: 'HWH', name: 'Howrah Junction, Kolkata', latitude: 22.5832, longitude: 88.3426 },
  { id: 'MAS', name: 'Chennai Central', latitude: 13.0827, longitude: 80.2707 },
  { id: 'SBC', name: 'Bengaluru City Junction', latitude: 12.9767, longitude: 77.5663 },
  { id: 'HYB', name: 'Hyderabad Deccan Nampally', latitude: 17.3984, longitude: 78.4604 },
  { id: 'PUNE', name: 'Pune Junction', latitude: 18.5293, longitude: 73.8734 },
  { id: 'ADI', name: 'Ahmedabad Junction', latitude: 23.0225, longitude: 72.5714 },
  { id: 'JP', name: 'Jaipur Junction', latitude: 26.9124, longitude: 75.7873 },
  { id: 'LKO', name: 'Lucknow Charbagh', latitude: 26.8286, longitude: 80.9218 },
];

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

export function findNearestStation(userLat: number, userLon: number): { station: Station, distance: number } {
  let closestStation = stations[0];
  let minDistance = getDistanceFromLatLonInKm(userLat, userLon, stations[0].latitude, stations[0].longitude);

  for (let i = 1; i < stations.length; i++) {
    const distance = getDistanceFromLatLonInKm(userLat, userLon, stations[i].latitude, stations[i].longitude);
    if (distance < minDistance) {
      minDistance = distance;
      closestStation = stations[i];
    }
  }

  return { station: closestStation, distance: minDistance };
}
