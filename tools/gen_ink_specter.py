#!/usr/bin/env python3
"""v2.3: ink_specter (墨影帳) idle / attack / sheet — Pillow hard-edge pixel art."""
from PIL import Image

ROOT = "/workspace/yinlou-defense"
SPRITES = f"{ROOT}/assets/sprites"

INK = (26, 21, 16, 255)
PAPER = (232, 220, 200, 255)
CINN = (196, 92, 74, 255)
TEAL = (58, 122, 106, 255)
VIOLET = (90, 64, 96, 255)
GOLD = (201, 162, 39, 255)
SILVER = (212, 175, 55, 255)
UI = (42, 36, 28, 255)
BODY = (42, 48, 64, 255)  # #2A3040 Boss data
FOLD = (42, 36, 28, 255)
SHADOW = (0, 0, 0, 70)
SIZE = 48
TRANS = (0, 0, 0, 0)


def put(im, x, y, c):
    if 0 <= x < im.width and 0 <= y < im.height and c[3]:
        if c[3] < 255:
            cur = im.getpixel((x, y))
            if cur[3] == 255:
                return
        im.putpixel((x, y), c)


def R(im, x, y, w, h, c):
    for j in range(max(0, h)):
        for i in range(max(0, w)):
            put(im, x + i, y + j, c)


def hline(im, x, y, w, c):
    R(im, x, y, w, 1, c)


def vline(im, x, y, h, c):
    R(im, x, y, 1, h, c)


def gold_nail(im, x, y, bright=False):
    R(im, x, y, 2, 2, SILVER if bright else GOLD)
    put(im, x, y, GOLD)


def mist_dot(im, x, y, big=False):
    put(im, x, y, INK)
    if big:
        put(im, x + 1, y, INK)
        put(im, x, y + 1, INK)


def draw_panel(im, x0, y0, w, h, attack=False, side="L"):
    """Solid hanging curtain panel with zigzag hem and gold outer trim."""
    # solid body
    R(im, x0, y0, w, h, BODY)
    # vertical folds
    fx = x0 + 3 if side == "L" else x0 + w - 4
    vline(im, fx, y0 + 2, h - 5, FOLD)
    fx2 = x0 + 6 if side == "L" else x0 + w - 7
    if 0 < fx2 - x0 < w:
        vline(im, fx2, y0 + 4, h - 8, FOLD)
    # ink border
    hline(im, x0, y0, w, INK)
    vline(im, x0, y0, h, INK)
    vline(im, x0 + w - 1, y0, h, INK)
    # zigzag hem — redraw bottom 3 rows cleanly
    for i in range(w):
        # pattern: tip lengths 0,1,2,1 repeating
        tip = (i % 4)
        if tip == 3:
            tip = 1
        if attack:
            tip = (i % 3)  # sharper
        base = y0 + h - 1
        # clear below tip
        for dy in range(3):
            yy = base - dy
            if yy >= y0:
                im.putpixel((x0 + i, yy), TRANS)
        # fill from top of hem zone down to tip
        for dy in range(3 - tip):
            put(im, x0 + i, base - 2 + dy, BODY)
        put(im, x0 + i, base - tip, INK)
    # gold trim on outer vertical edge
    ox = x0 if side == "L" else x0 + w - 1
    for j in range(2, h - 4, 3):
        put(im, ox, y0 + j, GOLD)
        if attack:
            put(im, ox, y0 + j + 1, SILVER)


def draw_ledger(im, cx, cy, crack_w, page_h, attack=False):
    page_w = 7 if not attack else 6
    left_x = cx - crack_w // 2 - page_w
    right_x = cx + (crack_w + 1) // 2
    top = cy - page_h // 2

    def page(px):
        R(im, px, top, page_w, page_h, PAPER)
        hline(im, px, top, page_w, GOLD)  # gold binding
        hline(im, px, top + page_h - 1, page_w, INK)
        vline(im, px, top, page_h, INK)
        vline(im, px + page_w - 1, top, page_h, INK)
        if attack:
            hline(im, px, top + 1, page_w, SILVER)

    page(left_x)
    page(right_x)

    # ledger lines
    for i, yy in enumerate(range(top + 3, top + page_h - 4, 3)):
        hline(im, left_x + 1, yy, page_w - 2, INK if i % 3 else CINN)
        hline(im, right_x + 1, yy, page_w - 2, INK if i % 3 != 1 else TEAL)

    # ink crack core
    crack_top = top - (2 if attack else 1)
    crack_h = page_h + (5 if attack else 3)
    R(im, cx - crack_w // 2, crack_top, crack_w, crack_h, INK)
    for j in range(crack_h):
        if j % 2 == 0:
            put(im, cx, crack_top + j, VIOLET)
        if attack and j % 3 == 0:
            put(im, cx - 1, crack_top + j, VIOLET)
            if crack_w >= 5:
                put(im, cx + 1, crack_top + j, BODY)

    # cinnabar seal (帳印)
    sx, sy = left_x + 1, top + page_h - 7
    R(im, sx, sy, 5, 5, CINN)
    R(im, sx + 1, sy + 1, 3, 3, PAPER)
    put(im, sx + 2, sy + 2, CINN)

    # small silver coin mark on right page (抽銀 hint)
    rx, ry = right_x + page_w - 5, top + page_h - 6
    R(im, rx, ry, 3, 3, GOLD if attack else SILVER)
    put(im, rx + 1, ry + 1, INK)


def draw_rod(im, y, attack=False):
    R(im, 3, y, 42, 3, FOLD)
    hline(im, 3, y, 42, INK)
    hline(im, 3, y + 2, 42, INK)
    R(im, 1, y, 3, 3, GOLD)
    R(im, 44, y, 3, 3, GOLD)
    if attack:
        put(im, 2, y + 1, SILVER)
        put(im, 45, y + 1, SILVER)
        for x in range(7, 42, 5):
            put(im, x, y + 1, GOLD)
    # hanging rings
    for hx in (8, 24, 39):
        put(im, hx, y + 3, GOLD)
        put(im, hx, y + 4, INK)


def draw_valence(im, y, attack=False):
    """Short top valence connecting both curtains (帳眉)."""
    R(im, 5, y, 38, 4, BODY)
    hline(im, 5, y, 38, INK)
    hline(im, 5, y + 3, 38, INK)
    # gold stitch line
    for x in range(7, 42, 4):
        put(im, x, y + 1, GOLD)
        if attack:
            put(im, x + 1, y + 2, SILVER)
    # center ink blot on valence
    R(im, 22, y + 1, 4, 2, INK)
    put(im, 23, y + 1, VIOLET)


def draw_frame(attack=False):
    im = Image.new("RGBA", (SIZE, SIZE), TRANS)

    # foot shadow
    for dx in range(-12, 13):
        put(im, 24 + dx, 45, SHADOW)
        if abs(dx) < 10:
            put(im, 24 + dx, 44, SHADOW)
    R(im, 16, 46, 16, 1, SHADOW)

    rod_y = 3 if not attack else 1
    draw_rod(im, rod_y, attack=attack)
    val_y = rod_y + 4
    draw_valence(im, val_y, attack=attack)

    panel_top = val_y + 4
    if attack:
        # curtains pulled outward / lifted
        draw_panel(im, 0, panel_top, 11, 34, attack=True, side="L")
        draw_panel(im, 37, panel_top, 11, 34, attack=True, side="R")
        # lifted flaps at top outer corners
        R(im, 0, panel_top - 2, 5, 5, BODY)
        R(im, 43, panel_top - 2, 5, 5, BODY)
        hline(im, 0, panel_top - 2, 5, GOLD)
        hline(im, 43, panel_top - 2, 5, GOLD)
        vline(im, 0, panel_top - 2, 5, INK)
        vline(im, 47, panel_top - 2, 5, INK)
        gold_nail(im, 1, panel_top, bright=True)
        gold_nail(im, 45, panel_top, bright=True)
        gold_nail(im, 1, panel_top + 28, bright=True)
        gold_nail(im, 45, panel_top + 28, bright=True)
        crack_w, page_h = 5, 28
    else:
        draw_panel(im, 2, panel_top, 12, 32, attack=False, side="L")
        draw_panel(im, 34, panel_top, 12, 32, attack=False, side="R")
        gold_nail(im, 3, panel_top + 1)
        gold_nail(im, 43, panel_top + 1)
        gold_nail(im, 3, panel_top + 26)
        gold_nail(im, 43, panel_top + 26)
        crack_w, page_h = 3, 24

    draw_ledger(im, 24, 24 if not attack else 23, crack_w, page_h, attack=attack)

    # ink mist
    if attack:
        pts = [
            (0, 14), (1, 22), (0, 30), (2, 38),
            (46, 12), (47, 20), (45, 28), (47, 36),
            (10, 6), (38, 5), (14, 42), (34, 42),
            (8, 18), (40, 19), (18, 4), (30, 4),
            (6, 34), (42, 33), (12, 28), (36, 30),
            (20, 43), (28, 43), (22, 2), (26, 2),
            (4, 10), (43, 10), (16, 40), (32, 40),
        ]
        for x, y in pts:
            mist_dot(im, x, y, big=True)
        for x, y in ((11, 15), (36, 17), (22, 40), (26, 7), (8, 26), (40, 28), (20, 10), (28, 38)):
            put(im, x, y, VIOLET)
            put(im, x + 1, y, INK)
    else:
        pts = [
            (0, 16), (1, 28), (0, 38),
            (47, 14), (46, 26), (47, 36),
            (12, 7), (36, 8), (16, 42), (32, 42),
            (8, 20), (40, 22), (6, 32), (42, 34),
        ]
        for x, y in pts:
            mist_dot(im, x, y, big=False)

    return im


def save_sheet(idle, attack, path):
    sheet = Image.new("RGBA", (96, 48), TRANS)
    sheet.paste(idle, (0, 0))
    sheet.paste(attack, (48, 0))
    sheet.save(path, "PNG")


def main():
    idle = draw_frame(attack=False)
    attack = draw_frame(attack=True)
    idle_p = f"{SPRITES}/ink_specter.png"
    atk_p = f"{SPRITES}/ink_specter_attack.png"
    sheet_p = f"{SPRITES}/ink_specter_sheet.png"
    idle.save(idle_p, "PNG")
    attack.save(atk_p, "PNG")
    save_sheet(idle, attack, sheet_p)

    qa = Image.new("RGBA", (96 * 6, 48 * 6), (42, 36, 28, 255))
    sheet = Image.open(sheet_p)
    qa.paste(sheet.resize((96 * 6, 48 * 6), Image.NEAREST), (0, 0))
    qa.save("/tmp/qa_ink_specter_x6.png", "PNG")
    print("ok", idle_p, atk_p, sheet_p)


if __name__ == "__main__":
    main()
