# Projeto Granistone Intelligence - Documentação Final

Este documento resume o funcionamento e a estrutura dos dois dashboards desenvolvidos para a Granistone.

## 🚀 1. Dashboard Premium (React + Vite)
Uma interface de altíssimo nível estético, focada em Business Intelligence executivo.

### Funcionalidades:
- **Sincronização em Tempo Real**: Conectado diretamente à planilha SharePoint via servidor de ponte (Flask).
- **Filtro de Anos**: Seleção dinâmica entre 2024, 2025 ou Visão Comparativa.
- **Filtro de Setores**: Menu suspenso inteligente que carrega os setores da planilha.
- **Detecção Automática de Unidade**: Identifica R$, US$, % ou unidades nominais (m², kg, etc).
- **Metas Visíveis**: Linha de meta 2025 reforçada e com rótulos de valores.
- **Modo KPI vs Gráfico**: Alternância rápida entre visão detalhada e métricas consolidadas.

### Como Rodar:
1. Abra um terminal e inicie o servidor de dados:
   ```bash
   cd dashboard-granistone
   python server.py
   ```
2. Abra outro terminal e inicie o dashboard:
   ```bash
   npm run dev
   ```
3. Acesse: `http://localhost:5173`

---

## 📊 2. Dashboard BI (Streamlit)
Uma ferramenta ágil e analítica, ideal para consumo rápido de dados operacionais.

### Funcionalidades:
- **Integração SharePoint**: Botão de atualização manual com limpeza de cache.
- **Visualização Plotly**: Gráficos interativos com tooltips detalhadas.
- **Formatação de Moedas**: Suporte a R$ e US$ automático.
- **Sidebar Retrátil**: Menu de navegação lateral para foco total nos dados.

### Como Rodar:
1. Inicie o sistema Streamlit:
   ```bash
   cd granistone-streamlit
   streamlit run streamlit_app.py
   ```
2. Acesse: `http://localhost:8501`

---

## 📂 Repositórios e Códigos
- **Git (Local)**: Todos os arquivos foram commitados com as versões finais em seus respectivos diretórios.
- **Scripts de Sincronização**: Localizados em `server.py` (React) e `streamlit_app.py`.

---

**Desenvolvido por Antigravity (Google Deepmind)**
*Data: 07 de Janeiro de 2026*
