# WebGIS Maluku Tengah

Aplikasi WebGIS interaktif untuk menjelajahi 16.901 lokasi di Maluku Tengah, dilengkapi animasi opening screen pantai tropis, peta lengkap, dan panel informasi lokasi.

## Run & Operate

- `pnpm --filter @workspace/webgis-maluku run dev` — jalankan WebGIS (port 18745)
- `pnpm --filter @workspace/api-server run dev` — jalankan API server (port 8080)
- `pnpm run typecheck` — typecheck seluruh workspace

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite
- Map: Leaflet.js
- Styling: Tailwind CSS v4
- Data: GeoJSON (16.901 fitur lokasi Maluku Tengah)

## Where things live

- `artifacts/webgis-maluku/` — aplikasi WebGIS utama
- `artifacts/webgis-maluku/src/components/` — komponen map, panel, search, layer
- `artifacts/webgis-maluku/src/data/locationData.ts` — data deskripsi & kategori lokasi
- `artifacts/webgis-maluku/public/maluku.geojson` — data GeoJSON 16.901 lokasi
- `lib/api-spec/openapi.yaml` — OpenAPI spec

## Architecture decisions

- GeoJSON dimuat langsung dari `/public` tanpa backend (static asset) untuk performa cepat
- Leaflet.js dipilih untuk kompatibilitas browser luas dan dukungan tile layers beragam
- Marker dikategorikan berdasarkan `amenity` dan `tourism` dari data OSM
- Slide-in panel menggunakan CSS animation murni tanpa library tambahan
- Tile layer bisa diganti runtime (light/dark/satellite/topo) tanpa reload

## Product

- Opening screen 7 detik dengan animasi pantai tropis (matahari, pohon kelapa, ombak, kepiting, bintang laut)
- Peta interaktif Maluku Tengah dengan 16.901 marker terkategorisasi
- Search lokasi dengan autocomplete real-time
- GPS: klik untuk zoom ke posisi pengguna
- Layer control: aktifkan/nonaktifkan kategori lokasi (restoran, hotel, wisata, dll.)
- 4 tema peta: Light, Dark, Satelit, Topologi
- Slide-in panel detail lokasi: deskripsi, galeri foto, jam operasional, estimasi harga
- Tombol "Buka di Google Maps" untuk navigasi

## User preferences

- Bahasa UI: Bahasa Indonesia
- Tema: Tropical/Ocean (cyan, biru gelap, oranye)

## Gotchas

- GeoJSON berisi 16.901 fitur — hanya Point yang ditampilkan sebagai marker (939 named locations)
- Tile layer `topo` memiliki maxZoom 17 (lebih rendah dari lainnya)
- GPS memerlukan izin browser; pastikan site diakses via HTTPS di production
