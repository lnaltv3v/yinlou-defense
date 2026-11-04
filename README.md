# 銀樓防衛（Yinlou Defense）

武俠 × 金融江湖嘅 **HTML5 合併塔防**（Merge TD）。目錄 `yinlou-defense`。

玩法對齊 Fortias Defense／Pixel Defenders 一類「召喚 → 合併升星 → 守城」循環，**原創主題與角色綽號**，影射《金融群俠傳》氣氛但唔用真人真名真樣、唔抄金庸／Fortias IP。

## 線上玩

https://lnaltv3v.github.io/yinlou-defense/

## 點玩（本地）

```bash
cd /workspace/yinlou-defense
python3 -m http.server 8765
# 瀏覽器開 http://127.0.0.1:8765/
```

### 操作
1. **拖**底欄俠客到場上**空格**放置（同種愈召愈貴；每人有簡版技能）。
2. **拖**同種同星合併升星（有銀兩回報；最高 3 星）；拖到空格可調位。
3. 齊人觸發**羈絆**；按「開波」；**暫停**（Esc／P）／**圖鑑**（C）／**設定**。
4. 守住銀樓核心；頂列選關 1–4；通關第 1 關後解鎖**無盡**同**每日**。

## 技術
- 純前端 Vanilla JS，無框架
- Canvas 960×540，pixelated
- 存檔：`localStorage` key `yinlou-defense-save-v1`（v4）

## 版本
而家 **v0.4.0**。詳見 `CHANGELOG.md`、`DESIGN.md`。

## 授權說明
專案原創程式與文案歸專案所有人。參考圖僅供內部密度對照，勿對外發佈為遊戲素材。
