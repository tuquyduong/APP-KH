#!/usr/bin/env node
// THỬ KH-SINH-1 — ngày sinh nhập một lần (hợp đồng v9 CT-1a) + lời chào đủ tên + nút xoá món trong giỏ.
// Phần 1: hàm thuần + đọc nguồn (không trình duyệt) · Phần 2: App thật trong Chromium + POS giả theo hợp đồng v9.
// Chạy: node cong_cu/thu_KHSINH1.js → dòng cuối "n đạt · m hỏng". KHONG_TRINH_DUYET=1 hoặc không có Playwright → phần 2 BỎ QUA (không tính hỏng).
'use strict';
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const GOC = path.join(__dirname, '..');
let dat = 0, hong = 0;
const k = (ten, dung, them = '') => {
  if (dung) { dat++; console.log(`  ✓ ${ten}`); } else { hong++; console.log(`  ✗ ${ten}${them ? '  — ' + them : ''}`); }
};
const doc = (f) => fs.readFileSync(path.join(GOC, f), 'utf8');
const nap = (f) => import(pathToFileURL(path.join(GOC, f)).href);
const thu = async (ten, f) => { try { await f(); } catch (e) { k(`${ten} dừng giữa chừng`, false, String(e && e.message).split('\n')[0]); } };

const MENU = { success: true, data: [
  { ma: 'TLB', ten: 'Trà Lục Bảo', nhom: 'Trà Đông Y', gia: 30000, con_hang: true, ton_cu: false, ton_luc: null, gia_hang: [] },
  { ma: 'TCB', ten: 'Trà Cửu Bảo', nhom: 'Trà Đông Y', gia: 35000, con_hang: true, ton_cu: false, ton_luc: null, gia_hang: [] },
] };
const GHD = { success: true, bay_gio: '2026-11-05T20:30:00', dang_mo: true, nhan_don: true, hom_nay: { mo: '08:00', dong: '22:00' }, mo_lai_luc: null, thong_bao: '', lich_tuan: [], ngay_nghi: [] };
const KHACH = { sdt: '0909123456', ten: 'Nguyễn Linh', ngay_tao: '2026-01-01T08:00:00', xung_ho: 'chi', dia_chi: null, ngay_sinh: null, qr: 'QR', hang: null, so_du_vi: 0 };
const TEN_DAI = 'Nguyễn Thị Phương Linh Trần Hoàng Bảo Anh Khôi Nguyên Minh Châu';

(async () => {
  console.log('Phần 1 — hàm thuần + đọc nguồn');

  await thu('B1', async () => {
    const d = await nap('src/dinhDang.js');
    const c = (gio, xh, ten) => d.loiChao(gio, xh, ten);
    const T = '2026-11-05T12:00:00';
    k('B1 "LINH P" + anh → "Chào buổi trưa, anh P!" (KH-UI-5g: có xưng hô → gọi chữ CUỐI của tên, giữ hoa như khách gõ)', c(T, 'anh', 'LINH P') === 'Chào buổi trưa, anh P!', c(T, 'anh', 'LINH P'));
    k('B1 "Phạm Thị Linh" + chị → "…, chị Linh!" (KH-UI-5g)', c(T, 'chị', 'Phạm Thị Linh') === 'Chào buổi trưa, chị Linh!', c(T, 'chị', 'Phạm Thị Linh'));
    k('B1 cắt khoảng trắng hai đầu, gộp khoảng trắng thừa', c('', null, '  Trần   Văn  Nam ') === 'Chào Trần Văn Nam!', c('', null, '  Trần   Văn  Nam '));
    k('B1 không viết hoa thêm chữ đầu ("nguyễn linh" + chị → chữ cuối "linh" giữ nguyên — KH-UI-5g)', c('', 'chị', 'nguyễn linh') === 'Chào chị linh!' && c('', null, 'nguyễn linh') === 'Chào nguyễn linh!', c('', 'chị', 'nguyễn linh'));
    k('B1 một từ vẫn như cũ', c(T, 'cô', 'Hoa') === 'Chào buổi trưa, cô Hoa!');
    k('B1 luật 31.10 giữ: xưng hô chữ thường, chưa có tên → chỉ xưng hô, chưa gì → "Chào bạn!"', c(T, 'Chị', '') === 'Chào buổi trưa, chị!' && c('', '', '') === 'Chào bạn!' && c(null, null, '   ') === 'Chào bạn!');
    const p = d.chiaLoiChao(T, 'anh', ' Lê  Nam ');
    k('B1 chiaLoiChao có xưng hô trả chữ cuối của tên đã gộp khoảng trắng (KH-UI-5g); không xưng hô trả tên đủ', p.ten === 'Nam' && d.chiaLoiChao(T, null, ' Lê  Nam ').ten === 'Lê Nam' && p.xung === 'anh' && p.dau === 'Chào buổi trưa', JSON.stringify(p));
    k('B3 tenNgan không còn (không code chết)', d.tenNgan === undefined && !/tenNgan/.test(doc('src/dinhDang.js')));
  });

  await thu('A6', async () => {
    const d = await nap('src/dinhDang.js');
    const t = d.tachNgaySinh && d.tachNgaySinh('1990-03-12');
    k('A6 tachNgaySinh("1990-03-12") = { nam 1990, thang 3, ngay 12 }', !!t && t.nam === 1990 && t.thang === 3 && t.ngay === 12, JSON.stringify(t));
    k('A6 hienNgaySinh("1990-03-12") = "12/03/1990"; "2000-12-01" = "01/12/2000"', !!d.hienNgaySinh && d.hienNgaySinh('1990-03-12') === '12/03/1990' && d.hienNgaySinh('2000-12-01') === '01/12/2000');
    const sai = ['', null, undefined, '1990-3-12', '12/03/1990', '1990-02-30', '1990-13-01', '1990-00-10', '2023-02-29', 'abc', '1990-03-12T00:00:00'];
    k('A6 sai dạng / sai lịch → null và hiện ""', !!d.tachNgaySinh && sai.every((s) => d.tachNgaySinh(s) === null && d.hienNgaySinh(s) === ''), sai.filter((s) => !d.tachNgaySinh || d.tachNgaySinh(s) !== null).join('|'));
    k('A6 năm nhuận 29/02/2024 hợp lệ', !!d.tachNgaySinh && d.tachNgaySinh('2024-02-29') !== null && d.hienNgaySinh('2024-02-29') === '29/02/2024');
    const src = doc('src/dinhDang.js') + doc('src/pages/HoSo.jsx');
    k('A6 không `new Date(` chuỗi ngày sinh trong dinhDang.js / HoSo.jsx', !/new Date\([^)]/.test(src.replace(/new Date\(\)/g, '')), (src.match(/new Date\([^)]*\)/g) || []).join('|'));
  });

  await thu('A', async () => {
    const hs = doc('src/pages/HoSo.jsx');
    k('A1 thẻ "Ngày sinh" khuôn `card pf-card` trong HoSo.jsx, đặt sau <SuaTen>', /<div className="tt">Ngày sinh<\/div>/.test(hs) && hs.indexOf('<SuaTen') < hs.indexOf('<NgaySinh') && hs.indexOf('<NgaySinh') > 0);
    k('A3 gửi `suaHoSo({ ngay_sinh` riêng (không gộp khoá khác)', /luu\(\{ ngay_sinh: [a-zA-Z.]+ \}\)/.test(hs));
    k('A4 xử lý mã NGAY_SINH_DA_CO (đọc lại /toi)', /NGAY_SINH_DA_CO/.test(hs) && /lamMoi\(\[cuaToi\]\)/.test(hs));
    k('A8 chú thích đầu không còn "ngày sinh" trong danh sách Bỏ', !/Bỏ:[^\n]*ngày sinh/.test(hs));
    const tt = doc('src/tomTatLuu.js');
    k('A7 bản tóm tắt trên máy không có ngay_sinh', !/ngay_sinh/.test(tt));
    k('A7 HoSo.jsx không ghi ngày sinh vào localStorage', !/localStorage/.test(hs));
    const ap = doc('src/pages/GioHang.jsx');
    k('C4 CSS mới ở gio_xoa.css, GioHang.jsx import nó', fs.existsSync(path.join(GOC, 'src/giaoDien/gio_xoa.css')) && /import '\.\.\/giaoDien\/gio_xoa\.css'/.test(ap));
  });

  await thu('C', async () => {
    const g = await nap('src/gio.js');
    const gio = [{ ma: 'A', so_luong: 2, ghi_chu: 'ít đá' }, { ma: 'B', so_luong: 1, ghi_chu: '' }, { ma: 'C', so_luong: 3, ghi_chu: '' }];
    const bo = g.xoaDong(gio, 1);
    const lai = g.chenDong ? g.chenDong(bo, gio[1], 1) : null;
    k('C2 chenDong trả đúng dòng về đúng chỗ (món, số lượng, ghi chú)', JSON.stringify(lai) === JSON.stringify(gio), JSON.stringify(lai));
    k('C2 chenDong vị trí quá cuối → đặt cuối', !!g.chenDong && g.chenDong(bo, gio[1], 99).slice(-1)[0].ma === 'B');
    k('C2 chenDong khi đã có dòng cùng mã + ghi chú → cộng số lượng, không nhân đôi dòng', !!g.chenDong && (() => { const r = g.chenDong([{ ma: 'B', so_luong: 4, ghi_chu: '' }], gio[1], 0); return r.length === 1 && r[0].so_luong === 5; })());
    k('C3 "−" khi còn 1 vẫn xoá dòng', g.doiSoLuong(gio, 1, 0).length === 2);
  });

  console.log('Phần 2 — App thật trong Chromium + POS giả theo hợp đồng v9');
  let pw = null;
  if (process.env.KHONG_TRINH_DUYET === '1') console.log('  BỎ QUA: KHONG_TRINH_DUYET=1 — các ca trong trình duyệt không chạy ở đây');
  else {
    try { pw = require('playwright'); } catch { /* không có */ }
    if (!pw) console.log('  BỎ QUA: không có Playwright ở máy này — các ca trong trình duyệt CHƯA chạy');
    else await trinhDuyet(pw);
  }

  console.log(`\n${dat} đạt · ${hong} hỏng`);
  process.exit(hong ? 1 : 0);
})().catch((e) => { console.error(e); console.log(`\n${dat} đạt · ${hong + 1} hỏng`); process.exit(1); });

async function trinhDuyet(pw) {
  const esbuild = require('esbuild');
  const goiApp = esbuild.buildSync({
    entryPoints: [path.join(GOC, 'src/main.jsx')], bundle: true, write: false, format: 'iife', jsx: 'automatic', logLevel: 'silent',
    loader: { '.css': 'empty', '.json': 'json' }, define: { 'process.env.NODE_ENV': '"production"', 'import.meta.env.VITE_POS_API': '""' },
  }).outputFiles[0].text;
  const cssTron = (f) => doc(f).replace(/@import\s+'\.\/([^']+)';/g, (_, t) => cssTron(path.posix.join(path.posix.dirname(f), t)));
  const css = [...doc('src/main.jsx').matchAll(/import '\.\/(giaoDien\/[^']+\.css)'/g)].map((m) => cssTron('src/' + m[1])).join('\n')
    + (doc('src/pages/GioHang.jsx').match(/import '\.\.\/(giaoDien\/[^']+\.css)'/g) || []).map((s) => cssTron('src/' + /giaoDien\/[^']+\.css/.exec(s)[0])).join('\n');
  const trinh = await pw.chromium.launch({ args: ['--no-sandbox'] });
  const URL0 = 'http://kh.test';
  const HTML = doc('index.html').replace(/<script type="module"[^>]*><\/script>/, '<script src="/bundle.js"></script>').replace('</head>', `<style>${css}</style></head>`);
  const luuAnh = process.env.LUU_ANH_DIR || '';

  // POS giả theo v9. `pos.khach` ghi đè hồ sơ; `pos.put` = hàm (than, S) → { status, body } thay cho PUT /toi mặc định; `gio` = giỏ gieo sẵn (kh_gio).
  async function ca(ten, { rong = 390, pos = {}, gio = null } = {}, chay) {
    const ctx = await trinh.newContext({ viewport: { width: rong, height: 844 }, timezoneId: 'Asia/Ho_Chi_Minh' });
    const t = await ctx.newPage();
    const loi = [];
    t.on('pageerror', (e) => loi.push(e.message));
    await t.clock.install({ time: new Date('2026-11-05T20:30:00+07:00') }); await t.clock.resume();
    await t.addInitScript(() => { try { sessionStorage.setItem('kh_da_xem_man_dau', '1'); } catch { /* bỏ qua */ } });
    await t.addInitScript(([tk, g]) => { if (!sessionStorage.getItem('da_gieo')) { sessionStorage.setItem('da_gieo', '1'); localStorage.setItem('kh_token', tk); if (g) localStorage.setItem('kh_gio', JSON.stringify(g)); } }, ['tok-A', gio]);
    const S = { goi: [], khach: { ...KHACH, ...pos.khach } };
    await t.route(`${URL0}/**`, async (r) => {
      const u = new URL(r.request().url()), p = u.pathname, auth = r.request().headers().authorization || '';
      const json = (status, o) => r.fulfill({ status, contentType: 'application/json', body: JSON.stringify(o) });
      if (p === '/bundle.js') return r.fulfill({ contentType: 'text/javascript', body: goiApp });
      if (!p.startsWith('/api/kh')) return /\.[a-z0-9]+$/.test(p) ? r.fulfill({ status: 204, body: '' }) : r.fulfill({ contentType: 'text/html', body: HTML });
      const duong = p.slice('/api/kh'.length);
      let than; try { than = r.request().postData() ? JSON.parse(r.request().postData()) : undefined; } catch { than = undefined; }
      S.goi.push({ pt: r.request().method(), duong, than });
      if (duong === '/gio-vang') return json(200, { success: true, dang_chay: false, bat_dau: null, ket_thuc: null, phan_tram: 0, mon: [] });
      if (duong === '/hang') return json(200, { success: true, data: [] });
      if (duong === '/gio-hoat-dong') return json(200, GHD);
      if (duong === '/menu') return json(200, MENU);
      if (auth !== 'Bearer tok-A') return json(401, { error: 'Phiên đăng nhập đã hết', code: 'KH_TOKEN_SAI' });
      if (duong === '/gia-han') return json(200, { success: true, token: 'tok-A', het_han: '2026-12-05T08:00:00' });
      if (duong === '/toi' && r.request().method() === 'PUT') {
        const kq = pos.put ? pos.put(than, S) : { status: 200 };
        if (kq.status === 200) Object.assign(S.khach, than);
        if (kq.status !== 200) return json(kq.status, kq.body);
      }
      if (duong === '/toi') return json(200, { success: true, khach: S.khach });
      if (duong === '/diem') return json(200, { success: true, points: 0, history: [] });
      if (duong === '/voucher') return json(200, { success: true, data: [], ma_khach_moi: [] });
      if (duong.startsWith('/don')) return json(200, { success: true, data: [], tong: 0, trang: 1 });
      return json(500, { error: 'chưa giả', code: 'LOI_GIA' });
    });
    t.setDefaultTimeout(4000);
    try { await chay(t, S, loi); } catch (e) { k(`ca ${ten} dừng giữa chừng`, false, String(e && e.message).split('\n')[0]); } finally { await ctx.close(); }
    if (loi.length) k(`ca ${ten}: trang không báo lỗi JS`, false, loi[0]);
  }
  const mo = async (t, duong) => { await t.goto(URL0 + duong); await t.waitForSelector('.phone'); await t.waitForTimeout(700); };
  const khongTran = (t) => t.evaluate(() => document.scrollingElement.scrollWidth <= window.innerWidth + 1);
  const chup = async (t, ten) => { if (luuAnh) await t.screenshot({ path: path.join(luuAnh, ten + '.png') }); };
  const puts = (S) => S.goi.filter((g) => g.pt === 'PUT' && g.duong === '/toi');
  const chu = (t, sel) => t.locator(sel).innerText();
  const the = (t) => t.locator('.pf-card', { hasText: 'Ngày sinh' }).first();
  const NS = '#ngay-sinh';

  // A — ngày sinh chưa có: nhập → hỏi lại → lưu
  for (const rong of [360, 390, 430]) {
    await ca(`sinh-chua-co-${rong}`, { rong }, async (t, S) => {
      const nhan = String(rong);
      await mo(t, '/taikhoan/thongtin');
      k(`A1 [${nhan}] thẻ "Ngày sinh" nằm sau thẻ Thông tin, trước Giao hàng`, await t.evaluate(() => { const ts = [...document.querySelectorAll('.pf-card .tt')].map((e) => e.textContent); return ts.indexOf('Ngày sinh') === ts.indexOf('Thông tin') + 1; }));
      k(`A2 [${nhan}] ô chọn ngày + dòng nhỏ "Nhập đúng như căn cước…" + nút Lưu`, (await t.locator(NS).count()) === 1 && /Nhập đúng như căn cước — quán đối chiếu khi áp ưu đãi sinh nhật\. Chỉ nhập được một lần\./.test(await chu(t, '.pf-card:has(#ngay-sinh)')) && (await the(t).getByRole('button', { name: 'Lưu', exact: true }).count()) === 1);
      k(`A6 [${nhan}] ô chọn ngày không cho chọn ngày tương lai (max = hôm nay 2026-11-05)`, (await t.locator(NS).getAttribute('max')) === '2026-11-05', await t.locator(NS).getAttribute('max'));
      k(`A2 [${nhan}] chưa nhập → nút Lưu tắt`, await the(t).getByRole('button', { name: 'Lưu', exact: true }).isDisabled());
      await chup(t, `hoso_chua-co_${rong}`);
      await t.locator(NS).fill('1990-03-12');
      await the(t).getByRole('button', { name: 'Lưu', exact: true }).click();
      const hoi = await chu(t, '.pf-card:has(.pf-xn)');
      k(`A2 [${nhan}] bấm Lưu → hỏi lại đúng câu, CHƯA gửi POS`, /Ngày sinh 12\/03\/1990 — sau khi lưu bạn không tự sửa được\. Lưu\?/.test(hoi) && puts(S).length === 0, hoi);
      await chup(t, `hoso_hoi-lai_${rong}`);
      await the(t).getByRole('button', { name: 'Sửa lại' }).click();
      k(`A2 [${nhan}] "Sửa lại" → về ô nhập, giữ giá trị, chưa gửi POS`, (await t.locator(NS).inputValue()) === '1990-03-12' && puts(S).length === 0);
      await the(t).getByRole('button', { name: 'Lưu', exact: true }).click();
      await the(t).locator('.pf-xn').getByRole('button', { name: 'Lưu', exact: true }).click();
      await t.waitForTimeout(500);
      k(`A3 [${nhan}] gửi PUT /toi đúng MỘT lần, thân chỉ có { ngay_sinh }`, puts(S).length === 1 && JSON.stringify(puts(S)[0].than) === JSON.stringify({ ngay_sinh: '1990-03-12' }), JSON.stringify(puts(S).map((g) => g.than)));
      const sau = await chu(t, '.pf-card:has(.pf-ns-xem)');
      k(`A3 [${nhan}] thành công → hiện "12/03/1990", không còn ô nhập, có dòng "Cần sửa? Mang căn cước đến quầy…"`, /12\/03\/1990/.test(sau) && /Cần sửa\? Mang căn cước đến quầy để nhân viên sửa\./.test(sau) && (await t.locator(NS).count()) === 0, sau);
      await chup(t, `hoso_da-luu_${rong}`);
      const ls = await t.evaluate(() => JSON.stringify(Object.keys(localStorage).map((x) => [x, localStorage.getItem(x)])));
      k(`A7 [${nhan}] ngày sinh không nằm trong localStorage`, !/1990-03-12|ngay_sinh/.test(ls));
      k(`A [${nhan}] không tràn ngang`, await khongTran(t));
    });
  }

  await ca('sinh-sai', { pos: { put: () => ({ status: 400, body: { error: 'Ngày sinh chưa hợp lệ, bạn kiểm tra lại nhé', code: 'NGAY_SINH_SAI' } }) } }, async (t, S) => {
    await mo(t, '/taikhoan/thongtin');
    await t.locator(NS).fill('2020-01-01');
    await the(t).getByRole('button', { name: 'Lưu', exact: true }).click();
    await the(t).locator('.pf-xn').getByRole('button', { name: 'Lưu', exact: true }).click();
    await t.waitForTimeout(500);
    k('A4 NGAY_SINH_SAI → hiện nguyên lời POS, giữ ô nhập (giá trị còn), nhập lại được', /Ngày sinh chưa hợp lệ, bạn kiểm tra lại nhé/.test(await chu(t, '.pf-card:has(#ngay-sinh)')) && (await t.locator(NS).inputValue()) === '2020-01-01' && puts(S).length === 1);
    k('A4 NGAY_SINH_SAI → không hiện "đã lưu"', !/Đã lưu ngày sinh/.test(await chu(t, '.pf-card:has(#ngay-sinh)')));
  });

  await ca('sinh-da-co-409', { pos: { put: (_, S) => { S.khach.ngay_sinh = '1985-07-01'; return { status: 409, body: { error: 'Ngày sinh đã có', code: 'NGAY_SINH_DA_CO' } }; } } }, async (t, S) => {
    await mo(t, '/taikhoan/thongtin');
    const toi0 = S.goi.filter((g) => g.duong === '/toi' && g.pt === 'GET').length;
    await t.locator(NS).fill('1990-03-12');
    await the(t).getByRole('button', { name: 'Lưu', exact: true }).click();
    await the(t).locator('.pf-xn').getByRole('button', { name: 'Lưu', exact: true }).click();
    await t.waitForTimeout(700);
    const sau = await chu(t, '.pf-card:has(.pf-ns-xem)');
    k('A4 NGAY_SINH_DA_CO → đọc lại /toi và hiện ngày POS đang giữ (01/07/1985), không ô nhập', S.goi.filter((g) => g.duong === '/toi' && g.pt === 'GET').length > toi0 && /01\/07\/1985/.test(sau) && (await t.locator(NS).count()) === 0, sau);
  });

  await ca('sinh-da-co', { pos: { khach: { ngay_sinh: '1991-02-05' } } }, async (t, S) => {
    await mo(t, '/taikhoan/thongtin');
    const o = await chu(t, '.pf-card:has(.pf-ns-xem)');
    k('A5 đã có ngày sinh → chỉ hiện "05/02/1991" + "Cần sửa? Mang căn cước đến quầy…", không ô sửa, không nút Lưu ngày sinh', /05\/02\/1991/.test(o) && /Cần sửa\? Mang căn cước đến quầy để nhân viên sửa\./.test(o) && (await t.locator(NS).count()) === 0 && (await t.locator('.pf-card:has(.pf-ns-xem) button').count()) === 0, o);
    k('A5 không gửi PUT nào khi chỉ xem', puts(S).length === 0);
    await chup(t, 'hoso_co-san_390');
  });

  await ca('sinh-khac-van-luu', {}, async (t, S) => {
    await mo(t, '/taikhoan/thongtin');
    await t.locator('#ten-toi').fill('Linh Mới');
    await t.getByRole('button', { name: 'Lưu tên' }).click();
    await t.waitForTimeout(400);
    k('K5 chưa có ngày sinh vẫn đổi tên bình thường (thân PUT chỉ { ten })', puts(S).length === 1 && JSON.stringify(puts(S)[0].than) === JSON.stringify({ ten: 'Linh Mới' }) && (await t.locator(NS).count()) === 1);
  });

  // B — lời chào đủ tên ở Trang chủ
  await ca('chao-linh-p', { pos: { khach: { ten: 'LINH P', xung_ho: 'anh' } } }, async (t) => {
    await mo(t, '/trangchu');
    const h = await chu(t, '#home h1');
    k('B1 Trang chủ: tên "LINH P" + anh, 20:30 → "Chào buổi tối, anh P!" (KH-UI-5g)', h === 'Chào buổi tối, anh P!', h);
    await chup(t, 'trangchu_linh-p_390');
  });
  for (const rong of [360, 390, 430]) {
    await ca(`chao-dai-${rong}`, { rong, pos: { khach: { ten: TEN_DAI, xung_ho: null } } }, async (t) => {
      await mo(t, '/trangchu');
      const h = await chu(t, '#home h1');
      k(`B1 [${rong}] tên dài hiện đủ trong lời chào (KH-UI-5g: chỉ khi khách chưa chọn xưng hô; có xưng hô thì gọi chữ cuối)`, h.replace(/\s+/g, ' ').includes(TEN_DAI), h);
      k(`B2 [${rong}] tên dài không làm tràn ngang / vỡ dòng chào`, await khongTran(t) && await t.evaluate(() => { const e = document.querySelector('#home h1'); return e.scrollWidth <= e.clientWidth + 1 || getComputedStyle(e).overflow !== 'visible' || e.getBoundingClientRect().right <= window.innerWidth + 1; }));
      await chup(t, `trangchu_ten-dai_${rong}`);
    });
  }

  // C — nút xoá món + hoàn tác
  const GIO = [{ ma: 'TLB', so_luong: 2, ghi_chu: 'ít đá' }, { ma: 'TCB', so_luong: 1, ghi_chu: '' }];
  for (const rong of [360, 390, 430]) {
    await ca(`gio-xoa-${rong}`, { rong, gio: GIO }, async (t) => {
      const nhan = String(rong);
      await mo(t, '/giohang');
      const nut = t.getByRole('button', { name: 'Xoá món' });
      k(`C1 [${nhan}] mỗi dòng giỏ có nút "Xoá món" (2 dòng → 2 nút)`, (await nut.count()) === 2, String(await nut.count()));
      k(`C1 [${nhan}] nút xoá không chồng lên cụm −/+ (hai hộp không giao nhau) và vùng chạm ≥ 28px`, await t.evaluate(() => { const d = document.querySelector('.cart-item'); const a = d.querySelector('[aria-label="Xoá món"]').getBoundingClientRect(), b = d.querySelector('.qty-ctrl').getBoundingClientRect(); return a.width >= 28 && a.height >= 28 && (a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom); }));
      k(`C1 [${nhan}] không tràn ngang`, await khongTran(t));
      await chup(t, `gio_nut-xoa_${rong}`);
      await nut.first().click();
      await t.waitForTimeout(300);
      const tb = await chu(t, '.toast');
      k(`C2 [${nhan}] bấm xoá → dòng biến mất ngay; thông báo "Đã xoá Trà Lục Bảo · Hoàn tác"`, (await t.locator('.cart-item').count()) === 1 && /Đã xoá Trà Lục Bảo/.test(tb) && /Hoàn tác/.test(tb), tb);
      k(`C2 [${nhan}] kh_gio cập nhật (chỉ còn TCB)`, JSON.stringify(JSON.parse(await t.evaluate(() => localStorage.getItem('kh_gio'))).map((d) => d.ma)) === '["TCB"]');
      await chup(t, `gio_hoan-tac_${rong}`);
      await t.locator('.toast').getByRole('button', { name: 'Hoàn tác' }).click();
      await t.waitForTimeout(300);
      const ten = await t.locator('.cart-name').allInnerTexts();
      const g = JSON.parse(await t.evaluate(() => localStorage.getItem('kh_gio')));
      k(`C2 [${nhan}] Hoàn tác → trả đúng dòng về đúng chỗ (Trà Lục Bảo ×2 “ít đá” đứng đầu)`, ten.join('|') === 'Trà Lục Bảo|Trà Cửu Bảo' && JSON.stringify(g) === JSON.stringify(GIO) && /ít đá/.test(await chu(t, '.cart-item >> nth=0')), ten.join('|') + ' ' + JSON.stringify(g));
      k(`C2 [${nhan}] sau Hoàn tác thông báo tắt`, (await t.locator('.toast.show').count()) === 0);
    });
  }
  await ca('gio-xoa-het-han', { gio: GIO }, async (t) => {
    await mo(t, '/giohang');
    await t.getByRole('button', { name: 'Xoá món' }).first().click();
    await t.waitForTimeout(300);
    await t.locator('.toast').waitFor({ state: 'attached' });
    await t.clock.fastForward(6000);
    await t.waitForTimeout(300);
    k('C2 thông báo tự tắt sau ~5 giây; dòng đã xoá không tự quay lại', (await t.locator('.toast.show').count()) === 0 && (await t.locator('.cart-item').count()) === 1);
  });
  await ca('gio-xoa-1-dong', { gio: [GIO[1]] }, async (t) => {
    await mo(t, '/giohang');
    await t.getByRole('button', { name: 'Xoá món' }).click();
    await t.waitForTimeout(300);
    k('C3 xoá dòng cuối → màn giỏ trống như nay', (await t.locator('.empty-cart').count()) === 1 && /Giỏ hàng đang trống/.test(await chu(t, '.empty-cart')));
    await t.locator('.toast').getByRole('button', { name: 'Hoàn tác' }).click();
    await t.waitForTimeout(300);
    k('C2 Hoàn tác từ giỏ trống → món về', (await t.locator('.cart-item').count()) === 1 && (await t.locator('.empty-cart').count()) === 0);
  });
  await ca('gio-tru-con-1', { gio: [GIO[1]] }, async (t) => {
    await mo(t, '/giohang');
    await t.getByRole('button', { name: 'Bớt một' }).click();
    await t.waitForTimeout(300);
    k('C3 "−" khi còn 1 vẫn xoá dòng như nay (không cần nút xoá)', (await t.locator('.cart-item').count()) === 0 && (await t.locator('.empty-cart').count()) === 1);
  });

  await trinh.close();
}
