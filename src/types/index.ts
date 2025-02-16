export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  status: 'active' | 'suspended';
  totalBookings: number;
  totalSpent: number;
  loyaltyPoints: number;
  createdAt: string;
}

export interface Station {
  id: string;
  name: string;
  location: {
    city: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  manager: {
    name: string;
    phone: string;
    email: string;
  };
  paymentMethods: string[];
  logo?: string;
  status: 'active' | 'pending' | 'suspended';
  isPremium: boolean;
  createdAt: string;
}

export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  licenseNumber: string;
  status: 'active' | 'pending' | 'suspended';
  station: string;
  rating: number;
  totalTrips: number;
  currentTrip?: Trip;
  documents: {
    idCard: string;
    drivingLicense: string;
  };
}

export interface Trip {
  id: string;
  departureStation: string;
  arrivalStation: string;
  departureTime: string;
  estimatedArrivalTime: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  driver: string;
  vehicle: string;
  totalSeats: number;
  availableSeats: number;
  price: number;
  bookings: Booking[];
  currentLocation?: {
    lat: number;
    lng: number;
  };
}

export interface Booking {
  id: string;
  tripId: string;
  userId: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  seatNumber: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentMethod: string;
  amount: number;
  createdAt: string;
}

export interface Complaint {
  id: string;
  type: 'delay' | 'refund' | 'driver' | 'station' | 'other';
  status: 'pending' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  subject: string;
  description: string;
  userId: string;
  tripId?: string;
  stationId?: string;
  driverId?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate: string;
  endDate: string;
  applicableStations: string[];
  minimumAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usageCount: number;
  status: 'active' | 'scheduled' | 'expired';
}

export interface DashboardStats {
  totalBookingsToday: number;
  totalRevenueToday: number;
  activeTrips: number;
  activeDrivers: number;
  activeStations: number;
  pendingComplaints: number;
  revenueGraph: {
    date: string;
    amount: number;
  }[];
  popularRoutes: {
    departure: string;
    arrival: string;
    bookings: number;
  }[];
}

export interface TransportCompany {
  id: number;
  name: string;
  logo: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
  createdAt: string;
  stats: {
    totalStations: number;
    totalDrivers: number;
    totalTrips: number;
    totalRevenue: number;
    activeTrips: number;
  };
  documents: {
    type: string;
    status: 'verified' | 'pending' | 'rejected';
    url: string;
  }[];
  rating: number;
  fleetSize: number;
}
