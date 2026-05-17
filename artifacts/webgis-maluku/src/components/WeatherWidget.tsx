import { useState, useEffect } from "react";
import { X, Wind, Droplets, Eye, Thermometer, Gauge, CloudRain } from "lucide-react";

interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  visibility: number;
  uvIndex: number;
  precipitationProb: number;
  weatherCode: number;
  pressure: number;
  cloudCover: number;
}

function getWeatherDesc(code: number): { label: string; emoji: string } {
  if (code === 0) return { label: "Cerah", emoji: "☀️" };
  if (code <= 2) return { label: "Sebagian Berawan", emoji: "⛅" };
  if (code === 3) return { label: "Berawan", emoji: "☁️" };
  if (code <= 49) return { label: "Berkabut", emoji: "🌫️" };
  if (code <= 59) return { label: "Gerimis", emoji: "🌦️" };
  if (code <= 69) return { label: "Hujan", emoji: "🌧️" };
  if (code <= 79) return { label: "Salju", emoji: "🌨️" };
  if (code <= 82) return { label: "Hujan Lebat", emoji: "⛈️" };
  if (code <= 99) return { label: "Badai Petir", emoji: "🌩️" };
  return { label: "Tidak Diketahui", emoji: "🌡️" };
}

function getWindDir(deg: number): string {
  const dirs = ["U", "TL", "T", "TG", "S", "BD", "B", "BL"];
  return dirs[Math.round(deg / 45) % 8];
}

function getUvLabel(uv: number): { label: string; color: string } {
  if (uv <= 2) return { label: "Rendah", color: "#22c55e" };
  if (uv <= 5) return { label: "Sedang", color: "#eab308" };
  if (uv <= 7) return { label: "Tinggi", color: "#f97316" };
  return { label: "Sangat Tinggi", color: "#ef4444" };
}

// WIT = UTC+9 (Maluku Tengah / Ambon)
const WIT_OFFSET_MS = 9 * 60 * 60 * 1000;

function getWITDate(): Date {
  const now = new Date();
  // Create a new Date representing current UTC time shifted by +9h
  return new Date(now.getTime() + WIT_OFFSET_MS - now.getTimezoneOffset() * 60000);
}

function formatTime(d: Date): string {
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  const ss = String(d.getUTCSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

function formatDate(d: Date): string {
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
  return `${days[d.getUTCDay()]}, ${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

interface WeatherWidgetProps {
  onClose: () => void;
  isClosing: boolean;
}

export default function WeatherWidget({ onClose, isClosing }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [currentTime, setCurrentTime] = useState(getWITDate());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Real-time clock — tick every second using WIT
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(getWITDate()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch weather for Ambon (Maluku Tengah)
  useEffect(() => {
    const lat = -3.6954;
    const lon = 128.1814;
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,` +
      `wind_direction_10m,weather_code,cloud_cover,surface_pressure,visibility,uv_index,precipitation_probability` +
      `&timezone=Asia%2FJayapura&forecast_days=1`;

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        const c = data.current;
        setWeather({
          temperature: Math.round(c.temperature_2m),
          feelsLike: Math.round(c.apparent_temperature),
          humidity: c.relative_humidity_2m,
          windSpeed: Math.round(c.wind_speed_10m),
          windDirection: c.wind_direction_10m,
          visibility: Math.round((c.visibility || 10000) / 1000),
          uvIndex: Math.round(c.uv_index || 0),
          precipitationProb: c.precipitation_probability || 0,
          weatherCode: c.weather_code,
          pressure: Math.round(c.surface_pressure || 1013),
          cloudCover: c.cloud_cover || 0,
        });
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const weatherDesc = weather ? getWeatherDesc(weather.weatherCode) : { label: "—", emoji: "🌡️" };

  return (
    <div
      className={`absolute z-[800] ${isClosing ? "slide-out" : "slide-in"}`}
      style={{
        bottom: "56px",
        left: "16px",
        width: "256px",
        background: "rgba(8, 15, 35, 0.96)",
        backdropFilter: "blur(18px)",
        border: "1px solid rgba(34,211,238,0.2)",
        borderRadius: "16px",
        boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2"
        style={{ borderBottom: "1px solid rgba(34,211,238,0.1)" }}
      >
        <div className="flex items-center gap-1.5">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(34,211,238,0.15)" }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round">
              <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
            </svg>
          </div>
          <div>
            <div className="text-xs font-bold leading-none" style={{ color: "#22d3ee" }}>Cuaca & Waktu</div>
            <div className="text-xs leading-none mt-0.5" style={{ color: "rgba(148,163,184,0.55)" }}>Ambon, Maluku Tengah</div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-6 h-6 rounded-full flex items-center justify-center transition-all hover:scale-110 flex-shrink-0"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <X size={11} style={{ color: "rgba(148,163,184,0.8)" }} />
        </button>
      </div>

      <div className="px-3 py-2.5 space-y-2">
        {/* Real-time Clock WIT */}
        <div
          className="rounded-xl p-2.5"
          style={{ background: "rgba(34,211,238,0.06)", border: "1px solid rgba(34,211,238,0.12)" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div
                className="text-2xl font-bold tracking-tight"
                style={{ color: "#22d3ee", fontVariantNumeric: "tabular-nums", fontFeatureSettings: '"tnum"' }}
              >
                {formatTime(currentTime)}
              </div>
              <div className="text-xs mt-0.5" style={{ color: "rgba(148,163,184,0.65)" }}>
                {formatDate(currentTime)}
              </div>
            </div>
            <div className="text-right flex-shrink-0 ml-2">
              <div
                className="text-xs font-bold px-1.5 py-0.5 rounded-md"
                style={{ background: "rgba(34,211,238,0.18)", color: "#22d3ee" }}
              >
                WIT
              </div>
              <div className="text-xs mt-0.5" style={{ color: "rgba(148,163,184,0.45)" }}>UTC+9</div>
            </div>
          </div>
        </div>

        {/* Weather section */}
        {loading ? (
          <div className="flex items-center justify-center py-4 gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-transparent border-t-cyan-400 animate-spin" />
            <span className="text-xs" style={{ color: "rgba(148,163,184,0.6)" }}>Memuat cuaca...</span>
          </div>
        ) : error ? (
          <div className="text-center py-3">
            <div className="text-xl mb-1">🌐</div>
            <div className="text-xs" style={{ color: "rgba(148,163,184,0.6)" }}>Gagal memuat data cuaca</div>
          </div>
        ) : weather ? (
          <>
            {/* Temp + Condition */}
            <div
              className="rounded-xl p-2.5 flex items-center justify-between"
              style={{ background: "linear-gradient(135deg,rgba(8,145,178,0.18),rgba(34,211,238,0.07))", border: "1px solid rgba(34,211,238,0.15)" }}
            >
              <div>
                <div className="flex items-end gap-0.5">
                  <span className="text-3xl font-bold" style={{ color: "white" }}>{weather.temperature}</span>
                  <span className="text-base mb-1" style={{ color: "rgba(226,232,240,0.6)" }}>°C</span>
                </div>
                <div className="text-xs" style={{ color: "rgba(148,163,184,0.65)" }}>Terasa {weather.feelsLike}°C</div>
                <div className="text-xs font-medium" style={{ color: "rgba(226,232,240,0.85)" }}>{weatherDesc.label}</div>
              </div>
              <div className="text-4xl">{weatherDesc.emoji}</div>
            </div>

            {/* 2x2 stats grid */}
            <div className="grid grid-cols-2 gap-1.5">
              <div className="rounded-xl p-2" style={{ background: "rgba(34,211,238,0.05)", border: "1px solid rgba(34,211,238,0.1)" }}>
                <div className="flex items-center gap-1 mb-0.5">
                  <Droplets size={10} style={{ color: "#38bdf8" }} />
                  <span className="text-xs" style={{ color: "rgba(148,163,184,0.55)" }}>Kelembapan</span>
                </div>
                <div className="text-sm font-bold" style={{ color: "rgba(226,232,240,0.9)" }}>{weather.humidity}%</div>
              </div>

              <div className="rounded-xl p-2" style={{ background: "rgba(34,211,238,0.05)", border: "1px solid rgba(34,211,238,0.1)" }}>
                <div className="flex items-center gap-1 mb-0.5">
                  <Wind size={10} style={{ color: "#38bdf8" }} />
                  <span className="text-xs" style={{ color: "rgba(148,163,184,0.55)" }}>Angin</span>
                </div>
                <div className="text-sm font-bold" style={{ color: "rgba(226,232,240,0.9)" }}>
                  {weather.windSpeed}<span className="text-xs font-normal"> km/j</span>
                  <span className="text-xs ml-1" style={{ color: "rgba(148,163,184,0.5)" }}>{getWindDir(weather.windDirection)}</span>
                </div>
              </div>

              <div className="rounded-xl p-2" style={{ background: "rgba(34,211,238,0.05)", border: "1px solid rgba(34,211,238,0.1)" }}>
                <div className="flex items-center gap-1 mb-0.5">
                  <Eye size={10} style={{ color: "#38bdf8" }} />
                  <span className="text-xs" style={{ color: "rgba(148,163,184,0.55)" }}>Jarak Pandang</span>
                </div>
                <div className="text-sm font-bold" style={{ color: "rgba(226,232,240,0.9)" }}>{weather.visibility}<span className="text-xs font-normal"> km</span></div>
              </div>

              <div className="rounded-xl p-2" style={{ background: "rgba(34,211,238,0.05)", border: "1px solid rgba(34,211,238,0.1)" }}>
                <div className="flex items-center gap-1 mb-0.5">
                  <Gauge size={10} style={{ color: "#38bdf8" }} />
                  <span className="text-xs" style={{ color: "rgba(148,163,184,0.55)" }}>Tekanan</span>
                </div>
                <div className="text-sm font-bold" style={{ color: "rgba(226,232,240,0.9)" }}>{weather.pressure}<span className="text-xs font-normal"> hPa</span></div>
              </div>
            </div>

            {/* UV + Rain row */}
            <div className="grid grid-cols-2 gap-1.5">
              <div className="rounded-xl p-2" style={{ background: "rgba(249,115,22,0.07)", border: "1px solid rgba(249,115,22,0.14)" }}>
                <div className="flex items-center gap-1 mb-0.5">
                  <Thermometer size={10} style={{ color: "#f97316" }} />
                  <span className="text-xs" style={{ color: "rgba(148,163,184,0.55)" }}>Indeks UV</span>
                </div>
                <div className="text-sm font-bold" style={{ color: getUvLabel(weather.uvIndex).color }}>
                  {weather.uvIndex} <span className="text-xs font-normal">{getUvLabel(weather.uvIndex).label}</span>
                </div>
              </div>

              <div className="rounded-xl p-2" style={{ background: "rgba(56,189,248,0.07)", border: "1px solid rgba(56,189,248,0.14)" }}>
                <div className="flex items-center gap-1 mb-0.5">
                  <CloudRain size={10} style={{ color: "#38bdf8" }} />
                  <span className="text-xs" style={{ color: "rgba(148,163,184,0.55)" }}>Prob. Hujan</span>
                </div>
                <div className="text-sm font-bold" style={{ color: "#38bdf8" }}>{weather.precipitationProb}%</div>
              </div>
            </div>

            {/* Cloud cover bar */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs" style={{ color: "rgba(148,163,184,0.55)" }}>Tutupan Awan</span>
                <span className="text-xs" style={{ color: "rgba(226,232,240,0.7)" }}>{weather.cloudCover}%</span>
              </div>
              <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                <div className="h-full rounded-full" style={{ width: `${weather.cloudCover}%`, background: "linear-gradient(90deg,#22d3ee,#38bdf8)" }} />
              </div>
            </div>
          </>
        ) : null}

        {/* Footer */}
        <div className="text-center pt-0.5 pb-0.5">
          <span className="text-xs" style={{ color: "rgba(148,163,184,0.3)" }}>Open-Meteo • Diperbarui tiap jam</span>
        </div>
      </div>
    </div>
  );
}
