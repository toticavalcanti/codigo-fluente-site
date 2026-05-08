'use client';

import React, { useEffect } from 'react';
import hljs from 'highlight.js';
import { cleanWordPressContent } from '@/lib/utils';

interface PostContentProps {
  content: string;
}

export default function PostContent({ content }: PostContentProps) {
  useEffect(() => {
    // Highlight all code blocks and add copy buttons
    const preBlocks = document.querySelectorAll('pre');
    preBlocks.forEach((pre) => {
      const code = pre.querySelector('code');
      if (code) {
        hljs.highlightElement(code as HTMLElement);
        
        // Add copy button if not exists
        if (!pre.querySelector('.copy-btn')) {
          const button = document.createElement('button');
          button.className = 'copy-btn absolute top-3 right-3 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold uppercase tracking-widest rounded transition-all backdrop-blur-sm border border-white/10 z-10';
          button.innerHTML = 'COPIAR';
          
          button.onclick = () => {
            const text = code.innerText;
            navigator.clipboard.writeText(text).then(() => {
              button.innerHTML = 'COPIADO!';
              button.classList.add('text-neon-cyan', 'border-neon-cyan/50');
              setTimeout(() => {
                button.innerHTML = 'COPIAR';
                button.classList.remove('text-neon-cyan', 'border-neon-cyan/50');
              }, 2000);
            });
          };
          
          pre.appendChild(button);
        }
      }
    });
  }, [content]);

  return (
    <div 
      className="post-content prose prose-invert max-w-none 
        prose-headings:text-neon-cyan prose-headings:font-bold
        prose-a:text-neon-cyan prose-a:no-underline hover:prose-a:underline
        prose-strong:text-gray-100
        prose-code:text-neon-cyan prose-code:bg-white/5 prose-code:px-1 prose-code:rounded
        prose-pre:bg-[#1a1b26] prose-pre:border prose-pre:border-white/10 prose-pre:relative
        prose-img:rounded-xl prose-img:shadow-lg
        [&_pre]:p-0 [&_pre_code]:p-8 [&_pre_code]:block [&_pre_code]:overflow-x-auto
        [&_pre_code]:whitespace-pre [&_pre_code]:tab-4
        text-gray-300 leading-relaxed"
      dangerouslySetInnerHTML={{ __html: cleanWordPressContent(content) }}
    />
  );
}
