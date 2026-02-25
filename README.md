# Owen – DevHub Portfolio

Personal portfolio site. Built with Next.js 14, deployed on Cloudflare Pages.

---

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 14 (App Router) | Static export compatible, great SEO |
| Styling | Tailwind CSS | Custom sunset palette, fast iteration |
| Animations | Framer Motion | Scroll reveals, modal transitions, typewriter |
| i18n | next-intl | EN/ES toggle, no middleware (static-safe) |
| Contact | EmailJS | No backend needed, works on Cloudflare Pages |
| Analytics | Google Analytics 4 | Via `@next/third-parties/google` |
| Hosting | Cloudflare Pages | `next build` → static `out/` folder |

---

## Project structure

```
owen-portfolio/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx       # Root layout — fonts, GA, next-intl provider
│   │   │   └── page.tsx         # Single page — all sections in order
│   │   ├── layout.tsx           # Root shell (empty, required by Next.js)
│   │   └── globals.css          # Tailwind directives + custom scrollbar, utilities
│   ├── components/
│   │   └── sections/
│   │       ├── Navbar.tsx        # Sticky glass nav, EN/ES toggle, mobile hamburger
│   │       ├── Hero.tsx          # Fullscreen beach bg, typewriter, CTAs
│   │       ├── About.tsx         # Education (always visible) + collapsible story
│   │       ├── Experience.tsx    # Animated timeline, expandable cards
│   │       ├── Projects.tsx      # Grid cards + modal (bottom sheet on mobile)
│   │       ├── Skills.tsx        # Grouped badge categories
│   │       ├── Contact.tsx       # EmailJS form (auto-reply + inbox notification)
│   │       └── Footer.tsx        # Links, nav, copyright
│   ├── lib/
│   │   ├── data.ts              # Static metadata only (tags, dates, github URLs)
│   │   └── utils.ts             # cn() helper (clsx + tailwind-merge)
│   └── i18n.ts                  # next-intl config (requestLocale pattern)
├── messages/
│   ├── en.json                  # All English content including experience + projects
│   └── es.json                  # Full Spanish translation of everything
├── public/
│   ├── costarica-beach.jpg      # Hero background image
│   ├── pp.jpg                   # Headshot (shown in About story section)
│   ├── Owen-Morales-Resume.pdf  # Downloadable resume
│   ├── _headers                 # Cloudflare cache + security headers
│   └── _redirects               # / → /en redirect for Cloudflare Pages
├── .env                         # Real keys — never commit this
├── .env.example                 # Template for reference
├── next.config.js               # output: export, next-intl plugin
├── tailwind.config.ts           # Custom color palette
└── wrangler.toml                # Cloudflare config (points to ./out)
```

---

## How i18n works

There is no middleware (middleware breaks static export). Instead:

- The URL structure is `/` → `/en` (default) and `/es` for Spanish
- `public/_redirects` handles the root redirect on Cloudflare Pages
- `src/app/[locale]/page.tsx` calls `setRequestLocale(locale)` so static generation works
- All translatable content lives in `messages/en.json` and `messages/es.json` — including experience bullet points and project descriptions
- `data.ts` only holds non-translatable things: tags, dates, GitHub URLs, IDs

To add a new language, add a new locale file in `messages/` and add the locale to the `locales` array in both `layout.tsx` and `page.tsx`.

---

## How the contact form works

Two EmailJS templates fire in parallel on submit:

1. **Auto-reply** (`NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`) — sent to the person who filled the form. Uses `sendForm()`, so variable names map directly from the HTML `name` attributes (`name`, `email`, `message`).

2. **Inbox notification** (`NEXT_PUBLIC_EMAILJS_TEMPLATE_TWO_ID`) — sent to my email. Uses `send()` with explicit params because the template variable names differ: `{{from_name}}`, `{{reply_to}}`, `{{message}}`. Setting `reply_to` means hitting Reply in the inbox goes straight back to the sender.

---

## Environment variables

All in `.env` (never commit this file — it's in `.gitignore`).

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=        # Google Analytics 4 Measurement ID
NEXT_PUBLIC_EMAILJS_SERVICE_ID=       # EmailJS → Email Services
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=      # Auto-reply template
NEXT_PUBLIC_EMAILJS_TEMPLATE_TWO_ID=  # Inbox notification template
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=       # EmailJS → Account → General
```

For Cloudflare Pages deployment, add these same variables under **Settings → Environment Variables** in the Cloudflare dashboard.

---

## Updating content

### Change the story / about text
Edit `messages/en.json` → `about.p1` through `about.p4`, then mirror the change in `messages/es.json`.

### Add or edit a project
1. Add an entry to `projectsMeta` in `src/lib/data.ts` (id, subtitle, tags, github, date, highlight)
2. Add the matching translated content at the same index in `projectItems` in both `messages/en.json` and `messages/es.json`

### Add or edit an experience
1. Add an entry to `experienceMeta` in `src/lib/data.ts` (period, tags)
2. Add the matching translated content at the same index in `experienceItems` in both JSON files

The index order in `data.ts` **must match** the index order in the JSON files. Both are zero-indexed arrays aligned by position.

### Update the resume
Replace `public/Owen-Morales-Resume.pdf` with the new file. Keep the same filename so all the download links still work.

---

## Running locally

```bash
npm run dev      # http://localhost:3000
npm run build    # generates /out static folder
```

---

## Deploying to Cloudflare Pages

1. Push to GitHub
2. In Cloudflare Pages: connect the repo, set build command to `npm run build`, output directory to `out`
3. Add all environment variables under Settings → Environment Variables
4. Every push to `main` auto-deploys

---

## Color palette

Pulled directly from `costarica-beach.jpg`.

| Token | Hex | Used for |
|---|---|---|
| `sunset-orange` | `#E8650A` | Primary accent, CTAs, active states |
| `sunset-flame` | `#F5831F` | CTA gradients |
| `sunset-gold` | `#FFAB00` | Secondary accent |
| `ocean-deep` | `#080F1A` | Page background |
| `ocean-navy` | `#0D1F35` | Card backgrounds |
| `ocean-mid` | `#1A3050` | Input backgrounds, badge fills |
| `sand-warm` | `#F0EDE8` | Primary text |
| `sand` | `#C4956A` | Muted text, borders |
