'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, X, Sparkles, ChefHat } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export function FoodConcierge() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: 'Hello! I\'m your **Royal Food Concierge**. I can help you find the perfect dish, suggest pairings, or assist with reservations. What are you craving today?',
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping]);

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const newUserMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, newUserMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simulate AI processing
        setTimeout(() => {
            const response = generateResponse(newUserMessage.content);
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

    const generateResponse = (input: string): string => {
        const lowerInput = input.toLowerCase();

        if (lowerInput.includes('spicy') || lowerInput.includes('hot')) {
            return "For a spicy kick, I highly recommend our **Chicken Madras** or **Vindaloo**. They pack a punch with authentic spices! Would you like to see the full menu?";
        }
        if (lowerInput.includes('sweet') || lowerInput.includes('dessert')) {
            return "Our sweets are legendary! Try the **Gulab Jamun** or our signature **Rasmalai** - they're the perfect sweet ending to any meal.";
        }
        if (lowerInput.includes('vegan') || lowerInput.includes('vegetarian')) {
            return "We have excellent plant-based options! The **Palak Paneer** (vegetarian) and **Chana Masala** (vegan) are customer favorites. Check out our full [Menu](/menu) for more!";
        }
        if (lowerInput.includes('book') || lowerInput.includes('reservation') || lowerInput.includes('table')) {
            return "I'd love to help you book a table! Visit our [Reservations Page](/reservations) to choose your perfect time. We look forward to serving you!";
        }
        if (lowerInput.includes('catering') || lowerInput.includes('party') || lowerInput.includes('event')) {
            return "Planning an event? Our catering service is exceptional! Check out our [Catering Page](/catering) to use our smart price calculator and explore packages.";
        }
        if (lowerInput.includes('menu')) {
            return "You can explore our full menu here: [Restaurant Menu](/menu/restaurant) and [Sweets & Desserts](/menu). We have something for every palate!";
        }
        if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
            return "Hello! Welcome to Royal Sweets & Restaurant. How can I assist you today? Feel free to ask about our dishes, reservations, or catering services!";
        }

        return "That sounds delicious! We have an extensive menu with dishes to satisfy every craving. Have a look at our [Chef's Specials](/menu) or tell me more about what you're in the mood for!";
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-24 right-4 z-[100] flex h-16 w-16 items-center justify-center rounded-full shadow-xl transition-all duration-300 md:bottom-8 md:right-8"
                style={isOpen ? undefined : { backgroundColor: '#1a3d35' }}
                aria-label="Toggle Food Concierge"
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-white"
                        >
                            <X className="h-7 w-7" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="open"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-white"
                        >
                            <Sparkles className="h-7 w-7 animate-pulse" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="fixed bottom-44 right-4 z-[99] w-[90vw] max-w-[400px] overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900 md:bottom-28 md:right-8"
                    >
                        {/* Header */}
                        <div className="relative flex items-center gap-3 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-900 p-5 text-white">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full backdrop-blur-sm ring-2" style={{ backgroundColor: '#1a3d35', borderColor: '#1a3d35' }}>
                                <ChefHat className="h-7 w-7 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-heading text-lg font-bold" style={{ color: '#1a3d35' }}>Royal Concierge</h3>
                                <p className="flex items-center gap-1.5 text-xs text-white/90">
                                    <span className="h-2 w-2 animate-pulse rounded-full shadow-lg" style={{ backgroundColor: '#1a3d35', boxShadow: '0 0 10px rgba(26, 61, 53, 0.5)' }} />
                                    Online & Ready to Assist
                                </p>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="h-[420px] overflow-y-auto bg-gradient-to-b from-neutral-50 to-white p-4 dark:from-neutral-800 dark:to-neutral-900">
                            <div className="flex flex-col gap-3">
                                {messages.map((msg, index) => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className={cn(
                                            "flex w-max max-w-[85%] flex-col gap-1 rounded-2xl px-4 py-3 text-sm shadow-md",
                                            msg.role === 'assistant'
                                                ? "self-start rounded-tl-sm bg-white/80 backdrop-blur-md text-neutral-800 ring-1 ring-white/20 dark:bg-neutral-800/80 dark:text-neutral-100 dark:ring-neutral-700/50"
                                                : "self-end rounded-tr-sm font-medium shadow-lg"
                                        )}
                                        style={msg.role === 'user' ? { backgroundColor: '#1a3d35', color: 'white' } : undefined}
                                    >
                                        <div
                                            className="leading-relaxed"
                                            dangerouslySetInnerHTML={{
                                                __html: msg.content
                                                    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
                                                    .replace(/\[(.*?)\]\((.*?)\)/g, `<a href="$2" class="underline decoration-2 underline-offset-2 ${msg.role === 'user' ? 'hover:text-white/80' : 'hover:text-primary-600'} transition-colors">$1</a>`)
                                            }}
                                        />
                                        <span className="text-[10px] opacity-70">
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </motion.div>
                                ))}
                                {isTyping && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="self-start rounded-2xl rounded-tl-sm bg-white/80 backdrop-blur-md px-5 py-3 shadow-md ring-1 ring-white/20 dark:bg-neutral-800/80 dark:ring-neutral-700/50"
                                    >
                                        <div className="flex gap-1.5">
                                            <span className="h-2.5 w-2.5 animate-bounce rounded-full [animation-delay:-0.3s]" style={{ backgroundColor: '#1a3d35' }} />
                                            <span className="h-2.5 w-2.5 animate-bounce rounded-full [animation-delay:-0.15s]" style={{ backgroundColor: '#1a3d35' }} />
                                            <span className="h-2.5 w-2.5 animate-bounce rounded-full" style={{ backgroundColor: '#1a3d35' }} />
                                        </div>
                                    </motion.div>
                                )}
                                <div ref={scrollRef} />
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="border-t border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSendMessage();
                                }}
                                className="flex gap-2"
                            >
                                <Input
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Ask about our menu, reservations..."
                                    className="flex-1 rounded-full border-neutral-300 bg-neutral-50 px-5 py-2.5 text-sm focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:focus:bg-neutral-700"
                                    disabled={isTyping}
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    className="h-11 w-11 shrink-0 rounded-full shadow-md hover:shadow-lg disabled:opacity-50 transition-all"
                                    style={{ backgroundColor: '#1a3d35' }}
                                    disabled={!inputValue.trim() || isTyping}
                                >
                                    <Send className="h-4 w-4 text-white" />
                                </Button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
