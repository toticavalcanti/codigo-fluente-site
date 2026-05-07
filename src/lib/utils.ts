export function cleanWordPressContent(html: string): string {
  if (!html) return '';

  let cleaned = html;

  // 1. Remove shortcodes [caption...], [gallery...], etc.
  cleaned = cleaned.replace(/\[([^\]]*)\]/g, '');

  // 2. Remove navigation <h3> links (e.g. "Voltar para página principal", "Todas as aulas desse curso", etc.)
  // These usually come after the main title h1
  cleaned = cleaned.replace(/<h3[^>]*>[\s\S]*?(Voltar para página principal|Todas as aulas|Aula \d+|Próxima Aula)[\s\S]*?<\/h3>/gi, '');

  // 3. Remove footer "junk" sections
  // Markers to stop at: find the first occurrence and cut everything after it
  const markers = [
    /<h2>[\s\S]*?Redes Sociais/i,
    /<h2>[\s\S]*?Conecte-se/i,
    /<h2>[\s\S]*?Recursos e Afiliados/i,
    /<h2>[\s\S]*?Canais do Youtube/i,
    /<h2>[\s\S]*?PIX/i,
    /<h3>[\s\S]*?Scarlett Finch/i
  ];

  let firstMarkerIndex = -1;
  markers.forEach(marker => {
    const match = cleaned.match(marker);
    if (match && match.index !== undefined) {
      if (firstMarkerIndex === -1 || match.index < firstMarkerIndex) {
        firstMarkerIndex = match.index;
      }
    }
  });

  if (firstMarkerIndex !== -1) {
    cleaned = cleaned.substring(0, firstMarkerIndex);
  }

  // 4. Cleanup loose elements
  cleaned = cleaned.replace(/<hr[^>]*>/gi, '');
  cleaned = cleaned.replace(/<p[^>]*>&nbsp;<\/p>/gi, '');
  cleaned = cleaned.replace(/<p[^>]*>\s*<\/p>/gi, '');

  // 5. Final trim
  return cleaned.trim();
}
