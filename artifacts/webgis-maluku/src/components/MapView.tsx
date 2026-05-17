import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getCategoryInfo, getCategory } from "../data/locationData";

export type MapTheme = "light" | "dark" | "satellite" | "topo";

interface GeoFeature {
  type: "Feature";
  geometry: {
    type: string;
    coordinates: number[] | number[][];
  };
  properties: Record<string, unknown>;
}

interface MapViewProps {
  onFeatureClick: (feature: GeoFeature) => void;
  searchQuery: string;
  activeLayers: Record<string, boolean>;
  mapTheme: MapTheme;
  onLayersDetected: (layers: string[]) => void;
}

const TILE_LAYERS: Record<MapTheme, { url: string; attribution: string; options?: Record<string, unknown> }> = {
  light: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  dark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP",
  },
  topo: {
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
    options: { maxZoom: 17 },
  },
};

function createMarkerIcon(category: string): L.DivIcon {
  const info = getCategoryInfo(category);
  return L.divIcon({
    className: "",
    html: `
      <div style="
        width:32px; height:32px;
        background:${info.color};
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        display:flex;
        align-items:center;
        justify-content:center;
        box-shadow:0 3px 12px rgba(0,0,0,0.3);
        border:2px solid rgba(255,255,255,0.9);
      ">
        <div style="transform:rotate(45deg);font-size:14px;line-height:1;">${info.emoji}</div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -34],
  });
}

function createGPSIcon(): L.DivIcon {
  return L.divIcon({
    className: "gps-pulse",
    html: `
      <div style="
        width:16px;height:16px;
        background:#3b82f6;
        border-radius:50%;
        border:3px solid white;
        box-shadow:0 2px 8px rgba(59,130,246,0.6);
        position:relative;
      "></div>
    `,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

export default function MapView({
  onFeatureClick,
  searchQuery,
  activeLayers,
  mapTheme,
  onLayersDetected,
}: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const layerGroupsRef = useRef<Record<string, L.LayerGroup>>({});
  const gpsMarkerRef = useRef<L.Marker | null>(null);
  const allFeaturesRef = useRef<GeoFeature[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [-3.7, 128.2],
      zoom: 10,
      zoomControl: false,
    });

    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Add initial tile layer
    const tileConfig = TILE_LAYERS[mapTheme];
    const tileLayer = L.tileLayer(tileConfig.url, {
      attribution: tileConfig.attribution,
      maxZoom: 19,
      ...(tileConfig.options || {}),
    });
    tileLayer.addTo(map);
    tileLayerRef.current = tileLayer;
    mapRef.current = map;

    // Load GeoJSON
    const base = import.meta.env.BASE_URL;
    fetch(`${base}maluku.geojson`)
      .then((r) => r.json())
      .then((data: { features: GeoFeature[] }) => {
        const named = data.features.filter(
          (f) =>
            f.properties.name &&
            f.geometry.type === "Point"
        );
        allFeaturesRef.current = named;

        // Detect unique categories
        const cats = new Set<string>();
        named.forEach((f) => cats.add(getCategory(f.properties)));
        onLayersDetected([...cats].sort());

        // Group by category
        const groups: Record<string, L.LayerGroup> = {};
        cats.forEach((cat) => {
          groups[cat] = L.layerGroup().addTo(map);
        });
        layerGroupsRef.current = groups;

        // Add markers
        named.forEach((feature) => {
          const coords = feature.geometry.coordinates as number[];
          const lat = coords[1];
          const lng = coords[0];
          if (isNaN(lat) || isNaN(lng)) return;

          const category = getCategory(feature.properties);
          const icon = createMarkerIcon(category);
          const marker = L.marker([lat, lng], { icon });

          marker.on("click", () => {
            onFeatureClick(feature);
          });

          groups[category]?.addLayer(marker);
        });

        setIsLoaded(true);
      })
      .catch(console.error);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update tile layer when theme changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }
    const tileConfig = TILE_LAYERS[mapTheme];
    const tileLayer = L.tileLayer(tileConfig.url, {
      attribution: tileConfig.attribution,
      maxZoom: 19,
      ...(tileConfig.options || {}),
    });
    tileLayer.addTo(map);
    tileLayerRef.current = tileLayer;
  }, [mapTheme]);

  // Toggle layer visibility
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    Object.entries(layerGroupsRef.current).forEach(([cat, group]) => {
      if (activeLayers[cat] !== false) {
        if (!map.hasLayer(group)) map.addLayer(group);
      } else {
        if (map.hasLayer(group)) map.removeLayer(group);
      }
    });
  }, [activeLayers]);

  // Search: fly to result
  useEffect(() => {
    if (!searchQuery || !mapRef.current || allFeaturesRef.current.length === 0) return;

    const q = searchQuery.toLowerCase();
    const match = allFeaturesRef.current.find((f) =>
      ((f.properties.name as string) || "").toLowerCase().includes(q)
    );

    if (match) {
      const coords = match.geometry.coordinates as number[];
      mapRef.current.flyTo([coords[1], coords[0]], 16, { duration: 1.2 });
    }
  }, [searchQuery]);

  // Expose GPS function globally
  const flyToGPS = useCallback(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        map.flyTo([lat, lng], 15, { duration: 1.5 });

        if (gpsMarkerRef.current) {
          gpsMarkerRef.current.setLatLng([lat, lng]);
        } else {
          const gpsMarker = L.marker([lat, lng], { icon: createGPSIcon(), zIndexOffset: 1000 });
          gpsMarker.addTo(map);
          gpsMarkerRef.current = gpsMarker;
        }
      },
      () => {
        alert("Tidak dapat mengakses lokasi GPS. Pastikan izin lokasi diaktifkan.");
      }
    );
  }, []);

  useEffect(() => {
    (window as unknown as Record<string, unknown>).__mapFlyToGPS = flyToGPS;
    return () => { delete (window as unknown as Record<string, unknown>).__mapFlyToGPS; };
  }, [flyToGPS]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full" />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-[500]"
          style={{ background: "rgba(8,20,50,0.7)", backdropFilter: "blur(4px)" }}>
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-transparent border-t-cyan-400 animate-spin" />
            <p className="text-cyan-200 text-sm font-medium">Memuat 16.901 lokasi...</p>
          </div>
        </div>
      )}
    </div>
  );
}
