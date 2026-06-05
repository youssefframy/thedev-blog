# thedev Blog — Project Plan

A Terminal Brutalism design Astro blog, ported from vanilla HTML/CSS/JS prototype in `design-reference/project/`.

---

## Phase 0 — Scaffolding
**Status: ✅ Complete**

Foundation setup and design reference integration.

- Astro starter cleaned (removed Astro placeholder content)
- Design reference copied to `design-reference/`
- Google Fonts configured via Astro Fonts API with cssVariables (`--font-display`, `--font-body`, `--font-mono`)

---

## Phase 1 — Design System + Chrome
**Status: ✅ Complete**

Core design tokens, content schema, and shared page chrome.

- **CSS System**: `src/styles/tokens.css`, `src/styles/components.css`, `src/styles/site.css`
- **Content Schema**: `src/content.config.ts` with fields: category, tags, glyph, readMins, pubDate
- **Demo Content**: 10 blog posts in `src/content/blog/`
- **Shared Chrome**: 
  - `src/layouts/BaseLayout.astro` — base page layout
  - `src/components/Header.astro` — navigation header
  - `src/components/Footer.astro` — footer with links
- **Global Scripts**:
  - `src/scripts/theme.ts` — dark/light theme toggle
  - `src/scripts/toast.ts` — toast notifications
  - `src/scripts/reveal.ts` — stagger-reveal animations
- **Stub Pages**: about, contact, rss (implementation pending)

---

## Phase 2 — Home Page
**Status: ✅ Complete**

Full home page with hero, filterable post list, and newsletter signup.

- **Hero Section**: `src/components/Hero.astro`
- **Terminal Animation**: `src/components/HeroTerminal.astro` — typewriter effect
- **Post Filtering**: `src/components/FilterablePosts.astro` — category chip filter (All + categories), featured-dup pattern, stagger reveal
- **Post Cards**: 
  - `src/components/FeaturedCard.astro` — featured post display
  - `src/components/PostCard.astro` — standard post card
- **Newsletter**: `src/components/Newsletter.astro` — signup form
- **Assembly**: `src/pages/index.astro` integrates all components above

---

## Phase 3 — Search Overlay
**Status: ✅ Complete**

Command-palette style search modal with keyboard navigation.

- **Search Component**: `src/components/SearchOverlay.astro`
  - Inline JSON data island with all post content
  - Live filter by title, excerpt, category, tags
  - Keyboard navigation: ↑↓ (navigate), ↵ (select), Esc (close)
  - Global `window.thedevOpenSearch` function
- **Integration**:
  - Header `#searchTrigger` element visible and wired
  - Footer "Search" link functional
  - Global `/` key opens overlay
  - Escape key closes overlay

---

## Phase 4 — Article Page
**Status: 🔲 Pending**

Full blog post page layout with prose typography and interactive features.

- **Layout Rewrite**: Complete redesign of `src/layouts/BlogPost.astro`
- **Table of Contents**: Auto-generated from heading hierarchy
- **Reading Progress Bar**: Visual indicator of scroll position
- **Prose Typography**: Semantic HTML styling for blog content (headings, paragraphs, lists, quotes, etc.)
- **Code Block Features**: Copy-to-clipboard buttons on `<pre><code>` blocks
- **Reference**: `design-reference/project/article/` page styles and layout

---

## Phase 5 — About / Contact / RSS Pages
**Status: 🔲 Pending**

Full implementation of auxiliary pages.

- **About Page** (`src/pages/about.astro`):
  - Bio section
  - Skills/expertise list
  - Social links
  - Credly badge embeds (if applicable)
  - Reference: `design-reference/project/about.html`
  
- **Contact Page** (`src/pages/contact.astro`):
  - Contact form or mailto integration
  - Form validation and submission
  
- **RSS Feed** (`src/pages/rss.astro`):
  - Dynamic RSS XML generation
  - Includes all published posts with metadata

---

## Phase 6 — Interactive Shell
**Status: 🔲 Pending**

Terminal shell overlay with command history and tab completion.

- **Shell Trigger**: Backtick `` ` `` or tilde `~` key opens overlay
- **Commands**:
  - `ls` — list posts/pages
  - `cd [path]` — navigate to post or page
  - `cat [file]` — display post content
  - `search [query]` — search posts
  - `help` — command reference
  - `clear` — clear shell output
- **Features**:
  - Command history navigation (↑↓)
  - Tab completion
  - Persistent history during session
- **Implementation**:
  - `src/components/ShellOverlay.astro` (new)
  - `src/scripts/shell.ts` (new)
- **Reference**: `design-reference/project/js/site.js` lines 330–614 (full shell implementation)

---

## Phase 7 — Real Content & Integrations
**Status: 🔲 Pending**

Production content and third-party service integration.

- **Configuration**: Update real social links and metadata in `src/consts.ts`
- **Newsletter Backend**: Connect form submission to ConvertKit, Resend, or custom endpoint
- **Blog Posts**: Replace 10 demo posts with real article content in `src/content/blog/`
- **SEO Enhancements**:
  - OpenGraph images (og:image meta tags)
  - Dynamic sitemap.xml
  - Meta descriptions per post
  - Structured data (JSON-LD) for articles

---

## Architecture Notes

- **Content**: Astro Content Collections API with Zod validation
- **Styling**: CSS custom properties with no framework; Terminal Brutalism aesthetic
- **Animations**: Native CSS + JS for reveal, typewriter, scroll effects
- **Performance**: Static site generation (SSG) for fast load times
- **SEO**: RSS feed, semantic HTML, Open Graph support

---

## Design Reference

All visual design derives from the vanilla HTML/CSS/JS prototype in `design-reference/project/`. Key pages:
- `design-reference/project/index.html` — home page
- `design-reference/project/article/` — article layout
- `design-reference/project/about.html` — about page
- `design-reference/project/js/site.js` — interactive shell and other JS features
