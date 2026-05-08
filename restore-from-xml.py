#!/usr/bin/env python3
"""
restore-from-xml.py

Restaura todos os 486 posts diretamente do backup XML do WordPress para o MongoDB.
Limpa automaticamente o boilerplate (Redes Sociais, YouTube, PIX, afiliados).

Uso:
  python restore-from-xml.py                    <- dry run (não salva)
  python restore-from-xml.py --save             <- salva no MongoDB

Requisitos:
  pip install pymongo

Coloque este arquivo na raiz do projeto codigofluente-next.
Precisa do arquivo .env.local com MONGODB_URI.
"""

import sys
import re
import os
import xml.etree.ElementTree as ET

# ── Ler MONGODB_URI do .env.local ─────────────────────────────────────────────
def load_env(path='.env.local'):
    env = {}
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    k, v = line.split('=', 1)
                    env[k.strip()] = v.strip()
    return env

env = load_env()
MONGODB_URI = env.get('MONGODB_URI', '')
if not MONGODB_URI:
    print("❌ MONGODB_URI não encontrado em .env.local")
    sys.exit(1)

DRY_RUN = '--save' not in sys.argv

# ── Limpeza de boilerplate ─────────────────────────────────────────────────────

def strip_boilerplate(html):
    """
    Remove o boilerplate do WordPress do conteúdo de cada post.
    Suporta 3 padrões encontrados nos 486 posts:
    
    1. Boilerplate no MEIO com "Seguindo ;)" como marcador de fim
       → Mantém o que vem APÓS "Seguindo ;)"
    
    2. Boilerplate no INÍCIO com seção PIX seguida de <hr> 
       → Mantém o que vem APÓS o <hr> (posts mais novos)
    
    3. Boilerplate no FINAL começando com "Redes Sociais" ou "Canais do Youtube"
       → Mantém o que vem ANTES desses marcadores
    """
    if not html:
        return html

    # Padrão 1: "Seguindo ;)" heading — conteúdo DEPOIS
    m = re.search(r'<h[1-6][^>]*>\s*Seguindo\s*;?\s*\)\s*</h[1-6]>', html, re.I)
    if m:
        after = html[m.end():].strip()
        if len(after) > 200:
            return after

    # Padrão 2: PIX + <hr> — conteúdo DEPOIS (posts mais novos)
    anchor = re.search(r'(?:PIX para doa|Canais do Youtube)', html, re.I)
    if anchor:
        after_anchor = html[anchor.start():]
        hr = re.search(r'<hr\s*/?>', after_anchor, re.I)
        if hr:
            real_content = after_anchor[hr.end():].strip()
            if len(real_content) > 200:
                return real_content

    # Padrão 3: boilerplate no FINAL — conteúdo ANTES
    for pattern in [
        r'<h2[^>]*>\s*(?:<strong>)?\s*Redes Sociais do C[oó]digo Fluente',
        r'<h2[^>]*>\s*<strong>\s*Canais do Youtube',
    ]:
        m = re.search(pattern, html, re.I)
        if m:
            before = html[:m.start()].strip()
            # Verifica se há conteúdo real (não só navegação/captions)
            text_only = re.sub(r'<[^>]+>', '', 
                         re.sub(r'\[caption[^\]]*\].*?\[/caption\]', '', before, flags=re.S)
                       ).strip()
            if len(text_only) > 150:
                return before

    return html

# ── Parsear XML do WordPress ───────────────────────────────────────────────────

def parse_wordpress_xml(xml_path):
    print(f"📂 Lendo {xml_path}...")
    tree = ET.parse(xml_path)
    root = tree.getroot()

    ns = {
        'content': 'http://purl.org/rss/1.0/modules/content/',
        'wp': 'http://wordpress.org/export/1.2/',
    }

    posts = {}
    for item in root.findall('.//item'):
        post_type = item.find('wp:post_type', ns)
        status = item.find('wp:status', ns)

        if post_type is not None and post_type.text == 'post':
            if status is not None and status.text == 'publish':
                slug = item.find('wp:post_name', ns)
                content = item.find('content:encoded', ns)

                if slug is not None and slug.text:
                    raw = content.text if content is not None and content.text else ''
                    posts[slug.text] = strip_boilerplate(raw)

    print(f"✅ {len(posts)} posts extraídos e limpos")
    return posts

# ── Atualizar MongoDB ─────────────────────────────────────────────────────────

def restore_to_mongodb(posts):
    from pymongo import MongoClient

    client = MongoClient(MONGODB_URI)
    # Extrai o nome do banco da URI
    db_name = MONGODB_URI.split('/')[-1].split('?')[0] or 'codigofluente'
    db = client[db_name]
    collection = db['posts']

    print(f"\n{'🔍 DRY RUN — nada será salvo.' if DRY_RUN else '💾 SALVANDO NO MONGODB...'}")
    print(f"📊 Total: {len(posts)} posts\n")

    updated = 0
    skipped = 0
    not_found = 0

    for i, (slug, content) in enumerate(posts.items()):
        # Verifica se o post existe no MongoDB
        existing = collection.find_one({'slug': slug}, {'_id': 1, 'content': 1})

        if existing is None:
            not_found += 1
            continue

        if not DRY_RUN:
            collection.update_one(
                {'slug': slug},
                {'$set': {'content': content}}
            )
        updated += 1

        if (i + 1) % 50 == 0:
            print(f"  {i + 1}/{len(posts)} processados...")

    print(f"\n{'═' * 55}")
    print(f"  Atualizados : {updated}")
    print(f"  Não encontrados : {not_found}")

    if DRY_RUN:
        print(f"\n⚠️  Nada foi salvo. Para aplicar rode com --save:")
        print(f"   python restore-from-xml.py --save\n")
    else:
        print(f"\n✅ Restauração concluída!\n")

    client.close()

# ── Main ──────────────────────────────────────────────────────────────────────

if __name__ == '__main__':
    # Procura o XML na pasta atual ou subpastas
    xml_path = None
    for candidate in ['*.xml', '../*.xml']:
        import glob
        matches = glob.glob(candidate)
        if matches:
            xml_path = matches[0]
            break

    if not xml_path:
        # Pede o caminho
        xml_path = input("Caminho do arquivo XML do WordPress: ").strip()

    if not os.path.exists(xml_path):
        print(f"❌ Arquivo não encontrado: {xml_path}")
        sys.exit(1)

    posts = parse_wordpress_xml(xml_path)
    restore_to_mongodb(posts)
    