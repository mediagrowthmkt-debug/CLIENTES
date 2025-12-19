#!/bin/bash

# 🚀 Script de Inicialização do Dashboard
# Inicia tanto a API quanto o servidor HTTP automaticamente

echo "======================================================================"
echo "🚀 INICIANDO SISTEMA DE DASHBOARD"
echo "======================================================================"
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Diretório do script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo -e "${BLUE}📂 Diretório:${NC} $SCRIPT_DIR"
echo ""

# Verificar se Python está instalado
if ! command -v python3 &> /dev/null; then
    echo -e "${YELLOW}⚠️  Python 3 não encontrado!${NC}"
    echo "Por favor, instale Python 3 primeiro."
    exit 1
fi

echo -e "${GREEN}✅ Python 3 encontrado${NC}"

# Verificar/Instalar dependências
echo ""
echo -e "${BLUE}📦 Verificando dependências...${NC}"

if [ -f ".venv/bin/python" ]; then
    PYTHON_CMD=".venv/bin/python"
    echo -e "${GREEN}✅ Virtual environment encontrado${NC}"
else
    PYTHON_CMD="python3"
    echo -e "${YELLOW}⚠️  Usando Python do sistema${NC}"
fi

# Instalar dependências se necessário
$PYTHON_CMD -c "import flask" 2>/dev/null || {
    echo -e "${YELLOW}📦 Instalando Flask...${NC}"
    $PYTHON_CMD -m pip install flask flask-cors requests
}

echo -e "${GREEN}✅ Dependências OK${NC}"
echo ""

# Função para cleanup ao sair
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Encerrando servidores...${NC}"
    kill $API_PID 2>/dev/null
    kill $HTTP_PID 2>/dev/null
    echo -e "${GREEN}✅ Servidores encerrados${NC}"
    exit 0
}

trap cleanup EXIT INT TERM

# Iniciar API Flask
echo -e "${BLUE}🚀 Iniciando API Flask na porta 5000...${NC}"
$PYTHON_CMD dashboard_api.py > /tmp/dashboard-api.log 2>&1 &
API_PID=$!

sleep 2

# Verificar se API iniciou
if ps -p $API_PID > /dev/null; then
    echo -e "${GREEN}✅ API Flask rodando (PID: $API_PID)${NC}"
else
    echo -e "${YELLOW}❌ Erro ao iniciar API Flask${NC}"
    echo "Verifique o log: /tmp/dashboard-api.log"
    exit 1
fi

echo ""

# Iniciar servidor HTTP
echo -e "${BLUE}🌐 Iniciando servidor HTTP na porta 8080...${NC}"
$PYTHON_CMD -m http.server 8080 > /tmp/dashboard-http.log 2>&1 &
HTTP_PID=$!

sleep 2

# Verificar se servidor HTTP iniciou
if ps -p $HTTP_PID > /dev/null; then
    echo -e "${GREEN}✅ Servidor HTTP rodando (PID: $HTTP_PID)${NC}"
else
    echo -e "${YELLOW}❌ Erro ao iniciar servidor HTTP${NC}"
    echo "Verifique o log: /tmp/dashboard-http.log"
    kill $API_PID 2>/dev/null
    exit 1
fi

echo ""
echo "======================================================================"
echo -e "${GREEN}✨ SISTEMA INICIADO COM SUCESSO!${NC}"
echo "======================================================================"
echo ""
echo -e "${BLUE}📊 Dashboard:${NC}  http://localhost:8080/projects-dashboard.html"
echo -e "${BLUE}🔧 API:${NC}        http://localhost:5000"
echo ""
echo -e "${YELLOW}💡 Dicas:${NC}"
echo "   • Clique em 'Sincronizar GitHub' para buscar domínios"
echo "   • Clique em 'Atualizar Previews' para recarregar screenshots"
echo "   • Pressione Ctrl+C para encerrar"
echo ""
echo -e "${BLUE}📋 Logs:${NC}"
echo "   • API:  /tmp/dashboard-api.log"
echo "   • HTTP: /tmp/dashboard-http.log"
echo ""
echo "======================================================================"
echo -e "${GREEN}Aguardando... (Ctrl+C para encerrar)${NC}"
echo "======================================================================"
echo ""

# Abrir navegador automaticamente (opcional)
sleep 2
if command -v open &> /dev/null; then
    # macOS
    open "http://localhost:8080/projects-dashboard.html"
elif command -v xdg-open &> /dev/null; then
    # Linux
    xdg-open "http://localhost:8080/projects-dashboard.html"
fi

# Manter script rodando
wait
