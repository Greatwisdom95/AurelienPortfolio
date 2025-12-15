"""
Data Loader - Loads CSV files into pandas DataFrames
"""

import pandas as pd
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).parent.parent))
from config.settings import CSV_FILES, DATA_DIR


def load_csv(name: str) -> pd.DataFrame:
    """Load a CSV file by its config name"""
    if name not in CSV_FILES:
        raise ValueError(f"Unknown CSV file: {name}")
    
    filepath = CSV_FILES[name]
    
    if not filepath.exists():
        print(f"Warning: File not found: {filepath}")
        return pd.DataFrame()
    
    try:
        df = pd.read_csv(filepath, encoding='utf-8')
        return df
    except Exception as e:
        print(f"Error loading {filepath}: {e}")
        return pd.DataFrame()


def load_all_data() -> dict:
    """Load all CSV files into a dictionary of DataFrames"""
    data = {}
    for name in CSV_FILES.keys():
        data[name] = load_csv(name)
        print(f"Loaded {name}: {len(data[name])} rows")
    return data


def get_immorose_data() -> pd.DataFrame:
    """Load ImmoRose database"""
    return load_csv("immorose_database")


def get_economic_data() -> pd.DataFrame:
    """Load economic data"""
    return load_csv("economic_data")


def get_prospects_data() -> pd.DataFrame:
    """Load prospects data"""
    return load_csv("prospects")


def get_competitors_data() -> pd.DataFrame:
    """Load competitors data"""
    return load_csv("competitors")


def get_real_estate_prices() -> pd.DataFrame:
    """Load real estate prices"""
    return load_csv("real_estate_prices")


def get_shoprite_case() -> pd.DataFrame:
    """Load Shoprite case study"""
    return load_csv("shoprite_case")


def get_sources_urls() -> pd.DataFrame:
    """Load source URLs"""
    return load_csv("sources_urls")


if __name__ == "__main__":
    # Test
    data = load_all_data()
    print("\n=== Data Summary ===")
    for name, df in data.items():
        print(f"{name}: {len(df)} rows, {len(df.columns)} columns")
