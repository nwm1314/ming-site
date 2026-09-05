import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

const requiredText = z.string().trim().min(1);
const optionalText = requiredText.optional();

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z
    .object({
      title: requiredText,
      description: requiredText,
      publishDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      draft: z.boolean().default(false),
      category: requiredText.default('Notes'),
      tags: z.array(requiredText).default([]),
      featured: z.boolean().default(false),
      cover: optionalText,
      coverAlt: optionalText,
      toc: z.boolean().default(true),
      comments: z.boolean().default(false),
      canonical: z.url().optional(),
      series: optionalText,
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
    displayName: z.literal('Ming'),
    tagline: requiredText,
    bio: requiredText,
    status: requiredText,
    avatar: z.object({
      src: optionalText,
      alt: requiredText,
      width: z.number().int().positive(),
      height: z.number().int().positive(),
      fallback: requiredText.default('M'),
    }),
    contacts: z.object({
      github: z.url().optional(),
      email: z.email().optional(),
      telegram: z.url().optional(),
      x: z.url().optional(),
      website: z.url().optional(),
      wechatQr: optionalText,
    }),
    aboutIntro: requiredText,
    care: z.array(
      z.object({
        title: requiredText,
        description: requiredText,
      }),
    ),
    seo: z.object({
      title: requiredText,
      description: requiredText,
    }),
  }),
});

const now = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/now' }),
  schema: z.object({
    updatedAt: z.coerce.date(),
    building: z.object({
      label: requiredText,
      text: requiredText,
    }),
    exploring: z.object({
      label: requiredText,
      text: requiredText,
    }),
    learning: z.object({
      label: requiredText,
      text: requiredText,
    }),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: requiredText,
    summary: requiredText,
    description: optionalText,
    statusLabel: optionalText,
    status: z.enum(['idea', 'building', 'maintaining', 'paused', 'archived']),
    startedAt: z.coerce.date().optional(),
    endedAt: z.coerce.date().optional(),
    stack: z.array(requiredText).default([]),
    repo: z.url().optional(),
    demo: z.url().optional(),
    homepage: z.url().optional(),
    cover: optionalText,
    featured: z.boolean().default(false),
    order: z.number().int().min(0).default(0),
  }).superRefine((project, context) => {
    if (project.startedAt && project.endedAt && project.endedAt < project.startedAt) {
      context.addIssue({
        code: 'custom',
        path: ['endedAt'],
        message: 'endedAt cannot be earlier than startedAt.',
      });
    }
  }),
});

const moments = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/moments' }),
  schema: z.object({
    publishDate: z.coerce.date(),
    tags: z.array(requiredText).default([]),
    image: optionalText,
    location: optionalText,
    visibility: z.enum(['public', 'unlisted']).default('unlisted'),
  }),
});

const gallery = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/gallery' }),
  schema: z.object({
    title: requiredText,
    image: requiredText,
    alt: requiredText,
    album: requiredText.default('Unsorted'),
    shotDate: z.coerce.date().optional(),
    location: optionalText,
    featured: z.boolean().default(false),
  }),
});

const timeline = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/timeline' }),
  schema: z.object({
    date: z.coerce.date(),
    title: requiredText,
    type: requiredText.default('milestone'),
    description: requiredText,
    link: z.url().optional(),
  }),
});

const uses = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/uses' }),
  schema: z.object({
    name: requiredText,
    category: z.enum(['Infrastructure', 'Network', 'AI', 'Web', 'Hardware', 'Software', 'Daily Tools']),
    description: requiredText,
    url: z.url().optional(),
    icon: z.string().default('✳'),
    recommended: z.boolean().default(false),
    order: z.number().int().min(0).default(0),
  }),
});

export const collections = { posts, projects, moments, gallery, timeline, uses, profile, now };
