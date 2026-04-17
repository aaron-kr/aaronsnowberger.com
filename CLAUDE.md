# CLAUDE.md — Codebase Guide for AI Assistants

This file documents architecture, conventions, and patterns for the `aaronsnowberger.com` Jekyll site.

---

## Project Overview

A bilingual (EN/KO) static press kit / professional profile site built with Jekyll, hosted on GitHub Pages at `aaronsnowberger.com`. All content is YAML-driven; HTML templates are rarely edited for content updates.

---

## Directory Map

```
_config.yml          ← Site-wide settings, nav_links, author (email, social)
_data/               ← ALL editable content lives here
_includes/           ← One HTML partial per section
_layouts/
  default.html       ← Main site shell (includes all section partials)
  cv.html            ← CV page shell (toolbar + print button)
assets/
  css/main.css       ← All styles for the main site
  css/cv.css         ← CV page + print styles
  js/main.js         ← All JavaScript (single IIFE)
cv.md                ← CV page (Liquid template pulling from _data/cv.yml)
index.html           ← Homepage (only Jekyll includes, no content)
CNAME                ← Custom domain: aaronsnowberger.com
```

---

## Data Files (`_data/`)

| File | Section | Key fields |
|------|---------|------------|
| `hero.yml` | Hero | `name`, `subtitle_en/ko`, `pills`, `actions`, `portrait_src` |
| `bio.yml` | Bio | `portrait_src`, `stats`, `universities`, `universities_previous`, `tabs` |
| `photos.yml` | Photos | `photos[]` with `src`, `hires_src`, `name_en/ko`, `spec`, `dl_href` |
| `assets.yml` | Assets | `swatches[]`, `qr_codes[]`, `downloads[]` |
| `links.yml` | Links | `links[]` with `name`, `handle`, `url`, `color`, `icon_type`/`icon_glyph` |
| `services.yml` | Services | `services[]` with `id`, `title_en/ko`, `desc_en/ko`, `tags[]`, `img` (optional) |
| `testimonials.yml` | (fallback) | Not used; live data from WP REST API |
| `testimonials_section.yml` | Testimonials | Section heading/labels |
| `media.yml` | Media | `media[]` with `type`, `title_en/ko`, `host_en`, `date`, `url`, `thumb` |
| `contact.yml` | Contact | `heading_en/ko`, `buttons[]`, `email` |
| `cv.yml` | CV | `personal`, `education`, `employment`, `honors`, `certifications`, `publications`, `teaching`, `presentations`, `activities`, `languages` |

---

## Bilingual System

**Global toggle** — A button in the nav sets `data-lang="en"` or `data-lang="ko"` on `<html>`. CSS hides/shows `.en`/`.ko` elements:

```css
[data-lang="ko"] .en { display: none !important; }
[data-lang="en"] .ko { display: none !important; }
```

**Per-pane bio flip** — Each bio pane has a `⇌` button that toggles `.bio-flipped` on `.bio-pane`. Four `!important` overrides in `main.css` reverse the visibility inside the flipped pane, independent of the global language. The flip label ("한국어 보기" / "View English") is updated by `updateFlipLabels()` in `main.js`.

**Template pattern:**
```html
<span class="en">English text</span>
<span class="ko">한국어 텍스트</span>
```

---

## CSS Architecture (`assets/css/main.css`)

### CSS Variables (`:root`)
- `--teal`, `--blue`, `--purple`, `--pink` — accent colors
- `--t1`, `--t2`, `--t3` — text hierarchy
- `--brd`, `--brd2`, `--brd-b`, `--brd-p` — border colors
- `--card` — card background

### Button System
All buttons use `.fs` (fill-slide) animation via `::before` pseudo-element sliding from `translateX(-101%)` to `translateX(0)`. The fill color is set by `--sf` CSS variable on the button.

| Class | Color | `--sf` |
|-------|-------|--------|
| `.btn-primary` | teal | `var(--teal)` |
| `.btn-secondary` | blue | `var(--blue)` |
| `.btn-cv` | purple | `var(--purple)` |
| `.btn-pink` | pink | `var(--pink)` |

Hero and contact buttons auto-inject `.fs` via Liquid `unless` check. No need to add `fs` manually in YAML.

### Tooltip System
Any element with `data-tip="text"` gets a CSS tooltip via `::before`/`::after` pseudo-elements using `attr(data-tip)`. Used for university logos.

### Service Tags
`.svc-tag` (teal), `.svc-tag-b` (blue), `.svc-tag-p` (purple) — softened, transparent background, fine border.

---

## JavaScript (`assets/js/main.js`)

Single IIFE. Key sections in order:

1. **Dark mode** — `localStorage` toggle, updates `data-theme` on `<html>`
2. **Language toggle** — `data-lang` on `<html>`, persisted in `localStorage`
3. **Nav scroll** — adds `.scrolled` to nav on scroll
4. **Bio tabs** — `.btab` click handler, activates `.bio-pane`, clears `.bio-flipped` on tab switch
5. **Bio lang flip** — `.lang-flip-btn` toggles `.bio-flipped` on `.bio-pane`, calls `updateFlipLabels()`
6. **Copy buttons** — copies EN or KO bio text to clipboard
7. **Color swatches** — click to copy HEX value
8. **QR codes (`initQR`)** — reads `data-qr-url` and `data-qr-label` from DOM, generates QR via `qrcodejs`, click opens lightbox
9. **Lightbox** — `openLightbox(src, caption)` / `closeLightbox()` control `#lightbox` modal
10. **Photo lightbox** — `[data-lightbox-src]` click handler
11. **Testimonials** — fetches from WP REST API, truncates quotes >300 chars at sentence boundary, renders slider
12. **Slider** — touch/drag/autoplay for testimonials

### QR Code Pattern
QR boxes in `assets-section.html` use data attributes only — no JS hardcoding:
```html
<div class="qr-box-sm" data-qr-url="{{ qr.url }}" data-qr-label="{{ qr.label }}"></div>
```
To add/change a QR, edit `_data/assets.yml` only.

### Testimonials / WP REST API
- Endpoint: `notes.aaron.kr/wp-json/wp/v2/testimonials?per_page=20&_embed`
- Testimonials CPT must have `featured_image_url` registered via `register_rest_field()` in a mu-plugin (returns `get_the_post_thumbnail_url()`)
- Quote truncation: clips at last `.` before 300 chars, appends `…`

---

## CV Page (`cv.md` + `_data/cv.yml` + `assets/css/cv.css`)

- CV layout (`_layouts/cv.html`) provides a toolbar with "Print / Save PDF" button
- All content sections are in `cv.yml`; `cv.md` is a pure Liquid template
- **Email obfuscation**: `{% assign cp = cv.personal.email | split: "@" %}` → `{{ cp[0] }}&#64;{{ cp[1] }}`
- **Print styles** (`@media print` in `cv.css`): screen font = DM Sans; print font = Crimson Pro
- **Page breaks**: `break-inside: avoid` on `.cv-entry`, `.cv-pub`, `.cv-teach-block`; `break-after: avoid` on headings. Sections do NOT force `break-before`

---

## Email Obfuscation Pattern

Wherever an email is displayed, encode the `@` symbol to reduce spam harvesting:

```liquid
{% assign cp = some.email | split: "@" %}
<a href="mailto:{{ some.email }}">{{ cp[0] }}&#64;{{ cp[1] }}</a>
```

Used in: `contact.html`, `bio.html`, `cv.md`.

---

## Adding a New Section

1. Create `_includes/my-section.html` (template)
2. Create `_data/my-section.yml` (content)
3. Add `{% include my-section.html %}` at the right position in `index.html`
4. Add styles to `assets/css/main.css`
5. Add a nav link to `_config.yml` under `nav_links`

---

## Common Gotchas

- Never edit files in `_site/` — it's the build output and gets overwritten
- `safe: true` is set in `_config.yml` for GitHub Pages — no custom Ruby plugins
- The `fs` fill-slide class must be present on a button AND `.fs::before` must be defined in CSS for the animation to work
- Bio per-pane flip uses `!important` overrides — if you add new bilingual elements inside `.bio-pane`, they'll need `.en`/`.ko` classes to respect both the global toggle and the pane flip
- University entries in `bio.yml` are objects `{name, logo}` — not plain strings
- QR generation requires the `qrcodejs` CDN script (loaded in `head.html`)
