'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, X, MessageCircle, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { searchKnowledgeBase, getGreeting } from '@/lib/knowledge-base';
import { FeedbackForm } from '@/components/ai/feedback-form';
import Image from 'next/image';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

// Anmol logo URL
const LOGO_URL = 'https://anmolsweets.se/wp-content/uploads/2021/01/logo.png';

// Main export component that handles state and rendering
export function AiChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <>
            <ChatWidget isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
}

// Chat widget component
function ChatWidget({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [isMinimized, setIsMinimized] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

    // Chat state
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: getGreeting(),
            timestamp: new Date(),
        },
    ]);
    const [chatInput, setChatInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll chat
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping, isOpen]);

    const handleSendMessage = async () => {
        if (!chatInput.trim()) return;

        const newUserMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: chatInput,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, newUserMessage]);
        setChatInput('');
        setIsTyping(true);

        // Simulate AI delay
        setTimeout(() => {
            const response = generateAIResponse(newUserMessage.content);
            const newAiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, newAiMessage]);
            setIsTyping(false);
        }, 1000);
    };

    const generateAIResponse = (input: string): string => {
        const kbResponse = searchKnowledgeBase(input);
        return kbResponse.answer;
    };

    const saveChatLogs = async () => {
        const userMessages = messages.filter(m => m.role === 'user');
        if (userMessages.length === 0) return;

        try {
            await fetch('/api/chat-logs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    messages: messages.map(m => ({
                        role: m.role,
                        content: m.content,
                        timestamp: m.timestamp.toISOString()
                    })),
                    metadata: {
                        page: window.location.pathname,
                        messageCount: messages.length,
                    }
                }),
            });
        } catch (error) {
            console.error('Failed to save chat logs:', error);
        }
    };

    // Save logs when closing
    useEffect(() => {
        if (!isOpen && messages.length > 1) {
            saveChatLogs();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={cn(
                    "overflow-hidden rounded-xl border border-border bg-background shadow-xl flex flex-col",
                    isMinimized ? "h-14 w-64" : "h-[450px] w-[300px]"
                )}
            >
                {/* Header - Theme Primary Color (Red) */}
                <div className="flex items-center gap-3 px-3 py-2.5 bg-primary shrink-0">
                    <div className="relative h-8 w-8 shrink-0 rounded-full overflow-hidden bg-white border-2 border-white/50">
                        <Image
                            src={LOGO_URL}
                            alt="Anmol"
                            fill
                            className="object-contain p-0.5"
                        />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <h3 className="font-semibold text-sm text-primary-foreground truncate mb-0">Anmol Assistant</h3>
                        {!isMinimized && <p className="text-[12px] text-primary-foreground/80 leading-none">Always here to help</p>}
                    </div>
                    <div className="flex items-center shrink-0">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-full hover:bg-primary-foreground/10 text-primary-foreground"
                            onClick={() => setIsMinimized(!isMinimized)}
                        >
                            {isMinimized ? <Maximize2 className="h-3.5 w-3.5" /> : <Minimize2 className="h-3.5 w-3.5" />}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-full hover:bg-primary-foreground/10 text-primary-foreground"
                            onClick={onClose}
                        >
                            <X className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>

                {/* Content */}
                {!isMinimized && (
                    <>
                        {showFeedback ? (
                            <div className="flex-1 overflow-y-auto p-3 bg-muted/30">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-semibold text-sm text-foreground">Send Feedback</h4>
                                    <Button variant="ghost" size="sm" onClick={() => setShowFeedback(false)} className="text-xs text-primary hover:bg-primary/10 h-7 px-2">
                                        Back
                                    </Button>
                                </div>
                                <FeedbackForm
                                    onClose={() => setShowFeedback(false)}
                                    onSuccess={() => setTimeout(() => setShowFeedback(false), 2000)}
                                />
                            </div>
                        ) : (
                            <>
                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-muted/20">
                                    {messages.map((msg, index) => (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className={cn(
                                                "flex w-max max-w-[85%] flex-col gap-0.5 rounded-xl px-3 py-2 text-sm",
                                                msg.role === 'assistant'
                                                    ? "self-start rounded-tl-sm bg-background text-foreground border border-border shadow-sm"
                                                    : "self-end rounded-tr-sm bg-primary text-primary-foreground shadow-sm"
                                            )}
                                        >
                                            <div
                                                className="leading-relaxed text-[13px]"
                                                dangerouslySetInnerHTML={{
                                                    __html: msg.content
                                                        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
                                                        .replace(/\[(.*?)\]\((.*?)\)/g, `<a href="$2" class="underline underline-offset-2 hover:opacity-80 transition-opacity ${msg.role === 'assistant' ? 'text-primary' : 'text-white'}">$1</a>`)
                                                        .replace(/\\n/g, '<br />')
                                                }}
                                            />
                                            <span className={cn("text-[9px]", msg.role === 'assistant' ? 'text-muted-foreground' : 'text-white/70')}>
                                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </motion.div>
                                    ))}
                                    {isTyping && (
                                        <div className="self-start rounded-xl rounded-tl-sm bg-background px-3 py-2 border border-border shadow-sm">
                                            <div className="flex gap-1">
                                                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                                                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                                                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
                                            </div>
                                        </div>
                                    )}
                                    <div ref={scrollRef} />
                                </div>

                                {/* Input Area */}
                                <div className="p-2.5 bg-background border-t border-border shrink-0">
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }}
                                        className="flex gap-2"
                                    >
                                        <Input
                                            value={chatInput}
                                            onChange={(e) => setChatInput(e.target.value)}
                                            placeholder="Ask about menu, booking..."
                                            className="flex-1 h-9 rounded-full bg-muted border-transparent text-sm focus:border-primary/50 focus:bg-background transition-all"
                                            disabled={isTyping}
                                        />
                                        <Button
                                            type="submit"
                                            size="icon"
                                            className="h-9 w-9 shrink-0 rounded-full bg-primary hover:bg-primary/90 shadow-sm"
                                            disabled={!chatInput.trim() || isTyping}
                                        >
                                            <Send className="h-4 w-4" />
                                        </Button>
                                    </form>
                                    <div className="mt-1.5 flex justify-center">
                                        <button
                                            onClick={() => setShowFeedback(true)}
                                            className="text-[10px] text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
                                        >
                                            <MessageCircle className="h-3 w-3" />
                                            Give Feedback
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                )}
            </motion.div>
        </div>
    );
}

// Export a hook for managing chatbot state
export function useAIChat() {
    const [isOpen, setIsOpen] = useState(false);
    
    const openChat = () => setIsOpen(true);
    const closeChat = () => setIsOpen(false);
    const toggleChat = () => setIsOpen(!isOpen);
    
    return {
        isOpen,
        openChat,
        closeChat,
        toggleChat,
        ChatWidget: () => <ChatWidget isOpen={isOpen} onClose={closeChat} />
    };
}
