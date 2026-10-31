// Chụp demo (patch39) ở 360x844 cho so ảnh KH-UI-3b: Thông tin cá nhân, đầu Trang chủ, ô .hb-tiles.
const { chromium } = require('playwright');
const path = require('path');
const RA = process.argv[2];
(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const p = await (await b.newContext({ viewport: { width: 360, height: 844 } })).newPage();
  await p.goto('file:///home/user/APP-KH/thiet_ke/app_kh_demo.html');
  await p.waitForTimeout(1500);
  await p.evaluate(() => { const s = document.getElementById('splashOverlay'); if (s) s.classList.add('hide'); });
  await p.evaluate(() => { go('home'); });
  await p.waitForTimeout(600);
  await p.screenshot({ path: path.join(RA, 'demo_trang-chu-dau_360.png') });
  const hb = await p.evaluate(() => [...document.querySelectorAll('.hb-k')].map((e) => ({ t: e.innerText, h: e.clientHeight, lh: getComputedStyle(e).lineHeight, fs: getComputedStyle(e).fontSize })));
  console.log('demo .hb-k', JSON.stringify(hb));
  await p.evaluate(() => { go('profile'); renderProfile(); });
  await p.waitForTimeout(600);
  await p.screenshot({ path: path.join(RA, 'demo_thong-tin-ca-nhan_360.png') });
  await b.close();
})();
