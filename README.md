# 銀樓防衛（Yinlou Defense）

武俠 × 金融江湖嘅 **HTML5 合併塔防**（Merge TD）。目錄 `yinlou-defense`。

玩法對齊 Fortias Defense／Pixel Defenders 一類「召喚 → 合併升星 → 守城」循環，**原創主題與角色綽號**，影射《金融群俠傳》氣氛但唔用真人真名真樣、唔抄金庸／Fortias IP。

## 線上玩

https://lnaltv3v.github.io/yinlou-defense/

> GitHub Pages 來源分支：`pages-clean`（orphan 乾淨樹；`main`／`master` 保留完整專案＋文件。發版時需同步更新 `pages-clean` 嘅靜態檔。）

## 點玩（本地）

```bash
cd /workspace/yinlou-defense
python3 -m http.server 8765
# 瀏覽器開 http://127.0.0.1:8765/
```

### 操作
1. **拖**底欄俠客到場上**空格**放置（同種愈召愈貴；頭上有**技能蓄力條**）。
2. **拖**同種同星合併升星（有銀兩回報；最高 **4** 星）；拖到空格可調位。
3. 齊人觸發**羈絆**（有橫幅提示）；按「開波」；留意**精英波**。
4. 開局／失敗畫面可撳**推薦陣容**；**設定**可匯出／匯入存檔 JSON。
5. 守住銀樓核心；頂列選關 1–5（第 5「熔斷黎明」）；無盡有里程碑銀兩；通關第 1 關後解鎖**無盡**同**每日**。
6. 手機建議**橫屏**；直屏會提示。

## 技術
- 純前端 Vanilla JS，無框架
- Canvas 960×540，pixelated
- 存檔：`localStorage` key `yinlou-defense-save-v1`（v6；可 JSON 匯出／匯入）

## 版本
而家 **v0.6.0**。詳見 `CHANGELOG.md`、`DESIGN.md`。

## 授權說明
專案原創程式與文案歸專案所有人。內部參考圖放本機 `assets/_ref/`（已 gitignore），勿對外發佈為遊戲素材。
