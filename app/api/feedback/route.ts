import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type, rating, message, contact, page, timestamp } = body;

        // Validate required fields
        if (!type || !message) {
            return NextResponse.json(
                { error: 'Type and message are required' },
                { status: 400 }
            );
        }

        // Create feedback object
        const feedback = {
            id: `feedback_${Date.now()}`,
            type, // 'food', 'website', 'service', 'general'
            rating,
            message,
            contact: contact || 'Anonymous',
            page: page || 'Unknown',
            timestamp: timestamp || new Date().toISOString(),
            userAgent: request.headers.get('user-agent'),
            ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        };

        // TODO: Store in database
        // For now, log to console (you can replace this with database storage)
        console.log('=== NEW FEEDBACK RECEIVED ===');
        console.log(JSON.stringify(feedback, null, 2));
        console.log('===========================');

        // TODO: Send email notification
        // You can integrate with services like:
        // - Resend (resend.com)
        // - SendGrid
        // - Nodemailer
        // Example with environment variable:
        // await sendEmailNotification(feedback);

        // For now, we'll save to a JSON file (temporary solution)
        // In production, use a proper database
        try {
            const fs = require('fs');
            const path = require('path');
            const feedbackDir = path.join(process.cwd(), 'data', 'feedback');

            // Create directory if it doesn't exist
            if (!fs.existsSync(feedbackDir)) {
                fs.mkdirSync(feedbackDir, { recursive: true });
            }

            const feedbackFile = path.join(feedbackDir, `${feedback.id}.json`);
            fs.writeFileSync(feedbackFile, JSON.stringify(feedback, null, 2));
        } catch (fileError) {
            console.error('Error saving feedback to file:', fileError);
            // Continue anyway - we've logged it to console
        }

        return NextResponse.json({
            success: true,
            message: 'Thank you for your feedback! We appreciate your input.',
            feedbackId: feedback.id
        });

    } catch (error) {
        console.error('Feedback API error:', error);
        return NextResponse.json(
            { error: 'Failed to submit feedback' },
            { status: 500 }
        );
    }
}

// GET endpoint to retrieve feedback (admin only - add authentication)
export async function GET(request: NextRequest) {
    try {
        // TODO: Add authentication check here
        // const session = await getServerSession();
        // if (!session?.user?.isAdmin) {
        //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        // }

        const fs = require('fs');
        const path = require('path');
        const feedbackDir = path.join(process.cwd(), 'data', 'feedback');

        if (!fs.existsSync(feedbackDir)) {
            return NextResponse.json({ feedback: [] });
        }

        const files = fs.readdirSync(feedbackDir);
        const feedback = files
            .filter((file: string) => file.endsWith('.json'))
            .map((file: string) => {
                const content = fs.readFileSync(path.join(feedbackDir, file), 'utf-8');
                return JSON.parse(content);
            })
            .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        return NextResponse.json({ feedback });

    } catch (error) {
        console.error('Get feedback error:', error);
        return NextResponse.json(
            { error: 'Failed to retrieve feedback' },
            { status: 500 }
        );
    }
}
