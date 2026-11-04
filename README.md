# 銀樓防衛（Yinlou Defense）· v4.0.0

武俠 × 金融江湖嘅 **HTML5 合併塔防**（Merge TD）。目錄 `yinlou-defense`。

玩法對齊 Fortias Defense／Pixel Defenders 一類「召喚 → 合併升星 → 守城」循環，**原創主題與角色綽號**，影射《金融群俠傳》氣氛但唔用真人真名真樣、唔抄金庸／Fortias IP。

## 線上玩

https://lnaltv3v.github.io/yinlou-defense/

> GitHub Pages 來源分支：而家 `gh-pages`（v1.5 起；`pages-clean` 仍同步鏡像。`main`／`master` 保留完整專案＋文件。發版時需同步更新 Pages 來源分支靜態檔。）

## 點玩（本地）

```bash
cd /workspace/yinlou-defense
python3 -m http.server 8765
# 瀏覽器開 http://127.0.0.1:8765/
```

### 操作
1. **拖**底欄俠客到場上**空格**放置（同種愈召愈貴；頭上有**技能蓄力條**）。
2. **拖**同種同星合併升星（有銀兩回報；最高 **4** 星）；拖到空格可調位。
3. **點**場上俠客 → 下方**強化**（刀利／甲厚／內息）；齊人觸發**羈絆**；按「開波」；Boss／精英有技能。
4. 開局／失敗畫面可撳**推薦陣容**（跟本關敵組成動態提示）；**設定**可關卡關提示／閃光／震屏，並匯出／匯入存檔 JSON。
5. 守住銀樓核心；頂列選關 1–14（含雙墨夜帳等）；失敗可跟推薦重整；無盡有里程碑橫幅；通關第 1 關後解鎖**無盡**同**每日**。
6. 手機建議**橫屏**；直屏會提示。

## 技術
- 純前端 Vanilla JS，無框架
- Canvas 960×540，pixelated
- 存檔：`localStorage` key `yinlou-defense-save-v1`（version **38**；可 JSON 匯出／匯入）

## 版本
而家 **v4.0.0**（550十二池、符咒三欄／套裝共鳴、分享卡短碼一鍵、回放 scrub／折線、手勢軌跡／結算打磨；存檔 v40；音檔仍後補）。詳見 `CHANGELOG.md`、`DESIGN.md`。

### 已知問題／後補
- 戰場已接**場景四層 PNG**（ground／mid／wall／props）；俠 **12**（鎖倉居士暫幾何）＋敵 10 正式 PNG（含帳鏡蜃）。
- 音效為 Web Audio 蜂鳴，非正式採樣／BGM。

## 授權說明
專案原創程式與文案歸專案所有人。內部參考圖放本機 `assets/_ref/`（已 gitignore），勿對外發佈為遊戲素材。
