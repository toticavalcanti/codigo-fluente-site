'use client';

import { useState, useRef, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_PROFESSOR_API_URL || 'https://codigo-fluente-backend.onrender.com';

interface Message {
  role: 'user' | 'professor';
  content: string;
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

export default function ProfessorChat() {
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'professor',
      content: 'Olá! Sou o Professor do Código Fluente. Posso te ajudar a encontrar aulas, tirar dúvidas sobre os cursos ou orientar seus estudos. Como posso ajudar?',
    },
  ]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const bottomRef               = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: getSessionId(),
          message: text,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'professor', content: data.response }]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'professor', content: 'Desculpe, tive um problema técnico. Tente novamente em instantes.' },
      ]);
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
        aria-label="Abrir chat do Professor"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: '#00f5ff',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(0,245,255,0.4)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          transition: 'transform 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
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
            width: '360px',
            maxHeight: '520px',
            background: '#1a1a2e',
            border: '1px solid #00f5ff33',
            borderRadius: '16px',
            boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
            zIndex: 9998,
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'monospace',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '12px 16px',
              background: '#00f5ff15',
              borderBottom: '1px solid #00f5ff22',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span style={{ fontSize: '20px' }}>🎓</span>
            <div>
              <div style={{ color: '#00f5ff', fontWeight: 'bold', fontSize: '14px' }}>
                Professor Código Fluente
              </div>
              <div style={{ color: '#666', fontSize: '11px' }}>
                Tire dúvidas sobre os cursos
              </div>
            </div>
          </div>

          {/* Mensagens */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '80%',
                    padding: '10px 14px',
                    borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: msg.role === 'user' ? '#00f5ff' : '#2a2a4a',
                    color: msg.role === 'user' ? '#000' : '#e0e0e0',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '16px 16px 16px 4px',
                    background: '#2a2a4a',
                    color: '#666',
                    fontSize: '13px',
                  }}
                >
                  Professor digitando...
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: '12px',
              borderTop: '1px solid #00f5ff22',
              display: 'flex',
              gap: '8px',
            }}
          >
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
              }}
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
                transition: 'background 0.2s',
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
