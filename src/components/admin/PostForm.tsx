'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { marked } from 'marked';

// Import MDEditor dynamically to avoid SSR issues
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor'),
  { ssr: false }
);

// Import MDEditor styles
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

interface Category {
  _id: string;
  name: string;
  slug: string;
  parent_slug?: string;
}

interface PostData {
  _id?: string;
  title: string;
  slug: string;
  youtube_id: string;
  category_ids: string[];
  content: string;
  excerpt: string;
  thumbnail: string;
  status: 'published' | 'draft';
}

interface PostFormProps {
  initialData?: PostData;
}

export default function PostForm({ initialData }: PostFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editorMode, setEditorMode] = useState<'markdown' | 'html'>('markdown');
  
  const [formData, setFormData] = useState<PostData>(initialData || {
    title: '',
    slug: '',
    youtube_id: '',
    category_ids: [],
    content: '',
    excerpt: '',
    thumbnail: '',
    status: 'published'
  });

  useEffect(() => {
    // Fetch categories for the select
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories'); // Assuming this exists or I'll create it
        const data = await res.json();
        setCategories(data || []);
      } catch (err) {
        console.error('Erro ao buscar categorias:', err);
      }
    };
    fetchCategories();
  }, []);

  // Auto-generate slug from title
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: initialData ? prev.slug : generateSlug(title) // Only auto-gen if new
    }));
  };

  const extractYouTubeId = (url: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const method = formData._id ? 'PUT' : 'POST';
    const url = formData._id ? `/api/admin/posts/${formData._id}` : '/api/admin/posts';

    try {
      // Convert Markdown to HTML before saving if in markdown mode
      const finalContent = editorMode === 'markdown' 
        ? await marked.parse(formData.content)
        : formData.content;
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          content: finalContent
        }),
      });

      if (res.ok) {
        router.push('/admin/posts');
        router.refresh();
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Erro ao salvar post');
      }
    } catch (err) {
      console.error('Save post error:', err);
      alert('Erro ao salvar post');
    } finally {
      setLoading(false);
    }
  };

  const getHierarchicalCategories = () => {
    const buildHierarchy = (cats: Category[], parentSlug: string | null = null, level = 0): (Category & { displayName: string })[] => {
      const result: (Category & { displayName: string })[] = [];
      const children = cats.filter(c => {
        const pSlug = c.parent_slug || null;
        return pSlug === parentSlug;
      });

      children.forEach(child => {
        result.push({
          ...child,
          displayName: `${'\u00A0\u00A0'.repeat(level)}${level > 0 ? '→ ' : ''}${child.name}`
        });
        result.push(...buildHierarchy(cats, child.slug, level + 1));
      });

      return result;
    };

    return buildHierarchy(categories);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Main Content Column */}
        <div className="space-y-6">
          <div>
            <label className="block text-gray-400 text-sm font-bold mb-2 uppercase tracking-widest">Título da Aula</label>
            <input
              type="text"
              value={formData.title}
              onChange={handleTitleChange}
              required
              className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-neon-cyan transition-colors"
              placeholder="Ex: Aula 01 - Introdução ao Django"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm font-bold mb-2 uppercase tracking-widest">Slug (URL)</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
              className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm focus:border-neon-cyan transition-colors"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-gray-400 text-sm font-bold uppercase tracking-widest">Conteúdo</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditorMode('markdown')}
                  className={`px-4 py-1 text-xs font-bold transition-all border-b-2 ${
                    editorMode === 'markdown' 
                      ? 'border-neon-cyan text-neon-cyan' 
                      : 'border-transparent text-gray-500 hover:text-gray-300'
                  }`}
                >
                  MARKDOWN
                </button>
                <button
                  type="button"
                  onClick={() => setEditorMode('html')}
                  className={`px-4 py-1 text-xs font-bold transition-all border-b-2 ${
                    editorMode === 'html' 
                      ? 'border-neon-cyan text-neon-cyan' 
                      : 'border-transparent text-gray-500 hover:text-gray-300'
                  }`}
                >
                  HTML
                </button>
              </div>
            </div>

            {editorMode === 'markdown' ? (
              <div data-color-mode="dark">
                <MDEditor
                  value={formData.content}
                  onChange={(val) => setFormData({ ...formData, content: val || '' })}
                  height={400}
                />
              </div>
            ) : (
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full h-[400px] bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm focus:border-neon-cyan transition-colors resize-none"
                placeholder="<h2>Título</h2><p>Conteúdo em HTML puro...</p>"
                spellCheck={false}
              />
            )}
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          <div className="bg-[#111] p-6 rounded-xl border border-white/10">
            <label className="block text-gray-400 text-sm font-bold mb-2 uppercase tracking-widest">Vídeo YouTube (ID ou URL)</label>
            <input
              type="text"
              value={formData.youtube_id}
              onBlur={(e) => setFormData({ ...formData, youtube_id: extractYouTubeId(e.target.value) })}
              onChange={(e) => setFormData({ ...formData, youtube_id: e.target.value })}
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-neon-cyan transition-colors"
              placeholder="https://youtube.com/watch?v=..."
            />
            {formData.youtube_id && formData.youtube_id.length === 11 && (
              <div className="mt-3 aspect-video bg-black rounded overflow-hidden border border-white/5 relative">
                <Image 
                  src={`https://img.youtube.com/vi/${formData.youtube_id}/mqdefault.jpg`} 
                  alt="Preview" 
                  fill
                  className="object-cover opacity-50" 
                />
              </div>
            )}
          </div>

          <div className="bg-[#111] p-6 rounded-xl border border-white/10">
            <label className="block text-gray-400 text-sm font-bold mb-2 uppercase tracking-widest">Categorias</label>
            <select
              multiple
              value={formData.category_ids}
              onChange={(e) => {
                const values = Array.from(e.target.selectedOptions, option => option.value);
                setFormData({ ...formData, category_ids: values });
              }}
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white h-40 focus:border-neon-cyan transition-colors"
            >
              {getHierarchicalCategories().map(cat => (
                <option key={cat._id} value={cat._id}>{cat.displayName}</option>
              ))}
            </select>
            <p className="text-[10px] text-gray-500 mt-2">Segure Ctrl (ou Cmd) para selecionar múltiplas</p>
          </div>

          <div className="bg-[#111] p-6 rounded-xl border border-white/10">
            <label className="block text-gray-400 text-sm font-bold mb-2 uppercase tracking-widest">Thumbnail (URL R2)</label>
            <input
              type="text"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-neon-cyan transition-colors"
              placeholder="https://...r2.dev/imagem.png"
            />
          </div>

          <div className="bg-[#111] p-6 rounded-xl border border-white/10 flex items-center justify-between">
            <label className="text-gray-400 text-sm font-bold uppercase tracking-widest">Status</label>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, status: formData.status === 'published' ? 'draft' : 'published' })}
              className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${
                formData.status === 'published' 
                  ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30' 
                  : 'bg-white/5 text-gray-400 border border-white/10'
              }`}
            >
              {formData.status === 'published' ? 'PUBLICADO' : 'RASCUNHO'}
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 pt-8 flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-4 bg-neon-cyan text-black font-black rounded-xl hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-all disabled:opacity-50"
        >
          {loading ? 'Salvando...' : 'SALVAR ALTERAÇÕES'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-8 py-4 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition-all"
        >
          CANCELAR
        </button>
      </div>
    </form>
  );
}
