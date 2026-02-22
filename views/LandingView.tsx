import React from 'react';
import { Shield, Zap, Terminal, Lock, ChevronRight } from 'lucide-react';

interface LandingViewProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

const LandingView: React.FC<LandingViewProps> = ({ onGetStarted, onLogin }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-y-auto selection:bg-red-500/30">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-8 md:px-12">
        <div className="flex items-center gap-3">
          <Shield className="text-red-500 w-8 h-8" />
          <span className="font-bold text-xl tracking-tighter uppercase">CyberSentinel</span>
        </div>
        <button 
          onClick={onLogin}
          className="px-6 py-2 border border-white/10 rounded-full text-sm font-medium hover:bg-white hover:text-black transition-all duration-300"
        >
          Operator Login
        </button>
      </nav>

      {/* Hero Section */}
      <main className="px-6 md:px-12 pt-12 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="relative">
            <h1 className="text-[15vw] md:text-[12vw] font-black leading-[0.85] tracking-tighter uppercase opacity-90">
              Secure<br />
              <span className="text-red-500">Intelligence</span>
            </h1>
            <div className="absolute top-0 right-0 hidden lg:block">
              <div className="w-64 h-64 border border-red-500/20 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-48 h-48 border border-red-500/40 rounded-full flex items-center justify-center">
                  <Terminal className="text-red-500 w-12 h-12" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
            <div>
              <p className="text-xl md:text-2xl text-slate-400 font-light leading-relaxed max-w-xl">
                The next generation of AI-powered cybersecurity training and analysis. 
                Built for operators who demand precision, speed, and ethical mastery.
              </p>
              <div className="mt-10 flex flex-wrap gap-6">
                <button 
                  onClick={onGetStarted}
                  className="group flex items-center gap-3 bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-[0_0_30px_rgba(220,38,38,0.3)]"
                >
                  Initialize System
                  <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <StatCard label="Live Threats" value="1.2M+" />
              <StatCard label="Analysis Speed" value="< 50ms" />
              <StatCard label="Active Nodes" value="4,821" />
              <StatCard label="Security Level" value="OMEGA" />
            </div>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="px-6 md:px-12 py-24 bg-slate-900/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <Feature 
            icon={<Terminal className="text-red-500" />}
            title="Offensive Shell"
            desc="Practice penetration testing techniques in a safe, AI-guided sandbox environment."
          />
          <Feature 
            icon={<Zap className="text-emerald-400" />}
            title="Threat Intel"
            desc="Analyze complex logs and patterns with deep-learning powered anomaly detection."
          />
          <Feature 
            icon={<Lock className="text-blue-400" />}
            title="War Games"
            desc="Test your skills against dynamic adversary simulations designed by security experts."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-white/5 text-slate-500 text-xs font-mono uppercase tracking-widest flex flex-col md:flex-row justify-between items-center gap-6">
        <div>© 2026 NAF_SEC_AEGIS // ALL RIGHTS RESERVED</div>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">Protocol</a>
          <a href="#" className="hover:text-white transition-colors">Encryption</a>
          <a href="#" className="hover:text-white transition-colors">Access</a>
        </div>
      </footer>
    </div>
  );
};

const StatCard = ({ label, value }: { label: string; value: string }) => (
  <div className="p-6 border border-white/5 bg-white/5 rounded-2xl">
    <div className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-1">{label}</div>
    <div className="text-2xl font-bold">{value}</div>
  </div>
);

const Feature = ({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) => (
  <div className="space-y-4">
    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
      {icon}
    </div>
    <h3 className="text-xl font-bold">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{desc}</p>
  </div>
);

export default LandingView;
