import React, { useState, useRef, useEffect } from 'react';
import { invokeAIChat } from '@/lib/aiClient';
import { X, Send, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { isPremium } from '@/lib/premium';
import { useNavigate } from 'react-router-dom';

const SYSTEM_PROMPT = `You are The Chess God — an elite AI chess coach inside the Mind Chess app. You have encyclopedic knowledge of everything chess: history, origins, rules, notation, openings, tactics, strategy, endgames, famous players, legendary games, tournaments, chess culture, and psychology. Chess history questions like "when was chess invented", "who invented chess", "how did chess spread to Europe" are absolutely chess topics — answer them fully and enthusiastically. Only deflect questions that are genuinely unrelated to chess (sports, cooking, politics, etc.) with a witty chess-themed redirect. Be enthusiastic, encouraging, and expert-level. Use proper chess notation when relevant (e.g., 1.e4 e5 2.Nf3 Nc6). Keep responses concise but thorough.`;

export default function AIChatPanel({ open, onClose }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hey! I'm your Mind Chess coach ♟️ Ask me anything — openings, tactics, endgames, famous games, strategy... I live and breathe chess. What's on your mind?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    try {
      // Gemini requires first message to be 'user' — strip any leading assistant messages
      const allMessages = [...messages, { role: 'user', content: userMsg }];
      const firstUserIdx = allMessages.findIndex(m => m.role === 'user');
      const chatMessages = allMessages.slice(firstUserIdx).map(m => ({
        role: m.role,
        content: m.content,
      }));
      const response = await invokeAIChat(chatMessages, SYSTEM_PROMPT);
      setMessages(prev => [...prev, { role: 'assistant', content: response || 'Let me think about that...' }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${e?.message ?? e}` }]);
    }
    setLoading(false);
  };

  if (!open) return null;

    // Premium gate — show upgrade prompt inside the panel
  if (!isPremium()) {
    return (
      <div className="fixed inset-0 z-50 flex justify-end">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div className="relative w-full max-w-md bg-card border-l border-primary/20 flex flex-col" style={{ height: '100dvh' }}>
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-bold text-sm">The Chess God</p>
                <p className="text-xs text-muted-foreground">definitely knows more about chess than you</p>
              </div>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-5 p-8 text-center">
            <div className="text-5xl">♟️</div>
            <h2 className="text-xl font-black text-white">Premium Feature</h2>
            <p className="text-gray-400 text-sm max-w-xs">
              The Chess God awaits. Upgrade to Premium to unlock unlimited AI coaching.
            </p>
            <button
              onClick={() => { onClose(); navigate('/upgrade'); }}
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-3 rounded-full transition-colors"
            >
              Unlock Master's Vault — $4.99
            </button>
            <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-300">
              Maybe later
            </button>
          </div>
        </div>
      </div>
    );
  }

return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md bg-card border-l border-primary/20 flex flex-col" style={{ height: '100dvh' }}>
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center teal-glow-sm">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-primary">The Chess god</h3>
              <p className="text-xs text-muted-foreground italic">definitely knows more than you about chess</p>
            </div>
          </div>
          <button onClick={onClose} className="w-11 h-11 flex items-center justify-center text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
          {messages.map((msg, i) => (
            <div key={i} className={msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
              <div className={`max-w-[85%] rounded-lg px-3 py-2 ${msg.role === 'user' ? 'bg-primary/20 text-foreground' : 'bg-secondary text-foreground'}`}>
                {msg.role === 'assistant'
                  ? <div className="text-sm space-y-1 [&_p]:my-1 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_strong]:font-bold [&_code]:bg-background [&_code]:px-1 [&_code]:rounded [&_h1]:font-bold [&_h1]:text-base [&_h2]:font-bold [&_h2]:text-base">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  : <p className="text-sm">{msg.content}</p>}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-secondary rounded-lg px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
          <div className="flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask about chess..."
              className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary teal-border-glow"
            />
            <button onClick={send} disabled={loading || !input.trim()}
              className="bg-primary text-primary-foreground rounded-lg px-3 py-2 disabled:opacity-50 teal-glow-sm">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}