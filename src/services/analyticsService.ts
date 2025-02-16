import pool from '../config/database';
import { AnalyticsData, BookingStats, CompanyPerformance, RouteAnalytics } from '../types/analytics';

export const analyticsService = {
  async getBookingStats(startDate: string, endDate: string): Promise<BookingStats> {
    const [rows] = await pool.execute(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(total_price) as revenue,
        AVG(total_price) as averagePrice,
        SUM(commission_amount) as totalCommission,
        AVG(commission_amount) as averageCommission
      FROM bookings
      WHERE booking_date BETWEEN ? AND ?
    `, [startDate, endDate]);

    const stats = rows[0] as any;
    return {
      total: stats.total || 0,
      completed: stats.completed || 0,
      cancelled: stats.cancelled || 0,
      pending: stats.pending || 0,
      revenue: stats.revenue || 0,
      averagePrice: stats.averagePrice || 0,
      commission: {
        percentage: 15,
        totalAmount: stats.totalCommission || 0,
        averagePerBooking: stats.averageCommission || 0,
      }
    };
  },

  async getRevenueOverTime(startDate: string, endDate: string) {
    const [rows] = await pool.execute(`
      SELECT 
        DATE(booking_date) as date,
        SUM(total_price) as amount
      FROM bookings
      WHERE booking_date BETWEEN ? AND ?
      GROUP BY DATE(booking_date)
      ORDER BY date
    `, [startDate, endDate]);

    return rows as { date: string; amount: number }[];
  },

  async getTopCompanies(): Promise<CompanyPerformance[]> {
    const [rows] = await pool.execute(`
      SELECT 
        c.id as companyId,
        c.name as companyName,
        COUNT(b.id) as totalBookings,
        SUM(b.total_price) as revenue,
        AVG(r.rating) as rating,
        COUNT(CASE WHEN b.status = 'completed' THEN 1 END) / COUNT(*) as completionRate,
        COUNT(CASE WHEN b.status = 'cancelled' THEN 1 END) / COUNT(*) as cancellationRate
      FROM companies c
      LEFT JOIN routes rt ON rt.company_id = c.id
      LEFT JOIN bookings b ON b.route_id = rt.id
      LEFT JOIN reviews r ON r.booking_id = b.id
      GROUP BY c.id
      ORDER BY revenue DESC
      LIMIT 5
    `);

    return rows as CompanyPerformance[];
  },

  async getPopularRoutes(): Promise<RouteAnalytics[]> {
    const [rows] = await pool.execute(`
      SELECT 
        s1.city as departureCity,
        s2.city as arrivalCity,
        COUNT(b.id) as totalTrips,
        AVG(b.total_price) as averagePrice,
        COUNT(b.id) / (SELECT COUNT(*) FROM bookings) as popularity
      FROM routes r
      JOIN stations s1 ON r.departure_station_id = s1.id
      JOIN stations s2 ON r.arrival_station_id = s2.id
      JOIN bookings b ON b.route_id = r.id
      GROUP BY r.id
      ORDER BY totalTrips DESC
      LIMIT 5
    `);

    return rows as RouteAnalytics[];
  },

  async getBookingsByDay(): Promise<{ day: string; count: number }[]> {
    const [rows] = await pool.execute(`
      SELECT 
        DAYNAME(booking_date) as day,
        COUNT(*) as count
      FROM bookings
      GROUP BY DAYNAME(booking_date)
      ORDER BY FIELD(DAYNAME(booking_date), 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')
    `);

    return rows as { day: string; count: number }[];
  },

  async getAnalyticsData(days: number = 30): Promise<AnalyticsData> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [
      bookingStats,
      revenueOverTime,
      topCompanies,
      popularRoutes,
      bookingsByDay
    ] = await Promise.all([
      this.getBookingStats(startDate.toISOString(), endDate.toISOString()),
      this.getRevenueOverTime(startDate.toISOString(), endDate.toISOString()),
      this.getTopCompanies(),
      this.getPopularRoutes(),
      this.getBookingsByDay()
    ]);

    return {
      timeRange: `${days} jours`,
      bookingStats,
      revenueOverTime,
      topCompanies,
      popularRoutes,
      customerSegments: [], // À implémenter si nécessaire
      bookingsByDay,
      bookingsByHour: [] // À implémenter si nécessaire
    };
  }
};
