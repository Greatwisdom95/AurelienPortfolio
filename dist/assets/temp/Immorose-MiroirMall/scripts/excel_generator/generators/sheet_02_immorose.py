"""
ImmoRose Profile Sheet Generator - LUXURY DESIGN
"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from config.settings import IMMOROSE
from config.styles import ICONS, add_navigation_bar


def generate_immorose_sheet(workbook, formats: dict, data: dict) -> None:
    """Generate ImmoRose company profile sheet"""
    
    worksheet = workbook.add_worksheet("🏢 ImmoRose")
    
    worksheet.set_column('A:A', 2)
    worksheet.set_column('B:B', 25)
    worksheet.set_column('C:H', 18)
    
    row = add_navigation_bar(worksheet, formats, current_sheet_index=1, start_row=1)
    
    # Header
    worksheet.set_row(row, 40)
    worksheet.merge_range(row, 1, row, 7, f"{ICONS['building']} IMMOROSE SARL", formats["header_main"])
    row += 1
    worksheet.merge_range(row, 1, row, 7, "Premier promoteur immobilier haut de gamme en RDC", formats["header_sub"])
    row += 2
    
    # Company Overview
    worksheet.merge_range(row, 1, row, 7, f"{ICONS['briefcase']} PROFIL ENTREPRISE", formats["header_section"])
    row += 1
    
    profile = [
        ("Raison sociale", IMMOROSE["name"]),
        ("Fondation", str(IMMOROSE["founded"])),
        ("Groupe", IMMOROSE["parent_group"]),
        ("CEO", f"{ICONS['crown']} {IMMOROSE['ceo']}"),
        ("Directrice Commerciale", f"{ICONS['star']} {IMMOROSE['sales_manager']}"),
        ("Positionnement", "Immobilier de luxe et centres commerciaux"),
    ]
    
    for i, (label, value) in enumerate(profile):
        fmt = formats["cell_alt"] if i % 2 else formats["cell_normal"]
        worksheet.write(row, 1, label, formats["table_header"])
        worksheet.merge_range(row, 2, row, 7, value, fmt)
        row += 1
    
    row += 1
    
    # Legal Info
    worksheet.merge_range(row, 1, row, 7, f"{ICONS['doc']} INFORMATIONS LÉGALES", formats["header_section"])
    row += 1
    
    legal = [
        ("RCCM", IMMOROSE["rccm"]),
        ("Identification Nationale", IMMOROSE["id_nat"]),
        ("Numéro Fiscal", IMMOROSE["tax_id"]),
        ("Siège social", f"{IMMOROSE['address']}, {IMMOROSE['street']}"),
        ("Ville", f"{IMMOROSE['city']}, {IMMOROSE['country']}"),
    ]
    
    for i, (label, value) in enumerate(legal):
        fmt = formats["cell_alt"] if i % 2 else formats["cell_normal"]
        worksheet.write(row, 1, label, formats["table_header"])
        worksheet.merge_range(row, 2, row, 7, value, fmt)
        row += 1
    
    row += 1
    
    # Contacts
    worksheet.merge_range(row, 1, row, 7, f"{ICONS['handshake']} CONTACTS", formats["header_section"])
    row += 1
    
    contacts = [
        ("Téléphone principal", IMMOROSE["phone_main"]),
        ("Email info", IMMOROSE["email_info"]),
        ("Email commercial", IMMOROSE["email_sales"]),
        ("Email RH", IMMOROSE["email_hr"]),
        ("Téléphone RH", IMMOROSE["phone_hr"]),
        ("Site web", IMMOROSE["website"]),
    ]
    
    for i, (label, value) in enumerate(contacts):
        fmt = formats["cell_alt"] if i % 2 else formats["cell_normal"]
        worksheet.write(row, 1, label, formats["table_header"])
        worksheet.merge_range(row, 2, row, 7, value, fmt)
        row += 1
    
    row += 1
    
    # Social Media
    worksheet.merge_range(row, 1, row, 7, f"{ICONS['link']} RÉSEAUX SOCIAUX", formats["header_section"])
    row += 1
    
    social = [
        ("LinkedIn", f"IMMOROSE RDC - {IMMOROSE['linkedin_followers']} abonnés"),
        ("Instagram", IMMOROSE["instagram_handle"]),
        ("Facebook", IMMOROSE["facebook"]),
    ]
    
    for i, (label, value) in enumerate(social):
        fmt = formats["cell_alt"] if i % 2 else formats["cell_normal"]
        worksheet.write(row, 1, label, formats["table_header"])
        worksheet.merge_range(row, 2, row, 7, value, fmt)
        row += 1
    
    row += 1
    
    # Projects
    worksheet.merge_range(row, 1, row, 7, f"{ICONS['rocket']} PROJETS RÉALISÉS & EN COURS", formats["header_section"])
    row += 1
    
    worksheet.write(row, 1, "Projet", formats["table_header_dark"])
    worksheet.write(row, 2, "Type", formats["table_header_dark"])
    worksheet.write(row, 3, "Localisation", formats["table_header_dark"])
    worksheet.merge_range(row, 4, row, 5, "Statut", formats["table_header_dark"])
    worksheet.merge_range(row, 6, row, 7, "Année", formats["table_header_dark"])
    row += 1
    
    projects = [
        ("9 Carats", "Villas de luxe (9)", "Kinshasa", "Livré/En cours", "2024"),
        ("Waterfront Villas", "Villas (~20)", "Kinshasa", "En développement", "2025"),
        ("MiroirMall", "Centre commercial", "Lubumbashi", "En construction", "2026"),
        ("Mémorial FONAREV", "Institutionnel", "Kinshasa", "Partenariat", "2024"),
    ]
    
    for i, (nom, typ, loc, statut, annee) in enumerate(projects):
        fmt = formats["cell_alt"] if i % 2 else formats["cell_normal"]
        worksheet.write(row, 1, nom, fmt)
        worksheet.write(row, 2, typ, fmt)
        worksheet.write(row, 3, loc, fmt)
        worksheet.merge_range(row, 4, row, 5, statut, 
                             formats["highlight_success"] if "Livré" in statut else formats["highlight_gold"])
        worksheet.merge_range(row, 6, row, 7, annee, formats["cell_center"])
        row += 1
    
    worksheet.freeze_panes(3, 0)
    print("✅ ImmoRose sheet generated")
