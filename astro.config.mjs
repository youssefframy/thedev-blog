// @ts-check
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

// TODO: update site to your real domain before deploying
export default defineConfig({
	site: 'https://thedev.blog',
	prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
	integrations: [mdx(), sitemap()],
	fonts: [
		{
			provider: fontProviders.google(),
			name: 'Space Grotesk',
			cssVariable: '--font-display',
			weights: [400, 500, 600, 700],
			styles: ['normal'],
			fallbacks: ['system-ui', 'sans-serif'],
		},
		{
			provider: fontProviders.google(),
			name: 'Public Sans',
			cssVariable: '--font-body',
			weights: [400, 500, 600, 700, 800],
			styles: ['normal', 'italic'],
			fallbacks: ['system-ui', '-apple-system', 'sans-serif'],
		},
		{
			provider: fontProviders.google(),
			name: 'JetBrains Mono',
			cssVariable: '--font-mono',
			weights: [400, 500, 700],
			styles: ['normal'],
			fallbacks: ['ui-monospace', 'monospace'],
		},
	],
});
