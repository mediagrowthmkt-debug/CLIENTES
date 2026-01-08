# Protec Premium Granite - Blog
## Hostinger: blog.protecpremiumgranite.com

### 📁 Estrutura do Projeto

```
blog.protecpremiumgranite.com/
├── index.html              # Formulário de criação de posts
├── upload.php              # API de upload de imagens
├── get-images.php          # API para listar imagens
├── save-post.php           # API para salvar posts
├── assets/
│   ├── css/
│   │   └── form-style.css
│   ├── js/
│   │   └── form-script.js
│   └── images/
├── uploads/                # Diretório de imagens (criar automaticamente)
├── posts/                  # Posts gerados em HTML
└── templates/
    └── post-template.html
```

### 🚀 Instalação na Hostinger

#### 1. Acesso ao cPanel/File Manager
1. Faça login na Hostinger
2. Acesse o File Manager
3. Navegue até `public_html` ou crie subdomínio `blog`

#### 2. Criar Subdomínio
1. No painel Hostinger, vá em "Domínios"
2. Clique em "Criar Subdomínio"
3. Nome: `blog`
4. Domínio principal: `protecpremiumgranite.com`
5. Document Root: `/public_html/blog` (ou `/domains/blog.protecpremiumgranite.com/public_html`)

#### 3. Upload dos Arquivos
Faça upload de todos os arquivos via:
- **FileZilla** (FTP)
- **File Manager** do cPanel
- **Git** (se disponível na Hostinger)

#### 4. Configurar Permissões
```bash
# Via SSH ou File Manager
chmod 755 upload.php
chmod 755 get-images.php
chmod 755 save-post.php
chmod 777 uploads/
chmod 777 posts/
```

#### 5. Criar Diretórios
```bash
mkdir uploads
mkdir posts
chmod 777 uploads
chmod 777 posts
```

### 🔧 Configurações Necessárias

#### PHP Settings (php.ini ou .htaccess)
```ini
upload_max_filesize = 10M
post_max_size = 10M
max_execution_time = 300
memory_limit = 128M
```

#### .htaccess (Criar na raiz)
```apache
# Habilitar PHP
AddHandler application/x-httpd-php .php

# Segurança - Bloquear acesso direto a diretórios
Options -Indexes

# Permitir CORS (se necessário)
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"
</IfModule>

# Otimizar imagens
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
</IfModule>

# Compressão GZIP
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript
</IfModule>
```

### 📝 Como Usar

#### Upload de Imagem via Formulário
```javascript
// No form-script.js
async function uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch('upload.php', {
        method: 'POST',
        body: formData
    });
    
    const result = await response.json();
    return result.url; // URL da imagem na Hostinger
}
```

#### Salvar Post
```javascript
// Após gerar o HTML do post
async function savePost(postHtml, slug) {
    const formData = new FormData();
    formData.append('html', postHtml);
    formData.append('slug', slug);
    
    const response = await fetch('save-post.php', {
        method: 'POST',
        body: formData
    });
    
    return await response.json();
}
```

### 🔒 Segurança

1. **Proteção de Upload**
   - Validação de tipo de arquivo (apenas imagens)
   - Limite de tamanho (5MB)
   - Nome de arquivo sanitizado

2. **Proteção de Diretórios**
   - `.htaccess` bloqueia listagem de diretórios
   - Arquivos PHP protegidos contra execução indevida

3. **Validação de Entrada**
   - Sanitização de nomes de arquivos
   - Validação de extensões
   - Headers de segurança

### 📊 Monitoramento

#### Verificar Imagens Enviadas
```bash
# Via SSH
ls -lh uploads/
du -sh uploads/
```

#### Logs de Erro
```bash
# Ativar logs no PHP
tail -f /path/to/php-errors.log
```

### 🌐 URLs de Acesso

- **Formulário:** https://blog.protecpremiumgranite.com
- **Upload API:** https://blog.protecpremiumgranite.com/upload.php
- **Imagens:** https://blog.protecpremiumgranite.com/uploads/
- **Posts:** https://blog.protecpremiumgranite.com/posts/

### 🆘 Troubleshooting

#### Erro de Upload
- Verificar permissões do diretório `uploads/` (777)
- Verificar `upload_max_filesize` no PHP
- Verificar espaço em disco na Hostinger

#### Imagem Não Aparece
- Verificar URL completa com https://
- Verificar permissões de leitura (644 para arquivos)
- Verificar cache do navegador

#### Post Não Salva
- Verificar permissões do diretório `posts/` (777)
- Verificar logs de erro do PHP
- Verificar tamanho do POST no php.ini

### 📞 Suporte

- **Hostinger:** https://www.hostinger.com.br/suporte
- **Documentação PHP:** https://www.php.net/manual/pt_BR/
- **GitHub Repo:** https://github.com/mediagrowthmkt-debug/protec-blog
