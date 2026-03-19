# BTML Guide — Claude Context

## What This Is

A React + Vite documentation site for **BTML (Book Markup Language)** — a fictional markup language invented for an HTML/CSS course. It is a course prop, not a real specification.

The site lives at: https://kianattar.github.io/btml-docs/

---

## Why BTML Exists (Pedagogical Purpose)

The HTML/CSS course teaches HTML not as a set of tags to memorize, but as a case study in *why computers need structured, predictable information*. BTML is the vehicle for that lesson.

Before any HTML is shown, Section 1 introduces the idea of markup through BTML — a format for submitting book manuscripts to a fictional publishing system. Students encounter BTML first, understand why it exists, and then see that HTML is just the same idea applied to web documents.

BTML teaches each core HTML concept through a non-HTML lens:

| BTML concept | HTML concept it mirrors |
|---|---|
| Tags wrapping content | `<tag>content</tag>` syntax |
| `<!DOCTYPE 2.0>` | `<!DOCTYPE html>` |
| Nested `<author>` fields | Nested elements, parent/child |
| `<authors>` container | List pattern: plural container, singular items |
| `language="english"` attribute | `name="value"` attribute syntax |

Students who complete Section 1 with BTML arrive at HTML already holding the mental model. The tags are new; the concept is not.

---

## Format Evolution

BTML has three versions. Each version adds exactly one new concept:

**Legacy** — flat structure, no DOCTYPE
- Tags: `<book-name>`, `<author>` (plain text name), `<content>`

**Version 1.0** — introduces DOCTYPE and nested tags
- `<!DOCTYPE 1.0>` required as first line
- `<author>` now contains child tags: `<firstname>`, `<lastname>`, optional `<title>`, `<middlename>`
- Plain-text `<author>` deprecated

**Version 2.0** — introduces multiple-item containers and attributes
- `<author>` replaced by `<authors>` container holding one or more `<author>` children
- `<content>` accepts optional `language="english"` attribute
- Singular top-level `<author>` (v1.0 style) not valid

---

## App Structure

```
src/
  App.jsx          — top nav (Documentation / Validator links), route setup
  main.jsx         — HashRouter, mounts App
  index.css        — all styles (single file, no CSS framework)
  pages/
    Docs.jsx       — versioned docs page with sidebar + version tabs
    Validator.jsx  — paste-and-validate UI
  lib/
    validator.js   — pure JS validation logic (no DOM dependency)
```

### Docs page (`Docs.jsx`)
- Three tabs: Legacy, Version 1.0, Version 2.0
- Each tab has its own sidebar section list (`SIDEBAR_SECTIONS`)
- Sidebar uses IntersectionObserver for active-section highlighting
- `CodeBlock` component does syntax highlighting via regex + `dangerouslySetInnerHTML`
- `VersionBadge`, `Callout` are small presentational components

### Validator page (`Validator.jsx`)
- Textarea input → calls `validate()` from `lib/validator.js`
- Auto-detects version from DOCTYPE
- Pre-loaded examples for each version

### Validator logic (`lib/validator.js`)
- Pure functions, no React dependency — safe to test in isolation
- Detects version from `<!DOCTYPE 1.0>` / `<!DOCTYPE 2.0>` prefix
- Three validators: `validateLegacy`, `validateV1`, `validateV2`
- Each returns an array of human-readable error strings
- Uses regex-based tag extraction (not a real XML parser — intentionally simple)

---

## Deployment

The site is deployed to GitHub Pages from the `gh-pages` branch. The `main` branch holds source. `dist/` is in `.gitignore`.

**To redeploy after changes:**

```bash
pnpm build

# Push dist to gh-pages branch
cd /tmp && rm -rf btml-gh-pages && mkdir btml-gh-pages
cp -r /path/to/section-1/code/dist/. btml-gh-pages/
cd btml-gh-pages
git init && git add -A && git commit -m "Deploy"
git branch -M gh-pages
git remote add origin https://github.com/KianAttar/btml-docs.git
git push -f origin gh-pages
```

**Key config for GitHub Pages:**
- `vite.config.js` sets `base: '/btml-docs/'` — all asset paths are relative to the repo name
- `main.jsx` uses `HashRouter` (not `BrowserRouter`) — GitHub Pages doesn't support HTML5 pushState for unknown paths, so routes are `/#/docs` and `/#/validator`

---

## What Has Not Been Built Yet

Possible extensions if the course expands:

- **Version 3.0** — could introduce self-closing/void tags (no content, no closing tag), mirroring `<br>` and `<hr>` from HTML Section 2
- **Error highlighting** — validator currently lists errors as text; could highlight the offending line in the input
- **Side-by-side view** — BTML on the left, equivalent HTML on the right, for use in later course sections that reference the analogy
- **Guided tour / interactive demo** — step-by-step mode that walks a student through building a valid v2.0 submission

---

## Course Context

This site is part of a larger HTML/CSS Udemy course. The course teaches:
- HTML as a case study in why computers need structured information
- CSS as a case study in the difference between designing and implementing a design

BTML appears in **Section 1** before any real HTML is shown. The rest of the course (Sections 2–8 for HTML, then the CSS sections) references the BTML analogy occasionally but does not depend on this site directly.

The broader course files live at `~/courses/html-css/` and have their own `CLAUDE.md` with full curriculum context.
