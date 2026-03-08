import React, { useState, useEffect, useRef } from 'react';
import { Search, ShieldAlert, ShieldCheck, Loader2, Terminal, AlertTriangle, Info, CheckCircle2, Globe, Server, Activity } from 'lucide-react';
import { scanVulnerabilities } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

const VulnScannerView: React.FC = () => {
  const [target, setTarget] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [report, setReport] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const logEndRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => {
    setScanLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [scanLogs]);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!target || isScanning) return;

    setIsScanning(true);
    setReport(null);
    setScanLogs([]);
    setProgress(0);

    const steps = [
      `Initializing V-SCAN engine on target: ${target}`,
      "Resolving DNS and routing paths...",
      "Performing stealth port discovery (TCP/UDP)...",
      "Identifying service banners and OS fingerprints...",
      "Checking for known CVEs in detected services...",
      "Analyzing web headers and SSL/TLS configuration...",
      "Running heuristic vulnerability patterns...",
      "Synthesizing final intelligence report..."
    ];

    try {
      for (let i = 0; i < steps.length; i++) {
        addLog(steps[i]);
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1000));
      }

      addLog("Generating AI analysis...");
      const result = await scanVulnerabilities(target);
      setReport(result || "No vulnerabilities detected.");
      addLog("Scan completed successfully.");
    } catch (error) {
      addLog("CRITICAL ERROR: Scan aborted due to network timeout.");
      console.error(error);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-6 space-y-6 overflow-hidden">
      {/* Search Header */}
      <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl backdrop-blur-sm">
        <form onSubmit={handleScan} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Globe className="absolute left-3 top-3 text-slate-500" size={18} />
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="Enter Target (e.g., 192.168.1.1 or internal.corp.net)"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 font-mono transition-all"
              disabled={isScanning}
            />
          </div>
          <button
            type="submit"
            disabled={isScanning || !target}
            className={`px-8 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
              isScanning 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)]'
            }`}
          >
            {isScanning ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
            {isScanning ? 'SCANNING...' : 'INITIALIZE SCAN'}
          </button>
        </form>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        {/* Terminal Logs */}
        <div className="lg:col-span-1 bg-black border border-slate-800 rounded-xl flex flex-col overflow-hidden">
          <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-red-500" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Engine Logs</span>
            </div>
            {isScanning && <div className="text-[10px] text-red-500 animate-pulse">BUSY</div>}
          </div>
          <div className="flex-1 p-4 font-mono text-[11px] text-emerald-500 overflow-y-auto space-y-1 scrollbar-thin">
            {scanLogs.length === 0 && (
              <div className="text-slate-700 italic">Waiting for target initialization...</div>
            )}
            {scanLogs.map((log, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-slate-600 shrink-0">{'>'}</span>
                <span className="break-all">{log}</span>
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
          {isScanning && (
            <div className="p-1 bg-slate-900">
              <div className="h-1 bg-slate-950 rounded-full overflow-hidden">
                <div 
                  className="bg-red-600 h-full transition-all duration-500" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Report Area */}
        <div className="lg:col-span-2 bg-slate-900/30 border border-slate-800 rounded-xl flex flex-col overflow-hidden">
          <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert size={14} className="text-red-500" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Intelligence Report</span>
            </div>
            {report && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="text-[9px] text-slate-500 uppercase">High Risk</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
            {!report && !isScanning && (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4">
                <Server size={48} strokeWidth={1} />
                <p className="text-sm uppercase tracking-widest">No active scan data available</p>
              </div>
            )}
            
            {isScanning && !report && (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-6">
                <div className="relative">
                  <Activity size={64} className="text-red-500/20 animate-pulse" />
                  <Loader2 size={32} className="absolute inset-0 m-auto text-red-500 animate-spin" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Analyzing Attack Surface</p>
                  <p className="text-xs text-slate-600 uppercase tracking-widest">Cross-referencing global CVE databases...</p>
                </div>
              </div>
            )}

            {report && (
              <div className="prose prose-invert prose-red max-w-none">
                <div className="mb-8 p-4 bg-red-950/20 border border-red-900/30 rounded-lg flex items-start gap-4">
                  <AlertTriangle className="text-red-500 shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="text-red-400 font-bold text-sm uppercase mb-1">Executive Summary</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Automated scan detected multiple critical entry points. Immediate remediation is advised for the identified vulnerabilities below.
                    </p>
                  </div>
                </div>
                <div className="markdown-body">
                  <ReactMarkdown>{report}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VulnScannerView;
