# 銀樓防衛（Yinlou Defense）

武俠 × 金融江湖嘅 **HTML5 合併塔防**（Merge TD）。工作標題；目錄 `yinlou-defense`。

玩法對齊 Fortias Defense／Pixel Defenders 一類「召喚 → 合併升星 → 守城」循環，**原創主題與角色綽號**，影射《金融群俠傳》氣氛但唔用真人真名真樣、唔抄金庸／Fortias IP。

## 點玩（本地）

```bash
cd /workspace/yinlou-defense
python3 -m http.server 8765
# 瀏覽器開 http://127.0.0.1:8765/
```

或直接開 `index.html`（部分瀏覽器對 module／路徑較嚴，建議用 static server）。

### 操作
1. 底欄點俠客（顯示費用）→ 再點場上**空格**放置（花銀兩）。
2. 點一名己方俠客 → 再點**同種同星**另一名 → **合併升星**（最高 3 星）。
3. 按「開波／下一波」開始敵人進攻。
4. 守住銀樓核心 HP；打完第 5 波即勝。失敗可「重來」。

## 技術
- 純前端 Vanilla JS，無框架
- Canvas 960×540，pixelated
- 存檔：`localStorage` key `yinlou-defense-save-v1`

## 目錄
```
yinlou-defense/
  index.html
  css/style.css
  js/data.js      # 俠客／敵人／關卡表
  js/render.js    # 繪製
  js/battle.js    # 戰鬥／移動／合併輔助
  js/ui.js        # HUD／輸入
  js/game.js      # 主循環／狀態
  DESIGN.md ART.md CHANGELOG.md README.md
  assets/_ref/    # 密度參考（唔入遊戲繪製）
```

## 版本
而家 **v0.1.0** — 可玩一局（放置、合併、≥5 波）。詳見 `CHANGELOG.md`、`DESIGN.md`。

## 授權說明
專案原創程式與文案歸專案所有人。參考圖僅供內部密度對照，勿對外發佈為遊戲素材。
