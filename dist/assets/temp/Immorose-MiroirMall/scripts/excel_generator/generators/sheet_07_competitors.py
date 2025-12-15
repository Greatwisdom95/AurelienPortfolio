"""
Competitors Sheet Generator - LUXURY DESIGN
Analysis of competing projects
"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from config.styles import ICONS, add_navigation_bar
from utils.data_loader import load_csv


def generate_competitors_sheet(workbook, formats: dict, data: dict) -> None:
    """Generate Competitors analysis sheet"""
    
    worksheet = workbook.add_worksheet("⚔️ Concurrence")
    
    worksheet.set_column('A:A', 2)
    worksheet.set_column('B:B', 22)
    worksheet.set_column('C:H', 18)
    
    row = add_navigation_bar(worksheet, formats, current_sheet_index=6, start_row=1)
    
    # Header
    worksheet.set_row(row, 40)
    worksheet.merge_range(row, 1, row, 7, f"{ICONS['trophy']} ANALYSE CONCURRENCE", formats["header_main"])
    row += 1
    worksheet.merge_range(row, 1, row, 7, "Projets concurrents et positionnement MiroirMall", formats["header_sub"])
    row += 2
    
    # Main Competitor: Luano City
    worksheet.merge_range(row, 1, row, 7, f"{ICONS['building']} CONCURRENT PRINCIPAL : LUANO CITY", formats["header_section"])
    row += 1
    
    luano_data = [
        ("Projet", "Mall of Lubumbashi @ Luano City"),
        ("Localisation", "Périphérie aéroport Lubumbashi"),
        ("Surface GLA", "4,942 m² (vs 15,700 m² MiroirMall)"),
        ("Nombre boutiques", "27 unités (vs 100 MiroirMall)"),
        ("Parking", "~470 places"),
        ("Ouverture prévue", "Début 2026"),
        ("Positionnement", "Résidentiel haut de gamme / Gated community"),
        ("Cible", "Expatriés, communauté aisée"),
    ]
    
    for i, (label, value) in enumerate(luano_data):
        fmt = formats["cell_alt"] if i % 2 else formats["cell_normal"]
        worksheet.write(row, 1, label, formats["table_header"])
        worksheet.merge_range(row, 2, row, 7, value, fmt)
        row += 1
    
    row += 1
    
    # SWOT Analysis
    worksheet.merge_range(row, 1, row, 7, f"{ICONS['chart']} ANALYSE SWOT - MIROIRMALL vs CONCURRENCE", formats["header_section"])
    row += 1
    
    # Headers
    worksheet.merge_range(row, 1, row, 3, f"{ICONS['check']} FORCES MiroirMall", formats["highlight_success"])
    worksheet.merge_range(row, 4, row, 7, f"{ICONS['warning']} FAIBLESSES MiroirMall", formats["highlight_warning"])
    row += 1
    
    strengths = [
        "Localisation centre-ville (Kipopo)",
        "Surface 3x plus grande (15,700 m²)",
        "100 enseignes vs 27",
        "Offre loisirs complète (ciné, bowling)",
        "Premier vrai mall moderne en RDC",
    ]
    
    weaknesses = [
        "Promoteur moins établi que Luano",
        "Pas de résidentiel intégré",
        "Dépendance au succès commercial",
        "Risque construction (délais RDC)",
        "Financement non public",
    ]
    
    for i in range(max(len(strengths), len(weaknesses))):
        s = strengths[i] if i < len(strengths) else ""
        w = weaknesses[i] if i < len(weaknesses) else ""
        worksheet.merge_range(row, 1, row, 3, f"• {s}" if s else "", formats["cell_normal"])
        worksheet.merge_range(row, 4, row, 7, f"• {w}" if w else "", formats["cell_normal"])
        row += 1
    
    row += 1
    
    # Opportunities vs Threats
    worksheet.merge_range(row, 1, row, 3, f"{ICONS['rocket']} OPPORTUNITÉS", formats["highlight_gold"])
    worksheet.merge_range(row, 4, row, 7, f"{ICONS['fire']} MENACES", formats["highlight_danger"])
    row += 1
    
    opportunities = [
        "Marché quasi vierge à Lubumbashi",
        "Secteur minier = pouvoir d'achat",
        "Demande consommateurs locaux forte",
        "Marques internationales sans présence",
        "15K visiteurs/jour potentiels",
    ]
    
    threats = [
        "Luano City ouvre aussi en 2026",
        "City Mall Kinshasa (32,000 m²)",
        "Instabilité économique RDC",
        "Shoprite a quitté (échec retail)",
        "Inflation et change volatil",
    ]
    
    for i in range(max(len(opportunities), len(threats))):
        o = opportunities[i] if i < len(opportunities) else ""
        t = threats[i] if i < len(threats) else ""
        worksheet.merge_range(row, 1, row, 3, f"• {o}" if o else "", formats["cell_normal"])
        worksheet.merge_range(row, 4, row, 7, f"• {t}" if t else "", formats["cell_normal"])
        row += 1
    
    row += 1
    
    # Other competitors
    worksheet.merge_range(row, 1, row, 7, f"{ICONS['building']} AUTRES PROJETS À SURVEILLER", formats["header_section"])
    row += 1
    
    others = [
        ("City Mall Kinshasa", "32,000 m²", "Kinshasa Gombe", "En projet", "Conimmo"),
        ("K Galerie", "Petit", "Lubumbashi", "Existant", "Local"),
        ("Kiswishi New City", "1000 ha", "Lubumbashi périph.", "Planifié", "Développeur"),
        ("Complexe Goma", "R+1, 38 boutiques", "Goma", "En construction", "Gouvernorat"),
    ]
    
    worksheet.write(row, 1, "Projet", formats["table_header_dark"])
    worksheet.write(row, 2, "Taille", formats["table_header_dark"])
    worksheet.write(row, 3, "Localisation", formats["table_header_dark"])
    worksheet.write(row, 4, "Statut", formats["table_header_dark"])
    worksheet.merge_range(row, 5, row, 7, "Promoteur", formats["table_header_dark"])
    row += 1
    
    for i, (projet, taille, loc, statut, prom) in enumerate(others):
        fmt = formats["cell_alt"] if i % 2 else formats["cell_normal"]
        worksheet.write(row, 1, projet, fmt)
        worksheet.write(row, 2, taille, formats["cell_center"])
        worksheet.write(row, 3, loc, fmt)
        worksheet.write(row, 4, statut, formats["highlight_gold"] if "construction" in statut.lower() else fmt)
        worksheet.merge_range(row, 5, row, 7, prom, fmt)
        row += 1
    
    worksheet.freeze_panes(3, 0)
    print("✅ Concurrence sheet generated")
