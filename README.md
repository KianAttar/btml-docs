# BTML Guide

A fictional documentation site for **BTML (Book Text Markup Language)** — a made-up markup language used as a teaching prop in an HTML/CSS course.

## What is BTML?

BTML is a structured format for submitting book manuscripts to a fictional publishing system. It exists to teach the *why* of markup languages before students see real HTML. By designing (and breaking) BTML, students discover:

- Why computers need tagged, structured information
- What a DOCTYPE declaration is and why it exists
- How tags nest to represent hierarchy
- What attributes are and why they live inside the opening tag

The format evolves across three versions, each adding a concept that maps directly to HTML:

| Version | New concept introduced |
|---|---|
| Legacy | Tags, flat structure |
| 1.0 | DOCTYPE, nested tags (parent/child) |
| 2.0 | Multiple-item containers, attributes |

## What's in this repo

- **Documentation page** — versioned docs with sidebar navigation, code blocks, tag reference tables, and version badges
- **Validator page** — paste a BTML submission and check it against the format rules; detects version automatically from the DOCTYPE

## Tech

React 19, React Router 7, Vite 7, plain CSS — no component library, no utility framework.

## Development

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
```

---

This site is a course asset, not a real specification.
