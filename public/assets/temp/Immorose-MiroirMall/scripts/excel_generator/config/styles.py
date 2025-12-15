# Corporate colors and Excel styles for ImmoRose report
# LUXURY DESIGN: Gold, Black, White palette

# =============================================================================
# CORPORATE COLORS - LUXURY PALETTE (Or / Noir / Blanc)
# =============================================================================
COLORS = {
    # PRIMARY - GOLD (Accent principal)
    "gold": "#D4AF37",           # Or classique
    "gold_light": "#F5E6C8",     # Or clair
    "gold_dark": "#B8860B",      # Or foncé
    "gold_shimmer": "#FFD700",   # Or brillant
    
    # SECONDARY - BLACK (Base élégante)
    "black": "#0D0D0D",          # Noir profond
    "black_soft": "#1A1A1A",     # Noir doux
    "charcoal": "#2D2D2D",       # Charbon
    "graphite": "#3D3D3D",       # Graphite
    
    # NEUTRAL - WHITE (Contraste)
    "white": "#FFFFFF",          # Blanc pur
    "ivory": "#FFFFF0",          # Ivoire
    "pearl": "#F8F8F8",          # Perle
    "silver": "#C0C0C0",         # Argent
    "platinum": "#E5E5E5",       # Platine
    
    # ACCENT COLORS (Pour graphiques)
    "rose": "#E91E63",           # Rose ImmoRose
    "emerald": "#50C878",        # Émeraude
    "sapphire": "#0F52BA",       # Saphir
    "ruby": "#E0115F",           # Rubis
    "amethyst": "#9966CC",       # Améthyste
    "topaz": "#FFC87C",          # Topaze
    
    # STATUS
    "success": "#28A745",
    "warning": "#FFC107",
    "danger": "#DC3545",
    "info": "#17A2B8",
}

# =============================================================================
# UNICODE ICONS FOR EXCEL (Compatible Excel 2019+)
# =============================================================================
ICONS = {
    # Navigation
    "home": "🏠",
    "arrow_right": "➡️",
    "arrow_left": "⬅️",
    "star": "⭐",
    "diamond": "💎",
    
    # Business
    "building": "🏢",
    "mall": "🏬",
    "chart": "📊",
    "money": "💰",
    "target": "🎯",
    "trophy": "🏆",
    "handshake": "🤝",
    "briefcase": "💼",
    
    # Status
    "check": "✅",
    "cross": "❌",
    "warning": "⚠️",
    "info": "ℹ️",
    "fire": "🔥",
    "rocket": "🚀",
    
    # Data
    "graph_up": "📈",
    "graph_down": "📉",
    "calendar": "📅",
    "pin": "📍",
    "link": "🔗",
    "folder": "📁",
    "doc": "📄",
    
    # People
    "person": "👤",
    "team": "👥",
    "crown": "👑",
}

# =============================================================================
# SHEET CONFIGURATION (Names and Navigation)
# =============================================================================
SHEET_CONFIG = [
    {"name": "DASHBOARD", "icon": "🎯", "short": "Dashboard"},
    {"name": "ImmoRose", "icon": "🏢", "short": "ImmoRose"},
    {"name": "MiroirMall", "icon": "🏬", "short": "MiroirMall"},
    {"name": "Marché RDC", "icon": "📊", "short": "Marché"},
    {"name": "Prix Immobilier", "icon": "💰", "short": "Prix"},
    {"name": "Prospects", "icon": "🎯", "short": "Prospects"},
    {"name": "Concurrence", "icon": "⚔️", "short": "Concurrence"},
    {"name": "Case Shoprite", "icon": "📚", "short": "Shoprite"},
    {"name": "Projections", "icon": "📈", "short": "Projections"},
    {"name": "Sources", "icon": "🔗", "short": "Sources"},
]

SHEET_NAMES = [f"{s['icon']} {s['name']}" for s in SHEET_CONFIG]


# =============================================================================
# EXCEL FORMAT DEFINITIONS - LUXURY DESIGN
# =============================================================================

def get_formats(workbook):
    """Create luxury format objects for the workbook"""
    
    formats = {}
    
    # ============ NAVIGATION BAR ============
    formats["nav_bar"] = workbook.add_format({
        "bg_color": COLORS["black"],
        "font_color": COLORS["gold"],
        "font_size": 10,
        "bold": True,
        "align": "center",
        "valign": "vcenter",
        "border": 0,
    })
    
    formats["nav_active"] = workbook.add_format({
        "bg_color": COLORS["gold"],
        "font_color": COLORS["black"],
        "font_size": 10,
        "bold": True,
        "align": "center",
        "valign": "vcenter",
        "border": 0,
    })
    
    formats["nav_separator"] = workbook.add_format({
        "bg_color": COLORS["black"],
        "font_color": COLORS["charcoal"],
        "font_size": 10,
        "align": "center",
        "valign": "vcenter",
    })
    
    # ============ HEADERS - LUXURY ============
    formats["header_main"] = workbook.add_format({
        "bold": True,
        "font_size": 28,
        "font_color": COLORS["gold"],
        "bg_color": COLORS["black"],
        "align": "center",
        "valign": "vcenter",
        "border": 0,
    })
    
    formats["header_sub"] = workbook.add_format({
        "bold": True,
        "font_size": 14,
        "font_color": COLORS["gold_light"],
        "bg_color": COLORS["black"],
        "align": "center",
        "valign": "vcenter",
        "border": 0,
    })
    
    formats["header_section"] = workbook.add_format({
        "bold": True,
        "font_size": 13,
        "font_color": COLORS["black"],
        "bg_color": COLORS["gold"],
        "align": "left",
        "valign": "vcenter",
        "border": 0,
        "left": 5,
        "left_color": COLORS["gold_dark"],
    })
    
    formats["header_section_dark"] = workbook.add_format({
        "bold": True,
        "font_size": 13,
        "font_color": COLORS["gold"],
        "bg_color": COLORS["charcoal"],
        "align": "left",
        "valign": "vcenter",
        "border": 0,
    })
    
    # ============ TABLE HEADERS - LUXURY ============
    formats["table_header"] = workbook.add_format({
        "bold": True,
        "font_size": 11,
        "font_color": COLORS["black"],
        "bg_color": COLORS["gold"],
        "align": "center",
        "valign": "vcenter",
        "border": 1,
        "border_color": COLORS["gold_dark"],
        "text_wrap": True,
    })
    
    formats["table_header_dark"] = workbook.add_format({
        "bold": True,
        "font_size": 11,
        "font_color": COLORS["gold"],
        "bg_color": COLORS["black"],
        "align": "center",
        "valign": "vcenter",
        "border": 1,
        "border_color": COLORS["charcoal"],
        "text_wrap": True,
    })
    
    # ============ CELLS - LUXURY ============
    formats["cell_normal"] = workbook.add_format({
        "font_size": 10,
        "font_color": COLORS["black"],
        "bg_color": COLORS["white"],
        "align": "left",
        "valign": "vcenter",
        "border": 1,
        "border_color": COLORS["platinum"],
    })
    
    formats["cell_center"] = workbook.add_format({
        "font_size": 10,
        "font_color": COLORS["black"],
        "bg_color": COLORS["white"],
        "align": "center",
        "valign": "vcenter",
        "border": 1,
        "border_color": COLORS["platinum"],
    })
    
    formats["cell_number"] = workbook.add_format({
        "font_size": 10,
        "font_color": COLORS["black"],
        "bg_color": COLORS["white"],
        "align": "right",
        "valign": "vcenter",
        "border": 1,
        "border_color": COLORS["platinum"],
        "num_format": "#,##0",
    })
    
    formats["cell_currency"] = workbook.add_format({
        "font_size": 10,
        "font_color": COLORS["gold_dark"],
        "bg_color": COLORS["white"],
        "align": "right",
        "valign": "vcenter",
        "border": 1,
        "border_color": COLORS["platinum"],
        "num_format": "$#,##0",
        "bold": True,
    })
    
    formats["cell_percent"] = workbook.add_format({
        "font_size": 10,
        "font_color": COLORS["black"],
        "bg_color": COLORS["white"],
        "align": "center",
        "valign": "vcenter",
        "border": 1,
        "border_color": COLORS["platinum"],
        "num_format": "0%",
    })
    
    # ============ ALTERNATING ROWS - LUXURY ============
    formats["cell_alt"] = workbook.add_format({
        "font_size": 10,
        "font_color": COLORS["black"],
        "bg_color": COLORS["pearl"],
        "align": "left",
        "valign": "vcenter",
        "border": 1,
        "border_color": COLORS["platinum"],
    })
    
    formats["cell_alt_center"] = workbook.add_format({
        "font_size": 10,
        "font_color": COLORS["black"],
        "bg_color": COLORS["pearl"],
        "align": "center",
        "valign": "vcenter",
        "border": 1,
        "border_color": COLORS["platinum"],
    })
    
    formats["cell_alt_number"] = workbook.add_format({
        "font_size": 10,
        "font_color": COLORS["black"],
        "bg_color": COLORS["pearl"],
        "align": "right",
        "valign": "vcenter",
        "border": 1,
        "border_color": COLORS["platinum"],
        "num_format": "#,##0",
    })
    
    # ============ KPI BOXES - LUXURY ============
    formats["kpi_value"] = workbook.add_format({
        "bold": True,
        "font_size": 32,
        "font_color": COLORS["gold"],
        "bg_color": COLORS["black"],
        "align": "center",
        "valign": "vcenter",
        "border": 3,
        "border_color": COLORS["gold"],
    })
    
    formats["kpi_label"] = workbook.add_format({
        "bold": True,
        "font_size": 10,
        "font_color": COLORS["gold_light"],
        "bg_color": COLORS["charcoal"],
        "align": "center",
        "valign": "vcenter",
        "border": 0,
    })
    
    formats["kpi_box_border"] = workbook.add_format({
        "bg_color": COLORS["black"],
        "border": 2,
        "border_color": COLORS["gold"],
    })
    
    # ============ HIGHLIGHT - LUXURY ============
    formats["highlight_gold"] = workbook.add_format({
        "font_size": 10,
        "font_color": COLORS["black"],
        "bg_color": COLORS["gold"],
        "align": "center",
        "valign": "vcenter",
        "border": 1,
        "border_color": COLORS["gold_dark"],
        "bold": True,
    })
    
    formats["highlight_success"] = workbook.add_format({
        "font_size": 10,
        "font_color": COLORS["white"],
        "bg_color": COLORS["emerald"],
        "align": "center",
        "valign": "vcenter",
        "border": 1,
        "bold": True,
    })
    
    formats["highlight_warning"] = workbook.add_format({
        "font_size": 10,
        "font_color": COLORS["black"],
        "bg_color": COLORS["warning"],
        "align": "center",
        "valign": "vcenter",
        "border": 1,
        "bold": True,
    })
    
    formats["highlight_danger"] = workbook.add_format({
        "font_size": 10,
        "font_color": COLORS["white"],
        "bg_color": COLORS["danger"],
        "align": "center",
        "valign": "vcenter",
        "border": 1,
        "bold": True,
    })
    
    # ============ LINKS - LUXURY ============
    formats["link"] = workbook.add_format({
        "font_size": 10,
        "font_color": COLORS["sapphire"],
        "underline": True,
        "align": "left",
        "valign": "vcenter",
    })
    
    # ============ FOOTER ============
    formats["footer"] = workbook.add_format({
        "font_size": 9,
        "font_color": COLORS["silver"],
        "bg_color": COLORS["black"],
        "align": "center",
        "valign": "vcenter",
        "italic": True,
    })
    
    return formats


def add_navigation_bar(worksheet, formats: dict, current_sheet_index: int, start_row: int = 0) -> int:
    """
    Add CENTERED navigation bar to worksheet
    Navigation spans columns B to L (1-11), centered on content area
    Returns the next available row after navigation
    """
    
    # Set row height for nav bar
    worksheet.set_row(start_row, 28)
    
    # Start at column B (index 1) for centering
    start_col = 1
    
    # Write each navigation item
    for i, sheet in enumerate(SHEET_CONFIG):
        nav_text = f"{sheet['icon']} {sheet['short']}"
        col = start_col + i
        
        if i == current_sheet_index:
            worksheet.write(start_row, col, nav_text, formats["nav_active"])
        else:
            # Write with internal link
            link = f"internal:'{sheet['icon']} {sheet['name']}'!A1"
            worksheet.write_url(start_row, col, link, formats["nav_bar"], nav_text)
    
    # Fill row 0 (before nav) with black if needed
    worksheet.write(start_row, 0, "", formats["nav_separator"])
    
    # Fill remaining cells after navigation with black
    for col in range(start_col + len(SHEET_CONFIG), 15):
        worksheet.write(start_row, col, "", formats["nav_separator"])
    
    return start_row + 2

