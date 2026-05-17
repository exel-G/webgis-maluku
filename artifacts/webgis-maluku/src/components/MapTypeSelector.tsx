import { MapTheme } from "./MapView";

interface MapTypeSelectorProps {
  current: MapTheme;
  onChange: (theme: MapTheme) => void;
}

const THEMES: { id: MapTheme; label: string; icon: string; preview: string }[] = [
  {
    id: "light",
    label: "Light",
    icon: "☀️",
    preview: "linear-gradient(135deg, #dbeafe 0%, #e0f2fe 50%, #f0f9ff 100%)",
  },
  {
    id: "dark",
    label: "Dark",
    icon: "🌙",
    preview: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
  },
  {
    id: "satellite",
    label: "Satelit",
    icon: "🛸",
    preview: "linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)",
  },
  {
    id: "topo",
    label: "Topo",
    icon: "⛰️",
    preview: "linear-gradient(135deg, #78350f 0%, #92400e 50%, #b45309 100%)",
  },
];

export default function MapTypeSelector({ current, onChange }: MapTypeSelectorProps) {
  return (
    <div
      className="flex gap-1.5 p-1.5 rounded-2xl"
      style={{
        background: "rgba(8, 15, 35, 0.92)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(34,211,238,0.18)",
        boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
      }}
    >
      {THEMES.map((theme) => {
        const isActive = current === theme.id;
        return (
          <button
            key={theme.id}
            onClick={() => onChange(theme.id)}
            className="flex flex-col items-center gap-1 px-2.5 py-2 rounded-xl transition-all"
            style={{
              background: isActive ? "rgba(34,211,238,0.15)" : "transparent",
              border: isActive ? "1px solid rgba(34,211,238,0.4)" : "1px solid transparent",
            }}
          >
            <div
              className="w-8 h-8 rounded-lg overflow-hidden"
              style={{ background: theme.preview, border: isActive ? "2px solid #22d3ee" : "2px solid transparent" }}
            >
              <div className="w-full h-full flex items-center justify-center text-sm">
                {theme.icon}
              </div>
            </div>
            <span
              className="text-xs font-medium"
              style={{ color: isActive ? "#22d3ee" : "rgba(148,163,184,0.7)" }}
            >
              {theme.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
