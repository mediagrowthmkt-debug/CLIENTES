# 🖼️ SERVIDOR DE IMAGENS - HOSTINGER
## Para uso com GitHub Pages

### 📋 Objetivo
- **GitHub Pages:** Hospeda o blog (HTML/CSS/JS estático)
- **Hostinger:** Apenas servidor de imagens (upload PHP)

---

## 🚀 INSTALAÇÃO NA HOSTINGER

### Passo 1: Acesse o cPanel/File Manager
1. Login na Hostinger
2. Vá em **File Manager**
3. Navegue até `/public_html` (raiz do domínio principal)

### Passo 2: Upload do Arquivo PHP
1. Faça upload do arquivo `hostinger-upload.php`
2. Renomeie para `upload-image.php` (nome mais limpo)
3. Coloque na raiz: `/public_html/upload-image.php`

### Passo 3: Criar Pasta de Imagens
1. Crie a pasta: `/public_html/blog-images/`
2. Defina permissões: **777** (escrita total)
   ```bash
   # Via SSH ou File Manager
   mkdir blog-images
   chmod 777 blog-images
   ```

### Passo 4: Criar .htaccess na pasta de imagens
Crie `/public_html/blog-images/.htaccess`:
```apache
# Bloquear execução de PHP
<FilesMatch "\.(php|phtml|php3|php4|php5)$">
    Deny from all
</FilesMatch>

# Cache de imagens
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
</IfModule>

# Permitir acesso CORS
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
</IfModule>
```

### Passo 5: Testar Upload
Acesse no navegador:
```
https://protecpremiumgranite.com/upload-image.php
```
Deve retornar erro (método não permitido) - isso é normal.

---

## 🔧 CONFIGURAÇÃO NO GITHUB PAGES

### No arquivo `form-script.js`, adicione:

```javascript
// URL do servidor de imagens na Hostinger
const UPLOAD_URL = 'https://protecpremiumgranite.com/upload-image.php';

// Função de upload
async function uploadImageToHostinger(file) {
    const formData = new FormData();
    formData.append('image', file);
    
    try {
        const response = await fetch(UPLOAD_URL, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Erro no upload');
        }
        
        const result = await response.json();
        
        if (result.success) {
            return result.url; // URL da imagem na Hostinger
        } else {
            throw new Error(result.error || 'Erro desconhecido');
        }
    } catch (error) {
        console.error('Erro ao fazer upload:', error);
        alert('Erro ao fazer upload da imagem: ' + error.message);
        return null;
    }
}

// Exemplo de uso no formulário
document.getElementById('coverImage').addEventListener('change', async function(e) {
    const file = e.target.files[0];
    if (file) {
        const imageUrl = await uploadImageToHostinger(file);
        if (imageUrl) {
            // Preencher campo com URL da Hostinger
            this.value = imageUrl;
            console.log('Imagem enviada:', imageUrl);
        }
    }
});
```

---

## 📊 ESTRUTURA FINAL

```
GitHub Pages (blog.protecpremiumgranite.com)
├── index.html
├── assets/
│   ├── css/
│   └── js/
└── posts/

Hostinger (protecpremiumgranite.com)
├── upload-image.php          ← Upload API
└── blog-images/              ← Pasta de imagens
    ├── .htaccess
    ├── image-1.jpg
    ├── image-2.jpg
    └── ...
```

---

## 🌐 URLs

| Recurso | URL |
|---------|-----|
| **Blog (GitHub)** | `https://blog.protecpremiumgranite.com` |
| **Upload API** | `https://protecpremiumgranite.com/upload-image.php` |
| **Imagens** | `https://protecpremiumgranite.com/blog-images/` |

---

## ✅ CHECKLIST DE INSTALAÇÃO

- [ ] Upload do `upload-image.php` na raiz da Hostinger
- [ ] Criar pasta `blog-images/` com permissão 777
- [ ] Criar `.htaccess` dentro de `blog-images/`
- [ ] Testar se PHP está funcionando (erro 405 é OK)
- [ ] Verificar se CORS está habilitado
- [ ] Atualizar `form-script.js` com URL da Hostinger
- [ ] Fazer commit e push no GitHub

---

## 🔒 SEGURANÇA

✅ **Implementado:**
- Validação de tipo de arquivo (apenas imagens)
- Limite de tamanho (10MB)
- Nome de arquivo sanitizado
- CORS habilitado apenas para GET de imagens
- .htaccess bloqueia execução de PHP na pasta de imagens

---

## 🆘 TROUBLESHOOTING

### Erro: "Access to fetch has been blocked by CORS policy"
**Solução:** Adicionar no `.htaccess` da raiz:
```apache
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "POST, GET, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type"
</IfModule>
```

### Erro: "Failed to move uploaded file"
**Solução:** Verificar permissões:
```bash
chmod 777 blog-images
```

### Imagens não aparecem
**Solução:** Verificar URL completa:
```
https://protecpremiumgranite.com/blog-images/nome-da-imagem.jpg
```

---

## 📞 SUPORTE

- **Hostinger:** https://www.hostinger.com.br/suporte
- **GitHub Pages:** https://docs.github.com/pages
