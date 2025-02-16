import api from './api';

export interface Booking {
    booking_id: number;
    customer_id: number;
    trip_id: number;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    seats_booked: number;
    total_amount: number;
    passenger_info: any;
    created_at: string;
    updated_at: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    departure_city: string;
    departure_address: string;
    arrival_city: string;
    arrival_address: string;
    departure_time: string;
    arrival_time: string;
    price: number;
    trip_status: string;
    registration_number?: string;
    model?: string;
    brand?: string;
    distance: number;
    duration: number;
}

interface ApiResponse<T> {
    status: 'success' | 'error';
    data: T;
    message?: string;
    error?: string;
}

export const bookingService = {
    getAllBookings: async (): Promise<Booking[]> => {
        const response = await api.get<ApiResponse<Booking[]>>('/bookings');
        return response.data.data;
    },

    getBookingById: async (id: number): Promise<Booking> => {
        const response = await api.get<ApiResponse<Booking>>(`/bookings/${id}`);
        return response.data.data;
    },

    updateBookingStatus: async (id: number, status: Booking['status']): Promise<Booking> => {
        const response = await api.patch<ApiResponse<Booking>>(`/bookings/${id}/status`, { status });
        return response.data.data;
    }
};

export default bookingService;
