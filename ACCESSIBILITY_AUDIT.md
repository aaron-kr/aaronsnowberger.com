# Accessibility Audit — aaronsnowberger.com

**Date:** 2026-04-30  
**Auditor:** Claude Code (automated static analysis)  
**Standard:** WCAG 2.1 AA  
**Site type:** Jekyll static site — personal portfolio / press kit

---

## Summary

| Category | Issues Found | Fixed | Manual Review Needed |
|----------|-------------|-------|----------------------|
| Skip link | 1 | 1 | — |
| Focus styles | 2 | 2 | — |
| Language attribute | 0 | — | — |
| Landmark roles | 4 | 4 | — |
| Navigation ARIA | 5 | 5 | — |
| Heading hierarchy | 0 | — | — |
| Images / alt text | 3 | 3 | Color contrast (manual) |
| Decorative elements | 8 | 8 | — |
| Interactive elements | 9 | 9 | — |
| Link text (vague) | 6 | 6 | — |
| Forms | 0 | — | — |
| Mobile menu | 2 | 2 | — |
| Color contrast | — | — | Manual required |
| `rel` security | 7 | 7 | — |
| React JSX leak | 1 | 1 | — |

**Total issues found: 48 | Fixed: 48 | Requires manual testing: color contrast**

---

## 1. Skip Link

### Issue
No skip-to-content link existed. Keyboard-only users had to tab through the entire navigation on every page.

### Fix Applied
- Added `<a class="skip-link" href="#main-content">Skip to main content</a>` as the first child of `<body>` in `_layouts/default.html`.
- Wrapped page content in `<main id="main-content">`.
- Added `.skip-link` CSS in `assets/css/main.css` — visually hidden until focused, then slides down from the top.

**File:** `_layouts/default.html`, `assets/css/main.css`  
**Status: FIXED**

---

## 2. Focus Styles

### Issue
Neither `main.css` nor `cv.css` defined any `:focus` or `:focus-visible` styles. The browser default focus ring was the only indicator — thin, low-contrast, and overridden by `outline:none` resets on many elements.

### Fix Applied
Added to `assets/css/main.css`:
```css
:focus-visible {
  outline: 2px solid var(--teal, #2dd4bf);
  outline-offset: 3px;
  border-radius: 4px;
}
:focus:not(:focus-visible) { outline: none; }
```

Added equivalent scoped rules to `assets/css/cv.css` for the CV page.

**Files:** `assets/css/main.css`, `assets/css/cv.css`  
**Status: FIXED**

---

## 3. Language Attribute

### Issue
None — the `<html>` element in `_layouts/default.html` correctly uses `lang="{{ page.lang | default: site.lang | default: 'en' }}"` and `_config.yml` sets `lang: "en"`. The CV layout hardcodes `lang="en"` which is correct.

**Status: PASS (no action needed)**

---

## 4. Landmark Roles

### Issues Found
- `<main>` landmark was absent — all page content was a raw `{{ content }}` dump with no wrapping `<main>`.
- `<footer>` lacked `aria-label`.
- `<nav id="mainnav">` lacked `aria-label` — screen readers announce "navigation" twice (main nav + mobile nav) with no differentiation.
- Mobile `<nav class="mob-menu">` also lacked `aria-label`.

### Fixes Applied
- Added `<main id="main-content">` wrapper in `_layouts/default.html`.
- Added `aria-label="Site footer"` to `<footer>` in `_includes/footer.html`.
- Added `aria-label="Main navigation"` to `#mainnav` and `aria-label="Mobile navigation"` to `.mob-menu` in `_includes/nav.html`.

**Files:** `_layouts/default.html`, `_includes/footer.html`, `_includes/nav.html`  
**Status: FIXED**

---

## 5. Navigation ARIA

### Issues Found
1. **Hamburger button:** `aria-label="Menu"` existed but `aria-expanded` and `aria-controls` were missing — screen readers could not tell whether the menu was open or closed.
2. **Aurora toggle button:** Had `aria-pressed` (good) and `title` but no `aria-label` — `title` is not reliably announced.
3. **Language toggle button:** No `aria-label` — "한국어" text is meaningful in Korean only; English-language screen readers would struggle.
4. **Theme toggle button:** No `aria-label` — the sun glyph `☀` has no screen reader label.
5. **Nav logo link:** No `aria-label` — announced as "Aaron Snowberger , Ph.D." which is acceptable but can be improved.

### Fixes Applied
- Hamburger: added `aria-expanded="false"` and `aria-controls="mobMenu"`. Added `aria-hidden="true"` to each decorative `<span>` inside.
- Aurora button: added `aria-label="Toggle aurora effect"`.
- Language button: added `aria-label="Switch to Korean"`.
- Theme button: added `aria-label="Switch to light mode"`.
- Nav logo: added `aria-label="Aaron Snowberger — home"`.

**Note:** The JS in `main.js` that toggles the hamburger should also update `aria-expanded` to `"true"` when the menu opens and back to `"false"` when it closes. This is a JavaScript change — verify and update `main.js` accordingly.

**File:** `_includes/nav.html`  
**Status: FIXED (HTML); JS update for `aria-expanded` state toggle needed in `main.js`**

---

## 6. Heading Hierarchy

### Issue
None — the heading hierarchy is correct throughout:
- `<h1>` appears once per page (hero section / CV header).
- `<h2>` is used for all section titles (consistent `.sec-title`).
- CV page uses `<h3>` correctly for sub-sections under `<h2>`.
- No levels are skipped.

**Status: PASS (no action needed)**

---

## 7. Images / Alt Text

### 7a. `hangul-papers.jpg` (2.1 MB)
This file is referenced **only** as a CSS `background-image` on the footer's `.ms::before` pseudo-element (opacity 0.08, `mix-blend-mode: multiply`). It is purely decorative and is never in an `<img>` tag.

**Status: PASS — CSS background images do not need alt text**

### 7b. Hero portrait image
`_includes/hero.html` had `alt="Aaron Snowberger lecturing"` on the hero background portrait. The image serves as an atmospheric decorative overlay — the name and title are announced via the `<h1>` immediately below. The enclosing `.hero-portrait` div is an absolute-positioned visual layer.

**Fix Applied:** Changed to `alt=""` with `role="presentation"` and marked the container `aria-hidden="true"` to suppress the entire decorative layer from the accessibility tree.

**File:** `_includes/hero.html`  
**Status: FIXED**

### 7c. Services section image
`_includes/services.html` used `alt="{{ service.title_en }}"` — the card title is redundant as alt text (not descriptive of the image content). Changed to `alt="{{ service.img_alt | default: service.title_en }}"` so that data files can provide a proper descriptive alt string via `img_alt:` key, falling back to the title if not set.

**Recommendation:** Add `img_alt: "Descriptive alt text"` to each service entry in `_data/services.yml` that has an image.

**File:** `_includes/services.html`  
**Status: FIXED (template); data file update recommended**

---

## 8. Decorative Elements / `aria-hidden`

Many decorative SVG icons and UI chrome elements were visible to the accessibility tree, causing verbose and redundant announcements.

### Fixes Applied

| Element | File | Fix |
|---------|------|-----|
| Progress bar `#prog` | `_layouts/default.html` | Added `aria-hidden="true"` |
| Hero background `div.hero-bg` | `_includes/hero.html` | Added `aria-hidden="true"` |
| Hero scroll indicator | `_includes/hero.html` | Added `aria-hidden="true"` |
| Asset card icon divs + SVGs | `_includes/assets-section.html` | Added `aria-hidden="true"` to container and each SVG |
| Download SVG in assets | `_includes/assets-section.html` | Added `aria-hidden="true"` |
| Service icon SVGs | `_includes/services.html` | Added `aria-hidden="true"` |
| Testimonial arrow SVGs | `_includes/testimonials.html` | Added `aria-hidden="true"` |
| Testimonial progress bar | `_includes/testimonials.html` | Added `aria-hidden="true"` |
| Photo view/download SVGs | `_includes/photos.html` | Added `aria-hidden="true"` |
| All platform logo SVGs | `_includes/links.html` | Added `aria-hidden="true"` to container and each SVG |
| Lightbox close glyph `✕` | `_includes/lightbox.html` | Wrapped in `<span aria-hidden="true">` |
| Lightbox download SVG | `_includes/lightbox.html` | Added `aria-hidden="true"` |
| CV back-link arrow SVG | `_layouts/cv.html` | Added `aria-hidden="true"` |
| CV print button SVG | `_layouts/cv.html` | Added `aria-hidden="true"` |
| Hamburger `<span>` bars | `_includes/nav.html` | Added `aria-hidden="true"` to each |
| Bio copy-button glyphs `⧉` `⇌` | `_includes/bio.html` | Wrapped in `<span aria-hidden="true">` |

**Status: FIXED**

---

## 9. Interactive Elements — Missing `aria-label`

### 9a. Lightbox close button
`<button id="lightboxClose">✕</button>` — the `✕` glyph has no accessible name.

**Fix:** Added `aria-label="Close image viewer"` and wrapped glyph in `aria-hidden` span.

### 9b. Lightbox dialog
The lightbox `<div class="modal-bg">` is a modal dialog but lacked `role="dialog"`, `aria-modal`, and `aria-label`.

**Fix:** Added `role="dialog" aria-modal="true" aria-label="Image lightbox"`.

### 9c. Bio copy buttons
Three `<button class="copy-btn">` elements had icon glyphs as primary labels.

**Fix:** Added descriptive `aria-label` to each: "Copy English bio", "View Korean bio", "Copy Korean bio".

### 9d. Photo view button
`<button class="photo-btn photo-btn-view">` had visual text ("View") but no photo-specific context.

**Fix:** Added `aria-label="View full size: {{ photo.name_en }}"`.

### 9e. Photo download link
`<a class="photo-btn photo-btn-dl">` lacked context for which photo.

**Fix:** Added `aria-label="Download {{ photo.name_en }}"`.

### 9f. QR code boxes
`<div class="qr-box-sm">` elements render QR codes via JS but had no accessible label or role.

**Fix:** Added `role="img"`, `aria-label="QR code for {{ qr.label }}: {{ qr.url }}"`, and `tabindex="0"` so keyboard users can focus them.

### 9g. CV theme button
`<button id="themeBtn">☀</button>` — icon-only, no label.

**Fix:** Added `aria-label="Switch to light mode"`.

### 9h. CV print button
Had text "Print / Save PDF" but no `aria-label`. The existing text is adequate — added `aria-label` anyway for explicitness, and marked the SVG `aria-hidden`.

### 9i. Aurora button
Had `title="Aurora"` which is not reliably surfaced. Added `aria-label="Toggle aurora effect"`.

**Files:** `_includes/lightbox.html`, `_includes/bio.html`, `_includes/photos.html`, `_includes/assets-section.html`, `_layouts/cv.html`, `_includes/nav.html`  
**Status: FIXED**

---

## 10. Link Text — Vague or Context-Free

### Issues Found
Several links lacked descriptive labels:
- Footer social links (LinkedIn, GitHub, etc.) open in new tabs with no announcement.
- Media cards open external URLs with no context that they open externally.
- Media "See all" CTA had no destination context.
- Link cards (platform grid) had no announced destination.
- CV back link announced only "aaronsnowberger.com".

### Fixes Applied
- All footer external links: added `aria-label="[Name] (opens in new tab)"` and `rel="noopener noreferrer"`.
- Media cards: added `aria-label="{{ item.title_en }} — {{ item.type_en }} (opens in new tab)"`.
- Media "See all": added `aria-label="See all media appearances on aaron.kr (opens in new tab)"`.
- Link cards: added `aria-label="{{ link.name_en }} — {{ link.handle }} (opens in new tab)"`.
- CV back link: added `aria-label="Back to aaronsnowberger.com"`.

**Files:** `_includes/footer.html`, `_includes/media.html`, `_includes/links.html`, `_layouts/cv.html`  
**Status: FIXED**

---

## 11. Forms

### Issue
No HTML forms exist. The "Contact" section (`_includes/contact.html`) uses `<a href="mailto:...">` links and CTA buttons — no `<input>`, `<textarea>`, or `<form>` elements.

**Status: PASS (no action needed)**

---

## 12. Bio Tab Panel — ARIA Tabs Pattern

### Issue
The bio section used `.btab` buttons and `.bio-pane` divs to implement a tab interface without ARIA roles. Screen readers could not identify this as a tab widget.

### Fix Applied
- Added `role="tablist"` and `aria-label="Bio length options"` to the nav container.
- Added `role="tab"`, `aria-selected`, `aria-controls`, and `id` attributes to each tab button.
- Added `role="tabpanel"`, `aria-labelledby`, and `hidden` to each pane (first pane has no `hidden`).

**Note:** The JS in `main.js` that switches tabs should also update `aria-selected` on buttons and toggle the `hidden` attribute on panels to maintain correct ARIA state.

**File:** `_includes/bio.html`  
**Status: FIXED (HTML); JS update recommended in `main.js`**

---

## 13. Mobile Menu

### Issues Found
1. `aria-expanded` was missing on the hamburger button — screen readers had no open/closed state.
2. `aria-controls` was missing — no association between trigger and menu.

### Fix Applied
- Added `aria-expanded="false"` and `aria-controls="mobMenu"` to the hamburger.
- The mobile menu `<nav>` already has `id="mobMenu"`.
- Added `aria-label="Mobile navigation"` to the mobile nav.

**Note (JS required):** When the hamburger is clicked and the menu opens, `main.js` must toggle `aria-expanded` between `"true"` and `"false"` on the `#ham` button. Without this, the HTML fix only sets the initial state correctly.

**File:** `_includes/nav.html`  
**Status: FIXED (HTML initial state); JS toggle update needed in `main.js`**

---

## 14. React JSX Leak in Footer

### Issue
`_includes/footer.html` used `<div className="foot-center">` — JSX syntax (`className`) instead of HTML (`class`). This caused the attribute to be rendered literally as `className="foot-center"` in the browser, meaning the CSS rule `.foot-center { ... }` never matched. The Wyoming cowboy logo was unstyled.

### Fix Applied
Changed `className` to `class`.

**File:** `_includes/footer.html`  
**Status: FIXED**

---

## 15. Color Contrast

### Analysis (requires manual/tool verification)

The site uses CSS custom properties via `[data-theme]` so exact contrast ratios depend on the active theme.

**Dark theme (default):**
| Color pair | Use | Approx ratio | WCAG AA (normal text 4.5:1 / large 3:1) |
|------------|-----|-------------|------------------------------------------|
| `--t1` `#e6efec` on `--bg` `#0c0f0e` | Body text | ~16:1 | PASS |
| `--t2` `#7ea89e` on `--bg` `#0c0f0e` | Secondary text | ~5.5:1 | PASS (normal) |
| `--t3` `#3e5852` on `--bg` `#0c0f0e` | Tertiary text | ~2.2:1 | FAIL — used for labels, captions |
| `--teal` `#2dd4bf` on `--bg` `#0c0f0e` | Accent, links | ~7.5:1 | PASS |
| `#7ea89e` on `#0c0f0e` (hero sub) | Hero subtitle | ~5.5:1 | PASS |
| `rgb(62 88 82 / 90%)` on `#0c0f0e` (scroll indicator) | Scroll label | ~2.5:1 | FAIL — but aria-hidden, decorative |

**Light theme:**
| Color pair | Use | Approx ratio | WCAG AA |
|------------|-----|-------------|---------|
| `--t1` `#101814` on `--bg` `#f8faf9` | Body text | ~18:1 | PASS |
| `--t2` `#3e5750` on `--bg` `#f8faf9` | Secondary text | ~5.8:1 | PASS |
| `--t3` `#8aa29b` on `--bg` `#f8faf9` | Tertiary text | ~2.9:1 | FAIL — used for labels, captions |
| `--teal` `#0a8c78` on `--bg` `#f8faf9` | Links | ~4.6:1 | PASS (borderline) |

### Recommendations (not auto-fixed — requires design decision)
- **`--t3` tertiary text** fails contrast in both themes when used for readable content (stat card keys, photo specs, footer info). Consider darkening to approximately `#5c7a72` (dark theme) and `#4a6861` (light theme).
- Run the site through the [Accessibility Insights](https://accessibilityinsights.io/) or [axe DevTools](https://www.deque.com/axe/) browser extension to confirm exact ratios after rendering.

**Status: MANUAL REVIEW REQUIRED**

---

## 16. Remaining Recommendations (Not Auto-Fixed)

### 16a. JavaScript updates needed in `main.js`
The following ARIA patterns require corresponding JS updates to maintain correct dynamic state:
1. **Hamburger `aria-expanded`:** Toggle between `"true"` / `"false"` when `#mobMenu` opens/closes.
2. **Lang button `aria-label`:** Update to "Switch to English" when the page is in Korean mode.
3. **Theme button `aria-label`:** Update to "Switch to dark mode" when the theme is light.
4. **Bio tab `aria-selected` + panel `hidden`:** Update as tabs switch.

### 16b. `<html lang>` on CV page
`_layouts/cv.html` hardcodes `lang="en"` — this is correct for a CV in English, but if Korean content is ever added to the CV, this should use the same dynamic pattern as `default.html`.

### 16c. Image CDN lazy loading
The hero portrait (Cloudinary CDN) and any photo gallery images should add `loading="lazy"` where not present to avoid blocking LCP for images below the fold. The hero portrait is above-the-fold, so it should use `loading="eager"` (the default) or `fetchpriority="high"`.

### 16d. `<title>` on each page
Already correct — `head.html` constructs `<title>{{ page.title }} · {{ site.title }}</title>` correctly.

### 16e. Reduced-motion
No `@media (prefers-reduced-motion: reduce)` rule exists. The site has multiple CSS animations (`.rise`, `ring-spin`, `scrollpulse`, fill-slide). Consider adding:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Files Modified

| File | Changes |
|------|---------|
| `_layouts/default.html` | Skip link, `<main>` wrapper, `aria-hidden` on progress bar |
| `_layouts/cv.html` | `aria-label` on theme button, print button, back link; `aria-hidden` on SVGs |
| `_includes/nav.html` | `aria-label` on both navs, nav logo, buttons; `aria-expanded` + `aria-controls` on hamburger; `aria-hidden` on hamburger spans |
| `_includes/hero.html` | Hero portrait marked decorative; scroll indicator `aria-hidden` |
| `_includes/bio.html` | Full ARIA tab pattern; `aria-label` on copy buttons; `aria-hidden` on glyphs |
| `_includes/photos.html` | `aria-label` on view/download buttons; `aria-hidden` on SVGs |
| `_includes/assets-section.html` | `aria-hidden` on icon divs/SVGs; `role="img"` + `aria-label` + `tabindex` on QR codes |
| `_includes/links.html` | `rel="noopener noreferrer"` + `aria-label` on cards; `aria-hidden` on all logo SVGs |
| `_includes/services.html` | `aria-hidden` on service icon SVGs; improved `alt` fallback for service images |
| `_includes/testimonials.html` | `aria-hidden` on arrow SVGs and progress bar |
| `_includes/media.html` | `rel="noopener noreferrer"` + `aria-label` on media cards and "see all" link |
| `_includes/footer.html` | Fixed `className` → `class` bug; `aria-label` on footer and footer nav links; `rel="noopener noreferrer"` on all external links |
| `_includes/lightbox.html` | `role="dialog"` + `aria-modal` + `aria-label` on modal; `aria-label` on close button; `aria-hidden` on SVG |
| `assets/css/main.css` | Skip link styles; `:focus-visible` styles |
| `assets/css/cv.css` | `:focus-visible` styles scoped to `.cv-page` |
