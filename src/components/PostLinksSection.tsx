"use client";

import React, { useState } from "react";
import Image from "next/image";

// ── SVG Icons ────────────────────────────────────────────────────────────────

const IconYoutube = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const IconFacebook = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M24 12.073C24 5.446 18.627 0 12 0S0 5.446 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.67 4.533-4.67 1.312 0 2.686.234 2.686.234v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
  </svg>
);

const IconInstagram = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const IconPinterest = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
  </svg>
);

const IconTiktok = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
  </svg>
);

const IconLinkedin = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const IconGithub = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

const IconExternal = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

// ── Subcomponentes ────────────────────────────────────────────────────────────

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-8">
      <div className="flex-1 h-px bg-neon-cyan/10" />
      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-neon-cyan/35 font-mono whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-px bg-neon-cyan/10" />
    </div>
  );
}

function ChannelCard({ name, desc, url, emoji }: { name: string; desc: string; url: string; emoji: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-3 p-3 rounded-lg border border-white/5 bg-white/[0.02]
                 hover:border-neon-cyan/25 hover:bg-neon-cyan/[0.04] transition-all no-underline"
    >
      <span className="text-xl mt-0.5 flex-shrink-0">{emoji}</span>
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-red-400 opacity-60 group-hover:opacity-100 transition-opacity">
            <IconYoutube />
          </span>
          <span className="text-[13px] font-bold text-white/70 group-hover:text-neon-cyan transition-colors truncate">
            {name}
          </span>
        </div>
        <p className="text-[11px] text-white/30 mt-0.5 leading-snug">{desc}</p>
      </div>
    </a>
  );
}

function AffiliateCard({ name, desc, url, badge }: { name: string; desc: string; url: string; badge: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="group flex flex-col gap-2 p-3 rounded-lg border border-white/5 bg-white/[0.02]
                 hover:border-neon-cyan/20 hover:bg-neon-cyan/[0.04] hover:-translate-y-0.5 transition-all no-underline"
    >
      <div className="flex items-center justify-between">
        <span className="text-[9px] uppercase tracking-[0.14em] text-neon-cyan/40 bg-neon-cyan/8 border border-neon-cyan/15 px-1.5 py-0.5 rounded font-mono">
          {badge}
        </span>
        <span className="text-white/15 group-hover:text-neon-cyan/40 transition-colors">
          <IconExternal />
        </span>
      </div>
      <div>
        <p className="text-[13px] font-bold text-white/70 group-hover:text-neon-cyan transition-colors">{name}</p>
        <p className="text-[11px] text-white/30 mt-0.5 leading-snug">{desc}</p>
      </div>
    </a>
  );
}

function SocialBtn({ href, label, icon, color }: { href: string; label: string; icon: React.ReactNode; color: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-bold no-underline
                  border transition-all hover:-translate-y-0.5 ${color}`}
    >
      {icon}
      <span>{label}</span>
    </a>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded border font-bold transition-all
        ${copied
          ? "text-neon-cyan border-neon-cyan/50 bg-neon-cyan/10"
          : "text-neon-cyan/40 border-neon-cyan/15 hover:text-neon-cyan hover:border-neon-cyan/40"
        }`}
    >
      {copied ? "copiado!" : "copiar"}
    </button>
  );
}

// ── Dados ─────────────────────────────────────────────────────────────────────

const CHANNELS = [
  { name: "Código Fluente",   desc: "Aulas gratuitas de programação, devops e IA.",        url: "https://www.youtube.com/channel/UCgn-O-88XBAwdG9gUWkkb0w", emoji: "💻" },
  { name: "Toti Cavalcanti",  desc: "Música, teoria musical e clips artesanais.",           url: "https://www.youtube.com/channel/UCUEtjLuDpcOvR3mIUr-viOA", emoji: "🎸" },
  { name: "Scarlett Finch",   desc: "Cantora e influenciadora virtual criada com IA.",      url: "https://www.youtube.com/@scarlettfinchofficial/featured",  emoji: "🎤" },
  { name: "Putz!",            desc: "Banda virtual criada durante a pandemia.",             url: "https://www.youtube.com/channel/UCZXop2-CECwyFYmHbhnAkAw", emoji: "🎵" },
  { name: "Lofi Music Zone",  desc: "Lofi para estudo, trabalho e relaxamento.",            url: "https://www.youtube.com/channel/UCeaPSHleQS-75uJj2AM_Ndg", emoji: "🎧" },
  { name: "Backing Track",    desc: "Faixas instrumentais para prática musical.",           url: "https://www.youtube.com/channel/UCT3TryVMqTqYBjf5g5WAHfA", emoji: "🎼" },
];

const AFFILIATES_AI = [
  { name: "HeyGen",        desc: "Vídeos com avatares de IA.",                  url: "https://heygen.com/?sid=rewardful&via=antonio-cavalcanti-de-paula-filho", badge: "Vídeo IA"   },
  { name: "DeepBrain AI",  desc: "Avatares digitais para apresentações.",       url: "https://www.deepbrain.io/aistudios?via=toti",                             badge: "Avatar IA"  },
  { name: "DupDub",        desc: "Marketing digital com IA.",                   url: "https://dupdub.com/?lmref=_ZMt9Q",                                        badge: "Marketing"  },
  { name: "Recast",        desc: "Artigos transformados em áudio.",             url: "https://letsrecast.ai/?ref=toti",                                         badge: "Áudio IA"   },
  { name: "Audyo.ai",      desc: "Áudio personalizado com IA.",                 url: "https://www.audyo.ai/?linkId=lp_693090&sourceId=toti-cavalcanti&tenantId=audyo", badge: "Podcast IA" },
  { name: "Acoust.io",     desc: "Suite completa de produção de áudio.",        url: "https://www.acoust.io/?via=toti",                                         badge: "Produção"   },
];

const AFFILIATES_HOSTING = [
  { name: "Hostinger",     desc: "Hospedagem web acessível e confiável.",       url: "https://www.hostg.xyz/aff_c?offer_id=12&aff_id=13441", badge: "Hospedagem" },
  { name: "Digital Ocean", desc: "Infraestrutura de nuvem para devs.",          url: "https://m.do.co/c/213569994aad",                       badge: "Cloud"      },
  { name: "One.com",       desc: "Domínios e hospedagem simplificados.",         url: "http://one.me/ptaxrzyv",                               badge: "Domínios"   },
];

const EDUCATION = [
  { name: "Digital Innovation One", desc: "Cursos gratuitos com certificado.", url: "https://digitalinnovation.one/sign-up?ref=IDSHZ1O9BY" },
  { name: "Workover",               desc: "Aprenda Python3 gratuitamente.",     url: "https://workover.com.br/python-codigo-fluente"        },
];

// ── CopyButton precisa de 'use client' — marcamos o componente pai ────────────

// ── Componente principal ──────────────────────────────────────────────────────

export default function PostLinksSection() {
  return (
    <aside className="mt-16 font-mono" aria-label="Links, canais e afiliados">

      {/* ── YouTube ── */}
      <Divider label="canais do youtube" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {CHANNELS.map((c) => <ChannelCard key={c.name} {...c} />)}
      </div>

      {/* ── IA Afiliados ── */}
      <Divider label="ferramentas de ia — afiliados" />
      <p className="text-[11px] text-white/20 mb-3">
        Usar os links abaixo apoia o canal sem custo adicional para você.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {AFFILIATES_AI.map((a) => <AffiliateCard key={a.name} {...a} />)}
      </div>

      {/* ── Hospedagem ── */}
      <Divider label="hospedagem & cloud — afiliados" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {AFFILIATES_HOSTING.map((a) => <AffiliateCard key={a.name} {...a} />)}
      </div>

      {/* ── Educação ── */}
      <Divider label="educação gratuita" />
      <div className="flex flex-wrap gap-2">
        {EDUCATION.map((e) => (
          <a
            key={e.name}
            href={e.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col gap-0.5 px-4 py-2.5 rounded-lg border border-white/8 bg-white/[0.02]
                       hover:border-neon-cyan/25 hover:bg-neon-cyan/[0.04] transition-all no-underline group"
          >
            <span className="text-[13px] font-bold text-white/60 group-hover:text-neon-cyan transition-colors">{e.name}</span>
            <span className="text-[11px] text-white/25">{e.desc}</span>
          </a>
        ))}
      </div>

      {/* ── Redes Sociais ── */}
      <Divider label="redes sociais" />
      <div className="flex flex-wrap gap-2">
        <SocialBtn href="https://www.facebook.com/codigofluenteoficial"              label="Facebook"  icon={<IconFacebook />}  color="text-blue-400 border-blue-500/20 bg-blue-500/8 hover:bg-blue-500/14" />
        <SocialBtn href="https://www.instagram.com/codigofluente/"                   label="Instagram" icon={<IconInstagram />} color="text-pink-400 border-pink-500/20 bg-pink-500/8 hover:bg-pink-500/14" />
        <SocialBtn href="https://br.pinterest.com/codigofluente/"                    label="Pinterest" icon={<IconPinterest />} color="text-red-400 border-red-500/20 bg-red-500/8 hover:bg-red-500/14"   />
        <SocialBtn href="https://www.tiktok.com/@codigofluente"                      label="TikTok"    icon={<IconTiktok />}    color="text-white/50 border-white/10 bg-white/5 hover:bg-white/8"           />
        <SocialBtn href="https://www.linkedin.com/in/antoniocavalcantedepaulafilho/" label="LinkedIn"  icon={<IconLinkedin />}  color="text-sky-400 border-sky-500/20 bg-sky-500/8 hover:bg-sky-500/14"    />
        <SocialBtn href="https://github.com/toticavalcanti"                          label="GitHub"    icon={<IconGithub />}    color="text-white/50 border-white/10 bg-white/5 hover:bg-white/8"           />
      </div>

      {/* ── PIX ── */}
      <Divider label="apoie o projeto" />
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6
                      p-5 rounded-xl border border-neon-cyan/10 bg-neon-cyan/[0.02]">
        <div className="flex-shrink-0 p-2 rounded-xl border border-neon-cyan/15 bg-black/20">
          <Image
            src="/pix-qrcode.png"
            alt="QR Code PIX para doação"
            width={140}
            height={140}
            className="rounded-lg"
          />
        </div>
        <div className="flex flex-col justify-center gap-3 text-center sm:text-left">
          <div>
            <p className="text-[10px] uppercase tracking-[0.15em] text-neon-cyan/35 mb-1.5">Pix — Nubank</p>
            <p className="text-[13px] text-white/40 leading-relaxed">
              Se este conteúdo te ajudou, qualquer contribuição é bem-vinda.
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-[10px] uppercase tracking-wider text-white/20">Chave CPF</p>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <code className="text-sm font-bold text-neon-cyan/80 tracking-wider">
                615.964.264-20
              </code>
              <CopyButton text="61596426420" />
            </div>
            <p className="text-[11px] text-white/20 mt-1">Toti Cavalcanti</p>
          </div>
        </div>
      </div>

    </aside>
  );
}