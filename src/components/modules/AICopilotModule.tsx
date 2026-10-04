'use client';
import React, { useState } from 'react';
import { Bot, Send, Sparkles } from 'lucide-react';

export default function AICopilotModule({ onBack }: { onBack: () => void }) {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'AI', text: 'Hello Alex! I am your In-Cab Regulatory Co-Pilot. I monitor your EU 561/2006 tachograph driving hours, low-bridge clearances, and DVSA rules in real time. How can I assist your shift?' }
  ]);

  const handleAsk = (questionText?: string) => {
    const q = questionText || query;
    if (!q.trim()) return;

    setMessages(prev => [...prev, { sender: 'DRIVER', text: q }]);
    setQuery('');

    setTimeout(() => {
      let answer = 'Under EU 561/2006, all commercial driving parameters must strictly conform to DVSA enforcement rules.';
      if (q.toLowerCase().includes('10 hour') || q.toLowerCase().includes('extend')) {
        answer = 'Under EU 561/2006 Article 6, you may extend your daily driving limit from 9 hours to 10 hours a maximum of twice in a fixed working week.';
      } else if (q.toLowerCase().includes('break') || q.toLowerCase().includes('4.5')) {
        answer = 'After 4.5 hours of continuous driving, you must take an uninterrupted break of at least 45 minutes, or a split break (15 minutes followed by 30 minutes).';
      } else if (q.toLowerCase().includes('bridge') || q.toLowerCase().includes('height')) {
        answer = 'Your trailer is 4.45m. Standard UK bridges under 16ft 6in (5.03m) are marked. Any arch bridge under 4.45m will trigger an immediate emergency reroute.';
      }

      setMessages(prev => [...prev, { sender: 'AI', text: answer }]);
    }, 400);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
            <Bot className="w-6 h-6 text-emerald-400" />
            06. In-Cab AI Regulatory Co-Pilot
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Natural Language Assistant for Statutory UK Transport Rules & Emergency Advice
          </p>
        </div>
        <button onClick={onBack} className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-mono text-slate-300 hover:bg-slate-700">
          ← Back to Cockpit
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
        <div className="h-64 overflow-y-auto space-y-3 p-2 font-mono text-xs">
          {messages.map((m, idx) => (
            <div key={idx} className={`p-3 rounded-xl max-w-xl ${m.sender === 'AI' ? 'bg-slate-950 border border-slate-800 text-slate-200' : 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 ml-auto'}`}>
              <div className="text-[10px] font-bold text-slate-500 mb-1">{m.sender === 'AI' ? 'SMARTHAUL COPILOT' : 'DRIVER'}</div>
              {m.text}
            </div>
          ))}
        </div>

        {/* Quick Question Prompts */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
          <button onClick={() => handleAsk("Can I drive 10 hours today?")} className="px-3 py-1 rounded-full bg-slate-800 text-[11px] font-mono text-slate-300 hover:bg-slate-700">
            Can I drive 10 hours today?
          </button>
          <button onClick={() => handleAsk("What is the mandatory 4.5h break rule?")} className="px-3 py-1 rounded-full bg-slate-800 text-[11px] font-mono text-slate-300 hover:bg-slate-700">
            What is the 4.5h break rule?
          </button>
          <button onClick={() => handleAsk("What are the bridge clearance rules?")} className="px-3 py-1 rounded-full bg-slate-800 text-[11px] font-mono text-slate-300 hover:bg-slate-700">
            What are the bridge clearance rules?
          </button>
        </div>

        {/* Input Bar */}
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAsk()}
            placeholder="Ask anything about UK tacho rules, bridge limits, or rest breaks..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 font-mono text-xs text-white focus:outline-none focus:border-emerald-500"
          />
          <button onClick={() => handleAsk()} className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-mono font-bold text-xs hover:bg-emerald-400">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
