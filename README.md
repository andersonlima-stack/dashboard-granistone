# Granistone Intelligence - Dashboard Premium

Dashboard executivo premium desenvolvido em React para visualização de indicadores industriais e comerciais da Granistone.

## 🚀 Acesso Online
O dashboard está hospedado e pode ser acessado publicamente através do link:
👉 **[https://dashboard-granistone.vercel.app/](https://dashboard-granistone.vercel.app/)**

## �️ Segurança e Acesso
Para garantir que os dados sejam visualizados apenas por colaboradores autorizados, o portal possui uma barreira de segurança:
*   **Chave de Acesso**: `granistone2026`
*   **Restrição**: O sistema utiliza cache local para manter a sessão ativa após o primeiro acesso bem-sucedido.

## 📊 Funcionalidades
*   **Sincronização em Tempo Real**: Conexão direta com a planilha `Painel da RMR v.2.xlsx` no SharePoint.
*   **Filtros Dinâmicos**: Alternância entre setores (Comercial, Beneficiamento, etc.) e anos (2024, 2025).
*   **Visualização de Metas**: Linha de meta mensal projetada sobre o realizado.
*   **Comparativo de Performance**: Cálculo automático de variação percentual entre as médias de 2024 e 2025.

## 🏗️ Arquitetura
1.  **Frontend (Vercel)**: Interface em React + Tailwind CSS + Recharts.
2.  **Backend (Render/Local)**: Servidor em Python (Flask) que processa os dados brutos do SharePoint e os limpa para o dashboard.
3.  **Base de Dados**: Microsoft SharePoint (Excel).

## 🛠️ Como rodar localmente
1.  Instale as dependências: `npm install`
2.  Inicie o servidor de dados: `python server.py`
3.  Inicie o dashboard: `npm run dev`

---
*Desenvolvido pela Divisão de Controle de Produção - Granistone Industrial*
