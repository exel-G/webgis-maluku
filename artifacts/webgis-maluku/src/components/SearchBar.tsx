import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { getCategoryInfo, getCategory } from "../data/locationData";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onSelectFeature: (feature: { properties: Record<string, unknown>; geometry: { coordinates: number[] | number[][][] } }) => void;
}

interface GeoFeature {
  properties: Record<string, unknown>;
  geometry: { type: string; coordinates: number[] | number[][] };
}

export default function SearchBar({ onSearch, onSelectFeature }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoFeature[]>([]);
  const [allFeatures, setAllFeatures] = useState<GeoFeature[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const base = import.meta.env.BASE_URL;
    fetch(`${base}maluku.geojson`)
      .then((r) => r.json())
      .then((data: { features: GeoFeature[] }) => {
        const named = data.features.filter(
          (f) => f.properties.name && f.geometry.type === "Point"
        );
        setAllFeatures(named);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (val: string) => {
    setQuery(val);
    if (!val.trim()) {
      setResults([]);
      return;
    }
    const q = val.toLowerCase();
    const filtered = allFeatures
      .filter((f) => ((f.properties.name as string) || "").toLowerCase().includes(q))
      .slice(0, 8);
    setResults(filtered);
  };

  const handleSelect = (feature: GeoFeature) => {
    const name = (feature.properties.name as string) || "";
    setQuery(name);
    setResults([]);
    setIsFocused(false);
    onSearch(name);
    onSelectFeature(feature as Parameters<typeof onSelectFeature>[0]);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    inputRef.current?.focus();
  };

  const showDropdown = isFocused && results.length > 0;

  return (
    <div ref={containerRef} className="relative w-full max-w-xs fade-down">
      <div
        className="flex items-center gap-2 px-3 py-2.5 rounded-2xl transition-all"
        style={{
          background: "rgba(8, 15, 35, 0.92)",
          backdropFilter: "blur(16px)",
          border: isFocused ? "1px solid rgba(34,211,238,0.5)" : "1px solid rgba(34,211,238,0.18)",
          boxShadow: isFocused ? "0 0 0 3px rgba(34,211,238,0.08), 0 8px 24px rgba(0,0,0,0.3)" : "0 4px 16px rgba(0,0,0,0.25)",
        }}
      >
        <Search size={16} style={{ color: isFocused ? "#22d3ee" : "rgba(34,211,238,0.55)", flexShrink: 0 }} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Cari lokasi..."
          className="flex-1 bg-transparent outline-none text-sm min-w-0"
          style={{ color: "rgba(226,232,240,0.95)", caretColor: "#22d3ee" }}
        />
        {query && (
          <button onClick={handleClear} className="flex-shrink-0 transition-opacity hover:opacity-70">
            <X size={14} style={{ color: "rgba(148,163,184,0.7)" }} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div
          className="absolute top-full left-0 right-0 mt-2 rounded-2xl overflow-hidden z-[900]"
          style={{
            background: "rgba(8, 15, 35, 0.97)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(34,211,238,0.18)",
            boxShadow: "0 12px 32px rgba(0,0,0,0.4)",
          }}
        >
          {results.map((feature, i) => {
            const name = (feature.properties.name as string) || "Tanpa Nama";
            const cat = getCategory(feature.properties);
            const catInfo = getCategoryInfo(cat);
            return (
              <button
                key={i}
                onClick={() => handleSelect(feature)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all hover:bg-white/5"
                style={{ borderBottom: i < results.length - 1 ? "1px solid rgba(34,211,238,0.08)" : "none" }}
              >
                <span className="text-base flex-shrink-0">{catInfo.emoji}</span>
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate" style={{ color: "rgba(226,232,240,0.95)" }}>
                    {name}
                  </div>
                  <div className="text-xs truncate" style={{ color: catInfo.color }}>
                    {catInfo.label}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
