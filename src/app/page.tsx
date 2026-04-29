'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, User, Sparkles, Plus, Star, Circle, Triangle } from 'lucide-react';
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
    <div className="flex flex-col h-screen bg-surface text-midnight font-vietnam relative overflow-hidden">
      
      {/* Joy Sprinkles (Background) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <Star className="absolute top-20 left-[10%] text-hot-pink/10 w-12 h-12 animate-pulse" />
        <Circle className="absolute top-40 right-[15%] text-electric-purple/10 w-8 h-8 animate-bounce" style={{ animationDuration: '3s' }} />
        <Triangle className="absolute bottom-40 left-[20%] text-bright-yellow/10 w-10 h-10 animate-spin" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[60%] right-[5%] w-24 h-24 rounded-full bg-hot-pink/5 blur-3xl animate-pulse" />
        <div className="absolute bottom-[10%] left-[5%] w-32 h-32 rounded-full bg-electric-purple/5 blur-3xl animate-pulse" />
      </div>

      {/* Header & Tabs */}
      <header className="glass-morphism z-10 sticky top-0 mx-4 mt-4 rounded-2xl shadow-xl">
        <div className="max-w-4xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-3xl font-extrabold flex items-center gap-2 text-hot-pink font-jakarta tracking-tighter italic">
            <Sparkles className="w-8 h-8 text-bright-yellow fill-bright-yellow" strokeWidth={1.5} />
            JOYCHAT
          </h1>
          
          <div className="flex bg-surface-dim p-2 rounded-full overflow-x-auto max-w-full no-scrollbar border-2 border-white/50 shadow-inner">
            {personas.map((persona) => (
              <button
                key={persona.id}
                onClick={() => handlePersonaSwitch(persona)}
                className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap tracking-wide uppercase ${
                  activePersona.id === persona.id
                    ? 'joy-gradient text-white shadow-lg scale-105 neon-glow-pink'
                    : 'text-midnight hover:bg-white/40 border border-transparent'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white font-bold ${
                  activePersona.id === persona.id ? 'bg-white/20 backdrop-blur-md' : 'bg-midnight/20'
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
      <main className="flex-1 overflow-y-auto w-full max-w-4xl mx-auto p-4 sm:p-6 md:p-8 flex flex-col gap-8 z-1 relative">
        
        {/* Welcome state */}
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-lg mx-auto space-y-10 mt-10 bubbly-tilt">
            <div className="w-32 h-32 rounded-full joy-lava-lamp flex items-center justify-center text-white text-4xl font-bold shadow-2xl neon-glow-purple border-8 border-white animate-bounce" style={{ animationDuration: '4s' }}>
              {activePersona.avatar}
            </div>
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl border-4 border-hot-pink">
              <h2 className="text-4xl font-extrabold text-midnight font-jakarta mb-4 tracking-tight">Meet {activePersona.name}!</h2>
              <p className="text-midnight/80 text-xl font-medium leading-relaxed">{activePersona.description}</p>
            </div>
            
            <div className="w-full space-y-4">
              <p className="text-sm text-hot-pink uppercase tracking-[0.2em] font-black italic">Let's Play!</p>
              <div className="grid grid-cols-1 gap-3">
                {SUGGESTIONS[activePersona.id]?.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(suggestion)}
                    className="w-full text-left p-5 rounded-2xl border-4 border-transparent bg-bright-yellow text-midnight font-bold shadow-lg hover:border-hot-pink hover:scale-[1.02] transition-all transform hover:-rotate-1"
                  >
                    🚀 {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="space-y-10 pb-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-5 max-w-[90%] sm:max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center border-4 border-white shadow-xl ${
                  msg.role === 'user' 
                  ? 'bg-midnight text-white' 
                  : 'joy-lava-lamp text-white font-bold'
                }`}>
                  {msg.role === 'user' ? <User className="w-6 h-6" /> : activePersona.avatar}
                </div>

                <div className={`p-6 rounded-[2.5rem] shadow-2xl relative border-4 ${
                  msg.role === 'user'
                    ? 'joy-gradient text-white border-white/30 rounded-tr-none'
                    : 'bg-white text-midnight border-electric-purple rounded-tl-none neon-glow-purple'
                }`}>
                  <div className={`prose prose-sm md:prose-base max-w-none font-vietnam leading-relaxed font-medium ${
                    msg.role === 'user' ? 'prose-invert prose-headings:text-white' : 'prose-slate prose-headings:font-jakarta prose-headings:text-hot-pink'
                  }`}>
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-5 max-w-[90%] sm:max-w-[85%] flex-row">
                <div className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center joy-lava-lamp text-white font-bold border-4 border-white shadow-xl">
                  {activePersona.avatar}
                </div>
                <div className="p-6 rounded-[2.5rem] bg-white border-4 border-electric-purple shadow-xl flex items-center gap-3 neon-glow-purple">
                  <div className="w-3 h-3 rounded-full bg-hot-pink animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-3 h-3 rounded-full bg-electric-purple animate-bounce" style={{ animationDelay: '200ms' }} />
                  <div className="w-3 h-3 rounded-full bg-bright-yellow animate-bounce" style={{ animationDelay: '400ms' }} />
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex justify-center my-10">
              <div className="bg-red-100 text-red-600 px-8 py-5 rounded-3xl border-4 border-red-200 text-lg font-black italic shadow-2xl animate-shake">
                OH NO! {error}
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Floating Action Button */}
      <button className="fixed bottom-32 right-8 w-16 h-16 rounded-full joy-gradient text-white shadow-2xl neon-glow-pink flex items-center justify-center hover:scale-110 active:scale-95 transition-transform z-20 border-4 border-white">
        <Plus className="w-8 h-8" />
      </button>

      {/* Input Area */}
      <footer className="glass-morphism p-4 sm:p-8 mx-4 mb-4 rounded-3xl border-4 border-white/50 shadow-2xl">
        <div className="max-w-4xl mx-auto relative">
          <form onSubmit={handleSubmit} className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ping ${activePersona.name}...`}
              className="flex-1 rounded-full border-4 border-electric-purple bg-white/90 px-8 py-5 focus:outline-none focus:border-hot-pink focus:ring-4 focus:ring-hot-pink/20 transition-all text-midnight font-bold placeholder-midnight/30 shadow-inner text-xl"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="rounded-full w-20 flex items-center justify-center joy-gradient text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl hover:scale-105 active:scale-90 neon-glow-pink flex-shrink-0 border-4 border-white"
            >
              {isLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Send className="w-8 h-8" />}
            </button>
          </form>
          <div className="text-center mt-4">
            <p className="text-[10px] text-hot-pink font-black uppercase tracking-[0.3em]">Joy Engine Powered by Gemini 🤖</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
