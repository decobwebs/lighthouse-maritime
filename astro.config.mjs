// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// Static by default; form API routes opt in with `export const prerender = false`.
export default defineConfig({
  site: 'https://lighthousemaritimeltd.com',
  output: 'static',
  adapter: vercel(),
  integrations: [sitemap()],
});
