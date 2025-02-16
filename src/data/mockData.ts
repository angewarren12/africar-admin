import { User, Station, Driver, Trip, Complaint, Transaction } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@africar.com',
    role: 'admin',
    status: 'active',
    createdAt: '2025-01-01',
  },
  // Add more mock users...
];

export const mockStations: Station[] = [
  {
    id: '1',
    name: 'Gare Centrale Dakar',
    location: 'Dakar, Sénégal',
    contact: '+221 77 000 0000',
    status: 'active',
    documents: ['license.pdf', 'permit.pdf'],
    createdAt: '2025-01-01',
  },
  // Add more mock stations...
];

export const mockDrivers: Driver[] = [
  {
    id: '1',
    name: 'John Doe',
    contact: '+221 77 111 1111',
    licenseNumber: 'DL123456',
    status: 'active',
    documents: ['license.pdf', 'id.pdf'],
    assignedStation: '1',
    createdAt: '2025-01-01',
  },
  // Add more mock drivers...
];

export const mockTrips: Trip[] = [
  {
    id: '1',
    stationId: '1',
    driverId: '1',
    route: 'Dakar - Saint-Louis',
    departureTime: '2025-02-06T08:00:00Z',
    arrivalTime: '2025-02-06T11:00:00Z',
    status: 'scheduled',
    price: 5000,
    ticketsSold: 25,
  },
  // Add more mock trips...
];

export const mockComplaints: Complaint[] = [
  {
    id: '1',
    userId: '1',
    type: 'delay',
    description: 'Bus arrived 30 minutes late',
    status: 'pending',
    createdAt: '2025-02-06T09:00:00Z',
  },
  // Add more mock complaints...
];

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    userId: '1',
    tripId: '1',
    amount: 5000,
    paymentMethod: 'mobile_money',
    status: 'completed',
    createdAt: '2025-02-06T07:30:00Z',
  },
  // Add more mock transactions...
];
