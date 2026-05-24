'use client';

import { useState, useRef, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_PROFESSOR_API_URL || 'https://codigo-fluente-backend.onrender.com';

interface Message {
  role: 'user' | 'professor';
  content: string;
  typing?: boolean;
}

const SAUDACOES = [
  'Oi! Sou o Neo, seu guia no Código Fluente. O que você quer aprender hoje?',
  'E aí! Aqui é o Neo. Tô aqui pra te ajudar a navegar pelos cursos. O que precisa?',
  'Fala! Sou o Neo. Me pergunta sobre qualquer curso do Código Fluente que eu te ajudo.',
  'Oi! Neo aqui. Quer achar uma aula, tirar dúvida ou saber por onde começar?',
  'E aí, dev! Aqui é o Neo. Bora codar? Me diz o que tá precisando.',
  'Fala! Neo na área. Procurando alguma aula específica ou quer uma dica de rota de estudos?',
];

function getSaudacao(): string {
  return SAUDACOES[Math.floor(Math.random() * SAUDACOES.length)];
}

function getSessionId(): string {
  if (typeof window === 'undefined') return 'ssr';
  let id = localStorage.getItem('cf_professor_session');
  if (!id) {
    id = 'aluno_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('cf_professor_session', id);
  }
  return id;
}

function useTypewriter(text: string, active: boolean, speed = 30) {
  const [displayed, setDisplayed] = useState(() => active ? '' : text);
  const [done, setDone] = useState(() => !active);

  useEffect(() => {
    if (!active) return;

    setDisplayed('');
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, active, speed]);

  return { 
    displayed: active ? displayed : text, 
    done: active ? done : true 
  };
}

function TypewriterMessage({ content, active }: { content: string; active: boolean }) {
  const { displayed } = useTypewriter(content, active);
  return <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{displayed}</span>;
}

function TypingDots() {
  return (
    <span style={{ display: 'inline-flex', gap: '4px', alignItems: 'center', padding: '2px 0' }}>
      {[0, 1, 2].map(i => (
        <span
          key={i}
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#00f5ff',
            display: 'inline-block',
            animation: `cf-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes cf-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </span>
  );
}

export default function ProfessorChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'professor',
      content: getSaudacao(),
      typing: true,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastProfessorIndex, setLastProfessorIndex] = useState<number | null>(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Acorda o Render assim que o componente monta
  useEffect(() => {
    fetch(`${API_URL}/health`).catch(() => {});
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setLoading(true);

    // Simula delay humano antes de "começar a digitar" (600-1200ms)
    await new Promise(r => setTimeout(r, 600 + Math.random() * 600));

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 40000);

      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: getSessionId(),
          message: text,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      setMessages(prev => {
        const newMessages = [...prev, { role: 'professor' as const, content: data.response, typing: true }];
        setLastProfessorIndex(newMessages.length - 1);
        return newMessages;
      });
    } catch (err: unknown) {
      const isTimeout = err instanceof Error && err.name === 'AbortError';
      setMessages(prev => {
        const newMessages = [...prev, {
          role: 'professor' as const,
          content: isTimeout
            ? 'Opa, o servidor tava cochilando. Manda a mensagem de novo que agora vai!'
            : 'Puts, tive um problema técnico aqui. Tenta de novo em instantes!',
          typing: true,
        }];
        setLastProfessorIndex(newMessages.length - 1);
        return newMessages;
      });
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      {/* Botão flutuante */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Abrir chat com Neo"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: open ? '#1a1a2e' : '#00f5ff',
          border: open ? '2px solid #00f5ff' : 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(0,245,255,0.4)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '22px',
          transition: 'all 0.25s cubic-bezier(.34,1.56,.64,1)',
          color: open ? '#00f5ff' : '#000',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.12)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        {open ? '✕' : '🎓'}
      </button>

      {/* Janela do chat */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '24px',
            width: 'calc(100vw - 48px)',
            maxWidth: '360px',
            maxHeight: 'min(520px, calc(100vh - 180px))',
            background: '#1a1a2e',
            border: '1px solid #00f5ff33',
            borderRadius: '16px',
            boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
            zIndex: 9998,
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'monospace',
            overflow: 'hidden',
            animation: 'cf-slide-up 0.25s cubic-bezier(.34,1.56,.64,1)',
          }}
        >
          <style>{`
            @keyframes cf-slide-up {
              from { opacity: 0; transform: translateY(20px) scale(0.97); }
              to   { opacity: 1; transform: translateY(0) scale(1); }
            }
          `}</style>

          {/* Header */}
          <div style={{
            padding: '12px 16px',
            background: '#00f5ff15',
            borderBottom: '1px solid #00f5ff22',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <span style={{ fontSize: '20px' }}>🎓</span>
            <div>
              <div style={{ color: '#00f5ff', fontWeight: 'bold', fontSize: '14px' }}>
                Neo — Código Fluente
              </div>
              <div style={{ color: '#666', fontSize: '11px' }}>
                {loading ? (
                  <span style={{ color: '#00f5ff88' }}>digitando<TypingDots /></span>
                ) : 'Tire dúvidas sobre os cursos'}
              </div>
            </div>
          </div>

          {/* Mensagens */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}>
                <div style={{
                  maxWidth: '80%',
                  padding: '10px 14px',
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.role === 'user' ? '#00f5ff' : '#2a2a4a',
                  color: msg.role === 'user' ? '#000' : '#e0e0e0',
                  fontSize: '13px',
                  lineHeight: '1.5',
                }}>
                  {msg.role === 'professor' && msg.typing && i === lastProfessorIndex ? (
                    <TypewriterMessage content={msg.content} active={true} />
                  ) : (
                    <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{msg.content}</span>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '16px 16px 16px 4px',
                  background: '#2a2a4a',
                }}>
                  <TypingDots />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '12px',
            borderTop: '1px solid #00f5ff22',
            display: 'flex',
            gap: '8px',
          }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Pergunte sobre os cursos..."
              rows={1}
              style={{
                flex: 1,
                background: '#2a2a4a',
                border: '1px solid #00f5ff33',
                borderRadius: '8px',
                color: '#e0e0e0',
                padding: '8px 12px',
                fontSize: '13px',
                fontFamily: 'monospace',
                resize: 'none',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.target.style.borderColor = '#00f5ff88')}
              onBlur={e => (e.target.style.borderColor = '#00f5ff33')}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                background: loading || !input.trim() ? '#333' : '#00f5ff',
                border: 'none',
                borderRadius: '8px',
                color: loading || !input.trim() ? '#555' : '#000',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                padding: '8px 14px',
                fontSize: '16px',
                transition: 'all 0.2s',
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}