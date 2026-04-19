# aaronsnowberger.com — Press Kit & Professional Profile

A bilingual (EN/KO) static press kit site built with Jekyll and hosted on GitHub Pages.

---

## Table of Contents
1. [Project Structure](#project-structure)
2. [Local Development](#local-development)
3. [Updating Content](#updating-content)
   - [YAML basics](#yaml-basics)
   - [Hero section](#hero-section)
   - [Bio section](#bio-section)
   - [Photos](#photos)
   - [Assets & QR codes](#assets--qr-codes)
   - [Links](#links)
   - [Services](#services)
   - [Testimonials](#testimonials-wordpress-rest-api)
   - [Media appearances](#media-appearances)
   - [Contact](#contact)
   - [CV](#cv)
4. [Bilingual system](#bilingual-system)
5. [Adding a new section](#adding-a-new-section)

---

## Project Structure

```
aaronsnowberger.com/
├── _config.yml              ← Site-wide settings, nav links, social profiles
├── _data/                   ← All editable content lives here (YAML)
│   ├── hero.yml             ← Hero: name, subtitle, pills, CTA buttons
│   ├── bio.yml              ← Stat card, university logos, bio tab text
│   ├── photos.yml           ← Headshot gallery cards
│   ├── assets.yml           ← Brand colors, QR codes, downloadable files
│   ├── links.yml            ← Social / professional link cards
│   ├── services.yml         ← Professional services cards
│   ├── testimonials.yml     ← Static fallback testimonials (not used; live data from WP)
│   ├── testimonials_section.yml ← Testimonials section heading/labels
│   ├── media.yml            ← Podcast, talk, press appearance cards
│   └── contact.yml          ← Contact section heading, buttons, email
├── _includes/               ← One HTML file per section (auto-included by index.html)
│   ├── head.html            ← <head> meta, fonts, CSS
│   ├── nav.html             ← Fixed navigation bar + mobile menu
│   ├── hero.html            ← Hero section template
│   ├── bio.html             ← Bio section: stat card + tabbed bio panes
│   ├── photos.html          ← Photo gallery grid
│   ├── assets-section.html  ← Brand assets: colors, QR codes, downloads
│   ├── links.html           ← Link cards grid
│   ├── services.html        ← Professional services grid
│   ├── testimonials.html    ← Testimonials slider (populated from WP REST API)
│   ├── media.html           ← Media appearances grid
│   ├── contact.html         ← Contact section
│   ├── footer.html          ← Footer
│   └── lightbox.html        ← Modal lightbox (photos + QR codes)
├── _layouts/
│   ├── default.html         ← Main site shell (includes all sections)
│   └── cv.html              ← CV page shell (toolbar + print button)
├── assets/
│   ├── css/
│   │   ├── main.css         ← All styles for the main site
│   │   └── cv.css           ← CV page styles + print styles
│   ├── js/
│   │   └── main.js          ← All JavaScript (tabs, copy, QR, lightbox, slider)
│   └── img/                 ← Images: headshots, logos, bg textures
├── cv.md                    ← CV page content (pulls from _data/cv.yml)
├── index.html               ← Homepage (just Jekyll includes, no content here)
├── CNAME                    ← Custom domain: aaronsnowberger.com
├── Gemfile                  ← Ruby gem dependencies
└── README.md
```

---

## Local Development

### Prerequisites
- Ruby ≥ 3.1  
- Bundler: `gem install bundler`

### Run the site locally
```bash
cd aaronsnowberger.com
bundle install          # first time only
bundle exec jekyll serve --livereload
```
Open `http://localhost:4000` in your browser. The site auto-reloads when you save files.

### Other useful commands
```bash
bundle exec jekyll build                        # build to _site/ (no server)
JEKYLL_ENV=production bundle exec jekyll build  # production build
npm run lint:css                                # Stylelint (assets/css/main.css + cv.css)
```

CI runs Stylelint on every push to `main` (`.github/workflows/lint.yml`). Run `npm install` first if you haven't.

> **Note:** The `_site/` folder is the built output — never edit files there directly, they get overwritten on every build.

---

## Updating Content

Almost everything is edited in `_data/*.yml`. You do **not** need to touch the HTML templates for normal content updates.

### YAML basics

**Breaking long lines** — Inside a YAML block scalar (`|`), you can wrap lines freely. A single line break becomes a space in the rendered HTML; a blank line creates a new paragraph. This means you can write:

```yaml
en: |
  This is a very long sentence that I want to wrap
  here for readability in my editor.

  This blank line above starts a new paragraph.
```

Both wrapped and unwrapped lines render identically in the browser. **Do not add `<p>` tags** — the bio template wraps each paragraph automatically.

**HTML in YAML values** — Inline HTML (bold, em, links) is fine inside YAML strings and block scalars. Use `&amp;` for `&` in regular YAML values (outside block scalars).

**Bilingual fields** — Most fields come in `_en` / `_ko` pairs. Both are always present in the YAML; which one is shown is controlled by the language toggle.

---

### Hero section (`_data/hero.yml`)

| Field | What it does |
|-------|-------------|
| `name` / `name_em` | Large heading: "Aaron *Snowberger*" |
| `subtitle_en/ko` | Paragraph under the name |
| `pills` | Small tag badges. Set `color: hp-t` (teal), `hp-b` (blue), or `hp-p` (purple). Leave empty for no color. |
| `actions` | CTA buttons. Classes: `btn-primary` (teal), `btn-secondary` (blue), `btn-cv` (purple), `btn-pink` (pink). Add `fs` to the class for fill-slide hover. |
| `portrait_src` | Cloudinary URL for the hero background photo |

---

### Bio section (`_data/bio.yml`)

**Stat card**
- `portrait_src` — Square headshot (shown in stat card)
- `portrait_hires_src` — Full-size version opened by lightbox click
- `stats` — Key/value rows in the card. Use `key`+`val` for single-language; `key_en`+`key_ko`+`val_en`+`val_ko` for bilingual.

**University logos**
```yaml
universities:
  - name: "University Full Name"
    logo: "https://url-to-logo.png"   # shows as image with tooltip on hover
  - name: "Text Only University"
    logo: ""                          # shows as italic text
```
Add logos to `universities` (current) or `universities_previous` (past). The tooltip (university name on hover) is automatic when `logo` is set.

**Bio tabs**
Each tab has `id`, `tab_en/ko`, `wc_en/ko` (word count label), and `en`/`ko` block text. Add a new tab by copying an existing entry and giving it a unique `id`.

The three buttons under each bio:
- **Copy (EN)** — copies English paragraphs to clipboard
- **⇌ (flip)** — toggles between EN and KO for this bio only (independent of site language)
- **Copy (KO)** — copies Korean paragraphs to clipboard

---

### Photos (`_data/photos.yml`)

Add a card:
```yaml
photos:
  - name_en: "Conference Keynote"
    name_ko: "학회 기조연설"
    src: "https://cloudinary-url.jpg"
    hires_src: "https://cloudinary-url-large.jpg"
    spec: "JPEG · 4000×3000 · 3.2 MB"
    dl_href: "https://direct-download-link.jpg"
```
`src` is the thumbnail; `hires_src` opens in the lightbox when clicked.

---

### Assets & QR codes (`_data/assets.yml`)

**QR codes** — Add entries to `qr_codes`. Each entry needs a unique `id`, a `url`, and a `label`. The QR image is generated at runtime by JavaScript — no image files needed. To update a QR, just change the `url` value and rebuild.

```yaml
qr_codes:
  - id:    "qr-asb-main"
    url:   "https://aaron.kr"
    label: "aaron.kr"
```

Click any QR code on the site to open it full-size in the lightbox. The download button saves the first QR as a PNG.

**Color swatches** — Edit the `swatches` list. Click a swatch on the site to copy its HEX value.

---

### Links (`_data/links.yml`)

Add a link card:
```yaml
- name: "Platform Name"
  handle: "@username"
  url: "https://..."
  color: "t"   # t=teal, b=blue, p=purple
```
SVG icon is specified with `icon_type`. For a plain text/emoji icon, use `icon_glyph`.

---

### Services (`_data/services.yml`)

Add/edit service cards. Optional `img` field adds a banner image above the card title:
```yaml
- id: my-service
  img: "https://url-to-image.jpg"   # optional; omit if not needed
  title_en: "Service Name"
  ...
```

---

### Testimonials (WordPress REST API)

Testimonials are fetched **live** from `notes.aaron.kr/wp-json/wp/v2/testimonials` on every page load. No YAML editing needed.

- To add a testimonial: create a post in the `testimonials` CPT in WordPress.
- Quotes longer than 300 characters are automatically trimmed at the last sentence boundary.
- To show a profile photo: set a featured image on the WP post. The mu-plugin must register a `featured_image_url` REST field (returns the URL directly, not just the ID).

---

### Media appearances (`_data/media.yml`)

```yaml
- type: "podcast"         # podcast | talk | press
  title_en: "Episode Title"
  title_ko: "에피소드 제목"
  host_en: "Show Name"
  date: "2025-03"
  url: "https://..."
  thumb: "https://thumbnail.jpg"   # optional
```

---

### Contact (`_data/contact.yml`)

Edit `buttons` to add/remove contact buttons. Button classes: `btn-primary`, `btn-secondary`, `btn-cv`, `btn-pink`. Type `email` adds an envelope icon; `external` adds `target="_blank"`.

---

### CV (`_data/cv.yml`)

All CV content lives in `cv.yml`. Sections: `personal`, `education`, `employment`, `honors`, `certifications`, `publications` (theses/journals/conferences/books), `teaching`, `presentations`, `activities`, `languages`.

**Print/PDF** — Click "Print / Save PDF" in the toolbar. Sections flow naturally across pages; individual entries (`cv-entry`, publications, course blocks) stay together and won't split mid-item.

**Font** — Screen uses DM Sans; print uses Crimson Pro. To switch print font to Cardo, edit the `@import` line and `--cv-font-print` in `cv.css`.

---

## Bilingual system

The site has a global EN/KO toggle (nav button). Any element with class `en` is hidden when Korean is active; elements with class `ko` are hidden when English is active.

```html
<span class="en">English text</span>
<span class="ko">Korean text</span>
```

The bio section has an additional **per-pane flip button** (⇌) that toggles just the visible bio language, independently of the global toggle.

---

## Adding a new section

1. Create `_includes/my-section.html`
2. Create `_data/my-section.yml` with the content
3. Add `{% include my-section.html %}` at the right position in `index.html`
4. Add styles to `assets/css/main.css`
5. Add a nav link to `_config.yml` under `nav_links`
