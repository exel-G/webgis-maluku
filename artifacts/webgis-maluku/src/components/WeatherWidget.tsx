import { useState, useEffect } from "react";
import { X, Wind, Droplets, Eye, Thermometer, Gauge, Sunrise, Sunset, CloudRain } from "lucide-react";

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

function formatTime(date: Date): string {
  return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

function getSunTime(offset: number, isRise: boolean): string {
  // Ambon approximate: sunrise ~06:00, sunset ~18:00
  const h = isRise ? 6 : 18;
  const m = isRise ? 5 : 12;
  const d = new Date();
  d.setUTCHours(h - offset, m, 0);
  return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false });
}

interface WeatherWidgetProps {
  onClose: () => void;
  isClosing: boolean;
}

export default function WeatherWidget({ onClose, isClosing }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch weather (Ambon, Maluku Tengah coords: -3.6954, 128.1814)
  useEffect(() => {
    const lat = -3.6954;
    const lon = 128.1814;
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,` +
      `wind_direction_10m,weather_code,cloud_cover,surface_pressure,visibility,uv_index,precipitation_probability` +
      `&timezone=Asia%2FJakarta&forecast_days=1`;

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

  // WIB = UTC+7
  const wibTime = new Date(currentTime.getTime() + (7 * 60 - currentTime.getTimezoneOffset()) * 60000);
  const displayTime = formatTime(wibTime);
  const displayDate = formatDate(wibTime);

  const getUvLabel = (uv: number) => {
    if (uv <= 2) return { label: "Rendah", color: "#22c55e" };
    if (uv <= 5) return { label: "Sedang", color: "#eab308" };
    if (uv <= 7) return { label: "Tinggi", color: "#f97316" };
    return { label: "Sangat Tinggi", color: "#ef4444" };
  };

  return (
    <div
      className={`absolute z-[800] ${isClosing ? "slide-out" : "slide-in"}`}
      style={{
        bottom: "56px",
        left: "16px",
        width: "280px",
        background: "rgba(8, 15, 35, 0.96)",
        backdropFilter: "blur(18px)",
        border: "1px solid rgba(34,211,238,0.2)",
        borderRadius: "20px",
        boxShadow: "0 16px 48px rgba(0,0,0,0.45)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid rgba(34,211,238,0.1)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(34,211,238,0.15)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round">
              <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
            </svg>
          </div>
          <div>
            <div className="text-xs font-bold" style={{ color: "#22d3ee" }}>Cuaca Ambon</div>
            <div className="text-xs" style={{ color: "rgba(148,163,184,0.6)" }}>Maluku Tengah</div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <X size={13} style={{ color: "rgba(148,163,184,0.8)" }} />
        </button>
      </div>

      <div className="px-4 py-3 space-y-3">
        {/* Real-time Clock */}
        <div
          className="rounded-2xl p-3"
          style={{ background: "rgba(34,211,238,0.06)", border: "1px solid rgba(34,211,238,0.12)" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div
                className="text-3xl font-bold tracking-tight tabular-nums"
                style={{ color: "#22d3ee", fontVariantNumeric: "tabular-nums" }}
              >
                {displayTime}
              </div>
              <div className="text-xs mt-0.5" style={{ color: "rgba(148,163,184,0.7)" }}>
                {displayDate}
              </div>
            </div>
            <div className="text-right">
              <div
                className="text-xs font-semibold px-2 py-1 rounded-lg"
                style={{ background: "rgba(34,211,238,0.15)", color: "#22d3ee" }}
              >
                WIB
              </div>
              <div className="text-xs mt-1" style={{ color: "rgba(148,163,184,0.5)" }}>UTC+7</div>
            </div>
          </div>
        </div>

        {/* Weather Main */}
        {loading ? (
          <div className="flex items-center justify-center py-6 gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-transparent border-t-cyan-400 animate-spin" />
            <span className="text-xs" style={{ color: "rgba(148,163,184,0.6)" }}>Memuat cuaca...</span>
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <div className="text-2xl mb-1">🌐</div>
            <div className="text-xs" style={{ color: "rgba(148,163,184,0.6)" }}>Tidak dapat memuat data cuaca</div>
          </div>
        ) : weather ? (
          <>
            {/* Temp + Condition */}
            <div
              className="rounded-2xl p-3 flex items-center justify-between"
              style={{ background: "linear-gradient(135deg, rgba(8,145,178,0.2), rgba(34,211,238,0.08))", border: "1px solid rgba(34,211,238,0.15)" }}
            >
              <div>
                <div className="flex items-end gap-1">
                  <span className="text-5xl font-bold" style={{ color: "white" }}>{weather.temperature}</span>
                  <span className="text-2xl mb-2" style={{ color: "rgba(226,232,240,0.7)" }}>°C</span>
                </div>
                <div className="text-xs" style={{ color: "rgba(148,163,184,0.7)" }}>
                  Terasa {weather.feelsLike}°C
                </div>
                <div className="text-sm font-medium mt-1" style={{ color: "rgba(226,232,240,0.9)" }}>
                  {weatherDesc.label}
                </div>
              </div>
              <div className="text-5xl">{weatherDesc.emoji}</div>
            </div>

            {/* Grid info */}
            <div className="grid grid-cols-2 gap-2">
              {/* Humidity */}
              <div className="rounded-xl p-2.5" style={{ background: "rgba(34,211,238,0.05)", border: "1px solid rgba(34,211,238,0.1)" }}>
                <div className="flex items-center gap-1.5 mb-1">
                  <Droplets size={12} style={{ color: "#38bdf8" }} />
                  <span className="text-xs" style={{ color: "rgba(148,163,184,0.6)" }}>Kelembapan</span>
                </div>
                <div className="text-base font-bold" style={{ color: "rgba(226,232,240,0.9)" }}>{weather.humidity}%</div>
              </div>

              {/* Wind */}
              <div className="rounded-xl p-2.5" style={{ background: "rgba(34,211,238,0.05)", border: "1px solid rgba(34,211,238,0.1)" }}>
                <div className="flex items-center gap-1.5 mb-1">
                  <Wind size={12} style={{ color: "#38bdf8" }} />
                  <span className="text-xs" style={{ color: "rgba(148,163,184,0.6)" }}>Angin</span>
                </div>
                <div className="text-base font-bold" style={{ color: "rgba(226,232,240,0.9)" }}>
                  {weather.windSpeed} <span className="text-xs font-normal">km/j</span>
                </div>
                <div className="text-xs" style={{ color: "rgba(148,163,184,0.5)" }}>{getWindDir(weather.windDirection)}</div>
              </div>

              {/* Visibility */}
              <div className="rounded-xl p-2.5" style={{ background: "rgba(34,211,238,0.05)", border: "1px solid rgba(34,211,238,0.1)" }}>
                <div className="flex items-center gap-1.5 mb-1">
                  <Eye size={12} style={{ color: "#38bdf8" }} />
                  <span className="text-xs" style={{ color: "rgba(148,163,184,0.6)" }}>Jarak Pandang</span>
                </div>
                <div className="text-base font-bold" style={{ color: "rgba(226,232,240,0.9)" }}>
                  {weather.visibility} <span className="text-xs font-normal">km</span>
                </div>
              </div>

              {/* Pressure */}
              <div className="rounded-xl p-2.5" style={{ background: "rgba(34,211,238,0.05)", border: "1px solid rgba(34,211,238,0.1)" }}>
                <div className="flex items-center gap-1.5 mb-1">
                  <Gauge size={12} style={{ color: "#38bdf8" }} />
                  <span className="text-xs" style={{ color: "rgba(148,163,184,0.6)" }}>Tekanan</span>
                </div>
                <div className="text-base font-bold" style={{ color: "rgba(226,232,240,0.9)" }}>
                  {weather.pressure} <span className="text-xs font-normal">hPa</span>
                </div>
              </div>
            </div>

            {/* UV + Rain row */}
            <div className="grid grid-cols-2 gap-2">
              {/* UV Index */}
              <div className="rounded-xl p-2.5" style={{ background: "rgba(249,115,22,0.07)", border: "1px solid rgba(249,115,22,0.15)" }}>
                <div className="flex items-center gap-1.5 mb-1">
                  <Thermometer size={12} style={{ color: "#f97316" }} />
                  <span className="text-xs" style={{ color: "rgba(148,163,184,0.6)" }}>Indeks UV</span>
                </div>
                <div className="text-base font-bold" style={{ color: getUvLabel(weather.uvIndex).color }}>
                  {weather.uvIndex}
                </div>
                <div className="text-xs" style={{ color: getUvLabel(weather.uvIndex).color }}>
                  {getUvLabel(weather.uvIndex).label}
                </div>
              </div>

              {/* Rain Probability */}
              <div className="rounded-xl p-2.5" style={{ background: "rgba(56,189,248,0.07)", border: "1px solid rgba(56,189,248,0.15)" }}>
                <div className="flex items-center gap-1.5 mb-1">
                  <CloudRain size={12} style={{ color: "#38bdf8" }} />
                  <span className="text-xs" style={{ color: "rgba(148,163,184,0.6)" }}>Prob. Hujan</span>
                </div>
                <div className="text-base font-bold" style={{ color: "#38bdf8" }}>
                  {weather.precipitationProb}%
                </div>
              </div>
            </div>

            {/* Sunrise / Sunset */}
            <div
              className="rounded-xl p-2.5 flex items-center justify-between"
              style={{ background: "rgba(251,191,36,0.07)", border: "1px solid rgba(251,191,36,0.15)" }}
            >
              <div className="flex items-center gap-2">
                <Sunrise size={14} style={{ color: "#fbbf24" }} />
                <div>
                  <div className="text-xs" style={{ color: "rgba(148,163,184,0.6)" }}>Matahari Terbit</div>
                  <div className="text-sm font-semibold" style={{ color: "rgba(226,232,240,0.9)" }}>{getSunTime(7, true)}</div>
                </div>
              </div>
              <div className="w-px h-8" style={{ background: "rgba(251,191,36,0.2)" }} />
              <div className="flex items-center gap-2">
                <Sunset size={14} style={{ color: "#f97316" }} />
                <div>
                  <div className="text-xs" style={{ color: "rgba(148,163,184,0.6)" }}>Matahari Terbenam</div>
                  <div className="text-sm font-semibold" style={{ color: "rgba(226,232,240,0.9)" }}>{getSunTime(7, false)}</div>
                </div>
              </div>
            </div>

            {/* Cloud cover bar */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span style={{ color: "rgba(148,163,184,0.6)" }}>Tutupan Awan</span>
                <span style={{ color: "rgba(226,232,240,0.8)" }}>{weather.cloudCover}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${weather.cloudCover}%`,
                    background: "linear-gradient(90deg, #22d3ee, #38bdf8)",
                  }}
                />
              </div>
            </div>
          </>
        ) : null}

        {/* Footer */}
        <div className="text-center pb-1">
          <span className="text-xs" style={{ color: "rgba(148,163,184,0.35)" }}>
            Sumber: Open-Meteo • Diperbarui tiap jam
          </span>
        </div>
      </div>
    </div>
  );
}
