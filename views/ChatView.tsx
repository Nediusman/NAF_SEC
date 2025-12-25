import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Send, Trash2, StopCircle } from 'lucide-react';
import { Message, Sender } from '../types';
import ChatMessage from '../components/ChatMessage';
import { sendMessageStream } from '../services/geminiService';
import { INITIAL_GREETING } from '../constants';

const STORAGE_KEY = 'naf_sec_chat_history';

const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }));
      }
    } catch (error) {
      console.warn("Failed to load chat history:", error);
    }
    return [{
      id: 'init',
      sender: Sender.AI,
      content: INITIAL_GREETING,
      timestamp: new Date()
    }];
  });

  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Robust scrolling logic
  const scrollToBottom = (instant = false) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: instant ? 'auto' : 'smooth', 
        block: 'end' 
      });
    }
  };

  // Scroll on mount (instant)
  useLayoutEffect(() => {
    scrollToBottom(true);
  }, []);

  // Scroll on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages.length, isProcessing]);

  // Optimize LocalStorage: Debounce saves to avoid blocking rendering during streaming
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }, 1000); // Wait for 1 second of inactivity before saving

    return () => clearTimeout(timeoutId);
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
      let lastUpdate = 0;

      await sendMessageStream(history, userMsg.content, (textChunk) => {
        accumulatedText += textChunk;
        
        // Throttling: Only update React state every 50ms to prevent UI freezing
        const now = Date.now();
        if (now - lastUpdate > 50) {
          setMessages(prev => prev.map(m => 
            m.id === aiMsgId 
              ? { ...m, content: accumulatedText } 
              : m
          ));
          lastUpdate = now;
        }
      });
      
      // Final update to ensure complete message is shown and streaming stops
      setMessages(prev => prev.map(m => 
        m.id === aiMsgId 
          ? { ...m, content: accumulatedText, isStreaming: false } 
          : m
      ));

    } catch (error: any) {
      let cleanError = error.message || "Unknown connection error";
      if (typeof cleanError === 'string') {
         if (cleanError.includes('429') || cleanError.toLowerCase().includes('quota') || cleanError.includes('RESOURCE_EXHAUSTED')) {
            cleanError = "⚠️ **Quota Limit Reached**\n\nThe shared API Key has been exhausted. \n\n**FIX:** Click the **Settings/Config** button in the sidebar and enter your own free Google Gemini API Key for unlimited access.";
         } else {
             try {
                const jsonMatch = cleanError.match(/{.*}/s);
                if (jsonMatch) {
                    const parsed = JSON.parse(jsonMatch[0]);
                    if (parsed.error?.message) cleanError = parsed.error.message;
                }
             } catch (e) {}
         }
      }

      setMessages(prev => prev.map(m => 
        m.id === aiMsgId 
          ? { ...m, content: `**System Error:** ${cleanError}`, isStreaming: false } 
          : m
      ));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-slate-950/50">
      {/* Messages Area - Removed scroll-smooth from CSS to prevent fighting with JS scroll */}
      {/* touch-pan-y allows vertical scrolling even if body has touch-action: none */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 min-h-0 touch-pan-y"
      >
        <div className="max-w-4xl mx-auto">
          {messages.map(msg => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/80 backdrop-blur-sm flex-shrink-0 z-10">
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
              placeholder="Enter command or query..."
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