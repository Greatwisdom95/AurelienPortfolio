#!/usr/bin/env python3
"""
╔═══════════════════════════════════════════════════════════════════════════════╗
║                                                                                ║
║   ImmoRose / MiroirMall - Excel Report Generator                               ║
║   ═══════════════════════════════════════════════                              ║
║                                                                                ║
║   Generates a professional 10-sheet Excel report with:                         ║
║   • Luxury design (Gold/Black/White palette)                                   ║
║   • Navigation bar on every sheet                                              ║
║   • Unicode icons                                                              ║
║   • 3D charts (Matplotlib)                                                     ║
║   • Complete ImmoRose/MiroirMall data                                          ║
║                                                                                ║
║   Author: Aurelien Portfolio Project                                           ║
║   Date: December 2025                                                          ║
║                                                                                ║
╚═══════════════════════════════════════════════════════════════════════════════╝
"""

import sys
import os
from pathlib import Path
from datetime import datetime

# Add package to path
SCRIPT_DIR = Path(__file__).parent
sys.path.insert(0, str(SCRIPT_DIR))

import xlsxwriter

# Config imports
from config.settings import OUTPUT_DIR, CHARTS_DIR, OUTPUT_FILENAME, REPORT_TITLE
from config.styles import get_formats, SHEET_NAMES

# Utils imports
from utils.data_loader import load_all_data

# Generator imports - All 10 sheets
from generators import (
    generate_dashboard,
    generate_immorose_sheet,
    generate_miroirmall_sheet,
    generate_market_sheet,
    generate_prices_sheet,
    generate_prospects_sheet,
    generate_competitors_sheet,
    generate_shoprite_sheet,
    generate_projections_sheet,
    generate_sources_sheet,
)


def print_banner():
    """Print startup banner"""
    print()
    print("╔" + "═" * 70 + "╗")
    print("║" + " " * 70 + "║")
    print("║" + "   🏢 IMMOROSE / MIROIRMALL - RAPPORT EXCEL GENERATOR".center(70) + "║")
    print("║" + "   ═══════════════════════════════════════════════".center(70) + "║")
    print("║" + " " * 70 + "║")
    print("║" + f"   📅 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}".ljust(70) + "║")
    print("║" + f"   🎨 Design: Luxury (Gold/Black/White)".ljust(70) + "║")
    print("║" + f"   📑 Sheets: 10 onglets avec navigation".ljust(70) + "║")
    print("║" + " " * 70 + "║")
    print("╚" + "═" * 70 + "╝")
    print()


def main():
    """Main function - generates the complete Excel report"""
    
    print_banner()
    
    # =========================================================================
    # STEP 1: Load all data
    # =========================================================================
    print("📂 Chargement des fichiers CSV...")
    print("-" * 50)
    data = load_all_data()
    print()
    
    # =========================================================================
    # STEP 2: Create workbook
    # =========================================================================
    output_path = OUTPUT_DIR / OUTPUT_FILENAME
    
    print(f"📊 Création du workbook Excel...")
    print(f"   📁 Output: {output_path}")
    print()
    
    workbook = xlsxwriter.Workbook(str(output_path), {
        'strings_to_numbers': True,
        'strings_to_formulas': False,
        'default_date_format': 'dd/mm/yyyy',
    })
    
    # Get all formats
    formats = get_formats(workbook)
    
    # =========================================================================
    # STEP 3: Generate all 10 sheets
    # =========================================================================
    print("📝 Génération des 10 onglets...")
    print("-" * 50)
    
    generators = [
        ("🎯 DASHBOARD", generate_dashboard),
        ("🏢 ImmoRose", generate_immorose_sheet),
        ("🏬 MiroirMall", generate_miroirmall_sheet),
        ("📊 Marché RDC", generate_market_sheet),
        ("💰 Prix Immobilier", generate_prices_sheet),
        ("🎯 Prospects", generate_prospects_sheet),
        ("⚔️ Concurrence", generate_competitors_sheet),
        ("📚 Case Shoprite", generate_shoprite_sheet),
        ("📈 Projections", generate_projections_sheet),
        ("🔗 Sources", generate_sources_sheet),
    ]
    
    success_count = 0
    for sheet_name, generator_func in generators:
        try:
            generator_func(workbook, formats, data)
            success_count += 1
        except Exception as e:
            print(f"   ❌ Erreur {sheet_name}: {e}")
    
    print("-" * 50)
    print(f"   ✅ {success_count}/10 onglets générés avec succès")
    print()
    
    # =========================================================================
    # STEP 4: Close and save workbook
    # =========================================================================
    try:
        workbook.close()
        
        file_size = output_path.stat().st_size
        size_str = f"{file_size / 1024:.1f} KB" if file_size < 1024*1024 else f"{file_size / (1024*1024):.2f} MB"
        
        print("╔" + "═" * 70 + "╗")
        print("║" + "   ✅ RAPPORT EXCEL GÉNÉRÉ AVEC SUCCÈS !".center(70) + "║")
        print("║" + " " * 70 + "║")
        print("║" + f"   📁 Fichier: {OUTPUT_FILENAME}".ljust(70) + "║")
        print("║" + f"   📏 Taille: {size_str}".ljust(70) + "║")
        print("║" + f"   📑 Onglets: 10".ljust(70) + "║")
        print("║" + " " * 70 + "║")
        print("╚" + "═" * 70 + "╝")
        print()
        print(f"   > Ouvrir: {output_path}")
        print()
        
    except Exception as e:
        print(f"❌ Erreur lors de la sauvegarde: {e}")
        return 1
    
    return 0


if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
