'use client';

import React, { useState } from 'react';

interface VideoEmbedProps {
  url: string | null;
}

export default function VideoEmbed({ url }: VideoEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  if (!url) return null;

  // Extract YouTube ID
  const getYouTubeID = (url: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const videoId = getYouTubeID(url);
  if (!videoId) return null;

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/5">
      {!isLoaded ? (
        <div 
          className="relative w-full h-full cursor-pointer group"
          onClick={() => setIsLoaded(true)}
        >
          <img 
            src={thumbnailUrl} 
            alt="Video thumbnail" 
            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-neon-pink rounded-full flex items-center justify-center glow-pink group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      ) : (
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      )}
    </div>
  );
}
