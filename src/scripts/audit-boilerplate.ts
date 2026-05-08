/**
 * audit-boilerplate.ts
 * 
 * Analisa todos os posts e detecta variações do bloco de afiliados/redes sociais.
 * Roda com: npx tsx src/scripts/audit-boilerplate.ts
 * 
 * Coloque este arquivo em: src/scripts/audit-boilerplate.ts
 */

import dbConnect from '../lib/mongodb';
import { Post } from '../models/Post';
import fs from 'fs';

// ── Padrões a detectar ────────────────────────────────────────────────────────

const PATTERNS = {
  temWorkover:    (h: string) => /workover\.com/i.test(h),
  temFacebook:    (h: string) => /facebook\.com\/[Cc]odigo[Ff]luente/i.test(h),
  temPinterest:   (h: string) => /pinterest\.com\/codigofluente/i.test(h),
  temHostinger:   (h: string) => /hostg\.xyz/i.test(h),
  temDigitalOcean:(h: string) => /do\.co\/c\//i.test(h),
  temOneCom:      (h: string) => /one\.com/i.test(h),
  temSeguindo:    (h: string) => /Seguindo\s*;/i.test(h),
  temAutomatize:  (h: string) => /[Aa]utomatize tarefas/i.test(h),
  temQueFazer:    (h: string) => /[Qq]ue fazer esse curso/i.test(h),
  temAcesse:      (h: string) => /<p[^>]*>\s*[Aa]cesse:?\s*<\/p>/i.test(h),
};

type PatternKey = keyof typeof PATTERNS;

// ── Extrai o trecho suspeito do HTML para análise ─────────────────────────────

function extractBoilerplateSnippet(html: string): string | null {
  // Tenta encontrar o início do bloco
  const markers = [
    /<h[1-6][^>]*>[^<]*[Qq]ue fazer esse curso/i,
    /<p[^>]*>[^<]*[Aa]cesse:?[^<]*<\/p>/i,
    /workover\.com/i,
  ];

  let start = -1;
  for (const m of markers) {
    const idx = html.search(m);
    if (idx !== -1 && (start === -1 || idx < start)) start = idx;
  }

  if (start === -1) return null;

  // Pega até 1500 chars a partir do início do bloco
  return html.substring(Math.max(0, start - 50), start + 1500);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  await dbConnect();

  const posts = await Post.find({}).select('_id slug title content').lean();
  console.log(`\n📊 Total de posts: ${posts.length}\n`);

  // Contadores por padrão
  const counters: Record<PatternKey, number> = {} as any;
  for (const key of Object.keys(PATTERNS) as PatternKey[]) counters[key] = 0;

  // Posts SEM nenhum link de afiliado
  let semBoilerplate = 0;

  // Amostra de snippets por combinação de padrões
  const combos: Record<string, { count: number; exemplos: string[] }> = {};

  // Coleta snippets brutos para inspeção manual
  const snippets: { slug: string; snippet: string }[] = [];

  for (const post of posts) {
    const html = (post as any).content || '';
    const slug = (post as any).slug || String((post as any)._id);

    // Quais padrões este post tem?
    const found: PatternKey[] = [];
    for (const [key, fn] of Object.entries(PATTERNS) as [PatternKey, (h: string) => boolean][]) {
      if (fn(html)) {
        counters[key]++;
        found.push(key);
      }
    }

    if (found.length === 0) {
      semBoilerplate++;
      continue;
    }

    // Agrupa por combinação
    const comboKey = found.join(' + ');
    if (!combos[comboKey]) combos[comboKey] = { count: 0, exemplos: [] };
    combos[comboKey].count++;
    if (combos[comboKey].exemplos.length < 2) combos[comboKey].exemplos.push(slug);

    // Guarda snippet das primeiras 30 ocorrências para inspeção
    if (snippets.length < 30) {
      const snippet = extractBoilerplateSnippet(html);
      if (snippet) snippets.push({ slug, snippet });
    }
  }

  // ── Relatório no terminal ──────────────────────────────────────────────────

  console.log('═══════════════════════════════════════════════════════');
  console.log('  FREQUÊNCIA DE CADA ELEMENTO');
  console.log('═══════════════════════════════════════════════════════');
  for (const [key, count] of Object.entries(counters)) {
    const bar = '█'.repeat(Math.round(count / posts.length * 40));
    console.log(`  ${key.padEnd(18)} ${String(count).padStart(4)} posts  ${bar}`);
  }

  console.log(`\n  Sem boilerplate: ${semBoilerplate} posts`);

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('  COMBINAÇÕES ENCONTRADAS (variações)');
  console.log('═══════════════════════════════════════════════════════');
  const sortedCombos = Object.entries(combos).sort((a, b) => b[1].count - a[1].count);
  for (const [combo, { count, exemplos }] of sortedCombos) {
    console.log(`\n  [${count}x] ${combo}`);
    console.log(`       ex: ${exemplos.join(', ')}`);
  }

  // ── Salva snippets em arquivo para análise visual ─────────────────────────

  const reportPath = './boilerplate-audit.html';
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Audit - Boilerplate Snippets</title>
  <style>
    body { font-family: monospace; background: #111; color: #eee; padding: 2rem; }
    h2 { color: #00f5ff; border-bottom: 1px solid #333; padding-bottom: 0.5rem; }
    pre { background: #1a1a2e; padding: 1rem; border-radius: 6px; overflow-x: auto;
          border-left: 3px solid #00f5ff; font-size: 12px; white-space: pre-wrap; word-break: break-all; }
    .slug { color: #ff2d78; font-weight: bold; margin-top: 2rem; display: block; }
  </style>
</head>
<body>
  <h1>Boilerplate Audit — ${new Date().toLocaleString('pt-BR')}</h1>
  <p>Total de snippets coletados: ${snippets.length}</p>
  ${snippets.map(({ slug, snippet }) => `
    <span class="slug">${slug}</span>
    <pre>${snippet.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
  `).join('\n')}
</body>
</html>`;

  fs.writeFileSync(reportPath, html);
  console.log(`\n✅ Relatório visual salvo em: ${reportPath}`);
  console.log('   Abra no browser para ver os snippets HTML brutos.\n');
}

main().catch(console.error).finally(() => process.exit());