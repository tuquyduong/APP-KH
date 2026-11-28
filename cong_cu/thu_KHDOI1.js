#!/usr/bin/env node
// THỬ KH-DOI-1 — đổi điểm lấy quà trên App (hợp đồng POS ĐÃ HẸN DOI-DIEM-1, thư POS 16.11 mục 1): Kho quà, đổi có PIN, phiếu quà QR, Quà của tôi, công tắc `hien.dq`.
// Phần 1 (luôn chạy, kể cả KHONG_TRINH_DUYET=1): hàm thuần + đọc nguồn · Phần 2: App thật trong Chromium, POS giả dựng TỪ hợp đồng đã hẹn
// (không có Playwright / KHONG_TRINH_DUYET=1 → in "BỎ QUA", không tính ca). Chạy: node cong_cu/thu_KHDOI1.js → dòng cuối "n đạt · m hỏng".
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

// Kho quà POS giả — đúng thứ tự `thu_tu` POS trả; đủ 5 kiểu thẻ của ảnh đã duyệt (đổi · hết lượt · thiếu điểm · tạm hết · chip hiện vật).
const Q = (ma, ten, loai, diem_can, mo_ta, them = {}) => ({ ma, ten, loai, diem_can, anh: null, mo_ta, han_ngay: loai === 'voucher' ? 30 : 14, con: true, gioi_han_thang: null, thu_tu: ma, con_luot_thang: null, du_diem: true, ...them });
const KHO = [
  Q(1, 'Voucher giảm 20.000đ', 'voucher', 500, 'Cho đơn từ 50.000đ · dùng trong 30 ngày'),
  Q(2, 'Voucher giảm 10%', 'voucher', 800, 'Tối đa 30.000đ · dùng trong 30 ngày', { anh: 'https://anh.tuquyduong.test/vc10.webp' }),
  Q(3, 'Tặng 1 ly Cà phê Muối', 'hien_vat', 1200, 'Nhận tại quầy trong 14 ngày', { gioi_han_thang: 2, con_luot_thang: 2 }),
  Q(4, 'Miễn phí giao hàng', 'voucher', 300, 'Đơn giao Ahamove · 1 lần / tháng', { gioi_han_thang: 1, con_luot_thang: 0 }),
  Q(5, 'Túi tote Tứ Quý Đường', 'hien_vat', 2500, 'Phiên bản giới hạn · nhận tại quầy', { du_diem: false }),
  Q(6, 'Hộp trà Lục Bảo 10 gói', 'hien_vat', 3000, 'Nhận tại quầy trong 14 ngày', { con: false, du_diem: false }),
];
const P = (ma, ten, trang_thai, het_han, them = {}) => ({ ma, ten, anh: null, qr: `TQD-QUA-${ma}`, trang_thai, het_han, nhac: false, doi_luc: '2026-11-14T10:00:00', dung_luc: null, diem: 1200, hoan_diem: null, ...them });
const QUA_TOI = [
  P('PQ7K2QX9', 'Tặng 1 ly Cà phê Muối', 'chua_dung', '2026-11-28T23:59:59', { nhac: true }),
  P('PQ2TUI', 'Túi tote Tứ Quý Đường', 'chua_dung', '2026-12-09T23:59:59', { diem: 2500 }),
  P('PQ3TRA', 'Hộp trà Lục Bảo 10 gói', 'da_dung', '2026-11-25T23:59:59', { dung_luc: '2026-11-20T15:00:00', diem: 3000 }),
  P('PQ4CF', 'Tặng 1 ly Cà phê Muối', 'het_han', '2026-11-10T23:59:59', { hoan_diem: 1200 }),
];

(async () => {
  console.log('Phần 1 — hàm thuần, đọc nguồn');
  let D = {};
  try { D = await nap('src/doiQua.js'); } catch (e) { k('nạp src/doiQua.js', false, String(e.message).split('\n')[0]); }

  await thu('A2 docKhoQua', async () => {
    const f = D.docKhoQua || (() => []);
    const ds = f({ data: KHO }, 1250);
    k('A2 đủ 6 quà, ĐÚNG thứ tự POS', bang(ds.map((q) => q.ma), [1, 2, 3, 4, 5, 6]), JSON.stringify(ds.map((q) => q.ma)));
    k('A2 nút theo tình huống: đổi · đổi · đổi · hết lượt · thiếu · tạm hết', bang(ds.map((q) => q.nut), ['doi', 'doi', 'doi', 'luot', 'thieu', 'het']), JSON.stringify(ds.map((q) => q.nut)));
    k('A2 "Cần thêm N": N = diem_can − điểm (2500 − 1250)', ds[4] && ds[4].thieu === 1250, JSON.stringify(ds[4]));
    const dao = f({ data: [KHO[4], KHO[0], KHO[5], KHO[1]] }, 1250);
    k('A2 App KHÔNG xếp lại (câu 3a): thứ tự vào = thứ tự ra (kể cả thiếu điểm / hết hàng đứng trước)', bang(dao.map((q) => q.ma), [5, 1, 6, 2]), JSON.stringify(dao.map((q) => q.ma)));
    k('A2 mo_ta NGUYÊN chữ POS, loại, điểm', ds[0] && ds[0].moTa === KHO[0].mo_ta && ds[0].loai === 'voucher' && ds[0].diemCan === 500 && ds[2].loai === 'hien_vat');
    const hong = f({ data: [null, 'x', { ...KHO[0], ma: '1' }, { ...KHO[0], ma: 1.5 }, { ...KHO[0], ten: '  ' }, { ...KHO[0], loai: 'the' }, { ...KHO[0], diem_can: 0 }, { ...KHO[0], diem_can: 1.5 }, { ...KHO[0], diem_can: '500' }, KHO[1]] }, 1250);
    k('A2 dòng hỏng (mã không nguyên, tên rỗng, loại lạ, điểm không nguyên dương) → bỏ, dòng tốt giữ', bang(hong.map((q) => q.ma), [2]), JSON.stringify(hong.map((q) => q.ma)));
    k('A2 data không phải mảng / null → []', bang(f({ data: 'x' }, 1), []) && bang(f(null, 1), []) && bang(f(undefined), []));
    k('A2 anh: chỉ https:// → giữ; http / javascript / rỗng → null (huy hiệu theo loai)',
      ds[1].anh === KHO[1].anh && ['http://a/b.png', 'javascript:alert(1)', '', 5].every((a) => f({ data: [{ ...KHO[0], anh: a }] }, 1250)[0].anh === null));
    const mot = (x, diem) => (f({ data: [{ ...KHO[0], ...x }] }, diem)[0] || {});
    k('A2 con không phải true (thiếu, "true", 1) → Tạm hết', ['__thieu', 'true', 1].every((c) => mot(c === '__thieu' ? { con: undefined } : { con: c }, 1250).nut === 'het'));
    k('A2 con_luot_thang 0 → hết lượt; null / thiếu / 2 → không', mot({ con_luot_thang: 0 }, 1250).nut === 'luot' && [null, undefined, 2].every((c) => mot({ con_luot_thang: c }, 1250).nut === 'doi'));
    k('A2 du_diem thiếu → so diem_can với điểm /diem (500 ≤ 1250 đổi; 2500 thiếu 1250)', mot({ du_diem: undefined }, 1250).nut === 'doi' && mot({ du_diem: undefined, diem_can: 2500 }, 1250).nut === 'thieu' && mot({ du_diem: undefined, diem_can: 2500 }, 1250).thieu === 1250);
    k('A2 du_diem false của POS thắng phép so của App (điểm đủ) → thiếu, không số N (null)', mot({ du_diem: false }, 1250).nut === 'thieu' && mot({ du_diem: false }, 1250).thieu === null);
    k('A2 du_diem thiếu + điểm chưa biết → không cho đổi, N null', mot({ du_diem: undefined }, undefined).nut === 'thieu' && mot({ du_diem: undefined }, undefined).thieu === null);
    k('A2 thứ tự ưu tiên: hết hàng › hết lượt › thiếu điểm', mot({ con: false, con_luot_thang: 0, du_diem: false }, 0).nut === 'het' && mot({ con_luot_thang: 0, du_diem: false }, 0).nut === 'luot');
    const c = D.conLaiSauDoi || (() => 'x');
    k('A2 "Còn lại" chỉ hiển thị: 1250 − 500 = 750; vừa đủ = 0', c(1250, 500) === 750 && c(500, 500) === 0);
    k('A2 "Còn lại" không âm: thiếu điểm / điểm chưa biết → null', c(1250, 2500) === null && c(undefined, 500) === null && c('1250', 500) === null);
  });

  await thu('A2 docQuaCuaToi', async () => {
    const f = D.docQuaCuaToi || (() => ({}));
    const r = f({ data: QUA_TOI });
    k('A2 Chờ nhận = chua_dung (thứ tự POS), Đã xong = da_dung + het_han', bang((r.cho || []).map((p) => p.ma), ['PQ7K2QX9', 'PQ2TUI']) && bang((r.xong || []).map((p) => p.ma), ['PQ3TRA', 'PQ4CF']), JSON.stringify(r));
    k('A2 nhac chỉ ở phiếu chua_dung có nhac === true', r.cho && r.cho[0].nhac === true && r.cho[1].nhac === false);
    const lech = f({ data: [{ ...QUA_TOI[2], nhac: true }, { ...QUA_TOI[0], nhac: 'true' }] });
    k('A2 nhac ở phiếu đã nhận / nhac không phải true → false (App không tự tính hạn)', lech.xong[0].nhac === false && lech.cho[0].nhac === false);
    k('A2 trường phiếu: qr, hetHan, diem, hoanDiem, dungLuc', r.cho[0].qr === 'TQD-QUA-PQ7K2QX9' && r.cho[0].hetHan === '2026-11-28T23:59:59' && r.xong[1].hoanDiem === 1200 && r.xong[0].dungLuc === '2026-11-20T15:00:00' && r.cho[0].diem === 1200 && r.cho[0].hoanDiem === null);
    const hong = f({ data: [null, { ...QUA_TOI[0], ma: '' }, { ...QUA_TOI[0], ten: '' }, { ...QUA_TOI[0], trang_thai: 'la' }, { ...QUA_TOI[3], hoan_diem: '1200', diem: 'x' }] });
    k('A2 dòng hỏng bỏ; số hỏng → null', hong.cho.length === 0 && hong.xong.length === 1 && hong.xong[0].hoanDiem === null && hong.xong[0].diem === null, JSON.stringify(hong));
    k('A2 data không phải mảng → { cho: [], xong: [] }', bang(f(null), { cho: [], xong: [] }) && bang(f({ data: {} }), { cho: [], xong: [] }));
  });

  await thu('A2 docKetQuaDoi', async () => {
    const f = D.docKetQuaDoi || (() => 'x');
    const v = f({ loai: 'voucher', diem_con: 760, voucher_code: 'DD7K2Q', phieu: null });
    k('A2 voucher → { loai, diemCon (số POS), voucherCode }', v && v.loai === 'voucher' && v.diemCon === 760 && v.voucherCode === 'DD7K2Q' && v.phieu === null, JSON.stringify(v));
    const h = f({ loai: 'hien_vat', diem_con: 50, voucher_code: null, phieu: { ...QUA_TOI[0], ma: 'PQNEW1' } });
    k('A2 hiện vật → phieu đọc như một dòng /qua-cua-toi', h && h.loai === 'hien_vat' && h.phieu && h.phieu.ma === 'PQNEW1' && h.phieu.qr === 'TQD-QUA-PQ7K2QX9' && h.voucherCode === null, JSON.stringify(h));
    k('A2 thiếu / sai → null (gửi lại cùng khoá): diem_con chuỗi, voucher không mã, hiện vật không phiếu, loại lạ, null',
      [{ loai: 'voucher', diem_con: '760', voucher_code: 'A' }, { loai: 'voucher', diem_con: 1 }, { loai: 'hien_vat', diem_con: 1, phieu: null }, { loai: 'hien_vat', diem_con: 1, phieu: { ma: '' } }, { loai: 'x', diem_con: 1 }, null, 'x'].every((x) => f(x) === null));
  });

  await thu('A1 api + khoá gửi', async () => {
    const api = doc('src/api.js');
    k("A1 layKhoQua = () => goi('GET', '/kho-qua'); layQuaCuaToi = () => goi('GET', '/qua-cua-toi')",
      /export const layKhoQua = \(\) => goi\('GET', '\/kho-qua'\)/.test(api) && /export const layQuaCuaToi = \(\) => goi\('GET', '\/qua-cua-toi'\)/.test(api));
    k("A1 doiDiemApp = (than) => goi('POST', '/doi-diem', than, …) — qua goi, có giờ chờ", /export const doiDiemApp = \(than\) => goi\('POST', '\/doi-diem', than, MS_CHO_DAT_DON\)/.test(api));
    const cong = /CUA_CONG_KHAI = \[([^\]]*)\]/.exec(api);
    k("A1 '/kho-qua' KHÔNG trong CUA_CONG_KHAI (có token thì gửi — POS thêm con_luot_thang / du_diem)", !!cong && !/kho-qua/.test(cong[1]));
    const giu = /CUA_401_GIU_PHIEN = \[([^\]]*)\]/.exec(api);
    k("A1 '/kho-qua' trong CUA_401_GIU_PHIEN; 401 chỉ thoát phiên khi cửa KHÔNG trong danh sách", !!giu && /'\/kho-qua'/.test(giu[1]) && /res\.status === 401 && token && !CUA_401_GIU_PHIEN\.includes\(duong\)/.test(api));
    k('A1 không thêm lối fetch: api.js vẫn đúng 2 lời gọi fetch; tệp mới không fetch', (api.match(/\bfetch\(/g) || []).length === 2
      && ['src/doiQua.js', 'src/pages/DoiQua.jsx', 'src/pages/QuaCuaToi.jsx', 'src/pages/PhieuQua.jsx'].every((f) => docTho(f) && !/\bfetch\(/.test(doc(f))));
    const DD = await nap('src/datDon.js');
    const lan = [];
    let n = 0;
    const r = await DD.guiDonAnToan({ ma_qua: 1, khoa_gui: 'k'.repeat(36), pin: '1234' }, {
      gui: async (t) => { lan.push(t); if (n++ === 0) throw Object.assign(new Error('mạng'), { status: 0, code: 'MANG_LOI' }); return { loai: 'voucher', diem_con: 760, voucher_code: 'DD7K2Q', phieu: null }; },
      cho: async () => {}, doc: D.docKetQuaDoi,
    });
    k('A1 guiDonAnToan(…, { doc }) — mạng hỏng lần 1 → gửi lại ĐÚNG đối tượng thân (cùng khoa_gui + pin), đọc bằng docKetQuaDoi', lan.length === 2 && lan[0] === lan[1] && r && r.diemCon === 760, JSON.stringify(r));
    const r2 = await DD.guiDonAnToan({ x: 1 }, { gui: async () => ({ ma_don: 'TQD1', tong: 1 }), cho: async () => {} });
    k('A1 guiDonAnToan mặc định vẫn đọc đơn (Thanh toán không đổi)', r2 && r2.ma === 'TQD1');
    const dq = doc('src/pages/DoiQua.jsx');
    k('A1 DoiQua: khoa_gui = taoKhoaGui(), gửi qua guiDonAnToan + khoaGui (chặn bấm đúp); PIN không vào kho máy', /taoKhoaGui\(\)/.test(dq) && /guiDonAnToan\(/.test(dq) && /khoaGui\(/.test(dq) && !/localStorage|sessionStorage/.test(dq));
  });

  await thu('A3 kho dữ liệu khách', async () => {
    const K = await nap('src/duLieuKhach.js');
    k('A3 cuaQuaToi có, KHÔNG trong CUA_KHACH (làm mới ngầm sẽ gọi /qua-cua-toi khi công tắc tắt)', !!K.cuaQuaToi && !K.CUA_KHACH.includes(K.cuaQuaToi));
    if (K.cuaQuaToi) { K.cuaQuaToi.kho.dat({ dl: { data: [] }, luc: 1, loi: '' }); K.xoaKhoKhach(); }
    k('A3 xoaKhoKhach (đăng xuất / đổi khách) xoá cả cuaQuaToi', !!K.cuaQuaToi && K.cuaQuaToi.kho.lay().dl === null);
    // Hàm thuần của bản ghi "chưa rõ" (đường thật — 401 / Đăng xuất / khách khác — ở các ca trình duyệt "A1 đường thật …").
    const ghi = D.ghiChoRo || (() => {}), khoaR = D.khoaChoRo || (() => 'x'), xoaR = D.xoaChoRo || (() => {});
    const KA = 'a'.repeat(36), KB = 'b'.repeat(36);
    ghi(1, KA, 'chuA'); ghi(2, KB, 'chuA');
    k('A1 "chưa rõ" theo TỪNG quà: quà B không đè khoá quà A', khoaR(1, 'chuA') === KA && khoaR(2, 'chuA') === KB && khoaR(3, 'chuA') === null);
    k('A1 khoá GẮN khách: khách khác / chưa biết khách không đọc được khoá', khoaR(1, 'chuB') === null && khoaR(1, '') === null && khoaR(1) === null);
    ghi(4, KA, '');
    k('A1 không ghi khoá khi chưa biết khách', khoaR(4, '') === null && khoaR(4, 'chuA') === null);
    xoaR(2);
    k('A1 xoá đúng một quà (đổi xong / 4xx khoá mới) không đụng quà khác', khoaR(2, 'chuA') === null && khoaR(1, 'chuA') === KA);
    xoaR();
    k('A1 xoá hết (Đăng xuất)', khoaR(1, 'chuA') === null);
    const cds = doc('src/components/CheDoSua.jsx');
    k("B5 Chế độ sửa \"Đi tới màn\" không mở Phiếu quà bằng mã ĐƠN", /e\.trang !== 'phieuqua'/.test(cds));
    const dq = doc('src/pages/DoiQua.jsx');
    k('A3 đổi xong → lamMoi([cuaDiem, cuaVoucher, cuaQuaToi])', /lamMoi\(\[cuaDiem, cuaVoucher, cuaQuaToi\]\)/.test(dq));
  });

  await thu('A4 canTuPos', async () => {
    const { CAN_TU_POS } = await nap('src/kiemKhop/canTuPos.js');
    const m = (cua) => CAN_TU_POS.find((x) => x.cua === cua) || {};
    k('A4 3 cửa đã hẹn: GET /kho-qua (token tuỳ chọn), POST /doi-diem, GET /qua-cua-toi — co: false, viec_pos DOI-DIEM-1',
      m('GET /kho-qua').co === false && m('GET /kho-qua').token === 'tuy_chon' && m('POST /doi-diem').co === false && m('POST /doi-diem').token === true && m('GET /qua-cua-toi').co === false
      && ['GET /kho-qua', 'POST /doi-diem', 'GET /qua-cua-toi'].every((c) => m(c).viec_pos === 'DOI-DIEM-1'));
    k('A4 bỏ dòng cũ "Đổi điểm … chưa chốt tên cửa" (P3b)', !CAN_TU_POS.some((x) => x.ma === 'doi_diem' && /chưa chốt/.test(x.cua)));
  });

  await thu('B danh mục + nguồn', async () => {
    const ND = await nap('src/noiDung/nd.js'), IDX = await nap('src/noiDung/nd/index.js');
    let DQ = null; try { DQ = (await nap('src/noiDung/nd/doiQua.js')).DOI_QUA; } catch { /* chưa có */ }
    k('B8 nd/doiQua.js xuất DOI_QUA, đăng ký ở nd/index.js', Array.isArray(DQ) && DQ.length > 20 && DQ.every((x) => IDX.DANH_MUC.includes(x)));
    const tat = IDX.DANH_MUC.find((x) => x.khoa === 'hien.dq');
    k('B8 công tắc hien.dq: battat, macDinh FALSE (câu 1a) → ndHien tắt', !!tat && tat.loai === 'battat' && tat.macDinh === false && ND.ndHien('hien.dq') === false);
    k('B8 kiemDanhMuc(danh mục) không lỗi', ND.kiemDanhMuc(IDX.DANH_MUC).length === 0, ND.kiemDanhMuc(IDX.DANH_MUC).slice(0, 3).join(' · '));
    const pos = IDX.DANH_MUC.find((x) => x.khoa === 'dq.pos');
    k('B8 chữ POS (tên, mô tả, ảnh, điểm) = mục khoá pos "POS › Cài đặt › Kho quà"', !!pos && pos.khoaBoi === 'pos' && /POS › Cài đặt › Kho quà/.test(pos.chiDuong));
    const duong = await nap('src/duongDan.js');
    const a = duong.docDuongDan('/uudai/doi-qua'), b = duong.docDuongDan('/uudai/qua'), c = duong.docDuongDan('/uudai/qua/PQ7K2QX9');
    k('B2 /uudai/doi-qua: trang doiqua, tab uudai, canDN, cha /uudai', a.trang === 'doiqua' && a.tab === 'uudai' && a.canDN && a.cha === '/uudai', JSON.stringify(a));
    k('B6 /uudai/qua: trang quatoi, canDN; B5 /uudai/qua/<ma>: trang phieuqua, giữ mã nguyên', b.trang === 'quatoi' && b.canDN && c.trang === 'phieuqua' && c.canDN && c.tham.ma === 'PQ7K2QX9' && duong.taoDuongDan('phieuqua', { ma: 'PQ7K2QX9' }) === '/uudai/qua/PQ7K2QX9', JSON.stringify(c));
    k('B2 tên tab trình duyệt có tên màn mới', /Đổi quà/.test(duong.tieuDeTrang('doiqua')) && /Quà của tôi/.test(duong.tieuDeTrang('quatoi')) && /Phiếu quà/.test(duong.tieuDeTrang('phieuqua')));
    const html = docTho('index.html'), sym = docTho('viec/KH-DOI-1/sym.txt').trim();
    k('B2 index.html chép NGUYÊN 3 <symbol> m-gift / m-coffee / m-bag của demo (sym.txt)', sym.length > 500 && html.includes(sym));
    const css = docTho('src/giaoDien/doi_qua.css'), demo = docTho('thiet_ke/app_kh_demo.html').replace(/data:[^"')\s]{100,}/g, '');
    const demoMau = docMau(demo), la = [...docMau(css)].filter((x) => !demoMau.has(x));
    k('B doi_qua.css có, 0 màu ngoài demo (thuật toán K9)', css.length > 300 && la.length === 0, la.join(' · '));
    const lop = [...new Set([...boChuThich(css).matchAll(/(?<![\w-])\.([a-z][\w-]*)/g)].map((x) => x[1]))];
    const KHUON = /^(dq-|wallet-box|vt-o|cm-dau|ic$|info$|t$|m$|d$|pts$|amt$|lbl$|mo$|tat$|vien$|so$|mui$|ten$|tru$|nhac$|cu$|cho$|med$|ico$|khung-qr|qr-chu$|ok$)/;
    k('B lớp MỚI trong doi_qua.css đều tiền tố dq- (lớp khác chỉ làm ngữ cảnh)', lop.some((x) => x.startsWith('dq-')) && lop.every((x) => KHUON.test(x)), lop.filter((x) => !KHUON.test(x)).join(', '));
    const ud = doc('src/pages/UuDai.jsx');
    k("B7 Lịch sử điểm không đổi: dòng hiện nguyên reason POS (redeem / hoan_qua)", /\{h\.reason \|\| nd\(LOAI_DIEM\[h\.type\] \|\| 'ud\.loai\.khac'\)\}/.test(ud));
    k("B1 Ưu đãi đọc công tắc ndHien('hien.dq')", /ndHien\('hien\.dq'\)/.test(ud));
    const app = doc('src/App.jsx');
    k("B1 App: công tắc tắt mà mở thẳng màn đổi quà → về /uudai", /ndHien\('hien\.dq'\)/.test(app));
  });

  await thu('K8 đã hẹn', async () => {
    // Chủ quán 27.11 (Q1, chọn C có sửa): bộ kiểm K8 nhận 3 cửa ĐÃ HẸN viết thẳng trong hằng DA_HEN_POS; K8d đỏ khi cửa đã hẹn đã vào hợp đồng (nhắc gỡ).
    // Chạy BỘ KIỂM THẬT trên bản sao tạm KHÔNG có cong_cu/thu_*.js (chỉ phần tĩnh chạy — không đệ quy), đọc dòng K8 / K8d.
    const kt = docTho('kiem_tra_truoc_khi_giao.js');
    const hang = /const DA_HEN_POS = \[([^\]]*)\]/.exec(kt);
    k("K8 DA_HEN_POS viết thẳng ĐÚNG 3 cửa 'GET /kho-qua', 'POST /doi-diem', 'GET /qua-cua-toi' (không đọc canTuPos.js)",
      !!hang && bang([...hang[1].matchAll(/'([^']*)'/g)].map((m) => m[1]), ['GET /kho-qua', 'POST /doi-diem', 'GET /qua-cua-toi']) && !/canTuPos/.test(boChuThich(kt)), hang && hang[1]);
    const { spawnSync } = require('child_process');
    const os = require('os');
    const chayKiem = (sua = []) => {
      const tam = fs.mkdtempSync(path.join(os.tmpdir(), 'k8-kh-doi-1-'));
      try {
        for (const d of ['kiem_tra_truoc_khi_giao.js', 'package.json', 'package-lock.json', 'index.html', 'src', 'thiet_ke', 'public', 'cong_cu']) if (fs.existsSync(path.join(GOC, d))) fs.cpSync(path.join(GOC, d), path.join(tam, d), { recursive: true });
        for (const f of fs.readdirSync(path.join(tam, 'cong_cu'))) if (/^thu_.*\.js$/.test(f)) fs.rmSync(path.join(tam, 'cong_cu', f));
        fs.symlinkSync(path.join(GOC, 'node_modules'), path.join(tam, 'node_modules'));
        for (const [tep, tu, den] of sua) { const f = path.join(tam, tep), s = fs.readFileSync(f, 'utf8'); if (!s.includes(tu)) return `KHÔNG thấy chỗ sửa trong ${tep}`; fs.writeFileSync(f, s.replace(tu, den)); }
        return spawnSync(process.execPath, ['kiem_tra_truoc_khi_giao.js'], { cwd: tam, encoding: 'utf8', timeout: 100000 }).stdout || '';
      } finally { fs.rmSync(tam, { recursive: true, force: true }); }
    };
    const dong = (ra, ma) => ra.split('\n').find((d) => new RegExp(`[✓✗] ${ma} `).test(d)) || '';
    const r0 = chayKiem();
    k('K8 cây hiện tại: ✓ K8 (3 cửa đã hẹn được nhận)', /✓ K8 mọi lời gọi/.test(dong(r0, 'K8')), dong(r0, 'K8'));
    k('K8d cây hiện tại: ✓ K8d (chưa cửa đã hẹn nào vào hợp đồng)', /^\s*✓ K8d /.test(dong(r0, 'K8d')), dong(r0, 'K8d') || 'không có dòng K8d');
    const r1 = chayKiem([['src/api.js', "export const layKhoQua = () => goi('GET', '/kho-qua');", "export const layKhoQua = () => goi('GET', '/kho-qua');\nexport const layCuaLa = () => goi('GET', '/cua-la');"]]);
    k('K8 cửa lạ trong api.js (không hợp đồng, không DA_HEN_POS) → vẫn ✗ K8, nêu tên cửa', /✗ K8 mọi lời gọi.*GET \/cua-la/.test(dong(r1, 'K8')) && !/kho-qua|doi-diem|qua-cua-toi/.test(dong(r1, 'K8')), dong(r1, 'K8'));
    const r2 = chayKiem([['thiet_ke/HOP_DONG_API_KH.md', '"cua": [', '"cua": [\n    { "pt": "GET", "duong": "/kho-qua" },']]);
    k('K8d cửa đã hẹn đã vào hợp đồng → ✗ K8d nhắc gỡ khỏi DA_HEN_POS', /✗ K8d .*GET \/kho-qua/.test(dong(r2, 'K8d')), dong(r2, 'K8d') || r2.split('\n').find((d) => /KHÔNG thấy/.test(d)) || 'không có dòng K8d');
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
const BAT = JSON.stringify({ so_ban: 7, gia_tri: { 'hien.dq': true } });
const SDT_A = '0909123456', SDT_B = '0909999999';

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
  const chu0 = (await nap('src/luuMay.js')).dauVet('0909123456');

  async function may(ten, S0, chay) {
    const ctx = await trinh.newContext({ viewport: { width: 390, height: 844 }, timezoneId: 'Asia/Ho_Chi_Minh' });
    await ctx.clock.install({ time: new Date('2026-11-27T10:30:00+07:00') }); await ctx.clock.resume();
    const AI = { 'tok-A': SDT_A }; // token → SDT (POS giả hiểu nhiều khách; xac-minh thêm token mới)
    const S = { kho: KHO, quaToi: QUA_TOI, diem: 1250, vc: [], kich: [], goi: [], doi: [], doiAi: [], khoa: new Map(), loiTrang: [], nd: BAT, ...S0 };
    await ctx.addInitScript(({ chu0, nd, chan }) => {
      if (chan) { // kho máy chặn ghi chủ máy (cửa sổ riêng tư / trình duyệt nhúng): luuMay.docChu → null → doiKhach 'chuaBiet'
        const g = Storage.prototype.setItem;
        Storage.prototype.setItem = function (kh, v) { if (kh === 'kh_chu') throw new Error('chặn'); return g.call(this, kh, v); };
      }
      if (location.protocol !== 'http:' || sessionStorage.getItem('da_gieo')) return;
      sessionStorage.setItem('da_gieo', '1');
      localStorage.setItem('kh_ngay_man_dau', '2026-11-27');
      localStorage.setItem('kh_token', 'tok-A');
      if (!chan) localStorage.setItem('kh_chu', chu0);
      if (nd) localStorage.setItem('kh_nd_ban', nd);
    }, { chu0, nd: S.nd, chan: !!S.chan });
    await ctx.route(`${URL0}/**`, async (r) => {
      const req = r.request(), u = new URL(req.url()), p = u.pathname, pt = req.method();
      const json = (status, o) => r.fulfill({ status, contentType: 'application/json', body: JSON.stringify(o) }).catch(() => {});
      if (p === '/bundle.js') return r.fulfill({ contentType: 'text/javascript', body: goiApp });
      if (!p.startsWith('/api/kh')) return /\.[a-z0-9]+$/.test(p) || p.startsWith('/api/') ? r.fulfill({ status: 404, body: '' }) : r.fulfill({ contentType: 'text/html', body: HTML });
      const duong = p.slice('/api/kh'.length), auth = req.headers().authorization || '';
      let than = null; try { than = JSON.parse(req.postData()); } catch { /* không thân */ }
      S.goi.push({ pt, duong, auth, luc: S.goi.length });
      if (duong === '/gio-vang') return json(200, { success: true, dang_chay: false, bat_dau: null, ket_thuc: null, phan_tram: 0, mon: [] });
      if (duong === '/hang') return json(200, { success: true, data: [] });
      if (duong === '/gio-hoat-dong') return json(200, { success: true, bay_gio: '2026-11-27T10:30:00', dang_mo: true, nhan_don: true, hom_nay: { mo: '08:00', dong: '22:00' }, mo_lai_luc: null, thong_bao: '', lich_tuan: [], ngay_nghi: [] });
      if (duong === '/menu') return json(200, { success: true, data: [{ ma: 'TLB', ten: 'Trà Lục Bảo', nhom: 'Trà', gia: 30000, con_hang: true, gia_hang: [] }] });
      if (duong === '/chuong-trinh' || duong === '/quang-cao') return json(200, { success: true, bay_gio: '2026-11-27T10:30:00', data: [] });
      if (duong === '/goi-nap') return json(200, { success: true, data: [] });
      if (duong === '/kho-qua') {
        if (S.kho401) return json(401, { error: 'Phiên đăng nhập đã hết', code: 'KH_TOKEN_SAI' });
        const coTok = !!AI[auth.replace(/^Bearer /, '')];
        return json(200, { success: true, data: S.kho.map((q) => { if (coTok) return q; const { con_luot_thang, du_diem, ...x } = q; return x; }) });
      }
      if (duong === '/dang-nhap/xin-ma') return json(200, { success: true });
      if (duong === '/dang-nhap/xac-minh') { const sdt = than.sdt, tok = sdt === SDT_A ? 'tok-A' : 'tok-' + sdt; AI[tok] = sdt; return json(200, { success: true, token: tok, khach: { sdt, ten: 'Khách', xung_ho: 'chi' } }); }
      const ai = AI[auth.replace(/^Bearer /, '')];
      if (S.diem401 && duong === '/diem') { S.diem401 = false; return json(401, { error: 'Phiên đăng nhập đã hết', code: 'KH_TOKEN_SAI' }); }
      if (!ai) return json(401, { error: 'Phiên đăng nhập đã hết', code: 'KH_TOKEN_SAI' });
      if (duong === '/toi') return json(200, { success: true, khach: { sdt: ai, ten: 'Linh', xung_ho: 'chi', dia_chi: null, qr: 'QR', hang: null, so_du_vi: 180600 } });
      if (duong === '/diem') return json(200, { success: true, points: S.diem, history: [{ id: 9, type: 'redeem', points: -500, reason: 'Đổi quà: Voucher giảm 20.000đ', created_at: '2026-11-20T09:00:00' }] });
      if (duong === '/voucher') return json(200, { success: true, data: S.vc, ma_khach_moi: [] });
      if (duong === '/gia-han') return json(200, { success: true, token: 'tok-A', het_han: '2026-12-27T08:00:00' });
      if (duong === '/qua-cua-toi') { if (S.chamQuaToi && S.doi.length) await new Promise((x) => setTimeout(x, S.chamQuaToi)); if (ai !== SDT_A && S.loiQuaToiB) return json(500, { error: 'Lỗi máy chủ', code: 'LOI_MAY_CHU' }); return json(200, { success: true, data: ai === SDT_A ? S.quaToi : [] }); }
      if (duong === '/doi-diem' && pt === 'POST') {
        S.doi.push(than); S.doiAi.push(ai);
        const x = S.kich.shift();
        if (x && x.mat) return r.abort('internetdisconnected');
        if (x && x.cham) { await new Promise((v) => setTimeout(v, x.cham)); if (x.st) return json(x.st, x.o); } // chậm rồi trả lời theo `st` (không có → xử lý thường)
        else if (x) return json(x.st, x.o);
        const q = S.kho.find((y) => y.ma === than.ma_qua);
        if (S.khoa.has(than.khoa_gui)) return json(200, S.khoa.get(than.khoa_gui));
        if (than.pin !== '1234') return json(400, { error: 'Mã PIN không đúng', code: 'PIN_SAI' });
        if (!q) return json(404, { error: 'Quà này không còn', code: 'QUA_KHONG_CO' });
        S.diem -= q.diem_can;
        let kq;
        if (q.loai === 'voucher') {
          S.vc = [{ id: 'DD7K2Q', code: 'DD7K2Q', reward_name: q.ten, discount_type: 'fixed', discount_value: 20000, expires_at: '2026-12-27T23:59:59', status: 'available', mo_ta: 'Giảm 20.000đ cho đơn từ 50.000đ · HSD 27/12/2026', nguon: 'doi_diem', kieu: 'tien', min_order: 50000, giam_ship: 0 }, ...S.vc];
          kq = { success: true, loai: 'voucher', diem_con: S.diem + 10, voucher_code: 'DD7K2Q', phieu: null }; // diem_con CỐ Ý khác (điểm − diem_can): App phải hiện số POS
        } else {
          const ph = P('PQNEW1', q.ten, 'chua_dung', '2026-12-11T23:59:59', { diem: q.diem_can });
          S.quaToi = [ph, ...S.quaToi];
          kq = { success: true, loai: 'hien_vat', diem_con: S.diem, voucher_code: null, phieu: ph };
        }
        S.khoa.set(than.khoa_gui, kq);
        return json(200, kq);
      }
      if (duong === '/don' && pt === 'GET') return json(200, { success: true, trang: 1, con_nua: false, data: [] });
      return json(500, { error: 'chưa giả', code: 'LOI_MAY_CHU' });
    });
    const t = await ctx.newPage(); t.on('pageerror', (e) => S.loiTrang.push(e.message)); t.setDefaultTimeout(6000);
    try { await chay(t, S); } catch (e) { k(`ca ${ten} dừng giữa chừng`, false, String(e && e.message).split('\n').slice(0, 8).join(' / ')); }
    k(`[${ten}] trang không báo lỗi JS`, S.loiTrang.length === 0, S.loiTrang[0]);
    await ctx.close();
  }
  const mo = async (t, duong) => { await t.goto(URL0 + duong); await t.waitForSelector('.phone'); };
  const chu = (t, sel) => t.locator(sel).first().innerText().catch(() => '');
  const co = async (t, sel) => (await t.locator(sel).count()) > 0;
  const doi = async (t, fn, ms = 6000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await fn()) return true; await t.waitForTimeout(40); } return false; };
  const doiChu = (t, sel, mau, ms) => doi(t, async () => mau.test(await chu(t, sel)), ms);
  const duongDan = (t) => new URL(t.url()).pathname + new URL(t.url()).search;
  const doiUrl = (t, mau) => doi(t, async () => mau.test(duongDan(t)));
  const chup = async (t, ten, cao) => {
    if (!anhDir) return;
    if (cao) await t.setViewportSize({ width: 390, height: cao });
    await t.waitForTimeout(250);
    await t.screenshot({ path: path.join(anhDir, ten + '.png') });
    if (cao) await t.setViewportSize({ width: 390, height: 844 });
  };
  const gomNd = async (t) => { for (const kh of await t.evaluate(() => [...document.querySelectorAll('[data-nd]')].map((e) => e.getAttribute('data-nd')))) if (!KHOA_ND.has(kh)) ndThieu.add(kh); };
  const tran = (t) => t.evaluate(() => [document.documentElement, ...document.querySelectorAll('.phone, .screen, .phone *')].some((e) => e.scrollWidth > e.clientWidth + 1 && getComputedStyle(e).overflowX !== 'hidden' && getComputedStyle(e).overflowX !== 'auto' && getComputedStyle(e).overflowX !== 'scroll' && e === document.documentElement));
  const goiDen = (S, d) => S.goi.filter((x) => x.duong === d);
  const nhapPin = async (t, so) => { for (const c of so) await t.locator('.pin-pad button', { hasText: new RegExp(`^${c}$`) }).click(); };
  const thes = (t) => t.evaluate(() => [...document.querySelectorAll('#doiqua .dq-the')].map((e) => ({ t: e.querySelector('.t')?.childNodes[0]?.textContent, m: e.querySelector('.m')?.textContent, pts: e.querySelector('.pts')?.textContent, nut: e.querySelector('.dq-doi')?.textContent, mo: e.classList.contains('mo'), chip: !!e.querySelector('.dq-chip'), img: e.querySelector('.ic img')?.getAttribute('src') || null, med: e.querySelector('.ic use')?.getAttribute('href') || null, tat: e.querySelector('.dq-doi')?.disabled })));

  const CA = [];
  const them = (ten, S0, f) => CA.push(() => may(ten, S0, f));

  them('B1 công tắc TẮT (mặc định)', { nd: null }, async (t, S) => {
    await mo(t, '/uudai'); await doiChu(t, '#rewards .wallet-row', /1\.250/);
    await t.waitForTimeout(300);
    k('B1 tắt: KHÔNG nút "Đổi quà", ô Điểm không lớp dq-o', !(await co(t, '#rewards .dq-nut')) && !(await co(t, '#rewards .dq-o')) && !/Đổi quà/.test(await chu(t, '#rewards .wallet-row')));
    await t.locator('#rewards .wallet-box').first().click();
    await t.waitForTimeout(300);
    k('B1 tắt: bấm ô Điểm không đi đâu', duongDan(t) === '/uudai', duongDan(t));
    for (const d of ['/uudai/doi-qua', '/uudai/qua', '/uudai/qua/PQ7K2QX9']) {
      await mo(t, d);
      k(`B1 tắt: mở thẳng ${d} → về /uudai`, await doiUrl(t, /^\/uudai$/), duongDan(t));
    }
    await t.waitForTimeout(300);
    k('B1 tắt: POS giả KHÔNG nhận /kho-qua, /qua-cua-toi, /doi-diem', goiDen(S, '/kho-qua').length === 0 && goiDen(S, '/qua-cua-toi').length === 0 && goiDen(S, '/doi-diem').length === 0, JSON.stringify(S.goi.map((x) => x.duong)));
  });

  them('B1–B2 BẬT: Ưu đãi + Kho quà', {}, async (t, S) => {
    await mo(t, '/uudai'); await t.waitForSelector('#rewards .dq-nut');
    k('B1 bật: nút nhỏ "Đổi quà ›" trong ô Điểm', /^Đổi quà ›$/.test((await chu(t, '#rewards .dq-nut')).trim()));
    k('B1 không nút lồng trong nút', (await t.evaluate(() => document.querySelectorAll('#rewards button button').length)) === 0);
    await chup(t, 'd1_uudai');
    await gomNd(t);
    await t.locator('#rewards .dq-o .n').first().click();
    k('B1 bấm cả ô Điểm → /uudai/doi-qua', await doiUrl(t, /^\/uudai\/doi-qua$/), duongDan(t));
    await t.goBack(); await t.waitForSelector('#rewards .dq-nut');
    await t.locator('#rewards .dq-nut').click();
    k('B1 bấm nút "Đổi quà ›" → /uudai/doi-qua', await doiUrl(t, /^\/uudai\/doi-qua$/), duongDan(t));
    await doi(t, async () => (await t.locator('#doiqua .dq-the').count()) === 6);
    await doiChu(t, '#doiqua .dq-hero', /1\.250 điểm/);
    k('B2 đầu màn "Đổi quà bằng điểm" + nút lùi', /Đổi quà bằng điểm/.test(await chu(t, '#doiqua .topbar h1')) && await co(t, '#doiqua .topbar .back-btn'));
    k('B2 khối điểm = points của /diem', /1\.250 điểm/.test(await chu(t, '#doiqua .dq-hero .amt')) && /Điểm của bạn/.test(await chu(t, '#doiqua .dq-hero .lbl')));
    await doiChu(t, '#doiqua .dq-cua', /2 chờ nhận/);
    k('B2 ô "Quà của tôi" + số phiếu chua_dung (2)', /Quà của tôi/.test(await chu(t, '#doiqua .dq-cua')) && /2 chờ nhận/.test(await chu(t, '#doiqua .dq-cua .so')));
    const nhac = await chu(t, '#doiqua .dq-nhac');
    k('B2 dải nhắc (câu 4a): tên phiếu nhac + hạn POS', /Tặng 1 ly Cà phê Muối/.test(nhac) && /28\/11\/2026/.test(nhac) && /nhớ ghé quầy/.test(nhac), nhac);
    const ds = await thes(t);
    k('B2 6 thẻ ĐÚNG thứ tự POS', bang(ds.map((x) => x.t), KHO.map((q) => q.ten)), JSON.stringify(ds.map((x) => x.t)));
    k('B2 mo_ta NGUYÊN chữ POS, số điểm', bang(ds.map((x) => x.m), KHO.map((q) => q.mo_ta)) && bang(ds.map((x) => x.pts), ['500 điểm', '800 điểm', '1.200 điểm', '300 điểm', '2.500 điểm', '3.000 điểm']), JSON.stringify(ds.map((x) => x.pts)));
    k('B2 nút: Đổi ngay ×3 · Hết lượt tháng này · Cần thêm 1.250 điểm · Tạm hết', bang(ds.map((x) => x.nut), ['Đổi ngay', 'Đổi ngay', 'Đổi ngay', 'Hết lượt tháng này', 'Cần thêm 1.250 điểm', 'Tạm hết']), JSON.stringify(ds.map((x) => x.nut)));
    k('B2 thẻ mờ: hết lượt + tạm hết; nút không bấm được ở 3 thẻ cuối', bang(ds.map((x) => x.mo), [false, false, false, true, false, true]) && bang(ds.map((x) => x.tat), [false, false, false, true, true, true]));
    k('B2 chip "Quà tại quầy" chỉ ở hien_vat', bang(ds.map((x) => x.chip), [false, false, true, false, true, true]) && /Quà tại quầy/.test(await chu(t, '#doiqua .dq-chip')));
    k('B2 ảnh: có `anh` POS → <img>; không → huy hiệu theo loai (voucher m-ticket, hiện vật m-gift)', ds[1].img === KHO[1].anh && ds[0].med === '#m-ticket' && ds[2].med === '#m-gift' && ds[0].img === null, JSON.stringify(ds.map((x) => x.img || x.med)));
    k('A1 GET /kho-qua có Authorization (token khách)', goiDen(S, '/kho-qua').length > 0 && goiDen(S, '/kho-qua').every((x) => /tok-A/.test(x.auth)));
    k('B2 ghi chú cuối màn', /Mô tả quà do quán soạn ở POS/.test(await chu(t, '#doiqua')));
    await chup(t, 'd2_kho', 1259);
    await gomNd(t);
    for (const w of [360, 390, 430]) {
      await t.setViewportSize({ width: w, height: 844 }); await t.waitForTimeout(150);
      k(`C1 Kho quà ${w}px không tràn ngang`, !(await tran(t)));
    }
    await t.setViewportSize({ width: 390, height: 844 });
    await t.locator('#doiqua .dq-the').nth(4).locator('.dq-doi').evaluate((e) => e.click()); // không bấm theo toạ độ (thẻ có thể nằm dưới thanh tab)
    await t.waitForTimeout(200);
    k('B3 thiếu điểm: bấm nút không mở bảng PIN', !(await co(t, '.pin-sheet')));
    await t.locator('#doiqua .dq-cua').click();
    k('B2 ô "Quà của tôi" → /uudai/qua', await doiUrl(t, /^\/uudai\/qua$/), duongDan(t));
  });

  them('A1 B3 B4 đổi voucher (mạng chập, gửi lại cùng khoá)', { kich: [{ mat: true }] }, async (t, S) => {
    await mo(t, '/uudai/doi-qua'); await doi(t, async () => (await t.locator('#doiqua .dq-the').count()) === 6);
    await doiChu(t, '#doiqua .dq-hero', /1\.250/);
    await t.locator('#doiqua .dq-the').nth(0).locator('.dq-doi').click();
    await t.waitForSelector('.pin-sheet');
    k('B3 bảng PIN: "Nhập PIN để đổi quà" + tên quà', /Nhập PIN để đổi quà/.test(await chu(t, '.pin-sheet h3')) && /Voucher giảm 20\.000đ/.test(await chu(t, '.pin-sheet .dq-xn .ten')));
    const tru = await chu(t, '.pin-sheet .dq-xn .tru');
    k('B3 "Trừ 500 điểm" · "Còn lại 750 điểm" (chỉ hiển thị)', /Trừ\s*500 điểm/.test(tru) && /Còn lại\s*750 điểm/.test(tru), tru);
    await nhapPin(t, '12');
    await chup(t, 'd3_pin');
    await nhapPin(t, '34');
    await t.locator('.pin-sheet .pin-ok').dblclick();
    k('B3 đang gửi: nút Xác nhận có vòng, không bấm được', await doi(t, async () => (await co(t, '.pin-sheet .pin-ok .cho-xoay')) && await t.locator('.pin-sheet .pin-ok').isDisabled(), 1500));
    await doiChu(t, '#doiqua', /Đã đổi quà!/, 9000);
    k('A1 đúng HAI POST /doi-diem (lần 1 mất mạng, lần 2 tự gửi lại) — bấm đúp không thêm', S.doi.length === 2, JSON.stringify(S.doi));
    k('A1 thân { ma_qua, khoa_gui, pin }: ma_qua 1, pin 1234, khoa_gui 16–64 ký tự', S.doi[0] && S.doi[0].ma_qua === 1 && S.doi[0].pin === '1234' && /^[A-Za-z0-9-]{16,64}$/.test(S.doi[0].khoa_gui) && bang(Object.keys(S.doi[0]).sort(), ['khoa_gui', 'ma_qua', 'pin']));
    k('A1 gửi lại CÙNG khoa_gui + thân', S.doi.length === 2 && bang(S.doi[0], S.doi[1]));
    k('B4 "Đã đổi quà!": điểm còn lại = diem_con POS (760, không tự tính 750)', /760 điểm/.test(await chu(t, '#doiqua .dq-hero .amt')) && !/750/.test(await chu(t, '#doiqua .dq-hero')));
    k('B4 câu "đã vào Ví voucher" + mã voucher_code', /đã vào Ví voucher/.test(await chu(t, '#doiqua .cm-dau p')) && /DD7K2Q/.test(await chu(t, '#doiqua .dq-ma')));
    k('B4 hai nút "Đặt món dùng ngay" + "Về kho quà"', /Đặt món dùng ngay/.test(await chu(t, '#doiqua .cm-nut')) && /Về kho quà/.test(await chu(t, '#doiqua .cm-gio')));
    const pinLo = await t.evaluate(() => JSON.stringify({ ...localStorage }) + JSON.stringify({ ...sessionStorage }));
    k('Cấm: PIN không nằm trong localStorage / sessionStorage', !/1234/.test(pinLo));
    await chup(t, 'd4_xong_vc');
    await gomNd(t);
    const sau = (d) => S.goi.some((x) => x.duong === d && x.luc > S.goi.findIndex((y) => y.duong === '/doi-diem'));
    k('A3 đổi xong → lấy lại /diem, /voucher, /qua-cua-toi', await doi(t, async () => sau('/diem') && sau('/voucher') && sau('/qua-cua-toi')));
    await t.locator('#doiqua .cm-gio').click();
    await doi(t, async () => (await t.locator('#doiqua .dq-the').count()) === 6);
    k('B4 "Về kho quà" → lại danh sách quà, điểm mới', await doiChu(t, '#doiqua .dq-hero', /750 điểm/));
    await mo(t, '/uudai'); await doiChu(t, '#rewards', /DD7K2Q/);
    k('A3 Ví voucher ở Ưu đãi thấy voucher mới (nguồn Đổi điểm)', /DD7K2Q/.test(await chu(t, '#rewards')) && /Đổi điểm/.test(await chu(t, '#rewards .vc-chip')));
  });

  them('B4 "Đặt món dùng ngay"', {}, async (t, S) => {
    await mo(t, '/uudai/doi-qua'); await doi(t, async () => (await t.locator('#doiqua .dq-the').count()) === 6);
    await doiChu(t, '#doiqua .dq-hero', /1\.250/);
    await t.locator('#doiqua .dq-the').nth(1).locator('.dq-doi').click();
    await nhapPin(t, '1234'); await t.locator('.pin-sheet .pin-ok').click();
    await doiChu(t, '#doiqua', /Đã đổi quà!/);
    k('A1 không lỗi mạng → đúng MỘT POST', S.doi.length === 1);
    await t.locator('#doiqua .cm-nut').click();
    k('B4 "Đặt món dùng ngay" → Menu', await doiUrl(t, /^\/menu$/), duongDan(t));
  });

  them('B3 B5 đổi hiện vật (PIN sai rồi đúng) → Phiếu quà', { chamQuaToi: 5000 }, async (t, S) => {
    await mo(t, '/uudai/doi-qua'); await doi(t, async () => (await t.locator('#doiqua .dq-the').count()) === 6);
    await doiChu(t, '#doiqua .dq-hero', /1\.250/);
    await t.locator('#doiqua .dq-the').nth(2).locator('.dq-doi').click();
    await nhapPin(t, '1111'); await t.locator('.pin-sheet .pin-ok').click();
    k('B3 PIN sai → hiện NGUYÊN lời POS, bảng còn mở để nhập lại', (await doiChu(t, '.pin-sheet .pin-msg', /^Mã PIN không đúng$/)) && await co(t, '.pin-sheet'));
    k('B3 sau PIN sai: các chấm về rỗng', (await t.locator('.pin-sheet .pin-dots i.on').count()) === 0);
    await nhapPin(t, '1234'); await t.locator('.pin-sheet .pin-ok').dblclick();
    k('B5 hiện vật xong → mở thẳng Phiếu quà /uudai/qua/PQNEW1', await doiUrl(t, /^\/uudai\/qua\/PQNEW1$/), duongDan(t));
    k('A1 PIN sai + PIN đúng (bấm đúp) = đúng HAI POST; lần 2 pin 1234, ma_qua 3', S.doi.length === 2 && S.doi[1].pin === '1234' && S.doi[1].ma_qua === 3, JSON.stringify(S.doi));
    k('B5 Phiếu quà hiện NGAY từ phiếu POS vừa trả (GET /qua-cua-toi chậm 5 giây)', await doi(t, async () => co(t, '#phieuqua .khung-qr svg path'), 2000));
    k('B5 Phiếu quà: tên, "Đổi 1.200 điểm · hạn nhận 11/12/2026", mã phiếu, QR vẽ từ `qr`',
      /Tặng 1 ly Cà phê Muối/.test(await chu(t, '#phieuqua .dq-ph-ten')) && /Đổi 1\.200 điểm · hạn nhận\s*11\/12\/2026/.test(await chu(t, '#phieuqua .dq-ph-phu')) && /Mã phiếu: PQNEW1/.test(await chu(t, '#phieuqua .dq-ph-ma')), await chu(t, '#phieuqua'));
    k('B5 câu "Đưa mã này cho nhân viên ở quầy…"', /Đưa mã này cho nhân viên ở quầy/.test(await chu(t, '#phieuqua')));
    await chup(t, 'd5_phieu_qr');
    await gomNd(t);
    for (const w of [360, 430]) { await t.setViewportSize({ width: w, height: 844 }); await t.waitForTimeout(150); k(`C1 Phiếu quà ${w}px không tràn ngang`, !(await tran(t))); }
  });

  them('B3 lỗi POS: THIEU_DIEM, QUA_HET, CHUA_CO_PIN', { kich: [{ st: 409, o: { error: 'Bạn chưa đủ điểm để đổi quà này', code: 'THIEU_DIEM' } }, { st: 409, o: { error: 'Quà này vừa hết', code: 'QUA_HET' } }, { st: 400, o: { error: 'Bạn chưa đặt mã PIN', code: 'CHUA_CO_PIN' } }] }, async (t, S) => {
    await mo(t, '/uudai/doi-qua'); await doi(t, async () => (await t.locator('#doiqua .dq-the').count()) === 6);
    await doiChu(t, '#doiqua .dq-hero', /1\.250/);
    await t.locator('#doiqua .dq-the').nth(0).locator('.dq-doi').click();
    await nhapPin(t, '1234'); await t.locator('.pin-sheet .pin-ok').click();
    k('B3 THIEU_DIEM → lời POS nguyên văn', await doiChu(t, '.pin-sheet .pin-msg', /^Bạn chưa đủ điểm để đổi quà này$/));
    await nhapPin(t, '1234'); await t.locator('.pin-sheet .pin-ok').click();
    k('B3 QUA_HET → lời POS nguyên văn', await doiChu(t, '.pin-sheet .pin-msg', /^Quà này vừa hết$/));
    k('A1 lỗi chắc chắn (4xx có mã) → lần bấm sau là khoá MỚI', S.doi.length === 2 && S.doi[0].khoa_gui !== S.doi[1].khoa_gui);
    await nhapPin(t, '1234'); await t.locator('.pin-sheet .pin-ok').click();
    k('B3 CHUA_CO_PIN → đóng bảng nhập, hiện lời POS + nút "Đặt mã PIN"', (await doi(t, async () => !(await co(t, '.pin-sheet')))) && /Bạn chưa đặt mã PIN/.test(await chu(t, '#doiqua')) && await co(t, '#doiqua .dq-dat-pin'));
    await t.locator('#doiqua .dq-dat-pin').click();
    k('B3 "Đặt mã PIN" → bảng đặt PIN mới (khuôn trả bằng ví)', await doiChu(t, '.pin-sheet h3', /Đặt mã PIN mới/));
  });

  them('B6 Quà của tôi', {}, async (t) => {
    await mo(t, '/uudai/qua'); await doi(t, async () => (await t.locator('#quatoi .dq-phieu').count()) === 4);
    k('B6 đầu màn "Quà của tôi"', /Quà của tôi/.test(await chu(t, '#quatoi .topbar h1')));
    const ds = await t.evaluate(() => [...document.querySelectorAll('#quatoi .dq-phieu')].map((e) => ({ t: e.querySelector('.t')?.textContent, d: e.querySelector('.d')?.textContent, nhac: !!e.querySelector('.d.nhac'), cu: e.classList.contains('cu'), tt: e.querySelector('.dq-tt')?.textContent })));
    const h2 = await t.evaluate(() => [...document.querySelectorAll('#quatoi .sec-head h2')].map((e) => e.textContent));
    k('B6 hai nhóm "Chờ nhận" / "Đã xong"', bang(h2, ['Chờ nhận', 'Đã xong']), JSON.stringify(h2));
    k('B6 Chờ nhận: phiếu nhac → chữ hồng "Sắp hết hạn · hạn 28/11/2026"; phiếu thường "Hạn 09/12/2026"', ds[0].nhac && /hạn 28\/11\/2026/.test(ds[0].d) && !ds[1].nhac && /^Hạn 09\/12\/2026$/.test(ds[1].d), JSON.stringify(ds.slice(0, 2)));
    k('B6 Đã xong: "Đã nhận 20/11/2026" · "Hết hạn 10/11/2026 · đã hoàn 1.200 điểm", thẻ mờ', /^Đã nhận 20\/11\/2026$/.test(ds[2].d) && /^Hết hạn 10\/11\/2026 · đã hoàn 1\.200 điểm$/.test(ds[3].d) && ds[2].cu && ds[3].cu && !ds[0].cu, JSON.stringify(ds.slice(2)));
    k('B6 nhãn: "Xem mã ›" · "Đã nhận" · "Hết hạn"', bang(ds.map((x) => x.tt), ['Xem mã ›', 'Xem mã ›', 'Đã nhận', 'Hết hạn']), JSON.stringify(ds.map((x) => x.tt)));
    await chup(t, 'd6_qua_toi');
    await gomNd(t);
    for (const w of [360, 430]) { await t.setViewportSize({ width: w, height: 844 }); await t.waitForTimeout(150); k(`C1 Quà của tôi ${w}px không tràn ngang`, !(await tran(t))); }
    await t.setViewportSize({ width: 390, height: 844 });
    await t.locator('#quatoi .dq-phieu').first().click();
    k('B6 bấm phiếu chờ nhận → Phiếu quà', await doiUrl(t, /^\/uudai\/qua\/PQ7K2QX9$/), duongDan(t));
    await t.waitForSelector('#phieuqua .khung-qr svg');
    await t.goBack();
    k('B6 Back → về Quà của tôi', await doiUrl(t, /^\/uudai\/qua$/));
    await mo(t, '/uudai/qua/PQ3TRA');
    k('B5 phiếu đã nhận: không vẽ QR, báo đã nhận', (await doiChu(t, '#phieuqua', /đã nhận/i)) && !(await co(t, '#phieuqua .khung-qr')));
  });

  them('B2 B6 rỗng + chữ sửa ở /admin', { kho: [], quaToi: [], nd: JSON.stringify({ so_ban: 8, gia_tri: { 'hien.dq': true, 'dq.kho.rong': 'Kho quà đang được chuẩn bị', 'dq.ud.nut': 'Lấy quà ›' } }) }, async (t) => {
    await mo(t, '/uudai'); await t.waitForSelector('#rewards .dq-nut');
    k('B8 chữ sửa ở /admin hiện đúng (nút Ưu đãi)', (await chu(t, '#rewards .dq-nut')).trim() === 'Lấy quà ›');
    await mo(t, '/uudai/doi-qua');
    k('B2 kho rỗng → câu danh mục (bản /admin đã sửa)', await doiChu(t, '#doiqua', /Kho quà đang được chuẩn bị/));
    k('B2 không phiếu → không dải nhắc, ô Quà của tôi không số', !(await co(t, '#doiqua .dq-nhac')) && !(await co(t, '#doiqua .dq-cua .so')));
    await mo(t, '/uudai/qua');
    k('B6 không phiếu → câu danh mục', await doiChu(t, '#quatoi', /chưa có phiếu quà/));
  });

  // Vòng sửa 1 (/ra-soat): "chưa rõ" phải giữ khoá qua lần bấm sau, qua cả khi rời màn, qua cả 4xx (PIN_SAI) đến sau — tới khi đổi xong.
  const BAN = { st: 503, o: { error: 'Máy chủ bận' } }; // 5xx không mã → "chưa rõ", guiDonAnToan tự gửi lại
  them('A1 chưa rõ → rời màn → bấm lại: CÙNG khoá tới khi xong', { kich: [BAN, BAN, BAN, BAN, { st: 400, o: { error: 'Mã PIN không đúng', code: 'PIN_SAI' } }] }, async (t, S) => {
    await mo(t, '/uudai/doi-qua'); await doi(t, async () => (await t.locator('#doiqua .dq-the').count()) === 6);
    await doiChu(t, '#doiqua .dq-hero', /1\.250/);
    await t.locator('#doiqua .dq-the').nth(0).locator('.dq-doi').click();
    await nhapPin(t, '1234'); await t.locator('.pin-sheet .pin-ok').click();
    k('A1 hết lượt tự gửi lại → lời "Chưa rõ … Nhập lại PIN", bảng còn mở', (await doiChu(t, '.pin-sheet .pin-msg', /^Chưa rõ quán đã ghi nhận/, 15000)) && /Nhập lại PIN/.test(await chu(t, '.pin-sheet .pin-msg')));
    const n0 = S.doi.length;
    k('A1 4 lần gửi (1 + 3 tự gửi lại) cùng khoá', n0 === 4 && S.doi.every((x) => x.khoa_gui === S.doi[0].khoa_gui), String(n0));
    const sauDoi = (d) => S.goi.some((x) => x.duong === d && x.luc > S.goi.map((y) => y.duong).lastIndexOf('/doi-diem'));
    k('A1 chưa rõ → lấy lại /diem và /qua-cua-toi', await doi(t, async () => sauDoi('/diem') && sauDoi('/qua-cua-toi')));
    await t.keyboard.press('Escape');
    await t.locator('#doiqua .topbar .back-btn').click();
    await doiUrl(t, /^\/uudai$/); await t.waitForSelector('#rewards .dq-nut'); await t.locator('#rewards .dq-nut').click();
    await doi(t, async () => (await t.locator('#doiqua .dq-the').count()) === 6);
    await t.locator('#doiqua .dq-the').nth(0).locator('.dq-doi').click();
    await nhapPin(t, '1234'); await t.locator('.pin-sheet .pin-ok').click();
    await doiChu(t, '.pin-sheet .pin-msg', /^Mã PIN không đúng$/);
    k('A1 rời màn rồi vào lại → lần bấm sau dùng LẠI khoá cũ (POS trả PIN_SAI)', S.doi.length === 5 && S.doi[4].khoa_gui === S.doi[0].khoa_gui && S.doi[4].ma_qua === 1, JSON.stringify(S.doi.map((x) => x.khoa_gui.slice(0, 8))));
    await nhapPin(t, '1234'); await t.locator('.pin-sheet .pin-ok').click();
    await doiChu(t, '#doiqua', /Đã đổi quà!/, 8000);
    k('A1 4xx đến SAU lần chưa rõ không xoá khoá → lần đổi xong vẫn CÙNG khoá', S.doi.length === 6 && S.doi[5].khoa_gui === S.doi[0].khoa_gui, JSON.stringify(S.doi.map((x) => x.khoa_gui.slice(0, 8))));
    await t.locator('#doiqua .cm-gio').click(); await doi(t, async () => (await t.locator('#doiqua .dq-the').count()) === 6);
    await t.locator('#doiqua .dq-the').nth(1).locator('.dq-doi').click();
    await nhapPin(t, '1234'); await t.locator('.pin-sheet .pin-ok').click();
    await doiChu(t, '#doiqua', /Đã đổi quà!/);
    k('A1 đổi xong → lần đổi sau là khoá MỚI', S.doi.length === 7 && S.doi[6].khoa_gui !== S.doi[0].khoa_gui);
  });

  // Vòng sửa 2 (/ra-soat): chặn gửi song song ở cấp mô-đun — rời màn khi đang gửi rồi bấm lại → không POST khoá mới, không kéo khách sang Phiếu quà.
  them('A1 rời màn KHI ĐANG GỬI rồi bấm lại: không gửi song song, không khoá mới', { kich: [{ cham: 6000 }] }, async (t, S) => {
    await mo(t, '/uudai'); await t.waitForSelector('#rewards .dq-nut'); await t.locator('#rewards .dq-nut').click();
    await doi(t, async () => (await t.locator('#doiqua .dq-the').count()) === 6); await doiChu(t, '#doiqua .dq-hero', /1\.250/);
    await t.locator('#doiqua .dq-the').nth(2).locator('.dq-doi').click();
    await nhapPin(t, '1234'); await t.locator('.pin-sheet .pin-ok').click();
    await doi(t, async () => S.doi.length === 1);
    await t.goBack();
    k('A1 Back khi đang gửi → về /uudai', await doiUrl(t, /^\/uudai$/), duongDan(t));
    await t.waitForSelector('#rewards .dq-nut'); await t.locator('#rewards .dq-nut').click();
    await doi(t, async () => (await t.locator('#doiqua .dq-the').count()) === 6);
    await t.locator('#doiqua .dq-the').nth(2).locator('.dq-doi').click();
    await nhapPin(t, '1234'); await t.locator('.pin-sheet .pin-ok').click();
    k('A1 bấm lại khi lần trước còn đang gửi → lời "còn đang gửi", KHÔNG POST thứ hai', (await doiChu(t, '.pin-sheet .pin-msg', /còn đang gửi/)) && S.doi.length === 1, String(S.doi.length));
    await t.waitForTimeout(6500);
    k('A1 lần gửi cũ xong SAU khi đã rời màn → không kéo khách sang Phiếu quà', duongDan(t) === '/uudai/doi-qua', duongDan(t));
    await nhapPin(t, '1234'); await t.locator('.pin-sheet .pin-ok').click();
    await doiUrl(t, /^\/uudai\/qua\//);
    k('A1 lần đổi xong rồi → bấm lại là lần đổi MỚI (khoá mới), tổng 2 POST', S.doi.length === 2 && S.doi[1].khoa_gui !== S.doi[0].khoa_gui, JSON.stringify(S.doi.map((x) => x.khoa_gui.slice(0, 8))));
  });

  them('A1 chưa rõ quà A rồi đổi quà B → bấm lại A vẫn khoá cũ', { kich: [{ st: 503, o: { error: 'Máy chủ bận' } }, { st: 503, o: { error: 'Máy chủ bận' } }, { st: 503, o: { error: 'Máy chủ bận' } }, { st: 503, o: { error: 'Máy chủ bận' } }, { st: 503, o: { error: 'Máy chủ bận' } }, { st: 503, o: { error: 'Máy chủ bận' } }, { st: 503, o: { error: 'Máy chủ bận' } }, { st: 503, o: { error: 'Máy chủ bận' } }] }, async (t, S) => {
    await mo(t, '/uudai/doi-qua'); await doi(t, async () => (await t.locator('#doiqua .dq-the').count()) === 6); await doiChu(t, '#doiqua .dq-hero', /1\.250/);
    for (const n of [0, 1]) {
      await t.locator('#doiqua .dq-the').nth(n).locator('.dq-doi').click();
      await nhapPin(t, '1234'); await t.locator('.pin-sheet .pin-ok').click();
      await doiChu(t, '.pin-sheet .pin-msg', /^Chưa rõ/, 15000);
      await t.keyboard.press('Escape');
    }
    await t.locator('#doiqua .dq-the').nth(0).locator('.dq-doi').click();
    await nhapPin(t, '1234'); await t.locator('.pin-sheet .pin-ok').click();
    await doiChu(t, '#doiqua', /Đã đổi quà!/, 8000);
    const a = S.doi.filter((x) => x.ma_qua === 1), b = S.doi.filter((x) => x.ma_qua === 2);
    k('A1 quà A (4 lần) và quà B (4 lần) khoá riêng; lần bấm lại A dùng ĐÚNG khoá A', a.length === 5 && b.length === 4 && a.every((x) => x.khoa_gui === a[0].khoa_gui) && a[0].khoa_gui !== b[0].khoa_gui, JSON.stringify(S.doi.map((x) => `${x.ma_qua}:${x.khoa_gui.slice(0, 6)}`)));
  });

  // Vòng sửa 3 (/ra-soat): luật sống / xoá của khoá "chưa rõ" đi qua ĐƯỜNG THẬT — 401 ở cửa thật (donPhien), đăng nhập lại bằng màn Đăng nhập, nút Đăng xuất ở
  // Tài khoản, khách KHÁC đăng nhập cùng tab (không tải lại trang: khoá sống ở cấp mô-đun). Điều hướng TRONG App (pushState + popstate), không t.goto.
  const diTrong = (t, d) => t.evaluate((x) => { history.pushState(null, '', x); dispatchEvent(new PopStateEvent('popstate')); }, d);
  const dangNhapUi = async (t, sdt) => {
    await t.waitForSelector('#sdt'); await t.fill('#sdt', sdt); await t.getByRole('button', { name: 'Tiếp tục' }).click();
    await t.waitForSelector('#ma'); await t.fill('#ma', '123456'); await t.getByRole('button', { name: 'Xác nhận' }).click();
    await t.waitForFunction(() => !!localStorage.getItem('kh_token'));
  };
  const vaoKho = async (t) => { await diTrong(t, '/uudai/doi-qua'); await doi(t, async () => (await t.locator('#doiqua .dq-the').count()) === 6, 8000); await doiChu(t, '#doiqua .dq-hero', /điểm/); await t.waitForTimeout(400); /* GET /toi (khách đang giữ phiên) về */ };
  const doiQua = async (t, n) => { await t.locator('#doiqua .dq-the').nth(n).locator('.dq-doi').click(); await nhapPin(t, '1234'); await t.locator('.pin-sheet .pin-ok').click(); };
  const BAN8 = Array.from({ length: 8 }, () => ({ st: 503, o: { error: 'Máy chủ bận' } }));
  const vet = (S) => JSON.stringify(S.doi.map((x, i) => `${String(S.doiAi[i]).slice(-3)}:${x.khoa_gui.slice(0, 6)}`));
  them('A1 đường thật: 401 → đăng nhập lại CÙNG khách giữ khoá; Đăng xuất → khách B KHÔNG dùng khoá A', { kich: BAN8 }, async (t, S) => {
    await mo(t, '/uudai'); await t.waitForSelector('#rewards .dq-nut');
    await vaoKho(t); await doiQua(t, 0);
    await doiChu(t, '.pin-sheet .pin-msg', /^Chưa rõ/, 15000); await t.keyboard.press('Escape');
    const KA = S.doi[0].khoa_gui;
    S.diem401 = true; await diTrong(t, '/uudai'); await diTrong(t, '/uudai/doi-qua'); // Kho quà gọi MỚI /diem → 401 thật → donPhien
    k('A1 (đường thật) /diem 401 → mất phiên, về Trang chủ', await doi(t, async () => !(await t.evaluate(() => localStorage.getItem('kh_token'))) && duongDan(t) === '/trangchu', 8000), duongDan(t));
    await diTrong(t, '/dangnhap?tiep=%2Fuudai'); await dangNhapUi(t, SDT_A); await doiUrl(t, /^\/uudai$/);
    await vaoKho(t); await doiQua(t, 0);
    await doiChu(t, '.pin-sheet .pin-msg', /^Chưa rõ/, 15000); await t.keyboard.press('Escape');
    k('A1 (đường thật) 401 rồi đăng nhập lại CÙNG khách → lần bấm sau dùng LẠI khoá A', S.doi.length === 8 && S.doi.slice(4).every((x) => x.khoa_gui === KA), vet(S));
    await diTrong(t, '/taikhoan'); await t.getByText('Đăng xuất').click();
    await doi(t, async () => !(await t.evaluate(() => localStorage.getItem('kh_token'))));
    await diTrong(t, '/dangnhap?tiep=%2Fuudai'); await dangNhapUi(t, SDT_B); await doiUrl(t, /^\/uudai$/);
    await vaoKho(t); await doiQua(t, 0);
    await doiChu(t, '#doiqua', /Đã đổi quà!/, 8000);
    k('A1 (đường thật) Đăng xuất → khách B đổi CÙNG quà → khoá MỚI bằng phiên B; KHÔNG lần nào gửi khoá A bằng phiên B',
      S.doi.length === 9 && S.doi[8].khoa_gui !== KA && S.doiAi[8] === SDT_B && S.doi.every((x, i) => x.khoa_gui !== KA || S.doiAi[i] === SDT_A), vet(S));
  });

  them('A1 đường thật: kho máy chặn ghi chủ máy + hết phiên + khách B đăng nhập → không dùng khoá A', { kich: BAN8.slice(0, 4), chan: true }, async (t, S) => {
    await mo(t, '/uudai'); await t.waitForSelector('#rewards .dq-nut');
    await vaoKho(t); await doiQua(t, 0);
    await doiChu(t, '.pin-sheet .pin-msg', /^Chưa rõ/, 15000); await t.keyboard.press('Escape');
    const KA = S.doi[0].khoa_gui;
    S.diem401 = true; await diTrong(t, '/uudai'); await diTrong(t, '/uudai/doi-qua');
    await doi(t, async () => duongDan(t) === '/trangchu', 8000);
    await diTrong(t, '/dangnhap?tiep=%2Fuudai'); await dangNhapUi(t, SDT_B); await doiUrl(t, /^\/uudai$/);
    await vaoKho(t); await doiQua(t, 0);
    await doiChu(t, '#doiqua', /Đã đổi quà!/, 8000);
    k('A1 (đường thật, kho máy chặn kh_chu) hết phiên → B đăng nhập → khoá MỚI bằng phiên B', S.doi.length === 5 && S.doi[4].khoa_gui !== KA && S.doiAi[4] === SDT_B, vet(S));
  });

  // Giữa hai lần TỰ GỬI LẠI (guiDonAnToan đọc phiên mới mỗi lần) A đăng xuất, B đăng nhập → lần gửi lại kế tiếp KHÔNG được đi bằng phiên B.
  them('A1 đường thật: đổi phiên giữa các lần tự gửi lại → không gửi thân của A bằng phiên B', { kich: [{ st: 503, o: { error: 'Máy chủ bận' } }, { cham: 5000, st: 503, o: { error: 'Máy chủ bận' } }, { st: 503, o: { error: 'Máy chủ bận' } }, { st: 503, o: { error: 'Máy chủ bận' } }] }, async (t, S) => {
    await mo(t, '/uudai'); await t.waitForSelector('#rewards .dq-nut');
    await vaoKho(t); await doiQua(t, 0);
    await doi(t, async () => S.doi.length === 2, 6000); // lần 2 (tự gửi lại) đang chờ POS 5 giây
    await t.goBack(); await doiUrl(t, /^\/uudai$/);
    await diTrong(t, '/taikhoan'); await t.getByText('Đăng xuất').click();
    await doi(t, async () => !(await t.evaluate(() => localStorage.getItem('kh_token'))));
    await diTrong(t, '/dangnhap?tiep=%2Fuudai'); await dangNhapUi(t, SDT_B); await doiUrl(t, /^\/uudai$/);
    await t.waitForTimeout(9000); // lần 2 trả 503 → chờ 2 giây → lần 3 (nếu App còn gửi) đi bằng phiên B
    k('A1 không lần gửi nào của A đi bằng phiên B (dừng ở lần 2)', S.doiAi.every((x) => x === SDT_A) && S.doi.length === 2, vet(S));
  });

  // GET /qua-cua-toi của B hỏng: kho chỉ còn thứ App tự ghi vào → phiếu của A (nếu App gộp nhầm) lộ ra, không bị GET của B che.
  them('A1 đường thật: Đăng xuất KHI ĐANG GỬI → khách B không thấy phiếu / QR của A', { kich: [{ cham: 5000 }], loiQuaToiB: true }, async (t, S) => {
    await mo(t, '/uudai'); await t.waitForSelector('#rewards .dq-nut');
    await vaoKho(t); await doiQua(t, 2);
    await doi(t, async () => S.doi.length === 1);
    await t.goBack(); await doiUrl(t, /^\/uudai$/);
    await diTrong(t, '/taikhoan'); await t.getByText('Đăng xuất').click();
    await doi(t, async () => !(await t.evaluate(() => localStorage.getItem('kh_token'))));
    await diTrong(t, '/dangnhap?tiep=%2Fuudai'); await dangNhapUi(t, SDT_B); await doiUrl(t, /^\/uudai$/);
    await t.waitForTimeout(5500); // lần gửi của A xong (POS giả chậm 5 giây) khi B đang giữ phiên
    k('A1 lần gửi của A xong khi B giữ phiên → không kéo B sang Phiếu quà', duongDan(t) === '/uudai', duongDan(t));
    await diTrong(t, '/uudai/qua');
    await t.waitForTimeout(800);
    k('A1 B mở Quà của tôi → KHÔNG có phiếu / QR của A (GET của B lỗi → chỉ báo lỗi)', !/Tặng 1 ly|PQNEW1/.test(await chu(t, '#quatoi')) && !(await co(t, '#quatoi .dq-phieu')), await chu(t, '#quatoi'));
    await diTrong(t, '/uudai/qua/PQNEW1'); await t.waitForTimeout(800);
    k('A1 B mở thẳng Phiếu quà của A → không QR, không mã của A', !(await co(t, '#phieuqua .khung-qr')) && !/PQNEW1/.test(await chu(t, '#phieuqua .dq-ph-ma')));
  });

  them('B2 dải nhắc theo `nhac` POS, không theo thứ tự', { quaToi: [QUA_TOI[1], QUA_TOI[0]] }, async (t) => {
    await mo(t, '/uudai/doi-qua'); await doiChu(t, '#doiqua .dq-cua', /2 chờ nhận/);
    const nhac = await chu(t, '#doiqua .dq-nhac');
    k('B2 phiếu đầu KHÔNG nhắc, phiếu sau nhắc → dải nhắc nói phiếu có nhac (Cà phê Muối), không nói Túi tote', /Tặng 1 ly Cà phê Muối/.test(nhac) && !/Túi tote/.test(nhac), nhac);
  });

  them('A1 /kho-qua 401 không đẩy ra đăng nhập', { kho401: true }, async (t) => {
    await mo(t, '/uudai/doi-qua'); await t.waitForTimeout(1200);
    k('A1 /kho-qua 401 → vẫn ở /uudai/doi-qua, token còn, màn báo lỗi + Thử lại', duongDan(t) === '/uudai/doi-qua' && (await t.evaluate(() => localStorage.getItem('kh_token'))) === 'tok-A' && await co(t, '#doiqua .nt-state'), duongDan(t));
  });

  for (const ca of CA) await ca();
  k('B8 mọi data-nd trên các màn mới có trong danh mục', ndThieu.size === 0, [...ndThieu].join(', '));
  await trinh.close();
}
