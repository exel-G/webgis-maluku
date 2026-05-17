import { useState, useCallback } from "react";
import SplashScreen from "./components/SplashScreen";
import MapView, { MapTheme } from "./components/MapView";
import SearchBar from "./components/SearchBar";
import LayerControl from "./components/LayerControl";
import MapTypeSelector from "./components/MapTypeSelector";
import LocationPanel from "./components/LocationPanel";

interface GeoFeature {
  type: "Feature";
  geometry: {
    type: string;
    coordinates: number[] | number[][][];
  };
  properties: Record<string, unknown>;
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [selectedFeature, setSelectedFeature] = useState<GeoFeature | null>(null);
  const [isPanelClosing, setIsPanelClosing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({});
  const [mapTheme, setMapTheme] = useState<MapTheme>("light");
  const [detectedLayers, setDetectedLayers] = useState<string[]>([]);

  const handleFeatureClick = useCallback((feature: GeoFeature) => {
    setIsPanelClosing(false);
    setSelectedFeature(feature);
  }, []);

  const handleClosePanel = useCallback(() => {
    setIsPanelClosing(true);
    setTimeout(() => {
      setSelectedFeature(null);
      setIsPanelClosing(false);
    }, 300);
  }, []);

  const handleLayerToggle = useCallback((layer: string) => {
    setActiveLayers((prev) => ({
      ...prev,
      [layer]: prev[layer] === false ? true : false,
    }));
  }, []);

  const handleLayersDetected = useCallback((layers: string[]) => {
    setDetectedLayers(layers);
    const initial: Record<string, boolean> = {};
    layers.forEach((l) => (initial[l] = true));
    setActiveLayers(initial);
  }, []);

  const handleSelectFromSearch = useCallback((feature: { properties: Record<string, unknown>; geometry: { coordinates: number[] | number[][][] } }) => {
    setIsPanelClosing(false);
    setSelectedFeature(feature as GeoFeature);
  }, []);

  const handleGPS = () => {
    const fn = (window as unknown as Record<string, unknown>).__mapFlyToGPS;
    if (typeof fn === "function") fn();
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0a0f1e" }}>
      {/* Splash Screen */}
      {showSplash && (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      )}

      {/* Map - full screen */}
      <div className="absolute inset-0">
        <MapView
          onFeatureClick={handleFeatureClick}
          searchQuery={searchQuery}
          activeLayers={activeLayers}
          mapTheme={mapTheme}
          onLayersDetected={handleLayersDetected}
        />
      </div>

      {/* Top bar */}
      <div className="absolute top-4 left-4 right-4 z-[800] flex items-start gap-3 pointer-events-none">
        {/* Left: Logo + Search */}
        <div className="flex flex-col gap-2 pointer-events-auto">
          {/* Logo */}
          <div
            className="flex items-center gap-2.5 px-3 py-2 rounded-2xl fade-down"
            style={{
              background: "rgba(8,15,35,0.92)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(34,211,238,0.18)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
            }}
          >
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #0891b2, #22d3ee)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div>
              <div className="text-xs font-bold leading-none" style={{ color: "#22d3ee" }}>WebGIS</div>
              <div className="text-xs leading-none mt-0.5" style={{ color: "rgba(148,163,184,0.8)" }}>Maluku Tengah</div>
            </div>
          </div>

          {/* Search */}
          <SearchBar
            onSearch={setSearchQuery}
            onSelectFeature={handleSelectFromSearch}
          />
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right: Map type + Layer */}
        <div className="flex flex-col items-end gap-2 pointer-events-auto">
          <MapTypeSelector current={mapTheme} onChange={setMapTheme} />
          {detectedLayers.length > 0 && (
            <LayerControl
              layers={detectedLayers}
              activeLayers={activeLayers}
              onToggle={handleLayerToggle}
            />
          )}
        </div>
      </div>

      {/* GPS Button */}
      <button
        onClick={handleGPS}
        className="absolute z-[800] transition-all hover:scale-110 active:scale-95"
        style={{
          bottom: "80px",
          right: "16px",
          width: "44px",
          height: "44px",
          borderRadius: "14px",
          background: "rgba(8,15,35,0.92)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(34,211,238,0.3)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
          <path d="M12 2a10 10 0 0 1 10 10"/>
          <path d="M12 2a10 10 0 0 0-10 10"/>
        </svg>
      </button>

      {/* Info badge */}
      <div
        className="absolute z-[800] pointer-events-none"
        style={{ bottom: "16px", left: "16px" }}
      >
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
          style={{
            background: "rgba(8,15,35,0.85)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(34,211,238,0.15)",
            color: "rgba(148,163,184,0.7)",
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span>16.901 Lokasi • Maluku Tengah, Indonesia</span>
        </div>
      </div>

      {/* Location Panel — slide-in from right */}
      {(selectedFeature || isPanelClosing) && (
        <div className="absolute right-0 top-0 bottom-0 z-[800]">
          <LocationPanel
            feature={selectedFeature}
            onClose={handleClosePanel}
            isClosing={isPanelClosing}
          />
        </div>
      )}
    </div>
  );
}
