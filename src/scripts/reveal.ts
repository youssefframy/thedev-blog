/**
 * Wires up scroll-reveal for .reveal elements.
 * Uses IntersectionObserver in production (reliable, no capture-harness hacks).
 * Safety net: forces .in on all remaining elements after 1.4s.
 */
export function wireReveal() {
	const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
	if (!els.length) return;

	const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	if (reduce) {
		els.forEach((e) => e.classList.add('in'));
		return;
	}

	// Safety net — never leave content hidden
	const safetyTimer = setTimeout(() => els.forEach((e) => e.classList.add('in')), 1400);

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				const el = entry.target as HTMLElement;
				el.classList.add('in');
				observer.unobserve(el);
				// clean up transition-delay once settled
				setTimeout(() => {
					el.style.transitionDelay = '';
				}, 700);
			});
			// Cancel safety net once all are revealed
			if (!document.querySelectorAll('.reveal:not(.in)').length) {
				clearTimeout(safetyTimer);
			}
		},
		{ rootMargin: '0px 0px -8% 0px' },
	);

	els.forEach((el) => observer.observe(el));
}
