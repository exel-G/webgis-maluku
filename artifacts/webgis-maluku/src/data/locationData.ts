export interface LocationInfo {
  name: string;
  category: string;
  description: string;
  photos: string[];
  openingHours: string;
  price: string;
  amenity?: string | null;
  tourism?: string | null;
  coords: [number, number];
}

export const CATEGORY_INFO: Record<string, {
  label: string;
  color: string;
  emoji: string;
  bgColor: string;
}> = {
  restaurant: { label: "Rumah Makan", color: "#f97316", emoji: "🍽️", bgColor: "#fff7ed" },
  cafe: { label: "Kafe", color: "#a16207", emoji: "☕", bgColor: "#fefce8" },
  fast_food: { label: "Makanan Cepat Saji", color: "#dc2626", emoji: "🍔", bgColor: "#fef2f2" },
  hotel: { label: "Hotel", color: "#7c3aed", emoji: "🏨", bgColor: "#f5f3ff" },
  guest_house: { label: "Penginapan", color: "#0891b2", emoji: "🏠", bgColor: "#ecfeff" },
  hostel: { label: "Hostel", color: "#059669", emoji: "🛏️", bgColor: "#f0fdf4" },
  motel: { label: "Motel", color: "#7c3aed", emoji: "🏩", bgColor: "#f5f3ff" },
  apartment: { label: "Apartemen", color: "#1d4ed8", emoji: "🏢", bgColor: "#eff6ff" },
  attraction: { label: "Wisata", color: "#16a34a", emoji: "🌴", bgColor: "#f0fdf4" },
  viewpoint: { label: "Spot Pemandangan", color: "#0284c7", emoji: "🔭", bgColor: "#f0f9ff" },
  picnic_site: { label: "Area Piknik", color: "#65a30d", emoji: "🧺", bgColor: "#f7fee7" },
  camp_site: { label: "Area Berkemah", color: "#854d0e", emoji: "⛺", bgColor: "#fef3c7" },
  museum: { label: "Museum", color: "#b45309", emoji: "🏛️", bgColor: "#fffbeb" },
  artwork: { label: "Seni & Budaya", color: "#be185d", emoji: "🎨", bgColor: "#fdf2f8" },
  information: { label: "Informasi", color: "#1d4ed8", emoji: "ℹ️", bgColor: "#eff6ff" },
  ferry_terminal: { label: "Terminal Feri", color: "#0369a1", emoji: "⛴️", bgColor: "#f0f9ff" },
  dive_centre: { label: "Selam & Snorkeling", color: "#0891b2", emoji: "🤿", bgColor: "#ecfeff" },
  hospital: { label: "Rumah Sakit", color: "#dc2626", emoji: "🏥", bgColor: "#fef2f2" },
  clinic: { label: "Klinik", color: "#b91c1c", emoji: "🩺", bgColor: "#fef2f2" },
  other: { label: "Lainnya", color: "#6b7280", emoji: "📍", bgColor: "#f9fafb" },
};

export function getCategory(props: Record<string, unknown>): string {
  return (props.amenity as string) || (props.tourism as string) || "other";
}

export function getCategoryInfo(category: string) {
  return CATEGORY_INFO[category] || CATEGORY_INFO.other;
}

const DESCRIPTIONS: Record<string, string[]> = {
  restaurant: [
    "Nikmati cita rasa masakan lokal Maluku yang kaya rempah, dengan menu ikan bakar, papeda, dan ikan kuah kuning yang menggugah selera.",
    "Restoran dengan suasana nyaman menyajikan hidangan laut segar khas Maluku — gurih, segar, dan penuh cita rasa Nusantara.",
    "Sajian masakan tradisional Ambon yang otentik: nasi lapola, kohu-kohu ikan, dan berbagai olahan rempah pilihan.",
  ],
  cafe: [
    "Kafe nyaman dengan pemandangan indah, menyajikan kopi lokal Maluku, minuman tropis segar, dan camilan ringan yang menggoda.",
    "Tempat nongkrong favorit warga lokal dengan nuansa tropis yang hangat, aneka kopi, dan kudapan ringan khas Maluku.",
    "Spot santai dengan interior estetik, menawarkan cold brew, jus buah tropis lokal, dan dessert istimewa.",
  ],
  hotel: [
    "Hotel berbintang dengan fasilitas lengkap di lokasi strategis. Nikmati kenyamanan kamar modern dengan pemandangan laut atau kota.",
    "Penginapan mewah yang menawarkan pengalaman menginap berkelas dengan kolam renang, restoran, dan akses ke pantai.",
    "Hotel dengan pelayanan ramah dan profesional, dilengkapi WiFi berkecepatan tinggi, AC, dan sarapan pagi.",
  ],
  guest_house: [
    "Penginapan cozy dengan suasana rumah sendiri. Sambutan hangat tuan rumah lokal membuat masa menginap terasa istimewa.",
    "Guest house bersih dan nyaman dengan harga terjangkau, cocok untuk backpacker yang ingin merasakan kehidupan lokal.",
    "Rumah singgah dengan sentuhan lokal Maluku — bersih, aman, dan ramah di tengah lingkungan warga.",
  ],
  hostel: [
    "Hostel budget-friendly dengan komunitas traveler yang aktif. Berbagi cerita dan pengalaman dengan sesama petualang.",
    "Tempat menginap terjangkau dengan fasilitas dapur bersama, loker, dan informasi wisata lokal yang lengkap.",
  ],
  attraction: [
    "Destinasi wisata unggulan yang wajib dikunjungi saat berada di Maluku Tengah. Keindahan alam dan budaya menyatu sempurna.",
    "Objek wisata dengan pemandangan spektakuler yang memukau. Spot foto terbaik dengan latar belakang alam Maluku yang menakjubkan.",
    "Atraksi wisata populer dengan kekayaan alam dan budaya Maluku. Rasakan pesona kepulauan rempah yang legendaris.",
  ],
  viewpoint: [
    "Spot pemandangan terbaik untuk menikmati keindahan panorama laut, pulau, dan perbukitan Maluku dari ketinggian.",
    "Titik pandang spektakuler dengan view 360° yang memuaskan mata. Ideal untuk foto sunrise atau sunset.",
    "Area viewpoint dengan panorama laut biru yang memukau dan cakrawala pulau-pulau indah di sekitarnya.",
  ],
  picnic_site: [
    "Area piknik yang asri dan teduh, sempurna untuk bersantai bersama keluarga sambil menikmati keindahan alam Maluku.",
    "Taman piknik di tepi pantai dengan fasilitas yang memadai untuk bersantai dan bermain.",
  ],
  camp_site: [
    "Area berkemah di alam terbuka dengan pemandangan bintang yang spektakuler pada malam hari.",
    "Lokasi camping dekat pantai dengan suasana alam yang segar dan tenang.",
  ],
  museum: [
    "Museum yang menyimpan koleksi sejarah dan budaya Maluku yang kaya. Jelajahi warisan rempah dan kejayaan bahari Nusantara.",
    "Temukan artefak bersejarah, koleksi keramik kuno, dan dokumentasi peradaban Maluku di museum budaya ini.",
  ],
  ferry_terminal: [
    "Terminal feri yang melayani rute antar pulau di Maluku. Gerbang perjalanan menuju pulau-pulau eksotis sekitar.",
    "Pelabuhan penyeberangan dengan jadwal rutin menuju berbagai pulau di Maluku Tengah.",
  ],
  dive_centre: [
    "Pusat selam dan snorkeling dengan instruktur berpengalaman. Jelajahi keindahan bawah laut Maluku yang luar biasa!",
    "Nikmati pengalaman menyelam di antara terumbu karang berwarna-warni dan ikan tropis yang memesona.",
  ],
  hospital: [
    "Fasilitas kesehatan yang memberikan pelayanan medis 24 jam dengan tenaga profesional dan peralatan modern.",
    "Rumah sakit dengan berbagai spesialisasi medis, siap melayani kebutuhan kesehatan masyarakat dan wisatawan.",
  ],
  clinic: [
    "Klinik kesehatan umum dengan dokter dan tenaga medis yang berpengalaman untuk penanganan keluhan kesehatan ringan hingga sedang.",
    "Pusat layanan kesehatan dengan pelayanan ramah dan harga terjangkau.",
  ],
  fast_food: [
    "Kedai makanan cepat saji dengan menu lezat dan pelayanan sigap. Cocok untuk mengisi energi saat menjelajah.",
    "Warung makan sederhana dengan hidangan lezat, porsi mengenyangkan, dan harga sangat terjangkau.",
  ],
  other: [
    "Lokasi menarik di jantung Maluku Tengah dengan berbagai potensi dan keunikan tersendiri.",
    "Tempat yang patut dikunjungi saat berada di Maluku Tengah untuk pengalaman yang tak terlupakan.",
  ],
};

export function getDescription(category: string): string {
  const list = DESCRIPTIONS[category] || DESCRIPTIONS.other;
  return list[Math.floor(Math.random() * list.length)];
}

const STOCK_PHOTOS: Record<string, string[]> = {
  restaurant: [
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80",
    "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80",
  ],
  cafe: [
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&q=80",
    "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=400&q=80",
    "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=400&q=80",
  ],
  hotel: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&q=80",
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&q=80",
  ],
  guest_house: [
    "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&q=80",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&q=80",
  ],
  hostel: [
    "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&q=80",
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&q=80",
  ],
  attraction: [
    "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&q=80",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80",
  ],
  viewpoint: [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80",
    "https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?w=400&q=80",
  ],
  museum: [
    "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=400&q=80",
    "https://images.unsplash.com/photo-1503152394-c571994fd383?w=400&q=80",
  ],
  ferry_terminal: [
    "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=400&q=80",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  ],
  dive_centre: [
    "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=400&q=80",
    "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=400&q=80",
    "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&q=80",
  ],
  picnic_site: [
    "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&q=80",
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80",
  ],
  camp_site: [
    "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&q=80",
    "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=400&q=80",
  ],
  hospital: [
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&q=80",
    "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&q=80",
  ],
  clinic: [
    "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&q=80",
    "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&q=80",
  ],
  fast_food: [
    "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400&q=80",
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
  ],
  other: [
    "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&q=80",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
  ],
};

export function getPhotos(category: string): string[] {
  const list = STOCK_PHOTOS[category] || STOCK_PHOTOS.other;
  const shuffled = [...list].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(3, shuffled.length));
}

const HOURS: Record<string, string> = {
  restaurant: "08.00 – 22.00 (Setiap Hari)",
  cafe: "07.00 – 23.00 (Setiap Hari)",
  fast_food: "08.00 – 23.00 (Setiap Hari)",
  hotel: "24 Jam (Check-in: 14.00 | Check-out: 12.00)",
  guest_house: "24 Jam",
  hostel: "24 Jam (Check-in: 14.00)",
  motel: "24 Jam",
  apartment: "24 Jam",
  attraction: "06.00 – 18.00 (Setiap Hari)",
  viewpoint: "05.00 – 19.00 (Ideal untuk Sunrise & Sunset)",
  picnic_site: "06.00 – 18.00",
  camp_site: "24 Jam",
  museum: "08.00 – 16.00 (Senin – Sabtu, Tutup Minggu)",
  ferry_terminal: "06.00 – 20.00 (Sesuai Jadwal Kapal)",
  dive_centre: "07.00 – 17.00 (Dengan Reservasi)",
  hospital: "24 Jam",
  clinic: "08.00 – 20.00 (Senin – Sabtu)",
  artwork: "08.00 – 17.00",
  information: "08.00 – 17.00",
  other: "Hubungi untuk Informasi Jam Buka",
};

export function getHours(category: string, openingHours?: string | null): string {
  if (openingHours) return openingHours;
  return HOURS[category] || HOURS.other;
}

const PRICES: Record<string, string> = {
  restaurant: "Rp 25.000 – Rp 85.000 / orang",
  cafe: "Rp 15.000 – Rp 55.000 / minuman",
  fast_food: "Rp 10.000 – Rp 35.000 / porsi",
  hotel: "Rp 350.000 – Rp 1.200.000 / malam",
  guest_house: "Rp 150.000 – Rp 400.000 / malam",
  hostel: "Rp 80.000 – Rp 200.000 / malam",
  motel: "Rp 180.000 – Rp 450.000 / malam",
  apartment: "Rp 2.000.000 – Rp 8.000.000 / bulan",
  attraction: "Gratis – Rp 25.000 / orang",
  viewpoint: "Gratis",
  picnic_site: "Gratis",
  camp_site: "Rp 30.000 – Rp 75.000 / malam",
  museum: "Rp 10.000 – Rp 25.000 / orang",
  ferry_terminal: "Rp 15.000 – Rp 150.000 / rute",
  dive_centre: "Rp 350.000 – Rp 850.000 / sesi",
  hospital: "Sesuai Jenis Layanan / BPJS",
  clinic: "Rp 30.000 – Rp 150.000 / konsultasi",
  artwork: "Gratis",
  information: "Gratis",
  other: "Informasi tidak tersedia",
};

export function getPrice(category: string): string {
  return PRICES[category] || PRICES.other;
}
