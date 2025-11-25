# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Brazil Trip Planner - A Next.js application for planning a 1-month trip to Brazil (January 1 - February 7, 2026). Features include:
- **Calendar**: 38-day calendar with color-coded regions (São Paulo, Minas Gerais, Goiás, Santa Catarina)
- **Flights**: Track flight bookings with details
- **Hotels**: Manage accommodation reservations
- **Expenses**: Track spending with per-category budget limits and warnings
- **Events**: Schedule activities for specific days
- **Dashboard**: Overview of trip status, budget, and upcoming events

## Commands

```bash
npm run dev        # Start development server (localhost:3000)
npm run build      # Production build
npm run start      # Start production server
npm run lint       # Run ESLint
npm run db:generate # Generate Prisma client
npm run db:migrate  # Run Prisma migrations
npm run db:push     # Push schema to database
npm run db:seed     # Seed database with initial data
npm run db:studio   # Open Prisma Studio
```

## Tech Stack

- **Next.js 16** with App Router (src/app/)
- **React 19**
- **TypeScript** (strict mode)
- **Tailwind CSS 4** (CSS-first config via `@theme` directive)
- **Prisma ORM** with MySQL
- **shadcn/ui** components
- **TanStack React Query** for data fetching
- **React Hook Form** + **Zod** for form validation
- **date-fns** for date manipulation

## Architecture

### Directory Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (calendar-days, flights, hotels, expenses, events, settings, dashboard)
│   ├── calendar/          # Calendar page
│   ├── flights/           # Flights management
│   ├── hotels/            # Hotels management
│   ├── expenses/          # Expenses & budget
│   ├── events/            # Events scheduling
│   └── page.tsx           # Dashboard
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Header, navigation
│   ├── calendar/          # Calendar components
│   ├── flights/           # Flight components
│   ├── hotels/            # Hotel components
│   ├── expenses/          # Expense components
│   ├── events/            # Event components
│   └── dashboard/         # Dashboard components
├── hooks/                 # React Query hooks for data fetching
├── lib/                   # Utilities (db, utils, constants)
├── types/                 # TypeScript interfaces
└── generated/prisma/      # Generated Prisma client
```

### Key Patterns
- Path alias: `@/*` maps to `./src/*`
- API routes return JSON, handle CRUD operations
- React Query hooks in `src/hooks/` for each entity
- Currency: All amounts in BRL with USD conversion (default rate: 5.4)
- Region colors: São Paulo (yellow #FBBF24), Minas Gerais (green #166534), Goiás (blue #1E40AF), Santa Catarina (orange #F97316)

### Database Setup
1. Set `DATABASE_URL` in `.env` to your MySQL connection string
2. Run `npx prisma migrate dev` to create tables
3. Run `npm run db:seed` to populate initial data (regions, categories, calendar days)
