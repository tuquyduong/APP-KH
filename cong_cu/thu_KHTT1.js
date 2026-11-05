#!/usr/bin/env node
// THỬ KH-TT-1 — Thanh toán: bấm CẢ dòng "Trừ từ số dư ví", đọc lại số dư khi lỗi, bỏ dòng "Chuyển khoản QR", nút ghi đúng cách trả.
// Phần 1: đọc nguồn (chạy ở mọi nơi) · Phần 2: App thật trong Chromium (POS giả dùng lại dungMay của thu_KHMUA1b.js).
// Chạy: node cong_cu/thu_KHTT1.js → dòng cuối "n đạt · m hỏng". KHONG_TRINH_DUYET=1 hoặc không có Playwright → phần 2 BỎ QUA.
'use strict';
const fs = require('fs');
const path = require('path');

const GOC = path.join(__dirname, '..');
let dat = 0, hong = 0;
const k = (ten, dung, them = '') => {
  if (dung) { dat++; console.log(`  ✓ ${ten}`); } else { hong++; console.log(`  ✗ ${ten}${them ? '  — ' + them : ''}`); }
};
const docTho = (f) => { try { return fs.readFileSync(path.join(GOC, f), 'utf8'); } catch { return ''; } };
const boChuThich = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`\\])\/\/[^\n]*/g, '$1');

const TT = boChuThich(docTho('src/pages/ThanhToan.jsx'));
const CSS = docTho('src/giaoDien/thanh_toan.css');
const dongVi = (/<div className=\{`notif-row the-vi[\s\S]*?>\s*<div><div className="t">/.exec(TT) || [''])[0];
const dongSwitch = (/<div className=\{`switch[^\n]*/.exec(TT) || [''])[0];

console.log('Phần 1 — đọc nguồn');
k('A1 cả dòng .the-vi là role="switch" có aria-checked + aria-label, gắn bam', /'switch'/.test(dongVi) && /aria-checked/.test(dongVi) && /aria-label=\{[^}]*'Trừ từ số dư ví'/.test(dongVi) && /bam\(/.test(dongVi), dongVi);
k('A1 ô .switch chỉ là hình: không gắn bam / role riêng', dongSwitch !== '' && !/bam\(/.test(dongSwitch) && !/role=/.test(dongSwitch), dongSwitch);
k('A3 có chữ "Bấm để thử lại" và gọi toi.taiLai()', /Bấm để thử lại/.test(TT) && /toi\.taiLai\(\)/.test(TT));
k('B1 không còn khối "Chuyển khoản QR" / "Quét mã bằng app ngân hàng"', !/Chuyển khoản QR|Quét mã bằng app ngân hàng/.test(TT));
k('B3 chữ nút: "Thanh toán qua QR", "Trừ ví", "+ QR"; hết "Xác nhận trả"', /Thanh toán qua QR/.test(TT) && /Trừ ví/.test(TT) && /\+ QR/.test(TT) && !/Xác nhận trả/.test(TT));
k('B3 chữ trạng thái cũ giữ nguyên', ['Đang gửi…', 'Mạng chậm, đang gửi lại…', 'Xử lý đơn trước rồi đặt tiếp', 'Đang kiểm tra đơn trước…', 'Thử lại sau '].every((c) => TT.includes(c)) && /CHU_CHUA_MO/.test(TT));
k('C1 thanh_toan.css có file, ThanhToan.jsx import nó, main.jsx / giaoDien.css không nhắc tới', CSS.length > 0 && /import '\.\.\/giaoDien\/thanh_toan\.css'/.test(docTho('src/pages/ThanhToan.jsx')) && !/thanh_toan/.test(docTho('src/main.jsx') + docTho('src/giaoDien/giaoDien.css')));
k('C1 CSS có vùng bấm ≥ 44px cho .the-vi', /\.the-vi[^{]*\{[^}]*min-height:\s*44px/.test(CSS));
k('không đổi luật cách trả: cachTra vẫn tắt→qr, vi, vi_qr', /const cachTra = !dungVi \? 'qr' : duoc\.vi \? 'vi' : duoc\.viQr \? 'vi_qr' : 'qr'/.test(TT));

(async () => {
  console.log('Phần 2 — App thật trong Chromium');
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
  const { dungMay, BG } = require('./thu_KHMUA1b.js');
  const { trinh, may, mo, chu, doi, nut, nutKhoa, nhapPin, tranNgang, chup } = await dungMay(pw, k);
  const CAI_CSS = (t) => (CSS ? t.addStyleTag({ content: CSS }) : Promise.resolve()); // dungMay chỉ nạp CSS từ main.jsx
  const vi = (t) => t.locator('#checkout .the-vi');
  const chuNut = async (t) => (await nut(t).innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
  const moTT = async (t, doiSoDu = true, doiGia = true) => {
    await mo(t, '/thanhtoan'); await CAI_CSS(t);
    if (doiSoDu) await doi(t, async () => /Số dư \d|Dùng hết/.test(await chu(t, '#checkout .the-vi')));
    if (doiGia) await doi(t, async () => !/^Xác nhận$|^Xác nhận →/.test(await chuNut(t)) && (await chuNut(t)) !== '');
  };
  const batTat = async (t) => (await vi(t).getAttribute('aria-checked')) === 'true';
  const CA = [];
  const them = (ten, opt, f) => CA.push(() => may(ten, opt, f));

  them('chu-bam', { S0: { vi: 100000 } }, async ({ t }) => {
    await moTT(t);
    k('A1 ví tắt: nút "Thanh toán qua QR 87.654đ"', /^Thanh toán qua QR 87\.654đ/.test(await chuNut(t)), await chuNut(t));
    await vi(t).locator('.t').click();
    k('A1 bấm CHỮ "Trừ từ số dư ví" → aria-checked true', await batTat(t));
    k('A1/B3 ví đủ → nút "Trừ ví 87.654đ"', /^Trừ ví 87\.654đ/.test(await chuNut(t)), await chuNut(t));
    await vi(t).locator('.s').click();
    k('A1 bấm dòng số dư → tắt lại, nút về "Thanh toán qua QR"', !(await batTat(t)) && /^Thanh toán qua QR/.test(await chuNut(t)));
    await vi(t).focus(); await t.keyboard.press('Enter');
    k('A1 Enter trên dòng → bật', await batTat(t));
    await t.keyboard.press(' ');
    k('A1 Space trên dòng → tắt', !(await batTat(t)));
    const h = (await vi(t).boundingBox()).height;
    k('A1 vùng bấm dòng ví cao ≥ 44px', h >= 44, String(h));
    k('A1 role=switch trên dòng + aria-label', (await t.locator('#checkout [role=switch][aria-label="Trừ từ số dư ví"].the-vi').count()) === 1);
    k('B1 không còn chữ "Chuyển khoản QR"', !/Chuyển khoản QR/.test(await chu(t, '#checkout')));
    k('B2 còn tiêu đề "Cách trả tiền" khi có dòng ví', /Cách trả tiền/.test(await chu(t, '#checkout')));
  });

  them('o-switch', { S0: { vi: 100000 } }, async ({ t }) => {
    await moTT(t);
    await vi(t).locator('.switch').click();
    k('A1 bấm trúng ô .switch một lần → bật đúng MỘT lần (không bật rồi tắt)', await batTat(t));
    await vi(t).locator('.switch').click();
    k('A1 bấm ô .switch lần hai → tắt', !(await batTat(t)));
  });

  them('vi-thieu', { rong: 360, S0: { vi: 500000, bg: { ...BG, tong: 987654 } } }, async ({ t, S }) => {
    await moTT(t);
    await vi(t).locator('.t').click();
    const c = await chuNut(t);
    k('B3 ví thiếu → "Trừ ví 500.000đ + QR 487.654đ"', /^Trừ ví 500\.000đ \+ QR 487\.654đ/.test(c), c);
    k('B4 dòng nhỏ giữ câu "Dùng hết … còn thiếu … → quét QR"', /Dùng hết 500\.000đ trong ví, còn thiếu 487\.654đ → quét QR/.test(await vi(t).innerText()));
    const o = await nut(t).evaluate((e) => ({ sw: e.scrollWidth, cw: e.clientWidth, r: e.getBoundingClientRect().right, w: window.innerWidth }));
    k('B5 [360] nút không tràn ngang với chữ dài nhất', o.sw <= o.cw + 1 && o.r <= o.w + 1 && !(await tranNgang(t)), JSON.stringify(o));
    await chup(t, 'thanhtoan-vi-thieu-360');
    await nut(t).click(); await t.waitForTimeout(300);
    k('K5 vi_qr vẫn hỏi PIN', (await t.locator('.pin-sheet').count()) === 1);
    await nhapPin(t, '1357'); await doi(t, async () => S.guiDon.length === 1);
    const than = JSON.parse(S.guiDon[0] || '{}');
    k('K5 vi_qr gửi cach_tra "vi_qr" + pin', than.cach_tra === 'vi_qr' && than.pin === '1357', S.guiDon[0]);
  });

  them('dat-qr-vi', { S0: { vi: 100000 } }, async ({ t, S }) => {
    await moTT(t);
    await nut(t).click(); await doi(t, async () => S.guiDon.length === 1);
    const qr = JSON.parse(S.guiDon[0] || '{}');
    k('K5 đặt QR: cach_tra "qr", không pin, không hỏi PIN', qr.cach_tra === 'qr' && qr.pin === undefined && (await t.locator('.pin-sheet').count()) === 0, S.guiDon[0]);
  });
  them('dat-vi', { S0: { vi: 100000 } }, async ({ t, S }) => {
    await moTT(t);
    await vi(t).locator('.t').click(); await nut(t).click(); await t.waitForTimeout(300);
    k('K5 đặt ví đủ: hỏi PIN', (await t.locator('.pin-sheet').count()) === 1);
    await nhapPin(t, '1357'); await doi(t, async () => S.guiDon.length === 1);
    const than = JSON.parse(S.guiDon[0] || '{}');
    k('K5 đặt ví đủ: cach_tra "vi" + pin', than.cach_tra === 'vi' && than.pin === '1357', S.guiDon[0]);
  });

  them('vi-0d', {}, async ({ t }) => {
    await moTT(t, false, false);
    await doi(t, async () => /Thanh toán qua QR/.test(await chuNut(t)));
    const ch = await chu(t, '#checkout');
    k('A4/B2 ví 0đ → không dòng ví, không tiêu đề "Cách trả tiền"', (await vi(t).count()) === 0 && !/Cách trả tiền/.test(ch), ch.slice(0, 200));
    k('B1/B3 ví 0đ → không "Chuyển khoản QR"; nút "Thanh toán qua QR 87.654đ"', !/Chuyển khoản QR/.test(ch) && /^Thanh toán qua QR 87\.654đ/.test(await chuNut(t)), await chuNut(t));
    await chup(t, 'thanhtoan-vi-0d');
  });

  them('toi-loi', { S0: { vi: 100000 } }, async ({ t, S, ctx }) => {
    let hong = true, soToi = 0;
    await ctx.route('**/api/kh/toi', (r) => { soToi++; if (hong) return r.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'Lỗi máy chủ', code: 'LOI_MAY_CHU' }) }); return r.fallback(); });
    await moTT(t, false, false);
    await doi(t, async () => /Bấm để thử lại/.test(await chu(t, '#checkout .the-vi')));
    k('A3 /toi lỗi → "Chưa đọc được số dư · Bấm để thử lại"', /Chưa đọc được số dư · Bấm để thử lại/.test(await chu(t, '#checkout .the-vi')), await chu(t, '#checkout .the-vi'));
    await doi(t, async () => /^Thanh toán qua QR/.test(await chuNut(t)));
    k('A3 không tự đặt cách trả: tắt, nút "Thanh toán qua QR"',!(await batTat(t)) && /^Thanh toán qua QR/.test(await chuNut(t)));
    await chup(t, 'thanhtoan-so-du-loi');
    const truoc = soToi; hong = false;
    await vi(t).click();
    await doi(t, async () => /Số dư 100\.000đ/.test(await chu(t, '#checkout .the-vi')));
    k('A3 bấm dòng → /toi gọi lần nữa, hiện số dư', soToi > truoc && /Số dư 100\.000đ/.test(await chu(t, '#checkout .the-vi')), await chu(t, '#checkout .the-vi'));
    await vi(t).click();
    k('A3 đọc lại được → bật được như thường', await batTat(t) && /^Trừ ví 87\.654đ/.test(await chuNut(t)));
  });

  them('bao-gia-cham', { S0: { vi: 100000, treBg: 2500 } }, async ({ t }) => {
    await moTT(t, true, false);
    k('A2 báo giá chưa về → dòng ví khoá (aria-disabled)', (await vi(t).getAttribute('aria-disabled')) === 'true');
    await vi(t).locator('.t').click();
    k('A2 báo giá chưa về → bấm không bật, nút "Xác nhận" và khoá', !(await batTat(t)) && /^Xác nhận( →)?$/.test(await chuNut(t)) && (await nutKhoa(t)), await chuNut(t));
  });

  for (const rong of [360, 390, 430]) {
    them(`rong-${rong}`, { rong, S0: { vi: 100000 } }, async ({ t }) => {
      await moTT(t);
      await chup(t, `thanhtoan-vi-tat-${rong}`);
      await vi(t).locator('.t').click();
      await chup(t, `thanhtoan-vi-du-${rong}`);
      k(`B5 [${rong}] Thanh toán không tràn ngang`, !(await tranNgang(t)));
    });
    them(`rong-thieu-${rong}`, { rong, S0: { vi: 50000 } }, async ({ t }) => {
      await moTT(t); await vi(t).locator('.t').click();
      await chup(t, `thanhtoan-vi-thieu_${rong}`);
      k(`B5 [${rong}] ví thiếu: nút "Trừ ví 50.000đ + QR 37.654đ", không tràn ngang`, /^Trừ ví 50\.000đ \+ QR 37\.654đ/.test(await chuNut(t)) && !(await tranNgang(t)));
    });
    them(`rong-loi-${rong}`, { rong, S0: { vi: 50000 } }, async ({ t, ctx }) => {
      await ctx.route('**/api/kh/toi', (r) => r.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'Lỗi máy chủ', code: 'LOI_MAY_CHU' }) }));
      await moTT(t, false, false); await doi(t, async () => /Bấm để thử lại/.test(await chu(t, '#checkout .the-vi')) && /^Thanh toán qua QR/.test(await chuNut(t)));
      await chup(t, `thanhtoan-so-du-loi_${rong}`);
      k(`B5 [${rong}] số dư lỗi: không tràn ngang`, !(await tranNgang(t)));
    });
    them(`rong-0d-${rong}`, { rong }, async ({ t }) => {
      await moTT(t, false, false); await doi(t, async () => /Thanh toán qua QR/.test(await chuNut(t)));
      await chup(t, `thanhtoan-vi-0d_${rong}`);
      k(`B5 [${rong}] ví 0đ: không tràn ngang`, !(await tranNgang(t)));
    });
  }

  // chạy theo cụm để không vượt 120 giây của bộ kiểm
  for (let i = 0; i < CA.length; i += 4) await Promise.all(CA.slice(i, i + 4).map((f) => f()));
  await trinh.close();
}
