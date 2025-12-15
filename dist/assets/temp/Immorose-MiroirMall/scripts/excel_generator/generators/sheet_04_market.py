"""
Market RDC Sheet Generator - LUXURY DESIGN
Economic data and market analysis
"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from config.settings import ECONOMIC
from config.styles import ICONS, add_navigation_bar
from utils.data_loader import load_csv


def generate_market_sheet(workbook, formats: dict, data: dict) -> None:
    """Generate Market RDC analysis sheet"""
    
    worksheet = workbook.add_worksheet("📊 Marché RDC")
    
    worksheet.set_column('A:A', 2)
    worksheet.set_column('B:B', 35)
    worksheet.set_column('C:H', 18)
    
    row = add_navigation_bar(worksheet, formats, current_sheet_index=3, start_row=1)
    
    # Header
    worksheet.set_row(row, 40)
    worksheet.merge_range(row, 1, row, 7, f"{ICONS['chart']} MARCHÉ RDC", formats["header_main"])
    row += 1
    worksheet.merge_range(row, 1, row, 7, "Analyse économique et démographique 2024-2025", formats["header_sub"])
    row += 2
    
    # Economic Data
    worksheet.merge_range(row, 1, row, 7, f"{ICONS['money']} DONNÉES ÉCONOMIQUES RDC", formats["header_section"])
    row += 1
    
    economic_df = data.get("economic_data")
    if economic_df is not None and len(economic_df) > 0:
        worksheet.write(row, 1, "Indicateur", formats["table_header_dark"])
        worksheet.write(row, 2, "Valeur", formats["table_header_dark"])
        worksheet.write(row, 3, "Unité", formats["table_header_dark"])
        worksheet.write(row, 4, "Année", formats["table_header_dark"])
        worksheet.merge_range(row, 5, row, 7, "Source", formats["table_header_dark"])
        row += 1
        
        for i, (_, r) in enumerate(economic_df.iterrows()):
            fmt = formats["cell_alt"] if i % 2 else formats["cell_normal"]
            worksheet.write(row, 1, str(r.get('Indicateur', '')), fmt)
            worksheet.write(row, 2, str(r.get('Valeur', '')), formats["highlight_gold"])
            worksheet.write(row, 3, str(r.get('Unite', '')), formats["cell_center"])
            worksheet.write(row, 4, str(r.get('Annee', '')), formats["cell_center"])
            worksheet.merge_range(row, 5, row, 7, str(r.get('Source', '')), fmt)
            row += 1
    else:
        # Static data from config
        econ_static = [
            ("PIB RDC 2024", f"{ECONOMIC['gdp_rdc_2024_musd']:,}", "Millions USD", "2024", "Makanisi"),
            ("PIB RDC 2025", f"{ECONOMIC['gdp_rdc_2025_musd']:,}", "Millions USD", "2025", "Projection"),
            ("Croissance PIB", f"{ECONOMIC['growth_rate_2024']*100:.1f}", "%", "2024", "FMI"),
            ("Inflation", f"{ECONOMIC['inflation_2024']*100:.0f}", "%", "2024", "Reuters"),
            ("Part secteur minier", f"{ECONOMIC['mining_share_exports']*100:.0f}", "% exports", "2024", "Coface"),
            ("Population Lubumbashi", f"{ECONOMIC['population_lubumbashi']:,}", "habitants", "2025", "Macrotrends"),
            ("Classe moyenne", f"{ECONOMIC['middle_class_percent']*100:.0f}", "%", "2024", "Le Moci"),
        ]
        
        worksheet.write(row, 1, "Indicateur", formats["table_header_dark"])
        worksheet.write(row, 2, "Valeur", formats["table_header_dark"])
        worksheet.write(row, 3, "Unité", formats["table_header_dark"])
        worksheet.write(row, 4, "Année", formats["table_header_dark"])
        worksheet.merge_range(row, 5, row, 7, "Source", formats["table_header_dark"])
        row += 1
        
        for i, (ind, val, unite, annee, src) in enumerate(econ_static):
            fmt = formats["cell_alt"] if i % 2 else formats["cell_normal"]
            worksheet.write(row, 1, ind, fmt)
            worksheet.write(row, 2, val, formats["highlight_gold"])
            worksheet.write(row, 3, unite, formats["cell_center"])
            worksheet.write(row, 4, annee, formats["cell_center"])
            worksheet.merge_range(row, 5, row, 7, src, fmt)
            row += 1
    
    row += 1
    
    # Demographics
    worksheet.merge_range(row, 1, row, 7, f"{ICONS['team']} DÉMOGRAPHIE LUBUMBASHI", formats["header_section"])
    row += 1
    
    demographics_df = data.get("demographics")
    if demographics_df is not None and len(demographics_df) > 0:
        worksheet.write(row, 1, "Indicateur", formats["table_header_dark"])
        worksheet.write(row, 2, "Valeur", formats["table_header_dark"])
        worksheet.write(row, 3, "Unité", formats["table_header_dark"])
        worksheet.write(row, 4, "Année", formats["table_header_dark"])
        worksheet.merge_range(row, 5, row, 7, "Source", formats["table_header_dark"])
        row += 1
        
        for i, (_, r) in enumerate(demographics_df.iterrows()):
            fmt = formats["cell_alt"] if i % 2 else formats["cell_normal"]
            worksheet.write(row, 1, str(r.get('Indicateur', '')), fmt)
            worksheet.write(row, 2, str(r.get('Valeur', '')), formats["cell_number"])
            worksheet.write(row, 3, str(r.get('Unite', '')), formats["cell_center"])
            worksheet.write(row, 4, str(r.get('Annee', '')), formats["cell_center"])
            worksheet.merge_range(row, 5, row, 7, str(r.get('Source', '')), fmt)
            row += 1
    
    row += 1
    
    # Key Insights
    worksheet.merge_range(row, 1, row, 7, f"{ICONS['fire']} OPPORTUNITÉS MARCHÉ", formats["header_section"])
    row += 1
    
    insights = [
        (f"{ICONS['check']} Croissance forte", "PIB +6.5% en 2024, économie dynamique"),
        (f"{ICONS['check']} Secteur minier", "30% des recettes, pouvoir d'achat Katanga"),
        (f"{ICONS['check']} Urbanisation", "Population Lubumbashi en croissance (+4%/an)"),
        (f"{ICONS['check']} Classe moyenne", "15% de la population, cible principale"),
        (f"{ICONS['warning']} Inflation", "13% en 2024, pression sur consommation"),
        (f"{ICONS['warning']} Économie informelle", "90% du commerce, défi formalisation"),
    ]
    
    for i, (titre, detail) in enumerate(insights):
        fmt = formats["cell_alt"] if i % 2 else formats["cell_normal"]
        worksheet.write(row, 1, titre, formats["table_header"])
        worksheet.merge_range(row, 2, row, 7, detail, fmt)
        row += 1
    
    worksheet.freeze_panes(3, 0)
    print("✅ Marché RDC sheet generated")
