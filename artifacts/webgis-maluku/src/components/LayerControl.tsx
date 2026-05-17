import { useState } from "react";
import { Layers, ChevronDown } from "lucide-react";
import { getCategoryInfo } from "../data/locationData";

interface LayerControlProps {
  layers: string[];
  activeLayers: Record<string, boolean>;
  onToggle: (layer: string) => void;
}

export default function LayerControl({ layers, activeLayers, onToggle }: LayerControlProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeCount = layers.filter((l) => activeLayers[l] !== false).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-2.5 rounded-2xl transition-all"
        style={{
          background: "rgba(8, 15, 35, 0.92)",
          backdropFilter: "blur(16px)",
          border: isOpen ? "1px solid rgba(34,211,238,0.5)" : "1px solid rgba(34,211,238,0.18)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
          color: "rgba(226,232,240,0.9)",
        }}
      >
        <Layers size={16} style={{ color: "#22d3ee" }} />
        <span className="text-sm font-medium">Layer</span>
        <span className="text-xs px-1.5 py-0.5 rounded-full font-semibold"
          style={{ background: "rgba(34,211,238,0.15)", color: "#22d3ee" }}>
          {activeCount}/{layers.length}
        </span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          style={{ color: "rgba(34,211,238,0.6)" }} />
      </button>

      {isOpen && (
        <div
          className="absolute top-full right-0 mt-2 w-56 rounded-2xl overflow-hidden z-[900]"
          style={{
            background: "rgba(8, 15, 35, 0.97)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(34,211,238,0.18)",
            boxShadow: "0 12px 32px rgba(0,0,0,0.4)",
          }}
        >
          {/* Header */}
          <div className="px-4 py-2.5 flex items-center justify-between"
            style={{ borderBottom: "1px solid rgba(34,211,238,0.1)" }}>
            <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: "#22d3ee" }}>
              Kontrol Layer
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => layers.forEach((l) => activeLayers[l] === false && onToggle(l))}
                className="text-xs px-2 py-0.5 rounded-full transition-all hover:opacity-80"
                style={{ background: "rgba(34,211,238,0.15)", color: "#22d3ee" }}
              >
                Semua
              </button>
              <button
                onClick={() => layers.forEach((l) => activeLayers[l] !== false && onToggle(l))}
                className="text-xs px-2 py-0.5 rounded-full transition-all hover:opacity-80"
                style={{ background: "rgba(148,163,184,0.1)", color: "rgba(148,163,184,0.7)" }}
              >
                Hapus
              </button>
            </div>
          </div>

          {/* Layer list */}
          <div className="max-h-72 overflow-y-auto panel-scrollbar py-1">
            {layers.map((layer) => {
              const info = getCategoryInfo(layer);
              const isActive = activeLayers[layer] !== false;
              return (
                <button
                  key={layer}
                  onClick={() => onToggle(layer)}
                  className="w-full flex items-center gap-3 px-4 py-2 transition-all hover:bg-white/5"
                >
                  <div
                    className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all"
                    style={{
                      background: isActive ? info.color : "transparent",
                      border: `1.5px solid ${isActive ? info.color : "rgba(148,163,184,0.3)"}`,
                    }}
                  >
                    {isActive && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span className="text-base">{info.emoji}</span>
                  <span className="text-sm flex-1 text-left" style={{ color: isActive ? "rgba(226,232,240,0.9)" : "rgba(148,163,184,0.5)" }}>
                    {info.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
