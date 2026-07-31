import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ajari-aku.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/beranda", "/belajar", "/kelas", "/progres", "/profil", "/tentang", "/privasi"];
  return routes.map((r) => ({
    url: `${SITE}${r}`,
    changeFrequency: "weekly",
    priority: r === "" ? 1 : 0.7,
  }));
}
