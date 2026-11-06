#!/usr/bin/env node
// THỬ KH-NHANH-1 — kho dữ liệu khách dùng chung, tải trước, cập nhật ngầm, bản tóm tắt trên máy, màn mở một lần mỗi ngày, Thanh toán lấy số dư mới, ẩn hạng 0%.
// Phần 1: hàm thuần + đọc nguồn (không trình duyệt) · Phần 2: App thật trong Chromium + POS giả trễ 700 ms, ĐẾM số lần gọi từng cửa.
// Chạy: node cong_cu/thu_KHNHANH1.js → dòng cuối "n đạt · m hỏng". KHONG_TRINH_DUYET=1 hoặc không có Playwright → phần 2 BỎ QUA (không tính hỏng).
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
// Ca đọc nguồn khớp trên code ĐÃ BỎ chú thích (`/* … */`, `// …` ngoài chuỗi có "://"): marker nằm trong chú thích không làm bài xanh.
const boChuThich = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`\\])\/\/[^\n]*/g, '$1');
const doc = (f) => (f.startsWith('src/') ? boChuThich(docTho(f)) : docTho(f));
const nap = (f) => import(pathToFileURL(path.join(GOC, f)).href);
const thu = async (ten, f) => { try { await f(); } catch (e) { k(`${ten} dừng giữa chừng`, false, String(e && e.message).split('\n')[0]); } };
const cho = (ms) => new Promise((r) => setTimeout(r, ms));
/** Lời hứa mở ngoài: { p, xong, hong }. */
const hua = () => { let xong, hongF; const p = new Promise((a, b) => { xong = a; hongF = b; }); return { p, xong, hong: hongF }; };
const khoGia = (chan = false) => {
  const m = new Map();
  const nem = () => { throw new Error('chặn'); };
  return chan ? { getItem: nem, setItem: nem, removeItem: nem } : { m, getItem: (x) => (m.has(x) ? m.get(x) : null), setItem: (x, v) => m.set(x, String(v)), removeItem: (x) => m.delete(x) };
};

const KHACH_A = { sdt: '0909123456', ten: 'Nguyễn Linh', ngay_tao: '2026-01-01T08:00:00', xung_ho: 'chi', dia_chi: '12 Lê Lợi', qr: 'QR-A-BI-MAT', hang: { id: 2, ten: 'Vàng', phan_tram: 10, phan_tram_nhom_dac_biet: 5, het_han: '2026-11-15T23:59:59', thua: 1 }, so_du_vi: 100000 };

(async () => {
  console.log('Phần 1 — hàm thuần + đọc nguồn');
  k('KH-TT-1 A2 dòng ví khoá khi chờ /toi: class the-vi-khoa trên CẢ dòng (không còn btn-disabled trên .switch)', /the-vi-khoa/.test(doc('src/pages/ThanhToan.jsx')) && !/switch[^`]*btn-disabled/.test(doc('src/pages/ThanhToan.jsx')));
  const MAN = ['src/pages/TaiKhoan.jsx', 'src/pages/TrangChu.jsx', 'src/pages/UuDai.jsx', 'src/pages/HoSo.jsx', 'src/pages/ManQR.jsx'];

  await thu('A', async () => {
    const D = await nap('src/duLieuKhach.js');
    k('A1 bốn kho chung: cuaToi, cuaDiem, cuaVoucher, cuaDon', ['cuaToi', 'cuaDiem', 'cuaVoucher', 'cuaDon'].every((x) => D[x] && D[x].kho && typeof D[x].lay === 'function'));
    k('A1 dựng trên taoKho / dungKho', /from '\.\/kho\.js'/.test(doc('src/duLieuKhach.js')) && /taoKho\(/.test(doc('src/duLieuKhach.js')) && /dungKho\(/.test(doc('src/duLieuKhach.js')));
    const sai = MAN.filter((f) => /dungTai\((layToi|layDiem|layVoucher)\)/.test(doc(f)) || !/dungCua\(/.test(doc(f)));
    k('A1 các màn đọc kho (dungCua), không dungTai(layToi|layDiem|layVoucher)', sai.length === 0, sai.join(','));
    const ap = doc('src/App.jsx');
    k('A1 App không gọi layToi() riêng (dùng cuaToi.lay — cùng lệnh)', !/layToi\(\)/.test(ap) && /cuaToi\.lay\(\)/.test(ap));
    k('A1 Lịch sử đơn: trang 1 đọc cuaDon', /dungCua\(cuaDon\)/.test(doc('src/pages/Don.jsx')));

    // A2 — không gọi trùng
    let goi = 0; let h = hua();
    const c = D.taoCua(() => { goi++; return h.p; });
    const s0 = D.hienCua(c.kho.lay());
    k('A1 kho mới: dl null, luc 0, dangTai true (chưa có dữ liệu), loi rỗng', c.kho.lay().dl === null && c.kho.lay().luc === 0 && s0.dangTai === true && s0.loi === '');
    const p1 = c.lay(), p2 = c.lay();
    k('A2 hai lệnh khi cửa đang chờ → gọi POS MỘT lần, dùng chung lời hứa', goi === 1 && p1 === p2, String(goi));
    h.xong({ points: 5 }); await p1;
    const s1 = c.kho.lay();
    k('A1 lấy xong: dl + luc (thời điểm lấy)', s1.dl && s1.dl.points === 5 && s1.luc > 0);
    h = hua(); c.lay();
    k('A2 lệnh xong rồi → lần sau gọi mới', goi === 2);
    k('A3 có dl mà đang lấy ngầm → KHÔNG dangTai (không khung xám)', D.hienCua(c.kho.lay()).dangTai === false && D.hienCua(c.kho.lay()).dl.points === 5);
    h.hong(new Error('Mất mạng')); await cho(5);
    const s2 = D.hienCua(c.kho.lay());
    k('A3 lỗi khi đã có dữ liệu → giữ bản cũ, không báo lỗi', s2.dl && s2.dl.points === 5 && s2.loi === '' && !s2.dangTai, JSON.stringify(s2));
    h = hua(); const c2 = D.taoCua(() => h.p); const pc = c2.lay(); h.hong(new Error('Mất mạng')); const kq = await pc;
    const s3 = D.hienCua(c2.kho.lay());
    k('A3 chưa từng có dữ liệu mà lỗi → loi (khung lỗi + Thử lại), lời hứa không ném', s3.dl === null && s3.loi === 'Mất mạng' && !s3.dangTai && kq === null, JSON.stringify(s3));
    k('A3 hienCua { that }: bản tóm tắt trên máy (tuMay) không tính là dữ liệu thật', D.hienCua({ dl: { tuMay: true }, luc: 0, loi: '' }, true).dl === null && D.hienCua({ dl: { tuMay: true }, luc: 0, loi: '' }).dl.tuMay === true);

    // A3 / D1 — quy tắc thời gian
    k('A3 PHUT_CON_MOI = 5, GIAY_QUAY_LAI = 60', D.PHUT_CON_MOI === 5 && D.GIAY_QUAY_LAI === 60);
    const T = 1000000;
    k('A3 conMoi: chưa lấy (luc 0) → cũ; 4:59 → mới; 5:00 → cũ', !D.conMoi(0, T, 300) && D.conMoi(T, T + 299999, 300) && !D.conMoi(T, T + 300000, 300));
    k('D1 conMoi 60 giây: 59 s → mới; 61 s → cũ', D.conMoi(T, T + 59000, 60) && !D.conMoi(T, T + 61000, 60));
    let g3 = 0; const c3 = D.taoCua(() => { g3++; return Promise.resolve({ x: 1 }); });
    await c3.lay(); const L = c3.kho.lay().luc;
    c3.napNeuCu(300, L + 1000); c3.napNeuCu(300, L + 299000);
    k('A3 napNeuCu: lấy chưa quá 5 phút → không gọi', g3 === 1, String(g3));
    await c3.napNeuCu(300, L + 300001);
    k('A3 napNeuCu: quá 5 phút → gọi (ngầm)', g3 === 2, String(g3));

    // D1 — quay lại app
    let ga = 0, gb = 0;
    const ca1 = D.taoCua(() => { ga++; return Promise.resolve({ a: 1 }); }), cb = D.taoCua(() => { gb++; return Promise.resolve({ b: 1 }); });
    await ca1.lay(); const La = ca1.kho.lay().luc;
    D.lamMoiKhiQuayLai([ca1, cb], La + 10000);
    k('D1 quay lại sau 10 giây → không gọi; kho chưa có gì → không gọi', ga === 1 && gb === 0, `${ga}/${gb}`);
    D.lamMoiKhiQuayLai([ca1, cb], La + 61000);
    k('D1 quay lại sau 61 giây → lấy lại kho đã có', ga === 2 && gb === 0, `${ga}/${gb}`);

    // D4 — đổi phiên
    const h4 = [hua(), hua()]; let g4 = 0; const c4 = D.taoCua(() => h4[g4++].p);
    const cu = c4.lay(); c4.xoa();
    k('D4 xoá: dl null ngay', c4.kho.lay().dl === null && c4.kho.lay().luc === 0);
    const moi = c4.lay();
    k('D4 sau xoá, lệnh mới không dùng lại lệnh của phiên cũ', g4 === 2 && moi !== cu, String(g4));
    h4[0].xong({ cua: 'phien-cu' }); await cu; await cho(5);
    k('D4 kết quả của phiên cũ về muộn → bị bỏ', c4.kho.lay().dl === null, JSON.stringify(c4.kho.lay().dl));
    k('D4 xoaKhoKhach xoá đủ bốn kho', /export (function|const) xoaKhoKhach/.test(doc('src/duLieuKhach.js')) && D.CUA_KHACH.length === 4 && [D.cuaToi, D.cuaDiem, D.cuaVoucher, D.cuaDon].every((x) => D.CUA_KHACH.includes(x)));
    k('D4 App dọn phiên (đăng xuất / 401) gọi xoaKhoKhach NGAY trong donPhien', /const donPhien = \(\) => \{[^\n]*xoaKhoKhach\(\)/.test(ap));

    // D3 — sau thao tác đổi dữ liệu
    let g5 = 0; const c5 = D.taoCua(() => { g5++; return Promise.resolve({ khach: { ten: 'Mới', sdt: '0909', qr: 'Q' } }); });
    await c5.lay();
    D.gopToi(c5, { ten: 'Lan', xung_ho: 'co' });
    k('D3 lưu hồ sơ có hồ sơ POS trả về → gộp vào kho, KHÔNG gọi lại /toi', g5 === 1 && c5.kho.lay().dl.khach.ten === 'Lan' && c5.kho.lay().dl.khach.qr === 'Q' && c5.kho.lay().dl.khach.xung_ho === 'co');
    D.gopToi(c5, {}); await cho(5);
    k('D3 POS không trả hồ sơ → lấy lại /toi', g5 === 2, String(g5));
    await cho(5); D.gopToi(c5, { sdt: '0911222333', ten: 'Người khác' }); await cho(5);
    k('D4 trả lời PUT /toi của phiên trước (sdt khác) về muộn → không gộp vào kho của khách hiện tại', c5.kho.lay().dl.khach.ten !== 'Người khác' && g5 === 2, JSON.stringify(c5.kho.lay().dl.khach));
    D.gopToi(c5, { sdt: '+84 909', ten: 'Cùng khách' });
    k('K5 cùng số điện thoại khác định dạng (+84… / 0…) → vẫn gộp (không chặn oan)', c5.kho.lay().dl.khach.ten === 'Cùng khách' && g5 === 2, JSON.stringify(c5.kho.lay().dl.khach));
    const dlk0 = doc('src/duLieuKhach.js');
    k('A3 mở màn: dungCua chỉ lấy khi bản quá 5 phút (napNeuCu), không gọi thẳng lay', /export function dungCua[\s\S]*?useEffect\(\(\) => \{ cua\.napNeuCu\(\); \}, \[cua\]\)/.test(dlk0) && !/export function dungCua[\s\S]*?useEffect\(\(\) => \{ cua\.lay\(\)/.test(dlk0));
    const dnSrc = doc('src/pages/Don.jsx');
    k('A4 Lịch sử đơn: chỉ bỏ trang sau khi DANH SÁCH MÃ trang 1 đổi (so nội dung, không so đối tượng)', /const khoaTrang1 = dau\.dl \? dau\.dl\.data\.map\(\(d\) => d\.ma\)\.join\(','\) : ''/.test(dnSrc) && /if \(khoaTruoc\.current && khoaTrang1 !== khoaTruoc\.current\) datSau\(TRANG_SAU_RONG\)/.test(dnSrc) && /\}, \[khoaTrang1\]\)/.test(dnSrc) && !/\[dau\.dl\]\)/.test(dnSrc));
    let g6 = 0; const c6 = D.taoCua(() => { g6++; return Promise.resolve({}); });
    D.gopToi(c6, { ten: 'X' });
    k('D4 kho trống (đã đổi / hết phiên) → gopToi không ghi, không gọi', c6.kho.lay().dl === null && g6 === 0);
    const uu = doc('src/pages/UuDai.jsx');
    k('D3 nhận mã hoá đơn → lấy lại /diem, /voucher, /toi', /khiXong=\{\(\) => lamMoi\(\[cuaDiem, cuaVoucher, cuaToi\]\)\}/.test(uu));
    k('D3 lưu hồ sơ (HoSo) gộp kết quả vào cuaToi', /gopToi\(cuaToi/.test(doc('src/pages/HoSo.jsx')));
    k('D3 đặt đơn → lấy lại /toi, /don, /diem', /const xongDatDon = \(don\) => \{[^\n]*lamMoi\(\[cuaToi, cuaDon, cuaDiem\]\)/.test(ap));
    k('D1/D2 App bật làm mới ngầm (dungLamMoiNgam) theo phiên', /dungLamMoiNgam\(dangNhap\)/.test(ap) && /visibilitychange/.test(doc('src/duLieuKhach.js')) && /setInterval\([^\n]*PHUT_CON_MOI \* 60000/.test(doc('src/duLieuKhach.js')));
    k('B1 App mở có phiên → tải trước cả bốn cửa (lamMoi(CUA_KHACH))', /lamMoi\(CUA_KHACH\)/.test(ap));
    k('B2 đăng nhập xong: DangNhap trả hồ sơ, App doiKhach(sdt) TRƯỚC khi bật phiên', /khiXong\(r\.khach\)/.test(doc('src/pages/DangNhap.jsx')) && /khiXong=\{\(k\) => \{[^}]*doiKhach\(k\.sdt\)[^}]*datDangNhap\(true\)/.test(ap));
  });

  await thu('A4-A5', async () => {
    const uu = doc('src/pages/UuDai.jsx'), dn = doc('src/pages/Don.jsx');
    k('A4 "Xem tất cả" voucher vẫn gọi layVoucher(true) khi bấm', /layVoucher\(true\)/.test(uu) && /dungCua\(cuaVoucher\)/.test(uu));
    k('A4 Lịch sử đơn trang ≥ 2 vẫn gọi layDon khi bấm "Xem thêm"', /layDon\(/.test(dn) && /Xem thêm/.test(dn));
    const tep = (d) => fs.readdirSync(path.join(GOC, d), { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? tep(path.join(d, e.name)) : [path.join(d, e.name)]));
    const goiMang = tep('src').filter((f) => /\.(js|jsx)$/.test(f) && f !== path.join('src', 'api.js') && /\bfetch\(/.test(doc(f)));
    k('A5 api.js vẫn là chỗ DUY NHẤT gọi mạng', goiMang.length === 0, goiMang.join(','));
    k('A5 duLieuKhach chỉ lấy dữ liệu qua api.js', /from '\.\/api\.js'/.test(doc('src/duLieuKhach.js')) && !/fetch\(/.test(doc('src/duLieuKhach.js')));
  });

  await thu('E', async () => {
    const TT = await nap('src/tomTatLuu.js');
    const ban = TT.rutTomTat({ khach: KHACH_A }, { points: 1250, history: [{ id: 1, points: 10 }] }, 'chu-A', 123);
    k('E1 chỉ giữ ten, xung_ho, hang, so_du_vi, points + chu + luc', JSON.stringify(Object.keys(ban).sort()) === JSON.stringify(['chu', 'hang', 'luc', 'points', 'so_du_vi', 'ten', 'xung_ho']), Object.keys(ban).join());
    k('E1 hang chỉ 5 trường (id, ten, phan_tram, phan_tram_nhom_dac_biet, het_han)', JSON.stringify(Object.keys(ban.hang).sort()) === JSON.stringify(['het_han', 'id', 'phan_tram', 'phan_tram_nhom_dac_biet', 'ten']));
    const chuoi = JSON.stringify(ban);
    k('E1 KHÔNG có sdt / qr / dia_chi / lịch sử', !/0909123456|QR-A-BI-MAT|Lê Lợi|history|ngay_tao/.test(chuoi), chuoi);
    k('E1 không có /diem → bỏ points (không bịa 0)', !('points' in TT.rutTomTat({ khach: KHACH_A }, null, 'c', 1)));
    k('E1 không có hồ sơ thật → không tạo bản lưu', TT.rutTomTat(null, { points: 1 }, 'c', 1) === null && TT.rutTomTat({ khach: KHACH_A, tuMay: true }, null, 'c', 1) === null);
    const kh = khoGia();
    k('E2 một khoá kh_tom_tat', TT.KHOA_TOM_TAT === 'kh_tom_tat');
    k('E5 ghi vào kho thường → true; đọc lại đúng', TT.ghiTomTat(ban, kh) === true && TT.docTomTat(kh).points === 1250 && TT.docTomTat(kh).ten === 'Nguyễn Linh');
    kh.setItem('kh_tom_tat', JSON.stringify({ ...ban, sdt: '0909123456', qr: 'X', dia_chi: 'Y' }));
    k('E1 đọc bản lưu bị chèn sdt / qr → lọc bỏ', !/0909123456|"qr"|dia_chi/.test(JSON.stringify(TT.docTomTat(kh))));
    k('E3 chỉ hiện bản của đúng khách (chu khớp kh_chu)', TT.tomTatCuaKhach(ban, 'chu-A') === ban && TT.tomTatCuaKhach(ban, 'chu-B') === null && TT.tomTatCuaKhach(ban, null) === null && TT.tomTatCuaKhach(null, 'chu-A') === null);
    const chan = khoGia(true);
    let vo = false; let g, d;
    try { g = TT.ghiTomTat(ban, chan); d = TT.docTomTat(chan); } catch { vo = true; }
    k('E5 kho bị chặn → không vỡ, ghi trả false, đọc null', !vo && g === false && d === null);
    kh.setItem('kh_tom_tat', '{hỏng');
    k('E5 bản lưu hỏng → null', TT.docTomTat(kh) === null);

    const LM = await nap('src/luuMay.js');
    const k2 = khoGia(); LM.ghiChu('0909123456', k2); k2.setItem('kh_tom_tat', '{}');
    LM.xoaTatCa(k2);
    k('E2 bấm Đăng xuất (xoaTatCa) → xoá kh_tom_tat', k2.getItem('kh_tom_tat') === null);
    const k3 = khoGia(); LM.ghiChu('0909123456', k3); k3.setItem('kh_tom_tat', '{}');
    LM.doiKhach('0909123456', k3);
    k('E2 cùng khách → giữ kh_tom_tat', k3.getItem('kh_tom_tat') === '{}');
    LM.doiKhach('0911222333', k3);
    k('E2 người đăng nhập sau là khách khác → xoá kh_tom_tat', k3.getItem('kh_tom_tat') === null);
    k('E3 luuMay cho đọc dấu vết chủ hiện tại (docChu)', typeof LM.docChu === 'function' && LM.docChu(k3) === LM.dauVet('0911222333'));
    const ap = doc('src/App.jsx');
    k('E2 hết phiên (401) không xoá dữ liệu trên máy: donPhien không gọi xoaTatCa', !/const donPhien = \(\) => \{[^\n]*xoaTatCa/.test(ap));
    const dlk = doc('src/duLieuKhach.js');
    const D = await nap('src/duLieuKhach.js');
    const kg = khoGia(); kg.setItem('kh_chu', 'chu-B'); kg.setItem('kh_tom_tat', JSON.stringify(ban));
    D.xoaKhoKhach(); D.napTomTat(kg);
    k('E3 bản lưu của khách A, máy đang giữ khách B (kh_chu) → KHÔNG gieo vào kho', D.cuaToi.kho.lay().dl === null && D.cuaDiem.kho.lay().dl === null, JSON.stringify(D.cuaToi.kho.lay().dl));
    kg.setItem('kh_chu', 'chu-A'); D.napTomTat(kg);
    const gieo = D.cuaToi.kho.lay().dl;
    k('E3 đúng chủ → gieo tên, xưng hô, hạng, ví, điểm (cờ tuMay, luc 0 → vẫn lấy mới), không sdt / qr', gieo && gieo.tuMay && gieo.khach.ten === 'Nguyễn Linh' && D.cuaDiem.kho.lay().dl.points === 1250 && D.cuaToi.kho.lay().luc === 0 && !('sdt' in gieo.khach) && !('qr' in gieo.khach), JSON.stringify(gieo));
    kg.removeItem('kh_chu'); D.xoaKhoKhach(); D.napTomTat(kg);
    k('E3 chưa biết chủ (không kh_chu) → không gieo', D.cuaToi.kho.lay().dl === null);
    const chuA = LM.dauVet(KHACH_A.sdt);
    const kl = khoGia(); kl.setItem('kh_chu', chuA); kl.setItem('kh_tom_tat', JSON.stringify({ ...ban, chu: chuA }));
    D.xoaKhoKhach(); D.napTomTat(kl);
    D.cuaToi.kho.dat({ dl: { khach: { ...KHACH_A, ten: 'Linh Mới' } }, luc: 5, loi: '' }); D.luuTomTat(kl);
    const sau = TT.docTomTat(kl);
    k('E3 /toi thật về trước /diem → bản lưu đổi tên nhưng GIỮ điểm cũ của cùng khách', sau && sau.ten === 'Linh Mới' && sau.points === 1250, JSON.stringify(sau));
    D.cuaDiem.kho.dat({ dl: { points: 1300, history: [] }, luc: 5, loi: '' }); D.luuTomTat(kl);
    k('E3 /diem thật về → bản lưu lấy điểm mới', TT.docTomTat(kl).points === 1300);
    kl.setItem('kh_chu', 'chu-khac'); kl.setItem('kh_tom_tat', '{"chu":"x"}'); D.luuTomTat(kl);
    k('E3 hồ sơ thật KHÔNG thuộc chủ đang giữ máy → không ghi bản lưu (chờ doiKhach dọn)', kl.getItem('kh_tom_tat') === '{"chu":"x"}');
    D.xoaKhoKhach();
    k('E3 ghi bản lưu chỉ khi hồ sơ thật thuộc đúng chủ (cungKhach === true)', /cungKhach\([^)]*\) !== true/.test(dlk));
    k('E4/F1 Thanh toán không đọc kho / bản lưu', !/cuaToi|duLieuKhach|tomTat/.test(doc('src/pages/ThanhToan.jsx')) && /dungTai\(layToi\)/.test(doc('src/pages/ThanhToan.jsx')));
    k('E4 bản lưu chỉ đọc ở duLieuKhach (không chỗ nào khác dùng để tính)', fs.readdirSync(path.join(GOC, 'src/pages')).every((f) => !/tomTatLuu/.test(doc('src/pages/' + f))) && !/tomTatLuu/.test(doc('src/datDon.js') + doc('src/dungDatDon.js')));
  });

  await thu('C', async () => {
    const N = await nap('src/ngayManDau.js');
    k('C1 chưa xem → hiện; đã xem hôm nay → không; xem hôm qua → hiện', N.canHienManDau(null, '2026-11-01') && !N.canHienManDau('2026-11-01', '2026-11-01') && N.canHienManDau('2026-10-31', '2026-11-01'));
    k('C2 ngày theo giờ VN của đồng hồ máy (17:30 UTC 31.10 = 01.11 ở VN)', N.homNayMay(new Date('2026-10-31T17:30:00Z')) === '2026-11-01' && N.homNayMay(new Date('2026-10-31T16:59:00Z')) === '2026-10-31');
    const kh = khoGia();
    k('C1 ghi rồi đọc lại ngày đã xem (localStorage)', N.ghiNgayDaXem('2026-11-01', kh) === true && N.docNgayDaXem(kh) === '2026-11-01');
    const chan = khoGia(true); let vo = false; let d;
    try { d = N.docNgayDaXem(chan); N.ghiNgayDaXem('2026-11-01', chan); } catch { vo = true; }
    k('C3 kho bị chặn → không vỡ, đọc null → hiện màn mở', !vo && d === null && N.canHienManDau(d, '2026-11-01'));
    k('C2 ghi chú ngoại lệ §6 ngay trên dòng code homNayMay (chú thích → đọc bản thô)', /§6[^\n]*(hiệu ứng|hiện \/ không hiện)[^\n]*\nexport const homNayMay/.test(docTho('src/ngayManDau.js')));
    const md = doc('src/components/ManDau.jsx');
    k('C1 ManDau dùng quy tắc ngày (canHienManDau + homNayMay)', /canHienManDau\(docNgayDaXem\(\), homNayMay\(\)\)/.test(md) && /ghiNgayDaXem\(homNayMay\(\)\)/.test(md));
  });

  await thu('F-G', async () => {
    const tt = doc('src/pages/ThanhToan.jsx');
    k('F1 trong lúc chờ /toi: "Đang cập nhật số dư…"', /toi\.dangTai \? 'Đang cập nhật số dư…'/.test(tt));
    k('F1 (KH-MUA-1b) Thanh toán dùng cửa đặt đơn thật của api.js — không còn cổng tiêm datCongDatDon (bài thử dựng app nguyên bản)', !/datCongDatDon/.test(doc('src/datDon.js') + tt) && /baoGiaGio/.test(doc('src/datDon.js')));
    k('F2 Theo dõi đơn, Chi tiết đơn không đọc kho', !/duLieuKhach|dungCua/.test(doc('src/pages/TheoDoiDon.jsx')) && /dungTai\(useCallback\(\(\) => layChiTietDon/.test(doc('src/pages/Don.jsx')));
    const GH = await nap('src/giaHang.js');
    const ds = [{ id: 1, ten: 'Test0d', phan_tram: 0 }, { id: 2, ten: 'Vàng', phan_tram: 10 }, { id: 3, ten: 'Chuỗi', phan_tram: '5' }, { id: 4, ten: 'Rỗng', phan_tram: null }, { id: 5, ten: 'Âm', phan_tram: -1 }, { id: 6, ten: 'Lạ', phan_tram: NaN }];
    k('G1 bỏ hạng phan_tram = 0 / không phải số > 0', JSON.stringify(GH.hangCoGiam(ds).map((h) => h.id)) === '[2]', JSON.stringify(GH.hangCoGiam(ds)));
    k('G2 không còn hạng nào → [] (thẻ ẩn); không phải mảng → []', GH.hangCoGiam([{ phan_tram: 0 }]).length === 0 && GH.hangCoGiam(null).length === 0);
    k('G1 thẻ hạng Ưu đãi lọc bằng hangCoGiam', /hangCoGiam\(dsHang\)/.test(doc('src/pages/UuDai.jsx')));
  });

  await thu('H2', async () => {
    const DD = await nap('src/dinhDang.js');
    k('D3 lời chào dùng đủ tên khách nhập (hàm thuần, chạy cả khi không trình duyệt)', DD.chiaLoiChao('2026-11-05T19:00:00', 'chi', 'Nguyễn Linh').ten === 'Nguyễn Linh', JSON.stringify(DD.chiaLoiChao('2026-11-05T19:00:00', 'chi', 'Nguyễn Linh')));
    k('H2 bài đọc KHONG_TRINH_DUYET', /process\.env\.KHONG_TRINH_DUYET === '1'/.test(doc('cong_cu/thu_KHNHANH1.js')));
  });

  console.log('Phần 2 — Chromium + POS giả trễ 700 ms');
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
  const esbuild = require('esbuild');
  const LM = await nap('src/luuMay.js');
  // App nguyên bản (KH-MUA-1b: cửa đặt đơn đã nối ở api.js, cờ DAT_ONLINE bật) — Thanh toán có báo giá thật từ POS giả.
  const goiApp = (await esbuild.build({
    stdin: { contents: `import './main.jsx';`, resolveDir: path.join(GOC, 'src'), loader: 'jsx' },
    bundle: true, write: false, format: 'iife', jsx: 'automatic', logLevel: 'silent',
    loader: { '.css': 'empty', '.json': 'json' }, define: { 'process.env.NODE_ENV': '"production"', 'import.meta.env.VITE_POS_API': '""' },
  })).outputFiles[0].text;
  const cssTron = (f) => doc(f).replace(/@import\s+'\.\/([^']+)';/g, (_, t) => cssTron(path.posix.join(path.posix.dirname(f), t)));
  const css = [...doc('src/main.jsx').matchAll(/import '\.\/(giaoDien\/[^']+\.css)'/g)].map((m) => cssTron('src/' + m[1])).join('\n');
  const trinh = await pw.chromium.launch({ args: ['--no-sandbox'] });
  const URL0 = 'http://kh.test';
  const HTML = doc('index.html').replace(/<script type="module"[^>]*><\/script>/, '<script src="/bundle.js"></script>').replace('</head>', `<style>${css}</style></head>`);
  const TRE = 700;
  const BAY = '2026-10-30T20:30:00';
  const B = { sdt: '0911222333', ten: 'Trần Bình', ngay_tao: '2026-02-01T08:00:00', xung_ho: 'anh', dia_chi: null, qr: 'QR-B', hang: null, so_du_vi: 5000 };
  const MENU = { success: true, data: [{ ma: 'TLB', ten: 'Trà Lục Bảo', nhom: 'Trà Đông Y', gia: 30000, con_hang: true, ton_cu: false, ton_luc: null, gia_hang: [] }] };
  const BG = { success: true, dong: [{ ma: 'TLB', so_luong: 1, don_gia: 30000, thanh_tien: 30000 }], tam_tinh: 30000, giam: [], phi_giao: 0, tong: 30000 };
  const KHUNG_CUA = ['/toi', '/diem', '/voucher', '/don'];

  // Một ngữ cảnh = một máy. `gieo` = localStorage gieo sẵn MỘT lần (trang đầu). `xemManDau` = đã xem màn mở hôm nay.
  async function may(ten, { rong = 390, token = 'tok-A', gieo = {}, xemManDau = true } = {}, chay) {
    const ctx = await trinh.newContext({ viewport: { width: rong, height: 844 }, timezoneId: 'Asia/Ho_Chi_Minh' });
    await ctx.clock.install({ time: new Date('2026-10-30T20:30:00+07:00') }); await ctx.clock.resume();
    await ctx.addInitScript(({ token, gieo, xemManDau }) => {
      if (localStorage.getItem('da_gieo')) return;
      localStorage.setItem('da_gieo', '1');
      if (token) localStorage.setItem('kh_token', token);
      if (xemManDau) localStorage.setItem('kh_ngay_man_dau', new Date(Date.now() + 7 * 3600000).toISOString().slice(0, 10));
      for (const [x, v] of Object.entries(gieo)) localStorage.setItem(x, v);
    }, { token, gieo, xemManDau });
    const S = { goi: [], diem: { 'tok-A': 1250, 'tok-B': 40 }, chet: {}, khach: { 'tok-A': { ...KHACH_A }, 'tok-B': { ...B } } };
    const loi = [];
    await ctx.route(`${URL0}/**`, async (r) => {
      const req = r.request(), u = new URL(req.url()), p = u.pathname, pt = req.method(), auth = (req.headers().authorization || '').replace('Bearer ', '');
      const json = (status, o) => r.fulfill({ status, contentType: 'application/json', body: JSON.stringify(o) }).catch(() => {});
      if (p === '/bundle.js') return r.fulfill({ contentType: 'text/javascript', body: goiApp });
      if (!p.startsWith('/api/kh')) return /\.[a-z0-9]+$/.test(p) ? r.fulfill({ status: 204, body: '' }) : r.fulfill({ contentType: 'text/html', body: HTML });
      const duong = p.slice('/api/kh'.length);
      let than = null; try { than = req.postDataJSON(); } catch { /* không thân */ }
      S.goi.push({ pt, duong, auth, q: u.search, luc: Date.now() });
      await cho(S.tre || TRE);
      if (duong === '/gio-vang') return json(200, { success: true, dang_chay: false, bat_dau: null, ket_thuc: null, phan_tram: 0, mon: [] });
      if (duong === '/hang') return json(200, { success: true, data: [{ id: 9, ten: 'Test0d', phan_tram: 0, phan_tram_nhom_dac_biet: 0, thu_tu: 0 }, { id: 2, ten: 'Vàng', phan_tram: 10, phan_tram_nhom_dac_biet: 5, thu_tu: 1 }] });
      if (duong === '/gio-hoat-dong') return json(200, { success: true, bay_gio: BAY, dang_mo: true, nhan_don: true, hom_nay: { mo: '08:00', dong: '22:00' }, mo_lai_luc: null, thong_bao: '', lich_tuan: [], ngay_nghi: [] });
      if (duong === '/menu') return json(200, MENU);
      if (duong === '/dang-nhap/xin-ma') return json(200, { success: true });
      if (duong === '/dang-nhap/xac-minh') return json(200, { success: true, token: 'tok-B', khach: { sdt: B.sdt, ten: B.ten, ngay_tao: B.ngay_tao, xung_ho: B.xung_ho, dia_chi: null } });
      if (!S.khach[auth] || S.chet[auth]) return json(401, { error: 'Phiên đăng nhập đã hết', code: 'KH_TOKEN_SAI' });
      if (duong === '/gia-han') return json(200, { success: true, token: auth, het_han: '2026-11-29T08:00:00' });
      if (duong === '/toi' && pt === 'PUT') { Object.assign(S.khach[auth], than); const { qr, hang, so_du_vi, ...con } = S.khach[auth]; return json(200, { success: true, khach: con }); }
      if (duong === '/toi') return json(200, { success: true, khach: S.khach[auth] });
      if (duong === '/diem') return json(200, { success: true, points: S.diem[auth], history: [] });
      if (duong === '/voucher') return json(200, { success: true, data: [{ id: 7, reward_name: 'Giảm 20.000đ', code: 'VC7', discount_type: 'fixed', discount_value: 20000, expires_at: '2026-11-30T23:59:59', status: 'active' }], ma_khach_moi: [] });
      const donO = (ma) => ({ ma, ngay: '2026-10-30T19:00:00', tong: 30000, da_tra: 30000, trang_thai: 'completed', thanh_toan: 'paid' });
      if (duong === '/don' && pt === 'GET' && u.search === '?trang=2') return json(200, { success: true, trang: 2, con_nua: false, data: [donO('TQD2')] });
      if (duong === '/don' && pt === 'GET') return json(200, { success: true, trang: 1, con_nua: !!S.coDon, data: S.coDon ? (S.donMoi ? [donO('TQD9'), donO('TQD1')] : [donO('TQD1')]) : [] });
      if (duong === '/nhan-diem') { S.diem[auth] += 10; return json(200, { success: true, diem_cong: 10 }); }
      if (duong === '/gio/bao-gia') return json(200, BG);
      return json(500, { error: 'chưa giả', code: 'LOI_GIA' });
    });
    const trang = async () => { const t = await ctx.newPage(); t.on('pageerror', (e) => loi.push(e.message)); t.setDefaultTimeout(5000); return t; };
    try { await chay({ ctx, S, trang }); } catch (e) { k(`ca ${ten} dừng giữa chừng`, false, String(e && e.message).split('\n')[0]); } finally { await ctx.close(); }
    k(`ca ${ten}: trang không báo lỗi JS`, loi.length === 0, loi[0]);
  }
  const dem = (S, duong, pt = 'GET') => S.goi.filter((g) => g.duong === duong && g.pt === pt).length;
  const demHet = (S) => KHUNG_CUA.map((d) => dem(S, d)).join(',');
  const mo = async (t, duong) => { await t.goto(URL0 + duong); await t.waitForSelector('.phone'); };
  const chu = (t, sel) => t.locator(sel).first().innerText().catch(() => '');
  const doiHet = async (t, sel, mau, ms = 4000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (mau.test(await chu(t, sel))) return Date.now() - t0; await t.waitForTimeout(25); } return -1; };
  const anHien = (t, an) => t.evaluate((an) => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => an }); Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => (an ? 'hidden' : 'visible') }); document.dispatchEvent(new Event('visibilitychange')); }, an);
  const chup = async (t, ten) => { if (process.env.LUU_ANH_DIR) await t.screenshot({ path: path.join(process.env.LUU_ANH_DIR, ten + '.png') }); };
  const sang = (t, duong) => t.evaluate((d) => { history.pushState(history.state, '', d); dispatchEvent(new PopStateEvent('popstate', { state: history.state })); }, duong);

  // B1 + A3: mở app → mỗi cửa một lần; chuyển tab 3 vòng → không gọi thêm, nội dung có ngay.
  const CO_MAN = [360, 390, 430];
  for (const rong of CO_MAN) {
    await may(`tab-${rong}`, { rong }, async ({ S, trang }) => {
      const t = await trang();
      await mo(t, '/trangchu');
      await doiHet(t, '#home .points-card .num', /1\.250/);
      await t.waitForTimeout(TRE + 400);
      const lan = Object.fromEntries([...KHUNG_CUA, '/menu'].map((d) => [d, dem(S, d)]));
      k(`B1 [${rong}] đã đăng nhập mở app → /toi, /diem, /voucher, /don, /menu mỗi cửa đúng MỘT lần`, Object.values(lan).every((n) => n === 1), JSON.stringify(lan));
      k(`B1 [${rong}] /don tải trước là trang 1`, S.goi.some((g) => g.duong === '/don' && g.q === '?trang=1'));
      const truoc = S.goi.length;
      const cham = [];
      const TAB = [['taikhoan', '#account .acc-q', /1\.250/], ['uudai', '#rewards .wallet-row', /1\.250/], ['trangchu', '#home .points-card .num', /1\.250/]];
      for (let v = 0; v < 3; v++) {
        for (const [tab, sel, mau] of TAB) {
          const t0 = Date.now();
          await t.locator(`.tabbar .tab:nth-child(${['trangchu', 'menu', 'giohang', 'uudai', 'taikhoan'].indexOf(tab) + 2})`).click();
          const ms = await doiHet(t, sel, mau, 1500);
          cham.push(ms < 0 ? 9999 : Date.now() - t0);
          if (await t.locator('.khung-tai').count()) cham.push(8888);
        }
      }
      await t.waitForTimeout(TRE + 200);
      const them = S.goi.slice(truoc).filter((g) => KHUNG_CUA.includes(g.duong) || g.duong === '/menu');
      k(`A3 [${rong}] qua lại Trang chủ ↔ Tài khoản ↔ Ưu đãi 3 vòng → KHÔNG gọi thêm cửa nào`, them.length === 0, them.map((g) => g.duong).join(','));
      k(`A3 [${rong}] mỗi lần chuyển tab nội dung có trong < 300 ms, không khung xám`, Math.max(...cham) < 300, cham.join(','));
      await t.locator('.tabbar .tab:nth-child(5)').click();
      const the = await chu(t, '#rewards .tier-card');
      k(`G1 [${rong}] khách có hạng → thẻ hạng của khách (không bảng hạng)`, /Hạng Vàng/.test(the), the);
      const tran = await t.evaluate(() => document.scrollingElement.scrollWidth <= window.innerWidth + 1);
      k(`H1 [${rong}] không tràn ngang`, tran);
    });
  }

  // Các ca dưới đây không đo thời gian chặt: ba cỡ màn chạy SONG SONG (mỗi cỡ một ngữ cảnh riêng) để cả bài < 120 giây (giới hạn của bộ kiểm).
  await Promise.all(CO_MAN.map(async (rong) => {
  // B3 + G — vãng lai
  await may(`vanglai-${rong}`, { rong, token: '' }, async ({ S, trang }) => {
    const t = await trang();
    await mo(t, '/uudai'); await t.waitForTimeout(TRE + 500);
    k(`B3 [${rong}] chưa đăng nhập → không gọi cửa cần token`, KHUNG_CUA.every((d) => dem(S, d) === 0), demHet(S));
    const the = await chu(t, '#rewards .tier-card');
    k(`G1 [${rong}] bảng hạng vãng lai không hiện hạng 0% (Test0d), vẫn hiện Vàng 10%`, /Vàng/.test(the) && /10%/.test(the) && !/Test0d/.test(the), the);
    await chup(t, `ung-dung_uudai-vanglai-hang_${rong}`);
  });

  // C1 + E3 — mở lần 2 cùng ngày; đổi ngày
  await may(`lan-hai-${rong}`, { rong, xemManDau: false }, async ({ ctx, S, trang }) => {
    const t = await trang();
    await mo(t, '/trangchu');
    k('C1 lần mở đầu tiên trong ngày → có màn mở', (await t.locator('#splashOverlay').count()) === 1);
    await t.locator('#skipBtn').click();
    await doiHet(t, '#home .points-card .num', /1\.250/); await t.waitForTimeout(300);
    const luu = await t.evaluate(() => localStorage.getItem('kh_tom_tat'));
    k('E1 có bản tóm tắt sau khi lấy /toi, /diem; không sdt / qr / địa chỉ', !!luu && /1250/.test(luu) && !/0909123456|QR-A-BI-MAT|Lê Lợi/.test(luu), luu);
    await t.close();
    S.diem['tok-A'] = 1300; S.khach['tok-A'].so_du_vi = 150000;
    S.tre = 1500; // POS chậm hơn ở lần mở thứ hai: "hiện ngay từ bản lưu" đo được rõ cả khi máy chạy thử đang bận
    const t2 = await trang();
    const t0 = Date.now();
    await mo(t2, '/trangchu');
    const daiNgay = await chu(t2, '#home .points-card .num'); const chao = await chu(t2, '#home h1');
    const sau = Date.now() - t0;
    k('C1 mở lần 2 cùng ngày → KHÔNG có màn mở', (await t2.locator('#splashOverlay').count()) === 0);
    k('E3 điểm + tên hiện NGAY từ bản lưu (trước khi POS trả)', /1\.250/.test(daiNgay) && /Linh/.test(chao) && sau < S.tre, `${daiNgay} | ${chao} | ${sau} ms`);
    k('E3 rồi đổi sang số POS mới', (await doiHet(t2, '#home .points-card .num', /1\.300/)) >= 0, await chu(t2, '#home .points-card .num'));
    await t2.locator('.tabbar .tab:nth-child(6)').click();
    k('E3 Tài khoản: số dư ví mới 150.000đ', (await doiHet(t2, '#account .acc-q', /150\.000/)) >= 0, await chu(t2, '#account .acc-q'));
    await t2.close();
    await ctx.clock.setSystemTime(new Date('2026-10-31T08:00:00+07:00'));
    const t3 = await trang();
    await mo(t3, '/trangchu');
    k('C1 đổi ngày → có màn mở', (await t3.locator('#splashOverlay').count()) === 1);
  });

  // F1 — Thanh toán luôn lấy /toi mới; nút ví khoá tới khi /toi về, kể cả khi kho / bản lưu có số dư đủ
  await may(`thanh-toan-${rong}`, { rong, gieo: { kh_gio: JSON.stringify([{ ma: 'TLB', so_luong: 1, ghi_chu: '' }]), kh_chu: LM.dauVet(KHACH_A.sdt), kh_tom_tat: JSON.stringify({ chu: LM.dauVet(KHACH_A.sdt), luc: 1, ten: 'Nguyễn Linh', xung_ho: 'chi', hang: null, so_du_vi: 999999, points: 1 }) } }, async ({ S, trang }) => {
    const t = await trang();
    await mo(t, '/trangchu'); await doiHet(t, '#home .points-card .num', /1\.250/); await t.waitForTimeout(TRE + 300);
    const n0 = dem(S, '/toi');
    await sang(t, '/thanhtoan'); await t.waitForTimeout(TRE - 400);
    const vi = t.locator('#checkout .the-vi'), cong = t.locator('#checkout .the-vi');
    const lop = await cong.getAttribute('class'), ch = await vi.innerText();
    await chup(t, `ung-dung_thanhtoan-dang-cap-nhat_${rong}`);
    k(`F1 [${rong}] mở Thanh toán → /toi được gọi lại`, dem(S, '/toi') === n0 + 1, `${n0} → ${dem(S, '/toi')}`);
    k(`F1 [${rong}] chờ /toi: nút ví khoá + "Đang cập nhật số dư…" (kho đã có 100.000đ, bản lưu 999.999đ)`, /the-vi-khoa/.test(lop) && /Đang cập nhật số dư…/.test(ch), `${lop} | ${ch}`);
    await t.waitForTimeout(TRE + 300);
    k(`F1 [${rong}] /toi về → ví mở, số dư mới`, !/the-vi-khoa/.test(await cong.getAttribute('class')) && /100\.000/.test(await vi.innerText()), await vi.innerText());
    k(`H1 [${rong}] Thanh toán không tràn ngang`, await t.evaluate(() => document.scrollingElement.scrollWidth <= window.innerWidth + 1));
  });
  }));

  // E2 + D4 + B2 — đăng xuất xoá; 401 giữ nhưng không hiện; khách B không bao giờ thấy số của A
  const dangNhapB = async (t) => {
    await mo(t, '/dangnhap?tiep=/trangchu');
    await t.fill('#sdt', B.sdt); await t.locator('#login .checkout-btn').click();
    await t.waitForSelector('#ma'); await t.fill('#ma', '123456');
    await t.evaluate(() => { window.__thayA = []; const id = setInterval(() => { const s = document.body.innerText; if (/1\.250|Linh|100\.000/.test(s)) window.__thayA.push(s.slice(0, 80)); }, 20); setTimeout(() => clearInterval(id), 3000); });
    await t.locator('#login .checkout-btn').click();
    await t.waitForTimeout(3100);
    return t.evaluate(() => window.__thayA);
  };
  await Promise.all(CO_MAN.map(async (rong) => {
  await may(`dang-xuat-${rong}`, { rong }, async ({ S, trang }) => {
    const t = await trang();
    await mo(t, '/taikhoan'); await doiHet(t, '#account .acc-q', /1\.250/); await t.waitForTimeout(300);
    k('E2 trước đăng xuất có kh_tom_tat', !!(await t.evaluate(() => localStorage.getItem('kh_tom_tat'))));
    await t.locator('.acc-out').click(); await t.waitForTimeout(200);
    k('E2 đăng xuất → không còn kh_tom_tat', (await t.evaluate(() => localStorage.getItem('kh_tom_tat'))) === null);
    const n0 = demHet(S);
    const thay = await dangNhapB(t);
    k('D4 đăng nhập khách B trên cùng máy → không lúc nào thấy số / tên của khách A', thay.length === 0, thay[0]);
    k('B2 vừa đăng nhập → tải trước /toi, /diem, /voucher, /don', KHUNG_CUA.every((d) => S.goi.some((g) => g.duong === d && g.auth === 'tok-B')), `${n0} → ${demHet(S)}`);
    k('B2 thấy điểm của B', /40/.test(await chu(t, '#home .points-card .num')), await chu(t, '#home .points-card .num'));
  });
  await may(`het-phien-roi-B-${rong}`, { rong }, async ({ S, trang }) => {
    const t = await trang();
    await mo(t, '/trangchu'); await doiHet(t, '#home .points-card .num', /1\.250/); await t.waitForTimeout(300);
    S.chet['tok-A'] = true;
    await mo(t, '/trangchu'); await t.waitForTimeout(TRE + 600);
    k('E2 hết phiên (401) → GIỮ kh_tom_tat', !!(await t.evaluate(() => localStorage.getItem('kh_tom_tat'))));
    k('E2 hết phiên → không hiện số của khách (chế độ khách)', !/1\.250|Linh/.test(await chu(t, '#home')), await chu(t, '#home .topbar'));
    const thay = await dangNhapB(t);
    k('E3/D4 sau 401, khách B đăng nhập → không lúc nào thấy số / tên của A', thay.length === 0, thay[0]);
    k('E2 khách B đăng nhập → bản tóm tắt của A bị thay', !/Linh|1250/.test(await t.evaluate(() => localStorage.getItem('kh_tom_tat') || '')));
  });

  // D3 nhận mã; D1 ẩn / hiện; D2 mỗi 5 phút
  await may(`nhan-ma-an-hien-${rong}`, { rong }, async ({ ctx, S, trang }) => {
    const t = await trang();
    await mo(t, '/uudai'); await doiHet(t, '#rewards .wallet-row', /1\.250/); await t.waitForTimeout(TRE + 300);
    const d0 = [dem(S, '/diem'), dem(S, '/voucher'), dem(S, '/toi')];
    await t.fill('#ma-bill', 'ABC123'); await t.locator('.promo-box button').click();
    await t.waitForTimeout(TRE * 2 + 500);
    const d1 = [dem(S, '/diem'), dem(S, '/voucher'), dem(S, '/toi')];
    k('D3 nhận mã hoá đơn → /diem, /voucher, /toi được gọi lại', d1.every((n, i) => n === d0[i] + 1), `${d0} → ${d1}`);
    k('D3 điểm mới hiện (1.260)', /1\.260/.test(await chu(t, '#rewards .wallet-row')), await chu(t, '#rewards .wallet-row'));
    const a0 = demHet(S);
    await anHien(t, true); await ctx.clock.fastForward(10000); await anHien(t, false); await t.waitForTimeout(TRE + 300);
    k('D1 ẩn 10 giây rồi hiện → không gọi lại', demHet(S) === a0, `${a0} → ${demHet(S)}`);
    const a1 = KHUNG_CUA.map((d) => dem(S, d));
    await anHien(t, true); await ctx.clock.fastForward(61000); await anHien(t, false); await t.waitForTimeout(TRE + 400);
    const a2 = KHUNG_CUA.map((d) => dem(S, d));
    k('D1 ẩn 61 giây rồi hiện lại → các kho được lấy lại', a2.every((n, i) => n === a1[i] + 1), `${a1} → ${a2}`);
    await ctx.clock.fastForward(5 * 60000); await t.waitForTimeout(TRE + 400);
    const a3 = KHUNG_CUA.map((d) => dem(S, d));
    k('D2 app đang hiện → làm mới các kho khách mỗi 5 phút', a3.every((n, i) => n >= a2[i] + 1), `${a2} → ${a3}`);
  });

  // D3 lưu hồ sơ: POS trả hồ sơ → không gọi lại /toi; Trang chủ đổi lời chào theo
  // A4 — Lịch sử đơn: trang 1 ở kho chung, "Xem thêm" gọi trang 2; làm mới ngầm KHÔNG có đơn mới → trang 2 còn; có đơn mới → bỏ trang sau.
  await may(`lich-su-don-${rong}`, { rong }, async ({ ctx, S, trang }) => {
    S.coDon = true;
    const t = await trang();
    await mo(t, '/taikhoan/donhang'); await doiHet(t, '#orderhistory', /TQD1/);
    await t.locator('#orderhistory .more-l span').click();
    const coTrang2 = (await doiHet(t, '#orderhistory', /TQD2/)) >= 0;
    k(`A4 [${rong}] "Xem thêm" → gọi /don?trang=2, hiện đơn trang 2`, coTrang2 && S.goi.some((g) => g.duong === '/don' && g.q === '?trang=2'));
    const n1 = S.goi.filter((g) => g.duong === '/don' && g.q === '?trang=1').length;
    await anHien(t, true); await ctx.clock.fastForward(61000); await anHien(t, false); await t.waitForTimeout(TRE + 400);
    const lai = S.goi.filter((g) => g.duong === '/don' && g.q === '?trang=1').length;
    k(`A4 [${rong}] làm mới ngầm trang 1 không có đơn mới → trang 2 khách đã mở VẪN còn`, lai === n1 + 1 && /TQD2/.test(await chu(t, '#orderhistory')), `${n1} → ${lai} | ${await chu(t, '#orderhistory')}`);
    S.donMoi = true;
    await anHien(t, true); await ctx.clock.fastForward(61000); await anHien(t, false); await t.waitForTimeout(TRE + 400);
    const ch = await chu(t, '#orderhistory');
    k(`A4 [${rong}] có đơn mới ở trang 1 → hiện đơn mới, bỏ trang sau cũ (không hụt dòng), còn "Xem thêm"`, /TQD9/.test(ch) && !/TQD2/.test(ch) && /Xem thêm/.test(ch), ch);
  });

  await may(`ho-so-${rong}`, { rong }, async ({ S, trang }) => {
    const t = await trang();
    await mo(t, '/taikhoan/thongtin'); await t.waitForSelector('#ten-toi'); await t.waitForTimeout(TRE + 300);
    k('E3 Thông tin cá nhân hiện số điện thoại thật (không lấy bản lưu)', /0909/.test(await chu(t, '#profile .pf-lock')) || /090 xxx/.test(await chu(t, '#profile .pf-lock')), await chu(t, '#profile .pf-lock'));
    const n0 = dem(S, '/toi');
    await t.locator('#profile .pf-chips button', { hasText: 'cô' }).click(); await t.waitForTimeout(TRE + 300);
    k('D3 lưu xưng hô → PUT /toi, không GET /toi lại', dem(S, '/toi', 'PUT') === 1 && dem(S, '/toi') === n0, `${n0} → ${dem(S, '/toi')}`);
    await sang(t, '/trangchu'); await t.waitForTimeout(100);
    k('D3 Trang chủ chào theo xưng hô vừa lưu', /cô Nguyễn Linh!/.test(await chu(t, '#home h1')), await chu(t, '#home h1'));
  });
  }));

  await trinh.close();
}
