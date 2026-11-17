#!/usr/bin/env node
// Ảnh tô chỗ lệch (CLAUDE.md §5): với mỗi ảnh cùng tên ở <truoc> và <sau>, ghi <ra>/<tên>-lech.png = ảnh SAU, điểm ảnh khác ảnh TRƯỚC tô đỏ.
// Chạy: node viec/KH-VC-2/to_cho_lech.js <truoc> <sau> <ra>
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const [truoc, sau, ra] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const t = await b.newPage();
  for (const f of fs.readdirSync(sau).filter((x) => x.endsWith('.png') && fs.existsSync(path.join(truoc, x)))) {
    const url = await t.evaluate(async ([u, v]) => {
      const nap = (s) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = 'data:image/png;base64,' + s; });
      const [p, q] = await Promise.all([nap(u), nap(v)]);
      const c = document.createElement('canvas'); c.width = q.width; c.height = q.height;
      const g = c.getContext('2d'); g.drawImage(p, 0, 0); const m = g.getImageData(0, 0, c.width, c.height).data;
      g.drawImage(q, 0, 0); const anh = g.getImageData(0, 0, c.width, c.height); const n = anh.data;
      for (let k = 0; k < n.length; k += 4) if (Math.abs(m[k] - n[k]) + Math.abs(m[k + 1] - n[k + 1]) + Math.abs(m[k + 2] - n[k + 2]) > 30) { n[k] = 230; n[k + 1] = 0; n[k + 2] = 0; }
      g.putImageData(anh, 0, 0);
      return c.toDataURL('image/png');
    }, [fs.readFileSync(path.join(truoc, f)).toString('base64'), fs.readFileSync(path.join(sau, f)).toString('base64')]);
    fs.writeFileSync(path.join(ra, f.replace(/\.png$/, '-lech.png')), Buffer.from(url.split(',')[1], 'base64'));
    console.log('tô', f);
  }
  await b.close();
})();
