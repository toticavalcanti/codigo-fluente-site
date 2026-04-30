'use client';

import React, { useEffect } from 'react';
import hljs from 'highlight.js';

interface PostContentProps {
  content: string;
}

export default function PostContent({ content }: PostContentProps) {
  useEffect(() => {
    // Highlight all code blocks after content is rendered
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block as HTMLElement);
    });
  }, [content]);

  return (
    <div 
      className="prose prose-invert max-w-none 
        prose-headings:text-neon-cyan prose-headings:font-bold
        prose-a:text-neon-pink prose-a:no-underline hover:prose-a:underline
        prose-strong:text-gray-100
        prose-code:text-neon-cyan prose-code:bg-white/5 prose-code:px-1 prose-code:rounded
        prose-pre:bg-[#1a1b26] prose-pre:border prose-pre:border-white/10
        prose-img:rounded-xl prose-img:shadow-lg
        [&_pre]:p-0 [&_pre_code]:p-6 [&_pre_code]:block [&_pre_code]:overflow-x-auto
        text-gray-300 leading-relaxed"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
