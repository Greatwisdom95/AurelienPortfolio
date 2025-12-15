"""
Shoprite Case Study Sheet Generator - LUXURY DESIGN
Lessons from Shoprite's failure in DRC
"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from config.styles import ICONS, add_navigation_bar


def generate_shoprite_sheet(workbook, formats: dict, data: dict) -> None:
    """Generate Shoprite case study sheet"""
    
    worksheet = workbook.add_worksheet("📚 Case Shoprite")
    
    worksheet.set_column('A:A', 2)
    worksheet.set_column('B:B', 28)
    worksheet.set_column('C:H', 18)
    
    row = add_navigation_bar(worksheet, formats, current_sheet_index=7, start_row=1)
    
    # Header
    worksheet.set_row(row, 40)
    worksheet.merge_range(row, 1, row, 7, f"{ICONS['doc']} CASE STUDY : SHOPRITE RDC", formats["header_main"])
    row += 1
    worksheet.merge_range(row, 1, row, 7, "Analyse de l'échec du géant sud-africain - Leçons pour MiroirMall", formats["header_sub"])
    row += 2
    
    # Context
    worksheet.merge_range(row, 1, row, 7, f"{ICONS['calendar']} CONTEXTE", formats["header_section"])
    row += 1
    
    context = [
        ("Entreprise", "Shoprite Holdings (Afrique du Sud)"),
        ("Présence RDC", "2012 - 2022 (10 ans)"),
        ("Nombre de magasins", "6 supermarchés (Kinshasa + Lubumbashi)"),
        ("Décision", "Retrait total de RDC en 2022"),
        ("Source", "Reuters, rapports d'analystes"),
    ]
    
    for i, (label, value) in enumerate(context):
        fmt = formats["cell_alt"] if i % 2 else formats["cell_normal"]
        worksheet.write(row, 1, label, formats["table_header"])
        worksheet.merge_range(row, 2, row, 7, value, fmt)
        row += 1
    
    row += 1
    
    # Failure Factors
    worksheet.merge_range(row, 1, row, 7, f"{ICONS['warning']} FACTEURS D'ÉCHEC", formats["header_section"])
    row += 1
    
    worksheet.write(row, 1, "Facteur", formats["table_header_dark"])
    worksheet.merge_range(row, 2, row, 4, "Impact", formats["table_header_dark"])
    worksheet.merge_range(row, 5, row, 7, "Leçon pour MiroirMall", formats["table_header_dark"])
    row += 1
    
    factors = [
        ("Volatilité monétaire", "Franc congolais -50% vs USD en 5 ans", "Baux en USD, revenus dollarisés"),
        ("Inflation élevée", "13%+ par an, marge rognée", "Pricing power via positionnement premium"),
        ("Droits d'importation", "Taxes élevées sur produits importés", "Favoriser fournisseurs locaux / régionaux"),
        ("Loyers en USD", "Charges fixes élevées", "ImmoRose = propriétaire, pas locataire"),
        ("Pouvoir d'achat limité", "Cible trop large (mass market)", "Cibler classe moyenne-haute + expatriés"),
        ("Concurrence informel", "90% du commerce = marché informel", "Offrir expérience différenciante"),
        ("Infrastructure logistique", "Approvisionnement difficile", "Partenariats logistiques solides"),
    ]
    
    for i, (facteur, impact, lecon) in enumerate(factors):
        fmt = formats["cell_alt"] if i % 2 else formats["cell_normal"]
        worksheet.write(row, 1, facteur, fmt)
        worksheet.merge_range(row, 2, row, 4, impact, formats["highlight_warning"])
        worksheet.merge_range(row, 5, row, 7, lecon, formats["highlight_success"])
        row += 1
    
    row += 1
    
    # Key Lessons
    worksheet.merge_range(row, 1, row, 7, f"{ICONS['check']} LEÇONS CLÉS POUR MIROIRMALL", formats["header_section"])
    row += 1
    
    lessons = [
        (f"{ICONS['money']} Dollarisation", "Tous les contrats et baux en USD pour éviter le risque de change"),
        (f"{ICONS['target']} Ciblage précis", "Focus classe moyenne-supérieure et expatriés (15% population)"),
        (f"{ICONS['building']} Propriétaire vs locataire", "ImmoRose est propriétaire = contrôle des coûts"),
        (f"{ICONS['fire']} Mix locataires diversifié", "100 enseignes = risque dilué si 1 échoue"),
        (f"{ICONS['handshake']} Partenariats locaux", "Intégrer des enseignes locales qui connaissent le marché"),
        (f"{ICONS['star']} Expérience premium", "Loisirs + shopping = destination, pas juste magasins"),
        (f"{ICONS['rocket']} Premier arrivé", "Avantage concurrentiel = pas de mall concurrent établi"),
    ]
    
    for i, (titre, detail) in enumerate(lessons):
        fmt = formats["cell_alt"] if i % 2 else formats["cell_normal"]
        worksheet.write(row, 1, titre, formats["table_header"])
        worksheet.merge_range(row, 2, row, 7, detail, fmt)
        row += 1
    
    row += 1
    
    # Success Factors
    worksheet.merge_range(row, 1, row, 7, f"{ICONS['trophy']} FACTEURS DE SUCCÈS MIROIRMALL", formats["header_section"])
    row += 1
    
    success = [
        ("Localisation stratégique", "Lac Kipopo = quartier premium, pas périphérie"),
        ("Concept destination", "Mall = lieu de vie, pas juste shopping"),
        ("Ancrage local", "ImmoRose connaît le marché RDC depuis 2019"),
        ("Diversification revenus", "Loyers + parking + événements + publicité"),
        ("Flexibilité", "Baux adaptables selon performance locataires"),
    ]
    
    for i, (facteur, explication) in enumerate(success):
        fmt = formats["cell_alt"] if i % 2 else formats["cell_normal"]
        worksheet.write(row, 1, facteur, formats["table_header"])
        worksheet.merge_range(row, 2, row, 7, explication, formats["highlight_gold"])
        row += 1
    
    worksheet.freeze_panes(3, 0)
    print("✅ Shoprite Case Study sheet generated")
