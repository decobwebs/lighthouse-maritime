// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Fully static site: no server code. Forms are sent from the visitor's own email app or WhatsApp.
export default defineConfig({
  site: 'https://lighthousemaritimeltd.com',
  output: 'static',
  // Inline the (small) page CSS so it doesn't block first paint as separate requests.
  build: { inlineStylesheets: 'always' },
  integrations: [
    sitemap({
      // Temporary Stage 1 test pages stay out of the sitemap.
      filter: (page) => !page.includes('/test-layout'),
    }),
  ],
});
