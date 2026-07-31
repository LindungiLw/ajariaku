import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang",
  description:
    "Kisah, landasan ilmiah (protégé effect & teknik Feynman), sumber Kurikulum Merdeka, dan cara kerja RAG di balik Ajari Aku.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
