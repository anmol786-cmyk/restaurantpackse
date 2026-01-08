import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { sessionId, messages, metadata } = body;

        // Validate required fields
        if (!sessionId || !messages || !Array.isArray(messages)) {
            return NextResponse.json(
                { error: 'Session ID and messages array are required' },
                { status: 400 }
            );
        }

        // Create chat log object
        const chatLog = {
            id: `chat_${sessionId}_${Date.now()}`,
            sessionId,
            messages,
            metadata: {
                ...metadata,
                userAgent: request.headers.get('user-agent'),
                ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
                timestamp: new Date().toISOString(),
            },
        };

        // TODO: Store in database
        // For now, log to console (you can replace this with database storage)
        console.log('=== NEW CHAT LOG ===');
        console.log(`Session: ${sessionId}`);
        console.log(`Messages: ${messages.length}`);
        console.log('===================');

        // Save to JSON file (temporary solution)
        // In production, use a proper database
        try {
            const fs = require('fs');
            const path = require('path');
            const chatLogsDir = path.join(process.cwd(), 'data', 'chat-logs');

            // Create directory if it doesn't exist
            if (!fs.existsSync(chatLogsDir)) {
                fs.mkdirSync(chatLogsDir, { recursive: true });
            }

            // Save chat log
            const chatLogFile = path.join(chatLogsDir, `${chatLog.id}.json`);
            fs.writeFileSync(chatLogFile, JSON.stringify(chatLog, null, 2));

            // Also maintain a session history file
            const sessionFile = path.join(chatLogsDir, `session_${sessionId}.json`);
            let sessionHistory = [];

            if (fs.existsSync(sessionFile)) {
                const existingData = fs.readFileSync(sessionFile, 'utf-8');
                sessionHistory = JSON.parse(existingData);
            }

            sessionHistory.push({
                timestamp: chatLog.metadata.timestamp,
                messageCount: messages.length,
                logId: chatLog.id
            });

            fs.writeFileSync(sessionFile, JSON.stringify({
                sessionId,
                history: sessionHistory,
                lastUpdated: chatLog.metadata.timestamp
            }, null, 2));

        } catch (fileError) {
            console.error('Error saving chat log to file:', fileError);
            // Continue anyway - we've logged it to console
        }

        return NextResponse.json({
            success: true,
            message: 'Chat log saved successfully',
            logId: chatLog.id
        });

    } catch (error) {
        console.error('Chat logs API error:', error);
        return NextResponse.json(
            { error: 'Failed to save chat log' },
            { status: 500 }
        );
    }
}

// GET endpoint to retrieve chat logs (admin only - add authentication)
export async function GET(request: NextRequest) {
    try {
        // TODO: Add authentication check here
        // const session = await getServerSession();
        // if (!session?.user?.isAdmin) {
        //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        // }

        const { searchParams } = new URL(request.url);
        const sessionId = searchParams.get('sessionId');

        const fs = require('fs');
        const path = require('path');
        const chatLogsDir = path.join(process.cwd(), 'data', 'chat-logs');

        if (!fs.existsSync(chatLogsDir)) {
            return NextResponse.json({ logs: [] });
        }

        if (sessionId) {
            // Get specific session
            const sessionFile = path.join(chatLogsDir, `session_${sessionId}.json`);
            if (fs.existsSync(sessionFile)) {
                const sessionData = JSON.parse(fs.readFileSync(sessionFile, 'utf-8'));
                return NextResponse.json({ session: sessionData });
            }
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }

        // Get all sessions
        const files = fs.readdirSync(chatLogsDir);
        const sessions = files
            .filter((file: string) => file.startsWith('session_') && file.endsWith('.json'))
            .map((file: string) => {
                const content = fs.readFileSync(path.join(chatLogsDir, file), 'utf-8');
                return JSON.parse(content);
            })
            .sort((a: any, b: any) =>
                new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
            );

        return NextResponse.json({ sessions });

    } catch (error) {
        console.error('Get chat logs error:', error);
        return NextResponse.json(
            { error: 'Failed to retrieve chat logs' },
            { status: 500 }
        );
    }
}
