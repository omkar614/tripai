import React from 'react';
import { Send, Sparkles, Loader2, MapPin, Compass, Globe, DollarSign } from 'lucide-react';

const QUICK_PROMPTS = [
  {
    label: '7 Days Japan Trip',
    icon: MapPin,
    prompt: 'Plan a complete 7 days Japan trip from India including flights, hotels and sightseeing under 2 lakhs.'
  },
  {
    label: '5 Days Dubai Luxury',
    icon: Compass,
    prompt: 'Plan a 5 days Dubai trip from Dhaka with flights, hotels and sightseeing.'
  },
  {
    label: '7 Days Thailand Budget',
    icon: DollarSign,
    prompt: 'Plan a 7 days Thailand trip from India with budget hotels and sightseeing.'
  },
  {
    label: 'Global Live Flights',
    icon: Globe,
    prompt: 'Give me all country flight info.'
  }
];

export default function PromptInput({ input, setInput, onSubmit, loading }) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative group">
        {/* Subtle glow backdrop */}
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>

        <div className="relative bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <label htmlFor="travel-input" className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Where would you like to travel?</span>
            </label>
            <span className="text-xs text-slate-400 hidden sm:inline">Press <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300 font-mono">Ctrl + Enter</kbd> to submit</span>
          </div>

          <div className="relative">
            <textarea
              id="travel-input"
              rows={3}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.ctrlKey && e.key === 'Enter' && !loading) {
                  onSubmit();
                }
              }}
              placeholder="e.g. Plan a complete 7 days Japan trip including flights, hotels and sightseeing under 2 lakhs..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/80 transition-all text-sm sm:text-base resize-none"
            />

            <div className="flex items-center justify-between mt-4">
              <span className="text-xs text-slate-500">
                {input.length > 0 ? `${input.length} characters` : 'Powered by Groq + LangGraph'}
              </span>

              <button
                onClick={onSubmit}
                disabled={loading || !input.trim()}
                className={`px-6 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all duration-200 shadow-lg ${
                  loading || !input.trim()
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                    : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 hover:from-indigo-600 hover:to-purple-600 text-white shadow-indigo-500/25 hover:shadow-indigo-500/40 active:scale-95'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Planning Trip...</span>
                  </>
                ) : (
                  <>
                    <span>Generate Travel Plan</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Prompts */}
          <div className="mt-6 pt-4 border-t border-slate-800/80">
            <span className="text-xs font-medium text-slate-400 block mb-2.5">Try sample travel requests:</span>
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => setInput(item.prompt)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-indigo-950/60 border border-slate-700/60 hover:border-indigo-500/40 text-xs text-slate-300 hover:text-indigo-300 transition-all cursor-pointer"
                  >
                    <Icon className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
