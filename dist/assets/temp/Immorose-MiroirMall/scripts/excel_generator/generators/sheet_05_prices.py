"""
Real Estate Prices Sheet Generator - LUXURY DESIGN
"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from config.styles import ICONS, add_navigation_bar
from utils.data_loader import load_csv


def generate_prices_sheet(workbook, formats: dict, data: dict) -> None:
    """Generate Real Estate Prices sheet"""
    
    worksheet = workbook.add_worksheet("💰 Prix Immobilier")
    
    worksheet.set_column('A:A', 2)
    worksheet.set_column('B:B', 30)
    worksheet.set_column('C:H', 16)
    
    row = add_navigation_bar(worksheet, formats, current_sheet_index=4, start_row=1)
    
    # Header
    worksheet.set_row(row, 40)
    worksheet.merge_range(row, 1, row, 7, f"{ICONS['money']} PRIX IMMOBILIER", formats["header_main"])
    row += 1
    worksheet.merge_range(row, 1, row, 7, "Loyers et prix au m² - Lubumbashi & Kinshasa 2024-2025", formats["header_sub"])
    row += 2
    
    # Real Estate Data
    worksheet.merge_range(row, 1, row, 7, f"{ICONS['building']} PRIX ET LOYERS COMMERCIAUX", formats["header_section"])
    row += 1
    
    prices_df = data.get("real_estate_prices")
    if prices_df is not None and len(prices_df) > 0:
        # Write headers
        cols = list(prices_df.columns)
        for i, col in enumerate(cols[:7]):
            worksheet.write(row, 1 + i, col, formats["table_header_dark"])
        row += 1
        
        # Write data
        for i, (_, r) in enumerate(prices_df.iterrows()):
            fmt = formats["cell_alt"] if i % 2 else formats["cell_normal"]
            for j, col in enumerate(cols[:7]):
                val = str(r.get(col, ''))
                if 'USD' in val or '$' in val:
                    worksheet.write(row, 1 + j, val, formats["highlight_gold"])
                else:
                    worksheet.write(row, 1 + j, val, fmt if j > 0 else formats["table_header"])
            row += 1
    else:
        # Static comparison data
        price_data = [
            ("Kinshasa - Gombe", "Bureau Grade A", "35", "USD/m²/mois", "Prime", "Knight Frank"),
            ("Kinshasa - Gombe", "Commerce Prime", "25", "USD/m²/mois", "Retail", "Knight Frank"),
            ("Kinshasa - Gombe", "Appartement luxe", "15-25", "USD/m²/mois", "Résidentiel", "SCIM"),
            ("Lubumbashi - Centre", "Bureau", "20-30", "USD/m²/mois", "Estimé", "Marché local"),
            ("Lubumbashi - Kipopo", "Commerce Mall", "25-35", "USD/m²/mois", "MiroirMall", "Estimation"),
            ("Luano City", "Bureau", "40+", "USD/m²/mois", "Premium", "Luano City"),
        ]
        
        worksheet.write(row, 1, "Zone", formats["table_header_dark"])
        worksheet.write(row, 2, "Type", formats["table_header_dark"])
        worksheet.write(row, 3, "Prix", formats["table_header_dark"])
        worksheet.write(row, 4, "Unité", formats["table_header_dark"])
        worksheet.write(row, 5, "Segment", formats["table_header_dark"])
        worksheet.merge_range(row, 6, row, 7, "Source", formats["table_header_dark"])
        row += 1
        
        for i, (zone, typ, prix, unite, seg, src) in enumerate(price_data):
            fmt = formats["cell_alt"] if i % 2 else formats["cell_normal"]
            worksheet.write(row, 1, zone, fmt)
            worksheet.write(row, 2, typ, fmt)
            worksheet.write(row, 3, prix, formats["highlight_gold"])
            worksheet.write(row, 4, unite, formats["cell_center"])
            worksheet.write(row, 5, seg, formats["cell_center"])
            worksheet.merge_range(row, 6, row, 7, src, fmt)
            row += 1
    
    row += 1
    
    # Key Insights
    worksheet.merge_range(row, 1, row, 7, f"{ICONS['fire']} INSIGHTS MARCHÉ IMMOBILIER", formats["header_section"])
    row += 1
    
    insights = [
        (f"{ICONS['graph_up']} Kinshasa leader", "Les loyers prime à Kinshasa sont les plus élevés de RDC (35$/m² bureaux)"),
        (f"{ICONS['pin']} Lubumbashi en croissance", "Demande croissante liée au secteur minier, peu d'offre moderne"),
        (f"{ICONS['check']} Opportunité MiroirMall", "Premier mall moderne à Lubumbashi = pricing power"),
        (f"{ICONS['money']} Loyers dollarisés", "Majorité des baux commerciaux en USD (protection inflation)"),
        (f"{ICONS['warning']} Vacance élevée", "Jusqu'à 30% de vacance sur certains immeubles vétustes"),
    ]
    
    for i, (titre, detail) in enumerate(insights):
        fmt = formats["cell_alt"] if i % 2 else formats["cell_normal"]
        worksheet.write(row, 1, titre, formats["table_header"])
        worksheet.merge_range(row, 2, row, 7, detail, fmt)
        row += 1
    
    worksheet.freeze_panes(3, 0)
    print("✅ Prix Immobilier sheet generated")
