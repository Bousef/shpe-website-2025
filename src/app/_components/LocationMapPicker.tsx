'use client';
import dynamic from 'next/dynamic';
import { useState, useRef, useEffect } from 'react';
import { api } from '~/trpc/react';
import { MapPin } from 'lucide-react';

const MapWithPin = dynamic(() => import('./Map'), { ssr: false });

// UCF campus as the default starting point
const DEFAULT_LAT = 28.6024;
const DEFAULT_LON = -81.2001;

interface LocationMapPickerProps {
  onLocationSelect: (display: string, lat: number, lon: number) => void;
  radiusMeters?: number;
}

export function LocationMapPicker({ onLocationSelect, radiusMeters = 50 }: LocationMapPickerProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [pin, setPin] = useState({ lat: DEFAULT_LAT, lon: DEFAULT_LON });
  const [mapReady, setMapReady] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [dragCoords, setDragCoords] = useState<{ lat: number; lon: number } | null>(null);

  const { data: results, refetch } = api.events.searchLocations.useQuery(
    { query },
    { enabled: false }
  );

  // Used for reversed Geocode

  const { data: reversedAddy } = api.events.reverseGeocode.useQuery(
    { lat: dragCoords?.lat ?? 0, lon: dragCoords?.lon ?? 0},
    { enabled: dragCoords !== null }
  );

  useEffect(() => {
    if (!reversedAddy || !dragCoords) return;
    setQuery(reversedAddy.display_name);
    onLocationSelect(reversedAddy.display_name, dragCoords.lat, dragCoords.lon);
  }, [reversedAddy]);

  useEffect(() => {
    if (query.length < 3) { setOpen(false); return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      void refetch();
      setOpen(true);
    }, 400);
  }, [query]);

  const handleSelect = (display: string, lat: number, lon: number) => {
    setQuery(display);
    setPin({ lat, lon });
    setMapReady(true);
    setOpen(false);
    onLocationSelect(display, lat, lon);
  };

  const handleDragEnd = (lat: number, lon: number) => {
    setPin({ lat, lon });
    setDragCoords({lat, lon }); // triggers the reverse geocode query in case the user use mappin
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Map — full width, above input */}
      <div className="w-full overflow-hidden rounded-xl border border-zinc-200">
        {mapReady ? (
          <MapWithPin lat={pin.lat} lon={pin.lon} radiusMeters={radiusMeters} onDragEnd={handleDragEnd} />
        ) : (
          <div className="h-[300px] flex flex-col items-center justify-center bg-zinc-50 text-zinc-400 gap-2">
            <MapPin className="w-6 h-6" />
            <p className="text-sm">Map preview will appear after selecting a location</p>
          </div>
        )}
      </div>

      {/* Autocomplete input */}
      <div className="relative">
        <input
          type="text"
          placeholder="e.g. Engineering Building I, Room 120"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results && results.length > 0 && setOpen(true)}
          className="w-full border border-zinc-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#001F5B] transition-colors"
        />
        {open && results && results.length > 0 && (
          <ul className="absolute z-50 w-full bg-white border border-zinc-200 rounded-xl shadow-lg mt-1 max-h-56 overflow-y-auto">
            {results.map((r) => (
              <li
                key={r.place_id}
                className="flex items-start gap-2 px-4 py-3 hover:bg-zinc-50 cursor-pointer text-sm text-zinc-800 border-b border-zinc-100 last:border-0"
                onClick={() => handleSelect(r.display_name, parseFloat(r.lat), parseFloat(r.lon))}
              >
                <MapPin className="w-4 h-4 mt-0.5 text-[#001F5B] shrink-0" />
                {r.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Drag hint — only once map is visible */}
      {mapReady && (
        <p className="text-xs text-zinc-400 text-center -mt-1">
          Current coordinates ({pin.lat}, {pin.lon}) — Drag the pin to fine-tune the exact check-in location
        </p>
      )}
    </div>
  );
}