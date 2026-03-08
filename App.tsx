import React, { useState, useEffect } from 'react';
import { Terminal, Shield, FileSearch, BrainCircuit, Activity, BookOpen, Skull, Settings, Key, X, Check, Save, ShieldAlert } from 'lucide-react';
import ChatView from './views/ChatView';
import LogAnalyzerView from './views/LogAnalyzerView';
import QuizView from './views/QuizView';
import CheatSheetView from './views/CheatSheetView';
import VulnScannerView from './views/VulnScannerView';
import LandingView from './views/LandingView';
import LoginView from './views/LoginView';
import LogoutView from './views/LogoutView';
import { AppView } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('naf_sec_auth') === 'true';
  });

  const [currentView, setCurrentView] = useState<AppView>(() => {
    if (localStorage.getItem('naf_sec_auth') !== 'true') {
      return AppView.LANDING;
    }
    // Restore last active view from storage
    const savedView = localStorage.getItem('naf_sec_current_view');
    return (savedView as AppView) || AppView.CHAT;
  });
  
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [savedKey, setSavedKey] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('naf_sec_api_key');
    if (stored) setApiKey(stored);
  }, []);

  // Persist current view on change
  useEffect(() => {
    localStorage.setItem('naf_sec_current_view', currentView);
  }, [currentView]);

  // Listen for OAuth messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Validate origin
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost')) {
        return;
      }

      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        console.log('OAuth Success:', event.data);
        handleLogin('github_oauth'); // Use a placeholder or actual user info
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('naf_sec_api_key', apiKey.trim());
      setSavedKey(true);
      setTimeout(() => setSavedKey(false), 2000);
    } else {
      localStorage.removeItem('naf_sec_api_key');
    }
  };

  const handleLogin = (password: string) => {
    // Simple demo auth
    localStorage.setItem('naf_sec_auth', 'true');
    setIsAuthenticated(true);
    setCurrentView(AppView.CHAT);
  };

  const handleLogout = () => {
    localStorage.removeItem('naf_sec_auth');
    setIsAuthenticated(false);
    setCurrentView(AppView.LOGOUT);
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.LANDING: 
        return <LandingView 
          onGetStarted={() => setCurrentView(AppView.LOGIN)} 
          onLogin={() => setCurrentView(AppView.LOGIN)} 
        />;
      case AppView.LOGIN: 
        return <LoginView 
          onLogin={handleLogin} 
          onBack={() => setCurrentView(AppView.LANDING)} 
        />;
      case AppView.LOGOUT:
        return <LogoutView onComplete={() => setCurrentView(AppView.LANDING)} />;
      case AppView.CHAT: return <ChatView />;
      case AppView.LOG_ANALYZER: return <LogAnalyzerView />;
      case AppView.VULN_SCANNER: return <VulnScannerView />;
      case AppView.QUIZ: return <QuizView />;
      case AppView.CHEAT_SHEET: return <CheatSheetView />;
      default: return <ChatView />;
    }
  };

  if (!isAuthenticated && (currentView === AppView.LANDING || currentView === AppView.LOGIN || currentView === AppView.LOGOUT)) {
    return renderView();
  }

  return (
    // FIX: Use h-full w-full because #root is now 100% height. 
    // This prevents 100vh scrollbar issues on mobile/desktop browsers.
    <div className="flex h-full w-full bg-slate-950 text-slate-200 overflow-hidden selection:bg-red-500/30">
      {/* Sidebar Navigation */}
      <aside className="w-16 md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-all duration-300 flex-shrink-0">
        <div>
          <div className="h-16 flex items-center justify-center md:justify-start md:px-6 border-b border-slate-800">
            <Skull className="text-red-500 w-8 h-8" />
            <span className="hidden md:block ml-3 font-bold text-lg tracking-tight text-white">
              NAF_SEC <span className="text-emerald-400 text-xs align-top">AEGIS</span>
            </span>
          </div>

          <nav className="p-2 md:p-4 space-y-2">
            <NavButton 
              active={currentView === AppView.CHAT}
              onClick={() => setCurrentView(AppView.CHAT)}
              icon={<Terminal size={20} />}
              label="Offensive Shell"
            />
            <NavButton 
              active={currentView === AppView.LOG_ANALYZER}
              onClick={() => setCurrentView(AppView.LOG_ANALYZER)}
              icon={<FileSearch size={20} />}
              label="Threat Intel"
            />
            <NavButton 
              active={currentView === AppView.VULN_SCANNER}
              onClick={() => setCurrentView(AppView.VULN_SCANNER)}
              icon={<ShieldAlert size={20} />}
              label="V-Scan"
            />
            <NavButton 
              active={currentView === AppView.QUIZ}
              onClick={() => setCurrentView(AppView.QUIZ)}
              icon={<BrainCircuit size={20} />}
              label="War Games"
            />
            <NavButton 
              active={currentView === AppView.CHEAT_SHEET}
              onClick={() => setCurrentView(AppView.CHEAT_SHEET)}
              icon={<BookOpen size={20} />}
              label="Exploit DB"
            />
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={() => setShowSettings(true)}
            className="w-full flex items-center gap-3 p-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Settings size={20} />
            <span className="hidden md:block font-medium text-sm">Config / API</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-lg text-slate-500 hover:bg-red-900/20 hover:text-red-400 transition-colors"
          >
            <X size={20} />
            <span className="hidden md:block font-medium text-sm">Terminate Session</span>
          </button>
          
          <div className="mt-4 bg-slate-950/50 rounded p-3 text-xs text-slate-500 border border-slate-800 hidden md:block">
            <div className="flex items-center gap-2 mb-1 text-red-500 font-bold">
              <Activity size={12} /> MODE: UNRESTRICTED
            </div>
            <p>Gemini-2.5-Flash // ROOT</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      {/* FIX: min-w-0 prevents flex items from overflowing horizontally */}
      <main className="flex-1 flex flex-col relative min-w-0 h-full">
        <header className="h-16 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between px-6 backdrop-blur-sm z-10 flex-shrink-0">
          <h2 className="font-mono text-sm text-red-400 font-bold tracking-widest uppercase truncate">
            {currentView === AppView.CHAT && "Interactive Root Shell // VANGUARD"}
            {currentView === AppView.LOG_ANALYZER && "Pattern Analysis & Detection"}
            {currentView === AppView.VULN_SCANNER && "Vulnerability Assessment Engine"}
            {currentView === AppView.QUIZ && "Adversary Simulation Lab"}
            {currentView === AppView.CHEAT_SHEET && "Master Attack Library"}
          </h2>
          <div className="flex items-center gap-4 flex-shrink-0">
             <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              Live
            </div>
          </div>
        </header>
        
        {/* FIX: min-h-0 prevents flex items from overflowing vertically */}
        <div className="flex-1 overflow-hidden relative min-h-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
          {renderView()}
        </div>
      </main>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900 border border-red-900/50 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
              <h3 className="font-bold text-slate-100 flex items-center gap-2">
                <Key className="text-red-500" size={18} />
                SYSTEM CONFIGURATION
              </h3>
              <button 
                onClick={() => setShowSettings(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                  Gemini API Key Override
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 font-mono transition-all"
                  />
                  <Key className="absolute left-3 top-3 text-slate-600" size={16} />
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Enter your personal API key to bypass shared quota limits. 
                  Keys are stored locally in your browser.
                  <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline ml-1">
                    Get a key here.
                  </a>
                </p>
              </div>

              <button
                onClick={handleSaveKey}
                className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                  savedKey 
                    ? 'bg-emerald-600 text-white'
                    : 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]'
                }`}
              >
                {savedKey ? <Check size={18} /> : <Save size={18} />}
                {savedKey ? 'CONFIGURATION SAVED' : 'SAVE CONFIGURATION'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Component for Navigation
const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 group ${
      active 
        ? 'bg-red-900/20 text-red-400 border border-red-900/50' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    <span className={`${active ? 'text-red-400' : 'group-hover:text-white'}`}>{icon}</span>
    <span className="hidden md:block ml-3 font-medium text-sm">{label}</span>
    {active && <div className="ml-auto w-1 h-1 rounded-full bg-red-400 hidden md:block shadow-[0_0_8px_rgba(248,113,113,0.8)]" />}
  </button>
);

export default App;