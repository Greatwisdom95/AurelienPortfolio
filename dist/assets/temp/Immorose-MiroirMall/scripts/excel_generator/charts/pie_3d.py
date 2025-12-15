"""
3D Pie Chart Generator using Matplotlib
Creates professional 3D pie charts for Excel insertion
"""

import matplotlib.pyplot as plt
import numpy as np
from pathlib import Path
import sys

# Add parent to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))
from config.styles import COLORS


def create_3d_pie_chart(
    data: dict,
    title: str,
    output_path: str,
    figsize: tuple = (10, 8),
    dpi: int = 300,
    colors: list = None,
    explode_index: int = None,
    shadow: bool = True,
    show_legend: bool = True,
) -> str:
    """
    Create a professional 3D-style pie chart (wedge3d effect)
    
    Args:
        data: dict with 'labels' and 'values'
        title: Chart title
        output_path: Where to save
        colors: List of colors
        explode_index: Index of slice to explode (highlight)
        shadow: Add shadow effect
        show_legend: Show legend
    """
    
    fig, ax = plt.subplots(figsize=figsize, facecolor='white')
    
    labels = data['labels']
    values = data['values']
    
    # Default colors (ImmoRose palette)
    if colors is None:
        colors = [
            COLORS['chart_1'],  # Rose
            COLORS['chart_2'],  # Blue
            COLORS['chart_3'],  # Green
            COLORS['chart_4'],  # Orange
            COLORS['chart_5'],  # Purple
            COLORS['chart_6'],  # Cyan
            COLORS['gold'],
            COLORS['gray_medium'],
        ]
    
    # Explode effect
    explode = [0] * len(values)
    if explode_index is not None and 0 <= explode_index < len(values):
        explode[explode_index] = 0.1
    
    # Create pie with 3D effect (using shadow and angle)
    wedges, texts, autotexts = ax.pie(
        values,
        labels=labels,
        autopct='%1.1f%%',
        colors=colors[:len(values)],
        explode=explode,
        shadow=shadow,
        startangle=90,
        pctdistance=0.75,
        labeldistance=1.1,
        wedgeprops={
            'edgecolor': 'white',
            'linewidth': 2,
            'antialiased': True,
        }
    )
    
    # Style text
    for text in texts:
        text.set_fontsize(10)
        text.set_fontweight('bold')
    
    for autotext in autotexts:
        autotext.set_fontsize(9)
        autotext.set_color('white')
        autotext.set_fontweight('bold')
    
    ax.set_title(title, fontsize=14, fontweight='bold', color=COLORS['rose'], pad=20)
    
    # Legend
    if show_legend:
        ax.legend(
            wedges, labels,
            title="Catégories",
            loc="center left",
            bbox_to_anchor=(1, 0, 0.5, 1),
            fontsize=9,
        )
    
    plt.tight_layout()
    plt.savefig(output_path, dpi=dpi, bbox_inches='tight', facecolor='white')
    plt.close()
    
    return output_path


def create_donut_chart(
    data: dict,
    title: str,
    output_path: str,
    center_text: str = "",
    figsize: tuple = (10, 8),
    dpi: int = 300,
) -> str:
    """
    Create a donut chart with center text
    """
    
    fig, ax = plt.subplots(figsize=figsize, facecolor='white')
    
    labels = data['labels']
    values = data['values']
    
    colors = [
        COLORS['chart_1'],
        COLORS['chart_2'],
        COLORS['chart_3'],
        COLORS['chart_4'],
        COLORS['chart_5'],
        COLORS['chart_6'],
    ]
    
    wedges, texts, autotexts = ax.pie(
        values,
        labels=labels,
        autopct='%1.1f%%',
        colors=colors[:len(values)],
        startangle=90,
        pctdistance=0.8,
        wedgeprops={
            'width': 0.5,
            'edgecolor': 'white',
            'linewidth': 2,
        }
    )
    
    # Center text
    if center_text:
        ax.text(0, 0, center_text, 
               ha='center', va='center', 
               fontsize=16, fontweight='bold',
               color=COLORS['rose'])
    
    ax.set_title(title, fontsize=14, fontweight='bold', color=COLORS['rose'], pad=20)
    
    plt.tight_layout()
    plt.savefig(output_path, dpi=dpi, bbox_inches='tight', facecolor='white')
    plt.close()
    
    return output_path


if __name__ == "__main__":
    # Test
    test_data = {
        'labels': ['Restaurant', 'Boutique', 'Supermarché', 'Loisirs'],
        'values': [40, 30, 20, 10]
    }
    create_3d_pie_chart(test_data, "Test Pie Chart", "test_pie.png")
    print("Test pie chart created!")
