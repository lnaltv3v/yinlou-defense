# 銀樓防衛 — 首輪正式精靈（墨點銀樓）

- 風格：墨點金融江湖／硬邊／嚴格色盤（見 ART.md）
- 原生：每幀 **48×48** RGBA；sheet = idle | attack 橫排 **96×48**
- 生成：`tools/gen_round1_sprites.py`（Pillow 點陣，非寫實 AI）；`dip_buyer` 另補
- 停手線：首輪約 95%；場景 PNG 第二輪

## 俠客（8＋抄底居士）
| id | 名 | 檔 |
|----|----|----|
| long_bull | 多頭刀客 | `long_bull.png` / `_attack` / `_sheet` |
| short_blade | 空頭劍客 | 同上 |
| leverage_monk | 槓桿狂僧 | 同上 |
| dividend_hermit | 股息隱士 | 同上 |
| market_guard | 莊家鐵衛 | 同上 |
| penny_assassin | 細價股刺客 | 同上 |
| ipo_herald | 招股鼓手 | 同上 |
| squeeze_blade | 逼空客 | 同上 |
| dip_buyer | 抄底居士 | 葫蘆／醫袍硃邊（v1.2 補） |

| arb_walker | 套利行者 | 銅錢／價差刀 |
| night_broker | 夜盤掮客 | 捲軸＋提燈 |

已補：halt_seal（停牌符）idle／attack／sheet（v1.5）

## 敵人（8）
| id | 名 |
|----|----|
| retail_tide | 散戶潮 |
| chase_zombie | 追高殭屍 |
| leverage_fiend | 槓桿妖 |
| black_swan | 黑天鵝 |
| margin_call | 追保令 |
| panic_board | 恐慌盤 |
| rumor_swarm | 傳聞蚊 |
| dark_tape | 暗盤影 |

敵人正式 PNG 已齊（含 rumor_swarm／dark_tape／halt_seal）。場景見 `assets/scenes/` 四層。

## 接入提示
- `*.png` = idle；`*_attack.png`；`*_sheet.png` frame0=idle frame1=attack
- `_round1_roster.png`／`_round1_roster_x4.png` 僅 QA，唔使入遊戲


## v1.9
| lock_hermit | 鎖倉居士 | `lock_hermit.png`／`_attack`／`_sheet`（已有；v2.1 覆寫 attack） |


已補：`circuit_swan`（熔斷天鵝）idle／attack／sheet（v1.9）；缺檔仍借黑天鵝幀／幾何。


## v2.0
- `halt_tide`（停牌潮）：未派正式 PNG；執行時借 `halt_seal` idle／attack，否則幾何。
- `circuit_swan`／`lock_hermit` 維持既有正式 PNG。


## v2.1
- `halt_tide`／`halt_tide_attack`／`halt_tide_sheet`：正式 PNG（48×48／sheet 96×48）；程式 `CACHE_VER=2.1.0`。
- `circuit_swan_attack`／`circuit_swan_sheet`：attack 加厚（翼展／喙刺、電路金線閃、硃紅核更亮）；idle 保留（2026-11-05）。
- `lock_hermit_attack`／`lock_hermit_sheet`：attack 加厚（杖／鎖印前推、金鎖閃、袍袖揚）；idle 保留（2026-11-05）。改正「暫無 PNG」。
- 生成：`tools/gen_thicken_v21.py`（Pillow 點陣）。


## v2.2
- `circuit_swan_attack`／`_sheet`、`lock_hermit_attack`／`_sheet` 覆寫；`CACHE_VER=2.2.0`。


## v2.3
- `ink_specter`（墨影帳／第四 Boss）：`ink_specter.png`／`_attack`／`_sheet` 正式 PNG（48×48／sheet 96×48）；帳幔＋帳頁裂縫墨核＋金邊帳角＋墨霧；有別 `dark_tape` 窄身披風。生成：`tools/gen_ink_specter.py`（Pillow 點陣，2026-11-05）。

## v2.4
- `ink_specter`／`_attack`／`_sheet`：正式接入遊戲載入路徑（同 halt_tide／circuit_swan）；`CACHE_VER=2.4.0`。


## v3.3.0 素材（帳鏡蜃）
- sprites.js `CACHE_VER=3.3.0`；`KNOWN_IDS` 含 ledger_mirage；ensure 載 idle／attack／sheet，唔再淨借 ink_specter。

- `ledger_mirage`（帳鏡蜃／第五 Boss）：`ledger_mirage.png`／`_attack`／`_sheet` 正式 PNG（48×48／sheet 96×48）；對摺帳本＋銅鏡／鏡面蜃樓、金邊鏡框、帳頁反光宣紙條、硃紅印、蜃氣波紋點；主色鏡藍灰 `#3A4858`；有別 `ink_specter` 寬垂帳幔＋裂縫墨核＋墨霧。生成：`tools/gen_ledger_mirage.py`（Pillow 點陣，2026-11-05）。
