/**
 * recover-posts.ts
 *
 * Recupera o conteúdo original dos posts danificados pela migração,
 * buscando diretamente da API REST do WordPress.
 *
 * Uso:
 *   npx tsx --env-file=.env.local src/scripts/recover-posts.ts          <- dry run
 *   npx tsx --env-file=.env.local src/scripts/recover-posts.ts --save   <- salva no banco
 */

import dbConnect from '../lib/mongodb';
import { Post } from '../models/Post';

const DRY_RUN = !process.argv.includes('--save');
const WP_API = 'https://www.codigofluente.com.br/wp-json/wp/v2/posts';

// Posts identificados com conteúdo truncado
const DAMAGED_SLUGS = [
    'aula-11-python-funcoes',
    'aula-09-python-matriz-esparsa',
    'aula-12-python-pydoc-documentacao',
    'aula-10-python-tipo-bool-e-operadores',
    'aula-08-python-dicionario',
    'aula-14-python-pacotes-packages',
    'aula-17-python-geradores-yield',
    'aula-18-programacao-funcional-em-python',
    'aula-16-python-orientacao-a-objetos-02',
    'aula-19-python-biblioteca-padrao-modulo-math',
    'aula-15-python-orientacao-a-objeto-01',
    'aula-20-python-biblioteca-padrao-modulo-io',
    'aula-13-python-modules-modulos',
];

async function fetchFromWordPress(slug: string): Promise<string | null> {
    try {
        const url = `${WP_API}?slug=${slug}&_fields=content`;
        const res = await fetch(url, {
            headers: { 'User-Agent': 'codigofluente-recovery/1.0' },
        });

        if (!res.ok) {
            console.error(`  ❌ HTTP ${res.status} para ${slug}`);
            return null;
        }

        const data = await res.json();

        if (!Array.isArray(data) || data.length === 0) {
            console.error(`  ❌ Post não encontrado no WP: ${slug}`);
            return null;
        }

        return data[0].content?.rendered || null;
    } catch (err) {
        console.error(`  ❌ Erro ao buscar ${slug}:`, err);
        return null;
    }
}

async function main() {
    await dbConnect();

    console.log(`\n${DRY_RUN ? '🔍 DRY RUN — nada será salvo.' : '💾 MODO REAL — salvando no MongoDB.'}`);
    console.log(`📋 Posts a recuperar: ${DAMAGED_SLUGS.length}\n`);

    let recovered = 0;
    let failed = 0;

    for (const slug of DAMAGED_SLUGS) {
        process.stdout.write(`Buscando: ${slug} ... `);

        const wpContent = await fetchFromWordPress(slug);

        if (!wpContent) {
            console.log('FALHOU');
            failed++;
            continue;
        }

        console.log(`OK (${wpContent.length} chars)`);

        if (!DRY_RUN) {
            await Post.updateOne({ slug }, { $set: { content: wpContent } });
            console.log(`  ✅ Salvo no MongoDB`);
        }

        recovered++;

        // Pausa entre requests para não sobrecarregar o WP
        await new Promise(r => setTimeout(r, 500));
    }

    console.log('\n═══════════════════════════════════════════════════════');
    console.log(`  Recuperados : ${recovered}`);
    console.log(`  Falharam    : ${failed}`);

    if (DRY_RUN && recovered > 0) {
        console.log('\n⚠️  Nada foi salvo. Para aplicar rode com --save:');
        console.log('   npx tsx --env-file=.env.local src/scripts/recover-posts.ts --save\n');
    } else if (!DRY_RUN) {
        console.log('\n✅ Recuperação concluída.\n');
    }
}

main().catch(console.error).finally(() => process.exit());