import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Os assets são PNGs estáticos pequenos (3–10 KB) servidos como estão;
      // `next/image` só adicionaria JS no cliente e um otimizador sem ganho.
      // As imagens têm width/height explícitos.
      "@next/next/no-img-element": "off",
    },
  },
]);

export default eslintConfig;
