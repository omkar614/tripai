import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PromptInput from './components/PromptInput';
import ResultsView from './components/ResultsView';
import Footer from './components/Footer';
import { AlertCircle, Sparkles, PlaneTakeoff, ShieldAlert } from 'lucide-react';

export default function App() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [threadId, setThreadId] = useState(() => localStorage.getItem('tripai_thread_id') || null);

  const handleGenerate = async () => {
    if (!input.trim()) return;

    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/travel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input.trim(),
          thread_id: threadId,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate travel plan.');
      }

      setResult(data);
      if (data.thread_id) {
        setThreadId(data.thread_id);
        localStorage.setItem('tripai_thread_id', data.thread_id);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      <div>
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Multi-Agent LangGraph System</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-4">
              Plan Your Dream Trip <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                With AI Intelligence
              </span>
            </h1>

            <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
              Automated multi-agent orchestration for searching real-time flights, curating top-rated hotels, and synthesizing day-by-day itineraries.
            </p>
          </div>

          {/* Input Section */}
          <PromptInput
            input={input}
            setInput={setInput}
            onSubmit={handleGenerate}
            loading={loading}
          />

          {/* Error Message Box */}
          {error && (
            <div className="max-w-4xl mx-auto mt-6 bg-red-950/50 border border-red-500/30 rounded-xl p-4 flex items-start gap-3 text-red-300 text-sm">
              <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block text-red-200">Error generating travel plan:</strong>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Results Section */}
          {result && <ResultsView data={result} />}
        </main>
      </div>

      <Footer />
    </div>
  );
}
