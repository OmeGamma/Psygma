import React, { useState } from 'react';
import { Send, User, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const initialMessages = [
  {
    id: 1,
    role: 'ai',
    text: "Hello! I'm your PSYGMA wellness coach. How are you feeling right now, and what's on your mind?",
  }
];

const Coach = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), role: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiMsg = {
        id: Date.now() + 1,
        role: 'ai',
        text: "I hear you. Based on your recent pattern, it looks like you've been working long hours with less outdoor activity. Since you have about 45 minutes available, here are some personalized options:\n\n1. **Badminton (45 min)** — Social & active\n2. **Outdoor Walk (25 min)** — Nature reset\n3. **Guided Breathing (15 min)** — Immediate calm\n\nWhat feels right for you today?",
        options: ["Badminton", "Walk", "Guided Breathing"]
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 1500);
  };

  return (
    <div className="py-6 max-w-4xl mx-auto h-[85vh] flex flex-col">
      <header className="mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-psygma-earth flex items-center justify-center text-white">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-serif text-psygma-text">Your Wellness Coach</h1>
          <p className="text-sm text-psygma-muted">AI-powered personal intelligence</p>
        </div>
      </header>

      <div className="flex-1 glass-card p-6 flex flex-col overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto pr-4 space-y-6 hide-scrollbar flex flex-col">
          {messages.map((msg) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={msg.id}
              className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-psygma-sand flex items-center justify-center text-psygma-earth shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}
              
              <div className={`max-w-[75%] rounded-2xl p-4 ${
                msg.role === 'user' 
                  ? 'bg-psygma-earth text-white rounded-br-none' 
                  : 'bg-white/80 border border-psygma-sand/30 text-psygma-text rounded-bl-none shadow-sm'
              }`}>
                <div className="whitespace-pre-wrap leading-relaxed text-sm">
                  {msg.text}
                </div>
                
                {(msg as any).options && (
                  <div className="mt-4 flex flex-col gap-2">
                    {(msg as any).options.map((opt: string) => (
                      <button 
                        key={opt}
                        onClick={() => {
                          setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: opt }]);
                          setTimeout(() => {
                            setMessages(prev => [...prev, { 
                              id: Date.now() + 1, 
                              role: 'ai', 
                              text: `Great choice! I've logged your intent to do ${opt}. Enjoy your time!` 
                            }]);
                          }, 1000);
                        }}
                        className="bg-white hover:bg-psygma-sand/20 text-psygma-earth border border-psygma-sand/50 rounded-lg px-4 py-2 text-sm font-medium transition text-left"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-psygma-olive flex items-center justify-center text-white shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="mt-4 relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="w-full bg-white/70 border border-psygma-sand/50 rounded-full py-4 pl-6 pr-14 focus:outline-none focus:ring-2 focus:ring-psygma-earth/50 shadow-inner"
          />
          <button 
            type="submit" 
            disabled={!input.trim()}
            className="absolute right-2 w-10 h-10 rounded-full bg-psygma-earth text-white flex items-center justify-center hover:bg-opacity-90 disabled:opacity-50 transition"
          >
            <Send className="w-4 h-4 -ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Coach;
