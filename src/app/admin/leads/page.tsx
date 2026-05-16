'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Lead {
  _id: string;
  name?: string;
  email?: string;
  session_id: string;
  created_at: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/leads');
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
      } else {
        console.error('Failed to fetch leads');
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    const headers = ['Nome', 'Email', 'Session ID', 'Data de Cadastro'];
    const csvContent = [
      headers.join(','),
      ...leads.map(lead => {
        const name = lead.name ? `"${lead.name.replace(/"/g, '""')}"` : '';
        const email = lead.email ? `"${lead.email.replace(/"/g, '""')}"` : '';
        const session = `"${lead.session_id}"`;
        const date = `"${new Date(lead.created_at).toLocaleString('pt-BR')}"`;
        return `${name},${email},${session},${date}`;
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `neo_leads_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <header className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-400 hover:text-white transition-colors">
              ← Voltar
            </Link>
            <h1 className="text-3xl font-bold">Leads <span className="text-neon-cyan">Neo</span></h1>
          </div>
          <p className="text-gray-400 mt-2 text-sm">
            Total de leads capturados pelo agente Neo: <span className="text-white font-bold">{leads.length}</span>
          </p>
        </div>
        
        <button 
          onClick={exportCSV}
          disabled={loading || leads.length === 0}
          className="px-6 py-2 border border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black transition-all rounded-lg font-bold uppercase tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Exportar CSV
        </button>
      </header>

      <main>
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-cyan"></div>
          </div>
        ) : leads.length === 0 ? (
          <div className="bg-[#111] border border-white/10 rounded-2xl p-12 text-center text-gray-400">
            Nenhum lead encontrado.
          </div>
        ) : (
          <div className="bg-[#111] rounded-2xl border border-white/10 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-black/40">
                  <th className="p-4 text-xs uppercase tracking-widest text-gray-500 font-semibold">Nome</th>
                  <th className="p-4 text-xs uppercase tracking-widest text-gray-500 font-semibold">Email</th>
                  <th className="p-4 text-xs uppercase tracking-widest text-gray-500 font-semibold">Session ID</th>
                  <th className="p-4 text-xs uppercase tracking-widest text-gray-500 font-semibold">Data de cadastro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 text-sm font-medium">{lead.name || '—'}</td>
                    <td className="p-4 text-sm text-gray-300">{lead.email || '—'}</td>
                    <td className="p-4 text-sm text-gray-500 font-mono" title={lead.session_id}>
                      {lead.session_id.substring(0, 12)}...
                    </td>
                    <td className="p-4 text-sm text-gray-400">
                      {new Date(lead.created_at).toLocaleString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
