import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Message, Sender } from '../types';
import { Bot, User, Terminal } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = React.memo(({ message }) => {
  const isUser = message.sender === Sender.USER;

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[90%] md:max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded border flex items-center justify-center ${
          isUser 
            ? 'bg-blue-900/30 border-blue-700 text-blue-400' 
            : 'bg-emerald-900/30 border-emerald-700 text-emerald-400'
        }`}>
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>

        {/* Message Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`rounded-lg p-4 text-sm leading-relaxed border ${
            isUser 
              ? 'bg-slate-800 border-slate-700 text-slate-200' 
              : 'bg-slate-900 border-slate-700 text-slate-300 shadow-lg'
          }`}>
            {isUser ? (
              <p className="whitespace-pre-wrap">{message.content}</p>
            ) : (
              <div className="markdown-body">
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <div className="rounded-md overflow-hidden my-3 border border-slate-700">
                           <div className="bg-slate-950 px-3 py-1 text-xs text-slate-400 flex items-center gap-2 border-b border-slate-800">
                             <Terminal size={12} />
                             {match[1]}
                           </div>
                           <SyntaxHighlighter
                            style={vscDarkPlus as any}
                            language={match[1]}
                            PreTag="div"
                            customStyle={{ margin: 0, borderRadius: 0, fontSize: '0.85rem' }}
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        </div>
                      ) : (
                        <code className="bg-slate-800 text-cyan-400 px-1 py-0.5 rounded text-xs font-mono" {...props}>
                          {children}
                        </code>
                      );
                    },
                    p: ({children}) => <p className="mb-3 last:mb-0">{children}</p>,
                    ul: ({children}) => <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>,
                    ol: ({children}) => <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>,
                    li: ({children}) => <li className="pl-1">{children}</li>,
                    h1: ({children}) => <h1 className="text-xl font-bold text-emerald-400 mb-2 mt-4 border-b border-slate-700 pb-1">{children}</h1>,
                    h2: ({children}) => <h2 className="text-lg font-bold text-emerald-500 mb-2 mt-3">{children}</h2>,
                    h3: ({children}) => <h3 className="text-md font-bold text-emerald-600 mb-1 mt-2">{children}</h3>,
                    blockquote: ({children}) => <blockquote className="border-l-4 border-slate-600 pl-4 py-1 my-2 bg-slate-800/50 italic text-slate-400">{children}</blockquote>,
                    table: ({children}) => <div className="overflow-x-auto my-3 border border-slate-700 rounded"><table className="w-full text-left text-xs">{children}</table></div>,
                    thead: ({children}) => <thead className="bg-slate-800 text-slate-300 font-semibold border-b border-slate-700">{children}</thead>,
                    th: ({children}) => <th className="px-4 py-2 border-r border-slate-700 last:border-r-0">{children}</th>,
                    td: ({children}) => <td className="px-4 py-2 border-t border-slate-700 border-r last:border-r-0">{children}</td>,
                  }}
                >
                  {message.content}
                </ReactMarkdown>
                {message.isStreaming && (
                   <span className="inline-block w-2 h-4 ml-1 align-middle bg-emerald-500 animate-pulse" />
                )}
              </div>
            )}
          </div>
          <span className="text-xs text-slate-500 mt-1">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
});

export default ChatMessage;