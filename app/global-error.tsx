"use client"; // global-error menggantikan root layout → wajib render <html>/<body> & pakai inline style

import { useEffect } from "react";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("[global] error:", error);
  }, [error]);

  return (
    <html lang="id">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          padding: 24,
          textAlign: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#f8faff",
          color: "#0e1626",
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 40,
            fontWeight: 800,
            color: "white",
            background: "linear-gradient(140deg, #4bb8fa, #1591dc 55%, #2c5ead)",
          }}
        >
          A
        </div>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>Terjadi kesalahan</h1>
        <p style={{ margin: 0, maxWidth: 360, fontSize: 14, color: "#5b6b7e", lineHeight: 1.6 }}>
          Aplikasi mengalami masalah tak terduga. Datamu tetap aman di perangkat ini.
        </p>
        <button
          onClick={() => unstable_retry()}
          style={{
            marginTop: 4,
            border: 0,
            borderRadius: 999,
            padding: "12px 22px",
            fontSize: 15,
            fontWeight: 700,
            color: "white",
            background: "linear-gradient(140deg, #1591dc, #2c5ead)",
            cursor: "pointer",
          }}
        >
          Coba lagi
        </button>
      </body>
    </html>
  );
}
