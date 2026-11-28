#!/usr/bin/env node
// THỬ KH-NHOM-1 — Menu: tên + thứ tự nhóm món lấy từ POS (hợp đồng v19: `nhom` = MÃ, `nhom_ten` = tên hiển thị, `nhom_thu_tu` = thứ tự).
// Phần 1: hàm thuần + đọc nguồn + danh mục (chạy ở mọi nơi) · Phần 2: App thật trong Chromium 360 · 390 · 430 (POS giả của thu_KHMUA1b.js, `S0.menu`).
// KHONG_TRINH_DUYET=1 hoặc không có Playwright → phần 2 BỎ QUA (không tính hỏng).
// Chạy: node cong_cu/thu_KHNHOM1.js → dòng cuối "n đạt · m hỏng".
'use strict';
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const GOC = path.join(__dirname, '..');
let dat = 0, hong = 0;
const k = (ten, dung, them = '') => {
  if (dung) { dat++; console.log(`  ✓ ${ten}`); } else { hong++; console.log(`  ✗ ${ten}${them ? '  — ' + them : ''}`); }
};
const docTho = (f) => { try { return fs.readFileSync(path.join(GOC, f), 'utf8'); } catch { return ''; } };
const nap = (f) => import(pathToFileURL(path.join(GOC, f)).href);
const thu = async (ten, f) => { try { const [dung, them] = [].concat(await f()); k(ten, dung, them); } catch (e) { k(ten, false, String(e && e.message).split('\n')[0]); } };

// Dữ liệu POS thật đo 27.11 (GET /api/kh/menu): Trà (thứ tự 2) đứng trước Nước ép (thứ tự 1) trong danh sách trả về.
const M = (ma, ten, nhom, nhom_ten, nhom_thu_tu) => ({ ma, ten, nhom, ...(nhom_ten !== undefined ? { nhom_ten } : {}), ...(nhom_thu_tu !== undefined ? { nhom_thu_tu } : {}), gia: 30000, con_hang: true, ton_cu: false, ton_luc: null, gia_hang: [] });
const THAT = [M('TLB', 'Trà Lục Bảo', 'tea', 'Trà', 2), M('NEP', 'Nước ép Cần tây', 'juice', 'Nước ép', 1), M('TLB2', 'Trà Phổ Nhĩ', 'tea', 'Trà', 2)];

(async () => {
  console.log('Phần 1 — hàm thuần, đọc nguồn, danh mục');
  const L = await nap('src/menuLoc.js');
  const IDX = await nap('src/noiDung/nd/index.js');
  const ND = await nap('src/noiDung/nd.js');
  const ten = (m) => (L.nhomTheoTen(m)).map((x) => x[0]);

  await thu('A1 tenNhom: nhom_ten ưu tiên · cắt khoảng trắng · "  " / thiếu → nhom (POS cũ) · thiếu cả hai → "Khác"', () => {
    const b = [[{ nhom: 'juice', nhom_ten: 'Nước ép' }, 'Nước ép'], [{ nhom: 'juice', nhom_ten: '  Nước ép  ' }, 'Nước ép'], [{ nhom: 'juice' }, 'juice'], [{ nhom: 'Trà', nhom_ten: '  ' }, 'Trà'], [{ nhom: 'Trà', nhom_ten: null }, 'Trà'], [{ nhom: 'Trà', nhom_ten: 5 }, 'Trà'], [{}, 'Khác'], [{ nhom: '', nhom_ten: '' }, 'Khác'], [{ nhom: null }, 'Khác']];
    const bad = b.filter(([m, ra]) => L.tenNhom(m) !== ra);
    return [bad.length === 0, JSON.stringify(bad)];
  });
  await thu('A1 maNhom: chuỗi khác rỗng, còn lại ""', () => [[[{ nhom: 'tea' }, 'tea'], [{ nhom: '' }, ''], [{}, ''], [{ nhom: null }, ''], [{ nhom: 7 }, '']].every(([m, ra]) => L.maNhom(m) === ra)]);
  await thu('A1 thuTuNhom: số hữu hạn giữ; "1" · null · NaN · Infinity · thiếu → 9999', () => [[[{ nhom_thu_tu: 1 }, 1], [{ nhom_thu_tu: 0 }, 0], [{ nhom_thu_tu: '1' }, 9999], [{ nhom_thu_tu: null }, 9999], [{ nhom_thu_tu: NaN }, 9999], [{ nhom_thu_tu: Infinity }, 9999], [{}, 9999]].every(([m, ra]) => L.thuTuNhom(m) === ra)]);
  await thu('A2 dữ liệu POS thật 27.11: Nước ép (1) đứng trước Trà (2) dù Trà xuất hiện trước; món trong nhóm giữ thứ tự POS', () => {
    const g = L.nhomTheoTen(THAT);
    return [g.map((x) => x[0]).join('|') === 'Nước ép|Trà' && g[1][1].map((m) => m.ma).join() === 'TLB,TLB2', JSON.stringify(g.map((x) => x[0]))];
  });
  await thu('A2 thứ tự bằng nhau giữ thứ tự xuất hiện · 9999 (chưa có thứ tự / chưa có nhóm) xuống cuối', () => {
    const ds = [M('A', 'a', 'x', 'X', 9999), M('B', 'b', 'y', 'Y', 5), M('C', 'c', 'z', 'Z', 5), M('D', 'd', '', undefined, undefined)];
    return [ten(ds).join('|') === 'Y|Z|X|Khác', ten(ds).join('|')];
  });
  await thu('A2 hai mã khác nhau trùng nhom_ten vẫn là HAI nhóm', () => [L.nhomTheoTen([M('A', 'a', 'tra1', 'Trà', 1), M('B', 'b', 'tra2', 'Trà', 2)]).length === 2]);
  await thu('A2 POS cũ (nhom là tên, không nhom_ten / nhom_thu_tu) → như gốc: tên = nhom, thứ tự xuất hiện; món không nhóm → "Khác"', () => {
    const ds = [M('A', 'a', 'Cà phê'), M('B', 'b', 'Trà Đông Y'), M('C', 'c', 'Cà phê'), M('D', 'd', undefined)];
    const g = L.nhomTheoTen(ds);
    return [g.map((x) => x[0]).join('|') === 'Cà phê|Trà Đông Y|Khác' && g[0][1].length === 2, JSON.stringify(g.map((x) => x[0]))];
  });
  await thu('A3 bieuTuongNhom khớp theo TÊN: "Nước ép" → drop, "Trà" → gaiwan; mã POS "juice" / "tea" → mặc định (không thêm mã vào bảng)', () => [L.bieuTuongNhom('Nước ép').ic === 'drop' && L.bieuTuongNhom('Trà').ic === 'gaiwan' && L.bieuTuongNhom('juice').ic === L.NHOM_MAC_DINH.ic && L.bieuTuongNhom('tea').ic === L.NHOM_MAC_DINH.ic]);
  await thu('A3 biểu tượng của một món theo tên nhóm POS (hàm dùng chung cho Trang món / Ô món / Giỏ): món juice / "Nước ép" → drop', () => [typeof L.bieuTuongMon === 'function' && L.bieuTuongMon(THAT[1]).ic === 'drop' && L.bieuTuongMon(THAT[0]).ic === 'gaiwan' && L.bieuTuongMon({ nhom: 'Cà phê' }).ic === 'phin']);

  const nguon = Object.fromEntries(['src/menuLoc.js', 'src/pages/Menu.jsx', 'src/pages/TrangMon.jsx', 'src/pages/GioHang.jsx', 'src/components/MonO.jsx'].map((f) => [f, docTho(f)]));
  const boCT = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '').replace(/\s\/\/.*$/gm, '');
  const ngoaiBang = (s) => s.replace(/const NHOM_DEMO = \[[\s\S]*?\];/, '');
  k('A4 không ghi cứng tên nhóm ("Nước ép", "Trà") ngoài bảng NHOM_DEMO', Object.entries(nguon).every(([, s]) => !/['"`](Nước ép|Trà|Cà phê)['"`]/.test(ngoaiBang(boCT(s)))));
  k('B1 Menu.jsx: lọc theo mã, không so tên (không còn `m.nhom ||` trong bộ lọc), dùng khoaNhom / maNhom', /khoaNhom|maNhom/.test(nguon['src/pages/Menu.jsx']) && !/\(m\.nhom \|\| nd\('menu\.nhomKhac'\)\) === nhom/.test(nguon['src/pages/Menu.jsx']));
  k('B2 Menu.jsx: đường dẫn nhóm theo slug(mã) — ô nhóm id là mã, không là tên', !/nhomTheoTen\(ds\)\.map\(\(\[ten\]\) => \(\{ id: ten/.test(nguon['src/pages/Menu.jsx']) && /slug\(/.test(nguon['src/pages/Menu.jsx']));
  k('B3 TrangMon / MonO / GioHang dùng tenNhom + bieuTuongMon, không đọc `mon.nhom` thẳng làm tên', !/mon\.nhom\b/.test(boCT(nguon['src/pages/TrangMon.jsx'] + nguon['src/components/MonO.jsx'] + nguon['src/pages/GioHang.jsx'])));
  const DM = Object.fromEntries(IDX.DANH_MUC.map((m) => [m.khoa, m]));
  k('B7 danh mục menu.nhom: nguồn "POS › Quản lý › Giá bán & nhóm món" (tên + thứ tự)', !!DM['menu.nhom'] && DM['menu.nhom'].khoaBoi === 'pos' && /POS › Quản lý › Giá bán & nhóm món/.test(DM['menu.nhom'].chiDuong || ''), DM['menu.nhom'] && DM['menu.nhom'].chiDuong);
  k('B7 kiemDanhMuc sạch', ND.kiemDanhMuc(IDX.DANH_MUC).length === 0, ND.kiemDanhMuc(IDX.DANH_MUC).slice(0, 3).join(' | '));

  console.log('Phần 2 — App thật trong Chromium');
  let pw = null;
  if (process.env.KHONG_TRINH_DUYET === '1') console.log('  BỎ QUA: KHONG_TRINH_DUYET=1 — các ca trong trình duyệt không chạy ở đây');
  else {
    try { pw = require('playwright'); } catch { /* không có */ }
    if (!pw) console.log('  BỎ QUA: không có Playwright ở máy này — các ca trong trình duyệt CHƯA chạy');
    else await trinhDuyet(pw);
  }
  console.log(`  (chạy hết ${Math.round(process.uptime())} giây — bộ kiểm cắt ở 120 giây)`);
  console.log(`\n${dat} đạt · ${hong} hỏng`);
  process.exit(hong ? 1 : 0);
})().catch((e) => { console.error(e); console.log(`\n${dat} đạt · ${hong + 1} hỏng`); process.exit(1); });

async function trinhDuyet(pw) {
  const { dungMay } = require('./thu_KHMUA1b.js');
  const { may, mo, chu, doi, doiChu, chup, tranNgang, loiPos } = await dungMay(pw, k);
  const CA = [];
  const them = (ten, opt, f) => { if (!process.env.CHI_CA || ten.includes(process.env.CHI_CA)) CA.push(() => may(ten, opt, f)); };
  const menu = (...ds) => ds;
  const tenO = (t) => t.locator('.cat-tiles .ct b').allInnerTexts();
  const thuongDuoi = (a) => a.filter((x) => !['Giờ vàng', 'Tất cả'].includes(x) && !/hội viên|Thẻ/i.test(x));
  const dsTieuDe = (t) => t.locator('.cat-title').allInnerTexts().then((a) => a.map((x) => x.replace(/\s*\d+ món.*/s, '').trim()));
  const tenMon = (t) => t.locator('.prod-name').allInnerTexts();
  const KHONG_MA = (h) => !/\b(juice|tea)\b/.test(h);
  const body = (t) => t.evaluate(() => document.body.innerText);
  const RONG = [360, 390, 430];
  const MENU = menu(M('TLB', 'Trà Lục Bảo', 'tea', 'Trà', 2), M('CFM', 'Cà phê Muối', 'coffee', 'Cà phê', 3), M('NEP', 'Nước ép Cần tây', 'juice', 'Nước ép', 1));

  for (const rong of RONG) {
    // (1) /menu: ô + tiêu đề nhóm theo nhom_ten, thứ tự nhom_thu_tu; không lộ mã; lọc theo mã; link cũ → Tất cả
    them(`menu-${rong}`, { rong, gio: [], S0: { menu: MENU } }, async ({ t, S }) => {
      await mo(t, '/menu');
      await doi(t, async () => (await t.locator('.prod-card').count()) === 3);
      const o = thuongDuoi(await tenO(t));
      k(`B1 [${rong}] ô nhóm: Nước ép, Trà, Cà phê đúng thứ tự POS`, o.join('|') === 'Nước ép|Trà|Cà phê', o.join('|'));
      const td = await dsTieuDe(t);
      k(`B1 [${rong}] tiêu đề từng phần cùng tên + thứ tự`, td.slice(0, 3).join('|') === 'Nước ép|Trà|Cà phê', td.join('|'));
      k(`B1 [${rong}] không lộ mã POS ("juice" / "tea") ở đâu trên màn`, KHONG_MA(await body(t)));
      const ic = await t.locator('.cat-tiles .ct').evaluateAll((els) => els.map((e) => [e.innerText.split('\n')[0], e.querySelector('svg') ? e.querySelector('svg').outerHTML.length : 0]));
      k(`B3 [${rong}] ô nhóm có biểu tượng (không rỗng)`, ic.length >= 3 && ic.slice(0, 3).every((x) => x[1] > 0));
      k(`B1 [${rong}] không tràn ngang`, !(await tranNgang(t)));
      await chup(t, `menu-tat-ca_${rong}`);
      await t.locator('.cat-tiles .ct', { hasText: 'Nước ép' }).first().click();
      k(`B2 [${rong}] bấm ô "Nước ép" → /menu/juice (mã, không tên)`, await doi(t, async () => new URL(t.url()).pathname === '/menu/juice'), t.url());
      await doi(t, async () => (await t.locator('.prod-card').count()) === 1);
      k(`B1 [${rong}] lọc đúng: chỉ món Nước ép`, (await tenMon(t)).join('|') === 'Nước ép Cần tây', (await tenMon(t)).join('|'));
      await chup(t, `menu-mot-nhom_${rong}`);
      await mo(t, '/menu/tra');
      await doi(t, async () => (await t.locator('.prod-card').count()) === 3);
      k(`B2 [${rong}] mở /menu/tra (link cũ) → "Tất cả", không lỗi`, (await t.locator('.prod-card').count()) === 3 && (await t.locator('.cat-tiles .ct.on b').first().innerText()) === 'Tất cả');
      // đổi tên nhóm ở POS → tải lại: tên mới, link /menu/juice vẫn đúng
      S.menu = menu(M('TLB', 'Trà Lục Bảo', 'tea', 'Trà', 2), M('CFM', 'Cà phê Muối', 'coffee', 'Cà phê', 3), M('NEP', 'Nước ép Cần tây', 'juice', 'Nước ép tươi', 1));
      await mo(t, '/menu/juice');
      await doi(t, async () => (await t.locator('.prod-card').count()) === 1);
      const o2 = thuongDuoi(await tenO(t));
      k(`B2 [${rong}] đổi nhom_ten ở POS → ô mang tên mới, /menu/juice vẫn lọc đúng nhóm`, o2[0] === 'Nước ép tươi' && (await tenMon(t)).join('|') === 'Nước ép Cần tây' && new URL(t.url()).pathname === '/menu/juice', `${o2.join('|')} ${t.url()}`);
    });

    // (2) Trang món + ô giỏ: tên nhóm POS + biểu tượng đúng theo tên
    them(`trang-mon-${rong}`, { rong, gio: [{ ma: 'NEP', so_luong: 1, ghi_chu: '' }, { ma: 'GONE', so_luong: 1, ghi_chu: '' }], S0: { menu: MENU } }, async ({ t }) => {
      await mo(t, '/menu');
      await doi(t, async () => (await t.locator('.prod-card').count()) === 3);
      await t.locator('.prod-card', { hasText: 'Nước ép Cần tây' }).first().click();
      await doi(t, async () => /\/mon\//.test(t.url()));
      await doi(t, async () => (await t.locator('.detail-cat').count()) > 0);
      const c = await chu(t, '.detail-cat');
      k(`B3 [${rong}] Trang món: dòng nhóm "Nước ép" (không "juice")`, c.trim() === 'Nước ép', c);
      await chup(t, `trang-mon_${rong}`);
      await mo(t, '/giohang');
      await doi(t, async () => (await t.locator('.cart-item').count()) === 2);
      const gio = await t.locator('.cart-item').allInnerTexts();
      k(`B6 [${rong}] giỏ có món không còn trên /menu → câu "Không còn trong menu"`, gio.some((x) => /Không còn trong menu/.test(x)) && KHONG_MA(await body(t)), gio.join(' / '));
      k(`B3 [${rong}] ô ảnh giỏ của món Nước ép có biểu tượng + nền theo nhóm (không nền mặc định)`, await t.locator('.cart-thumb').first().evaluate((e) => /205|CDEFE0/i.test(getComputedStyle(e).backgroundColor + e.getAttribute('style'))));
    });
  }

  // (3) POS cũ: nhom là tên, không nhom_ten / nhom_thu_tu → y như hôm nay
  them('pos-cu', { gio: [], S0: {} }, async ({ t }) => {
    await mo(t, '/menu');
    await doi(t, async () => (await t.locator('.prod-card').count()) === 2);
    const o = thuongDuoi(await tenO(t));
    k('B5 POS cũ: ô nhóm = nhom (tên), thứ tự xuất hiện', o.join('|') === 'Trà Đông Y|Cà phê', o.join('|'));
    await t.locator('.cat-tiles .ct', { hasText: 'Cà phê' }).first().click();
    k('B5 POS cũ: bấm ô → /menu/ca-phe, lọc đúng', await doi(t, async () => new URL(t.url()).pathname === '/menu/ca-phe') && (await tenMon(t)).join('|') === 'Cà phê Muối');
  });

  // (4) mã nhóm POS trùng ô riêng của App (gio-vang): ô Giờ vàng thắng, nhóm kia vẫn hiện ở Tất cả
  them('ma-trung-o-rieng', { gio: [], S0: { menu: menu(M('TLB', 'Trà Lục Bảo', 'tea', 'Trà', 1), M('DB', 'Món Đặc Biệt', 'gio-vang', 'Đặc biệt', 2)) } }, async ({ t }) => {
    await mo(t, '/menu');
    await doi(t, async () => (await t.locator('.prod-card').count()) === 2);
    const td = await dsTieuDe(t);
    k('B2 mã nhóm POS "gio-vang": nhóm "Đặc biệt" vẫn hiện ở Tất cả (tiêu đề + món)', td.includes('Đặc biệt') && (await tenMon(t)).includes('Món Đặc Biệt'), td.join('|'));
    const o = await tenO(t);
    k('B2 không có HAI ô cùng đường dẫn /menu/gio-vang (ô riêng của App thắng; nhóm POS không có ô riêng)', o.filter((x) => x === 'Đặc biệt').length === 0, o.join('|'));
  });

  // (5) POS báo MON_KHONG_BAN khi đặt đơn (món vừa bị tắt "hiện trên App" còn trong giỏ) → thanh toán + giỏ đánh dấu đúng dòng, nhãn có sẵn
  them('mon-khong-ban', { S0: { menu: MENU, kich: [loiPos('MON_KHONG_BAN', { ma: 'CFM' })] } }, async ({ t }) => {
    await mo(t, '/thanhtoan');
    await doi(t, async () => (await t.locator('#checkout .nut-dat').first().getAttribute('aria-disabled').catch(() => 'true')) !== 'true');
    await t.locator('#checkout .nut-dat').first().click();
    k('B6 POS báo MON_KHONG_BAN → màn thanh toán hiện lời POS kèm tên món "Cà phê Muối"', await doiChu(t, '#checkout', /MON_KHONG_BAN[\s\S]*Cà phê Muối/));
    await t.locator('#checkout button', { hasText: 'Về giỏ hàng' }).click();
    await doi(t, async () => /\/giohang$/.test(t.url()));
    const dong = await t.locator('#cart .cart-item').allInnerTexts();
    k('B6 giỏ: đúng dòng "Cà phê Muối" mang nhãn "Không còn bán", dòng kia không', dong.length === 2 && !/Không còn bán/.test(dong[0]) && /Cà phê Muối/.test(dong[1]) && /Không còn bán/.test(dong[1]), dong.join(' / '));
  });

  for (const ca of CA) await ca();
}
