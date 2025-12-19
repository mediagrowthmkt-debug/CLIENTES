# 📋 Guia de Atualização do Dashboard de Projetos

## 🔄 Como Atualizar URLs e Domínios Personalizados

### 1️⃣ Executar o Script de Verificação

Execute o script para verificar todos os repositórios do GitHub e detectar domínios personalizados:

```bash
python3 verify_github_pages.py
```

Esse script irá:
- ✅ Verificar todos os repositórios conhecidos
- 🌐 Detectar URLs do GitHub Pages ativas
- 🌟 Identificar domínios personalizados automaticamente
- 📊 Gerar o código atualizado para o dashboard

### 2️⃣ Atualizar o Dashboard

O script irá gerar um código como este:

```javascript
const CUSTOM_DOMAINS = {
    'BATHROOM-REMODELING-WOLF': 'bathroom.wolfcarpenters.com',
    'KITCHEN-REMODELING-WOLF': 'kitchen.wolfcarpenters.com',
    'ADU-HOMEADDITION': 'additions.wolfcarpenters.com',
    'CUSTOM-BUILT-INS-INNOV': 'built-ins.innovbuildersusa.com',
    'PAINTING': 'painting.innovbuildersusa.com',
    'STAIR-REMODELING-INNOV': 'stairs.innovbuildersusa.com',
};
```

**Copie e cole** este código no arquivo `projects-dashboard.html`, substituindo o objeto `CUSTOM_DOMAINS` existente.

### 3️⃣ Como o Sistema Funciona

#### 🎯 Detecção Automática de Domínios

O dashboard usa a função `getPublicUrl()` que:

1. **Verifica** se a URL é do GitHub Pages (ex: `mediagrowthmkt-debug.github.io/REPO-NAME`)
2. **Extrai** o nome do repositório da URL
3. **Consulta** o objeto `CUSTOM_DOMAINS` para ver se existe domínio personalizado
4. **Retorna** o domínio personalizado ou a URL do GitHub Pages

#### 🌟 Exemplo de Funcionamento

**Entrada:**
```javascript
liveUrl: "https://mediagrowthmkt-debug.github.io/PAINTING/"
```

**Processamento:**
```javascript
// 1. Extrai o repo: "PAINTING"
// 2. Consulta CUSTOM_DOMAINS["PAINTING"]
// 3. Encontra: "painting.innovbuildersusa.com"
```

**Saída:**
```javascript
publicUrl: "https://painting.innovbuildersusa.com"
```

### 4️⃣ Adicionar Novo Projeto

Para adicionar um novo projeto ao dashboard:

1. **Adicione os dados do projeto** no array `projectsData`:

```javascript
{
    name: "Meu Novo Projeto",
    path: "CLIENTE/PROJETO",
    localUrl: "CLIENTE/PROJETO/index.html",
    liveUrl: "https://mediagrowthmkt-debug.github.io/REPO-NAME/",
    status: "active" // ou "production"
}
```

2. **Se tiver domínio personalizado**, adicione no `CUSTOM_DOMAINS`:

```javascript
const CUSTOM_DOMAINS = {
    'REPO-NAME': 'seudominio.com',
    // ... outros domínios
};
```

3. **Execute o script de verificação** para confirmar que está tudo funcionando:

```bash
python3 verify_github_pages.py
```

### 5️⃣ Botão de Atualizar Previews

O botão **"Atualizar Previews"** no dashboard:

- 🔄 Recarrega todos os screenshots dos projetos
- ⏱️ Adiciona timestamp para forçar atualização das imagens
- 📅 Atualiza a data/hora de última atualização
- ✨ Mostra animação de loading durante o processo

**Como usar:**
1. Clique no botão "Atualizar Previews" na barra de controles
2. Aguarde o carregamento dos screenshots (ícone girando)
3. Os previews serão atualizados automaticamente

### 6️⃣ Domínios Atualmente Configurados

#### 🐺 Wolf Carpentry
- ✅ Kitchen Remodeling → `kitchen.wolfcarpenters.com`
- ✅ Bathroom Remodeling → `bathroom.wolfcarpenters.com`
- ✅ ADU Home Addition → `additions.wolfcarpenters.com`

#### 🔨 Innov Builders USA
- ✅ Custom Built-ins → `built-ins.innovbuildersusa.com`
- ✅ Painting Services → `painting.innovbuildersusa.com`
- ✅ Stair Remodeling → `stairs.innovbuildersusa.com`

### 7️⃣ Troubleshooting

#### ❌ Preview não aparece

**Problema:** Os screenshots não carregam

**Solução:**
1. Verifique se a URL está correta
2. Teste a URL manualmente no navegador
3. Clique em "Atualizar Previews"
4. Verifique se o serviço de screenshot está funcionando

#### ❌ Domínio personalizado não aparece

**Problema:** O link não mostra o domínio personalizado

**Solução:**
1. Execute `python3 verify_github_pages.py`
2. Verifique se o domínio foi detectado
3. Atualize o objeto `CUSTOM_DOMAINS`
4. Limpe o cache do navegador (Cmd+Shift+R)

#### ❌ Repositório não encontrado (404)

**Problema:** A URL retorna 404

**Soluções possíveis:**
1. **GitHub Pages não ativado** - Ative no repositório (Settings > Pages)
2. **Branch errada** - Configure a branch correta (geralmente `main` ou `gh-pages`)
3. **Repositório privado** - GitHub Pages gratuito só funciona em repos públicos
4. **URL incorreta** - Verifique o nome do repositório

### 8️⃣ Arquivos Importantes

- `projects-dashboard.html` - Dashboard principal
- `verify_github_pages.py` - Script de verificação de URLs
- `github_pages_verification.json` - Resultados da última verificação
- `fetch_github_pages_urls.py` - Script alternativo via API do GitHub

### 9️⃣ Manutenção Regular

**Recomendação:** Execute o script de verificação semanalmente ou após:
- ✅ Criar novo repositório
- ✅ Configurar novo domínio personalizado
- ✅ Ativar GitHub Pages em um repositório
- ✅ Mudar URL de um projeto

```bash
# Execute este comando regularmente
python3 verify_github_pages.py
```

---

## 📞 Suporte

Se tiver dúvidas ou problemas:
1. Consulte este guia
2. Execute o script de verificação
3. Verifique os logs no console do navegador (F12)
4. Confira o arquivo `github_pages_verification.json`

**Última atualização:** 18 de dezembro de 2025
