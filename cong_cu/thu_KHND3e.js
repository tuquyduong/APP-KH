#!/usr/bin/env node
// THỬ KH-ND-3e — gom nội dung về danh mục: Thanh toán, Theo dõi đơn, Đơn hàng, bảng PIN, thẻ QR trả tiền, báo đơn xong (đọc qua nd(), sửa được ở /admin).
// Phần 1 (luôn chạy, kể cả KHONG_TRINH_DUYET=1): danh mục hợp lệ, tệp A1 hết chữ cứng, khoá dùng ⇄ khoá khai, chữ mặc định không đổi, datDon.js chỉ đổi dòng có chữ.
// Phần 2: App thật trong Chromium với POS giả của thu_KHMUA1b (đặt một đơn QR, một đơn ví + PIN) — bản giả đổi khoá → màn đổi theo; bản rỗng → như cũ.
// Chạy: node cong_cu/thu_KHND3e.js → dòng cuối "n đạt · m hỏng". Không có Playwright / KHONG_TRINH_DUYET=1 → phần 2 BỎ QUA (không tính hỏng).
'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { pathToFileURL } = require('url');

const GOC = path.join(__dirname, '..');
let dat = 0, hong = 0;
const k = (ten, dung, them = '') => {
  if (dung) { dat++; console.log(`  ✓ ${ten}`); } else { hong++; console.log(`  ✗ ${ten}${them ? '  — ' + them : ''}`); }
};
const docTho = (f) => { try { return fs.readFileSync(path.join(GOC, f), 'utf8'); } catch { return ''; } };
const boChuThich = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`\\])\/\/[^\n]*/g, '$1');
const doc = (f) => boChuThich(docTho(f));
const nap = async (f) => { try { return await import(pathToFileURL(path.join(GOC, f)).href); } catch (e) { return { loiNap: String(e && e.message).split('\n')[0] }; } };

// Tệp A1 của phiếu: chữ khách đọc đã chuyển hết vào danh mục.
const A1 = ['src/pages/ThanhToan.jsx', 'src/pages/TheoDoiDon.jsx', 'src/pages/Don.jsx', 'src/components/PinSheet.jsx', 'src/components/TheQR.jsx', 'src/components/BaoDonXong.jsx',
  'src/components/HoaDonKhach.jsx', 'src/components/TrangTai.jsx', 'src/baoDonXong.js', 'src/datDon.js'];
const NHOM = /^(tt|td|dh|hd|pin|qr|bao|khung|giam|loi)\.[\w.]+$/;
// Chữ mặc định phải y hệt chữ đang chạy trước việc này (chép từ bản gốc fe752c3).
const GOC_CHU = {
  'tt.tieuDe': 'Thanh toán', 'tt.phu': 'Chọn cách nhận hàng & trả tiền', 'tt.nhan.giao.phu': 'Giao qua Ahamove · Sắp có', 'tt.vi.nhan': 'Trừ từ số dư ví',
  'tt.vi.loi': 'Chưa đọc được số dư · Bấm để thử lại', 'tt.nut.xacNhan': 'Xác nhận', 'tt.nut.guiLai': 'Mạng chậm, đang gửi lại…', 'tt.nut.xuLyTruoc': 'Xử lý đơn trước rồi đặt tiếp',
  'tt.guiLai.nut': 'Gửi lại đúng đơn này', 'tt.boQua': 'Bỏ qua, đặt đơn mới', 'tt.daDung.t': 'Đơn này có thể đã đặt trước đó — mời bạn xem Lịch sử đơn',
  'loi.GIA_DA_DOI': 'Giá vừa thay đổi, mời bạn xem lại', 'loi.GIA_DA_DOI_CU': 'Giá đã đổi so với lần đặt trước — đơn đó chưa tạo, mời bạn đặt lại',
  'loi.CHUA_MO': 'Đặt online sắp mở — mời bạn đặt tại quầy', 'loi.CHUA_RO': 'Chưa rõ quán đã nhận đơn chưa.', 'td.giuApp': 'Giữ App mở để được báo khi đồ uống xong',
  'td.xong': 'Đơn đã xong — mời bạn ra quầy', 'td.soDon': 'Số đơn của bạn — đọc cho nhân viên', 'td.goi': 'Gọi quán để huỷ', 'dh.tieuDe': 'Lịch sử đơn hàng', 'dh.nhan.huy': 'Đã hủy',
  'pin.moi.p': '4 số, không dùng số dễ đoán', 'pin.tra.p': 'Để trả bằng Ví nội bộ', 'pin.khongKhop': 'Hai lần nhập không khớp, đặt lại nhé', 'qr.phu': 'Quét mã để thanh toán',
  'bao.tieuDe': '(Xong) Đơn {don} — Tứ Quý Đường', 'bao.chu': 'Đơn {don} đã sẵn sàng — mời bạn ra quầy', 'khung.thuLai': 'Thử lại',
};

(async () => {
  console.log('Phần 1 — A. Danh mục và đọc nguồn');
  const ND = await nap('src/noiDung/nd.js');
  const DM = (await nap('src/noiDung/nd/index.js')).DANH_MUC || [];
  const DH = (await nap('src/noiDung/nd/donHang.js')).DON_HANG || [];
  const theo = new Map(DM.map((m) => [m.khoa, m]));
  k('A1 donHang.js khai ≥ 100 mục (chữ, nút, ảnh, mục khoá)', DH.length >= 100, `${DH.length} mục${ND.loiNap ? ' · ' + ND.loiNap : ''}`);
  const loi = typeof ND.kiemDanhMuc === 'function' ? ND.kiemDanhMuc(DM) : ['thiếu kiemDanhMuc'];
  k('A1 kiemDanhMuc(toàn bộ danh mục) = 0 lỗi', loi.length === 0 && DH.length > 0, loi.slice(0, 3).join(' | '));
  const man = new Set(DH.map((m) => m.man));
  k('A1 `man` chỉ gồm Thanh toán · Theo dõi đơn · Đơn hàng · Bảng PIN · Khung chung', DH.length > 0 && [...man].every((x) => ['Thanh toán', 'Theo dõi đơn', 'Đơn hàng', 'Bảng PIN', 'Khung chung'].includes(x)), [...man].join(','));
  k('A1 mọi khoá của nhóm này đúng dạng tiền tố, không trùng khoá của nhóm khác', DH.length > 0 && DH.every((m) => NHOM.test(m.khoa)) && DM.filter((m) => NHOM.test(m.khoa)).length >= DH.length);
  const H = require(path.join(GOC, 'cong_cu/ha_no_chu.js'));
  const du = A1.filter((f) => H.demChuCung(docTho(f)) > 0);
  k('A1 tệp A1 hết chữ tiếng Việt viết thẳng (đếm chữ cứng = 0, không ngoại lệ)', du.length === 0, du.map((f) => `${f}=${H.demChuCung(docTho(f))}`).join(', '));
  const khoaDung = new Set(), khoaLa = [];
  for (const f of A1) for (const m of doc(f).matchAll(/['"]((?:tt|td|dh|hd|pin|qr|bao|khung|giam|loi)\.[\w.]+)['"]/g)) { khoaDung.add(m[1]); if (!theo.has(m[1])) khoaLa.push(`${f}:${m[1]}`); }
  k('A1 mọi khoá dùng trong tệp A1 có trong danh mục', khoaDung.size >= 60 && khoaLa.length === 0, `${khoaDung.size} khoá · lạ: ${khoaLa.join(', ')}`);
  const thua = DH.map((m) => m.khoa).filter((x) => !khoaDung.has(x));
  k('A1 không khoá thừa: mỗi khoá khai đều có chỗ dùng', DH.length > 0 && thua.length === 0, thua.join(', '));
  const KHOA = DH.filter((m) => m.khoaBoi);
  const gan = (m) => A1.some((f) => doc(f).split('\n').some((l) => /ndDau\(|canhBao\(/.test(l) && l.includes(`'${m.khoa}'`))); // mục khoá được gắn data-nd-khoa (trực tiếp hoặc qua canhBao)
  k('A2 mục khoá pos (số tiền, số đơn, lời POS) có chỉ đường; mỗi mục khoá được gắn ndDau() ở một màn', KHOA.length >= 10 && KHOA.every((m) => m.khoaBoi === 'pos' && m.chiDuong)
    && KHOA.every(gan), KHOA.filter((m) => !gan(m)).map((m) => m.khoa).join(','));
  k('A3 câu báo lỗi App tự viết là mục loi.* (GIA_DA_DOI, GIA_DA_DOI_CU, CHUA_MO, CHUA_RO, NGOAI_GIO)', ['GIA_DA_DOI', 'GIA_DA_DOI_CU', 'CHUA_MO', 'CHUA_RO', 'NGOAI_GIO'].every((c) => theo.get('loi.' + c)?.loai === 'chu'));
  k('A3 lời POS kèm code vẫn hiện nguyên: ThanhToan vẫn hiện e.message, không thay bằng chữ App', /datThongBao\(e\.message\)/.test(doc('src/pages/ThanhToan.jsx')) && /datChanPos\(e\.message\)/.test(doc('src/pages/ThanhToan.jsx')));
  k('A1 không chữ "nợ" trong danh mục nhóm này (quán không có công nợ)', DH.length > 0 && !/nợ/i.test(JSON.stringify(DH)));
  const sai = Object.entries(GOC_CHU).filter(([x, v]) => (theo.get(x) || {}).macDinh !== v);
  k('A4 chữ mặc định = chữ đang chạy trước việc này (28 câu mẫu chép từ bản gốc)', sai.length === 0, sai.map(([x]) => x).join(', '));
  k('A4 mục có số/tên điền dùng {bien}: tt.nut.qr {tong}, tt.nut.viQr {vi}{qr}, td.vi.giu {giu}{qr}, dh.soDon {so}', JSON.stringify(theo.get('tt.nut.viQr')?.bien) === '["vi","qr"]' && JSON.stringify(theo.get('td.vi.giu')?.bien) === '["giu","qr"]'
    && JSON.stringify(theo.get('tt.nut.qr')?.bien) === '["tong"]' && JSON.stringify(theo.get('dh.soDon')?.bien) === '["so"]');

  console.log('Phần 1 — B. Hàm giữ nguyên hành vi');
  const D = await nap('src/datDon.js');
  const B = await nap('src/baoDonXong.js');
  if (typeof D.tenGiam === 'function') {
    k('B1 tenGiam: voucher / hạng có tên / hạng trống / Giờ vàng / loại lạ như cũ', D.tenGiam('ma_giam') === 'Giảm giá (voucher)' && D.tenGiam('hang', 'Vàng') === 'Ưu đãi hạng Vàng' && D.tenGiam('hang') === 'Ưu đãi hạng'
      && D.tenGiam('gio_vang') === 'Giờ vàng' && D.tenGiam('la') === 'Giảm giá');
    const b = D.buocTienTrinh('xong');
    k('B1 buocTienTrinh: chữ bước + dòng nhỏ như cũ, kèm khoá kt / ks để gắn data-nd', b.ds[3].t === 'Sẵn sàng — mời bạn ra quầy nhận' && b.ds[3].s === 'Đọc số đơn cho nhân viên' && b.ds[3].kt === 'td.buoc.xong' && b.ds[3].ks === 'td.buoc.xong.s'
      && b.ds[0].s === undefined && D.buocTienTrinh('da_huy').ds[0].t === 'Đã huỷ' && D.buocTienTrinh('dang_giao').ds.length === 5);
    k('B1 chanDat: câu mặc định ngoài giờ + lời POS ưu tiên; hết cờ → rỗng', D.chanDat({ nhan_don: false, dang_mo: true, thong_bao: '' }) === 'Quán đang ngoài giờ nhận đơn online.'
      && D.chanDat({ dang_mo: false, thong_bao: 'Quán nghỉ lễ' }) === 'Quán nghỉ lễ' && D.chanDat({ nhan_don: true, dang_mo: true }) === '');
    k('B1 CHU_CHUA_MO / CHU_CHUA_RO không còn xuất từ datDon (chữ ở danh mục)', D.CHU_CHUA_MO === undefined && D.CHU_CHUA_RO === undefined);
    const e = await D.guiDonAnToan({ khoa_gui: 'K'.repeat(20) }, { gui: () => Promise.reject(Object.assign(new Error('x'), { status: 503, code: 'LOI_MAY_CHU' })), cho: () => Promise.resolve() }).catch((x) => x);
    k('B1 guiDonAnToan hết lượt: ném lỗi "Chưa rõ quán đã nhận đơn chưa." (code KHONG_BIET)', e && e.code === 'KHONG_BIET' && e.message === 'Chưa rõ quán đã nhận đơn chưa.', String(e && e.message));
  } else k('B1 nạp được src/datDon.js', false, D.loiNap || '');
  k('B1 tieuDeXong như cũ', typeof B.tieuDeXong === 'function' && B.tieuDeXong('A7') === '(Xong) Đơn A7 — Tứ Quý Đường', B.loiNap || '');
  // datDon.js: chỉ đổi dòng có chữ (so với commit PHIEU của việc này) — đọc nguồn, không đổi tên hàm / phép tính / lời gọi api.js.
  const goc = spawnSync('git', ['log', '--format=%H', '--grep=^PHIEU: KH-ND-3e$', '-1'], { cwd: GOC, encoding: 'utf8' }).stdout.trim();
  const diff = goc ? spawnSync('git', ['diff', '-U0', goc, '--', 'src/datDon.js'], { cwd: GOC, encoding: 'utf8' }).stdout.split('\n') : [];
  const coDau = (s) => /[̀-ͯ]|[đĐ]/.test(s.normalize('NFD'));
  const bo = diff.filter((l) => /^-(?!--)/.test(l)).map((l) => l.slice(1)), them = diff.filter((l) => /^\+(?!\+\+)/.test(l)).map((l) => l.slice(1));
  const boLa = bo.filter((l) => !coDau(l) && !/CHU_CHUA_MO|CHU_CHUA_RO|ds: ma\.map\(/.test(l));
  const themLa = them.filter((l) => !/\bnd\(|td\.buoc\.|^import \{ nd \}|^\s*(\/\/|\/\*\*)/.test(l));
  k('B1 datDon.js so với bản gốc: mọi dòng bị bỏ đều có chữ (hoặc là hằng/lời gọi chữ), mọi dòng thêm là nd() / khoá / chú thích', !!goc && diff.length > 3 && boLa.length === 0 && themLa.length === 0, `${goc.slice(0, 7)} | bỏ lạ: ${boLa.join(' ¦ ')} | thêm lạ: ${themLa.join(' ¦ ')}`);
  const apiGoc = (s) => (s.match(/\b(baoGiaGio|datDonApp|huyDonApp|layChiTietDon)\(/g) || []).sort().join();
  const nguonGoc = goc ? spawnSync('git', ['show', `${goc}:src/datDon.js`], { cwd: GOC, encoding: 'utf8' }).stdout : '';
  const tenHam = (s) => [...s.matchAll(/^export (?:async )?(?:function|const) (\w+)/gm)].map((m) => m[1]).filter((x) => !/^CHU_CHUA_/.test(x)).sort().join();
  k('B1 datDon.js: tên hàm xuất và lời gọi api.js y như bản gốc (trừ hai hằng chữ)', !!nguonGoc && tenHam(nguonGoc) === tenHam(docTho('src/datDon.js')) && apiGoc(nguonGoc) === apiGoc(docTho('src/datDon.js')));

  console.log('Phần 2 — App thật trong Chromium');
  if (process.env.KHONG_TRINH_DUYET === '1') console.log('  BỎ QUA: KHONG_TRINH_DUYET=1 — các ca trong trình duyệt không chạy ở đây');
  else {
    let pw = null;
    try { pw = require('playwright'); } catch { /* không có */ }
    if (!pw) console.log('  BỎ QUA: không có Playwright ở máy này — các ca trong trình duyệt CHƯA chạy');
    else await trinhDuyet(pw);
  }
  console.log(`\n${dat} đạt · ${hong} hỏng`);
  process.exit(hong ? 1 : 0);
})().catch((e) => { console.error(e); console.log(`\n${dat} đạt · ${hong + 1} hỏng`); process.exit(1); });

async function trinhDuyet(pw) {
  const { dungMay } = require('./thu_KHMUA1b.js');
  const { trinh, may, mo, chu, doi, doiChu, nut, sanSang, bam, nhapPin, batVi, PIN } = await dungMay(pw, k);
  // Gói App có thêm cửa `window.__datBan` (datBanNoiDung) — thay gói thường bằng route đăng sau (Playwright ưu tiên route đăng sau).
  const goi = require('esbuild').buildSync({
    stdin: { contents: "import './main.jsx'; import { datBanNoiDung } from './noiDung/nd.js'; window.__datBan = datBanNoiDung;", resolveDir: path.join(GOC, 'src'), loader: 'jsx' },
    bundle: true, write: false, format: 'iife', jsx: 'automatic', logLevel: 'silent', loader: { '.css': 'empty', '.json': 'json' },
    define: { 'process.env.NODE_ENV': '"production"', 'import.meta.env.VITE_POS_API': '""' },
  }).outputFiles[0].text;
  const them = (ctx) => ctx.route('http://kh.test/bundle.js', (r) => r.fulfill({ contentType: 'text/javascript', body: goi }));
  const ban = (t, gia_tri) => t.evaluate((g) => window.__datBan({ so_ban: 9, gia_tri: g }), gia_tri);
  const dem = (t, sel) => t.locator(sel).count();

  await may('nd3e-qr', {}, async ({ t, S, ctx }) => {
    await them(ctx);
    await mo(t, '/thanhtoan');
    k('B1 [QR] nút đặt bật, chữ như cũ "Thanh toán qua QR 87.654đ", nằm trong phần tử data-nd', await sanSang(t) && (await chu(t, '#checkout .nut-dat')).startsWith('Thanh toán qua QR 87.654đ'));
    const so = await t.evaluate(() => ({ nd: document.querySelectorAll('#checkout [data-nd]').length, nut: !!document.querySelector('#checkout .nut-dat [data-nd="tt.nut.qr"]'), h2: document.querySelector('#checkout h2[data-nd="tt.nhan.tieuDe"]')?.textContent }));
    k('B1 [QR] màn Thanh toán có phần tử data-nd (≥ 8), nút đặt gắn tt.nut.qr, tiêu đề mục gắn tt.nhan.tieuDe', so.nd >= 8 && so.nut && so.h2 === 'Hình thức nhận hàng', JSON.stringify(so));
    await ban(t, { 'tt.nut.qr': 'Trả QR {tong}', 'tt.nhan.tieuDe': 'Cách lấy hàng', 'td.giuApp': 'Cứ để App mở nhé', 'td.xong': 'Xong rồi, mời ra quầy' });
    k('B1 [QR] bản giả đổi 2 khoá Thanh toán → nút "Trả QR 87.654đ", tiêu đề "Cách lấy hàng"', await doi(t, async () => (await chu(t, '#checkout .nut-dat')).startsWith('Trả QR 87.654đ') && (await chu(t, '#checkout h2')) === 'Cách lấy hàng'), await chu(t, '#checkout .nut-dat'));
    await ban(t, {});
    k('B1 [QR] bản rỗng → về như cũ', await doi(t, async () => (await chu(t, '#checkout .nut-dat')).startsWith('Thanh toán qua QR 87.654đ') && (await chu(t, '#checkout h2')) === 'Hình thức nhận hàng'));
    await ban(t, { 'td.giuApp': 'Cứ để App mở nhé' });
    await bam(t);
    k('B1 [QR] đặt đơn giả vẫn qua đủ bước: POST /don một lần, vào /don/TQD42, vẽ QR + số tiền + đếm ngược', await doi(t, async () => /\/don\/TQD42$/.test(t.url()) && (await dem(t, '.the-qr svg')) > 0 && /87\.654đ/.test(await chu(t, '.qr-chu')) && /còn \d:/.test(await chu(t, '.qr-chu'))) && S.guiDon.length === 1);
    const td = await t.evaluate(() => ({ qr: !!document.querySelector('.the-qr [data-nd="qr.phu"]'), buoc: document.querySelectorAll('#tracking .tl-chu [data-nd]').length, khoa: document.querySelectorAll('#tracking [data-nd-khoa]').length }));
    k('B1 [QR] Theo dõi đơn: thẻ QR gắn data-nd, các bước gắn data-nd, số tiền / mã gắn data-nd-khoa', td.qr && td.buoc >= 4 && td.khoa >= 1, JSON.stringify(td));
    S.don.get('TQD42').tt = 'da_tra';
    k('B1 [QR] đơn đã trả (hỏi lại 3 giây) → bản giả đổi td.giuApp: "Cứ để App mở nhé"; số đơn gắn data-nd-khoa', await doi(t, async () => /Cứ để App mở nhé/.test(await chu(t, '#tracking')) && (await dem(t, '#tracking .pick-num [data-nd-khoa="pos"]')) === 1, 9000), (await chu(t, '#tracking')).slice(0, 120));
    await ban(t, {});
    k('B1 [QR] bản rỗng → "Giữ App mở để được báo khi đồ uống xong"', await doi(t, async () => /Giữ App mở để được báo khi đồ uống xong/.test(await chu(t, '#tracking'))));
    await mo(t, '/taikhoan/donhang');
    await ban(t, { 'dh.nhan.cho': 'Đang chờ trả', 'dh.tieuDe': 'Các đơn của tôi' });
    const dh = await doi(t, async () => /Đang chờ trả|Đã thanh toán/.test(await chu(t, '#orderhistory')) && /Các đơn của tôi/.test(await chu(t, '#orderhistory')));
    k('B1 [Đơn hàng] danh sách: nhãn trạng thái gắn data-nd, số đơn / tiền gắn data-nd-khoa; bản giả đổi tên màn', dh && (await dem(t, '#orderhistory .order-status[data-nd]')) >= 1 && (await dem(t, '#orderhistory .order-card [data-nd-khoa="pos"]')) >= 2, (await chu(t, '#orderhistory')).slice(0, 100));
  });

  await may('nd3e-vi', { S0: { vi: 100000 } }, async ({ t, S, ctx }) => {
    await them(ctx);
    await mo(t, '/thanhtoan');
    await doi(t, async () => /Số dư/.test(await chu(t, '#checkout .the-vi')));
    await sanSang(t);
    if ((await chu(t, '#checkout .nut-dat')).startsWith('Thanh toán qua QR')) await batVi(t);
    k('B1 [Ví] công tắc ví gắn data-nd, nút đặt "Trừ ví 87.654đ"', await doi(t, async () => (await chu(t, '#checkout .nut-dat')).startsWith('Trừ ví 87.654đ')) && (await dem(t, '#checkout .the-vi [data-nd="tt.vi.nhan"]')) === 1);
    await bam(t);
    await t.waitForSelector('.pin-pad');
    const pin = await t.evaluate(() => ({ tieuDe: document.querySelector('.pin-sheet h3[data-nd="pin.tra.t"]')?.textContent, phu: document.querySelector('.pin-sheet [data-nd="pin.tra.p"]')?.textContent, nut: document.querySelector('.pin-pad [data-nd="pin.xacNhan"]')?.textContent }));
    k('B1 [Ví] bảng PIN: tiêu đề "Nhập mã PIN", dòng nhỏ, nút Xác nhận đều có data-nd', pin.tieuDe === 'Nhập mã PIN' && pin.phu === 'Để trả bằng Ví nội bộ' && pin.nut === 'Xác nhận', JSON.stringify(pin));
    await ban(t, { 'pin.tra.t': 'Gõ mã PIN của bạn', 'pin.xacNhan': 'Đồng ý' });
    k('B1 [Ví] bản giả đổi 2 khoá PIN → bảng đang mở đổi theo', await doi(t, async () => (await chu(t, '.pin-sheet h3')) === 'Gõ mã PIN của bạn' && (await t.locator('.pin-pad .pin-ok').innerText()) === 'Đồng ý'));
    await ban(t, {});
    k('B1 [Ví] bản rỗng → bảng PIN về "Nhập mã PIN" / "Xác nhận"', await doi(t, async () => (await chu(t, '.pin-sheet h3')) === 'Nhập mã PIN' && (await t.locator('.pin-pad .pin-ok').innerText()) === 'Xác nhận'));
    await nhapPin(t, '9999');
    k('B1 [Ví] PIN sai → lời POS hiện nguyên trong .pin-msg (data-nd-khoa pos), nhập lại được', await doi(t, async () => /Lời POS giả: PIN_SAI/.test(await chu(t, '.pin-msg')) && (await dem(t, '.pin-msg[data-nd-khoa="pos"]')) === 1) && (await dem(t, '.pin-pad')) === 1);
    await nhapPin(t, PIN);
    k('B1 [Ví] PIN đúng → đặt xong, vào /don/..., ví bị trừ ở POS giả (đơn đi đúng đường cũ)', await doi(t, async () => /\/don\/TQD\d+$/.test(t.url())) && S.guiDon.length === 2 && JSON.parse(S.guiDon[1]).pin === PIN);
  });
  await trinh.close();
}
