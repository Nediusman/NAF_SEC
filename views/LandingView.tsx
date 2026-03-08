import React, { useState, useEffect } from 'react';
import { Shield, Terminal, Lock, ChevronRight, Activity, Cpu, Globe, Zap, Target, BarChart3, Fingerprint, Database, ShieldAlert } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-950 text-slate-200 font-mono overflow-y-auto selection:bg-red-500/30 scrollbar-hide">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(239,68,68,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(15,23,42,0)_0%,rgba(15,23,42,1)_100%)] pointer-events-none"></div>

      {/* Top Status Bar */}
      <div className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Shield className="text-red-500 w-5 h-5" />
          <span className="text-xs font-bold tracking-[0.3em] uppercase">NAF_SEC_AEGIS // AEGIS-V2</span>
        </div>
        <div className="flex items-center gap-6 text-[10px] text-slate-500 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <Activity size={12} className="text-emerald-500" />
            <span>Uplink: Active</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Cpu size={12} className="text-blue-500" />
            <span>Load: 12%</span>
          </div>
          <button 
            onClick={onLogin}
            className="px-4 py-1 border border-red-900/50 rounded text-red-500 hover:bg-red-500 hover:text-white transition-all text-[9px] font-bold"
          >
            OPERATOR_LOGIN
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] p-6 border-b border-slate-900">
        <div className="max-w-6xl w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7 space-y-10">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-3 px-3 py-1 bg-red-950/30 border border-red-900/50 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                  <span className="text-[10px] text-red-400 font-bold uppercase tracking-[0.3em]">System Restricted // Level 5</span>
                </div>
                <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase leading-[0.8] text-white">
                  NAF__<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">SECURITY</span>
                </h1>
              </div>

              <p className="text-slate-400 text-xl leading-relaxed max-w-xl border-l-4 border-red-600 pl-8 italic">
                "The ultimate AI-driven terminal for offensive security, threat intelligence, and adversary simulation."
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 pt-4">
                <button 
                  onClick={onLogin}
                  className="group relative flex items-center justify-center bg-red-600 hover:bg-red-500 text-white px-12 py-6 rounded-none font-black text-sm transition-all overflow-hidden shadow-[0_0_40px_rgba(220,38,38,0.4)] skew-x-[-12deg]"
                >
                  <div className="skew-x-[12deg] flex items-center gap-4">
                    <span className="tracking-[0.3em] uppercase">Initialize Access</span>
                    <ChevronRight className="group-hover:translate-x-2 transition-transform" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </button>

                <div className="flex items-center gap-4 px-8 py-4 border border-slate-800 bg-slate-900/20 backdrop-blur-sm">
                  <Fingerprint size={24} className="text-slate-600" />
                  <div className="text-[10px] uppercase tracking-widest text-slate-500 leading-tight">
                    <span className="text-white font-bold block">Biometric Sync</span>
                    Encrypted Auth Required
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="bg-slate-900/40 border border-slate-800 p-1 rounded-xl backdrop-blur-xl">
                <div className="bg-slate-950 rounded-lg p-6 space-y-8 border border-slate-800">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-2">
                      <Zap size={14} className="text-yellow-500" />
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest">Neural Core Status</span>
                    </div>
                    <span className="text-[10px] text-emerald-500 font-bold">ONLINE</span>
                  </div>
                  
                  <div className="space-y-4">
                    <MetricBar label="AI Processing" value={88} color="bg-blue-500" />
                    <MetricBar label="Threat Detection" value={94} color="bg-red-500" />
                    <MetricBar label="Encryption Strength" value={100} color="bg-emerald-500" />
                  </div>

                  <div className="bg-black/80 p-4 rounded border border-slate-800 font-mono text-[9px] text-emerald-500/80 space-y-1 h-40 overflow-hidden">
                    <div>{'>'} INITIALIZING AEGIS_V2...</div>
                    <div>{'>'} LOADING MITRE_ATTACK_DB...</div>
                    <div>{'>'} SYNCING GLOBAL_THREAT_FEED...</div>
                    <div>{'>'} KERNEL_INTEGRITY: [SECURE]</div>
                    <div>{'>'} NEURAL_WEIGHTS: [OPTIMIZED]</div>
                    <div className="animate-pulse">{'>'} WAITING_FOR_OPERATOR_CREDENTIALS...</div>
                    <div className="text-slate-700">_ system_uptime: 142:12:04</div>
                  </div>
                </div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-red-600 text-white p-4 font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl rotate-[-5deg]">
                Top Secret // NOFORN
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="relative z-10 py-32 border-b border-slate-900 bg-slate-950/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-20 text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Operational <span className="text-red-500">Capabilities</span></h2>
            <p className="text-slate-500 text-sm uppercase tracking-[0.3em]">Advanced modules for the modern security professional</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Terminal size={32} />}
              title="Root Shell"
              desc="Interactive AI-driven terminal for simulating offensive operations and exploit development."
              tag="Offensive"
            />
            <FeatureCard 
              icon={<ShieldAlert size={32} />}
              title="V-Scan"
              desc="Automated vulnerability assessment engine with real-time intelligence reporting."
              tag="Assessment"
            />
            <FeatureCard 
              icon={<BarChart3 size={32} />}
              title="Threat Intel"
              desc="Deep analysis of system logs and network patterns using advanced heuristic detection."
              tag="Defensive"
            />
            <FeatureCard 
              icon={<Target size={32} />}
              title="War Games"
              desc="Dynamic adversary simulation lab to test your tactical skills against evolving AI threats."
              tag="Training"
            />
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="relative z-10 py-32 border-b border-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <div className="space-y-4">
                <h2 className="text-4xl font-black uppercase tracking-tighter">The <span className="text-red-500">Workflow</span></h2>
                <p className="text-slate-400 leading-relaxed">CyberSentinel streamlines the complex security lifecycle into a unified, AI-enhanced experience.</p>
              </div>

              <div className="space-y-8">
                <WorkflowStep 
                  number="01" 
                  title="Initialize" 
                  desc="Establish a secure uplink to the AEGIS core and configure your operational parameters." 
                />
                <WorkflowStep 
                  number="02" 
                  title="Analyze" 
                  desc="Utilize neural-powered tools to scan targets, analyze logs, and identify critical vulnerabilities." 
                />
                <WorkflowStep 
                  number="03" 
                  title="Neutralize" 
                  desc="Develop and execute mitigation strategies or offensive maneuvers guided by real-time AI intelligence." 
                />
              </div>
            </div>

            <div className="bg-slate-900/20 border border-slate-800 rounded-2xl p-8 relative">
              <div className="absolute -top-4 -right-4 bg-red-600 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                <Shield size={24} />
              </div>
              <div className="space-y-6">
                <h3 className="text-xl font-bold uppercase tracking-widest text-white">System Specifications</h3>
                <div className="grid grid-cols-1 gap-4">
                  <SpecItem label="AI Engine" value="Gemini 2.5 Flash // Neural-Enhanced" />
                  <SpecItem label="Encryption" value="AES-256-GCM // End-to-End" />
                  <SpecItem label="Database" value="MITRE ATT&CK v14.1 // Integrated" />
                  <SpecItem label="Protocol" value="AEGIS Security Protocol v2.0" />
                  <SpecItem label="Latency" value="< 45ms // Global Uplink" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="relative z-10 py-24 bg-slate-900/20 border-b border-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            <MetricBox label="Threats Neutralized" value="1.4M+" />
            <MetricBox label="Active Operators" value="12,840" />
            <MetricBox label="Data Processed" value="4.2 PB" />
            <MetricBox label="System Uptime" value="99.999%" />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 py-40 text-center">
        <div className="max-w-3xl mx-auto px-6 space-y-12">
          <div className="space-y-4">
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white">Ready for <span className="text-red-500">Deployment?</span></h2>
            <p className="text-slate-500 text-lg uppercase tracking-widest">Your terminal is waiting. Initialize your session now.</p>
          </div>
          
          <button 
            onClick={onLogin}
            className="group relative inline-flex items-center justify-center bg-white text-black px-16 py-8 rounded-none font-black text-lg transition-all overflow-hidden hover:bg-red-600 hover:text-white"
          >
            <span className="relative z-10 tracking-[0.4em] uppercase">Enter Terminal</span>
            <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950/80 backdrop-blur-md px-8 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
          <div className="flex items-center gap-3">
            <Shield className="text-red-500 w-6 h-6" />
            <span className="font-bold text-lg tracking-tighter uppercase text-white">NAF_SEC_AEGIS</span>
          </div>
          
          <div className="text-[10px] text-slate-600 uppercase tracking-[0.3em] text-center">
            © 2026 NAF_SEC_AEGIS // ROOT_ACCESS_ONLY // ENCRYPTED_SESSION
          </div>
          
          <div className="flex justify-end gap-8 text-[10px] text-slate-500 uppercase tracking-widest">
            <span className="hover:text-red-500 cursor-pointer transition-colors">Protocol</span>
            <span className="hover:text-red-500 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-red-500 cursor-pointer transition-colors">Terms</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

const MetricBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-[9px] uppercase tracking-widest text-slate-500">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
      <div className={`${color} h-full transition-all duration-1000`} style={{ width: `${value}%` }}></div>
    </div>
  </div>
);

const FeatureCard = ({ icon, title, desc, tag }: { icon: React.ReactNode; title: string; desc: string; tag: string }) => (
  <div className="p-8 border border-slate-900 bg-slate-900/10 rounded-xl hover:border-red-900/50 transition-all group relative overflow-hidden">
    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
      {icon}
    </div>
    <div className="text-red-500 mb-6 group-hover:scale-110 transition-transform duration-300">{icon}</div>
    <div className="text-[8px] font-bold text-red-500 uppercase tracking-[0.3em] mb-2">[{tag}]</div>
    <h3 className="text-xl font-bold text-white uppercase tracking-tighter mb-4">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

const WorkflowStep = ({ number, title, desc }: { number: string; title: string; desc: string }) => (
  <div className="flex gap-8 group">
    <div className="text-4xl font-black text-slate-800 group-hover:text-red-600 transition-colors duration-300">{number}</div>
    <div className="space-y-2">
      <h4 className="text-lg font-bold text-white uppercase tracking-widest">{title}</h4>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  </div>
);

const SpecItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center py-3 border-b border-slate-800/50 last:border-0">
    <span className="text-[10px] text-slate-500 uppercase tracking-widest">{label}</span>
    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{value}</span>
  </div>
);

const MetricBox = ({ label, value }: { label: string; value: string }) => (
  <div className="text-center space-y-2">
    <div className="text-4xl font-black text-white tracking-tighter">{value}</div>
    <div className="text-[9px] text-slate-600 uppercase tracking-[0.4em]">{label}</div>
  </div>
);

export default LandingView;
