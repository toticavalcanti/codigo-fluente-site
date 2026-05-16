'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Message {
  role: string;
  content: string;
}

interface Session {
  _id: string;
  session_id: string;
  history: Message[];
  updated_at: string;
}

export default function ConversasPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'today' | 'week' | 'all'>('all');
  const [expandedSession, setExpandedSession] = useState<string | null>(null);

  useEffect(() => {
    fetchSessions();
  }, [filter]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/conversas?filter=${filter}`);
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions || []);
      } else {
        console.error('Failed to fetch sessions');
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (sessionId: string) => {
    if (expandedSession === sessionId) {
      setExpandedSession(null);
    } else {
      setExpandedSession(sessionId);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <header className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-400 hover:text-white transition-colors">
              ← Voltar
            </Link>
            <h1 className="text-3xl font-bold">Conversas <span className="text-neon-cyan">Neo</span></h1>
          </div>
          <p className="text-gray-400 mt-2 text-sm">
            Total de conversas no período: <span className="text-white font-bold">{sessions.length}</span>
          </p>
        </div>
        
        <div className="flex bg-[#111] border border-white/10 rounded-lg overflow-hidden">
          <button 
            onClick={() => setFilter('today')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${filter === 'today' ? 'bg-neon-cyan text-black' : 'text-gray-400 hover:bg-white/5'}`}
          >
            Hoje
          </button>
          <button 
            onClick={() => setFilter('week')}
            className={`px-4 py-2 text-sm font-medium transition-colors border-l border-white/10 ${filter === 'week' ? 'bg-neon-cyan text-black' : 'text-gray-400 hover:bg-white/5'}`}
          >
            Últimos 7 dias
          </button>
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm font-medium transition-colors border-l border-white/10 ${filter === 'all' ? 'bg-neon-cyan text-black' : 'text-gray-400 hover:bg-white/5'}`}
          >
            Todas
          </button>
        </div>
      </header>

      <main>
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-cyan"></div>
          </div>
        ) : sessions.length === 0 ? (
          <div className="bg-[#111] border border-white/10 rounded-2xl p-12 text-center text-gray-400">
            Nenhuma conversa encontrada neste período.
          </div>
        ) : (
          <div className="bg-[#111] rounded-2xl border border-white/10 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-black/40">
                  <th className="p-4 text-xs uppercase tracking-widest text-gray-500 font-semibold">Session ID</th>
                  <th className="p-4 text-xs uppercase tracking-widest text-gray-500 font-semibold">Nº de mensagens</th>
                  <th className="p-4 text-xs uppercase tracking-widest text-gray-500 font-semibold">Última atualização</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {sessions.map((session) => (
                  <React.Fragment key={session._id}>
                    <tr 
                      onClick={() => toggleExpand(session.session_id)}
                      className={`cursor-pointer transition-colors ${expandedSession === session.session_id ? 'bg-white/5' : 'hover:bg-white/5'}`}
                    >
                      <td className="p-4 text-sm text-neon-cyan font-mono font-medium">
                        {session.session_id.substring(0, 12)}...
                      </td>
                      <td className="p-4 text-sm text-gray-300">
                        {session.history?.length || 0}
                      </td>
                      <td className="p-4 text-sm text-gray-400">
                        {new Date(session.updated_at).toLocaleString('pt-BR')}
                      </td>
                    </tr>
                    {expandedSession === session.session_id && (
                      <tr>
                        <td colSpan={3} className="p-0 border-b border-white/10">
                          <div className="bg-black/50 p-6 max-h-[600px] overflow-y-auto">
                            <div className="flex flex-col gap-4 max-w-4xl mx-auto">
                              {session.history?.map((msg, idx) => {
                                const isUser = msg.role === 'user';
                                return (
                                  <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${isUser ? 'bg-neon-cyan text-black rounded-tr-sm' : 'bg-[#222] text-white rounded-tl-sm border border-white/10'}`}>
                                      <p className="font-bold text-xs mb-1 opacity-60 uppercase tracking-widest">
                                        {isUser ? 'Usuário' : 'Neo'}
                                      </p>
                                      <div className="whitespace-pre-wrap">{msg.content}</div>
                                    </div>
                                  </div>
                                );
                              })}
                              {(!session.history || session.history.length === 0) && (
                                <div className="text-center text-gray-500 text-sm">Nenhuma mensagem registrada.</div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
