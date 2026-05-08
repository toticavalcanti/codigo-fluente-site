/**
 * migrate-clean-content.ts
 *
 * Remove o bloco de boilerplate do WordPress do final de cada post.
 *
 * MODO SEGURO: por padrão roda em dry-run (não salva no banco).
 * Para salvar de verdade, passe --save como argumento:
 *   npx tsx --env-file=.env.local src/scripts/migrate-clean-content.ts --save
 */

import dbConnect from '../lib/mongodb';
import { Post } from '../models/Post';
import fs from 'fs';

const DRY_RUN = !process.argv.includes('--save');

function stripBoilerplate(html: string): { result: string; method: string | null } {
    if (!html) return { result: html, method: null };

    // Estratégia 1: âncora "Canais do Youtube" — mais confiável (~330 posts)
    const youtubeHeadingIdx = html.search(/<h2[^>]*>\s*<strong>\s*Canais do Youtube\s*<\/strong>\s*<\/h2>/i);
    if (youtubeHeadingIdx !== -1) {
        const beforeHeading = html.substring(0, youtubeHeadingIdx);
        const lastUlIdx = beforeHeading.lastIndexOf('<ul');
        if (lastUlIdx !== -1) {
            return { result: html.substring(0, lastUlIdx).trimEnd(), method: 'youtube-heading+ul' };
        }
        return { result: html.substring(0, youtubeHeadingIdx).trimEnd(), method: 'youtube-heading' };
    }

    // Estratégia 2: heading "Que fazer esse curso com certificação?"
    const queFazerIdx = html.search(/<h[1-6][^>]*>[^<]*[Qq]ue fazer esse curso[^<]*<\/h[1-6]>/i);
    if (queFazerIdx !== -1) {
        return { result: html.substring(0, queFazerIdx).trimEnd(), method: 'que-fazer-heading' };
    }

    // Estratégia 3: Facebook em <li>
    const fbInListMatch = html.match(/<li[^>]*>[\s\S]{0,200}facebook\.com\/[Cc]odigo[Ff]luente/i);
    if (fbInListMatch && fbInListMatch.index !== undefined) {
        const beforeFb = html.substring(0, fbInListMatch.index);
        const lastUlIdx = beforeFb.lastIndexOf('<ul');
        if (lastUlIdx !== -1) {
            return { result: html.substring(0, lastUlIdx).trimEnd(), method: 'facebook-in-list' };
        }
    }

    // Estratégia 4: Facebook em <p>
    const fbInPMatch = html.match(/<p[^>]*>[^<]*(?:gostarem|joinha|Código Fluente)[^<]*<a[^>]*facebook\.com/i);
    if (fbInPMatch && fbInPMatch.index !== undefined) {
        return { result: html.substring(0, fbInPMatch.index).trimEnd(), method: 'facebook-in-p' };
    }

    return { result: html, method: null };
}

async function main() {
    await dbConnect();

    const posts = await Post.find({}).select('_id slug content').lean();
    const total = posts.length;

    console.log(`\n${DRY_RUN ? '🔍 DRY RUN — nada será salvo.' : '💾 MODO REAL — salvando no MongoDB.'}`);
    console.log(`📊 Total de posts: ${total}\n`);

    const stats: Record<string, number> = {};
    const logLines: string[] = [
        `Migration run: ${new Date().toISOString()}`,
        `Mode: ${DRY_RUN ? 'DRY RUN' : 'SAVE'}`,
        `Total posts: ${total}`,
        '---',
    ];

    let modified = 0;

    for (const post of posts) {
        const p = post as { _id: unknown; slug: string; content: string };
        const slug = p.slug || String(p._id);
        const original = p.content || '';
        const { result, method } = stripBoilerplate(original);

        if (result !== original) {
            modified++;
            stats[method!] = (stats[method!] || 0) + 1;
            logLines.push(`CLEAN [${method}] ${slug}`);
            if (!DRY_RUN) {
                await Post.updateOne({ _id: p._id }, { $set: { content: result } });
            }
        } else {
            logLines.push(`SKIP  ${slug}`);
        }
    }

    console.log('═══════════════════════════════════════════════════════');
    console.log(`  Posts modificados : ${modified} / ${total}`);
    console.log(`  Posts sem mudança : ${total - modified}`);
    console.log('\n  Por estratégia:');
    for (const [method, count] of Object.entries(stats)) {
        console.log(`    ${method.padEnd(22)} ${count}x`);
    }

    if (DRY_RUN) {
        console.log('\n⚠️  Nada foi salvo. Para aplicar rode com --save:\n');
        console.log('   npx tsx --env-file=.env.local src/scripts/migrate-clean-content.ts --save\n');
    } else {
        console.log('\n✅ Migração concluída.\n');
    }

    fs.writeFileSync('./migration-log.txt', logLines.join('\n'));
    console.log('📄 Log salvo em: migration-log.txt');
}

main().catch(console.error).finally(() => process.exit());