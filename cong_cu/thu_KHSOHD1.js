#!/usr/bin/env node
// THỬ KH-SOHD-1 — số đơn = `so_hd` của POS (v11), câu tiền về muộn, thẻ mã QR thương hiệu.
// Phần 1: hàm thuần + đọc nguồn (chạy ở mọi nơi) · Phần 2: App thật trong Chromium (POS giả của thu_KHMUA1b.js, thêm so_hd / tien_ve_da_cong_vi).
// Chạy: node cong_cu/thu_KHSOHD1.js → dòng cuối "n đạt · m hỏng". KHONG_TRINH_DUYET=1 hoặc không có Playwright → phần 2 BỎ QUA (không tính hỏng).
// D6: máy làm việc không có bộ giải mã QR (zbarimg / jsQR) nên KHÔNG kiểm quét máy — thay bằng dựng lại lưới bit từ hình đã vẽ và so với ma trận mức H.
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
const doc = (f) => (/\.(js|jsx)$/.test(f) ? boChuThich(docTho(f)) : docTho(f));
const nap = (f) => import(pathToFileURL(path.join(GOC, f)).href);

// Chuỗi VietQR / EMV mẫu: trường 38 (ngân hàng), 54 (số tiền), 62 → 08 (nội dung CK). Độ dài khác nhau qua phần đệm ở trường 62.
const tlv = (id, v) => id + String(v.length).padStart(2, '0') + v;
const vietqr = (ck, dem = '') => `000201010212${tlv('38', tlv('00', 'A000000727') + tlv('01', tlv('00', '970422') + tlv('01', '0123456789')) + tlv('02', 'QRIBFTTA'))}5303704${tlv('54', '45000')}5802VN${tlv('62', tlv('08', ck) + (dem ? tlv('01', dem) : ''))}6304ABCD`;
const MAU_CHUOI = [vietqr('TQDNOV06 APP0016'), vietqr('TQDNOV06 APP0016', 'x'.repeat(40)), vietqr('TQDDEC31 APP0123', 'y'.repeat(60))];

(async () => {
  console.log('Phần 1 — hàm thuần, đọc nguồn');
  const H = await nap('src/hoaDon.js');
  const D = await nap('src/datDon.js');
  const B = await nap('src/baoDonXong.js');
  const Q = await nap('src/qrThuongHieu.js');
  const { CAN_TU_POS } = await nap('src/kiemKhop/canTuPos.js');
  const qrcode = await import('qrcode-generator').then((m) => m.default || m);

  // A. hợp đồng v11
  const v11 = path.join(GOC, 'viec/KH-SOHD-1/hop_dong_v11.md');
  k('A1 thiet_ke/HOP_DONG_API_KH.md = viec/KH-SOHD-1/hop_dong_v11.md từng byte', fs.existsSync(v11) && fs.readFileSync(path.join(GOC, 'thiet_ke/HOP_DONG_API_KH.md')).equals(fs.readFileSync(v11)));
  const mc = (ma) => CAN_TU_POS.find((x) => x.ma === ma) || { truong: [] };
  k('A1 canTuPos khai trường v11 của /don/:ma và /don', ['don.so_hd', 'don.tien_ve_da_cong_vi', 'don.thong_bao_tien_ve'].every((x) => mc('don_v11').truong.includes(x)) && ['data[].so_hd', 'data[].tien_ve_da_cong_vi', 'data[].thong_bao_tien_ve'].every((x) => mc('don_ds_v11').truong.includes(x)));
  k('A1 canTuPos khai trường v10 của /hang (chi_cap, goi[], thu_bac)', ['data[].chi_cap', 'data[].goi[].so_thang', 'data[].goi[].gia', 'data[].thu_bac'].every((x) => mc('hang_v10').truong.includes(x)));

  // B. số đơn
  k('B1 soDon: có so_hd → so_hd (APP / HD / mã cũ)', H.soDon('APP0016', 'A123') === 'APP0016' && H.soDon('HD0016', 'A1') === 'HD0016' && H.soDon('012', 'A1') === '012' && H.soDon(' APP0016 ', 'A1') === 'APP0016');
  k('B1 soDon: null / rỗng / thiếu / không phải chuỗi → "#<mã>" như trước', [null, undefined, '', '  ', {}, []].every((x) => H.soDon(x, 'TQD50') === '#TQD50'));
  const dn = D.docDon({ don: { ma: 'A9', so_hd: 'APP0016', tien_trinh: 'da_tra', tong: 5000, tien_ve_da_cong_vi: 5000, thong_bao_tien_ve: 'Đã cộng 5.000đ vào ví.' } });
  k('B1 docDon mang soHd + cauTienVe; thiếu so_hd → null', dn && dn.soHd === 'APP0016' && dn.ma === 'A9' && dn.cauTienVe === 'Đã cộng 5.000đ vào ví.' && D.docDon({ don: { ma: 'A9' } }).soHd === null);
  const xd = B.xemDanhSach([{ ma: 'A1', so_hd: 'APP0016', tien_trinh: 'dang_lam' }, { ma: 'A2', tien_trinh: 'dang_lam' }], { thay: [], bao: [] });
  k('B1 xemDanhSach: nhan[ma] = số đơn hiện cho khách; choBao vẫn là mã App', xd.nhan.A1 === 'APP0016' && xd.nhan.A2 === '#A2' && B.tieuDeXong(xd.nhan.A1) === '(Xong) Đơn APP0016 — Tứ Quý Đường');
  const nguon = Object.fromEntries(['src/pages/TheoDoiDon.jsx', 'src/pages/Don.jsx', 'src/pages/ThanhToan.jsx', 'src/components/BaoDonXong.jsx', 'src/baoDonXong.js'].map((f) => [f, doc(f)]));
  k('B1 các màn gọi soDon (Theo dõi, Chi tiết + Lịch sử, Thanh toán, dải báo)', ['src/pages/TheoDoiDon.jsx', 'src/pages/Don.jsx', 'src/pages/ThanhToan.jsx', 'src/baoDonXong.js'].every((f) => /soDon\(/.test(nguon[f])));
  k('B1 không còn "#" + mã App dán thẳng ra màn', !Object.values(nguon).some((s) => /#\$\{(ma|donKhac|donCho\.ma|d\.ma)\}|#\{(don|d)\.ma\}|Đơn #\{ma\}/.test(s)));
  k('B2 mã App vẫn dùng để gọi: huyDon / moDon / datLai / kh_don_gui', /huyDon\(donCho\.ma\)/.test(nguon['src/pages/ThanhToan.jsx']) && /moDon\(donCho\.ma\)/.test(nguon['src/pages/ThanhToan.jsx']) && /ma_don: don\.ma/.test(nguon['src/pages/ThanhToan.jsx']) && /datLai\(d\.ma\)/.test(nguon['src/pages/Don.jsx']));

  // C. tiền về muộn, tờ hoá đơn
  const C = (t, s) => H.cauTienVe({ tien_ve_da_cong_vi: t, thong_bao_tien_ve: s });
  k('C1 cauTienVe: > 0 và có câu → NGUYÊN câu POS', C(50000, 'Không tạo được đơn — đã cộng 50.000đ vào tài khoản.') === 'Không tạo được đơn — đã cộng 50.000đ vào tài khoản.');
  k('C1 cauTienVe: 0 / thiếu số / không phải số / câu null / câu rỗng → "" (App không tự ghép)', C(0, 'x') === '' && C(undefined, 'x') === '' && C('5000', 'x') === '' && C(50000, null) === '' && C(50000, '  ') === '' && H.cauTienVe(null) === '');
  k('C3 tờ chỉ có dòng ghi_no → không còn dòng nào (coi như không có tờ)', H.docHoaDon({ hoa_don: [{ loai: 'ghi_no', trai: 'Ghi nợ', phai: '5.000đ' }] }).length === 0);
  k('C3 ghi_no bị bỏ, dòng khác giữ đủ thứ tự', H.docHoaDon({ hoa_don: [{ loai: 'mon', trai: 'a' }, { loai: 'ghi_no', trai: 'n' }, { loai: 'tong', trai: 't' }] }).map((d) => d.loai).join() === 'mon,tong');
  k('C2 ma_gd (Mã GD) xếp nhóm tra, vẽ trai / phai', H.nhomHoaDon('ma_gd') === 'tra' && H.docHoaDon({ hoa_don: [{ loai: 'ma_gd', trai: 'Mã GD', phai: 'FT26310' }] })[0].phai === 'FT26310');

  // D. thẻ mã QR
  k('D2 noiDungCK đọc trường 62 → 08', Q.noiDungCK(MAU_CHUOI[0]) === 'TQDNOV06 APP0016' && Q.noiDungCK(MAU_CHUOI[2]) === 'TQDDEC31 APP0123');
  k('D2 noiDungCK: thiếu 62 / thiếu 08 / cắt cụt / rác / không phải chuỗi → ""', ['000201010212', MAU_CHUOI[0].slice(0, 70), 'abc', '', null, 42].every((x) => Q.noiDungCK(x) === '') && Q.noiDungCK(`000201${tlv('62', tlv('01', 'abc'))}`) === '');
  const goc = (m) => { const q = qrcode(0, m.m || 'H'); q.addData(m.s); q.make(); return q; };
  for (const [i, s] of MAU_CHUOI.entries()) {
    const m = Q.dungTheQR(s);
    const q = goc({ s });
    const n = q.getModuleCount();
    const tamR = (n / 2), banKinh = m.logo.r;
    const ve = new Set();
    const mauVe = new Map();
    for (const g of m.cham) for (const x of g.d.matchAll(/M([\d.]+) ([\d.]+)a/g)) { const kh = `${Math.round(Number(x[2]) - 0.5)},${Math.round(Number(x[1]) - 0.05)}`; ve.add(kh); mauVe.set(kh, g.mau); }
    const can = new Set(); let hu = 0;
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      if (!q.isDark(r, c)) continue;
      const fin = (r < 7 && (c < 7 || c >= n - 7)) || (r >= n - 7 && c < 7);
      const gan = Math.hypot(c + 0.5 - tamR, r + 0.5 - tamR) < banKinh + 0.5;
      if (gan) hu++;
      if (!fin && Math.hypot(c + 0.5 - tamR, r + 0.5 - tamR) >= banKinh) can.add(`${r},${c}`);
    }
    k(`D1 [${i}] n = ${n}, mức H (ma trận khớp qrcode-generator 'H'); viền ≥ 3, nền trắng quanh`, m.n === n && m.vien >= 3 && m.tong === n + 2 * m.vien);
    k(`D1 [${i}] chấm tròn đúng các ô đậm ngoài finder / đĩa logo (không thừa, không thiếu)`, ve.size === can.size && [...can].every((x) => ve.has(x)), `${ve.size} vẽ / ${can.size} cần`);
    k(`D1 [${i}] không chấm rời ở vùng finder 7×7; 3 ô góc TL / TR / BL, đúng toạ độ`, [...ve].every((x) => { const [r, c] = x.split(',').map(Number); return !((r < 7 && (c < 7 || c >= n - 7)) || (r >= n - 7 && c < 7)); }) && m.finder.length === 3 && m.finder.some((f) => f.x === 0 && f.y === 0) && m.finder.some((f) => f.x === n - 7 && f.y === 0) && m.finder.some((f) => f.x === 0 && f.y === n - 7));
    const ph = (r, c) => (r + 0.5 < n / 2 ? (c + 0.5 < n / 2 ? Q.MAU_QR.trenTrai : Q.MAU_QR.trenPhai) : (c + 0.5 < n / 2 ? Q.MAU_QR.duoiTrai : Q.MAU_QR.duoiPhai));
    k(`D1 [${i}] màu theo 4 phần tư (tâm = giữa ma trận); đủ 4 màu; finder theo phần tư của nó`, [...mauVe].every(([x, mau]) => { const [r, c] = x.split(',').map(Number); return mau === ph(r, c); }) && new Set(mauVe.values()).size === 4 && m.finder.every((f) => f.mau === ph(f.y + 3, f.x + 3)));
    k(`D1 [${i}] đĩa logo ≤ 20% bề ngang mã, ở giữa; ô mã chịu mất < 10% (mức H chịu 30%)`, 2 * banKinh <= 0.2 * n + 1e-9 && m.logo.cx === n / 2 && m.logo.cy === n / 2 && hu / (n * n) < 0.1, `${hu}/${n * n}`);
  }
  const dai = [Q.dungTheQR(MAU_CHUOI[2]).n, goc({ s: MAU_CHUOI[2], m: 'M' }).getModuleCount()];
  k('D1 mức H thật: chuỗi dài cho ma trận LỚN HƠN mức M', dai[0] > dai[1], dai.join(' vs '));
  k('D1 màu 4 phần tư là bốn màu chủ quán duyệt, đặt MỘT chỗ ở qrThuongHieu.js', JSON.stringify(Object.values(Q.MAU_QR)) === JSON.stringify(['#253A6E', '#966923', '#347042', '#B2342C']));

  const TQ = docTho('src/components/TheQR.jsx'), CSS = docTho('src/giaoDien/the_qr.css');
  k('D3 TheQR: finder vẽ khối TÔ ĐẶC (không vòng rỗng: không stroke / fill="none"); nền trắng; đĩa logo + logo_tqd_192.png', !/stroke|fill="none"/.test(TQ) && /rx="2"/.test(TQ) && /fill="#fff"/.test(TQ) && /logo_tqd_192\.png/.test(TQ) && fs.existsSync(path.join(GOC, 'public/anh/logo_tqd_192.png')));
  k('D3 TheQR: chữ "Tứ Quý Đường" + "Quét mã để thanh toán", dòng "<so_hd> · <nội dung CK>"; TheoDoiDon dùng TheQR thay VeQR', /Quét mã để thanh toán/.test(TQ) && /Tứ Quý Đường/.test(TQ) && /noiDungCK\(chuoi\)/.test(TQ) && /<TheQR /.test(nguon['src/pages/TheoDoiDon.jsx']) && !/VeQR/.test(nguon['src/pages/TheoDoiDon.jsx']));
  k('D4 ManQR.jsx (mã thành viên) không đổi: vẫn VeQR mức M, không TheQR', /export function VeQR/.test(docTho('src/pages/ManQR.jsx')) && /qrcode\(0, 'M'\)/.test(docTho('src/pages/ManQR.jsx')) && !/TheQR/.test(docTho('src/pages/ManQR.jsx')));
  const bay = ['#FBF3E6', '#B08028', '#7A1E18'], bon = ['#253A6E', '#966923', '#347042', '#B2342C'];
  const rai = [];
  (function quet(d) { for (const e of fs.readdirSync(path.join(GOC, d), { withFileTypes: true })) { const p = `${d}/${e.name}`; if (e.isDirectory()) quet(p); else if (/\.(jsx?|css)$/.test(e.name)) rai.push(p); } })('src');
  const ngoai = rai.filter((f) => ![...bay, ...bon].every((x) => !new RegExp(x, 'i').test(docTho(f))) && f !== 'src/giaoDien/the_qr.css' && f !== 'src/qrThuongHieu.js');
  k('D5 bảy màu ngoại lệ chỉ nằm ở the_qr.css và qrThuongHieu.js', ngoai.length === 0 && bay.every((x) => new RegExp(x, 'i').test(CSS)) && bon.every((x) => new RegExp(x, 'i').test(docTho('src/qrThuongHieu.js'))), ngoai.join(','));

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
  const { may, mo, chu, doi, chup, tranNgang } = await dungMay(pw, k);
  const CSS = ['bao_don', 'thanh_toan', 'hoa_don', 'the_qr'].map((f) => docTho(`src/giaoDien/${f}.css`)).join('\n');
  const css = (t) => t.addStyleTag({ content: CSS });
  const HET = '2026-10-30T20:40:00';
  const DON = (ma, tt, them = {}) => ({ ma, tong: 87654, tt, qr: null, giu: 87654, cach: 'vi', mon: [], ...them });
  const DON_QR = (them = {}) => DON('TQD50', 'cho_tra', { cach: 'qr', giu: 0, soHd: 'APP0016', qr: { chuoi: MAU_CHUOI[0], het_han: HET }, ...them });
  const CA = [];
  const them = (ten, opt, f) => { if (!process.env.CHI_CA || ten.includes(process.env.CHI_CA)) CA.push(() => may(ten, opt, f)); };
  const mapDon = (...ds) => new Map(ds.map((d) => [d.ma, d]));
  const doiChu = (t, sel, re) => doi(t, async () => re.test(await chu(t, sel)));

  // B1/B2 — Theo dõi đơn: so_hd có → hiện so_hd (tiêu đề + ô to), đường dẫn vẫn /don/<ma>; null → mã cũ.
  for (const [ten, so, mong] of [['co', 'APP0016', 'APP0016'], ['quay', 'HD0016', 'HD0016'], ['null', null, '#TQD50']]) {
    them(`theodoi-${ten}`, { gio: [], S0: { v7: true, don: mapDon(DON('TQD50', 'da_tra', { soHd: so })) } }, async ({ t }) => {
      await mo(t, '/don/TQD50'); await css(t);
      await doiChu(t, '#tracking', /Số đơn của bạn/);
      const x = await chu(t, '#tracking');
      k(`B1 Theo dõi [so_hd ${so}] ô to = ${mong}, tiêu đề "Đơn ${mong}"`, (await chu(t, '#tracking .pick-num .n')) === mong && x.includes(`Đơn ${mong}`), x.slice(0, 160));
      k(`B2 Theo dõi [so_hd ${so}] đường dẫn vẫn /don/TQD50${so ? ', mã App không lộ ra màn' : ''}`, /\/don\/TQD50$/.test(t.url()) && (so ? !/TQD50/.test(x) : true));
    });
  }

  // B1 — Lịch sử đơn + Chi tiết đơn (+ tiền về muộn C1).
  them('lich-su', { gio: [], S0: { v7: true, don: mapDon(DON('TQD50', 'da_tra', { soHd: 'APP0016' })), donCu: [DON('TQD60', 'xong', { soHd: '012', tienVeDa: 50000, thongBao: 'Không tạo được đơn — đã cộng 50.000đ vào tài khoản của bạn.' }), DON('TQD70', 'xong')] } }, async ({ t }) => {
    await mo(t, '/taikhoan/donhang'); await css(t);
    await doi(t, async () => (await t.locator('.order-card .code').count()) === 3);
    const ma = await t.locator('.order-card .code').allTextContents();
    k('B1 Lịch sử: mỗi thẻ hiện so_hd (APP0016, 012); không có → #mã', ma.join('|') === 'APP0016|012|#TQD70', ma.join('|'));
    await t.locator('.order-card').nth(1).click();
    await doi(t, async () => /\/taikhoan\/donhang\/TQD60$/.test(t.url()));
    await doiChu(t, '#orderdetail', /012/);
    const x = await chu(t, '#orderdetail');
    k('B1 Chi tiết đơn: tiêu đề + mã = 012; B2 đường dẫn dùng mã App', (await chu(t, '#orderdetail .code')) === '012' && /Đơn 012/.test(x) && !/TQD60/.test(x));
    k('C1 Chi tiết đơn: hiện NGUYÊN câu tiền về của POS', x.includes('Không tạo được đơn — đã cộng 50.000đ vào tài khoản của bạn.'), x.slice(0, 200));
  });

  // C1 — Theo dõi đơn: có câu → hiện nguyên câu, thay câu cũ; không câu mà cờ đối soát → giữ câu cũ; không cả hai → không có.
  them('tien-ve', { gio: [], S0: { v7: true, don: mapDon(DON('TQD50', 'da_huy', { soHd: 'APP0016', tienVe: true, tienVeDa: 50000, thongBao: 'Không tạo được đơn — đã cộng 50.000đ vào tài khoản của bạn.' }), DON('TQD51', 'da_huy', { soHd: 'APP0017', tienVe: true }), DON('TQD52', 'da_huy', { soHd: 'APP0018' })) } }, async ({ t }) => {
    await mo(t, '/don/TQD50'); await css(t); await doiChu(t, '#tracking', /Không tạo được đơn/);
    const a = await chu(t, '#tracking');
    k('C1 Theo dõi: có câu POS → hiện nguyên câu, KHÔNG hiện câu cũ', a.includes('Không tạo được đơn — đã cộng 50.000đ vào tài khoản của bạn.') && !/Quán đã nhận tiền/.test(a), a.slice(0, 200));
    await mo(t, '/don/TQD51'); await css(t); await doiChu(t, '#tracking', /Quán đã nhận tiền/);
    k('C1 Theo dõi: không câu, cờ tien_ve_cho_doi_soat → giữ câu cũ', /Quán đã nhận tiền, nhân viên sẽ liên hệ với bạn/.test(await chu(t, '#tracking')));
    await mo(t, '/don/TQD52'); await css(t); await doiChu(t, '#tracking', /Đã huỷ/);
    k('C1 Theo dõi: không tiền về → không có câu nào (không chặn oan)', !/Quán đã nhận tiền|đã cộng/.test(await chu(t, '#tracking')));
  });

  // B1 — dải báo đơn xong.
  them('bao-don', { gio: [], S0: { v7: true, don: mapDon(DON('TQD50', 'dang_lam', { soHd: 'APP0016' })) } }, async ({ t, S, ctx }) => {
    await mo(t, '/menu'); await css(t);
    await doi(t, async () => S.goi.filter((g) => g.duong === '/don').length >= 1);
    S.don.get('TQD50').tt = 'xong';
    await ctx.clock.runFor(15500);
    k('B1 dải báo: "Đơn APP0016 đã sẵn sàng — mời bạn ra quầy"', await doiChu(t, '.bao-don', /Đơn APP0016 đã sẵn sàng — mời bạn ra quầy/), await chu(t, '.bao-don'));
    k('B1 tiêu đề tab "(Xong) Đơn APP0016 — Tứ Quý Đường"', (await t.title()) === '(Xong) Đơn APP0016 — Tứ Quý Đường', await t.title());
  });

  // B1 — Thanh toán: đơn đang chờ trả.
  them('thanh-toan', { S0: { v7: true, don: mapDon(DON_QR()) } }, async ({ t }) => {
    await mo(t, '/thanhtoan'); await css(t);
    await doiChu(t, '#checkout', /đang chờ trả/);
    const x = await chu(t, '#checkout');
    k('B1 Thanh toán: "Bạn có đơn APP0016 đang chờ trả" + nút "Tiếp tục trả đơn APP0016"', /Bạn có đơn APP0016 đang chờ trả/.test(x) && /Tiếp tục trả đơn APP0016/.test(x) && !/TQD50/.test(x), x.slice(0, 200));
    await t.locator('#checkout .checkout-btn', { hasText: /Tiếp tục trả đơn/ }).click();
    k('B2 bấm tiếp tục → /don/TQD50 (mã App)', await doi(t, async () => /\/don\/TQD50$/.test(t.url())), t.url());
  });

  // D3 — thẻ QR ở Theo dõi đơn (QR cả đơn, ví + QR, nội dung CK không đọc được, tải lại).
  for (const rong of [360, 390, 430]) {
    them(`the-qr-${rong}`, { rong, gio: [], S0: { v7: true, don: mapDon(DON_QR()) } }, async ({ t }) => {
      await mo(t, '/don/TQD50'); await css(t);
      await doi(t, async () => (await t.locator('.the-qr svg').count()) === 1);
      const dong = await chu(t, '.the-qr-dong');
      k(`D3 [${rong}] thẻ: "Tứ Quý Đường", "Quét mã để thanh toán", số tiền 87.654đ, dòng "APP0016 · TQDNOV06 APP0016"`, /Tứ Quý Đường/.test(await chu(t, '.the-qr-dau')) && /Quét mã để thanh toán/.test(await chu(t, '.the-qr-dau')) && (await chu(t, '.the-qr-tien')) === '87.654đ' && dong === 'APP0016 · TQDNOV06 APP0016', dong);
      k(`D3 [${rong}] không dòng chữ cuối thẻ; 3 ô góc đặc; mã QR có ≥ 300 chấm; đĩa logo`, (await t.locator('.the-qr > *').last().getAttribute('class')) === 'the-qr-o' && (await t.locator('.the-qr svg g').count()) === 3 && (await t.locator('.the-qr svg path').count()) === 4 && (await t.locator('.the-qr svg image').count()) === 1);
      k(`D3 [${rong}] giữ đồng hồ đếm ngược "còn 9:…" cạnh thẻ; thẻ không tràn ngang`, /còn (9:5\d|10:00)/.test(await chu(t, '.qr-chu')) && !(await tranNgang(t)));
      const hop = await t.locator('.the-qr').boundingBox();
      k(`D3 [${rong}] thẻ nằm trọn trong màn`, !!hop && hop.x >= 0 && hop.x + hop.width <= rong + 1, JSON.stringify(hop));
      await chup(t, `the-qr_${rong}`);
    });
    them(`the-qr-vi-${rong}`, { rong, gio: [], S0: { v7: true, vi: 50000, don: mapDon(DON_QR({ cach: 'vi_qr', giu: 50000 })) } }, async ({ t }) => {
      await mo(t, '/don/TQD50'); await css(t);
      await doi(t, async () => (await t.locator('.the-qr svg').count()) === 1);
      k(`D3 [${rong}] ví + QR: số tiền trên thẻ = phần còn lại 37.654đ; dòng ví đã giữ còn`, (await chu(t, '.the-qr-tien')) === '37.654đ' && /Đã giữ 50\.000đ trong ví · quét QR 37\.654đ/.test(await chu(t, '#tracking')));
      await chup(t, `the-qr-vi_${rong}`);
    });
  }
  them('the-qr-hong', { gio: [], S0: { v7: true, don: mapDon(DON_QR({ qr: { chuoi: '000201hong', het_han: HET } })) } }, async ({ t }) => {
    await mo(t, '/don/TQD50'); await css(t);
    await doi(t, async () => (await t.locator('.the-qr svg').count()) === 1);
    k('D2 nội dung CK không đọc được → dòng chỉ còn so_hd', (await chu(t, '.the-qr-dong')) === 'APP0016');
  });
  them('the-qr-khong-so', { gio: [], S0: { v7: true, don: mapDon(DON_QR({ cach: 'qr', soHd: undefined })) } }, async ({ t }) => {
    await mo(t, '/don/TQD50'); await css(t);
    await doi(t, async () => (await t.locator('.the-qr svg').count()) === 1);
    k('D3 POS chưa trả so_hd (cũ) → thẻ vẫn vẽ, dòng chỉ có nội dung CK, tiêu đề "Đơn #TQD50"', (await chu(t, '.the-qr-dong')) === 'TQDNOV06 APP0016' && /Đơn #TQD50/.test(await chu(t, '#tracking')));
  });

  // E3 — ảnh đối chiếu (chỉ khi đặt LUU_ANH_DIR): Theo dõi đã trả (APP0016), Lịch sử đơn, câu tiền về muộn.
  if (process.env.LUU_ANH_DIR) {
    for (const rong of [360, 390, 430]) {
      them(`anh-${rong}`, { rong, gio: [], S0: { v7: true, don: mapDon(DON('TQD50', 'da_tra', { soHd: 'APP0016' }), DON('TQD51', 'da_huy', { soHd: 'APP0017', tienVe: true, tienVeDa: 50000, thongBao: 'Không tạo được đơn — đã cộng 50.000đ vào tài khoản của bạn.' })), donCu: [DON('TQD60', 'xong', { soHd: '012' })] } }, async ({ t }) => {
        await mo(t, '/don/TQD50'); await css(t); await doiChu(t, '#tracking', /Số đơn của bạn/); await chup(t, `theodoi-da-tra_${rong}`);
        await mo(t, '/taikhoan/donhang'); await css(t); await doi(t, async () => (await t.locator('.order-card .code').count()) === 3); await chup(t, `lich-su_${rong}`);
        await mo(t, '/don/TQD51'); await css(t); await doiChu(t, '#tracking', /Không tạo được đơn/); await chup(t, `tien-ve-muon_${rong}`);
      });
    }
  }
  for (const c of CA) await c();
}
