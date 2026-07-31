import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Belajar",
  description: "Peta petualangan Matematika SD sampai SMA (Kurikulum Merdeka Fase A sampai F). Pilih kelasmu dan mulai mendaki.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
