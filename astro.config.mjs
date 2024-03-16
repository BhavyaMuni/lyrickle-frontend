import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  devToolbar: { enabled: false },
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    ,
    react(),
  ],
  output: "server",
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
});
