// ============================================================
// thedev — site-wide constants
// TODO: fill in your real values before going live (Phase 7)
// ============================================================

export const SITE_TITLE = 'thedev';
export const SITE_DESCRIPTION =
	'Not your traditional developer — the developer. Articles on AWS, software engineering, devtools and shipping side projects.';
export const SITE_TAGLINE = 'technical writing on cloud, code & tools';
export const WRITING_SINCE = 2019;

// ---- Navigation ----
export const NAV = [
	{ label: 'Home', href: '/', key: 'home' },
	{ label: 'Articles', href: '/articles', key: 'articles' },
	{ label: 'About', href: '/about', key: 'about' },
	{ label: 'Contact', href: '/contact', key: 'contact' },
] as const;

// ---- Social links — TODO: replace placeholders ----
export const SOCIALS = {
	github: 'https://github.com/thedev',           // TODO
	twitter: 'https://x.com/thedev',               // TODO
	linkedin: 'https://linkedin.com/in/thedev',    // TODO
} as const;

// ---- Credly — TODO: replace with your profile/badge URLs ----
export const CREDLY = {
	profile: 'https://www.credly.com/users/thedev', // TODO
} as const;

// ---- Post categories ----
export const CATS = [
	'AWS',
	'Software Engineering',
	'DevTools',
	'Projects',
	'Notes',
] as const;

export type Category = (typeof CATS)[number];
