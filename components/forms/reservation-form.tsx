'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, Clock, Users } from 'lucide-react';

interface ReservationFormProps {
  onSubmit?: (data: ReservationFormData) => void | Promise<void> | Promise<{ success: boolean; error?: string }>;
  className?: string;
}

export interface ReservationFormData {
  name: string;
  email: string;
  phone: string;
  bookingType: string;
  date: string;
  time: string;
  guests: string;
  message: string;
}

export function ReservationForm({ onSubmit, className }: ReservationFormProps) {
  const [formData, setFormData] = useState<ReservationFormData>({
    name: '',
    email: '',
    phone: '',
    bookingType: 'alacarte',
    date: '',
    time: '',
    guests: '2',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>(
    'idle'
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      if (onSubmit) {
        const result = await onSubmit(formData) as any;
        if (result && typeof result === 'object' && 'success' in result && !result.success) {
          throw new Error(result.error || 'Submission failed');
        }
      } else {
        // Default behavior: log to console (can be replaced with API call)
        console.log('Reservation form submitted:', formData);
      }
      setSubmitStatus('success');
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        bookingType: 'alacarte',
        date: '',
        time: '',
        guests: '2',
        message: '',
      });
    } catch (error) {
      console.error('Error submitting reservation:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate time slots
  const timeSlots = [];
  for (let hour = 11; hour <= 22; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeSlots.push(time);
    }
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="space-y-6">
        {/* Personal Information */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="john@example.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">
            Phone Number <span className="text-destructive">*</span>
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="+46 70 123 4567"
          />
        </div>

        {/* Booking Type */}
        <div className="space-y-2">
          <Label htmlFor="bookingType">
            Booking Type <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.bookingType}
            onValueChange={(value) => handleSelectChange('bookingType', value)}
            required
          >
            <SelectTrigger id="bookingType">
              <SelectValue placeholder="Select booking type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alacarte">À la carte</SelectItem>
              <SelectItem value="lunch-buffet">Lunch Buffet (Mon-Fri 11:00 - 14:00)</SelectItem>
              <SelectItem value="weekend-brunch">Weekend Brunch (Sat-Sun 10:00 - 14:00)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {formData.bookingType === 'lunch-buffet' && 'Available Monday to Friday only, 11:00 - 14:00. Closed weekends.'}
            {formData.bookingType === 'weekend-brunch' && 'Available Saturday and Sunday only, 10:00 - 14:00'}
            {formData.bookingType === 'alacarte' && 'Full menu available during restaurant hours'}
          </p>
        </div>

        {/* Reservation Details */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="date">
              Date <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
                min={today}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">
              Time <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.time}
              onValueChange={(value) => handleSelectChange('time', value)}
              required
            >
              <SelectTrigger id="time" className="pl-10">
                <Clock className="absolute left-3 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="guests">
              Guests <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.guests}
              onValueChange={(value) => handleSelectChange('guests', value)}
              required
            >
              <SelectTrigger id="guests" className="pl-10">
                <Users className="absolute left-3 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Number of guests" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? 'Guest' : 'Guests'}
                  </SelectItem>
                ))}
                <SelectItem value="10+">10+ Guests</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Personal Message */}
        <div className="space-y-2">
          <Label htmlFor="message">Personal Message (Optional)</Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Any dietary restrictions, special occasions, or seating preferences..."
            rows={4}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Reserve Table'}
        </Button>

        {/* Status Messages */}
        {submitStatus === 'success' && (
          <div className="rounded-lg bg-green-50 p-4 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400">
            Thank you! Your reservation request has been submitted. We&apos;ll contact
            you shortly to confirm.
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
            Sorry, there was an error submitting your reservation. Please try
            again or call us directly.
          </div>
        )}
      </div>
    </form>
  );
}
