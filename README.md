# Fed Supernova Simulation Solutions

Lead-generation website for an independent **Ansys® reseller + engineering-support**
provider targeting U.S. startups and small businesses pursuing **defense / federal
non-dilutive funding** (SBIR/STTR, AFWERX, SpaceWERX, DIU, DARPA, and more).

**Single conversion goal:** get the visitor to *talk to an engineer* — call or request a
meeting — about Ansys evaluation licenses and live engineering support.

## Stack
Static HTML/CSS/JS. No build step, no dependencies, no backend required. Designed to be
served directly by **Hostinger "Deploy from GitHub"** from the `main` branch. Desktop-first,
fully responsive, and heavily SEO / AI-crawler optimized.

## Pages
| File | Purpose |
|------|---------|
| `index.html` | Home — hero, who-it's-for, funding framing, physics, how-it-works, CTAs |
| `funding.html` | **Funding Finder** — filterable map of 19+ programs (6 facets, search, detail modals) |
| `applications.html` | Top 10 defense simulation applications, each mapped to Ansys tools + funders |
| `ansys.html` | Ansys Startup Program eligibility, bundles, engineering support, scope boundary |
| `contact.html` | Conversion page — call/email CTAs + short lead form |

## Structure
```
css/style.css          Design system (desktop-first)
js/main.js             Nav drawer, scroll reveal, year stamp
js/funding-data.js     The 19-program dataset + facet vocabularies (edit to add programs)
js/funding-finder.js   Client-side faceted filtering + detail modal
assets/                Logo + OG cover (SVG)
images/PROMPTS.md      Nano-banana prompts to upgrade visuals to generated images
robots.txt sitemap.xml llms.txt   SEO + AI-crawl
```

## Things to set before / after launch
1. **Phone number** — in `contact.html`, set `var SITE_PHONE = "+1..."` to enable
   click-to-call. Left empty, the "Call" button requests a callback by email.
2. **Contact form** — currently opens a prefilled email (`mailto:`), so it works with no
   backend. To capture leads server-side, point the form's submit handler at a POST
   endpoint (Hostinger PHP, Formspree, Supabase, etc.).
3. **Images** — see `images/PROMPTS.md` to swap the inline SVGs for nano-banana renders.
4. **Verify funding figures** — award caps and intake status change; each Funding Finder
   detail links to the official source. Re-verify before relying on any number.

## Contact
info@fedsupernova-simulationlsolutions.com

---
*Independent Ansys reseller. Not affiliated with the "Fed Supernova" conference (Capital
Factory), Ansys Inc., SimuTech Group, the U.S. Department of Defense, or any funding agency.
Software and engineering support only — no grant/application advice.*
