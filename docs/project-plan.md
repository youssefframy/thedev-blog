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
**Status: 🔲 Pending** _(contact page UI complete; RSS feed ✅ done — see notes below)_

Full implementation of auxiliary pages.

- **About Page** (`src/pages/about.astro`):
  - Bio section
  - Skills/expertise list
  - Social links
  - Credly badge embeds (if applicable)
  - Reference: `design-reference/project/about.html`
  
- **Contact Page** (`src/pages/contact.astro`):
  - ✅ UI complete — form with fields `name`, `email`, `subject`, `message`; client-side validation; toast feedback
  - 🔲 Server wiring pending — see Phase 7.3

- **RSS Feed**:
  - ✅ Done — `src/pages/rss.xml.js` uses `@astrojs/rss` + `getCollection('blog')`, sorted by `pubDate`
  - `src/pages/rss.astro` is the human-facing subscribe landing page (links to `/rss.xml`)

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

Production content and third-party service integration. Stack decisions: Resend (email + newsletter via Audiences), Giscus (comments + reactions), `@astrojs/vercel` adapter (required only for Astro Actions — keeps the site statically generated, adapter enables the on-demand `/_actions` endpoint). Sitemap (`@astrojs/sitemap`) and RSS (`@astrojs/rss`) are already wired.

---

### 7.1 — Vercel Adapter + Env Schema

Install: `npm i @astrojs/vercel resend`

Edit `astro.config.mjs`:
- Import and add `adapter: vercel()` — do **not** set `output: 'server'`; leave it unset (static default). Actions work on static-output sites via the auto-generated `/_actions` on-demand endpoint.
- Update `site` from the `'https://thedev.blog'` placeholder to the real domain (canonical URLs, OG, sitemap, and RSS all derive from this).
- Add an `env.schema` block using `envField` from `'astro/config'` to declare both Resend secrets:
  ```js
  env: {
    schema: {
      RESEND_API_KEY:    envField.string({ context: 'server', access: 'secret' }),
      RESEND_AUDIENCE_ID: envField.string({ context: 'server', access: 'secret' }),
    },
  }
  ```
  This makes a missing env var a build-time error rather than a silent runtime failure.

Add `RESEND_AUDIENCE_ID` to `.env` (local) — `RESEND_API_KEY` is already present. Both are required for `npm run build` once the schema is active.

**Gate:** `npm run build` succeeds; Vercel adapter emits a server function for `/_actions`.

---

### 7.2 — Astro Actions (`src/actions/index.ts` — new file)

Two actions, both `accept: 'form'` (client passes `FormData` directly); `z` imported from `'astro:schema'`; secrets from `'astro:env/server'`. `ActionError` is thrown server-side; the client reads errors via the returned `error` field (never thrown on the client).

**`newsletter`** — subscribe to Resend Audience:
```ts
input: z.object({ email: z.string().email() })
handler: resend.contacts.create({ email, audienceId: RESEND_AUDIENCE_ID, unsubscribed: false })
```

**`contact`** — send email via Resend (matches the real 4-field form in `contact.astro`):
```ts
input: z.object({ name, email, subject, message })  // subject is a <select> field
handler: resend.emails.send({
  from: 'thedev contact <hello@thedev.blog>',   // must be verified-domain sender
  to: ['hello@thedev.blog'],
  replyTo: email,
  subject: `[contact] ${subject} — ${name}`,
  text: `From: ${name} <${email}>\nSubject: ${subject}\n\n${message}`,
})
```

Both throw `ActionError({ code: 'INTERNAL_SERVER_ERROR' })` on Resend errors. Input validation failures automatically return `BAD_REQUEST` with per-field errors — no custom error-handling branch needed for that case.

**Gate:** `npm run build` typechecks cleanly; `astro:actions` client types are generated.

---

### 7.3 — Wire Existing Forms (Progressive Enhancement)

Both forms already bind handlers inside `astro:page-load` — keep that pattern exactly as-is for `<ClientRouter />` compatibility. Changes are minimal and surgical:

**`src/components/Newsletter.astro`:**
- Add `name="email"` attribute to the email `<input>` (currently missing — needed for `FormData` keying and server-side form parsing).
- Make submit handler `async`; after the existing regex validation passes:
  ```ts
  import { actions } from 'astro:actions';
  const fd = new FormData(); fd.append('email', input.value);
  const { error } = await actions.newsletter(fd);
  // error → toast 'Something broke — try again.'; return
  // success → clear input, toast "You're in. Check your inbox."
  ```
- Disable submit button during the `await` to prevent double-submit.

**`src/pages/contact.astro`:**
- Make submit handler `async`; after existing client validation passes:
  ```ts
  import { actions } from 'astro:actions';
  const { error } = await actions.contact(new FormData(form));
  // error → toast 'Could not send — try again'; do NOT flip to success state
  // success → keep existing form.style.display='none' + #formSuccess reveal + toast
  ```
- Disable submit button during `await`.

**Gate (local dev):** invalid email → client toast, no network request. Valid newsletter email → contact appears in Resend Audience. Contact send will return the error toast until domain DNS is verified (Step 7.6) — that is correct behavior, not a bug.

---

### 7.4 — Giscus Comments + Reactions (`src/components/Giscus.astro` — new)

Giscus provides both a threaded comment box and a reaction bar (👍 ❤️ etc.) from a single component via `data-reactions-enabled="1"`. GitHub login required for both. No database — discussions live in this repo's GitHub Discussions tab.

**ClientRouter-safe mounting:** the naive static `<script src="https://giscus.app/...">` breaks under view transitions because Astro's DOM swap discards and re-inserts the iframe. Instead, mount imperatively inside `astro:page-load`:
```astro
<section id="comments" aria-label="Comments"></section>
<script define:vars={{ GISCUS }}>
  document.addEventListener('astro:page-load', () => {
    const mount = document.getElementById('comments');
    if (!mount) return;
    mount.innerHTML = '';               // clear stale iframe on article→article nav
    const s = document.createElement('script');
    s.src = 'https://giscus.app/client.js'; s.async = true;
    // set data-* attributes programmatically
    mount.appendChild(s);
  });
</script>
```
Key attributes: `data-mapping="pathname"`, `data-reactions-enabled="1"`, `data-loading="lazy"`, `data-input-position="top"`.

**Theme sync** (no edits to `src/scripts/theme.ts` needed): the theme toggle sets `data-theme` on `<html>`. Add a `MutationObserver` on `document.documentElement` watching `data-theme`; on change, postMessage to the iframe:
```js
iframe?.contentWindow?.postMessage(
  { giscus: { setConfig: { theme: 'dark_dimmed' /* or 'light' */ } } },
  'https://giscus.app'
);
```
Register the observer once (module-level guard flag) so SPA navigations don't stack observers.

**Gotcha:** `data-mapping="pathname"` means trailing-slash consistency matters. Posts resolve to `/blog/${id}/` — keep this consistent in both Astro config and Vercel routing to avoid a discussion being split across `/blog/x` and `/blog/x/`.

**Placement in `src/layouts/BlogPost.astro`:** import `<Giscus />` and render it after the Newsletter section.

**Gate (needs public repo + real IDs from Step 7.6):** iframe loads, no duplicate iframes on article→article SPA navigation, theme toggle recolors the iframe.

---

### 7.5 — SEO Upgrades

**Prop chain:** `src/pages/blog/[...slug].astro` → `src/layouts/BlogPost.astro` → `src/layouts/BaseLayout.astro` → `src/components/BaseHead.astro`. Thread new optional props through all layers.

**`src/components/BaseHead.astro`** — extend `Props` and add:
- `type?: 'website' | 'article'` — swap the hardcoded `og:type="website"` to use the prop.
- When `type === 'article'`: emit `<meta property="article:published_time">`, optional `article:modified_time`, `article:author`, and one `article:tag` per tag.
- `<meta name="author" content={author ?? SITE_TITLE}>`.
- JSON-LD `BlogPosting` block via `<script type="application/ld+json" set:html={JSON.stringify({...})}>` when `type === 'article'`. Fields: `@type`, `headline`, `description`, `datePublished`, `dateModified`, `author` (Person), `mainEntityOfPage` (canonical URL), `image`.

**`src/layouts/BaseLayout.astro`** — add matching optional props, forward all to `<BaseHead>`.

**`src/layouts/BlogPost.astro`** — pass to `<BaseLayout ...>`:
- `type="article"`, `publishedTime={pubDate.toISOString()}`, `modifiedTime={updatedDate?.toISOString()}`, `author="thedev"` (or pull from `src/consts.ts`), `tags={tags}`. All these are already in scope from `post.data` destructuring.

**`public/robots.txt`** (new file):
```
User-agent: *
Allow: /

Sitemap: https://<real-domain>/sitemap-index.xml
```

**Stretch (deferred):** per-post OG images via `astro-og-canvas` or `satori/@vercel/og`. Quick win before then: add a static `public/og-default.png` as a better fallback than `/favicon.svg`.

**Gate (fully local):** `npm run build`; inspect a compiled article HTML for `og:type=article`, `article:published_time`, JSON-LD block. Confirm `/robots.txt` is present in `dist/`. Post-deploy: run through a structured-data validator and OG debugger on a live article URL.

---

### 7.6 — Real Content + External Setup Checklist

**In-repo (code/config):**
- `src/consts.ts` — replace all `TODO` placeholder values: `SOCIALS` (GitHub, Twitter/X, LinkedIn URLs), `CREDLY.profile`.
- `astro.config.mjs` — confirm real `site` domain matches.
- `src/actions/index.ts` — replace `hello@thedev.blog` with real address.
- `src/components/Giscus.astro` — fill `repo`, `repoId`, `category`, `categoryId` from Step 7.6 external setup.
- `src/content/blog/` — replace the 10 demo posts with real article content. Schema: `title`, `description`, `pubDate` (date), `updatedDate?` (date), `category` (enum from `CATS`), `tags[]`, `glyph`, `readMins?`.

**External (cannot be automated):**
- **Resend domain:** add Resend-issued DNS records (SPF/DKIM) for the sending domain; wait for "Verified" status. Contact-form sends fail until this is green — this is the one piece that cannot be locally tested before verification.
- **Resend Audience:** create an Audience in the Resend dashboard; copy its ID → `RESEND_AUDIENCE_ID` in local `.env` and Vercel env vars.
- **Giscus:** make this repo public; enable Discussions on the repo; install the [Giscus GitHub App](https://github.com/apps/giscus); choose (or create) a Discussions category; visit [giscus.app](https://giscus.app) to generate `repo-id` and `category-id`.
- **Vercel project settings:** add `RESEND_API_KEY` + `RESEND_AUDIENCE_ID` to Production and Preview environments; set Node.js version to **22.x** (matches `engines: node >=22.12.0` in `package.json`).

---

### 7.7 — Verification Gates

| Step | Testable locally | Needs deploy / external setup |
|------|-----------------|-------------------------------|
| 7.1 Adapter + env schema | `npm run build` (build fails fast on missing secrets) | — |
| 7.2 Actions typegen | `npm run build` / `astro check` | — |
| 7.3 Newsletter subscribe | Real Resend Audience write (with real API key) | — |
| 7.3 Contact send | Error toast shows — correct, domain not yet verified | ✅ after Resend DNS verified |
| 7.4 Giscus iframe | Loads + no SPA duplicates + theme sync | Needs public repo + real IDs |
| 7.5 SEO meta / JSON-LD | `npm run build`, inspect HTML, check `/robots.txt` | Structured-data + OG validators (live URL) |
| 7.6 Real domain / content | `npm run preview` smoke-test | Final OG + sitemap on live domain |
| Deploy smoke test | — | ✅ Contact email delivers to inbox with correct reply-to; subscribe writes to Audience; giscus posts a real discussion |

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
