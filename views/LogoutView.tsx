import React, { useEffect, useState } from 'react';
import { Shield, Power, ArrowRight, Activity, Lock } from 'lucide-react';

interface LogoutViewProps {
  onComplete: () => void;
}

const LogoutView: React.FC<LogoutViewProps> = ({ onComplete }) => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-mono relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.05),transparent_70%)] pointer-events-none"></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="bg-slate-900 border-2 border-slate-800 rounded-xl shadow-2xl overflow-hidden">
          {/* Top Status Bar */}
          <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-slate-700"></div>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Session Offline</span>
            </div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest">Status: Disconnected</div>
          </div>

          <div className="p-8 text-center">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center relative">
                <Power className="text-slate-500 w-10 h-10" />
                <div className="absolute inset-0 border border-red-500/10 rounded-full animate-ping opacity-10"></div>
              </div>
            </div>

            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Session Terminated</h2>
            
            <div className="space-y-4 mb-8">
              <p className="text-sm text-slate-400 leading-relaxed">
                Your encrypted session has been safely closed. All temporary buffers have been purged from memory.
              </p>
              
              <div className="flex items-center justify-center gap-4 py-4 border-y border-slate-800/50">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Security</span>
                  <Lock size={16} className="text-emerald-500" />
                </div>
                <div className="w-px h-8 bg-slate-800"></div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Integrity</span>
                  <Activity size={16} className="text-blue-500" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest">
                Redirecting to terminal in <span className="text-red-500 font-bold">{countdown}s</span>
              </div>
              
              <button
                onClick={onComplete}
                className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all border border-slate-700"
              >
                Return to Entry Point
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Bottom Hardware Details */}
          <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex justify-center">
            <span className="text-[8px] text-slate-700 uppercase tracking-[0.3em]">AEGIS_PROTOCOL_V2 // SECURE_PURGE_COMPLETE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutView;
