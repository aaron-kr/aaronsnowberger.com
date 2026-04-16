# aaronsnowberger.com — Jekyll Press Kit Site

## Table of Contents
1. [Project Structure](#project-structure)
2. [Local Development](#local-development)
3. [Deploying to GitHub Pages](#deploying-to-github-pages)
4. [WordPress Migration: Full Consequences & Mitigation](#wordpress-migration)
5. [DNS Setup](#dns-setup)
6. [Updating Content](#updating-content)

---

## Project Structure

```
aaronsnowberger.com/
├── _config.yml              ← Site-wide settings, nav, profiles
├── _layouts/
│   └── default.html         ← Master HTML shell
├── _includes/               ← One file per section
│   ├── head.html
│   ├── nav.html
│   ├── hero.html
│   ├── bio.html
│   ├── photos.html
│   ├── assets-section.html
│   ├── links.html
│   ├── services.html
│   ├── media.html
│   ├── contact.html
│   ├── footer.html
│   └── lightbox.html
├── assets/
│   ├── css/main.css         ← All styles
│   ├── js/main.js           ← All JavaScript
│   └── img/                 ← Your headshots, logos, etc.
│       ├── aaron-portrait.jpg          ← Used in hero + stat card
│       ├── aaron-portrait-hires.jpg    ← Lightbox full-size version
│       └── wyoming_cowboys_no-txt.webp ← Wyoming logo (optional)
├── index.html               ← Homepage (just Jekyll includes)
├── CNAME                    ← Custom domain file
├── Gemfile                  ← Ruby dependencies
└── README.md
```

**To add new sections:** create `_includes/my-section.html`,
then add `{% include my-section.html %}` to `index.html`.

---

## Local Development

### Prerequisites
- Ruby ≥ 3.1
- Bundler: `gem install bundler`

### Setup
```bash
git clone https://github.com/YOUR-USERNAME/aaronsnowberger.com.git
cd aaronsnowberger.com
bundle install
bundle exec jekyll serve --livereload
```
Open `http://localhost:4000` in your browser.

### Flags
```bash
bundle exec jekyll serve --draft      # show draft posts
bundle exec jekyll build              # build to _site/ only
JEKYLL_ENV=production bundle exec jekyll build   # production build
```

---

## Deploying to GitHub Pages

### One-time setup
1. Create a **new GitHub repository** named `aaronsnowberger.com`
   (or any name — the CNAME file controls the domain).
2. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial Jekyll press kit"
   git remote add origin https://github.com/YOUR-USERNAME/aaronsnowberger.com.git
   git push -u origin main
   ```
3. In GitHub repo **Settings → Pages**:
   - Source: **Deploy from a branch**
   - Branch: `main` / `root`
   - Click **Save**

GitHub Pages will build automatically on every push to `main`.
Builds usually take 1–3 minutes. Check progress under
**Actions** tab → `pages-build-deployment`.

### CNAME file
The `CNAME` file in the repo root contains `aaronsnowberger.com`.
Do NOT add `www.` — GitHub handles the redirect automatically.

---

## WordPress Migration

### ⚠️ What happens when you replace WP with Jekyll

#### The good news
- **Domain authority is preserved.** Your PageRank lives in the
  domain name, not the WordPress install. Switching CMS does
  not wipe your DA.
- **The new site will be significantly faster**, which Google
  rewards. Static HTML vs WordPress PHP = typically 10–50× faster
  TTFB (time to first byte).
- **Security improves.** No PHP, no database, no WordPress attack
  surface.

#### The risks you MUST mitigate

| Risk | Impact | Fix |
|------|--------|-----|
| Old WP URLs (e.g. `/blog/post-slug/`) return 404 | Google deindexes those pages; inbound links break | 301 redirects (see below) |
| Loss of indexed blog content | Lower organic search traffic | Decide: migrate posts to Jekyll, or keep WP at a subdomain |
| XML sitemap gone | Google loses crawl map | `jekyll-sitemap` auto-generates `/sitemap.xml` |
| RSS feed gone | Subscribers lose feed | Add a simple `/feed.xml` or use feedburner redirect |

#### Your specific situation
`aaronsnowberger.com` is currently a **design portfolio / older site**,
not a high-traffic blog. The SEO risk is **low to moderate** because:
- You don't appear to have hundreds of indexed blog posts there
- Your primary SEO presence is `aaron.kr`
- This site's new purpose (press kit) doesn't compete with its old purpose

**Recommendation:** Do a full Google Search Console audit
(`search.google.com/search-console`) for `aaronsnowberger.com`
before migrating. Export all indexed URLs. If there are fewer
than ~20 indexed pages, just proceed. If there are 50+, set up
redirects first.

### Setting up 301 redirects on GitHub Pages

GitHub Pages doesn't support `.htaccess` or server-side redirects.
Your options:

#### Option A: Jekyll redirect-from plugin (easiest)
Add to `Gemfile`:
```ruby
gem "jekyll-redirect-from"
```
Add to `_config.yml` plugins list:
```yaml
plugins:
  - jekyll-redirect-from
```
Then create stub pages for old URLs:
```yaml
# _redirects/old-post.html
---
redirect_from: /blog/old-post-slug/
redirect_to: https://aaronsnowberger.com
---
```

#### Option B: Meta refresh HTML files
For each old URL, create `old-url/index.html` with:
```html
<meta http-equiv="refresh" content="0; url=https://aaronsnowberger.com">
<link rel="canonical" href="https://aaronsnowberger.com">
```
Not a true 301 (search engines see it as a soft redirect), but
it prevents 404s and passes most link equity.

#### Option C: Cloudflare redirect rules (best for many URLs)
If you use Cloudflare for DNS (recommended), you can set up
bulk 301 redirect rules in the Cloudflare dashboard without
touching the Jekyll files at all. Free plan supports up to 3
redirect rules (each can be a wildcard).

**The most useful rule:**
- Match: `aaronsnowberger.com/blog/*`
- Redirect to: `https://aaronsnowberger.com` (301)

This catches all old blog URLs in one rule.

---

## DNS Setup

### Pointing aaronsnowberger.com → GitHub Pages

In your DNS provider (Namecheap, Cloudflare, GoDaddy, etc.),
add these records:

#### Root domain (aaronsnowberger.com)
Add 4 A records pointing to GitHub Pages IPs:
```
Type  Host  Value
A     @     185.199.108.153
A     @     185.199.109.153
A     @     185.199.110.153
A     @     185.199.111.153
```

#### www subdomain
```
Type   Host  Value
CNAME  www   YOUR-USERNAME.github.io
```

#### Verify in GitHub Settings → Pages
After DNS propagates (5 min – 48 hrs), GitHub will verify the
custom domain and provision a free TLS certificate automatically.
Check the "Custom domain" box. Enable "Enforce HTTPS".

### Using Cloudflare (recommended)
1. Add your domain to Cloudflare (free plan is fine)
2. Cloudflare handles DNS + CDN + redirect rules
3. Set Cloudflare SSL to "Full" (not "Flexible")
4. Set the GitHub Pages A records above in Cloudflare DNS
5. You can now set up redirect rules for old WP URLs in the
   Cloudflare dashboard

---

## Updating Content

### Adding a media appearance
Edit `_includes/media.html`. Copy an existing `.media-card` block
and update the type badge, title, host, and date.

### Adding a headshot
Drop the file in `assets/img/` and update the `src` in
`_includes/photos.html` and `_includes/bio.html`.

### Changing your universities
Edit the `.uni-name` items in `_includes/bio.html`.

### Changing links
Edit `profiles:` in `_config.yml` — the footer and links section
both pull from there via `{{ site.profiles.linkedin }}` etc.

### Adding a blog / posts
Create `_posts/YYYY-MM-DD-title.md` with standard Jekyll frontmatter.
Add a `blog.html` layout and `{% include blog.html %}` to `index.html`.
