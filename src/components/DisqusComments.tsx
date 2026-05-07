'use client';

import { DiscussionEmbed } from 'disqus-react';
import { useState, useEffect } from 'react';

interface DisqusCommentsProps {
  slug: string;
  title: string;
}

export default function DisqusComments({ slug, title }: DisqusCommentsProps) {
  // Use state for URL to ensure server and first client render match (both will be empty)
  const [url, setUrl] = useState<string>('');
  const shortname = process.env.NEXT_PUBLIC_DISQUS_SHORTNAME || 'codigofluente';

  useEffect(() => {
    // Only set the URL on the client after mounting
    setUrl(window.location.href);
  }, []);

  // While we don't have the URL, we show a placeholder. 
  // This matches on both Server and first Client render, avoiding hydration errors.
  if (!url) {
    return (
      <div className="bg-white/5 p-6 rounded-xl border border-white/5 min-h-[200px] animate-pulse flex items-center justify-center">
        <span className="text-gray-500 text-sm font-mono uppercase tracking-widest">Carregando comentários...</span>
      </div>
    );
  }

  const config = {
    url: url,
    identifier: slug,
    title: title,
    language: 'pt_BR'
  };

  return (
    <div className="bg-white/5 p-6 rounded-xl border border-white/5 min-h-[200px]">
      <DiscussionEmbed
        shortname={shortname}
        config={config}
      />
    </div>
  );
}
