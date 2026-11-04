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
| lock_hermit | 鎖倉居士 | **暫無 PNG** → 幾何 `brush` fallback |


已補：`circuit_swan`（熔斷天鵝）idle／attack／sheet（v1.9）；缺檔仍借黑天鵝幀／幾何。


## v2.0
- `halt_tide`（停牌潮）：未派正式 PNG；執行時借 `halt_seal` idle／attack，否則幾何。
- `circuit_swan`／`lock_hermit` 維持既有正式 PNG。
