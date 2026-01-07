from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
import requests
import io
import math
import json

app = Flask(__name__)
CORS(app)

SHAREPOINT_URL = "https://granistonecombr-my.sharepoint.com/:x:/g/personal/deiliane_lira_granistone_com_br/IQBq2mm_i7E9TIm6Nf6oxLuXAZAzRaj24Eb6LcoEUZ4bIGU?download=1"

def clean_val(val, is_p=False):
    if val is None or val == "" or str(val).lower() == "nan" or str(val) == "-":
        return None
    try:
        s = str(val).replace("R$", "").replace("US$", "").replace("$", "").replace("%", "").replace(",", ".").strip()
        f = float(s)
        if math.isnan(f): return None
        if is_p and f <= 1.1: f = f * 100
        return f
    except:
        return None

@app.route('/api/data')
def get_data():
    try:
        print("Buscando dados no SharePoint...")
        response = requests.get(SHAREPOINT_URL, timeout=30)
        if response.status_code != 200:
            return jsonify({"error": f"SharePoint returned {response.status_code}"}), 500
        
        df = pd.read_excel(io.BytesIO(response.content), sheet_name='Tabela 2024_2025')
        df = df.dropna(subset=['INDICADOR', 'SETOR'])
        
        # Mapping by standard indices to be more resilient
        # 0: INDICADOR, 1: SETOR, 2: UNIDADE, 3: META
        col_names = df.columns.tolist()
        unit_col = col_names[2]
        meta_col = col_names[3]

        df.columns = [str(c) for c in df.columns]
        data = df.to_dict(orient='records')
        
        final_indicators = []
        for row in data:
            title = str(row.get("INDICADOR") or "")
            unit_val = str(row.get(unit_col) or "").strip()
            if unit_val.lower() == "nan" or unit_val == "None": unit_val = ""
            
            unit_upper = unit_val.upper()
            title_upper = title.upper()
            
            is_pct = "%" in title or "%" in unit_val
            is_brl = "R$" in unit_upper or "R$" in title_upper or "REAL" in unit_upper or "VALOR" in title_upper
            is_usd = "US$" in unit_upper or "USD" in unit_upper or "DOLAR" in unit_upper or "DÓLAR" in unit_upper
            
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
        
        return jsonify({
            "sectors": sectors,
            "indicatorsData": final_indicators
        })
    except Exception as e:
        print(f"Erro: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)
