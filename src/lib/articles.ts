import { getCollection } from 'astro:content';
import { CAT_CLASS } from '../consts';
import { parseId, articleUrl, getLocalizedPosts, DEFAULT_LOCALE, type Locale } from './i18n';

const DATE_LOCALE: Record<Locale, string> = {
	en: 'en-US',
	fr: 'fr-FR',
	es: 'es-ES',
};

/** Converts an article base slug to a valid CSS view-transition-name (no slashes, spaces, etc.) */
export function toVtSlug(baseSlug: string): string {
	return baseSlug.replace(/[^a-zA-Z0-9_-]/g, '-');
}

export type Article = {
	id: string;
	/** Base slug (no locale prefix) — stable across locales */
	baseSlug: string;
	title: string;
	cat: string;
	catClass: string;
	glyph: string;
	excerpt: string;
	tags: string[];
	date: string;
	readMins: number;
	url: string;
	/** Safe CSS ident for view-transition-name attributes */
	vtSlug: string;
};

/**
 * Returns articles for the given locale (defaults to English).
 * For 'en': only English-locale entries.
 * For 'fr'/'es': translated entries where available, falling back to the English body.
 *
 * All no-arg callers (index, rss, shell, search) continue to receive English articles.
 */
export async function getArticles(locale: Locale = DEFAULT_LOCALE): Promise<Article[]> {
	const dateLocale = DATE_LOCALE[locale];

	if (locale === DEFAULT_LOCALE) {
		// English: only return entries with no locale prefix
		const posts = await getCollection('blog');
		return posts
			.filter((post) => parseId(post.id).locale === DEFAULT_LOCALE)
			.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
			.map((post) => {
				const wordCount = post.body?.split(/\s+/).filter(Boolean).length ?? 0;
				const readMins = post.data.readMins ?? Math.max(1, Math.round(wordCount / 200));
				const date = post.data.pubDate.toLocaleDateString(dateLocale, {
					year: 'numeric',
					month: 'short',
					day: 'numeric',
				});
				const { baseSlug } = parseId(post.id);
				return {
					id: post.id,
					baseSlug,
					title: post.data.title,
					cat: post.data.category,
					catClass: CAT_CLASS[post.data.category] ?? 't-notes',
					glyph: post.data.glyph,
					excerpt: post.data.description,
					tags: post.data.tags,
					date,
					readMins,
					url: articleUrl(DEFAULT_LOCALE, baseSlug),
					vtSlug: toVtSlug(baseSlug),
				};
			});
	}

	// Non-default locale: translated entries or English fallback
	const localized = await getLocalizedPosts(locale);
	return localized
		.sort(
			(a, b) =>
				b.entry.data.pubDate.valueOf() - a.entry.data.pubDate.valueOf(),
		)
		.map(({ baseSlug, entry }) => {
			const wordCount = entry.body?.split(/\s+/).filter(Boolean).length ?? 0;
			const readMins = entry.data.readMins ?? Math.max(1, Math.round(wordCount / 200));
			const date = entry.data.pubDate.toLocaleDateString(dateLocale, {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
			});
			return {
				id: entry.id,
				baseSlug,
				title: entry.data.title,
				cat: entry.data.category,
				catClass: CAT_CLASS[entry.data.category] ?? 't-notes',
				glyph: entry.data.glyph,
				excerpt: entry.data.description,
				tags: entry.data.tags,
				date,
				readMins,
				url: articleUrl(locale, baseSlug),
				vtSlug: toVtSlug(baseSlug),
			};
		});
}
