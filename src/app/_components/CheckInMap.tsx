'use client';
import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Circle, useMap, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

type CheckinStatus = "idle" | "locating" | "checking" | "success" | "error" | "out_of_range" | "you_are_already_checked_in";

function TrackUser({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();
  useEffect(() => { map.panTo([lat, lon], { animate: true, duration: 0.5 }); }, [lat, lon]);
  return null;
}

interface CheckInMapProps {
  eventLat: number;
  eventLon: number;
  userLat: number | null;
  userLon: number | null;
  radiusMeters: number;
  status: CheckinStatus;
}

const circleColor = (status: CheckinStatus) => {
  if (status === 'success' || status === 'you_are_already_checked_in') return '#34d399'; // emerald
  if (status === 'out_of_range') return '#f87171'; // red
  return '#3b82f6'; // blue default
};

export default function CheckInMap({ eventLat, eventLon, userLat, userLon, radiusMeters, status }: CheckInMapProps) {
  const color = circleColor(status);

  return (
    <MapContainer
      center={[eventLat, eventLon]}
      zoom={17}
      style={{ height: '220px', width: '100%', borderRadius: '16px' }}
      scrollWheelZoom={false}
      zoomControl={false}
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {/* Geofence circle — color reflects check-in status */}
      <Circle
        center={[eventLat, eventLon]}
        radius={radiusMeters}
        pathOptions={{
          color,
          fillColor: color,
          fillOpacity: 0.15,
          weight: 2,
        }}
      />

      {/* User's live position — blue pulsing dot */}
      {userLat !== null && userLon !== null && (
        <>
          <TrackUser lat={userLat} lon={userLon} />
          <CircleMarker
            center={[userLat, userLon]}
            radius={6}
            pathOptions={{ color: '#fff', fillColor: '#3b82f6', fillOpacity: 1, weight: 2 }}
          />
        </>
      )}
    </MapContainer>
  );
}