import { AnalyticsData } from '../types/analytics';

// Fonction pour générer des données aléatoires réalistes
const generateRandomData = (): AnalyticsData => {
  // Compagnies de transport simulées
  const companies = [
    { id: '1', name: 'Transport Express Dakar' },
    { id: '2', name: 'Sénégal Tours' },
    { id: '3', name: 'Africa Trans' },
    { id: '4', name: 'Sahel Voyages' },
    { id: '5', name: 'Littoral Transport' },
  ];

  // Routes populaires
  const routes = [
    { departure: 'Dakar', arrival: 'Saint-Louis' },
    { departure: 'Dakar', arrival: 'Thiès' },
    { departure: 'Saint-Louis', arrival: 'Touba' },
    { departure: 'Dakar', arrival: 'Kaolack' },
    { departure: 'Thiès', arrival: 'Mbour' },
  ];

  // Générer des données de réservation réalistes
  const total = 1250;
  const completed = Math.floor(total * 0.78); // 78% de complétion
  const cancelled = Math.floor(total * 0.12); // 12% d'annulation
  const pending = total - completed - cancelled;
  const baseRevenue = 45000;

  // Calcul des commissions (15% du revenu total)
  const commissionPercentage = 15;
  const commissionAmount = Math.floor(baseRevenue * 30 * (commissionPercentage / 100));
  const averageCommissionPerBooking = Math.floor(commissionAmount / completed);

  // Générer des revenus avec variation réaliste
  const revenueOverTime = Array.from({ length: 30 }, (_, i) => {
    const weekday = i % 7;
    const weekendMultiplier = weekday === 5 || weekday === 6 ? 1.3 : 1;
    const randomVariation = 0.8 + Math.random() * 0.4; // Variation de ±20%
    return {
      date: new Date(2025, 1, i + 1).toISOString().split('T')[0],
      amount: Math.floor(baseRevenue * weekendMultiplier * randomVariation),
    };
  });

  // Générer des performances de compagnies réalistes
  const topCompanies = companies.map(company => ({
    companyId: company.id,
    companyName: company.name,
    totalBookings: Math.floor(200 + Math.random() * 300),
    revenue: Math.floor(10000 + Math.random() * 20000),
    rating: 3.5 + Math.random() * 1.5,
    completionRate: 0.85 + Math.random() * 0.1,
    cancellationRate: Math.random() * 0.15,
  }));

  // Générer des données de routes populaires
  const popularRoutes = routes.map(route => ({
    departureCity: route.departure,
    arrivalCity: route.arrival,
    totalTrips: Math.floor(100 + Math.random() * 400),
    averagePrice: Math.floor(3000 + Math.random() * 4000),
    popularity: 0.1 + Math.random() * 0.3,
  }));

  // Segments clients
  const customerSegments = [
    {
      segment: 'Voyageurs Réguliers',
      count: Math.floor(total * 0.4),
      percentageOfTotal: 0.4,
      averageBookingValue: 4500,
      bookingFrequency: 2.5,
    },
    {
      segment: 'Occasionnels',
      count: Math.floor(total * 0.3),
      percentageOfTotal: 0.3,
      averageBookingValue: 3800,
      bookingFrequency: 1.2,
    },
    {
      segment: 'Professionnels',
      count: Math.floor(total * 0.2),
      percentageOfTotal: 0.2,
      averageBookingValue: 5200,
      bookingFrequency: 3.8,
    },
    {
      segment: 'Groupes',
      count: Math.floor(total * 0.1),
      percentageOfTotal: 0.1,
      averageBookingValue: 8500,
      bookingFrequency: 0.5,
    },
  ];

  // Distribution des réservations par jour
  const bookingsByDay = [
    { day: 'Lun', count: 180 },
    { day: 'Mar', count: 150 },
    { day: 'Mer', count: 160 },
    { day: 'Jeu', count: 170 },
    { day: 'Ven', count: 220 },
    { day: 'Sam', count: 250 },
    { day: 'Dim', count: 120 },
  ];

  // Distribution des réservations par heure
  const bookingsByHour = Array.from({ length: 24 }, (_, hour) => {
    let baseCount = 20;
    // Plus de réservations pendant les heures de pointe
    if (hour >= 6 && hour <= 9) baseCount = 45;
    if (hour >= 16 && hour <= 19) baseCount = 40;
    // Moins de réservations la nuit
    if (hour >= 0 && hour <= 5) baseCount = 5;
    return {
      hour,
      count: Math.floor(baseCount + (Math.random() * baseCount * 0.3)),
    };
  });

  return {
    timeRange: '30 jours',
    bookingStats: {
      total,
      completed,
      cancelled,
      pending,
      revenue: baseRevenue * 30,
      averagePrice: Math.floor(baseRevenue / total * 30),
      commission: {
        percentage: commissionPercentage,
        totalAmount: commissionAmount,
        averagePerBooking: averageCommissionPerBooking,
      }
    },
    revenueOverTime,
    topCompanies,
    popularRoutes,
    customerSegments,
    bookingsByDay,
    bookingsByHour,
  };
};

// Exporter les données mockées
export const mockAnalyticsData = generateRandomData();

// Fonction pour obtenir des données filtrées par période
export const getAnalyticsDataByRange = (days: number): AnalyticsData => {
  const data = generateRandomData();
  return {
    ...data,
    timeRange: `${days} jours`,
    revenueOverTime: data.revenueOverTime.slice(0, days),
    bookingStats: {
      ...data.bookingStats,
      total: Math.floor(data.bookingStats.total * (days / 30)),
      completed: Math.floor(data.bookingStats.completed * (days / 30)),
      cancelled: Math.floor(data.bookingStats.cancelled * (days / 30)),
      pending: Math.floor(data.bookingStats.pending * (days / 30)),
      revenue: Math.floor(data.bookingStats.revenue * (days / 30)),
      commission: {
        percentage: data.bookingStats.commission.percentage,
        totalAmount: Math.floor(data.bookingStats.commission.totalAmount * (days / 30)),
        averagePerBooking: Math.floor(data.bookingStats.commission.averagePerBooking * (days / 30)),
      }
    },
  };
};
