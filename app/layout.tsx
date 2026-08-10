import type { Metadata, Viewport } from "next";
import { Quicksand, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { A11yToggle } from "@/components/a11y-toggle";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ajari-aku.vercel.app";
const DESC =
  "Pahami Matematika lebih dalam dengan mengajari murid AI (protégé effect). SD sampai SMA, Kurikulum Merdeka. Gratis.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Ajari Aku: Belajar dengan Mengajar",
    template: "%s · Ajari Aku",
  },
  description: DESC,
  applicationName: "Ajari Aku",
  keywords: ["belajar matematika", "kurikulum merdeka", "protégé effect", "murid AI", "SDG 4", "pendidikan"],
  appleWebApp: { capable: true, title: "Ajari Aku", statusBarStyle: "default" },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE,
    siteName: "Ajari Aku",
    title: "Ajari Aku: Kamu yang mengajari AI-nya",
    description: DESC,
  },
  twitter: {
    card: "summary_large_image",
    title: "Ajari Aku: Kamu yang mengajari AI-nya",
    description: DESC,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8faff" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1626" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${quicksand.variable} ${jakarta.variable} h-full antialiased`}
    >
      <head>
        {/* Set tema SEBELUM paint agar tak ada kedip putih (FOUC) saat mode gelap. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('ajari-aku:tema');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}",
          }}
        />
      </head>
      <body className="min-h-full">
        {children}
        <div className="fixed inset-x-0 bottom-24 z-[90] pointer-events-none lg:bottom-8">
          <div className="mx-auto flex max-w-5xl px-4 md:px-6">
            <div className="pointer-events-auto">
              <A11yToggle />
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
