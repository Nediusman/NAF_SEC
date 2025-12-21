import React, { useState, useEffect } from 'react';
import { Terminal, Shield, FileSearch, BrainCircuit, Activity, BookOpen, Key, X, Check } from 'lucide-react';
import ChatView from './views/ChatView';
import LogAnalyzerView from './views/LogAnalyzerView';
import QuizView from './views/QuizView';
import CheatSheetView from './views/CheatSheetView';
import { AppView } from './types';
import { saveApiKey, hasApiKey } from './services/geminiService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.CHAT);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [isKeySaved, setIsKeySaved] = useState(false);

  useEffect(() => {
    // Check if key exists on mount
    if (localStorage.getItem('gemini_api_key')) {
      setApiKeyInput(localStorage.getItem('gemini_api_key') || '');
    }
  }, []);

  const handleSaveKey = () => {
    if (apiKeyInput.trim()) {
      saveApiKey(apiKeyInput.trim());
      setIsKeySaved(true);
      setTimeout(() => {
        setIsKeySaved(false);
        setShowKeyModal(false);
      }, 1000);
    }
  };

  const openKeyModal = () => setShowKeyModal(true);

  const renderView = () => {
    switch (currentView) {
      case AppView.CHAT: return <ChatView onOpenApiKeyModal={openKeyModal} />;
      case AppView.LOG_ANALYZER: return <LogAnalyzerView onOpenApiKeyModal={openKeyModal} />;
      case AppView.QUIZ: return <QuizView onOpenApiKeyModal={openKeyModal} />;
      case AppView.CHEAT_SHEET: return <CheatSheetView />;
      default: return <ChatView onOpenApiKeyModal={openKeyModal} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden selection:bg-emerald-500/30">
      {/* Sidebar Navigation */}
      <aside className="w-16 md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-all duration-300">
        <div>
          <div className="h-16 flex items-center justify-center md:justify-start md:px-6 border-b border-slate-800">
            <Shield className="text-emerald-500 w-8 h-8" />
            <span className="hidden md:block ml-3 font-bold text-lg tracking-tight text-white">
              CyberSentinel
            </span>
          </div>

          <nav className="p-2 md:p-4 space-y-2">
            <NavButton 
              active={currentView === AppView.CHAT}
              onClick={() => setCurrentView(AppView.CHAT)}
              icon={<Terminal size={20} />}
              label="Command Center"
            />
            <NavButton 
              active={currentView === AppView.LOG_ANALYZER}
              onClick={() => setCurrentView(AppView.LOG_ANALYZER)}
              icon={<FileSearch size={20} />}
              label="Log Analysis"
            />
            <NavButton 
              active={currentView === AppView.QUIZ}
              onClick={() => setCurrentView(AppView.QUIZ)}
              icon={<BrainCircuit size={20} />}
              label="Training Lab"
            />
            <NavButton 
              active={currentView === AppView.CHEAT_SHEET}
              onClick={() => setCurrentView(AppView.CHEAT_SHEET)}
              icon={<BookOpen size={20} />}
              label="Command Library"
            />
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 hidden md:block">
          <div className="bg-slate-950/50 rounded p-3 text-xs text-slate-500 border border-slate-800">
            <div className="flex items-center gap-2 mb-1 text-emerald-500 font-bold">
              <Activity size={12} /> SYSTEM ONLINE
            </div>
            <p>Gemini-2.5-Flash</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative">
        <header className="h-16 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between px-6 backdrop-blur-sm z-10">
          <h2 className="font-mono text-sm text-emerald-400 font-bold tracking-widest uppercase">
            {currentView === AppView.CHAT && "Interactive Shell // Gemini-2.5-Flash"}
            {currentView === AppView.LOG_ANALYZER && "Threat Detection Module"}
            {currentView === AppView.QUIZ && "Knowledge Validation"}
            {currentView === AppView.CHEAT_SHEET && "Master Reference Guide"}
          </h2>
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setShowKeyModal(true)}
               className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors border border-slate-700 hover:border-slate-500 px-3 py-1.5 rounded-full bg-slate-900"
               title="Configure API Key"
             >
               <Key size={12} />
               <span className="hidden sm:inline">API Config</span>
             </button>
             <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Online
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-hidden relative">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
          {renderView()}
        </div>

        {/* API Key Modal */}
        {showKeyModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl shadow-2xl w-full max-w-md relative animate-in zoom-in-95 duration-200">
              <button 
                onClick={() => setShowKeyModal(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white"
              >
                <X size={20} />
              </button>
              
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Key className="text-emerald-500" /> API Configuration
              </h3>
              
              <p className="text-slate-400 text-sm mb-4">
                Enter your Google Gemini API Key to enable AI features. The key is stored locally in your browser.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-500 mb-1 uppercase">Gemini API Key</label>
                  <input
                    type="password"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full bg-slate-950 border border-slate-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono text-sm"
                  />
                </div>

                <div className="flex gap-3">
                  <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex-1 py-2 text-center text-sm text-slate-400 hover:text-white border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    Get Key
                  </a>
                  <button
                    onClick={handleSaveKey}
                    disabled={!apiKeyInput.trim()}
                    className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                      isKeySaved 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    }`}
                  >
                    {isKeySaved ? <><Check size={16} /> Saved</> : 'Save Configuration'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Helper Component for Navigation
const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 group ${
      active 
        ? 'bg-emerald-900/20 text-emerald-400 border border-emerald-900/50' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    <span className={`${active ? 'text-emerald-400' : 'group-hover:text-white'}`}>{icon}</span>
    <span className="hidden md:block ml-3 font-medium text-sm">{label}</span>
    {active && <div className="ml-auto w-1 h-1 rounded-full bg-emerald-400 hidden md:block shadow-[0_0_8px_rgba(52,211,153,0.8)]" />}
  </button>
);

export default App;