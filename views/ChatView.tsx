import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, StopCircle } from 'lucide-react';
import { Message, Sender } from '../types';
import ChatMessage from '../components/ChatMessage';
import { sendMessageStream } from '../services/geminiService';
import { INITIAL_GREETING } from '../constants';

const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      sender: Sender.AI,
      content: INITIAL_GREETING,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleClear = () => {
    setMessages([{
      id: Date.now().toString(),
      sender: Sender.AI,
      content: INITIAL_GREETING,
      timestamp: new Date()
    }]);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isProcessing) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: Sender.USER,
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsProcessing(true);

    // Prepare history for API
    const history = messages.map(m => ({
      role: m.sender === Sender.USER ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    const aiMsgId = (Date.now() + 1).toString();
    const aiMsg: Message = {
      id: aiMsgId,
      sender: Sender.AI,
      content: '',
      timestamp: new Date(),
      isStreaming: true
    };

    setMessages(prev => [...prev, aiMsg]);

    try {
      let accumulatedText = '';
      await sendMessageStream(history, userMsg.content, (textChunk) => {
        accumulatedText += textChunk;
        setMessages(prev => prev.map(m => 
          m.id === aiMsgId 
            ? { ...m, content: accumulatedText } 
            : m
        ));
      });
      
      // Finalize message
      setMessages(prev => prev.map(m => 
        m.id === aiMsgId 
          ? { ...m, isStreaming: false } 
          : m
      ));

    } catch (error: any) {
      const isMissingKey = error.message === 'API_KEY_MISSING';
      let cleanError = error.message || "Unknown connection error";
      
      // Attempt to clean up JSON error dumps from the API
      if (typeof cleanError === 'string' && (cleanError.includes('{') || cleanError.includes('Quota exceeded'))) {
         if (cleanError.includes('429') || cleanError.toLowerCase().includes('quota') || cleanError.includes('RESOURCE_EXHAUSTED')) {
            cleanError = "⚠️ **System Overload (Rate Limit 429)**\n\nThe AI model is currently experiencing heavy traffic or your key has exceeded its free tier quota. Please wait a moment before trying again, or try a different command.";
         } else {
             // Try to extract just the message if possible, otherwise truncate
             try {
                const jsonMatch = cleanError.match(/{.*}/s);
                if (jsonMatch) {
                    const parsed = JSON.parse(jsonMatch[0]);
                    if (parsed.error?.message) cleanError = parsed.error.message;
                }
             } catch (e) {
                 // Keep original if parse fails
             }
         }
      }

      const errorMessage = isMissingKey 
        ? "**Configuration Required**\n\nGoogle Gemini API Key is not configured. Please click the **API Config** button (Key Icon) in the top-right corner of the window to enter your key." 
        : `**System Error:** ${cleanError}`;

      setMessages(prev => prev.map(m => 
        m.id === aiMsgId 
          ? { ...m, content: errorMessage, isStreaming: false } 
          : m
      ));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/50">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
        <div className="max-w-4xl mx-auto">
          {messages.map(msg => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
            <button
              type="button"
              onClick={handleClear}
              className="p-3 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="Clear Session"
            >
              <Trash2 size={20} />
            </button>
            
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter command or query (e.g., 'Explain SQL Injection', 'Generate Nmap script')..."
              className="flex-1 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono text-sm shadow-inner"
              disabled={isProcessing}
            />

            <button
              type="submit"
              disabled={!inputValue.trim() || isProcessing}
              className={`p-3 rounded-lg transition-all ${
                !inputValue.trim() || isProcessing
                  ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]'
              }`}
            >
              {isProcessing ? <StopCircle size={20} className="animate-pulse" /> : <Send size={20} />}
            </button>
          </form>
          <div className="text-center mt-2">
             <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
               Secured Connection • Monitoring Active
             </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatView;