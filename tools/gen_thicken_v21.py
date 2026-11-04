#!/usr/bin/env python3
"""v2.1 thicken: battle_mid / battle_props + circuit_swan / lock_hermit attack frames."""
from PIL import Image
import random

ROOT = "/workspace/yinlou-defense"
SCENES = f"{ROOT}/assets/scenes"
SPRITES = f"{ROOT}/assets/sprites"

INK = (26, 21, 16, 255)
PAPER = (232, 220, 200, 255)
CINN = (196, 92, 74, 255)
TEAL = (58, 122, 106, 255)
ROBE = (42, 106, 106, 255)
VIOLET = (90, 64, 96, 255)
GOLD = (201, 162, 39, 255)
SILVER = (212, 175, 55, 255)
UI = (42, 36, 28, 255)
WOOD = (90, 64, 48, 255)
WOOD2 = (74, 48, 32, 255)
WOOD3 = (106, 80, 64, 255)
WOOD4 = (106, 80, 48, 255)
STONE = (106, 96, 85, 255)
SKIN = (200, 170, 140, 255)
BOOT = (58, 40, 32, 255)
SHADE = (74, 64, 52, 255)
TEAL2 = (64, 104, 88, 255)
PURP = (42, 24, 40, 255)
PURP2 = (58, 32, 52, 255)
GRASS = (58, 90, 64, 255)
FOG = lambda a: (26, 21, 16, a)
TRANS = (0, 0, 0, 0)
SHADOW = (0, 0, 0, 70)

W, H = 960, 540
SIZE = 48


def put(im, x, y, c):
    if 0 <= x < im.width and 0 <= y < im.height and c[3]:
        # never overwrite opaque with fog; fog only fills empty/partial
        if c[3] < 255:
            cur = im.getpixel((x, y))
            if cur[3] == 255:
                return
            if cur[3] > c[3] and cur[0] == 26:
                return
        im.putpixel((x, y), c)


def R(im, x, y, w, h, c):
    for j in range(max(0, h)):
        for i in range(max(0, w)):
            put(im, x + i, y + j, c)


def box(im, x, y, w, h, fill, edge=INK):
    R(im, x, y, w, h, fill)
    for i in range(w):
        put(im, x + i, y, edge)
        put(im, x + i, y + h - 1, edge)
    for j in range(h):
        put(im, x, y + j, edge)
        put(im, x + w - 1, y + j, edge)


def in_combat(x, y):
    return 120 <= x <= 780 and 180 <= y <= 420


# ─── mid thicken ───────────────────────────────────────────────
def thicken_mid():
    im = Image.open(f"{SCENES}/battle_mid.png").convert("RGBA")
    rng = random.Random(2105)

    # Rope knots under top beam T-brackets (around y~60-90)
    for bx in range(180, 780, 50):
        R(im, bx, 78, 4, 3, WOOD)
        R(im, bx + 1, 80, 2, 4, WOOD2)
        put(im, bx + 1, 84, GOLD)
        put(im, bx + 2, 84, GOLD)

    # Extra hanging lanterns (hard opaque) between existing denser gaps
    for lx in (210, 310, 460, 560, 710):
        R(im, lx, 88, 10, 12, WOOD2)
        R(im, lx + 1, 90, 8, 8, CINN)
        R(im, lx + 3, 92, 4, 4, PAPER)
        put(im, lx + 4, 94, GOLD)
        R(im, lx + 4, 86, 2, 3, INK)  # hang cord

    # Small left road plaque (outside combat core, upper-left)
    box(im, 40, 140, 28, 40, PAPER, WOOD)
    R(im, 44, 148, 20, 2, INK)
    R(im, 44, 154, 16, 2, TEAL)
    R(im, 44, 160, 18, 2, GOLD)
    R(im, 44, 166, 12, 2, INK)
    R(im, 50, 178, 8, 6, WOOD2)  # post

    # Small mid-left hanging scroll (upper, y < 180)
    box(im, 95, 100, 18, 50, PAPER, WOOD)
    R(im, 99, 108, 10, 2, CINN)
    R(im, 99, 116, 10, 2, INK)
    R(im, 99, 124, 10, 2, TEAL)
    R(im, 99, 132, 8, 2, INK)
    R(im, 102, 96, 4, 5, WOOD)  # hang

    # Corner lattice markers (4 corners of mid zone, hard)
    for cx, cy in ((30, 70), (900, 70), (30, 470), (900, 470)):
        R(im, cx, cy, 18, 3, GOLD)
        R(im, cx, cy, 3, 18, GOLD)
        R(im, cx + 1, cy + 1, 2, 2, SILVER)

    # Far hanging scroll right (near existing vertical board, upper)
    box(im, 820, 100, 16, 56, PAPER, WOOD)
    for i, col in enumerate((INK, GOLD, TEAL, INK, CINN, INK)):
        R(im, 824, 108 + i * 7, 8, 2, col)
    R(im, 826, 94, 4, 7, WOOD)

    # Copper-coin motif dots along top beam underside (not combat)
    for i, cx in enumerate(range(200, 760, 40)):
        cy = 95 + (i % 3) * 2
        R(im, cx, cy, 6, 6, GOLD)
        R(im, cx + 2, cy + 2, 2, 2, INK)
        put(im, cx + 1, cy + 1, SILVER)

    # Right-edge thicker fog transition (partial alpha only)
    for x in range(880, 960):
        dens = int(40 + (x - 880) * 1.2)
        for y in range(H):
            if rng.random() < 0.35:
                a = min(120, dens + rng.randint(-10, 20))
                put(im, x, y, FOG(a))

    # Scattered ink fog dots — keep combat sparse
    for _ in range(420):
        x = rng.randint(0, W - 1)
        y = rng.randint(40, 500)
        if in_combat(x, y) and rng.random() < 0.7:
            continue
        a = rng.choice([14, 21, 28, 35, 48])
        put(im, x, y, FOG(a))
        if rng.random() < 0.3:
            put(im, x + 1, y, FOG(a))

    # Extra small notice board upper-right of combat (y<180)
    box(im, 700, 110, 36, 28, PAPER, WOOD2)
    R(im, 706, 116, 24, 2, INK)
    R(im, 706, 122, 20, 2, GOLD)
    R(im, 706, 128, 22, 2, TEAL)
    R(im, 714, 136, 8, 6, WOOD)

    # Beam detail: gold nail heads on top bar
    for bx in range(175, 780, 25):
        put(im, bx, 62, GOLD)
        put(im, bx + 1, 62, GOLD)

    # Bottom edge mid lamps — add a third small lamp left of existing pair area
    # existing around x=280 and x=620 y~420; add at x=450 only pedestal tip outside combat? skip combat
    # instead add lamp near left outside combat x=90
    R(im, 88, 400, 14, 10, STONE)
    R(im, 90, 398, 10, 3, WOOD)
    R(im, 92, 392, 6, 6, CINN)
    put(im, 94, 394, PAPER)

    im.save(f"{SCENES}/battle_mid.png")
    return im


# ─── props thicken ─────────────────────────────────────────────
def thicken_props():
    im = Image.open(f"{SCENES}/battle_props.png").convert("RGBA")
    rng = random.Random(2110)

    # Stronger left frame pillar
    R(im, 0, 60, 14, 420, WOOD2)
    R(im, 2, 62, 8, 416, WOOD)
    R(im, 0, 60, 14, 3, INK)
    R(im, 0, 476, 14, 4, INK)
    # pillar shadow (partial ok for prop shadow? task says hard edge opaque for new elements;
    # existing uses partial shadow — keep thin opaque shade strip)
    R(im, 14, 70, 4, 400, SHADE)

    # Stronger right frame pillar
    R(im, 946, 60, 14, 420, WOOD2)
    R(im, 950, 62, 8, 416, WOOD)
    R(im, 946, 60, 14, 3, INK)
    R(im, 946, 476, 14, 4, INK)
    R(im, 942, 70, 4, 400, SHADE)

    # Extra left lanterns on pillar
    for ly in (120, 280, 400):
        R(im, 16, ly, 12, 14, WOOD)
        R(im, 18, ly + 2, 8, 10, PAPER)
        R(im, 18, ly, 8, 2, CINN)
        R(im, 18, ly + 12, 8, 2, CINN)
        put(im, 21, ly + 6, GOLD)

    # Extra right lanterns
    for ly in (150, 320):
        R(im, 930, ly, 12, 14, WOOD)
        R(im, 932, ly + 2, 8, 10, PAPER)
        R(im, 932, ly, 8, 2, CINN)
        R(im, 932, ly + 12, 8, 2, CINN)
        put(im, 935, ly + 6, GOLD)

    # Left barricade spikes denser (outside combat x<120)
    for i, sx in enumerate(range(20, 110, 12)):
        h = 18 + (i % 3) * 6
        tip_y = 460 - h
        R(im, sx, tip_y, 4, h, WOOD2)
        R(im, sx + 1, tip_y - 4, 2, 5, INK)
        put(im, sx + 1, tip_y - 5, WOOD)
        # sandbag behind
        R(im, sx - 2, 455, 10, 8, WOOD3)
        R(im, sx - 1, 456, 8, 5, WOOD)

    # Right money bags near existing chests (x>~780 bottom)
    for bx, by in ((800, 448), (830, 452), (860, 446), (890, 450)):
        box(im, bx, by, 16, 12, GOLD, INK)
        R(im, bx + 4, by + 3, 8, 2, CINN)
        R(im, bx + 6, by - 3, 4, 4, SILVER)
        put(im, bx + 7, by - 4, INK)

    # Leaf band across bottom (hard opaque dots)
    for x in range(40, 920, 7):
        y = 465 + rng.randint(0, 8)
        col = rng.choice([CINN, WOOD2, TEAL, GOLD, GRASS, PAPER])
        put(im, x, y, col)
        if rng.random() < 0.4:
            put(im, x + 1, y, col)
        if rng.random() < 0.25:
            put(im, x, y + 1, GRASS)

    # Grass tufts left/right bottom outside combat
    for gx in list(range(10, 120, 14)) + list(range(820, 950, 14)):
        R(im, gx, 458, 2, 6, TEAL)
        R(im, gx + 3, 456, 2, 8, GRASS)
        put(im, gx + 1, 455, TEAL)

    # Edge column base blocks
    R(im, 0, 470, 40, 12, WOOD2)
    R(im, 4, 472, 30, 6, WOOD)
    R(im, 920, 470, 40, 12, WOOD2)
    R(im, 926, 472, 30, 6, WOOD)

    # Extra small sandbag pile mid-left bottom (x~100)
    R(im, 100, 448, 22, 14, WOOD3)
    R(im, 104, 450, 14, 8, WOOD)
    R(im, 108, 444, 10, 6, WOOD2)
    R(im, 110, 446, 6, 3, CINN)

    # Coin scatter near right bags
    for cx, cy in ((780, 460), (792, 464), (810, 462), (845, 466), (875, 463)):
        R(im, cx, cy, 4, 4, GOLD)
        put(im, cx + 1, cy + 1, INK)

    im.save(f"{SCENES}/battle_props.png")
    return im


# ─── sprites ────────────────────────────────────────────────────
def put_s(im, x, y, c):
    if 0 <= x < SIZE and 0 <= y < SIZE and c[3]:
        im.putpixel((x, y), c)


def Rs(im, x, y, w, h, c):
    for j in range(max(0, h)):
        for i in range(max(0, w)):
            put_s(im, x + i, y + j, c)


def box_s(im, x, y, w, h, fill, edge=INK):
    Rs(im, x, y, w, h, fill)
    for i in range(w):
        put_s(im, x + i, y, edge)
        put_s(im, x + i, y + h - 1, edge)
    for j in range(h):
        put_s(im, x, y + j, edge)
        put_s(im, x + w - 1, y + j, edge)


def circuit_swan_attack():
    """Exaggerated attack: wider wings, beak thrust, brighter core, circuit flash."""
    im = Image.new("RGBA", (SIZE, SIZE), TRANS)
    # crown taller
    Rs(im, 20, 0, 8, 3, CINN)
    Rs(im, 18, 1, 12, 2, SILVER)
    Rs(im, 16, 2, 16, 3, GOLD)
    Rs(im, 18, 3, 12, 3, GOLD)

    # outer gold frame — wider wing tips
    Rs(im, 0, 6, SIZE, 2, GOLD)
    # left wing spread
    for y, span in [(7, 2), (8, 0), (9, 0), (10, 0), (11, 0)]:
        pass
    # body violet/ink with wider wings
    Rs(im, 2, 7, 44, 2, GOLD)
    Rs(im, 2, 8, 44, 4, PURP)
    Rs(im, 0, 8, 4, 4, CINN)   # left wing tip flash
    Rs(im, 44, 8, 4, 4, CINN)  # right wing tip flash
    Rs(im, 4, 9, 40, 3, PURP)
    Rs(im, 6, 10, 36, 2, PURP2)

    # horizontal ink bands
    Rs(im, 2, 12, 44, 2, INK)
    Rs(im, 4, 13, 40, 2, PURP)
    Rs(im, 2, 14, 44, 2, INK)

    # upper body
    Rs(im, 4, 15, 40, 3, PURP)
    Rs(im, 6, 15, 36, 3, INK)

    # eyes — larger brighter
    box_s(im, 10, 17, 10, 8, GOLD)
    Rs(im, 12, 19, 6, 4, CINN)
    put_s(im, 14, 20, PAPER)
    box_s(im, 28, 17, 10, 8, GOLD)
    Rs(im, 30, 19, 6, 4, CINN)
    put_s(im, 32, 20, PAPER)

    # beak / core thrust forward (larger, brighter)
    Rs(im, 18, 24, 12, 3, STONE)
    Rs(im, 19, 25, 10, 2, SILVER)
    box_s(im, 14, 27, 20, 12, GOLD)
    Rs(im, 16, 29, 16, 8, CINN)
    Rs(im, 18, 31, 12, 4, PAPER)  # bright core
    Rs(im, 20, 32, 8, 2, CINN)

    # circuit gold lines flash across body
    for y in (15, 22, 26, 36):
        for x in range(4, 44, 3):
            put_s(im, x, y, GOLD)
            put_s(im, x + 1, y, SILVER)

    # side wing flaps lower — extended
    Rs(im, 0, 36, 10, 6, PURP)
    Rs(im, 2, 37, 6, 4, CINN)
    Rs(im, 38, 36, 10, 6, PURP)
    Rs(im, 40, 37, 6, 4, INK)
    # gold wing outline
    Rs(im, 0, 36, 10, 1, GOLD)
    Rs(im, 38, 36, 10, 1, GOLD)
    Rs(im, 0, 41, 10, 1, GOLD)
    Rs(im, 38, 41, 10, 1, GOLD)

    # base nodes brighter
    box_s(im, 4, 38, 10, 6, PAPER)
    Rs(im, 6, 40, 6, 3, CINN)
    box_s(im, 34, 38, 10, 6, PAPER)
    Rs(im, 36, 40, 6, 3, INK)
    Rs(im, 2, 41, 44, 2, GOLD)

    # spark flashes around
    for x, y in ((1, 14), (46, 14), (8, 6), (39, 6), (22, 44), (12, 44), (36, 44),
                 (3, 28), (44, 28), (24, 12)):
        put_s(im, x, y, GOLD)
        put_s(im, x, y + 1, SILVER)

    # soft ground shadow (match idle style)
    Rs(im, 10, 44, 28, 2, SHADOW)

    return im


def lock_hermit_attack():
    """Staff/lock thrust forward, sleeve flare, gold lock flash. Keep recognizable."""
    im = Image.new("RGBA", (SIZE, SIZE), TRANS)
    lean = 3  # lean right (attack direction)

    # hat (official)
    Rs(im, 16 + lean, 0, 12, 2, TEAL)
    Rs(im, 14 + lean, 1, 16, 2, TEAL)
    Rs(im, 12 + lean, 2, 20, 2, TEAL2)
    Rs(im, 10 + lean, 3, 8, 3, INK)   # side wing
    Rs(im, 26 + lean, 3, 8, 3, INK)
    Rs(im, 12 + lean, 4, 20, 4, INK)
    Rs(im, 14 + lean, 3, 16, 2, TEAL)

    # face
    box_s(im, 15 + lean, 8, 14, 10, SKIN)
    put_s(im, 18 + lean, 11, INK)
    put_s(im, 24 + lean, 11, INK)
    Rs(im, 19 + lean, 14, 5, 2, CINN)

    # left arm sleeve flare + lock/lantern thrust FORWARD (left-down-left push)
    # lantern pushed left-forward
    Rs(im, 2, 14, 6, 3, GOLD)
    box_s(im, 1, 16, 12, 14, PAPER)
    Rs(im, 3, 18, 8, 6, CINN)
    Rs(im, 4, 20, 6, 3, INK)
    Rs(im, 5, 21, 4, 2, GOLD)  # lock flash core
    # sleeve flare left
    Rs(im, 10, 18, 6, 10, TEAL2)
    Rs(im, 11, 19, 4, 8, SHADE)

    # torso
    box_s(im, 14 + lean, 18, 18, 14, TEAL2)
    Rs(im, 15 + lean, 19, 2, 12, SHADE)
    # belt
    Rs(im, 14 + lean, 30, 18, 4, GOLD)
    put_s(im, 22 + lean, 31, SILVER)

    # right sleeve flare + staff thrust UP-RIGHT
    Rs(im, 32 + lean, 16, 8, 12, TEAL2)
    Rs(im, 33 + lean, 17, 5, 8, SHADE)
    # staff pushed forward/up
    Rs(im, 40, 2, 4, 36, INK)
    Rs(im, 39, 1, 6, 4, GOLD)  # staff head
    Rs(im, 40, 2, 4, 2, SILVER)
    # lock seal near staff tip flash
    box_s(im, 38, 8, 8, 8, GOLD)
    Rs(im, 40, 10, 4, 4, CINN)
    put_s(im, 41, 11, PAPER)

    # legs
    Rs(im, 16 + lean, 34, 6, 8, TEAL2)
    Rs(im, 26 + lean, 34, 6, 8, TEAL2)
    Rs(im, 15 + lean, 41, 8, 4, BOOT)
    Rs(im, 25 + lean, 41, 8, 4, BOOT)
    Rs(im, 15 + lean, 41, 8, 1, INK)
    Rs(im, 25 + lean, 41, 8, 1, INK)

    # gold sparkles (lock flash)
    for x, y in ((0, 18), (0, 24), (14, 16), (36, 4), (46, 6), (46, 14),
                 (34, 12), (8, 14), (22, 6), (30, 36), (12, 36)):
        put_s(im, x, y, GOLD)
        if (x + y) % 2 == 0:
            put_s(im, x + 1, y, SILVER)

    Rs(im, 14 + lean, 44, 20, 2, SHADOW)
    return im


def make_sheet(idle_path, attack_im, sheet_path, attack_path):
    idle = Image.open(idle_path).convert("RGBA")
    attack_im.save(attack_path)
    sh = Image.new("RGBA", (SIZE * 2, SIZE), TRANS)
    sh.paste(idle, (0, 0), idle)
    sh.paste(attack_im, (SIZE, 0), attack_im)
    sh.save(sheet_path)
    return sh


def preview_stack():
    g = Image.open(f"{SCENES}/battle_ground.png").convert("RGBA")
    m = Image.open(f"{SCENES}/battle_mid.png").convert("RGBA")
    w = Image.open(f"{SCENES}/core_wall.png").convert("RGBA")
    p = Image.open(f"{SCENES}/battle_props.png").convert("RGBA")
    out = Image.new("RGBA", (W, H), (232, 220, 200, 255))
    for layer in (g, m, w, p):
        out = Image.alpha_composite(out, layer)
    out.save(f"{SCENES}/_preview_stack.png")
    out.resize((W // 2, H // 2), Image.NEAREST).save(f"{SCENES}/_preview_stack_half.png")


def stats(path):
    im = Image.open(path)
    px = list(im.getdata())
    tot = len(px)
    a0 = sum(1 for c in px if c[3] == 0)
    a_p = sum(1 for c in px if 0 < c[3] < 255)
    a255 = sum(1 for c in px if c[3] == 255)
    return im.size, im.mode, a0 / tot * 100, a_p / tot * 100, a255 / tot * 100


def main():
    print("thicken mid…")
    thicken_mid()
    print("thicken props…")
    thicken_props()
    print("circuit_swan attack…")
    swan_atk = circuit_swan_attack()
    make_sheet(
        f"{SPRITES}/circuit_swan.png",
        swan_atk,
        f"{SPRITES}/circuit_swan_sheet.png",
        f"{SPRITES}/circuit_swan_attack.png",
    )
    print("lock_hermit attack…")
    herm_atk = lock_hermit_attack()
    make_sheet(
        f"{SPRITES}/lock_hermit.png",
        herm_atk,
        f"{SPRITES}/lock_hermit_sheet.png",
        f"{SPRITES}/lock_hermit_attack.png",
    )
    print("preview…")
    preview_stack()
    for p in [
        f"{SCENES}/battle_mid.png",
        f"{SCENES}/battle_props.png",
        f"{SPRITES}/circuit_swan_attack.png",
        f"{SPRITES}/circuit_swan_sheet.png",
        f"{SPRITES}/lock_hermit_attack.png",
        f"{SPRITES}/lock_hermit_sheet.png",
    ]:
        print(p, stats(p))
    print("done")


if __name__ == "__main__":
    main()
