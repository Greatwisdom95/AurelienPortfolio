"""
Gauge Chart Generator
Creates professional gauge/speedometer charts for KPIs
"""

import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).parent.parent))
from config.styles import COLORS


def create_gauge_chart(
    value: float,
    max_value: float,
    title: str,
    output_path: str,
    unit: str = "",
    figsize: tuple = (6, 4),
    dpi: int = 300,
    thresholds: list = None,
) -> str:
    """
    Create a gauge/speedometer chart for KPIs
    
    Args:
        value: Current value
        max_value: Maximum value
        title: Chart title
        output_path: Where to save
        unit: Unit label (e.g., "%", "M$")
        thresholds: [low, medium] thresholds for color zones
    """
    
    fig, ax = plt.subplots(figsize=figsize, facecolor='white')
    
    # Default thresholds at 33% and 66%
    if thresholds is None:
        thresholds = [max_value * 0.33, max_value * 0.66]
    
    # Calculate percentage
    percentage = min(value / max_value, 1.0)
    angle = 180 - (180 * percentage)
    
    # Draw colored arcs
    # Red zone (0-33%)
    arc1 = patches.Arc((0.5, 0), 0.8, 0.8, angle=0, theta1=120, theta2=180,
                       color=COLORS['danger'], linewidth=20)
    ax.add_patch(arc1)
    
    # Yellow zone (33-66%)
    arc2 = patches.Arc((0.5, 0), 0.8, 0.8, angle=0, theta1=60, theta2=120,
                       color=COLORS['warning'], linewidth=20)
    ax.add_patch(arc2)
    
    # Green zone (66-100%)
    arc3 = patches.Arc((0.5, 0), 0.8, 0.8, angle=0, theta1=0, theta2=60,
                       color=COLORS['success'], linewidth=20)
    ax.add_patch(arc3)
    
    # Draw needle
    needle_angle = np.radians(angle)
    needle_length = 0.35
    needle_x = 0.5 + needle_length * np.cos(needle_angle)
    needle_y = needle_length * np.sin(needle_angle)
    
    ax.annotate('', xy=(needle_x, needle_y), xytext=(0.5, 0),
                arrowprops=dict(arrowstyle='->', color=COLORS['black'], lw=3))
    
    # Center circle
    circle = plt.Circle((0.5, 0), 0.05, color=COLORS['gray_dark'])
    ax.add_patch(circle)
    
    # Value text
    value_text = f"{value:,.0f}{unit}"
    ax.text(0.5, -0.15, value_text, ha='center', va='top',
            fontsize=24, fontweight='bold', color=COLORS['rose'])
    
    # Title
    ax.text(0.5, 0.55, title, ha='center', va='bottom',
            fontsize=12, fontweight='bold', color=COLORS['gray_dark'])
    
    ax.set_xlim(-0.1, 1.1)
    ax.set_ylim(-0.3, 0.6)
    ax.set_aspect('equal')
    ax.axis('off')
    
    plt.tight_layout()
    plt.savefig(output_path, dpi=dpi, bbox_inches='tight', facecolor='white')
    plt.close()
    
    return output_path


def create_progress_ring(
    value: float,
    max_value: float,
    title: str,
    output_path: str,
    figsize: tuple = (5, 5),
    dpi: int = 300,
) -> str:
    """
    Create a circular progress ring
    """
    
    fig, ax = plt.subplots(figsize=figsize, facecolor='white')
    
    percentage = min(value / max_value, 1.0)
    
    # Background ring
    theta = np.linspace(0, 2*np.pi, 100)
    r = 1
    x_bg = r * np.cos(theta)
    y_bg = r * np.sin(theta)
    ax.plot(x_bg, y_bg, color=COLORS['gray_light'], linewidth=15, solid_capstyle='round')
    
    # Progress ring
    theta_progress = np.linspace(np.pi/2, np.pi/2 - 2*np.pi*percentage, 100)
    x_prog = r * np.cos(theta_progress)
    y_prog = r * np.sin(theta_progress)
    ax.plot(x_prog, y_prog, color=COLORS['rose'], linewidth=15, solid_capstyle='round')
    
    # Center text
    ax.text(0, 0.1, f"{percentage*100:.0f}%", ha='center', va='center',
            fontsize=28, fontweight='bold', color=COLORS['rose'])
    ax.text(0, -0.25, title, ha='center', va='center',
            fontsize=10, color=COLORS['gray_dark'])
    
    ax.set_xlim(-1.5, 1.5)
    ax.set_ylim(-1.5, 1.5)
    ax.set_aspect('equal')
    ax.axis('off')
    
    plt.tight_layout()
    plt.savefig(output_path, dpi=dpi, bbox_inches='tight', facecolor='white')
    plt.close()
    
    return output_path


if __name__ == "__main__":
    create_gauge_chart(75, 100, "Taux d'occupation", "test_gauge.png", unit="%")
    create_progress_ring(55, 100, "Objectif", "test_ring.png")
    print("Test gauges created!")
