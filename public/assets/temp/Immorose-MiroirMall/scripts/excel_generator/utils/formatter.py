"""
Formatter - Helper functions for Excel formatting
"""

import pandas as pd
from typing import List, Tuple
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))


def write_table_with_headers(
    worksheet,
    df: pd.DataFrame,
    start_row: int,
    start_col: int,
    formats: dict,
    header_format: str = "table_header",
    alternate_rows: bool = True,
) -> int:
    """
    Write a DataFrame as a formatted table
    
    Returns: next available row after table
    """
    
    # Write headers
    for col_idx, col_name in enumerate(df.columns):
        worksheet.write(start_row, start_col + col_idx, col_name, formats[header_format])
    
    # Write data
    for row_idx, row in df.iterrows():
        actual_row = start_row + 1 + row_idx
        
        for col_idx, value in enumerate(row):
            if alternate_rows and row_idx % 2 == 1:
                cell_format = formats.get("cell_alt", formats["cell_normal"])
            else:
                cell_format = formats["cell_normal"]
            
            # Handle different types
            if pd.isna(value):
                worksheet.write(actual_row, start_col + col_idx, "", cell_format)
            elif isinstance(value, (int, float)):
                worksheet.write_number(actual_row, start_col + col_idx, value, 
                                      formats.get("cell_number", cell_format))
            else:
                worksheet.write(actual_row, start_col + col_idx, str(value), cell_format)
    
    return start_row + len(df) + 2


def write_kpi_box(
    worksheet,
    row: int,
    col: int,
    value: str,
    label: str,
    formats: dict,
    merge_cols: int = 2,
    merge_rows: int = 2,
) -> None:
    """Write a KPI box with value and label"""
    
    # Merge cells for value
    worksheet.merge_range(row, col, row + merge_rows - 1, col + merge_cols - 1, 
                         value, formats["kpi_value"])
    
    # Label below
    worksheet.merge_range(row + merge_rows, col, row + merge_rows, col + merge_cols - 1,
                         label, formats["kpi_label"])


def auto_fit_columns(worksheet, df: pd.DataFrame, start_col: int = 0, padding: int = 2):
    """Auto-fit column widths based on content"""
    
    for idx, col in enumerate(df.columns):
        max_len = max(
            len(str(col)),
            df[col].astype(str).str.len().max() if len(df) > 0 else 0
        )
        worksheet.set_column(start_col + idx, start_col + idx, max_len + padding)


def format_currency(value: float, currency: str = "$") -> str:
    """Format number as currency string"""
    if value >= 1_000_000:
        return f"{currency}{value/1_000_000:.1f}M"
    elif value >= 1_000:
        return f"{currency}{value/1_000:.0f}K"
    else:
        return f"{currency}{value:.0f}"


def format_number(value: float) -> str:
    """Format large numbers with K/M suffix"""
    if value >= 1_000_000:
        return f"{value/1_000_000:.1f}M"
    elif value >= 1_000:
        return f"{value/1_000:.0f}K"
    else:
        return f"{value:.0f}"


def add_header_section(
    worksheet,
    row: int,
    start_col: int,
    end_col: int,
    text: str,
    formats: dict,
) -> int:
    """Add a section header spanning columns"""
    worksheet.merge_range(row, start_col, row, end_col, text, formats["header_section"])
    return row + 2
