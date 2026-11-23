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

## Domain & contact

- Site: https://www.nbholdingspartnership.com (the `CNAME` file is for GitHub Pages; other hosts ignore it)
- Investor contact: markhamilton@nbholdingspartnership.com. It appears in `index.html`, `privacy.html` and `IR_EMAIL` in `assets/js/main.js`.

## Instagram link-in-bio page (`/start/`)

`https://www.nbholdingspartnership.com/start/` is the link for the Instagram bio. Visitors choose a path:

| Path | What happens | Category recorded |
|---|---|---|
| I have a business idea | Visitor ticks the downloads they want, enters name + email + consent, then gets a download button for each (a single pick downloads automatically) | Business Idea |
| I want to get into real estate | Joins the training waitlist (can become a download list the same way) | Real Estate |
| I'm interested in investing | Goes to the accredited-investor inquiry on the home page | Investor |

Every submission goes to HubSpot as a separate lead with `category`, `resources` (what they chose, comma-separated) and `source`. Someone who signs up on two paths is recorded once in each category; after one sign-up, the page offers the other path with their name and email pre-filled.

**Source tracking:** add `?utm_source=instagram&r=<reel-name>` to a link and that tag is saved with the lead, including if they move on to the investor form. Link straight to a path with `/start/#business-idea` or `/start/#real-estate`.

**Adding a download:** put the PDF in `downloads/`, then in `start/index.html` copy a `<label class="pick">` block inside that path's "Choose your free downloads" list and change `value`, `data-file` and the visible text. To give real estate downloads, copy the business path's `<fieldset class="resource-picks">` and success `download-list` into the real estate form and remove its hidden `resources` waitlist field.

## HubSpot CRM

All website forms send leads to HubSpot (account `248103393`) from `assets/js/leads.js`, with Formspree (`xdegzwky`) as an automatic backup if HubSpot can't be reached.

| Website form | HubSpot form | HubSpot list |
|---|---|---|
| /start: business idea | Business Idea Leads | Funnel: Business Idea |
| /start: real estate | Real Estate Leads | Funnel: Real Estate |
| Home page investor inquiry | Investor Inquiries | Funnel: Investors |

Custom contact properties (group "NB Website Leads"): `nb_lead_category`, `nb_resources_requested`, `nb_lead_source`, `nb_email_consent`, `nb_investor_type`, `nb_investment_interests`, `nb_accredited_representation`. A person who submits more than one form is one contact that appears in each matching list.

## Before going live

- **Forms → HubSpot:** see "HubSpot CRM" below.
- **Leadership photo:** `assets/img/mark-hamilton.jpg` (800×1000, cropped 4:5). Replace the file at the same path to update it.
- **Logo:** the SVG marks were vectorized from the supplied logo image. If your designer has original vector files, drop them in at the same paths.
- **Legal review:** the site states that it relates only to Rule 506(c) offerings and that Rule 506(b) offerings are made only privately to investors with a pre-existing, substantive relationship. The disclosures and privacy policy are general templates; have securities counsel review them.
