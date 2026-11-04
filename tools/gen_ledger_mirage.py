#!/usr/bin/env python3
"""ledger_mirage (帳鏡蜃) idle / attack / sheet — Pillow hard-edge pixel art.
Fifth Boss: folded ledger + bronze mirror mirage; distinct from ink_specter curtains.
"""
from PIL import Image

ROOT = "/workspace/yinlou-defense"
SPRITES = f"{ROOT}/assets/sprites"

INK = (26, 21, 16, 255)       # #1A1510
PAPER = (232, 220, 200, 255)  # #E8DCC8
CINN = (196, 92, 74, 255)     # #C45C4A
TEAL = (58, 122, 106, 255)    # #3A7A6A
VIOLET = (90, 64, 96, 255)    # #5A4060
GOLD = (201, 162, 39, 255)    # #C9A227
SILVER = (212, 175, 55, 255)  # #D4AF37
UI = (42, 36, 28, 255)        # #2A241C
MIRROR = (58, 72, 88, 255)    # #3A4858 鏡藍灰 Boss 主色
FRAME = (42, 36, 28, 255)     # dark frame fill under gold
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


def foot_shadow(im):
    for dx in range(-10, 11):
        put(im, 24 + dx, 45, SHADOW)
        if abs(dx) < 8:
            put(im, 24 + dx, 44, SHADOW)
    R(im, 17, 46, 14, 1, SHADOW)


def draw_page(im, x0, y0, w, h, attack=False, side="L"):
    """Folded ledger page: paper with ink border, ledger lines, seal/mark."""
    R(im, x0, y0, w, h, PAPER)
    # outer ink border
    hline(im, x0, y0, w, INK)
    hline(im, x0, y0 + h - 1, w, INK)
    vline(im, x0, y0, h, INK)
    vline(im, x0 + w - 1, y0, h, INK)
    # gold binding edge toward spine
    bx = x0 + w - 1 if side == "L" else x0
    for j in range(1, h - 1, 2):
        put(im, bx, y0 + j, GOLD if not attack else SILVER)
    # ledger lines
    for i, yy in enumerate(range(y0 + 3, y0 + h - 4, 3)):
        lw = w - 4
        lx = x0 + 2
        if side == "L":
            col = CINN if i % 3 == 0 else INK
        else:
            col = TEAL if i % 3 == 1 else INK
        hline(im, lx, yy, lw, col)
    # attack: page tip / flip flap
    if attack:
        # top outer corner lifted
        if side == "L":
            R(im, x0 - 2, y0 - 2, 5, 4, PAPER)
            hline(im, x0 - 2, y0 - 2, 5, GOLD)
            vline(im, x0 - 2, y0 - 2, 4, INK)
            put(im, x0 - 1, y0, CINN)
        else:
            R(im, x0 + w - 3, y0 - 2, 5, 4, PAPER)
            hline(im, x0 + w - 3, y0 - 2, 5, GOLD)
            vline(im, x0 + w + 1, y0 - 2, 4, INK)
            put(im, x0 + w, y0, CINN)
        # bottom outer flare
        if side == "L":
            R(im, x0 - 1, y0 + h - 3, 3, 3, PAPER)
            put(im, x0 - 1, y0 + h - 1, INK)
        else:
            R(im, x0 + w - 2, y0 + h - 3, 3, 3, PAPER)
            put(im, x0 + w, y0 + h - 1, INK)


def cinnabar_seal(im, x, y, bright=False):
    R(im, x, y, 5, 5, CINN)
    R(im, x + 1, y + 1, 3, 3, PAPER if not bright else SILVER)
    put(im, x + 2, y + 2, CINN)
    if bright:
        put(im, x, y, SILVER)
        put(im, x + 4, y + 4, SILVER)


def draw_mirror(im, cx, cy, r, attack=False):
    """Hard-edge square bronze mirror with gold rim + face gleam (蜃氣反光)."""
    # outer gold frame (square with slight hard bevel — no soft AA)
    outer = r + 2
    R(im, cx - outer, cy - outer, outer * 2 + 1, outer * 2 + 1, GOLD if not attack else SILVER)
    # dark frame ring
    R(im, cx - (r + 1), cy - (r + 1), (r + 1) * 2 + 1, (r + 1) * 2 + 1, FRAME)
    # mirror face (鏡藍灰)
    R(im, cx - r, cy - r, r * 2 + 1, r * 2 + 1, MIRROR)
    # ink outline of face
    hline(im, cx - r, cy - r, r * 2 + 1, INK)
    hline(im, cx - r, cy + r, r * 2 + 1, INK)
    vline(im, cx - r, cy - r, r * 2 + 1, INK)
    vline(im, cx + r, cy - r, r * 2 + 1, INK)
    # gold corner nails
    for ox, oy in ((-r - 1, -r - 1), (r, -r - 1), (-r - 1, r), (r, r)):
        put(im, cx + ox, cy + oy, SILVER if attack else GOLD)
        put(im, cx + ox + (1 if ox < 0 else 0), cy + oy + (1 if oy < 0 else 0), GOLD)

    # reflection gleam — diagonal paper/silver strip (帳頁反光)
    if attack:
        # bright flash fill
        for dy in range(-r + 1, r):
            for dx in range(-r + 1, r):
                if abs(dx) + abs(dy) <= r + 1 and (dx + dy) % 3 == 0:
                    put(im, cx + dx, cy + dy, SILVER)
        # central bright core
        R(im, cx - 2, cy - 2, 5, 5, PAPER)
        R(im, cx - 1, cy - 1, 3, 3, SILVER)
        put(im, cx, cy, CINN)  # 鏡稅核
        # cross flash
        hline(im, cx - r + 1, cy, r * 2 - 1, PAPER)
        vline(im, cx, cy - r + 1, r * 2 - 1, PAPER)
        put(im, cx, cy, CINN)
    else:
        # static diagonal gleam
        for i in range(-r + 2, r - 1):
            put(im, cx + i, cy + i - 1, PAPER)
            if i % 2 == 0:
                put(im, cx + i, cy + i, SILVER)
        # small paper reflection block upper-left
        R(im, cx - r + 2, cy - r + 2, 3, 2, PAPER)
        put(im, cx - r + 3, cy - r + 3, SILVER)
        # faint teal mirage hint on face
        put(im, cx + 2, cy - 1, TEAL)
        put(im, cx - 2, cy + 2, TEAL)

    # top crown stud
    put(im, cx, cy - outer, SILVER if attack else GOLD)
    put(im, cx - 1, cy - outer, GOLD)
    put(im, cx + 1, cy - outer, GOLD)


def mirage_ripples(im, attack=False):
    """蜃氣波紋點 — teal/silver/mirror dots, NOT ink mist blobs."""
    if attack:
        pts = [
            # radiating rings of dots
            (4, 10), (6, 8), (8, 6),
            (43, 10), (41, 8), (39, 6),
            (4, 36), (6, 38), (8, 40),
            (43, 36), (41, 38), (39, 40),
            (2, 22), (3, 18), (3, 28),
            (45, 22), (44, 18), (44, 28),
            (14, 4), (20, 3), (28, 3), (34, 4),
            (14, 43), (20, 44), (28, 44), (34, 43),
            (10, 14), (38, 14), (10, 32), (38, 32),
            (16, 10), (32, 10), (16, 36), (32, 36),
            (12, 20), (36, 20), (12, 28), (36, 28),
        ]
        for i, (x, y) in enumerate(pts):
            col = TEAL if i % 3 == 0 else (SILVER if i % 3 == 1 else MIRROR)
            put(im, x, y, col)
            if i % 4 == 0:
                put(im, x + 1, y, col)
        # violet accent sparks (蜃氣)
        for x, y in ((7, 16), (40, 16), (7, 30), (40, 30), (24, 5), (24, 42)):
            put(im, x, y, VIOLET)
    else:
        pts = [
            (5, 14), (6, 22), (5, 32),
            (42, 14), (41, 22), (42, 32),
            (14, 6), (34, 6),
            (14, 41), (34, 41),
            (10, 18), (38, 18),
            (10, 30), (38, 30),
            (18, 8), (30, 8),
        ]
        for i, (x, y) in enumerate(pts):
            col = TEAL if i % 2 == 0 else MIRROR
            put(im, x, y, col)


def draw_spine_base(im, x0, y0, w, h, attack=False):
    """Dark spine / book thickness under the mirror."""
    R(im, x0, y0, w, h, UI)
    hline(im, x0, y0, w, INK)
    hline(im, x0, y0 + h - 1, w, INK)
    vline(im, x0, y0, h, INK)
    vline(im, x0 + w - 1, y0, h, INK)
    # gold stitch
    for j in range(2, h - 2, 3):
        put(im, x0 + w // 2, y0 + j, GOLD if not attack else SILVER)


def draw_frame(attack=False):
    im = Image.new("RGBA", (SIZE, SIZE), TRANS)
    foot_shadow(im)

    if attack:
        # pages flared outward
        draw_page(im, 2, 10, 13, 30, attack=True, side="L")
        draw_page(im, 33, 10, 13, 30, attack=True, side="R")
        draw_spine_base(im, 15, 12, 18, 28, attack=True)
        cinnabar_seal(im, 4, 32, bright=True)
        # right page coin / tax mark
        R(im, 38, 33, 4, 4, GOLD)
        put(im, 39, 34, CINN)
        put(im, 40, 35, INK)
        draw_mirror(im, 24, 22, 8, attack=True)
        # extra gold rim flash around mirror
        for ang in range(0, 16):
            # hard square halo ticks
            pass
        hline(im, 14, 12, 20, SILVER)
        hline(im, 14, 32, 20, SILVER)
        # cinnabar tax ticks on mirror corners
        put(im, 15, 13, CINN)
        put(im, 32, 13, CINN)
        put(im, 15, 31, CINN)
        put(im, 32, 31, CINN)
    else:
        draw_page(im, 6, 12, 12, 28, attack=False, side="L")
        draw_page(im, 30, 12, 12, 28, attack=False, side="R")
        draw_spine_base(im, 18, 14, 12, 24, attack=False)
        cinnabar_seal(im, 8, 32, bright=False)
        # right page small silver mark
        R(im, 35, 33, 3, 3, SILVER)
        put(im, 36, 34, INK)
        draw_mirror(im, 24, 22, 7, attack=False)

    mirage_ripples(im, attack=attack)

    # bottom gold stand / book foot (帳本底托) — reinforces book silhouette vs hanging curtain
    if attack:
        R(im, 14, 41, 20, 3, UI)
        hline(im, 14, 41, 20, GOLD)
        hline(im, 14, 43, 20, INK)
        put(im, 14, 42, SILVER)
        put(im, 33, 42, SILVER)
        put(im, 24, 42, CINN)
    else:
        R(im, 16, 41, 16, 3, UI)
        hline(im, 16, 41, 16, GOLD)
        hline(im, 16, 43, 16, INK)
        put(im, 16, 42, GOLD)
        put(im, 31, 42, GOLD)

    return im


def save_sheet(idle, attack, path):
    sheet = Image.new("RGBA", (96, 48), TRANS)
    sheet.paste(idle, (0, 0))
    sheet.paste(attack, (48, 0))
    sheet.save(path, "PNG")


def palette_ok(im):
    allowed = {
        INK, PAPER, CINN, TEAL, VIOLET, GOLD, SILVER, UI, MIRROR, FRAME, SHADOW, TRANS,
    }
    # FRAME == UI, ok
    bad = []
    for y in range(im.height):
        for x in range(im.width):
            c = im.getpixel((x, y))
            if c[3] == 0:
                continue
            if c not in allowed and not (c[3] < 255 and c[:3] == (0, 0, 0)):
                bad.append((x, y, c))
    return bad


def bbox(im):
    xs, ys = [], []
    for y in range(im.height):
        for x in range(im.width):
            if im.getpixel((x, y))[3] > 0:
                xs.append(x)
                ys.append(y)
    return (min(xs), min(ys), max(xs), max(ys), len(xs)) if xs else None


def main():
    idle = draw_frame(attack=False)
    attack = draw_frame(attack=True)
    idle_p = f"{SPRITES}/ledger_mirage.png"
    atk_p = f"{SPRITES}/ledger_mirage_attack.png"
    sheet_p = f"{SPRITES}/ledger_mirage_sheet.png"
    idle.save(idle_p, "PNG")
    attack.save(atk_p, "PNG")
    save_sheet(idle, attack, sheet_p)

    # pixel-exact sheet check
    sheet = Image.open(sheet_p)
    assert sheet.size == (96, 48)
    for y in range(48):
        for x in range(48):
            assert sheet.getpixel((x, y)) == idle.getpixel((x, y))
            assert sheet.getpixel((x + 48, y)) == attack.getpixel((x, y))

    for name, im in (("idle", idle), ("attack", attack)):
        assert im.size == (48, 48)
        bad = palette_ok(im)
        assert not bad, (name, bad[:5])
        print(name, "bbox", bbox(im), "bad", len(bad))

    # silhouette overlap vs ink_specter (should differ)
    ink = Image.open(f"{SPRITES}/ink_specter.png")
    same = 0
    opaque_both = 0
    for y in range(48):
        for x in range(48):
            a = idle.getpixel((x, y))[3] > 0
            b = ink.getpixel((x, y))[3] > 0
            if a and b:
                opaque_both += 1
            if a == b:
                same += 1
    print("silhouette same-mask%", round(100 * same / (48 * 48), 1), "overlap_opaque", opaque_both)

    qa = Image.new("RGBA", (96 * 6, 48 * 6), UI)
    qa.paste(sheet.resize((96 * 6, 48 * 6), Image.NEAREST), (0, 0))
    qa.save("/tmp/qa_ledger_mirage_x6.png", "PNG")
    print("ok", idle_p, atk_p, sheet_p)


if __name__ == "__main__":
    main()
