import React, { useState, useEffect } from 'react';
import { Shield, Lock, User, ArrowRight, AlertCircle, Activity, Cpu, Github } from 'lucide-react';

interface LoginViewProps {
  onLogin: (password: string) => void;
  onBack: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin, onBack }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setIsAuthenticating(true);
    // Simulate a hardware-like authentication delay
    setTimeout(() => {
      if (password === 'admin' || password === 'security') {
        onLogin(password);
      } else {
        setError(true);
        setIsAuthenticating(false);
        setTimeout(() => setError(false), 3000);
      }
    }, 1500);
  };

  const handleGithubLogin = async () => {
    try {
      setIsAuthenticating(true);
      const response = await fetch('/api/auth/github/url');
      if (!response.ok) throw new Error('Failed to get auth URL');
      const { url } = await response.json();

      // Open popup
      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      const authWindow = window.open(
        url,
        'github_oauth',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      if (!authWindow) {
        alert('Please allow popups to login with GitHub');
        setIsAuthenticating(false);
      }
    } catch (err) {
      console.error(err);
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-mono">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.05),transparent_70%)] pointer-events-none"></div>
      
      <div className="w-full max-w-md relative">
        {/* Hardware Frame */}
        <div className="bg-slate-900 border-2 border-slate-800 rounded-xl shadow-2xl overflow-hidden">
          {/* Top Status Bar */}
          <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">System Secure</span>
            </div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest">Node: 0x7F-001</div>
          </div>

          <div className="p-8">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center relative">
                <Shield className="text-red-500 w-8 h-8" />
                <div className="absolute inset-0 border border-red-500/20 rounded-full animate-ping opacity-20"></div>
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">Operator Access</h2>
              <p className="text-xs text-slate-500 uppercase tracking-widest">Identify yourself to initialize AEGIS</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-slate-500 group-focus-within:text-red-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    disabled
                    value="ROOT_OPERATOR"
                    className="block w-full pl-10 pr-3 py-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 text-sm focus:outline-none opacity-50 cursor-not-allowed"
                  />
                </div>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-500 group-focus-within:text-red-500 transition-colors" />
                  </div>
                  <input
                    type="password"
                    autoFocus
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="ENTER ACCESS KEY"
                    className={`block w-full pl-10 pr-3 py-3 bg-slate-950 border ${error ? 'border-red-500' : 'border-slate-800'} rounded-lg text-white text-sm focus:outline-none focus:border-red-500 transition-all placeholder:text-slate-700`}
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-500 text-[10px] uppercase tracking-widest animate-in fade-in slide-in-from-top-1">
                  <AlertCircle size={14} />
                  <span>Access Denied: Invalid Credentials</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isAuthenticating || !password}
                className={`w-full py-4 rounded-lg font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${
                  isAuthenticating 
                    ? 'bg-slate-800 text-slate-500 cursor-wait' 
                    : 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.2)]'
                }`}
              >
                {isAuthenticating ? (
                  <>
                    <Activity size={16} className="animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    Initialize Session
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <button
              onClick={onBack}
              className="w-full mt-6 text-[10px] text-slate-600 hover:text-slate-400 uppercase tracking-widest transition-colors"
            >
              Return to Public Terminal
            </button>
          </div>

          {/* Bottom Hardware Details */}
          <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex justify-between items-center">
            <div className="flex gap-4">
              <div className="flex items-center gap-1">
                <Cpu size={12} className="text-slate-700" />
                <span className="text-[8px] text-slate-700 uppercase">CPU: 9%</span>
              </div>
              <div className="flex items-center gap-1">
                <Activity size={12} className="text-slate-700" />
                <span className="text-[8px] text-slate-700 uppercase">NET: OK</span>
              </div>
            </div>
            <div className="text-[8px] text-slate-700 uppercase">Ver: 2.5.0-STABLE</div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-red-500/20 rounded-tl-lg"></div>
        <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-red-500/20 rounded-br-lg"></div>
      </div>
    </div>
  );
};

export default LoginView;
