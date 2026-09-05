import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z
    .object({
      title: z.string(),
      description: z.string(),
      publishDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      draft: z.boolean().default(false),
      category: z.string().default('Notes'),
      tags: z.array(z.string()).default([]),
      featured: z.boolean().default(false),
      cover: z.string().optional(),
      coverAlt: z.string().trim().min(1).optional(),
      toc: z.boolean().default(true),
      comments: z.boolean().default(false),
      canonical: z.url().optional(),
      series: z.string().optional(),
    })
    .superRefine((post, context) => {
      if (post.cover && !post.coverAlt) {
        context.addIssue({
          code: 'custom',
          path: ['coverAlt'],
          message: 'coverAlt is required when cover is set.',
        });
      }
    }),
});

const profile = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/profile' }),
  schema: z.object({
    displayName: z.string().trim().min(1),
    tagline: z.string().trim().min(1),
    bio: z.string().trim().min(1),
    status: z.string().trim().min(1),
    avatar: z.object({
      src: z.string().trim().min(1).optional(),
      alt: z.string().trim().min(1),
      width: z.number().int().positive(),
      height: z.number().int().positive(),
      fallback: z.string().trim().min(1).default('M'),
    }),
    contacts: z.object({
      github: z.url().optional(),
      email: z.email().optional(),
      telegram: z.url().optional(),
      x: z.url().optional(),
      website: z.url().optional(),
      wechatQr: z.string().trim().min(1).optional(),
    }),
    aboutIntro: z.string().trim().min(1),
    care: z.array(
      z.object({
        title: z.string().trim().min(1),
        description: z.string().trim().min(1),
      }),
    ),
    seo: z.object({
      title: z.string().trim().min(1),
      description: z.string().trim().min(1),
    }),
  }),
});

const now = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/now' }),
  schema: z.object({
    updatedAt: z.coerce.date(),
    items: z.array(
      z.object({
        key: z.enum(['building', 'exploring', 'learning']),
        label: z.string().trim().min(1),
        text: z.string().trim().min(1),
      }),
    ).min(1),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    description: z.string().optional(),
    statusLabel: z.string().trim().min(1).optional(),
    status: z.enum(['idea', 'building', 'maintaining', 'paused', 'archived']),
    startedAt: z.coerce.date().optional(),
    endedAt: z.coerce.date().optional(),
    stack: z.array(z.string()).default([]),
    repo: z.url().optional(),
    demo: z.url().optional(),
    homepage: z.url().optional(),
    cover: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

const moments = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/moments' }),
  schema: z.object({
    publishDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    location: z.string().optional(),
    visibility: z.enum(['public', 'unlisted']).default('public'),
  }),
});

const gallery = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/gallery' }),
  schema: z.object({
    title: z.string(),
    image: z.string(),
    alt: z.string(),
    album: z.string().default('Unsorted'),
    shotDate: z.coerce.date().optional(),
    location: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

const timeline = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/timeline' }),
  schema: z.object({
    date: z.coerce.date(),
    title: z.string(),
    type: z.string().default('milestone'),
    description: z.string(),
    link: z.url().optional(),
  }),
});

const uses = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/uses' }),
  schema: z.object({
    name: z.string(),
    category: z.enum(['Infrastructure', 'Network', 'AI', 'Web', 'Hardware', 'Software', 'Daily Tools']),
    description: z.string(),
    url: z.url().optional(),
    icon: z.string().default('✳'),
    recommended: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

export const collections = { posts, projects, moments, gallery, timeline, uses, profile, now };
