"""
Sources Sheet Generator - LUXURY DESIGN
All reference URLs and sources
"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from config.settings import IMMOROSE
from config.styles import ICONS, add_navigation_bar


def generate_sources_sheet(workbook, formats: dict, data: dict) -> None:
    """Generate Sources and references sheet"""
    
    worksheet = workbook.add_worksheet("🔗 Sources")
    
    worksheet.set_column('A:A', 2)
    worksheet.set_column('B:B', 25)
    worksheet.set_column('C:C', 50)
    worksheet.set_column('D:H', 20)
    
    row = add_navigation_bar(worksheet, formats, current_sheet_index=9, start_row=1)
    
    # Header
    worksheet.set_row(row, 40)
    worksheet.merge_range(row, 1, row, 7, f"{ICONS['link']} SOURCES & RÉFÉRENCES", formats["header_main"])
    row += 1
    worksheet.merge_range(row, 1, row, 7, "Toutes les sources utilisées pour ce rapport", formats["header_sub"])
    row += 2
    
    # Official Sources
    worksheet.merge_range(row, 1, row, 7, f"{ICONS['check']} SOURCES OFFICIELLES IMMOROSE", formats["header_section"])
    row += 1
    
    official = [
        ("Site officiel", "immorose.com", "Informations projet, contact"),
        ("LinkedIn", "linkedin.com/company/immorose-rdc", "Actualités, recrutements"),
        ("Instagram @immo.rose", "instagram.com/immo.rose", "Visuels, événements"),
        ("Instagram @miroirmall", "instagram.com/miroirmall", "Projet MiroirMall"),
        ("Facebook ImmoRose", "facebook.com/immorose", "Communication grand public"),
    ]
    
    worksheet.write(row, 1, "Source", formats["table_header_dark"])
    worksheet.write(row, 2, "URL", formats["table_header_dark"])
    worksheet.merge_range(row, 3, row, 7, "Type d'information", formats["table_header_dark"])
    row += 1
    
    for i, (nom, url, info) in enumerate(official):
        fmt = formats["cell_alt"] if i % 2 else formats["cell_normal"]
        worksheet.write(row, 1, nom, fmt)
        worksheet.write_url(row, 2, f"https://{url}", formats["link"], url)
        worksheet.merge_range(row, 3, row, 7, info, fmt)
        row += 1
    
    row += 1
    
    # Economic Sources
    worksheet.merge_range(row, 1, row, 7, f"{ICONS['chart']} SOURCES ÉCONOMIQUES", formats["header_section"])
    row += 1
    
    economic = [
        ("Knight Frank", "content.knightfrank.com", "Prix immobilier Afrique"),
        ("FMI / World Bank", "worldbank.org", "Données PIB, croissance"),
        ("Reuters", "reuters.com", "Actualités économiques RDC"),
        ("Makanisi", "makanisi.com", "Analyses économiques locales"),
        ("Le Moci", "lemoci.com", "Commerce international"),
        ("Coface", "coface.com", "Risques pays"),
    ]
    
    worksheet.write(row, 1, "Source", formats["table_header_dark"])
    worksheet.write(row, 2, "URL", formats["table_header_dark"])
    worksheet.merge_range(row, 3, row, 7, "Type d'information", formats["table_header_dark"])
    row += 1
    
    for i, (nom, url, info) in enumerate(economic):
        fmt = formats["cell_alt"] if i % 2 else formats["cell_normal"]
        worksheet.write(row, 1, nom, fmt)
        worksheet.write_url(row, 2, f"https://{url}", formats["link"], url)
        worksheet.merge_range(row, 3, row, 7, info, fmt)
        row += 1
    
    row += 1
    
    # Competitor Sources
    worksheet.merge_range(row, 1, row, 7, f"{ICONS['building']} SOURCES CONCURRENCE", formats["header_section"])
    row += 1
    
    competitors = [
        ("Luano City", "luanocity.com", "Mall concurrent Lubumbashi"),
        ("Shoprite Holdings", "shopriteholdings.co.za", "Rapports annuels (case study)"),
        ("Macrotrends", "macrotrends.net", "Données démographiques"),
    ]
    
    worksheet.write(row, 1, "Source", formats["table_header_dark"])
    worksheet.write(row, 2, "URL", formats["table_header_dark"])
    worksheet.merge_range(row, 3, row, 7, "Type d'information", formats["table_header_dark"])
    row += 1
    
    for i, (nom, url, info) in enumerate(competitors):
        fmt = formats["cell_alt"] if i % 2 else formats["cell_normal"]
        worksheet.write(row, 1, nom, fmt)
        worksheet.write_url(row, 2, f"https://{url}", formats["link"], url)
        worksheet.merge_range(row, 3, row, 7, info, fmt)
        row += 1
    
    row += 1
    
    # CSV Data Files
    worksheet.merge_range(row, 1, row, 7, f"{ICONS['folder']} FICHIERS DE DONNÉES", formats["header_section"])
    row += 1
    
    csv_files = [
        ("immorose_database.csv", "Base de données ImmoRose", "43 entrées"),
        ("economic_data_rdc.csv", "Données économiques RDC", "23 indicateurs"),
        ("real_estate_prices.csv", "Prix immobilier", "18 entrées"),
        ("prospects_miroirmall.csv", "Prospects clients", "33 prospects"),
        ("competitors_analysis.csv", "Analyse concurrence", "6 projets"),
        ("shoprite_case_study.csv", "Case study Shoprite", "14 facteurs"),
        ("demographics_lubumbashi.csv", "Démographie Lubumbashi", "10 données"),
    ]
    
    worksheet.write(row, 1, "Fichier", formats["table_header_dark"])
    worksheet.write(row, 2, "Contenu", formats["table_header_dark"])
    worksheet.merge_range(row, 3, row, 7, "Volume", formats["table_header_dark"])
    row += 1
    
    for i, (fichier, contenu, volume) in enumerate(csv_files):
        fmt = formats["cell_alt"] if i % 2 else formats["cell_normal"]
        worksheet.write(row, 1, fichier, fmt)
        worksheet.write(row, 2, contenu, fmt)
        worksheet.merge_range(row, 3, row, 7, volume, formats["highlight_gold"])
        row += 1
    
    row += 2
    
    # Credits
    worksheet.merge_range(row, 1, row, 7, 
                         f"© 2025 - Rapport généré via Python | Contact: {IMMOROSE['email_sales']}",
                         formats["footer"])
    
    worksheet.freeze_panes(3, 0)
    print("✅ Sources sheet generated")
