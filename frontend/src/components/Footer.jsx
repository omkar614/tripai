import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-20 py-8 border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-xs text-slate-400">
          Built with <span className="text-indigo-400 font-semibold">FastAPI</span>,{' '}
          <span className="text-purple-400 font-semibold">LangGraph Multi-Agent</span>,{' '}
          <span className="text-pink-400 font-semibold">Groq AI</span>,{' '}
          <span className="text-cyan-400 font-semibold">React & Tailwind CSS</span>
        </p>
        <p className="text-[11px] text-slate-500 mt-2">
          Integrated with Tavily Web Search, AviationStack Live Flights & PostgreSQL Checkpoints
        </p>
      </div>
    </footer>
  );
}
