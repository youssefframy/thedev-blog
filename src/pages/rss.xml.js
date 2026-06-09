import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { parseId, articleUrl } from '../lib/i18n';

export async function GET(context) {
	const posts = await getCollection('blog');
	// RSS feed is English-only; exclude localized entries
	const englishPosts = posts.filter((p) => parseId(p.id).locale === 'en');
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: englishPosts
			.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
			.map((post) => ({
				title: post.data.title,
				description: post.data.description,
				pubDate: post.data.pubDate,
				link: articleUrl('en', post.id),
			})),
	});
}
