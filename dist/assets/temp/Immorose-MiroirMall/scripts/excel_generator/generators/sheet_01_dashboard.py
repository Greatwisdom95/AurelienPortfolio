"""
Dashboard Sheet Generator - LUXURY DESIGN
Creates the main dashboard with KPIs, charts and summary
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from config.settings import IMMOROSE, MIROIRMALL, PROJECTIONS, ECONOMIC, CHARTS_DIR
from config.styles import get_formats, COLORS, ICONS, add_navigation_bar
from charts import create_revenue_projection_3d, create_3d_pie_chart
from utils.formatter import format_currency, format_number


def generate_dashboard(workbook, formats: dict, data: dict) -> None:
    """Generate the Dashboard sheet with luxury design"""
    
    worksheet = workbook.add_worksheet("🎯 DASHBOARD")
    
    # =========================================================================
    # SHEET SETUP - Black background feel
    # =========================================================================
    worksheet.set_column('A:A', 2)    # Left margin
    worksheet.set_column('B:M', 13)   # Content columns
    worksheet.set_column('N:N', 2)    # Right margin
    worksheet.set_row(0, 5)           # Top margin
    
    # =========================================================================
    # NAVIGATION BAR
    # =========================================================================
    row = add_navigation_bar(worksheet, formats, current_sheet_index=0, start_row=1)
    
    # =========================================================================
    # HEADER - LUXURY TITLE
    # =========================================================================
    worksheet.set_row(row, 45)
    worksheet.merge_range(row, 1, row, 12, 
                         f"{ICONS['crown']} IMMOROSE {ICONS['diamond']}", 
                         formats["header_main"])
    row += 1
    
    worksheet.set_row(row, 25)
    worksheet.merge_range(row, 1, row, 12, 
                         "RAPPORT D'ACTIVITÉ 2025 | MiroirMall - Le plus grand centre commercial de RDC",
                         formats["header_sub"])
    row += 2
    
    # =========================================================================
    # DISCLAIMER - PORTFOLIO DEMONSTRATION
    # =========================================================================
    disclaimer_format = workbook.add_format({
        "font_size": 9,
        "font_color": COLORS["gold_light"],
        "bg_color": COLORS["charcoal"],
        "align": "center",
        "valign": "vcenter",
        "italic": True,
        "text_wrap": True,
        "border": 1,
        "border_color": COLORS["gold"],
    })
    
    disclaimer_text = (
        "⚠️ DÉMONSTRATION PORTFOLIO | Ce rapport illustre mes compétences en Data Intelligence & Excel avancé. "
        "Les projections financières présentées sont des estimations basées sur des sources publiques. "
        "ImmoRose SARL détient les données réelles de son projet MiroirMall, dont la construction est bien avancée "
        "pour une ouverture fin 2026. Avec accès aux données internes, cette analyse peut être optimisée "
        "pour refléter la réalité du projet. | Contact: sales@immorose.com"
    )
    
    worksheet.set_row(row, 35)
    worksheet.merge_range(row, 1, row, 12, disclaimer_text, disclaimer_format)
    row += 2
    
    # =========================================================================
    # KPI BOXES - LUXURY STYLE
    # =========================================================================
    kpis = [
        (format_number(MIROIRMALL["gla_m2"]), "m² GLA", ICONS["building"]),
        (str(MIROIRMALL["nb_stores"]), "Enseignes", ICONS["mall"]),
        (format_number(MIROIRMALL["jobs_direct_indirect"]), "Emplois", ICONS["team"]),
        (str(MIROIRMALL["parking_spaces"]), "Parkings", ICONS["pin"]),
        (f"{MIROIRMALL['visitors_per_day_max']:,}", "Visiteurs/jour", ICONS["fire"]),
        (MIROIRMALL["opening_date"], "Ouverture", ICONS["rocket"]),
    ]
    
    kpi_row = row
    col = 1
    
    for value, label, icon in kpis:
        # KPI Value (merged cells)
        worksheet.set_row(kpi_row, 40)
        worksheet.set_row(kpi_row + 1, 40)
        worksheet.merge_range(kpi_row, col, kpi_row + 1, col + 1, 
                             f"{icon}\n{value}", formats["kpi_value"])
        # KPI Label
        worksheet.set_row(kpi_row + 2, 22)
        worksheet.merge_range(kpi_row + 2, col, kpi_row + 2, col + 1,
                             label, formats["kpi_label"])
        col += 2
    
    row = kpi_row + 4
    
    # =========================================================================
    # SECTION: COMPANY INFO
    # =========================================================================
    worksheet.merge_range(row, 1, row, 6, 
                         f"{ICONS['briefcase']} INFORMATIONS ENTREPRISE", 
                         formats["header_section"])
    worksheet.merge_range(row, 7, row, 12, 
                         f"{ICONS['chart']} DONNÉES CLÉS PROJET",
                         formats["header_section"])
    row += 1
    
    # Left column - Company info
    company_info = [
        ("Siège", f"{IMMOROSE['address']}"),
        ("Adresse", f"{IMMOROSE['street']}, {IMMOROSE['city']}"),
        ("CEO", f"{ICONS['crown']} {IMMOROSE['ceo']}"),
        ("RCCM", IMMOROSE["rccm"]),
        ("N° Fiscal", IMMOROSE["tax_id"]),
        ("Téléphone", IMMOROSE["phone_main"]),
        ("Email", IMMOROSE["email_sales"]),
        ("Groupe", IMMOROSE["parent_group"]),
    ]
    
    info_row = row
    for i, (label, value) in enumerate(company_info):
        fmt = formats["cell_alt"] if i % 2 else formats["cell_normal"]
        worksheet.write(info_row, 1, label, formats["table_header"])
        worksheet.merge_range(info_row, 2, info_row, 6, value, fmt)
        info_row += 1
    
    # Right column - Project data
    project_info = [
        ("Localisation", f"{ICONS['pin']} {MIROIRMALL['location']}"),
        ("Province", MIROIRMALL["province"]),
        ("Surface totale", f"{MIROIRMALL['total_area_m2']:,} m²"),
        ("Surface louable", f"{MIROIRMALL['gla_m2']:,} m² GLA"),
        ("Contact MiroirMall", MIROIRMALL["phone"]),
        ("Email commercial", MIROIRMALL["email"]),
        ("Instagram", MIROIRMALL["instagram"]),
        ("Date ouverture", f"{ICONS['calendar']} {MIROIRMALL['opening_date']}"),
    ]
    
    proj_row = row
    for i, (label, value) in enumerate(project_info):
        fmt = formats["cell_alt"] if i % 2 else formats["cell_normal"]
        worksheet.write(proj_row, 7, label, formats["table_header"])
        worksheet.merge_range(proj_row, 8, proj_row, 12, value, fmt)
        proj_row += 1
    
    row = max(info_row, proj_row) + 1
    
    # =========================================================================
    # SECTION: PROJECTIONS FINANCIÈRES
    # =========================================================================
    worksheet.merge_range(row, 1, row, 12, 
                         f"{ICONS['money']} PROJECTIONS FINANCIÈRES 2025-2028",
                         formats["header_section"])
    row += 1
    
    # Table headers
    headers = ["Année", "Pessimiste", "Réaliste", "Optimiste", "Tx Occupation (Réal.)"]
    for i, h in enumerate(headers):
        worksheet.write(row, 1 + i * 2, h, formats["table_header_dark"])
        if i < 4:
            worksheet.write(row, 2 + i * 2, "", formats["table_header_dark"])
    row += 1
    
    # Data rows
    for i, year in enumerate(PROJECTIONS["years"]):
        worksheet.merge_range(row, 1, row, 2, str(year), formats["cell_center"])
        worksheet.merge_range(row, 3, row, 4, 
                             format_currency(PROJECTIONS["scenario_pessimistic"]["annual_revenue_usd"][i]),
                             formats["cell_center"] if i == 0 else formats["highlight_warning"])
        worksheet.merge_range(row, 5, row, 6,
                             format_currency(PROJECTIONS["scenario_realistic"]["annual_revenue_usd"][i]),
                             formats["cell_center"] if i == 0 else formats["highlight_gold"])
        worksheet.merge_range(row, 7, row, 8,
                             format_currency(PROJECTIONS["scenario_optimistic"]["annual_revenue_usd"][i]),
                             formats["cell_center"] if i == 0 else formats["highlight_success"])
        worksheet.merge_range(row, 9, row, 10,
                             f"{int(PROJECTIONS['scenario_realistic']['occupancy_rate'][i]*100)}%",
                             formats["cell_center"])
        row += 1
    
    row += 1
    
    # =========================================================================
    # SECTION: ECONOMIC CONTEXT
    # =========================================================================
    worksheet.merge_range(row, 1, row, 12, 
                         f"{ICONS['graph_up']} CONTEXTE ÉCONOMIQUE RDC 2024-2025",
                         formats["header_section_dark"])
    row += 1
    
    econ_headers = ["PIB 2024", "PIB 2025", "Croissance", "Population L'shi", "Classe moyenne"]
    econ_values = [
        f"${ECONOMIC['gdp_rdc_2024_musd']:,}M",
        f"${ECONOMIC['gdp_rdc_2025_musd']:,}M",
        f"{ECONOMIC['growth_rate_2024']*100:.1f}%",
        f"{ECONOMIC['population_lubumbashi']:,}",
        f"{ECONOMIC['middle_class_percent']*100:.0f}%",
    ]
    
    for i, (h, v) in enumerate(zip(econ_headers, econ_values)):
        worksheet.write(row, 1 + i * 2, h, formats["table_header"])
        worksheet.write(row, 2 + i * 2, v, formats["highlight_gold"])
    
    row += 3
    
    # =========================================================================
    # CHARTS INSERTION
    # =========================================================================
    try:
        revenue_chart_path = CHARTS_DIR / "revenue_projections_3d.png"
        scenarios = {
            "Pessimiste": PROJECTIONS["scenario_pessimistic"]["annual_revenue_usd"],
            "Réaliste": PROJECTIONS["scenario_realistic"]["annual_revenue_usd"],
            "Optimiste": PROJECTIONS["scenario_optimistic"]["annual_revenue_usd"],
        }
        create_revenue_projection_3d(PROJECTIONS["years"], scenarios, str(revenue_chart_path))
        
        if revenue_chart_path.exists():
            worksheet.insert_image(row, 1, str(revenue_chart_path), 
                                  {'x_scale': 0.45, 'y_scale': 0.45})
    except Exception as e:
        print(f"Note: Chart generation skipped: {e}")
    
    row += 18
    
    # =========================================================================
    # FOOTER
    # =========================================================================
    worksheet.merge_range(row, 1, row, 12, 
                         f"© 2025 ImmoRose SARL | Contact: {IMMOROSE['email_sales']} | {IMMOROSE['phone_main']}",
                         formats["footer"])
    
    # Freeze navigation bar
    worksheet.freeze_panes(3, 0)
    
    print("✅ Dashboard sheet generated (luxury design)")
