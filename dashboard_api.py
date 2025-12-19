#!/usr/bin/env python3
"""
API Flask para sincronizar automaticamente o Dashboard com GitHub Pages
Permite que o botão no HTML busque URLs e domínios personalizados em tempo real
"""

from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import requests
import json
import time
from typing import Dict, List

app = Flask(__name__)
CORS(app)  # Permite requisições do frontend

# Configurações
GITHUB_USERNAME = "mediagrowthmkt-debug"
TIMEOUT = 10

# Lista de repositórios conhecidos
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
    
    try:
        response = requests.get(url, timeout=TIMEOUT, allow_redirects=True)
        
        if response.status_code == 200:
            final_url = response.url
            if final_url != url and not final_url.startswith(f"https://{GITHUB_USERNAME}.github.io"):
                # Domínio personalizado detectado
                custom_domain = final_url.replace('https://', '').replace('http://', '').split('/')[0]
                return {
                    'repo_name': repo_name,
                    'github_pages_url': url,
                    'custom_domain': custom_domain,
                    'final_url': final_url,
                    'status': 'active',
                    'status_code': response.status_code
                }
            else:
                return {
                    'repo_name': repo_name,
                    'github_pages_url': url,
                    'custom_domain': None,
                    'final_url': url,
                    'status': 'active',
                    'status_code': response.status_code
                }
        else:
            return {
                'repo_name': repo_name,
                'github_pages_url': url,
                'status': 'not_found',
                'status_code': response.status_code
            }
            
    except Exception as e:
        return {
            'repo_name': repo_name,
            'github_pages_url': url,
            'status': 'error',
            'error': str(e)
        }

@app.route('/api/sync-github', methods=['GET'])
def sync_github():
    """Endpoint para sincronizar com GitHub Pages"""
    print("🔄 Iniciando sincronização com GitHub...")
    
    results = {
        'total_checked': len(KNOWN_REPOS),
        'active': 0,
        'with_custom_domain': 0,
        'not_found': 0,
        'repositories': [],
        'custom_domains': {}
    }
    
    for repo in KNOWN_REPOS:
        result = check_github_pages_url(repo)
        results['repositories'].append(result)
        
        if result['status'] == 'active':
            results['active'] += 1
            if result.get('custom_domain'):
                results['with_custom_domain'] += 1
                results['custom_domains'][repo] = result['custom_domain']
        elif result['status'] == 'not_found':
            results['not_found'] += 1
        
        time.sleep(0.3)  # Rate limiting
    
    print(f"✅ Sincronização completa: {results['active']} ativos, {results['with_custom_domain']} com domínio personalizado")
    
    return jsonify(results)

@app.route('/api/custom-domains', methods=['GET'])
def get_custom_domains():
    """Retorna apenas os domínios personalizados em formato pronto para usar"""
    print("📋 Buscando domínios personalizados...")
    
    custom_domains = {}
    
    for repo in KNOWN_REPOS:
        result = check_github_pages_url(repo)
        if result['status'] == 'active' and result.get('custom_domain'):
            custom_domains[repo] = result['custom_domain']
        time.sleep(0.3)
    
    return jsonify({
        'success': True,
        'count': len(custom_domains),
        'domains': custom_domains
    })

@app.route('/api/health', methods=['GET'])
def health():
    """Verifica se a API está funcionando"""
    return jsonify({
        'status': 'ok',
        'message': 'Dashboard API está funcionando',
        'github_username': GITHUB_USERNAME
    })

@app.route('/')
def index():
    """Página inicial da API"""
    return '''
    <html>
    <head>
        <title>Dashboard API</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                max-width: 800px;
                margin: 50px auto;
                padding: 20px;
                background: #0f0f0f;
                color: #fff;
            }
            h1 { color: #6366f1; }
            .endpoint {
                background: #1a1a1a;
                padding: 15px;
                margin: 10px 0;
                border-radius: 8px;
                border-left: 4px solid #6366f1;
            }
            code {
                background: #2a2a2a;
                padding: 2px 6px;
                border-radius: 4px;
            }
        </style>
    </head>
    <body>
        <h1>🚀 Dashboard API</h1>
        <p>API para sincronizar automaticamente o Dashboard com GitHub Pages</p>
        
        <div class="endpoint">
            <h3>GET /api/health</h3>
            <p>Verifica se a API está funcionando</p>
        </div>
        
        <div class="endpoint">
            <h3>GET /api/custom-domains</h3>
            <p>Retorna todos os domínios personalizados detectados</p>
        </div>
        
        <div class="endpoint">
            <h3>GET /api/sync-github</h3>
            <p>Sincroniza com GitHub Pages e retorna todas as informações</p>
        </div>
        
        <p><a href="/api/health" style="color: #6366f1;">Testar API</a></p>
    </body>
    </html>
    '''

if __name__ == '__main__':
    print("="*70)
    print("🚀 DASHBOARD API SERVER")
    print("="*70)
    print("📡 Servidor iniciando em: http://localhost:5000")
    print("🔗 Endpoints disponíveis:")
    print("   - GET /api/health - Status da API")
    print("   - GET /api/custom-domains - Domínios personalizados")
    print("   - GET /api/sync-github - Sincronização completa")
    print("="*70 + "\n")
    
    # Debug mode desativado para segurança
    app.run(debug=False, port=5000, host='127.0.0.1')
