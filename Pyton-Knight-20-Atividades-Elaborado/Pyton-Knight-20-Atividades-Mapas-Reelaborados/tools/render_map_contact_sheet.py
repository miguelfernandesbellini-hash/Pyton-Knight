import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parent.parent
activities = json.loads((ROOT / "build" / "activity_catalog.json").read_text(encoding="utf-8"))[5:]
cell_width, cell_height, columns, rows = 390, 250, 3, 5
image = Image.new("RGB", (cell_width * columns, cell_height * rows), "#0b0e17")
draw = ImageDraw.Draw(image)
try:
    title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 14)
    entity_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 10)
except OSError:
    title_font = entity_font = ImageFont.load_default()

tile_colors = {0: "#171b27", 1: "#d7c39a", 2: "#559bd6", 3: "#66c978", 4: "#d84f5e"}
entity_labels = {"door": "P", "gate": "S", "guardian": "G", "lever": "A", "pressure_plate": "P", "toggle_plate": "P", "hazard": "!", "key": "K", "coin": "R", "pedestal": "P", "output_rune": "R", "bridge": "=", "bridge_segment": "=", "mirror": "M", "portal": "O", "chest": "B", "totem": "T"}

for index, activity in enumerate(activities):
    cell_x = (index % columns) * cell_width
    cell_y = (index // columns) * cell_height
    map_height = len(activity["mapa"])
    map_width = len(activity["mapa"][0])
    tile = int(min(18, 340 / map_width, 190 / map_height))
    origin_x = int(cell_x + (cell_width - map_width * tile) / 2)
    origin_y = int(cell_y + 43 + (190 - map_height * tile) / 2)
    draw.text((cell_x + 14, cell_y + 10), f'{activity["id"]}. {activity["nome"]} — {map_width}×{map_height}', fill="#f4f7ff", font=title_font)
    for row, values in enumerate(activity["mapa"]):
        for column, value in enumerate(values):
            x0, y0 = origin_x + column * tile, origin_y + row * tile
            draw.rectangle((x0, y0, x0 + tile - 1, y0 + tile - 1), fill=tile_colors[value], outline="#31394a")
    for entity in activity.get("entities", []):
        x0 = origin_x + entity["column"] * tile
        y0 = origin_y + entity["row"] * tile
        draw.ellipse((x0 + 2, y0 + 2, x0 + tile - 3, y0 + tile - 3), fill="#29213e", outline="#f7e37b")
        label = str(entity.get("symbol", entity.get("value", entity_labels.get(entity["type"], "?"))))
        box = draw.textbbox((0, 0), label, font=entity_font)
        draw.text((x0 + (tile - (box[2] - box[0])) / 2, y0 + (tile - (box[3] - box[1])) / 2 - 1), label, fill="white", font=entity_font)
    draw.rectangle((cell_x + 3, cell_y + 3, cell_x + cell_width - 4, cell_y + cell_height - 4), outline="#364155")

image.save(ROOT / "build" / "map_contact_sheet.png")
