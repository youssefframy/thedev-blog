/** Reads saved theme from localStorage and applies it to <html>. */
export function applyTheme(t: string) {
	document.documentElement.setAttribute('data-theme', t);
	try {
		localStorage.setItem('thedev-theme', t);
	} catch (_) {}
	const btn = document.getElementById('themeToggle') as HTMLButtonElement | null;
	if (!btn) return;
	// icons are stored as innerHTML strings on the button via data attributes
	const sun = btn.dataset.iconSun;
	const moon = btn.dataset.iconMoon;
	if (sun && moon) btn.innerHTML = t === 'dark' ? sun : moon;
	btn.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
}

export function currentTheme(): string {
	return document.documentElement.getAttribute('data-theme') ?? 'dark';
}

export function initThemeToggle() {
	const btn = document.getElementById('themeToggle');
	if (!btn) return;
	applyTheme(currentTheme());
	btn.addEventListener('click', () => {
		applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
	});
}
