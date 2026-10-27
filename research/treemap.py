#!/usr/bin/env python3
"""Generate a treemap SVG of the tax revenue in Germany 2025.

The data comes from steuereinnahmen-deutschland.md (column 2025, billion euro).

Usage: python3 research/treemap.py > research/steuereinnahmen-2025-treemap.svg
"""

import html

WIDTH = 960
HEIGHT = 600
HEADER = 96
GAP = 2

# (key, label, light color, dark color)
LEVELS = [
    ("gemeinschaft", "Gemeinschaftsteuern", "#2a78d6", "#3987e5"),
    ("gemeinde", "Gemeindesteuern", "#eb6834", "#d95926"),
    ("bund", "Bundessteuern", "#1baf7a", "#199e70"),
    ("laender", "Ländersteuern", "#eda100", "#c98500"),
    ("eu", "EU (Zölle)", "#e87ba4", "#d55181"),
]

SURFACE = {"light": "#fcfcfb", "dark": "#1a1a19"}
INK = {"light": ("#0b0b0b", "#52514e"), "dark": ("#f0efec", "#c3c2b7")}

# (level, short label, long label, billion euro)
TAXES = [
    ("gemeinschaft", "Umsatzsteuer", "Steuern vom Umsatz (incl. Einfuhrumsatzsteuer)", 310.206),
    ("gemeinschaft", "Lohnsteuer", "Lohnsteuer (net of Kindergeld)", 262.688),
    ("gemeinschaft", "Einkommensteuer", "Veranlagte Einkommensteuer", 78.362),
    ("gemeinde", "Gewerbesteuer", "Gewerbesteuer (gross)", 76.4),
    ("gemeinschaft", "Körperschaftsteuer", "Körperschaftsteuer", 39.164),
    ("bund", "Energiesteuer", "Energiesteuer", 37.563),
    ("gemeinschaft", "Kapitalertragsteuer", "Nicht veranlagte Steuern vom Ertrag", 31.118),
    ("gemeinschaft", "Abgeltungsteuer", "Abgeltungsteuer auf Zins- und Veräußerungserträge", 24.801),
    ("bund", "Versicherungsteuer", "Versicherungsteuer", 19.611),
    ("bund", "Tabaksteuer", "Tabaksteuer", 17.632),
    ("gemeinde", "Grundsteuer", "Grundsteuer A + B", 16.1),
    ("laender", "Erbschaftsteuer", "Erbschaftsteuer", 15.412),
    ("laender", "Grunderwerbsteuer", "Grunderwerbsteuer", 15.097),
    ("bund", "Soli", "Solidaritätszuschlag", 12.878),
    ("bund", "Kfz-Steuer", "Kraftfahrzeugsteuer", 9.598),
    ("eu", "Zölle", "Zölle", 5.859),
    ("bund", "Stromsteuer", "Stromsteuer", 5.856),
    ("laender", "Lotterie", "Rennwett- und Lotteriesteuer", 2.463),
    ("bund", "Luftverkehr", "Luftverkehrsteuer", 2.063),
    ("bund", "Alkohol", "Alkoholsteuer", 2.050),
    ("bund", "Übrige", "Übrige Bundessteuern", 1.561),
    ("laender", "Übrige", "Übrige Ländersteuern", 0.773),
    ("laender", "Bier", "Biersteuer", 0.540),
]


def squarify(items, x, y, w, h):
    """Lay out (value, payload) items in the rectangle; return (payload, x, y, w, h)."""
    items = sorted(items, key=lambda it: -it[0])
    total = sum(v for v, _ in items)
    scale = w * h / total
    areas = [(v * scale, p) for v, p in items]
    out = []

    def worst(row, side):
        s = sum(a for a, _ in row)
        return max(max(side * side * a / (s * s), (s * s) / (side * side * a)) for a, _ in row)

    while areas:
        side = min(w, h)
        row = [areas.pop(0)]
        while areas and worst(row + [areas[0]], side) <= worst(row, side):
            row.append(areas.pop(0))
        s = sum(a for a, _ in row)
        if w >= h:
            rw = s / h
            ry = y
            for a, p in row:
                out.append((p, x, ry, rw, a / rw))
                ry += a / rw
            x += rw
            w -= rw
        else:
            rh = s / w
            rx = x
            for a, p in row:
                out.append((p, rx, y, a / rh, rh))
                rx += a / rh
            y += rh
            h -= rh
    return out


def luminance(hex_color):
    rgb = [int(hex_color[i : i + 2], 16) / 255 for i in (1, 3, 5)]
    lin = [c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in rgb]
    return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]


def contrast(a, b):
    la, lb = sorted((luminance(a), luminance(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)


def label_ink(fill):
    return max(("#0b0b0b", "#ffffff"), key=lambda ink: contrast(fill, ink))


def fmt(value):
    return f"{value:.1f}"


def text_width(text, size):
    return len(text) * size * 0.56


def fit_label(short, value, share, w, h):
    """Return (font size, rotate, [(text, bold)]) for the largest label that fits, or None."""
    names = [[short]]
    if short.endswith("steuer") and len(short) > len("steuer") + 4:
        names.append([short[: -len("steuer")] + "-", "steuer"])
    for size in (16, 13, 11, 10):
        values = [f"{fmt(value)} · {share:.1f} %", fmt(value)] if size == 16 else [fmt(value)]
        for rotate in (False, True):
            span, depth = (h, w) if rotate else (w, h)
            for name in names:
                for value_text in values + [None]:
                    lines = [(n, True) for n in name]
                    if value_text:
                        lines.append((value_text, False))
                    fits_span = max(text_width(t, size) for t, _ in lines) <= span - 16
                    fits_depth = len(lines) * (size + 4) + 8 <= depth
                    if fits_span and fits_depth:
                        return size, rotate, lines
    return None


def main():
    total = sum(t[3] for t in TAXES)
    level_sum = {k: sum(t[3] for t in TAXES if t[0] == k) for k, *_ in LEVELS}

    css = [
        f".bg{{fill:{SURFACE['light']}}}",
        f".ink1{{fill:{INK['light'][0]}}}",
        f".ink2{{fill:{INK['light'][1]}}}",
        f".tile{{stroke:{SURFACE['light']};stroke-width:{GAP}}}",
        "text{font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif}",
        ".tile:hover{opacity:.85}",
    ]
    dark = [
        f".bg{{fill:{SURFACE['dark']}}}",
        f".ink1{{fill:{INK['dark'][0]}}}",
        f".ink2{{fill:{INK['dark'][1]}}}",
        f".tile{{stroke:{SURFACE['dark']}}}",
    ]
    for key, _, light, dark_color in LEVELS:
        css.append(f".f-{key}{{fill:{light}}}")
        css.append(f".t-{key}{{fill:{label_ink(light)}}}")
        dark.append(f".f-{key}{{fill:{dark_color}}}")
        dark.append(f".t-{key}{{fill:{label_ink(dark_color)}}}")
    style = "\n".join(css) + "\n@media (prefers-color-scheme: dark){\n" + "\n".join(dark) + "\n}"

    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {WIDTH} {HEIGHT}" '
        f'width="{WIDTH}" height="{HEIGHT}" role="img" aria-labelledby="title desc">',
        '<title id="title">Steuereinnahmen Deutschland 2025</title>',
        f'<desc id="desc">Treemap of tax revenue in Germany 2025 by tax type, total about '
        f"{fmt(total)} billion euro. Area is proportional to revenue. Color shows the level of "
        "government that receives the tax.</desc>",
        f"<style>\n{style}\n</style>",
        f'<rect class="bg" width="{WIDTH}" height="{HEIGHT}"/>',
        f'<text class="ink1" x="0" y="24" font-size="20" font-weight="600">'
        f"Steuereinnahmen Deutschland 2025: {fmt(total)} Mrd. Euro</text>",
        '<text class="ink2" x="0" y="46" font-size="13">'
        "Area = revenue. Sources: BMF Monatsbericht Januar 2026, Destatis. "
        "See steuereinnahmen-deutschland.md.</text>",
    ]

    lx = 0
    for key, label, _, _ in LEVELS:
        text = f"{label} {fmt(level_sum[key])}"
        parts.append(f'<rect class="f-{key}" x="{lx}" y="64" width="12" height="12" rx="2"/>')
        parts.append(f'<text class="ink2" x="{lx + 18}" y="75" font-size="13">{html.escape(text)}</text>')
        lx += 18 + len(text) * 7.2 + 20

    groups = squarify(
        [(level_sum[k], k) for k, *_ in LEVELS], 0, HEADER, WIDTH, HEIGHT - HEADER
    )
    for key, gx, gy, gw, gh in groups:
        taxes = [(t[3], t) for t in TAXES if t[0] == key]
        for (level, short, long_label, value), x, y, w, h in squarify(taxes, gx, gy, gw, gh):
            share = value / total * 100
            tip = f"{long_label}: {fmt(value)} Mrd. Euro ({share:.1f} %)"
            parts.append("<g>")
            parts.append(f"<title>{html.escape(tip)}</title>")
            parts.append(
                f'<rect class="tile f-{level}" x="{x:.1f}" y="{y:.1f}" '
                f'width="{w:.1f}" height="{h:.1f}" rx="4"/>'
            )
            label = fit_label(short, value, share, w, h)
            if label:
                size, rotate, lines = label
                if rotate:
                    # Read bottom to top, along the left edge of a narrow tile.
                    tx, ty = x + size + 4, y + h - 8
                    transform = f' transform="rotate(-90 {tx:.1f} {ty:.1f})"'
                else:
                    tx, ty = x + 8, y + size + 6
                    transform = ""
                for i, (text, bold) in enumerate(lines):
                    weight = ' font-weight="600"' if bold else ""
                    parts.append(
                        f'<text class="t-{level}" x="{tx:.1f}" y="{ty + i * (size + 4):.1f}" '
                        f'font-size="{size}"{weight}{transform}>{html.escape(text)}</text>'
                    )
            parts.append("</g>")

    parts.append("</svg>")
    print("\n".join(parts))


if __name__ == "__main__":
    main()
