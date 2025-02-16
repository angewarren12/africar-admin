export type StaffRole = 'admin' | 'driver' | 'cashier' | 'ticketController';

export interface License {
  number: string;
  expiryDate: string;
}

export interface DriverStats {
  totalTrips: number;
  totalHours: number;
  totalDistance: number;
  totalPassengers: number;
  rating: number;
  completedTripsLastMonth: number;
  hoursLastMonth: number;
  performanceScore: number;
  accidents: number;
  incidents: number;
  bonusPoints: number;
  fuelEfficiencyScore: number;
  maintenanceScore: number;
  customerFeedback: {
    positive: number;
    negative: number;
    comments: Array<{
      date: string;
      comment: string;
      rating: number;
    }>;
  };
}

export interface StaffMember {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: StaffRole;
  stationId?: number;
  status: 'active' | 'inactive' | 'onLeave';
  joinDate: string;
  address: string;
  city: string;
  // Champs spécifiques aux chauffeurs
  license?: License;
  vehicleTypes?: string[];
  driverStats?: DriverStats;
  preferredVehicleIds?: number[];
  assignedVehicleId?: number;
  specializations?: string[]; // ex: ["longDistance", "nightShift", "vip"]
  certifications?: {
    firstAid: {
      obtained: boolean;
      expiryDate?: string;
    };
    safety: {
      obtained: boolean;
      expiryDate?: string;
    };
    defensiveDriving?: {
      obtained: boolean;
      expiryDate?: string;
    };
    hazardousGoods?: {
      obtained: boolean;
      expiryDate?: string;
    };
  };
  // Champs spécifiques aux agents
  canProcessPayments?: boolean;
  canScanTickets?: boolean;
  canValidateManually?: boolean;
}
