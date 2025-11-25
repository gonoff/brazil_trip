// Trip date range
export const TRIP_DATES = {
  start: new Date('2026-01-01'),
  end: new Date('2026-02-07'),
  totalDays: 38,
} as const;

// Default exchange rate (BRL to USD)
export const DEFAULT_EXCHANGE_RATE = 5.4;

// Region definitions with colors
export const REGIONS = {
  'sao-paulo': {
    name: 'São Paulo',
    code: 'sao-paulo',
    colorHex: '#FBBF24',
    colorClass: 'bg-region-sao-paulo',
    textClass: 'text-region-sao-paulo',
    borderClass: 'border-region-sao-paulo',
  },
  'minas-gerais': {
    name: 'Minas Gerais',
    code: 'minas-gerais',
    colorHex: '#166534',
    colorClass: 'bg-region-minas-gerais',
    textClass: 'text-region-minas-gerais',
    borderClass: 'border-region-minas-gerais',
  },
  'goias': {
    name: 'Goiás',
    code: 'goias',
    colorHex: '#1E40AF',
    colorClass: 'bg-region-goias',
    textClass: 'text-region-goias',
    borderClass: 'border-region-goias',
  },
  'santa-catarina': {
    name: 'Santa Catarina',
    code: 'santa-catarina',
    colorHex: '#F97316',
    colorClass: 'bg-region-santa-catarina',
    textClass: 'text-region-santa-catarina',
    borderClass: 'border-region-santa-catarina',
  },
} as const;

export type RegionCode = keyof typeof REGIONS;

// Expense category icons (lucide-react icon names)
export const EXPENSE_CATEGORY_ICONS: Record<string, string> = {
  'Food': 'utensils',
  'Transportation': 'car',
  'Accommodation': 'bed',
  'Activities': 'ticket',
  'Shopping': 'shopping-bag',
  'Other': 'more-horizontal',
};

// Default budget limits per category (in BRL)
export const DEFAULT_BUDGET_LIMITS: Record<string, number> = {
  'Food': 2000,
  'Transportation': 1500,
  'Accommodation': 3000,
  'Activities': 2000,
  'Shopping': 1000,
  'Other': 500,
};

// Navigation links
export const NAV_LINKS = [
  { href: '/', label: 'Dashboard', icon: 'layout-dashboard' },
  { href: '/calendar', label: 'Calendar', icon: 'calendar' },
  { href: '/flights', label: 'Flights', icon: 'plane' },
  { href: '/hotels', label: 'Hotels', icon: 'building-2' },
  { href: '/expenses', label: 'Expenses', icon: 'wallet' },
  { href: '/events', label: 'Events', icon: 'calendar-check' },
] as const;

// Budget status thresholds
export const BUDGET_STATUS = {
  OK: 'ok',
  WARNING: 'warning',
  EXCEEDED: 'exceeded',
} as const;

export type BudgetStatus = typeof BUDGET_STATUS[keyof typeof BUDGET_STATUS];

export function getBudgetStatus(
  spent: number,
  budget: number,
  warningThreshold: number = 80
): BudgetStatus {
  const percentage = (spent / budget) * 100;
  if (percentage >= 100) return BUDGET_STATUS.EXCEEDED;
  if (percentage >= warningThreshold) return BUDGET_STATUS.WARNING;
  return BUDGET_STATUS.OK;
}
