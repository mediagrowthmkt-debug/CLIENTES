#!/usr/bin/env python3
"""
Script para buscar automaticamente todas as URLs do GitHub Pages
dos repositórios e detectar domínios personalizados.

Uso:
    python3 fetch_github_pages_urls.py

Requer:
    pip install requests
"""

import requests
import json
import time
from typing import Dict, List, Optional

# Configurações
GITHUB_USERNAME = "mediagrowthmkt-debug"
GITHUB_TOKEN = None  # Opcional: adicione um token para mais requisições

class GitHubPagesScanner:
    def __init__(self, username: str, token: Optional[str] = None):
        self.username = username
        self.headers = {
            'Accept': 'application/vnd.github.v3+json'
        }
        if token:
            self.headers['Authorization'] = f'token {token}'
        
        self.base_url = "https://api.github.com"
    
    def get_all_repos(self) -> List[Dict]:
        """Busca todos os repositórios do usuário"""
        repos = []
        page = 1
        
        print(f"🔍 Buscando repositórios de {self.username}...")
        
        while True:
            url = f"{self.base_url}/users/{self.username}/repos"
            params = {'page': page, 'per_page': 100}
            
            response = requests.get(url, headers=self.headers, params=params)
            
            if response.status_code != 200:
                print(f"❌ Erro ao buscar repositórios: {response.status_code}")
                break
            
            data = response.json()
            if not data:
                break
            
            repos.extend(data)
            page += 1
            time.sleep(0.5)  # Rate limiting
        
        print(f"✅ Encontrados {len(repos)} repositórios\n")
        return repos
    
    def get_pages_info(self, repo_name: str) -> Optional[Dict]:
        """Busca informações do GitHub Pages de um repositório"""
        url = f"{self.base_url}/repos/{self.username}/{repo_name}/pages"
        
        response = requests.get(url, headers=self.headers)
        
        if response.status_code == 200:
            return response.json()
        elif response.status_code == 404:
            # GitHub Pages não está ativo
            return None
        else:
            print(f"⚠️  Erro ao verificar Pages de {repo_name}: {response.status_code}")
            return None
    
    def check_custom_domain(self, repo_name: str) -> Optional[str]:
        """Verifica se existe arquivo CNAME (domínio personalizado)"""
        url = f"{self.base_url}/repos/{self.username}/{repo_name}/contents/CNAME"
        
        response = requests.get(url, headers=self.headers)
        
        if response.status_code == 200:
            data = response.json()
            # Decodifica o conteúdo base64
            import base64
            cname_content = base64.b64decode(data['content']).decode('utf-8').strip()
            return cname_content
        
        return None
    
    def scan_all_pages(self) -> Dict:
        """Escaneia todos os repositórios e retorna informações do GitHub Pages"""
        repos = self.get_all_repos()
        results = {
            'total_repos': len(repos),
            'pages_enabled': 0,
            'custom_domains': 0,
            'repositories': []
        }
        
        print("🌐 Verificando GitHub Pages em cada repositório...\n")
        
        for repo in repos:
            repo_name = repo['name']
            print(f"📦 {repo_name}...", end=" ")
            
            pages_info = self.get_pages_info(repo_name)
            
            if pages_info:
                custom_domain = self.check_custom_domain(repo_name)
                
                repo_data = {
                    'name': repo_name,
                    'full_name': repo['full_name'],
                    'description': repo.get('description', ''),
                    'pages_url': pages_info.get('html_url', ''),
                    'custom_domain': custom_domain,
                    'status': pages_info.get('status', ''),
                    'branch': pages_info.get('source', {}).get('branch', 'unknown'),
                    'path': pages_info.get('source', {}).get('path', '/'),
                    'is_active': pages_info.get('status') == 'built'
                }
                
                results['repositories'].append(repo_data)
                results['pages_enabled'] += 1
                
                if custom_domain:
                    results['custom_domains'] += 1
                    print(f"✅ Pages ATIVO | 🌟 Domínio: {custom_domain}")
                else:
                    print(f"✅ Pages ATIVO | 🌐 URL: {pages_info.get('html_url', '')}")
            else:
                print("⚪ Pages não configurado")
            
            time.sleep(0.3)  # Rate limiting
        
        return results
    
    def generate_dashboard_data(self, results: Dict) -> str:
        """Gera código JavaScript para o dashboard"""
        print("\n" + "="*70)
        print("📊 RESUMO")
        print("="*70)
        print(f"Total de repositórios: {results['total_repos']}")
        print(f"Com GitHub Pages ativo: {results['pages_enabled']}")
        print(f"Com domínio personalizado: {results['custom_domains']}")
        print("="*70 + "\n")
        
        # Gera objeto CUSTOM_DOMAINS
        custom_domains_js = "const CUSTOM_DOMAINS = {\n"
        for repo in results['repositories']:
            if repo['custom_domain']:
                custom_domains_js += f"    '{repo['name']}': '{repo['custom_domain']}',\n"
        custom_domains_js += "};"
        
        print("🔧 CÓDIGO PARA O DASHBOARD:\n")
        print(custom_domains_js)
        print("\n")
        
        # Gera lista de URLs
        print("📋 LISTA DE URLs DISPONÍVEIS:\n")
        for repo in results['repositories']:
            if repo['custom_domain']:
                print(f"✅ {repo['name']}")
                print(f"   🌟 Domínio Personalizado: https://{repo['custom_domain']}")
            else:
                print(f"✅ {repo['name']}")
                print(f"   🌐 GitHub Pages: {repo['pages_url']}")
            print()
        
        return custom_domains_js
    
    def save_results(self, results: Dict, filename: str = 'github_pages_scan.json'):
        """Salva os resultados em arquivo JSON"""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        
        print(f"💾 Resultados salvos em: {filename}\n")


def main():
    print("="*70)
    print("🚀 GITHUB PAGES URL SCANNER")
    print("="*70 + "\n")
    
    # Pergunta se tem token (opcional)
    print("ℹ️  Token do GitHub (opcional, pressione Enter para pular):")
    print("   Você pode criar um token em: https://github.com/settings/tokens")
    print("   Permissões necessárias: 'public_repo' ou 'repo'\n")
    
    token = input("Token (opcional): ").strip()
    if not token:
        token = None
        print("⚠️  Continuando sem token (limite: 60 requisições/hora)\n")
    else:
        print("✅ Token configurado (limite: 5000 requisições/hora)\n")
    
    # Cria scanner e executa
    scanner = GitHubPagesScanner(GITHUB_USERNAME, token)
    results = scanner.scan_all_pages()
    
    # Gera código para dashboard
    scanner.generate_dashboard_data(results)
    
    # Salva resultados
    scanner.save_results(results)
    
    print("="*70)
    print("✨ SCAN COMPLETO!")
    print("="*70)
    print("\n💡 Próximos passos:")
    print("1. Copie o objeto CUSTOM_DOMAINS acima")
    print("2. Cole no arquivo index.html")
    print("3. Atualize as URLs dos projetos com as URLs corretas")
    print("4. Verifique o arquivo 'github_pages_scan.json' para detalhes\n")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Scan interrompido pelo usuário")
    except Exception as e:
        print(f"\n❌ Erro: {e}")
