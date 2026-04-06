# aaronsnowberger.com — Business Card Site

Single-page online business card. Static HTML — no build step, no dependencies.

## GitHub Pages Setup (5 minutes)

### 1. Create a GitHub repo
```
Repo name: aaronsnowberger.com
           (or any name — the custom domain overrides it)
Visibility: Public
```

### 2. Push this file
```bash
git init
git add .
git commit -m "init business card"
git remote add origin https://github.com/YOUR_USERNAME/aaronsnowberger.com.git
git push -u origin main
```

### 3. Enable GitHub Pages
- Repo → Settings → Pages
- Source: **Deploy from branch**
- Branch: `main` / `/ (root)`
- Save

### 4. Add custom domain
- In Settings → Pages → Custom domain: `aaronsnowberger.com`
- Also add `www.aaronsnowberger.com`
- Click Save (GitHub will create a `CNAME` file automatically)

### 5. Update DNS at Dreamhost
Add these DNS records:

| Type  | Host | Value                   |
|-------|------|-------------------------|
| A     | @    | 185.199.108.153          |
| A     | @    | 185.199.109.153          |
| A     | @    | 185.199.110.153          |
| A     | @    | 185.199.111.153          |
| CNAME | www  | YOUR_USERNAME.github.io |

Wait ~30 min for DNS to propagate. GitHub will auto-provision HTTPS/SSL.

## Images needed in /img/
Copy from your aaron.kr project:
- `img/hangul-calligraphy.jpg`  (footer texture — optional, gracefully absent)

## Updating content
Edit `index.html` directly:
- Bio text: lines ~250–270
- Research tags: `.focus-tags` section  
- Links: `.links` section
- Affiliations: `.affil-list` section

Then:
```bash
git add index.html && git commit -m "update bio" && git push
# → Live in ~30 seconds
```

## Physical AI paper strategy notes
Update research tags / bio text as papers progress:
- Short-term: "Low-resource Physical AI curriculum" → Data in Brief or IEEE Access
- Mid-term: "Modular IoT + circuits lesson framework" → empirical study  
- Longer: "Cross-cultural AI adoption in K-12 / HE settings" → tenure narrative
