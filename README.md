# NB Holdings Partnership LLC — Website

Static marketing site for NB Holdings Partnership LLC, a sponsor-led investment and operating company. It is plain HTML, CSS and JavaScript, with no build step and no dependencies.

## Structure

```
index.html          Home page (approach, strategies, value creation, principles, leadership, investor inquiry)
disclosures.html    Legal disclosures / accredited-investor notice
privacy.html        Privacy policy
assets/css/styles.css
assets/js/main.js   Nav, scroll reveals, inquiry form handling
assets/img/nb-mark.svg         Logo mark, navy + gold (for light backgrounds)
assets/img/nb-mark-light.svg   Logo mark, ivory + gold (for dark backgrounds)
assets/img/nb-holdings-logo.jpg  Full original logo (used as the social-share image)
assets/img/favicon.svg
```

## Preview locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy

Any static host works: GitHub Pages (Settings → Pages → deploy from this branch, root folder), Netlify, Vercel, Cloudflare Pages or S3.

## Before going live

- **Email address:** `ir@nbholdingspartnership.com` is a placeholder. Replace it in `index.html`, `privacy.html` and `IR_EMAIL` in `assets/js/main.js`.
- **Inquiry form:** by default, submitting opens the visitor's email client with the inquiry pre-filled. To receive submissions directly, create a form endpoint (for example Formspree or Netlify Forms) and add it to the form: `<form ... data-endpoint="https://formspree.io/f/XXXX">`.
- **Leadership photo:** the "MH" monogram stands in for a headshot. Replace `.portrait-frame` contents with an `<img>` when one is available.
- **Logo:** the SVG marks were vectorized from the supplied logo image. If your designer has original vector files, drop them in at the same paths.
- **Social preview image:** `og:image` uses a relative path; change it to the full URL (e.g. `https://yourdomain.com/assets/img/nb-holdings-logo.jpg`) once the domain is live.
- **Legal review:** the site states that it relates only to Rule 506(c) offerings and that Rule 506(b) offerings are made only privately to investors with a pre-existing, substantive relationship. The disclosures and privacy policy are general templates; have securities counsel review them.
