"use client";
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function ReportMap({ lat, lng }: { lat: number, lng: number }) {
  if (typeof window === 'undefined') {
    return null;
  }
  
  const position: L.LatLngExpression = [lat, lng];

  return (
    <MapContainer center={position} zoom={15} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position} icon={icon} />
    </MapContainer>
  );
}
