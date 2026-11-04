# 銀樓防衛 — 場景分層（墨點銀樓）

Canvas **960×540**，硬邊／嚴格色盤，PNG RGBA。

建議疊加（後畫喺上）：
`battle_ground` → `battle_mid` → `core_wall` → （單位／FX）→ `battle_props`

| 檔 | 內容 | 動態留給程式 |
|----|------|--------------|
| `battle_ground.png` | 遠景雲、磚地、lane、右出生陰影、燈柱、銅錢紋 | — |
| `battle_mid.png` | 中景霧／橫梁、格角標、路牌告示 | — |
| `core_wall.png` | 左木牆、銀樓核心靜態 | 火把閃、燈籠 bob、受擊閃、HP |
| `battle_props.png` | 前景拒馬尖、落葉帶、錢袋、邊柱影 | — |

預覽：`_preview_stack.png`（僅 QA）。`battle_mid`／`battle_props` 需程式加載入位先會顯示。

## v1.5
- 加厚 `battle_ground`／`core_wall`；新增 `battle_mid`／`battle_props`。
- 程式疊加：ground → mid → wall → 單位／FX → props；缺 ground／wall 回退程式底，mid／props 缺則略過。


## v1.8
- `battle_mid.png`／`battle_props.png` 覆寫加厚（2026-11-05）；cache bust 跟 `sprites.js` CACHE_VER。


## v2.0
- `battle_ground.png`／`core_wall.png` 覆寫加厚（2026-11-05）；`CACHE_VER=2.0.0`。
- 疊加仍：ground → mid → wall → 單位／FX → props；缺 ground／wall 回退程式底。


## v2.1
- `battle_mid.png`／`battle_props.png` 覆寫加厚（2026-11-05 Asia/Hong_Kong）；ground／wall 維持 v2.0。
- mid：橫梁繩結／金釘、掛燈加密、左路牌＋左捲軸、右掛軸＋小告示、格角金標、銅錢紋、右緣霧過渡、散落墨點霧；中央戰鬥帶通透。
- props：左右框柱加實＋柱影、邊柱燈籠、拒馬尖／沙袋、底落葉帶／草叢、右邊錢袋／銅錢散點；透明仍 >90%。
- `_preview_stack.png`／`_preview_stack_half.png` 重產（僅 QA）。


## v2.2
- `battle_mid.png`／`battle_props.png` 再加厚（ground／wall 維持 v2.0）。

## v2.5
- mid／props 無新加厚；程式 FX 加厚墨影帳幔／裂縫；`CACHE_VER=2.5.0`。
