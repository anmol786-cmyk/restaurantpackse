'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Star, Send, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FeedbackFormProps {
    onClose: () => void;
    onSuccess?: () => void;
}

export function FeedbackForm({ onClose, onSuccess }: FeedbackFormProps) {
    const [feedbackType, setFeedbackType] = useState<string>('');
    const [rating, setRating] = useState<number>(0);
    const [hoveredRating, setHoveredRating] = useState<number>(0);
    const [message, setMessage] = useState('');
    const [contact, setContact] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!feedbackType || !message) {
            alert('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: feedbackType,
                    rating,
                    message,
                    contact: contact || 'Anonymous',
                    page: window.location.pathname,
                    timestamp: new Date().toISOString(),
                }),
            });

            if (response.ok) {
                setIsSubmitted(true);
                if (onSuccess) {
                    onSuccess();
                }
                setTimeout(() => {
                    onClose();
                }, 2000);
            } else {
                throw new Error('Failed to submit feedback');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('Failed to submit feedback. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center justify-center p-8 text-center"
            >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                    <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Thank You!</h3>
                <p className="text-sm text-muted-foreground">
                    Your feedback has been submitted successfully.
                </p>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
            <div>
                <h3 className="mb-4 text-lg font-semibold">We Value Your Feedback</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Help us improve by sharing your thoughts about our food, service, or website.
                </p>
            </div>

            {/* Feedback Type */}
            <div className="space-y-2">
                <Label htmlFor="feedback-type">
                    What is your feedback about? <span className="text-red-500">*</span>
                </Label>
                <Select value={feedbackType} onValueChange={setFeedbackType}>
                    <SelectTrigger id="feedback-type">
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="food">Food Quality</SelectItem>
                        <SelectItem value="service">Service</SelectItem>
                        <SelectItem value="website">Website Issue</SelectItem>
                        <SelectItem value="general">General Feedback</SelectItem>
                        <SelectItem value="suggestion">Suggestion</SelectItem>
                        <SelectItem value="complaint">Complaint</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Rating */}
            {(feedbackType === 'food' || feedbackType === 'service') && (
                <div className="space-y-2">
                    <Label>Rating</Label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(0)}
                                className="transition-transform hover:scale-110"
                            >
                                <Star
                                    className={cn(
                                        'h-8 w-8 transition-colors',
                                        (hoveredRating || rating) >= star
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-gray-300 dark:text-gray-600'
                                    )}
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Message */}
            <div className="space-y-2">
                <Label htmlFor="message">
                    Your Message <span className="text-red-500">*</span>
                </Label>
                <Textarea
                    id="message"
                    placeholder="Tell us about your experience..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    required
                />
            </div>

            {/* Contact (Optional) */}
            <div className="space-y-2">
                <Label htmlFor="contact">
                    Contact Info <span className="text-xs text-muted-foreground">(Optional)</span>
                </Label>
                <Input
                    id="contact"
                    type="text"
                    placeholder="Email or phone number"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                    Leave your contact if you'd like us to follow up
                </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    className="flex-1"
                    disabled={isSubmitting || !feedbackType || !message}
                >
                    {isSubmitting ? (
                        <>
                            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Submitting...
                        </>
                    ) : (
                        <>
                            <Send className="mr-2 h-4 w-4" />
                            Submit Feedback
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
