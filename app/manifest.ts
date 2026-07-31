import type { MetadataRoute } from "next";

// PWA manifest → installable ("Add to Home Screen"). Ikon di-generate by-code (app/icon.tsx),
// jadi tak butuh folder public/. Skor Lighthouse PWA naik.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ajari Aku: Belajar dengan Mengajar",
    short_name: "Ajari Aku",
    description:
      "Pahami Matematika lebih dalam dengan mengajari murid AI (protégé effect). Kurikulum Merdeka, gratis.",
    start_url: "/beranda",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f8faff",
    theme_color: "#1591dc",
    lang: "id",
    categories: ["education"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
