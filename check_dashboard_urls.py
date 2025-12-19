#!/usr/bin/env python3
"""
Script para verificar quais URLs do dashboard estão realmente acessíveis
e encontrar URLs corretas para os projetos.
"""

import requests
import json
import time
from urllib.parse import urlparse
from typing import Dict, List, Tuple

# Lista de URLs para testar (extraídas do dashboard)
TEST_URLS = [
    # AMCC
    ("AMCC - LP Padrão", "https://mediagrowthmkt-debug.github.io/AMCC-LP/LP%20PADRÃO"),
    ("AMCC - LP Padrão/Google", "https://mediagrowthmkt-debug.github.io/AMCC-LP/LP%20PADRÃO/google"),
    ("AMCC - LP Padrão/Meta", "https://mediagrowthmkt-debug.github.io/AMCC-LP/LP%20PADRÃO/meta"),
    ("AMCC - LP Empresas >1k", "https://mediagrowthmkt-debug.github.io/LP-EMPRESAS-QUE-FATURAM-ACIMA-DE-MIL-REAIS-POR-M-S/"),
    ("AMCC - LP Escolas", "https://mediagrowthmkt-debug.github.io/LP-ESCOLAS-PARTICULARES/"),
    ("AMCC - LP Ótica", "https://mediagrowthmkt-debug.github.io/LP-OTICA/"),
    
    # Banca Pacheco
    ("Banca Pacheco - Site Principal", "https://bancapacheco.com.br"),
    ("Banca Pacheco - Site Completo", "https://mediagrowthmkt-debug.github.io/03-LANDING-PAGE-PROMOCOES-BANCA/02-SITE-COMPLETO-COPIA"),
    ("Banca Pacheco - LP Promoções", "https://mediagrowthmkt-debug.github.io/03-LANDING-PAGE-PROMOCOES-BANCA/"),
    ("Banca Pacheco - LP Queijos", "https://mediagrowthmkt-debug.github.io/05-lp-queijos-frios/"),
    ("Banca Pacheco - Link Bio", "https://mediagrowthmkt-debug.github.io/06-link-bio-banca-pacheco/"),
    ("Banca Pacheco - Tábuas", "https://mediagrowthmkt-debug.github.io/07-TABOAS-DE-FRIOS/"),
    
    # Engitunnel
    ("Engitunnel - Consultoria", "https://mediagrowthmkt-debug.github.io/LP-CONSULTORIA/"),
    ("Engitunnel - Projeto Arq", "https://mediagrowthmkt-debug.github.io/LP-PROJETO-ARQUITETONICO/"),
    ("Engitunnel - Consultoria Eng", "https://mediagrowthmkt-debug.github.io/03---LP-CONSULTORIA-ENGENHARIA/"),
    ("Engitunnel - Eng Civil", "https://mediagrowthmkt-debug.github.io/04---LP-CONSULTORIA-ENGENHARIA-CIVIL/"),
    ("Engitunnel - Estabilidade", "https://mediagrowthmkt-debug.github.io/05---LP-ESTABILIDADE-ESTRUTURAL/"),
    ("Engitunnel - Fiscalização", "https://mediagrowthmkt-debug.github.io/06---LP-FISCALIZACAO-OBRAS/"),
    ("Engitunnel - Gerenciamento", "https://mediagrowthmkt-debug.github.io/07---LP-GERENCIAMENTO-OBRAS/"),
    ("Engitunnel - Inspeção", "https://mediagrowthmkt-debug.github.io/08---LP-INSPECAO-PREDIAL/"),
    ("Engitunnel - Avaliação", "https://mediagrowthmkt-debug.github.io/09---LP-AVALIACAO-E-PERICIA/"),
    ("Engitunnel - LinkTree", "https://mediagrowthmkt-debug.github.io/LINKTREE/"),
    
    # Motel Xenon
    ("Motel Xenon - LP 01", "https://xenonmotel.netlify.app/landing-page-motel-01"),
    ("Motel Xenon - LP 02", "https://xenonmotel.netlify.app/landing-page-motel-02"),
    
    # Protec
    ("Protec - Contractors", "https://mediagrowthmkt-debug.github.io/LP-CONTRACTORS-ARQUITECTS/"),
    ("Protec - Granite 2", "https://mediagrowthmkt-debug.github.io/LP-PROTEC-GRANITE-2/"),
    ("Protec - Quartz", "https://mediagrowthmkt-debug.github.io/LP-PROTEC-QUARTZ/"),
    ("Protec - Premium Granite", "https://protecpremiumgranite.com"),
    
    # Wolf
    ("Wolf - Bathroom", "https://bathroom.wolfcarpenters.com"),
    ("Wolf - Kitchen", "https://kitchen.wolfcarpenters.com"),
    ("Wolf - ADU", "https://adu.wolfcarpenters.com"),
]

def check_url(name: str, url: str) -> Tuple[str, str, int, str]:
    """Verifica se uma URL está acessível"""
    try:
        response = requests.head(url, allow_redirects=True, timeout=10)
        status = response.status_code
        final_url = response.url
        
        if status == 200:
            return (name, url, status, "✅ ACESSÍVEL")
        elif status == 404:
            return (name, url, status, "❌ NÃO ENCONTRADO")
        elif status == 403:
            return (name, url, status, "⚠️  PROIBIDO")
        elif status >= 300 and status < 400:
            return (name, url, status, f"↪️  REDIRECIONADO para {final_url}")
        else:
            return (name, url, status, f"⚠️  STATUS {status}")
    except requests.exceptions.Timeout:
        return (name, url, 0, "⏱️  TIMEOUT")
    except requests.exceptions.ConnectionError:
        return (name, url, 0, "❌ ERRO DE CONEXÃO")
    except Exception as e:
        return (name, url, 0, f"❌ ERRO: {str(e)[:50]}")

def main():
    print("="*80)
    print("🔍 VERIFICADOR DE URLs DO DASHBOARD")
    print("="*80 + "\n")
    
    results = {
        'accessible': [],
        'not_found': [],
        'error': []
    }
    
    print(f"🌐 Testando {len(TEST_URLS)} URLs...\n")
    
    for name, url in TEST_URLS:
        print(f"📍 {name[:40]:<40} ", end="", flush=True)
        
        result = check_url(name, url)
        _, _, status, message = result
        
        print(message)
        
        if status == 200:
            results['accessible'].append(result)
        elif status == 404 or status == 0:
            results['not_found'].append(result)
        else:
            results['error'].append(result)
        
        time.sleep(0.3)  # Rate limiting
    
    # Resumo
    print("\n" + "="*80)
    print("📊 RESUMO")
    print("="*80)
    print(f"✅ Acessíveis: {len(results['accessible'])}")
    print(f"❌ Não encontradas: {len(results['not_found'])}")
    print(f"⚠️  Outros erros: {len(results['error'])}")
    print("="*80 + "\n")
    
    # URLs acessíveis
    if results['accessible']:
        print("✅ URLs ACESSÍVEIS (podem ser usadas):\n")
        for name, url, status, _ in results['accessible']:
            print(f"  {name}")
            print(f"  → {url}\n")
    
    # URLs com problema
    if results['not_found']:
        print("\n❌ URLs NÃO ENCONTRADAS (precisam ser corrigidas):\n")
        for name, url, status, msg in results['not_found']:
            print(f"  {name}")
            print(f"  → {url}")
            print(f"  {msg}\n")
    
    # Detectar domínios personalizados
    print("\n🌟 DOMÍNIOS PERSONALIZADOS DETECTADOS:\n")
    custom_domains = {}
    
    for name, url, status, _ in results['accessible']:
        parsed = urlparse(url)
        domain = parsed.netloc
        
        # Se não é github.io nem netlify.app, é provável que seja domínio personalizado
        if 'github.io' not in domain and 'netlify.app' not in domain:
            # Tenta extrair o nome do repositório do nome do projeto
            repo_name = None
            if 'bathroom' in name.lower():
                repo_name = 'BATHROOM-REMODELING-WOLF'
            elif 'kitchen' in name.lower():
                repo_name = 'KITCHEN-REMODELING-WOLF'
            elif 'adu' in name.lower():
                repo_name = 'ADU-HOMEADDITION'
            
            if repo_name:
                custom_domains[repo_name] = domain
            
            print(f"  🌐 {domain}")
            print(f"     Projeto: {name}")
            if repo_name:
                print(f"     Repositório: {repo_name}")
            print()
    
    # Gera código JavaScript
    if custom_domains:
        print("\n🔧 CÓDIGO PARA O DASHBOARD:\n")
        print("const CUSTOM_DOMAINS = {")
        for repo, domain in custom_domains.items():
            print(f"    '{repo}': '{domain}',")
        print("};")
        print()
    
    # Salva resultados
    with open('url_check_results.json', 'w', encoding='utf-8') as f:
        json.dump({
            'accessible': results['accessible'],
            'not_found': results['not_found'],
            'error': results['error']
        }, f, indent=2)
    
    print("💾 Resultados salvos em: url_check_results.json\n")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Verificação interrompida")
    except Exception as e:
        print(f"\n❌ Erro: {e}")
