"""
Prospects Sheet Generator - LUXURY DESIGN
Database of future ImmoRose clients
"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from config.styles import ICONS, add_navigation_bar
from utils.data_loader import load_csv


def generate_prospects_sheet(workbook, formats: dict, data: dict) -> None:
    """Generate Prospects database sheet"""
    
    worksheet = workbook.add_worksheet("🎯 Prospects")
    
    worksheet.set_column('A:A', 2)
    worksheet.set_column('B:B', 28)
    worksheet.set_column('C:C', 20)
    worksheet.set_column('D:D', 18)
    worksheet.set_column('E:H', 22)
    
    row = add_navigation_bar(worksheet, formats, current_sheet_index=5, start_row=1)
    
    # Header
    worksheet.set_row(row, 40)
    worksheet.merge_range(row, 1, row, 7, f"{ICONS['target']} PROSPECTS IMMOROSE", formats["header_main"])
    row += 1
    worksheet.merge_range(row, 1, row, 7, "Clients potentiels pour futurs projets immobiliers", formats["header_sub"])
    row += 2
    
    # Stats summary
    prospects_df = data.get("prospects")
    total = len(prospects_df) if prospects_df is not None else 0
    
    worksheet.merge_range(row, 1, row, 7, 
                         f"{ICONS['chart']} SYNTHÈSE : {total} prospects identifiés", 
                         formats["header_section"])
    row += 1
    
    # Categories breakdown
    if prospects_df is not None and len(prospects_df) > 0:
        if "Type_Client" in prospects_df.columns:
            category_counts = prospects_df["Type_Client"].value_counts()
            
            col = 1
            for cat, count in category_counts.items():
                worksheet.write(row, col, cat, formats["table_header"])
                worksheet.write(row, col + 1, count, formats["highlight_gold"])
                col += 2
                if col > 7:
                    break
            row += 2
    
    # Prospects Table
    worksheet.merge_range(row, 1, row, 7, f"{ICONS['team']} BASE DE DONNÉES PROSPECTS", formats["header_section"])
    row += 1
    
    if prospects_df is not None and len(prospects_df) > 0:
        # Headers
        cols = ["Nom", "Type_Client", "Catégorie", "Contact", "Localisation"]
        available_cols = [c for c in cols if c in prospects_df.columns]
        
        for i, col in enumerate(available_cols[:5]):
            worksheet.write(row, 1 + i, col, formats["table_header_dark"])
        worksheet.merge_range(row, 6, row, 7, "Priorité", formats["table_header_dark"])
        row += 1
        
        # Data rows
        for i, (_, r) in enumerate(prospects_df.head(30).iterrows()):
            fmt = formats["cell_alt"] if i % 2 else formats["cell_normal"]
            
            for j, col in enumerate(available_cols[:5]):
                val = str(r.get(col, ''))
                worksheet.write(row, 1 + j, val, fmt)
            
            # Priority indicator
            priorite = r.get("Priorite", "Moyen")
            if str(priorite).lower() in ["haut", "haute", "high"]:
                worksheet.merge_range(row, 6, row, 7, f"{ICONS['fire']} HAUTE", formats["highlight_success"])
            elif str(priorite).lower() in ["moyen", "moyenne", "medium"]:
                worksheet.merge_range(row, 6, row, 7, f"{ICONS['star']} Moyen", formats["highlight_gold"])
            else:
                worksheet.merge_range(row, 6, row, 7, "Normal", formats["cell_center"])
            
            row += 1
    else:
        worksheet.merge_range(row, 1, row, 7, "Données non disponibles - voir prospects_miroirmall.csv", 
                             formats["cell_normal"])
        row += 1
    
    row += 1
    
    # Categories explanation
    worksheet.merge_range(row, 1, row, 7, f"{ICONS['doc']} CATÉGORIES DE PROSPECTS", formats["header_section"])
    row += 1
    
    categories = [
        (f"{ICONS['building']} Acheteurs Résidentiel", "Diaspora, investisseurs locaux - villas type 9 Carats"),
        (f"{ICONS['money']} Investisseurs Immobilier", "Fonds, family offices, expatriés fortunés"),
        (f"{ICONS['handshake']} Partenaires Construction", "Entreprises BTP, fournisseurs matériaux"),
        (f"{ICONS['mall']} Partenaires Commercial", "Franchises, marques, enseignes retail"),
        (f"{ICONS['briefcase']} Institutionnels", "Gouvernement, ONG, organisations internationales"),
    ]
    
    for i, (cat, desc) in enumerate(categories):
        fmt = formats["cell_alt"] if i % 2 else formats["cell_normal"]
        worksheet.write(row, 1, cat, formats["table_header"])
        worksheet.merge_range(row, 2, row, 7, desc, fmt)
        row += 1
    
    worksheet.freeze_panes(3, 0)
    print("✅ Prospects sheet generated")
