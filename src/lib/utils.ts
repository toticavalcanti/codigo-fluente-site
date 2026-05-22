export function cleanWordPressContent(html: string): string {
  if (!html) return '';

  console.log('\n=== HTML BRUTO ===\n' + html.substring(0, 5000) + '\n=== FIM ===\n');

  let cleaned = html;

  // Posts antigos: boilerplate termina com heading "Seguindo ;)"
  // O conteúdo real vem DEPOIS desse heading
  const seguindoHeading = cleaned.match(/<h[1-6][^>]*>\s*Seguindo\s*;?\s*\)\s*<\/h[1-6]>/i);
  if (seguindoHeading && seguindoHeading.index !== undefined) {
    const afterSeguindo = cleaned.substring(seguindoHeading.index + seguindoHeading[0].length).trim();
    if (afterSeguindo.length > 200) {
      cleaned = afterSeguindo;
    }
  }

  // Posts antigos: boilerplate termina com caption do "Curso Python Bot"
  // Remove tudo do início até o fim desse caption (inclusive)
  cleaned = cleaned.replace(/^[\s\S]*?Curso Python Bot\[\/caption\]\s*/i, '');

  cleaned = cleaned.replace(/<h3[^>]*>(?:(?!<h3).)*?(Voltar para página principal|Todas as aulas|Aula \d+|Próxima Aula).*?<\/h3>/gi, '');
  cleaned = cleaned.replace(/\[caption[^\]]*\][\s\S]*?\[\/caption\]/gi, '');
  cleaned = cleaned.replace(/\[caption[^\]]*\/\]/gi, '');
  cleaned = cleaned.replace(/<hr[^>]*>/gi, '');
  cleaned = cleaned.replace(/<p[^>]*>&nbsp;<\/p>/gi, '');
  cleaned = cleaned.replace(/<p[^>]*>\s*<\/p>/gi, '');

  // O boilerplate do WordPress fica no INÍCIO e termina com "Seguindo"
  // Remove tudo do início até o fechamento desse parágrafo (inclusive)
  const seguindoMatch = cleaned.match(/^[\s\S]*?Seguindo\s*;?\s*\)<\/p>/i);
  if (seguindoMatch) {
    cleaned = cleaned.substring(seguindoMatch[0].length);
  }

  return cleaned.trim();
}

export function getYouTubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  
  // Extract ID from various YouTube URL formats
  const regExp = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/vi\/)([^&\n?#]+)/i;
  const match = url.match(regExp);
  if (match && match[1]) {
    return match[1];
  }
  
  // Check if it's already a clean 11-character YouTube ID
  const cleanUrl = url.trim();
  if (cleanUrl.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) {
    return cleanUrl;
  }
  
  return null;
}

export function getPostThumbnail(post: {
  thumbnail?: string;
  youtube_id?: string;
  video_url?: string;
  content?: string;
}): string {
  // 1. If we have a valid thumbnail, use it
  if (post.thumbnail && typeof post.thumbnail === 'string') {
    const thumb = post.thumbnail.trim();
    if (
      thumb !== '' &&
      !thumb.endsWith('.r2.d') &&
      !thumb.endsWith('.d') && // Catch the user's typo ending in .d or .r2.d
      (thumb.startsWith('http') || thumb.startsWith('/'))
    ) {
      return thumb;
    }
  }

  // 2. Extract YouTube ID to generate a fallback thumbnail
  let ytId: string | null = null;

  if (post.youtube_id) {
    ytId = getYouTubeId(post.youtube_id);
  }

  if (!ytId && post.video_url) {
    ytId = getYouTubeId(post.video_url);
  }

  if (!ytId && post.content) {
    ytId = getYouTubeId(post.content);
  }

  if (ytId) {
    return `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`;
  }

  // 3. Fallback image
  return '/images/fallback-thumb.png';
}
