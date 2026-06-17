---
title: "How this site is built"
description: "A quick look at the Astro + GitHub Pages setup powering this homepage."
pubDate: 2026-06-16
tags: ["astro", "web"]
---

This site is built with [Astro](https://astro.build) and deployed to GitHub
Pages automatically whenever I push to the `main` branch.

## The stack

- **Astro** for the static site and markdown blog
- **GitHub Actions** to build and deploy on every push
- **GitHub Pages** for free hosting at `dongfangyixi.github.io`

## Adding content

| Want to add… | Edit… |
| --- | --- |
| A blog post | a `.md` file in `src/content/blog/` |
| A news update | a `.md` file in `src/content/news/` |
| A video | an entry in `src/data/videos.ts` |
| About text | `src/pages/about.astro` |

That's it — push, and it goes live in a minute or two.
