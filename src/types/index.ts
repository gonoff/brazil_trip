// Region types
export interface Region {
  id: number;
  name: string;
  code: string;
  colorHex: string;
  createdAt: Date;
}

// Calendar day types
export interface CalendarDay {
  id: number;
  date: Date;
  regionId: number | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  region?: Region | null;
  events?: Event[];
  eventsCount?: number;
}

// Flight types
export interface Flight {
  id: number;
  airline: string;
  flightNumber: string;
  departureCity: string;
  arrivalCity: string;
  departureDatetime: Date;
  arrivalDatetime: Date;
  confirmationNumber: string | null;
  price: number | null;
  currency: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface FlightFormData {
  airline: string;
  flightNumber: string;
  departureCity: string;
  arrivalCity: string;
  departureDatetime: string;
  arrivalDatetime: string;
  confirmationNumber?: string;
  price?: number;
  currency?: string;
  notes?: string;
}

// Hotel types
export interface Hotel {
  id: number;
  name: string;
  address: string | null;
  city: string | null;
  regionId: number | null;
  checkInDate: Date;
  checkOutDate: Date;
  confirmationNumber: string | null;
  pricePerNight: number | null;
  totalCost: number | null;
  currency: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  region?: Region | null;
}

export interface HotelFormData {
  name: string;
  address?: string;
  city?: string;
  regionId?: number;
  checkInDate: string;
  checkOutDate: string;
  confirmationNumber?: string;
  pricePerNight?: number;
  totalCost?: number;
  currency?: string;
  notes?: string;
}

// Expense category types
export interface ExpenseCategory {
  id: number;
  name: string;
  icon: string | null;
  colorHex: string | null;
  budgetLimit: number | null;
  warningThresholdPercent: number;
  createdAt: Date;
  spent?: number;
}

// Expense types
export interface Expense {
  id: number;
  date: Date;
  amountBrl: number;
  categoryId: number;
  description: string | null;
  calendarDayId: number | null;
  createdAt: Date;
  updatedAt: Date;
  category?: ExpenseCategory;
  calendarDay?: CalendarDay;
}

export interface ExpenseFormData {
  date: string;
  amountBrl: number;
  categoryId: number;
  description?: string;
  calendarDayId?: number;
}

// Event types
export interface Event {
  id: number;
  calendarDayId: number;
  title: string;
  description: string | null;
  startTime: string | null;
  endTime: string | null;
  location: string | null;
  category: string | null;
  createdAt: Date;
  updatedAt: Date;
  calendarDay?: CalendarDay;
}

export interface EventFormData {
  calendarDayId: number;
  title: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  category?: string;
}

// App settings types
export interface AppSettings {
  id: number;
  exchangeRate: number;
  totalBudgetBrl: number | null;
  updatedAt: Date;
}

// Dashboard types
export interface DashboardStats {
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
  exchangeRate: number;
  daysUntilTrip: number;
  totalDays: number;
  flightsCount: number;
  hotelsCount: number;
  eventsCount: number;
  expensesByCategory: Array<{
    category: ExpenseCategory;
    spent: number;
    percentage: number;
  }>;
  regionDays: Array<{
    region: Region;
    days: number;
    percentage: number;
  }>;
  upcomingEvents: Event[];
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
