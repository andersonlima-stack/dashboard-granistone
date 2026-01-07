import pandas as pd
import requests
import io
import json
import math
import os

url = "https://granistonecombr-my.sharepoint.com/:x:/g/personal/deiliane_lira_granistone_com_br/IQBq2mm_i7E9TIm6Nf6oxLuXAZAzRaj24Eb6LcoEUZ4bIGU?download=1"

def fetch_and_generate():
    try:
        print("Iniciando sincronização de dados...")
        response = requests.get(url, timeout=30)
        if response.status_code == 200:
            df = pd.read_excel(io.BytesIO(response.content), sheet_name='Tabela 2024_2025')
            df = df.dropna(subset=['INDICADOR', 'SETOR'])
            
            meta_col = df.columns[3]
            print(f"Usando coluna de meta: {meta_col}")
            
            df.columns = [str(c) for c in df.columns]
            data = df.to_dict(orient='records')
            
            final_indicators = []
            for row in data:
                title = str(row.get("INDICADOR") or "")
                unit_val = str(row.get("UNIDADE") or "").upper()
                
                is_pct = "%" in title or "%" in unit_val
                is_brl = "R$" in unit_val or "R$" in title or "REAL" in unit_val or "VALOR" in title.upper()
                is_usd = "US$" in unit_val or "USD" in unit_val or "DOLAR" in unit_val or "DÓLAR" in unit_val
                
                def clean_val(val, is_p=False):
                    if val is None or val == "" or str(val).lower() == "nan" or str(val) == "-": return None
                    try:
                        s = str(val).replace("R$", "").replace("US$", "").replace("$", "").replace("%", "").replace(",", ".").strip()
                        f = float(s)
                        if math.isnan(f): return None
                        if is_p and f <= 1.1: f = f * 100
                        return f
                    except: return None

                raw_meta = row.get(str(meta_col))
                meta_val = clean_val(raw_meta, is_pct)

                indicator = {
                    "title": title,
                    "sector": row.get("SETOR"),
                    "unit": unit_val if unit_val != "NAN" else "",
                    "is_pct": is_pct,
                    "is_brl": is_brl,
                    "is_usd": is_usd,
                    "meta": meta_val,
                    "data": []
                }
                
                months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez', 'MÉD']
                row_values = list(row.values())
                
                # Index 4 is where month data starts
                for i in range(13):
                    m_data = { "name": months[i] }
                    val_24 = clean_val(row_values[4+i], is_pct)
                    val_25 = clean_val(row_values[17+i], is_pct)
                    m_data["2024"] = val_24
                    m_data["2025"] = val_25
                    m_data["Meta"] = meta_val
                    indicator["data"].append(m_data)
                
                final_indicators.append(indicator)

            sectors = sorted(list(set([r["sector"] for r in final_indicators if r["sector"]])))
            
            js_content = "export const sectors = " + json.dumps(sectors, ensure_ascii=False) + ";\n\n"
            js_content += "export const indicatorsData = " + json.dumps(final_indicators, ensure_ascii=False, indent=4) + ";\n"
            
            js_content += """
export const kpis = [
    { label: 'Faturamento Total', value: 'R$ 12.4M', change: '+12.5%', tendance: 'up' },
    { label: 'Volume de Vendas', value: '8.420 m²', change: '+8.2%', tendance: 'up' },
    { label: 'Ticket Médio', value: 'R$ 1.472', change: '-2.1%', tendance: 'down' },
    { label: 'Clientes Ativos', value: '142', change: '+5.4%', tendance: 'up' },
];

export const dailyPerformance = [
    { date: '2025-10-20', internal: 450000, external: 1200000 },
    { date: '2025-10-21', internal: 380000, external: 950000 },
    { date: '2025-10-22', internal: 520000, external: 1100000 },
    { date: '2025-10-23', internal: 410000, external: 1400000 },
    { date: '2025-10-24', internal: 600000, external: 1300000 },
];

export const topMaterials = [
    { name: 'Amazonita', value: 6545809 },
    { name: 'Speranza', value: 1558434 },
    { name: 'Granito Branco', value: 980200 },
    { name: 'Mármore Cinza', value: 850000 },
    { name: 'Quartzo Rose', value: 720000 },
];
"""
            with open('src/data.js', 'w', encoding='utf-8') as f:
                f.write(js_content)
            print("SUCESSO: Dados sincronizados com sucesso.")
        else:
            print(f"ERRO: Status {response.status_code}")
    except Exception as e:
        print(f"ERRO: {e}")

if __name__ == "__main__":
    fetch_and_generate()
