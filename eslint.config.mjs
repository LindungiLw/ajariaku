import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Pola load-on-mount (baca localStorage di useEffect [] lalu setState) dipakai luas & aman
      // untuk app tanpa-login ini (localStorage = sumber kebenaran). Rule baru react-hooks v6 ini
      // terlalu ketat untuk pola tsb → turunkan ke "warn" agar `npm run lint` tetap lolos (exit 0)
      // tanpa menyembunyikannya. Alternatif jangka panjang: useSyncExternalStore.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
