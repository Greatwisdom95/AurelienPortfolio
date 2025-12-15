"""
3D Bar Chart Generator using Matplotlib
Creates professional 3D bar charts for Excel insertion
"""

import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
import numpy as np
from pathlib import Path
import sys

# Add parent to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))
from config.styles import COLORS


def create_3d_bar_chart(
    data: dict,
    title: str,
    output_path: str,
    xlabel: str = "",
    ylabel: str = "",
    zlabel: str = "",
    figsize: tuple = (10, 8),
    dpi: int = 300,
    colors: list = None,
    elevation: int = 25,
    azimuth: int = 45,
) -> str:
    """
    Create a professional 3D bar chart
    
    Args:
        data: dict with 'labels', 'values' (can be 2D array for grouped bars)
        title: Chart title
        output_path: Where to save the chart
        xlabel, ylabel, zlabel: Axis labels
        figsize: Figure size in inches
        dpi: Resolution
        colors: List of colors for bars
        elevation, azimuth: 3D view angles
    
    Returns:
        Path to saved image
    """
    
    fig = plt.figure(figsize=figsize, facecolor='white')
    ax = fig.add_subplot(111, projection='3d')
    
    labels = data['labels']
    values = np.array(data['values'])
    
    # Handle 1D or 2D data
    if values.ndim == 1:
        values = values.reshape(1, -1)
    
    num_series, num_bars = values.shape
    
    # Position arrays
    x_pos = np.arange(num_bars)
    y_pos = np.arange(num_series)
    
    # Default colors
    if colors is None:
        colors = [COLORS['chart_1'], COLORS['chart_2'], COLORS['chart_3'], 
                  COLORS['chart_4'], COLORS['chart_5'], COLORS['chart_6']]
    
    # Create bars
    for i in range(num_series):
        xs = x_pos
        ys = np.full_like(xs, i, dtype=float) * 0.8
        zs = np.zeros_like(xs, dtype=float)
        
        # Bar dimensions
        dx = 0.6
        dy = 0.6
        dz = values[i]
        
        ax.bar3d(xs, ys, zs, dx, dy, dz, 
                color=colors[i % len(colors)], 
                alpha=0.85,
                edgecolor='white',
                linewidth=0.5)
    
    # Customization
    ax.set_xlabel(xlabel, fontsize=10, labelpad=10)
    ax.set_ylabel(ylabel, fontsize=10, labelpad=10)
    ax.set_zlabel(zlabel, fontsize=10, labelpad=10)
    ax.set_title(title, fontsize=14, fontweight='bold', color=COLORS['rose'], pad=20)
    
    # Set tick labels
    ax.set_xticks(x_pos + 0.3)
    ax.set_xticklabels(labels, fontsize=8, rotation=15)
    
    # View angle
    ax.view_init(elev=elevation, azim=azimuth)
    
    # Style
    ax.xaxis.pane.fill = False
    ax.yaxis.pane.fill = False
    ax.zaxis.pane.fill = False
    ax.xaxis.pane.set_edgecolor('lightgray')
    ax.yaxis.pane.set_edgecolor('lightgray')
    ax.zaxis.pane.set_edgecolor('lightgray')
    
    plt.tight_layout()
    plt.savefig(output_path, dpi=dpi, bbox_inches='tight', facecolor='white')
    plt.close()
    
    return output_path


def create_revenue_projection_3d(
    years: list,
    scenarios: dict,
    output_path: str,
    figsize: tuple = (12, 8),
) -> str:
    """
    Create 3D chart for revenue projections with multiple scenarios
    
    Args:
        years: List of years [2025, 2026, 2027, 2028]
        scenarios: Dict with scenario names and values
        output_path: Where to save
    """
    
    fig = plt.figure(figsize=figsize, facecolor='white')
    ax = fig.add_subplot(111, projection='3d')
    
    scenario_names = list(scenarios.keys())
    colors = [COLORS['danger'], COLORS['chart_2'], COLORS['success']]
    
    for i, (scenario_name, values) in enumerate(scenarios.items()):
        xs = np.arange(len(years))
        ys = np.full_like(xs, i * 1.2, dtype=float)
        zs = np.zeros_like(xs, dtype=float)
        
        # Convert to millions
        values_m = [v / 1_000_000 for v in values]
        
        ax.bar3d(xs, ys, zs, 0.7, 0.8, values_m,
                color=colors[i % len(colors)],
                alpha=0.85,
                edgecolor='white',
                label=scenario_name)
    
    ax.set_xlabel('Année', fontsize=10, labelpad=15)
    ax.set_ylabel('', fontsize=10)
    ax.set_zlabel('Revenus (M USD)', fontsize=10, labelpad=10)
    ax.set_title('Projections Revenus MiroirMall 2025-2028', 
                fontsize=14, fontweight='bold', color=COLORS['rose'], pad=20)
    
    ax.set_xticks(np.arange(len(years)) + 0.35)
    ax.set_xticklabels([str(y) for y in years], fontsize=9)
    ax.set_yticks([0, 1.2, 2.4])
    ax.set_yticklabels(['Pessimiste', 'Réaliste', 'Optimiste'], fontsize=8)
    
    ax.view_init(elev=20, azim=45)
    
    ax.xaxis.pane.fill = False
    ax.yaxis.pane.fill = False
    ax.zaxis.pane.fill = False
    
    plt.tight_layout()
    plt.savefig(output_path, dpi=300, bbox_inches='tight', facecolor='white')
    plt.close()
    
    return output_path


if __name__ == "__main__":
    # Test
    test_data = {
        'labels': ['2025', '2026', '2027', '2028'],
        'values': [0, 2.2, 3.8, 4.6]
    }
    create_3d_bar_chart(test_data, "Test Chart", "test_3d.png")
    print("Test chart created!")
