import React from 'react';
import { Shield, ChevronLeft, FileText, Lock, Globe, AlertTriangle } from 'lucide-react';
import { AppView } from '../types';

interface LegalViewProps {
  type: AppView.PROTOCOL | AppView.TERMS | AppView.PRIVACY;
  onBack: () => void;
}

const LegalView: React.FC<LegalViewProps> = ({ type, onBack }) => {
  const getContent = () => {
    switch (type) {
      case AppView.PROTOCOL:
        return {
          title: "AEGIS SECURITY PROTOCOL v2.0",
          subtitle: "Standard Operating Procedures for Neural-Enhanced Terminals",
          sections: [
            {
              header: "01. ACCESS CONTROL",
              content: "Access to the NAF_SEC_AEGIS terminal is restricted to authorized operators only. Multi-factor authentication is mandatory for all root-level operations. Unauthorized access attempts are logged and reported to the central neural hub."
            },
            {
              header: "02. DATA INTEGRITY",
              content: "All data processed through the AEGIS core is encrypted using AES-256-GCM. Operators must ensure that data integrity is maintained during all offensive and defensive simulations. Any detected corruption will trigger an automatic session purge."
            },
            {
              header: "03. OPERATIONAL ETHICS",
              content: "The terminal is provided for security research and training purposes only. Operators are strictly prohibited from using AEGIS tools for malicious activities against non-simulated targets. Compliance with global cybersecurity laws is required."
            }
          ]
        };
      case AppView.TERMS:
        return {
          title: "TERMS OF ENGAGEMENT",
          subtitle: "Legal Framework for Terminal Operation",
          sections: [
            {
              header: "01. ACCEPTANCE OF TERMS",
              content: "By initializing a session, you agree to be bound by these Terms of Engagement. If you do not agree, you must terminate the session immediately and purge all local artifacts."
            },
            {
              header: "02. LICENSE TO OPERATE",
              content: "NAF_SEC grants you a limited, non-exclusive, non-transferable license to access the terminal for professional security assessment purposes. This license is revocable at any time upon detection of protocol violations."
            },
            {
              header: "03. LIMITATION OF LIABILITY",
              content: "NAF_SEC shall not be liable for any damages resulting from the use or inability to use the terminal. Operators assume all risks associated with offensive security simulations."
            }
          ]
        };
      case AppView.PRIVACY:
        return {
          title: "PRIVACY MANIFESTO",
          subtitle: "Data Handling and Anonymization Standards",
          sections: [
            {
              header: "01. DATA COLLECTION",
              content: "We collect minimal operational metadata required to maintain session stability. This includes neural load metrics, uplink latency, and command history. We do not collect personally identifiable information (PII)."
            },
            {
              header: "02. LOCAL STORAGE",
              content: "API keys and session preferences are stored locally in your browser's vault. This data never leaves your machine. Purging your session will remove all local artifacts."
            },
            {
              header: "03. THIRD-PARTY UPLINKS",
              content: "AI processing is handled via secure uplinks to Google's Gemini neural network. Data sent for analysis is subject to their standard privacy protections for enterprise-grade AI services."
            }
          ]
        };
      default:
        return { title: "", subtitle: "", sections: [] };
    }
  };

  const { title, subtitle, sections } = getContent();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-mono p-6 md:p-12 selection:bg-red-500/30">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-800 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-red-500">
              <Shield size={24} />
              <span className="text-xs font-bold tracking-[0.3em] uppercase">NAF_SEC_AEGIS // LEGAL</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white">{title}</h1>
            <p className="text-slate-500 text-xs uppercase tracking-widest">{subtitle}</p>
          </div>
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 border border-slate-800 rounded hover:bg-slate-800 transition-all text-xs font-bold uppercase tracking-widest"
          >
            <ChevronLeft size={16} />
            Return to Entry
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 gap-12">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-4 group">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded bg-red-950/30 border border-red-900/50 flex items-center justify-center text-red-500 font-bold text-xs">
                  {idx + 1}
                </div>
                <h2 className="text-lg font-bold text-white uppercase tracking-widest group-hover:text-red-500 transition-colors">
                  {section.header}
                </h2>
              </div>
              <p className="text-slate-400 leading-relaxed pl-12 border-l border-slate-800">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="pt-12 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 text-[10px] text-slate-600 uppercase tracking-widest">
            <Lock size={12} />
            <span>Document Classification: RESTRICTED</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-[10px] text-slate-600 uppercase tracking-widest">
              <Globe size={12} />
              <span>Global Jurisdiction</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-red-900/50 uppercase tracking-widest font-bold">
              <AlertTriangle size={12} />
              <span>Non-Negotiable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalView;
