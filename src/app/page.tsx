'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, User, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { personas, Persona } from '@/config/personas';

type Message = {
  role: 'user' | 'model';
  content: string;
};

const SUGGESTIONS: Record<string, string[]> = {
  anshuman: ['Explain HashMaps', 'How to scale a web app?', 'Design a URL shortener'],
  abhimanyu: ['How to find product market fit?', 'Tips for hiring engineers', 'How to raise seed funding?'],
  kshitij: ['Explain CSS Grid vs Flexbox', 'How to improve web performance?', 'Best practices for React components'],
};

export default function ChatApp() {
  const [activePersona, setActivePersona] = useState<Persona>(personas[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handlePersonaSwitch = (persona: Persona) => {
    if (persona.id === activePersona.id) return;
    setActivePersona(persona);
    setMessages([]);
    setError(null);
    setInput('');
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const newMessage: Message = { role: 'user', content: text };
    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, newMessage].map(m => ({ role: m.role, content: m.content })),
          personaId: activePersona.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch response');
      }

      setMessages((prev) => [...prev, { role: 'model', content: data.reply }]);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-neutral text-deep-navy font-manrope">
      {/* Header & Tabs */}
      <header className="bg-white border-b border-gray-200 shadow-sm z-10 sticky top-0 bg-white/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-2xl font-bold flex items-center gap-2 text-deep-navy font-noto-serif tracking-tight">
            <Sparkles className="w-5 h-5 text-academic-gold" strokeWidth={1.5} />
            PersonaChat
          </h1>
          
          <div className="flex bg-slate-neutral p-1 rounded overflow-x-auto max-w-full no-scrollbar border border-gray-200">
            {personas.map((persona) => (
              <button
                key={persona.id}
                onClick={() => handlePersonaSwitch(persona)}
                className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-semibold transition-all whitespace-nowrap tracking-wide uppercase ${
                  activePersona.id === persona.id
                    ? 'bg-white text-deep-navy shadow-sm border border-gray-200'
                    : 'text-charcoal hover:text-deep-navy hover:bg-white/50 border border-transparent'
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white font-bold ${
                  activePersona.id === persona.id ? 'bg-deep-navy' : 'bg-charcoal'
                }`}>
                  {persona.avatar}
                </div>
                {persona.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto w-full max-w-4xl mx-auto p-4 sm:p-6 md:p-8 flex flex-col gap-8">
        
        {/* Welcome state */}
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-lg mx-auto space-y-8 mt-10">
            <div className="w-24 h-24 rounded-full bg-deep-navy flex items-center justify-center text-white text-3xl font-bold shadow-lg border-4 border-white">
              {activePersona.avatar}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-deep-navy font-noto-serif mb-3">Consult {activePersona.name}</h2>
              <p className="text-charcoal text-lg leading-relaxed">{activePersona.description}</p>
            </div>
            
            <div className="w-full space-y-3 mt-6">
              <p className="text-xs text-charcoal uppercase tracking-widest font-semibold mb-4">Suggested Topics</p>
              {SUGGESTIONS[activePersona.id]?.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(suggestion)}
                  className="w-full text-left p-4 rounded border border-gray-200 bg-white hover:border-academic-gold hover:shadow-sm transition-all text-deep-navy"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="space-y-8 pb-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-4 max-w-[90%] sm:max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center border-2 border-white shadow-sm ${
                  msg.role === 'user' 
                  ? 'bg-charcoal text-white' 
                  : 'bg-deep-navy text-white font-bold text-sm'
                }`}>
                  {msg.role === 'user' ? <User className="w-5 h-5" strokeWidth={1.5} /> : activePersona.avatar}
                </div>

                <div className={`p-5 rounded shadow-sm relative ${
                  msg.role === 'user'
                    ? 'bg-light-blue text-deep-navy border border-gray-200'
                    : 'bg-white text-deep-navy border border-gray-200 border-l-4 border-l-academic-gold'
                }`} style={msg.role === 'model' ? { boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)' } : {}}>
                  <div className="prose prose-sm md:prose-base prose-slate max-w-none font-manrope leading-relaxed prose-headings:font-noto-serif prose-headings:text-deep-navy prose-a:text-academic-gold">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-4 max-w-[90%] sm:max-w-[80%] flex-row">
                <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center bg-deep-navy text-white font-bold text-sm border-2 border-white shadow-sm">
                  {activePersona.avatar}
                </div>
                <div className="p-5 rounded bg-white border border-gray-200 border-l-4 border-l-academic-gold shadow-sm flex items-center gap-2" style={{ boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)' }}>
                  <div className="w-2 h-2 rounded-full bg-charcoal animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-charcoal animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-charcoal animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex justify-center my-6">
              <div className="bg-red-50 text-red-700 px-6 py-4 rounded border border-red-200 text-sm max-w-md text-center font-semibold">
                {error}
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto relative">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask ${activePersona.name} a question...`}
              className="flex-1 rounded border border-gray-300 bg-white px-5 py-4 focus:outline-none focus:border-deep-navy focus:ring-1 focus:ring-deep-navy transition-all text-deep-navy placeholder-gray-400 shadow-sm font-manrope"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="rounded w-14 flex items-center justify-center bg-deep-navy hover:bg-charcoal text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-deep-navy flex-shrink-0"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6 ml-1" strokeWidth={1.5} />}
            </button>
          </form>
          <div className="text-center mt-3">
            <p className="text-xs text-charcoal">AI systems may provide inaccurate information. Please verify independently.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
