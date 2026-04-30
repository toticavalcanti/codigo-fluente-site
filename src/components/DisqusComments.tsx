'use client';

import { DiscussionEmbed } from 'disqus-react';

interface DisqusCommentsProps {
  slug: string;
  title: string;
}

export default function DisqusComments({ slug, title }: DisqusCommentsProps) {
  const shortname = process.env.NEXT_PUBLIC_DISQUS_SHORTNAME || 'codigofluente';
  
  // Ensure we are on the client
  if (typeof window === 'undefined') return null;

  const config = {
    url: window.location.href,
    identifier: slug,
    title: title,
    language: 'pt_BR'
  };

  return (
    <div className="bg-white/5 p-6 rounded-xl border border-white/5">
      <DiscussionEmbed
        shortname={shortname}
        config={config}
      />
    </div>
  );
}
