#!/usr/bin/env node
// THỬ KH-THE-1 — bán thẻ hạng trên App (hợp đồng v13): dòng thẻ trong giỏ, thân báo giá / đặt đơn, "trả thẻ trước", dọn giỏ đúng dòng đã gửi ở MỌI nơi (C7),
// giỏ chỉ thẻ đặt mọi giờ, đơn chỉ thẻ không báo "ra quầy", nhắc gia hạn, màn Hạng thành viên, nhóm "Thẻ thành viên" ở Menu, danh mục nội dung.
// Phần 1 (luôn chạy, kể cả KHONG_TRINH_DUYET=1): hàm thuần + đọc nguồn · Phần 2: App thật trong Chromium (POS giả dựng TỪ hợp đồng v13; không có Playwright /
// KHONG_TRINH_DUYET=1 → in "BỎ QUA", không tính ca). Chạy: node cong_cu/thu_KHTHE1.js → dòng cuối "n đạt · m hỏng".
'use strict';
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const crypto = require('crypto');

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
const khoGia = (d = {}) => ({ d, getItem: (x) => (x in d ? d[x] : null), setItem: (x, v) => { d[x] = String(v); }, removeItem: (x) => { delete d[x]; } });
const loi = (status, code) => Object.assign(new Error(code || 'lỗi'), { status, code });

// POS giả dựng từ hợp đồng v13: hạng 2 = Vàng bán (1 / 3 tháng), hạng 3 = Kim cương chỉ cấp, hạng 1 = 0 % (ẩn).
const HANG = [
  { id: 1, ten: 'Bạc', phan_tram: 0, phan_tram_nhom_dac_biet: 0, chi_cap: false, goi: [], thu_bac: 1, gia_the: null, thu_tu: 1, quyen_loi: [] },
  { id: 2, ten: 'Vàng', phan_tram: 10, phan_tram_nhom_dac_biet: 5, chi_cap: false, goi: [{ so_thang: 1, gia: 79000 }, { so_thang: 3, gia: 199000 }], thu_bac: 2, gia_the: 79000, thu_tu: 2, quyen_loi: ['Giảm 10% mọi món', 'Tích điểm ×1,2'] },
  { id: 3, ten: 'Kim cương', phan_tram: 15, phan_tram_nhom_dac_biet: 10, chi_cap: true, goi: [], thu_bac: 3, gia_the: null, thu_tu: 3, quyen_loi: [] },
];
const MENU_DS = [
  { ma: 'TLB', ten: 'Trà Lục Bảo', nhom: 'Trà', gia: 30000, con_hang: true, gia_hang: [{ hang_id: 2, gia: 27000 }, { hang_id: 3, gia: 25500 }] },
  { ma: 'EPC', ten: 'Ép cam', nhom: 'Ép', gia: 35000, con_hang: true, gia_hang: [{ hang_id: 2, gia: 31500 }] },
];
const THE = (hang_id = 2, so_thang = 3) => ({ loai: 'the', hang_id, so_thang });
const LY = (ma = 'TLB', so_luong = 1, ghi_chu = '') => ({ ma, so_luong, ghi_chu });

(async () => {
  const HD = docTho('thiet_ke/HOP_DONG_API_KH.md');
  const MA_THE_HD = (/Mua thẻ \(v13\): ([^\n]+)/.exec(HD) || ['', ''])[1].match(/[A-Z][A-Z_]{3,}/g) || [];

  console.log('A — hợp đồng v13');
  await thu('A', async () => {
    const goc = path.join(GOC, 'viec/KH-THE-1/hop_dong_v13.md');
    const tep = fs.existsSync(goc) ? fs.readFileSync(goc) : Buffer.alloc(0);
    k('A1 viec/KH-THE-1/hop_dong_v13.md sha256 bắt đầu 490976b0c438b8b4 (bản gốc POS 162a908)', crypto.createHash('sha256').update(tep).digest('hex').startsWith('490976b0c438b8b4'));
    k('A1 thiet_ke/HOP_DONG_API_KH.md = bản gốc từng byte, PHIEN_BAN 13', tep.length > 0 && fs.readFileSync(path.join(GOC, 'thiet_ke/HOP_DONG_API_KH.md')).equals(tep) && /^PHIEN_BAN: 13$/m.test(HD));
    k('A1 4 mã lỗi thẻ đọc thẳng từ hợp đồng', bang(MA_THE_HD, ['NHIEU_THE', 'HANG_CHI_CAP', 'GOI_HANG_KHONG_BAN', 'DA_CO_HANG_CAO_HON']), MA_THE_HD.join(','));
    const { CAN_TU_POS } = await nap('src/kiemKhop/canTuPos.js');
    const ql = CAN_TU_POS.find((x) => x.cua === 'GET /hang' && x.truong.includes('data[].quyen_loi'));
    k('A2 canTuPos: GET /hang data[].quyen_loi (co:true, viec_pos KH-THE-1)', !!ql && ql.co === true && ql.viec_pos === 'KH-THE-1');
    const the = CAN_TU_POS.filter((x) => x.viec_pos === 'KH-THE-1' && x.co === true).map((x) => x.cua);
    k('A2 canTuPos: dòng thẻ của POST /gio/bao-gia và POST /don (co:true, viec_pos KH-THE-1)', the.includes('POST /gio/bao-gia') && the.includes('POST /don'), the.join(', '));
  });

  const G = await nap('src/gio.js'), D = await nap('src/datDon.js'), H = await nap('src/giaHang.js'), DD = await nap('src/duongDan.js'), B = await nap('src/baoDonXong.js');

  console.log('C1 / C2 — giỏ có dòng thẻ');
  await thu('C1', async () => {
    const a = G.themThe([LY()], 2, 3);
    k('C1 themThe thêm dòng { loai, hang_id, so_thang } cuối giỏ, không giá / ghi chú', bang(a.gio, [LY(), THE(2, 3)]) && a.doi === false, JSON.stringify(a));
    const b = G.themThe(a.gio, 2, 1);
    k('C1 thêm thẻ khác → THAY dòng cũ tại chỗ, doi = true (một dòng thẻ)', bang(b.gio, [LY(), THE(2, 1)]) && b.doi === true, JSON.stringify(b));
    const c = G.themThe(b.gio, 2, 1);
    k('C1 thêm lại đúng thẻ đang có → giữ nguyên, doi = false', bang(c.gio, b.gio) && c.doi === false);
    const kho = khoGia({ kh_gio: JSON.stringify([LY('TLB', 2, 'ít ngọt'), { ma: 'EPC', so_luong: 1 }]) });
    k('C1 bản lưu cũ (chỉ dòng món) đọc như cũ — ba trường', bang(G.docGio(kho), [LY('TLB', 2, 'ít ngọt'), LY('EPC', 1, '')]));
    const hong1 = [{ loai: 'the', hang_id: 2 }, { loai: 'the', hang_id: 2, so_thang: 0 }, { loai: 'the', hang_id: 2, so_thang: 3, ma: 'X' }, { loai: 'the', hang_id: 'x', so_thang: 3 }, { loai: 'goi', hang_id: 2, so_thang: 3 }];
    k('C1 dòng thẻ hỏng (thiếu so_thang, so_thang 0, thừa ma, hang_id sai, loai lạ) → bỏ', bang(G.docGio(khoGia({ kh_gio: JSON.stringify([LY(), ...hong1]) })), [LY()]));
    k('C1 kho có hai dòng thẻ → giữ dòng đầu', bang(G.docGio(khoGia({ kh_gio: JSON.stringify([THE(2, 3), LY(), THE(2, 1)]) })), [THE(2, 3), LY()]));
    const k2 = khoGia();
    G.ghiGio([THE(2, 3), LY()], k2);
    k('C1 ghiGio lưu dòng thẻ đúng 3 khoá, dòng món 3 trường', k2.d.kh_gio === JSON.stringify([THE(2, 3), LY()]), k2.d.kh_gio);
    k('C1 demMon: dòng thẻ đếm 1', G.demMon([LY('TLB', 2), THE()]) === 3);
    k('C1 themMon không đụng dòng thẻ', bang(G.themMon([THE(), LY()], 'TLB', 1, ''), [THE(), LY('TLB', 2)]));
    k('C1 Hoàn tác xoá thẻ: chenDong trả dòng thẻ về chỗ cũ; giỏ đã có thẻ khác → thay', bang(G.chenDong([LY()], THE(), 0), [THE(), LY()]) && bang(G.chenDong([LY(), THE(2, 1)], THE(2, 3), 0), [LY(), THE(2, 3)]));
    k('C1 coDoUong / laThe', G.coDoUong([THE(), LY()]) === true && G.coDoUong([THE()]) === false && G.laThe(THE()) === true && G.laThe(LY()) === false);
  });
  await thu('C2', async () => {
    const tt = G.trangThaiDong(THE(2, 3), MENU_DS, HANG);
    k('C2 trangThaiDong dòng thẻ còn bán → { hang, goi, conBan: true }', tt.conBan === true && tt.hang && tt.hang.id === 2 && tt.goi && tt.goi.gia === 199000, JSON.stringify(tt));
    const boGoi = HANG.map((h) => (h.id === 2 ? { ...h, goi: [{ so_thang: 1, gia: 79000 }] } : h));
    const thanhChiCap = HANG.map((h) => (h.id === 2 ? { ...h, chi_cap: true, goi: [] } : h));
    k('C2 hạng mất / thành chỉ cấp / bỏ gói → không còn bán, chặn Thanh toán', !G.duocThanhToan([THE(2, 3)], MENU_DS, HANG.filter((h) => h.id !== 2)) && !G.duocThanhToan([THE(2, 3)], MENU_DS, thanhChiCap) && !G.duocThanhToan([THE(2, 3)], MENU_DS, boGoi));
    k('C2 thẻ còn bán + món còn bán → được Thanh toán; giỏ chỉ thẻ khi chưa có menu vẫn được', G.duocThanhToan([LY(), THE(2, 1)], MENU_DS, HANG) && G.duocThanhToan([THE(2, 1)], [], HANG));
    k('C2 /hang chưa có (null) → dòng thẻ chưa bán được', !G.duocThanhToan([THE(2, 1)], MENU_DS, null));
    k('C2 K5 giỏ chỉ món gọi hai tham số như cũ', G.duocThanhToan([LY()], MENU_DS) === true && G.duocThanhToan([LY('XX')], MENU_DS) === false);
  });

  console.log('C3 / C4 / C5 / C7 — đặt đơn');
  await thu('C4', async () => {
    const t = D.thanBaoGia([LY('TLB', 2, 'ít ngọt'), THE(2, 3), LY('EPC', 1, '')], { maGiam: 'GIAM10' });
    k('C4 thân: dòng thẻ ĐÚNG { loai, hang_id, so_thang }; dòng món không có loai; giữ thứ tự giỏ', bang(t.mon, [{ ma: 'TLB', so_luong: 2, ghi_chu: 'ít ngọt' }, { loai: 'the', hang_id: 2, so_thang: 3 }, { ma: 'EPC', so_luong: 1 }]), JSON.stringify(t.mon));
    k('C4 K5 mã giảm + cách nhận như cũ cho thân cả giỏ', t.ma_giam === 'GIAM10' && t.cach_nhan === 'tai_quan');
    const d = D.thanDatDon([LY(), THE()], { maGiam: '' }, { cachTra: 'vi', pin: '1357', khoaGui: 'K'.repeat(20), tongDaXem: 226000 });
    k('C4 thân đặt đơn giữ khoa_gui / tong_da_xem / cach_tra / pin', d.khoa_gui === 'K'.repeat(20) && d.tong_da_xem === 226000 && d.cach_tra === 'vi' && d.pin === '1357' && !('ma_giam' in d));
    const g = [LY('TLB', 2), THE(2, 3), LY('EPC', 1)];
    const sau = G.boDongDaGui([...g, LY('TLB', 1, 'nóng')], D.thanBaoGia(g).mon);
    k('C4 dọn sau khi trả: bỏ ĐÚNG các dòng đã gửi, giữ dòng khách thêm sau', bang(sau, [LY('TLB', 1, 'nóng')]), JSON.stringify(sau));
    k('C4 đơn cả giỏ → giỏ rỗng như cũ', bang(G.boDongDaGui(g, D.thanBaoGia(g).mon), []));
    k('C4 khách tăng số lượng sau khi gửi → chỉ trừ phần đã gửi', bang(G.boDongDaGui([LY('TLB', 3)], [{ ma: 'TLB', so_luong: 2 }]), [LY('TLB', 1)]));
  });
  await thu('C3', async () => {
    const g = [LY('TLB', 2), THE(2, 3)];
    const p = D.phanGui(g, { maGiam: 'GIAM10' }, true);
    k('C3 "trả thẻ trước": giỏ con CHỈ dòng thẻ, KHÔNG ma_giam', bang(p.gio, [THE(2, 3)]) && !('ma_giam' in D.thanBaoGia(p.gio, p.tuy)), JSON.stringify(p));
    const q = D.phanGui(g, { maGiam: 'GIAM10' }, false);
    k('C3 K5 Thanh toán thường: cả giỏ + mã giảm như cũ', bang(q.gio, g) && q.tuy.maGiam === 'GIAM10');
    k('C3 trả thẻ trước xong → đồ uống còn nguyên trong giỏ', bang(G.boDongDaGui(g, D.thanBaoGia(p.gio, p.tuy).mon), [LY('TLB', 2)]));
  });
  await thu('C5', async () => {
    const dong = { dang_mo: false, nhan_don: true, thong_bao: 'Quán đã đóng cửa' };
    k('C5 giỏ CHỈ thẻ: không bị chặn ngoài giờ', D.chanDatGio(dong, [THE()]) === '' && D.chanDatGio({ nhan_don: false, dang_mo: true }, [THE()]) === '');
    k('C5 giỏ có đồ uống (kèm thẻ hay không) vẫn chặn như cũ', D.chanDatGio(dong, [THE(), LY()]) === 'Quán đã đóng cửa' && D.chanDatGio(dong, [LY()]) === 'Quán đã đóng cửa');
    k('C5 K5 chanDat cũ không đổi', D.chanDat(dong) === 'Quán đã đóng cửa' && D.chanDat({ dang_mo: true, nhan_don: true }) === '');
    k('C5 bảng MA_THE = 4 mã của hợp đồng', bang([...D.MA_THE].sort(), [...MA_THE_HD].sort()));
    k('C5 4 mã thẻ → chắc chưa tạo (không "chưa rõ"), laLoiThe đúng', MA_THE_HD.length === 4 && MA_THE_HD.every((c) => D.loaiLoi(loi(400, c)) === 'chua_tao' && D.laLoiThe(loi(400, c))) && !D.laLoiThe(loi(400, 'DON_KHONG_HOP_LE')) && !D.laLoiThe(loi(400, 'HET_HANG')));
  });
  await thu('C7', async () => {
    k('C7 daThanhToan: da_tra / dang_lam / xong → đã trả; cho_tra / da_huy / rỗng → chưa', ['da_tra', 'dang_lam', 'xong', 'dang_giao', 'da_giao'].every(D.daThanhToan) && !['cho_tra', 'da_huy', '', undefined].some(D.daThanhToan));
    const g = { khoa_gui: 'K'.repeat(20), than: { mon: [] }, ma_don: 'TQD42' };
    const ds = (tt) => [{ ma: 'TQD41', tien_trinh: 'xong' }, { ma: 'TQD42', tien_trinh: tt }];
    k('C7 maDonDaTra: bản ghi có đơn, kho /don thấy đã trả → mã đơn', D.maDonDaTra(g, ds('xong')) === 'TQD42' && D.maDonDaTra(g, ds('da_tra')) === 'TQD42');
    k('C7 đơn còn chờ trả / huỷ / không có trong ds → ""', D.maDonDaTra(g, ds('cho_tra')) === '' && D.maDonDaTra(g, ds('da_huy')) === '' && D.maDonDaTra(g, [{ ma: 'TQD9', tien_trinh: 'xong' }]) === '');
    k('C7 đúng MỘT lần: bản ghi đã xong / chưa có mã đơn / không bản ghi / ds lỗi → ""', D.maDonDaTra({ ...g, xong: true }, ds('xong')) === '' && D.maDonDaTra({ ...g, ma_don: undefined }, ds('xong')) === '' && D.maDonDaTra(null, ds('xong')) === '' && D.maDonDaTra(g, null) === '');
    const app = doc('src/App.jsx'), td = doc('src/pages/TheoDoiDon.jsx');
    k('C7 Theo dõi đơn dùng daThanhToan (không viết lại điều kiện)', /daThanhToan\(tt\)/.test(td) && !/tt !== 'cho_tra' && tt !== 'da_huy'/.test(td));
    k('C7 App đọc kho cuaDon và gọi daTra theo maDonDaTra; daTra dọn bằng boDongDaGui', /maDonDaTra\(/.test(app) && /cuaDon\.kho/.test(app) && /const daTra = [^\n]*boDongDaGui\(/.test(app) && !/const daTra = [^\n]*doiGio\(\[\]\)/.test(app));
  });

  console.log('D — sau khi trả');
  await thu('D', async () => {
    const r = { don: { ma: 'TQD43', tien_trinh: 'xong', mon: [{ ma: null, ten: '🎟️ Thẻ hội viên Vàng · 3 tháng', so_luong: 1, don_gia: 199000, thanh_tien: 199000, ghi_chu: null, loai: 'the' }], hoa_don: [{ loai: 'the', trai: '1 x Thẻ hội viên Vàng · 3 tháng', phai: '199.000', ghi_chu: 'Hạn mới: 15/02/2027' }] } };
    const don = D.docDon(r);
    k('D2 docDon giữ loai của mon[]', don && don.mon[0].loai === 'the');
    k('D2 laDonChiThe: mọi dòng là thẻ → true; có ly → false; rỗng → false', D.laDonChiThe(don) === true && D.laDonChiThe({ mon: [{ loai: 'the' }, { ma: 'TLB', loai: '' }] }) === false && D.laDonChiThe({ mon: [] }) === false);
    k('D2 hanMoiThe: nguyên chữ POS ở hoa_don[] dòng thẻ', D.hanMoiThe({ ...don, hoa_don: r.don.hoa_don }) === 'Hạn mới: 15/02/2027' && D.hanMoiThe({ hoa_don: [] }) === '');
    const nho = { thay: [], bao: [] };
    const a = B.xemDanhSach([{ ma: 'TQD43', tien_trinh: 'cho_tra' }], nho);
    const b = B.xemDanhSach([{ ma: 'TQD43', tien_trinh: 'xong' }], a.nho);
    k('D2 đơn chỉ thẻ đi cho_tra → xong: KHÔNG báo "mời ra quầy"', b.choBao.length === 0 && !a.dangChay);
    k('D3 Đặt lại bỏ dòng thẻ (ma null) — không thêm thẻ vào giỏ', bang(D.monDatLai({ mon: [...don.mon, { ma: 'TLB', so_luong: 1, ghi_chu: '' }] }, MENU_DS), { them: [LY()], boQua: 1 }));
  });

  console.log('B / D4 / E1 — hạng, gói, nhắc gia hạn');
  await thu('B2', async () => {
    const vang = HANG[1], kc = HANG[2];
    k('B2 goiBan: hạng bán → gói hợp lệ; chỉ cấp → []', bang(H.goiBan(vang), vang.goi) && bang(H.goiBan(kc), []) && bang(H.goiBan({ goi: [{ so_thang: 0, gia: 1 }, { so_thang: 2, gia: -1 }] }), []));
    k('B2 tiết kiệm: 3 tháng = 79.000 × 3 − 199.000 = 38.000; gói đầu / không lợi → null', H.tietKiem(vang.goi, vang.goi[1]) === 38000 && H.tietKiem(vang.goi, vang.goi[0]) === null && H.tietKiem([{ so_thang: 1, gia: 100 }, { so_thang: 2, gia: 250 }], { so_thang: 2, gia: 250 }) === null);
    k('B2 gói mặc định = gói dài nhất', H.goiMacDinh(vang).so_thang === 3 && H.goiMacDinh(kc) === null);
    const n = (toi, h) => H.nutMua(HANG, toi, h);
    k('B2 chưa có hạng → Mua', n(null, vang).kieu === 'mua');
    k('B2 đang có đúng hạng này → Gia hạn (hạn cộng nối)', n({ id: 2, ten: 'Vàng' }, vang).kieu === 'giaHan');
    k('B2 hạng chỉ cấp → mờ, lý do chiCap', n(null, kc).kieu === 'mo' && n(null, kc).lyDo === 'chiCap');
    k('B2 khách có hạng thu_bac CAO hơn → mờ, lý do caoHon + tên hạng khách', n({ id: 3, ten: 'Kim cương' }, vang).kieu === 'mo' && n({ id: 3, ten: 'Kim cương' }, vang).lyDo === 'caoHon' && n({ id: 3, ten: 'Kim cương' }, vang).hang === 'Kim cương');
    k('B2 hạng không gói → mờ "Chưa mở bán"; K5 hạng thấp hơn mua hạng cao được', n(null, { ...vang, goi: [] }).lyDo === 'chuaBan' && n({ id: 1, ten: 'Bạc' }, vang).kieu === 'mua');
    k('B2 lớp màu thẻ demo l0 / l1 / l2: chưa hạng / hạng bán / hạng chỉ cấp', H.lopHang(null, HANG) === 'l0' && H.lopHang({ id: 2 }, HANG) === 'l1' && H.lopHang({ id: 3 }, HANG) === 'l2');
  });
  await thu('D4', async () => {
    const toi = (het_han, id = 2) => ({ id, ten: id === 3 ? 'Kim cương' : 'Vàng', het_han });
    const bay = '2026-11-13T20:30:00';
    k('D4 hằng NGAY_NHAC_GIA_HAN = 7 (một chỗ)', H.NGAY_NHAC_GIA_HAN === 7 && (doc('src/giaHang.js').match(/NGAY_NHAC_GIA_HAN\s*=/g) || []).length === 1);
    k('D4 soNgayCon theo ngày lịch giờ VN', H.soNgayCon('2026-11-20T23:59:59', bay) === 7 && H.soNgayCon('2026-11-13 08:00:00', bay) === 0 && H.soNgayCon('2026-11-12T23:59:59', bay) < 0 && H.soNgayCon('', bay) === null);
    const nh = (h) => H.nhacGiaHan(HANG, h, bay);
    k('D4 còn 7 ngày → nhắc { id, ten, soNgay: 7 }', bang(nh(toi('2026-11-20T23:59:59')), { id: 2, ten: 'Vàng', soNgay: 7 }), JSON.stringify(nh(toi('2026-11-20T23:59:59'))));
    k('D4 còn 8 ngày → không nhắc', nh(toi('2026-11-21T23:59:59')) === null);
    k('D4 còn 0 ngày (hết hạn hôm nay) → nhắc soNgay 0', !!nh(toi('2026-11-13T23:59:59')) && nh(toi('2026-11-13T23:59:59')).soNgay === 0);
    k('D4 het_han null / chỉ cấp / không hạng / chưa biết giờ → không nhắc', nh(toi(null)) === null && nh(toi('2026-11-15T23:59:59', 3)) === null && nh(null) === null && H.nhacGiaHan(HANG, toi('2026-11-15T23:59:59'), '') === null);
  });
  await thu('E1', async () => {
    k('E1 hangBanDuoc: bỏ 0 % / chỉ cấp / không gói', bang(H.hangBanDuoc(HANG).map((h) => h.id), [2]) && bang(H.hangBanDuoc([...HANG, { ...HANG[1], id: 9, goi: [] }]).map((h) => h.id), [2]));
    k('E1 giaRe = giá gói rẻ nhất', H.giaRe(HANG[1]) === 79000 && H.giaRe(HANG[2]) === null);
    const M = await nap('src/menuLoc.js');
    k('E1 tìm kiếm món không ra thẻ (thẻ không nằm trong danh sách món)', M.timMon(MENU_DS, 'thẻ').length === 0);
    k('E1 Menu có ô nhóm "Thẻ thành viên" (slug the-thanh-vien) vẽ từ hangBanDuoc', /the-thanh-vien/.test(doc('src/pages/Menu.jsx')) && /hangBanDuoc\(/.test(doc('src/pages/Menu.jsx')));
  });

  console.log('B1 — đường dẫn');
  await thu('B1', async () => {
    const r = DD.docDuongDan('/uudai/hang?h=2');
    k('B1 /uudai/hang?h=2 → trang hang, tab uudai, cha /uudai, KHÔNG cần đăng nhập, chuan giữ ?h=2', r.trang === 'hang' && r.tab === 'uudai' && r.cha === '/uudai' && r.canDN === false && r.tham.h === '2' && r.chuan === '/uudai/hang?h=2', JSON.stringify(r));
    k('B1 /uudai/hang (không h) → chuan /uudai/hang; tham số lạ bỏ', DD.docDuongDan('/uudai/hang').chuan === '/uudai/hang' && DD.docDuongDan('/uudai/hang?x=1&h=<b>').chuan === '/uudai/hang');
    k('B1 taoDuongDan(hang, { h }) và (thanhtoan, { chi: the })', DD.taoDuongDan('hang', { h: 3 }) === '/uudai/hang?h=3' && DD.taoDuongDan('thanhtoan', { chi: 'the' }) === '/thanhtoan?chi=the' && DD.taoDuongDan('thanhtoan') === '/thanhtoan');
    const tt = DD.docDuongDan('/thanhtoan?chi=the');
    k('B1 /thanhtoan?chi=the → tham.chi = the; giá trị lạ bỏ', tt.trang === 'thanhtoan' && tt.tham.chi === 'the' && tt.chuan === '/thanhtoan?chi=the' && DD.docDuongDan('/thanhtoan?chi=x').chuan === '/thanhtoan');
    k('B1 đăng nhập xong quay về đúng ?h= / ?chi=the (tiepHopLe giữ truy vấn)', DD.tiepHopLe('/uudai/hang?h=2') === '/uudai/hang?h=2' && DD.tiepHopLe('/thanhtoan?chi=the') === '/thanhtoan?chi=the' && DD.docDuongDan(DD.taoDuongDan('dangnhap', { tiep: '/uudai/hang?h=2' })).tham.tiep === '/uudai/hang?h=2');
    k('B1 tiêu đề tab trình duyệt có tên màn Hạng thành viên', /Hạng thành viên/.test(DD.tieuDeTrang('hang')));
  });

  console.log('F1 — danh mục nội dung');
  await thu('F1', async () => {
    const ND = await nap('src/noiDung/nd.js'), IDX = await nap('src/noiDung/nd/index.js');
    k('F1 kiemDanhMuc toàn bộ danh mục không lỗi', ND.kiemDanhMuc(IDX.DANH_MUC).length === 0, ND.kiemDanhMuc(IDX.DANH_MUC).slice(0, 3).join(' | '));
    k('F1 có nhóm theHang.js (một dòng thêm vào index.js) + đích hang', /from '\.\/theHang\.js'/.test(docTho('src/noiDung/nd/index.js')) && IDX.DICH.some((d) => d[0] === 'hang' && d[1] === 'Ưu đãi · Hạng thành viên'));
    const khoa = new Set(IDX.DANH_MUC.map((m) => m.khoa));
    const tep = ['src/pages/HangThanhVien.jsx', 'src/components/TheHoiVien.jsx', 'src/pages/GioHang.jsx', 'src/pages/ThanhToan.jsx', 'src/pages/TheoDoiDon.jsx', 'src/pages/TrangChu.jsx', 'src/pages/UuDai.jsx', 'src/pages/Menu.jsx', 'src/App.jsx', 'src/gio.js', 'src/datDon.js', 'src/giaHang.js'];
    const dung = tep.flatMap((f) => [...doc(f).matchAll(/(?:nd|ndPhan|ndDau|ndHien|ndNut|ndAnh|ndDs)\('([\w.]+)'|\bk="([\w.]+)"|khoaDau:\s*'([\w.]+)'/g)].map((m) => m[1] || m[2] || m[3]));
    const thieu = [...new Set(dung)].filter((x) => !khoa.has(x));
    k('F1 mọi khoá nội dung các màn đụng tới đều có trong danh mục', dung.length > 50 && thieu.length === 0, thieu.join(', '));
    const can = ['tieuDe.hang', 'tier.tieuDe', 'tier.buynote', 'tier.hienTai', 'tier.cmp', 'tier.nut.mua', 'tier.nut.giaHan', 'tier.daThem', 'tier.daDoi', 'tier.pos', 'tier.tutinh', 'hien.tier.cmp', 'gio.the.ten', 'gio.truocThe.nut', 'td.the.xong', 'td.the.veGio', 'menu.the.ten', 'home.nhac.giaHan', 'hien.nhacGiaHan', 'ud.hang.nutCo', 'ud.hang.nutMua'];
    k('F1 các khoá mới của việc có trong danh mục', can.every((x) => khoa.has(x)), can.filter((x) => !khoa.has(x)).join(', '));
    const mk = IDX.DANH_MUC.filter((m) => ['tier.pos', 'tier.tutinh', 'home.nhac.so'].includes(m.khoa));
    k('F1 phần POS → khoá pos; tiết kiệm / số ngày còn → khoá tutinh', mk.length === 3 && mk.find((m) => m.khoa === 'tier.pos').khoaBoi === 'pos' && mk.filter((m) => m.khoa !== 'tier.pos').every((m) => m.khoaBoi === 'tutinh'));
    k('F1 Trang chủ mở được đích hang (bảng DICH của màn)', /\bhang:\s*\w+/.test((/const DICH = \{[^\n]*\}/.exec(doc('src/pages/TrangChu.jsx')) || [''])[0]));
  });

  console.log('Phần 2 — App thật trong Chromium');
  let pw = null;
  if (process.env.KHONG_TRINH_DUYET === '1') console.log('  BỎ QUA: KHONG_TRINH_DUYET=1 — các ca trong trình duyệt không chạy ở đây');
  else {
    try { pw = require('playwright'); } catch { /* không có */ }
    if (!pw) console.log('  BỎ QUA: không có Playwright ở máy này — các ca trong trình duyệt CHƯA chạy');
    else await thu('Chromium', () => trinhDuyet(pw));
  }
  console.log(`  (chạy hết ${Math.round(process.uptime())} giây — bộ kiểm cắt ở 120 giây)`);
  console.log(`\n${dat} đạt · ${hong} hỏng`);
  process.exit(hong ? 1 : 0);
})().catch((e) => { console.error(e); console.log(`\n${dat} đạt · ${hong + 1} hỏng`); process.exit(1); });

async function trinhDuyet() {
  k('Chromium: chưa viết', false);
}
