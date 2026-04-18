# Security Notes

## Email obfuscation

Contact email is obfuscated across all rendered HTML to reduce harvesting by spam bots. This is a Jekyll (static HTML) site, so `&#64;` entities in template output ARE preserved in the final HTML — unlike React/Next.js where JSX decodes entities before rendering.

**Technique used throughout:** wherever the email appears in a Liquid template, it is first split on `@` and reassembled with the HTML entity `&#64;` for both the `href` attribute and the display text. e.g.:

```liquid
{% assign ep = site.author.email | split: "@" %}
<a href="mailto:{{ ep[0] }}&#64;{{ ep[1] }}">{{ ep[0] }}&#64;{{ ep[1] }}</a>
```

The generated HTML reads `href="mailto:hi&#64;aaron.kr"` — browsers decode and follow it correctly; simple regex scrapers do not match `@`.

**Files fixed:**

| File | What changed |
|---|---|
| `_includes/bio.html` | href changed from `{{ site.author.email }}` to `{{ ep[0] }}&#64;{{ ep[1] }}` |
| `_data/contact.yml` | Button href changed from `mailto:you@yoursite.com` to `mailto:you&#64;yoursite.com` |
| `_data/photos.yml` | Two inline HTML mailto hrefs updated to use `&#64;` |
| `cv.md` (×2) | **Bug fix + obfuscation:** href used undefined `{{ c.email }}` (broken mailto); replaced with `{{ cp[0] }}&#64;{{ cp[1] }}` — now works and is obfuscated |

**Already correct before this audit:**

- `_includes/contact.html` — was already using the split+`&#64;` pattern in both href and display text.

**Data source fields** (`_config.yml` `author.email`, `_data/contact.yml` `email`, `_data/cv.yml` `personal.email`) keep the plain address as internal data values — they are never output directly to HTML; they are always fed through a `split: "@"` filter first.

## Address

Only city-level location ("Jeonju, South Korea" / "전주, 대한민국") appears in the codebase. No street address, postal code, or building name is present anywhere.

## Secrets / environment variables

- `.gitignore` correctly excludes `_site/`, `.env`, and `.env.*`.
- No API keys, tokens, passwords, or credentials were found in any source file.
- No `.env` files are present in the project.

## Git author email

`git_author@email` appears in local `.git/logs` as the git author email. This is
standard git metadata, not part of the deployed site. It is already visible in the public GitHub commit history — expected for a public open-source personal site.

## What cannot be fully hidden

- The email domain `aaron.kr` is the site's own domain and appears throughout as a URL. By design. 
- `site.author.email` in `_config.yml` stores the plain address as a data value — but it is never printed directly to HTML.
- The `_site/` build directory (gitignored) contains plain `@` in compiled HTML from before these fixes. It will be correct after the next `jekyll build`.
