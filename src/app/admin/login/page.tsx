'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.message || 'Credenciais inválidas');
      }
    } catch (err) {
      setError('Erro ao tentar fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Image 
            src="/code-upscale-relevo-01-ciano.png"
            alt="Código Fluente"
            width={150}
            height={150}
            priority
          />
        </div>
        
        <div className="bg-[#111] border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-neon-cyan/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-neon-pink/10 rounded-full blur-3xl"></div>

          <h1 className="text-2xl font-bold text-white mb-6 text-center">
            Painel <span className="text-neon-cyan">Admin</span>
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div>
              <label className="block text-gray-400 text-sm font-bold mb-2 uppercase tracking-widest" htmlFor="email">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan transition-colors"
                placeholder="admin@codigofluente.com"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm font-bold mb-2 uppercase tracking-widest" htmlFor="password">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="text-neon-pink text-sm bg-neon-pink/10 border border-neon-pink/20 rounded-lg p-3 text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white/5 hover:bg-neon-cyan hover:text-black border border-neon-cyan text-neon-cyan font-bold py-4 rounded-lg transition-all duration-300 uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(0,245,255,0.1)] hover:shadow-[0_0_25px_rgba(0,245,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Autenticando...' : 'Entrar'}
            </button>
          </form>
        </div>
        
        <p className="mt-8 text-gray-600 text-center text-xs font-mono">
          &copy; {new Date().getFullYear()} Código Fluente. Acesso Restrito.
        </p>
      </div>
    </div>
  );
}
