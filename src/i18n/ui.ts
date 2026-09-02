// ──────────────────────────────────────────────────
// i18n: translation dictionary + helpers
// ──────────────────────────────────────────────────

export const defaultLocale = 'en';
export const locales = ['en', 'zh'] as const;
export type Locale = (typeof locales)[number];

// ── Display label for the language switcher (shows the *other* locale) ──
export function labelOf(locale: Locale): string {
  return locale === 'zh' ? '中文' : 'English';
}

// ── Plain-text translation ──
// Falls back to English, then to the key itself.
export function t(locale: Locale, key: string): string {
  const entry = (ui as Record<string, Record<string, string>>)[key];
  if (!entry) return key;
  return entry[locale] ?? entry.en ?? key;
}

// ── HTML translation (for keys contain inline markup) ──
// Replaces {placeholder} tokens with values from `vars`, then returns a
// raw HTML string for `set:html={...}`.
export function tHtml(
  locale: Locale,
  key: string,
  vars?: Record<string, string>,
): string {
  let s = t(locale, key);
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.replaceAll(`{${k}}`, v);
    }
  }
  return s;
}

// ── Locale-aware date formatting ──
const dateFmt: Record<Locale, Intl.DateTimeFormatOptions> = {
  en: { year: 'numeric', month: 'short', day: 'numeric' },
  zh: { year: 'numeric', month: 'long', day: 'numeric' },
};
export function formatDate(locale: Locale, date: Date): string {
  const l = locale === 'zh' ? 'zh-CN' : 'en-US';
  return date.toLocaleDateString(l, dateFmt[locale] ?? dateFmt.en);
}

// ── Compute the equivalent URL in the other locale ──
// Strips the /zh prefix (if present) or prepends it (if switching to zh).
export function translatedPath(
  currentLocale: Locale,
  targetLocale: Locale,
  pathname: string,
): string {
  // Normalise: ensure trailing slash for root-like paths so relative
  // resolution is predictable.
  if (!pathname.endsWith('/')) pathname += '/';

  let clean = pathname;
  for (const l of locales) {
    const prefix = `/${l}`;
    if (pathname === `${prefix}/` || pathname.startsWith(`${prefix}/`)) {
      clean = pathname.slice(prefix.length); // → "/…"
      break;
    }
  }

  if (targetLocale === defaultLocale) return clean;  // no prefix for en
  return `/${targetLocale}${clean}`;
}

// ═══════════════════════════════════════════════════
//  Translation dictionary
// ═══════════════════════════════════════════════════

const ui = {
  // Brand name — English uses "beyond light", Chinese uses 凌一而㬢
  'site.brand': {
    en: 'beyond light',
    zh: '凌一而㬢',
  },
  'site.title': {
    en: 'Home',
    zh: '首页',
  },
  'site.description': {
    en: 'Personal homepage — tech blog, updates, and videos.',
    zh: '个人主页 — 技术博客、动态与视频。',
  },

  // ── Nav ──
  'nav.home':    { en: 'Home',    zh: '首页' },
  'nav.blog':    { en: 'Blog',    zh: '博客' },
  'nav.videos':  { en: 'Videos',  zh: '视频' },
  'nav.news':    { en: 'News',    zh: '近况' },
  'nav.about':   { en: 'About',   zh: '关于' },

  // ── Home hero ──
  'hero.tagline': {
    en: '<span class="name">beyond light</span> — writing, building, and the AI frontier.',
    zh: '凌一而㬢 — 凌云而上总能看到一㬢晨光。',
  },
  'hero.lede': {
    en: 'Engineer & builder. I write about technology and track what\'s moving in AI. Pull up a chair.',
    zh: '工程师 & 建造者。写技术文章，追踪 AI 前沿动态。来，坐下聊聊。',
  },

  // ── Sections ──
  'section.latestPosts':  { en: 'Latest posts',       zh: '最新文章' },
  'section.allPosts':     { en: 'All posts →',         zh: '全部文章 →' },
  'section.focusingOn':   { en: 'What I\'m focusing on', zh: '近期关注' },
  'section.allUpdates':   { en: 'All updates →',       zh: '全部动态 →' },
  'section.videos':       { en: 'Videos',              zh: '视频' },
  'section.allVideos':    { en: 'All videos →',        zh: '全部视频 →' },
  'section.source':       { en: 'Source ↗',            zh: '来源 ↗' },
  'section.backNews':     { en: '← Back to all news',  zh: '← 返回近况列表' },
  'section.backBlog':     { en: '← Back to all posts', zh: '← 返回文章列表' },

  // ── About page ──
  'about.title':        { en: 'About',              zh: '关于本站' },
  'about.description':  { en: 'About this site.',   zh: '关于本站。' },
  'about.lede': {
    en: 'This is where I collect my writing and updates.',
    zh: '这里汇集了我的文章与动态。',
  },
  'about.intro': {
    en: 'Welcome. This site brings together my <a href="{blog}">blog</a> and the <a href="{news}">latest news I\'m following</a>.',
    zh: '欢迎。本站收录了我的<a href="{blog}">博客</a>和<a href="{news}">近期关注的动态</a>。',
  },
  'about.chat': {
    en: 'Want to chat? I\'m happy to talk about anything on this site — reach me at <a href="mailto:xuluthebest@gmail.com">xuluthebest@gmail.com</a>.',
    zh: '想聊聊？欢迎就本站的任何内容与我交流：<a href="mailto:xuluthebest@gmail.com">xuluthebest@gmail.com</a>。',
  },

  // ── Blog page ──
  'blog.title': {
    en: 'Blog',
    zh: '博客',
  },
  'blog.description': {
    en: 'Notes on technology, engineering, and things I\'m learning.',
    zh: '技术、工程与学习笔记。',
  },
  'blog.empty': {
    en: 'No posts yet — add markdown files in <code>src/content/blog/</code>.',
    zh: '暂无文章 — 在 <code>src/content/blog/</code> 中添加 markdown 文件。',
  },

  // ── News page ──
  'news.title': {
    en: 'What I\'m focusing on',
    zh: '近期关注',
  },
  'news.description': {
    en: 'Short notes on what I\'m reading and exploring lately.',
    zh: '我近期阅读和探索的简短笔记。',
  },
  'news.empty': {
    en: 'No updates yet — add markdown files in <code>src/content/news/</code>.',
    zh: '暂无动态 — 在 <code>src/content/news/</code> 中添加 markdown 文件。',
  },

  // ── Videos page ──
  'videos.title': {
    en: 'Videos',
    zh: '视频',
  },
  'videos.description': {
    en: 'My videos from YouTube and Bilibili.',
    zh: '我在 YouTube 和 Bilibili 上发布的视频。',
  },

  // ── Footer ──
  'footer.builtWith': {
    en: 'Built with',
    zh: '使用',
  },
  'footer.hostedOn': {
    en: 'Hosted on GitHub Pages',
    zh: '托管于 GitHub Pages',
  },

  // ── Meta defaults ──
  'meta.defaultTitle': {
    en: 'beyond light',
    zh: '凌一而㬢',
  },
  'meta.defaultDescription': {
    en: 'Personal homepage — tech blog, updates, and videos.',
    zh: '个人主页 — 技术博客、动态与视频。',
  },
};
