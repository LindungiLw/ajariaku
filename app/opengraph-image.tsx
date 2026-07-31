import { ImageResponse } from "next/og";
import { logoDataUri } from "@/lib/logo-data";

// Kartu preview saat link dibagikan (WhatsApp/IG/Twitter/LinkedIn). 1200×630, by-code.
export const alt = "Ajari Aku: kamu yang mengajari AI-nya";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(140deg, #4bb8fa, #1591dc 55%, #2c5ead)",
          color: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 28,
              background: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoDataUri} width={84} height={84} alt="" />
          </div>
          <div style={{ fontSize: 40, fontWeight: 700, opacity: 0.92 }}>Ajari Aku</div>
        </div>
        <div style={{ fontSize: 82, fontWeight: 800, marginTop: 44, lineHeight: 1.05 }}>
          Kamu yang mengajari AI-nya.
        </div>
        <div style={{ fontSize: 34, marginTop: 24, opacity: 0.92 }}>
          Pahami Matematika lebih dalam lewat protégé effect · Kurikulum Merdeka
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 44, fontSize: 27, opacity: 0.9 }}>
          <span>Belajar</span>
          <span>→</span>
          <span>Ajari</span>
          <span>→</span>
          <span>Naik Level</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
