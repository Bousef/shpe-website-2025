'use client';
import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMap, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FaLocationPin } from "react-icons/fa6";
import { renderToStaticMarkup } from 'react-dom/server';

// Fix Leaflet's broken default icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function FlyTo({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();
  useEffect(() => { map.flyTo([lat, lon], 17, { animate: true, duration: 1 }); }, [lat, lon]);
  return null;
}

interface MapWithPinProps {
  lat: number;
  lon: number;
  radiusMeters?: number;
  onDragEnd: (lat: number, lon: number) => void;
}

const redIcon =L.divIcon({
    className:"",
    html: renderToStaticMarkup(
        <FaLocationPin color="#001F5B" size={42}/>
    ),
    iconSize: [42,42],
    iconAnchor: [21,40],

});

export default function MapWithPin({ lat, lon, radiusMeters = 50, onDragEnd }: MapWithPinProps) {
  const markerRef = useRef<L.Marker | null>(null);

  return (
    <MapContainer
      center={[lat, lon]}
      zoom={17}
      style={{ height: '300px', width: '100%', borderRadius: '12px' }}
      scrollWheelZoom={false}
      className="z-0 bg-[#001F5B]"
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <FlyTo lat={lat} lon={lon} />
      <Circle
        center={[lat, lon]}
        radius={radiusMeters}
        pathOptions={{ color: '#FD652F', fillColor: '#001F5B', fillOpacity: 0.1, weight: 2 }}
      />
      <Marker
        position={[lat, lon]}
        draggable
        ref={markerRef}
        icon={redIcon}
        eventHandlers={{
          dragend: () => {
            const pos = markerRef.current?.getLatLng();
            if (pos) onDragEnd(pos.lat, pos.lng);
          },
        }}
      >
        <Popup className="text-[#001F5B]">
        {"Latitude: " + lat}
            <br/>
        {"Longtitude: " + lon}
        </Popup>
      </Marker>
    </MapContainer>
  );
}