# Guia de Implantação Online (Deployment) - Granistone Dashboards

Para que usuários externos (fora do seu computador) acessem os dashboards, siga os passos abaixo para colocá-los "nas nuvens".

## 📊 1. Dashboard BI (Streamlit) - O mais fácil
O Streamlit possui um serviço gratuito perfeito para isso.

1.  **Crie um repositório no GitHub** e envie a pasta `granistone-streamlit` para lá.
2.  Acesse [share.streamlit.io](https://share.streamlit.io).
3.  Conecte sua conta do GitHub.
4.  Selecione o repositório e o arquivo `streamlit_app.py`.
5.  **Pronto!** Ele fornecerá um link público (ex: `granistone.streamlit.app`).

---

## 🚀 2. Dashboard Premium (React) + Servidor de Dados
Este exige dois passos, pois o React precisa do servidor Python para ler os dados do SharePoint.

### Passo A: Hospedar o Servidor de Dados (Backend)
Use o [Render.com](https://render.com) (Gratuito):
1.  Crie uma conta no Render.
2.  Conecte seu GitHub e selecione a pasta do projeto.
3.  Crie um "Web Service".
4.  **Runtime**: Python
5.  **Build Command**: `pip install -r requirements.txt` (Crie um arquivo requirements.txt com: flask, flask-cors, pandas, requests, openpyxl).
6.  **Start Command**: `python server.py`
7.  O Render te dará um link (ex: `https://granistone-api.onrender.com`).

### Passo B: Hospedar o Dashboard (Frontend)
Use o [Vercel.com](https://vercel.com) (Gratuito):
1.  No arquivo `src/App.jsx`, troque `http://localhost:5000` pelo link que o Render te deu.
2.  No Vercel, conecte seu GitHub e importe a pasta `dashboard-granistone`.
3.  Ele detectará automaticamente que é um projeto Vite.
4.  Clique em **Deploy**.
5.  **Pronto!** Você terá um link profissional (ex: `granistone-intelligence.vercel.app`).

---

## 📝 Atualização no Git
Para salvar tudo e manter organizado:
```bash
git add .
git commit -m "Arquivos prontos para deploy online"
git push origin main
```

**Dica**: Se precisar de ajuda para configurar o GitHub ou fazer o primeiro "Push", me avise!
