# Configuration settings for Excel report generation

import os
from pathlib import Path

# =============================================================================
# PATHS
# =============================================================================
BASE_DIR = Path(__file__).parent.parent.parent.parent
DATA_DIR = BASE_DIR / "data"
OUTPUT_DIR = BASE_DIR / "output"
CHARTS_DIR = OUTPUT_DIR / "charts"

# Ensure directories exist
OUTPUT_DIR.mkdir(exist_ok=True)
CHARTS_DIR.mkdir(exist_ok=True)

# =============================================================================
# DATA FILES
# =============================================================================
CSV_FILES = {
    "immorose_database": DATA_DIR / "immorose_database.csv",
    "economic_data": DATA_DIR / "economic_data_rdc.csv",
    "real_estate_prices": DATA_DIR / "real_estate_prices.csv",
    "demographics": DATA_DIR / "demographics_lubumbashi.csv",
    "competitors": DATA_DIR / "competitors_analysis.csv",
    "prospects": DATA_DIR / "prospects_miroirmall.csv",
    "shoprite_case": DATA_DIR / "shoprite_case_study.csv",
    "market_analysis": DATA_DIR / "market_analysis_2025.csv",
    "international_brands": DATA_DIR / "international_brands_potential.csv",
    "social_media": DATA_DIR / "social_media_metrics.csv",
    "sources_urls": DATA_DIR / "immorose_sources_urls.csv",
}

# =============================================================================
# REPORT METADATA
# =============================================================================
REPORT_TITLE = "ImmoRose - Rapport d'Activité 2025"
REPORT_SUBTITLE = "MiroirMall - Le plus grand centre commercial de RDC"
REPORT_DATE = "Décembre 2025"
OUTPUT_FILENAME = "ImmoRose_Rapport_Activite_2025.xlsx"

# =============================================================================
# IMMOROSE COMPANY DATA (from ImmoroseRapport2.md)
# =============================================================================
IMMOROSE = {
    "name": "IMMOROSE SARL",
    "founded": 2019,
    "ceo": "Nitin (Utamsingh) Gopal",
    "sales_manager": "Amal Jaafar",
    "parent_group": "Vinmart / Maisons Super Development (MSD)",
    
    # Legal info
    "rccm": "CD/KNG/RCCM/22-B-00256",
    "id_nat": "01-C2601-N98959T",
    "tax_id": "A2200974J",
    
    # Headquarters
    "address": "Immeuble Rosons Tower, 2ème étage, Bureau 2C",
    "street": "126 Boulevard du 30 Juin",
    "city": "Gombe, Kinshasa",
    "country": "RDC",
    
    # Contacts
    "phone_main": "+243 895 269 216",
    "email_info": "info@immorose.com",
    "email_sales": "sales@immorose.com",
    "email_hr": "hr@immorose.com",
    "phone_hr": "+243 890 239 485",
    "website": "immorose.com",
    
    # Social media
    "linkedin_followers": 282,
    "instagram_handle": "@immo.rose",
    "facebook": "ImmoRose",
}

# =============================================================================
# MIROIRMALL PROJECT DATA (CORRECTED from ImmoroseRapport2.md)
# =============================================================================
MIROIRMALL = {
    "name": "Miroir Mall",
    "tagline": "Le plus grand centre commercial de RDC",
    "location": "Lac Kipopo, Lubumbashi",
    "province": "Haut-Katanga",
    
    # Physical specs (CORRECTED: 18,000m² exploitation)
    "total_area_m2": 20000,        # Total building
    "gla_m2": 18000,               # Gross Leasable Area (CORRECTED)
    "terrain_ha": 2.9,             # Site hectares
    "nb_stores": 100,              # Target stores
    "parking_spaces": 330,         # Updated from 350
    "nb_levels": 3,                # R+2
    
    # Entertainment
    "cinemas": 3,
    "bowling": True,
    "mini_karting": True,
    "arcade": True,
    "kids_area": True,
    "carousel": True,
    "amphitheater": True,
    
    # Employment & Traffic
    "jobs_direct_indirect": 1000,
    "visitors_per_day_min": 10000,
    "visitors_per_day_max": 15000,
    
    # Timeline (CORRECTED: opens END 2026, operations start 2027)
    "opening_date": "Fin 2026",
    "opening_year": 2026,
    "first_full_year": 2027,       # First full year of operations
    "construction_start": 2024,
    
    # Contacts
    "phone": "+243 900 191 119",
    "email": "sales.miroir@immorose.com",
    "instagram": "@miroirmall",
    
    # Financial estimates
    "estimated_rent_per_m2_low": 20,   # USD/m²/month
    "estimated_rent_per_m2_high": 30,  # USD/m²/month
    "estimated_annual_revenue_low": 4500000,   # USD
    "estimated_annual_revenue_high": 5500000,  # USD
    
    # Confirmed tenants (from user info)
    "confirmed_tenants": [
        "Hyper Psaro",
        "Restaurants du Carrefour (Lubumbashi)",
    ],
}

# =============================================================================
# PROJECTIONS 2025-2028 (CORRECTED: Revenues start 2027)
# =============================================================================
PROJECTIONS = {
    "years": [2025, 2026, 2027, 2028],
    "scenario_pessimistic": {
        "occupancy_rate": [0, 0, 0.45, 0.60],       # No revenue until 2027
        "annual_revenue_usd": [0, 0, 1800000, 2800000],
    },
    "scenario_realistic": {
        "occupancy_rate": [0, 0, 0.60, 0.75],       # Build-up year 2027
        "annual_revenue_usd": [0, 0, 2700000, 4000000],
    },
    "scenario_optimistic": {
        "occupancy_rate": [0, 0, 0.75, 0.85],       # Strong launch 2027
        "annual_revenue_usd": [0, 0, 3600000, 4800000],
    },
}

# =============================================================================
# GDP & ECONOMIC DATA
# =============================================================================
ECONOMIC = {
    "gdp_rdc_2024_musd": 70946,
    "gdp_rdc_2025_musd": 76157,
    "growth_rate_2024": 0.065,  # 6.5%
    "growth_rate_2025": 0.053,  # 5.3%
    "inflation_2024": 0.13,     # 13%
    "mining_share_exports": 0.30,  # 30%
    "population_lubumbashi": 3061000,
    "middle_class_percent": 0.15,  # 15%
}
