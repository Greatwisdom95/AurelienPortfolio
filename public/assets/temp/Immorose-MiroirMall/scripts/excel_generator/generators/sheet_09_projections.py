"""
Financial Projections Sheet Generator - LUXURY DESIGN
Revenue forecasts 2025-2028
"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from config.settings import PROJECTIONS, MIROIRMALL, CHARTS_DIR
from config.styles import ICONS, add_navigation_bar
from charts import create_revenue_projection_3d
from utils.formatter import format_currency


def generate_projections_sheet(workbook, formats: dict, data: dict) -> None:
    """Generate Financial Projections sheet"""
    
    worksheet = workbook.add_worksheet("📈 Projections")
    
    worksheet.set_column('A:A', 2)
    worksheet.set_column('B:B', 22)
    worksheet.set_column('C:N', 14)
    
    row = add_navigation_bar(worksheet, formats, current_sheet_index=8, start_row=1)
    
    # Header
    worksheet.set_row(row, 40)
    worksheet.merge_range(row, 1, row, 10, f"{ICONS['graph_up']} PROJECTIONS FINANCIÈRES", formats["header_main"])
    row += 1
    worksheet.merge_range(row, 1, row, 10, "Prévisions revenus MiroirMall 2025-2028 (3 scénarios)", formats["header_sub"])
    row += 2
    
    # Hypotheses
    worksheet.merge_range(row, 1, row, 10, f"{ICONS['doc']} HYPOTHÈSES DE BASE", formats["header_section"])
    row += 1
    
    hypotheses = [
        ("Surface louable (GLA)", f"{MIROIRMALL['gla_m2']:,} m²"),
        ("Loyer moyen bas", f"{MIROIRMALL['estimated_rent_per_m2_low']} USD/m²/mois"),
        ("Loyer moyen haut", f"{MIROIRMALL['estimated_rent_per_m2_high']} USD/m²/mois"),
        ("Ouverture", MIROIRMALL["opening_date"]),
        ("Fréquentation cible", f"{MIROIRMALL['visitors_per_day_min']:,} - {MIROIRMALL['visitors_per_day_max']:,} /jour"),
    ]
    
    col = 1
    for label, value in hypotheses:
        worksheet.write(row, col, label, formats["table_header"])
        worksheet.write(row, col + 1, value, formats["highlight_gold"])
        col += 2
    row += 2
    
    # Revenue Projections Table
    worksheet.merge_range(row, 1, row, 10, f"{ICONS['money']} REVENUS LOCATIFS PROJETÉS (USD)", formats["header_section"])
    row += 1
    
    # Headers
    worksheet.write(row, 1, "Année", formats["table_header_dark"])
    worksheet.merge_range(row, 2, row, 3, f"{ICONS['warning']} Pessimiste", formats["highlight_warning"])
    worksheet.merge_range(row, 4, row, 5, f"{ICONS['star']} Réaliste", formats["highlight_gold"])
    worksheet.merge_range(row, 6, row, 7, f"{ICONS['check']} Optimiste", formats["highlight_success"])
    worksheet.merge_range(row, 8, row, 9, "Tx Occup. (Réal.)", formats["table_header_dark"])
    worksheet.write(row, 10, "Phase", formats["table_header_dark"])
    row += 1
    
    phases = ["Construction", "Ouverture", "Croissance", "Maturité"]
    
    for i, year in enumerate(PROJECTIONS["years"]):
        worksheet.write(row, 1, year, formats["cell_center"])
        worksheet.merge_range(row, 2, row, 3, 
                             format_currency(PROJECTIONS["scenario_pessimistic"]["annual_revenue_usd"][i]),
                             formats["cell_center"] if i == 0 else formats["highlight_warning"])
        worksheet.merge_range(row, 4, row, 5,
                             format_currency(PROJECTIONS["scenario_realistic"]["annual_revenue_usd"][i]),
                             formats["cell_center"] if i == 0 else formats["highlight_gold"])
        worksheet.merge_range(row, 6, row, 7,
                             format_currency(PROJECTIONS["scenario_optimistic"]["annual_revenue_usd"][i]),
                             formats["cell_center"] if i == 0 else formats["highlight_success"])
        worksheet.merge_range(row, 8, row, 9,
                             f"{int(PROJECTIONS['scenario_realistic']['occupancy_rate'][i]*100)}%",
                             formats["cell_center"])
        worksheet.write(row, 10, phases[i], formats["cell_center"])
        row += 1
    
    row += 1
    
    # Scenario Details
    worksheet.merge_range(row, 1, row, 10, f"{ICONS['chart']} DÉTAIL DES SCÉNARIOS", formats["header_section"])
    row += 1
    
    worksheet.write(row, 1, "Scénario", formats["table_header_dark"])
    worksheet.merge_range(row, 2, row, 3, "Taux Occupation 2027", formats["table_header_dark"])
    worksheet.merge_range(row, 4, row, 5, "Revenu Annuel 2027", formats["table_header_dark"])
    worksheet.merge_range(row, 6, row, 10, "Hypothèses", formats["table_header_dark"])
    row += 1
    
    scenarios_detail = [
        ("Pessimiste", "60%", format_currency(PROJECTIONS["scenario_pessimistic"]["annual_revenue_usd"][2]),
         "Loyers bas (20$/m²), remplissage lent, concurrence Luano"),
        ("Réaliste", "75%", format_currency(PROJECTIONS["scenario_realistic"]["annual_revenue_usd"][2]),
         "Loyers moyens (25$/m²), remplissage progressif, succès modéré"),
        ("Optimiste", "85%", format_currency(PROJECTIONS["scenario_optimistic"]["annual_revenue_usd"][2]),
         "Loyers premium (30$/m²), enseignes internationales, buzz"),
    ]
    
    for i, (scenario, taux, revenu, hypo) in enumerate(scenarios_detail):
        fmt = formats["cell_alt"] if i % 2 else formats["cell_normal"]
        fmts = [formats["highlight_warning"], formats["highlight_gold"], formats["highlight_success"]]
        worksheet.write(row, 1, scenario, fmts[i])
        worksheet.merge_range(row, 2, row, 3, taux, formats["cell_center"])
        worksheet.merge_range(row, 4, row, 5, revenu, fmts[i])
        worksheet.merge_range(row, 6, row, 10, hypo, fmt)
        row += 1
    
    row += 1
    
    # Break-even analysis
    worksheet.merge_range(row, 1, row, 10, f"{ICONS['target']} ANALYSE POINT MORT", formats["header_section"])
    row += 1
    
    breakeven = [
        ("Coûts fixes estimés/an", "$1.5M - $2M", "Gestion, maintenance, marketing, personnel"),
        ("Point mort (Pessimiste)", "~50% occupation", "Atteint fin 2027"),
        ("Point mort (Réaliste)", "~40% occupation", "Atteint mi-2027"),
        ("Marge nette visée 2028", "35-45%", "Après stabilisation"),
    ]
    
    for i, (indicateur, valeur, note) in enumerate(breakeven):
        fmt = formats["cell_alt"] if i % 2 else formats["cell_normal"]
        worksheet.write(row, 1, indicateur, formats["table_header"])
        worksheet.merge_range(row, 2, row, 4, valeur, formats["highlight_gold"])
        worksheet.merge_range(row, 5, row, 10, note, fmt)
        row += 1
    
    row += 2
    
    # Insert chart if exists
    try:
        revenue_chart_path = CHARTS_DIR / "revenue_projections_3d.png"
        if revenue_chart_path.exists():
            worksheet.insert_image(row, 1, str(revenue_chart_path), 
                                  {'x_scale': 0.5, 'y_scale': 0.5})
    except Exception as e:
        print(f"Note: Could not insert chart: {e}")
    
    worksheet.freeze_panes(3, 0)
    print("✅ Projections sheet generated")
