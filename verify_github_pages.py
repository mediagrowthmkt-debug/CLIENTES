#!/usr/bin/env python3
"""
Script para verificar se as URLs do GitHub Pages estão ativas
e detectar domínios personalizados através de requisições HTTP.
"""

import requests
import json
from typing import Dict, List, Optional
import time

# Configurações
GITHUB_USERNAME = "mediagrowthmkt-debug"
TIMEOUT = 10

# Lista de repositórios conhecidos baseados no dashboard
KNOWN_REPOS = [
    # INNOV
    "KITCHEN-REMODELING-INNOV",
    "CUSTOM-BUILT-INS-INNOV",
    "PAINTING",
    "STAIR-REMODELING-INNOV",
    
    # WOLF
    "KITCHEN-REMODELING-WOLF",
    "BATHROOM-REMODELING-WOLF",
    "ADU-HOMEADDITION",
    
    # BANCA PACHECO
    "03-LANDING-PAGE-PROMOCOES-BANCA",
    "05-lp-queijos-frios",
    "06-link-bio-banca-pacheco",
    
    # AMCC
    "AMCC-LP",
    "LP-EMPRESAS-QUE-FATURAM-ACIMA-DE-MIL-REAIS-POR-M-S",
    "LP-ESCOLAS-PARTICULARES",
    "LP-OTICA",
    
    # ENGITUNNEL
    "01---LP-CONSULTORIA",
    "02---LP-PROJETO-ARQUITETONICO",
    "03---LP-CONSULTORIA-ENGENHARIA",
    "04---LP-CONSULTORIA-ENGENHARIA-CIVIL",
    "05---LP-ESTABILIDADE-ESTRUTURAL",
    "06---LP-FISCALIZACAO-OBRAS",
    "07---LP-GERENCIAMENTO-OBRAS",
    "08---LP-INSPECAO-PREDIAL",
    "09---LP-AVALIACAO-E-PERICIA",
    "LINKTREE",
    
    # PROTEC
    "LP-PROTEC-GRANITE-2",
    "LP-PROTEC-QUARTZ",
]

def check_github_pages_url(repo_name: str) -> Dict:
    """Verifica se a URL do GitHub Pages está ativa"""
    url = f"https://{GITHUB_USERNAME}.github.io/{repo_name}/"
    
    print(f"🔍 Verificando: {repo_name}...", end=" ")
    
    try:
        response = requests.get(url, timeout=TIMEOUT, allow_redirects=True)
        
        if response.status_code == 200:
            # Verifica se houve redirect para domínio personalizado
            final_url = response.url
            if final_url != url and not final_url.startswith(f"https://{GITHUB_USERNAME}.github.io"):
                # Domínio personalizado detectado
                custom_domain = final_url.replace('https://', '').replace('http://', '').split('/')[0]
                print(f"✅ ATIVO | 🌟 Domínio: {custom_domain}")
                return {
                    'repo_name': repo_name,
                    'github_pages_url': url,
                    'custom_domain': custom_domain,
                    'final_url': final_url,
                    'status': 'active',
                    'status_code': response.status_code
                }
            else:
                print(f"✅ ATIVO | 🌐 GitHub Pages")
                return {
                    'repo_name': repo_name,
                    'github_pages_url': url,
                    'custom_domain': None,
                    'final_url': url,
                    'status': 'active',
                    'status_code': response.status_code
                }
        elif response.status_code == 404:
            print(f"❌ 404 (Não encontrado)")
            return {
                'repo_name': repo_name,
                'github_pages_url': url,
                'status': 'not_found',
                'status_code': 404
            }
        else:
            print(f"⚠️  Status: {response.status_code}")
            return {
                'repo_name': repo_name,
                'github_pages_url': url,
                'status': 'error',
                'status_code': response.status_code
            }
            
    except requests.exceptions.Timeout:
        print(f"⏱️  Timeout")
        return {
            'repo_name': repo_name,
            'github_pages_url': url,
            'status': 'timeout'
        }
    except requests.exceptions.RequestException as e:
        print(f"❌ Erro: {str(e)[:50]}")
        return {
            'repo_name': repo_name,
            'github_pages_url': url,
            'status': 'error',
            'error': str(e)
        }

def scan_all_repos() -> Dict:
    """Escaneia todos os repositórios conhecidos"""
    print("="*70)
    print("🚀 VERIFICADOR DE GITHUB PAGES")
    print("="*70 + "\n")
    
    results = {
        'total_checked': len(KNOWN_REPOS),
        'active': 0,
        'with_custom_domain': 0,
        'not_found': 0,
        'repositories': []
    }
    
    for repo in KNOWN_REPOS:
        result = check_github_pages_url(repo)
        results['repositories'].append(result)
        
        if result['status'] == 'active':
            results['active'] += 1
            if result.get('custom_domain'):
                results['with_custom_domain'] += 1
        elif result['status'] == 'not_found':
            results['not_found'] += 1
        
        time.sleep(0.5)  # Rate limiting
    
    return results

def generate_custom_domains_object(results: Dict) -> str:
    """Gera o objeto CUSTOM_DOMAINS para o dashboard"""
    print("\n" + "="*70)
    print("📊 RESUMO")
    print("="*70)
    print(f"Total verificado: {results['total_checked']}")
    print(f"GitHub Pages ativos: {results['active']}")
    print(f"Com domínio personalizado: {results['with_custom_domain']}")
    print(f"Não encontrados (404): {results['not_found']}")
    print("="*70 + "\n")
    
    # Gera objeto CUSTOM_DOMAINS
    custom_domains = {}
    for repo in results['repositories']:
        if repo.get('custom_domain'):
            custom_domains[repo['repo_name']] = repo['custom_domain']
    
    js_code = "const CUSTOM_DOMAINS = {\n"
    for repo_name, domain in sorted(custom_domains.items()):
        js_code += f"    '{repo_name}': '{domain}',\n"
    js_code += "};"
    
    print("🔧 CÓDIGO PARA O DASHBOARD:\n")
    print(js_code)
    print("\n")
    
    # Lista URLs ativas
    print("📋 GITHUB PAGES ATIVOS:\n")
    for repo in results['repositories']:
        if repo['status'] == 'active':
            print(f"✅ {repo['repo_name']}")
            if repo.get('custom_domain'):
                print(f"   🌟 Domínio: https://{repo['custom_domain']}")
            else:
                print(f"   🌐 GitHub Pages: {repo['github_pages_url']}")
            print()
    
    return js_code

def main():
    results = scan_all_repos()
    generate_custom_domains_object(results)
    
    # Salva resultados
    with open('github_pages_verification.json', 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    print("💾 Resultados salvos em: github_pages_verification.json\n")
    print("="*70)
    print("✨ VERIFICAÇÃO COMPLETA!")
    print("="*70)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Verificação interrompida pelo usuário")
    except Exception as e:
        print(f"\n❌ Erro: {e}")
        import traceback
        traceback.print_exc()
