import React, { useState } from 'react';
import { marked } from 'marked';
import html2pdf from 'html2pdf.js';
import { 
  FileText, Plane, Building2, Calendar, Copy, Download, Check, Cpu, Hash, ExternalLink 
} from 'lucide-react';

export default function ResultsView({ data }) {
  const [activeTab, setActiveTab] = useState('full');
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!data) return null;

  const handleCopy = () => {
    const textToCopy = data.answer || data.itinerary || '';
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('pdf-export-container');
    if (!element) return;

    setDownloading(true);

    const opt = {
      margin:       0.4,
      filename:     `Travel_Plan_${data.thread_id.substring(0, 8)}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#0f172a' },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      setDownloading(false);
    }).catch((err) => {
      console.error(err);
      setDownloading(false);
    });
  };

  const renderMarkdown = (content) => {
    if (!content) return <p className="text-slate-400 italic">No details available.</p>;
    const rawHtml = marked.parse(content);
    return (
      <div 
        className="markdown-body text-slate-200"
        dangerouslySetInnerHTML={{ __html: rawHtml }} 
      />
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 animate-fade-in">
      {/* Result Card Wrapper */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
        
        {/* Header Bar */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-400" />
                <span>Your AI Travel Itinerary</span>
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
                <Cpu className="w-3 h-3" />
                <span>{data.llm_calls || 4} LLM agent calls</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1 font-mono">
              <Hash className="w-3 h-3 text-slate-500" />
              <span>Thread ID: {data.thread_id}</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition border border-slate-700"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Plan</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1.5 transition shadow-lg shadow-indigo-600/20 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading ? 'Exporting PDF...' : 'Download PDF'}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('full')}
            className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'full'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Complete Plan</span>
          </button>

          <button
            onClick={() => setActiveTab('flights')}
            className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'flights'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Plane className="w-4 h-4" />
            <span>Live Flight Data</span>
          </button>

          <button
            onClick={() => setActiveTab('hotels')}
            className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'hotels'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Hotel Options</span>
          </button>
        </div>

        {/* Tab Content Box */}
        <div className="p-6 md:p-8" id="pdf-export-container">
          {activeTab === 'full' && (
            <div>
              {renderMarkdown(data.answer || data.itinerary)}
            </div>
          )}

          {activeTab === 'flights' && (
            <div>
              <h3 className="text-lg font-bold text-indigo-300 mb-4 flex items-center gap-2">
                <Plane className="w-5 h-5 text-indigo-400" />
                <span>Flight Search Agent Output</span>
              </h3>
              {renderMarkdown(data.flight_results)}
            </div>
          )}

          {activeTab === 'hotels' && (
            <div>
              <h3 className="text-lg font-bold text-purple-300 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-400" />
                <span>Hotel Search Agent Output</span>
              </h3>
              {renderMarkdown(data.hotel_results)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
