# 銀樓防衛 — 美術短規範（v2.5）

## 風格名
**墨點金融江湖（Ink-Pixel Finance）**：宣紙底、墨點色塊、硬邊直角、統一點陣。質感密度可對齊市面 Merge TD／Fortias 級**可讀性**，但**原創構圖與造型，唔抄 IP**。

## Canvas
- 邏輯解析度 **960×540**
- CSS：`image-rendering: pixelated`（或 `crisp-edges`）
- 之後正式素材建議原生 480×270 再 ×2 顯示亦可

## 色盤（優先）
| 用途 | 色 |
|------|-----|
| 墨黑 | `#1A1510` |
| 宣紙 | `#E8DCC8` |
| 硃紅 | `#C45C4A` |
| 青綠 | `#3A7A6A` |
| 青衫 | `#2A6A6A` |
| 醫袍紅 | `#A04040` |
| 梵紫 | `#5A4060` |
| 金邊（3 星／羈絆／Boss） | `#C9A227` |
| 銀兩 | `#D4AF37` |
| UI 深底 | `#2A241C` |

禁止：寫實貼圖、高清 AI 圖直接入遊戲、柔邊抗鋸齒混入像素層、盤外螢光色濫用。

## 參考圖（只作密度，唔抄；**已 gitignore，唔入公開 repo／Pages**）
- 本機 `assets/_ref/`：Fortias 地板密度、Pixel Defenders App Store 介面密度參考。
- **唔可描摹或商用對方資產／商標**。

## 場景（v1.0 程式繪製）
- 戰場：磚縫、草點、落葉點、lane 細線、右方出生陰影。
- 防線：左側木牆柱＋火把閃爍、木箱、旗幟。
- 核心：瓦簷、匾額「銀樓」、窗門、石階、雙燈籠微動。

## 精靈（現況 v1.0）
- Canvas **幾何色塊＋剪影**：帽／刀／劍／盾／杖／鼓／鉤／面巾。
- **Idle**：上下微 bob；**攻擊**：武器／身體短揮擊偏移（`swingT`）。
- 滿星：金邊＋「滿」角標＋輕光暈；護盤時金框閃。
- **下輪可換正式精靈**：`assets/sprites/` 下 PNG；換入時保留色盤與硬邊。

## v0.6 加厚
- 遠景墨點雲、右下拒馬／沙袋、牆邊銅錢箱。
- 單位：腰帶金扣、靴、唇印；技能蓄力／CD 細條（HP 下）。
- 精英敵：硃紅脈動框＋「精英」標。
- 羈絆橫幅（金邊）；精英來襲橫幅（硃紅）。
- **商店**：28×28 硬邊色塊頭像（剪影武器／帽／盾），唔用外圖。

## UI
- 硬邊框、墨底、硃紅／青綠強調按鈕。
- 欄位高亮：可放置青綠脈動、可合併金邊、無效硃紅。
- Boss 入場：金邊橫幅＋淡紫幕。
- 飄字：傷害乳白／硃紅，治療青綠，銀兩金，技能名彩色。


## v0.6
- 新剪影 `coin`（套利行者銅錢）；4 星光暈更亮、「滿」字僅 4 星。
- 場景／敵人仍程式像素；正式 PNG 後備。

## v1.0 加厚
- 強化角標（刀／甲／息等級字）畫喺星級下。
- Boss／精英放技時白框閃。
- 背景靜態層離屏快取；火把仍每幀閃。
- 音效為 Web Audio 方波／三角蜂鳴，無外部音檔。

## v1.0 可讀性
- 俠客：腳下門派色環＋姓名首字標；夜盤掮客剪影＝捲軸＋提燈（`scroll`）
- 戰場：右緣燈柱、銅錢紋、磚縫；核心石柱／瓦簷／門環
- 暗盤影：半透明 stealth；被標記時金標＋紫框
- 正式 PNG 精靈仍後備（建議下輪若繼續加厚角色密度，可申請專職像素美術幫手）


## 精靈（v1.5 正式 PNG）
- 路徑：`assets/sprites/{id}.png`（idle）、`{id}_attack.png`、`{id}_sheet.png`（96×48＝idle|attack）
- 載入：`js/sprites.js`；有圖用圖、無圖／載入失敗 → 幾何剪影 fallback（唔硬依賴）
- 商店頭像：idle PNG；`onerror` 回幾何
- 首輪見 `assets/sprites/MANIFEST.md`（墨點銀樓）；`_round1_roster*` 僅 QA，gitignore
- 敵方含 `rumor_swarm`／`dark_tape`／`halt_seal` 已齊；俠 11 齊。場景四層見 `assets/scenes/MANIFEST.md`

## 場景分層（v1.5）
- `assets/scenes/battle_ground.png`／`battle_mid.png`／`core_wall.png`／`battle_props.png`（960×540）
- 疊加：ground → mid → wall → 單位／FX → props；動態火把／燈籠／受擊／HP 仍程式



## v1.9
- 新剪影 `brush`（鎖倉居士鐵筆＋印匣）；敵「鎖倉」青綠框標。
- 鎖倉居士暫無正式 PNG → 幾何 fallback；場景四層維持。


## 鎖倉居士（v1.9）
- `assets/sprites/lock_hermit.png`／`_attack`／`_sheet`（48×48／96×48）
- `sprites.js` `KNOWN_IDS` 含 `lock_hermit`；`CACHE_VER=1.7.0`；缺檔回退幾何 brush／locker 剪影


## 熔斷天鵝（v1.9）
- `assets/sprites/circuit_swan.png`／`_attack`／`_sheet`（48×48／96×48）
- 缺檔 fallback：借 `black_swan` 幀，再幾何金邊標


## v2.0
- `battle_ground.png`／`core_wall.png` 再加厚（2026-11-05）；cache bust `2.0.0`。
- 停牌潮（`halt_tide`）暫無正式 PNG：借 `halt_seal` 幀／幾何 fallback；circuit_swan／lock_hermit 已有 PNG 勿覆蓋壞掉。


## v2.1
- `halt_tide.png`／`_attack`／`_sheet` 正式接入（48×48）；缺檔借 `halt_seal`。
- mid／props 未再加厚；ground／wall 維持 v2.0。


## v2.2
- `battle_mid`／`battle_props` 再加厚；`circuit_swan`／`lock_hermit` `_attack`／`_sheet` 覆寫接入。
- 畫面反饋：`tripleTideWarn`／`mergeRing`。


## v2.3
- 新 Boss `ink_specter`（墨影帳）：v2.3 先借 `dark_tape`／幾何；**v2.5 正式 PNG 已接入**。

## v2.5
- `ink_specter`／`ink_specter_attack`／`ink_specter_sheet`：**正式 PNG 已接入**（48×48／sheet 96×48）；`sprites.js` 與其他 Boss 同路徑（`*.png`／`*_attack`／`*_sheet`，`CACHE_VER=2.4.0`）。缺檔時先借 `dark_tape`，再幾何。
- 場景四層 PNG 未改動。

## v2.6
- 四潮教學步驟接 Boss PNG 縮圖；合星環火花純程式；mid／props 無新檔；`CACHE_VER=2.6.0`。

## v2.7
- 牆走勢 mini canvas；mid／props 無新檔；`CACHE_VER=2.7.0`。

## v2.8
- mid／props 無新檔；`CACHE_VER=2.8.0`；雙墨 HUD 色差。

## v2.9
- mid／props 無新檔；`CACHE_VER=2.9.0`；牆走勢可匯出 PNG。


### v3.4.0 帳鏡蜃
- `assets/sprites/ledger_mirage.png`（48×48 idle）
- `ledger_mirage_attack.png`（48×48）
- `ledger_mirage_sheet.png`（96×48）
- id=`ledger_mirage`；sprites.js `KNOWN_IDS`＋ensure 路徑與其他 Boss 相同
