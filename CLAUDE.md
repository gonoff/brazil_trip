# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Brazil Trip Planner - A Progressive Web App (PWA) built with Next.js for planning a trip to Brazil (January 6 - February 3, 2026, 29 days). Features include:

### Core Features
- **Calendar**: 29-day calendar with color-coded regions (São Paulo, Minas Gerais, Goiás, Santa Catarina), flight/hotel icons
- **Flights**: Track flight bookings with details (shows departure/arrival icons on calendar)
- **Hotels**: Manage accommodation reservations with auto-calculated total cost (shows hotel icons on calendar)
- **Expenses**: Track spending with daily per-person budget limits, warnings, daily spending tracker, and analytics charts
- **Events**: Schedule activities for specific days (event count badges on calendar)
- **Dashboard**: Overview of trip status, budget, travel timeline, and upcoming events

### Enhanced Features
- **PWA Support**: Installable app with offline capability, service worker caching
- **Dark Mode**: Theme toggle with system preference detection, persisted to localStorage
- **Global Search**: Command palette (Cmd/Ctrl+K) to search flights, hotels, events, expenses
- **Currency Converter**: Quick BRL ↔ USD conversion widget
- **Trip Countdown**: Live countdown timer to trip start date
- **Expense Analytics**: Pie charts, bar charts, and cumulative spending line charts
- **Quick Expense FAB**: Floating action button for rapid expense entry
- **Travel Timeline**: Chronological view of flights and hotel check-ins/check-outs
- **Push Notifications**: Optional reminders for upcoming events (requires user permission)

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
- **shadcn/ui** components (customized with app-like styling)
- **TanStack React Query** for data fetching
- **React Hook Form** + **Zod** for form validation
- **date-fns** for date manipulation
- **Recharts** for expense analytics charts
- **cmdk** for command palette search
- **next-pwa** for Progressive Web App support

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
│   ├── ui/                # shadcn/ui components (customized)
│   ├── layout/            # Header, navigation, mobile bottom nav
│   ├── calendar/          # Calendar components
│   ├── flights/           # Flight components
│   ├── hotels/            # Hotel components
│   ├── expenses/          # Expense components + analytics
│   ├── events/            # Event components
│   ├── dashboard/         # Dashboard components
│   └── widgets/           # Reusable widgets (countdown, currency converter, search, FAB)
├── contexts/              # React contexts (theme)
├── hooks/                 # React Query hooks for data fetching + useSearch
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

### Data Flow
1. **Frontend**: React components use custom hooks from `src/hooks/`
2. **Hooks**: TanStack Query hooks fetch from `/api/*` routes, handle caching (1min stale time)
3. **API Routes**: Next.js route handlers in `src/app/api/` perform CRUD via Prisma
4. **Database**: Prisma ORM connects to MySQL, schema in `prisma/schema.prisma`

### Database Models
- **Region**: Lookup table for 4 Brazilian regions (seeded)
- **CalendarDay**: 29 trip days, optionally linked to a region
- **Flight/Hotel**: Booking records with dates, prices, confirmation numbers
- **ExpenseCategory**: Categories with daily per-person budgets (USD) and warning thresholds
- **Expense**: Individual expenses linked to category and optionally to a calendar day
- **Event**: Activities scheduled for specific calendar days
- **AppSettings**: Singleton for exchange rate, total budget, and number of travelers

### Database Setup
1. Set `DATABASE_URL` in `.env` to your MySQL connection string
2. Run `npx prisma migrate dev` to create tables
3. Run `npm run db:seed` to populate initial data (regions, categories, calendar days)

## Development Environment Notes

This project is developed on a Steam Deck with the following setup:

- **MySQL**: LAMPP/XAMPP at `/opt/lampp/`
  - MySQL upgrade: `/opt/lampp/bin/mysql_upgrade`
  - Config: `/opt/lampp/etc/my.cnf`
- **VS Code**: Running as flatpak - system commands require `flatpak-spawn --host`
- **MySQL CLI**: Not in PATH. Use Node.js with `mysql2` package for database operations, or access via phpMyAdmin
- **Database creation**: Use Node.js script since `mysql` CLI unavailable:
  ```javascript
  node -e "const mysql = require('mysql2/promise'); (async () => { const conn = await mysql.createConnection({host: 'localhost', user: 'root'}); await conn.query('CREATE DATABASE IF NOT EXISTS brazil_trip'); await conn.end(); })();"
  ```

## Deployment

This app will be deployed on **Hostinger VPS** with MySQL.

### Production Build
```bash
npm run build      # Creates optimized production build
npm run start      # Starts production server on port 3000
```

### Environment Variables (Production)
```env
DATABASE_URL="mysql://user:password@localhost:3306/brazil_trip"
NODE_ENV="production"
```

### PWA Assets
- `public/manifest.json` - PWA manifest with app name, icons, theme colors
- `public/icons/` - App icons (192x192, 512x512)
- Service worker auto-generated by next-pwa in production build

### Hostinger VPS Setup
1. Install Node.js 20+ and MySQL
2. Clone repository and run `npm install`
3. Set up `.env` with production DATABASE_URL
4. Run `npx prisma migrate deploy` (production migrations)
5. Run `npm run db:seed` to populate initial data
6. Build with `npm run build`
7. Use PM2 or systemd to run `npm start` as a service
8. Configure Nginx as reverse proxy (optional, for SSL/domain)

## Important Technical Notes

### Timezone Handling
- **DATE fields** (calendar days, hotel check-in/out, expense dates): Stored as UTC midnight. Use `formatUTCDate()` from `@/lib/utils` to display correctly without timezone shift.
- **DATETIME fields** (flight departure/arrival): Stored with time, use regular `format()` from date-fns.
- The `formatUTCDate()` utility creates a local Date from UTC components to prevent dates appearing off by one day.

### Budget System
- Daily budgets are set per-person in USD
- Daily limit calculation: `dailyBudgetPerPerson × exchangeRate × numberOfTravelers`
- Total budget is set separately in AppSettings (not calculated from daily budgets)

### Form Edit Pattern
- React Hook Form's `defaultValues` are only read on mount
- All edit forms use `useEffect` with `reset()` to update when the entity prop changes

### Theme System
- ThemeProvider in `src/contexts/theme-context.tsx` manages light/dark mode
- Theme persisted to localStorage under key `brazil-trip-theme`
- Applies `dark` class to `<html>` element for Tailwind dark mode
- Components use `dark:` variant classes for dark mode styles

### Search System
- `useSearch` hook in `src/hooks/use-search.ts` provides fuzzy search across all entities
- Uses cmdk library with `shouldFilter={false}` (custom filtering)
- Searches: flights (airline, number, cities), hotels (name, address), events (title, location), expenses (description, category)

### UI Customizations
- Unbounded font for headings (h1-h3, text-3xl/4xl)
- App-like button styling: rounded-xl, h-11, shadows, press feedback
- Mobile-first responsive design with bottom navigation on small screens
