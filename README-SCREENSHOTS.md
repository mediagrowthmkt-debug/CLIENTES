# 📸 Sistema de Screenshots do Dashboard

## ✅ Configuração Atual

O dashboard agora usa **serviços de screenshot GRATUITOS** para gerar previews automáticos das páginas GitHub Pages.

### 🎯 Serviço Principal: **Microlink**

**Vantagens:**
- ✅ **Grátis** (50 requisições/dia)
- ✅ **Alta qualidade** (imagens PNG de ~800KB)
- ✅ **Sem watermark**
- ✅ **Rápido** (cache inteligente)

**URL usada:**
```
https://api.microlink.io/?url={URL_DO_SITE}&screenshot=true&meta=false&embed=screenshot.url
```

### 🔄 Serviço de Fallback: **Screenshot Machine**

Se o Microlink falhar (por limite de requisições ou erro), o dashboard automaticamente tenta:

**Vantagens:**
- ✅ **Ilimitado** (requisições infinitas)
- ✅ **Estável**
- ⚠️ **Com watermark** (pequena marca d'água)
- ⚠️ **Menor qualidade** (GIF de ~6KB)

**URL usada:**
```
https://api.screenshotmachine.com/?key=demo&url={URL_DO_SITE}&dimension=1200x800
```

## 🔧 Como Funciona

### Sistema de Fallback Automático

1. **Primeiro**: Tenta carregar screenshot do **Microlink**
2. **Se falhar**: Automaticamente carrega do **Screenshot Machine**
3. **Se falhar novamente**: Mostra apenas o background colorido (placeholder)

```javascript
// No código HTML, o onerror faz o fallback automático:
<img src="MICROLINK_URL" 
     onerror="if(this.src!=='SCREENSHOT_MACHINE_URL'){
         this.src='SCREENSHOT_MACHINE_URL';
     }else{
         this.style.display='none';
     }">
```

## 📊 Serviços Testados

| Serviço | Status | Qualidade | Limite | Watermark |
|---------|--------|-----------|--------|-----------|
| ✅ **Microlink** | ✅ Funcionando | ⭐⭐⭐⭐⭐ Alta | 50/dia | ❌ Não |
| ✅ **Screenshot Machine** | ✅ Funcionando | ⭐⭐ Média | ∞ Ilimitado | ⚠️ Sim |
| ✅ **PagePeeker** | ✅ Funcionando | ⭐⭐⭐ Boa | ? | ❌ Não |
| ❌ Screenshot.rocks | ❌ 404 Error | - | - | - |
| ❌ ApiFlash | ❌ 401 Auth | - | - | - |
| ❌ URLBox.io | ❌ 400 Error | - | - | - |
| ❌ ShrinkTheWeb | ❌ Connection Error | - | - | - |

## 🎨 Placeholders Coloridos

Se ambos os serviços falharem, o dashboard mostra um **placeholder colorido** com gradiente:

```javascript
const colors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Roxo
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', // Rosa
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', // Azul
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', // Verde
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', // Laranja
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'  // Pastel
];
```

A cor é escolhida automaticamente baseada no nome do projeto.

## 🚀 Desempenho

### Otimizações Implementadas:

1. **Lazy Loading**: Imagens só carregam quando visíveis
2. **Cache**: Serviços fazem cache automático
3. **Fallback**: Evita telas em branco
4. **Placeholder**: Feedback visual imediato

### Tempo de Carregamento:

- **Microlink**: ~2-4 segundos (primeira vez)
- **Screenshot Machine**: ~1-2 segundos
- **Placeholder**: Instantâneo

## 🔑 Como Melhorar (Opcional)

### Opção 1: Usar Chave API Própria

Se quiser melhor qualidade e mais requisições, crie contas gratuitas:

**Microlink**:
- Site: https://microlink.io
- Plano grátis: 1000 requisições/mês
- Como usar:
```javascript
`https://api.microlink.io/?url=${url}&screenshot=true&apiKey=SUA_CHAVE_AQUI`
```

**Screenshot Machine**:
- Site: https://screenshotmachine.com
- Plano grátis: 100 screenshots/mês (sem watermark)
- Como usar:
```javascript
`https://api.screenshotmachine.com/?key=SUA_CHAVE&url=${url}`
```

### Opção 2: Gerar Screenshots Localmente

Para ter controle total, você pode:

1. Usar **Puppeteer** (Node.js)
2. Gerar screenshots localmente
3. Salvar na pasta do projeto
4. Usar caminhos relativos

**Exemplo:**
```bash
npm install puppeteer
node generate-screenshots.js
```

## 🐛 Troubleshooting

### Problema: "Image not authorized"
- **Causa**: Serviço requer autenticação paga
- **Solução**: Dashboard já configurado com serviços gratuitos

### Problema: Screenshots não carregam
- **Causa 1**: Limite diário do Microlink atingido (50/dia)
  - **Solução**: Aguardar 24h ou usar Screenshot Machine
- **Causa 2**: URL não está acessível
  - **Solução**: Verificar se GitHub Pages está ativo
- **Causa 3**: Problema de CORS
  - **Solução**: Usar serviços que suportam CORS

### Problema: Qualidade ruim
- **Causa**: Usando Screenshot Machine (fallback)
- **Solução**: 
  1. Aguardar reset do limite Microlink
  2. Ou criar conta grátis no Microlink

### Problema: Muito lento
- **Causa**: Primeira requisição sempre é mais lenta
- **Solução**: Screenshots ficam em cache depois

## 📝 Testar Screenshots

Use o script criado para testar todos os serviços:

```bash
python3 test_screenshot_services.py
```

Isso vai:
- ✅ Testar cada serviço
- ✅ Mostrar qual está funcionando
- ✅ Exibir qualidade das imagens
- ✅ Gerar código pronto para usar

## 🎯 URLs Funcionais Atualmente

Baseado na verificação, apenas **5 projetos** têm GitHub Pages ativo:

1. ✅ `bathroom.wolfcarpenters.com` - Wolf Bathroom
2. ✅ `kitchen.wolfcarpenters.com` - Wolf Kitchen
3. ✅ `adu.wolfcarpenters.com` - Wolf ADU
4. ✅ `bancapacheco.com.br` - Banca Pacheco
5. ✅ `protecpremiumgranite.com` - Protec

**Estes projetos terão previews funcionais no dashboard!** 🎉

Os demais (26 projetos) mostrarão apenas placeholders coloridos até que o GitHub Pages seja ativado.

## 💡 Dicas

1. **Limite de 50/dia no Microlink**:
   - Use o dashboard com moderação
   - Screenshots ficam em cache
   - Após 50 visualizações, usa fallback automático

2. **Melhorar Qualidade**:
   - Crie conta gratuita no Microlink (1000/mês)
   - Ou use Screenshot Machine com chave própria

3. **Performance**:
   - Previews carregam em background
   - Não afeta navegação do dashboard
   - Placeholders garantem UX fluida

---

**Última atualização**: 18/12/2025  
**Versão**: 3.0 - Sistema de screenshots gratuitos com fallback automático
