#!/usr/bin/env python3
"""墨點金融江湖 — 首輪正式硬邊像素（48×48 idle|attack sheet）"""
from PIL import Image

P = {
    "ink": (26, 21, 16, 255),
    "paper": (232, 220, 200, 255),
    "cinnabar": (196, 92, 74, 255),
    "teal": (58, 122, 106, 255),
    "robe": (42, 106, 106, 255),
    "medic": (160, 64, 64, 255),
    "violet": (90, 64, 96, 255),
    "gold": (201, 162, 39, 255),
    "silver": (212, 175, 55, 255),
    "ui": (42, 36, 28, 255),
    "wood": (90, 64, 48, 255),
    "stone": (106, 96, 85, 255),
    "skin": (200, 170, 140, 255),
    "boot": (58, 40, 32, 255),
    "trans": (0, 0, 0, 0),
    "dust": (138, 126, 110, 255),
    "panic": (176, 80, 64, 255),
    "hook": (138, 80, 64, 255),
    "shade": (74, 64, 52, 255),
}
SIZE = 48
OUT = "/workspace/yinlou-defense/assets/sprites"

def nf():
    return Image.new("RGBA", (SIZE, SIZE), P["trans"])

def put(im, x, y, c):
    if 0 <= x < SIZE and 0 <= y < SIZE and c[3]:
        im.putpixel((x, y), c)

def R(im, x, y, w, h, c):
    for j in range(max(0, h)):
        for i in range(max(0, w)):
            put(im, x + i, y + j, c)

def box(im, x, y, w, h, fill, edge=None):
    edge = edge or P["ink"]
    R(im, x, y, w, h, fill)
    for i in range(w):
        put(im, x + i, y, edge)
        put(im, x + i, y + h - 1, edge)
    for j in range(h):
        put(im, x, y + j, edge)
        put(im, x + w - 1, y + j, edge)

def shadow(im, x=14, y=43, w=20):
    R(im, x, y, w, 2, (0, 0, 0, 70))

def face(im, x, y):
    box(im, x, y, 14, 12, P["skin"])
    put(im, x + 3, y + 4, P["ink"])
    put(im, x + 9, y + 4, P["ink"])
    R(im, x + 4, y + 7, 5, 2, P["cinnabar"])
    R(im, x + 2, y + 2, 4, 1, P["ink"])
    R(im, x + 8, y + 2, 4, 1, P["ink"])

def legs_boots(im, x, y, robe, lean=0):
    R(im, x + lean, y, 6, 8, robe)
    R(im, x + 10 + lean, y, 6, 8, robe)
    R(im, x - 1 + lean, y + 7, 7, 4, P["boot"])
    R(im, x + 10 + lean, y + 7, 7, 4, P["boot"])
    R(im, x - 1 + lean, y + 7, 7, 1, P["ink"])
    R(im, x + 10 + lean, y + 7, 7, 1, P["ink"])

def torso(im, x, y, w, h, robe):
    box(im, x, y, w, h, robe)
    R(im, x + 1, y + 1, 2, h - 2, P["shade"])
    R(im, x, y + h - 5, w, 4, P["gold"])
    put(im, x + w // 2, y + h - 3, P["silver"])
    R(im, x, y + h - 5, w, 1, P["ink"])

def hero_body(im, robe, lean=0, bob=0):
    shadow(im, 13 + lean, 44 + bob)
    legs_boots(im, 16, 34 + bob, robe, lean)
    torso(im, 14 + lean, 18 + bob, 20, 18, robe)
    face(im, 17 + lean, 7 + bob)
    R(im, 12 + lean, 19 + bob, 4, 6, P["stone"])
    R(im, 32 + lean, 19 + bob, 4, 6, P["stone"])
    put(im, 13 + lean, 19 + bob, P["ink"])
    put(im, 34 + lean, 19 + bob, P["ink"])

def long_bull(im, atk=False):
    lean = 3 if atk else 0
    bob = -1 if atk else 0
    hero_body(im, P["cinnabar"], lean, bob)
    R(im, 15 + lean, 4 + bob, 18, 5, P["ink"])
    R(im, 18 + lean, 2 + bob, 12, 3, P["ink"])
    R(im, 20 + lean, 1 + bob, 8, 2, P["wood"])
    wx, wy = (10, -6) if atk else (2, 0)
    R(im, 34 + lean + wx, 10 + bob + wy, 4, 22, P["stone"])
    R(im, 35 + lean + wx, 8 + bob + wy, 2, 3, P["paper"])
    R(im, 32 + lean + wx, 20 + bob + wy, 8, 3, P["gold"])
    R(im, 33 + lean + wx, 19 + bob + wy, 6, 1, P["ink"])
    R(im, 36 + lean + wx, 23 + bob + wy, 2, 5, P["cinnabar"])

def short_blade(im, atk=False):
    lean = 2 if atk else 0
    hero_body(im, P["robe"], lean)
    R(im, 16 + lean, 5, 16, 4, P["teal"])
    R(im, 30 + lean, 8, 4, 10, P["teal"])
    R(im, 16 + lean, 5, 16, 1, P["ink"])
    wx, wy = (12, -5) if atk else (3, 0)
    R(im, 34 + lean + wx, 14 + wy, 3, 20, P["paper"])
    R(im, 33 + lean + wx, 12 + wy, 5, 3, P["ink"])
    R(im, 32 + lean + wx, 18 + wy, 7, 3, P["gold"])
    put(im, 35 + lean + wx, 11 + wy, P["silver"])

def leverage_monk(im, atk=False):
    bob = -2 if atk else 0
    hero_body(im, P["violet"], 0, bob)
    R(im, 18, 4 + bob, 12, 5, P["skin"])
    R(im, 20, 3 + bob, 8, 2, P["skin"])
    put(im, 23, 5 + bob, P["ink"])
    R(im, 13, 20 + bob, 3, 14, P["gold"])
    R(im, 32, 20 + bob, 3, 14, P["gold"])
    wx, wy = (4, -8) if atk else (0, 0)
    R(im, 6 + wx, 4 + bob + wy, 4, 32, P["wood"])
    box(im, 3 + wx, 2 + bob + wy, 10, 6, P["gold"])
    R(im, 5 + wx, 3 + bob + wy, 6, 2, P["silver"])
    if atk:
        R(im, 12 + wx, 6 + bob + wy, 10, 4, P["violet"])
        R(im, 14 + wx, 4 + bob + wy, 6, 2, P["paper"])

def dividend_hermit(im, atk=False):
    hero_body(im, P["teal"], 0, 0)
    R(im, 10, 5, 28, 4, P["ink"])
    R(im, 13, 3, 22, 3, P["ink"])
    R(im, 17, 1, 14, 3, P["wood"])
    R(im, 10, 8, 28, 1, P["shade"])
    wx = 3 if atk else 0
    box(im, 34 + wx, 22, 8, 10, P["gold"])
    R(im, 36 + wx, 19, 4, 4, P["cinnabar"])
    R(im, 37 + wx, 18, 2, 2, P["ink"])
    if atk:
        for pt in ((8, 24), (12, 28), (36, 16), (40, 30), (24, 42)):
            R(im, pt[0], pt[1], 2, 2, P["teal"])

def market_guard(im, atk=False):
    sx = -3 if atk else 0
    hero_body(im, P["stone"], 0)
    R(im, 15, 3, 18, 6, P["ink"])
    R(im, 18, 1, 12, 3, P["gold"])
    R(im, 20, 0, 8, 2, P["silver"])
    R(im, 17, 14, 14, 2, P["ink"])
    box(im, 4 + sx, 14, 14, 22, P["wood"])
    box(im, 7 + sx, 18, 8, 12, P["gold"])
    R(im, 9 + sx, 22, 4, 4, P["silver"])
    R(im, 34, 16, 3, 18, P["stone"])
    R(im, 32, 14, 7, 3, P["ink"])

def penny_assassin(im, atk=False):
    lean = 4 if atk else 0
    bob = -2 if atk else 0
    hero_body(im, P["medic"], lean, bob)
    R(im, 17 + lean, 13 + bob, 14, 5, P["ink"])
    put(im, 20 + lean, 15 + bob, P["paper"])
    put(im, 27 + lean, 15 + bob, P["paper"])
    wx, wy = (9, -4) if atk else (0, 0)
    R(im, 35 + lean + wx, 14 + bob + wy, 3, 14, P["paper"])
    R(im, 34 + lean + wx, 12 + bob + wy, 5, 3, P["gold"])
    R(im, 8 + lean - wx, 18 + bob + wy, 3, 12, P["paper"])
    R(im, 7 + lean - wx, 16 + bob + wy, 5, 3, P["gold"])

def ipo_herald(im, atk=False):
    hero_body(im, P["gold"], 0)
    R(im, 15, 3, 18, 5, P["cinnabar"])
    R(im, 17, 1, 14, 3, P["cinnabar"])
    R(im, 22, 0, 4, 2, P["gold"])
    box(im, 30, 18, 14, 14, P["wood"])
    box(im, 32, 21, 10, 8, P["paper"])
    R(im, 34, 24, 6, 2, P["ink"])
    R(im, 8, 20, 10, 3, P["ink"])
    box(im, 5, 17, 5, 8, P["wood"])
    if atk:
        R(im, 28, 14, 3, 3, P["gold"])
        R(im, 44, 14, 3, 3, P["gold"])
        R(im, 36, 10, 3, 3, P["silver"])
        R(im, 36, 34, 3, 3, P["silver"])

def squeeze_blade(im, atk=False):
    lean = 3 if atk else 0
    hero_body(im, P["hook"], lean)
    R(im, 10 + lean, 16, 5, 18, P["ink"])
    R(im, 11 + lean, 18, 3, 14, P["ui"])
    wx, wy = (9, -5) if atk else (1, 0)
    R(im, 34 + lean + wx, 12 + wy, 4, 22, P["stone"])
    R(im, 34 + lean + wx, 10 + wy, 14, 4, P["stone"])
    R(im, 44 + lean + wx, 10 + wy, 4, 8, P["ink"])
    R(im, 33 + lean + wx, 20 + wy, 6, 3, P["gold"])

def e_body(im, col, r=12, ox=0, oy=0, tall=False):
    shadow(im, 14 + ox, 44 + oy, 20)
    h = r * 2 + (6 if tall else 2)
    box(im, 24 - r + ox, 22 - r + oy, r * 2, h, col)
    R(im, 20 + ox, 20 + oy, 4, 3, P["paper"])
    R(im, 28 + ox, 20 + oy, 4, 3, P["paper"])
    put(im, 21 + ox, 21 + oy, P["ink"])
    put(im, 29 + ox, 21 + oy, P["ink"])
    R(im, 18 + ox, 40 + oy, 5, 4, P["boot"])
    R(im, 27 + ox, 40 + oy, 5, 4, P["boot"])

def retail_tide(im, atk=False):
    ox = 3 if atk else 0
    e_body(im, P["dust"], 11, ox)
    R(im, 14 + ox, 10, 20, 5, P["ink"])
    R(im, 16 + ox, 8, 16, 3, P["shade"])
    box(im, 30 + ox, 28, 8, 7, P["gold"])
    if atk:
        R(im, 36 + ox, 24, 8, 4, P["cinnabar"])

def chase_zombie(im, atk=False):
    ox = 4 if atk else 0
    e_body(im, P["medic"], 12, ox)
    for dx in range(0, 20, 3):
        R(im, 14 + ox + dx, 8, 2, 5, P["ink"])
    R(im, 20 + ox, 20, 4, 3, P["cinnabar"])
    R(im, 28 + ox, 20, 4, 3, P["cinnabar"])
    R(im, 36 + ox, 24, 10, 4, P["medic"])
    R(im, 44 + ox, 22, 3, 3, P["ink"])
    R(im, 8 + ox, 26, 8, 4, P["medic"])

def leverage_fiend(im, atk=False):
    e_body(im, P["violet"], 13, 0, tall=True)
    R(im, 16, 6, 4, 8, P["ink"])
    R(im, 28, 6, 4, 8, P["ink"])
    R(im, 14, 5, 6, 3, P["gold"])
    R(im, 28, 5, 6, 3, P["gold"])
    R(im, 20, 28, 8, 2, P["gold"])
    R(im, 22, 26, 4, 6, P["gold"])
    if atk:
        R(im, 4, 18, 8, 8, P["violet"])
        R(im, 36, 18, 8, 8, P["violet"])
        R(im, 6, 16, 4, 2, P["paper"])
        R(im, 38, 16, 4, 2, P["paper"])

def black_swan(im, atk=False):
    shadow(im, 10, 44, 28)
    box(im, 6, 8, 36, 34, P["ink"])
    R(im, 10, 12, 28, 26, P["ui"])
    for y in (10, 16, 22, 28, 34):
        R(im, 2, y, 8, 4, P["ink"])
        R(im, 38, y, 8, 4, P["ink"])
        R(im, 4, y + 1, 4, 2, P["ui"])
        R(im, 40, y + 1, 4, 2, P["ui"])
    box(im, 14, 18, 8, 6, P["gold"])
    box(im, 26, 18, 8, 6, P["gold"])
    R(im, 16, 20, 4, 3, P["cinnabar"])
    R(im, 28, 20, 4, 3, P["cinnabar"])
    R(im, 21, 26, 6, 8, P["stone"])
    R(im, 22, 34, 4, 4, P["ink"])
    R(im, 20, 4, 8, 5, P["ink"])
    R(im, 22, 2, 4, 3, P["gold"])
    if atk:
        R(im, 16, 0, 16, 4, P["paper"])
        R(im, 18, 1, 12, 2, P["cinnabar"])

def margin_call(im, atk=False):
    ox = 4 if atk else 0
    e_body(im, P["cinnabar"], 11, ox)
    R(im, 14 + ox, 8, 20, 4, P["ink"])
    R(im, 18 + ox, 5, 12, 4, P["ink"])
    R(im, 22 + ox, 4, 4, 2, P["gold"])
    box(im, 32 + ox, 14, 12, 16, P["paper"])
    R(im, 34 + ox, 16, 8, 3, P["cinnabar"])
    R(im, 34 + ox, 21, 8, 2, P["ink"])
    R(im, 34 + ox, 24, 8, 2, P["ink"])
    R(im, 34 + ox, 27, 8, 1, P["ink"])

def panic_board(im, atk=False):
    ox = 5 if atk else 0
    e_body(im, P["panic"], 12, ox)
    for x, y in ((19, 16), (20, 17), (21, 18), (22, 19), (27, 16), (28, 17), (29, 18)):
        put(im, x + ox, y, P["ink"])
    R(im, 8 + ox, 18, 6, 10, P["panic"])
    R(im, 34 + ox, 16, 8, 6, P["panic"])
    if atk:
        R(im, 38 + ox, 20, 8, 5, P["cinnabar"])
        R(im, 40 + ox, 18, 4, 2, P["paper"])

HEROES = {
    "long_bull": long_bull,
    "short_blade": short_blade,
    "leverage_monk": leverage_monk,
    "dividend_hermit": dividend_hermit,
    "market_guard": market_guard,
    "penny_assassin": penny_assassin,
    "ipo_herald": ipo_herald,
    "squeeze_blade": squeeze_blade,
}
ENEMIES = {
    "retail_tide": retail_tide,
    "chase_zombie": chase_zombie,
    "leverage_fiend": leverage_fiend,
    "black_swan": black_swan,
    "margin_call": margin_call,
    "panic_board": panic_board,
}

def sheet(fn, base):
    idle, atk = nf(), nf()
    fn(idle, False)
    fn(atk, True)
    sh = Image.new("RGBA", (SIZE * 2, SIZE), P["trans"])
    sh.paste(idle, (0, 0), idle)
    sh.paste(atk, (SIZE, 0), atk)
    sh.save(f"{OUT}/{base}_sheet.png")
    idle.save(f"{OUT}/{base}.png")
    atk.save(f"{OUT}/{base}_attack.png")

def main():
    for k, fn in {**HEROES, **ENEMIES}.items():
        sheet(fn, k)
    keys = list(HEROES) + list(ENEMIES)
    cols = 4
    rows = (len(keys) + cols - 1) // cols
    board = Image.new("RGBA", (cols * SIZE, rows * SIZE), P["ui"])
    for i, k in enumerate(keys):
        im = Image.open(f"{OUT}/{k}.png")
        board.paste(im, ((i % cols) * SIZE, (i // cols) * SIZE), im)
    board.save(f"{OUT}/_round1_roster.png")
    # ×4 preview for QA readability
    board.resize((board.width * 4, board.height * 4), Image.NEAREST).save(f"{OUT}/_round1_roster_x4.png")
    print("done", len(keys))

if __name__ == "__main__":
    main()
