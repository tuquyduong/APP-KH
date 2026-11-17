#!/usr/bin/env node
// THỬ KH-NAP-1 — khách tự nạp tiền vào ví trên App (hợp đồng v17): màn Ví (số dư + lịch sử), bảng chọn gói, Thanh toán nạp chỉ QR, "Đã nạp".
// Phần 1 (luôn chạy, kể cả KHONG_TRINH_DUYET=1): hàm thuần + đọc nguồn · Phần 2: App thật trong Chromium, POS giả dựng TỪ hợp đồng v17
// (không có Playwright / KHONG_TRINH_DUYET=1 → in "BỎ QUA", không tính ca). Chạy: node cong_cu/thu_KHNAP1.js → dòng cuối "n đạt · m hỏng".
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
const bang = (a, b) => JSON.stringify(a) === JSON.stringify(b);
// Hàm đọc màu của K9 (chép từ kiem_tra_truoc_khi_giao.js).
const docMau = (txt) => {
  const ra = new Set();
  for (const m of txt.matchAll(/#([0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})\b/g)) {
    let h = m[1].toLowerCase();
    if (h.length <= 4) h = [...h].map((c) => c + c).join('');
    ra.add([parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), h.length === 8 ? Math.round(parseInt(h.slice(6, 8), 16) / 255 * 1000) / 1000 : 1].join(','));
  }
  for (const m of txt.matchAll(/rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+%?))?\s*\)/g)) {
    const a = m[4] === undefined ? 1 : m[4].endsWith('%') ? parseFloat(m[4]) / 100 : parseFloat(m[4]);
    ra.add([+m[1], +m[2], +m[3], Math.round(a * 1000) / 1000].join(','));
  }
  return ra;
};

// Gói nạp POS giả (thứ tự quầy CỐ Ý không theo số tiền): 200K có thưởng, 100K có thưởng, 50K không thưởng.
const GOI = [{ ma: 2, ten: 'Gói 200K', tra: 200000, vao: 210000 }, { ma: 1, ten: 'Gói 100K', tra: 100000, vao: 105000 }, { ma: 3, ten: 'Nạp 50K', tra: 50000, vao: 50000 }];
const NAP = (ma_goi = 1) => ({ loai: 'nap', ma_goi });
const THE = { loai: 'the', hang_id: 2, so_thang: 3 };
const LY = { ma: 'TLB', so_luong: 2, ghi_chu: '' };

(async () => {
  console.log('Phần 1 — hàm thuần, đọc nguồn');
  const G = await nap('src/gio.js'), D = await nap('src/datDon.js');
  let V = {};
  try { V = await nap('src/viTien.js'); } catch (e) { k('nạp src/viTien.js', false, String(e.message).split('\n')[0]); }

  await thu('A1', async () => {
    const api = doc('src/api.js');
    const cong = /CUA_CONG_KHAI = \[([^\]]*)\]/.exec(api);
    k("A1 '/goi-nap' nằm trong CUA_CONG_KHAI (không gửi token)", !!cong && /'\/goi-nap'/.test(cong[1]), cong && cong[1]);
    k("A1 api.js: layGoiNap = () => goi('GET', '/goi-nap'); layVi = (trang) => goi('GET', `/vi?trang=${trang}`)",
      /export const layGoiNap = \(\) => goi\('GET', '\/goi-nap'\)/.test(api) && /export const layVi = \(trang\) => goi\('GET', `\/vi\?trang=\$\{trang\}`\)/.test(api));
    const { CAN_TU_POS } = await nap('src/kiemKhop/canTuPos.js');
    const m = (cua) => CAN_TU_POS.find((x) => x.cua === cua) || {};
    k('A1 canTuPos: GET /goi-nap (token false) đủ data[].ma/ten/tra/vao, co: true', m('GET /goi-nap').co === true && m('GET /goi-nap').token === false && bang(m('GET /goi-nap').truong, ['data[].ma', 'data[].ten', 'data[].tra', 'data[].vao']));
    k('A1 canTuPos: GET /vi (token true) đủ trang/con_nua/data[].ngay/loai/so_tien/thuong/ma_don/ghi_chu, co: true', m('GET /vi').co === true && m('GET /vi').token === true
      && bang(m('GET /vi').truong, ['trang', 'con_nua', 'data[].ngay', 'data[].loai', 'data[].so_tien', 'data[].thuong', 'data[].ma_don', 'data[].ghi_chu']));
    const kk = doc('src/pages/KiemKhop.jsx');
    k("A1 trang Kiểm khớp có 'GET /goi-nap' và 'GET /vi' trong bảng GOI", /'GET \/goi-nap': layGoiNap/.test(kk) && /'GET \/vi': \(\) => layVi\(1\)/.test(kk));
  });

  await thu('A2', async () => {
    k('A2 laNap', G.laNap && G.laNap(NAP()) && !G.laNap(THE) && !G.laNap(LY) && !G.laNap(null));
    const d = G.dongNapTuDuongDan || (() => 'thiếu');
    k("A2 dongNapTuDuongDan({ goi: '5' }) → { loai: 'nap', ma_goi: 5 }", bang(d({ goi: '5' }), NAP(5)));
    k("A2 dongNapTuDuongDan sai dạng ('0', '-1', 'a', '', '1.5', thiếu, '01') → null", ['0', '-1', 'a', '', '1.5', undefined, '01', ' 5'].every((g) => d({ goi: g }) === null) && d() === null);
    k('A2 coDoUong: giỏ chỉ nạp → false; có ly → true; giỏ chỉ thẻ → false', G.coDoUong([NAP()]) === false && G.coDoUong([NAP(), LY]) === true && G.coDoUong([THE]) === false);
    k('A2 chanDatGio: quán đóng + giỏ chỉ nạp → "" (đặt MỌI giờ); giỏ có ly → chặn', D.chanDatGio({ dang_mo: false, nhan_don: false }, [NAP()]) === '' && D.chanDatGio({ dang_mo: false, nhan_don: false, thong_bao: 'Đóng' }, [LY]) === 'Đóng');
    const tt = G.trangThaiDong(NAP(1), [], null, GOI), mat = G.trangThaiDong(NAP(9), [], null, GOI), chua = G.trangThaiDong(NAP(1), [], null);
    k('A2 trangThaiDong dòng nạp: gói còn trong /goi-nap → { goi, conBan: true }; không có → conBan false; chưa có danh sách → false', tt.conBan === true && tt.goi === GOI[1] && mat.conBan === false && mat.goi === null && chua.conBan === false, JSON.stringify(tt));
    k('A2 duocThanhToan(gio nạp, …, dsGoi)', G.duocThanhToan([NAP(1)], [], null, GOI) === true && G.duocThanhToan([NAP(9)], [], null, GOI) === false);
    k('A2 trangThaiDong ly / thẻ (3 tham số) không đổi', G.trangThaiDong(LY, [{ ma: 'TLB', con_hang: true }]).conBan === true && G.trangThaiDong(THE, null, []).conBan === false);
    const tb = D.thanBaoGia([NAP(1)], { maGiam: '' }), td = D.thanDatDon([NAP(1)], { maGiam: '' }, { cachTra: 'qr', khoaGui: 'k'.repeat(20), tongDaXem: 100000 });
    k('A2 dongGui dòng nạp ĐÚNG { loai, ma_goi } (không so_luong / ghi chú / giá)', bang(tb.mon, [{ loai: 'nap', ma_goi: 1 }]) && bang(td.mon, [{ loai: 'nap', ma_goi: 1 }]) && !('ma_giam' in td) && !('pin' in td) && td.cach_tra === 'qr', JSON.stringify(td));
    k('A2 dungViCho: có dòng nạp → false (kể cả công tắc bật); ly → theo công tắc', D.dungViCho([NAP()], true) === false && D.dungViCho([LY], true) === true && D.dungViCho([LY], false) === false);
    k('A2 laDonChiNap', D.laDonChiNap && D.laDonChiNap({ mon: [{ loai: 'nap' }] }) && !D.laDonChiNap({ mon: [{ loai: 'nap' }, { ma: 'TLB' }] }) && !D.laDonChiNap({ mon: [] }) && !D.laDonChiNap({ mon: [{ loai: 'the' }] }));
    k('A2 laLoiNap: 3 mã v17', D.laLoiNap && ['GOI_NAP_KHONG_CO', 'NAP_KHONG_GOP', 'NAP_CHI_TIEN_MAT_QR'].every((c) => D.laLoiNap({ code: c })) && !D.laLoiNap({ code: 'NHIEU_THE' }));
    const b0 = D.buocTienTrinh('cho_tra', { chiNap: true }), b1 = D.buocTienTrinh('xong', { chiNap: true });
    k('A2 buocTienTrinh chiNap: HAI bước "Chờ thanh toán" → "Đã vào ví", dòng phụ "Ngay khi tiền về, không cần ra quầy."',
      b0.ds.length === 2 && b0.ds[0].ma === 'cho_tra' && /Đã vào ví/.test(b0.ds[1].t) && b0.ds[1].s === 'Ngay khi tiền về, không cần ra quầy.' && b0.hien === 0 && b0.xongBuocHien === false, JSON.stringify(b0.ds.map((x) => x.t)));
    k('A2 buocTienTrinh chiNap: tích bước 2 chỉ khi xong', b1.hien === 1 && b1.xongBuocHien === true && D.buocTienTrinh('da_tra', { chiNap: true }).xongBuocHien === false);
    k('A2 buocTienTrinh đơn đồ uống / thẻ không đổi', D.buocTienTrinh('dang_lam').ds.length === 4 && D.buocTienTrinh('cho_tra', { chiThe: true }).ds[1].ma === 'the_kich_hoat');
    const g = { khoa_gui: 'k'.repeat(20), than: { mon: [NAP(2)] } };
    k('A2 thamTaoMaMoi: đơn chỉ nạp → Thanh toán nạp đúng gói; đơn thẻ / đồ uống không đổi', bang(D.thamTaoMaMoi(g), { trang: 'napvi', tham: { goi: 2 } }) && bang(D.thamTaoMaMoi({ than: { mon: [THE] } }), { trang: 'thanhtoanthe', tham: { h: 2, thang: 3 } }) && bang(D.thamTaoMaMoi({ than: { mon: [LY] } }), { trang: 'thanhtoan', tham: {} }), JSON.stringify(D.thamTaoMaMoi(g)));
    k('A2 monDatLai: dòng nạp bỏ qua, không đếm "không còn bán"', bang(D.monDatLai({ mon: [{ ma: null, loai: 'nap', so_luong: 1 }] }, [{ ma: 'TLB' }]), { them: [], boQua: 0 }));
    k('A2 boDongDaGui: dòng nạp không trừ giỏ đồ uống', bang(G.boDongDaGui([LY], [NAP(1)]), [LY]));
    const dd = doc('src/datDon.js');
    // Chat gộp NAP-1 + VC-2 (17.11): KH-VC-2 đã sửa ĐÚNG 3 hàm này (vouchers, voucher_loi, "Voucher <MÃ>") — ca không còn ghim bản gốc, chỉ giữ ý: dòng nạp KHÔNG đi qua 3 hàm
    // (nạp = dongGui `{ loai: 'nap', ma_goi }`; Thanh toán nạp không mã, không voucher).
    const than3 = ['thanBaoGia', 'docBaoGia', 'tenGiam'].map((t) => { const a = dd.indexOf(`export function ${t}(`); const b = dd.indexOf('\n}\n', a); return a < 0 || b < 0 ? null : dd.slice(a, b); });
    k('A2 thanBaoGia / docBaoGia / tenGiam không có nhánh nạp (nạp đi qua dongGui)', than3.every((x) => x !== null && !/laNap|'nap'/.test(x)));
  });

  await thu('A3', async () => {
    const t = V.thuongGoi || (() => NaN);
    k('A3 thuongGoi: vao > tra → vao − tra', t({ tra: 100000, vao: 105000 }) === 5000);
    k('A3 thuongGoi: vao = tra / vao < tra → 0', t({ tra: 50000, vao: 50000 }) === 0 && t({ tra: 50000, vao: 40000 }) === 0);
    k('A3 thuongGoi: số hỏng (thực, chuỗi, null, thiếu) → 0', t({ tra: 100000.5, vao: 105000 }) === 0 && t({ tra: '100000', vao: 105000 }) === 0 && t({ tra: null, vao: 1 }) === 0 && t({}) === 0 && t(null) === 0);
    const n = V.nhanLoaiVi || (() => 'x');
    k('A3 nhanLoaiVi: 4 loại → khoá chữ "Nạp tiền" / "Trả đơn" / "Hoàn tiền" / "Quán điều chỉnh"', ['nap', 'tra_don', 'hoan_don', 'dieu_chinh'].every((l) => typeof n(l) === 'string' && n(l)));
    const ND = await nap('src/noiDung/nd.js');
    k('A3 nhanLoaiVi: chữ mặc định đúng phiếu', bang(['nap', 'tra_don', 'hoan_don', 'dieu_chinh'].map((l) => ND.nd(n(l))), ['Nạp tiền', 'Trả đơn', 'Hoàn tiền', 'Quán điều chỉnh']));
    k('A3 nhanLoaiVi: loại lạ (qua_chao_mung) / rỗng → null', n('qua_chao_mung') === null && n('') === null && n(undefined) === null);
    const dv = V.dongVi || (() => 'x');
    const r = dv({ ngay: '2026-11-16T14:05:00', loai: 'nap', so_tien: 105000, thuong: 5000, ma_don: 'N1', ghi_chu: 'Nạp gói 100K' });
    k('A3 dongVi: dòng hợp lệ → bản sạch', r && r.soTien === 105000 && r.thuong === 5000 && r.maDon === 'N1' && r.ghiChu === 'Nạp gói 100K' && r.loai === 'nap', JSON.stringify(r));
    k('A3 dongVi: số hỏng / dòng hỏng → null (không vỡ màn)', dv({ ngay: 'x', loai: 'nap', so_tien: '105000' }) === null && dv({ so_tien: 1.5 }) === null && dv(null) === null && dv('x') === null);
    k('A3 dongVi: ma_don null → maDon null; thuong thiếu → 0', (() => { const x = dv({ ngay: '2026-11-16T14:05:00', loai: 'tra_don', so_tien: -58200, ma_don: null, ghi_chu: '' }); return x && x.maDon === null && x.thuong === 0 && x.soTien === -58200; })());
    k('A3 gioNgayVi: "2026-11-16T14:05:00" → "14:05 · 16/11/2026" (không new Date)', V.gioNgayVi && V.gioNgayVi('2026-11-16T14:05:00') === '14:05 · 16/11/2026' && V.gioNgayVi('hỏng') === '');
  });

  await thu('B6-C1', async () => {
    const css = docTho('src/giaoDien/vi_tien.css'), demo = docTho('thiet_ke/app_kh_demo.html').replace(/data:[^"')\s]{100,}/g, '');
    const demoMau = docMau(demo), la = [...docMau(css)].filter((c) => !demoMau.has(c));
    k('C1 vi_tien.css có, 0 màu ngoài demo (thuật toán K9)', css.length > 300 && la.length === 0, la.join(' · '));
    const lop = [...boChuThich(css).matchAll(/(?<![\w-])\.([a-z][\w-]*)/g)].map((m) => m[1]);
    const KHUON = /^(vt-|wallet-|tx-item|ic$|ico$|info$|amt$|lbl$|chon$|cm-|ra$|dc$|summary-row$|cart-thumb$)/;
    k('C1 lớp MỚI trong vi_tien.css đều tiền tố vt- (lớp demo chỉ dùng làm ngữ cảnh)', lop.length > 5 && lop.some((x) => x.startsWith('vt-')) && lop.every((x) => KHUON.test(x)), [...new Set(lop.filter((x) => !KHUON.test(x)))].join(', '));
    const ND = await nap('src/noiDung/nd.js'), IDX = await nap('src/noiDung/nd/index.js');
    let VT = null; try { VT = (await nap('src/noiDung/nd/viTien.js')).VI_TIEN; } catch { /* chưa có */ }
    k('B6 nd/viTien.js xuất VI_TIEN, đăng ký ở nd/index.js (MỘT dòng)', Array.isArray(VT) && VT.length > 20 && VT.every((m) => IDX.DANH_MUC.includes(m)));
    k('B6 kiemDanhMuc(danh mục) không lỗi', ND.kiemDanhMuc(IDX.DANH_MUC).length === 0, ND.kiemDanhMuc(IDX.DANH_MUC).slice(0, 3).join(' · '));
    const duong = await nap('src/duongDan.js');
    const v = duong.docDuongDan('/uudai/vi'), vn = duong.docDuongDan('/uudai/vi?nap=1'), n = duong.docDuongDan('/uudai/vi/nap?goi=2');
    k('B2 /uudai/vi: trang vi, tab uudai, canDN, cha /uudai; ?nap=1 giữ', v.trang === 'vi' && v.tab === 'uudai' && v.canDN && v.cha === '/uudai' && vn.tham.nap === '1' && vn.chuan === '/uudai/vi?nap=1', JSON.stringify(v));
    k('B4 /uudai/vi/nap?goi=2: trang napvi, canDN, cha /uudai/vi, tham goi', n.trang === 'napvi' && n.canDN && n.cha === '/uudai/vi' && n.tham.goi === '2' && duong.taoDuongDan('napvi', { goi: 2 }) === '/uudai/vi/nap?goi=2', JSON.stringify(n));
    k('B2 tiêu đề tab trình duyệt có tên màn mới', /Ví của tôi/.test(duong.tieuDeTrang('vi')) && /Nạp tiền/.test(duong.tieuDeTrang('napvi')), duong.tieuDeTrang('vi'));
  });

  console.log('Phần 2 — App thật trong Chromium');
  if (process.env.KHONG_TRINH_DUYET === '1') console.log('  BỎ QUA: KHONG_TRINH_DUYET=1 — các ca trong trình duyệt không chạy ở đây');
  else {
    let pw = null;
    try { pw = require('playwright'); } catch { /* không có */ }
    if (!pw) console.log('  BỎ QUA: không có Playwright ở máy này — các ca trong trình duyệt CHƯA chạy');
    else await thu('Chromium', () => trinhDuyet(pw));
  }
  console.log(`\n${dat} đạt · ${hong} hỏng`);
  process.exit(hong ? 1 : 0);
})().catch((e) => { console.error(e); console.log(`\n${dat} đạt · ${hong + 1} hỏng`); process.exit(1); });

// ───────────── Phần 2 ─────────────
const BAY = (g) => `2026-11-16T${g}`;
const TEN_NAP = '💳 Nạp 100.000đ → vào tài khoản 105.000đ';
// Lịch sử ví mẫu: 4 loại + loại lạ (QUA-1). Dòng nạp N1 CÓ THƯỞNG, số 106.000đ KHÁC `vao` của gói để chứng minh "Đã nạp" đọc /vi.
const VI_1 = [
  { ngay: BAY('14:05:00'), loai: 'nap', so_tien: 105000, thuong: 5000, ma_don: 'TQD7', ghi_chu: 'Nạp gói 100K' },
  { ngay: BAY('09:12:00'), loai: 'tra_don', so_tien: -58200, thuong: 0, ma_don: 'TQD5', ghi_chu: 'Trả đơn APP0051' },
  { ngay: '2026-11-12T18:40:00', loai: 'hoan_don', so_tien: 29100, thuong: 0, ma_don: null, ghi_chu: 'Hoàn tiền đơn APP0047' },
  { ngay: '2026-11-09T17:02:00', loai: 'dieu_chinh', so_tien: -400, thuong: 0, ma_don: null, ghi_chu: 'Quán điều chỉnh' },
  { ngay: '2026-11-08T08:00:00', loai: 'qua_chao_mung', so_tien: 20000, thuong: 0, ma_don: null, ghi_chu: 'Quà chào mừng thành viên' },
];
const VI_2 = [
  { ngay: '2026-11-08T08:00:00', loai: 'qua_chao_mung', so_tien: 20000, thuong: 0, ma_don: null, ghi_chu: 'Quà chào mừng thành viên' }, // trùng dòng cuối trang 1 (OFFSET)
  { ngay: '2026-11-01T10:00:00', loai: 'nap', so_tien: 50000, thuong: 0, ma_don: null, ghi_chu: 'Nạp tại quầy' },
];

async function trinhDuyet(pw) {
  const esbuild = require('esbuild');
  const goiApp = (await esbuild.build({
    stdin: { contents: `import './main.jsx';`, resolveDir: path.join(GOC, 'src'), loader: 'jsx' },
    bundle: true, write: false, format: 'iife', jsx: 'automatic', logLevel: 'silent',
    loader: { '.css': 'empty', '.json': 'json' }, define: { 'process.env.NODE_ENV': '"production"', 'import.meta.env.VITE_POS_API': '""' },
  })).outputFiles[0].text;
  const cssTron = (f) => docTho(f).replace(/@import\s+'\.\/([^']+)';/g, (_, t) => cssTron(path.posix.join(path.posix.dirname(f), t)));
  const dauCss = [...docTho('src/main.jsx').matchAll(/import '\.\/(giaoDien\/[^']+\.css)'/g)].map((m) => 'src/' + m[1]);
  const conCss = fs.readdirSync(path.join(GOC, 'src/giaoDien')).filter((f) => f.endsWith('.css')).map((f) => 'src/giaoDien/' + f).filter((f) => !dauCss.includes(f));
  const css = dauCss.concat(conCss).map(cssTron).join('\n');
  const HTML = docTho('index.html').replace(/<script type="module"[^>]*><\/script>/, '<script src="/bundle.js"></script>').replace('</head>', `<style>${css}</style></head>`);
  const { DANH_MUC } = await nap('src/noiDung/nd/index.js');
  const KHOA_ND = new Set(DANH_MUC.map((m) => m.khoa));
  const trinh = await pw.chromium.launch({ args: ['--no-sandbox'] });
  const URL0 = 'http://kh.test';
  const anhDir = process.env.LUU_ANH_DIR || '';
  const ndThieu = new Set();
  const chu0 = (await nap('src/luuMay.js')).dauVet('0909123456'); // máy đã của đúng khách này (không xoá giỏ / bản ghi lần gửi khi /toi về)

  async function may(ten, S0, chay) {
    const ctx = await trinh.newContext({ viewport: { width: 390, height: 844 }, timezoneId: 'Asia/Ho_Chi_Minh' });
    await ctx.clock.install({ time: new Date('2026-11-16T20:30:00+07:00') }); await ctx.clock.resume();
    const S = { goiNap: GOI, vi: 180600, viTrang: { 1: { data: VI_1, con_nua: true }, 2: { data: VI_2, con_nua: false } }, viLoi: false, dong: false, kich: [], goi: [], bg: [], datDon: [], don: new Map(), soDon: 6, loiTrang: [], gio: [LY], luu: {}, ...S0 };
    await ctx.addInitScript(({ gio, luu, chu0 }) => {
      if (location.protocol !== 'http:' || sessionStorage.getItem('da_gieo')) return; // about:blank (sau Back) không có kho
      sessionStorage.setItem('da_gieo', '1');
      localStorage.setItem('kh_ngay_man_dau', '2026-11-16');
      localStorage.setItem('kh_token', 'tok-A'); localStorage.setItem('kh_chu', chu0);
      localStorage.setItem('kh_gio', JSON.stringify(gio));
      for (const [kh, v] of Object.entries(luu)) localStorage.setItem(kh, v);
    }, { gio: S.gio, luu: S.luu, chu0 });
    const goiCua = (ma) => S.goiNap.find((g) => g.ma === ma);
    const monDon = (d) => (d.nap ? [{ ma: null, loai: 'nap', ten: TEN_NAP, so_luong: 1, don_gia: d.tong, thanh_tien: d.tong, ghi_chu: null }] : d.mon || [{ ma: 'TLB', ten: 'Trà Lục Bảo', so_luong: 2, don_gia: 30000, thanh_tien: 60000, ghi_chu: '' }]);
    const dongDon = (d) => ({ ma: d.ma, so_hd: d.soHd || null, ngay: BAY('20:31:00'), tong: d.tong, da_tra: d.tt === 'cho_tra' ? 0 : d.tong, trang_thai: null, thanh_toan: null, tien_trinh: d.tt, qr: d.tt === 'cho_tra' ? d.qr : null, tien_ve_cho_doi_soat: false, tien_ve_da_cong_vi: d.tienVe || null, thong_bao_tien_ve: d.thongBao || null, cach_tra: 'qr', giu_vi: 0, con_lai: d.tong, so_mon: 1, mon_dau: null });
    for (const d of S.donSan || []) S.don.set(d.ma, d);
    await ctx.route(`${URL0}/**`, async (r) => {
      const req = r.request(), u = new URL(req.url()), p = u.pathname, pt = req.method();
      const json = (status, o) => r.fulfill({ status, contentType: 'application/json', body: JSON.stringify(o) }).catch(() => {});
      if (p === '/bundle.js') return r.fulfill({ contentType: 'text/javascript', body: goiApp });
      if (!p.startsWith('/api/kh')) return /\.[a-z0-9]+$/.test(p) ? r.fulfill({ status: 204, body: '' }) : r.fulfill({ contentType: 'text/html', body: HTML });
      const duong = p.slice('/api/kh'.length), auth = req.headers().authorization || '';
      let than = null; try { than = JSON.parse(req.postData()); } catch { /* không thân */ }
      S.goi.push({ pt, duong, auth, q: u.search });
      if (duong === '/gio-vang') return json(200, { success: true, dang_chay: false, bat_dau: null, ket_thuc: null, phan_tram: 0, mon: [] });
      if (duong === '/hang') return json(200, { success: true, data: [{ id: 2, ten: 'Vàng', phan_tram: 3, phan_tram_nhom_dac_biet: 4, chi_cap: false, goi: [{ so_thang: 3, gia: 295000 }], thu_bac: 2, gia_the: 100000, thu_tu: 2, quyen_loi: [] }] });
      if (duong === '/gio-hoat-dong') return json(200, { success: true, bay_gio: BAY('20:30:00'), dang_mo: !S.dong, nhan_don: !S.dong, hom_nay: { mo: '08:00', dong: '22:00' }, mo_lai_luc: null, thong_bao: S.dong ? 'Quán đã đóng cửa' : '', lich_tuan: [], ngay_nghi: [] });
      if (duong === '/menu') return json(200, { success: true, data: [{ ma: 'TLB', ten: 'Trà Lục Bảo', nhom: 'Trà', gia: 30000, con_hang: true, gia_hang: [] }] });
      if (duong === '/chuong-trinh' || duong === '/quang-cao') return json(200, { success: true, bay_gio: BAY('20:30:00'), data: [] });
      if (duong === '/goi-nap') return S.goiLoi ? json(500, { error: 'Lỗi máy chủ', code: 'LOI_MAY_CHU' }) : json(200, { success: true, data: S.goiNap });
      if (!/tok-A/.test(auth)) return json(401, { error: 'Phiên đăng nhập đã hết', code: 'KH_TOKEN_SAI' });
      if (duong === '/toi') return json(200, { success: true, khach: { sdt: '0909123456', ten: 'Linh', xung_ho: 'chi', dia_chi: null, qr: 'QR', hang: null, so_du_vi: S.vi } });
      if (duong === '/diem') return json(200, { success: true, points: 1250, history: [] });
      if (duong === '/voucher') return json(200, { success: true, data: [], ma_khach_moi: [] });
      if (duong === '/gia-han') return json(200, { success: true, token: 'tok-A', het_han: '2026-12-16T08:00:00' });
      if (duong === '/vi') {
        if (S.viLoi) return r.abort('internetdisconnected');
        const t = Number(u.searchParams.get('trang')) || 1, pg = S.viTrang[t] || { data: [], con_nua: false };
        return json(200, { success: true, trang: t, con_nua: pg.con_nua, data: pg.data });
      }
      if (duong === '/gio/bao-gia') {
        S.bg.push(than);
        const n = than.mon.find((m) => m.loai === 'nap');
        if (!n) return json(200, { success: true, dong: [], tam_tinh: 60000, giam: [], phi_giao: 0, tong: 60000, ma_giam_loi: null, voucher_loi: [] });
        const g = goiCua(n.ma_goi);
        if (!g) return json(400, { error: 'Gói nạp này không còn bán', code: 'GOI_NAP_KHONG_CO' });
        return json(200, { success: true, dong: [{ loai: 'nap', ma_goi: g.ma, ma: null, so_luong: 1, don_gia: g.tra, thanh_tien: g.tra }], tam_tinh: g.tra, giam: [], phi_giao: 0, tong: g.tra, ma_giam_loi: null, voucher_loi: [] });
      }
      if (duong === '/don' && pt === 'POST') {
        S.datDon.push(than);
        const x = S.kich.shift();
        if (x) return json(x.st, x.o);
        const nap = than.mon.filter((m) => m.loai === 'nap');
        if (nap.length && than.mon.length !== 1) return json(400, { error: 'Đơn nạp không gộp món khác', code: 'NAP_KHONG_GOP' });
        if (nap.length && than.cach_tra !== 'qr') return json(400, { error: 'Nạp chỉ trả chuyển khoản', code: 'NAP_CHI_TIEN_MAT_QR' });
        const g = nap.length && goiCua(nap[0].ma_goi);
        if (nap.length && !g) return json(400, { error: 'Gói nạp này không còn bán', code: 'GOI_NAP_KHONG_CO' });
        if (S.khoa && S.khoa === than.khoa_gui) { const d = S.don.get(S.maCuoi); return json(200, { success: true, ma_don: d.ma, tong: d.tong, giu_vi: 0, con_lai: d.tong, tien_trinh: d.tt, qr: d.qr, trung: true }); }
        const ma = 'TQD' + ++S.soDon, tong = g ? g.tra : 60000;
        const d = { ma, soHd: 'APP00' + S.soDon, tong, tt: 'cho_tra', qr: { chuoi: '000201010212' + ma, het_han: BAY('20:45:00') }, nap: !!g, vao: g && g.vao };
        S.don.set(ma, d); S.khoa = than.khoa_gui; S.maCuoi = ma;
        return json(200, { success: true, ma_don: ma, so_hd: d.soHd, tong, giu_vi: 0, con_lai: tong, tien_trinh: 'cho_tra', qr: d.qr, trung: false });
      }
      const huy = /^\/don\/([^/]+)\/huy$/.exec(duong);
      if (huy && pt === 'POST') { const d = S.don.get(decodeURIComponent(huy[1])); if (d) d.tt = 'da_huy'; return json(200, { success: true, ma_don: d && d.ma, tien_trinh: 'da_huy' }); }
      if (duong.startsWith('/don/') && pt === 'GET') {
        const d = S.don.get(decodeURIComponent(duong.slice(5)));
        if (!d) return json(404, { error: 'Không thấy đơn', code: 'KHONG_THAY_DON' });
        return json(200, { success: true, don: { ...dongDon(d), mon: monDon(d), ...(d.hoaDon ? { hoa_don: d.hoaDon } : {}) } });
      }
      if (duong === '/don' && pt === 'GET') return json(200, { success: true, trang: 1, con_nua: false, data: [...S.don.values()].reverse().map(dongDon) });
      return json(500, { error: 'chưa giả', code: 'LOI_MAY_CHU' });
    });
    const t = await ctx.newPage(); t.on('pageerror', (e) => S.loiTrang.push(e.message)); t.setDefaultTimeout(6000);
    try { await chay(t, S); } catch (e) { k(`ca ${ten} dừng giữa chừng`, false, String(e && e.message).split('\n')[0]); }
    k(`[${ten}] trang không báo lỗi JS`, S.loiTrang.length === 0, S.loiTrang[0]);
    await ctx.close();
  }
  const mo = async (t, duong) => { await t.goto(URL0 + duong); await t.waitForSelector('.phone'); };
  const chu = (t, sel) => t.locator(sel).first().innerText().catch(() => '');
  const co = async (t, sel) => (await t.locator(sel).count()) > 0;
  const doi = async (t, fn, ms = 6000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await fn()) return true; await t.waitForTimeout(40); } return false; };
  const doiChu = (t, sel, mau, ms) => doi(t, async () => mau.test(await chu(t, sel)), ms);
  const doiUrl = (t, mau) => doi(t, async () => mau.test(new URL(t.url()).pathname + new URL(t.url()).search));
  const duongDan = (t) => new URL(t.url()).pathname + new URL(t.url()).search;
  const chup = async (t, ten) => { if (anhDir) await t.screenshot({ path: path.join(anhDir, ten + '.png') }); };
  const gomNd = async (t) => { for (const kh of await t.evaluate(() => [...document.querySelectorAll('[data-nd]')].map((e) => e.getAttribute('data-nd')))) if (!KHOA_ND.has(kh)) ndThieu.add(kh); };
  const nutDat = (t) => t.locator('#checkout .nut-dat').first();
  const nutKhoa = async (t) => (await nutDat(t).getAttribute('aria-disabled').catch(() => null)) === 'true';

  const CA = [];
  const them = (ten, S0, f) => CA.push(() => may(ten, S0, f));

  them('B1 Ưu đãi — không gói', { goiNap: [] }, async (t, S) => {
    await mo(t, '/uudai'); await doiChu(t, '#rewards .wallet-row', /180\.600đ/);
    await t.waitForTimeout(300);
    k('B1 /goi-nap rỗng → KHÔNG nút "+ Nạp tiền" ở Ưu đãi (N4 a)', !(await co(t, '#rewards .vt-nap')) && !/Nạp tiền/.test(await chu(t, '#rewards .wallet-row')));
    const h = await t.evaluate(() => [...document.querySelectorAll('#rewards .wallet-box')].map((e) => Math.round(e.getBoundingClientRect().height)));
    k('B1 hai ô Điểm / Số dư ví cao bằng nhau', h.length === 2 && Math.abs(h[0] - h[1]) <= 1, JSON.stringify(h));
    const goiNapToken = S.goi.filter((x) => x.duong === '/goi-nap');
    k('A1 GET /goi-nap đã gọi và KHÔNG kèm Authorization', goiNapToken.length > 0 && goiNapToken.every((x) => !x.auth), JSON.stringify(goiNapToken));
    await t.locator('#rewards .wallet-box').nth(1).click();
    k('B1 bấm ô "Số dư ví" → /uudai/vi', await doiUrl(t, /^\/uudai\/vi$/), duongDan(t));
    await doiChu(t, '#wallet', /Lịch sử ví/);
    k('B2 /goi-nap rỗng → màn Ví KHÔNG có nút "Nạp tiền", vẫn số dư + lịch sử', !(await co(t, '#wallet .vt-hero-nut')) && /180\.600đ/.test(await chu(t, '#wallet .vt-hero')) && (await t.locator('#wallet .tx-item').count()) === 5);
    await t.goBack(); await doiChu(t, '#rewards .wallet-row', /180\.600đ/);
    await t.locator('#rewards .wallet-box').nth(1).locator('button').first().focus(); await t.keyboard.press('Enter');
    k('B1 Enter (bàn phím) trên ô "Số dư ví" → /uudai/vi', await doiUrl(t, /^\/uudai\/vi$/), duongDan(t));
  });

  them('B1 Ưu đãi — có gói, Tài khoản', {}, async (t) => {
    await mo(t, '/uudai'); await t.waitForSelector('#rewards .vt-nap');
    k('B1 có gói → nút nhỏ "+ Nạp tiền" dưới số dư', /Nạp tiền/.test(await chu(t, '#rewards .vt-nap')));
    k('B1 không nút lồng trong phần tử bấm được (trợ năng — rà soát vòng 2)', (await t.evaluate(() => document.querySelectorAll('#rewards [role="button"] button, #rewards button button').length)) === 0);
    await chup(t, 'uu_dai');
    await gomNd(t);
    await t.locator('#rewards .vt-nap').click();
    k('B1 "+ Nạp tiền" → /uudai/vi?nap=1, bảng chọn gói mở', (await doiUrl(t, /^\/uudai\/vi\?nap=1$/)) && (await doiChu(t, '.bang-noi', /Chọn gói nạp/)), duongDan(t));
    await t.goBack();
    k('B3 Back (nút lùi của điện thoại) → đóng bảng, còn ở /uudai/vi', (await doiUrl(t, /^\/uudai\/vi$/)) && (await doi(t, async () => !(await co(t, '.bang-noi')))), duongDan(t));
    await mo(t, '/taikhoan'); await doiChu(t, '#account .acc-q', /180\.600đ/);
    await chup(t, 'tai_khoan');
    await t.locator('#account .acc-q > div').first().click();
    k('B1 Tài khoản: bấm ô Ví → /uudai/vi', await doiUrl(t, /^\/uudai\/vi$/), duongDan(t));
  });

  them('B2 Màn Ví', {}, async (t, S) => {
    await mo(t, '/uudai/vi'); await doi(t, async () => (await t.locator('#wallet .tx-item').count()) === 5);
    const all = await chu(t, '#wallet');
    k('B2 đầu màn "Ví của tôi" + nút lùi', /Ví của tôi/.test(await chu(t, '#wallet .topbar h1')) && await co(t, '#wallet .topbar .back-btn'));
    k('B2 ô số dư = so_du_vi của /toi, nút "Nạp tiền" có', /180\.600đ/.test(await chu(t, '#wallet .vt-hero')) && /Nạp tiền/.test(await chu(t, '#wallet .vt-hero-nut')));
    k('B2 dòng nhắc luật', all.includes('Số dư trả được đồ uống ở quầy và trên App. Thẻ hội viên chỉ trả bằng chuyển khoản hoặc tiền mặt.'));
    const dong = await t.evaluate(() => [...document.querySelectorAll('#wallet .tx-item')].map((e) => ({ t: e.querySelector('.t')?.textContent, d: e.querySelector('.d')?.textContent, so: e.querySelector('.amt')?.textContent, tx: e.textContent, mo: e.getAttribute('role') === 'button' })));
    k('B2 tên dòng: 4 loại theo khoá chữ, loại lạ = ghi_chu POS', bang(dong.map((x) => x.t), ['Nạp tiền', 'Trả đơn', 'Hoàn tiền', 'Quán điều chỉnh', 'Quà chào mừng thành viên']), JSON.stringify(dong.map((x) => x.t)));
    k('B2 dòng 2 = "HH:mm · dd/mm/yyyy · ghi_chu"', dong[0].d === '14:05 · 16/11/2026 · Nạp gói 100K' && dong[1].d === '09:12 · 16/11/2026 · Trả đơn APP0051', JSON.stringify(dong.slice(0, 2).map((x) => x.d)));
    k('B2 dòng nạp có thưởng → "gồm 5.000đ tiền thưởng"; dòng khác không', /gồm 5\.000đ tiền thưởng/.test(dong[0].tx) && dong.slice(1).every((x) => !/tiền thưởng/.test(x.tx)));
    k('B2 số tiền có dấu đúng so_tien', bang(dong.map((x) => x.so), ['+105.000đ', '−58.200đ', '+29.100đ', '−400đ', '+20.000đ']), JSON.stringify(dong.map((x) => x.so)));
    k('B2 chỉ dòng có ma_don bấm được', bang(dong.map((x) => x.mo), [true, true, false, false, false]));
    k('B2 KHÔNG nút "Thẻ quà tặng" / "Chuyển đổi điểm"', !/Thẻ quà tặng|Chuyển đổi điểm/.test(all));
    await chup(t, 'vi');
    await gomNd(t);
    await t.locator('#wallet .vt-them').click();
    await doi(t, async () => (await t.locator('#wallet .tx-item').count()) >= 6);
    await t.waitForTimeout(200);
    const n2 = await t.locator('#wallet .tx-item').count();
    k('B2 "Xem thêm" nối trang 2 vào cuối, bỏ dòng trùng (6 dòng)', n2 === 6 && /Nạp tại quầy/.test(await chu(t, '#wallet .tx-item:last-of-type')), String(n2));
    k('B2 con_nua false → hết nút "Xem thêm"', !(await co(t, '#wallet .vt-them')));
    k('B2 trang 2 gọi đúng /vi?trang=2', S.goi.some((x) => x.duong === '/vi' && x.q === '?trang=2' && /tok-A/.test(x.auth)));
    await t.locator('#wallet .tx-item').nth(1).click();
    k('B2 dòng có ma_don → Chi tiết đơn /taikhoan/donhang/TQD5', await doiUrl(t, /^\/taikhoan\/donhang\/TQD5$/), duongDan(t));
  });

  them('B2 Ví rỗng / lỗi', { viTrang: { 1: { data: [], con_nua: false } } }, async (t, S) => {
    await mo(t, '/uudai/vi');
    k('B2 chưa có dòng → câu trống', await doiChu(t, '#wallet', /Chưa có giao dịch nào/));
    S.viLoi = true;
    await t.reload(); await t.waitForSelector('.phone');
    k('B2 lỗi mạng → câu lỗi + "Thử lại"', (await doi(t, async () => co(t, '#wallet .nt-state'))) && /Thử lại/.test(await chu(t, '#wallet')));
    S.viLoi = false;
    await t.locator('#wallet button', { hasText: 'Thử lại' }).click();
    k('B2 "Thử lại" → tải lại được', await doiChu(t, '#wallet', /Chưa có giao dịch nào/));
  });

  them('B3 Bảng chọn gói', {}, async (t) => {
    await mo(t, '/uudai/vi'); await t.waitForSelector('#wallet .vt-hero-nut');
    await t.locator('#wallet .vt-hero-nut').click();
    await doiChu(t, '.bang-noi', /Chọn gói nạp/);
    const bn = await chu(t, '.bang-noi');
    k('B3 tiêu đề + dòng phụ', /Chọn gói nạp/.test(bn) && bn.includes('Tiền vào ví ngay khi quán nhận được chuyển khoản.'));
    const goi = await t.evaluate(() => [...document.querySelectorAll('.bang-noi .vt-goi')].map((e) => ({ ten: e.querySelector('.vt-goi-ten')?.textContent, so: e.querySelector('.vt-goi-so')?.textContent, th: e.querySelector('.vt-goi-thuong')?.textContent || '' })));
    k('B3 đúng thứ tự /goi-nap, tên POS nguyên văn', bang(goi.map((x) => x.ten), ['Gói 200K', 'Gói 100K', 'Nạp 50K']), JSON.stringify(goi));
    k('B3 dòng "Trả {tra} → vào ví {vao}"', goi[1].so === 'Trả 100.000đ → vào ví 105.000đ', goi[1].so);
    k('B3 nhãn thưởng "+10.000đ" / "+5.000đ" chỉ khi vao > tra', bang(goi.map((x) => x.th), ['+10.000đ', '+5.000đ', '']), JSON.stringify(goi.map((x) => x.th)));
    k('B3 chưa chọn → nút mờ', (await t.locator('.bang-noi .vt-tiep').getAttribute('aria-disabled')) === 'true');
    k('B3 dòng nhỏ cuối bảng + không ô gõ số tiền', bn.includes('Chỉ trả bằng chuyển khoản QR. Tiền đã nạp không hoàn lại.') && (await t.locator('.bang-noi input').count()) === 0);
    await t.locator('.bang-noi .vt-goi').nth(1).click();
    k('B3 chọn → "Tiếp tục · trả 100.000đ"', /Tiếp tục · trả 100\.000đ/.test(await chu(t, '.bang-noi .vt-tiep')) && (await t.locator('.bang-noi .vt-tiep').getAttribute('aria-disabled')) === 'false');
    await chup(t, 'bang_goi');
    await gomNd(t);
    await t.locator('.bang-noi .vt-tiep').click();
    k('B3 → Thanh toán nạp /uudai/vi/nap?goi=1', await doiUrl(t, /^\/uudai\/vi\/nap\?goi=1$/), duongDan(t));
  });

  them('B4–B5 nạp trọn luồng (quán đóng cửa)', { dong: true }, async (t, S) => {
    await mo(t, '/uudai/vi/nap?goi=1');
    await doi(t, async () => !(await nutKhoa(t)) && /Quét QR · 100\.000đ/.test(await chu(t, '#checkout .nut-dat')));
    const all = await chu(t, '#checkout');
    k('B4 quán đóng cửa vẫn đặt được (giỏ chỉ nạp mọi giờ), nút "Quét QR · 100.000đ"', !(await nutKhoa(t)) && /Quét QR · 100\.000đ/.test(await chu(t, '#checkout .nut-dat')), await chu(t, '#checkout .nut-dat'));
    k('B4 thẻ tóm tắt: tên gói POS, "Vào ví 105.000đ", giá = tổng báo giá', /Gói 100K/.test(await chu(t, '#checkout .the-tom')) && /Vào ví 105\.000đ/.test(await chu(t, '#checkout .the-tom')) && /100\.000đ/.test(await chu(t, '#checkout .the-tom-gia')));
    k('B4 dòng xanh + ô QR khoá + dòng khoá', all.includes('Tiền vào ví ngay khi quán nhận được chuyển khoản, không cần ra quầy.') && await co(t, '#checkout .tt-qr') && all.includes('Nạp tiền chỉ trả bằng chuyển khoản, không dùng số dư ví và không dùng mã giảm giá. Tiền đã nạp không hoàn lại.'));
    const bt = await t.evaluate(() => [...document.querySelectorAll('#checkout .bang-tien .summary-row')].map((e) => e.textContent));
    k('B4 bảng tiền nạp: Tiền nạp / Tổng cộng / Vào ví sau khi trả', bang(bt, ['Tiền nạp100.000đ', 'Tổng cộng100.000đ', 'Vào ví sau khi trả105.000đ']), JSON.stringify(bt));
    k('B4 không công tắc ví / mã giảm / nhận hàng', !(await co(t, '#checkout .switch')) && !(await co(t, '#checkout .mode-row')) && !(await co(t, '#checkout input')));
    k('B4 thân bao-gia: mon ĐÚNG [{ loai: nap, ma_goi: 1 }], không mã giảm, không lẫn giỏ đồ uống', S.bg.length > 0 && S.bg.every((b) => bang(b.mon, [{ loai: 'nap', ma_goi: 1 }]) && !('ma_giam' in b) && !('vouchers' in b)), JSON.stringify(S.bg[0]));
    await chup(t, 'thanh_toan_nap');
    await gomNd(t);
    await nutDat(t).dblclick();
    await doiUrl(t, /^\/don\/TQD7$/);
    await t.waitForTimeout(200);
    k('B4 bấm đúp → đúng MỘT POST /don', S.datDon.length === 1, String(S.datDon.length));
    const tb = S.datDon[0] || {};
    k('B4 thân POST /don: mon ĐÚNG [{ loai: nap, ma_goi: 1 }], cach_tra qr, không ma_giam / pin / vouchers, tong_da_xem 100000', bang(tb.mon, [{ loai: 'nap', ma_goi: 1 }]) && tb.cach_tra === 'qr' && !('ma_giam' in tb) && !('pin' in tb) && !('vouchers' in tb) && tb.tong_da_xem === 100000, JSON.stringify(tb));
    await doi(t, async () => co(t, '#tracking .tl-step'));
    const tr = await chu(t, '#tracking');
    const buoc = await t.evaluate(() => [...document.querySelectorAll('#tracking .tl-step .t')].map((e) => e.textContent));
    k('B5 Theo dõi đơn nạp chờ trả: đúng 2 bước "Chờ thanh toán" → "Đã vào ví"', buoc.length === 2 && /Đã vào ví/.test(buoc[1]), JSON.stringify(buoc));
    k('B5 không chữ "pha chế" / "ra quầy" (trừ dòng phụ "không cần ra quầy"), không số đơn to', !/pha chế/i.test(tr) && !/mời bạn ra quầy/i.test(tr) && !(await co(t, '#tracking .pick-num')));
    await chup(t, 'theo_doi_nap');
    await gomNd(t);
    // tiền về: POS cộng ví + ghi dòng /vi (số 106.000đ KHÁC `vao` 105.000đ của gói)
    const d = S.don.get('TQD7'); d.tt = 'xong'; S.vi += 106000;
    S.viTrang = { 1: { data: [{ ngay: BAY('20:32:00'), loai: 'nap', so_tien: 106000, thuong: 6000, ma_don: 'TQD7', ghi_chu: 'Nạp gói 100K' }, ...VI_1], con_nua: false } };
    k('B5 xong → "Đã nạp 106.000đ vào ví!" (số đọc từ /vi)', await doiChu(t, '#tracking', /Đã nạp 106\.000đ vào ví!/, 8000), await chu(t, '#tracking'));
    k('B5 số dư MỚI từ /toi đọc lại sau khi trả + nhãn "+106.000đ vừa vào ví"', await doiChu(t, '#tracking .vt-hero', /286\.600đ[\s\S]*\+106\.000đ vừa vào ví/), await chu(t, '#tracking .vt-hero'));
    const xong = await chu(t, '#tracking');
    k('B5 "Gồm 6.000đ tiền thưởng. Dùng trả đồ uống ở quầy và trên App." + "Đơn APP007 · 100.000đ"', xong.includes('Gồm 6.000đ tiền thưởng. Dùng trả đồ uống ở quầy và trên App.') && xong.includes('Đơn APP007 · 100.000đ'), xong);
    k('B5 Đã nạp không có các bước / số ra quầy', !(await co(t, '#tracking .tl-step')) && !(await co(t, '#tracking .pick-num')));
    await chup(t, 'da_nap');
    await gomNd(t);
    k('B4 giỏ đồ uống còn nguyên sau khi trả đơn nạp', bang(JSON.parse(await t.evaluate(() => localStorage.getItem('kh_gio'))), [LY]));
    await t.locator('#tracking button', { hasText: 'Xem ví' }).click();
    k('B5 "Xem ví" → /uudai/vi', await doiUrl(t, /^\/uudai\/vi$/), duongDan(t));
  });

  them('B4 gói không còn', {}, async (t, S) => {
    await mo(t, '/uudai/vi/nap?goi=99');
    k('B4 ?goi= lạ → "Gói nạp này không còn bán" + "Về Ví"', (await doiChu(t, '#checkout', /Gói nạp này không còn bán/)) && /Về Ví/.test(await chu(t, '#checkout')));
    await t.waitForTimeout(900);
    k('B4 ?goi= lạ → KHÔNG gọi bao-gia, không nút đặt', S.bg.length === 0 && !(await co(t, '#checkout .nut-dat')));
    await t.locator('#checkout button', { hasText: 'Về Ví' }).click();
    k('B4 "Về Ví" → /uudai/vi', await doiUrl(t, /^\/uudai\/vi$/), duongDan(t));
    await t.goBack().catch(() => {}); await t.waitForTimeout(300);
    k('B4 "Về Ví" THAY trang (Back không quay lại Thanh toán nạp lỗi — rà soát vòng 2)', !/\/uudai\/vi\/nap/.test(t.url()), t.url());
  });

  them('B4 /goi-nap lỗi', { goiLoi: true }, async (t, S) => {
    await mo(t, '/uudai/vi/nap?goi=1');
    k('B4 /goi-nap lỗi → câu lỗi + "Thử lại" + lối ra "Về Ví", không báo giá', (await doiChu(t, '#checkout', /Thử lại/)) && /Về Ví/.test(await chu(t, '#checkout')) && S.bg.length === 0);
    S.goiLoi = false;
    await t.locator('#checkout button', { hasText: 'Thử lại' }).click();
    k('B4 "Thử lại" → có gói, báo giá, nút "Quét QR · 100.000đ"', await doiChu(t, '#checkout .nut-dat', /Quét QR · 100\.000đ/), await chu(t, '#checkout .nut-dat'));
  });

  for (const code of ['GOI_NAP_KHONG_CO', 'NAP_KHONG_GOP', 'NAP_CHI_TIEN_MAT_QR']) {
    them(`B4 lỗi ${code}`, { kich: [{ st: 400, o: { error: `Lời POS giả: ${code}`, code } }] }, async (t, S) => {
      await mo(t, '/uudai/vi/nap?goi=1');
      await doi(t, async () => !(await nutKhoa(t)) && /Quét QR/.test(await chu(t, '#checkout .nut-dat')));
      await nutDat(t).click();
      k(`B4 ${code} → lời POS nguyên văn + "Về Ví", nút khoá, không tạo đơn`, (await doiChu(t, '#checkout', new RegExp(`Lời POS giả: ${code}`))) && /Về Ví/.test(await chu(t, '#checkout')) && await nutKhoa(t) && /\/uudai\/vi\/nap/.test(duongDan(t)) && !(await t.evaluate(() => localStorage.getItem('kh_don_gui'))));
      k(`B4 ${code}: đúng một POST /don`, S.datDon.length === 1);
    });
  }

  const CHUA_RO = JSON.stringify({ khoa_gui: 'K'.repeat(24), than: { mon: [{ loai: 'nap', ma_goi: 1 }], cach_nhan: 'tai_quan', cach_tra: 'qr', khoa_gui: 'K'.repeat(24), tong_da_xem: 100000 }, cach_tra: 'qr', luc: Date.parse('2026-11-16T20:20:00+07:00') });
  them('B4 đơn nạp chưa rõ', { luu: { kh_don_gui: CHUA_RO } }, async (t) => {
    await mo(t, '/uudai/vi/nap?goi=1');
    await doiChu(t, '#checkout .bang-tien', /Gói 100K/);
    const kn = await chu(t, '#checkout .bang-tien');
    k('B4 "chưa rõ" của đơn nạp hiện tên gói POS, không "undefined"', /Gói 100K/.test(kn) && !/undefined/.test(await chu(t, '#checkout')), kn);
    await gomNd(t);
    await mo(t, '/thanhtoan');
    k('B4 Thanh toán đồ uống mở cùng lúc: khối "chưa rõ" cũng hiện đúng tên gói', (await doiChu(t, '#checkout .bang-tien', /Gói 100K/)) && !/undefined/.test(await chu(t, '#checkout')), await chu(t, '#checkout .bang-tien'));
  });

  const DON_SAN = [
    { ma: 'N1', soHd: 'APP0101', tong: 100000, tt: 'xong', nap: true },
    { ma: 'N2', soHd: 'APP0102', tong: 100000, tt: 'da_huy', nap: true, tienVe: 100000, thongBao: 'Tiền 100.000đ đã vào tài khoản của bạn — không tạo được đơn vì gói nạp không còn bán.' },
    { ma: 'N3', soHd: 'APP0103', tong: 100000, tt: 'cho_tra', nap: true, qr: { chuoi: '0002Q', het_han: BAY('20:00:00') } },
    { ma: 'D1', soHd: 'APP0104', tong: 60000, tt: 'dang_lam' },
    { ma: 'T1', soHd: 'APP0105', tong: 295000, tt: 'xong', mon: [{ ma: null, loai: 'the', ten: '💎 Thẻ hội viên Vàng (3 tháng)', so_luong: 1, don_gia: 295000, thanh_tien: 295000, ghi_chu: null }] },
  ];
  const BG_N3 = JSON.stringify({ khoa_gui: 'M'.repeat(24), than: { mon: [{ loai: 'nap', ma_goi: 1 }], cach_nhan: 'tai_quan', cach_tra: 'qr', khoa_gui: 'M'.repeat(24), tong_da_xem: 100000 }, cach_tra: 'qr', luc: Date.parse('2026-11-16T19:50:00+07:00'), ma_don: 'N3', xong: true });
  them('B5 đơn nạp cũ + đối chứng', { donSan: DON_SAN, viTrang: { 1: { data: VI_1, con_nua: false } }, luu: { kh_don_gui: BG_N3 } }, async (t) => {
    await mo(t, '/don/N1');
    k('B5 /vi không có dòng khớp mã đơn → "Đã nạp tiền vào ví!", không số', (await doiChu(t, '#tracking', /Đã nạp tiền vào ví!/)) && !/Đã nạp [\d.]+đ/.test(await chu(t, '#tracking')), await chu(t, '#tracking'));
    await mo(t, '/don/N2');
    await doiChu(t, '#tracking', /không tạo được đơn vì gói nạp không còn bán/);
    k('B5 tiền về muộn POS không tạo đơn → câu POS nguyên văn, KHÔNG màn "Đã nạp"', /không tạo được đơn vì gói nạp không còn bán/.test(await chu(t, '#tracking')) && !/Đã nạp/.test(await chu(t, '#tracking')));
    await mo(t, '/don/N3');
    await doiChu(t, '#tracking', /Tạo mã mới/);
    await t.locator('#tracking button', { hasText: 'Tạo mã mới' }).click();
    k('B5 "Tạo mã mới" đơn nạp hết hạn → Thanh toán nạp đúng gói', await doiUrl(t, /^\/uudai\/vi\/nap\?goi=1$/), duongDan(t));
    await mo(t, '/don/D1');
    await doi(t, async () => co(t, '#tracking .tl-step'));
    k('B5 đối chứng: đơn đồ uống vẫn 4 bước + số đơn ra quầy', (await t.locator('#tracking .tl-step').count()) === 4 && await co(t, '#tracking .pick-num'));
    await mo(t, '/don/T1');
    k('B5 đối chứng: đơn thẻ vẫn màn Chào mừng', await doiChu(t, '#tracking .cm-dau', /Chào mừng hội viên/));
    await mo(t, '/taikhoan/donhang/N1');
    await doiChu(t, '#orderdetail', /Nạp 100\.000đ/);
    const ct = await chu(t, '#orderdetail .order-card');
    k('B5 Chi tiết đơn: dòng nạp = tên POS bỏ biểu tượng đầu, không "1 ×"', ct.includes('Nạp 100.000đ → vào tài khoản 105.000đ') && !ct.includes('💳') && !/1 × /.test(ct), ct);
    await mo(t, '/taikhoan/donhang');
    await doiChu(t, '#orderhistory', /APP0101/);
    await t.locator('#orderhistory .order-card', { hasText: 'APP0101' }).locator('.reorder-btn').click();
    k('Câu 2 (chủ quán 16.11): "Đặt lại" đơn chỉ nạp → "Đơn này không có món để đặt lại"', await doiChu(t, '.toast', /Đơn này không có món để đặt lại/), await chu(t, '.toast'));
  });

  const chay = async (ds, n) => { for (let i = 0; i < ds.length; i += n) await Promise.all(ds.slice(i, i + n).map((f) => f())); };
  await chay(CA, 4);
  k('B6 mọi data-nd trên các màn mới có trong danh mục nội dung', ndThieu.size === 0, [...ndThieu].join(', '));
  await trinh.close();
}
