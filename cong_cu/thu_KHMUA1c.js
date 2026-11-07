#!/usr/bin/env node
// THỬ KH-MUA-1c — đặt đơn theo hợp đồng v9: KHO_BAN / hết phiên = "chưa rõ" (gửi lại CÙNG khoá), KHOA_GUI_DA_DUNG giữ bản ghi, 4xx sau một lần
// "chưa rõ" vẫn chưa rõ (chủ quán 05.11), Theo dõi đơn đọc ví đã giữ từ POS (v7), bảng PIN có Xoá lùi + Xác nhận, bù ca soát cuối KH-MUA-1b.
// Phần 1: hàm thuần + đọc nguồn · Phần 2: App thật trong Chromium (máy giả dùng chung với thu_KHMUA1b.js — POS giả dựng từ hợp đồng).
// Chạy: node cong_cu/thu_KHMUA1c.js → dòng cuối "n đạt · m hỏng". KHONG_TRINH_DUYET=1 hoặc không có Playwright → phần 2 BỎ QUA (không tính hỏng).
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
const boChuThich = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`\\])\/\/[^\n]*/g, '$1');
const doc = (f) => boChuThich(docTho(f));
const nap = (f) => import(pathToFileURL(path.join(GOC, f)).href);
const thu = async (ten, f) => { try { await f(); } catch (e) { k(`${ten} dừng giữa chừng`, false, String(e && e.message).split('\n')[0]); } };
const khoGia = (m = new Map()) => ({ m, getItem: (x) => (m.has(x) ? m.get(x) : null), setItem: (x, v) => m.set(x, String(v)), removeItem: (x) => m.delete(x) });
const khoChan = { getItem() { throw new Error('chặn'); }, setItem() { throw new Error('chặn'); }, removeItem() { throw new Error('chặn'); } };
const loi = (status, code) => Object.assign(new Error(code || 'lỗi'), { status, code });
const OK = { success: true, ma_don: 'TQD42', tong: 1, giu_vi: 0, con_lai: 1, tien_trinh: 'cho_tra', qr: null, trung: false };

(async () => {
  console.log('Phần 1 — hàm thuần, đọc nguồn');
  k('KH-TT-1 B3 nút đặt "Xác nhận" chỉ còn khi báo giá chưa về (hết "Xác nhận trả <tổng>")', /Thanh toán qua QR/.test(doc('src/pages/ThanhToan.jsx')) && !/Xác nhận trả/.test(doc('src/pages/ThanhToan.jsx')));
  const D = await nap('src/datDon.js');
  const { CAN_TU_POS } = await nap('src/kiemKhop/canTuPos.js');

  await thu('A', async () => {
    k('A1 thiet_ke/HOP_DONG_API_KH.md = viec/KH-SOHD-1/hop_dong_v11.md từng byte (v11 chứa v9)', fs.readFileSync(path.join(GOC, 'thiet_ke/HOP_DONG_API_KH.md')).equals(fs.readFileSync(path.join(GOC, 'viec/KH-SOHD-1/hop_dong_v11.md'))));
    const hd = JSON.parse(/<!-- HOP_DONG_MAY_DOC -->\s*```json\n([\s\S]*?)\n```/.exec(docTho('thiet_ke/HOP_DONG_API_KH.md'))[1]);
    const tra = (cua) => { const [pt, duong] = cua.split(' '); const c = hd.cua.find((x) => x.pt === pt && x.duong === duong); return c ? c.tra : null; };
    const khai = (cua) => CAN_TU_POS.filter((x) => x.cua === cua && x.co).flatMap((x) => x.truong);
    const can = { 'GET /don/:ma': ['don.cach_tra', 'don.giu_vi', 'don.con_lai', 'don.hoa_don[].loai'], 'GET /don': ['data[].cach_tra', 'data[].giu_vi', 'data[].con_lai'], 'GET /chuong-trinh': ['data[].ma', 'data[].ten', 'data[].loai', 'data[].dang_bat'], 'GET /toi': ['khach.ngay_sinh'] };
    const thieu = Object.entries(can).flatMap(([cua, ds]) => ds.filter((t) => !khai(cua).includes(t)).map((t) => `${cua} ${t}`));
    k('A2 canTuPos khai trường v7 (cach_tra, giu_vi, con_lai, hoa_don[]) và v9 (/chuong-trinh, khach.ngay_sinh)', thieu.length === 0, thieu.join(', '));
    const ct = CAN_TU_POS.find((x) => x.cua === 'GET /chuong-trinh') || {};
    k('A2 /chuong-trinh: co:true, token:false, không moi (cửa mới, không phải trường mới)', ct.co === true && ct.token === false && !ct.moi);
    const ngoai = Object.keys(can).flatMap((cua) => khai(cua).filter((t) => !(tra(cua) || []).includes(t)).map((t) => `${cua} ${t}`));
    k('A2 mọi trường khai của các cửa đó đều có trong khối máy đọc v9', ngoai.length === 0, ngoai.join(', '));
  });

  await thu('B', async () => {
    const L = (st, c) => D.loaiLoi(loi(st, c));
    k('B1 409 KHO_BAN → chưa rõ (khong_biet), không phải chưa tạo', L(409, 'KHO_BAN') === 'khong_biet');
    k('B1 5xx DANG_XU_LY / PAYOS_LOI / LOI_MAY_CHU, mất mạng, 4xx không code, 200 lạ → chưa rõ', ['DANG_XU_LY', 'PAYOS_LOI', 'LOI_MAY_CHU'].every((c, i) => L([503, 502, 500][i], c) === 'khong_biet') && L(0, 'MANG_LOI') === 'khong_biet' && D.loaiLoi({ status: 409 }) === 'khong_biet' && D.loaiLoi({ status: 200 }) === 'khong_biet' && D.loaiLoi(null) === 'khong_biet');
    k('B1/B2 401 và 409 KHOA_GUI_DA_DUNG → dừng (dung): chưa rõ, không tự gửi lại', L(401, 'KH_TOKEN_SAI') === 'dung' && L(409, 'KHOA_GUI_DA_DUNG') === 'dung');
    const sai = [[400, 'PIN_SAI'], [423, 'PIN_DANG_KHOA'], [400, 'VI_KHONG_DU'], [409, 'GIA_DA_DOI'], [400, 'HET_HANG'], [400, 'NGOAI_GIO'], [429, 'QUA_NHIEU_LAN'], [400, 'DON_KHONG_HOP_LE'], [400, 'CHUA_CO_PIN']].filter(([st, c]) => L(st, c) !== 'chua_tao');
    k('B3/K5 4xx có code khác (PIN, giá đổi, hết hàng, ngoài giờ, 429…) → chắc chưa tạo', sai.length === 0 && D.loaiLoi({ code: 'CHUA_MO' }) === 'chua_tao', sai.join(' '));

    const chay = async (kich) => {
      const goi = [], cho = [];
      const than = { khoa_gui: 'K'.repeat(20), mon: [], pin: '1357' };
      let kq = null, nem = null;
      try { kq = await D.guiDonAnToan(than, { gui: (t) => { goi.push(t); const x = kich[Math.min(goi.length - 1, kich.length - 1)]; return x instanceof Error ? Promise.reject(x) : Promise.resolve(x); }, cho: (ms) => { cho.push(ms); return Promise.resolve(); } }); } catch (e) { nem = e; }
      return { goi, cho, kq, nem, than, n: `${goi.length} lần, ném ${nem && nem.code}/${nem && nem.goc}` };
    };
    const a = await chay([...Array(5)].map(() => loi(409, 'KHO_BAN')).concat([OK]));
    k('B1 KHO_BAN ×5 rồi đơn → 6 lần gửi, MỌI lần CÙNG đối tượng thân (cùng khoá + thân + PIN), chờ 2 giây mỗi lần', !!a.kq && a.goi.length === 6 && a.goi.every((t) => t === a.than) && a.cho.length === 5 && a.cho.every((ms) => ms === 2000), a.n);
    const b = await chay([loi(409, 'KHO_BAN')]);
    k('B1/B4 KHO_BAN mãi → 1 + 8 lần gửi (≈ 16 giây, dưới trần 10 lần / 10 phút), ném KHONG_BIET', b.goi.length === 9 && b.cho.reduce((s, x) => s + x, 0) === 16000 && b.nem && b.nem.code === 'KHONG_BIET', b.n);
    const c = await chay([loi(409, 'KHO_BAN'), loi(409, 'KHO_BAN'), loi(409, 'KHO_BAN'), loi(429, 'QUA_NHIEU_LAN')]);
    k('B1 Q1 KHO_BAN ×3 rồi 429 → chưa rõ (KHONG_BIET, giữ bản ghi), không ném 429 "chưa tạo"', c.goi.length === 4 && c.nem && c.nem.code === 'KHONG_BIET' && c.nem.goc === 'QUA_NHIEU_LAN', c.n);
    const d = await chay([loi(502, 'PAYOS_LOI'), loi(400, 'PIN_SAI')]);
    k('B1 Q1 5xx rồi PIN_SAI trong cùng chuỗi → chưa rõ (KHONG_BIET)', d.goi.length === 2 && d.nem && d.nem.code === 'KHONG_BIET', d.n);
    const e = await chay([loi(400, 'PIN_SAI')]);
    k('B3/K5 PIN_SAI ngay lần gửi ĐẦU → ném nguyên lỗi POS (chưa tạo), 1 lần gửi', e.goi.length === 1 && e.nem && e.nem.code === 'PIN_SAI', e.n);
    const f = await chay([loi(401, 'KH_TOKEN_SAI'), OK]);
    k('B1 401 → 1 lần gửi, không chờ, ném KHONG_BIET', f.goi.length === 1 && f.cho.length === 0 && f.nem && f.nem.code === 'KHONG_BIET', f.n);
    const g = await chay([loi(409, 'KHOA_GUI_DA_DUNG'), OK]);
    k('B2 KHOA_GUI_DA_DUNG → 1 lần gửi, ném { code: KHONG_BIET, goc: KHOA_GUI_DA_DUNG }', g.goi.length === 1 && g.nem && g.nem.code === 'KHONG_BIET' && g.nem.goc === 'KHOA_GUI_DA_DUNG', g.n);
    const h = await chay([loi(503, 'DANG_XU_LY')]);
    k('B1 DANG_XU_LY mãi vẫn ≈ 1 phút (31 lần gửi)', h.goi.length === 31 && h.nem && h.nem.code === 'KHONG_BIET', h.n);
    const dd = doc('src/datDon.js');
    const ham = (/export async function guiDonAnToan[\s\S]*?\n}/.exec(dd) || [''])[0];
    k('B1 luật lỗi MỘT chỗ: datDon.js nêu KHO_BAN đúng một lần (bảng mã), guiDonAnToan không tự xét mã / 401', (dd.match(/KHO_BAN/g) || []).length === 1 && !!ham && !/401|'(?!KHONG_BIET')[A-Z_]{4,}'/.test(ham), ham.slice(0, 80));
  });

  await thu('C', async () => {
    // tong lệch có chủ ý với giu_vi + con_lai: bắt App tự tính giữ ví từ tong − con_lai (phải đọc NGUYÊN số POS)
    const dn = (them) => D.docDon({ don: { ma: 'TQD42', ngay: '2026-10-30T20:31:00', tong: 87654, tien_trinh: 'cho_tra', qr: null, mon: [], ...them } });
    const a = dn({ cach_tra: 'vi_qr', giu_vi: 30000, con_lai: 51000 });
    k('C1 docDon đọc cach_tra, giu_vi, con_lai (v7)', a.cachTra === 'vi_qr' && a.giuVi === 30000 && a.conLai === 51000, JSON.stringify(a));
    const b = dn({}), c = dn({ cach_tra: null, giu_vi: null, con_lai: null }), d = dn({ cach_tra: 'la', giu_vi: '30000', con_lai: '1' });
    k('C1 POS cũ thiếu trường → undefined (dùng bản ghi máy); null → null (đơn quầy); cách lạ / số là chuỗi → null', b.cachTra === undefined && c.cachTra === null && c.giuVi === null && d.cachTra === null && d.giuVi === null && d.conLai === null, JSON.stringify([b.cachTra, c, d]));
    const td = doc('src/pages/TheoDoiDon.jsx');
    k('C2 TheoDoiDon không cộng / trừ giu_vi, con_lai, tong (không tự tính tiền)', !/(giu_vi|con_lai|giuVi|conLai|\btong)\s*[-+]\s*[\w(]|[\w)]\s*[-+]\s*\w*\.(giu_vi|con_lai|giuVi|conLai|tong)\b/.test(td));
    const tho = docTho('src/pages/TheoDoiDon.jsx') + docTho('src/datDon.js');
    k('C3 bỏ ghi chú cũ "máy khác … không biết" / "chỉ có trong trả lời POST /don"', !/máy khác\) → không biết|chỉ có trong trả lời POST \/don/.test(tho));
  });

  await thu('D4', async () => {
    const bg = D.banGhiGui({ khoa_gui: 'X'.repeat(20), mon: [{ ma: 'TLB', so_luong: 1 }], cach_tra: 'qr' }, 1000);
    const m = new Map(); const kho = khoGia(m); const day = { ...khoGia(m), setItem() { throw new Error('đầy kho'); } };
    D.ghiGuiDo(null, khoGia());
    k('D4 kho đầy: ghi X trả false (không báo đã lưu)', D.ghiGuiDo(bg, day) === false);
    k('D4 kho đầy, kho trống → đọc X trong bộ nhớ trang', (D.docGuiDo(day, 2000) || {}).khoa_gui === 'X'.repeat(20));
    kho.setItem('kh_don_gui', JSON.stringify({ ...bg, khoa_gui: 'Y'.repeat(20) })); // tab khác ghi được Y
    k('D4 kho đầy mà tab khác vừa ghi Y vào kho → đọc Y (không bỏ qua kho)', (D.docGuiDo(day, 2000) || {}).khoa_gui === 'Y'.repeat(20));
    D.ghiGuiDo(bg, kho);
    k('D4 ghi "xong" hỏng (kho đầy) → không còn bản CŨ trên kho, đọc được bản mới có xong', D.ghiGuiDo({ ...bg, ma_don: 'TQD42', xong: true }, day) === false && (D.docGuiDo(day, 2000) || {}).xong === true);
    D.ghiGuiDo(bg, khoChan);
    k('D4 kho chặn hẳn → vẫn bản ghi trong bộ nhớ trang', (D.docGuiDo(khoChan, 2000) || {}).khoa_gui === 'X'.repeat(20));
    D.ghiGuiDo(null, khoGia());
  });

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
  const { trinh, may, mo, chu, doi, doiChu, nut, nutKhoa, sanSang, bam, batVi, luu, chup, giongNhau, khoa, loiPos, BAY, PIN } = await dungMay(pw, k);
  const so = (t, c) => t.locator('.pin-pad button', { hasText: new RegExp(`^${c}$`) });
  const nutPin = (t, chuNut) => t.locator('.pin-pad button', { hasText: chuNut });
  const goSo = async (t, s) => { for (const c of s) await so(t, c).click(); };
  const cham = (t) => t.locator('.pin-dots i.on').count();
  const ghiBanGhi = (t, g) => t.evaluate((g) => localStorage.setItem('kh_don_gui', JSON.stringify({ ...g, luc: Date.now() })), g);
  const THAN = (K, cach) => ({ khoa_gui: K, than: { mon: [{ ma: 'TLB', so_luong: 2, ghi_chu: 'ít ngọt' }, { ma: 'CFM', so_luong: 1 }], cach_nhan: 'tai_quan', cach_tra: cach, khoa_gui: K, tong_da_xem: 87654 }, cach_tra: cach });
  const choToi = async (t, S) => { await mo(t, '/trangchu'); await doi(t, async () => S.goi.some((g) => g.duong === '/toi')); await t.waitForTimeout(300); };
  const moPinVi = async (t, S) => { await mo(t, '/thanhtoan'); await sanSang(t); await doiChu(t, '#checkout', /Số dư/); await batVi(t); await bam(t); await t.waitForSelector('.pin-pad'); };
  const CA = [];
  const them = (ten, opt, f) => CA.push(() => may(ten, opt, f));

  // ---- B: KHO_BAN / KHOA_GUI_DA_DUNG / 4xx sau "chưa rõ"
  them('kho-ban-roi-don', { S0: { kich: [loiPos('KHO_BAN'), 'tao+khoban'] } }, async ({ t, S }) => {
    await mo(t, '/thanhtoan'); await sanSang(t); await bam(t);
    k('B1 KHO_BAN, rồi POS tạo đơn mà vẫn trả KHO_BAN → tự gửi lại CÙNG khoá + thân → POS trả đơn cũ (trung): MỘT đơn, ví không trừ lần hai', await doi(t, async () => /\/don\/TQD42$/.test(t.url()), 9000) && S.guiDon.length === 3 && giongNhau(S.guiDon) && S.don.size === 1, `${S.guiDon.length} lần, ${S.don.size} đơn`);
    k('B1 bản ghi kh_don_gui có ma_don sau khi nhận đơn', JSON.parse((await luu(t)) || '{}').ma_don === 'TQD42');
  });
  them('kho-ban-mai', { S0: { kich: [...Array(9)].map(() => loiPos('KHO_BAN')) } }, async ({ t, S }) => {
    await mo(t, '/thanhtoan'); await sanSang(t); await bam(t);
    const ok = await doi(t, async () => { await t.clock.fastForward(2000); return /Gửi lại đúng đơn này/.test(await chu(t, '#checkout')); }, 15000);
    const g = JSON.parse((await luu(t)) || '{}');
    k('B1/B4 KHO_BAN hết 8 lượt tự gửi lại → "Lần đặt trước chưa rõ kết quả" + "Gửi lại đúng đơn này", bản ghi GIỮ, nút đặt khoá', ok && /Lần đặt trước chưa rõ kết quả/.test(await chu(t, '#checkout')) && g.khoa_gui === khoa(S.guiDon[0]) && !g.ma_don && await nutKhoa(t), `${S.guiDon.length} | ${await luu(t)}`);
    k('B1 9 lần gửi y hệt (khoá + thân)', S.guiDon.length === 9 && giongNhau(S.guiDon), String(S.guiDon.length));
    await t.locator('#checkout button', { hasText: 'Gửi lại đúng đơn này' }).click();
    k('B4 "Gửi lại đúng đơn này" → CÙNG khoá + thân, nhận đơn, MỘT đơn', await doi(t, async () => /\/don\/TQD42$/.test(t.url())) && S.guiDon.length === 10 && giongNhau(S.guiDon) && S.don.size === 1);
  });
  them('kho-ban-429', { S0: { kich: [loiPos('KHO_BAN'), loiPos('KHO_BAN'), loiPos('QUA_NHIEU_LAN', { thu_lai_sau_giay: 30 })] } }, async ({ t, S }) => {
    await mo(t, '/thanhtoan'); await sanSang(t); await bam(t);
    const ok = await doi(t, async () => /Gửi lại đúng đơn này/.test(await chu(t, '#checkout')), 9000);
    k('B1 Q1 KHO_BAN ×2 rồi 429 → chưa rõ: bản ghi GIỮ, "Gửi lại đúng đơn này", nút khoá (không mời đặt khoá mới)', ok && !!JSON.parse((await luu(t)) || '{}').khoa_gui && await nutKhoa(t) && S.guiDon.length === 3, `${S.guiDon.length} | ${await luu(t)}`);
  });
  them('kho-ban-hai-tab', { S0: { kich: [...Array(9)].map(() => loiPos('KHO_BAN')) } }, async ({ t, S, trang }) => {
    await mo(t, '/thanhtoan'); await sanSang(t); await bam(t);
    await doi(t, async () => S.guiDon.length >= 1);
    const t2 = await trang(); await mo(t2, '/thanhtoan');
    k('B1 tab 1 đang tự gửi lại KHO_BAN → tab 2 mở Thanh toán thấy "chưa rõ", nút khoá', await doi(t2, async () => /Gửi lại đúng đơn này/.test(await chu(t2, '#checkout'))) && await nutKhoa(t2));
    await bam(t2).catch(() => {}); await t2.waitForTimeout(300);
    k('B1 hai tab: mọi lần gửi cùng MỘT khoá', new Set(S.guiDon.map(khoa)).size === 1, String(S.guiDon.length));
  });
  them('khoa-da-dung', { S0: { kich: [loiPos('KHOA_GUI_DA_DUNG')] } }, async ({ t, S }) => {
    await choToi(t, S); await ghiBanGhi(t, THAN('DD'.repeat(10), 'qr'));
    await mo(t, '/thanhtoan');
    await doi(t, async () => /Gửi lại đúng đơn này/.test(await chu(t, '#checkout')));
    await t.locator('#checkout button', { hasText: 'Gửi lại đúng đơn này' }).click();
    const xem = async () => { const c = await chu(t, '#checkout'); return /Đơn này có thể đã đặt trước đó — mời bạn xem Lịch sử đơn/.test(c) && /Xem Lịch sử đơn/.test(c) && /Bỏ qua, đặt đơn mới/.test(c) && !/Gửi lại đúng đơn này/.test(c) && !/Vui lòng đặt lại/.test(c); };
    k('B2 KHOA_GUI_DA_DUNG → "Đơn này có thể đã đặt trước đó — mời bạn xem Lịch sử đơn" + "Xem Lịch sử đơn" + "Bỏ qua, đặt đơn mới", không "Gửi lại", không "Vui lòng đặt lại"', await doi(t, xem), (await chu(t, '#checkout')).slice(0, 200));
    const g = JSON.parse((await luu(t)) || '{}');
    k('B2 bản ghi GIỮ (đánh dấu da_dung), nút đặt khoá', g.khoa_gui === 'DD'.repeat(10) && g.da_dung === true && await nutKhoa(t), await luu(t));
    await chup(t, 'thanhtoan-khoa-da-dung-390');
    await t.reload(); await t.waitForSelector('.phone');
    k('B2 tải lại vẫn khối "có thể đã đặt"', await doi(t, xem));
    await t.locator('#checkout button', { hasText: 'Bỏ qua, đặt đơn mới' }).click();
    k('B2 khách tự bấm "Bỏ qua, đặt đơn mới" → bản ghi xoá, nút đặt mở', await sanSang(t) && (await luu(t)) === null && S.guiDon.length === 1);
  });

  them('gui-lai-429', { S0: { kich: [loiPos('QUA_NHIEU_LAN', { thu_lai_sau_giay: 30 })] } }, async ({ t, S }) => {
    const K = 'TL'.repeat(10);
    await choToi(t, S); await ghiBanGhi(t, THAN(K, 'qr'));
    await mo(t, '/thanhtoan');
    await doi(t, async () => /Gửi lại đúng đơn này/.test(await chu(t, '#checkout')));
    await t.locator('#checkout button', { hasText: 'Gửi lại đúng đơn này' }).click();
    await doi(t, async () => S.guiDon.length === 1); await t.waitForTimeout(400);
    k('B1 (soát vòng 1) "Gửi lại đúng đơn này" nhận 429 ngay lần đầu → bản ghi GIỮ cùng khoá, khối chưa rõ còn, nút đặt khoá', JSON.parse((await luu(t)) || '{}').khoa_gui === K && /Lần đặt trước chưa rõ kết quả/.test(await chu(t, '#checkout')) && await nutKhoa(t), await luu(t));
    const nutGl = t.locator('#checkout button', { hasText: /Gửi lại/ });
    k('B1 (soát vòng 2) trong lúc đếm ngược: nút "Gửi lại sau N giây" khoá', /Gửi lại sau (30|29) giây/.test(await nutGl.innerText()) && (await nutGl.getAttribute('aria-disabled')) === 'true');
    await nutGl.click({ force: true }); await nutGl.evaluate((b) => b.click()); await t.waitForTimeout(500); // chuột + kích kiểu bàn phím (pointer-events không chặn)
    k('B1 (soát vòng 2) bấm "Gửi lại" TRONG lúc đếm ngược → không gửi thêm', S.guiDon.length === 1, String(S.guiDon.length));
    await t.clock.fastForward(31000);
    await doiChu(t, '#checkout', /Gửi lại đúng đơn này/);
    await t.locator('#checkout button', { hasText: 'Gửi lại đúng đơn này' }).click();
    k('B1 hết đếm ngược, gửi lại → CÙNG khoá, MỘT đơn', await doi(t, async () => /\/don\/TQD42$/.test(t.url())) && S.guiDon.length === 2 && S.guiDon.every((x) => khoa(x) === K) && S.don.size === 1, String(S.guiDon.length));
  });

  // ---- C: Theo dõi đơn đọc ví đã giữ từ POS (v7)
  const DON_VQ = { ma: 'TQD70', tong: 81000, tt: 'cho_tra', qr: { chuoi: '0002010102TQD70', het_han: BAY('20:40:00') }, giu: 30000, cach: 'vi_qr' };
  them('v7-may-khac', { S0: { v7: true, vi: 99000 } }, async ({ t, S }) => {
    S.don.set('TQD70', { ...DON_VQ });
    await mo(t, '/don/TQD70');
    k('C1 máy khác (không bản ghi), POS v7 vi_qr → "Đã giữ 30.000đ trong ví · quét QR 51.000đ" + số cạnh QR 51.000đ', await doi(t, async () => /Đã giữ 30\.000đ trong ví · quét QR 51\.000đ/.test(await chu(t, '#tracking')) && /51\.000đ/.test(await chu(t, '.qr-chu'))), (await chu(t, '#tracking')).slice(0, 200));
    await chup(t, 'theodoi-v7-may-khac-390');
    await t.reload(); await t.waitForSelector('.phone');
    k('C1 tải lại vẫn đúng số POS', await doiChu(t, '#tracking', /Đã giữ 30\.000đ trong ví · quét QR 51\.000đ/));
  });
  them('v7-ban-ghi-khac', { S0: { v7: true } }, async ({ t, S }) => {
    S.don.set('TQD70', { ...DON_VQ });
    await choToi(t, S); await ghiBanGhi(t, { ...THAN('V7'.repeat(10), 'vi_qr'), ma_don: 'TQD70', giu_vi: 1000, con_lai: 80000 });
    await mo(t, '/don/TQD70');
    const ok = await doiChu(t, '#tracking', /Đã giữ 30\.000đ trong ví · quét QR 51\.000đ/);
    k('C1 bản ghi trên máy ghi số KHÁC → hiện số POS (POS trước, máy sau)', ok && !/(?<![\d.])1\.000đ|80\.000đ/.test(await chu(t, '#tracking')), (await chu(t, '#tracking')).slice(0, 200));
  });
  them('v7-don-quay', { S0: { v7: true } }, async ({ t, S }) => {
    S.don.set('TQD71', { ...DON_VQ, ma: 'TQD71', v7: { cach_tra: null, giu_vi: null, con_lai: null } });
    await choToi(t, S); await ghiBanGhi(t, { ...THAN('Q7'.repeat(10), 'vi_qr'), ma_don: 'TQD71', giu_vi: 30000, con_lai: 51000 });
    await mo(t, '/don/TQD71');
    await doi(t, async () => (await t.locator('.the-qr svg').count()) > 0);
    k('C2 POS trả cach_tra null (đơn quầy) → không dòng ví (kể cả bản ghi máy có số)', !/Đã giữ/.test(await chu(t, '#tracking')));
  });
  them('v7-qr', { S0: { v7: true } }, async ({ t }) => {
    await mo(t, '/thanhtoan'); await sanSang(t); await bam(t);
    await doi(t, async () => /\/don\/TQD42$/.test(t.url()));
    await t.evaluate(() => localStorage.removeItem('kh_don_gui')); await t.reload(); await t.waitForSelector('.phone');
    k('C1/K5 đơn QR, máy khác: số cạnh QR = tổng 87.654đ (từ POS), không dòng ví', await doiChu(t, '.qr-chu', /87\.654đ/) && !/Đã giữ/.test(await chu(t, '#tracking')));
  });

  // ---- D: bù ca soát cuối KH-MUA-1b
  them('d1-bao-gia-mat', { S0: { vi: 300000, treBg: 4000 } }, async ({ t, S }) => {
    await moPinVi(t, S);
    // Giỏ bị dọn giữa chừng (vd luuMay.doiKhach → docLaiGio) khi bảng PIN đang mở: báo giá đang hiện mất (bg = null). Gọi đúng bộ đặt state giỏ của App.
    const da = await t.evaluate(() => {
      const el = document.querySelector('#checkout'); let f = el[Object.keys(el).find((x) => x.startsWith('__reactFiber$'))];
      while (f && !(f.memoizedProps && Array.isArray(f.memoizedProps.gio) && f.memoizedProps.lui)) f = f.return;
      const gio = f && f.memoizedProps.gio;
      for (let a = f && f.return; a; a = a.return) for (let h = a.memoizedState; h && typeof h === 'object' && 'next' in h; h = h.next) if (h.memoizedState === gio && h.queue) { h.queue.dispatch([]); return true; }
      return false;
    });
    await doi(t, async () => /^Xác nhận( →)?$/.test((await nut(t).innerText().catch(() => '')).replace(/\s+/g, ' ').trim()));
    await goSo(t, PIN); await nutPin(t, 'Xác nhận').click(); await t.waitForTimeout(600);
    k('D1 bảng PIN mở sẵn, báo giá mất giữa chừng → nhập PIN + Xác nhận KHÔNG gửi POST /don, bảng đóng', da && S.guiDon.length === 0 && (await t.locator('.pin-pad').count()) === 0, `${da} ${S.guiDon.length}`);
  });
  them('d2-pin-dang-khoa', { S0: { vi: 300000, pinKhoa: true } }, async ({ t, S }) => {
    const K = 'PK'.repeat(10);
    await choToi(t, S); await ghiBanGhi(t, THAN(K, 'vi'));
    await mo(t, '/thanhtoan');
    await doi(t, async () => /Gửi lại đúng đơn này/.test(await chu(t, '#checkout')));
    await t.locator('#checkout button', { hasText: 'Gửi lại đúng đơn này' }).click(); await t.waitForSelector('.pin-pad');
    await goSo(t, PIN); await nutPin(t, 'Xác nhận').click();
    k('D2 "Gửi lại đúng đơn này" + PIN_DANG_KHOA → bảng PIN còn, lời POS, bản ghi GIỮ cùng khoá', await doiChu(t, '.pin-msg', /PIN_DANG_KHOA/) && (await t.locator('.pin-pad').count()) === 1 && JSON.parse((await luu(t)) || '{}').khoa_gui === K && khoa(S.guiDon[0]) === K, await luu(t));
  });
  them('d3-401-khach-khac', {}, async ({ t, S }) => {
    await mo(t, '/thanhtoan'); await sanSang(t);
    S.chetDon = true; await bam(t);
    await doi(t, async () => /\/trangchu$/.test(t.url()));
    const giu = !!JSON.parse((await luu(t)) || '{}').khoa_gui;
    S.chetDon = false; S.sdt = '0911222333';
    await t.evaluate(() => localStorage.setItem('kh_token', 'tok-A')); // khách KHÁC đăng nhập trên máy này (kho thường)
    await mo(t, '/trangchu'); await doi(t, async () => S.goi.filter((g) => g.duong === '/toi').length >= 2);
    k('D3 401 → bản ghi giữ; khách KHÁC đăng nhập → kh_don_gui bị xoá (luuMay.doiKhach)', giu && await doi(t, async () => (await luu(t)) === null), await luu(t));
  });

  // ---- F: bảng PIN
  for (const rong of [360, 390, 430]) {
    them(`f1-pin-${rong}`, { rong, S0: { vi: 300000 } }, async ({ t, S }) => {
      const do_ = () => t.evaluate(() => {
        const pad = document.querySelector('.pin-pad'), pn = pad.closest('.panel'), cs = getComputedStyle(pn), rp = pad.getBoundingClientRect(), rn = pn.getBoundingClientRect();
        const lech = [...pad.querySelectorAll('button')].map((b) => { const r = b.getBoundingClientRect(), g = document.createRange(); g.selectNodeContents(b); const c = g.getBoundingClientRect(); return Math.max(Math.abs((c.left + c.right - r.left - r.right) / 2), Math.abs((c.top + c.bottom - r.top - r.bottom) / 2)); });
        return { lech: Math.max(...lech), giua: Math.abs((rp.left - rn.left - parseFloat(cs.paddingLeft)) - (rn.right - parseFloat(cs.paddingRight) - rp.right)) };
      });
      await moPinVi(t, S);
      const a = await do_();
      k(`F1 [${rong}] trả ví: chữ / số giữa nút (lệch ≤ 1px ngang + dọc), bàn phím giữa khung (≤ 1px)`, a.lech <= 1 && a.giua <= 1, JSON.stringify(a));
      await chup(t, `pin-tra-vi-${rong}`);
      await t.keyboard.press('Escape');
      await mo(t, '/taikhoan/thongtin'); await t.locator('.pf-link', { hasText: 'Mã PIN' }).click(); await t.waitForSelector('.pin-pad');
      const b = await do_();
      k(`F1 [${rong}] đặt PIN: chữ / số giữa nút, bàn phím giữa khung`, b.lech <= 1 && b.giua <= 1, JSON.stringify(b));
      await chup(t, `pin-dat-${rong}`);
    });
  }
  them('f2-xac-nhan', { S0: { vi: 300000 } }, async ({ t, S }) => {
    await moPinVi(t, S);
    const hang = await t.locator('.pin-pad > *').evaluateAll((ds) => ds.slice(-3).map((x) => x.textContent.trim()));
    k('F2 hàng cuối bàn phím: "Xoá" · "0" · "Xác nhận"', JSON.stringify(hang) === JSON.stringify(['Xoá', '0', 'Xác nhận']), JSON.stringify(hang));
    await goSo(t, '135');
    k('F2 chưa đủ 4 số → "Xác nhận" tắt', await nutPin(t, 'Xác nhận').isDisabled());
    await nutPin(t, 'Xác nhận').click({ force: true }); await t.keyboard.press('Enter'); await t.waitForTimeout(400);
    k('F2 chưa đủ 4 số: bấm Xác nhận / Enter không gửi', S.guiDon.length === 0 && (await cham(t)) === 3);
    await goSo(t, '7'); await t.waitForTimeout(1000);
    k('F2 đủ 4 số mà KHÔNG bấm Xác nhận → không gửi', S.guiDon.length === 0 && (await cham(t)) === 4 && !(await nutPin(t, 'Xác nhận').isDisabled()));
    await nutPin(t, 'Xoá').click();
    k('F2 "Xoá" lùi đúng MỘT số (còn 3)', (await cham(t)) === 3);
    await t.keyboard.press('Backspace');
    k('F2 Backspace lùi một số (còn 2)', (await cham(t)) === 2);
    await goSo(t, '5'); await so(t, '5').focus(); // nút "5" vừa chạm còn focus: Enter không được bấm hộ nút đó
    await t.keyboard.press('Enter'); await t.waitForTimeout(400);
    k('F2 Enter khi chưa đủ số (nút số đang được chạm / focus) không nhập thêm số, không gửi', (await cham(t)) === 3 && S.guiDon.length === 0, String(await cham(t)));
    await t.keyboard.press('7'); await t.keyboard.press('Enter');
    k('F2 đủ 4 số + Enter = Xác nhận → gửi MỘT lần, đúng PIN', await doi(t, async () => /\/don\/TQD42$/.test(t.url())) && S.guiDon.length === 1 && JSON.parse(S.guiDon[0]).pin === PIN, String(S.guiDon.length));
  });
  them('f3-dat-pin', {}, async ({ t, S }) => {
    await mo(t, '/taikhoan/thongtin'); await t.locator('.pf-link', { hasText: 'Mã PIN' }).click(); await t.waitForSelector('.pin-pad');
    await goSo(t, '2468'); await t.waitForTimeout(500);
    k('F3 đặt PIN: đủ 4 số chưa bấm → vẫn "Đặt mã PIN mới"', /Đặt mã PIN mới/.test(await chu(t, '.pin-sheet h3')));
    await nutPin(t, 'Xác nhận').click();
    k('F3 bấm Xác nhận → "Nhập lại mã PIN mới", 0 chấm', /Nhập lại mã PIN mới/.test(await chu(t, '.pin-sheet h3')) && (await cham(t)) === 0);
    await goSo(t, '2469'); await nutPin(t, 'Xác nhận').click();
    k('F3 hai lần không khớp → "Hai lần nhập không khớp, đặt lại nhé", 0 PUT /pin', await doiChu(t, '.pin-msg', /Hai lần nhập không khớp, đặt lại nhé/) && S.datPin.length === 0);
    await goSo(t, '2468'); await nutPin(t, 'Xác nhận').click(); await goSo(t, '2468'); await nutPin(t, 'Xác nhận').click();
    k('F3 hai lần khớp → PUT /pin { pin, pin_lai } MỘT lần → "Đã lưu mã PIN"', await doiChu(t, '.pin-sheet', /Đã lưu mã PIN/) && S.datPin.length === 1 && S.datPin[0].pin === '2468' && S.datPin[0].pin_lai === '2468', JSON.stringify(S.datPin));
    await t.keyboard.press('Enter'); await t.waitForTimeout(500);
    k('F3 (soát vòng 1) Enter ở màn "Đã lưu mã PIN" KHÔNG gửi PUT /pin lần hai, đóng bảng như nút "Xong"', S.datPin.length === 1 && (await t.locator('.pin-sheet').count()) === 0, String(S.datPin.length));
  });
  them('f4-dang-gui', { S0: { vi: 300000, treDon: 1500 } }, async ({ t, S }) => {
    await moPinVi(t, S);
    await goSo(t, '1111'); await nutPin(t, 'Xác nhận').click();
    k('F4 đang gửi: nút "Đang gửi…" và tắt', await doi(t, async () => /Đang gửi…/.test(await chu(t, '.pin-pad')) && await t.locator('.pin-pad button', { hasText: 'Đang gửi…' }).isDisabled()));
    k('F4 POS PIN_SAI → hiện nguyên lời POS, xoá số đã nhập, nhập lại được', await doiChu(t, '.pin-msg', /Lời POS giả: PIN_SAI/, 6000) && (await cham(t)) === 0 && await nutPin(t, 'Xác nhận').isDisabled());
    await goSo(t, PIN); await nutPin(t, 'Xác nhận').click();
    k('F4 nhập lại đúng → đặt được (khoá mới, vì lần đầu chắc chưa tạo)', await doi(t, async () => /\/don\/TQD42$/.test(t.url()), 8000) && S.guiDon.length === 2 && khoa(S.guiDon[0]) !== khoa(S.guiDon[1]));
  });

  const t0 = Date.now();
  const hang = [...CA];
  await Promise.all([...Array(5)].map(async () => { while (hang.length) await hang.shift()(); }));
  console.log(`  (phần trình duyệt ${Math.round((Date.now() - t0) / 1000)} giây)`);
  await trinh.close();
}
