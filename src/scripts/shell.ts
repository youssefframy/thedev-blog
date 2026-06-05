import type { Article } from '../lib/articles';

declare global {
  interface Window {
    __SHELL_ARTICLES__: Article[];
    thedevOpenShell: () => void;
  }
}

const DIR_LABEL: Record<string, string> = {
  aws: 'AWS',
  'software-engineering': 'Software Engineering',
  devtools: 'DevTools',
  projects: 'Projects',
  notes: 'Notes',
};

function catSlug(cat: string): string {
  if (cat === 'AWS') return 'aws';
  if (cat === 'Software Engineering') return 'software-engineering';
  if (cat === 'DevTools') return 'devtools';
  if (cat === 'Projects') return 'projects';
  if (cat === 'Notes') return 'notes';
  return cat.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function fileName(a: Article): string {
  return a.id + '.md';
}

function getArticles(): Article[] {
  return window.__SHELL_ARTICLES__ ?? [];
}

function articlesInDir(slug: string): Article[] {
  return getArticles().filter((a) => catSlug(a.cat) === slug);
}

function esc(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] ?? c));
}

function pad(s: string, len: number): string {
  const n = len - s.length;
  return '<span class="t-pad">' + (n > 0 ? ' '.repeat(n) : '  ') + '</span>';
}

const shell = {
  cwd: null as string | null,
  hist: [] as string[],
  hi: 0,
  built: false,
  draft: '',
};

try {
  shell.hist = JSON.parse(localStorage.getItem('thedev-shell-hist') ?? '[]');
} catch {
  shell.hist = [];
}
shell.hi = shell.hist.length;

const COMMANDS = [
  'help', 'ls', 'cd', 'pwd', 'tree', 'cat', 'less', 'read', 'open',
  'search', 'grep', 'find', 'whoami', 'about', 'contact', 'rss', 'home',
  'theme', 'date', 'echo', 'history', 'banner', 'neofetch', 'clear', 'cls',
  'sudo', 'exit', 'quit',
];

function shellPrompt(): string {
  return '~/thedev' + (shell.cwd ? '/' + shell.cwd : '') + ' ❯';
}

function shPrint(html: string, cls?: string): void {
  const out = document.getElementById('termOut');
  if (!out) return;
  const div = document.createElement('div');
  div.className = 'term-row' + (cls ? ' ' + cls : '');
  div.innerHTML = html;
  out.appendChild(div);
  scrollShell();
}

function shEcho(cmd: string): void {
  shPrint('<span class="term-shell__prompt">' + esc(shellPrompt()) + '</span> ' + esc(cmd));
}

function scrollShell(): void {
  const b = document.getElementById('termBody');
  if (b) b.scrollTop = b.scrollHeight;
}

function setPrompt(): void {
  const p = document.getElementById('termPrompt');
  if (p) p.textContent = shellPrompt();
}

function articleLink(a: Article): string {
  return (
    '<a href="' + a.url + '" data-go="' + a.url + '" data-name="' + esc(a.title) + '" class="term-link">' +
    esc(fileName(a)) +
    '</a>'
  );
}

function findFile(name: string): Article | undefined {
  const n = name.toLowerCase().replace(/\.md$/, '');
  const scope = shell.cwd ? articlesInDir(shell.cwd) : getArticles();
  return (
    scope.find((a) => a.id === n) ??
    getArticles().find((a) => a.id === n) ??
    getArticles().find((a) => a.id.startsWith(n))
  );
}

function currentTheme(): string {
  return document.documentElement.getAttribute('data-theme') ?? 'dark';
}

function applyTheme(mode: string): void {
  document.documentElement.setAttribute('data-theme', mode);
  try { localStorage.setItem('thedev-theme', mode); } catch { /* noop */ }
}

function runShell(raw: string): void {
  const line = raw.trim();
  shEcho(raw);
  if (line) {
    shell.hist.push(line);
    if (shell.hist.length > 100) shell.hist.shift();
    try { localStorage.setItem('thedev-shell-hist', JSON.stringify(shell.hist)); } catch { /* noop */ }
  }
  shell.hi = shell.hist.length;
  if (!line) return;

  const parts = line.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);
  const arg = args.join(' ');

  switch (cmd) {
    case 'help': {
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
    case 'ls': {
      const target = args[0] ? args[0].replace(/\/$/, '') : shell.cwd;
      if (!target) {
        const rows = Object.keys(DIR_LABEL).map((slug) => {
          const n = articlesInDir(slug).length;
          return '<span class="t-dir">' + slug + '/</span>' + pad(slug + '/', 26) + '<span class="t-dim">' + n + ' post' + (n === 1 ? '' : 's') + '</span>';
        });
        shPrint(rows.join('\n') + '\n<span class="t-dim">' + Object.keys(DIR_LABEL).length + ' directories — cd into one, or `search &lt;query&gt;`.</span>');
      } else if (DIR_LABEL[target]) {
        const list = articlesInDir(target);
        shPrint(
          list.map((a) => articleLink(a) + pad(fileName(a), 30) + '<span class="t-dim">' + a.readMins + ' min · ' + esc(a.date) + '</span>').join('\n') +
          '\n<span class="t-dim">' + list.length + ' file' + (list.length === 1 ? '' : 's') + ' in ' + target + '/ — `open &lt;file&gt;` to read.</span>'
        );
      } else {
        shPrint('<span class="t-err">ls: ' + esc(target) + ': no such directory</span>');
      }
      break;
    }
    case 'cd': {
      const d = (args[0] ?? '~').replace(/\/$/, '');
      if (d === '~' || d === '/' || d === '..' || d === '') {
        shell.cwd = null;
      } else if (DIR_LABEL[d]) {
        shell.cwd = d;
      } else {
        shPrint('<span class="t-err">cd: ' + esc(d) + ': no such directory</span>');
        break;
      }
      setPrompt();
      break;
    }
    case 'pwd': {
      shPrint('/home/dev/thedev' + (shell.cwd ? '/' + shell.cwd : ''));
      break;
    }
    case 'tree': {
      let t = '<span class="t-dir">~/thedev</span>';
      const dirs = Object.keys(DIR_LABEL);
      dirs.forEach((slug, di) => {
        const last = di === dirs.length - 1;
        t += '\n' + (last ? '└── ' : '├── ') + '<span class="t-dir">' + slug + '/</span>';
        const files = articlesInDir(slug);
        files.forEach((a, fi) => {
          const flast = fi === files.length - 1;
          t += '\n' + (last ? '    ' : '│   ') + (flast ? '└── ' : '├── ') + articleLink(a);
        });
      });
      shPrint(t);
      break;
    }
    case 'cat':
    case 'less':
    case 'read': {
      if (!arg) { shPrint('<span class="t-err">' + cmd + ': missing file — try `ls`</span>'); break; }
      const a = findFile(arg);
      if (!a) { shPrint('<span class="t-err">' + cmd + ': ' + esc(arg) + ': no such file</span>'); break; }
      shPrint(
        '<span class="t-grn"># ' + esc(a.title) + '</span>\n' +
        '<span class="t-dim">' + esc(a.cat) + ' · ' + esc(a.date) + ' · ' + a.readMins + ' min read · ' + a.tags.map((x) => '#' + esc(x)).join(' ') + '</span>\n\n' +
        esc(a.excerpt) + '\n\n' +
        '<span class="t-dim">→ run</span> <span class="t-cmd">open ' + esc(fileName(a)) + '</span> <span class="t-dim">or</span> <a href="' + a.url + '" data-go="' + a.url + '" data-name="' + esc(a.title) + '" class="term-link">read it now</a>'
      );
      break;
    }
    case 'open':
    case 'xdg-open': {
      if (!arg) { shPrint('<span class="t-err">open: missing file</span>'); break; }
      const o = findFile(arg);
      if (!o) { shPrint('<span class="t-err">open: ' + esc(arg) + ': no such file</span>'); break; }
      shPrint('<span class="t-dim">opening ' + esc(o.title) + '…</span>');
      setTimeout(() => { window.location.href = o.url; }, 450);
      break;
    }
    case 'search':
    case 'grep':
    case 'find': {
      if (!arg) { shPrint('<span class="t-err">' + cmd + ': missing query</span>'); break; }
      const ql = arg.toLowerCase();
      const hits = getArticles().filter((a) =>
        a.title.toLowerCase().includes(ql) ||
        a.excerpt.toLowerCase().includes(ql) ||
        a.cat.toLowerCase().includes(ql) ||
        a.tags.some((t) => t.includes(ql))
      );
      if (!hits.length) {
        shPrint('<span class="t-dim">no matches for "' + esc(arg) + '". try: aws, typescript, devtools</span>');
        break;
      }
      shPrint(
        '<span class="t-dim">' + hits.length + ' match' + (hits.length === 1 ? '' : 'es') + ' for "' + esc(arg) + '":</span>\n' +
        hits.map((a) => '  ' + articleLink(a) + pad(fileName(a), 30) + '<span class="t-dim">' + esc(a.cat) + '</span>').join('\n')
      );
      break;
    }
    case 'whoami': {
      shPrint('the developer — cloud-leaning software engineer & AWS Community Builder. writes things down so you don\'t have to.');
      break;
    }
    case 'about': {
      shPrint('<span class="t-dim">opening about…</span>');
      setTimeout(() => { window.location.href = '/about'; }, 350);
      break;
    }
    case 'contact': {
      shPrint('<span class="t-dim">opening contact…</span>');
      setTimeout(() => { window.location.href = '/contact'; }, 350);
      break;
    }
    case 'rss': {
      shPrint('<span class="t-dim">opening rss…</span>');
      setTimeout(() => { window.location.href = '/rss.xml'; }, 350);
      break;
    }
    case 'home':
    case 'index': {
      shPrint('<span class="t-dim">going home…</span>');
      setTimeout(() => { window.location.href = '/'; }, 350);
      break;
    }
    case 'theme': {
      let mode = (args[0] ?? '').toLowerCase();
      if (mode !== 'dark' && mode !== 'light') mode = currentTheme() === 'dark' ? 'light' : 'dark';
      applyTheme(mode);
      shPrint('<span class="t-dim">theme → ' + mode + '</span>');
      break;
    }
    case 'date': {
      shPrint(new Date().toString());
      break;
    }
    case 'echo': {
      shPrint(esc(arg));
      break;
    }
    case 'history': {
      shPrint(shell.hist.map((h, i) => pad(String(i + 1), 5) + esc(h)).join('\n') || '<span class="t-dim">(empty)</span>');
      break;
    }
    case 'banner':
    case 'neofetch': {
      const all = getArticles();
      shPrint(
        '<span class="t-grn"> ┌─────────────────────────────┐</span>\n' +
        '<span class="t-grn"> │</span>  <span class="t-cmd">the/dev</span> ▮  ship it loud.     <span class="t-grn">│</span>\n' +
        '<span class="t-grn"> └─────────────────────────────┘</span>\n' +
        '<span class="t-dim"> posts</span>   ' + all.length + '\n' +
        '<span class="t-dim"> topics</span>  ' + Object.keys(DIR_LABEL).length + '\n' +
        '<span class="t-dim"> since</span>   2019\n' +
        '<span class="t-dim"> stack</span>   TypeScript · Go · AWS'
      );
      break;
    }
    case 'clear':
    case 'cls': {
      const out = document.getElementById('termOut');
      if (out) out.innerHTML = '';
      break;
    }
    case 'sudo': {
      shPrint('<span class="t-dim">nice try — you already have root in here.</span>');
      break;
    }
    case 'rm': {
      shPrint('<span class="t-err">rm: permission denied — these posts took ages to write.</span>');
      break;
    }
    case 'exit':
    case 'quit':
    case ':q': {
      closeShell();
      break;
    }
    default: {
      shPrint('<span class="t-err">command not found: ' + esc(cmd) + '</span> <span class="t-dim">— type `help`</span>');
    }
  }
}

function moveCursorEnd(input: HTMLInputElement): void {
  setTimeout(() => { input.selectionStart = input.selectionEnd = input.value.length; }, 0);
}

function completeShell(input: HTMLInputElement): void {
  const v = input.value;
  const parts = v.split(/\s+/);
  if (parts.length <= 1) {
    const m = COMMANDS.filter((c) => c.startsWith(parts[0] ?? ''));
    if (m.length === 1) input.value = m[0] + ' ';
    else if (m.length > 1) shPrint(m.join('   '), 't-dim');
    return;
  }
  const cmd = parts[0];
  const frag = parts[parts.length - 1] ?? '';
  let pool: string[] = [];
  if (cmd === 'cd') pool = Object.keys(DIR_LABEL).concat(['..', '~']);
  else if (cmd === 'ls') pool = Object.keys(DIR_LABEL);
  else if (cmd === 'cat' || cmd === 'open' || cmd === 'read' || cmd === 'less') {
    pool = (shell.cwd ? articlesInDir(shell.cwd) : getArticles()).map(fileName);
  }
  const matches = pool.filter((x) => x.startsWith(frag));
  if (matches.length === 1) {
    parts[parts.length - 1] = matches[0];
    input.value = parts.join(' ');
  } else if (matches.length > 1) {
    shPrint(matches.join('   '), 't-dim');
  }
}

function onShellKey(e: KeyboardEvent): void {
  const input = e.target as HTMLInputElement;
  if (e.key === 'Enter') {
    e.preventDefault();
    runShell(input.value);
    input.value = '';
    shell.hi = shell.hist.length;
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (shell.hi > 0) {
      if (shell.hi === shell.hist.length) shell.draft = input.value;
      shell.hi--;
      input.value = shell.hist[shell.hi] ?? '';
      moveCursorEnd(input);
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (shell.hi < shell.hist.length) {
      shell.hi++;
      input.value = shell.hi === shell.hist.length ? (shell.draft ?? '') : (shell.hist[shell.hi] ?? '');
      moveCursorEnd(input);
    }
  } else if (e.key === 'Tab') {
    e.preventDefault();
    completeShell(input);
  } else if (e.key === 'l' && e.ctrlKey) {
    e.preventDefault();
    const out = document.getElementById('termOut');
    if (out) out.innerHTML = '';
  } else if (e.key === 'c' && e.ctrlKey) {
    shPrint('<span class="term-shell__prompt">' + esc(shellPrompt()) + '</span> ' + esc(input.value) + '<span class="t-dim">^C</span>');
    input.value = '';
  }
}

function buildShell(): void {
  if (shell.built) return;
  const el = document.createElement('div');
  el.className = 'term-shell';
  el.id = 'termShell';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML =
    '<div class="term-shell__bar">' +
      '<span class="term-shell__dots"><i></i><i></i><i></i></span>' +
      '<span class="term-shell__title">thedev — interactive shell</span>' +
      '<span class="term-shell__hint">type <b>help</b> · <b>esc</b> to close</span>' +
      '<button class="term-shell__btn" id="termClear" title="Clear (clear)">clear</button>' +
      '<button class="term-shell__btn term-shell__btn--icon" id="termClose" aria-label="Close shell">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
      '</button>' +
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

  const body = document.getElementById('termBody')!;
  const input = document.getElementById('termInput') as HTMLInputElement;

  document.getElementById('termClose')!.addEventListener('click', closeShell);
  document.getElementById('termClear')!.addEventListener('click', () => {
    const out = document.getElementById('termOut');
    if (out) out.innerHTML = '';
    input.focus();
  });
  body.addEventListener('click', (e) => {
    if (!(e.target as HTMLElement).closest('a')) input.focus();
  });
  document.getElementById('termOut')!.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest<HTMLElement>('[data-go]');
    if (a) {
      e.preventDefault();
      shPrint('<span class="t-dim">opening ' + esc(a.getAttribute('data-name') ?? '') + '…</span>');
      setTimeout(() => { window.location.href = a.getAttribute('data-go')!; }, 450);
    }
  });
  input.addEventListener('keydown', onShellKey);

  const all = getArticles();
  shPrint(
    '<span class="t-grn">  the/dev</span> <span class="t-dim">▮ interactive shell — drive the blog from your keyboard.</span>\n' +
    '<span class="t-dim">  Try:</span> <span class="t-cmd">ls</span><span class="t-dim">,</span> <span class="t-cmd">cd aws</span><span class="t-dim">,</span> <span class="t-cmd">cat ' + (all[0] ? fileName(all[0]) : 'post.md') + '</span><span class="t-dim">,</span> <span class="t-cmd">search lambda</span><span class="t-dim">, or</span> <span class="t-cmd">help</span><span class="t-dim">.</span>'
  );
}

export function openShell(): void {
  buildShell();
  const el = document.getElementById('termShell')!;
  el.classList.add('open');
  el.setAttribute('aria-hidden', 'false');
  const t = document.getElementById('shellTrigger');
  if (t) t.setAttribute('data-active', 'true');
  setTimeout(() => {
    if ('getAnimations' in el) (el as Element & { getAnimations(): Animation[] }).getAnimations().forEach((a) => a.cancel());
  }, 300);
  setTimeout(() => {
    const i = document.getElementById('termInput') as HTMLInputElement | null;
    if (i) { i.focus(); scrollShell(); }
  }, 60);
}

export function closeShell(): void {
  const el = document.getElementById('termShell');
  if (!el) return;
  el.classList.remove('open');
  el.setAttribute('aria-hidden', 'true');
  const t = document.getElementById('shellTrigger');
  if (t) t.removeAttribute('data-active');
  setTimeout(() => {
    if ('getAnimations' in el) (el as Element & { getAnimations(): Animation[] }).getAnimations().forEach((a) => a.cancel());
  }, 300);
}

export function toggleShell(): void {
  const el = document.getElementById('termShell');
  if (el?.classList.contains('open')) closeShell();
  else openShell();
}

window.thedevOpenShell = openShell;
