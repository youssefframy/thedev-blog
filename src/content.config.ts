import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		category: z.enum([
			'AWS',
			'Software Engineering',
			'DevTools',
			'Projects',
			'Notes',
		]),
		tags: z.array(z.string()).default([]),
		/** Mono glyph displayed on the card thumbnail */
		glyph: z.string().default('✷'),
		/** Override computed reading time in minutes */
		readMins: z.number().optional(),
	}),
});

export const collections = { blog };
