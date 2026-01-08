import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for feedback (in production, use a database)
const feedbackStore: Map<string, { likes: number; dislikes: number }> = new Map();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { productId, currentProductId, feedback } = body;

        if (!productId || !feedback) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Create a key for the recommendation pair
        const key = currentProductId
            ? `${currentProductId}-${productId}`
            : `general-${productId}`;

        // Get or create feedback entry
        const current = feedbackStore.get(key) || { likes: 0, dislikes: 0 };

        // Update feedback
        if (feedback === 'like') {
            current.likes += 1;
        } else if (feedback === 'dislike') {
            current.dislikes += 1;
        }

        feedbackStore.set(key, current);

        // Log for analytics (in production, send to analytics service)
        console.log(`Recommendation feedback: ${key} - ${feedback}`, current);

        return NextResponse.json({
            success: true,
            feedback: current,
        });
    } catch (error) {
        console.error('Feedback API error:', error);
        return NextResponse.json({ error: 'Failed to process feedback' }, { status: 500 });
    }
}

// Optional: GET endpoint to retrieve feedback stats
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get('productId');

    if (!productId) {
        // Return all feedback
        const allFeedback = Array.from(feedbackStore.entries()).map(([key, value]) => ({
            key,
            ...value,
        }));
        return NextResponse.json({ feedback: allFeedback });
    }

    // Return feedback for specific product
    const feedback: Array<{ key: string; likes: number; dislikes: number }> = [];
    feedbackStore.forEach((value, key) => {
        if (key.includes(productId)) {
            feedback.push({ key, ...value });
        }
    });

    return NextResponse.json({ feedback });
}
