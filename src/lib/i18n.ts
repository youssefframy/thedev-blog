import { getCollection, type CollectionEntry } from 'astro:content';

export const LOCALES = ['en', 'fr', 'es'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';
export const NON_DEFAULT_LOCALES = ['fr', 'es'] as const;

export function isLocale(x: string): x is Locale {
	return (LOCALES as readonly string[]).includes(x);
}

/**
 * Derives locale + base slug from a content collection entry id.
 * "fr/deploy-x" → { locale: 'fr', baseSlug: 'deploy-x' }
 * "deploy-x"    → { locale: 'en', baseSlug: 'deploy-x' }
 */
export function parseId(id: string): { locale: Locale; baseSlug: string } {
	const [head, ...rest] = id.split('/');
	if (rest.length && isLocale(head) && head !== DEFAULT_LOCALE) {
		return { locale: head as Locale, baseSlug: rest.join('/') };
	}
	return { locale: DEFAULT_LOCALE, baseSlug: id };
}

/** Locale-correct article detail URL, matching existing trailing-slash convention. */
export function articleUrl(locale: Locale, baseSlug: string): string {
	return locale === DEFAULT_LOCALE
		? `/blog/${baseSlug}/`
		: `/${locale}/blog/${baseSlug}/`;
}

/** Locale-correct listing URL. */
export function listingUrl(locale: Locale): string {
	return locale === DEFAULT_LOCALE ? '/articles' : `/${locale}/articles`;
}

/**
 * For a given non-default locale, return one entry per base slug:
 * the translated entry if present, else the English entry as fallback.
 * Used by getStaticPaths for [lang]/blog/[...slug].
 */
export async function getLocalizedPosts(locale: Locale) {
	const all = await getCollection('blog');
	const byKey = new Map<
		string,
		{ en?: CollectionEntry<'blog'>; loc?: CollectionEntry<'blog'> }
	>();

	for (const e of all) {
		const { locale: l, baseSlug } = parseId(e.id);
		const slot = byKey.get(baseSlug) ?? {};
		if (l === DEFAULT_LOCALE) slot.en = e;
		if (l === locale) slot.loc = e;
		byKey.set(baseSlug, slot);
	}

	const out: Array<{
		baseSlug: string;
		entry: CollectionEntry<'blog'>;
		isFallback: boolean;
	}> = [];
	for (const [baseSlug, { en, loc }] of byKey) {
		const entry = loc ?? en; // fallback to English body
		if (!entry) continue;
		out.push({ baseSlug, entry, isFallback: !loc });
	}
	return out;
}

/**
 * Translation map for a base slug: which locales actually have a real translation.
 * Used by the language switcher + hreflang.
 * Does NOT include fallback locales in hreflangMap (honest SEO).
 */
export async function getTranslationMap(baseSlug: string) {
	const all = await getCollection('blog');
	const present = new Set<Locale>();

	for (const e of all) {
		const { locale, baseSlug: bs } = parseId(e.id);
		if (bs === baseSlug) present.add(locale);
	}

	// switcher targets: always show all locales (fallback to listing if no translation)
	const switcherMap: Record<Locale, string> = {
		en: articleUrl('en', baseSlug),
		fr: present.has('fr') ? articleUrl('fr', baseSlug) : listingUrl('fr'),
		es: present.has('es') ? articleUrl('es', baseSlug) : listingUrl('es'),
	};

	// hreflang map: only real, translated pages (honest to crawlers)
	const hreflangMap: Partial<Record<Locale, string>> = {};
	for (const loc of LOCALES) {
		if (present.has(loc)) {
			hreflangMap[loc] = articleUrl(loc, baseSlug);
		}
	}

	return { present, switcherMap, hreflangMap };
}
