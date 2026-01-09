// Sistema de Criação de Posts - Blog Protec
// Autor: Protec Premium Granite
// Data: 2026

// ======================
// AUTO-SAVE SYSTEM
// ======================

const AUTO_SAVE_KEY = 'protec_blog_form_data';
let autoSaveTimeout = null;

// Salva os dados do formulário no LocalStorage
function saveFormToLocalStorage() {
    const formData = {};
    const form = document.getElementById('blogForm');
    
    // Salva todos os inputs e textareas
    form.querySelectorAll('input, textarea, select').forEach(field => {
        if (field.type === 'button' || field.type === 'submit') return;
        
        if (field.type === 'checkbox') {
            formData[field.id || field.name] = field.checked;
        } else if (field.name && field.name.includes('[]')) {
            // Campos múltiplos (arrays)
            if (!formData[field.name]) formData[field.name] = [];
            formData[field.name].push(field.value);
        } else {
            formData[field.id || field.name] = field.value;
        }
    });
    
    localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(formData));
    updateAutoSaveStatus();
}

// Carrega os dados salvos do LocalStorage
function loadFormFromLocalStorage() {
    const savedData = localStorage.getItem(AUTO_SAVE_KEY);
    if (!savedData) return;
    
    try {
        const formData = JSON.parse(savedData);
        const form = document.getElementById('blogForm');
        
        // Restaura valores de campos simples
        Object.keys(formData).forEach(key => {
            // Pula campos array por enquanto
            if (key.includes('[]')) return;
            
            const field = form.querySelector(`#${key}`) || form.querySelector(`[name="${key}"]`);
            
            if (field) {
                if (field.type === 'checkbox') {
                    field.checked = formData[key];
                } else {
                    field.value = formData[key];
                }
            }
        });
        
        // Restaura campos múltiplos (arrays) - usando método diferente
        Object.keys(formData).forEach(key => {
            if (key.includes('[]') && Array.isArray(formData[key])) {
                // Busca todos os campos com esse name usando getAttribute
                const allFields = Array.from(form.querySelectorAll('input')).filter(
                    input => input.getAttribute('name') === key
                );
                
                formData[key].forEach((value, index) => {
                    if (allFields[index]) {
                        allFields[index].value = value;
                    } else {
                        // Se não existe campo suficiente, cria novos
                        if (key === 'internalImageUrl[]' && index > 0) {
                            document.getElementById('addInternalImage').click();
                            setTimeout(() => {
                                const newFields = Array.from(form.querySelectorAll('input')).filter(
                                    input => input.getAttribute('name') === key
                                );
                                if (newFields[index]) newFields[index].value = value;
                            }, 100);
                        }
                    }
                });
            }
        });
        
        console.log('✅ Dados carregados do auto-save');
        updateAutoSaveStatus('Dados restaurados');
    } catch (error) {
        console.error('❌ Erro ao carregar dados salvos:', error);
    }
}

// Auto-save com debounce (aguarda 2 segundos sem digitação)
function scheduleAutoSave() {
    if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
    }
    
    autoSaveTimeout = setTimeout(() => {
        saveFormToLocalStorage();
    }, 2000); // 2 segundos
}

// Atualiza o status visual do auto-save
function updateAutoSaveStatus(customMessage = null) {
    const statusDiv = document.getElementById('autoSaveStatus');
    if (!statusDiv) return;
    
    const now = new Date();
    const timeString = now.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    statusDiv.textContent = customMessage || `💾 Salvo às ${timeString}`;
    statusDiv.style.opacity = '1';
    
    // Fade out após 3 segundos
    setTimeout(() => {
        statusDiv.style.opacity = '0.5';
    }, 3000);
}

// Limpa o formulário e o LocalStorage
function clearFormData() {
    if (confirm('⚠️ Tem certeza que deseja limpar TODOS os campos? Esta ação não pode ser desfeita.')) {
        // Limpa o formulário
        document.getElementById('blogForm').reset();
        
        // Limpa o LocalStorage
        localStorage.removeItem(AUTO_SAVE_KEY);
        
        // Feedback visual
        const statusDiv = document.getElementById('autoSaveStatus');
        if (statusDiv) {
            statusDiv.textContent = '🗑️ Campos limpos';
            statusDiv.style.opacity = '1';
            setTimeout(() => {
                statusDiv.style.opacity = '0';
            }, 2000);
        }
        
        console.log('🗑️ Formulário e cache limpos');
    }
}

// Preenche formulário com dados fictícios para teste
function fillTestData() {
    // Formata data corretamente para datetime-local (YYYY-MM-DDTHH:MM)
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const dateTimeLocal = `${year}-${month}-${day}T${hours}:${minutes}`;
    
    const testData = {
        h1Title: 'Marble vs Granite: Complete Guide for Worcester Homes',
        slug: 'marble-or-granite-guide-for-your-home-in-worcester',
        metaDescription: 'Discover the pros and cons of marble and granite countertops. Expert comparison guide for Worcester homeowners making the right choice.',
        category: 'Granite Countertops',
        author: 'Protec Team',
        datePublished: dateTimeLocal, // Formato correto: YYYY-MM-DDTHH:MM
        coverImage: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800',
        coverImageAlt: 'Beautiful granite countertop installation in modern kitchen',
        introduction: 'Choosing between marble and granite countertops is one of the most important decisions for your Worcester home renovation. Both materials offer unique benefits and aesthetic appeal, but understanding their differences is crucial for making the right choice.',
        contentBody: '<h2>Understanding Marble Countertops</h2><p>Marble is a classic choice known for its elegant veining and timeless beauty. It\'s perfect for homeowners who want a sophisticated look in their kitchen or bathroom.</p><h3>Advantages of Marble</h3><ul><li>Unique veining patterns</li><li>Cool surface temperature</li><li>Increases home value</li></ul><h2>Why Choose Granite</h2><p>Granite is incredibly durable and comes in hundreds of color options. It\'s the perfect choice for busy Worcester families who need a practical yet beautiful solution.</p><h3>Benefits of Granite</h3><ul><li>Extremely durable</li><li>Heat resistant</li><li>Low maintenance</li><li>Variety of colors</li></ul>',
        conclusion: 'Both marble and granite are excellent choices for Worcester homes. The decision ultimately depends on your lifestyle, budget, and aesthetic preferences. Contact Protec Premium Granite today for a free consultation and let our experts help you make the perfect choice for your home.',
        tags: 'granite countertops, marble countertops, kitchen renovation, Worcester MA, countertop installation',
        ctaTitle: 'Ready to Transform Your Kitchen?',
        ctaText: 'Get a free consultation and quote from Worcester\'s trusted countertop experts. We bring our mobile showroom to your home!',
        ctaButtonText: 'Schedule Free Consultation',
        ctaLink: 'https://www.protecpremiumgranite.com/contact'
    };
    
    // Preenche os campos
    Object.keys(testData).forEach(key => {
        const field = document.getElementById(key);
        if (field) {
            field.value = testData[key];
            // Dispara evento para atualizar contadores de caracteres
            field.dispatchEvent(new Event('input', { bubbles: true }));
        }
    });
    
    // Preenche imagem interna (primeira)
    const internalImageUrl = document.querySelector('[name="internalImageUrl[]"]');
    const internalImageAlt = document.querySelector('[name="internalImageAlt[]"]');
    if (internalImageUrl) {
        internalImageUrl.value = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800';
        internalImageUrl.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (internalImageAlt) {
        internalImageAlt.value = 'Professional granite installation process in Worcester home';
        internalImageAlt.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    // Feedback visual
    const statusDiv = document.getElementById('autoSaveStatus');
    if (statusDiv) {
        statusDiv.textContent = '🧪 Dados de teste preenchidos';
        statusDiv.style.opacity = '1';
        statusDiv.style.color = '#28a745';
        setTimeout(() => {
            statusDiv.style.opacity = '0';
        }, 3000);
    }
    
    console.log('✅ Formulário preenchido com dados de teste');
}

// ======================
// UTILITY FUNCTIONS
// ======================

// Gera slug automaticamente a partir do título
function generateSlug(text) {
    if (!text || typeof text !== 'string') {
        console.warn('⚠️ generateSlug recebeu texto inválido:', text);
        return '';
    }
    
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
        .replace(/\s+/g, '-') // Substitui espaços por hífen
        .replace(/--+/g, '-') // Remove hífens duplicados
        .replace(/^-+|-+$/g, ''); // Remove hífens do início e fim
}

// Remove stopwords do slug
function removeStopwords(slug) {
    const stopwords = ['o', 'a', 'os', 'as', 'um', 'uma', 'de', 'do', 'da', 'dos', 'das', 
                       'em', 'no', 'na', 'nos', 'nas', 'por', 'para', 'com', 'sem', 'sob'];
    const words = slug.split('-');
    const filtered = words.filter(word => !stopwords.includes(word));
    return filtered.join('-');
}

// Conta caracteres
function updateCharCounter(input, counter) {
    const count = input.value.length;
    const max = input.getAttribute('maxlength');
    counter.textContent = `${count}/${max} caracteres`;
    
    if (count > max * 0.9) {
        counter.style.color = '#e74c3c';
    } else {
        counter.style.color = '#7f8c8d';
    }
}

// Conta palavras
function countWords(text) {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

// Atualiza contador de palavras
function updateWordCounter(textarea, counter) {
    const words = countWords(textarea.value);
    counter.textContent = `${words} palavras`;
}

// Calcula tempo de leitura (média 200 palavras/minuto)
function calculateReadTime(text) {
    const words = countWords(text);
    return Math.ceil(words / 200);
}

// Formata data para ISO 8601
function formatDateISO(date) {
    return date.toISOString();
}

// Formata data para exibição em português
function formatDatePTBR(date) {
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    }).format(date);
}

// Escapa HTML para prevenir XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ======================
// GOOGLE DRIVE CONVERTER
// ======================

/**
 * Converte URL do Google Drive em URL de imagem direta
 * Suporta formatos:
 * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/uc?id=FILE_ID
 * 
 * @param {string} url - URL original do Google Drive
 * @returns {string} - URL direta da imagem ou URL original se não for do Google Drive
 */
function convertGoogleDriveUrl(url) {
    if (!url || typeof url !== 'string') {
        return url;
    }
    
    url = url.trim();
    
    // Verifica se é uma URL do Google Drive
    if (!url.includes('drive.google.com')) {
        return url; // Não é do Google Drive, retorna URL original
    }
    
    let fileId = null;
    
    // Padrão 1: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
    const pattern1 = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
    const match1 = url.match(pattern1);
    if (match1) {
        fileId = match1[1];
    }
    
    // Padrão 2: https://drive.google.com/open?id=FILE_ID
    const pattern2 = /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/;
    const match2 = url.match(pattern2);
    if (match2) {
        fileId = match2[1];
    }
    
    // Padrão 3: https://drive.google.com/uc?id=FILE_ID
    const pattern3 = /drive\.google\.com\/uc\?id=([a-zA-Z0-9_-]+)/;
    const match3 = url.match(pattern3);
    if (match3) {
        fileId = match3[1];
    }
    
    // Se encontrou o ID, converte para URL direta
    if (fileId) {
        const convertedUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
        console.log('✅ Google Drive URL convertida:', url, '->', convertedUrl);
        return convertedUrl;
    }
    
    // Se não encontrou nenhum padrão, retorna a URL original
    console.warn('⚠️ Não foi possível extrair o ID do arquivo do Google Drive:', url);
    return url;
}

/**
 * Processa todas as URLs de imagem em um texto HTML, convertendo Google Drive
 * @param {string} html - Conteúdo HTML com possíveis URLs do Google Drive
 * @returns {string} - HTML com URLs convertidas
 */
function processImagesInHtml(html) {
    if (!html) return html;
    
    // Procura por tags img com src
    const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
    
    return html.replace(imgRegex, (match, srcUrl) => {
        const convertedUrl = convertGoogleDriveUrl(srcUrl);
        return match.replace(srcUrl, convertedUrl);
    });
}

// ======================
// FORM INITIALIZATION
// ======================

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('blogForm');
    const h1TitleInput = document.getElementById('h1Title');
    const slugInput = document.getElementById('slug');
    const primaryKeywordInput = document.getElementById('primaryKeyword');
    
    // ======================
    // AUTO-SAVE SETUP
    // ======================
    
    // Carrega dados salvos ao carregar a página
    loadFormFromLocalStorage();
    
    // Auto-save em todos os campos do formulário
    form.querySelectorAll('input, textarea, select').forEach(field => {
        if (field.type !== 'button' && field.type !== 'submit') {
            field.addEventListener('input', scheduleAutoSave);
            field.addEventListener('change', scheduleAutoSave);
        }
    });
    
    // Botão de limpar campos
    const clearBtn = document.getElementById('clearForm');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearFormData);
    }
    
    // Botão de preencher dados de teste
    const fillTestBtn = document.getElementById('fillTestData');
    if (fillTestBtn) {
        fillTestBtn.addEventListener('click', fillTestData);
    }
    
    // Salva antes de sair da página
    window.addEventListener('beforeunload', function() {
        saveFormToLocalStorage();
    });
    
    console.log('✅ Sistema de auto-save ativado');
    
    // ======================
    // FORM BEHAVIORS
    // ======================
    
    // Auto-gera slug quando o título muda
    h1TitleInput.addEventListener('input', function() {
        const slug = removeStopwords(generateSlug(this.value));
        slugInput.value = slug;
        
        // Atualiza contador de caracteres
        const counter = this.parentElement.querySelector('.char-counter');
        updateCharCounter(this, counter);
    });
    
    // Auto-preenche meta title com H1 se estiver vazio
    h1TitleInput.addEventListener('blur', function() {
        const metaTitleInput = document.getElementById('metaTitle');
        if (!metaTitleInput.value && this.value) {
            metaTitleInput.value = this.value;
        }
    });
    
    // Sugere alt text baseado na keyword
    primaryKeywordInput.addEventListener('blur', function() {
        const coverAltInput = document.getElementById('coverImageAlt');
        if (!coverAltInput.value && this.value) {
            const h1 = h1TitleInput.value;
            if (h1) {
                coverAltInput.value = h1;
            }
        }
    });
    
    // Contadores de caracteres
    document.querySelectorAll('input[maxlength], textarea[maxlength]').forEach(input => {
        const counter = input.parentElement.querySelector('.char-counter');
        if (counter) {
            input.addEventListener('input', () => updateCharCounter(input, counter));
        }
    });
    
    // Contadores de palavras
    document.querySelectorAll('textarea:not([maxlength])').forEach(textarea => {
        const counter = textarea.parentElement.querySelector('.word-counter');
        if (counter) {
            textarea.addEventListener('input', () => updateWordCounter(textarea, counter));
        }
    });
    
    // Botões de adicionar campos dinâmicos
    setupDynamicFields();
    
    // Editor toolbar buttons
    setupEditorToolbar();
    
    // Preview button
    document.getElementById('previewBtn').addEventListener('click', showPreview);
    
    // Form submit
    form.addEventListener('submit', handleFormSubmit);
    
    // Modal close
    setupModals();
});

// ======================
// DYNAMIC FIELDS
// ======================

function setupDynamicFields() {
    // Adicionar imagens internas
    document.getElementById('addInternalImage').addEventListener('click', function() {
        const container = document.getElementById('internalImagesContainer');
        const newItem = document.createElement('div');
        newItem.className = 'internal-image-item';
        newItem.innerHTML = `
            <input type="url" name="internalImageUrl[]" placeholder="URL da imagem">
            <input type="text" name="internalImageAlt[]" placeholder="Alt text descritivo">
            <button type="button" class="btn-remove">✕</button>
        `;
        container.appendChild(newItem);
        
        newItem.querySelector('.btn-remove').addEventListener('click', function() {
            newItem.remove();
        });
    });
    
    // Adicionar links internos
    document.getElementById('addInternalLink').addEventListener('click', function() {
        const container = document.getElementById('internalLinksContainer');
        const newItem = document.createElement('div');
        newItem.className = 'link-item';
        newItem.innerHTML = `
            <input type="url" name="internalLinkUrl[]" placeholder="URL interna">
            <input type="text" name="internalLinkAnchor[]" placeholder="Texto âncora">
            <button type="button" class="btn-remove">✕</button>
        `;
        container.appendChild(newItem);
        
        newItem.querySelector('.btn-remove').addEventListener('click', function() {
            newItem.remove();
        });
    });
    
    // Adicionar links externos
    document.getElementById('addExternalLink').addEventListener('click', function() {
        const container = document.getElementById('externalLinksContainer');
        const newItem = document.createElement('div');
        newItem.className = 'link-item';
        newItem.innerHTML = `
            <input type="url" name="externalLinkUrl[]" placeholder="URL externa">
            <input type="text" name="externalLinkAnchor[]" placeholder="Texto âncora">
            <button type="button" class="btn-remove">✕</button>
        `;
        container.appendChild(newItem);
        
        newItem.querySelector('.btn-remove').addEventListener('click', function() {
            newItem.remove();
        });
    });
    
    // Remove buttons existentes
    document.querySelectorAll('.btn-remove').forEach(btn => {
        btn.addEventListener('click', function() {
            this.parentElement.remove();
        });
    });
}

// ======================
// EDITOR TOOLBAR
// ======================

function setupEditorToolbar() {
    const toolbar = document.querySelector('.editor-toolbar');
    const contentBody = document.getElementById('contentBody');
    
    toolbar.querySelectorAll('.editor-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tag = this.getAttribute('data-tag');
            insertTag(contentBody, tag);
        });
    });
}

function insertTag(textarea, tag) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);
    
    let insertText = '';
    
    switch(tag) {
        case 'h2':
            insertText = `\n<h2>${selectedText || 'Título da Seção'}</h2>\n`;
            break;
        case 'h3':
            insertText = `\n<h3>${selectedText || 'Subtítulo'}</h3>\n`;
            break;
        case 'p':
            insertText = `\n<p>${selectedText || 'Seu parágrafo aqui...'}</p>\n`;
            break;
        case 'ul':
            insertText = `\n<ul>\n  <li>${selectedText || 'Item 1'}</li>\n  <li>Item 2</li>\n</ul>\n`;
            break;
        case 'strong':
            insertText = `<strong>${selectedText || 'texto em negrito'}</strong>`;
            break;
        case 'em':
            insertText = `<em>${selectedText || 'texto em itálico'}</em>`;
            break;
    }
    
    textarea.value = beforeText + insertText + afterText;
    textarea.focus();
}

// ======================
// PREVIEW
// ======================

function showPreview() {
    const formData = collectFormData();
    
    // Debug: mostra quantas imagens internas foram coletadas
    console.log('📸 Imagens Internas no Preview:', formData.internalImages);
    console.log('🔗 URLs convertidas:', formData.internalImages.map(img => img.url));
    
    const previewHtml = generatePreviewHtml(formData);
    
    const previewContent = document.getElementById('previewContent');
    previewContent.innerHTML = previewHtml;
    
    const modal = document.getElementById('previewModal');
    modal.style.display = 'flex';
}

function generatePreviewHtml(data) {
    // Gera HTML das imagens internas
    const internalImagesHtml = data.internalImages && data.internalImages.length > 0 
        ? `<div class="internal-images" style="margin: 30px 0;">
            <h3 style="margin-bottom: 20px;">📸 Imagens Internas:</h3>
            ${data.internalImages.map(img => `
                <figure style="margin: 20px 0;">
                    <img src="${img.url}" alt="${img.alt}" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    ${img.alt ? `<figcaption style="margin-top: 8px; font-size: 14px; color: #666; font-style: italic;">${img.alt}</figcaption>` : ''}
                </figure>
            `).join('')}
           </div>`
        : '';
    
    return `
        <div class="preview-post">
            <header>
                <div class="category-badge">${data.category}</div>
                <h1>${data.h1Title}</h1>
                <div class="meta">
                    <span>Por ${data.author}</span>
                    <span>${data.datePublishedFormatted}</span>
                    <span>⏱️ ${data.readTime} min</span>
                </div>
            </header>
            
            <img src="${data.coverImage}" alt="${data.coverImageAlt}" style="max-width: 100%; height: auto;">
            
            <div class="content">
                <div class="intro">${data.introduction}</div>
                ${data.contentBody}
                ${internalImagesHtml}
                <div class="conclusion">${data.conclusion}</div>
            </div>
            
            <div class="tags">
                ${data.tagsArray.map(tag => `<span class="tag">#${tag.trim()}</span>`).join(' ')}
            </div>
            
            <div class="cta">
                <h3>${data.ctaTitle}</h3>
                <p>${data.ctaText}</p>
                <a href="${data.ctaLink}" class="cta-btn">${data.ctaButtonText}</a>
            </div>
        </div>
    `;
}

// ======================
// FORM SUBMIT
// ======================

// Variável global para armazenar o último HTML gerado
let lastGeneratedHtml = null;
let lastGeneratedSlug = null;

async function handleFormSubmit(e) {
    e.preventDefault();
    
    // Mostra loading
    showLoading();
    
    try {
        // Coleta dados do formulário
        const formData = collectFormData();
        
        console.log('📦 Dados coletados:', formData);
        console.log('🖼️ Imagens internas:', formData.internalImages);
        
        // Gera HTML do post
        const postHtml = await generatePostHtml(formData);
        
        console.log('📄 HTML gerado, tamanho:', postHtml.length, 'caracteres');
        console.log('📄 Primeiros 100 chars do HTML:', postHtml.substring(0, 100));
        
        // Salva HTML globalmente para permitir download posterior
        lastGeneratedHtml = postHtml;
        lastGeneratedSlug = formData.slug;
        
        console.log('💾 HTML salvo globalmente!');
        console.log('💾 lastGeneratedHtml length:', lastGeneratedHtml.length);
        console.log('💾 lastGeneratedSlug:', lastGeneratedSlug);
        
        // Salva o post no servidor via PHP (com fallback automático)
        const result = await savePostToServer(postHtml, formData.slug);
        
        // Mostra sucesso (mesmo que tenha sido download)
        showSuccess(formData.slug, result);
        
    } catch (error) {
        console.error('❌ Erro ao gerar post:', error);
        alert('Erro ao gerar o post: ' + error.message);
    } finally {
        hideLoading();
    }
}

async function savePostToServer(html, slug) {
    try {
        console.log('💾 Salvando post no servidor...', slug);
        
        // Tenta método 1: POST com FormData (padrão)
        console.log('📤 Tentativa 1: POST com FormData');
        const formData = new FormData();
        formData.append('html', html);
        formData.append('slug', slug);
        
        const response = await fetch('save-post.php', {
            method: 'POST',
            body: formData
        });
        
        console.log('📡 Status da resposta:', response.status);
        console.log('📋 Content-Type:', response.headers.get('content-type'));
        
        // Se for 405 ou qualquer erro 4xx/5xx, vai direto para download
        if (response.status === 405 || response.status >= 400) {
            console.warn(`⚠️ Servidor retornou ${response.status}. Usando download...`);
            return savePostAsDownload(html, slug);
        }
        
        // Pega o texto da resposta primeiro
        const responseText = await response.text();
        console.log('📄 Resposta do servidor (primeiros 200 chars):', responseText.substring(0, 200));
        
        // Tenta parsear como JSON
        let result;
        try {
            result = JSON.parse(responseText);
        } catch (jsonError) {
            console.error('❌ Resposta não é JSON válido:', responseText.substring(0, 500));
            console.warn('⚠️ Fallback para download devido a resposta inválida');
            return savePostAsDownload(html, slug);
        }
        
        if (!response.ok) {
            console.warn('⚠️ Response não OK, fazendo download');
            return savePostAsDownload(html, slug);
        }
        
        console.log('✅ Post salvo com sucesso no servidor:', result);
        
        return result;
    } catch (error) {
        console.error('❌ Erro ao salvar post:', error);
        
        // Fallback: salvar como download - SEMPRE funciona
        console.warn('⚠️ Fallback: Salvando como download devido a erro');
        return savePostAsDownload(html, slug);
    }
}

function savePostAsDownload(html, slug) {
    console.log('💾 Salvando post como download: ' + slug + '.html');
    console.log('📏 Tamanho do HTML para download:', html.length, 'caracteres');
    console.log('📄 Primeiros 200 chars:', html.substring(0, 200));
    
    if (!html || html.trim().length === 0) {
        console.error('❌ HTML vazio! Não pode baixar.');
        throw new Error('HTML está vazio, não pode fazer download');
    }
    
    const blob = new Blob([html], { type: 'text/html; charset=utf-8' });
    console.log('📦 Blob criado, tamanho:', blob.size, 'bytes');
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = slug + '.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('✅ Download iniciado com sucesso');
    
    return {
        success: true,
        method: 'download',
        filename: slug + '.html',
        message: 'Post salvo como download. Você pode copiar para a pasta /posts no servidor.'
    };
}

function collectFormData() {
    const form = document.getElementById('blogForm');
    const formData = new FormData(form);
    
    // Data de publicação
    let datePublished = formData.get('datePublished');
    if (!datePublished) {
        datePublished = new Date();
    } else {
        datePublished = new Date(datePublished);
    }
    
    // Tempo de leitura
    let readTime = formData.get('readTime');
    if (!readTime) {
        const allText = formData.get('introduction') + ' ' + 
                       formData.get('contentBody') + ' ' + 
                       formData.get('conclusion');
        readTime = calculateReadTime(allText);
    }
    
    // Processa arrays
    const internalImages = [];
    const internalImageUrls = formData.getAll('internalImageUrl[]');
    const internalImageAlts = formData.getAll('internalImageAlt[]');
    
    console.log('🔍 Debug - URLs coletadas:', internalImageUrls);
    console.log('🔍 Debug - Alts coletados:', internalImageAlts);
    
    for (let i = 0; i < internalImageUrls.length; i++) {
        const rawUrl = internalImageUrls[i];
        const url = rawUrl ? rawUrl.trim() : '';
        
        console.log(`🔍 Imagem ${i+1}:`, {
            rawUrl: rawUrl,
            rawUrlType: typeof rawUrl,
            rawUrlValue: JSON.stringify(rawUrl),
            trimmedUrl: url,
            length: url.length,
            isEmpty: !url || url.length === 0
        });
        
        if (url && url.length > 0) {
            const convertedUrl = convertGoogleDriveUrl(url);
            internalImages.push({
                url: convertedUrl,
                alt: internalImageAlts[i] || ''
            });
            console.log(`✅ Imagem ${i+1} adicionada:`, convertedUrl);
        } else {
            console.log(`⚠️ Imagem ${i+1} ignorada (vazia ou inválida)`);
        }
    }
    
    console.log('📦 Total de imagens internas processadas:', internalImages.length);
    
    const internalLinks = [];
    const internalLinkUrls = formData.getAll('internalLinkUrl[]');
    const internalLinkAnchors = formData.getAll('internalLinkAnchor[]');
    for (let i = 0; i < internalLinkUrls.length; i++) {
        if (internalLinkUrls[i]) {
            internalLinks.push({
                url: internalLinkUrls[i],
                anchor: internalLinkAnchors[i] || ''
            });
        }
    }
    
    const externalLinks = [];
    const externalLinkUrls = formData.getAll('externalLinkUrl[]');
    const externalLinkAnchors = formData.getAll('externalLinkAnchor[]');
    for (let i = 0; i < externalLinkUrls.length; i++) {
        if (externalLinkUrls[i]) {
            externalLinks.push({
                url: externalLinkUrls[i],
                anchor: externalLinkAnchors[i] || ''
            });
        }
    }
    
    // Tags
    const tagsString = formData.get('tags');
    const tagsArray = tagsString.split(',').map(t => t.trim()).filter(t => t);
    
    // Keywords
    const allKeywords = [
        formData.get('primaryKeyword'),
        ...formData.get('secondaryKeywords').split(',').map(k => k.trim()).filter(k => k)
    ].join(', ');
    
    const slug = formData.get('slug');
    const siteUrl = formData.get('siteUrl').replace(/\/$/, '');
    const categorySlug = generateSlug(formData.get('category'));
    
    return {
        // Bloco 1
        h1Title: formData.get('h1Title'),
        slug: slug,
        category: formData.get('category'),
        categorySlug: categorySlug,
        author: formData.get('author'),
        authorAvatar: formData.get('authorAvatar') || 'https://via.placeholder.com/100',
        datePublished: datePublished,
        datePublishedISO: formatDateISO(datePublished),
        datePublishedFormatted: formatDatePTBR(datePublished),
        dateModifiedISO: formatDateISO(new Date()),
        readTime: readTime,
        
        // Bloco 2
        primaryKeyword: formData.get('primaryKeyword'),
        secondaryKeywords: formData.get('secondaryKeywords'),
        keywords: allKeywords,
        metaTitle: formData.get('metaTitle'),
        metaDescription: formData.get('metaDescription'),
        searchIntent: formData.get('searchIntent'),
        
        // Bloco 3
        coverImage: convertGoogleDriveUrl(formData.get('coverImage')), // Converte Google Drive
        coverImageAlt: formData.get('coverImageAlt'),
        coverImageCaption: formData.get('coverImageCaption') || '',
        internalImages: internalImages,
        
        // Bloco 4
        introduction: processImagesInHtml(formData.get('introduction')), // Converte URLs do Drive no HTML
        contentBody: processImagesInHtml(formData.get('contentBody')),   // Converte URLs do Drive no HTML
        conclusion: processImagesInHtml(formData.get('conclusion')),     // Converte URLs do Drive no HTML
        
        // Bloco 5
        internalLinks: internalLinks,
        externalLinks: externalLinks,
        
        // Bloco 6
        tags: tagsString,
        tagsArray: tagsArray,
        relatedPosts: formData.get('relatedPosts'),
        
        // Bloco 7
        ctaTitle: formData.get('ctaTitle'),
        ctaText: formData.get('ctaText'),
        ctaLink: formData.get('ctaLink'),
        ctaButtonText: formData.get('ctaButtonText'),
        
        // Bloco 8
        siteUrl: siteUrl,
        siteLogo: formData.get('siteLogo') || `${siteUrl}/logo.png`,
        enableComments: formData.get('enableComments') === 'on',
        enableShare: formData.get('enableShare') === 'on',
        
        // URLs
        canonicalUrl: `${siteUrl}/blog/${slug}`,
        blogUrl: `${siteUrl}/blog`,
        categoryUrl: `${siteUrl}/blog/${categorySlug}`
    };
}

async function generatePostHtml(data) {
    console.log('📥 Carregando template...');
    
    try {
        // Carrega o template
        const response = await fetch('templates/post-template.html');
        
        console.log('📡 Status do fetch template:', response.status);
        
        if (!response.ok) {
            throw new Error(`Erro ao carregar template: ${response.status} ${response.statusText}`);
        }
        
        let template = await response.text();
        console.log('✅ Template carregado, tamanho:', template.length, 'caracteres');
        
        // Sanitiza URLs para prevenir JavaScript injection
        const sanitizeUrl = (url) => {
            if (!url) return '';
            const urlStr = String(url).trim();
            // Remove javascript:, data:, vbscript:, and other dangerous protocols
            const dangerousProtocols = /^(\s*)(javascript|data|vbscript|file|about):/i;
            if (dangerousProtocols.test(urlStr)) {
                return '';
            }
            // Only allow http, https, mailto, and relative URLs
            if (!/^(https?:\/\/|mailto:|\/|#)/i.test(urlStr)) {
                return '';
            }
            return urlStr;
        };
    
    // Substitui placeholders com sanitização
    template = template.replace(/{{META_TITLE}}/g, escapeHtml(data.metaTitle));
    template = template.replace(/{{META_DESCRIPTION}}/g, escapeHtml(data.metaDescription));
    template = template.replace(/{{KEYWORDS}}/g, escapeHtml(data.keywords));
    template = template.replace(/{{AUTHOR}}/g, escapeHtml(data.author));
    template = template.replace(/{{CANONICAL_URL}}/g, sanitizeUrl(data.canonicalUrl));
    template = template.replace(/{{COVER_IMAGE_URL}}/g, sanitizeUrl(data.coverImage));
    template = template.replace(/{{DATE_PUBLISHED}}/g, data.datePublishedISO);
    template = template.replace(/{{DATE_MODIFIED}}/g, data.dateModifiedISO);
    template = template.replace(/{{CATEGORY}}/g, escapeHtml(data.category));
    template = template.replace(/{{TAGS}}/g, escapeHtml(data.tags));
    template = template.replace(/{{H1_TITLE}}/g, escapeHtml(data.h1Title));
    template = template.replace(/{{SITE_LOGO_URL}}/g, sanitizeUrl(data.siteLogo));
    template = template.replace(/{{SITE_URL}}/g, sanitizeUrl(data.siteUrl));
    template = template.replace(/{{CATEGORY_SLUG}}/g, data.categorySlug);
    template = template.replace(/{{READ_TIME}}/g, data.readTime);
    template = template.replace(/{{AUTHOR_AVATAR}}/g, sanitizeUrl(data.authorAvatar));
    template = template.replace(/{{DATE_PUBLISHED_FORMATTED}}/g, data.datePublishedFormatted);
    template = template.replace(/{{COVER_IMAGE_ALT}}/g, escapeHtml(data.coverImageAlt));
    template = template.replace(/{{COVER_IMAGE_CAPTION}}/g, escapeHtml(data.coverImageCaption));
    
    // Para conteúdo HTML, permitimos tags HTML mas escapamos scripts
    const sanitizeHtmlContent = (html) => {
        if (!html) return '';
        // Remove scripts e event handlers
        return html
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/data:text\/html/gi, '');
    };
    
    template = template.replace(/{{INTRODUCTION}}/g, sanitizeHtmlContent(data.introduction));
    template = template.replace(/{{CONTENT_BODY}}/g, sanitizeHtmlContent(data.contentBody));
    template = template.replace(/{{CONCLUSION}}/g, sanitizeHtmlContent(data.conclusion));
    
    // Tags HTML
    const tagsHtml = data.tagsArray.map(tag => 
        `<a href="${sanitizeUrl(data.siteUrl)}/blog/tag/${generateSlug(tag)}" class="tag">#${escapeHtml(tag)}</a>`
    ).join(' ');
    template = template.replace(/{{TAGS_HTML}}/g, tagsHtml);
    
    // CTA
    template = template.replace(/{{CTA_TITLE}}/g, escapeHtml(data.ctaTitle));
    template = template.replace(/{{CTA_TEXT}}/g, escapeHtml(data.ctaText));
    template = template.replace(/{{CTA_LINK}}/g, sanitizeUrl(data.ctaLink));
    template = template.replace(/{{CTA_BUTTON_TEXT}}/g, escapeHtml(data.ctaButtonText));
    
    // Related posts (placeholder por enquanto)
    template = template.replace(/{{RELATED_POSTS_HTML}}/g, '<!-- Posts relacionados serão adicionados automaticamente -->');
    
    return template;
    
    } catch (error) {
        console.error('❌ Erro ao gerar HTML do template:', error);
        throw error;
    }
}

function downloadPost(html, slug) {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slug}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ======================
// MODALS
// ======================

function setupModals() {
    // Close modal buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // Click outside modal
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
    
    // Success modal buttons
    document.getElementById('openPost')?.addEventListener('click', function() {
        // Abre o post gerado
        const slug = document.getElementById('postPath').textContent.split('/').pop().replace('.html', '');
        window.open(`posts/${slug}.html`, '_blank');
    });
    
    document.getElementById('createAnother')?.addEventListener('click', function() {
        document.getElementById('successModal').style.display = 'none';
        document.getElementById('blogForm').reset();
        window.scrollTo(0, 0);
    });
}

function showSuccess(slug, result) {
    console.log('🎉 showSuccess chamado!');
    console.log('🎉 slug:', slug);
    console.log('🎉 result:', result);
    console.log('🎉 lastGeneratedHtml disponível?', !!lastGeneratedHtml);
    console.log('🎉 lastGeneratedSlug:', lastGeneratedSlug);
    
    const modal = document.getElementById('successModal');
    const pathElement = document.getElementById('postPath');
    
    // Verifica se foi salvo no servidor ou como download
    const postPath = `posts/${slug}.html`;
    pathElement.textContent = postPath;
    
    // Mostra mensagem adicional baseada no método usado
    const messageElement = document.querySelector('.success-message') || document.createElement('p');
    if (!document.querySelector('.success-message')) {
        messageElement.className = 'success-message';
        messageElement.style.marginTop = '10px';
        messageElement.style.fontSize = '0.9em';
        messageElement.style.color = '#666';
        messageElement.style.padding = '10px';
        messageElement.style.backgroundColor = '#f0f0f0';
        messageElement.style.borderRadius = '5px';
        modal.querySelector('.modal-content').appendChild(messageElement);
    }
    
    if (result && result.method === 'download') {
        messageElement.innerHTML = '📥 <strong>Post baixado!</strong><br>Upload o arquivo para a pasta <code>/posts/</code> no servidor.';
        messageElement.style.backgroundColor = '#fff3cd';
        messageElement.style.color = '#856404';
    } else {
        messageElement.textContent = '✅ Post salvo com sucesso no servidor!';
        messageElement.style.backgroundColor = '#d4edda';
        messageElement.style.color = '#155724';
    }
    
    // Adiciona ou atualiza botão de download do HTML
    let downloadBtn = document.getElementById('downloadHtmlBtn');
    if (!downloadBtn) {
        downloadBtn = document.createElement('button');
        downloadBtn.id = 'downloadHtmlBtn';
        downloadBtn.className = 'btn-secondary';
        downloadBtn.style.marginTop = '15px';
        downloadBtn.style.padding = '10px 20px';
        downloadBtn.style.backgroundColor = '#007bff';
        downloadBtn.style.color = 'white';
        downloadBtn.style.border = 'none';
        downloadBtn.style.borderRadius = '5px';
        downloadBtn.style.cursor = 'pointer';
        downloadBtn.style.fontSize = '14px';
        downloadBtn.innerHTML = '📥 Baixar HTML Completo';
        
        modal.querySelector('.modal-content').appendChild(downloadBtn);
    }
    
    // Sempre atualiza o evento onclick para garantir que funcione
    downloadBtn.onclick = function() {
        console.log('🔍 Debug - Botão clicado!');
        console.log('🔍 Debug - lastGeneratedHtml existe?', !!lastGeneratedHtml);
        console.log('🔍 Debug - lastGeneratedSlug:', lastGeneratedSlug);
        
        if (lastGeneratedHtml && lastGeneratedSlug) {
            console.log('📥 Iniciando download manual do HTML...');
            console.log('📏 Tamanho:', lastGeneratedHtml.length, 'caracteres');
            
            try {
                const blob = new Blob([lastGeneratedHtml], { type: 'text/html; charset=utf-8' });
                console.log('📦 Blob criado, tamanho:', blob.size, 'bytes');
                
                const url = URL.createObjectURL(blob);
                console.log('🔗 URL criada:', url.substring(0, 50) + '...');
                
                const link = document.createElement('a');
                link.href = url;
                link.download = lastGeneratedSlug + '.html';
                
                console.log('📎 Link criado, filename:', link.download);
                
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                
                console.log('✅ Download concluído!');
                alert('✅ Download iniciado! Verifique sua pasta de downloads.');
            } catch (error) {
                console.error('❌ Erro ao criar download:', error);
                alert('❌ Erro ao criar download: ' + error.message);
            }
        } else {
            console.error('❌ HTML não disponível!');
            console.log('lastGeneratedHtml:', lastGeneratedHtml ? 'existe' : 'null');
            console.log('lastGeneratedSlug:', lastGeneratedSlug ? lastGeneratedSlug : 'null');
            alert('❌ Erro: HTML não disponível. Gere o post novamente.');
        }
    };
    
    modal.style.display = 'flex';
}

function showLoading() {
    // Você pode adicionar um spinner aqui
    document.body.style.cursor = 'wait';
}

function hideLoading() {
    document.body.style.cursor = 'default';
}

// ======================
// TEMPLATE PARA IA
// ======================

// Botão copiar template
document.getElementById('copyTemplate')?.addEventListener('click', function() {
    const template = document.getElementById('aiTemplate');
    const status = document.getElementById('copyStatus');
    
    if (template) {
        const templateText = template.value;
        
        // Copia usando a API moderna
        if (navigator.clipboard) {
            navigator.clipboard.writeText(templateText).then(() => {
                // Mostra feedback de sucesso
                status.textContent = '✅ Template copiado!';
                status.style.color = '#27ae60';
                
                setTimeout(() => {
                    status.textContent = '';
                }, 3000);
            }).catch(err => {
                status.textContent = '❌ Erro ao copiar. Tente novamente.';
                status.style.color = '#e74c3c';
                console.error('Erro ao copiar:', err);
            });
        } else {
            // Fallback para navegadores antigos
            template.select();
            
            try {
                document.execCommand('copy');
                status.textContent = '✅ Template copiado!';
                status.style.color = '#27ae60';
            } catch (err) {
                status.textContent = '❌ Erro ao copiar. Tente novamente.';
                status.style.color = '#e74c3c';
                console.error('Erro ao copiar:', err);
            }
            
            setTimeout(() => {
                status.textContent = '';
            }, 3000);
        }
    }
});

// ======================
// EXPORT FUNCTIONS
// ======================

// ======================
// GITHUB INTEGRATION
// ======================

// Modal de configuração do GitHub
const githubModal = document.getElementById('githubModal');
const configBtn = document.getElementById('configGitHub');
const closeGithubModal = document.getElementById('closeGithubModal');
const saveTokenBtn = document.getElementById('saveToken');
const testTokenBtn = document.getElementById('testToken');
const githubTokenInput = document.getElementById('githubToken');
const tokenStatus = document.getElementById('tokenStatus');

// Abrir modal
configBtn?.addEventListener('click', () => {
    githubModal.style.display = 'flex';
    // Carregar token salvo (mascarado)
    const savedToken = localStorage.getItem('github_token');
    if (savedToken) {
        githubTokenInput.value = '••••••••••••••••••••';
        tokenStatus.textContent = '✅ Token já configurado';
        tokenStatus.className = 'success';
    }
});

// Fechar modal
closeGithubModal?.addEventListener('click', () => {
    githubModal.style.display = 'none';
});

// Salvar token
saveTokenBtn?.addEventListener('click', () => {
    const token = githubTokenInput.value.trim();
    
    if (!token || token === '••••••••••••••••••••') {
        tokenStatus.textContent = '❌ Digite um token válido';
        tokenStatus.className = 'error';
        return;
    }
    
    if (!token.startsWith('ghp_') && !token.startsWith('github_pat_')) {
        tokenStatus.textContent = '❌ Token inválido. Deve começar com ghp_ ou github_pat_';
        tokenStatus.className = 'error';
        return;
    }
    
    localStorage.setItem('github_token', token);
    tokenStatus.textContent = '✅ Token salvo com sucesso!';
    tokenStatus.className = 'success';
    
    // Mascarar token
    setTimeout(() => {
        githubTokenInput.value = '••••••••••••••••••••';
    }, 1000);
});

// Testar conexão
testTokenBtn?.addEventListener('click', async () => {
    const token = localStorage.getItem('github_token');
    
    if (!token) {
        tokenStatus.textContent = '❌ Nenhum token configurado';
        tokenStatus.className = 'error';
        return;
    }
    
    tokenStatus.textContent = '🔄 Testando conexão...';
    tokenStatus.className = '';
    
    try {
        const response = await fetch('https://api.github.com/repos/mediagrowthmkt-debug/protec-blog', {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (response.ok) {
            tokenStatus.textContent = '✅ Conexão bem-sucedida! Pronto para publicar.';
            tokenStatus.className = 'success';
        } else {
            tokenStatus.textContent = '❌ Erro de autenticação. Verifique o token.';
            tokenStatus.className = 'error';
        }
    } catch (error) {
        tokenStatus.textContent = '❌ Erro de rede: ' + error.message;
        tokenStatus.className = 'error';
    }
});

// ======================
// PUBLICAÇÃO AUTOMÁTICA
// ======================

// Modificar o evento de submit do formulário
const originalSubmitHandler = document.getElementById('blogForm')?.onsubmit;

document.getElementById('blogForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Coletar dados do formulário
    const formData = new FormData(this);
    const slug = document.getElementById('slug').value || generateSlug(document.getElementById('h1Title').value);
    
    // Gerar HTML do post (usando função existente)
    const postHtml = generatePostHTML(formData);
    
    // Verificar se tem token configurado
    const hasToken = localStorage.getItem('github_token');
    
    if (hasToken) {
        // Publicar automaticamente no GitHub
        try {
            const loadingModal = document.createElement('div');
            loadingModal.className = 'modal';
            loadingModal.style.display = 'flex';
            loadingModal.innerHTML = `
                <div class="modal-content">
                    <h2>🚀 Publicando no GitHub...</h2>
                    <p>Aguarde enquanto seu post é enviado para blog.protecpremiumgranite.com</p>
                </div>
            `;
            document.body.appendChild(loadingModal);
            
            const url = await window.publishPost(slug, postHtml);
            
            loadingModal.remove();
            
            // Mostrar modal de sucesso com URL
            document.getElementById('postPath').textContent = url;
            document.getElementById('successModal').style.display = 'flex';
            
            // Configurar botão para abrir
            document.getElementById('openPost').onclick = () => {
                window.open(url, '_blank');
            };
            
        } catch (error) {
            alert('Erro ao publicar no GitHub: ' + error.message + '\n\nO post foi gerado localmente. Você pode salvá-lo manualmente.');
            console.error('Erro:', error);
            
            // Fallback: baixar HTML
            downloadPost(postHtml, slug);
        }
    } else {
        // Sem token: baixar HTML (comportamento antigo)
        downloadPost(postHtml, slug);
        alert('💡 Dica: Configure o GitHub Token para publicar automaticamente!\nClique em "⚙️ Configurar GitHub" no topo da página.');
    }
});

// Função para baixar post localmente
function downloadPost(html, slug) {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slug}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Função para gerar HTML do post (usar a que já existe no código)
function generatePostHTML(formData) {
    // Essa função já deve existir no código - apenas referenciar
    // Retorna o HTML completo do post
    // TODO: Integrar com a função existente de geração de HTML
    return ''; // Placeholder
}

// ======================
// EXPORT FUNCTIONS
// ======================

// Permite usar estas funções em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateSlug,
        removeStopwords,
        calculateReadTime,
        formatDateISO,
        formatDatePTBR
    };
}
