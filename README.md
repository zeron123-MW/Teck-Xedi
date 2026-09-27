# Teck Xedi — Website

A 3-page, production-ready site for Teck Xedi (Home, Products, Contact). Pure HTML/CSS/JS — no build step, no dependencies, no backend required.

## Structure
```
teckxedi/
├── index.html          Home
├── products.html        Products & Concepts
├── contact.html          Contact
├── style.css              All styling (design tokens at the top)
├── script.js              Nav, dark mode, scroll reveal, parallax, photo upload, filters, form
├── assets/
│   ├── logo.svg           Logo (dark, for light backgrounds)
│   └── logo-light.svg     Logo (light, for the navy/dark footer & hero)
└── README.md
```

## Features
- Photo upload on every product card and founder photo (click the frame → choose an image). It's saved in that browser's local storage, so it persists on refresh. Replace `assets/logo.svg` any time with a real logo file to override the lettermark.
- Dark mode toggle (top-right, remembers the visitor's choice).
- Scroll-reveal animations + hero parallax on founder photos.
- Fully responsive, mobile nav, keyboard-accessible focus states, reduced-motion support.
- Contact form opens a pre-filled email to gilbertkatuwa2006@gmail.com (static site, no backend).

## Run locally
Just open `index.html` in a browser, or serve it:
```bash
npx serve .
```

## Push to GitHub
```bash
cd teckxedi
git init
git add .
git commit -m "Teck Xedi website"
git branch -M main
git remote add origin https://github.com/<your-username>/teckxedi.git
git push -u origin main
```
(Create the empty `teckxedi` repo on GitHub first at https://github.com/new — don't initialise it with a README so the push above doesn't conflict.)

## Deploy to Netlify
**Fastest — drag and drop, no account setup needed for a first look:**
1. Go to https://app.netlify.com/drop
2. Drag the whole `teckxedi` folder onto the page. It deploys instantly with a live URL.

**Recommended — connected to GitHub, so every future push redeploys automatically:**
1. Push the folder to GitHub (steps above).
2. In Netlify: **Add new site → Import an existing project → GitHub** → pick `teckxedi`.
3. Build command: leave blank. Publish directory: `.` (root).
4. Deploy. Netlify gives you a `*.netlify.app` URL immediately; add a custom domain later under **Domain settings** if you get one.

## Swapping in real photos
The logo and founder/product photos are placeholders you (or any visitor testing it) can click to upload — but for the real production version, replace them permanently:
- Drop a real logo file in `assets/` and update the two `<img src="assets/logo...">` references.
- Either upload the founder/product photos through the site once (they'll persist for you locally), or edit the `<img>` tags directly and add real file paths under `assets/`.
