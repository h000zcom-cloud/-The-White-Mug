# Deploying The White Mug

The site is a static single-page app. There is no server and no database to run —
the FastAPI backend in `backend/` is not used by the site any more, and does not
need deploying.

Everything below happens inside `frontend/`.

---

## Option A — Shared hosting (cPanel, Hostinger, FTP)

### 1. Build the upload archive

```bash
cd frontend
npm install        # first time only
npm run package
```

That runs the production build, checks the things that silently break a static
deploy, and writes `frontend/deploy/the-white-mug-YYYY-MM-DD.zip`.

If a check fails it tells you what and stops rather than handing you a broken
archive.

### 2. Upload

Upload **the contents** of the zip into `public_html` — not the zip itself, and
not a folder containing it. When you're done, `public_html/index.html` must
exist. If you end up with `public_html/build/index.html`, you've gone one level
too deep.

Most hosts let you upload the zip through cPanel's File Manager and use
**Extract**, which is faster and more reliable than FTP for ~1,400 files.

### 3. Check `.htaccess` actually arrived

This is the step people miss. `.htaccess` starts with a dot, so **most FTP
clients hide it by default** and it silently never uploads.

Without it, `thewhitemug.com` works and `thewhitemug.com/menu` returns 404.

- FileZilla: Server → Force showing hidden files
- cPanel File Manager: Settings → Show Hidden Files (dotfiles)

The file handles four things: SPA routing, the AVIF media type, gzip/brotli
compression, and cache headers. It's commented throughout if you need to adjust it.

### Serving from a subfolder

If the site lives at `example.com/cafe/` rather than the domain root:

1. In `frontend/package.json`, add `"homepage": "/cafe/"`
2. In `frontend/public/.htaccess`, change `RewriteBase /` to `RewriteBase /cafe/`
3. Rebuild with `npm run package`

Skipping this gives you a blank page with 404s for every JS and CSS file,
because the asset paths are absolute from the domain root.

### If HTTPS isn't set up yet

The last block of `.htaccess` forces HTTPS. If your certificate isn't installed,
comment it out first or the site will redirect into an unreachable `https://` URL.

---

## Option B — Vercel via GitHub (recommended for showing a client)

This is the least fiddly route: push once, then every future change deploys
itself.

### 1. Push the code

```bash
git add -A
git commit -m "Redesign: menu page, opening sequence, image pipeline"
git push origin main
```

If git complains that it doesn't know who you are, either set your identity
once:

```bash
git config --global user.name  "Your Name"
git config --global user.email "you@example.com"
```

...or pass it for this commit only, without changing your global config:

```bash
git -c user.name="Your Name" -c user.email="you@example.com" commit -m "..."
```

The remote is already set to `github.com/SDFDFDFFSFD/the-white-mug-nashik`.

### 2. Import into Vercel

1. Go to **vercel.com** and choose **Continue with GitHub**.
2. **Add New… → Project**, then pick `the-white-mug-nashik`.
3. Vercel will ask you to authorise access to the repository — allow it.
4. **Set Root Directory to `frontend`.** This is the one setting that matters.
   The repo has the app in a subfolder, and Vercel reads `vercel.json` from the
   root directory — leave it at the repo root and the SPA rewrite won't apply,
   so `/menu` will 404.
5. Everything else is detected automatically (Create React App, `npm run build`,
   output `build`). No environment variables are needed; the site fetches
   nothing at runtime.
6. **Deploy.** First build takes 2–4 minutes.

You'll get a `something.vercel.app` URL to send the client. Every push to `main`
redeploys automatically, and every pull request gets its own preview URL.

### One thing to be aware of

`frontend/public/img/` **must stay committed.** Those are the optimized AVIF and
WebP derivatives, and Vercel's build runs `npm run build`, not `npm run images`.
If that folder ever gets gitignored, the site deploys with no photographs.

If you'd rather not commit generated files, change `buildCommand` in
`vercel.json` to `npm run images && npm run build` — correct either way, just
adds a few minutes to each build.

---

## Option C — Vercel from the command line

`frontend/vercel.json` is already configured with the SPA rewrite and cache
headers.

**Set Root Directory to `frontend`** in Vercel's project settings. Vercel reads
`vercel.json` from the root directory, so it won't be found if you leave the
root at the repository top level.

| Setting | Value |
| --- | --- |
| Root Directory | `frontend` |
| Framework Preset | Create React App |
| Build Command | `npm run build` |
| Output Directory | `build` |

Then either connect the Git repository or run:

```bash
cd frontend
npx vercel --prod
```

No environment variables are needed. The site fetches nothing at runtime.

Don't add `homepage` to `package.json` for Vercel — it serves from the domain
root, and a subfolder `homepage` would break every asset path.

---

## What ships

| | |
| --- | --- |
| JS (gzipped) | ~163 kB |
| CSS (gzipped) | ~16 kB |
| Images | ~3.5 MB across 18 photographs × 3 widths × AVIF/WebP + JPEG fallback |
| Total upload | ~5 MB |

Images are the bulk, and they're cached for a year — a returning visitor
re-downloads almost nothing. A phone loads the 400px AVIF rung, typically 5–8 kB
per photograph.

---

## Updating the site later

```bash
cd frontend
npm run package     # shared hosting: re-upload the contents
                    # Vercel: just push to Git
```

Asset filenames contain a content hash, so a new deploy can't be served stale
from a cache. `index.html` is explicitly marked no-cache for the same reason —
it's the file that points at the current hashes.

### Adding or replacing a photograph

```bash
# drop the new file in backend/static/images/<slug>.png, then
cd frontend
npm run images        # derives AVIF + WebP + JPEG at every width
npm run photo-report  # shows which menu items still need real photography
```

Then point the item at the new slug in `frontend/src/data/menuImages.js`.

---

## Troubleshooting

| Symptom | Cause |
| --- | --- |
| Homepage works, `/menu` 404s | `.htaccess` didn't upload, or the host has `mod_rewrite` disabled |
| Blank white page, 404s on JS/CSS | Serving from a subfolder without `homepage` set |
| Images don't render, everything else fine | Host doesn't know the AVIF media type — `.htaccess` fixes this, so check it uploaded |
| Redirect loop | HTTPS forced in `.htaccess` before the certificate was installed |
| Old version still showing | `index.html` is being cached — check the `mod_headers` block applied |
| Loading screen never goes away | The JS bundle failed to load; check the browser console. A 7s failsafe in `index.html` clears it regardless |
