'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function LeadPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const params = useParams();

  useEffect(() => {
    // Verificar se já foi mostrado ou capturado
    const shown = localStorage.getItem('cf_popup_shown');
    const captured = localStorage.getItem('cf_email_captured');

    if (shown || captured) return;

    const timer = setTimeout(() => {
      setIsVisible(true);
      localStorage.setItem('cf_popup_shown', 'true');
    }, 40000); // 40 segundos

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: 'popup',
          category: params.categorySlug || '',
          post_slug: params.postSlug || ''
        }),
      });

      if (res.ok) {
        setStatus('success');
        localStorage.setItem('cf_email_captured', 'true');
        setTimeout(() => setIsVisible(false), 3000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-[#0f1117] border border-white/10 rounded-2xl p-8 shadow-2xl shadow-neon-cyan/20 overflow-hidden">
        {/* Efeitos de Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-neon-cyan/10 blur-[100px]" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-neon-pink/10 blur-[100px]" />

        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {status === 'success' ? (
          <div className="text-center py-8 animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-neon-cyan/20 text-neon-cyan rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Bem-vindo à lista!</h3>
            <p className="text-gray-400">Você agora receberá nossos conteúdos gratuitos diretamente no seu e-mail.</p>
          </div>
        ) : (
          <>
            <div className="mb-8 relative z-10">
              <div className="inline-block px-3 py-1 bg-neon-cyan/10 text-neon-cyan text-[10px] font-bold uppercase tracking-widest rounded-full mb-4">
                Acesso Exclusivo
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Domine a Programação<span className="text-neon-cyan">_</span>
              </h2>
              <p className="text-gray-400">
                Receba códigos, dicas e aulas exclusivas que não vão para o YouTube.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
              <div>
                <input 
                  type="text" 
                  placeholder="Seu Nome" 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-neon-cyan/50 transition-colors"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <input 
                  type="email" 
                  placeholder="Seu melhor e-mail" 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-neon-pink/50 transition-colors"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <button 
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-neon-cyan hover:bg-neon-cyan/80 text-black font-bold py-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {status === 'loading' ? 'CADASTRANDO...' : 'QUERO RECEBER CONTEÚDOS GRATUITOS'}
              </button>
              {status === 'error' && (
                <p className="text-red-500 text-sm text-center">Ocorreu um erro. Tente novamente.</p>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
}
