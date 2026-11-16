#!/usr/bin/env node
// Chụp các màn mẫu của bản thiết kế chủ quán duyệt 15.11 (viec/KH-THE-3/ban_thiet_ke.html, mở bằng Chromium từ thư mục kho để thấy ảnh) → so_anh/thiet_ke/<màn>_<vang|kc>.png.
// Ảnh "trước" / "sau" của App thật do cong_cu/thu_KHTHE3.js chụp (LUU_ANH_DIR; GOC_THU = cây gốc cho bản "trước"). Dữ liệu mẫu là dữ liệu thử, KHÔNG phải của khách thật.
// Chạy: node viec/KH-THE-3/chup_thiet_ke.js
'use strict';
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const RA = path.join(__dirname, 'so_anh', 'thiet_ke');
const MAN = [['uudai', '#uu-dai'], ['don_the', '#don-the'], ['chao_mung', '#chao-mung']];

(async () => {
  const pw = require('playwright');
  fs.mkdirSync(RA, { recursive: true });
  const trinh = await pw.chromium.launch({ args: ['--no-sandbox'] });
  const t = await (await trinh.newContext({ viewport: { width: 1000, height: 1200 }, deviceScaleFactor: 2, reducedMotion: 'reduce' })).newPage();
  await t.goto(pathToFileURL(path.join(__dirname, 'ban_thiet_ke.html')).href);
  await t.waitForTimeout(500);
  for (const hang of ['vang', 'kc']) {
    await t.locator(`.chon-the button[data-hang="${hang}"]`).click();
    await t.waitForTimeout(200);
    for (const [ten, sel] of MAN) {
      const khung = t.locator(`${sel} .man-hinh`).first();
      await khung.scrollIntoViewIfNeeded();
      await khung.screenshot({ path: path.join(RA, `${ten}_${hang}.png`) });
    }
    await t.locator('#mau-the .bay').first().screenshot({ path: path.join(RA, `mau_the_${hang}.png`) });
  }
  await trinh.close();
  console.log('xong:', fs.readdirSync(RA).join(', '));
})().catch((e) => { console.error(e); process.exit(1); });
