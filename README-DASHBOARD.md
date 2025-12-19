# 📁 Dashboard de Projetos - Guia de Uso

## 🌟 Visão Geral

Este dashboard permite visualizar todos os seus projetos em um único lugar, com previews automáticos, links para versões locais e online (GitHub Pages), e suporte completo para domínios personalizados.

## ✨ Funcionalidades

- ✅ **Preview Automático**: Screenshots das páginas ao vivo usando GitHub Pages
- ✅ **Links Inteligentes**: Acesso rápido às versões local e online
- ✅ **Domínios Personalizados**: Suporte automático para domínios configurados no GitHub Pages
- ✅ **Visualizações**: Alternar entre visualização em grade ou lista
- ✅ **Busca e Filtros**: Encontre rapidamente qualquer projeto
- ✅ **Indicadores Visuais**: Projetos com domínio personalizado marcados com ⭐

## 🌐 Como Configurar Domínios Personalizados

### Passo 1: Configure no GitHub Pages

1. Acesse o repositório no GitHub
2. Vá em **Settings** > **Pages**
3. Em **Custom domain**, adicione seu domínio (ex: `bathroom.wolfcarpenters.com`)
4. Aguarde a verificação DNS e o certificado SSL

### Passo 2: Configure no Dashboard

Edite o arquivo `projects-dashboard.html` e localize o objeto `CUSTOM_DOMAINS`:

```javascript
const CUSTOM_DOMAINS = {
    'BATHROOM-REMODELING-WOLF': 'bathroom.wolfcarpenters.com',
    // Adicione mais domínios aqui:
    'NOME-DO-REPOSITORIO': 'seu.dominio.com.br',
};
```

**Importante**: Use o nome EXATO do repositório como chave (sem o prefixo do usuário).

### Exemplo Completo

Se você tem:
- Repositório: `mediagrowthmkt-debug/AMCC-LP`
- Domínio personalizado: `contabilidade.amcc.com.br`

Adicione:
```javascript
const CUSTOM_DOMAINS = {
    'BATHROOM-REMODELING-WOLF': 'bathroom.wolfcarpenters.com',
    'AMCC-LP': 'contabilidade.amcc.com.br',
};
```

## 🎯 Como Funciona

### Detecção Automática

O dashboard automaticamente:
1. Detecta o repositório da URL do GitHub Pages
2. Verifica se existe um domínio personalizado configurado
3. Substitui a URL do GitHub Pages pela URL do domínio personalizado
4. Adiciona indicadores visuais (⭐) para projetos com domínio personalizado

### Previews

Os previews (screenshots) são gerados usando o serviço **thum.io**, que captura:
- A página ao vivo usando o domínio personalizado (se configurado)
- Ou a página no GitHub Pages (se sem domínio personalizado)

### Links "Abrir em Nova Aba"

Cada projeto tem dois botões principais:
- **Local**: Abre o preview local do arquivo
- **Site Ao Vivo** ⭐ ou **GitHub Pages**: 
  - Se tem domínio personalizado → Abre no domínio configurado
  - Se não tem → Abre no GitHub Pages padrão

## 📝 Estrutura de Dados dos Projetos

Cada projeto no dashboard deve ter:

```javascript
{
    name: "Nome do Projeto",
    path: "PASTA/SUBPASTA",
    localUrl: "PASTA/SUBPASTA/index.html",
    liveUrl: "https://mediagrowthmkt-debug.github.io/REPO-NAME/path",
    status: "active" // ou "production"
}
```

## 🔧 Manutenção

### Adicionar Novo Projeto

1. Localize o array `projectsData` no arquivo `projects-dashboard.html`
2. Adicione um novo objeto dentro do cliente apropriado:

```javascript
{
    name: "Novo Projeto",
    path: "CLIENTE/PROJETO",
    localUrl: "CLIENTE/PROJETO/index.html",
    liveUrl: "https://mediagrowthmkt-debug.github.io/REPO-NAME/",
    status: "active"
}
```

### Atualizar Domínio Personalizado

Sempre que configurar um novo domínio no GitHub Pages, atualize o objeto `CUSTOM_DOMAINS` no arquivo.

## 🎨 Personalização

### Alterar Cores dos Placeholders

Edite a função `getPlaceholderPreview()` para adicionar/modificar os gradientes de fundo dos cards.

### Modificar Serviço de Screenshot

Por padrão, usa **thum.io**. Para trocar, edite as funções:
- `getScreenshotUrl()` - Screenshots maiores (600x400)
- `getListScreenshotUrl()` - Screenshots menores (300x175)

## 📊 Estatísticas

O dashboard mostra automaticamente:
- **Total de Clientes**: Número de empresas/clientes
- **Total de Projetos**: Soma de todos os projetos
- **Em Produção**: Projetos com `status: "production"`

## 🚀 Dicas de Uso

1. **Performance**: Os previews são carregados com `loading="lazy"` para melhor performance
2. **Modal**: Clique no ícone de expansão (⛶) para ver o preview em tela cheia
3. **Busca**: Busca pelo nome do projeto OU nome do cliente
4. **Filtros**: Filtre por "Todos", "Produção" ou "Ativos"

## 🆘 Solução de Problemas

### Preview não carrega
- Verifique se a URL do GitHub Pages está correta
- Confirme que o site está publicado e acessível
- O serviço thum.io pode ter limite de requisições

### Domínio personalizado não funciona
- Confirme que o nome do repositório está correto no `CUSTOM_DOMAINS`
- Verifique se o domínio está configurado corretamente no GitHub Pages
- Certifique-se de que o DNS está propagado

### Link abre página 404
- Verifique se o caminho do arquivo está correto
- Confirme que o repositório está público
- Verifique se o GitHub Pages está ativado

---

**Última atualização**: Dezembro 2025  
**Versão**: 2.0 - Com suporte a domínios personalizados
