'use client';

import { useState, useEffect } from 'react';

interface CommentType {
  _id: string;
  name: string;
  content: string;
  created_at: string;
}

interface CommentsProps {
  postSlug: string;
}

export default function Comments({ postSlug }: CommentsProps) {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [formData, setFormData] = useState({ name: '', email: '', content: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [postSlug]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?post_slug=${postSlug}`);
      const data = await res.json();
      if (data.success) {
        setComments(data.data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          post_slug: postSlug
        }),
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', content: '' });
        // Não adicionamos à lista pois aguarda aprovação
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="mt-20">
      <h3 className="text-2xl font-bold text-white mb-10 flex items-center">
        <span className="w-2 h-8 bg-neon-pink mr-4"></span>
        Comentários
      </h3>

      {/* Lista de Comentários */}
      <div className="space-y-8 mb-16">
        {isLoading ? (
          <div className="text-gray-500 animate-pulse">Carregando comentários...</div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="bg-white/5 rounded-2xl p-6 border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-neon-cyan/30 group-hover:bg-neon-cyan transition-colors" />
              <div className="flex justify-between items-start mb-4">
                <span className="font-bold text-white">{comment.name}</span>
                <span className="text-xs text-gray-500 font-mono">
                  {new Date(comment.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">Seja o primeiro a comentar!</p>
        )}
      </div>

      {/* Formulário */}
      <div className="bg-[#0f1117] border border-white/10 rounded-2xl p-8 shadow-xl">
        <h4 className="text-lg font-bold text-white mb-6 flex items-center">
          <span className="text-neon-cyan mr-2">&gt;</span> Deixe um comentário
        </h4>
        
        {status === 'success' ? (
          <div className="bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan px-6 py-4 rounded-xl animate-in slide-in-from-top duration-500">
            Comentário enviado! Será aprovado em breve.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Nome</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-cyan/50 transition-colors"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">E-mail (não publicado)</label>
                <input 
                  type="email" 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-pink/50 transition-colors"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Comentário</label>
              <textarea 
                required
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-cyan/50 transition-colors resize-none"
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
              />
            </div>
            <button 
              type="submit"
              disabled={status === 'loading'}
              className="bg-white/5 hover:bg-neon-cyan hover:text-black border border-white/10 text-white font-bold px-8 py-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {status === 'loading' ? 'ENVIANDO...' : 'ENVIAR COMENTÁRIO'}
            </button>
            {status === 'error' && (
              <p className="text-red-500 text-sm">Erro ao enviar. Tente novamente.</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
