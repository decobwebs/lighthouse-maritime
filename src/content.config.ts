import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const item = z.object({
  title: z.string(),
  text: z.string(),
});

/** Section heading: bold clause + lighter clause, plus optional intro paragraph. */
const heading = z.object({
  title: z.string(),
  dim: z.string(),
  body: z.string().optional(),
});

const services = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/services' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      slug: z.string(),
      order: z.number(),
      code: z.string(),
      eyebrow: z.string(),
      h1: z.string(),
      h1Dim: z.string(),
      lead: z.string(),
      /** One-line summary used on service cards (Home bento wording). */
      card: z.string(),
      heroImage: image(),
      heroAlt: z.string(),
      heroPosition: z.string().default('center'),
      /** Photo beside "What we need from you". */
      needImage: image(),
      needAlt: z.string(),
      needPosition: z.string().default('center'),
      included: z.array(item).length(6),
      includedHeading: heading,
      whoFor: z.array(item).length(3),
      whoForHeading: heading,
      weNeed: z.array(z.string()).min(1),
      weNeedHeading: heading,
      related: z.array(z.string()).length(3),
      meta: z.object({
        title: z.string(),
        description: z.string().max(160),
      }),
    }),
});

export const collections = { services };
