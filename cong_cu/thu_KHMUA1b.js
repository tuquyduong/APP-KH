#!/usr/bin/env node
// THỬ KH-MUA-1b — đặt đơn online theo hợp đồng v5: nối cửa thật, luật 4xx / "chưa rõ", gửi lại CÙNG khoá + CÙNG thân, chống đơn thứ hai, ví + QR,
// Theo dõi đơn đọc QR từ GET /don/:ma, thêm món quay lại trang trước. POS giả dựng TỪ hợp đồng v5 (mã lỗi đọc thẳng từ thiet_ke/HOP_DONG_API_KH.md).
// Phần 1: hàm thuần + đọc nguồn · Phần 2: App thật trong Chromium (song song, đồng hồ giả để bỏ qua các lần chờ).
// Chạy: node cong_cu/thu_KHMUA1b.js → dòng cuối "n đạt · m hỏng". KHONG_TRINH_DUYET=1 hoặc không có Playwright → phần 2 BỎ QUA (không tính hỏng).
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
const doc = (f) => (f.startsWith('src/') ? boChuThich(docTho(f)) : docTho(f));
const nap = (f) => import(pathToFileURL(path.join(GOC, f)).href);
const thu = async (ten, f) => { try { await f(); } catch (e) { k(`${ten} dừng giữa chừng`, false, String(e && e.message).split('\n')[0]); } };
const khoGia = () => { const m = new Map(); return { m, getItem: (x) => (m.has(x) ? m.get(x) : null), setItem: (x, v) => m.set(x, String(v)), removeItem: (x) => m.delete(x) }; };
const khoChan = { getItem() { throw new Error('chặn'); }, setItem() { throw new Error('chặn'); }, removeItem() { throw new Error('chặn'); } };
const loi = (status, code, them = {}) => Object.assign(new Error(code || 'lỗi'), { status, code, duLieu: { code, ...them } });

const HD = docTho('thiet_ke/HOP_DONG_API_KH.md');
// Mã lỗi đặt đơn + mã HTTP lấy từ dòng "Đặt đơn (v5): `MA` 400 · …" của hợp đồng — POS giả và bảng luật cùng dựa vào đây.
const MA_DAT_DON = (() => { const m = /Đặt đơn \(v5\):([\s\S]*?)\n[^`\n]*Trong `ma_giam_loi/.exec(HD); return m ? [...m[1].matchAll(/`([A-Z_]+)` (\d{3})/g)].map((x) => ({ code: x[1], st: Number(x[2]) })) : []; })();
const MENU_DS = [
  { ma: 'TLB', ten: 'Trà Lục Bảo', nhom: 'Trà Đông Y', gia: 30000, con_hang: true, ton_cu: false, ton_luc: null, gia_hang: [{ hang_id: 2, gia: 27000 }] },
  { ma: 'CFM', ten: 'Cà phê Muối', nhom: 'Cà phê', gia: 39000, con_hang: null, ton_cu: false, ton_luc: null, gia_hang: [] },
];
const BG = { dong: [{ ma: 'TLB', so_luong: 2, don_gia: 30000, thanh_tien: 60000 }, { ma: 'CFM', so_luong: 1, don_gia: 39000, thanh_tien: 39000 }], tam_tinh: 99000, giam: [{ loai: 'hang', so_tien: 11346 }], phi_giao: 0, tong: 87654, ma_giam_loi: null };
const GIO = [{ ma: 'TLB', so_luong: 2, ghi_chu: 'ít ngọt' }, { ma: 'CFM', so_luong: 1, ghi_chu: '' }];

if (require.main === module) (async () => {
  console.log('Phần 1 — hàm thuần, đọc nguồn');
  k('KH-TT-1 B1 màn Thanh toán không còn dòng "Chuyển khoản QR" / chữ "Xác nhận trả"; ba chữ nút theo cách trả', !/Chuyển khoản QR|Xác nhận trả/.test((doc('src/pages/ThanhToan.jsx') + doc('src/noiDung/nd/donHang.js'))) && /Thanh toán qua QR/.test((doc('src/pages/ThanhToan.jsx') + doc('src/noiDung/nd/donHang.js'))) && /\+ QR/.test((doc('src/pages/ThanhToan.jsx') + doc('src/noiDung/nd/donHang.js'))));
  k('ND3e KH-TT-1 B1 ba chữ nút theo cách trả nằm ở danh mục nội dung, màn ThanhToan.jsx không còn viết thẳng', /Thanh toán qua QR \{tong\}/.test(doc('src/noiDung/nd/donHang.js')) && !/Thanh toán qua QR/.test(doc('src/pages/ThanhToan.jsx')));
  k('KH-BAO-1 C2 công tắc ví mở theo máy nhớ (kh_dung_vi): tab sau thấy ví đã bật sẵn, nên ca hai tab không bấm tắt đi', /useState\(docDungVi\)/.test(doc('src/pages/ThanhToan.jsx')) && /ghiDungVi\(bat\)/.test(doc('src/pages/ThanhToan.jsx')));
  let D = null;
  try { D = await nap('src/datDon.js'); } catch (e) { k('nạp src/datDon.js', false, String(e.message).split('\n')[0]); }

  await thu('A', async () => {
    // Hợp đồng trong kho = bản chép MỚI NHẤT ở viec/*/hop_dong_v<N>.md (v5 của việc này, sau đó v9 của KH-MUA-1c…), từng byte — cùng luật thu_KHUI3b A1.
    const banHd = fs.readdirSync(path.join(GOC, 'viec')).flatMap((v) => { try { return fs.readdirSync(path.join(GOC, 'viec', v)).filter((x) => /^hop_dong_v\d+\.md$/.test(x)).map((x) => ({ f: path.join(GOC, 'viec', v, x), n: Number(/\d+/.exec(x)[0]) })); } catch { return []; } }).sort((x, y) => y.n - x.n)[0];
    k('A1 thiet_ke/HOP_DONG_API_KH.md = bản hop_dong_v<N>.md mới nhất trong viec/ (v5 trở lên), từng byte', !!banHd && banHd.n >= 5 && fs.readFileSync(path.join(GOC, 'thiet_ke/HOP_DONG_API_KH.md')).equals(fs.readFileSync(banHd.f)), banHd && banHd.f);
    k('A1 bảng mã lỗi đặt đơn đọc từ hợp đồng (≥ 20 mã, có DANG_XU_LY 503, GIA_DA_DOI 409)', MA_DAT_DON.length >= 20 && MA_DAT_DON.some((x) => x.code === 'DANG_XU_LY' && x.st === 503) && MA_DAT_DON.some((x) => x.code === 'GIA_DA_DOI' && x.st === 409), String(MA_DAT_DON.length));
    const { CAN_TU_POS } = await nap('src/kiemKhop/canTuPos.js');
    const m = (ma) => CAN_TU_POS.find((x) => x.ma === ma) || {};
    k('A2 ba cửa đặt đơn co:true (bao_gia, dat_don, huy_don)', ['bao_gia', 'dat_don', 'huy_don'].every((x) => m(x).co === true));
    const conMoi = CAN_TU_POS.filter((x) => x.moi && /^GET \/(don|menu)\b/.test(x.cua) && !['HD-KH-1', 'SOHD-1'].includes(x.viec_pos)).map((x) => x.ma);
    k('A2 mục của /don, /don/:ma, /menu không còn moi (v4, v5 đã có; trừ trường v7 HD-KH-1 của KH-MUA-1c và v11 SOHD-1 của KH-SOHD-1)', conMoi.length === 0, conMoi.join(','));
    const api = doc('src/api.js');
    k('A3/B1 api.js có ba cửa đặt đơn viết thẳng qua goi', /goi\('POST', '\/gio\/bao-gia'/.test(api) && /goi\('POST', '\/don'/.test(api) && /goi\('POST', `\/don\/\$\{[^}]+\}\/huy`/.test(api));
  });

  await thu('B', async () => {
    const dd = doc('src/datDon.js');
    k('B2 datDon.js không còn cổng tiêm (datCongDatDon), không fetch; gọi cửa từ api.js', !/datCongDatDon|\bfetch\s*\(/.test(dd) && /from '\.\/api\.js'/.test(dd));
    k('B2 bỏ danh sách cứng LOI_CHUA_TAO / chuaTaoDon', !/LOI_CHUA_TAO|chuaTaoDon/.test(dd + doc('src/pages/ThanhToan.jsx')));
    const CD = await nap('src/noiDung/caiDat.js');
    k('B3 DAT_ONLINE = true', CD.DAT_ONLINE === true);
  });

  await thu('C', async () => {
    const tb = D.thanBaoGia(GIO, { maGiam: ' GIAM10 ', cachNhan: 'giao', diaChi: '12 Lê Lợi' });
    k('C1 thân báo giá: mon[] { ma, so_luong, ghi_chu? }, ma_giam, cach_nhan luôn tai_quan, không giao / dia_chi',
      JSON.stringify(tb) === JSON.stringify({ mon: [{ ma: 'TLB', so_luong: 2, ghi_chu: 'ít ngọt' }, { ma: 'CFM', so_luong: 1 }], ma_giam: 'GIAM10', cach_nhan: 'tai_quan' }), JSON.stringify(tb));
    const q = D.thanDatDon(GIO, {}, { cachTra: 'qr', pin: '1357', khoaGui: 'k'.repeat(20), tongDaXem: 87654 });
    const v = D.thanDatDon(GIO, {}, { cachTra: 'vi', pin: '1357', khoaGui: 'k'.repeat(20), tongDaXem: 87654 });
    const vq = D.thanDatDon(GIO, {}, { cachTra: 'vi_qr', pin: '1357', khoaGui: 'k'.repeat(20), tongDaXem: 87654 });
    k('C2 thân đặt = thân báo giá + cach_tra + khoa_gui + tong_da_xem; pin CHỈ khi vi / vi_qr',
      q.cach_tra === 'qr' && !('pin' in q) && v.cach_tra === 'vi' && v.pin === '1357' && vq.cach_tra === 'vi_qr' && vq.pin === '1357' && q.khoa_gui === 'k'.repeat(20) && q.tong_da_xem === 87654 && q.cach_nhan === 'tai_quan', JSON.stringify(vq));
    k('C2 không gửi số tiền nào khác (gia, don_gia, thanh_tien, tam_tinh, tong…)', !/"(gia|don_gia|thanh_tien|tam_tinh|phi_giao|tong|giu_vi|con_lai)"/.test(JSON.stringify([q, v, vq])));
    const kh = [...Array(100)].map(() => D.taoKhoaGui());
    k('C3 khoá gửi đúng dạng 16–64 ký tự A-Z a-z 0-9 -, 100 lần không trùng', kh.every((x) => /^[A-Za-z0-9-]{16,64}$/.test(x)) && new Set(kh).size === 100, kh[0]);
    const kh2 = D.taoKhoaGui({ getRandomValues: (a) => { for (let i = 0; i < a.length; i++) a[i] = (i * 37 + 11) & 255; return a; } });
    k('C3 máy không có randomUUID → chuỗi từ getRandomValues, đúng dạng', /^[A-Za-z0-9-]{16,64}$/.test(kh2), kh2);
    const d = D.docDatDon({ success: true, ma_don: 'TQD42', tong: 87654, giu_vi: 50000, con_lai: 37654, tien_trinh: 'cho_tra', qr: { chuoi: '0002', het_han: '2026-10-30T20:40:00' }, trung: true });
    k('C4 đọc POST /don: ma_don, tong, giu_vi, con_lai, tien_trinh, qr, trung', !!d && d.ma === 'TQD42' && d.tong === 87654 && d.giuVi === 50000 && d.conLai === 37654 && d.tienTrinh === 'cho_tra' && d.qr.chuoi === '0002' && d.qr.hetHan === '2026-10-30T20:40:00' && d.trung === true, JSON.stringify(d));
    k('C4 thiếu ma_don → null ("chưa rõ")', D.docDatDon({ success: true, tong: 1 }) === null && D.docDatDon(null) === null);
    const dn = D.docDon({ don: { ma: 'TQD42', ngay: '2026-10-30T20:31:00', tong: 87654, da_tra: 0, trang_thai: null, thanh_toan: null, tien_trinh: 'cho_tra', qr: { chuoi: 'Q', het_han: '2026-10-30T20:40:00' }, tien_ve_cho_doi_soat: true, mon: [] } });
    k('C5 (v11) đọc GET /don/:ma: so_hd → soHd (thiếu → null), mã App `ma` giữ nguyên', !!dn && dn.soHd === null && dn.ma === 'TQD42' && D.docDon({ don: { ma: 'A7', so_hd: 'APP0016' } }).soHd === 'APP0016');
    k('C5 đọc GET /don/:ma: qr, thanh_toan, tien_ve_cho_doi_soat, tien_trinh',!!dn && dn.qr && dn.qr.chuoi === 'Q' && dn.tienVeChoDoiSoat === true && dn.thanhToan === null && dn.tienTrinh === 'cho_tra', JSON.stringify(dn));
    const b = D.docBaoGia({ ...BG, ma_giam_loi: { code: 'MA_KHONG_TON_TAI', error: 'Mã không tồn tại' } });
    k('C6 báo giá giữ giam[].loai và ma_giam_loi { code, error }', !!b && b.giam[0].loai === 'hang' && b.maGiamLoi && b.maGiamLoi.error === 'Mã không tồn tại' && D.docBaoGia(BG).maGiamLoi === null);
    k('C6 tên dòng giảm theo demo: voucher / hạng / Giờ vàng / loại lạ', D.tenGiam('ma_giam') === 'Giảm giá (voucher)' && D.tenGiam('hang', 'Vàng') === 'Ưu đãi hạng Vàng' && D.tenGiam('gio_vang') === 'Giờ vàng' && D.tenGiam('khac') === 'Giảm giá');
  });

  await thu('D', async () => {
    const sai = MA_DAT_DON.filter((x) => x.st < 500 && x.st !== 401 && !['KHO_BAN', 'KHOA_GUI_DA_DUNG'].includes(x.code)).filter((x) => D.loaiLoi(loi(x.st, x.code)) !== 'chua_tao').map((x) => x.code);
    k('D1 MỌI 4xx có code của hợp đồng (trừ 401, KHO_BAN, KHOA_GUI_DA_DUNG — v9, KH-MUA-1c) → chắc chưa tạo', sai.length === 0 && MA_DAT_DON.length > 10, sai.join(','));
    k('D1 (v9, KH-MUA-1c) 409 KHO_BAN và KHOA_GUI_DA_DUNG KHÔNG phải "chắc chưa tạo" (đơn có thể đã tạo)', ['KHO_BAN', 'KHOA_GUI_DA_DUNG'].every((c) => D.loaiLoi(loi(409, c)) !== 'chua_tao'));
    // S1 (vòng 4): 401 do lớp xác thực POS trả TRƯỚC khi tra khoá gửi → không chứng minh lần trước chưa tạo đơn
    k('S1 401 KH_TOKEN_SAI → chưa rõ, dừng không tự gửi lại ("dung", KH-MUA-1c; không phải "chắc chưa tạo")', D.loaiLoi(loi(401, 'KH_TOKEN_SAI')) === 'dung');
    const sai5 = MA_DAT_DON.filter((x) => x.st >= 500).filter((x) => D.loaiLoi(loi(x.st, x.code)) !== 'khong_biet').map((x) => x.code);
    k('D2 5xx của hợp đồng (DANG_XU_LY, PAYOS_*…), LOI_MAY_CHU 500, mất mạng (status 0), 4xx không code, 200 lạ → chưa rõ',
      sai5.length === 0 && ['LOI_MAY_CHU', 'MANG_LOI'].every((c, i) => D.loaiLoi(loi([500, 0][i], c)) === 'khong_biet') && D.loaiLoi({ status: 409 }) === 'khong_biet' && D.loaiLoi({ status: 200 }) === 'khong_biet' && D.loaiLoi(null) === 'khong_biet', sai5.join(','));
    // vòng gửi lại: `gui` giả theo kịch bản, `cho` giả (ghi số ms, không chờ thật)
    const chay = async (kich) => {
      const goi = [], cho = [];
      let gl = 0;
      const than = { khoa_gui: 'K'.repeat(20), mon: [], pin: '1357' };
      let kq = null, nem = null;
      try { kq = await D.guiDonAnToan(than, { gui: (t) => { goi.push(t); const x = kich[Math.min(goi.length - 1, kich.length - 1)]; return x instanceof Error ? Promise.reject(x) : Promise.resolve(x); }, cho: (ms) => { cho.push(ms); return Promise.resolve(); }, khiGuiLai: () => { gl++; } }); } catch (e) { nem = e; }
      return { goi, cho, kq, nem, gl, than };
    };
    const OK = { success: true, ma_don: 'TQD42', tong: 1, giu_vi: 0, con_lai: 1, tien_trinh: 'cho_tra', qr: null, trung: false };
    const a = await chay([loi(502, 'PAYOS_LOI'), loi(500, 'LOI_MAY_CHU'), OK]);
    k('D2 5xx, 5xx rồi đơn → 3 lần gửi, CÙNG một thân (===, cùng khoá, cùng PIN), chờ ~2 giây mỗi lần, báo "đang gửi lại"', a.kq && a.kq.ma === 'TQD42' && a.goi.length === 3 && a.goi.every((t) => t === a.than) && a.cho.every((ms) => ms >= 1500 && ms <= 3000) && a.gl === 2, `${a.goi.length} ${a.cho} ${a.gl}`);
    const b = await chay([loi(0, 'MANG_LOI')]);
    k('D2 mất mạng mãi → 1 + 3 lần gửi rồi ném KHONG_BIET', b.goi.length === 4 && b.nem && b.nem.code === 'KHONG_BIET', `${b.goi.length} ${b.nem && b.nem.code}`);
    const c = await chay([...Array(10)].map(() => loi(503, 'DANG_XU_LY')).concat([OK]));
    k('D2 DANG_XU_LY 10 lần rồi xong → vẫn chờ (không dừng ở 3), nhận đơn', c.kq && c.goi.length === 11, String(c.goi.length));
    const c2 = await chay([loi(503, 'DANG_XU_LY')]);
    const tong = c2.cho.reduce((s, x) => s + x, 0);
    k('D2 DANG_XU_LY mãi → dừng sau khoảng 1 phút (55–65 giây chờ), ném KHONG_BIET', c2.nem && c2.nem.code === 'KHONG_BIET' && tong >= 55000 && tong <= 65000, `${tong} ms / ${c2.goi.length} lần`);
    const d = await chay([loi(400, 'PIN_SAI')]);
    k('D1 4xx → gửi đúng 1 lần, ném nguyên lỗi POS (không gửi lại)', d.goi.length === 1 && d.nem && d.nem.code === 'PIN_SAI');
    const e = await chay([{ success: true, tong: 1 }, OK]);
    k('D2 200 thiếu ma_don → gửi lại cùng thân, nhận đơn', e.kq && e.goi.length === 2 && e.goi[1] === e.than);
    const s1a = await chay([loi(0, 'MANG_LOI'), loi(401, 'KH_TOKEN_SAI'), OK]);
    k('S1 mất mạng rồi 401 khi tự gửi lại → dừng ngay (2 lần gửi, không gửi tiếp), ném KHONG_BIET', s1a.goi.length === 2 && s1a.nem && s1a.nem.code === 'KHONG_BIET', `${s1a.goi.length} ${s1a.nem && s1a.nem.code}`);
    const s1b = await chay([loi(401, 'KH_TOKEN_SAI'), OK]);
    k('S1 401 ngay lần gửi đầu → 1 lần gửi, ném KHONG_BIET (bản ghi giữ)', s1b.goi.length === 1 && s1b.nem && s1b.nem.code === 'KHONG_BIET', `${s1b.goi.length} ${s1b.nem && s1b.nem.code}`);
    const f = await chay([{ ...OK, trung: true }]);
    k('D2 trung:true → coi như thành công (1 lần gửi)', f.kq && f.kq.trung === true && f.goi.length === 1);
    // ghi nhớ lần gửi
    const kho = khoGia();
    const than = D.thanDatDon(GIO, {}, { cachTra: 'vi', pin: '1357', khoaGui: 'K'.repeat(20), tongDaXem: 87654 });
    const bg = D.banGhiGui(than, 1000);
    k('D3/D4 bản ghi lần gửi: khoá + thân + cách trả, KHÔNG có PIN', bg.khoa_gui === 'K'.repeat(20) && bg.cach_tra === 'vi' && bg.than.tong_da_xem === 87654 && !/1357|"pin"/.test(JSON.stringify(bg)), JSON.stringify(bg));
    k('D4 bản ghi không làm mất PIN của thân đang gửi', than.pin === '1357');
    k('D3 ghi / đọc kh_don_gui', D.ghiGuiDo(bg, kho) === true && kho.m.has('kh_don_gui') && D.docGuiDo(kho, 2000).khoa_gui === 'K'.repeat(20) && D.docGuiDo(kho, 2000).quaHan === false);
    k('D3 quá 24 giờ → quaHan', D.docGuiDo(kho, 1000 + 24 * 3600 * 1000 + 1).quaHan === true);
    k('D3 ghi null = xoá', D.ghiGuiDo(null, kho) === true && D.docGuiDo(kho, 2000) === null);
    kho.setItem('kh_don_gui', '{hỏng');
    k('D3 bản ghi hỏng → null, không ném; kho chặn → null / false', D.docGuiDo(kho, 1) === null && D.docGuiDo(khoChan, 1) === null && D.ghiGuiDo(bg, khoChan) === false);
    k('D3 kho chặn: bản ghi vẫn giữ trong bộ nhớ trang (chưa rõ vẫn chặn đặt), không báo đã lưu', (D.docGuiDo(khoChan, 2000) || {}).khoa_gui === 'K'.repeat(20) && D.ghiGuiDo(null, khoChan) === false && D.docGuiDo(khoChan, 2000) === null);
    const khoDay = { ...khoGia(), setItem() { throw new Error('đầy kho'); } }; // đọc được, ghi hỏng (đầy kho)
    D.ghiGuiDo(null, khoGia()); khoDay.m.set('kh_don_gui', JSON.stringify({ ...bg, khoa_gui: 'CU'.repeat(10), ma_don: 'TQD1' }));
    k('D3 kho đọc được mà GHI hỏng (đầy kho) → docGuiDo trả bản ghi mới trong bộ nhớ trang, không bản cũ trên kho', D.ghiGuiDo(bg, khoDay) === false && (D.docGuiDo(khoDay, 2000) || {}).khoa_gui === 'K'.repeat(20));
    D.ghiGuiDo(null, khoGia());
    const L = await nap('src/luuMay.js');
    D.ghiGuiDo(bg, khoChan);
    L.doiKhach('0911222333', khoChan);
    k('D3 kho chặn + đăng nhập mà không biết chủ cũ (doiKhach) → quên bản ghi trong bộ nhớ trang (không lọt sang khách khác)', D.docGuiDo(khoChan, 2000) === null);
    const kL = khoGia(); kL.setItem('kh_don_gui', JSON.stringify(bg));
    L.xoaTatCa(kL);
    k('D3 kh_don_gui nằm trong danh sách khoá của luuMay.js (đăng xuất xoá)', !kL.m.has('kh_don_gui'));
    const nguon = ['src/datDon.js', 'src/pages/ThanhToan.jsx', 'src/pages/TheoDoiDon.jsx', 'src/components/PinSheet.jsx', 'src/App.jsx'].map(doc).join('\n');
    k('D4 nguồn không ghi PIN vào localStorage / sessionStorage / console', !/(localStorage|sessionStorage|console\.)[^\n]*\bpin\b/i.test(nguon));
  });

  await thu('E', async () => {
    const x = (t, s) => JSON.stringify(D.cachTraDuoc(t, s));
    k('E1 ví đủ → vi; 0 < dư < tổng → vi_qr; dư 0 / thiếu số → chỉ QR', x(87654, 100000) === '{"vi":true,"viQr":false}' && x(87654, 50000) === '{"vi":false,"viQr":true}' && x(87654, 0) === '{"vi":false,"viQr":false}' && x(null, 5) === '{"vi":false,"viQr":false}' && x(5, undefined) === '{"vi":false,"viQr":false}');
    const man = ['src/pages/ThanhToan.jsx', 'src/pages/TheoDoiDon.jsx', 'src/pages/GioHang.jsx', 'src/datDon.js'].map(doc).join('\n');
    k('E2 không còn chữ "payOS" / tên nhà cung cấp trên màn', !/payos|sepay/i.test(man));
  });

  await thu('F-G', async () => {
    k('F6 thẻ đơn cho_tra / da_tra / dang_lam → Theo dõi đơn; xong / da_huy / bill quầy → Chi tiết đơn', ['cho_tra', 'da_tra', 'dang_lam'].every(D.moTheoDoi) && !['xong', 'da_huy', null, undefined, ''].some(D.moTheoDoi));
    const app = doc('src/App.jsx');
    const dong = (/const themVaoGio = [^\n]*/.exec(app) || [''])[0];
    k('G1 thêm món: thông báo "Đã thêm …" rồi quay lại (luiVe), KHÔNG vào giỏ', /nd\('app\.daThem'/.test(dong) && /'app\.daThem', '[^']*', 'Đã thêm \{ten\} vào giỏ'/.test(fs.readFileSync(path.join(GOC, 'src/noiDung/nd/taiKhoan.js'), 'utf8')) && /luiVe\(\)/.test(dong) && !/vaoGio|giohang/.test(dong), dong);
    k('G2 "Đặt lại" vẫn vào giỏ (vaoGio)', /const datLai = [\s\S]*?vaoGio\(/.test(app));
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

module.exports = { dungMay, MA_DAT_DON, BG, GIO };

// Máy giả dùng chung (thu_KHMUA1c.js dùng lại): App thật dựng bằng esbuild + POS giả theo hợp đồng. `k` = hàm ghi ca của bài gọi.
async function dungMay(pw, k) {
  const esbuild = require('esbuild');
  const dung = async (lienHe, tatCo = false) => (await esbuild.build({
    stdin: { contents: `import './main.jsx';`, resolveDir: path.join(GOC, 'src'), loader: 'jsx' },
    bundle: true, write: false, format: 'iife', jsx: 'automatic', logLevel: 'silent',
    loader: { '.css': 'empty', '.json': 'json' }, define: { 'process.env.NODE_ENV': '"production"', 'import.meta.env.VITE_POS_API': '""' },
    plugins: lienHe ? [{ name: 'lien-he', setup(b) { b.onLoad({ filter: /lienHe\.js$/ }, () => ({ contents: `export const LIEN_HE = { dienThoai: '0900111222', zalo: '', email: '' }; export const coLienHe = () => true;`, loader: 'js' })); } }] : tatCo ? [{ name: 'tat-co', setup(b) { b.onLoad({ filter: /caiDat\.js$/ }, () => ({ contents: 'export const DAT_ONLINE = false;', loader: 'js' })); } }] : [],
  })).outputFiles[0].text;
  const goiApp = await dung(false), goiLienHe = await dung(true);
  let goiTatCo = null; // bản dựng ép DAT_ONLINE = false (KH-BAO-1 C3), dựng khi ca cần
  const layTatCo = async () => goiTatCo || (goiTatCo = await dung(false, true));
  const cssTron = (f) => doc(f).replace(/@import\s+'\.\/([^']+)';/g, (_, t) => cssTron(path.posix.join(path.posix.dirname(f), t)));
  const css = [...doc('src/main.jsx').matchAll(/import '\.\/(giaoDien\/[^']+\.css)'/g)].map((m) => cssTron('src/' + m[1])).join('\n');
  const trinh = await pw.chromium.launch({ args: ['--no-sandbox'] });
  const URL0 = 'http://kh.test';
  const HTML = doc('index.html').replace(/<script type="module"[^>]*><\/script>/, '<script src="/bundle.js"></script>').replace('</head>', `<style>${css}</style></head>`);
  const BAY = (g) => `2026-10-30T${g}`;
  const PIN = '1357';
  const anhDir = process.env.LUU_ANH_DIR || '';
  const MA_LOI = Object.fromEntries(MA_DAT_DON.map((x) => [x.code, x.st]));
  const loiPos = (code, them = {}) => ({ st: MA_LOI[code] || 400, o: { error: `Lời POS giả: ${code}`, code, ...them } });

  // Một ngữ cảnh = một máy. S = trạng thái POS giả (dùng chung mọi tab của máy đó).
  async function may(ten, { rong = 390, dn = true, gio = GIO, lienHe = false, chanKho = false, tatCo = false, S0 = {} } = {}, chay) {
    const goiCa = tatCo ? await layTatCo() : lienHe ? goiLienHe : goiApp;
    const ctx = await trinh.newContext({ viewport: { width: rong, height: 844 }, timezoneId: 'Asia/Ho_Chi_Minh' });
    // chanKho: localStorage từ chối riêng khoá kh_don_gui (như cửa sổ riêng tư / chặn dữ liệu)
    if (chanKho) await ctx.addInitScript(() => { for (const m of ['getItem', 'setItem', 'removeItem']) { const g = Storage.prototype[m]; Storage.prototype[m] = function (k, ...a) { if (k === 'kh_don_gui') throw new Error('chặn'); return g.call(this, k, ...a); }; } });
    await ctx.clock.install({ time: new Date('2026-10-30T20:30:00+07:00') }); await ctx.clock.resume();
    await ctx.addInitScript(({ dn, gio }) => {
      if (sessionStorage.getItem('da_gieo')) return;
      sessionStorage.setItem('da_gieo', '1');
      localStorage.setItem('kh_ngay_man_dau', '2026-10-30');
      if (dn) localStorage.setItem('kh_token', 'tok-A');
      if (gio && !localStorage.getItem('kh_gio')) localStorage.setItem('kh_gio', JSON.stringify(gio));
    }, { dn, gio });
    const S = { vi: 0, bg: BG, kich: [], guiDon: [], datPin: [], goi: [], don: new Map(), khoa: new Map(), donCu: [], soDon: 41, treBg: 0, treDon: 0, treDsDon: 0, ...S0 };
    const loiTrang = [];
    const v7 = (d) => (d.v7 !== undefined ? d.v7 : d.cach ? { cach_tra: d.cach, giu_vi: d.giu, con_lai: d.tong - d.giu } : { cach_tra: null, giu_vi: null, con_lai: null });
    const dongDon = (d) => ({ ...(S.v7 ? v7(d) : {}), ...(d.soHd !== undefined ? { so_hd: d.soHd } : {}), ...(d.tienVeDa ? { tien_ve_da_cong_vi: d.tienVeDa, thong_bao_tien_ve: d.thongBao } : {}), ma: d.ma, ngay: BAY('20:31:00'), tong: d.tong, da_tra: d.tt === 'cho_tra' || (d.tt === 'da_huy' && !d.daTra) ? 0 : d.tong, trang_thai: d.trangThai || null, thanh_toan: d.thanhToan || null, tien_trinh: d.tt, qr: d.tt === 'cho_tra' ? d.qr : null, tien_ve_cho_doi_soat: !!d.tienVe });
    const dinhDanh = (t) => JSON.stringify([t.mon, t.ma_giam || '', t.cach_nhan, t.cach_tra]);
    function datDon(t) {
      if (!/^[A-Za-z0-9-]{16,64}$/.test(t.khoa_gui || '')) return loiPos('KHOA_GUI_SAI');
      if (!Number.isInteger(t.tong_da_xem) || t.tong_da_xem < 0) return loiPos('YEU_CAU_KHONG_HOP_LE');
      const cu = S.khoa.get(t.khoa_gui);
      if (cu) return cu.dd === dinhDanh(t) ? { st: 200, o: { ...cu.tra, trung: true } } : loiPos('KHOA_GUI_DA_DUNG');
      const tong = S.bg.tong;
      if (t.tong_da_xem !== tong) { const { success, ...bao } = S.bgDoi || S.bg; return loiPos('GIA_DA_DOI', { bao_gia: bao }); }
      if (t.cach_tra !== 'qr') {
        if (S.chuaCoPin) return loiPos('CHUA_CO_PIN');
        if (S.pinKhoa) return loiPos('PIN_DANG_KHOA');
        if (t.pin !== PIN) return loiPos('PIN_SAI');
      }
      if (t.cach_tra === 'vi' && S.vi < tong) return loiPos('VI_KHONG_DU');
      if (t.cach_tra === 'vi_qr' && S.vi >= tong) return loiPos('CACH_KHONG_KHOP');
      const ma = 'TQD' + ++S.soDon;
      const giu = t.cach_tra === 'vi' ? tong : t.cach_tra === 'vi_qr' ? S.vi : 0;
      const tt = t.cach_tra === 'vi' ? 'da_tra' : 'cho_tra';
      const qr = tt === 'cho_tra' ? { chuoi: '00020101021238570010A0000007270127' + ma, het_han: BAY('20:40:00') } : null;
      S.vi -= giu;
      S.don.set(ma, { ma, tong, tt, qr, giu, cach: t.cach_tra, mon: t.mon, soHd: S.soHdDat });
      const tra = { success: true, ma_don: ma, ...(S.soHdDat !== undefined ? { so_hd: S.soHdDat } : {}), tong, giu_vi: giu, con_lai: tong - giu, tien_trinh: tt, qr, trung: false };
      S.khoa.set(t.khoa_gui, { dd: dinhDanh(t), tra });
      return { st: 200, o: tra };
    }
    await ctx.route(`${URL0}/**`, async (r) => {
      const req = r.request(), u = new URL(req.url()), p = u.pathname, pt = req.method();
      const json = (status, o) => r.fulfill({ status, contentType: 'application/json', body: JSON.stringify(o) }).catch(() => {});
      if (p === '/bundle.js') return r.fulfill({ contentType: 'text/javascript', body: goiCa });
      if (!p.startsWith('/api/kh')) return /\.[a-z0-9]+$/.test(p) ? r.fulfill({ status: 204, body: '' }) : r.fulfill({ contentType: 'text/html', body: HTML });
      const duong = p.slice('/api/kh'.length);
      const tho = req.postData();
      let than = null; try { than = JSON.parse(tho); } catch { /* không thân */ }
      S.goi.push({ pt, duong, luc: Date.now() });
      if (duong === '/don' && pt === 'POST') S.guiDon.push(tho);
      if (duong === '/gio-vang') return json(200, { success: true, dang_chay: false, bat_dau: null, ket_thuc: null, phan_tram: 0, mon: [] });
      if (duong === '/hang') return json(200, { success: true, data: [{ id: 2, ten: 'Vàng', phan_tram: 10, phan_tram_nhom_dac_biet: 5, gia_the: 199000, thu_tu: 1 }] });
      if (duong === '/gio-hoat-dong') return json(200, { success: true, bay_gio: BAY('20:30:00'), dang_mo: true, nhan_don: true, hom_nay: { mo: '08:00', dong: '22:00' }, mo_lai_luc: null, thong_bao: '', lich_tuan: [], ngay_nghi: [] });
      if (duong === '/menu') return json(200, { success: true, data: MENU_DS });
      if (!/tok-A/.test(req.headers().authorization || '') || (S.chetDon && duong === '/don' && pt === 'POST')) return json(401, { error: 'Phiên đăng nhập đã hết', code: 'KH_TOKEN_SAI' });
      if (duong === '/toi') return json(200, { success: true, khach: { sdt: S.sdt || '0909123456', ten: 'Linh', ngay_tao: BAY('08:00:00'), xung_ho: 'chi', dia_chi: null, qr: 'QR', hang: { id: 2, ten: 'Vàng', phan_tram: 10, phan_tram_nhom_dac_biet: 5, het_han: '2026-11-15T23:59:59' }, so_du_vi: S.vi } });
      if (duong === '/diem') return json(200, { success: true, points: 0, history: [] });
      if (duong === '/voucher') return json(200, { success: true, data: [], ma_khach_moi: [] });
      if (duong === '/pin' && pt === 'PUT') { S.datPin.push(than); return json(200, { success: true }); }
      if (duong === '/gia-han') return json(200, { success: true, token: 'tok-A', het_han: '2026-11-29T08:00:00' });
      if (duong === '/gio/bao-gia') {
        if (S.treBg) await new Promise((x) => setTimeout(x, S.treBg));
        if (than.ma_giam === 'SAI') return json(200, { success: true, ...S.bg, ma_giam_loi: { code: 'MA_KHONG_TON_TAI', error: 'Mã giảm giá không tồn tại' } });
        if (than.ma_giam === 'GIAM10') return json(200, { success: true, ...S.bg, giam: [{ loai: 'ma_giam', so_tien: 5000 }, { loai: 'hang', so_tien: 4000 }, { loai: 'gio_vang', so_tien: 3000 }, { loai: 'moi_la', so_tien: 2000 }], tong: 85000 });
        return json(200, { success: true, ...S.bg });
      }
      if (duong === '/don' && pt === 'POST') {
        if (S.treDon) await new Promise((x) => setTimeout(x, S.treDon));
        const x = S.kich.shift();
        if (x === 'abort') return r.abort('internetdisconnected');
        if (x === 'treo') return undefined; // không trả lời: App phải tự hết giờ chờ
        if (x === 'tao+khoban') { datDon(than); return json(409, { error: 'Kho đang bận, mời bạn thử lại', code: 'KHO_BAN' }); }
        if (x === 'tao+502') { datDon(than); return r.fulfill({ status: 502, contentType: 'text/html', body: '<html>Bad gateway</html>' }); }
        if (x) return json(x.st, x.o);
        const kq = datDon(than);
        return json(kq.st, kq.o);
      }
      const huy = /^\/don\/([^/]+)\/huy$/.exec(duong);
      if (huy && pt === 'POST') {
        const d = S.don.get(decodeURIComponent(huy[1]));
        if (!d) return json(404, { error: 'Không thấy đơn', code: 'KHONG_THAY_DON' });
        if (d.tt === 'cho_tra') { d.tt = 'da_huy'; S.vi += d.giu; return json(200, { success: true, ma_don: d.ma, tien_trinh: 'da_huy' }); }
        if (d.tt === 'da_huy') return json(200, { success: true, ma_don: d.ma, tien_trinh: 'da_huy' });
        return json(400, { error: 'Đơn đã trả tiền, mời bạn gọi quán để huỷ', code: 'DA_TRA_GOI_QUAN' });
      }
      if (duong.startsWith('/don/') && pt === 'GET') {
        const ma = decodeURIComponent(duong.slice(5));
        const d = S.don.get(ma) || S.donCu.find((x) => x.ma === ma);
        if (!d) return json(404, { error: 'Không thấy đơn', code: 'KHONG_THAY_DON' });
        return json(200, { success: true, don: { ...dongDon(d), mon: [{ ma: 'TLB', ten: 'Trà Lục Bảo', so_luong: 2, don_gia: 30000, thanh_tien: 60000, ghi_chu: 'ít ngọt' }] } });
      }
      if (duong === '/don' && pt === 'GET') {
        if (S.treDsDon) await new Promise((x) => setTimeout(x, S.treDsDon));
        if (S.dsDonLoi) return r.abort('internetdisconnected');
        return json(200, { success: true, trang: 1, con_nua: false, data: [...S.don.values()].reverse().concat(S.donCu).map(dongDon) });
      }
      return json(500, { error: 'chưa giả', code: 'LOI_MAY_CHU' });
    });
    const trang = async () => { const t = await ctx.newPage(); t.on('pageerror', (e) => loiTrang.push(e.message)); t.setDefaultTimeout(6000); return t; };
    const t = await trang();
    try { await chay({ t, S, ctx, trang }); } catch (e) { k(`ca ${ten} dừng giữa chừng`, false, String(e && e.message).split('\n')[0]); }
    // D4 sau MỌI ca: không chuỗi PIN ở kho trình duyệt (mọi tab của máy)
    let coPin = false;
    for (const tb of ctx.pages()) coPin = coPin || await tb.evaluate((pin) => { const s = JSON.stringify({ ...localStorage }) + JSON.stringify({ ...sessionStorage }); return s.includes(`\\"${pin}\\"`) || s.includes('\\"pin\\"'); }, PIN).catch(() => false); // giá trị trong JSON lồng: \"1357\" / \"pin\" (chuỗi số trần có thể trùng khoá ngẫu nhiên)
    k(`D4 [${ten}] không có PIN trong localStorage / sessionStorage`, !coPin);
    k(`[${ten}] trang không báo lỗi JS`, loiTrang.length === 0, loiTrang[0]);
    await ctx.close();
  }

  const mo = async (t, duong) => { await t.goto(URL0 + duong); await t.waitForSelector('.phone'); };
  const chu = (t, sel) => t.locator(sel).first().innerText().catch(() => '');
  const doi = async (t, fn, ms = 6000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await fn()) return true; await t.waitForTimeout(40); } return false; };
  const doiChu = (t, sel, mau, ms) => doi(t, async () => mau.test(await chu(t, sel)), ms);
  const nut = (t) => t.locator('#checkout .nut-dat').first();
  const nutKhoa = async (t) => (await nut(t).getAttribute('aria-disabled').catch(() => null)) === 'true';
  const sanSang = (t) => doi(t, async () => !(await nutKhoa(t)) && /^(Thanh toán qua QR|Trừ ví) /.test(await nut(t).innerText().catch(() => '')));
  const bam = async (t) => { await nut(t).click(); };
  const nhapPin = async (t, pin) => { for (const c of pin) await t.locator('.pin-pad button', { hasText: new RegExp(`^${c}$`) }).click(); await t.locator('.pin-pad button', { hasText: 'Xác nhận' }).click(); };
  const batVi = (t) => t.locator('#checkout .switch').first().click();
  const dongVi = (t) => chu(t, '#checkout .the-vi .s');
  const luu = (t) => t.evaluate(() => localStorage.getItem('kh_don_gui'));
  const tranNgang = (t) => t.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  const chup = async (t, ten) => { if (anhDir) await t.screenshot({ path: path.join(anhDir, ten + '.png') }); };
  const giongNhau = (a) => a.length > 1 && a.every((x) => x === a[0]);
  const khoa = (tho) => { try { return JSON.parse(tho).khoa_gui; } catch { return ''; } };

  return { trinh, may, mo, chu, doi, doiChu, nut, nutKhoa, sanSang, bam, nhapPin, batVi, dongVi, luu, tranNgang, chup, giongNhau, khoa, loiPos, BAY, PIN };
}

async function trinhDuyet(pw) {
  const { trinh, may, mo, chu, doi, doiChu, nut, nutKhoa, sanSang, bam, nhapPin, batVi, dongVi, luu, tranNgang, chup, giongNhau, khoa, loiPos, BAY, PIN } = await dungMay(pw, k);
  const CA = [];
  const them = (ten, opt, f) => CA.push(() => may(ten, opt, f));

  for (const rong of [360, 390, 430]) {
    them(`qr-${rong}`, { rong }, async ({ t, S }) => {
      await mo(t, '/thanhtoan');
      k(`E2/K5 [${rong}] màn không ghi "payOS" (dòng "Chuyển khoản QR" đã bỏ — KH-TT-1)`, !/Chuyển khoản QR/.test(await chu(t, '#checkout')) && !/payOS/i.test(await chu(t, '#checkout')));
      await doi(t, async () => !/Đang cập nhật số dư/.test(await chu(t, '#checkout')));
      k(`Đ7 [${rong}] ví 0đ → ẩn công tắc "Trừ từ số dư ví"`, (await t.locator('#checkout .switch').count()) === 0 && !/Trừ từ số dư ví/.test(await chu(t, '#checkout')));
      k(`K5 [${rong}] đơn QR thường: nút "Thanh toán qua QR 87.654đ" bật`, await sanSang(t));
      await chup(t, `thanhtoan-${rong}`);
      k(`[${rong}] Thanh toán không tràn ngang`, !(await tranNgang(t)));
      const truoc = S.goi.length;
      await bam(t);
      k(`C2 [${rong}] đặt QR → Theo dõi /don/TQD42, vẽ QR, "87.654đ", đếm ngược`, await doi(t, async () => /\/don\/TQD42$/.test(t.url()) && (await t.locator('.the-qr svg').count()) > 0 && /87\.654đ/.test(await chu(t, '.qr-chu')) && /còn 9:/.test(await chu(t, '.qr-chu'))), t.url());
      const than = JSON.parse(S.guiDon[0] || '{}');
      k(`C2 [${rong}] thân POST /don: khoa_gui đúng dạng, tong_da_xem = tổng đang hiện, cach_tra qr, không pin / giao / tiền`, S.guiDon.length === 1 && /^[A-Za-z0-9-]{16,64}$/.test(than.khoa_gui) && than.tong_da_xem === 87654 && than.cach_tra === 'qr' && than.cach_nhan === 'tai_quan' && !('pin' in than) && !('dia_chi' in than) && !('tong' in than), S.guiDon[0]);
      await chup(t, `theodoi-qr-${rong}`);
      k(`[${rong}] Theo dõi đơn không tràn ngang`, !(await tranNgang(t)));
      if (rong !== 390) return;
      await t.waitForTimeout(800);
      const sau = S.goi.slice(truoc).map((g) => `${g.pt} ${g.duong}`);
      k('F5 đặt xong làm mới /toi, /don, /diem', ['GET /toi', 'GET /don', 'GET /diem'].every((x) => sau.includes(x)), sau.join(','));
      await t.reload(); await t.waitForSelector('.phone');
      k('F1 tải lại /don/TQD42 vẫn thấy QR (từ GET /don/:ma) + số tiền + đếm ngược', await doi(t, async () => (await t.locator('.the-qr svg').count()) > 0 && /87\.654đ/.test(await chu(t, '.qr-chu')) && /còn \d:/.test(await chu(t, '.qr-chu'))));
      S.don.get('TQD42').tt = 'da_tra';
      k('F đơn chuyển da_tra (hỏi lại 3 giây) → số đơn để đọc cho nhân viên', await doiChu(t, '#tracking', /Số đơn của bạn/, 7000));
      k('F đã trả → giỏ dọn (cả sau khi tải lại); bản ghi lần gửi GIỮ, đánh dấu xong (tab khác còn thấy "vừa đặt")', await doi(t, async () => (await t.locator('.tab .tab-so').count()) === 0 && (JSON.parse((await luu(t)) || '{}').xong === true)));
    });
  }

  them('vi', { S0: { vi: 100000 } }, async ({ t, S }) => {
    await mo(t, '/thanhtoan'); await sanSang(t);
    await doiChu(t, '#checkout', /Số dư 100\.000đ/);
    k('Đ7 công tắc tắt mặc định → QR cả đơn, dòng phụ "Số dư 100.000đ"', !(await t.locator('#checkout .switch.on').count()) && /^Số dư 100\.000đ$/.test((await dongVi(t)).trim()));
    await batVi(t);
    k('Đ7 bật + số dư ≥ tổng → trả ví: "Số dư 100.000đ — đủ trả cả đơn", ẩn dòng QR', /Số dư 100\.000đ — đủ trả cả đơn/.test(await dongVi(t)) && !/Chuyển khoản QR/.test(await chu(t, '#checkout')));
    await chup(t, 'thanhtoan-vi-du-390');
    await bam(t);
    await t.waitForSelector('.pin-pad');
    await chup(t, 'thanhtoan-pin-390');
    await nhapPin(t, '1111');
    k('D1 PIN sai → bảng PIN hiện lời POS, nhập lại', await doiChu(t, '.pin-msg', /PIN_SAI/));
    await nhapPin(t, PIN);
    k('K5 ví đủ + PIN → đơn đã trả, số đơn để đọc', await doi(t, async () => /\/don\/TQD42$/.test(t.url()) && /Số đơn của bạn/.test(await chu(t, '#tracking'))), t.url());
    const ds = S.guiDon.map((x) => JSON.parse(x));
    k('C3 lần nhập PIN sau (sau 4xx) dùng khoá MỚI; pin chỉ ở thân gửi', ds.length === 2 && ds[0].khoa_gui !== ds[1].khoa_gui && ds[1].pin === PIN && ds[1].cach_tra === 'vi');
  });

  for (const rong of [360, 390, 430]) {
    them(`vi_qr-${rong}`, { rong, S0: { vi: 50000 } }, async ({ t }) => {
      await mo(t, '/thanhtoan'); await sanSang(t);
      await doiChu(t, '#checkout', /Số dư 50\.000đ/);
      await batVi(t);
      k(`Đ7/E1 [${rong}] bật + 0 < số dư < tổng → ví + QR: "Dùng hết 50.000đ trong ví, còn thiếu 37.654đ → quét QR"`, /Dùng hết 50\.000đ trong ví, còn thiếu 37\.654đ → quét QR/.test(await dongVi(t)) && /Trừ ví 50\.000đ \+ QR 37\.654đ/.test(await chu(t, '#checkout .nut-dat')));
      await chup(t, `thanhtoan-vi-qr-${rong}`);
      await bam(t);
      await t.waitForSelector('.pin-pad'); await nhapPin(t, PIN);
      k(`F2 [${rong}] vi_qr: "Đã giữ 50.000đ trong ví · quét QR 37.654đ"`, await doiChu(t, '#tracking', /Đã giữ 50\.000đ trong ví · quét QR 37\.654đ/));
      await chup(t, `theodoi-viqr-${rong}`);
      k(`[${rong}] Theo dõi vi_qr không tràn ngang`, !(await tranNgang(t)));
      if (rong !== 390) return;
      await t.reload(); await t.waitForSelector('.phone');
      k('Q1 tải lại trên CÙNG máy vẫn hiện dòng "Đã giữ … · quét QR …"', await doiChu(t, '#tracking', /Đã giữ 50\.000đ trong ví · quét QR 37\.654đ/));
      await t.evaluate(() => localStorage.removeItem('kh_don_gui')); await t.reload(); await t.waitForSelector('.phone');
      await doi(t, async () => (await t.locator('.the-qr svg').count()) > 0);
      const c = await chu(t, '#tracking');
      k('Q1 máy khác (không bản ghi): vẫn QR, ẩn dòng giữ ví và số tiền cạnh QR (không hiện tổng sai)', (await t.locator('.the-qr svg').count()) > 0 && !/Đã giữ/.test(c) && !/87\.654đ/.test(await chu(t, '.qr-chu')), c);
    });
  }

  them('tao-roi-502', { S0: { kich: ['tao+502'] } }, async ({ t, S }) => {
    await mo(t, '/thanhtoan'); await sanSang(t); await bam(t);
    k('Đ4 đang tự gửi lại: "Mạng chậm, đang gửi lại…", nút khoá, KHÔNG tự lui màn', await doi(t, async () => /Mạng chậm, đang gửi lại…/.test(await chu(t, '#checkout')) && (await nutKhoa(t)) && /\/thanhtoan$/.test(t.url())));
    k('D2 POS đã tạo nhưng trả 502 → gửi lại CÙNG khoá + CÙNG thân → trung, đúng MỘT đơn', await doi(t, async () => /\/don\/TQD42$/.test(t.url())) && S.don.size === 1 && giongNhau(S.guiDon), `${S.don.size} đơn, ${S.guiDon.length} lần gửi`);
  });
  them('5xx', { S0: { kich: [loiPos('PAYOS_LOI'), { st: 500, o: { error: 'Lỗi máy', code: 'LOI_MAY_CHU' } }] } }, async ({ t, S }) => {
    await mo(t, '/thanhtoan'); await sanSang(t); await bam(t);
    k('D2 502, 500 rồi thành công: 3 lần gửi y hệt từng byte (khoá + thân)', await doi(t, async () => /\/don\/TQD42$/.test(t.url()), 9000) && S.guiDon.length === 3 && giongNhau(S.guiDon), String(S.guiDon.length));
  });
  them('dang_xu_ly', { S0: { kich: [loiPos('DANG_XU_LY'), loiPos('DANG_XU_LY'), loiPos('DANG_XU_LY'), loiPos('DANG_XU_LY')] } }, async ({ t, S }) => {
    await mo(t, '/thanhtoan'); await sanSang(t); await bam(t);
    await t.clock.fastForward(9000);
    k('D2 DANG_XU_LY 4 lần (quá 3) vẫn gửi lại cùng khoá tới khi nhận đơn', await doi(t, async () => /\/don\/TQD42$/.test(t.url()), 9000) && S.guiDon.length === 5 && giongNhau(S.guiDon), String(S.guiDon.length));
  });
  them('mat_mang', { S0: { kich: ['abort', 'abort', 'abort', 'abort'] } }, async ({ t, S }) => {
    await mo(t, '/thanhtoan'); await sanSang(t); await bam(t);
    await t.clock.fastForward(7000);
    const ok = await doi(t, async () => /Gửi lại đúng đơn này/.test(await chu(t, '#checkout')), 9000);
    const c = await chu(t, '#checkout');
    k('D2 mất mạng 4 lần → khoá đặt + "Gửi lại đúng đơn này" + "Nếu quán đã nhận đơn, sẽ không tạo đơn thứ hai" + Xem Lịch sử đơn', ok && (await nutKhoa(t)) && /Nếu quán đã nhận đơn, sẽ không tạo đơn thứ hai/.test(c) && /Xem Lịch sử đơn/.test(c) && /\/thanhtoan$/.test(t.url()), c.slice(0, 200));
    k('Đ2 khối chưa rõ: tóm tắt món + tổng của lần đặt đó; KHÔNG có nút bỏ qua', /Trà Lục Bảo ×2/.test(c) && /Cà phê Muối ×1/.test(c) && /87\.654đ/.test(c) && !/Bỏ qua/.test(c), c.slice(0, 300));
    k('D2 4 lần gửi y hệt (khoá + thân)', S.guiDon.length === 4 && giongNhau(S.guiDon));
    const g = JSON.parse((await luu(t)) || '{}');
    k('D3 bản ghi kh_don_gui giữ khoá gửi, không PIN', g.khoa_gui === khoa(S.guiDon[0]) && !g.ma_don);
    await chup(t, 'thanhtoan-chuaro-390');
    await t.reload(); await t.waitForSelector('.phone');
    k('D3(c) tải lại khi chưa rõ → vẫn khoá + "Gửi lại đúng đơn này"', await doi(t, async () => /Gửi lại đúng đơn này/.test(await chu(t, '#checkout'))) && await nutKhoa(t));
    await bam(t).catch(() => {}); await t.waitForTimeout(300);
    k('D3(c) bấm nút Đặt khi chưa rõ → không gửi', S.guiDon.length === 4);
    await t.locator('#checkout button', { hasText: 'Gửi lại đúng đơn này' }).click();
    k('D3(c) "Gửi lại đúng đơn này" gửi CÙNG khoá + CÙNG thân → nhận đơn, MỘT đơn', await doi(t, async () => /\/don\/TQD42$/.test(t.url())) && S.guiDon.length === 5 && giongNhau(S.guiDon) && S.don.size === 1, String(S.guiDon.length));
  });
  them('qua_han', {}, async ({ t, S }) => {
    await mo(t, '/trangchu');
    await doi(t, async () => S.goi.some((g) => g.duong === '/toi')); await t.waitForTimeout(300); // /toi về → App đã ghi chủ máy (không xoá bản ghi gieo)
    await t.evaluate((g) => localStorage.setItem('kh_don_gui', JSON.stringify({ ...g, luc: Date.now() - 25 * 3600 * 1000 })), { khoa_gui: 'CU'.repeat(10), than: { mon: [{ ma: 'TLB', so_luong: 1 }], cach_nhan: 'tai_quan', cach_tra: 'qr', khoa_gui: 'CU'.repeat(10), tong_da_xem: 30000 }, cach_tra: 'qr' }); // luc tính theo đồng hồ (giả) của trang
    await mo(t, '/thanhtoan');
    k('Đ2 bản ghi quá 24 giờ → có nút "Bỏ qua, đặt đơn mới"', await doiChu(t, '#checkout', /Bỏ qua, đặt đơn mới/), `${await luu(t)} | ${(await chu(t, '#checkout')).slice(0, 120)}`);
    k('Đ2 quá 24 giờ: KHÔNG còn nút "Gửi lại đúng đơn này" (POS không nhớ khoá quá 24 giờ — gửi lại sẽ báo sai), mời xem Lịch sử đơn', !/Gửi lại đúng đơn này/.test(await chu(t, '#checkout')) && /Xem Lịch sử đơn/.test(await chu(t, '#checkout')));
    await t.locator('#checkout button', { hasText: 'Bỏ qua, đặt đơn mới' }).click();
    k('Đ2 bỏ qua → mở nút đặt, xoá bản ghi', await sanSang(t) && (await luu(t)) === null && S.guiDon.length === 0);
  });
  them('het_gio_cho', { S0: { kich: ['treo'] } }, async ({ t, S }) => {
    await mo(t, '/thanhtoan'); await sanSang(t); await bam(t);
    await doi(t, async () => S.guiDon.length === 1);
    await t.clock.fastForward(25000);
    k('D2 POS không trả lời (hết giờ chờ) → tự gửi lại cùng khoá + thân, nhận đơn', await doi(t, async () => /\/don\/TQD42$/.test(t.url()), 9000) && S.guiDon.length === 2 && giongNhau(S.guiDon), String(S.guiDon.length));
  });
  them('thieu_ma', { S0: { kich: [{ st: 200, o: { success: true, tong: 87654 } }] } }, async ({ t, S }) => {
    await mo(t, '/thanhtoan'); await sanSang(t); await bam(t);
    k('D2 200 thiếu ma_don → gửi lại cùng khoá + thân, nhận đơn', await doi(t, async () => /\/don\/TQD42$/.test(t.url()), 9000) && S.guiDon.length === 2 && giongNhau(S.guiDon));
  });
  them('4xx', { S0: { kich: [loiPos('DON_KHONG_HOP_LE'), loiPos('KHOA_GUI_DA_DUNG')] } }, async ({ t, S }) => {
    await mo(t, '/thanhtoan'); await sanSang(t); await bam(t);
    k('D1 4xx → hiện lời POS, KHÔNG "chưa rõ", nút mở lại, không bản ghi', await doiChu(t, '#checkout .nt-state', /DON_KHONG_HOP_LE/) && !/Gửi lại đúng đơn này/.test(await chu(t, '#checkout')) && await sanSang(t) && (await luu(t)) === null);
    await bam(t);
    k('D1 KHOA_GUI_DA_DUNG (KH-MUA-1c B2) → "Đơn này có thể đã đặt trước đó", GIỮ bản ghi, không "Vui lòng đặt lại"', await doiChu(t, '#checkout', /Đơn này có thể đã đặt trước đó/) && !/Vui lòng đặt lại/.test(await chu(t, '#checkout')) && !!(await luu(t)) && await nutKhoa(t));
    await t.locator('#checkout button', { hasText: 'Bỏ qua, đặt đơn mới' }).click();
    await sanSang(t); await bam(t);
    k('D1/C3 mỗi lần bấm một khoá MỚI; lần cuối thành công', await doi(t, async () => /\/don\/TQD42$/.test(t.url())) && new Set(S.guiDon.map(khoa)).size === 3);
  });
  them('gia_da_doi', {}, async ({ t, S }) => {
    await mo(t, '/thanhtoan'); await sanSang(t);
    S.bg = { ...BG, tong: 80000, giam: [{ loai: 'hang', so_tien: 19000 }] };
    await bam(t);
    k('D1 GIA_DA_DOI → bảng tiền = báo giá POS trả (80.000đ), "Giá vừa thay đổi, mời bạn xem lại", không tự gửi', await doiChu(t, '#checkout', /Giá vừa thay đổi, mời bạn xem lại/) && /80\.000đ/.test(await chu(t, '#checkout .bang-tien')) && S.guiDon.length === 1);
    await sanSang(t); await bam(t);
    k('D1 bấm lại → tong_da_xem = 80000 (số đang hiện), thành công', await doi(t, async () => /\/don\/TQD42$/.test(t.url())) && JSON.parse(S.guiDon[1]).tong_da_xem === 80000);
  });
  them('qua_nhieu_lan', { S0: { kich: [loiPos('QUA_NHIEU_LAN', { thu_lai_sau_giay: 30 })] } }, async ({ t }) => {
    await mo(t, '/thanhtoan'); await sanSang(t); await bam(t);
    k('D1 429 → nút khoá, đếm ngược "Thử lại sau 30 giây"', await doiChu(t, '#checkout .checkout-btn', /Thử lại sau (30|29) giây/) && await nutKhoa(t));
    await t.clock.fastForward(10000);
    k('D1 429 đếm ngược giảm theo giây', await doiChu(t, '#checkout .checkout-btn', /Thử lại sau (20|19) giây/));
    await t.clock.fastForward(21000);
    k('D1 hết đếm ngược → nút mở lại', await sanSang(t));
  });
  for (const code of ['HET_HANG', 'MON_KHONG_BAN']) {
    them(code, { S0: { kich: [loiPos(code, { ma: 'CFM' })] } }, async ({ t }) => {
      await mo(t, '/thanhtoan'); await sanSang(t); await bam(t);
      k(`D1 ${code} → lời POS + tên món, khoá nút`, await doiChu(t, '#checkout', new RegExp(`${code}[\\s\\S]*Cà phê Muối`)) && await nutKhoa(t));
      await t.locator('#checkout button', { hasText: 'Về giỏ hàng' }).click();
      k(`D1 ${code} → giỏ đánh dấu đúng dòng Cà phê Muối`, await doi(t, async () => /\/giohang$/.test(t.url()) && /Không còn bán|Hết hàng/.test(await t.locator('#cart .cart-item', { hasText: 'Cà phê Muối' }).innerText().catch(() => ''))) && !/Không còn bán|Hết hàng/.test(await t.locator('#cart .cart-item', { hasText: 'Trà Lục Bảo' }).innerText()));
    });
  }
  them('pin_dang_khoa', { S0: { vi: 100000, pinKhoa: true } }, async ({ t }) => {
    await mo(t, '/thanhtoan'); await sanSang(t); await doiChu(t, '#checkout', /Số dư 100\.000đ/);
    await batVi(t); await bam(t); await t.waitForSelector('.pin-pad'); await nhapPin(t, PIN);
    k('D1 PIN_DANG_KHOA → bảng PIN hiện lời POS', await doiChu(t, '.pin-msg', /PIN_DANG_KHOA/));
  });
  them('chua_co_pin', { S0: { vi: 100000, chuaCoPin: true } }, async ({ t }) => {
    await mo(t, '/thanhtoan'); await sanSang(t); await doiChu(t, '#checkout', /Số dư 100\.000đ/);
    await batVi(t); await bam(t); await t.waitForSelector('.pin-pad'); await nhapPin(t, PIN);
    k('D1 CHUA_CO_PIN → lời POS + nút "Đặt mã PIN"', await doi(t, async () => /CHUA_CO_PIN/.test(await chu(t, '#checkout')) && (await t.locator('#checkout button', { hasText: 'Đặt mã PIN' }).count()) === 1));
  });
  them('ngoai_gio', { S0: { kich: [loiPos('QUA_GIO_NHAN_DON')] } }, async ({ t }) => {
    await mo(t, '/thanhtoan'); await sanSang(t); await bam(t);
    k('D1 QUA_GIO_NHAN_DON → lời POS, nút KHOÁ', await doiChu(t, '#checkout', /QUA_GIO_NHAN_DON/) && (await t.waitForTimeout(300), await nutKhoa(t)));
  });
  them('cach_khong_khop', { S0: { vi: 50000 } }, async ({ t, S }) => {
    await mo(t, '/thanhtoan'); await sanSang(t); await doiChu(t, '#checkout', /Số dư 50\.000đ/);
    await batVi(t);
    S.vi = 200000;
    await bam(t); await t.waitForSelector('.pin-pad'); await nhapPin(t, PIN);
    k('D1 CACH_KHONG_KHOP → tải lại số dư, công tắc đang bật thành trả ví ("đủ trả cả đơn")', await doi(t, async () => /CACH_KHONG_KHOP/.test(await chu(t, '#checkout')) && /đủ trả cả đơn/.test(await dongVi(t))));
  });
  them('d3a-bam-nhieu', { S0: { treDon: 800 } }, async ({ t, S }) => {
    await mo(t, '/thanhtoan'); await sanSang(t);
    await nut(t).click(); await nut(t).click({ force: true }).catch(() => {}); await nut(t).click({ force: true }).catch(() => {});
    k('D3(a) bấm 3 lần liền → đúng MỘT lần POST /don, một đơn', await doi(t, async () => /\/don\/TQD42$/.test(t.url())) && S.guiDon.length === 1 && S.don.size === 1, String(S.guiDon.length));
  });
  them('d3b-back-qr', {}, async ({ t, S }) => {
    await mo(t, '/thanhtoan'); await sanSang(t); await bam(t);
    await doi(t, async () => /\/don\/TQD42$/.test(t.url()));
    await t.goBack(); await t.waitForSelector('#checkout');
    k('D3(b) Back từ màn QR → Thanh toán khoá, mời "Tiếp tục trả đơn TQD42" / "Huỷ đơn đó"', await doi(t, async () => /Tiếp tục trả đơn #TQD42/.test(await chu(t, '#checkout')) && /Huỷ đơn đó/.test(await chu(t, '#checkout'))) && await nutKhoa(t));
    await bam(t).catch(() => {}); await t.waitForTimeout(300);
    k('D3(b) bấm Đặt lúc đó → không đơn thứ hai', S.guiDon.length === 1 && S.don.size === 1);
    await chup(t, 'thanhtoan-dontruoc-390');
    await t.locator('#checkout button', { hasText: 'Huỷ đơn đó' }).click();
    k('D3(b) "Huỷ đơn đó" → POS huỷ, nút đặt mở lại', await doi(t, async () => S.don.get('TQD42').tt === 'da_huy') && await sanSang(t));
  });
  them('d3d-hai-tab', { S0: { kich: ['treo'] } }, async ({ t, S, trang }) => {
    await mo(t, '/thanhtoan'); await sanSang(t); await bam(t);
    await doi(t, async () => S.guiDon.length === 1);
    const t2 = await trang(); await mo(t2, '/thanhtoan');
    k('D3(d) tab 2 mở Thanh toán khi tab 1 đang gửi → khoá, "Gửi lại đúng đơn này"', await doi(t2, async () => /Gửi lại đúng đơn này/.test(await chu(t2, '#checkout'))) && await nutKhoa(t2));
    await bam(t2).catch(() => {}); await t2.waitForTimeout(300);
    await t.clock.fastForward(25000);
    await doi(t, async () => /\/don\/TQD42$/.test(t.url()), 9000);
    k('D3(d) hai tab cộng lại: mọi lần gửi cùng MỘT khoá, MỘT đơn', S.don.size === 1 && new Set(S.guiDon.map(khoa)).size === 1, `${S.don.size} đơn, ${S.guiDon.length} lần`);
  });
  them('d3d-tab-mo-truoc', { S0: { kich: ['treo'] } }, async ({ t, S, trang }) => {
    const t2 = await trang(); await mo(t2, '/thanhtoan'); await sanSang(t2); // tab 2 mở Thanh toán TRƯỚC
    await mo(t, '/thanhtoan'); await sanSang(t); await bam(t);
    await doi(t, async () => S.guiDon.length === 1);
    await bam(t2).catch(() => {}); await t2.waitForTimeout(500);
    k('D3(d) tab 2 mở TRƯỚC, tab 1 đang gửi (chưa rõ) → tab 2 bấm đặt KHÔNG gửi khoá mới, hiện "Gửi lại đúng đơn này"', S.guiDon.length === 1 && /Gửi lại đúng đơn này/.test(await chu(t2, '#checkout')) && await nutKhoa(t2), String(S.guiDon.length));
  });
  them('d3d-tab-mo-truoc-vi', { S0: { vi: 100000 } }, async ({ t, S, trang }) => {
    const t2 = await trang(); await mo(t2, '/thanhtoan'); await sanSang(t2);
    await mo(t, '/thanhtoan'); await sanSang(t); await doiChu(t, '#checkout', /Số dư 100\.000đ/);
    await batVi(t); await bam(t); await t.waitForSelector('.pin-pad'); await nhapPin(t, PIN);
    await doi(t, async () => /\/don\/TQD42$/.test(t.url()));
    await bam(t2).catch(() => {}); await t2.waitForTimeout(500);
    k('D3(d) tab 2 mở TRƯỚC, tab 1 trả ví xong → tab 2 bấm đặt KHÔNG tạo đơn thứ hai, báo "Bạn vừa đặt đơn #TQD42"', S.guiDon.length === 1 && S.don.size === 1 && /Bạn vừa đặt đơn #TQD42/.test(await chu(t2, '#checkout')), `${S.guiDon.length} lần gửi ${S.guiDon.map((x) => JSON.parse(x).cach_tra).join(',')} | ${(await chu(t2, '#checkout')).slice(0, 160)}`);
    await chup(t2, 'thanhtoan-don-khac-390');
    await t2.locator('#checkout button', { hasText: 'Đặt thêm đơn mới' }).click();
    k('D3(d) khách chủ ý "Đặt thêm đơn mới" → nút đặt mở lại (K5)', await sanSang(t2));
  });
  them('pin-mo-truoc', { S0: { vi: 300000 } }, async ({ t, S, trang }) => {
    const t2 = await trang(); await mo(t2, '/thanhtoan'); await sanSang(t2); await doiChu(t2, '#checkout', /Số dư 300\.000đ/);
    await batVi(t2); await bam(t2); await t2.waitForSelector('.pin-pad'); // tab 2: bảng PIN mở sẵn
    await mo(t, '/thanhtoan'); await sanSang(t); await doiChu(t, '#checkout', /Số dư 300\.000đ/);
    // KH-BAO-1 C1: tab 2 vừa bật công tắc → máy nhớ '1' → tab 1 mở ra đã bật SẴN (không bấm tắt đi).
    if (!(await t.locator('#checkout .switch.on').count())) await batVi(t);
    await bam(t); await t.waitForSelector('.pin-pad'); await nhapPin(t, PIN);
    await doi(t, async () => /\/don\/TQD42$/.test(t.url()));
    await nhapPin(t2, PIN); await t2.waitForTimeout(800);
    k('D3(d) tab 2 mở bảng PIN TRƯỚC, tab 1 trả ví xong, tab 2 nhập PIN → KHÔNG gửi lần hai, báo "Bạn vừa đặt đơn #TQD42"', S.guiDon.length === 1 && S.don.size === 1 && /Bạn vừa đặt đơn #TQD42/.test(await chu(t2, '#checkout')), `${S.guiDon.length} lần gửi`);
  });
  them('gui-lai-pin-mo-san', { S0: { vi: 300000 } }, async ({ t, S }) => {
    const ghi = (k) => t.evaluate((k) => localStorage.setItem('kh_don_gui', JSON.stringify({ khoa_gui: k, than: { mon: [{ ma: 'TLB', so_luong: 2, ghi_chu: 'ít ngọt' }, { ma: 'CFM', so_luong: 1 }], cach_nhan: 'tai_quan', cach_tra: 'vi', khoa_gui: k, tong_da_xem: 87654 }, cach_tra: 'vi', luc: Date.now() })), k);
    await mo(t, '/trangchu');
    await doi(t, async () => S.goi.some((g) => g.duong === '/toi')); await t.waitForTimeout(300);
    await ghi('K1'.repeat(10));
    await mo(t, '/thanhtoan');
    await doi(t, async () => /Gửi lại đúng đơn này/.test(await chu(t, '#checkout')));
    await t.locator('#checkout button', { hasText: 'Gửi lại đúng đơn này' }).click(); await t.waitForSelector('.pin-pad'); // bảng PIN của "Gửi lại" (K1) mở sẵn
    await ghi('K2'.repeat(10)); // trong lúc đó tab khác: K1 nhận 4xx (bản ghi xoá) rồi đặt đơn mới K2 đang chưa rõ
    await nhapPin(t, PIN); await t.waitForTimeout(600);
    k('D3(d) bảng PIN "Gửi lại" mở sẵn, tab khác đã thay bản ghi → nhập PIN KHÔNG gửi khoá cũ, bản ghi K2 của tab kia còn nguyên', S.guiDon.length === 0 && JSON.parse((await luu(t)) || '{}').khoa_gui === 'K2'.repeat(10), `${S.guiDon.length} | ${await luu(t)}`);
  });
  them('hai-tab-chua-ro', {}, async ({ t, S, trang }) => {
    await mo(t, '/trangchu');
    await doi(t, async () => S.goi.some((g) => g.duong === '/toi')); await t.waitForTimeout(300);
    await t.evaluate(() => localStorage.setItem('kh_don_gui', JSON.stringify({ khoa_gui: 'HAI'.repeat(6), than: { mon: [{ ma: 'TLB', so_luong: 2, ghi_chu: 'ít ngọt' }, { ma: 'CFM', so_luong: 1 }], cach_nhan: 'tai_quan', cach_tra: 'qr', khoa_gui: 'HAI'.repeat(6), tong_da_xem: 87654 }, cach_tra: 'qr', luc: Date.now() })));
    await mo(t, '/thanhtoan');
    const t2 = await trang(); await mo(t2, '/thanhtoan');
    await doi(t, async () => /Gửi lại đúng đơn này/.test(await chu(t, '#checkout'))); await doi(t2, async () => /Gửi lại đúng đơn này/.test(await chu(t2, '#checkout')));
    await t2.locator('#checkout button', { hasText: 'Gửi lại đúng đơn này' }).click();
    await doi(t2, async () => /\/don\/TQD42$/.test(t2.url()));
    await t.waitForTimeout(500);
    await bam(t).catch(() => {}); await t.waitForTimeout(400);
    k('D3(d) hai tab cùng "chưa rõ", tab 2 gửi lại thành công → tab 1 hiện "Bạn vừa đặt đơn #TQD42", nút khoá, không gửi thêm', /Bạn vừa đặt đơn #TQD42/.test(await chu(t, '#checkout')) && await nutKhoa(t) && S.guiDon.length === 1, `${S.guiDon.length} | ${(await chu(t, '#checkout')).slice(0, 120)}`);
  });
  them('kiem-lai-luc-bam', {}, async ({ t, S }) => {
    await mo(t, '/thanhtoan'); await sanSang(t);
    // bản ghi "chưa rõ" xuất hiện mà trang CHƯA vẽ lại (ghi ngay trong trang → không có sự kiện storage): chỉ phép kiểm lúc bấm chặn được
    await t.evaluate(() => localStorage.setItem('kh_don_gui', JSON.stringify({ khoa_gui: 'KHAC'.repeat(5), than: { mon: [{ ma: 'TLB', so_luong: 2 }], cach_nhan: 'tai_quan', cach_tra: 'qr', khoa_gui: 'KHAC'.repeat(5), tong_da_xem: 87654 }, cach_tra: 'qr', luc: Date.now() })));
    await bam(t); await t.waitForTimeout(500);
    k('D3 bản ghi "chưa rõ" mới có mà màn chưa vẽ lại → bấm đặt KHÔNG gửi, hiện "Gửi lại đúng đơn này" (kiểm lại lúc bấm)', S.guiDon.length === 0 && /Gửi lại đúng đơn này/.test(await chu(t, '#checkout')), String(S.guiDon.length));
  });
  them('gui-lai-gia-doi', { S0: { bgDoi: { ...BG, tong: 31000, tam_tinh: 31000, giam: [] } } }, async ({ t, S }) => {
    await mo(t, '/trangchu');
    await doi(t, async () => S.goi.some((g) => g.duong === '/toi')); await t.waitForTimeout(300);
    await t.evaluate(() => localStorage.setItem('kh_don_gui', JSON.stringify({ khoa_gui: 'CU'.repeat(10), than: { mon: [{ ma: 'TLB', so_luong: 1 }], cach_nhan: 'tai_quan', cach_tra: 'qr', khoa_gui: 'CU'.repeat(10), tong_da_xem: 30000 }, cach_tra: 'qr', luc: Date.now() })));
    await mo(t, '/thanhtoan');
    await doi(t, async () => /Gửi lại đúng đơn này/.test(await chu(t, '#checkout')) && /87\.654đ/.test(await chu(t, '#checkout .bang-tien')));
    await t.locator('#checkout button', { hasText: 'Gửi lại đúng đơn này' }).click();
    await doi(t, async () => S.guiDon.length === 1 && (await chu(t, '#checkout .nt-state')).length > 0); await t.waitForTimeout(300);
    const tien = await chu(t, '#checkout .bang-tien');
    k('D1 "Gửi lại đúng đơn này" nhận GIA_DA_DOI → bảng tiền VẪN của giỏ hiện tại (87.654đ, không 31.000đ), bỏ bản ghi, mời đặt lại', /87\.654đ/.test(tien) && !/31\.000đ/.test(tien) && (await luu(t)) === null && await sanSang(t) && /87\.654đ/.test(await nut(t).innerText()), tien);
  });
  them('kho-chan', { chanKho: true, S0: { kich: ['abort', 'abort', 'abort', 'abort'] } }, async ({ t, S }) => {
    await mo(t, '/thanhtoan'); await sanSang(t); await bam(t);
    await t.clock.fastForward(7000);
    k('D2 kho bị chặn + chưa rõ → vẫn khoá đặt, "Gửi lại đúng đơn này" (bản ghi giữ trong bộ nhớ trang)', await doi(t, async () => /Gửi lại đúng đơn này/.test(await chu(t, '#checkout')), 9000) && await nutKhoa(t) && S.guiDon.length === 4);
  });
  them('kiem-don-truoc', { S0: { treDsDon: 1500 } }, async ({ t }) => {
    await mo(t, '/thanhtoan');
    await doi(t, async () => (await t.locator('#checkout .bang-tien .total').count()) > 0);
    k('Đ3 mở Thanh toán hiện trang ngay; nút khoá "Đang kiểm tra đơn trước…" khi GET /don chưa về', (await t.locator('#checkout .mode-row').count()) === 1 && /Đang kiểm tra đơn trước…/.test(await nut(t).innerText()) && await nutKhoa(t));
    k('Đ3 GET /don về → nút mở', await sanSang(t));
  });
  them('kiem-don-loi', { S0: { dsDonLoi: true } }, async ({ t }) => {
    await mo(t, '/thanhtoan');
    k('Đ3 GET /don lỗi mạng → nút vẫn mở (không treo)', await sanSang(t));
  });
  them('bao-gia-cho', { S0: { treBg: 1500 } }, async ({ t, S }) => {
    await mo(t, '/thanhtoan');
    await t.waitForTimeout(700);
    k('Đ5 báo giá chưa về → nút Đặt khoá, chữ "Xác nhận" (không ghi cách trả / tổng)', (await nutKhoa(t)) && /^Xác nhận( →)?$/.test((await nut(t).innerText()).replace(/\s+/g, ' ').trim()));
    k('Đ5 báo giá về → nút bật với đúng tổng đang hiện', await sanSang(t) && /87\.654đ/.test(await nut(t).innerText()));
    await bam(t);
    k('Đ5 tong_da_xem = tổng đang hiện', await doi(t, async () => S.guiDon.length === 1) && JSON.parse(S.guiDon[0]).tong_da_xem === 87654);
  });
  them('huy', {}, async ({ t, S }) => {
    await mo(t, '/thanhtoan'); await sanSang(t); await bam(t);
    await doi(t, async () => /\/don\/TQD42$/.test(t.url()));
    await t.locator('#tracking button', { hasText: 'Huỷ đơn' }).click();
    k('F4 Huỷ đơn chờ trả → POST /don/TQD42/huy, màn hiện Đã huỷ', await doi(t, async () => S.don.get('TQD42').tt === 'da_huy' && /Đã huỷ/.test(await chu(t, '#tracking'))));
    await mo(t, '/taikhoan/donhang');
    k('F4/F6 Lịch sử sau khi huỷ: thẻ TQD42 "Đã hủy" (kho /don làm mới)', await doi(t, async () => /Đã hủy/.test(await t.locator('.order-card', { hasText: '#TQD42' }).innerText().catch(() => ''))));
  });
  for (const lh of [false, true]) {
    them(`huy-da-tra-${lh ? 'co' : 'khong'}-so`, { lienHe: lh, S0: { vi: 100000 } }, async ({ t, S }) => {
      S.don.set('TQD60', { ma: 'TQD60', tong: 30000, tt: 'cho_tra', qr: { chuoi: 'Q60', het_han: BAY('20:40:00') }, giu: 0 });
      await mo(t, '/don/TQD60');
      await doi(t, async () => (await t.locator('#tracking button', { hasText: 'Huỷ đơn' }).count()) > 0);
      S.don.get('TQD60').tt = 'da_tra';
      await t.locator('#tracking button', { hasText: 'Huỷ đơn' }).click();
      const ok = await doiChu(t, '#tracking', /gọi quán để huỷ/);
      await doi(t, async () => /Số đơn của bạn/.test(await chu(t, '#tracking')));
      const tel = await t.locator('#tracking a[href^="tel:"]').count();
      k(`F4 DA_TRA_GOI_QUAN → câu POS; số quán ${lh ? 'CÓ → link tel:' : 'trống → không link'}`, ok && (lh ? tel > 0 : tel === 0), String(tel));
    });
  }
  them('doi-soat', {}, async ({ t, S }) => {
    S.don.set('TQD50', { ma: 'TQD50', tong: 30000, tt: 'da_huy', qr: null, giu: 0, tienVe: true });
    await mo(t, '/don/TQD50');
    k('F3 tien_ve_cho_doi_soat → "Quán đã nhận tiền, nhân viên sẽ liên hệ với bạn"', await doiChu(t, '#tracking', /Quán đã nhận tiền, nhân viên sẽ liên hệ với bạn/));
  });
  them('lich-su', {}, async ({ t, S }) => {
    for (const [ma, tt] of [['TQD51', 'cho_tra'], ['TQD52', 'da_tra'], ['TQD53', 'dang_lam'], ['TQD54', 'xong'], ['TQD55', 'da_huy']]) S.don.set(ma, { ma, tong: 30000, tt, qr: tt === 'cho_tra' ? { chuoi: 'Q', het_han: BAY('20:40:00') } : null, giu: 0 });
    S.donCu.push({ ma: 'HD7', tong: 45000, tt: 'xong', trangThai: 'completed', thanhToan: 'paid', daTra: true });
    const den = {};
    for (const ma of ['TQD51', 'TQD52', 'TQD53', 'TQD54', 'TQD55', 'HD7']) {
      await mo(t, '/taikhoan/donhang');
      await t.locator('.order-card', { hasText: '#' + ma }).click();
      await t.waitForTimeout(150);
      den[ma] = new URL(t.url()).pathname;
    }
    k('F6 cho_tra / da_tra / dang_lam → /don/<mã>; xong / da_huy / bill quầy → /taikhoan/donhang/<mã>', den.TQD51 === '/don/TQD51' && den.TQD52 === '/don/TQD52' && den.TQD53 === '/don/TQD53' && den.TQD54 === '/taikhoan/donhang/TQD54' && den.TQD55 === '/taikhoan/donhang/TQD55' && den.HD7 === '/taikhoan/donhang/HD7', JSON.stringify(den));
    await mo(t, '/taikhoan/donhang');
    await doi(t, async () => (await t.locator('.order-card').count()) === 6);
    k('F6 nhãn đơn App: "Chờ thanh toán", "Đã thanh toán", "Đã hủy"', /Chờ thanh toán/.test(await t.locator('.order-card', { hasText: '#TQD51' }).innerText()) && /Đã thanh toán/.test(await t.locator('.order-card', { hasText: '#TQD53' }).innerText()) && /Đã hủy/.test(await t.locator('.order-card', { hasText: '#TQD55' }).innerText()));
  });
  them('401', {}, async ({ t, S }) => {
    await mo(t, '/thanhtoan'); await sanSang(t);
    S.chetDon = true; await bam(t);
    const ve = await doi(t, async () => /\/trangchu$/.test(t.url()));
    const g = JSON.parse((await luu(t)) || '{}');
    k('S1 401 ngay lần gửi đầu → hết phiên, về Trang chủ, GIỮ bản ghi chưa rõ (cùng khoá), không tự gửi lại', ve && g.khoa_gui === khoa(S.guiDon[0]) && !g.ma_don && S.guiDon.length === 1, `${t.url()} ${await luu(t)} ${S.guiDon.length}`);
    S.chetDon = false; await t.evaluate(() => localStorage.setItem('kh_token', 'tok-A')); // đăng nhập lại, cùng khách
    await mo(t, '/thanhtoan');
    k('S1 đăng nhập lại → Thanh toán hiện "Lần đặt trước chưa rõ kết quả" + "Gửi lại đúng đơn này", nút đặt khoá', await doi(t, async () => /Lần đặt trước chưa rõ kết quả/.test(await chu(t, '#checkout')) && /Gửi lại đúng đơn này/.test(await chu(t, '#checkout'))) && await nutKhoa(t));
  });
  them('401-gui-lai', { S0: { kich: ['tao+502', { st: 401, o: { error: 'Phiên đăng nhập đã hết', code: 'KH_TOKEN_SAI' } }] } }, async ({ t, S }) => {
    await mo(t, '/thanhtoan'); await sanSang(t); await bam(t);
    await t.clock.fastForward(3000);
    const ve = await doi(t, async () => /\/trangchu$/.test(t.url()), 8000);
    const g = JSON.parse((await luu(t)) || '{}');
    k('S1 lần 1 đã tạo nhưng mất trả lời, tự gửi lại nhận 401 → dừng (2 lần gửi), GIỮ bản ghi chưa rõ', ve && S.guiDon.length === 2 && g.khoa_gui === khoa(S.guiDon[0]) && !g.ma_don, `${t.url()} ${S.guiDon.length} ${await luu(t)}`);
    await t.evaluate(() => localStorage.setItem('kh_token', 'tok-A'));
    await mo(t, '/thanhtoan');
    await doi(t, async () => /Gửi lại đúng đơn này/.test(await chu(t, '#checkout')));
    await t.locator('#checkout button', { hasText: 'Gửi lại đúng đơn này' }).click();
    k('S1 đăng nhập lại, "Gửi lại đúng đơn này" → CÙNG khoá + thân, POS trả đơn cũ (trung), MỘT đơn', await doi(t, async () => /\/don\/TQD42$/.test(t.url())) && S.guiDon.length === 3 && giongNhau(S.guiDon) && S.don.size === 1, `${S.guiDon.length} ${S.don.size}`);
  });
  them('gui-lai-pin-sai', { S0: { vi: 300000 } }, async ({ t, S }) => {
    await mo(t, '/trangchu');
    await doi(t, async () => S.goi.some((g) => g.duong === '/toi')); await t.waitForTimeout(300);
    const K = 'PS'.repeat(10);
    await t.evaluate((K) => localStorage.setItem('kh_don_gui', JSON.stringify({ khoa_gui: K, than: { mon: [{ ma: 'TLB', so_luong: 2, ghi_chu: 'ít ngọt' }, { ma: 'CFM', so_luong: 1 }], cach_nhan: 'tai_quan', cach_tra: 'vi', khoa_gui: K, tong_da_xem: 87654 }, cach_tra: 'vi', luc: Date.now() })), K);
    await mo(t, '/thanhtoan');
    await doi(t, async () => /Gửi lại đúng đơn này/.test(await chu(t, '#checkout')));
    await t.locator('#checkout button', { hasText: 'Gửi lại đúng đơn này' }).click(); await t.waitForSelector('.pin-pad');
    await nhapPin(t, '2468');
    const loiPin = await doiChu(t, '.pin-msg', /PIN_SAI/);
    k('S2 "Gửi lại đúng đơn này" + sai PIN → bảng PIN còn mở, hiện lời POS, bản ghi GIỮ', loiPin && (await t.locator('.pin-pad').count()) === 1 && JSON.parse((await luu(t)) || '{}').khoa_gui === K, await luu(t));
    await nhapPin(t, PIN);
    const bo = (tho) => { const { pin, ...x } = JSON.parse(tho); return JSON.stringify(x); };
    k('S2 nhập lại đúng PIN → gửi ĐÚNG khoá + thân cũ, nhận đơn, MỘT đơn', await doi(t, async () => /\/don\/TQD42$/.test(t.url())) && S.guiDon.length === 2 && S.guiDon.every((x) => khoa(x) === K) && bo(S.guiDon[0]) === bo(S.guiDon[1]) && S.don.size === 1, `${S.guiDon.length} ${t.url()}`);
  });
  them('giam', {}, async ({ t }) => {
    await mo(t, '/giohang');
    await doi(t, async () => /87\.654đ/.test(await chu(t, '#cart .bang-tien')));
    await t.fill('#cart .promo-box input', 'GIAM10'); await t.locator('#cart .promo-box button').click();
    const ok = await doiChu(t, '#cart .bang-tien', /85\.000đ/);
    const b = await chu(t, '#cart .bang-tien');
    k('C6 dòng giảm: "Giảm giá (voucher)", "Ưu đãi hạng Vàng", "Giờ vàng", loại lạ "Giảm giá"', ok && /Giảm giá \(voucher\)/.test(b) && /Ưu đãi hạng Vàng/.test(b) && /Giờ vàng/.test(b) && /\nGiảm giá\n|^Giảm giá\n|Giảm giá\s+−2\.000đ/m.test(b), b);
    k('C6 mã được áp → nút "✓ Đã áp dụng"', /✓ Đã áp dụng/.test(await chu(t, '#cart .promo-box button')));
    await chup(t, 'giohang-giam-390');
    await t.fill('#cart .promo-box input', 'SAI'); await t.locator('#cart .promo-box button').click();
    k('C6 ma_giam_loi → hiện error dưới ô mã, nút về "Áp dụng"', await doiChu(t, '#cart', /Mã giảm giá không tồn tại/) && /^Áp dụng$/.test((await chu(t, '#cart .promo-box button')).trim()));
  });
  them('g1', { dn: false, gio: null }, async ({ t }) => {
    await mo(t, '/trangchu');
    await t.locator('.tab', { hasText: 'Menu' }).first().click();
    await t.locator('.cat-tiles .ct', { hasText: 'Cà phê' }).first().click();
    await t.waitForTimeout(200);
    const truoc = new URL(t.url()).pathname;
    await t.locator('.prod-card', { hasText: 'Cà phê Muối' }).first().click();
    await t.locator('.detail-addcart').click();
    k('G1 thêm món từ Menu (nhóm Cà phê) → quay lại ĐÚNG trang trước, không vào giỏ', await doi(t, async () => new URL(t.url()).pathname === truoc) && truoc !== '/menu' && /^\/menu\//.test(truoc), `${truoc} → ${t.url()}`);
    k('G1 thông báo "Đã thêm Cà phê Muối vào giỏ", tab giỏ số 1', /Đã thêm Cà phê Muối vào giỏ/.test(await chu(t, '.toast')) && (await chu(t, '.tab .tab-so')) === '1');
    await mo(t, '/mon/tra-luc-bao');
    await t.locator('.detail-addcart').click();
    k('G1 mở thẳng Trang món bằng link → thêm xong về /menu', await doi(t, async () => new URL(t.url()).pathname === '/menu'), t.url());
  });

  const t0 = Date.now();
  const hang = [...CA];
  await Promise.all([...Array(5)].map(async () => { while (hang.length) await hang.shift()(); }));
  console.log(`  (phần trình duyệt ${Math.round((Date.now() - t0) / 1000)} giây)`);
  await trinh.close();
}
