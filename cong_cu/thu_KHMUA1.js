#!/usr/bin/env node
// THỬ KH-MUA-1 — Giỏ hàng, Thanh toán, Theo dõi đơn dựng sẵn theo tên cửa POS dự kiến (cổng đặt đơn tiêm vào, cờ DAT_ONLINE).
// Phần 1: hàm thuần (gio.js, datDon.js, luuMay.js, duongDan.js) + đọc nguồn · Phần 2: App thật trong Chromium + POS giả (page.route).
// Chạy: node cong_cu/thu_KHMUA1.js → dòng cuối "n đạt · m hỏng". KHONG_TRINH_DUYET=1 hoặc không có Playwright → phần 2 BỎ QUA (không tính hỏng).
'use strict';
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const GOC = path.join(__dirname, '..');
let dat = 0, hong = 0;
const k = (ten, dung, them = '') => {
  if (dung) { dat++; console.log(`  ✓ ${ten}`); } else { hong++; console.log(`  ✗ ${ten}${them ? '  — ' + them : ''}`); }
};
const doc = (f) => { try { return fs.readFileSync(path.join(GOC, f), 'utf8'); } catch { return ''; } };
const nap = (f) => import(pathToFileURL(path.join(GOC, f)).href);
const khoGia = () => { const m = new Map(); return { getItem: (x) => (m.has(x) ? m.get(x) : null), setItem: (x, v) => m.set(x, String(v)), removeItem: (x) => m.delete(x), m }; };
const khoChan = { getItem() { throw new Error('chặn'); }, setItem() { throw new Error('chặn'); }, removeItem() { throw new Error('chặn'); } };

const MENU_DS = [
  { ma: 'TLB', ten: 'Trà Lục Bảo', nhom: 'Trà Đông Y', gia: 30000, con_hang: true, gia_hang: [{ hang_id: 2, gia: 27000 }] },
  { ma: 'CFM', ten: 'Cà phê Muối', nhom: 'Cà phê', gia: 39000, con_hang: null, gia_hang: [] },
  { ma: 'HET', ten: 'Trà Hết', nhom: 'Trà Đông Y', gia: 25000, con_hang: false, gia_hang: [] },
];
const BG = { success: true, dong: [{ ma: 'TLB', so_luong: 2, don_gia: 27000, thanh_tien: 54000 }], tam_tinh: 99000, giam: [{ loai: 'voucher', so_tien: 12345 }], phi_giao: 0, tong: 87654 };

(async () => {
  console.log('Phần 1 — hàm thuần, đọc nguồn');
  let G = null, D = null, L = null, DD = null, LDN = null, CD = null;
  try { G = await nap('src/gio.js'); } catch (e) { k('nạp src/gio.js', false, String(e.message).split('\n')[0]); }
  try { D = await nap('src/datDon.js'); } catch (e) { k('nạp src/datDon.js', false, String(e.message).split('\n')[0]); }
  try { CD = await nap('src/noiDung/caiDat.js'); } catch (e) { k('nạp src/noiDung/caiDat.js', false, String(e.message).split('\n')[0]); }
  L = await nap('src/luuMay.js'); DD = await nap('src/duongDan.js'); LDN = await nap('src/luongDangNhap.js');

  // A1 — thanh tab 5 mục, đường dẫn
  const tab = doc('src/components/ThanhTab.jsx');
  const thuTu = [...tab.matchAll(/\['([a-z]+)', '/g)].map((m) => m[1]).join(',');
  k('A1 thanh tab đủ 5 mục đúng thứ tự demo', thuTu === 'trangchu,menu,giohang,uudai,taikhoan', thuTu);
  k('A1 tab Giỏ hàng: huy hiệu nhA-kim, màu demo #7C8696', /\['giohang', 'Giỏ hàng', 'nhA-kim', '#7C8696'\]/.test(tab));
  k('A1 tab hiện số món khi giỏ có hàng (tab-so)', /tab-so/.test(tab));
  const gh = DD.docDuongDan('/giohang'), tt = DD.docDuongDan('/thanhtoan'), td = DD.docDuongDan('/don/TQD42');
  k('A1 /giohang: trang giohang, tab giohang, KHÔNG cần đăng nhập', gh.trang === 'giohang' && gh.tab === 'giohang' && !gh.canDN, JSON.stringify(gh));
  k('C1 /don/<ma>: trang theodoi, cần đăng nhập, giữ nguyên mã', td.trang === 'theodoi' && td.canDN && td.tham.ma === 'TQD42' && DD.taoDuongDan('theodoi', { ma: 'TQD42' }) === '/don/TQD42', JSON.stringify(td));
  k('C1 /taikhoan/donhang/<ma> vẫn là chi tiết đơn cũ', DD.docDuongDan('/taikhoan/donhang/A1').trang === 'don');
  // A4
  k('A4 khách chưa đăng nhập vào giỏ được, vào thanh toán phải đăng nhập', !LDN.canDangNhap('giohang', false) && LDN.canDangNhap('thanhtoan', false) && tt.trang === 'thanhtoan', JSON.stringify(tt));
  k('A4 /dangnhap?tiep=/thanhtoan giữ tiep, đăng nhập xong về /thanhtoan', DD.taoDuongDan('dangnhap', { tiep: '/thanhtoan' }) === '/dangnhap?tiep=%2Fthanhtoan' && LDN.dichSauDangNhap('/thanhtoan', '') === '/thanhtoan');

  if (G) {
    let g = G.themMon([], 'TLB', 1, '');
    g = G.themMon(g, 'TLB', 2, '');
    g = G.themMon(g, 'TLB', 1, 'ít ngọt');
    k('A3 thêm: cùng mã + cùng ghi chú thì gộp, khác ghi chú thành dòng riêng', g.length === 2 && g[0].so_luong === 3 && g[1].ghi_chu === 'ít ngọt', JSON.stringify(g));
    k('A3 đếm món = tổng số lượng', G.demMon(g) === 4);
    k('A3 bớt về 0 thì xoá dòng; đổi số lượng kẹp 1–99', G.doiSoLuong(g, 1, 0).length === 1 && G.doiSoLuong(g, 0, 500)[0].so_luong === 99 && G.doiSoLuong(g, 0, 2)[0].so_luong === 2);
    k('A3 xoá dòng, dọn giỏ', G.xoaDong(g, 0).length === 1 && G.xoaDong(g, 0)[0].ghi_chu === 'ít ngọt' && G.demMon([]) === 0);
    k('A2 ghi chú cắt còn 100 ký tự', G.themMon([], 'TLB', 1, 'x'.repeat(150))[0].ghi_chu.length === 100);
    const kho = khoGia();
    const coGia = [{ ma: 'TLB', so_luong: 2, ghi_chu: '', gia: 27000, don_gia: 1, ten: 'Trà' }];
    k('A3 lưu kh_gio: ghi được', G.ghiGio(coGia, kho) === true && kho.m.has('kh_gio') && G.KHOA_GIO === 'kh_gio');
    const luu = JSON.parse(kho.m.get('kh_gio') || '[]');
    k('A3 bản lưu CHỈ có ma, so_luong, ghi_chu — không giá', luu.length === 1 && Object.keys(luu[0]).sort().join(',') === 'ghi_chu,ma,so_luong' && !/gia/.test(kho.m.get('kh_gio')), kho.m.get('kh_gio'));
    k('A3 đọc lại đúng giỏ', JSON.stringify(G.docGio(kho)) === JSON.stringify([{ ma: 'TLB', so_luong: 2, ghi_chu: '' }]));
    kho.setItem('kh_gio', '{hỏng'); const hongDoc = G.docGio(kho);
    kho.setItem('kh_gio', JSON.stringify([{ ma: '', so_luong: 1 }, { ma: 'X', so_luong: -2 }, { ma: 'Y', so_luong: 1.5 }, 7]));
    k('A3 bản lưu hỏng / sai dạng → giỏ rỗng, không vỡ', Array.isArray(hongDoc) && hongDoc.length === 0 && G.docGio(kho).length === 0);
    k('A3 kho bị chặn: đọc rỗng, ghi trả false, không ném', G.docGio(khoChan).length === 0 && G.ghiGio(coGia, khoChan) === false);
    const tHet = G.trangThaiDong({ ma: 'HET', so_luong: 1, ghi_chu: '' }, MENU_DS), tMat = G.trangThaiDong({ ma: 'MAT', so_luong: 1, ghi_chu: '' }, MENU_DS), tNull = G.trangThaiDong({ ma: 'CFM', so_luong: 1, ghi_chu: '' }, MENU_DS);
    k('A3 món hết hàng / không còn trong menu → đánh dấu; con_hang null vẫn bán (K5)', !tHet.conBan && !!tHet.mon && !tMat.conBan && tMat.mon === null && tNull.conBan);
    k('A3 giỏ có món hết → không cho thanh toán; giỏ rỗng cũng không', !G.duocThanhToan([{ ma: 'TLB', so_luong: 1, ghi_chu: '' }, { ma: 'HET', so_luong: 1, ghi_chu: '' }], MENU_DS) && G.duocThanhToan([{ ma: 'TLB', so_luong: 1, ghi_chu: '' }], MENU_DS) && !G.duocThanhToan([], MENU_DS));
    k('A5 giá hình dung = giá một ly tra gia_hang × số lượng (hạng 2: 27.000 × 2)', G.giaHinhDung(MENU_DS[0], { id: 2 }, 2) === 54000 && G.giaHinhDung(MENU_DS[0], null, 2) === 60000 && G.giaHinhDung({ ma: 'Z', gia: null }, null, 2) === null);
  }

  // luuMay — kh_gio trong danh sách khoá dữ liệu khách; giỏ của khách vãng lai không mất khi đăng nhập lần đầu (K5)
  const kL = khoGia();
  kL.setItem('kh_gio', '[{"ma":"TLB","so_luong":1,"ghi_chu":""}]'); kL.setItem('kh_chu', L.dauVet('0909000001'));
  L.xoaTatCa(kL);
  k('A3 đăng xuất (xoaTatCa) xoá kh_gio', !kL.m.has('kh_gio'));
  kL.setItem('kh_gio', '[{"ma":"TLB","so_luong":1,"ghi_chu":""}]'); kL.setItem('kh_chu', L.dauVet('0909000001'));
  L.doiKhach('0909000002', kL);
  k('A3 người đăng nhập sau là KHÁC khách → xoá kh_gio', !kL.m.has('kh_gio'));
  const kM = khoGia(); kM.setItem('kh_gio', '[{"ma":"TLB","so_luong":1,"ghi_chu":""}]');
  L.doiKhach('0909000003', kM);
  k('A4 khách vãng lai thêm giỏ rồi đăng nhập lần đầu (chưa có kh_chu) → GIỮ giỏ', kM.m.has('kh_gio'));
  k('A3 kh_gio khai trong danh sách khoá của luuMay.js', /KHOA_GIO/.test(doc('src/luuMay.js')));

  if (D) {
    const gio = [{ ma: 'TLB', so_luong: 2, ghi_chu: 'ít ngọt' }];
    const tb = D.thanBaoGia(gio, { maGiam: ' GIAM10 ', cachNhan: 'tai_quan', diaChi: '12 Lê Lợi' });
    k('D1 thân bao-gia: mon[] {ma, so_luong, ghi_chu}, ma_giam (cắt khoảng trắng), cach_nhan; tại quầy không gửi dia_chi', JSON.stringify(tb) === JSON.stringify({ mon: [{ ma: 'TLB', so_luong: 2, ghi_chu: 'ít ngọt' }], ma_giam: 'GIAM10', cach_nhan: 'tai_quan' }), JSON.stringify(tb));
    const tbG = D.thanBaoGia(gio, { maGiam: '', cachNhan: 'giao', diaChi: '12 Lê Lợi' });
    k('D1 giao tận nơi gửi dia_chi; không mã thì không gửi ma_giam', tbG.dia_chi === '12 Lê Lợi' && !('ma_giam' in tbG) && tbG.cach_nhan === 'giao');
    const tdQ = D.thanDatDon(gio, { cachNhan: 'tai_quan' }, { cachTra: 'qr', pin: '1234' }), tdV = D.thanDatDon(gio, { cachNhan: 'tai_quan' }, { cachTra: 'vi', pin: '1357' });
    k('D1 thân POST /don: cach_tra; pin CHỈ khi trả ví', tdQ.cach_tra === 'qr' && !('pin' in tdQ) && tdV.cach_tra === 'vi' && tdV.pin === '1357');
    k('A3/D1 thân gửi POS không có trường giá nào', !/"(gia|don_gia|thanh_tien|tam_tinh|phi_giao|tong)"/.test(JSON.stringify([tb, tbG, tdQ, tdV])), JSON.stringify(tdV));
    const b = D.docBaoGia(BG);
    k('E2 bảng tiền lấy NGUYÊN số POS (tạm tính 99.000, giảm 12.345, tổng 87.654) dù khác phép nhân / phép trừ', !!b && b.tamTinh === 99000 && b.giam.length === 1 && b.giam[0].soTien === 12345 && b.phiGiao === 0 && b.tong === 87654, JSON.stringify(b));
    const b2 = D.docBaoGia({ ...BG, tong: 1, tam_tinh: 5 });
    k('E2 đổi số POS → bảng đổi theo', !!b2 && b2.tong === 1 && b2.tamTinh === 5);
    k('A5 báo giá thiếu tổng / không phải số → null (không hiện tổng)', D.docBaoGia({ success: true, tam_tinh: 1 }) === null && D.docBaoGia({ ...BG, tong: '87654' }) === null && D.docBaoGia(null) === null);
    const dd = D.docDatDon({ success: true, ma_don: 'TQD42', tong: 87654, trang_thai: 'cho_tra', qr: { chuoi: '0002', het_han: '2026-10-30T20:40:00' } });
    k('D1 đọc trả lời POST /don: ma_don, tong, trang_thai, qr { chuoi, het_han }', !!dd && dd.ma === 'TQD42' && dd.tong === 87654 && dd.trangThai === 'cho_tra' && dd.qr.chuoi === '0002' && dd.qr.hetHan === '2026-10-30T20:40:00', JSON.stringify(dd));
    k('D1 qr null (trả ví) → qr null; thiếu ma_don → null', D.docDatDon({ ma_don: 'A', tong: 1, trang_thai: 'da_tra', qr: null }).qr === null && D.docDatDon({ tong: 1 }) === null);
    const dn = D.docDon({ success: true, don: { ma: 'TQD42', ngay: '2026-10-30T20:31:00', tong: 87654, tien_trinh: 'dang_lam', mon: [{ ma: 'TLB', ten: 'Trà Lục Bảo', so_luong: 2, thanh_tien: 54000, ghi_chu: '' }] } });
    k('D1 đọc GET /don/:ma: tien_trinh, mon[]', !!dn && dn.tienTrinh === 'dang_lam' && dn.mon.length === 1 && dn.mon[0].ma === 'TLB');
    k('D3 đường dẫn cửa ở một chỗ: /gio/bao-gia, /don, /don/:ma, /don/:ma/huy', D.DUONG_DAT_DON.baoGia === '/gio/bao-gia' && D.DUONG_DAT_DON.don === '/don' && D.DUONG_DAT_DON.xem('A 1') === '/don/A%201' && D.DUONG_DAT_DON.huy('A') === '/don/A/huy');
    // D1/D2 cổng tiêm, cờ
    const nguon = doc('src/datDon.js');
    k('D1 datDon.js không gọi mạng trực tiếp (không fetch / XMLHttpRequest)', nguon.length > 0 && !/\bfetch\s*\(|XMLHttpRequest/.test(nguon));
    k('D1 api.js không thêm cửa đặt đơn (bao-gia, POST /don, huy)', !/bao-gia|\/huy|'POST', '\/don'/.test(doc('src/api.js')));
    k('D2 cờ DAT_ONLINE ở src/noiDung/caiDat.js, mặc định false', !!CD && CD.DAT_ONLINE === false);
    let goiCong = 0;
    D.datCongDatDon(() => { goiCong++; return Promise.resolve(BG); });
    let loiTat = null;
    try { await D.baoGia(tb); } catch (e) { loiTat = e; }
    k('D2 cờ tắt: cổng KHÔNG được gọi, trả lỗi "Đặt online sắp mở…"', goiCong === 0 && !!loiTat && loiTat.message === D.CHU_CHUA_MO && /Đặt online sắp mở — mời bạn đặt tại quầy/.test(D.CHU_CHUA_MO), String(goiCong));
    D.datCongDatDon(null);
    // B3 ví
    k('B3 ví đủ → thiếu 0; thiếu → số thiếu theo số POS; thiếu số → null', D.viThieu(87654, 100000) === 0 && D.viThieu(87654, 50000) === 37654 && D.viThieu(null, 5) === null && D.viThieu(5, undefined) === null);
    // B8 lỗi theo danh sách trắng
    k('B8 chỉ lỗi POS báo chắc chưa tạo đơn mới cho gửi lại; mất mạng / không mã / lạ → có thể đã tạo', D.chuaTaoDon({ code: 'PIN_SAI' }) && D.chuaTaoDon({ code: 'VI_KHONG_DU' }) && D.chuaTaoDon({ code: 'HET_HANG' }) && !D.chuaTaoDon({ code: 'MANG_LOI' }) && !D.chuaTaoDon({}) && !D.chuaTaoDon(new Error('x')) && !D.chuaTaoDon(null));
    // B6 ngoài giờ, lỗi
    k('B6 nhan_don false / dang_mo false → khoá + câu thong_bao; trong giờ / chưa biết → ""', D.chanDat({ nhan_don: false, dang_mo: true, thong_bao: 'Quán ngừng nhận đơn' }) === 'Quán ngừng nhận đơn' && !!D.chanDat({ nhan_don: true, dang_mo: false, thong_bao: '' }) && D.chanDat({ nhan_don: true, dang_mo: true }) === '' && D.chanDat(null) === '');
    // B7 đếm ngược QR theo giờ VN
    k('B7 QR còn lại theo bay_gio của POS (giờ VN, không new Date chuỗi)', D.conLaiQR('2026-10-30T20:40:00', '2026-10-30 20:30:00') === 600 && D.conLaiQR('2026-10-30T20:29:00', '2026-10-30 20:30:00') === 0 && D.conLaiQR('', '2026-10-30 20:30:00') === null && !/new Date\(/.test(nguon));
    // B5 gộp
    const gop = D.taoGop(40); let n = 0;
    gop(() => n++); gop(() => n++); gop(() => n++);
    await new Promise((x) => setTimeout(x, 90));
    k('B5 gộp: 3 lần đổi liền → 1 lần hỏi báo giá', n === 1, String(n));
    // B8 bấm đôi
    let lanGui = 0, xong; const cho = new Promise((x) => { xong = x; });
    const gui = D.khoaGui(() => { lanGui++; return cho; });
    const p1 = gui(); const p2 = gui();
    xong('ok'); await p1;
    k('B8 bấm hai lần khi đang gửi → đúng 1 lần gửi; lần hai trả null', lanGui === 1 && p2 === null);
    const gui2 = D.khoaGui(() => { lanGui++; return Promise.reject(new Error('mạng')); });
    await gui2().catch(() => {}); await new Promise((x) => setTimeout(x, 20));
    k('B8 lỗi mạng: KHÔNG tự gửi lại', lanGui === 2);
    // C1 tiến trình
    const bt = D.buocTienTrinh('dang_lam'), bh = D.buocTienTrinh('da_huy'), bg = D.buocTienTrinh('dang_giao');
    k('C1 tiến trình tại quầy: chờ trả → đã trả → pha chế → sẵn sàng; dang_lam là bước hiện tại', bt.ds.map((x) => x.ma).join(',') === 'cho_tra,da_tra,dang_lam,xong' && bt.hien === 2, JSON.stringify(bt));
    k('C1 giao: có dang_giao / da_giao; da_huy là một bước "Đã huỷ"', bg.ds.some((x) => x.ma === 'da_giao') && bg.ds[bg.hien].ma === 'dang_giao' && bh.ds.length === 1 && /huỷ/i.test(bh.ds[0].t));
    k('C1 dừng hỏi lại khi xong / da_giao / da_huy', D.xongChua('xong') && D.xongChua('da_giao') && D.xongChua('da_huy') && !D.xongChua('cho_tra') && !D.xongChua('dang_lam'));
    // C3 đặt lại
    const dl = D.monDatLai({ mon: [{ ma: 'TLB', so_luong: 2, ghi_chu: 'ít đá' }, { ma: 'CU', so_luong: 1 }, { ten: 'không mã', so_luong: 1 }] }, MENU_DS);
    k('C3 đặt lại theo ma: món còn trong menu vào giỏ, món không còn đếm bỏ qua', dl.them.length === 1 && dl.them[0].ma === 'TLB' && dl.them[0].so_luong === 2 && dl.them[0].ghi_chu === 'ít đá' && dl.boQua === 2, JSON.stringify(dl));
  }
  const tt2 = doc('src/pages/ThanhToan.jsx');
  k('B1 chữ "Giao qua Ahamove", "Sắp có", "đọc số đơn"; không "GHN"; không "suất"', /Giao qua Ahamove/.test(tt2) && /Sắp có/.test(tt2) && /đọc <b>số đơn<\/b>|đọc số đơn/.test(tt2) && !/GHN|suất/.test(tt2 + doc('src/pages/GioHang.jsx') + doc('src/pages/TheoDoiDon.jsx') + doc('src/datDon.js')));
  k('B3 PIN không lưu: datDon / ThanhToan / PinSheet không ghi PIN vào kho / log', !/(localStorage|sessionStorage|console\.)[^\n]*pin/i.test(tt2 + doc('src/datDon.js') + doc('src/components/PinSheet.jsx')));
  k('B7 vẽ QR dùng lại VeQR của ManQR.jsx', /export function VeQR/.test(doc('src/pages/ManQR.jsx')) && /VeQR/.test(doc('src/pages/TheoDoiDon.jsx')));
  k('C2 số gọi quán lấy ở noiDung/lienHe.js', /LIEN_HE/.test(doc('src/pages/TheoDoiDon.jsx')));

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
  const esbuild = require('esbuild');
  // Bài thử bật cờ và tiêm cổng bằng fetch thẳng tới /api/kh (CHỈ trong gói của bài thử — app thật chưa có cửa).
  const dung = async (batCo) => (await esbuild.build({
    stdin: { contents: batCo ? `import { datCongDatDon } from './datDon.js'; import { docToken } from './api.js';
      datCongDatDon(async (pt, duong, than) => { let r; try { r = await fetch('/api/kh' + duong, { method: pt, headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + docToken() }, body: than === undefined ? undefined : JSON.stringify(than) }); } catch { const e = new Error('Không kết nối được. Kiểm tra mạng rồi thử lại.'); e.code = 'MANG_LOI'; throw e; }
        const dl = await r.json(); if (!r.ok) { const e = new Error(dl.error); e.code = dl.code; throw e; } return dl; });
      import './main.jsx';` : `import './main.jsx';`, resolveDir: path.join(GOC, 'src'), loader: 'jsx' },
    bundle: true, write: false, format: 'iife', jsx: 'automatic', logLevel: 'silent',
    loader: { '.css': 'empty', '.json': 'json' }, define: { 'process.env.NODE_ENV': '"production"', 'import.meta.env.VITE_POS_API': '""' },
    plugins: batCo ? [{ name: 'bat-co', setup(b) { b.onLoad({ filter: /caiDat\.js$/ }, () => ({ contents: 'export const DAT_ONLINE = true;', loader: 'js' })); } }] : [],
  })).outputFiles[0].text;
  const goiBat = await dung(true), goiTat = await dung(false);
  const cssTron = (f) => doc(f).replace(/@import\s+'\.\/([^']+)';/g, (_, t) => cssTron(path.posix.join(path.posix.dirname(f), t)));
  const css = [...doc('src/main.jsx').matchAll(/import '\.\/(giaoDien\/[^']+\.css)'/g)].map((m) => cssTron('src/' + m[1])).join('\n');
  const trinh = await pw.chromium.launch({ args: ['--no-sandbox'] });
  const URL0 = 'http://kh.test';
  const KHUNG = doc('index.html').replace(/<script type="module"[^>]*><\/script>/, '<script src="/bundle.js"></script>');
  const BAY = (g) => `2026-10-30T${g}`;
  const luuAnh = process.env.LUU_ANH_DIR || '';

  async function ca(ten, { rong = 390, dn = true, gio = null, pos = {}, batCo = true } = {}, chay) {
    const ctx = await trinh.newContext({ viewport: { width: rong, height: 844 }, timezoneId: 'Asia/Ho_Chi_Minh' });
    const t = await ctx.newPage();
    const loi = [];
    t.on('pageerror', (e) => loi.push(e.message));
    await t.clock.install({ time: new Date('2026-10-30T20:30:00+07:00') }); await t.clock.resume();
    await t.addInitScript(({ dn, gio }) => {
      try { sessionStorage.setItem('kh_da_xem_man_dau', '1'); } catch { /* bỏ qua */ }
      if (!sessionStorage.getItem('da_gieo')) { sessionStorage.setItem('da_gieo', '1'); if (dn) localStorage.setItem('kh_token', 'tok-A'); if (gio) localStorage.setItem('kh_gio', JSON.stringify(gio)); }
    }, { dn, gio });
    const P = { tt: 'cho_tra', vi: 100000, qr: { chuoi: '00020101021238570010A000000727', het_han: BAY('20:40:00') }, gh: { nhan_don: true, dang_mo: true, thong_bao: '' }, bg: BG, loiBg: null, goi: [], ...pos };
    t.P = P;
    await t.route(`${URL0}/**`, async (r) => {
      const req = r.request(), u = new URL(req.url()), p = u.pathname, pt = req.method();
      const json = (status, o) => r.fulfill({ status, contentType: 'application/json', body: JSON.stringify(o) });
      if (p === '/bundle.js') return r.fulfill({ contentType: 'text/javascript', body: batCo ? goiBat : goiTat });
      if (!p.startsWith('/api/kh')) return /\.[a-z0-9]+$/.test(p) ? r.fulfill({ status: 204, body: '' }) : r.fulfill({ contentType: 'text/html', body: KHUNG.replace('</head>', `<style>${css}</style></head>`) });
      const duong = p.slice('/api/kh'.length);
      let than = null; try { than = req.postDataJSON(); } catch { /* không thân */ }
      P.goi.push({ pt, duong, than });
      if (duong === '/gio-vang') return json(200, { success: true, dang_chay: false, bat_dau: null, ket_thuc: null, phan_tram: 0, mon: [] });
      if (duong === '/hang') return json(200, { success: true, data: [{ id: 2, ten: 'Vàng', phan_tram: 10, phan_tram_nhom_dac_biet: 5, gia_the: 199000, thu_tu: 1 }] });
      if (duong === '/gio-hoat-dong') return json(200, { success: true, bay_gio: BAY('20:30:00'), hom_nay: { mo: '08:00', dong: '22:00' }, mo_lai_luc: null, lich_tuan: [], ngay_nghi: [], ...P.gh });
      if (duong === '/menu' && P.menuCanDN && !/tok-A/.test(req.headers().authorization || '')) return json(401, { error: 'Cần đăng nhập', code: 'KH_PHIEN_SAI' });
      if (duong === '/menu') return json(200, { success: true, data: MENU_DS.map((m) => ({ ...m, ton_cu: false, ton_luc: null })) });
      const auth = req.headers().authorization || '';
      if (!/tok-A/.test(auth)) return json(401, { error: 'Cần đăng nhập', code: 'KH_PHIEN_SAI' });
      if (duong === '/toi') return json(200, { success: true, khach: { sdt: '0909123456', ten: 'Linh', ngay_tao: BAY('08:00:00'), qr: 'QR', hang: { id: 2, ten: 'Vàng', phan_tram: 10, phan_tram_nhom_dac_biet: 5, het_han: '2026-11-15T23:59:59' }, so_du_vi: P.vi } });
      if (duong === '/diem') return json(200, { success: true, points: 0, history: [] });
      if (duong === '/voucher') return json(200, { success: true, data: [], ma_khach_moi: [] });
      if (duong === '/gio/bao-gia') return P.loiBg ? json(409, P.loiBg) : json(200, P.bg);
      if (duong === '/don' && pt === 'POST') {
        if (P.matMangDon) return r.abort('internetdisconnected');
        if (P.don502) return r.fulfill({ status: 502, contentType: 'text/html', body: '<html>Bad gateway</html>' });
        if (P.thieuMa) return json(200, { success: true, ma: 'TQD42', tong: P.bg.tong, trang_thai: 'cho_tra', qr: null });
        if (P.loiDon) return json(409, P.loiDon);
        if (than.cach_tra === 'vi' && than.pin !== '1357') return json(400, { error: 'Mã PIN không đúng, còn 4 lần thử', code: 'PIN_SAI' });
        if (than.cach_tra === 'vi') P.tt = 'da_tra';
        return json(200, { success: true, ma_don: 'TQD42', tong: P.bg.tong, trang_thai: P.tt, qr: than.cach_tra === 'qr' ? P.qr : null });
      }
      if (duong === '/don/TQD42/huy' && P.huyLoi) return json(409, P.huyLoi);
      if (duong === '/don/TQD42/huy') { P.tt = 'da_huy'; return json(200, { success: true }); }
      if (duong === '/don/TQD42') return json(200, { success: true, don: { ma: 'TQD42', ngay: BAY('20:31:00'), tong: P.bg.tong, tien_trinh: P.tt, mon: [{ ma: 'TLB', ten: 'Trà Lục Bảo', so_luong: 2, don_gia: 27000, thanh_tien: 54000, ghi_chu: '' }] } });
      if (duong === '/don' && pt === 'GET') return json(200, { success: true, trang: 1, con_nua: false, data: [{ ma: 'TQD41', ngay: BAY('19:00:00'), tong: 81000, da_tra: 81000, trang_thai: 'completed', thanh_toan: 'paid' }] });
      if (duong === '/don/TQD41') return json(200, { success: true, don: { ma: 'TQD41', ngay: BAY('19:00:00'), tong: 81000, da_tra: 81000, trang_thai: 'completed', thanh_toan: 'paid', mon: [{ ma: 'TLB', ten: 'Trà Lục Bảo', so_luong: 3, don_gia: 27000, thanh_tien: 81000, ghi_chu: '' }, { ma: 'CU', ten: 'Món cũ', so_luong: 1, don_gia: 0, thanh_tien: 0, ghi_chu: '' }] } });
      return json(500, { error: 'chưa giả', code: 'LOI_GIA' });
    });
    t.setDefaultTimeout(4000);
    try { await chay(t, loi, P); } catch (e) { k(`ca ${ten} dừng giữa chừng`, false, String(e && e.message).split('\n')[0]); } finally { await ctx.close(); }
  }
  const mo = async (t, duong, co = '100%') => { await t.goto(URL0 + duong); await t.waitForSelector('.phone'); await t.waitForTimeout(800); if (co === '130%') await t.addStyleTag({ content: 'html{font-size:130%}' }); await t.waitForTimeout(150); };
  const chu = (t, s) => t.locator(s).first().innerText();
  const dem = (P, pt, duong) => P.goi.filter((g) => g.pt === pt && (typeof duong === 'string' ? g.duong === duong : duong.test(g.duong))).length;
  const GIO2 = [{ ma: 'TLB', so_luong: 2, ghi_chu: '' }];

  await ca('luong-qr', { dn: false }, async (t, loi, P) => {
    await mo(t, '/mon/tra-luc-bao');
    await t.locator('.detail-qty-row .qty-ctrl button').nth(1).click();
    await t.locator('.detail-addcart').click(); await t.waitForTimeout(400);
    k('E6.1 khách chưa đăng nhập thêm 2 món ở Trang món → về /giohang, tab Giỏ hàng hiện số 2', /\/giohang$/.test(t.url()) && (await chu(t, '.tab .tab-so')) === '2', t.url());
    k('A2/A5 dòng giỏ: tên món, giá hình dung 60.000đ (giá thường × 2); chưa có báo giá → "Tổng tiền sẽ hiện khi quán xác nhận"', /Trà Lục Bảo/.test(await chu(t, '.cart-item')) && /60\.000đ/.test(await chu(t, '.cart-item')) && /Tổng tiền sẽ hiện khi quán xác nhận/.test(await chu(t, '#cart')));
    await t.locator('#cart .checkout-btn').click(); await t.waitForTimeout(400);
    k('A4/E6.2 Tiếp tục khi chưa đăng nhập → /dangnhap?tiep=%2Fthanhtoan', /\/dangnhap\?tiep=%2Fthanhtoan$/.test(t.url()), t.url());
    await t.evaluate(() => localStorage.setItem('kh_token', 'tok-A'));
    await mo(t, '/dangnhap?tiep=%2Fthanhtoan'); await t.waitForTimeout(700);
    k('A4 đăng nhập xong → đúng màn Thanh toán, giỏ còn nguyên', /\/thanhtoan$/.test(t.url()) && (await chu(t, '.tab .tab-so')) === '2', t.url());
    const tien = await chu(t, '#checkout .card.bang-tien');
    k('E2/B5 bảng tiền = đúng số POS giả (99.000 / −12.345 / 87.654), không phải phép nhân 54.000 / phép trừ 86.655', /99\.000đ/.test(tien) && /−12\.345đ/.test(tien) && /87\.654đ/.test(tien) && !/54\.000đ/.test(tien), tien);
    const trang = await chu(t, '#checkout');
    k('B1 Lấy tại quầy (mặc định) + "Giao qua Ahamove" "Sắp có"; không GHN; dòng đọc số đơn', /Giao qua Ahamove/.test(trang) && /Sắp có/.test(trang) && !/GHN/.test(trang) && /đọc số đơn/.test(trang) && /Lấy tại quầy/.test(await chu(t, '.mode-opt.active')));
    await t.locator('.mode-opt', { hasText: 'Giao tận nơi' }).click({ force: true }); await t.waitForTimeout(200);
    k('B1 Giao tận nơi đang TẮT: bấm không đổi cách nhận', /Lấy tại quầy/.test(await chu(t, '.mode-opt.active')));
    await t.locator('#checkout .checkout-btn').click(); await t.waitForTimeout(900);
    const post = P.goi.filter((g) => g.pt === 'POST' && g.duong === '/don');
    k('B7 Xác nhận QR → 1 lần POST /don (cach_tra qr, cach_nhan tai_quan, không pin) → /don/TQD42', post.length === 1 && post[0].than.cach_tra === 'qr' && post[0].than.cach_nhan === 'tai_quan' && !('pin' in post[0].than) && /\/don\/TQD42$/.test(t.url()), JSON.stringify(post) + t.url());
    k('B7 QR hiện + đếm ngược tới het_han theo giờ POS (~10 phút)', (await t.locator('.khung-qr svg').count()) === 1 && /(9:5\d|10:00)/.test(await chu(t, '#tracking')), await chu(t, '#tracking'));
    const truoc = dem(P, 'GET', '/don/TQD42');
    P.tt = 'da_tra';
    await t.waitForTimeout(3600);
    k('B7 hỏi trạng thái mỗi 3 giây khi chờ trả', dem(P, 'GET', '/don/TQD42') > truoc);
    k('B7/C1 da_tra → hết QR, bước "Đã thanh toán" xong, số đơn to #TQD42, giỏ được dọn (tab hết số)', (await t.locator('.khung-qr').count()) === 0 && /#TQD42/.test(await chu(t, '.pick-num')) && (await t.locator('.tl-step.done').count()) >= 2 && (await t.locator('.tab .tab-so').count()) === 0);
    k('luong-qr: Lỗi JS = 0', loi.length === 0, loi.join('|'));
  });

  await ca('vi-pin', { gio: GIO2 }, async (t, loi, P) => {
    await mo(t, '/thanhtoan');
    await t.locator('.opt-row', { hasText: 'Ví nội bộ' }).click();
    k('B3 ví hiện số dư /toi (100.000đ)', /100\.000đ/.test(await chu(t, '.opt-row.active')));
    await t.locator('#checkout .checkout-btn').click(); await t.waitForTimeout(300);
    k('B3 trả ví → bảng PIN', (await t.locator('.pin-sheet').count()) === 1);
    await t.keyboard.type('1111'); await t.waitForTimeout(600);
    k('B6 PIN sai → hiện NGUYÊN lời POS, vẫn ở thanh toán', /Mã PIN không đúng, còn 4 lần thử/.test(await chu(t, '.pin-msg')) && /\/thanhtoan$/.test(t.url()));
    await t.keyboard.type('1357'); await t.waitForTimeout(900);
    const post = P.goi.filter((g) => g.pt === 'POST' && g.duong === '/don');
    k('B3 PIN đúng → thân có pin + cach_tra vi → sang Theo dõi đơn', post.length === 2 && post[1].than.pin === '1357' && post[1].than.cach_tra === 'vi' && /\/don\/TQD42$/.test(t.url()), t.url());
    const kho = await t.evaluate(() => JSON.stringify({ ...localStorage }) + JSON.stringify({ ...sessionStorage }));
    k('B3 PIN không lưu ở localStorage / sessionStorage', !/1357|1111/.test(kho));
    k('vi-pin: Lỗi JS = 0', loi.length === 0, loi.join('|'));
  });

  await ca('vi-thieu', { gio: GIO2, pos: { vi: 50000 } }, async (t) => {
    await mo(t, '/thanhtoan');
    const vi = t.locator('.opt-row', { hasText: 'Ví nội bộ' });
    k('B3 ví không đủ: hàng ví khoá, nói rõ còn thiếu 37.654đ (theo tổng POS)', /btn-disabled/.test(await vi.getAttribute('class')) && /còn thiếu 37\.654đ/.test(await vi.innerText()), await vi.innerText());
    await vi.click({ force: true }); await t.waitForTimeout(200);
    k('B3 ví không đủ: không chọn được (vẫn QR)', /QR/.test(await chu(t, '.opt-row.active')));
  });

  await ca('ngoai-gio', { gio: GIO2, pos: { gh: { nhan_don: false, dang_mo: true, thong_bao: 'Quán ngừng nhận đơn online, mở lại 07:00 ngày mai' } } }, async (t, loi, P) => {
    await mo(t, '/thanhtoan');
    k('B6 ngoài giờ (nhan_don false): nút Xác nhận khoá sẵn + câu thong_bao', /btn-disabled/.test(await t.locator('#checkout .checkout-btn').getAttribute('class')) && /mở lại 07:00 ngày mai/.test(await chu(t, '#checkout')));
    await t.locator('#checkout .checkout-btn').click({ force: true }); await t.waitForTimeout(300);
    k('B6 ngoài giờ: bấm cũng không gửi POST /don', dem(P, 'POST', '/don') === 0);
  });

  await ca('het-hang', { gio: [{ ma: 'TLB', so_luong: 1, ghi_chu: '' }, { ma: 'HET', so_luong: 1, ghi_chu: '' }], pos: { loiBg: { error: 'Trà Hết đã hết hàng hôm nay', code: 'HET_HANG' } } }, async (t) => {
    await mo(t, '/giohang');
    k('A3 giỏ: món hết hàng được đánh dấu; Tiếp tục khoá', /Hết hàng/.test(await t.locator('.cart-item', { hasText: 'Trà Hết' }).innerText()) && /btn-disabled/.test(await t.locator('#cart .checkout-btn').getAttribute('class')));
    await t.evaluate(() => localStorage.setItem('kh_gio', '[{"ma":"TLB","so_luong":1,"ghi_chu":""}]')); // trên máy món còn bán, POS báo hết
    await mo(t, '/thanhtoan');
    k('B6 POS trả HET_HANG → hiện nguyên câu error, nút Xác nhận khoá, không hiện tổng', /Trà Hết đã hết hàng hôm nay/.test(await chu(t, '#checkout')) && /btn-disabled/.test(await t.locator('#checkout .checkout-btn').getAttribute('class')) && /Tổng tiền sẽ hiện khi quán xác nhận/.test(await chu(t, '#checkout')));
  });

  await ca('qr-het-han', { gio: GIO2, pos: { qr: { chuoi: '0002', het_han: BAY('20:29:00') } } }, async (t, loi, P) => {
    await mo(t, '/thanhtoan');
    await t.locator('#checkout .checkout-btn').click(); await t.waitForTimeout(900);
    k('B7 QR hết hạn chưa trả → "Tạo mã mới" + "Huỷ đơn"', /Tạo mã mới/.test(await chu(t, '#tracking')) && /Huỷ đơn/.test(await chu(t, '#tracking')));
    await t.locator('#tracking button', { hasText: 'Huỷ đơn' }).click(); await t.waitForTimeout(900);
    k('C2 huỷ đơn chờ trả → POST /don/TQD42/huy đúng 1 lần, hiện "Đã huỷ"', dem(P, 'POST', '/don/TQD42/huy') === 1 && /Đã huỷ/.test(await chu(t, '#tracking')));
  });

  await ca('da-tra-goi-quan', { pos: { tt: 'dang_lam' } }, async (t, loi, P) => {
    await mo(t, '/don/TQD42');
    k('C1 mở thẳng /don/<ma>: bước "pha chế" là bước hiện tại, số đơn to', /pha chế/i.test(await chu(t, '.tl-step.cur')) && /#TQD42/.test(await chu(t, '.pick-num')));
    k('C2 đơn đã trả: không nút Huỷ đơn; chưa có số quán → ẩn nút gọi', (await t.locator('#tracking button', { hasText: 'Huỷ đơn' }).count()) === 0 && (await t.locator('a[href^="tel:"]').count()) === 0);
    const truoc = dem(P, 'GET', '/don/TQD42');
    await t.waitForTimeout(10600);
    k('C1 hỏi lại mỗi 10 giây khi đơn chưa xong', dem(P, 'GET', '/don/TQD42') === truoc + 1, `${truoc} → ${dem(P, 'GET', '/don/TQD42')}`);
    P.tt = 'xong'; await t.waitForTimeout(10600); const sau = dem(P, 'GET', '/don/TQD42'); await t.waitForTimeout(10600);
    k('C1 đơn xong → thôi hỏi lại', dem(P, 'GET', '/don/TQD42') === sau);
  });

  await ca('dat-lai', {}, async (t) => {
    await mo(t, '/taikhoan/donhang');
    await t.locator('.reorder-btn').first().click(); await t.waitForTimeout(800);
    k('C3 Đặt lại ở Lịch sử đơn → về giỏ, có 3 Trà Lục Bảo, báo 1 món không còn bán', /\/giohang$/.test(t.url()) && (await chu(t, '.tab .tab-so')) === '3' && /1 món không còn bán/.test(await t.locator('body').innerText()), t.url());
  });

  await ca('bam-doi-gop', { gio: GIO2 }, async (t, loi, P) => {
    await mo(t, '/giohang');
    await t.locator('.promo-box input').fill('GIAM10'); await t.locator('.promo-box button').click(); await t.waitForTimeout(900);
    const bg = P.goi.filter((g) => g.duong === '/gio/bao-gia');
    k('B4 nhập mã → báo giá gửi ma_giam, giỏ hiện số POS; bảng tiền có dòng "Giảm giá" của POS', bg.length > 0 && bg[bg.length - 1].than.ma_giam === 'GIAM10' && /87\.654đ/.test(await chu(t, '#cart')) && /Giảm giá/.test(await chu(t, '#cart')));
    const n0 = dem(P, 'POST', '/gio/bao-gia');
    const cong = t.locator('.cart-item .qty-ctrl button').nth(1);
    await cong.click(); await cong.click(); await cong.click(); await t.waitForTimeout(1000);
    k('B5 đổi số lượng 3 lần liền → ≤ 1 lần hỏi báo giá thêm (gộp 600 ms)', dem(P, 'POST', '/gio/bao-gia') - n0 <= 1 && dem(P, 'POST', '/gio/bao-gia') - n0 >= 1, String(dem(P, 'POST', '/gio/bao-gia') - n0));
    await mo(t, '/thanhtoan');
    await t.locator('#checkout .checkout-btn').dblclick(); await t.waitForTimeout(900);
    k('B8 bấm đôi Xác nhận → đúng 1 POST /don', dem(P, 'POST', '/don') === 1, String(dem(P, 'POST', '/don')));
  });

  await ca('ma-khong-giam', { gio: GIO2, pos: { bg: { ...BG, giam: [] } } }, async (t) => {
    await mo(t, '/giohang');
    await t.locator('.promo-box input').fill('SAIMA'); await t.locator('.promo-box button').click(); await t.waitForTimeout(900);
    k('B4 POS không giảm cho mã → không dòng giảm, không chữ "Đã áp dụng" (kết quả chỉ từ báo giá)', (await chu(t, '.promo-box button')) === 'Áp dụng' && !/Giảm giá|Đã áp dụng/.test(await chu(t, '#cart')), await chu(t, '#cart'));
  });

  await ca('vi-mat-mang', { gio: GIO2, pos: { matMangDon: true } }, async (t, loi, P) => {
    await mo(t, '/thanhtoan');
    await t.locator('.opt-row', { hasText: 'Ví nội bộ' }).click();
    await t.locator('#checkout .checkout-btn').click(); await t.waitForTimeout(300);
    await t.keyboard.type('1357'); await t.waitForTimeout(900);
    k('B8 trả ví mà mất mạng: đóng bảng PIN (không mời nhập lại), nhắc xem Lịch sử đơn, không tự gửi lại', (await t.locator('.pin-sheet').count()) === 0 && /Lịch sử đơn/.test(await chu(t, '#checkout')) && dem(P, 'POST', '/don') === 1, String(dem(P, 'POST', '/don')));
    await t.locator('#checkout .checkout-btn').click({ force: true }); await t.waitForTimeout(400);
    k('B8 … nút Xác nhận KHOÁ (bấm lại không mở PIN, không gửi đơn thứ hai); có nút "Xem Lịch sử đơn"', /btn-disabled/.test(await t.locator('#checkout .checkout-btn').getAttribute('class')) && (await t.locator('.pin-sheet').count()) === 0 && dem(P, 'POST', '/don') === 1 && (await t.locator('#checkout button', { hasText: 'Xem Lịch sử đơn' }).count()) === 1);
    await t.locator('#checkout button', { hasText: 'Xem Lịch sử đơn' }).click(); await t.waitForTimeout(400);
    k('B8 … "Xem Lịch sử đơn" → /taikhoan/donhang', /\/taikhoan\/donhang$/.test(t.url()), t.url());
  });

  for (const [ten, pos] of [['502 không JSON', { don502: true }], ['trả lời thiếu ma_don', { thieuMa: true }]]) {
    await ca(`vi-${ten}`, { gio: GIO2, pos }, async (t, loi, P) => {
      await mo(t, '/thanhtoan');
      await t.locator('.opt-row', { hasText: 'Ví nội bộ' }).click();
      await t.locator('#checkout .checkout-btn').click(); await t.waitForTimeout(300);
      await t.keyboard.type('1357'); await t.waitForTimeout(900);
      await t.locator('#checkout .checkout-btn').click({ force: true }); await t.waitForTimeout(400);
      k(`B8 trả ví, POS ${ten}: coi như có thể đã tạo — đóng PIN, khoá nút, đúng 1 POST /don`, (await t.locator('.pin-sheet').count()) === 0 && /Đơn có thể đã tạo/.test(await chu(t, '#checkout')) && /btn-disabled/.test(await t.locator('#checkout .checkout-btn').getAttribute('class')) && dem(P, 'POST', '/don') === 1, String(dem(P, 'POST', '/don')));
    });
  }

  await ca('loi-biet-khong-khoa', { gio: GIO2, pos: { loiDon: { error: 'Quán vừa ngừng nhận đơn, mở lại 07:00', code: 'QUA_GIO_NHAN_DON' } } }, async (t, loi, P) => {
    await mo(t, '/thanhtoan');
    await t.locator('#checkout .checkout-btn').click(); await t.waitForTimeout(700);
    k('B6/K5 POS báo lỗi chắc chưa tạo đơn (QUA_GIO_NHAN_DON) → hiện nguyên câu, nút KHÔNG bị khoá', /Quán vừa ngừng nhận đơn, mở lại 07:00/.test(await chu(t, '#checkout')) && !/Đơn có thể đã tạo/.test(await chu(t, '#checkout')) && !/btn-disabled/.test(await t.locator('#checkout .checkout-btn').getAttribute('class')) && dem(P, 'POST', '/don') === 1);
  });

  await ca('tao-ma-moi', { gio: GIO2, pos: { qr: { chuoi: '0002', het_han: BAY('20:29:00') } } }, async (t, loi, P) => {
    await mo(t, '/thanhtoan');
    await t.locator('#checkout .checkout-btn').click(); await t.waitForTimeout(900);
    await t.locator('#tracking button', { hasText: 'Tạo mã mới' }).click(); await t.waitForTimeout(800);
    k('B7 "Tạo mã mới": huỷ đơn cũ (1 lần) rồi về Thanh toán, giỏ còn nguyên', dem(P, 'POST', '/don/TQD42/huy') === 1 && /\/thanhtoan$/.test(t.url()) && (await chu(t, '.tab .tab-so')) === '2', t.url());
  });

  await ca('tao-ma-moi-loi', { gio: GIO2, pos: { qr: { chuoi: '0002', het_han: BAY('20:29:00') }, huyLoi: { error: 'Đơn đã được thanh toán, không huỷ được', code: 'DON_DA_TRA' } } }, async (t, loi, P) => {
    await mo(t, '/thanhtoan');
    await t.locator('#checkout .checkout-btn').click(); await t.waitForTimeout(900);
    await t.locator('#tracking button', { hasText: 'Tạo mã mới' }).click(); await t.waitForTimeout(800);
    k('B7 "Tạo mã mới" mà POS từ chối huỷ → ở lại Theo dõi đơn, hiện nguyên lời POS (không tạo đơn thứ hai)', /\/don\/TQD42$/.test(t.url()) && /Đơn đã được thanh toán, không huỷ được/.test(await chu(t, '#tracking')) && dem(P, 'POST', '/don') === 1, t.url());
  });

  await ca('khach-menu-can-dn', { dn: false, gio: GIO2, pos: { menuCanDN: true } }, async (t) => {
    await mo(t, '/giohang');
    k('A4 POS đòi đăng nhập mới cho xem menu: giỏ không báo "ngừng bán", Tiếp tục vẫn bấm được', !/ngừng bán|Không còn trong menu/.test(await chu(t, '#cart')) && !/btn-disabled/.test(await t.locator('#cart .checkout-btn').getAttribute('class')));
    await t.locator('#cart .checkout-btn').click(); await t.waitForTimeout(400);
    k('A4 … → /dangnhap?tiep=%2Fthanhtoan', /\/dangnhap\?tiep=%2Fthanhtoan$/.test(t.url()), t.url());
  });

  await ca('co-tat-dat-lai', { batCo: false }, async (t) => {
    await mo(t, '/taikhoan/donhang');
    k('C3 cờ tắt: Lịch sử đơn KHÔNG có nút "Đặt lại" (đọc mon[].ma — trường dự kiến)', (await t.locator('.order-card').count()) === 1 && (await t.locator('.reorder-btn').count()) === 0);
  });

  await ca('co-tat', { dn: false, batCo: false }, async (t, loi, P) => {
    await mo(t, '/mon/tra-luc-bao');
    await t.locator('.detail-addcart').click(); await t.waitForTimeout(300);
    k('D2 cờ tắt: giỏ vẫn dùng được', (await chu(t, '.tab .tab-so')) === '1');
    await t.evaluate(() => localStorage.setItem('kh_token', 'tok-A'));
    await mo(t, '/thanhtoan');
    const trang = await chu(t, '#checkout');
    k('D2/E6.3 cờ tắt: Thanh toán hiện "Đặt online sắp mở — mời bạn đặt tại quầy", không tổng tiền bịa', /Đặt online sắp mở — mời bạn đặt tại quầy/.test(trang) && /Tổng tiền sẽ hiện khi quán xác nhận/.test(trang) && !/Tổng cộng/.test(trang), trang);
    await t.locator('#checkout .checkout-btn').click({ force: true }); await t.waitForTimeout(500);
    k('D2 cờ tắt: 0 lời gọi tới cửa đặt đơn (/gio/*, POST /don)', dem(P, 'POST', /^\/gio\//) === 0 && dem(P, 'POST', /^\/don/) === 0, JSON.stringify(P.goi.map((g) => g.duong)));
  });

  for (const rong of [360, 390, 430]) {
    for (const co of ['100%', '130%']) {
      await ca(`co-${rong}-${co}`, { rong, gio: [{ ma: 'TLB', so_luong: 2, ghi_chu: 'ít ngọt, nhiều đá, để riêng ly giúp mình nhé cảm ơn quán' }, { ma: 'HET', so_luong: 1, ghi_chu: '' }], pos: { tt: 'dang_lam' } }, async (t, loi) => {
        for (const d of ['/giohang', '/thanhtoan', '/don/TQD42']) {
          await mo(t, d, co);
          const o = await t.evaluate(() => { const s = document.querySelector('.screens'); return { tran: s.scrollWidth > s.clientWidth + 1, w: s.scrollWidth, c: s.clientWidth }; });
          k(`E1 ${rong}px · chữ ${co} · ${d}: không tràn ngang`, !o.tran, JSON.stringify(o));
          if (luuAnh && co === '100%') await t.screenshot({ path: path.join(luuAnh, `app_${d.split('/')[1]}_${rong}.png`), fullPage: false });
        }
        k(`E1 ${rong}px · chữ ${co}: Lỗi JS = 0`, loi.length === 0, loi.join('|'));
      });
    }
  }
  await trinh.close();
}
