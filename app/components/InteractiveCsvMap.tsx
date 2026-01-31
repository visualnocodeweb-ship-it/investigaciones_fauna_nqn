"use client";

import { useState, useMemo, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import * as toGeoJSON from '@mapbox/togeojson';
import JSZip from 'jszip';
import 'leaflet/dist/leaflet.css';

// El arreglo global para los íconos se elimina, es la causa más probable de los bugs.
// Los `divIcon` no lo necesitan.

// Define the color palette for each animal type
const animalColors = {
  'EQUINO': '#FF6347', // Tomato
  'CAN': '#4682B4',    // SteelBlue
  'VACUNO': '#3CB371',  // MediumSeaGreen
  'OVINO': '#DAA520',   // GoldenRod
  'CAPRINO': '#6A5ACD', // SlateBlue
  'CIERVO': '#DC143C',  // Crimson
  'JABALI': '#8B4513',  // SaddleBrown
  'LIEBRE': '#9ACD32',  // YellowGreen
  'CHOIQUE': '#BA55D3', // MediumOrchid
  'default': '#A9A9A9' // DarkGray for unknown types
};

// Function to create custom colored icons
const getColoredIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color:${color}; width: 15px; height: 15px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>`,
    iconSize: [15, 15],
    iconAnchor: [7, 7]
  });
};

// Heatmap wrapper component
const HeatmapLayer = ({ points, active }: { points: [number, number, number][], active: boolean }) => {
  const map = useMap();
  const heatLayerRef = useRef<L.HeatLayer | null>(null);

  useEffect(() => {
    if (!heatLayerRef.current) {
      heatLayerRef.current = (L as any).heatLayer([], {
        radius: 25,
        blur: 20,
        maxZoom: 12,
        gradient: { 0.4: 'blue', 0.6: 'lime', 0.8: 'yellow', 1.0: 'red' }
      }).addTo(map);
    }

    if (active) {
      heatLayerRef.current!.setLatLngs(points);
    } else {
      heatLayerRef.current!.setLatLngs([]); // Clear points if not active
    }
  }, [points, active, map]);

  return null;
};

export default function InteractiveCsvMap() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [allData, setAllData] = useState<{ id: number; ano: number; tipoDeAnimal: string; region: string; latitud: number; longitud: number; tipoDeIntervencion: string; }[]>([]);
  const [activeViews, setActiveViews] = useState({
    markers: false,
    kml: false,
    heatmap: false,
  });
  const [selectedFilters, setSelectedFilters] = useState({
    ano: 'all',
    tipoDeAnimal: 'all',
    region: 'all',
    tipoDeIntervencion: 'all',
  });
  const [kmlData, setKmlData] = useState(null);
  const [limiteNqnData, setLimiteNqnData] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  useEffect(() => {
    const fetchCsvData = async () => {
      try {
        const response = await fetch('/animales_sueltos.csv');
        const text = await response.text();
        const lines = text.split('\n').slice(1); // Omitir encabezado
        const data = lines
          .map((line, index) => {
            const parts = line.split(',');
            return {
              id: index,
              ano: parseInt(parts[0], 10),
              tipoDeAnimal: parts[1],
              region: parts[2],
              latitud: parseFloat(parts[3]),
              longitud: parseFloat(parts[4]),
              tipoDeIntervencion: parts[5],
            };
          })
          .filter(item => !isNaN(item.latitud) && !isNaN(item.longitud)); // Filtrar filas inválidas
        setAllData(data);
      } catch (error) {
        console.error('Error loading or parsing CSV data:', error);
      }
    };

    fetchCsvData();
  }, []);

  const uniqueFilters = useMemo(() => {
    if (allData.length === 0) {
      return { anos: [], tipos: [], regiones: [], intervenciones: [] };
    }
    return {
      anos: [...new Set(allData.map(d => d.ano))].sort((a, b) => b - a),
      tipos: [...new Set(allData.map(d => d.tipoDeAnimal))].sort(),
      regiones: [...new Set(allData.map(d => d.region))].sort(),
      intervenciones: [...new Set(allData.map(d => d.tipoDeIntervencion))].sort(),
    };
  }, [allData]);

  useEffect(() => {
    const fetchKml = async (filePath, setData) => {
      try {
        const response = await fetch(filePath);
        const blob = await response.blob();

        const zip = await JSZip.loadAsync(blob);
        const kmlFile = Object.keys(zip.files).find(fileName => fileName.endsWith('.kml'));

        if (kmlFile) {
          const kmlString = await zip.files[kmlFile].async('string');
          const parser = new DOMParser();
          const kml = parser.parseFromString(kmlString, 'text/xml');
          const geojson = toGeoJSON.kml(kml);
          setData(geojson);
        } else {
          console.error(`No .kml file found in the KMZ archive: ${filePath}`);
        }
      } catch (error) {
        console.error(`Error loading or parsing KML file: ${filePath}`, error);
      }
    };

    fetchKml('/mapa.kmz', setKmlData);
    fetchKml('/Límite NQN.kmz', setLimiteNqnData);
  }, []);

  const onEachFeature = (feature, layer) => {
    if (feature.properties && feature.properties.name) {
      layer.bindPopup(feature.properties.name);
    }
  };

  const pointToLayer = (feature, latlng) => {
    return L.marker(latlng, { icon: getColoredIcon('#39FF14') }); // Verde fluorescente para Investigaciones Fauna
  };

  const filteredData = useMemo(() => {
    return allData.filter(item => {
      const { ano, tipoDeAnimal, region, tipoDeIntervencion } = selectedFilters;
      return (
        (ano === 'all' || item.ano.toString() === ano) &&
        (tipoDeAnimal === 'all' || item.tipoDeAnimal === tipoDeAnimal) &&
        (region === 'all' || item.region === region) &&
        (tipoDeIntervencion === 'all' || item.tipoDeIntervencion === tipoDeIntervencion)
      );
    });
  }, [selectedFilters, allData]);

  const heatmapPoints = useMemo(() => {
    return filteredData.map(item => [item.latitud, item.longitud, 1.0]); // Increased intensity to 1.0
  }, [filteredData]);

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => ({ ...prev, [filterType]: value }));
  };
  
  const handleViewToggle = (viewName) => {
    setActiveViews(prev => ({
      ...prev,
      [viewName]: !prev[viewName]
    }));
  };

  const FilterButton = ({ filterType, value, label }) => {
    const isActive = selectedFilters[filterType] === value;
    return (
      <button
        onClick={() => handleFilterChange(filterType, value)}
        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
          isActive ? 'bg-blue-600 text-white shadow-md' : 'bg-white/10 text-slate-300 hover:bg-white/20'
        }`}
      >
        {label}
      </button>
    );
  };
  
  const ViewButton = ({ view, label }) => {
    const isActive = activeViews[view];
    return (
        <button 
            onClick={() => handleViewToggle(view)} 
            className={`px-3 py-1 rounded-md text-xs ${isActive ? 'bg-blue-600 text-white' : 'bg-white/10 text-slate-300'}`}
        >
            {label}
        </button>
    );
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="glass-card p-6 rounded-2xl mt-8">
      <div className="h-[600px] w-full rounded-lg overflow-hidden border border-white/10 relative bg-black/20">
        <MapContainer center={[-39.5, -69.5]} zoom={7} style={{ height: '100%', width: '100%' }}>
          <LayersControl position="topleft">
            <LayersControl.BaseLayer checked name="Calle">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Satélite">
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              />
            </LayersControl.BaseLayer>
          </LayersControl>

          {limiteNqnData && <GeoJSON key="limite-nqn" data={limiteNqnData} style={{ color: 'red', weight: 2, opacity: 0.8, fillOpacity: 0 }} />}

          {activeViews.kml && kmlData && (
            <GeoJSON key="kml-layer" data={kmlData} pointToLayer={pointToLayer} onEachFeature={onEachFeature} />
          )}

          {activeViews.markers &&
            filteredData.map(item => (
              <Marker
                key={item.id}
                position={[item.latitud, item.longitud]}
                icon={getColoredIcon(animalColors[item.tipoDeAnimal] || animalColors.default)}
              >
                <Popup>
                  <div className="text-sm">
                    <div className="font-bold text-base mb-1">{item.tipoDeAnimal}</div>
                    <div>
                      <b>Año:</b> {item.ano}
                    </div>
                    <div>
                      <b>Región:</b> {item.region}
                    </div>
                    <div>
                      <b>Intervención:</b> {item.tipoDeIntervencion}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          <HeatmapLayer points={heatmapPoints} active={activeViews.heatmap} />
        </MapContainer>

        <div className="absolute bottom-0 left-0 right-0 sm:top-3 sm:right-3 sm:left-auto sm:bottom-auto z-[1000] w-full sm:w-auto sm:max-w-sm bg-black/60 backdrop-blur-md p-4 sm:rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Tablero de Control</h2>
            <div className="flex gap-2">
                <ViewButton view="markers" label="Datos Policia" />
                <ViewButton view="kml" label="Investigaciones Fauna" />
                <ViewButton view="heatmap" label="Calor" />
            </div>
            <button className="sm:hidden text-white" onClick={() => setIsPanelOpen(!isPanelOpen)}>
              {isPanelOpen ? 'Cerrar' : 'Filtros'}
            </button>
          </div>

          <div className={`space-y-3 ${isPanelOpen ? '' : 'hidden'}`}>
            <div>
              <h3 className="text-sm font-semibold text-slate-400 mb-2">Año</h3>
              <div className="flex flex-wrap gap-2">
                <FilterButton filterType="ano" value="all" label="Todos" />
                {uniqueFilters.anos.map(ano => (
                  <FilterButton key={ano} filterType="ano" value={ano.toString()} label={ano.toString()} />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-400 mb-2">Tipo de Animal</h3>
              <div className="flex flex-wrap gap-2">
                <FilterButton filterType="tipoDeAnimal" value="all" label="Todos" />
                {uniqueFilters.tipos.map(tipo => (
                  <FilterButton key={tipo} filterType="tipoDeAnimal" value={tipo} label={tipo} />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-400 mb-2">Región</h3>
              <div className="flex flex-wrap gap-2">
                <FilterButton filterType="region" value="all" label="Todas" />
                {uniqueFilters.regiones.map(region => (
                  <FilterButton key={region} filterType="region" value={region} label={region} />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-400 mb-2">Tipo de Intervención</h3>
              <div className="flex flex-wrap gap-2">
                <FilterButton filterType="tipoDeIntervencion" value="all" label="Todos" />
                {uniqueFilters.intervenciones.map(intervencion => (
                  <FilterButton key={intervencion} filterType="tipoDeIntervencion" value={intervencion} label={intervencion} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-right text-slate-400 text-sm mt-2">
        Mostrando {filteredData.length} de {allData.length} puntos.
      </div>
    </div>
  );
}
