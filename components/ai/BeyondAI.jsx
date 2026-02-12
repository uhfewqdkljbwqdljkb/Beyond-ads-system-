import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, Send, X, Bot, User, CornerDownLeft, Loader2 } from 'lucide-react';
import { Card, Button, Input, Avatar, Badge } from '../ui/index.js';
import { useAuthStore } from '../../store/authStore.js';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const BeyondAI = ({ isOpen, onClose }) => {
  const user = useAuthStore(s => s.user);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'model', text: `Hello ${user?.first_name}. I have indexed your current pipeline and client records. How can I help you optimize your sales today?` }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const contextPrompt = `
        You are "Beyond Intelligence", the AI core of Beyond Ads Digital Agency.
        User Identity: ${user?.first_name} ${user?.last_name} (Role: ${user?.role})
        
        System Context:
        - Total Agency Pipeline: $2.84M across 142 open deals.
        - High Value Accounts: Hyperion Labs, Nebula, Aura Media.
        - Performance Leader: Sarah Miller (85% to target).
        - Recent Event: 3 referrals entered the "Qualified" stage today.
        
        Guidelines:
        1. Format your response in clean Markdown.
        2. Use concise, data-driven language.
        3. If the user asks about deals, mention weighted value.
        4. If the user asks about invoices, highlight overdue status if applicable.
        5. Propose next steps using bullet points.
      `;

      const chatResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          ...messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })), 
          { role: 'user', parts: [{ text: userMessage }] }
        ],
        config: { 
          systemInstruction: contextPrompt,
          temperature: 0.7
        }
      });

      setMessages(prev => [...prev, { role: 'model', text: chatResponse.text || "I'm sorry, I couldn't reach the intelligence core." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Critical system connection error. Please verify your API status." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-white shadow-2xl z-[200] flex flex-col animate-in slide-in-from-right duration-300 border-l border-zinc-100">
      <div className="p-4 border-b border-zinc-50 flex items-center justify-between bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-xl text-white shadow-sm ring-4 ring-primary-light">
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="text-sm font-black text-zinc-900 tracking-tight leading-none">Beyond Intelligence</h3>
            <div className="flex items-center gap-1.5 mt-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Analyst Mode Active</span>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-zinc-50 rounded-lg text-zinc-400">
          <X size={18} />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar bg-zinc-50/20">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${m.role === 'model' ? 'bg-zinc-900 text-white' : 'bg-primary text-white shadow-md'}`}>
              {m.role === 'model' ? <Bot size={16} /> : <User size={16} />}
            </div>
            <div className={`max-w-[85%] text-[13px] leading-relaxed ${m.role === 'model' ? 'text-zinc-700 font-medium' : 'bg-primary text-white p-3 rounded-2xl rounded-tr-none shadow-sm'}`}>
              {m.role === 'model' ? (
                <div className="prose prose-sm prose-zinc max-w-none">
                  {m.text.split('\n').map((line, idx) => (
                    <p key={idx} className={line.startsWith('-') ? 'ml-4' : ''}>{line}</p>
                  ))}
                </div>
              ) : m.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4 animate-pulse items-center">
            <div className="w-8 h-8 rounded-xl bg-zinc-200 flex items-center justify-center text-zinc-400"><Loader2 size={16} className="animate-spin" /></div>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-200 animate-bounce delay-75" />
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-200 animate-bounce delay-150" />
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-200 animate-bounce delay-300" />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-zinc-50">
        <div className="relative group">
          <textarea
            autoFocus
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            placeholder="Type a command or ask a question..."
            className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl pl-4 pr-12 py-3.5 text-sm outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all resize-none no-scrollbar placeholder:text-zinc-400"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-3 bottom-3 p-2.5 bg-primary text-white rounded-xl hover:bg-primary-hover disabled:opacity-30 transition-all shadow-lg active:scale-95"
          >
            <Send size={16} />
          </button>
        </div>
        <div className="flex justify-between items-center mt-4 px-2">
          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
            <CornerDownLeft size={12} className="opacity-50" /> Enter to execute
          </span>
          <span className="text-[10px] text-zinc-300 font-black tracking-tighter">BEYOND AI v3.1</span>
        </div>
      </div>
    </div>
  );
};