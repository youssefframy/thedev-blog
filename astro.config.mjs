// @ts-check
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import { defineConfig, envField, fontProviders } from 'astro/config';

export default defineConfig({
	site: 'https://thedev-blog.tech',
	adapter: vercel(),
	prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
	trailingSlash: 'ignore',
	i18n: {
		locales: ['en', 'fr', 'es'],
		defaultLocale: 'en',
		routing: {
			prefixDefaultLocale: false,
			redirectToDefaultLocale: false,
		},
	},
	integrations: [
		mdx(),
		sitemap({
			i18n: {
				defaultLocale: 'en',
				locales: { en: 'en-US', fr: 'fr-FR', es: 'es-ES' },
			},
		}),
	],
	env: {
		schema: {
			RESEND_API_KEY: envField.string({ context: 'server', access: 'secret' }),
			RESEND_AUDIENCE_ID: envField.string({ context: 'server', access: 'secret' }),
		},
	},
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
