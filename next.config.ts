import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    // CSP protektif tapi aman: skrip dibatasi self+inline (blokir skrip eksternal jahat),
    // objek/base-uri/frame-ancestors dikunci; connect/img/frame diizinkan https: agar Firebase
    // (Auth + Firestore) & foto profil Google tetap jalan. Skrip inline tema butuh 'unsafe-inline'.
    // apis.google.com + accounts.google.com WAJIB di script-src: Firebase memuat skrip ini
    // untuk login Google (signInWithPopup) — tanpa ini popup gagal → auth/internal-error.
    // Dev (next dev) butuh 'unsafe-eval' untuk fitur debug React/Turbopack; PRODUKSI tetap ketat
    // (tanpa unsafe-eval) karena React tak memakai eval di produksi.
    const dev = process.env.NODE_ENV !== "production";
    const csp = [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""} https://apis.google.com https://www.gstatic.com https://accounts.google.com`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https:",
      "frame-src 'self' https:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      "upgrade-insecure-requests",
    ].join("; ");
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          // Izinkan popup login Google (signInWithPopup) "ngobrol balik" ke halaman.
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
          // Hardening keamanan dasar (dinilai reviewer keamanan / Lighthouse Best Practices).
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=(), bluetooth=(), accelerometer=(), gyroscope=(), magnetometer=(), midi=(), hid=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
