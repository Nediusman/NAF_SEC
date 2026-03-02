import React, { useState, useEffect } from 'react';
import { Shield, Terminal, Lock, ChevronRight, Activity, Cpu, Globe } from 'lucide-react';

interface LandingViewProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

const LandingView: React.FC<LandingViewProps> = ({ onGetStarted, onLogin }) => {
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanProgress(prev => (prev >= 100 ? 0 : prev + 1));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-mono overflow-hidden relative selection:bg-red-500/30">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(15,23,42,0)_0%,rgba(15,23,42,1)_100%)] pointer-events-none"></div>

      {/* Top Status Bar */}
      <div className="relative z-10 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Shield className="text-red-500 w-5 h-5" />
          <span className="text-xs font-bold tracking-[0.3em] uppercase">CyberSentinel // AEGIS-V2</span>
        </div>
        <div className="flex items-center gap-6 text-[10px] text-slate-500 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <Activity size={12} className="text-emerald-500" />
            <span>Uplink: Active</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu size={12} className="text-blue-500" />
            <span>Load: 12%</span>
          </div>
          <div className="hidden md:block">Node: 0x7F-001</div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-100px)] p-6">
        <div className="max-w-4xl w-full">
          <div className="mb-12 space-y-2">
            <div className="text-red-500 text-xs font-bold tracking-[0.5em] uppercase mb-4">Security Clearance Required</div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
              System <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">Restricted</span>
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
              <p className="text-slate-400 text-sm leading-relaxed max-w-md border-l-2 border-red-900/50 pl-6">
                You are attempting to access a restricted AI-powered cybersecurity terminal. 
                Unauthorized access is strictly prohibited and monitored by AEGIS protocol.
              </p>
              
              <div className="flex flex-col gap-4">
                <button 
                  onClick={onLogin}
                  className="group relative flex items-center justify-between bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded-lg font-bold text-sm transition-all overflow-hidden shadow-[0_0_20px_rgba(220,38,38,0.2)]"
                >
                  <span className="relative z-10 tracking-[0.2em] uppercase">Initialize Access</span>
                  <ChevronRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </button>
                
                <div className="flex items-center gap-4 text-[10px] text-slate-600 uppercase tracking-widest">
                  <div className="w-full h-[1px] bg-slate-800"></div>
                  <span className="whitespace-nowrap">Encryption: AES-256</span>
                  <div className="w-full h-[1px] bg-slate-800"></div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-6 backdrop-blur-sm">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest">System Scan</span>
                <span className="text-[10px] text-red-500 font-bold">{scanProgress}%</span>
              </div>
              
              <div className="space-y-3">
                <ScanLine label="Kernel Integrity" status="Verified" active />
                <ScanLine label="Neural Link" status="Standby" />
                <ScanLine label="Firewall Proxy" status="Active" active />
                <ScanLine label="Identity Vault" status="Locked" />
              </div>

              <div className="pt-4">
                <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden">
                  <div 
                    className="bg-red-600 h-full transition-all duration-300" 
                    style={{ width: `${scanProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full px-8 py-6 flex justify-between items-center text-[10px] text-slate-700 uppercase tracking-[0.2em]">
        <div>© 2026 NAF_SEC_AEGIS // ROOT_ACCESS_ONLY</div>
        <div className="flex gap-8">
          <span>Encrypted Session</span>
          <Globe size={12} />
        </div>
      </footer>
    </div>
  );
};

const ScanLine = ({ label, status, active }: { label: string; status: string; active?: boolean }) => (
  <div className="flex justify-between items-center">
    <span className="text-[10px] text-slate-400 uppercase">{label}</span>
    <span className={`text-[10px] font-bold uppercase ${active ? 'text-emerald-500' : 'text-slate-600'}`}>
      [{status}]
    </span>
  </div>
);

export default LandingView;
