# 銀樓防衛（Yinlou Defense）

武俠 × 金融江湖嘅 **HTML5 合併塔防**（Merge TD）。目錄 `yinlou-defense`。

玩法對齊 Fortias Defense／Pixel Defenders 一類「召喚 → 合併升星 → 守城」循環，**原創主題與角色綽號**，影射《金融群俠傳》氣氛但唔用真人真名真樣、唔抄金庸／Fortias IP。

## 線上玩

GitHub Pages（push 後約 1 分鐘生效）：

https://lnaltv3v.github.io/yinlou-defense/

## 點玩（本地）

```bash
cd /workspace/yinlou-defense
python3 -m http.server 8765
# 瀏覽器開 http://127.0.0.1:8765/
```

### 操作
1. **拖**底欄俠客到場上**空格**放置（或點選 → 再點空格）。
2. **拖**一名俠客到**同種同星**另一名上面 → **合併升星**（最高 3 星）；拖到空格可調位。
3. 按「開波／下一波」；速度可選 1×／1.5×／2×。
4. 敵人會打最近俠客或衝銀樓核心；守住 HP，打完本關波次即勝。
5. 頂列可選關卡 1–3；通關第 1 關後解鎖**無盡**。

## 技術
- 純前端 Vanilla JS，無框架
- Canvas 960×540，pixelated
- 存檔：`localStorage` key `yinlou-defense-save-v1`

## 版本
而家 **v0.2.0**。詳見 `CHANGELOG.md`、`DESIGN.md`。

## 授權說明
專案原創程式與文案歸專案所有人。參考圖僅供內部密度對照，勿對外發佈為遊戲素材。
