import { getCollection } from 'astro:content';
import type { Category } from '../consts';

const CAT_CLASS: Record<Category, string> = {
	AWS: 't-aws',
	'Software Engineering': 't-se',
	DevTools: 't-devtools',
	Projects: 't-projects',
	Notes: 't-notes',
};

/** Converts an article id to a valid CSS view-transition-name (no slashes, spaces, etc.) */
export function toVtSlug(id: string): string {
	return id.replace(/[^a-zA-Z0-9_-]/g, '-');
}

export type Article = {
	id: string;
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

export async function getArticles(): Promise<Article[]> {
	const posts = await getCollection('blog');
	return posts
		.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
		.map((post) => {
			// compute reading time: frontmatter override or ~200 wpm
			const wordCount = post.body?.split(/\s+/).filter(Boolean).length ?? 0;
			const readMins = post.data.readMins ?? Math.max(1, Math.round(wordCount / 200));
			const date = post.data.pubDate.toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
			});
			return {
				id: post.id,
				title: post.data.title,
				cat: post.data.category,
				catClass: CAT_CLASS[post.data.category] ?? 't-notes',
				glyph: post.data.glyph,
				excerpt: post.data.description,
				tags: post.data.tags,
				date,
				readMins,
				url: `/blog/${post.id}/`,
				vtSlug: toVtSlug(post.id),
			};
		});
}

export const CATS = [
	'AWS',
	'Software Engineering',
	'DevTools',
	'Projects',
	'Notes',
] as const;
