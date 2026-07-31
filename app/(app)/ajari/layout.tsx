import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ajari Murid AI",
  description: "Ajari murid AI langkah demi langkah, cara paling dalam untuk benar-benar paham (protégé effect).",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
