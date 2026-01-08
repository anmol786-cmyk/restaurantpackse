import { fetchFourlinesMCP } from './api';

export interface Reservation {
    id: number;
    status: string;
    name: string;
    email: string;
    phone?: string;
    date: string;
    time: string;
    party_size: number;
    special_requests?: string;
    created_at: string;
}

export interface CreateReservationParams {
    name: string;
    email: string;
    phone?: string;
    date: string;
    time: string;
    party_size: number;
    special_requests?: string;
}

export interface UpdateReservationParams {
    status?: string;
    name?: string;
    email?: string;
    phone?: string;
    date?: string;
    time?: string;
    party_size?: number;
    special_requests?: string;
}

export interface ReservationListResponse {
    items: Reservation[];
    total: number;
}

/**
 * Create a new reservation.
 * This is typically a public endpoint.
 */
export async function createReservation(params: CreateReservationParams): Promise<{ id: number; message: string }> {
    return fetchFourlinesMCP<{ id: number; message: string }>('/reservations', {
        method: 'POST',
        body: JSON.stringify(params),
    });
}

/**
 * List reservations (Admin/Editor only).
 */
export async function listReservations(page = 1, perPage = 20, status = 'any'): Promise<ReservationListResponse> {
    const query = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
        status,
    });
    return fetchFourlinesMCP<ReservationListResponse>(`/reservations?${query.toString()}`);
}

/**
 * Get a single reservation by ID.
 */
export async function getReservation(id: number): Promise<Reservation> {
    return fetchFourlinesMCP<Reservation>(`/reservations/${id}`);
}

/**
 * Update a reservation.
 */
export async function updateReservation(id: number, params: UpdateReservationParams): Promise<{ id: number; updated: boolean }> {
    return fetchFourlinesMCP<{ id: number; updated: boolean }>(`/reservations/${id}`, {
        method: 'PUT',
        body: JSON.stringify(params),
    });
}

/**
 * Delete a reservation.
 */
export async function deleteReservation(id: number): Promise<{ deleted: boolean }> {
    return fetchFourlinesMCP<{ deleted: boolean }>(`/reservations/${id}`, {
        method: 'DELETE',
    });
}
