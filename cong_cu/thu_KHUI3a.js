#!/usr/bin/env node
// THỬ KH-UI-3a — nối hợp đồng v2: hạng, ví, giá theo hạng, Giờ vàng, giờ hoạt động, "bây giờ" của POS, nhãn khoá tiện ích.
// Phần 1: hàm thuần (bayGio, gioVang, giaHang, gioHoatDong, api.js) · Phần 2: App thật trong Chromium + POS giả (dữ liệu ĐÚNG hình dạng hợp đồng v2).
// Chạy: node cong_cu/thu_KHUI3a.js → dòng cuối "n đạt · m hỏng". Không có Playwright → phần 2 BỎ QUA (nói rõ).
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { pathToFileURL } = require('url');

const GOC = path.join(__dirname, '..');
let dat = 0, hong = 0;
const k = (ten, dung, them = '') => {
  if (dung) { dat++; console.log(`  ✓ ${ten}`); } else { hong++; console.log(`  ✗ ${ten}${them ? '  — ' + them : ''}`); }
};
const doc = (f) => fs.readFileSync(path.join(GOC, f), 'utf8');
const nap = (f) => import(pathToFileURL(path.join(GOC, f)).href);
const baoLoi = (ten, e) => k(ten, false, String(e && e.message).split('\n')[0]);

// ===== Dữ liệu mẫu ĐÚNG hình dạng hợp đồng v2 (tên trường đối chiếu với khối HOP_DONG_MAY_DOC) =====
const BAY = (gio) => `2026-10-30T${gio}`;
const HANG = { success: true, data: [
  { id: 2, ten: 'Vàng', phan_tram: 10, phan_tram_nhom_dac_biet: 5, gia_the: 199000, thu_tu: 1 },
  { id: 3, ten: 'Kim cương', phan_tram: 15, phan_tram_nhom_dac_biet: 8, gia_the: 499000, thu_tu: 2 },
] };
const HANG_VANG = { id: 2, ten: 'Vàng', phan_tram: 10, phan_tram_nhom_dac_biet: 5, het_han: '2026-11-15T23:59:59' };
const TOI = (hang, soDuVi) => ({ success: true, khach: { sdt: '0909123456', ten: 'Linh', ngay_tao: '2026-01-01T08:00:00', qr: 'QR', hang, so_du_vi: soDuVi } });
const MENU = { success: true, data: [
  { ma: 'TLB', ten: 'Trà Lục Bảo', nhom: 'Trà Đông Y', gia: 30000, con_hang: true, ton_cu: false, ton_luc: null, gia_hang: [{ hang_id: 2, gia: 27000 }, { hang_id: 3, gia: 25500 }] },
  { ma: 'TPN', ten: 'Trà Phổ Nhĩ', nhom: 'Trà Đông Y', gia: 28000, con_hang: true, ton_cu: false, ton_luc: null, gia_hang: [{ hang_id: 2, gia: 25200 }, { hang_id: 3, gia: 23800 }] },
  { ma: 'CFS', ten: 'Cà phê sữa', nhom: 'Cà phê', gia: 25000, con_hang: true, ton_cu: false, ton_luc: null, gia_hang: [] },
  { ma: 'EPC', ten: 'Ép cam', nhom: 'Nước ép', gia: 35000, con_hang: true, ton_cu: false, ton_luc: null, gia_hang: [{ hang_id: 2, gia: 35000 }, { hang_id: 3, gia: 35000 }] },
] };
const GV_CHAY = { success: true, dang_chay: true, bat_dau: BAY('20:00:00'), ket_thuc: BAY('22:00:00'), phan_tram: 50, mon: ['TLB', 'MA_LA'] };
const GV_CHUA = { ...GV_CHAY, dang_chay: false };
const GV_TAT = { success: true, dang_chay: false, bat_dau: null, ket_thuc: null, phan_tram: 0, mon: [] };
const GHD = (o) => ({ success: true, bay_gio: BAY('20:30:00'), dang_mo: true, nhan_don: true, hom_nay: { mo: '08:00', dong: '22:00' }, mo_lai_luc: null, thong_bao: '',
  lich_tuan: [{ thu: 2, mo: '08:00', dong: '22:00', nghi: false }, { thu: 8, mo: null, dong: null, nghi: true }], ngay_nghi: [], ...o });
const GHD_DONG = GHD({ bay_gio: BAY('23:10:00'), dang_mo: false, nhan_don: false, hom_nay: null, mo_lai_luc: BAY('08:00:00'), thong_bao: 'Quán đã đóng cửa, mở lại lúc 08:00 ngày mai.' });

(async () => {
  console.log('Phần 1 — hàm thuần');
  let bg, gv, gh, hh, ap;
  try { bg = await nap('src/bayGio.js'); } catch (e) { baoLoi('nạp src/bayGio.js', e); }
  try { gv = await nap('src/gioVang.js'); } catch (e) { baoLoi('nạp src/gioVang.js', e); }
  try { gh = await nap('src/giaHang.js'); } catch (e) { baoLoi('nạp src/giaHang.js', e); }
  try { hh = await nap('src/gioHoatDong.js'); } catch (e) { baoLoi('nạp src/gioHoatDong.js', e); }
  const api = doc('src/api.js');

  // A1 — ba cửa mới, viết thẳng goi('GET', '/…'), không token
  for (const d of ['/hang', '/gio-vang', '/gio-hoat-dong']) k(`A1 api.js có goi('GET', '${d}')`, api.includes(`goi('GET', '${d}')`));
  const hd = JSON.parse(doc('thiet_ke/HOP_DONG_API_KH.md').split('<!-- HOP_DONG_MAY_DOC -->')[1].match(/```json\n([\s\S]*?)```/)[1]);
  const traCua = (d) => (hd.cua.find((c) => c.duong === d) || {}).tra || [];
  k('A1 mẫu thử có đủ trường hợp đồng: /toi (hang, so_du_vi), /menu (gia_hang), /gio-vang, /gio-hoat-dong',
    traCua('/toi').includes('khach.so_du_vi') && traCua('/toi').includes('khach.hang.het_han') && traCua('/menu').includes('data[].gia_hang[].gia')
    && ['dang_chay', 'bat_dau', 'ket_thuc', 'phan_tram', 'mon'].every((f) => traCua('/gio-vang').includes(f))
    && ['bay_gio', 'dang_mo', 'nhan_don', 'hom_nay', 'mo_lai_luc', 'thong_bao'].every((f) => traCua('/gio-hoat-dong').includes(f))
    && Object.keys(GV_CHAY).concat(Object.keys(GHD())).filter((f) => f !== 'success').every((f) => ['dang_chay', 'bat_dau', 'ket_thuc', 'phan_tram', 'mon', 'bay_gio', 'dang_mo', 'nhan_don', 'hom_nay', 'mo_lai_luc', 'thong_bao', 'lich_tuan', 'ngay_nghi'].includes(f)));

  // B — bayGio
  if (bg) {
    try {
      k('B1 chưa có số của POS → rơi về gioVn() (đồng hồ máy + 7 giờ)', (bg.xoaLech(), bg.bayGio(Date.UTC(2026, 9, 30, 13, 0, 0)) === '2026-10-30 20:00:00'));
      const may = Date.UTC(2026, 9, 30, 1, 0, 0); // máy nói 08:00 VN
      k('B1 nhận bay_gio của POS (20:30:00, máy lệch cả giờ) → bayGio theo POS', bg.datBayGio(BAY('20:30:00'), may) === true && bg.bayGio(may) === '2026-10-30 20:30:00');
      k('B1 giữa hai lần hỏi đếm giây bằng đồng hồ máy (+75 giây)', bg.bayGio(may + 75000) === '2026-10-30 20:31:15');
      k('B1 chuỗi POS dạng có dấu cách vẫn nhận; chuỗi hỏng → không đổi độ lệch', bg.datBayGio('2026-10-30 21:00:00', may) === true && bg.datBayGio('xyz', may) === false && bg.bayGio(may) === '2026-10-30 21:00:00');
      k('B1 qua nửa đêm: 23:59:30 + 45 giây → ngày sau 00:00:15', (bg.datBayGio(BAY('23:59:30'), may), bg.bayGio(may + 45000) === '2026-10-31 00:00:15'));
      bg.xoaLech();
    } catch (e) { baoLoi('B1 bayGio', e); }
    const cum = "import('./src/bayGio.js').then((b)=>{const may=Date.UTC(2026,9,30,1,0,0);console.log(b.bayGio(may));b.datBayGio('2026-10-30T20:30:00',may);console.log(b.bayGio(may+90000));})";
    const chayTz = (tz) => { try { return execFileSync(process.execPath, ['-e', cum], { cwd: GOC, env: { TZ: tz }, encoding: 'utf8' }); } catch (e) { return 'LOI ' + e.message; } };
    const u = chayTz('UTC'), v = chayTz('Asia/Ho_Chi_Minh'), l = chayTz('America/Los_Angeles');
    k('B3 TZ=UTC, TZ=Asia/Ho_Chi_Minh, TZ=America/Los_Angeles cho CÙNG kết quả; máy lệch vẫn ra giờ POS', u === v && v === l && u.trim().split('\n')[1] === '2026-10-30 20:31:30', JSON.stringify([u, v, l]));
  }
  const khongNewDate = ['src/bayGio.js', 'src/gioVang.js', 'src/gioHoatDong.js'].filter((f) => fs.existsSync(path.join(GOC, f))).every((f) => !/new Date\(\s*[a-zA-Z_.]*(chuoi|bat_dau|ket_thuc|bay_gio)/.test(doc(f)));
  k('B2 không `new Date(<chuỗi giờ POS>)` trong bayGio / gioVang / gioHoatDong', khongNewDate);
  k('B2 ba chỗ từng dùng gioVn() làm "bây giờ" đã đổi sang bayGio()', ['src/dungTracNghiem.js', 'src/dungMenu.js', 'src/pages/TracNghiemKetQua.jsx'].every((f) => /bayGio\(\)/.test(doc(f)) && !/\bgioVn\(\)/.test(doc(f))));

  // E — Giờ vàng (hàm thuần)
  if (gv) {
    try {
      const T = (g, b) => gv.trangThaiGioVang(g, b);
      const a = T(GV_CHAY, '2026-10-30 20:30:00');
      k('E2 dang_chay=true trong khung → pha "dang", còn 5400 giây, %=50, khung "20:00"–"22:00"', a && a.pha === 'dang' && a.conLai === 5400 && a.phanTram === 50 && a.batDau === '20:00' && a.ketThuc === '22:00', JSON.stringify(a));
      const b2 = T(GV_CHUA, '2026-10-30 19:00:00');
      k('E2 chưa tới giờ (dang_chay=false, 19:00) → pha "truoc", còn 3600 giây', b2 && b2.pha === 'truoc' && b2.conLai === 3600, JSON.stringify(b2));
      const c = T(GV_CHAY, '2026-10-30 22:00:00');
      k('E2 hết khung (đồng hồ qua ket_thuc dù cờ dang_chay cũ vẫn true) → pha "sau", tự đổi không cần tải lại', c && c.pha === 'sau', JSON.stringify(c));
      k('E2 sau giờ kết thúc, dang_chay=false → "sau"', (T(GV_CHUA, '2026-10-30 23:00:00') || {}).pha === 'sau');
      k('E2 đúng cờ dang_chay mới là "đang giảm": trong khung mà cờ false → KHÔNG "dang"', (T(GV_CHUA, '2026-10-30 21:00:00') || {}).pha !== 'dang');
      k('E2 tắt (bat_dau null, % 0, không món) → null (ẩn mọi chỗ)', T(GV_TAT, '2026-10-30 20:30:00') === null && T(null, '2026-10-30 20:30:00') === null && T({ ...GV_CHAY, mon: [] }, '2026-10-30 20:30:00') === null && T({ ...GV_CHAY, phan_tram: 0 }, '2026-10-30 20:30:00') === null);
      const qd = { ...GV_CHAY, bat_dau: '2026-10-29T22:00:00', ket_thuc: '2026-10-30T02:00:00' };
      k('E2 khung qua nửa đêm đang chạy sau 00:00 (bat_dau là hôm qua) → còn 3600 giây lúc 01:00', (T(qd, '2026-10-30 01:00:00') || {}).conLai === 3600);
      const gioNgan = { ...GV_CHAY, bat_dau: '20:00', ket_thuc: '22:00' };
      k('E2 bộ đọc nhận cả dạng "HH:mm" (hợp đồng chưa ghi dạng): còn 5400 giây lúc 20:30', (T(gioNgan, '2026-10-30 20:30:00') || {}).conLai === 5400);
      k('E2 đếm ngược định dạng h:mm:ss', gv.chuDemNguoc(5400) === '1:30:00' && gv.chuDemNguoc(59) === '0:00:59' && gv.chuDemNguoc(3725) === '1:02:05');
      k('E2 nhãn món theo pha: đang "Giờ vàng −50%" · chưa tới "… từ 20:00" · chờ POS "… sắp bắt đầu" · hết khung "Giờ vàng đã kết thúc" (không còn "từ 20:00")',
        gv.chuNhanMon(a) === 'Giờ vàng −50%' && gv.chuNhanMon(b2) === 'Giờ vàng −50% từ 20:00' && gv.chuNhanMon(T(GV_CHUA, '2026-10-30 20:30:00')) === 'Giờ vàng −50% sắp bắt đầu' && gv.chuNhanMon(c) === 'Giờ vàng đã kết thúc');
      k('E3 mọi chữ Giờ vàng không có "suất"', ['tile', 'short', 'long'].every((kieu) => [a, b2, c].every((t) => !/suất/i.test(gv.chuGioVang(t, kieu)))));
      k('E2 chữ: đang → "Còn 1:30:00"; chưa tới → "Mở lúc 20:00"; hết khung → "Đã kết thúc"', gv.chuGioVang(a, 'short') === 'Còn 1:30:00' && /Mở lúc 20:00/.test(gv.chuGioVang(b2, 'short')) && gv.chuGioVang(c, 'short') === 'Đã kết thúc');
      const ds = MENU.data;
      const set = gv.maGioVang(GV_CHAY, ds);
      k('E4 món Giờ vàng ghép theo `ma`; mã không có trong menu (MA_LA) bị bỏ qua, không lỗi', set.has('TLB') && !set.has('MA_LA') && set.size === 1 && gv.maGioVang(null, ds).size === 0 && gv.maGioVang(GV_CHAY, []).size === 0);
    } catch (e) { baoLoi('E gioVang', e); }
  }

  // D — giá theo hạng (tra bảng, không công thức)
  if (gh) {
    try {
      const [tlb, tpn, cfs, epc] = MENU.data;
      k('D1 có dòng hang_id = hạng khách → giá dòng đó (27.000, KHÔNG 30.000 × 0,9 tính tay)', gh.giaChoKhach(tlb, HANG_VANG) === 27000);
      k('D1 giá lấy đúng từ bảng dù KHÁC công thức (bảng 26.999 → 26.999)', gh.giaChoKhach({ ...tlb, gia_hang: [{ hang_id: 2, gia: 26999 }] }, HANG_VANG) === 26999);
      k('D1 khách không hạng (null) → giá gốc', gh.giaChoKhach(tlb, null) === 30000);
      k('D1 gia_hang rỗng / thiếu → giá gốc', gh.giaChoKhach(cfs, HANG_VANG) === 25000 && gh.giaChoKhach({ ...cfs, gia_hang: undefined }, HANG_VANG) === 25000);
      k('D1 hạng 0 % (bảng = giá gốc) → giá gốc', gh.giaChoKhach(epc, HANG_VANG) === 35000);
      k('D1 hạng khách không có dòng trong gia_hang → giá gốc (không đoán)', gh.giaChoKhach(tlb, { id: 9, ten: 'Lạ' }) === 30000);
      k('D1 src/giaHang.js không nhân phần trăm', !/Math\.round|\*\s*\(?\s*1\s*-|\/\s*100|\*\s*0?\.\d/.test(doc('src/giaHang.js')));
      const bac = gh.bacThang(HANG.data, tpn, HANG_VANG);
      k('D2 bậc thang: Thường + từng hạng POS trả, đúng giá, đánh dấu hạng của khách', bac.length === 3 && bac[0].ten === 'Thường' && bac[0].gia === 28000 && bac[1].gia === 25200 && bac[1].laToi === true && bac[2].gia === 23800 && !bac[0].laToi, JSON.stringify(bac));
      k('D2 khách không hạng → "Thường" là của mình', gh.bacThang(HANG.data, tpn, null).find((x) => x.laToi).ten === 'Thường');
      k('D2 hạng POS không trả giá cho món → cột đó không hiện; không có bậc nào → null (ẩn)', gh.bacThang(HANG.data, cfs, HANG_VANG) === null && gh.bacThang(HANG.data, { ...tpn, gia_hang: [{ hang_id: 3, gia: 23800 }] }, HANG_VANG).length === 3 - 1);
      const sach = gh.boGiaHang(MENU);
      k('D4 boGiaHang bỏ mọi gia_hang, giữ phần còn lại, không sửa bản gốc', sach.data.length === 4 && sach.data.every((m) => !('gia_hang' in m)) && sach.data[0].gia === 30000 && 'gia_hang' in MENU.data[0]);
    } catch (e) { baoLoi('D giaHang', e); }
  }

  // F — giờ hoạt động
  if (hh) {
    try {
      k('F1 quán mở: đang mở, không thông báo', hh.trangThaiQuan(GHD()).dangMo === true && hh.trangThaiQuan(GHD()).thongBao === '');
      const d = hh.trangThaiQuan(GHD_DONG);
      k('F1 quán đóng: thông báo NGUYÊN VĂN của POS', d.dangMo === false && d.thongBao === 'Quán đã đóng cửa, mở lại lúc 08:00 ngày mai.');
      k('F1 chưa có dữ liệu / hỏng → null (ẩn, không bịa)', hh.trangThaiQuan(null) === null && hh.trangThaiQuan({}) === null);
      k('F3 tên thứ: 2–7 = Thứ Hai–Thứ Bảy, 8 = Chủ nhật; mo/dong null = nghỉ / chưa cài', hh.tenThu(2) === 'Thứ Hai' && hh.tenThu(7) === 'Thứ Bảy' && hh.tenThu(8) === 'Chủ nhật' && hh.tenThu(1) === '');
      hh.datGioHoatDong(GHD());
      k('F3 gioHoatDong.js giữ chung lich_tuan / ngay_nghi / nhan_don cho màn khác', hh.layGioHoatDong().lich_tuan.length === 2 && hh.layGioHoatDong().nhan_don === true);
      hh.datGioHoatDong(null);
    } catch (e) { baoLoi('F gioHoatDong', e); }
  }

  { // H1b → KH-UI-3c: Giờ vàng tắt thì ô Giờ vàng vẫn có mặt (mờ), nên luật "giãn hết hàng khi chỉ một ô" không còn dùng
    const cssGd = doc('src/giaoDien/giaoDien.css');
    k('H1b (KH-UI-3c) .hb-tiles luôn hai cột: không còn luật giãn hết hàng khi chỉ một ô', !/\.hb-tiles:has\(> :only-child\)/.test(cssGd));
  }

  console.log('Phần 2 — App thật trong Chromium');
  let pw = null;
  if (process.env.KHONG_TRINH_DUYET !== '1') { try { pw = require('playwright'); } catch { /* không có */ } }
  if (!pw) console.log('  BỎ QUA: không có Playwright ở máy này — các ca trong trình duyệt CHƯA chạy');
  else await trinhDuyet(pw);

  console.log(`\n${dat} đạt · ${hong} hỏng`);
  process.exit(hong ? 1 : 0);
})().catch((e) => { console.error(e); console.log(`\n${dat} đạt · ${hong + 1} hỏng`); process.exit(1); });

async function trinhDuyet(pw) {
  const esbuild = require('esbuild');
  const goi = esbuild.buildSync({
    entryPoints: [path.join(GOC, 'src/main.jsx')], bundle: true, write: false, format: 'iife', jsx: 'automatic', logLevel: 'silent',
    loader: { '.css': 'empty', '.json': 'json' }, define: { 'process.env.NODE_ENV': '"production"', 'import.meta.env.VITE_POS_API': '""' },
  }).outputFiles[0].text;
  // CSS đúng như Vite dựng: theo thứ tự import của main.jsx, `@import './x.css'` (demo.css → demo_1 / demo_2) bung tại chỗ.
  const cssTron = (f) => doc(f).replace(/@import\s+'\.\/([^']+)';/g, (_, t) => cssTron(path.posix.join(path.posix.dirname(f), t)));
  const css = [...doc('src/main.jsx').matchAll(/import '\.\/(giaoDien\/[^']+\.css)'/g)].map((m) => cssTron('src/' + m[1])).join('\n');
  const trinh = await pw.chromium.launch({ args: ['--no-sandbox'] });
  const URL0 = 'http://kh.test';
  // Trang gốc = index.html thật (có bộ biểu tượng <symbol>), chỉ đổi dòng nạp mã sang bản dựng sẵn.
  const CHUA_DN = doc('index.html').replace(/<script type="module"[^>]*><\/script>/, '<script src="/bundle.js"></script>');

  // Một ca: context mới + POS giả đọc từ P (đổi P giữa ca được). P.hong = { hang:true, … } → cửa đó trả 500.
  async function ca(ten, { rong = 390, tz = 'Asia/Ho_Chi_Minh', dn = true, may = null, pos = {} } = {}, chay) {
    const ctx = await trinh.newContext({ viewport: { width: rong, height: 844 }, timezoneId: tz });
    const t = await ctx.newPage();
    const loi = [];
    t.on('pageerror', (e) => loi.push(e.message));
    if (may) { await t.clock.install({ time: new Date(may) }); await t.clock.resume(); }
    await t.addInitScript(() => { try { sessionStorage.setItem('kh_da_xem_man_dau', '1'); } catch { /* bỏ qua */ } }); // đã xem màn mở: không che trang (CSS thật có màn mở)
    await t.addInitScript(({ dn }) => { if (dn && !sessionStorage.getItem('da_gieo')) { sessionStorage.setItem('da_gieo', '1'); localStorage.setItem('kh_token', 'tok-A'); } }, { dn });
    const P = { toi: TOI(HANG_VANG, 85000), hang: HANG, menu: MENU, gioVang: GV_CHAY, gioHoatDong: GHD(), hong: {}, ...pos };
    await t.route(`${URL0}/**`, async (r) => {
      const u = new URL(r.request().url()), p = u.pathname, auth = r.request().headers().authorization || '';
      const json = (status, o) => r.fulfill({ status, contentType: 'application/json', body: JSON.stringify(o) });
      if (p === '/bundle.js') return r.fulfill({ contentType: 'text/javascript', body: goi });
      if (!p.startsWith('/api/kh')) return /\.[a-z0-9]+$/.test(p) ? r.fulfill({ status: 204, body: '' }) : r.fulfill({ contentType: 'text/html', body: CHUA_DN.replace('</head>', `<style>${css}</style></head>`) });
      const duong = p.slice('/api/kh'.length);
      const cua = { '/hang': 'hang', '/gio-vang': 'gioVang', '/gio-hoat-dong': 'gioHoatDong' }[duong];
      if (cua) return P.hong[cua] ? json(500, { error: 'lỗi', code: 'LOI_MAY_CHU' }) : json(200, P[cua]);
      if (duong === '/menu' && P.menuKhongToken) return json(200, P.menu);
      if (!auth) return json(401, { error: 'Cần đăng nhập', code: 'KH_PHIEN_SAI' });
      if (duong === '/toi') return json(200, P.toi);
      if (duong === '/menu') return json(200, P.menu);
      if (duong === '/diem') return json(200, { success: true, points: 1250, history: [] });
      if (duong === '/voucher') return json(200, { success: true, data: [{ ma: 'V1' }, { ma: 'V2' }], ma_khach_moi: [] });
      return json(500, { error: 'chưa giả', code: 'LOI_GIA' });
    });
    let kq;
    t.setDefaultTimeout(4000);
    try { kq = await chay(t, P, loi); } catch (e) { baoLoi(`ca ${ten} dừng giữa chừng`, e); } finally { await ctx.close(); }
    return kq;
  }
  const chu = (t) => t.locator('body').innerText();
  const mo = async (t, duong) => { await t.goto(URL0 + duong); await t.waitForSelector('.phone'); await t.waitForTimeout(700); };
  const cho = (t, ms = 500) => t.waitForTimeout(ms);
  const khoaLuu = (t) => t.evaluate(() => JSON.stringify(Object.fromEntries(Object.keys(localStorage).map((x) => [x, localStorage.getItem(x)]))));

  await ca('a-hang-gv-chay', {}, async (t, P, loi) => {
    await mo(t, '/trangchu');
    const tx = await chu(t);
    k('C1 Trang chủ đã đăng nhập: thẻ hội viên hiện "Hạng Vàng"', (await t.locator('.points-card .tier').allInnerTexts()).join('').includes('Hạng Vàng'));
    k('E1 ô Giờ vàng ở Trang chủ cạnh ô Trắc nghiệm (hai ô một hàng): −50%, "1 món đang giảm", đếm ngược theo POS', (await t.locator('.hb-tiles .hb-tile').count()) === 2
      && (await t.locator('.hb-t-flash .hb-off').innerText()) === '−50%' && /1 món đang giảm/.test(await t.locator('.hb-t-flash .hb-h').innerText()) && /^Còn 1:(29|30):\d\d$/.test(await t.locator('.hb-t-flash .hb-s').innerText()), await t.locator('.hb-tiles').innerText());
    k('F1 Trang chủ: quán đang mở', tx.includes('Quán đang mở cửa'));
    k('E3 không chữ "suất" ở Trang chủ', !/suất/i.test(tx));
    k('Lỗi JS = 0 (Trang chủ)', loi.length === 0, loi.join('|'));
    await mo(t, '/menu');
    const m = await chu(t);
    k('E1 Menu có ô "Giờ vàng" trong lưới nhóm, có trạng thái live', (await t.locator('.ct.gv').count()) === 1 && /Còn 1:(29|30)/.test(await t.locator('.ct.gv small').innerText()));
    const oTlb = t.locator('.prod-card', { hasText: 'Trà Lục Bảo' }), oTpn = t.locator('.prod-card', { hasText: 'Trà Phổ Nhĩ' }), oCf = t.locator('.prod-card', { hasText: 'Cà phê sữa' });
    k('E1 ô món Giờ vàng có nhãn "Giờ vàng −50%"', /Giờ vàng −50%/.test(await oTlb.innerText()));
    k('D5 món Giờ vàng: KHÔNG hiện giá hạng (27.000 / 25.500), không bậc thang', !/27\.000|25\.500/.test(await oTlb.innerText()) && (await oTlb.locator('.lad').count()) === 0 && /30\.000đ/.test(await oTlb.innerText()));
    const bac = oTpn.locator('.lad');
    k('D2 món thường: bậc thang giá các hạng (28.000 · 25.200 · 23.800), hạng của khách đậm', (await bac.count()) === 1 && /28\.000/.test(await bac.innerText()) && /23\.800/.test(await bac.innerText()) && /vàng/i.test(await bac.locator('.me').innerText()) && /25\.200/.test(await bac.locator('.me').innerText()), await oTpn.innerText());
    k('D1 gia_hang rỗng → chỉ giá gốc, không bậc thang', (await oCf.locator('.lad').count()) === 0 && /25\.000đ/.test(await oCf.innerText()));
    k('D2 hạng 0 % (Ép cam): cột của khách = giá gốc 35.000', /35\.000/.test(await t.locator('.prod-card', { hasText: 'Ép cam' }).locator('.lad .me').innerText()));
    k('E3 không chữ "suất" ở Menu', !/suất/i.test(m));
    await t.locator('.ct.gv').click(); await cho(t);
    k('E1 chạm ô Giờ vàng → khối gv-head + chỉ món Giờ vàng (Trà Lục Bảo)', (await t.locator('.gv-head.live').count()) === 1 && (await t.locator('#catGrid .prod-card').count()) === 1 && /Trà Lục Bảo/.test(await t.locator('#catGrid').innerText()));
    await t.goto(URL0 + '/mon/tra-luc-bao'); await t.waitForSelector('.detail-name'); await cho(t);
    const tm = await chu(t);
    k('E1/D5 Trang món Giờ vàng: ghi chú gv-note live, giá gốc, không giá hạng', (await t.locator('.gv-note.on').count()) === 1 && /Giờ vàng −50%/.test(tm) && !/27\.000/.test(tm) && /30\.000đ/.test(tm) && !/suất/i.test(tm), tm.slice(0, 300));
    await t.goto(URL0 + '/mon/tra-pho-nhi'); await t.waitForSelector('.detail-name'); await cho(t);
    k('D2 Trang món thường: bậc thang lớn, "Giá của bạn" ở hạng Vàng 25.200đ', (await t.locator('.ladd .me').count()) === 1 && /25\.200đ/.test(await t.locator('.ladd .me').innerText()) && /giá của bạn/i.test(await t.locator('.ladd').innerText()));
    await mo(t, '/taikhoan');
    const ak = await chu(t);
    k('C2 Tài khoản: thẻ đầu có tên + "Hạng Vàng"; ô nhanh Ví 85.000đ · Điểm 1.250 · Voucher 2', /Linh/.test(ak) && /Hạng Vàng/.test(ak) && /85\.000đ\s*\n?\s*Ví/.test(ak) && /1\.250\s*\n?\s*Điểm/.test(ak) && /2\s*\n?\s*Voucher/.test(ak), ak.slice(0, 260));
    k('C2 không bao giờ chữ "nợ"', !/\bnợ\b/i.test(ak) && !/\bnợ\b/i.test(tx + m + tm));
  });

  await ca('b-khong-hang-vi-0', { pos: { toi: TOI(null, 0) } }, async (t, P, loi) => {
    await mo(t, '/taikhoan');
    const ak = await chu(t);
    k('C2 Ví = 0 hiện "0đ" (số thật, không ẩn); hạng null không hiện "Hạng …" bịa', /0đ\s*\n?\s*Ví/.test(ak) && !/Hạng/.test(ak), ak.slice(0, 200));
    await mo(t, '/trangchu');
    k('C1 hạng null: thẻ hội viên không có nhãn hạng bịa ("Thường 0%")', (await t.locator('.points-card .tier').count()) === 0 && !/Thường/.test(await t.locator('.points-card').innerText()));
    await mo(t, '/menu');
    const bac = t.locator('.prod-card', { hasText: 'Trà Phổ Nhĩ' }).locator('.lad');
    k('D1 khách không hạng: bậc thang có, "Thường" là của mình (28.000)', /thường/i.test(await bac.locator('.me').innerText()) && /28\.000/.test(await bac.locator('.me').innerText()), await bac.innerText());
    k('Lỗi JS = 0', loi.length === 0, loi.join('|'));
  });

  await ca('c-gv-tat', { pos: { gioVang: GV_TAT } }, async (t) => {
    await mo(t, '/trangchu');
    k('E2 Giờ vàng tắt: Trang chủ vẫn hai ô một hàng, ô Giờ vàng MỜ "Hiện chưa có" (KH-UI-3c), không đếm ngược', (await t.locator('.hb-t-flash.hb-mo').count()) === 1 && (await t.locator('.hb-tiles .hb-tile').count()) === 2 && /Hiện chưa có/.test(await t.locator('.hb-t-flash').innerText()) && (await t.locator('.hb-t-flash .hb-s').count()) === 0);
    await mo(t, '/menu');
    k('E2 Giờ vàng tắt: Menu không có ô / nhãn Giờ vàng', (await t.locator('.ct.gv').count()) === 0 && !/Giờ vàng/.test(await chu(t)));
  });

  await ca('d-gv-chua-toi', { pos: { gioVang: GV_CHUA, gioHoatDong: GHD({ bay_gio: BAY('19:00:00') }) } }, async (t) => {
    await mo(t, '/trangchu');
    k('E2 chưa tới giờ: ô Trang chủ "Mở lúc 20:00"', /Mở lúc 20:00/.test(await t.locator('.hb-t-flash .hb-s').innerText()) && (await t.locator('.hb-t-flash .hb-s.live').count()) === 0);
    await mo(t, '/menu');
    k('E2 chưa tới giờ: nhãn món "Giờ vàng −50% từ 20:00"; gv-head không "live"', /Giờ vàng −50% từ 20:00/.test(await t.locator('.prod-card', { hasText: 'Trà Lục Bảo' }).innerText()) && /^20:00$/.test((await t.locator('.ct.gv small').innerText()).trim()));
    k('D5 chưa tới giờ: món vẫn hiện bậc thang giá hạng bình thường', (await t.locator('.prod-card', { hasText: 'Trà Lục Bảo' }).locator('.lad').count()) === 1);
  });

  await ca('e-gv-het-khung', { pos: { gioHoatDong: GHD({ bay_gio: BAY('21:59:57') }) } }, async (t) => {
    await mo(t, '/trangchu');
    const truoc = await t.locator('.hb-t-flash .hb-s').innerText();
    await cho(t, 4200);
    const sau = await t.locator('.hb-t-flash .hb-s').innerText();
    k('E2 hết khung: tự đổi sang "Đã kết thúc", không tải lại', /^Còn 0:00:0\d$/.test(truoc) && sau === 'Đã kết thúc', `${truoc} → ${sau}`);
    k('E2 hết khung: ô Trang chủ bỏ trạng thái "đang giảm" (không còn "món đang giảm", hết màu live)', /cuối ngày/.test(await t.locator('.hb-t-flash .hb-h').innerText()) && (await t.locator('.hb-t-flash .hb-s.live').count()) === 0);
  });

  // D4 — nếu POS (v3) trả menu cả khi chưa đăng nhập kèm gia_hang, bản lưu trên máy vẫn KHÔNG chứa gia_hang
  await ca('m-menu-cong-khai', { dn: false, pos: { menuKhongToken: true } }, async (t) => {
    await mo(t, '/menu');
    const luu = await khoaLuu(t);
    k('D4 menu công khai (không token) có gia_hang: lưu bản menu trên máy và GIỮ gia_hang các hạng (v3, KH-UI-3b E2)', /kh_menu/.test(luu) && /gia_hang/.test(luu), luu.slice(0, 160));
  });

  await ca('f-quan-dong', { pos: { gioHoatDong: GHD_DONG, gioVang: GV_TAT } }, async (t) => {
    await mo(t, '/trangchu');
    k('F1 quán đóng: hiện NGUYÊN VĂN thong_bao của POS', (await chu(t)).includes('Quán đã đóng cửa, mở lại lúc 08:00 ngày mai.') && !(await chu(t)).includes('Quán đang mở cửa'));
  });

  await ca('g-chua-lich', { pos: { gioHoatDong: GHD({ hom_nay: null, lich_tuan: [] }) } }, async (t, P, loi) => {
    await mo(t, '/trangchu');
    k('F1 chưa cài lịch (mở cả ngày, thong_bao rỗng): không vỡ, không chữ rỗng lạ', loi.length === 0 && (await chu(t)).includes('Quán đang mở cửa') && !/undefined|null|NaN/.test(await chu(t)));
  });

  for (const tz of ['UTC', 'Asia/Ho_Chi_Minh', 'America/Los_Angeles']) {
    await ca('h-lech-' + tz, { tz, may: '2026-10-30T01:00:00Z' }, async (t) => { // đồng hồ máy chỉ 08:00 VN, POS nói 20:30
      await mo(t, '/trangchu');
      k(`B3 TZ ${tz}, đồng hồ máy lệch cả giờ: đếm ngược theo bay_gio của POS (còn ~1:30)`, /^Còn 1:(29|30):\d\d$/.test(await t.locator('.hb-t-flash .hb-s').innerText()), await t.locator('.hb-t-flash .hb-s').innerText());
    });
  }

  for (const [cua, kiemTra] of [
    ['hang', async (t, loi) => { await mo(t, '/menu'); return loi.length === 0 && (await t.locator('.prod-card').count()) === 4 && !/NaN|undefined/.test(await chu(t)) && /25\.200/.test(await t.locator('.prod-card', { hasText: 'Trà Phổ Nhĩ' }).innerText()) && !/23\.800/.test(await chu(t)); }],
    ['gioVang', async (t, loi) => { await mo(t, '/trangchu'); return loi.length === 0 && (await t.locator('.hb-t-flash.hb-mo').count()) === 1 && !/lỗi/i.test(await t.locator('.hb-tiles').innerText()) && (await t.locator('.points-card').count()) === 1; }], // KH-UI-3c: ô Giờ vàng luôn có mặt, lỗi → ô mờ
    ['gioHoatDong', async (t, loi) => { await mo(t, '/trangchu'); return loi.length === 0 && !/Quán đang mở cửa|Quán đã/.test(await chu(t)) && (await t.locator('.points-card').count()) === 1; }],
  ]) {
    await ca('i-loi-' + cua, { pos: { hong: { [cua]: true } } }, async (t, P, loi) => {
      const ok = await kiemTra(t, loi);
      k(`A3 cửa /${cua} lỗi 500: app không vỡ, phần của cửa đó ẩn, không số bịa`, ok, loi.join('|'));
    });
  }

  await ca('j-doi-khach', {}, async (t, P) => {
    await mo(t, '/menu');
    const luu1 = await khoaLuu(t);
    k('D4 đang đăng nhập: localStorage KHÔNG chứa gia_hang của khách', !/gia_hang/.test(luu1), luu1.slice(0, 200));
    await mo(t, '/taikhoan'); await t.getByText('Đăng xuất').click(); await cho(t, 700);
    const luu2 = await khoaLuu(t);
    await t.locator('.tab', { hasText: 'Menu' }).dispatchEvent('click'); await cho(t, 900); // vào Menu bằng thao tác trong app: bộ nhớ trang còn menu của người trước
    k('D4 đăng xuất: không còn gia_hang trên máy; Menu không còn bậc thang giá hạng của người trước', !/gia_hang/.test(luu2) && (await t.locator('.prod-card').count()) > 0 && (await t.locator('.lad').count()) === 0);
    P.toi = TOI(null, 0);
    await t.goto(URL0 + '/dangnhap'); await t.waitForSelector('.phone'); await cho(t);
    await t.evaluate(() => localStorage.setItem('kh_token', 'tok-B')); await t.goto(URL0 + '/menu'); await t.waitForSelector('.phone'); await cho(t, 900);
    const bac = t.locator('.prod-card', { hasText: 'Trà Phổ Nhĩ' }).locator('.lad .me');
    k('D4 khách khác (không hạng) vào sau: cột của mình là "Thường", không phải "Vàng" của người trước', (await bac.count()) === 1 && /thường/i.test(await bac.innerText()) && !/25\.200/.test(await t.locator('.prod-card', { hasText: 'Trà Phổ Nhĩ' }).locator('.lad .me').innerText()));
  });

  await ca('k-chua-dn', { dn: false }, async (t, P) => {
    await mo(t, '/menu');
    const tx = await chu(t);
    k('D3 chưa đăng nhập (menu cần token → mời đăng nhập): không giá hạng cụ thể của người lạ', !/27\.000|25\.200|23\.800/.test(tx) && (await t.locator('.lad').count()) === 0);
    await mo(t, '/trangchu');
    k('E1 chưa đăng nhập vẫn thấy ô Giờ vàng (cửa không cần token)', (await t.locator('.hb-t-flash').count()) === 1 && /Còn 1:(29|30)/.test(await t.locator('.hb-t-flash .hb-s').innerText()));
  });

  await trinh.close();
}
