#!/usr/bin/env python3
"""
Testa diferentes serviços de screenshot GRATUITOS
para encontrar o melhor para o dashboard.
"""

import requests
import time
from urllib.parse import quote

# URL de teste
TEST_URL = "https://bathroom.wolfcarpenters.com"

# Serviços de screenshot gratuitos
SERVICES = {
    "Screenshot Machine (Demo)": {
        "url": f"https://api.screenshotmachine.com/?key=demo&url={quote(TEST_URL)}&dimension=1200x800",
        "description": "Grátis com chave demo, mas com watermark"
    },
    "Screenshot.rocks": {
        "url": f"https://screenshot.rocks/api/screenshot?url={quote(TEST_URL)}&width=1200&height=800",
        "description": "Totalmente grátis, sem watermark"
    },
    "Microlink": {
        "url": f"https://api.microlink.io/?url={quote(TEST_URL)}&screenshot=true&meta=false&embed=screenshot.url",
        "description": "Grátis com limite de 50 requisições/dia"
    },
    "ApiFlash (Demo)": {
        "url": f"https://api.apiflash.com/v1/urltoimage?access_key=demo&url={quote(TEST_URL)}&width=1200&height=800",
        "description": "Grátis com chave demo"
    },
    "URLBox.io (Trial)": {
        "url": f"https://api.urlbox.io/v1/demo/png?url={quote(TEST_URL)}&width=1200&height=800",
        "description": "Grátis com versão trial"
    },
    "PagePeeker": {
        "url": f"https://api.pagepeeker.com/v2/thumbs.php?size=l&url={quote(TEST_URL)}",
        "description": "Grátis, mas tamanho limitado"
    },
    "ShrinkTheWeb": {
        "url": f"https://images.shrinktheweb.com/xino.php?stwembed=1&stwaccesskeyid=demo&stwsize=xlg&stwurl={quote(TEST_URL)}",
        "description": "Grátis com chave demo"
    }
}

def test_service(name, service):
    """Testa se um serviço está funcionando"""
    print(f"\n🧪 Testando: {name}")
    print(f"   📝 {service['description']}")
    print(f"   🔗 {service['url'][:100]}...")
    
    try:
        response = requests.get(service['url'], timeout=15, allow_redirects=True)
        
        # Verifica o Content-Type
        content_type = response.headers.get('Content-Type', '')
        
        if response.status_code == 200:
            if 'image' in content_type:
                size_kb = len(response.content) / 1024
                print(f"   ✅ FUNCIONANDO!")
                print(f"   📊 Tamanho: {size_kb:.1f} KB")
                print(f"   🖼️  Tipo: {content_type}")
                return True
            elif 'json' in content_type:
                # Pode ser um JSON com URL da imagem
                print(f"   ⚠️  Retornou JSON (pode ter URL da imagem)")
                print(f"   📄 {response.text[:200]}")
                return True
            else:
                print(f"   ⚠️  Resposta não é imagem: {content_type}")
                return False
        else:
            print(f"   ❌ Erro {response.status_code}")
            return False
            
    except requests.exceptions.Timeout:
        print(f"   ⏱️  TIMEOUT (muito lento)")
        return False
    except Exception as e:
        print(f"   ❌ Erro: {str(e)[:100]}")
        return False

def main():
    print("="*80)
    print("🔍 TESTADOR DE SERVIÇOS DE SCREENSHOT GRATUITOS")
    print("="*80)
    print(f"\n🎯 URL de teste: {TEST_URL}\n")
    
    results = {}
    
    for name, service in SERVICES.items():
        working = test_service(name, service)
        results[name] = working
        time.sleep(1)  # Pausa entre requisições
    
    # Resumo
    print("\n" + "="*80)
    print("📊 RESUMO DOS RESULTADOS")
    print("="*80 + "\n")
    
    working_services = [name for name, works in results.items() if works]
    
    if working_services:
        print("✅ SERVIÇOS FUNCIONANDO:\n")
        for name in working_services:
            print(f"   • {name}")
            print(f"     {SERVICES[name]['description']}\n")
        
        print("\n💡 RECOMENDAÇÃO:")
        print(f"   Use: {working_services[0]}")
        print("\n🔧 CÓDIGO PARA O DASHBOARD:\n")
        
        # Gera código JavaScript baseado no melhor serviço
        best = working_services[0]
        
        if "Screenshot Machine" in best:
            print("""
function getScreenshotUrl(url) {
    const finalUrl = getPublicUrl(url);
    return `https://api.screenshotmachine.com/?key=demo&url=${encodeURIComponent(finalUrl)}&dimension=1200x800`;
}
            """)
        elif "Screenshot.rocks" in best:
            print("""
function getScreenshotUrl(url) {
    const finalUrl = getPublicUrl(url);
    return `https://screenshot.rocks/api/screenshot?url=${encodeURIComponent(finalUrl)}&width=1200&height=800`;
}
            """)
        elif "Microlink" in best:
            print("""
function getScreenshotUrl(url) {
    const finalUrl = getPublicUrl(url);
    return `https://api.microlink.io/?url=${encodeURIComponent(finalUrl)}&screenshot=true&meta=false&embed=screenshot.url`;
}
            """)
    else:
        print("❌ NENHUM SERVIÇO FUNCIONOU!")
        print("\n💡 ALTERNATIVA:")
        print("   Use placeholders coloridos ou capturas locais")
    
    print("\n" + "="*80)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Teste interrompido")
