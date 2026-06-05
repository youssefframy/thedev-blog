const CHECK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';

function esc(s: string) {
	return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] ?? c));
}

export function toast(msg: string) {
	let el = document.getElementById('thedev-toast');
	if (!el) {
		el = document.createElement('div');
		el.className = 'toast';
		el.id = 'thedev-toast';
		document.body.appendChild(el);
	}
	el.innerHTML = CHECK_SVG + '<span>' + esc(msg) + '</span>';
	el.classList.add('show');
	const t = el as HTMLElement & { _timer?: ReturnType<typeof setTimeout> };
	clearTimeout(t._timer);
	t._timer = setTimeout(() => el!.classList.remove('show'), 2400);
}

// Global accessor for components that need it
if (typeof window !== 'undefined') {
	(window as typeof window & { thedevToast: typeof toast }).thedevToast = toast;
}
