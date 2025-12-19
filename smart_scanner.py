#!/usr/bin/env python3
"""
Scanner inteligente: testa URLs diretas dos repositórios GitHub
para encontrar GitHub Pages ativos (mesmo sem acesso à API de Pages).
"""

import requests
import time
from typing import List, Tuple

GITHUB_USERNAME = "mediagrowthmkt-debug"
GITHUB_PAGES_BASE = f"https://{GITHUB_USERNAME}.github.io"

# Repositórios conhecidos
REPOS = [
    "06-link-bio-banca-pacheco",
    "ADU-HOMEADDITION",
    "BATHROOM-REMODELING-WOLF",
    "CUSTOM-BUILT-INS-INNOV",
    "KITCHEN-REMODELING-INNOV",
    "KITCHEN-REMODELING-WOLF",
    "PAINTING",
    "STAIR-REMODELING-INNOV",
    # Adicione outros repositórios conhecidos
    "AMCC-LP",
    "03-LANDING-PAGE-PROMOCOES-BANCA",
    "05-lp-queijos-frios",
    "07-TABOAS-DE-FRIOS",
    "LP-CONSULTORIA",
    "LP-PROJETO-ARQUITETONICO",
    "LINKTREE"
]

# Domínios personalizados conhecidos para testar
CUSTOM_DOMAINS = {
    "BATHROOM-REMODELING-WOLF": "bathroom.wolfcarpenters.com",
    "KITCHEN-REMODELING-WOLF": "kitchen.wolfcarpenters.com",
    "ADU-HOMEADDITION": "adu.wolfcarpenters.com",
    "CUSTOM-BUILT-INS-INNOV": "custombuiltins.innovcarpenters.com",
    "KITCHEN-REMODELING-INNOV": "kitchen.innovcarpenters.com",
    "STAIR-REMODELING-INNOV": "stairs.innovcarpenters.com",
    "PAINTING": "painting.innovcarpenters.com",
}

def test_url(url: str, name: str) -> Tuple[bool, int]:
    """Testa se uma URL está acessível"""
    try:
        response = requests.head(url, allow_redirects=True, timeout=10)
        return (response.status_code == 200, response.status_code)
    except:
        return (False, 0)

def scan_repository(repo_name: str) -> dict:
    """Escaneia um repositório para URLs GitHub Pages"""
    print(f"\n📦 {repo_name}")
    
    result = {
        "repo": repo_name,
        "github_pages_url": None,
        "custom_domain_url": None,
        "accessible": False
    }
    
    # Teste 1: URL GitHub Pages direta
    github_url = f"{GITHUB_PAGES_BASE}/{repo_name}/"
    print(f"   🔗 Testando GitHub Pages: {github_url[:60]}...", end=" ")
    accessible, status = test_url(github_url, repo_name)
    
    if accessible:
        print(f"✅ {status}")
        result["github_pages_url"] = github_url
        result["accessible"] = True
    else:
        print(f"❌ {status if status else 'Erro'}")
    
    time.sleep(0.3)
    
    # Teste 2: Domínio personalizado
    if repo_name in CUSTOM_DOMAINS:
        custom_url = f"https://{CUSTOM_DOMAINS[repo_name]}"
        print(f"   🌟 Testando domínio personalizado: {custom_url}...", end=" ")
        accessible, status = test_url(custom_url, repo_name)
        
        if accessible:
            print(f"✅ {status}")
            result["custom_domain_url"] = custom_url
            result["accessible"] = True
        else:
            print(f"❌ {status if status else 'Erro'}")
        
        time.sleep(0.3)
    
    return result

def main():
    print("="*80)
    print("🔍 SCANNER INTELIGENTE DE GITHUB PAGES")
    print("="*80)
    print(f"\n👤 Usuário: {GITHUB_USERNAME}")
    print(f"📊 Repositórios para escanear: {len(REPOS)}\n")
    
    results = []
    accessible_count = 0
    
    for repo in REPOS:
        result = scan_repository(repo)
        results.append(result)
        if result["accessible"]:
            accessible_count += 1
    
    # Resumo
    print("\n" + "="*80)
    print("📊 RESUMO")
    print("="*80)
    print(f"Total de repositórios: {len(results)}")
    print(f"Com GitHub Pages acessível: {accessible_count}")
    print("="*80 + "\n")
    
    # URLs encontradas
    if accessible_count > 0:
        print("✅ URLs ENCONTRADAS:\n")
        
        for result in results:
            if result["accessible"]:
                print(f"📦 {result['repo']}")
                if result["github_pages_url"]:
                    print(f"   🌐 GitHub Pages: {result['github_pages_url']}")
                if result["custom_domain_url"]:
                    print(f"   ⭐ Domínio Personalizado: {result['custom_domain_url']}")
                print()
        
        # Gerar código JavaScript
        print("\n🔧 CÓDIGO JAVASCRIPT PARA ATUALIZAR:\n")
        print("// Adicione estas URLs no projects-dashboard.html:\n")
        
        for result in results:
            if result["accessible"]:
                url_to_use = result["custom_domain_url"] or result["github_pages_url"]
                print(f'// {result["repo"]}')
                print(f'liveUrl: "{url_to_use}",\n')
        
        # Domínios personalizados
        custom_found = {r["repo"]: CUSTOM_DOMAINS[r["repo"]] 
                       for r in results 
                       if r["accessible"] and r["custom_domain_url"]}
        
        if custom_found:
            print("\n// Domínios personalizados:")
            print("const CUSTOM_DOMAINS = {")
            for repo, domain in custom_found.items():
                print(f"    '{repo}': '{domain}',")
            print("};")
    else:
        print("❌ NENHUMA URL ACESSÍVEL ENCONTRADA")
        print("\nℹ️  Possíveis causas:")
        print("   • GitHub Pages não está ativado nos repositórios")
        print("   • Repositórios são privados")
        print("   • URLs dos domínios personalizados mudaram")
    
    print("\n" + "="*80)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Scan interrompido")
