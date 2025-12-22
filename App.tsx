import React, { useState } from 'react';
import { Terminal, Shield, FileSearch, BrainCircuit, Activity, BookOpen, Skull } from 'lucide-react';
import ChatView from './views/ChatView';
import LogAnalyzerView from './views/LogAnalyzerView';
import QuizView from './views/QuizView';
import CheatSheetView from './views/CheatSheetView';
import { AppView } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.CHAT);

  const renderView = () => {
    switch (currentView) {
      case AppView.CHAT: return <ChatView />;
      case AppView.LOG_ANALYZER: return <LogAnalyzerView />;
      case AppView.QUIZ: return <QuizView />;
      case AppView.CHEAT_SHEET: return <CheatSheetView />;
      default: return <ChatView />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden selection:bg-red-500/30">
      {/* Sidebar Navigation */}
      <aside className="w-16 md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-all duration-300">
        <div>
          <div className="h-16 flex items-center justify-center md:justify-start md:px-6 border-b border-slate-800">
            <Skull className="text-red-500 w-8 h-8" />
            <span className="hidden md:block ml-3 font-bold text-lg tracking-tight text-white">
              NAF_SEC <span className="text-red-500 text-xs align-top">RED</span>
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

        <div className="p-4 border-t border-slate-800 hidden md:block">
          <div className="bg-slate-950/50 rounded p-3 text-xs text-slate-500 border border-slate-800">
            <div className="flex items-center gap-2 mb-1 text-red-500 font-bold">
              <Activity size={12} /> MODE: UNRESTRICTED
            </div>
            <p>Gemini-3.0-Pro // ROOT</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative">
        <header className="h-16 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between px-6 backdrop-blur-sm z-10">
          <h2 className="font-mono text-sm text-red-400 font-bold tracking-widest uppercase">
            {currentView === AppView.CHAT && "Interactive Root Shell // VANGUARD"}
            {currentView === AppView.LOG_ANALYZER && "Pattern Analysis & Detection"}
            {currentView === AppView.QUIZ && "Adversary Simulation Lab"}
            {currentView === AppView.CHEAT_SHEET && "Master Attack Library"}
          </h2>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              Live
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-hidden relative">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
          {renderView()}
        </div>
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