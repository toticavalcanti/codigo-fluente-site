'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface PostSummary {
  _id: string;
  title: string;
  slug: string;
  category_ids: string[];
  createdAt: string;
  published_at?: string;
  status?: 'published' | 'draft';
}

function formatDate(date: unknown): string {
  if (!date) return '—';
  const d = new Date(date as string);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('pt-BR');
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/posts?page=${page}&search=${search}`);
      const data = await res.json();
      setPosts(data.posts || []);
      setTotalPages(data.pages || 1);
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPosts();
    }, 300); // Debounce search
    return () => clearTimeout(timer);
  }, [fetchPosts]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Tem certeza que deseja excluir a aula "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPosts(posts.filter(p => p._id !== id));
      } else {
        alert('Erro ao excluir post');
      }
    } catch (error) {
      alert('Erro ao excluir post');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Posts & <span className="text-neon-cyan">Aulas</span></h1>
          <p className="text-gray-400 mt-1">Gerencie o conteúdo do portal</p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <Link 
            href="/admin/posts/new"
            className="px-6 py-3 bg-neon-cyan text-black font-bold rounded-lg hover:shadow-[0_0_15px_rgba(0,245,255,0.5)] transition-all uppercase tracking-wider text-sm whitespace-nowrap"
          >
            + Nova Aula
          </Link>
          <Link 
            href="/admin"
            className="px-6 py-3 border border-white/20 text-white hover:bg-white/5 rounded-lg transition-all uppercase tracking-wider text-sm whitespace-nowrap"
          >
            Voltar
          </Link>
        </div>
      </header>

      <div className="bg-[#111] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        {/* Search and Filters */}
        <div className="p-6 border-b border-white/5">
          <input
            type="text"
            placeholder="Buscar por título..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full max-w-md bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan transition-colors"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-[0.2em]">
              <tr>
                <th className="px-6 py-4 font-bold">Título</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold">Data</th>
                <th className="px-6 py-4 font-bold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">Carregando conteúdo...</td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">Nenhum post encontrado.</td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white group-hover:text-neon-cyan transition-colors">{post.title}</div>
                      <div className="text-xs text-gray-500 font-mono mt-1">{post.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-widest ${
                        (post.status || 'published') === 'published' ? 'bg-neon-cyan/10 text-neon-cyan' : 'bg-gray-800 text-gray-400'
                      }`}>
                        {(post.status || 'published') === 'published' ? 'Publicado' : 'Rascunho'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {formatDate(post.published_at || post.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <Link 
                        href={`/admin/posts/${post._id}/edit`}
                        className="text-gray-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"
                      >
                        Editar
                      </Link>
                      <button 
                        onClick={() => handleDelete(post._id, post.title)}
                        className="text-gray-600 hover:text-neon-pink transition-colors text-sm font-bold uppercase tracking-widest"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-white/5 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold transition-all ${
                  page === p 
                    ? 'bg-neon-cyan text-black' 
                    : 'bg-black/50 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
