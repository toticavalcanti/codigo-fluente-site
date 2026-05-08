/**
 * set-category-hierarchy.ts
 *
 * Define a hierarquia pai/filho das categorias no MongoDB,
 * replicando exatamente a estrutura do menu do WordPress.
 *
 * Uso:
 *   npx tsx --env-file=.env.local src/scripts/set-category-hierarchy.ts
 */

import dbConnect from '../lib/mongodb';
import mongoose from 'mongoose';

// Mapa filho → pai
const HIERARCHY: Record<string, string> = {
  // Programação Web
  'react':                                  'programacao-web',
  'go-para-web':                            'programacao-web',
  'go-app-web-com-redis':                   'go-para-web',
  'fiber':                                  'go-para-web',
  'django':                                 'programacao-web',
  'aplicacao-polls':                        'django',
  'loja-virtual-ecommerce':                 'django',

  // Programação
  'computacao-quantica':                    'algoritmo-linguagem-de-programacao',
  'analise-e-complexidade-de-algoritmo':    'algoritmo-linguagem-de-programacao',
  'python':                                 'algoritmo-linguagem-de-programacao',
  'programacao-em-r':                       'algoritmo-linguagem-de-programacao',
  'linguagem-de-programacao-c':             'algoritmo-linguagem-de-programacao',
  'go':                                     'algoritmo-linguagem-de-programacao',
  'curso-de-javascript':                    'algoritmo-linguagem-de-programacao',
  'fundamentos-do-javascript':              'curso-de-javascript',
  'javascript-web-audio-api':               'curso-de-javascript',
  'react-native':                           'curso-de-javascript',

  // Big Data / IA
  'disrupcoes-tecnologicas':                'big-data',
  'tutorial-hadoop':                        'big-data',
  'data-science-com-r':                     'big-data',
  'certificacao-hortonworks-hadoop':        'big-data',
  'aprendizado-de-maquina-machine-learning':'big-data',
  'sistemas-multi-agentes':                 'aprendizado-de-maquina-machine-learning',
  'python-scikit-learn':                    'aprendizado-de-maquina-machine-learning',
  'python-tensorflow-keras-redes-neurais':  'aprendizado-de-maquina-machine-learning',
  'python-pacote-face-recognition':         'aprendizado-de-maquina-machine-learning',

  // Games
  'games-em-python':                        'criando-games',

  // DevOps
  'aws':                                    'devops',
  'conceito-de-devops':                     'devops',
  'curso-de-git':                           'devops',
  'docker':                                 'devops',
  'kubernates':                             'devops',
};

// Categorias de topo (aparecem no menu principal)
const TOP_LEVEL = [
  'programacao-web',
  'algoritmo-linguagem-de-programacao',
  'plataformas-de-ia',
  'big-data',
  'criando-games',
  'devops',
  'noticias-sobre-tecnologia',
];

async function main() {
  await dbConnect();
  const db = mongoose.connection.db!;
  const col = db.collection('categories');

  let updated = 0;

  // Define parent_slug para filhos
  for (const [slug, parentSlug] of Object.entries(HIERARCHY)) {
    const result = await col.updateOne(
      { slug },
      { $set: { parent_slug: parentSlug, is_top_level: false } }
    );
    if (result.matchedCount > 0) {
      console.log(`✅ ${slug} → parent: ${parentSlug}`);
      updated++;
    } else {
      console.log(`⚠️  Não encontrado: ${slug}`);
    }
  }

  // Define top-level
  for (const slug of TOP_LEVEL) {
    const result = await col.updateOne(
      { slug },
      { $set: { parent_slug: null, is_top_level: true } }
    );
    if (result.matchedCount > 0) {
      console.log(`🔝 ${slug} → top-level`);
      updated++;
    } else {
      console.log(`⚠️  Não encontrado top-level: ${slug}`);
    }
  }

  console.log(`\n✅ Hierarquia definida: ${updated} categorias atualizadas.`);
}

main().catch(console.error).finally(() => process.exit());