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
