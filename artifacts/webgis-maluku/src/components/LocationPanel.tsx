import { useState } from "react";
import { X, Clock, DollarSign, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { getCategoryInfo, getDescription, getPhotos, getHours, getPrice, getCategory } from "../data/locationData";

interface LocationPanelProps {
  feature: {
    properties: Record<string, unknown>;
    geometry: { coordinates: number[] | number[][][] };
  } | null;
  onClose: () => void;
  isClosing: boolean;
}

export default function LocationPanel({ feature, onClose, isClosing }: LocationPanelProps) {
  const [photoIdx, setPhotoIdx] = useState(0);

  if (!feature) return null;

  const props = feature.properties;
  const name = (props.name as string) || "Lokasi Tanpa Nama";
  const category = getCategory(props);
  const catInfo = getCategoryInfo(category);
  const description = getDescription(category);
  const photos = getPhotos(category);
  const openingHours = getHours(category, props.opening_hours as string | null);
  const price = getPrice(category);

  let coords: [number, number] = [0, 0];
  const geom = feature.geometry;
  if (Array.isArray(geom.coordinates[0])) {
    // Polygon - get first point
    const first = (geom.coordinates as number[][][])[0][0];
    coords = [first[1], first[0]];
  } else {
    const c = geom.coordinates as number[];
    coords = [c[1], c[0]];
  }

  const prevPhoto = () => setPhotoIdx((i) => (i - 1 + photos.length) % photos.length);
  const nextPhoto = () => setPhotoIdx((i) => (i + 1) % photos.length);

  return (
    <div
      className={`absolute right-0 top-0 bottom-0 w-80 z-[800] flex flex-col overflow-hidden shadow-2xl ${
        isClosing ? "slide-out" : "slide-in"
      }`}
      style={{ background: "rgba(8, 15, 35, 0.96)", backdropFilter: "blur(16px)", borderLeft: "1px solid rgba(34,211,238,0.15)" }}
    >
      {/* Photo section */}
      <div className="relative h-48 flex-shrink-0 overflow-hidden">
        {photos.length > 0 && (
          <>
            <img
              src={photos[photoIdx]}
              alt={name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&q=80";
              }}
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(8,15,35,0.7))" }} />
          </>
        )}

        {/* Category badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm"
          style={{ background: `${catInfo.color}30`, border: `1px solid ${catInfo.color}60`, color: catInfo.color }}>
          <span>{catInfo.emoji}</span>
          <span>{catInfo.label}</span>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)" }}
        >
          <X size={16} className="text-white" />
        </button>

        {/* Photo navigation */}
        {photos.length > 1 && (
          <>
            <button onClick={prevPhoto} className="absolute left-2 bottom-10 w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
              <ChevronLeft size={16} className="text-white" />
            </button>
            <button onClick={nextPhoto} className="absolute right-2 bottom-10 w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
              <ChevronRight size={16} className="text-white" />
            </button>
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
              {photos.map((_, i) => (
                <button key={i} onClick={() => setPhotoIdx(i)}
                  className="w-1.5 h-1.5 rounded-full transition-all"
                  style={{ background: i === photoIdx ? "#22d3ee" : "rgba(255,255,255,0.4)", width: i === photoIdx ? "16px" : "6px" }}
                />
              ))}
            </div>
          </>
        )}

        {/* Location name overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-3">
          <h2 className="text-white font-bold text-base leading-tight" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>
            {name}
          </h2>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto panel-scrollbar px-4 py-4 space-y-4">
        {/* Coordinates */}
        <div className="flex items-center gap-2">
          <MapPin size={13} style={{ color: "#22d3ee", flexShrink: 0 }} />
          <span className="text-xs" style={{ color: "rgba(186,230,253,0.7)" }}>
            {coords[0].toFixed(5)}°, {coords[1].toFixed(5)}°
          </span>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "rgba(34,211,238,0.12)" }} />

        {/* Description */}
        <div>
          <h3 className="text-xs font-semibold tracking-wider uppercase mb-2" style={{ color: "#22d3ee" }}>Deskripsi</h3>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(226,232,240,0.85)" }}>
            {description}
          </p>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "rgba(34,211,238,0.12)" }} />

        {/* Info cards */}
        <div className="space-y-3">
          {/* Opening hours */}
          <div className="p-3 rounded-xl flex gap-3" style={{ background: "rgba(34,211,238,0.06)", border: "1px solid rgba(34,211,238,0.12)" }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(34,211,238,0.15)" }}>
              <Clock size={15} style={{ color: "#22d3ee" }} />
            </div>
            <div>
              <div className="text-xs font-medium mb-0.5" style={{ color: "#22d3ee" }}>Jam Operasional</div>
              <div className="text-sm" style={{ color: "rgba(226,232,240,0.85)" }}>{openingHours}</div>
            </div>
          </div>

          {/* Price */}
          <div className="p-3 rounded-xl flex gap-3" style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.15)" }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(249,115,22,0.15)" }}>
              <DollarSign size={15} style={{ color: "#f97316" }} />
            </div>
            <div>
              <div className="text-xs font-medium mb-0.5" style={{ color: "#f97316" }}>Estimasi Harga</div>
              <div className="text-sm" style={{ color: "rgba(226,232,240,0.85)" }}>{price}</div>
            </div>
          </div>
        </div>

        {/* Additional photos grid */}
        {photos.length > 1 && (
          <>
            <div style={{ height: "1px", background: "rgba(34,211,238,0.12)" }} />
            <div>
              <h3 className="text-xs font-semibold tracking-wider uppercase mb-2" style={{ color: "#22d3ee" }}>Galeri Foto</h3>
              <div className="grid grid-cols-3 gap-1.5">
                {photos.map((photo, i) => (
                  <button
                    key={i}
                    onClick={() => setPhotoIdx(i)}
                    className="aspect-square rounded-lg overflow-hidden transition-all hover:opacity-90"
                    style={{ outline: i === photoIdx ? `2px solid #22d3ee` : "none" }}
                  >
                    <img src={photo} alt="" className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&q=80"; }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Bottom spacing */}
        <div className="h-4" />
      </div>

      {/* Action button */}
      <div className="px-4 py-4 flex-shrink-0" style={{ borderTop: "1px solid rgba(34,211,238,0.12)" }}>
        <button
          onClick={() => {
            const url = `https://www.google.com/maps?q=${coords[0]},${coords[1]}`;
            window.open(url, "_blank");
          }}
          className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-98"
          style={{ background: "linear-gradient(135deg, #0891b2, #22d3ee)", color: "#0a0f23" }}
        >
          Buka di Google Maps
        </button>
      </div>
    </div>
  );
}
