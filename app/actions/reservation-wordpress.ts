'use server';

import { ReservationFormData } from '@/components/forms/reservation-form';

/**
 * Submit reservation via WordPress REST API
 * This saves the reservation as a WordPress post instead of sending email
 */
export async function submitReservation(data: ReservationFormData) {
    try {
        const { name, email, phone, bookingType, date, time, guests, message } = data;

        const wordpressUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;

        if (!wordpressUrl) {
            console.error('WordPress URL is not configured');
            return { success: false, error: 'Server configuration error' };
        }

        // Create a post in WordPress using Contact Form 7 or custom endpoint
        // Option 1: If you have Contact Form 7 installed
        const response = await fetch(`${wordpressUrl}/wp-json/contact-form-7/v1/contact-forms/YOUR_FORM_ID/feedback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'your-name': name,
                'your-email': email,
                'your-phone': phone,
                'booking-type': bookingType,
                'reservation-date': date,
                'reservation-time': time,
                'number-of-guests': guests,
                'your-message': message,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to submit reservation');
        }

        return { success: true };
    } catch (error) {
        console.error('Reservation submission error:', error);
        return { success: false, error: 'Failed to submit reservation' };
    }
}
