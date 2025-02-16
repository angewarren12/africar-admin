export interface RevenueData {
  date: string;
  amount: number;
  companyId?: string;
}

export interface BookingStats {
  total: number;
  completed: number;
  cancelled: number;
  pending: number;
  revenue: number;
  averagePrice: number;
  commission: {
    percentage: number;
    totalAmount: number;
    averagePerBooking: number;
  };
}

export interface CompanyPerformance {
  companyId: string;
  companyName: string;
  totalBookings: number;
  revenue: number;
  rating: number;
  completionRate: number;
  cancellationRate: number;
}

export interface RouteAnalytics {
  departureCity: string;
  arrivalCity: string;
  totalTrips: number;
  averagePrice: number;
  popularity: number; // percentage of total bookings
}

export interface CustomerSegment {
  segment: string;
  count: number;
  percentageOfTotal: number;
  averageBookingValue: number;
  bookingFrequency: number;
}

export interface AnalyticsData {
  timeRange: string;
  bookingStats: BookingStats;
  revenueOverTime: RevenueData[];
  topCompanies: CompanyPerformance[];
  popularRoutes: RouteAnalytics[];
  customerSegments: CustomerSegment[];
  bookingsByHour: { hour: number; count: number }[];
  bookingsByDay: { day: string; count: number }[];
}
