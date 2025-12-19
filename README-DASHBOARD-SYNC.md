# 🚀 Sistema de Sincronização Automática com GitHub

## 📋 Visão Geral

O dashboard agora possui um botão **"Sincronizar GitHub"** que automaticamente:
- ✅ Busca todos os repositórios do GitHub Pages
- 🌐 Detecta URLs ativas
- 🌟 Identifica domínios personalizados
- 🔄 Atualiza o dashboard em tempo real
- 🎨 Re-renderiza os previews automaticamente

## 🎯 Como Usar

### 1️⃣ Iniciar o Servidor API

Primeiro, inicie o servidor da API Flask:

```bash
cd /Users/bruno/Documents/LPS/CLIENTES
python3 dashboard_api.py
```

Você verá:
```
======================================================================
🚀 DASHBOARD API SERVER
======================================================================
📡 Servidor iniciando em: http://localhost:5000
🔗 Endpoints disponíveis:
   - GET /api/health - Status da API
   - GET /api/custom-domains - Domínios personalizados
   - GET /api/sync-github - Sincronização completa
======================================================================

 * Running on http://0.0.0.0:5000
```

### 2️⃣ Abrir o Dashboard

Em outro terminal, inicie o servidor HTTP local:

```bash
cd /Users/bruno/Documents/LPS/CLIENTES
python3 -m http.server 8080
```

Abra no navegador: `http://localhost:8080/projects-dashboard.html`

### 3️⃣ Sincronizar com GitHub

No dashboard:

1. Clique no botão **"Sincronizar GitHub"** (roxo com ícone do GitHub)
2. Aguarde a mensagem: "🔄 Buscando repositórios do GitHub..."
3. A sincronização será concluída em alguns segundos
4. Você verá uma notificação de sucesso com o resultado
5. O dashboard será automaticamente atualizado com os novos domínios

### 4️⃣ Atualizar Previews

Após sincronizar, clique em **"Atualizar Previews"** (verde) para:
- Recarregar todos os screenshots
- Aplicar os novos links personalizados
- Ver as mudanças visuais

## 🔧 Endpoints da API

### GET /api/health
Verifica se a API está funcionando

**Resposta:**
```json
{
  "status": "ok",
  "message": "Dashboard API está funcionando",
  "github_username": "mediagrowthmkt-debug"
}
```

### GET /api/custom-domains
Retorna apenas os domínios personalizados

**Resposta:**
```json
{
  "success": true,
  "count": 6,
  "domains": {
    "BATHROOM-REMODELING-WOLF": "bathroom.wolfcarpenters.com",
    "KITCHEN-REMODELING-WOLF": "kitchen.wolfcarpenters.com",
    "ADU-HOMEADDITION": "additions.wolfcarpenters.com",
    "CUSTOM-BUILT-INS-INNOV": "built-ins.innovbuildersusa.com",
    "PAINTING": "painting.innovbuildersusa.com",
    "STAIR-REMODELING-INNOV": "stairs.innovbuildersusa.com"
  }
}
```

### GET /api/sync-github
Sincronização completa com todas as informações

**Resposta:**
```json
{
  "total_checked": 26,
  "active": 6,
  "with_custom_domain": 6,
  "not_found": 20,
  "repositories": [...],
  "custom_domains": {...}
}
```

## 🎨 Interface do Dashboard

### Botões Disponíveis:

1. **🔍 Buscar** - Busca projetos ou clientes
2. **📊 Grid/Lista** - Alterna visualização
3. **🏷️ Filtros** - Todos/Produção/Ativos
4. **🐙 Sincronizar GitHub** (NOVO) - Busca dados do GitHub
5. **🔄 Atualizar Previews** - Recarrega screenshots

### Notificações:

O sistema mostra notificações (toasts) no canto inferior direito para:
- ✅ Sucesso (verde)
- ❌ Erro (vermelho)
- ℹ️ Informação (azul)

## 🔄 Fluxo de Trabalho Recomendado

### Ao Criar Novo Repositório:

1. Configure GitHub Pages no repositório
2. Se tiver domínio personalizado, configure no GitHub
3. Aguarde alguns minutos para DNS propagar
4. No dashboard, clique em **"Sincronizar GitHub"**
5. Clique em **"Atualizar Previews"**
6. ✅ Pronto! O novo site aparecerá automaticamente

### Manutenção Regular:

Execute semanalmente ou quando:
- Adicionar novo repositório
- Configurar novo domínio
- Mudar URL de projeto
- Ativar/desativar GitHub Pages

## 🛠️ Solução de Problemas

### ❌ "Inicie o servidor API primeiro"

**Problema:** API não está rodando

**Solução:**
```bash
python3 dashboard_api.py
```

### ❌ "Erro HTTP: 500"

**Problema:** Erro no servidor da API

**Solução:**
1. Verifique os logs do servidor API
2. Verifique se `requests` está instalado
3. Reinicie o servidor API

### ❌ "Nenhum domínio personalizado encontrado"

**Problema:** Domínios não foram detectados

**Possíveis causas:**
1. GitHub Pages não está ativado
2. Domínio personalizado não está configurado
3. DNS ainda não propagou (aguarde 24-48h)
4. Repositório é privado (GitHub Pages gratuito = apenas público)

**Solução:**
1. Verifique configurações do repositório no GitHub
2. Execute o script standalone para debug:
   ```bash
   python3 verify_github_pages.py
   ```

### ❌ CORS Error no Console

**Problema:** Erro de CORS ao chamar API

**Solução:**
- Certifique-se que `flask-cors` está instalado
- Reinicie o servidor API
- Verifique se está acessando `http://localhost:8080`

## 📊 Arquivos do Sistema

```
CLIENTES/
├── projects-dashboard.html      # Dashboard principal (com botão sync)
├── dashboard_api.py             # API Flask para sincronização
├── verify_github_pages.py       # Script standalone (backup)
├── github_pages_verification.json  # Última verificação
└── README-DASHBOARD-SYNC.md     # Este arquivo
```

## 🔐 Segurança

- ✅ API roda apenas localmente (localhost:5000)
- ✅ CORS configurado para permitir localhost:8080
- ✅ Sem autenticação necessária (apenas uso local)
- ✅ Nenhuma chave de API exposta

## 📈 Benefícios

### Antes:
1. ❌ Executar script Python manualmente
2. ❌ Copiar código gerado
3. ❌ Colar no HTML
4. ❌ Recarregar página
5. ❌ Verificar se funcionou

### Agora:
1. ✅ Clicar em "Sincronizar GitHub"
2. ✅ Aguardar 5-10 segundos
3. ✅ Dashboard atualizado automaticamente!

## 🎯 Próximos Passos

Para melhorias futuras, considere:

1. **Cache** - Cachear resultados por 1 hora
2. **Webhook** - Atualização automática quando push no GitHub
3. **Histórico** - Salvar histórico de sincronizações
4. **Notificações** - Email quando novos domínios são detectados
5. **Deploy** - Hospedar API em servidor cloud

## 📞 Comandos Úteis

```bash
# Iniciar API
python3 dashboard_api.py

# Iniciar servidor HTTP
python3 -m http.server 8080

# Verificação standalone (sem API)
python3 verify_github_pages.py

# Instalar dependências
pip install flask flask-cors requests

# Ver logs da API
# (os logs aparecem no terminal onde rodou dashboard_api.py)
```

---

**Última atualização:** 18 de dezembro de 2025  
**Versão:** 2.0 - Sistema de Sincronização Automática
