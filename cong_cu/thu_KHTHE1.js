#!/usr/bin/env node
// THỬ KH-THE-1 — bán thẻ hạng trên App (hợp đồng v13): thân báo giá / đặt đơn có dòng thẻ, dọn giỏ đúng dòng đã gửi ở MỌI nơi (C7),
// (KH-THE-2: thẻ KHÔNG vào giỏ nữa, "trả thẻ trước" bỏ — các ca đó sửa theo hành vi mới; luồng mua thẻ trong trình duyệt ở thu_KHTHE2.js),
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

  console.log('C1 / C2 — dòng thẻ (KH-THE-2: không vào giỏ)');
  await thu('C1', async () => {
    k('C1 (KH-THE-2) gio.js không còn themThe — Mua ngay đi thẳng Thanh toán thẻ', !('themThe' in G));
    const kho = khoGia({ kh_gio: JSON.stringify([LY('TLB', 2, 'ít ngọt'), { ma: 'EPC', so_luong: 1 }]) });
    k('C1 bản lưu cũ (chỉ dòng món) đọc như cũ — ba trường', bang(G.docGio(kho), [LY('TLB', 2, 'ít ngọt'), LY('EPC', 1, '')]));
    k('C1 (KH-THE-2) bản lưu cũ có dòng thẻ (đúng dạng hay hỏng) → bỏ dòng thẻ, giữ món', bang(G.docGio(khoGia({ kh_gio: JSON.stringify([THE(2, 3), LY(), { loai: 'the', hang_id: 2 }, THE(2, 1)]) })), [LY()]));
    const k2 = khoGia();
    G.ghiGio([THE(2, 3), LY()], k2);
    k('C1 (KH-THE-2) ghiGio không lưu dòng thẻ', k2.d.kh_gio === JSON.stringify([LY()]), k2.d.kh_gio);
    k('C1 demMon / themMon / chenDong dòng món như cũ', G.demMon([LY('TLB', 2)]) === 2 && bang(G.themMon([LY()], 'TLB', 1, ''), [LY('TLB', 2)]) && bang(G.chenDong([LY('EPC')], LY(), 0), [LY(), LY('EPC')]));
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
    const g = [LY('TLB', 2), LY('EPC', 1)];
    const sau = G.boDongDaGui([...g, LY('TLB', 1, 'nóng')], D.thanBaoGia(g).mon);
    k('C4 dọn sau khi trả: bỏ ĐÚNG các dòng đã gửi, giữ dòng khách thêm sau', bang(sau, [LY('TLB', 1, 'nóng')]), JSON.stringify(sau));
    k('C4 đơn cả giỏ → giỏ rỗng như cũ', bang(G.boDongDaGui(g, D.thanBaoGia(g).mon), []));
    k('C4 (KH-THE-2) đơn thẻ trả xong → giỏ đồ uống giữ nguyên', bang(G.boDongDaGui(g, [THE(2, 3)]), g));
    k('C4 khách tăng số lượng sau khi gửi → chỉ trừ phần đã gửi', bang(G.boDongDaGui([LY('TLB', 3)], [{ ma: 'TLB', so_luong: 2 }]), [LY('TLB', 1)]));
  });
  await thu('C3', async () => {
    k('C3 (KH-THE-2) không còn "trả thẻ trước": datDon.js không còn phanGui; đơn có thẻ không dùng ví (dungViCho)', !('phanGui' in D) && D.dungViCho([THE()], true) === false && D.dungViCho([LY()], true) === true);
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
    const app = doc('src/App.jsx'), td = doc('src/pages/TheoDoiDon.jsx'), tt = doc('src/pages/ThanhToan.jsx');
    k('C7 Thanh toán: nút đặt KHOÁ ngay trong lần vẽ thấy đơn đã trả (khoa có !!maXong — không chờ effect dọn giỏ; soát v3)', /const khoa = [^\n]*\|\| !!maXong;/.test(tt));
    k('E2 nút Ưu đãi không truyền sự kiện bấm làm tham số hạng (onClick bọc hàm; soát v3)', /onClick=\{\(\) => mo\(\)\}/.test(doc('src/pages/UuDai.jsx')) && !/onClick=\{mo\}/.test(doc('src/pages/UuDai.jsx')));
    k('C7 Thanh toán (GET /don riêng) cũng dọn giỏ qua maDonDaTra + daTra và khoá nút khi thấy đơn đã trả (soát v1 lỗi 1)', /maDonDaTra\((docGuiDo\(\)|guiDo), [^)]*dsDon/.test(tt) && /daTra\(/.test(tt) && /daTra=\{daTra\}/.test(app));
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
    k('D3 Đặt lại bỏ dòng thẻ (ma null) — không thêm thẻ vào giỏ, KHÔNG đếm thẻ là "món không còn bán" (soát v1 lỗi 5)', bang(D.monDatLai({ mon: [...don.mon, { ma: 'TLB', so_luong: 1, ghi_chu: '' }] }, MENU_DS), { them: [LY()], boQua: 0 }) && bang(D.monDatLai({ mon: [{ ma: 'XX', so_luong: 1 }, ...don.mon] }, MENU_DS), { them: [], boQua: 1 }));
    const gThe = { khoa_gui: 'K'.repeat(20), ma_don: 'TQD43', than: { mon: [THE(2, 3)] } }, gTron = { ...gThe, than: { mon: [{ ma: 'TLB', so_luong: 1 }, THE(2, 3)] } };
    k('D2 hạng của màn chúc mừng lấy từ dòng thẻ đã gửi + /hang (không chờ /toi — soát v1 lỗi 3; KH-THE-2 trả bản ghi hạng)', D.hangCuaDon(gThe, HANG).ten === 'Vàng' && D.hangCuaDon(gTron, HANG).ten === 'Vàng' && D.hangCuaDon(null, HANG) === null && D.hangCuaDon(gThe, null) === null);
    k('D2 App không còn truyền tên hạng từ kho /toi cho Theo dõi đơn', !/hangMoi=\{hk/.test(doc('src/App.jsx')) && /hangCuaDon\(/.test(doc('src/pages/TheoDoiDon.jsx')));
    k('C3 (KH-THE-2) "Tạo mã mới" đơn chỉ thẻ → Thanh toán thẻ đúng hạng + gói (thamTaoMaMoi); đơn có ly → Thanh toán giỏ', !('thamThanhToanLai' in D) && bang(D.thamTaoMaMoi(gThe), { trang: 'thanhtoanthe', tham: { h: 2, thang: 3 } }) && bang(D.thamTaoMaMoi(gTron), { trang: 'thanhtoan', tham: {} }) && /thamTaoMaMoi\(banGhiCuaDon\(/.test(doc('src/App.jsx')));
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
    k('B2 (KH-THE-2) thẻ xám "Hạng hiện tại" bỏ: giaHang.js không còn lopHang', !('lopHang' in H));
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

  await thu('R', async () => {
    const hv = doc('src/pages/HangThanhVien.jsx');
    const than = (/export default function HangThanhVien[\s\S]*$/.exec(hv) || [''])[0];
    k('B1 màn Hạng thành viên: phần chung KHÔNG gọi /toi (dungCua) — chỉ phần vẽ khi đã biết khách (soát v1 lỗi 4; KH-THE-2: dòng phụ PhuToi)', !!than && !/dungCua\(/.test(than) && /daBiet \? <PhuToi/.test(than) && /<HangThanhVien [^\n]*daBiet=\{daBiet\}/.test(doc('src/App.jsx')));
    k('C2 tên dòng thẻ của đơn chưa rõ MỘT hàm (tenDongThe) ở Thanh toán; Giỏ không còn dòng thẻ (KH-THE-2)', H.tenDongThe(THE(2, 3), HANG) === 'Thẻ hội viên Vàng · 3 tháng' && H.tenDongThe(THE(9, 3), HANG) === 'Thẻ hội viên' && /tenDongThe\(/.test(doc('src/pages/ThanhToan.jsx')) && !/tenDongThe/.test(doc('src/pages/GioHang.jsx')));
  });

  console.log('B1 — đường dẫn');
  await thu('B1', async () => {
    const r = DD.docDuongDan('/uudai/hang?h=2');
    k('B1 /uudai/hang?h=2 → trang hang, tab uudai, cha /uudai, KHÔNG cần đăng nhập, chuan giữ ?h=2', r.trang === 'hang' && r.tab === 'uudai' && r.cha === '/uudai' && r.canDN === false && r.tham.h === '2' && r.chuan === '/uudai/hang?h=2', JSON.stringify(r));
    k('B1 /uudai/hang (không h) → chuan /uudai/hang; tham số lạ bỏ', DD.docDuongDan('/uudai/hang').chuan === '/uudai/hang' && DD.docDuongDan('/uudai/hang?x=1&h=<b>').chuan === '/uudai/hang');
    k('B1 taoDuongDan(hang, { h }); (KH-THE-2) /thanhtoan không còn ?chi=the', DD.taoDuongDan('hang', { h: 3 }) === '/uudai/hang?h=3' && DD.taoDuongDan('thanhtoan', { chi: 'the' }) === '/thanhtoan' && DD.docDuongDan('/thanhtoan?chi=the').chuan === '/thanhtoan');
    k('B1 đăng nhập xong quay về đúng ?h= (tiepHopLe giữ truy vấn)', DD.tiepHopLe('/uudai/hang?h=2') === '/uudai/hang?h=2' && DD.docDuongDan(DD.taoDuongDan('dangnhap', { tiep: '/uudai/hang?h=2' })).tham.tiep === '/uudai/hang?h=2');
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
    const can = ['tieuDe.hang', 'tier.tieuDe', 'tier.note', 'tier.cmp', 'tier.nut.mua', 'tier.nut.giaHan', 'tier.pos', 'tier.tutinh', 'hien.tier.cmp', 'the.tt.dong', 'the.cm.t', 'menu.the.ten', 'home.nhac.giaHan', 'hien.nhacGiaHan', 'ud.the.nutCo', 'ud.the.nutMua']; // KH-THE-2: khoá thẻ-trong-giỏ / thẻ xám / "trả thẻ trước" đã bỏ
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

// ---- Phần 2: App thật (esbuild) + POS giả theo hợp đồng v13 (dòng thẻ, 4 mã lỗi, giỏ chỉ thẻ mọi giờ và `xong` khi đã thu, hạng lên khi đã thu).
async function trinhDuyet(pw) {
  const esbuild = require('esbuild');
  const goi = (await esbuild.build({
    stdin: { contents: `import './main.jsx';`, resolveDir: path.join(GOC, 'src'), loader: 'jsx' },
    bundle: true, write: false, format: 'iife', jsx: 'automatic', logLevel: 'silent',
    loader: { '.css': 'empty', '.json': 'json' }, define: { 'process.env.NODE_ENV': '"production"', 'import.meta.env.VITE_POS_API': '""' },
  })).outputFiles[0].text;
  const cssTron = (f) => docTho(f).replace(/@import\s+'\.\/([^']+)';/g, (_, t) => cssTron(path.posix.join(path.posix.dirname(f), t)));
  const css = [...docTho('src/main.jsx').matchAll(/import '\.\/(giaoDien\/[^']+\.css)'/g)].map((m) => cssTron('src/' + m[1])).join('\n') + fs.readdirSync(path.join(GOC, 'src/giaoDien')).filter((f) => /\.css$/.test(f) && !/^demo|giaoDien|khau_hieu/.test(f)).map((f) => docTho('src/giaoDien/' + f)).join('\n');
  const HTML = docTho('index.html').replace(/<script type="module"[^>]*><\/script>/, '<script src="/bundle.js"></script>').replace('</head>', `<style>${css}</style></head>`);
  const URL0 = 'http://kh.test', PIN = '1357', BAY = (g, d = '2026-11-13') => `${d}T${g}`;
  const anhDir = process.env.LUU_ANH_DIR || '';
  const trinh = await pw.chromium.launch({ args: ['--no-sandbox'] });
  const giaGoi = (id, n) => { const h = HANG.find((x) => x.id === id); const g = h && h.goi.find((x) => x.so_thang === n); return g ? g.gia : null; };

  async function may(ten, { dn = true, gio = null, S0 = {}, rong = 390 } = {}, chay) {
    const ctx = await trinh.newContext({ viewport: { width: rong, height: 844 }, timezoneId: 'Asia/Ho_Chi_Minh' });
    await ctx.clock.install({ time: new Date('2026-11-13T20:30:00+07:00') }); await ctx.clock.resume();
    await ctx.addInitScript(({ dn, gio }) => {
      if (location.protocol !== 'http:') return; // about:blank (Back quá trang đầu)
      if (sessionStorage.getItem('da_gieo')) return;
      sessionStorage.setItem('da_gieo', '1');
      localStorage.setItem('kh_ngay_man_dau', '2026-11-13');
      if (dn) localStorage.setItem('kh_token', 'tok-A');
      if (gio) localStorage.setItem('kh_gio', JSON.stringify(gio));
    }, { dn, gio });
    const S = { vi: 500000, hang: null, mo: true, don: new Map(), soDon: 41, guiDon: [], baoGia: [], loiThe: '', ...S0 };
    const loiTrang = [];
    const json = (r, st, o) => r.fulfill({ status: st, contentType: 'application/json', body: JSON.stringify(o) }).catch(() => {});
    const loi400 = (r, code, st = 400) => json(r, st, { error: `Lời POS giả: ${code}`, code });
    // Báo giá theo v13: dòng thẻ đúng 3 khoá (so_luong 1 được), món không loai; giá thẻ = giá gói; đồ uống theo hạng ĐANG CÓ.
    const baoGia = (t) => {
      const mon = Array.isArray(t && t.mon) ? t.mon : [];
      const the = mon.filter((m) => m && 'loai' in m);
      if (the.some((m) => m.loai !== 'the' || Object.keys(m).some((x) => !['loai', 'hang_id', 'so_thang', 'so_luong'].includes(x)))) return { loi: 'YEU_CAU_KHONG_HOP_LE' };
      if (the.length > 1) return { loi: 'NHIEU_THE' };
      const coLy = mon.some((m) => !('loai' in m));
      if (coLy && !S.mo) return { loi: 'NGOAI_GIO' };
      if (S.loiThe && the.length) return { loi: S.loiThe };
      const dong = mon.map((m) => {
        if ('loai' in m) { const gia = giaGoi(m.hang_id, m.so_thang); return { loai: 'the', hang_id: m.hang_id, so_thang: m.so_thang, ma: null, so_luong: 1, don_gia: gia, thanh_tien: gia }; }
        const x = MENU_DS.find((y) => y.ma === m.ma); const gh = S.hang && x.gia_hang.find((y) => y.hang_id === S.hang.id);
        return { ma: m.ma, so_luong: m.so_luong, don_gia: x.gia, thanh_tien: (gh ? gh.gia : x.gia) * m.so_luong, goc: x.gia * m.so_luong };
      });
      if (dong.some((d) => d.loai && d.don_gia === null)) return { loi: 'GOI_HANG_KHONG_BAN' };
      const tam = dong.reduce((s, d) => s + (d.goc || d.thanh_tien), 0), sau = dong.reduce((s, d) => s + d.thanh_tien, 0);
      const ma = t.ma_giam === 'GIAM10' ? Math.round(sau / 10) : 0; // mã 10 % theo v13 (POS tính trên tạm tính gồm thẻ) — số do POS giả quyết, App chỉ hiện
      const giam = [...(tam > sau ? [{ loai: 'hang', so_tien: tam - sau }] : []), ...(ma ? [{ loai: 'ma_giam', so_tien: ma }] : [])];
      return { dong: dong.map(({ goc, ...d }) => d), tam_tinh: tam, giam, phi_giao: 0, tong: sau - ma, ma_giam_loi: null, chiThe: !coLy };
    };
    const lenHang = (d) => { const m = d.mon.find((x) => x.loai === 'the'); if (m) S.hang = { id: m.hang_id, ten: HANG.find((h) => h.id === m.hang_id).ten, phan_tram: 10, phan_tram_nhom_dac_biet: 5, het_han: BAY('23:59:59', '2027-02-13') }; };
    const traDon = (d) => { d.tt = d.chiThe ? 'xong' : 'da_tra'; lenHang(d); };
    S.traQR = (ma) => traDon(S.don.get(ma)); // tiền QR về đủ
    const monDon = (d) => d.mon.map((m) => ('loai' in m ? { ma: null, ten: `🎟️ Thẻ hội viên ${HANG.find((h) => h.id === m.hang_id).ten} · ${m.so_thang} tháng`, so_luong: 1, don_gia: giaGoi(m.hang_id, m.so_thang), thanh_tien: giaGoi(m.hang_id, m.so_thang), ghi_chu: null, loai: 'the' }
      : { ma: m.ma, ten: MENU_DS.find((x) => x.ma === m.ma).ten, so_luong: m.so_luong, don_gia: 30000, thanh_tien: 30000 * m.so_luong, ghi_chu: m.ghi_chu || null }));
    const dongDon = (d) => ({ ma: d.ma, so_hd: 'APP00' + d.ma.slice(3), ngay: BAY('20:31:00'), tong: d.tong, da_tra: d.tt === 'cho_tra' ? 0 : d.tong, trang_thai: null, thanh_toan: null, tien_trinh: d.tt, qr: d.tt === 'cho_tra' ? (S.qrHet ? { ...d.qr, het_han: BAY('20:20:00') } : d.qr) : null, tien_ve_cho_doi_soat: false, cach_tra: d.cach, giu_vi: d.cach === 'vi' ? d.tong : 0, con_lai: d.cach === 'vi' ? 0 : d.tong });
    await ctx.route(`${URL0}/**`, async (r) => {
      const req = r.request(), u = new URL(req.url()), p = u.pathname, pt = req.method();
      if (p === '/bundle.js') return r.fulfill({ contentType: 'text/javascript', body: goi });
      if (!p.startsWith('/api/kh')) return /\.[a-z0-9]+$/.test(p) ? r.fulfill({ status: 204, body: '' }) : r.fulfill({ contentType: 'text/html', body: HTML });
      const duong = p.slice('/api/kh'.length);
      let than = null; try { than = JSON.parse(req.postData()); } catch { /* không thân */ }
      if (duong === '/gio-vang') return json(r, 200, { success: true, dang_chay: false, bat_dau: null, ket_thuc: null, phan_tram: 0, mon: [] });
      if (duong === '/hang') return json(r, 200, { success: true, data: HANG });
      if (duong === '/gio-hoat-dong') return json(r, 200, { success: true, bay_gio: BAY('20:30:00'), dang_mo: S.mo, nhan_don: true, hom_nay: { mo: '08:00', dong: '22:00' }, mo_lai_luc: null, thong_bao: S.mo ? '' : 'Quán đã đóng cửa', lich_tuan: [], ngay_nghi: [] });
      if (duong === '/menu') return json(r, 200, { success: true, data: MENU_DS });
      if (duong === '/chuong-trinh') return json(r, 200, { success: true, data: [] });
      if (!/tok-A/.test(req.headers().authorization || '')) return json(r, 401, { error: 'Phiên đăng nhập đã hết', code: 'KH_TOKEN_SAI' });
      if (duong === '/toi') return json(r, 200, { success: true, khach: { sdt: '0909123456', ten: 'Linh', ngay_tao: BAY('08:00:00'), xung_ho: 'chi', dia_chi: null, ngay_sinh: null, qr: 'QR', hang: S.hang, so_du_vi: S.vi } });
      if (duong === '/diem') return json(r, 200, { success: true, points: 0, history: [] });
      if (duong === '/voucher') return json(r, 200, { success: true, data: [], ma_khach_moi: [] });
      if (duong === '/gia-han') return json(r, 200, { success: true, token: 'tok-A', het_han: BAY('08:00:00', '2026-12-13') });
      if (duong === '/gio/bao-gia') { S.baoGia.push(than); const b = baoGia(than); return b.loi ? loi400(r, b.loi) : json(r, 200, { success: true, ...b }); }
      if (duong === '/don' && pt === 'POST') {
        S.guiDon.push(than);
        const b = baoGia(than);
        if (b.loi) return loi400(r, b.loi);
        if (than.tong_da_xem !== b.tong) return json(r, 409, { error: 'Giá đã đổi', code: 'GIA_DA_DOI', bao_gia: b });
        if (than.cach_tra !== 'qr' && than.pin !== PIN) return loi400(r, 'PIN_SAI');
        const ma = 'TQD' + ++S.soDon;
        const d = { ma, tong: b.tong, mon: than.mon, chiThe: b.chiThe, cach: than.cach_tra, tt: 'cho_tra', qr: { chuoi: '0002010102123857' + ma, het_han: BAY('20:40:00') } };
        if (than.cach_tra === 'vi') { S.vi -= b.tong; traDon(d); }
        S.don.set(ma, d);
        return json(r, 200, { success: true, ma_don: ma, so_hd: 'APP00' + ma.slice(3), tong: b.tong, giu_vi: d.cach === 'vi' ? b.tong : 0, con_lai: d.cach === 'vi' ? 0 : b.tong, tien_trinh: d.tt, qr: d.tt === 'cho_tra' ? d.qr : null, trung: false });
      }
      const huy = /^\/don\/([^/]+)\/huy$/.exec(duong);
      if (huy && pt === 'POST') { const d = S.don.get(decodeURIComponent(huy[1])); if (!d || d.tt !== 'cho_tra') return loi400(r, 'DA_TRA_GOI_QUAN'); d.tt = 'da_huy'; return json(r, 200, { success: true, ma_don: d.ma, tien_trinh: 'da_huy' }); }
      if (duong.startsWith('/don/') && pt === 'GET') {
        const d = S.don.get(decodeURIComponent(duong.slice(5)));
        if (!d) return json(r, 404, { error: 'Không thấy đơn', code: 'KHONG_THAY_DON' });
        const the = d.mon.find((m) => 'loai' in m);
        return json(r, 200, { success: true, don: { ...dongDon(d), mon: monDon(d), hoa_don: the && d.tt !== 'cho_tra' ? [{ loai: 'the', trai: '1 x Thẻ hội viên', phai: '199.000', ghi_chu: 'Hạn mới: 13/02/2027' }] : [] } });
      }
      if (duong === '/don' && pt === 'GET') return json(r, 200, { success: true, trang: 1, con_nua: false, data: [...S.don.values()].reverse().map(dongDon) });
      return json(r, 500, { error: 'chưa giả', code: 'LOI_MAY_CHU' });
    });
    const t = await ctx.newPage(); t.on('pageerror', (e) => loiTrang.push(e.message)); t.setDefaultTimeout(6000);
    try { await chay({ t, S, ctx }); } catch (e) { k(`[${ten}] dừng giữa chừng`, false, String(e && e.message).split('\n')[0]); }
    k(`[${ten}] trang không báo lỗi JS`, loiTrang.length === 0, loiTrang[0]);
    await ctx.close();
  }
  const mo = async (t, duong) => { await t.goto(URL0 + duong); await t.waitForSelector('.phone'); };
  const chu = (t, sel) => t.locator(sel).first().innerText().catch(() => '');
  const doi = async (t, fn, ms = 6000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await fn()) return true; await t.waitForTimeout(40); } return false; };
  const doiChu = (t, sel, mau, ms) => doi(t, async () => mau.test(await chu(t, sel)), ms);
  const gioMay = (t) => t.evaluate(() => JSON.parse(localStorage.getItem('kh_gio') || '[]'));
  const chup = async (t, ten) => { if (anhDir) await t.screenshot({ path: path.join(anhDir, ten + '.png') }); };
  const nutDat = (t) => t.locator('#checkout .nut-dat').first();

  await may('C7 dọn giỏ khi Theo dõi đơn không mở', { gio: [LY('TLB', 2)] }, async ({ t, S }) => { // KH-THE-2: giỏ chỉ đồ uống
    await mo(t, '/thanhtoan');
    await doi(t, async () => (await nutDat(t).getAttribute('aria-disabled')) !== 'true' && /Thanh toán qua QR/.test(await nutDat(t).innerText()));
    await nutDat(t).click();
    await doi(t, async () => /\/don\/TQD42/.test(t.url()));
    await mo(t, '/trangchu'); // rời Theo dõi đơn
    await t.evaluate(() => { const g = JSON.parse(localStorage.getItem('kh_gio')); g.push({ ma: 'EPC', so_luong: 1, ghi_chu: '' }); localStorage.setItem('kh_gio', JSON.stringify(g)); });
    await t.reload(); await t.waitForSelector('#home');
    await t.waitForTimeout(400);
    k('C7 CR đơn còn chờ trả → giỏ giữ nguyên', bang(await gioMay(t), [LY('TLB', 2), LY('EPC', 1)]));
    S.traQR('TQD42');
    await t.reload(); await t.waitForSelector('#home'); // mở App lại: kho /don thấy đơn đã trả
    k('C7 CR kho /don thấy đơn đã trả (không mở Theo dõi đơn) → giỏ bỏ ĐÚNG dòng đã gửi, giữ dòng thêm sau', await doi(t, async () => bang(await gioMay(t), [LY('EPC', 1)])), JSON.stringify(await gioMay(t)));
    await t.evaluate(() => { localStorage.setItem('kh_gio', JSON.stringify([{ ma: 'TLB', so_luong: 2, ghi_chu: '' }])); });
    await t.reload(); await t.waitForSelector('#home'); await t.waitForTimeout(400);
    k('C7 CR chỉ MỘT lần: mở lại App không dọn nữa (bản ghi đã xong)', bang(await gioMay(t), [LY('TLB', 2)]));
  });

  const diApp = async (t, d) => { await t.evaluate((x) => { window.history.pushState({ kh: 1 }, '', x); window.dispatchEvent(new PopStateEvent('popstate')); }, d); await t.waitForTimeout(300); };
  await may('C7 tiền QR về khi đã rời Theo dõi đơn — mở Thanh toán', { gio: [LY('TLB', 2)] }, async ({ t, S }) => {
    await mo(t, '/thanhtoan');
    await doi(t, async () => (await nutDat(t).getAttribute('aria-disabled')) !== 'true' && /Thanh toán qua QR/.test(await nutDat(t).innerText()));
    await nutDat(t).click();
    await doi(t, async () => /\/don\/TQD42/.test(t.url()));
    await diApp(t, '/trangchu'); await t.waitForSelector('#home');
    S.traQR('TQD42'); // tiền về khi App vẫn mở, kho /don chưa làm mới
    await diApp(t, '/thanhtoan');
    k('C7 CR mở Thanh toán: GET /don riêng thấy đơn đã trả → giỏ bỏ dòng đã gửi, KHÔNG gửi đơn thứ hai', await doi(t, async () => bang(await gioMay(t), [])) && S.guiDon.length === 1, JSON.stringify(await gioMay(t)));
  });
  await may('D4 nhắc gia hạn + E1 Menu', { S0: { hang: { id: 2, ten: 'Vàng', phan_tram: 10, phan_tram_nhom_dac_biet: 5, het_han: '2026-11-18T23:59:59' } } }, async ({ t }) => {
    await mo(t, '/trangchu');
    k('D4 CR Trang chủ: "Thẻ Vàng còn 5 ngày — Gia hạn ›" dưới thẻ hội viên', await doiChu(t, '#home', /Thẻ Vàng còn 5 ngày — Gia hạn ›/));
    await chup(t, 'trangchu_nhac');
    await t.locator('#home .nt-state', { hasText: 'Gia hạn' }).click();
    k('D4 CR bấm nhắc → /uudai/hang?h=2', await doi(t, async () => /\/uudai\/hang\?h=2$/.test(t.url())));
    await mo(t, '/menu');
    await doiChu(t, '#catalog .cat-tiles', /Thẻ thành viên/);
    k('E1 CR Menu có ô "Thẻ thành viên"; "Tất cả" có phần thẻ ở cuối "Thẻ Vàng — từ 79.000đ"', /Thẻ Vàng — từ 79\.000đ/.test(await chu(t, '#catGrid')));
    await t.locator('#catalog .search-box input').fill('the');
    k('E1 CR tìm kiếm không ra thẻ', await doi(t, async () => !/Thẻ Vàng — từ/.test(await chu(t, '#catGrid'))));
    await t.locator('#catalog .search-box input').fill('');
    await t.locator('#catalog .cat-tiles .ct', { hasText: 'Thẻ thành viên' }).click();
    k('E1 CR chọn ô → /menu/the-thanh-vien, chỉ thẻ (không món)', await doi(t, async () => /\/menu\/the-thanh-vien$/.test(t.url())) && (await t.locator('#catGrid .pc-mini').count()) === 1 && !/Trà Lục Bảo/.test(await chu(t, '#catGrid')));
    await chup(t, 'menu_the');
    await t.locator('#catGrid .pc-mini').click();
    k('E1 CR bấm thẻ → /uudai/hang?h=2', await doi(t, async () => /\/uudai\/hang\?h=2$/.test(t.url())));
  });
  await trinh.close();
}
