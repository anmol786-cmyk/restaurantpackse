'use client';

import { FeedbackForm } from '@/components/ai/feedback-form';

export default function TestFeedbackPage() {
    return (
        <div className="container mx-auto p-8">
            <h1 className="text-2xl font-bold mb-4">Feedback Form Test</h1>
            <div className="max-w-2xl mx-auto border rounded-lg p-4">
                <FeedbackForm
                    onClose={() => console.log('Close clicked')}
                    onSuccess={() => console.log('Success!')}
                />
            </div>
        </div>
    );
}
