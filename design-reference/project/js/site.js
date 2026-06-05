/* =====================================================================
   thedev — shared site engine
   Builds header/footer/search chrome, handles theme, search, copy, etc.
   ===================================================================== */
(function () {
  "use strict";

  /* ---------------- ARTICLE INDEX (search + suggestions) ---------------- */
  const ARTICLES = [
    { id: "ec2-cold-start", title: "Killing cold starts: how I cut Lambda latency by 70%", cat: "AWS", catClass: "t-aws", glyph: "λ",
      excerpt: "Provisioned concurrency is the lazy answer. Here's what actually moved the needle across 40 functions.",
      tags: ["aws", "lambda", "performance"], date: "May 28, 2026", read: 8, url: "article.html" },
    { id: "community-builder", title: "One year as an AWS Community Builder — the honest recap", cat: "AWS", catClass: "t-aws", glyph: "☁",
      excerpt: "What the program actually is, what you get, and whether it's worth the application.",
      tags: ["aws", "community", "career"], date: "May 14, 2026", read: 6, url: "article.html" },
    { id: "boring-architecture", title: "Choose boring architecture (and other expensive lessons)", cat: "Software Engineering", catClass: "t-se", glyph: "{}",
      excerpt: "We replaced a Kafka pipeline with a Postgres table and a cron job. Nobody noticed. That's the point.",
      tags: ["architecture", "postgres", "simplicity"], date: "Apr 30, 2026", read: 9, url: "article.html" },
    { id: "type-safe-env", title: "Type-safe environment variables in TypeScript, end to end", cat: "Software Engineering", catClass: "t-se", glyph: "TS",
      excerpt: "Stop reading process.env like it's 2015. A small schema turns config into a compile-time contract.",
      tags: ["typescript", "config", "dx"], date: "Apr 18, 2026", read: 7, url: "article.html" },
    { id: "cli-that-sticks", title: "Designing a CLI people actually keep using", cat: "DevTools", catClass: "t-devtools", glyph: ">_",
      excerpt: "Good flags, sane defaults, helpful errors. The unglamorous craft of command-line tools.",
      tags: ["devtools", "cli", "ux"], date: "Apr 02, 2026", read: 6, url: "article.html" },
    { id: "neovim-2026", title: "My Neovim setup, rebuilt from zero in 2026", cat: "DevTools", catClass: "t-devtools", glyph: "⌨",
      excerpt: "LSP, treesitter, and a config I can actually explain. No 4,000-line init files.",
      tags: ["devtools", "neovim", "editor"], date: "Mar 20, 2026", read: 10, url: "article.html" },
    { id: "ship-side-project", title: "Shipping a side project in a weekend without burning out", cat: "Projects", catClass: "t-projects", glyph: "🜂",
      excerpt: "Scope ruthlessly, fake the hard parts, deploy on Friday. A playbook from five finished projects.",
      tags: ["projects", "shipping", "indie"], date: "Mar 05, 2026", read: 5, url: "article.html" },
    { id: "feature-flags", title: "Rolling my own feature flags before reaching for a SaaS", cat: "Projects", catClass: "t-projects", glyph: "⚑",
      excerpt: "200 lines, one database table, zero monthly bill. When DIY beats the vendor.",
      tags: ["projects", "feature-flags", "backend"], date: "Feb 19, 2026", read: 7, url: "article.html" },
    { id: "reading-postmortems", title: "What I learned reading 50 public postmortems", cat: "Notes", catClass: "t-notes", glyph: "✷",
      excerpt: "Patterns in how systems fail — and the boring fixes that keep showing up.",
      tags: ["notes", "reliability", "sre"], date: "Feb 04, 2026", read: 8, url: "article.html" },
    { id: "rubber-duck", title: "Notes: the rubber duck is a real debugging tool", cat: "Notes", catClass: "t-notes", glyph: "¬",
      excerpt: "A short field note on why explaining the bug out loud fixes it before you finish the sentence.",
      tags: ["notes", "debugging"], date: "Jan 22, 2026", read: 3, url: "article.html" },
  ];
  window.THEDEV_ARTICLES = ARTICLES;

  const CATS = ["AWS", "Software Engineering", "DevTools", "Projects", "Notes"];

  /* ---------------- ICONS (lucide-style inline) ---------------- */
  const I = {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>',
    rss: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1.5" fill="currentColor"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
    github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.5 2 2 6.6 2 12.3c0 4.5 2.9 8.3 6.8 9.7.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.4-3.4-1.4-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.3 9.3 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10.3 10.3 0 0 0 22 12.3C22 6.6 17.5 2 12 2Z"/></svg>',
    twitter: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-7.3 8.3L23 22h-6.6l-5.2-6.7L5.3 22H2.2l7.8-8.9L1.7 2h6.8l4.7 6.2L18.9 2Zm-1.2 18h1.8L7.4 3.9H5.5L17.7 20Z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.7h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 5.9V21h-4v-5.5c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21H9V9Z"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    terminal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m4 17 6-6-6-6"/><path d="M12 19h8"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  };
  window.THEDEV_ICONS = I;

  /* ---------------- THEME ---------------- */
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem("thedev-theme", t); } catch (e) {}
    const btn = document.getElementById("themeToggle");
    if (btn) { btn.innerHTML = t === "dark" ? I.sun : I.moon; btn.setAttribute("aria-label", t === "dark" ? "Switch to light" : "Switch to dark"); }
  }
  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") || "dark";
  }

  /* ---------------- HEADER ---------------- */
  function buildHeader() {
    const page = document.body.getAttribute("data-page") || "";
    const nav = [
      { label: "Home", href: "index.html", key: "home" },
      { label: "Articles", href: "index.html#latest", key: "articles" },
      { label: "About", href: "about.html", key: "about" },
      { label: "Contact", href: "contact.html", key: "contact" },
    ];
    const links = nav.map(n => `<a href="${n.href}"${n.key === page ? ' aria-current="page"' : ""}>${n.label}</a>`).join("");
    const head = document.createElement("header");
    head.className = "site-head";
    head.innerHTML = `
      <div class="site-head__bar">
        <a class="brand" href="index.html" aria-label="thedev home">
          <span class="brand__mark">&gt;_</span>
          <span class="brand__word">the<span class="sep">/</span>dev<span class="cursor" style="height:.85em;margin-left:1px"></span></span>
        </a>
        <nav class="nav" aria-label="Primary">${links}</nav>
        <div class="head-tools">
          <button class="icon-btn search-trigger" id="searchTrigger" aria-label="Search articles">
            ${I.search}<span class="label">Search</span><span class="kbd">/</span>
          </button>
          <button class="icon-btn" id="shellTrigger" aria-label="Open shell" title="Open shell (backtick key)">${I.terminal}</button>
          <a class="icon-btn" href="rss.html" aria-label="RSS feed" title="RSS feed">${I.rss}</a>
          <button class="icon-btn" id="themeToggle" aria-label="Toggle theme"></button>
          <button class="icon-btn head-burger" id="burger" aria-label="Menu" aria-expanded="false">${I.menu}</button>
        </div>
      </div>
      <nav class="mobile-nav" id="mobileNav" aria-label="Mobile">${links}<a href="rss.html">RSS feed</a></nav>`;
    document.body.prepend(head);

    document.getElementById("burger").addEventListener("click", function () {
      const m = document.getElementById("mobileNav");
      const open = m.classList.toggle("open");
      this.setAttribute("aria-expanded", String(open));
    });
    document.getElementById("themeToggle").addEventListener("click", function () {
      applyTheme(currentTheme() === "dark" ? "light" : "dark");
    });
    applyTheme(currentTheme());
  }

  /* ---------------- FOOTER ---------------- */
  function buildFooter() {
    const f = document.createElement("footer");
    f.className = "site-foot";
    f.innerHTML = `
      <div class="wrap">
        <div class="site-foot__inner">
          <div class="foot-col foot-about">
            <a class="brand" href="index.html" aria-label="thedev home">
              <span class="brand__mark">&gt;_</span>
              <span class="brand__word">the<span class="sep">/</span>dev</span>
            </a>
            <p>Not your traditional developer — <em>the</em> developer. Technical writing on the cloud, software engineering, and the tools in between.</p>
            <div class="foot-social">
              <a class="icon-btn" href="contact.html" aria-label="GitHub">${I.github}</a>
              <a class="icon-btn" href="contact.html" aria-label="X / Twitter">${I.twitter}</a>
              <a class="icon-btn" href="contact.html" aria-label="LinkedIn">${I.linkedin}</a>
              <a class="icon-btn" href="rss.html" aria-label="RSS">${I.rss}</a>
            </div>
          </div>
          <div class="foot-col">
            <h4>Browse</h4>
            <a href="index.html#latest">Latest articles</a>
            <a href="index.html#aws">AWS</a>
            <a href="index.html#se">Software Engineering</a>
            <a href="index.html#devtools">DevTools</a>
          </div>
          <div class="foot-col">
            <h4>Site</h4>
            <a href="about.html">About me</a>
            <a href="contact.html">Contact</a>
            <a href="rss.html">RSS feed</a>
            <a href="#" id="footSearch">Search</a>
          </div>
        </div>
        <div class="site-foot__bottom">
          <span>© 2026 thedev — built loud, with borders.</span>
          <span>$ uptime: shipping since 2019</span>
        </div>
      </div>`;
    document.body.appendChild(f);
    const fs = document.getElementById("footSearch");
    if (fs) fs.addEventListener("click", (e) => { e.preventDefault(); openSearch(); });
  }

  /* ---------------- SEARCH OVERLAY ---------------- */
  let searchState = { results: [], active: 0 };
  function buildSearch() {
    const o = document.createElement("div");
    o.className = "search-overlay";
    o.id = "searchOverlay";
    o.innerHTML = `
      <div class="search-overlay__scrim" data-close></div>
      <div class="search-box" role="dialog" aria-modal="true" aria-label="Search">
        <div class="search-box__top">
          ${I.search}
          <input class="search-input" id="searchInput" type="text" placeholder="Search articles, tags, topics…" autocomplete="off" spellcheck="false" aria-label="Search query">
          <button class="search-esc" data-close>ESC</button>
        </div>
        <div class="search-results" id="searchResults"></div>
        <div class="search-box__foot">
          <span><span class="kbd">↑</span><span class="kbd">↓</span> navigate</span>
          <span><span class="kbd">↵</span> open</span>
          <span><span class="kbd">esc</span> close</span>
          <span style="margin-left:auto"><b id="searchCount">${ARTICLES.length}</b> posts indexed</span>
        </div>
      </div>`;
    document.body.appendChild(o);
    o.querySelectorAll("[data-close]").forEach(el => el.addEventListener("click", closeSearch));
    const input = document.getElementById("searchInput");
    input.addEventListener("input", () => renderResults(input.value));
    input.addEventListener("keydown", onSearchKey);
    renderResults("");
  }
  function esc(s){ return s.replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }
  function highlight(text, q) {
    if (!q) return esc(text);
    const i = text.toLowerCase().indexOf(q.toLowerCase());
    if (i < 0) return esc(text);
    return esc(text.slice(0,i)) + "<b>" + esc(text.slice(i, i+q.length)) + "</b>" + esc(text.slice(i+q.length));
  }
  function renderResults(q) {
    q = q.trim();
    let list = ARTICLES;
    if (q) {
      const ql = q.toLowerCase();
      list = ARTICLES.filter(a =>
        a.title.toLowerCase().includes(ql) ||
        a.excerpt.toLowerCase().includes(ql) ||
        a.cat.toLowerCase().includes(ql) ||
        a.tags.some(t => t.includes(ql))
      );
    }
    searchState.results = list; searchState.active = 0;
    const box = document.getElementById("searchResults");
    if (!list.length) {
      box.innerHTML = `<div class="search-empty">No matches for "<b>${esc(q)}</b>".<br>Try <b>aws</b>, <b>typescript</b>, or <b>devtools</b>.</div>`;
      return;
    }
    box.innerHTML = list.map((a, i) => `
      <a class="search-result" href="${a.url}" data-i="${i}"${i===0?' data-active="true"':""}>
        <span class="search-result__icon ${a.catClass}">${a.glyph}</span>
        <span>
          <span class="search-result__title">${highlight(a.title, q)}</span>
          <span class="search-result__meta">${a.cat} · ${a.read} min · ${a.tags.map(t=>"#"+t).join(" ")}</span>
        </span>
      </a>`).join("");
    box.querySelectorAll(".search-result").forEach(el => {
      el.addEventListener("mousemove", () => setActive(parseInt(el.dataset.i)));
    });
  }
  function setActive(i) {
    const box = document.getElementById("searchResults");
    const els = box.querySelectorAll(".search-result");
    if (!els.length) return;
    searchState.active = (i + els.length) % els.length;
    els.forEach((el, idx) => el.setAttribute("data-active", String(idx === searchState.active)));
    els[searchState.active].scrollIntoView ? null : null; // avoid scrollIntoView per guidelines
    const box2 = box; const el = els[searchState.active];
    const top = el.offsetTop, bottom = top + el.offsetHeight;
    if (top < box2.scrollTop) box2.scrollTop = top - 8;
    else if (bottom > box2.scrollTop + box2.clientHeight) box2.scrollTop = bottom - box2.clientHeight + 8;
  }
  function onSearchKey(e) {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive(searchState.active + 1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive(searchState.active - 1); }
    else if (e.key === "Enter") {
      e.preventDefault();
      const a = searchState.results[searchState.active];
      if (a) window.location.href = a.url;
    }
  }
  function openSearch() {
    const o = document.getElementById("searchOverlay");
    o.classList.add("open");
    const input = document.getElementById("searchInput");
    input.value = ""; renderResults("");
    setTimeout(() => input.focus(), 30);
  }
  function closeSearch() { document.getElementById("searchOverlay").classList.remove("open"); }
  window.thedevOpenSearch = openSearch;

  /* ---------------- TOAST ---------------- */
  function toast(msg) {
    let t = document.getElementById("toast");
    if (!t) { t = document.createElement("div"); t.className = "toast"; t.id = "toast"; document.body.appendChild(t); }
    t.innerHTML = I.check + "<span>" + esc(msg) + "</span>";
    t.classList.add("show");
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove("show"), 2400);
  }
  window.thedevToast = toast;

  /* ---------------- COPY BUTTONS ---------------- */
  function wireCopyButtons() {
    document.querySelectorAll(".copy-btn").forEach(btn => {
      btn.innerHTML = I.copy + "<span>Copy</span>";
      btn.addEventListener("click", () => {
        const pre = btn.closest(".codeblock").querySelector("pre");
        const text = pre.innerText;
        navigator.clipboard && navigator.clipboard.writeText(text).then(() => {
          btn.innerHTML = I.check + "<span>Copied</span>";
          toast("Copied to clipboard");
          setTimeout(() => { btn.innerHTML = I.copy + "<span>Copy</span>"; }, 1600);
        }).catch(() => toast("Copy failed"));
      });
    });
  }

  /* ---------------- NEWSLETTER FORMS ---------------- */
  function wireNewsletter() {
    document.querySelectorAll(".news-form").forEach(form => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = form.querySelector("input[type=email]");
        if (!input.value || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.value)) {
          input.classList.add("nb-input--error"); input.focus(); toast("Enter a valid email");
          return;
        }
        input.classList.remove("nb-input--error");
        input.value = "";
        toast("You're in. Check your inbox.");
      });
    });
  }

  /* ---------------- REVEAL ON SCROLL (manual — IO is unreliable in embeds) ---------------- */
  function wireReveal() {
    const els = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    if (!els.length) return;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { els.forEach(e => e.classList.add("in")); return; }
    function check() {
      const h = window.innerHeight || document.documentElement.clientHeight;
      for (let i = els.length - 1; i >= 0; i--) {
        const el = els[i];
        const r = el.getBoundingClientRect();
        if (r.top < h * 0.92 && r.bottom > 0) {
          el.classList.add("in");
          // settle after the slide so injected/host animations can't freeze it mid-flight
          (function (node) { setTimeout(function () { if (node.getAnimations) node.getAnimations().forEach(function (a) { a.cancel(); }); }, 700); })(el);
          els.splice(i, 1);
        }
      }
      if (!els.length) { window.removeEventListener("scroll", check); window.removeEventListener("resize", check); }
    }
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    requestAnimationFrame(check);
    // safety net: never leave content hidden
    setTimeout(() => els.slice().forEach(e => e.classList.add("in")), 1400);
  }

  /* ---------------- INTERACTIVE SHELL (Cloud Shell style) ---------------- */
  var DIR_LABEL = { "aws": "AWS", "software-engineering": "Software Engineering", "devtools": "DevTools", "projects": "Projects", "notes": "Notes" };
  function catSlug(cat) {
    if (cat === "AWS") return "aws";
    if (cat === "Software Engineering") return "software-engineering";
    if (cat === "DevTools") return "devtools";
    if (cat === "Projects") return "projects";
    if (cat === "Notes") return "notes";
    return cat.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  }
  function fileName(a) { return a.id + ".md"; }
  function articlesInDir(slug) { return ARTICLES.filter(function (a) { return catSlug(a.cat) === slug; }); }

  var shell = { cwd: null, hist: [], hi: 0, built: false, draft: "" };
  try { shell.hist = JSON.parse(localStorage.getItem("thedev-shell-hist") || "[]"); } catch (e) { shell.hist = []; }
  shell.hi = shell.hist.length;

  var COMMANDS = ["help", "ls", "cd", "pwd", "cat", "open", "search", "grep", "tree", "whoami", "about", "contact", "home", "rss", "theme", "clear", "banner", "date", "echo", "history", "sudo", "exit"];

  function shellPrompt() { return "~/thedev" + (shell.cwd ? "/" + shell.cwd : "") + " \u276f"; }

  function buildShell() {
    if (shell.built) return;
    var el = document.createElement("div");
    el.className = "term-shell";
    el.id = "termShell";
    el.setAttribute("aria-hidden", "true");
    el.innerHTML =
      '<div class="term-shell__bar">' +
        '<span class="term-shell__dots"><i></i><i></i><i></i></span>' +
        '<span class="term-shell__title">thedev — interactive shell</span>' +
        '<span class="term-shell__hint">type <b>help</b> · <b>esc</b> to close</span>' +
        '<button class="term-shell__btn" id="termClear" title="Clear (clear)">clear</button>' +
        '<button class="term-shell__btn term-shell__btn--icon" id="termClose" aria-label="Close shell">' + I.x + '</button>' +
      '</div>' +
      '<div class="term-shell__body" id="termBody">' +
        '<div id="termOut"></div>' +
        '<div class="term-shell__line">' +
          '<span class="term-shell__prompt" id="termPrompt">' + shellPrompt() + '</span>' +
          '<input class="term-shell__input" id="termInput" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="Shell input">' +
        '</div>' +
      '</div>';
    document.body.appendChild(el);
    shell.built = true;

    var body = document.getElementById("termBody");
    var input = document.getElementById("termInput");

    document.getElementById("termClose").addEventListener("click", closeShell);
    document.getElementById("termClear").addEventListener("click", function () { document.getElementById("termOut").innerHTML = ""; input.focus(); });
    body.addEventListener("click", function (e) { if (!e.target.closest("a")) input.focus(); });
    document.getElementById("termOut").addEventListener("click", function (e) {
      var a = e.target.closest("[data-go]");
      if (a) { e.preventDefault(); shPrint('<span class="t-dim">opening ' + esc(a.getAttribute("data-name") || "") + '…</span>'); setTimeout(function () { window.location.href = a.getAttribute("data-go"); }, 450); }
    });
    input.addEventListener("keydown", onShellKey);

    // welcome
    shPrint(
      '<span class="t-grn">  the/dev</span> <span class="t-dim">▮ interactive shell — drive the blog from your keyboard.</span>\n' +
      '<span class="t-dim">  Try:</span> <span class="t-cmd">ls</span><span class="t-dim">,</span> <span class="t-cmd">cd aws</span><span class="t-dim">,</span> <span class="t-cmd">cat ' + (ARTICLES[0] ? fileName(ARTICLES[0]) : "post.md") + '</span><span class="t-dim">,</span> <span class="t-cmd">search lambda</span><span class="t-dim">, or</span> <span class="t-cmd">help</span><span class="t-dim">.</span>'
    );
  }

  function shPrint(html, cls) {
    var out = document.getElementById("termOut");
    var div = document.createElement("div");
    div.className = "term-row" + (cls ? " " + cls : "");
    div.innerHTML = html;
    out.appendChild(div);
    scrollShell();
  }
  function shEcho(cmd) { shPrint('<span class="term-shell__prompt">' + esc(shellPrompt()) + '</span> ' + esc(cmd)); }
  function scrollShell() { var b = document.getElementById("termBody"); if (b) b.scrollTop = b.scrollHeight; }
  function setPrompt() { var p = document.getElementById("termPrompt"); if (p) p.textContent = shellPrompt(); }

  function openShell() {
    buildShell();
    var el = document.getElementById("termShell");
    el.classList.add("open");
    el.setAttribute("aria-hidden", "false");
    var t = document.getElementById("shellTrigger");
    if (t) t.setAttribute("data-active", "true");
    // settle: cancel any host-injected animation that would freeze the slide mid-flight
    setTimeout(function () { if (el.getAnimations) el.getAnimations().forEach(function (a) { a.cancel(); }); }, 300);
    setTimeout(function () { var i = document.getElementById("termInput"); if (i) i.focus(); scrollShell(); }, 60);
  }
  function closeShell() {
    var el = document.getElementById("termShell");
    if (!el) return;
    el.classList.remove("open");
    el.setAttribute("aria-hidden", "true");
    var t = document.getElementById("shellTrigger");
    if (t) t.removeAttribute("data-active");
    setTimeout(function () { if (el.getAnimations) el.getAnimations().forEach(function (a) { a.cancel(); }); }, 300);
  }
  function toggleShell() { var el = document.getElementById("termShell"); if (el && el.classList.contains("open")) closeShell(); else openShell(); }
  window.thedevOpenShell = openShell;

  function onShellKey(e) {
    var input = e.target;
    if (e.key === "Enter") { e.preventDefault(); runShell(input.value); input.value = ""; shell.hi = shell.hist.length; }
    else if (e.key === "ArrowUp") { e.preventDefault(); if (shell.hi > 0) { if (shell.hi === shell.hist.length) shell.draft = input.value; shell.hi--; input.value = shell.hist[shell.hi] || ""; moveCursorEnd(input); } }
    else if (e.key === "ArrowDown") { e.preventDefault(); if (shell.hi < shell.hist.length) { shell.hi++; input.value = shell.hi === shell.hist.length ? (shell.draft || "") : shell.hist[shell.hi]; moveCursorEnd(input); } }
    else if (e.key === "Tab") { e.preventDefault(); completeShell(input); }
    else if (e.key === "l" && e.ctrlKey) { e.preventDefault(); document.getElementById("termOut").innerHTML = ""; }
    else if (e.key === "c" && e.ctrlKey) { shPrint('<span class="term-shell__prompt">' + esc(shellPrompt()) + '</span> ' + esc(input.value) + '<span class="t-dim">^C</span>'); input.value = ""; }
  }
  function moveCursorEnd(input) { setTimeout(function () { input.selectionStart = input.selectionEnd = input.value.length; }, 0); }

  function completeShell(input) {
    var v = input.value;
    var parts = v.split(/\s+/);
    if (parts.length <= 1) {
      var m = COMMANDS.filter(function (c) { return c.indexOf(parts[0]) === 0; });
      if (m.length === 1) input.value = m[0] + " ";
      else if (m.length > 1) shPrint(m.join("   "), "t-dim");
      return;
    }
    var cmd = parts[0], frag = parts[parts.length - 1];
    var pool = [];
    if (cmd === "cd") pool = Object.keys(DIR_LABEL).concat(["..", "~"]);
    else if (cmd === "ls") pool = Object.keys(DIR_LABEL);
    else if (cmd === "cat" || cmd === "open" || cmd === "read" || cmd === "less") {
      pool = (shell.cwd ? articlesInDir(shell.cwd) : ARTICLES).map(fileName);
    }
    var matches = pool.filter(function (x) { return x.indexOf(frag) === 0; });
    if (matches.length === 1) { parts[parts.length - 1] = matches[0]; input.value = parts.join(" "); }
    else if (matches.length > 1) { shPrint(matches.join("   "), "t-dim"); }
  }

  function articleLink(a) {
    return '<a href="' + a.url + '" data-go="' + a.url + '" data-name="' + esc(a.title) + '" class="term-link">' + esc(fileName(a)) + '</a>';
  }

  function runShell(raw) {
    var line = raw.trim();
    shEcho(raw);
    if (line) { shell.hist.push(line); if (shell.hist.length > 100) shell.hist.shift(); try { localStorage.setItem("thedev-shell-hist", JSON.stringify(shell.hist)); } catch (e) {} }
    shell.hi = shell.hist.length;
    if (!line) return;
    var parts = line.split(/\s+/);
    var cmd = parts[0].toLowerCase();
    var args = parts.slice(1);
    var arg = args.join(" ");

    switch (cmd) {
      case "help": {
        shPrint(
          '<span class="t-grn">Available commands</span>\n' +
          '  <span class="t-cmd">ls</span> [dir]        list directories, or posts inside one\n' +
          '  <span class="t-cmd">cd</span> &lt;dir&gt;        enter a category (cd .. to go back)\n' +
          '  <span class="t-cmd">pwd</span>             print the current path\n' +
          '  <span class="t-cmd">tree</span>            show the whole blog as a tree\n' +
          '  <span class="t-cmd">cat</span> &lt;file&gt;      preview a post (title, excerpt, tags)\n' +
          '  <span class="t-cmd">open</span> &lt;file&gt;     open a post in the browser\n' +
          '  <span class="t-cmd">search</span> &lt;q&gt;      search every post (alias: grep)\n' +
          '  <span class="t-cmd">whoami</span>          who is thedev\n' +
          '  <span class="t-cmd">about</span> · <span class="t-cmd">contact</span> · <span class="t-cmd">rss</span> · <span class="t-cmd">home</span>   jump to a page\n' +
          '  <span class="t-cmd">theme</span> [dark|light]   switch the site theme\n' +
          '  <span class="t-cmd">banner</span> · <span class="t-cmd">date</span> · <span class="t-cmd">history</span> · <span class="t-cmd">clear</span> · <span class="t-cmd">exit</span>\n' +
          '<span class="t-dim">Tip: Tab completes commands & filenames, ↑/↓ walks history.</span>'
        );
        break;
      }
      case "ls": {
        var target = args[0] ? args[0].replace(/\/$/, "") : shell.cwd;
        if (!target) {
          var rows = Object.keys(DIR_LABEL).map(function (slug) {
            var n = articlesInDir(slug).length;
            return '<span class="t-dir">' + slug + '/</span>' + pad(slug + "/", 26) + '<span class="t-dim">' + n + ' post' + (n === 1 ? "" : "s") + '</span>';
          });
          shPrint(rows.join("\n") + '\n<span class="t-dim">' + Object.keys(DIR_LABEL).length + ' directories — cd into one, or `search &lt;query&gt;`.</span>');
        } else if (DIR_LABEL[target]) {
          var list = articlesInDir(target);
          shPrint(list.map(function (a) {
            return articleLink(a) + pad(fileName(a), 30) + '<span class="t-dim">' + a.read + ' min · ' + a.date + '</span>';
          }).join("\n") + '\n<span class="t-dim">' + list.length + ' file' + (list.length === 1 ? "" : "s") + ' in ' + target + '/ — `open &lt;file&gt;` to read.</span>');
        } else {
          shPrint('<span class="t-err">ls: ' + esc(target) + ': no such directory</span>');
        }
        break;
      }
      case "cd": {
        var d = (args[0] || "~").replace(/\/$/, "");
        if (d === "~" || d === "/" || d === ".." || d === "") { shell.cwd = null; }
        else if (DIR_LABEL[d]) { shell.cwd = d; }
        else { shPrint('<span class="t-err">cd: ' + esc(d) + ': no such directory</span>'); break; }
        setPrompt();
        break;
      }
      case "pwd": shPrint("/home/dev/thedev" + (shell.cwd ? "/" + shell.cwd : "")); break;
      case "tree": {
        var t = '<span class="t-dir">~/thedev</span>';
        var dirs = Object.keys(DIR_LABEL);
        dirs.forEach(function (slug, di) {
          var last = di === dirs.length - 1;
          t += '\n' + (last ? "└── " : "├── ") + '<span class="t-dir">' + slug + '/</span>';
          var files = articlesInDir(slug);
          files.forEach(function (a, fi) {
            var flast = fi === files.length - 1;
            t += '\n' + (last ? "    " : "│   ") + (flast ? "└── " : "├── ") + articleLink(a);
          });
        });
        shPrint(t);
        break;
      }
      case "cat": case "less": case "read": {
        if (!arg) { shPrint('<span class="t-err">' + cmd + ': missing file — try `ls`</span>'); break; }
        var a = findFile(arg);
        if (!a) { shPrint('<span class="t-err">' + cmd + ': ' + esc(arg) + ': no such file</span>'); break; }
        shPrint(
          '<span class="t-grn"># ' + esc(a.title) + '</span>\n' +
          '<span class="t-dim">' + a.cat + ' · ' + a.date + ' · ' + a.read + ' min read · ' + a.tags.map(function (x) { return "#" + x; }).join(" ") + '</span>\n\n' +
          esc(a.excerpt) + '\n\n' +
          '<span class="t-dim">→ run</span> <span class="t-cmd">open ' + esc(fileName(a)) + '</span> <span class="t-dim">or</span> <a href="' + a.url + '" data-go="' + a.url + '" data-name="' + esc(a.title) + '" class="term-link">read it now</a>'
        );
        break;
      }
      case "open": case "xdg-open": {
        if (!arg) { shPrint('<span class="t-err">open: missing file</span>'); break; }
        var o = findFile(arg);
        if (!o) { shPrint('<span class="t-err">open: ' + esc(arg) + ': no such file</span>'); break; }
        shPrint('<span class="t-dim">opening ' + esc(o.title) + '…</span>');
        setTimeout(function () { window.location.href = o.url; }, 450);
        break;
      }
      case "search": case "grep": case "find": {
        if (!arg) { shPrint('<span class="t-err">' + cmd + ': missing query</span>'); break; }
        var ql = arg.toLowerCase();
        var hits = ARTICLES.filter(function (a) {
          return a.title.toLowerCase().indexOf(ql) >= 0 || a.excerpt.toLowerCase().indexOf(ql) >= 0 || a.cat.toLowerCase().indexOf(ql) >= 0 || a.tags.some(function (t) { return t.indexOf(ql) >= 0; });
        });
        if (!hits.length) { shPrint('<span class="t-dim">no matches for “' + esc(arg) + '”. try: aws, typescript, devtools</span>'); break; }
        shPrint('<span class="t-dim">' + hits.length + ' match' + (hits.length === 1 ? "" : "es") + ' for “' + esc(arg) + '”:</span>\n' +
          hits.map(function (a) { return "  " + articleLink(a) + pad(fileName(a), 30) + '<span class="t-dim">' + a.cat + '</span>'; }).join("\n"));
        break;
      }
      case "whoami": shPrint("the developer — cloud-leaning software engineer & AWS Community Builder. writes things down so you don't have to."); break;
      case "about": shPrint('<span class="t-dim">opening about…</span>'); setTimeout(function () { window.location.href = "about.html"; }, 350); break;
      case "contact": shPrint('<span class="t-dim">opening contact…</span>'); setTimeout(function () { window.location.href = "contact.html"; }, 350); break;
      case "rss": shPrint('<span class="t-dim">opening rss…</span>'); setTimeout(function () { window.location.href = "rss.html"; }, 350); break;
      case "home": case "index": shPrint('<span class="t-dim">going home…</span>'); setTimeout(function () { window.location.href = "index.html"; }, 350); break;
      case "theme": {
        var mode = (args[0] || "").toLowerCase();
        if (mode !== "dark" && mode !== "light") mode = currentTheme() === "dark" ? "light" : "dark";
        applyTheme(mode);
        shPrint('<span class="t-dim">theme → ' + mode + '</span>');
        break;
      }
      case "date": shPrint(new Date().toString()); break;
      case "echo": shPrint(esc(arg)); break;
      case "history": shPrint(shell.hist.map(function (h, i) { return pad(String(i + 1), 5) + esc(h); }).join("\n") || '<span class="t-dim">(empty)</span>'); break;
      case "banner": case "neofetch": {
        shPrint(
          '<span class="t-grn"> ┌─────────────────────────────┐</span>\n' +
          '<span class="t-grn"> │</span>  <span class="t-cmd">the/dev</span> ▮  ship it loud.     <span class="t-grn">│</span>\n' +
          '<span class="t-grn"> └─────────────────────────────┘</span>\n' +
          '<span class="t-dim"> posts</span>   ' + ARTICLES.length + '\n' +
          '<span class="t-dim"> topics</span>  ' + Object.keys(DIR_LABEL).length + '\n' +
          '<span class="t-dim"> since</span>   2019\n' +
          '<span class="t-dim"> stack</span>   TypeScript · Go · AWS'
        );
        break;
      }
      case "clear": case "cls": document.getElementById("termOut").innerHTML = ""; break;
      case "sudo": shPrint('<span class="t-dim">nice try — you already have root in here. 🙂</span>'.replace("🙂", "")); break;
      case "exit": case "quit": case ":q": closeShell(); break;
      case "rm": shPrint('<span class="t-err">rm: permission denied — these posts took ages to write.</span>'); break;
      default: shPrint('<span class="t-err">command not found: ' + esc(cmd) + '</span> <span class="t-dim">— type `help`</span>');
    }
  }

  function findFile(name) {
    var n = name.toLowerCase().replace(/\.md$/, "");
    var scope = shell.cwd ? articlesInDir(shell.cwd) : ARTICLES;
    var hit = scope.filter(function (a) { return a.id === n; })[0];
    if (!hit) hit = ARTICLES.filter(function (a) { return a.id === n; })[0];
    if (!hit) hit = ARTICLES.filter(function (a) { return a.id.indexOf(n) === 0; })[0];
    return hit;
  }
  function pad(s, len) {
    var n = len - s.length;
    return '<span class="t-pad">' + (n > 0 ? new Array(n + 1).join("\u00a0") : "\u00a0\u00a0") + '</span>';
  }

  /* ---------------- GLOBAL KEYS ---------------- */
  function wireGlobalKeys() {
    document.addEventListener("keydown", (e) => {
      const o = document.getElementById("searchOverlay");
      const sh = document.getElementById("termShell");
      const shellOpen = sh && sh.classList.contains("open");
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName) || document.activeElement.isContentEditable;
      if (e.key === "/" && !typing && !(o && o.classList.contains("open"))) { e.preventDefault(); openSearch(); }
      if ((e.key === "`" || e.key === "~") && !typing) { e.preventDefault(); toggleShell(); }
      if (e.key === "Escape") {
        if (o && o.classList.contains("open")) closeSearch();
        else if (shellOpen) closeShell();
      }
    });
  }

  /* ---------------- INIT ---------------- */
  function init() {
    buildHeader();
    buildSearch();
    buildFooter();
    const st = document.getElementById("searchTrigger");
    if (st) st.addEventListener("click", openSearch);
    const sht = document.getElementById("shellTrigger");
    if (sht) sht.addEventListener("click", openShell);
    // homepage hero terminal opens the shell too
    document.querySelectorAll("[data-open-shell]").forEach(function (el) {
      el.style.cursor = "pointer";
      el.addEventListener("click", openShell);
    });
    wireCopyButtons();
    wireNewsletter();
    wireReveal();
    wireGlobalKeys();
    if (window.thedevPageInit) window.thedevPageInit({ ARTICLES, CATS, I });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
