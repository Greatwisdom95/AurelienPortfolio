"""
MiroirMall Sheet Generator - LUXURY DESIGN
"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from config.settings import MIROIRMALL, IMMOROSE
from config.styles import ICONS, add_navigation_bar
from utils.formatter import format_number, format_currency


def generate_miroirmall_sheet(workbook, formats: dict, data: dict) -> None:
    """Generate MiroirMall project sheet with luxury design"""
    
    worksheet = workbook.add_worksheet("🏬 MiroirMall")
    
    worksheet.set_column('A:A', 2)
    worksheet.set_column('B:B', 28)
    worksheet.set_column('C:H', 16)
    
    row = add_navigation_bar(worksheet, formats, current_sheet_index=2, start_row=1)
    
    # Header
    worksheet.set_row(row, 45)
    worksheet.merge_range(row, 1, row, 7, f"{ICONS['mall']} MIROIR MALL", formats["header_main"])
    row += 1
    worksheet.merge_range(row, 1, row, 7, MIROIRMALL["tagline"], formats["header_sub"])
    row += 2
    
    # Project Overview
    worksheet.merge_range(row, 1, row, 7, f"{ICONS['doc']} FICHE PROJET", formats["header_section"])
    row += 1
    
    overview = [
        ("Nom du projet", MIROIRMALL["name"]),
        ("Promoteur", f"{ICONS['building']} {IMMOROSE['name']}"),
        ("Localisation", f"{ICONS['pin']} {MIROIRMALL['location']}"),
        ("Province", MIROIRMALL["province"]),
        ("Statut", f"{ICONS['rocket']} En construction"),
        ("Date d'ouverture", f"{ICONS['calendar']} {MIROIRMALL['opening_date']}"),
    ]
    
    for i, (label, value) in enumerate(overview):
        fmt = formats["cell_alt"] if i % 2 else formats["cell_normal"]
        worksheet.write(row, 1, label, formats["table_header"])
        worksheet.merge_range(row, 2, row, 7, value, fmt)
        row += 1
    
    row += 1
    
    # Technical Specs
    worksheet.merge_range(row, 1, row, 7, f"{ICONS['chart']} SPÉCIFICATIONS TECHNIQUES", formats["header_section"])
    row += 1
    
    worksheet.write(row, 1, "Indicateur", formats["table_header_dark"])
    worksheet.write(row, 2, "Valeur", formats["table_header_dark"])
    worksheet.write(row, 3, "Unité", formats["table_header_dark"])
    worksheet.merge_range(row, 4, row, 7, "Notes", formats["table_header_dark"])
    row += 1
    
    specs = [
        ("Surface totale", MIROIRMALL["total_area_m2"], "m²", "Bâtiment R+2"),
        ("Surface louable (GLA)", MIROIRMALL["gla_m2"], "m²", "Espaces commerciaux"),
        ("Terrain", MIROIRMALL["terrain_ha"], "hectares", f"{ICONS['pin']} Bord lac Kipopo"),
        ("Enseignes prévues", MIROIRMALL["nb_stores"], "boutiques", "Locales et internationales"),
        ("Places de parking", MIROIRMALL["parking_spaces"], "places", "Parking visiteurs"),
        ("Niveaux", MIROIRMALL["nb_levels"], "étages", "R+2"),
        ("Salles de cinéma", MIROIRMALL["cinemas"], "salles", "Multiplex moderne"),
    ]
    
    for i, (ind, val, unite, notes) in enumerate(specs):
        fmt = formats["cell_alt"] if i % 2 else formats["cell_normal"]
        worksheet.write(row, 1, ind, fmt)
        worksheet.write(row, 2, val, formats["cell_number"])
        worksheet.write(row, 3, unite, formats["cell_center"])
        worksheet.merge_range(row, 4, row, 7, notes, fmt)
        row += 1
    
    row += 1
    
    # Entertainment
    worksheet.merge_range(row, 1, row, 7, f"{ICONS['fire']} OFFRE LOISIRS & DIVERTISSEMENT", formats["header_section"])
    row += 1
    
    entertainment = [
        ("Cinéma multiplex", MIROIRMALL["cinemas"], f"{MIROIRMALL['cinemas']} salles modernes"),
        ("Bowling", MIROIRMALL["bowling"], "Pistes dernière génération"),
        ("Mini-karting", MIROIRMALL["mini_karting"], "Circuit intérieur sécurisé"),
        ("Arcade / Gaming", MIROIRMALL["arcade"], "Jeux vidéo et billards"),
        ("Espace enfants", MIROIRMALL["kids_area"], "Aire de jeux sécurisée"),
        ("Carrousel", MIROIRMALL["carousel"], "Jardins extérieurs"),
        ("Amphithéâtre", MIROIRMALL["amphitheater"], "Événements & concerts"),
    ]
    
    worksheet.write(row, 1, "Équipement", formats["table_header_dark"])
    worksheet.write(row, 2, "Disponible", formats["table_header_dark"])
    worksheet.merge_range(row, 3, row, 7, "Détails", formats["table_header_dark"])
    row += 1
    
    for i, (equip, dispo, details) in enumerate(entertainment):
        fmt = formats["cell_alt"] if i % 2 else formats["cell_normal"]
        worksheet.write(row, 1, equip, fmt)
        status = f"{ICONS['check']} Oui" if dispo else f"{ICONS['cross']} Non"
        worksheet.write(row, 2, status, formats["highlight_success"] if dispo else formats["cell_center"])
        worksheet.merge_range(row, 3, row, 7, details, fmt)
        row += 1
    
    row += 1
    
    # Economic Impact
    worksheet.merge_range(row, 1, row, 7, f"{ICONS['money']} IMPACT ÉCONOMIQUE & SOCIAL", formats["header_section"])
    row += 1
    
    impact = [
        ("Emplois créés", f"{MIROIRMALL['jobs_direct_indirect']:,}", "directs et indirects"),
        ("Fréquentation min/jour", f"{MIROIRMALL['visitors_per_day_min']:,}", "visiteurs attendus"),
        ("Fréquentation max/jour", f"{MIROIRMALL['visitors_per_day_max']:,}", "pic week-end"),
        ("Fréquentation mensuelle", f"{MIROIRMALL['visitors_per_day_max'] * 30:,}", "estimation haute"),
        ("Loyer estimé (bas)", f"{MIROIRMALL['estimated_rent_per_m2_low']} USD/m²/mois", "petites surfaces"),
        ("Loyer estimé (haut)", f"{MIROIRMALL['estimated_rent_per_m2_high']} USD/m²/mois", "emplacements premium"),
        ("Revenus annuels estimés", format_currency(MIROIRMALL['estimated_annual_revenue_low']), 
         f"à {format_currency(MIROIRMALL['estimated_annual_revenue_high'])}"),
    ]
    
    worksheet.write(row, 1, "Indicateur", formats["table_header_dark"])
    worksheet.write(row, 2, "Valeur", formats["table_header_dark"])
    worksheet.merge_range(row, 3, row, 7, "Notes", formats["table_header_dark"])
    row += 1
    
    for i, (ind, val, notes) in enumerate(impact):
        fmt = formats["cell_alt"] if i % 2 else formats["cell_normal"]
        worksheet.write(row, 1, ind, fmt)
        worksheet.write(row, 2, val, formats["highlight_gold"] if "Revenus" in ind else formats["cell_center"])
        worksheet.merge_range(row, 3, row, 7, notes, fmt)
        row += 1
    
    row += 1
    
    # Contacts
    worksheet.merge_range(row, 1, row, 7, f"{ICONS['handshake']} CONTACTS PROJET", formats["header_section"])
    row += 1
    
    contacts = [
        ("Téléphone MiroirMall", MIROIRMALL["phone"]),
        ("Email commercial", MIROIRMALL["email"]),
        ("Instagram", MIROIRMALL["instagram"]),
        ("Sales Manager", f"{ICONS['star']} {IMMOROSE['sales_manager']}"),
    ]
    
    for i, (label, value) in enumerate(contacts):
        fmt = formats["cell_alt"] if i % 2 else formats["cell_normal"]
        worksheet.write(row, 1, label, formats["table_header"])
        worksheet.merge_range(row, 2, row, 7, value, fmt)
        row += 1
    
    worksheet.freeze_panes(3, 0)
    print("✅ MiroirMall sheet generated")
