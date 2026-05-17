import { useEffect, useState } from "react";

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [phase, setPhase] = useState<"intro" | "scene" | "fadeout">("intro");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("scene"), 400);
    const t2 = setTimeout(() => setPhase("fadeout"), 6200);
    const t3 = setTimeout(() => onFinish(), 7000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[9999] overflow-hidden transition-opacity duration-700 ${
        phase === "fadeout" ? "opacity-0" : "opacity-100"
      }`}
      style={{ background: "linear-gradient(180deg, #0c4a6e 0%, #0369a1 18%, #0891b2 38%, #22d3ee 58%, #67e8f9 75%, #a5f3fc 100%)" }}
    >
      {/* Sun */}
      <div className="absolute top-10 right-16 w-24 h-24">
        <div
          className="sun-rays absolute inset-0"
          style={{
            background: "conic-gradient(from 0deg, transparent 0deg, rgba(255,220,50,0.4) 10deg, transparent 20deg, rgba(255,220,50,0.35) 30deg, transparent 40deg, rgba(255,220,50,0.4) 50deg, transparent 60deg, rgba(255,220,50,0.35) 70deg, transparent 80deg, rgba(255,220,50,0.4) 90deg, transparent 100deg, rgba(255,220,50,0.35) 110deg, transparent 120deg, rgba(255,220,50,0.4) 130deg, transparent 140deg, rgba(255,220,50,0.35) 150deg, transparent 160deg, rgba(255,220,50,0.4) 170deg, transparent 180deg, rgba(255,220,50,0.35) 190deg, transparent 200deg, rgba(255,220,50,0.4) 210deg, transparent 220deg, rgba(255,220,50,0.35) 230deg, transparent 240deg, rgba(255,220,50,0.4) 250deg, transparent 260deg, rgba(255,220,50,0.35) 270deg, transparent 280deg, rgba(255,220,50,0.4) 290deg, transparent 300deg, rgba(255,220,50,0.35) 310deg, transparent 320deg, rgba(255,220,50,0.4) 330deg, transparent 340deg, rgba(255,220,50,0.35) 350deg, transparent 360deg)",
            borderRadius: "50%",
            scale: "2.5",
          }}
        />
        <div
          className="absolute inset-2 rounded-full"
          style={{ background: "radial-gradient(circle, #fde68a 0%, #fbbf24 40%, #f59e0b 100%)", boxShadow: "0 0 40px 20px rgba(251,191,36,0.5)" }}
        />
      </div>

      {/* Birds */}
      <div className="float-bird absolute top-20 left-0">
        <svg width="60" height="24" viewBox="0 0 60 24" fill="none">
          <path d="M0 12 Q8 4 15 12 Q22 4 30 12" stroke="rgba(255,255,255,0.8)" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M32 10 Q40 2 47 10 Q54 2 62 10" stroke="rgba(255,255,255,0.8)" strokeWidth="2" fill="none" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Ocean waves */}
      <div className="absolute bottom-0 left-0 right-0 h-52">
        {/* Wave layer 1 */}
        <svg className="wave-1 absolute bottom-16 left-0 w-full" viewBox="0 0 1440 120" preserveAspectRatio="none" style={{ height: 80 }}>
          <path
            d="M0,60 C180,20 360,100 540,60 C720,20 900,100 1080,60 C1260,20 1380,80 1440,60 L1440,120 L0,120 Z"
            fill="rgba(14,116,144,0.55)"
          />
        </svg>
        {/* Wave layer 2 */}
        <svg className="wave-2 absolute bottom-8 left-0 w-full" viewBox="0 0 1440 120" preserveAspectRatio="none" style={{ height: 80 }}>
          <path
            d="M0,40 C200,80 400,20 600,60 C800,100 1000,20 1200,60 C1350,90 1400,40 1440,50 L1440,120 L0,120 Z"
            fill="rgba(8,145,178,0.65)"
          />
        </svg>
        {/* Sandy shore */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16"
          style={{ background: "linear-gradient(180deg, #fde68a 0%, #f59e0b 100%)" }}
        />

        {/* Bubbles on sand */}
        {[12, 25, 38, 52, 65, 78].map((x, i) => (
          <div
            key={i}
            className="bubble absolute rounded-full"
            style={{
              width: `${6 + (i % 3) * 4}px`,
              height: `${6 + (i % 3) * 4}px`,
              left: `${x}%`,
              bottom: `${14 + (i % 2) * 8}px`,
              background: "rgba(255,255,255,0.5)",
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Coconut palm left */}
      <div className="float-palm absolute bottom-14 left-6" style={{ transformOrigin: "bottom center" }}>
        <svg width="110" height="220" viewBox="0 0 110 220">
          {/* Trunk */}
          <path d="M55 220 Q48 180 52 140 Q56 100 50 60 Q54 40 58 60 Q62 100 58 140 Q62 180 60 220" fill="#92400e" />
          {/* Leaves */}
          <path d="M54 65 Q20 30 0 45 Q25 35 54 55" fill="#15803d"/>
          <path d="M54 65 Q80 20 110 30 Q85 25 56 55" fill="#16a34a"/>
          <path d="M54 65 Q10 55 0 75 Q20 60 52 68" fill="#15803d"/>
          <path d="M54 65 Q95 50 110 65 Q88 55 56 68" fill="#16a34a"/>
          <path d="M54 65 Q30 15 35 0 Q38 20 54 58" fill="#14532d"/>
          <path d="M54 65 Q75 10 72 0 Q68 22 56 58" fill="#15803d"/>
          {/* Coconuts */}
          <circle cx="50" cy="68" r="5" fill="#7c3f0a"/>
          <circle cx="58" cy="70" r="5" fill="#6b3309"/>
          <circle cx="54" cy="63" r="4" fill="#7c3f0a"/>
        </svg>
      </div>

      {/* Coconut palm right */}
      <div className="float-palm absolute bottom-14 right-4" style={{ transformOrigin: "bottom center", animationDelay: "-3s" }}>
        <svg width="100" height="200" viewBox="0 0 100 200">
          <path d="M50 200 Q45 165 48 128 Q52 95 46 55 Q50 38 54 55 Q58 95 54 128 Q57 165 55 200" fill="#92400e"/>
          <path d="M50 60 Q16 28 0 42 Q22 32 48 53" fill="#16a34a"/>
          <path d="M50 60 Q78 18 100 28 Q78 22 52 53" fill="#15803d"/>
          <path d="M50 60 Q8 50 0 68 Q18 55 48 63" fill="#14532d"/>
          <path d="M50 60 Q90 45 100 60 Q82 50 52 63" fill="#16a34a"/>
          <path d="M50 60 Q28 12 30 0 Q34 18 50 55" fill="#15803d"/>
          <circle cx="46" cy="63" r="5" fill="#7c3f0a"/>
          <circle cx="54" cy="65" r="5" fill="#6b3309"/>
        </svg>
      </div>

      {/* Starfish on sand */}
      <div className="absolute bottom-4 left-1/3">
        <svg width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 2 L16 10 L24 8 L18 14 L24 20 L16 18 L14 26 L12 18 L4 20 L10 14 L4 8 L12 10 Z" fill="#f97316" opacity="0.8"/>
        </svg>
      </div>
      <div className="absolute bottom-3 right-2/5">
        <svg width="20" height="20" viewBox="0 0 20 20">
          <path d="M10 1 L11.5 7 L18 5.5 L13 10 L18 14.5 L11.5 13 L10 19 L8.5 13 L2 14.5 L7 10 L2 5.5 L8.5 7 Z" fill="#ef4444" opacity="0.7"/>
        </svg>
      </div>

      {/* Crab */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
        <svg width="40" height="30" viewBox="0 0 40 30">
          <ellipse cx="20" cy="18" rx="10" ry="7" fill="#dc2626"/>
          <circle cx="15" cy="13" r="3" fill="#b91c1c"/>
          <circle cx="25" cy="13" r="3" fill="#b91c1c"/>
          <circle cx="14" cy="12" r="1" fill="#fff"/>
          <circle cx="24" cy="12" r="1" fill="#fff"/>
          {/* Claws */}
          <path d="M10 16 Q4 12 2 8 Q5 6 8 10 L10 16" fill="#dc2626"/>
          <path d="M30 16 Q36 12 38 8 Q35 6 32 10 L30 16" fill="#dc2626"/>
          {/* Legs */}
          <path d="M13 22 Q8 26 5 28" stroke="#b91c1c" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M17 24 Q14 28 12 30" stroke="#b91c1c" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M23 24 Q26 28 28 30" stroke="#b91c1c" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M27 22 Q32 26 35 28" stroke="#b91c1c" strokeWidth="2" fill="none" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Seashell */}
      <div className="absolute bottom-4 left-1/4">
        <svg width="22" height="20" viewBox="0 0 22 20">
          <path d="M11 2 Q18 2 20 10 Q20 18 11 18 Q4 16 3 10 Q4 2 11 2Z" fill="#fbbf24" opacity="0.8"/>
          <path d="M11 4 Q16 4 17 10 Q16 16 11 16" stroke="#f59e0b" strokeWidth="1" fill="none"/>
          <path d="M9 4 Q7 7 8 12" stroke="#f59e0b" strokeWidth="1" fill="none"/>
        </svg>
      </div>

      {/* Ocean fish peeking */}
      <div className="absolute" style={{ bottom: "58px", left: "60%" }}>
        <svg width="36" height="24" viewBox="0 0 36 24">
          <path d="M0 12 Q8 0 20 8 Q28 4 36 12 Q28 20 20 16 Q8 24 0 12Z" fill="#60a5fa" opacity="0.85"/>
          <circle cx="22" cy="10" r="2" fill="#1e3a8a"/>
          <circle cx="22.5" cy="9.5" r="0.8" fill="#fff"/>
          <path d="M0 12 Q4 8 0 4" fill="#3b82f6"/>
        </svg>
      </div>

      {/* Central title */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ paddingBottom: "120px" }}
      >
        <div
          className={`transition-all duration-700 ${phase === "intro" ? "opacity-0 scale-90 translate-y-4" : "opacity-100 scale-100 translate-y-0"}`}
        >
          {/* Decorative line */}
          <div className="flex items-center gap-3 mb-4 justify-center">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-cyan-300/80"/>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="#fbbf24"><path d="M10 1l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z"/></svg>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="#fbbf24" opacity="0.7"><path d="M10 1l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z"/></svg>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="#fbbf24"><path d="M10 1l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z"/></svg>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-cyan-300/80"/>
          </div>

          <h1 className="shimmer-text text-5xl font-bold text-center mb-1 tracking-wide" style={{ fontFamily: "Georgia, serif" }}>
            WebGIS
          </h1>
          <h2 className="text-white text-2xl font-semibold text-center tracking-widest mb-2" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}>
            MALUKU TENGAH
          </h2>
          <p className="text-cyan-100/90 text-sm text-center font-medium tracking-wider" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.3)" }}>
            Jelajahi Keindahan Kepulauan Maluku
          </p>

          {/* Loading bar */}
          <div className="mt-6 w-64 mx-auto">
            <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.2)" }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  background: "linear-gradient(90deg, #22d3ee, #06b6d4)",
                  width: phase === "scene" ? "100%" : "0%",
                  transitionDuration: "5.5s",
                  transitionTimingFunction: "linear",
                }}
              />
            </div>
            <p className="text-center text-cyan-200/70 text-xs mt-2 tracking-widest">Memuat peta...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
