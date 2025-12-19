#!/usr/bin/env python3
"""
Script para buscar TODOS os repositórios públicos do GitHub
e detectar domínios personalizados configurados.
"""

import requests
import json
from typing import List, Dict, Optional

GITHUB_USERNAME = "mediagrowthmkt-debug"
GITHUB_API_URL = "https://api.github.com"

def fetch_all_public_repos() -> List[Dict]:
    """
    Busca todos os repositórios públicos do usuário no GitHub.
    """
    all_repos = []
    page = 1
    per_page = 100
    
    print(f"🔍 Buscando repositórios de {GITHUB_USERNAME}...\n")
    
    while True:
        url = f"{GITHUB_API_URL}/users/{GITHUB_USERNAME}/repos"
        params = {
            'per_page': per_page,
            'page': page,
            'type': 'public'
        }
        
        try:
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            repos = response.json()
            
            if not repos:
                break  # Não há mais repositórios
            
            # Filtra apenas repos com GitHub Pages habilitado
            for repo in repos:
                if repo.get('has_pages', False):
                    all_repos.append({
                        'name': repo['name'],
                        'full_name': repo['full_name'],
                        'homepage': repo.get('homepage', ''),
                        'description': repo.get('description', ''),
                        'html_url': repo['html_url'],
                        'created_at': repo['created_at'],
                        'updated_at': repo['updated_at'],
                        'has_pages': True
                    })
            
            if len(repos) < per_page:
                break  # Última página
            
            page += 1
            
        except requests.RequestException as e:
            print(f"❌ Erro ao buscar página {page}: {e}")
            break
    
    return all_repos

def detect_custom_domain(repo_name: str) -> Optional[str]:
    """
    Detecta domínio personalizado verificando arquivo CNAME no repositório.
    """
    # Tenta branch gh-pages primeiro
    branches = ['gh-pages', 'main', 'master']
    
    for branch in branches:
        cname_url = f"https://raw.githubusercontent.com/{GITHUB_USERNAME}/{repo_name}/{branch}/CNAME"
        
        try:
            response = requests.get(cname_url, timeout=5)
            if response.status_code == 200:
                custom_domain = response.text.strip()
                if custom_domain and 'github.io' not in custom_domain:
                    return custom_domain
        except requests.RequestException:
            continue
    
    return None

def main():
    """
    Função principal.
    """
    # Busca todos os repositórios
    repos = fetch_all_public_repos()
    
    print(f"📦 Total de repositórios com GitHub Pages: {len(repos)}\n")
    print("=" * 80)
    
    # Detecta domínios personalizados
    repos_with_domains = []
    repos_without_domains = []
    
    for repo in repos:
        repo_name = repo['name']
        print(f"\n🔍 Verificando: {repo_name}")
        
        # Verifica homepage
        if repo['homepage'] and 'github.io' not in repo['homepage']:
            custom_domain = repo['homepage'].replace('https://', '').replace('http://', '').rstrip('/')
            print(f"  ✅ Homepage: {custom_domain}")
            repo['custom_domain'] = custom_domain
            repos_with_domains.append(repo)
        else:
            # Tenta detectar CNAME
            custom_domain = detect_custom_domain(repo_name)
            if custom_domain:
                print(f"  ✅ CNAME: {custom_domain}")
                repo['custom_domain'] = custom_domain
                repos_with_domains.append(repo)
            else:
                github_pages_url = f"https://{GITHUB_USERNAME}.github.io/{repo_name}/"
                print(f"  📄 GitHub Pages: {github_pages_url}")
                repo['github_pages_url'] = github_pages_url
                repos_without_domains.append(repo)
    
    # Relatório final
    print("\n" + "=" * 80)
    print(f"\n📊 RESUMO:")
    print(f"  • Total de repositórios: {len(repos)}")
    print(f"  • Com domínio personalizado: {len(repos_with_domains)}")
    print(f"  • Apenas GitHub Pages: {len(repos_without_domains)}")
    
    # Lista domínios personalizados
    if repos_with_domains:
        print(f"\n🌟 DOMÍNIOS PERSONALIZADOS ENCONTRADOS:")
        for repo in repos_with_domains:
            print(f"  • {repo['name']:40} → {repo['custom_domain']}")
    
    # Salva resultado em JSON
    output = {
        'total_repos': len(repos),
        'with_custom_domain': len(repos_with_domains),
        'github_pages_only': len(repos_without_domains),
        'repos_with_domains': repos_with_domains,
        'repos_without_domains': repos_without_domains
    }
    
    output_file = 'github_repos_analysis.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
    
    print(f"\n💾 Resultado salvo em: {output_file}")
    
    # Gera código JavaScript para CUSTOM_DOMAINS
    if repos_with_domains:
        print(f"\n📝 CÓDIGO JAVASCRIPT (CUSTOM_DOMAINS):")
        print("const CUSTOM_DOMAINS = {")
        for repo in repos_with_domains:
            print(f"    '{repo['name']}': '{repo['custom_domain']}',")
        print("};")

if __name__ == '__main__':
    main()
