'use client';

import React from 'react';

interface VideoEmbedProps {
  url: string | null;
}

export default function VideoEmbed({ url }: VideoEmbedProps) {
  if (!url) return null;

  // Extract YouTube ID using the requested regex or direct 11-char ID
  const getYouTubeID = (url: string) => {
    const regExp = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/vi\/)([^&\n?#]+)/i;
    const match = url.match(regExp);
    if (match && match[1]) {
      return match[1];
    }
    const cleanUrl = url.trim();
    if (cleanUrl.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) {
      return cleanUrl;
    }
    return null;
  };

  const videoId = getYouTubeID(url);
  if (!videoId) return null;

  return (
    <div className="w-full mb-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-xl overflow-hidden border border-white/5">
      <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
        <iframe 
          src={`https://www.youtube.com/embed/${videoId}`} 
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          allowFullScreen 
          loading="lazy" 
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
    </div>
  );
}
