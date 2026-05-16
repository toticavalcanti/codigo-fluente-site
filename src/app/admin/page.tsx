import React from 'react';
import Link from 'next/link';
import { getSessionFromCookies } from '@/lib/auth';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import { Post } from '@/models/Post';
import { Comment } from '@/models/Comment';
import { Lead } from '@/models/Lead';

export default async function AdminDashboard() {
  const session = await getSessionFromCookies();
  
  if (!session) {
    redirect('/admin/login');
  }

  await dbConnect();

  const [postCount, pendingComments, leadCount] = await Promise.all([
    Post.countDocuments(),
    Comment.countDocuments({ status: 'pending' }),
    Lead.countDocuments()
  ]);

  const cards = [
    { title: 'Posts', value: postCount, link: '/admin/posts', color: 'border-neon-cyan', text: 'text-neon-cyan' },
    { title: 'Comentários Pendentes', value: pendingComments, link: '/admin/comments', color: 'border-neon-pink', text: 'text-neon-pink' },
    { title: 'Leads Capturados', value: leadCount, link: '/admin/leads', color: 'border-yellow-400', text: 'text-yellow-400' },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <header className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard <span className="text-neon-cyan">Admin</span></h1>
          <p className="text-gray-400 mt-1">Bem-vindo de volta, <span className="text-white font-medium">{session.name}</span></p>
        </div>
        
        <form action="/api/admin/auth/logout" method="POST">
          <button 
            type="submit"
            className="px-6 py-2 border border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-black transition-all rounded-lg font-bold uppercase tracking-wider text-sm"
          >
            Logout
          </button>
        </form>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {cards.map((card) => (
          <Link key={card.title} href={card.link}>
            <div className={`bg-[#111] p-8 rounded-2xl border-2 ${card.color} hover:scale-[1.02] transition-all cursor-pointer group shadow-lg`}>
              <h3 className="text-gray-400 uppercase tracking-widest text-xs font-bold mb-4">{card.title}</h3>
              <p className={`text-5xl font-black ${card.text}`}>{card.value}</p>
              <div className="mt-6 flex items-center text-xs text-white/40 group-hover:text-white transition-colors">
                Ver detalhes <span className="ml-2">→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-[#111] p-8 rounded-2xl border border-white/10">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <span className="w-2 h-2 bg-neon-cyan rounded-full mr-3 shadow-[0_0_8px_#00f5ff]"></span>
            Gerenciamento
          </h2>
          <nav className="space-y-4">
            {[
              { name: 'Posts & Aulas', href: '/admin/posts' },
              { name: 'Categorias', href: '/admin/categories' },
              { name: 'Comentários', href: '/admin/comments' },
              { name: 'Leads Neo', href: '/admin/leads' },
              { name: 'Conversas Neo', href: '/admin/conversas' },
            ].map((item) => (
              <Link 
                key={item.name} 
                href={item.href}
                className="block p-4 bg-black/40 border border-white/5 hover:border-neon-cyan hover:bg-neon-cyan/5 rounded-xl transition-all"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </section>

        <section className="bg-[#111] p-8 rounded-2xl border border-white/10">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <span className="w-2 h-2 bg-neon-pink rounded-full mr-3 shadow-[0_0_8px_#ff2d78]"></span>
            Configurações
          </h2>
          <nav className="space-y-4">
            {[
              { name: 'Gerenciar Usuários Admin', href: '/admin/users' },
              { name: 'Configurações Globais', href: '/admin/settings' },
              { name: 'Logs do Sistema', href: '/admin/logs' },
            ].map((item) => (
              <Link 
                key={item.name} 
                href={item.href}
                className="block p-4 bg-black/40 border border-white/5 hover:border-neon-pink hover:bg-neon-pink/5 rounded-xl transition-all"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </section>
      </div>
    </div>
  );
}
