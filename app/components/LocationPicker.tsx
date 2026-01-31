"use client";
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';

import L from 'leaflet';

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationMarker({ onSelect, initialPosition }: { onSelect: (lat: number, lng: number) => void, initialPosition: L.LatLng | null }) {
  const [position, setPosition] = useState<L.LatLng | null>(initialPosition);
  const map = useMap();

  useEffect(() => {
    if (initialPosition) {
      setPosition(initialPosition);
      map.flyTo(initialPosition, map.getZoom());
    }
  }, [initialPosition, map]);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return position ? <Marker position={position} icon={icon} /> : null;
}

export default function LocationPicker({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [markerPosition, setMarkerPosition] = useState<L.LatLng | null>(null);

  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`);
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newPos = new L.LatLng(parseFloat(lat), parseFloat(lon));
        setMarkerPosition(newPos);
        onLocationSelect(newPos.lat, newPos.lng);
      } else {
        alert('Ubicación no encontrada.');
      }
    } catch (error) {
      console.error("Error en la búsqueda de ubicación:", error);
      alert('Error al buscar la ubicación.');
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Buscar una ubicación..."
          className="flex-grow bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
        />
        <button
          type="button"
          onClick={handleSearch}
          className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-xl transition-colors"
        >
          Buscar
        </button>
      </div>
      <div className="rounded-xl overflow-hidden border border-white/10">
        <MapContainer center={[-41.133, -71.31]} zoom={13} style={{ height: '300px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <LocationMarker onSelect={onLocationSelect} initialPosition={markerPosition} />
        </MapContainer>
      </div>
    </div>
  );
}
