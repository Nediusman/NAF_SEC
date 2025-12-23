import React, { useState, useEffect } from 'react';
import { FileSearch, AlertTriangle, CheckCircle, Upload } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { analyzeLog } from '../services/geminiService';

const STORAGE_KEY = 'naf_sec_log_data';

const LogAnalyzerView: React.FC = () => {
  // Lazy initialize state from local storage
  const [logInput, setLogInput] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved).logInput : '';
    } catch {
      return '';
    }
  });

  const [analysisResult, setAnalysisResult] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved).analysisResult : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  // Persist state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ logInput, analysisResult }));
  }, [logInput, analysisResult]);

  const handleAnalyze = async () => {
    if (!logInput.trim()) return;
    setLoading(true);
    setAnalysisResult(null);
    try {
      const result = await analyzeLog(logInput);
      setAnalysisResult(result || "No analysis returned.");
    } catch (error: any) {
      setAnalysisResult(`**Error:** ${error.message || "Failed to analyze logs."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-6 max-w-6xl mx-auto w-full overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-emerald-400 flex items-center gap-3">
          <FileSearch className="w-8 h-8" />
          Log Threat Analyzer
        </h1>
        <p className="text-slate-400 mt-2">
          Paste system logs (Syslog, Auth.log, Apache/Nginx) below. The AI will cross-reference MITRE ATT&CK patterns to identify anomalies and potential breaches.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        {/* Input Column */}
        <div className="flex flex-col gap-4 h-full">
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 flex-1 flex flex-col shadow-lg">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Raw Log Data</span>
              <button 
                className="text-xs text-cyan-400 hover:text-cyan-300"
                onClick={() => {
                  setLogInput('');
                  setAnalysisResult(null);
                }}
              >
                Clear
              </button>
            </div>
            <textarea
              value={logInput}
              onChange={(e) => setLogInput(e.target.value)}
              placeholder="Paste logs here (e.g., 'Sep 10 12:44:02 server sshd[123]: Failed password for root...')"
              className="flex-1 bg-slate-950/50 border border-slate-700 rounded-lg p-3 font-mono text-xs text-slate-300 focus:outline-none focus:border-cyan-500 resize-none"
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleAnalyze}
                disabled={loading || !logInput.trim()}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${
                  loading || !logInput.trim()
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/20'
                }`}
              >
                {loading ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Upload size={18} />
                    Analyze Logs
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Output Column */}
        <div className="flex flex-col h-full min-h-[400px]">
           <div className={`bg-slate-900 p-6 rounded-xl border border-slate-700 h-full overflow-y-auto shadow-lg ${!analysisResult && !loading ? 'flex items-center justify-center' : ''}`}>
             
             {!analysisResult && !loading && (
               <div className="text-center text-slate-600">
                 <FileSearch size={48} className="mx-auto mb-3 opacity-20" />
                 <p>Analysis output will appear here</p>
               </div>
             )}

             {loading && (
               <div className="flex flex-col items-center justify-center h-full space-y-4">
                 <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
                 <p className="text-cyan-400 animate-pulse text-sm">Scanning for signatures...</p>
               </div>
             )}

             {analysisResult && (
               <div className="markdown-body text-sm text-slate-300">
                 <ReactMarkdown
                   components={{
                    h1: ({children}) => <h1 className="text-xl font-bold text-red-400 mb-4 pb-2 border-b border-slate-800">{children}</h1>,
                    h2: ({children}) => <h2 className="text-lg font-semibold text-orange-400 mt-6 mb-3">{children}</h2>,
                    h3: ({children}) => <h3 className="text-md font-semibold text-cyan-400 mt-4 mb-2">{children}</h3>,
                    ul: ({children}) => <ul className="list-disc pl-5 space-y-2 mb-4">{children}</ul>,
                    li: ({children}) => <li className="pl-1 text-slate-300">{children}</li>,
                    strong: ({children}) => <span className="font-bold text-slate-100">{children}</span>,
                    code: ({children}) => <code className="bg-slate-950 px-1 py-0.5 rounded text-red-300 font-mono text-xs border border-slate-800">{children}</code>
                   }}
                 >
                   {analysisResult}
                 </ReactMarkdown>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default LogAnalyzerView;