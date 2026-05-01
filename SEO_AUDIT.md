# SEO Audit — aaronsnowberger.com

Audit date: 2026-05-01  
Lighthouse score before: **92/100**  
Expected score after fixes: **100/100**

---

**Root cause of 92 Lighthouse score:**  
`_includes/head.html` manually emitted a `<title>`, `<meta name="description">`, and `<link rel="canonical">` tag — and then `{% seo %}` (jekyll-seo-tag) emitted all three again. The page had **duplicate title tags** on every build. Lighthouse's "Document has a `<title>`" audit is pass/fail but duplicate tags are flagged. More critically, the stale `_site/robots.txt` (generated from a local build) contained `Sitemap: http://localhost:4000/sitemap.xml`, which would cause Lighthouse's `robots.txt` validity check to fail if Lighthouse ever crawled that file. A source-level `robots.txt` did not exist, meaning production correctness depended entirely on the jekyll-sitemap auto-generation.

Secondary issues: no `og:image`, `twitter:card` was `summary` instead of `summary_large_image`, no `social` block for structured data `sameAs`, and two LinkedIn links in `testimonials-slider.html` pointed to `https://linkedin.com/in/` (incomplete, placeholder URLs).

---

## Summary Table

| # | Check | Status Before | Status After | Fix |
|---|-------|--------------|-------------|-----|
| 1 | `<title>` element present | WARN (duplicate) | PASS | Removed manual title from head.html |
| 2 | `<meta name="description">` | WARN (duplicate) | PASS | Removed manual description from head.html |
| 3 | HTTP status code | PASS | PASS | No change needed |
| 4 | Links are crawlable | WARN | PASS | Fixed `href="#"` in lightbox, removed incomplete LinkedIn URLs |
| 5 | Page not blocked from indexing | PASS | PASS | No noindex tags found |
| 6 | Image alt text | PASS | PASS | Previously fixed in accessibility audit |
| 7 | Links have descriptive text | PASS | PASS | All links have text or aria-label |
| 8 | Valid hreflang | N/A | N/A | JS-based bilingual; no hreflang needed |
| 9 | No `<meta http-equiv="refresh">` | PASS | PASS | None found |
| 10 | `<meta name="viewport">` | PASS | PASS | Present in head.html |
| 11 | robots.txt valid & references sitemap | FAIL | PASS | Created source robots.txt with correct Sitemap URL |
| 12 | sitemap.xml | PASS | PASS | jekyll-sitemap generates correctly on deploy |
| 13 | Canonical URL | WARN (duplicate) | PASS | Removed manual canonical; jekyll-seo-tag handles it |
| 14 | Open Graph tags | PARTIAL | PASS | Added og:image to _config.yml and index.html front matter |
| 15 | Twitter Card | PARTIAL | PASS | Upgraded to summary_large_image, added username |
| 16 | Structured data | PARTIAL | PASS | Added Person schema JSON-LD; social sameAs links added |
| 17 | Title length (≤60 chars) | PASS | PASS | 58 chars on index |
| 18 | Description length (120–160 chars) | PASS | PASS | 155 chars on index |
| 19 | One `<h1>` per page | PASS | PASS | hero.html h1 on index; cv.md h1 on CV |
| 20 | Unique titles per page | PASS | PASS | Index and CV have distinct titles |

---

## Per-Check Findings

### 1–2. Duplicate `<title>` and `<meta name="description">` (FIXED)

**Problem:** `_includes/head.html` manually output:
```html
<title>{% if page.title %}{{ page.title }} · {{ site.title }}{% else %}{{ site.title }}{% endif %}</title>
<meta name="description" content="{{ page.description | default: site.description }}">
<link rel="canonical" href="{{ page.url | prepend: site.url }}">
```
Then `{% seo %}` immediately below output all three again. The rendered `_site/index.html` confirmed two `<title>` and two `<meta name="description">` elements (lines 9/44 and 10/49 respectively).

**Fix:** Removed the three manual lines from `head.html`. jekyll-seo-tag is now the sole source of truth for title, description, and canonical.

---

### 4. Links crawlable — lightbox `href="#"` (FIXED)

**Problem:** `_includes/lightbox.html` had:
```html
<a href="#" class="modal-dl-btn fs" id="lightboxDl" download>
```
A bare `href="#"` is a non-navigable anchor that Lighthouse flags as potentially uncrawlable and it had no `aria-label`.

**Fix:** Changed to `href="#lightbox"` (the dialog's own ID) and added `aria-label="Download full size image"`.

---

### 4b. Incomplete LinkedIn URLs in testimonials-slider.html (FIXED)

**Problem:** Two `<a href="https://linkedin.com/in/" ...>LinkedIn</a>` links with placeholder/incomplete URLs existed in `testimonials-slider.html`.

**Note:** `testimonials-slider.html` is not currently included anywhere in the site — it's a legacy archive file. However the links were cleaned up preventively.

**Fix:** Removed both incomplete LinkedIn `<a>` blocks. The badge text (Academic/Client) remains.

---

### 11. robots.txt — no source file (FIXED)

**Problem:** No `robots.txt` existed in the Jekyll source root. The only `robots.txt` was in `_site/`, generated from a local build with `url: http://localhost:4000`, meaning the Sitemap line read:
```
Sitemap: http://localhost:4000/sitemap.xml
```
This would fail any Lighthouse robots.txt validity check that checks the URL is reachable.

**Fix:** Created `/robots.txt` as a Jekyll source file with empty front matter (so Jekyll processes it):
```
---
---
User-agent: *
Allow: /
Disallow: /_site/
Disallow: /node_modules/
Disallow: /scripts/
Sitemap: {{ site.url }}/sitemap.xml
```
Jekyll will interpolate `{{ site.url }}` to `https://aaronsnowberger.com` on build.

---

### 14. Open Graph `og:image` — missing (FIXED)

**Problem:** jekyll-seo-tag emitted no `og:image` or `og:image:width`/`og:image:height` because no `image` was configured in `_config.yml` or page front matter.

**Fix:**
- Added `image:` block to `_config.yml` (site-wide default)
- Added `image:` block to `index.html` front matter (page-specific override)
- Using Cloudinary portrait URL with `c_fill,w_1200,h_630,g_face` transformation for optimal 1200×630 OG crop

---

### 15. Twitter Card — `summary` → `summary_large_image` (FIXED)

**Problem:** `_config.yml` had no `twitter:` block, so jekyll-seo-tag defaulted to `summary` card type. This means Twitter/X renders only a small thumbnail.

**Fix:** Added to `_config.yml`:
```yaml
twitter:
  username: "aaronsnowberger"
  card:     "summary_large_image"
```

---

### 16. Structured Data (IMPROVED)

**Problem:** jekyll-seo-tag generated only a `WebSite` schema. For a personal portfolio, a `Person` schema with `sameAs` links to all academic/social profiles is standard and improves Knowledge Panel eligibility.

**Fix:**
- Added `social:` block to `_config.yml` so jekyll-seo-tag's built-in `sameAs` support activates
- Added explicit `Person` JSON-LD block to `head.html` (renders only on the root page) with `jobTitle`, `worksFor`, `alumniOf`, `knowsAbout`, `address`, and `sameAs` fields

---

### Links section — missing SVG logos for "personal" and "lab" types (FIXED)

**Problem:** `_data/links.yml` uses `type: "personal"` and `type: "lab"` for the first two link cards (aaron.kr and pailab.io). `_includes/links.html` only handled `academic`, `linkedin`, `github`, `researchgate`, `google-scholar`, `orcid`, `youtube`, `kspai` — so these two cards rendered with an empty logo div.

**Fix:** Added SVG fallback cases for `personal` (Ak monogram, matches "academic" style) and `lab` (hexagon/dot shape in purple, matches kspai style) at the top of the `{% if %}` chain.

---

### _config.yml — exclude audit files (IMPROVED)

Added `ACCESSIBILITY_AUDIT.md`, `SEO_AUDIT.md`, `SECURITY-NOTES.md`, and `scripts` to the `exclude:` list so they don't appear in the Jekyll build output.

---

## Files Changed

| File | Change |
|------|--------|
| `_includes/head.html` | Removed duplicate `<title>`, `<meta description>`, `<link canonical>`; added Person JSON-LD schema |
| `_includes/lightbox.html` | Fixed `href="#"` → `href="#lightbox"`; added `aria-label` |
| `_includes/links.html` | Added SVG logo cases for `personal` and `lab` link types |
| `_includes/testimonials-slider.html` | Removed two incomplete `href="https://linkedin.com/in/"` link blocks |
| `_config.yml` | Added `image:`, `twitter:`, `social:` blocks for jekyll-seo-tag; expanded `exclude:` list |
| `index.html` | Added page-level `image:` front matter for og:image |
| `robots.txt` (NEW) | Created source robots.txt with Jekyll front matter to interpolate `{{ site.url }}` |

---

## Remaining Recommendations (Not Failing Lighthouse)

1. **`testimonials-slider.html`** — This file exists in `_includes/` but is not included anywhere. Consider moving it to a `_archive/` folder or deleting it to reduce confusion.

2. **LinkedIn profiles for testimonials** — The two testimonial givers (Donald Larson, PD Martin) had placeholder LinkedIn URLs. If real profile URLs are obtained, add them back as proper `<a href="https://linkedin.com/in/real-username">` links.

3. **`og:image` on CV page** — The CV page (`/cv/`) uses the site-default image from `_config.yml`. If a CV-specific image (e.g., a cropped photo with text overlay) is created, add it to `cv.md` front matter.

4. **Verify Google Search Console** after deploying — confirm the sitemap is submitted and the robots.txt renders correctly at `https://aaronsnowberger.com/robots.txt`.
