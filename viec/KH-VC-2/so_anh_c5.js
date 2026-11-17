// C5: so ảnh cùng tên giữa <goc> và <nhanh> (theo pixel, qua Chromium). In: GIỐNG / KHÁC <số điểm ảnh lệch> / CHỈ MỘT BÊN.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const [goc, nhanh] = process.argv.slice(2);
const ds = (r) => fs.readdirSync(r, { recursive: true }).filter((x) => x.endsWith('.png'));
(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const t = await b.newPage();
  const a = new Set(ds(goc)), c = new Set(ds(nhanh));
  let giong = 0;
  for (const f of [...new Set([...a, ...c])].sort()) {
    if (!a.has(f) || !c.has(f)) { console.log('CHỈ MỘT BÊN', a.has(f) ? 'gốc' : 'nhánh', f); continue; }
    const x = fs.readFileSync(path.join(goc, f)), y = fs.readFileSync(path.join(nhanh, f));
    if (x.equals(y)) { giong++; continue; }
    const lech = await t.evaluate(async ([u, v]) => {
      const nap = (s) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = 'data:image/png;base64,' + s; });
      const [p, q] = await Promise.all([nap(u), nap(v)]);
      if (p.width !== q.width || p.height !== q.height) return `cỡ ${p.width}x${p.height} ≠ ${q.width}x${q.height}`;
      const lay = (i) => { const c = document.createElement('canvas'); c.width = i.width; c.height = i.height; const g = c.getContext('2d'); g.drawImage(i, 0, 0); return g.getImageData(0, 0, i.width, i.height).data; };
      const m = lay(p), n = lay(q); let d = 0;
      for (let k = 0; k < m.length; k += 4) if (Math.abs(m[k] - n[k]) + Math.abs(m[k + 1] - n[k + 1]) + Math.abs(m[k + 2] - n[k + 2]) > 30) d++;
      return d;
    }, [x.toString('base64'), y.toString('base64')]);
    if (lech === 0) giong++; else console.log('KHÁC', lech, f);
  }
  console.log('GIỐNG', giong);
  await b.close();
})();
