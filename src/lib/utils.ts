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
