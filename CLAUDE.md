# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Brazil Trip Planner - A Next.js application for planning a 1-month trip to Brazil. Features itinerary planning, budget tracking, accommodations, packing lists, documents, and notes.

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Tech Stack

- **Next.js 16** with App Router (src/app/)
- **React 19**
- **TypeScript** (strict mode)
- **Tailwind CSS 4** (via PostCSS)
- **ESLint 9** with Next.js core-web-vitals and TypeScript configs

## Architecture

- Uses Next.js App Router pattern with layouts and pages in `src/app/`
- Path alias: `@/*` maps to `./src/*`
- Fonts: Geist Sans and Geist Mono loaded via `next/font/google` with CSS variables `--font-geist-sans` and `--font-geist-mono`
