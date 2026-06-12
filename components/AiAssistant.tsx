import React, { useState, useRef, useEffect } from 'react';
import type { AiAssistantMessage } from '../types';
import { getAiAssistance } from '../services/geminiService';
// Fix: Module '"./icons"' has no exported member 'User'.
import { AssistantIcon, SendIcon } from './icons';

interface AiAssistantProps {
    user: { name: string, avatarUrl: string };
}

const AiAssistant: React.FC<AiAssistantProps> = ({ user }) => {
    const [messages, setMessages] = useState<AiAssistantMessage[]>([
        { role: 'assistant', content: "Hello! I'm your AI study assistant. How can I help you today? Ask me for summaries, explanations, or study tips." }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;

        const userMessage: AiAssistantMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const history = messages.map(msg => {
            // Fix: Explicitly defining role's type to help TypeScript's inference.
            const role: 'user' | 'model' = msg.role === 'user' ? 'user' : 'model';
            return {
                role,
                parts: [{ text: msg.content }],
            };
        });

        try {
            const response = await getAiAssistance(input, history);
            const assistantMessage: AiAssistantMessage = { role: 'assistant', content: response };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            const errorMessage: AiAssistantMessage = { role: 'assistant', content: "Sorry, I'm having trouble connecting right now. Please try again later." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 md:p-8 h-full flex flex-col">
            <h1 className="text-3xl font-bold mb-4">AI Assistant</h1>
            <div className="flex-grow bg-base-200 rounded-xl shadow-lg flex flex-col overflow-hidden">
                <div className="flex-grow p-6 space-y-6 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                            {msg.role === 'assistant' && <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-content"><AssistantIcon className="w-6 h-6"/></div>}
                            <div className={`p-4 rounded-2xl max-w-lg ${msg.role === 'user' ? 'bg-primary text-primary-content rounded-br-none' : 'bg-base-300 text-base-content rounded-bl-none'}`}>
                                <p className="whitespace-pre-wrap">{msg.content}</p>
                            </div>
                            {msg.role === 'user' && <img src={user.avatarUrl} alt={user.name} className="flex-shrink-0 w-10 h-10 rounded-full" />}
                        </div>
                    ))}
                     {isLoading && (
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-content"><AssistantIcon className="w-6 h-6"/></div>
                            <div className="p-4 rounded-2xl max-w-lg bg-base-300 text-base-content rounded-bl-none">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-base-content/50 rounded-full animate-bounce delay-75"></span>
                                    <span className="w-2 h-2 bg-base-content/50 rounded-full animate-bounce delay-200"></span>
                                    <span className="w-2 h-2 bg-base-content/50 rounded-full animate-bounce delay-300"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <div className="p-4 bg-base-300 border-t border-base-100">
                    <div className="flex items-center gap-4">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask a question..."
                            className="w-full bg-base-100 border-transparent rounded-lg p-3 focus:ring-primary focus:border-primary"
                            disabled={isLoading}
                        />
                        <button onClick={handleSend} disabled={isLoading || input.trim() === ''} className="btn btn-primary bg-primary hover:bg-primary-focus text-primary-content p-3 rounded-full shrink-0">
                            <SendIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AiAssistant;