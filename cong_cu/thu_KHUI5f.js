#!/usr/bin/env node
// THỬ KH-UI-5f — tiện ích Xe cộ · Uống thuốc · Chu kỳ + Văn khấn điền sẵn Tín chủ / Địa chỉ.
// Phần 1 (luôn chạy, kể cả KHONG_TRINH_DUYET=1): hàm thuần (kehoachLap.js, kehoach.js, vanKhan.js, duongDan.js, danh mục nd/tienIch.js) + quét khoá nội dung trong các màn.
// Phần 2: App thật trong Chromium (Playwright có sẵn ở máy; không có / KHONG_TRINH_DUYET=1 → in "BỎ QUA", không tính ca). Chạy: node cong_cu/thu_KHUI5f.js → dòng cuối "n đạt · m hỏng".
'use strict';
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const GOC = path.join(__dirname, '..');
let dat = 0, hong = 0;
const k = (ten, dung, them = '') => {
  if (dung) { dat++; console.log(`  ✓ ${ten}`); } else { hong++; console.log(`  ✗ ${ten}${them ? '  — ' + them : ''}`); }
};
const nap = (f) => import(pathToFileURL(path.join(GOC, f)).href);
const doc = (f) => { try { return fs.readFileSync(path.join(GOC, f), 'utf8'); } catch { return ''; } };
const bang = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const khoGia = (d = {}) => ({ d, getItem: (x) => (x in d ? d[x] : null), setItem: (x, v) => { d[x] = String(v); }, removeItem: (x) => { delete d[x]; } });
const TEP_MAN = ['src/components/XeCo.jsx', 'src/components/UongThuoc.jsx', 'src/components/ChuKy.jsx', 'src/components/VanKhanMan.jsx', 'src/pages/TienIch.jsx', 'src/pages/KeHoach.jsx', 'src/kehoach.js', 'src/components/DaiNhacViec.jsx', 'src/components/dungKeHoach.js', 'src/kehoachLap.js'];

(async () => {
  const LP = await nap('src/kehoachLap.js'), KH = await nap('src/kehoach.js'), DD = await nap('src/duongDan.js'), ND = await nap('src/noiDung/nd.js'), IDX = await nap('src/noiDung/nd/index.js'), TI = await nap('src/noiDung/nd/tienIch.js');
  const LM = await nap('src/luuMay.js'), VKJ = await nap('src/vanKhan.js');
  const N = (d, m, y) => ({ d, m, y }), HN = N(10, 11, 2026), hn = LP.jd(HN), NAY = LP.chuoiJd(hn), ngay = (j) => LP.chuoiJd(hn + j);
  const MAU = TI.TIEN_ICH.find((m) => m.khoa === 'xe.macdinh').macDinh;
  const trong = () => KH.keHoachTrong();
  const xeMay = (km = 12000, nhatKy = [], giayTo = []) => ({ id: 'x1', ten: 'Wave', bien: '', loai: 'xm', km, nhac: true, lich: [{ ten: 'Thay dầu máy', km: 1500, thang: 2 }], giayTo, nhatKy });
  const lan = (j, km, viec = ['Thay dầu máy']) => ({ ngay: ngay(j), km, viec, phi: 0, noi: '' });
  const hang0 = xeMay().lich[0], tHang = (km, ls, h = hang0) => LP.trangThaiHang(xeMay(km, ls), h, hn);

  console.log('A4 — hạng mục xe: tới hạn theo km HOẶC tháng (itemState)');
  const st = tHang(12000, [lan(-20, 10800)]);
  k('A4 còn 300 km / 41 ngày → chưa sắp tới hạn, tiến độ 0,8 (theo km)', st.kmCon === 300 && st.ngayCon === 41 && !st.soon && !st.over && Math.abs(st.pct - 0.8) < 1e-9, JSON.stringify(st));
  k('A4 còn 100 km (≤ 150) → sắp tới hạn, chưa quá', tHang(12200, [lan(-20, 10800)]).soon === true && tHang(12200, [lan(-20, 10800)]).over === false);
  k('A4 quá km (âm) → đã tới hạn', tHang(12400, [lan(-20, 10800)]).over === true);
  k('A4 theo tháng: lần cuối 55 ngày trước, hạn 2 tháng → còn 6 ngày → sắp tới hạn', tHang(10900, [lan(-55, 10800)]).soon === true && tHang(10900, [lan(-55, 10800)]).ngayCon === 6);
  k('A4 theo tháng: lần cuối 70 ngày trước → quá hạn dù km còn xa (cái nào đến trước)', tHang(10900, [lan(-70, 10800)]).over === true);
  k('A4 ngưỡng km: còn đúng 150 → sắp; còn 151 → chưa', tHang(10800 + 1500 - 150, [lan(-1, 10800)]).soon === true && tHang(10800 + 1500 - 151, [lan(-1, 10800)]).soon === false);
  const lon = { ten: 'Lốp', km: 10000, thang: 0 };
  k('A4 ngưỡng 10 %: hạng 10 000 km còn 1000 → sắp; còn 1001 → chưa', tHang(9000, [lan(-1, 0, ['Lốp'])], lon).soon === true && tHang(8999, [lan(-1, 0, ['Lốp'])], lon).soon === false);
  k('A4 ngưỡng ngày: còn đúng 7 ngày → sắp; còn 8 → chưa', tHang(10800, [lan(-54, 10800)]).ngayCon === 7 && tHang(10800, [lan(-54, 10800)]).soon === true && tHang(10800, [lan(-53, 10800)]).soon === false);
  k('A4 chưa ghi lần nào (hoặc lần ghi là việc khác) → none, không sắp tới hạn, không tiến độ', (() => { const s = tHang(12000, [lan(-5, 1, ['Việc khác'])]); return s.none && !s.soon && s.pct === 0 && s.kmCon === null; })());
  k('A4 hạng chỉ theo tháng (km = 0): kmCon null; tiến độ tối đa 1', (() => { const s = tHang(5, [lan(-400, 0, ['Phanh'])], { ten: 'Phanh', km: 0, thang: 3 }); return s.kmCon === null && s.over && s.pct === 1; })());
  k('A4 nhiều lần ghi: lấy lần GẦN NHẤT', tHang(12000, [lan(-100, 9000), lan(-20, 10800)]).kmCon === 300);
  console.log('A4 — giấy tờ (docState) và cả xe (vehState)');
  k('A4 giấy tờ chưa nhập ngày → none, không sắp hết', (() => { const g = LP.trangThaiGiay({ ten: 'Bảo hiểm', ngay: '' }, hn); return g.none && !g.soon; })());
  k('A4 giấy tờ còn 31 ngày → chưa; 30 → sắp hết; hết hạn hôm qua → hết hạn', !LP.trangThaiGiay({ ten: 'a', ngay: ngay(31) }, hn).soon && LP.trangThaiGiay({ ten: 'a', ngay: ngay(30) }, hn).soon && LP.trangThaiGiay({ ten: 'a', ngay: ngay(-1) }, hn).het);
  const vs = LP.trangThaiXe(xeMay(12200, [lan(-20, 10800)], [{ ten: 'Đăng kiểm', ngay: ngay(10) }]), hn);
  k('A4 xe có hạng mục sắp tới hạn + giấy tờ sắp hết → soon, bad = 2, hạng mục tệ nhất là Thay dầu máy', vs.soon && vs.bad === 2 && vs.hang.ten === 'Thay dầu máy' && vs.giay === 'Đăng kiểm');
  const vOn = LP.trangThaiXe(xeMay(12000, [lan(-20, 10800)], [{ ten: 'Bảo hiểm', ngay: ngay(200) }]), hn);
  k('A4 xe ổn → soon false, không hạng mục tệ, không giấy tờ sắp hết', !vOn.soon && vOn.bad === 0 && vOn.hang === null && vOn.giay === null);
  k('A4 chỉ giấy tờ sắp hết → soon, hạng mục null, giay = tên giấy tờ', (() => { const v = LP.trangThaiXe(xeMay(12000, [lan(-20, 10800)], [{ ten: 'Đăng kiểm', ngay: ngay(3) }]), hn); return v.soon && v.hang === null && v.giay === 'Đăng kiểm'; })());
  k('A3 sapHang: hạng sắp tới hạn lên đầu, rồi tiến độ cao hơn', (() => { const x = { ...xeMay(12200, [lan(-20, 10800), lan(-1, 12000, ['Phanh'])]), lich: [{ ten: 'Phanh', km: 0, thang: 3 }, { ten: 'Thay dầu máy', km: 1500, thang: 2 }] }; return LP.sapHang(x, hn).map((a) => a.hang.ten).join() === 'Thay dầu máy,Phanh'; })());
  k('A3 tổng chi phí = cộng phi của lịch sử', LP.tongPhiXe({ nhatKy: [{ phi: 1350000 }, { phi: 200000 }, {}] }) === 1550000);

  console.log('A2/A3 — lịch mặc định theo loại xe, thêm / sửa / ghi lần sửa');
  const xmM = LP.lichTheoLoai(MAU, 'xm'), otoM = LP.lichTheoLoai(MAU, 'oto');
  k('A2 Xe máy: 3 hạng mục (Thay dầu máy 1500 km / 2 tháng…) + giấy tờ Bảo hiểm bắt buộc', xmM.lich.length === 3 && bang(xmM.lich[0], { ten: 'Thay dầu máy', km: 1500, thang: 2 }) && bang(xmM.lich[1], { ten: 'Vệ sinh nồi, bugi', km: 8000, thang: 0 }) && bang(xmM.giayTo, [{ ten: 'Bảo hiểm bắt buộc', ngay: '' }]));
  k('A2 Ô tô: 4 hạng mục, 2 giấy tờ (Bảo hiểm, Đăng kiểm)', otoM.lich.length === 4 && otoM.giayTo.map((g) => g.ten).join() === 'Bảo hiểm bắt buộc,Đăng kiểm');
  k('A2 Xe đạp điện: 2 hạng mục, không giấy tờ; Khác và loại lạ: trống', LP.lichTheoLoai(MAU, 'xdd').lich.length === 2 && LP.lichTheoLoai(MAU, 'xdd').giayTo.length === 0 && LP.lichTheoLoai(MAU, 'khac').lich.length === 0 && LP.lichTheoLoai(MAU, 'ten-lạ').lich.length === 0);
  const b = KH.themXe(trong(), { ten: ' Honda Lead ', bien: '29X1-123.45', loai: 'xm', km: '12000' }, MAU), id1 = b.xe[0].id;
  k('A2 thêm xe máy → 1 xe, tên cắt khoảng trắng, lịch + giấy tờ mặc định, nhắc bật, chưa có lịch sử', b.xe.length === 1 && b.xe[0].ten === 'Honda Lead' && b.xe[0].km === 12000 && b.xe[0].lich.length === 3 && b.xe[0].giayTo.length === 1 && b.xe[0].nhac && b.xe[0].nhatKy.length === 0);
  k('A2 tên trống / loại lạ → null; km âm → 0; km để trống được (không bắt buộc)', KH.themXe(trong(), { ten: '  ', loai: 'xm' }, MAU) === null && KH.themXe(trong(), { ten: 'a', loai: 'tau-thuy' }, MAU) === null && KH.themXe(trong(), { ten: 'a', loai: 'oto', km: -5 }, MAU).xe[0].km === 0 && KH.themXe(trong(), { ten: 'a', loai: 'oto', km: '' }, MAU).xe[0].km === 0);
  k('A2 tối đa 20 xe', (() => { let t = trong(); for (let i = 0; i < 20; i++) t = KH.themXe(t, { ten: 'x' + i, loai: 'khac', km: 0 }, MAU); return t.xe.length === 20 && KH.themXe(t, { ten: 'x', loai: 'khac' }, MAU) === null; })());
  k('A3 "Vừa làm hôm nay": ghi một lần sửa với số km hiện tại; hạng mục từ chưa ghi → còn 1500 km / 61 ngày; bản cũ không bị sửa', (() => { const c = KH.ghiXongHang(b, id1, 'Thay dầu máy', NAY), s = LP.trangThaiHang(c.xe[0], c.xe[0].lich[0], hn); return c.xe[0].nhatKy.length === 1 && c.xe[0].nhatKy[0].km === 12000 && c.xe[0].nhatKy[0].ngay === NAY && !s.none && s.kmCon === 1500 && s.ngayCon === 61 && b.xe[0].nhatKy.length === 0; })());
  k('A3 ghi lần sửa: ngày sai / không việc nào → null; km trống = km xe; km lớn hơn thì km xe tăng theo; việc trùng gộp; chi phí, nơi làm', (() => { const g = (o) => KH.ghiLanSua(b, id1, { ngay: NAY, km: 0, viec: ['Rửa xe'], phi: 0, noi: '', ...o }); const c = g({ km: 12500, viec: ['Rửa xe', 'Rửa xe', 'Lốp'], phi: '120000', noi: ' Head ' }); return g({ ngay: '2026-13-40' }) === null && g({ viec: [] }) === null && g({}).xe[0].nhatKy[0].km === 12000 && c.xe[0].km === 12500 && c.xe[0].nhatKy[0].viec.length === 2 && c.xe[0].nhatKy[0].phi === 120000 && c.xe[0].nhatKy[0].noi === 'Head'; })());
  k('A3 sửa nhanh số km (âm → 0); sửa thông tin xe (tên trống → null); xoá xe', KH.datKmXe(b, id1, '13000').xe[0].km === 13000 && KH.datKmXe(b, id1, -3).xe[0].km === 0 && KH.suaXe(b, id1, { ten: '', bien: '', km: 1 }) === null && KH.suaXe(b, id1, { ten: 'Lead 2', bien: '30A', km: 100 }).xe[0].bien === '30A' && KH.xoaXe(b, id1).xe.length === 0);
  k('A3 hạng mục: thêm (thiếu cả km lẫn tháng → null), sửa tên → các lần đã ghi đổi theo, xoá', (() => { const c = KH.ghiXongHang(b, id1, 'Thay dầu máy', NAY), d = KH.luuHang(c, id1, 0, { ten: 'Thay nhớt', km: 1500, thang: 2 }); return KH.luuHang(b, id1, null, { ten: 'Nhông xích', km: 0, thang: 0 }) === null && KH.luuHang(b, id1, null, { ten: 'Nhông xích', km: 20000, thang: 0 }).xe[0].lich.length === 4 && d.xe[0].nhatKy[0].viec[0] === 'Thay nhớt' && KH.xoaHang(b, id1, 0).xe[0].lich.length === 2; })());
  k('A3 giấy tờ: đặt ngày hết hạn (ngày sai → null, rỗng = bỏ ngày); nhắc từng xe bật / tắt', KH.datNgayGiay(b, id1, 0, '2027-03-01').xe[0].giayTo[0].ngay === '2027-03-01' && KH.datNgayGiay(b, id1, 0, '2027-02-30') === null && KH.datNgayGiay(KH.datNgayGiay(b, id1, 0, '2027-03-01'), id1, 0, '').xe[0].giayTo[0].ngay === '' && KH.doiNhacXe(b, id1).xe[0].nhac === false);

  console.log('B1/B2 — uống thuốc');
  const thuocA = { id: 'ta', ten: 'Thuốc sắc Hoàng Kỳ', lieu: '1 chén', ghi: '', gio: ['07:30', '20:00'], den: '', bd: ngay(-10), nhac: true };
  const bT = { ...trong(), thuoc: [thuocA, { id: 'tb', ten: 'Canxi', lieu: '1 viên', ghi: '', gio: ['12:00'], den: ngay(-1), bd: ngay(-10), nhac: true }] };
  k('B1 hôm nay 0/2: thuốc đã hết đợt (đến hôm qua) không tính', bang(LP.homNayThuoc(bT, hn), { all: 2, done: 0 }));
  const b1 = KH.doiUong(bT, 'ta', '07:30', NAY);
  k('B1 bấm một giờ → 1/2; bấm lại → bỏ (0/2); thuốc / giờ lạ → không đổi', bang(LP.homNayThuoc(b1, hn), { all: 2, done: 1 }) && bang(LP.homNayThuoc(KH.doiUong(b1, 'ta', '07:30', NAY), hn), { all: 2, done: 0 }) && KH.doiUong(bT, 'ta', '09:00', NAY) === bT && KH.doiUong(bT, 'zz', '07:30', NAY) === bT);
  const bDot = { ...trong(), thuoc: [{ ...thuocA, bd: ngay(-4) }], thuocXong: { [ngay(-1)]: ['ta@07:30', 'ta@20:00'], [ngay(-2)]: ['ta@07:30'], [ngay(-3)]: [], [ngay(0)]: ['ta@07:30'] } };
  k('B1 7 chấm (7 ngày trước hôm nay, cũ → mới): ngày chưa dùng thuốc để trống; chưa uống lần nào = k; một phần = h; đủ = f; hôm nay không nằm trong 7', bang(LP.bayNgayThuoc(bDot, hn), ['', '', '', 'k', 'k', 'h', 'f']), JSON.stringify(LP.bayNgayThuoc(bDot, hn)));
  k('B1 thuốc hết đợt vẫn được tính cho những ngày còn trong đợt (đến hôm qua → hôm qua vẫn tính)', LP.bayNgayThuoc({ ...trong(), thuoc: [{ ...thuocA, gio: ['08:00'], den: ngay(-1), bd: ngay(-3) }] }, hn).join() === ',,,,k,k,k');
  const c14 = KH.themThuoc(trong(), { ten: ' Canxi ', lieu: '1 viên', ghi: 'sau ăn', gio: ['20:00', '07:30', '07:30', '12:00', '15:00'], trong: 14 }, NAY);
  k('B2 thêm thuốc: tên cắt khoảng trắng, giờ bỏ trùng + xếp tăng dần + tối đa 3; "Uống trong" 14 ngày → đến hôm nay + 13; nhắc bật', c14.thuoc[0].ten === 'Canxi' && bang(c14.thuoc[0].gio, ['07:30', '12:00', '15:00']) && c14.thuoc[0].den === ngay(13) && c14.thuoc[0].bd === NAY && c14.thuoc[0].nhac);
  k('B2 "Dài ngày" (0) và lựa chọn lạ → không hạn; 7 ngày → hôm nay + 6', KH.themThuoc(trong(), { ten: 'x', gio: ['08:00'], trong: 0 }, NAY).thuoc[0].den === '' && KH.themThuoc(trong(), { ten: 'a', gio: ['08:00'], trong: 99 }, NAY).thuoc[0].den === '' && KH.themThuoc(trong(), { ten: 'a', gio: ['08:00'], trong: 7 }, NAY).thuoc[0].den === ngay(6));
  k('B2 thiếu tên / không giờ hợp lệ → null; tối đa 30 thuốc', KH.themThuoc(trong(), { ten: '', gio: ['08:00'] }, NAY) === null && KH.themThuoc(trong(), { ten: 'a', gio: [] }, NAY) === null && KH.themThuoc(trong(), { ten: 'a', gio: ['25:00', 'abc'] }, NAY) === null && (() => { let t = trong(); for (let i = 0; i < 30; i++) t = KH.themThuoc(t, { ten: 'a' + i, gio: ['08:00'] }, NAY); return t.thuoc.length === 30 && KH.themThuoc(t, { ten: 'z', gio: ['08:00'] }, NAY) === null; })());
  const bHet = { ...bT, thuoc: [bT.thuoc[1]] }, bXoa = KH.xoaThuoc(KH.doiUong(bT, 'ta', '07:30', NAY), 'ta');
  k('B2 hết hạn uống: thuốc vẫn trong danh sách nhưng thôi nhắc (không vào Sắp tới / nhắc); xoá thuốc xoá luôn dấu đã uống của nó', KH.gioThuocChuaUong(bHet, hn).length === 0 && KH.bangCoNhac(bHet, HN).viec.length === 0 && KH.upList(HN, bHet, 'chi').every((e) => e.di !== 'thuoc') && bXoa.thuoc.length === 1 && Object.values(bXoa.thuocXong).flat().length === 0);
  k('B1 nhắc từng thuốc bật / tắt; chỉ giữ 14 ngày dấu đã uống', KH.doiNhacThuoc(bT, 'ta').thuoc[0].nhac === false && (() => { let x = bT; for (let i = 0; i < 20; i++) x = KH.doiUong(x, 'ta', '07:30', ngay(-i)); return Object.keys(x.thuocXong).length === 14; })());

  console.log('C2 — chu kỳ: giai đoạn, dải ngày, trung bình');
  const ck = (o = {}) => ({ ...KH.chuKyTrong(), bat: true, bd: NAY, ...o });
  const ph = (day, o) => LP.chuKyHomNay(ck({ bd: ngay(-(day - 1)), ...o }), hn);
  k('C2 chu kỳ 28 / hành kinh 5: ngày 1–5 Hành kinh · 6–11 Sau kỳ · 12–15 Giữa chu kỳ · 16–28 Trước kỳ · 29+ Chậm kinh', bang([1, 5, 6, 11, 12, 15, 16, 28, 29, 45].map((d) => ph(d).ph), [0, 0, 1, 1, 2, 2, 3, 3, 4, 4]));
  k('C2 "Ngày N", kỳ tới = ngày bắt đầu + độ dài, rụng trứng = dài − 14; chu kỳ 21 ngày: ngày 8 vẫn Giữa chu kỳ, ngày 9 Trước kỳ', ph(10).day === 10 && ph(10).nextJ === hn - 9 + 28 && ph(10).ov === 14 && LP.chuKyHomNay(ck({ bd: ngay(-7), dai: 21 }), hn).ph === 2 && LP.chuKyHomNay(ck({ bd: ngay(-8), dai: 21 }), hn).ph === 3);
  k('C2 dải ngày: đúng bằng độ dài chu kỳ, tô theo giai đoạn 0 → 3', (() => { const d = LP.dayChuKy(ck()); return d.length === 28 && d[0] === 0 && d[4] === 0 && d[5] === 1 && d[11] === 2 && d[15] === 3 && d[27] === 3; })());
  k('C2 trung bình 6 chu kỳ gần nhất: [28,30,27,29,31,26,40] → 6 cuối = 31; chưa có → null; 1 kỳ → chính nó', LP.trungBinhKy([28, 30, 27, 29, 31, 26, 40]) === 31 && LP.trungBinhKy([]) === null && LP.trungBinhKy([27]) === 27);
  console.log('C1/C2 — bật, ghi kỳ mới, chỉnh − / +');
  k('C1 bật với ngày bắt đầu hợp lệ; ngày tương lai / quá 120 ngày / sai → null', KH.batChuKy(trong(), ngay(-10), NAY).chuKy.bat === true && KH.batChuKy(trong(), ngay(1), NAY) === null && KH.batChuKy(trong(), ngay(-121), NAY) === null && KH.batChuKy(trong(), '2026-02-30', NAY) === null && KH.batChuKy(trong(), '', NAY) === null);
  k('C2 "Kỳ kinh bắt đầu hôm nay": ghi độ dài chu kỳ vừa qua (28), kỳ mới bắt đầu hôm nay; chỉ 4 ngày (bấm nhầm) → không ghi vào lịch sử', (() => { const u = KH.ghiKyMoi(KH.batChuKy(trong(), ngay(-28), NAY), NAY), v = KH.ghiKyMoi(KH.batChuKy(trong(), ngay(-4), NAY), NAY); return bang(u.chuKy.ls, [28]) && u.chuKy.bd === NAY && v.chuKy.ls.length === 0 && v.chuKy.bd === NAY; })());
  k('C2 độ dài 21–40, hành kinh 2–9 (kẹp ở biên); nhắc trước kỳ bật / tắt', (() => { let t = KH.batChuKy(trong(), NAY, NAY); for (let i = 0; i < 30; i++) t = KH.doiDaiChuKy(t, -1); const lo = t.chuKy.dai; for (let i = 0; i < 30; i++) t = KH.doiDaiChuKy(t, 1); const hi = t.chuKy.dai; for (let i = 0; i < 20; i++) t = KH.doiHanhChuKy(t, 1); const hh = t.chuKy.hanh; for (let i = 0; i < 20; i++) t = KH.doiHanhChuKy(t, -1); return lo === 21 && hi === 40 && hh === 9 && t.chuKy.hanh === 2 && KH.doiNhacChuKy(t).chuKy.nhac === false; })());
  k('C2 tắt & xoá → về mặc định (không còn ngày, lịch sử, khoá)', bang(KH.tatChuKy(KH.datKhoaChuKy(KH.ghiKyMoi(KH.batChuKy(trong(), ngay(-28), NAY), NAY), { muoi: 'a'.repeat(32), bam: 'b'.repeat(64) })).chuKy, KH.chuKyTrong()));
  k('C1 ô Chu kỳ vẫn ẩn với anh / chú / bác / ông, hiện với chị / cô / em / bạn / chưa biết', ['anh', 'chu', 'bac', 'ong'].every((x) => !KH.coChuKy(x)) && ['chi', 'co', 'em', 'ban', undefined, ''].every((x) => KH.coChuKy(x)));

  console.log('C3 — khoá bằng mã riêng (băm, không lưu mã gốc, sai 5 lần chờ 1 phút)');
  const kh1 = await KH.taoKhoa('4827'), kh2 = await KH.taoKhoa('4827');
  k('C3 taoKhoa → { muoi 32 hex, bam 64 hex SHA-256 }, hai lần cho muối khác nhau; mã sai dạng → null', /^[0-9a-f]{32}$/.test(kh1.muoi) && /^[0-9a-f]{64}$/.test(kh1.bam) && kh1.muoi !== kh2.muoi && kh1.bam !== kh2.bam && (await KH.taoKhoa('12')) === null && (await KH.taoKhoa('12ab')) === null && (await KH.taoKhoa('12345')) === null);
  k('C3 kiemKhoa: mã đúng → true; mã khác / sai dạng / không khoá → false', (await KH.kiemKhoa('4827', kh1)) === true && (await KH.kiemKhoa('4828', kh1)) === false && (await KH.kiemKhoa('48', kh1)) === false && (await KH.kiemKhoa('4827', null)) === false);
  const khoLuu = khoGia();
  KH.ghiKeHoach(KH.datKhoaChuKy(KH.batChuKy(trong(), NAY, NAY), kh1), khoLuu);
  k('C3 kho trên máy KHÔNG chứa mã gốc (chỉ muối + băm); đọc lại còn khoá', !khoLuu.d.kh_kehoach.includes('"4827"') && !khoLuu.d.kh_kehoach.includes('4827:') && bang(KH.docKeHoach(khoLuu).chuKy.khoa, kh1));
  let tt = { sai: 0, den: 0 };
  for (let i = 0; i < 4; i++) tt = KH.thuMa(tt, false, 1000);
  k('C3 sai 4 lần: chưa khoá', tt.sai === 4 && tt.den === 0 && KH.conChoGiay(tt, 1000) === 0);
  tt = KH.thuMa(tt, false, 1000);
  k('C3 sai lần thứ 5 → chờ 60 giây', tt.den === 61000 && KH.conChoGiay(tt, 1000) === 60 && KH.conChoGiay(tt, 31000) === 30);
  k('C3 đang chờ: nhập (kể cả đúng) không đổi trạng thái; hết 60 giây nhập đúng → đặt lại', bang(KH.thuMa(tt, true, 2000), tt) && bang(KH.thuMa(tt, true, 62000), { sai: 0, den: 0 }) && KH.thuMa({ sai: 3, den: 0 }, true, 5).sai === 0);

  console.log('B3/C4 — riêng tư: lời nhắc không lộ tên thuốc, không có chữ "kinh" / "chu kỳ"');
  const bRieng = { ...trong(), thuoc: [{ ...thuocA, gio: ['09:00'] }], chuKy: ck({ bd: ngay(-26), nhac: true }) };
  const nhacB = KH.bangCoNhac(bRieng, HN, 'chi');
  k('B3 nhắc uống thuốc chỉ là "Đến giờ uống thuốc" (không tên thuốc, không liều)', nhacB.viec.some((v) => v.ao && v.tieu === 'Đến giờ uống thuốc' && v.gio === '09:00') && !JSON.stringify(nhacB.viec).includes('Hoàng Kỳ') && !JSON.stringify(nhacB.viec).includes('1 chén'));
  k('C4 nhắc trước kỳ chỉ là "Lời nhắc của bạn" (không chữ kinh / chu kỳ), 2 ngày trước kỳ tới lúc 08:00', (() => { const c = nhacB.viec.find((v) => v.id === 'ck'); return !!c && c.tieu === 'Lời nhắc của bạn' && !/kinh|chu kỳ/i.test(JSON.stringify(c)) && c.ngay === ngay(2) && c.nhac === -2 * 1440 + 480; })());
  k('B3/C4 việc ảo riêng tư KHÔNG hiện chuông trên lịch (danhDauNgay bỏ qua)', LP.danhDauNgay(nhacB, hn - 3, hn + 10, HN).size === 0);
  k('B3 thanh nhắc lúc 09:00: "… Đến giờ uống thuốc (09:00)" — không tên thuốc', (() => { const r = LP.nhacDangCo(nhacB, '2026-11-10T09:00:00', HN); return r.some((x) => x.chu.includes('Đến giờ uống thuốc (09:00)')) && !r.some((x) => x.chu.includes('Hoàng Kỳ')); })());
  k('C4 xưng hô "anh" → không nhắc chu kỳ; tắt nhắc → không; đã uống giờ đó → hết nhắc thuốc; tắt nhắc thuốc → hết', !KH.bangCoNhac(bRieng, HN, 'anh').viec.some((v) => v.id === 'ck') && !KH.bangCoNhac(KH.doiNhacChuKy(bRieng), HN, 'chi').viec.some((v) => v.id === 'ck') && !KH.bangCoNhac(KH.doiUong(bRieng, 'ta', '09:00', NAY), HN, 'chi').viec.some((v) => v.id === 'th:09:00') && !KH.bangCoNhac(KH.doiNhacThuoc(bRieng, 'ta'), HN, 'chi').viec.some((v) => v.id === 'th:09:00'));
  const up = (bb, x) => KH.upList(HN, bb, x);
  k('C4 Sắp tới: KHÔNG khoá → "Kỳ kinh dự kiến" · "Chu kỳ 28 ngày"; khoá → "Lời nhắc riêng tư" (không chữ kinh / chu kỳ)', (() => { const a = up(bRieng, 'chi').find((e) => e.di === 'chuky'), kb = up(KH.datKhoaChuKy(bRieng, kh1), 'chi').find((e) => e.di === 'chuky'); return a.t === 'Kỳ kinh dự kiến' && a.s === 'Chu kỳ 28 ngày' && a.j === hn + 2 && kb.t === 'Lời nhắc riêng tư' && !/kinh|chu kỳ/i.test(kb.t + kb.s + kb.k) && kb.k === 'Riêng tư'; })());
  k('C4 Sắp tới: xưng hô "anh" hoặc kỳ tới ngoài 30 ngày → không có dòng Chu kỳ', !up(bRieng, 'anh').some((e) => e.di === 'chuky') && !up({ ...bRieng, chuKy: ck({ bd: NAY, dai: 40 }) }, 'chi').some((e) => e.di === 'chuky'));
  k('D2 Sắp tới: giờ uống thuốc hôm nay chưa uống (không tên thuốc); đã uống thì hết; nhãn Thuốc', (() => { const t = up(bRieng, 'chi').filter((e) => e.di === 'thuoc'); return t.length === 1 && t[0].t === 'Đến giờ uống thuốc' && t[0].s === '09:00' && t[0].k === 'Thuốc' && !JSON.stringify(t).includes('Hoàng Kỳ') && up(KH.doiUong(bRieng, 'ta', '09:00', NAY), 'chi').filter((e) => e.di === 'thuoc').length === 0; })());
  const bXe = { ...trong(), xe: [xeMay(12200, [lan(-20, 10800)], [{ ten: 'Đăng kiểm', ngay: ngay(20) }, { ten: 'Bảo hiểm', ngay: ngay(45) }, { ten: 'Cà vẹt', ngay: '' }])] };
  k('D2 Sắp tới: hạng mục sắp tới hạn + giấy tờ ≤ 30 ngày (không phải 45 ngày, không phải chưa nhập), nhãn Xe', (() => { const x = up(bXe, 'chi').filter((e) => e.di === 'xe'); return x.length === 2 && x.some((e) => e.t === 'Thay dầu máy · Wave' && e.s === 'còn 100 km hoặc 41 ngày' && e.k === 'Xe') && x.some((e) => e.t === 'Đăng kiểm · Wave' && e.s === 'Hết hạn 30/11 · còn 20 ngày') && x.every((e) => e.j >= hn); })(), JSON.stringify(up(bXe, 'chi').filter((e) => e.di === 'xe')));
  k('D2 nhắc xe: bật → việc ảo trước hạn 7 ngày 08:00 (hạng mục theo tháng + mỗi giấy tờ có ngày); tắt nhắc xe → không', (() => { const a = KH.bangCoNhac(bXe, HN).viec.filter((v) => v.ao), t = KH.bangCoNhac(KH.doiNhacXe(bXe, 'x1'), HN).viec.filter((v) => v.ao); return a.length === 3 && a.some((v) => v.tieu === 'Đăng kiểm · Wave' && v.ngay === ngay(20) && v.nhac === -7 * 1440 + 480) && t.length === 0; })());

  console.log('D1 — chữ nhỏ dưới ô lưới');
  k('D1 Xe cộ: "N xe · M sắp tới hạn" / "N xe · ổn" / chưa có xe: "Thêm xe" (không số bịa)', KH.chuThich('xe', HN, bXe) === '1 xe · 1 sắp tới hạn' && KH.chuThich('xe', HN, { ...bXe, xe: [xeMay(12000, [lan(-20, 10800)])] }) === '1 xe · ổn' && KH.chuThich('xe', HN, trong()) === 'Thêm xe');
  k('D1 Uống thuốc: "đã / tổng hôm nay"; chưa có thuốc: "Thêm thuốc"', KH.chuThich('thuoc', HN, bT) === '0/2 hôm nay' && KH.chuThich('thuoc', HN, KH.doiUong(bT, 'ta', '07:30', NAY)) === '1/2 hôm nay' && KH.chuThich('thuoc', HN, trong()) === 'Thêm thuốc');
  k('D1 Chu kỳ: chưa bật "Bật"; đã bật "Ngày N"; KHOÁ → "Riêng tư" (không hiện số)', KH.chuThich('chuky', HN, trong()) === 'Bật' && KH.chuThich('chuky', HN, bRieng) === 'Ngày 27' && KH.chuThich('chuky', HN, KH.datKhoaChuKy(bRieng, kh1)) === 'Riêng tư');

  console.log('E1/E3 — Văn khấn: mặc định Tín chủ / Họ gia tiên / Địa chỉ từ tài khoản');
  const hoSo = { ten: 'Nguyễn Văn An', dia_chi: '12 Lê Lợi, Hà Nội' }, vk0 = trong().vk;
  k('E1 chưa sửa: Tín chủ = họ tên tài khoản (không kèm xưng hô), Họ gia tiên = chữ đầu, Địa chỉ = dia_chi', bang(KH.thongTinVk(vk0, hoSo), { ten: 'Nguyễn Văn An', ho: 'Nguyễn', dc: '12 Lê Lợi, Hà Nội' }));
  k('E1 khách sửa Tín chủ → Họ theo chữ đầu Tín chủ mới; sửa Họ / Địa chỉ thì theo khách; XOÁ TRẮNG (chủ ý) → để trống, không tự điền lại', bang(KH.thongTinVk({ ...vk0, ten: 'Trần Văn B' }, hoSo), { ten: 'Trần Văn B', ho: 'Trần', dc: '12 Lê Lợi, Hà Nội' }) && KH.thongTinVk({ ...vk0, ho: 'Lê', dc: '5 Hàng Bài' }, hoSo).ho === 'Lê' && bang(KH.thongTinVk({ ...vk0, dc: '', ho: '', ten: '' }, hoSo), { ten: '', ho: '', dc: '' }));
  k('E1 tài khoản chưa có tên / địa chỉ → trống (không bịa)', bang(KH.thongTinVk(vk0, {}), { ten: '', ho: '', dc: '' }) && bang(KH.thongTinVk(vk0, { ten: 'An' }), { ten: 'An', ho: 'An', dc: '' }));
  k('E1 lưu: chỉ sửa Địa chỉ → ghi trên máy; Tín chủ / Họ vẫn null (hiện mặc định theo tài khoản); đọc lại đủ', (() => { const kg = khoGia(); KH.ghiKeHoach(KH.datThongTinVk(trong(), { dc: '9 Nguyễn Du' }), kg); const r = KH.docKeHoach(kg).vk; return r.dc === '9 Nguyễn Du' && r.ten === null && r.ho === null; })());
  const dBai = VKJ.dienBai(VKJ.timDip('r'), { ten: '', dc: '', ho: '', nm: '' }, hn).flat().filter((d) => d.mark);
  k('E3 dienBai: đoạn tô màu của Tín chủ / Họ / Địa chỉ ghi rõ chỗ điền (p = ten · ho · dc) kể cả khi trống; ngày, tháng, năm âm không có ô nhập', dBai.some((d) => d.p === 'ten' && d.t === '') && dBai.some((d) => d.p === 'dc' && d.t === '') && dBai.filter((d) => ['ld', 'lm', 'ny', 'nyc'].includes(d.p)).every((d) => d.t !== ''));

  console.log('D3 — dữ liệu cũ / hỏng / xoá');
  const cu = khoGia({ kh_kehoach: JSON.stringify({ v: 1, viec: [{ id: 'v1', ngay: '2026-11-12', gio: '', tieu: 'Mua quà', nhac: null, xong: false }], leNhac: { Rằm: true }, nguoi: [], vk: { ten: 'A', ho: '', dc: '', nm: null, fs: 17, tick: {}, nhac: {} } }) });
  const rc = KH.docKeHoach(cu);
  k('D3 bản cũ (5e, chưa có xe / thuốc / chu kỳ) đọc đủ: việc còn nguyên, xe / thuốc rỗng, chu kỳ chưa bật', rc.viec.length === 1 && rc.viec[0].tieu === 'Mua quà' && rc.xe.length === 0 && rc.thuoc.length === 0 && Object.keys(rc.thuocXong).length === 0 && !rc.chuKy.bat && rc.vk.ten === 'A');
  const rHong = KH.docKeHoach(khoGia({ kh_kehoach: JSON.stringify({ v: 1, viec: [], xe: 'x', thuoc: [1, null, { id: 't', ten: 'a', gio: [] }, { id: 't2', ten: 'b', gio: ['08:00'] }], thuocXong: { sai: ['x'], [NAY]: ['ta@08:00', 5] }, chuKy: { bat: true, bd: 'hôm qua', dai: 99 } }) }));
  k('D3 bản hỏng từng phần: xe sai dạng → rỗng; thuốc hỏng bỏ, thuốc đúng giữ; dấu uống lạ bỏ; chu kỳ ngày sai → chưa bật', rHong.xe.length === 0 && rHong.thuoc.length === 1 && rHong.thuoc[0].id === 't2' && bang(rHong.thuocXong, { [NAY]: ['ta@08:00'] }) && !rHong.chuKy.bat);
  k('D3 chu kỳ bật ngày đúng nhưng độ dài / hành kinh ngoài khoảng, lịch sử lạ → dùng mặc định / lọc', (() => { const r = KH.docKeHoach(khoGia({ kh_kehoach: JSON.stringify({ chuKy: { bat: true, bd: NAY, dai: 99, hanh: 1, ls: [28, 'x', 500, 30] } }) })).chuKy; return r.bat && r.dai === 28 && r.hanh === 5 && bang(r.ls, [28, 30]); })());
  k('D3 xe hỏng: hạng mục thiếu cả km lẫn tháng bỏ; giấy tờ ngày sai → rỗng; lịch sử không việc bỏ; loại lạ bỏ cả xe; id trùng bỏ', (() => { const r = KH.docKeHoach(khoGia({ kh_kehoach: JSON.stringify({ xe: [{ id: 'a', ten: 'X', loai: 'oto', km: 5, lich: [{ ten: 'h', km: 0, thang: 0 }, { ten: 'ok', km: 100, thang: 0 }], giayTo: [{ ten: 'g', ngay: '2026-02-30' }], nhatKy: [{ ngay: NAY, km: 1, viec: [] }, { ngay: NAY, km: 1, viec: ['ok'] }] }, { id: 'a', ten: 'Y', loai: 'xm' }, { id: 'b', ten: 'Z', loai: 'lạ' }] }) })).xe; return r.length === 1 && r[0].lich.length === 1 && r[0].giayTo[0].ngay === '' && r[0].nhatKy.length === 1; })());
  const dayDu = (() => { let t = KH.themXe(trong(), { ten: 'Lead', bien: '29X', loai: 'oto', km: 100 }, MAU); t = KH.ghiXongHang(t, t.xe[0].id, 'Đảo lốp', NAY); t = KH.themThuoc(t, { ten: 'Canxi', lieu: '1', ghi: 'g', gio: ['08:00', '20:00'], trong: 7 }, NAY); t = KH.doiUong(t, t.thuoc[0].id, '08:00', NAY); return KH.datKhoaChuKy(KH.ghiKyMoi(KH.batChuKy(t, ngay(-28), NAY), NAY), kh1); })();
  k('D3 ghi → đọc lại đủ: xe (lịch, giấy tờ, lịch sử), thuốc + dấu đã uống, chu kỳ (lịch sử, khoá)', (() => { const kg = khoGia(); KH.ghiKeHoach(dayDu, kg); const r = KH.docKeHoach(kg); return bang(r.xe, dayDu.xe) && bang(r.thuoc, dayDu.thuoc) && bang(r.thuocXong, dayDu.thuocXong) && bang(r.chuKy, dayDu.chuKy); })());
  k('D3 kho bị chặn → ghi trả false (màn không báo "đã lưu")', KH.ghiKeHoach(dayDu, { getItem: () => null, setItem: () => { throw new Error('chặn'); } }) === false);
  k('D3 không thêm khoá lưu mới: vẫn chỉ kh_kehoach (luật xoá của luuMay.js áp cho cả xe / thuốc / chu kỳ)', (() => { const kg = khoGia(); KH.ghiKeHoach(dayDu, kg); return bang(Object.keys(kg.d), ['kh_kehoach']); })());
  k('D3 đổi khách khác → xoá luôn xe / thuốc / chu kỳ; đăng xuất → xoá; cùng khách → giữ', (() => {
    const kg = khoGia(); KH.ghiKeHoach(dayDu, kg); LM.ghiChu('0901234567', kg);
    LM.doiKhach('0901234567', kg); const giu = !!kg.d.kh_kehoach;
    LM.doiKhach('0907654321', kg); const xoaKhac = kg.d.kh_kehoach === undefined;
    KH.ghiKeHoach(dayDu, kg); LM.xoaTatCa(kg);
    return giu && xoaKhac && kg.d.kh_kehoach === undefined;
  })());

  console.log('D/F4 — đường dẫn, danh mục sửa được ở /admin');
  k('D đường dẫn: /kehoach/xeco · /uongthuoc · /chuky mở đúng tiện ích (cần đăng nhập, quay lại /kehoach); tiện ích lạ về /kehoach', ['xeco', 'uongthuoc', 'chuky'].every((t) => { const r = DD.docDuongDan('/kehoach/' + t); return r.trang === 'tienich' && r.tham.tienich === t && r.chuan === '/kehoach/' + t && r.cha === '/kehoach' && r.canDN; }) && DD.docDuongDan('/kehoach/xe-la').trang === 'kehoach' && DD.taoDuongDan('tienich', { tienich: 'chuky' }) === '/kehoach/chuky');
  k('F4 danh mục (kiemDanhMuc) không lỗi; ≥ 150 khoá của việc này; mỗi khoá có man / ten; mặc định xe là danh sách có khoá cấu trúc `loai`', ND.kiemDanhMuc(IDX.DANH_MUC).length === 0 && TI.TIEN_ICH.length >= 150 && TI.TIEN_ICH.every((m) => m.man && m.ten) && TI.TIEN_ICH.find((m) => m.khoa === 'xe.macdinh').khoaCauTruc[0] === 'loai');
  k('F4 khối mới có công tắc hien.<khối> (ô Xe / Thuốc / Chu kỳ, khung Văn khấn, gợi ý lễ vật) và 5 khoá cyc.0…cyc.4', ['hien.ocXe', 'hien.ocThuoc', 'hien.ocChuKy', 'hien.vkKhung', 'hien.vkGoiYLe', 'cyc.0', 'cyc.1', 'cyc.2', 'cyc.3', 'cyc.4'].every((x) => TI.TIEN_ICH.some((m) => m.khoa === x)));
  const dung = TEP_MAN.map(doc).join('\n');
  const khoaDung = [...dung.matchAll(/\b(?:nd|ndPhan|ndNut|ndDs|ndHien|ndDau)\('([\w.]+)'/g), ...dung.matchAll(/<Chu k="([\w.]+)"/g), ...dung.matchAll(/\bk="([\w.]+)"/g)].map((m) => m[1]);
  const coKhoa = new Set(IDX.DANH_MUC.map((m) => m.khoa));
  k('F4 mọi khoá nd()/<Chu> dùng trong 3 màn mới + Văn khấn + lưới đều có trong danh mục (không khoá mồ côi)', khoaDung.length >= 40 && khoaDung.every((x) => coKhoa.has(x)), khoaDung.filter((x) => !coKhoa.has(x)).join());
  const mocoi = TI.TIEN_ICH.filter((m) => !/^(cyc\.\d|xe\.hangGoiY|xe\.viecKhac)$/.test(m.khoa) && !TEP_MAN.some((f) => doc(f).includes(m.khoa))).map((m) => m.khoa);
  k('F4 mọi khoá của việc này được dùng trong màn (không mục thừa)', mocoi.length === 0, mocoi.join());
  k('F4 ngân sách: mỗi tệp mới < 500 dòng', ['src/components/XeCo.jsx', 'src/components/UongThuoc.jsx', 'src/components/ChuKy.jsx'].every((f) => doc(f).split('\n').length < 500));

  console.log('Phần 2 — App thật trong Chromium');
  let pw = null;
  if (process.env.KHONG_TRINH_DUYET !== '1') { try { pw = require('playwright'); } catch { /* không có */ } } // CLAUDE.md §9
  if (!pw) console.log('  BỎ QUA: không có Playwright ở máy này (hoặc KHONG_TRINH_DUYET=1) — các ca trình duyệt CHƯA chạy');
  else await trinhDuyet(pw, { LP, LM, KH });

  console.log(`\n${dat} đạt · ${hong} hỏng`);
  process.exit(hong ? 1 : 0);
})().catch((e) => { console.error(e); console.log(`\n${dat} đạt · ${hong + 1} hỏng`); process.exit(1); });


async function trinhDuyet(pw, { LP, LM, KH }) {
  const esbuild = require('esbuild');
  const kq = esbuild.buildSync({
    entryPoints: [path.join(GOC, 'src/main.jsx')], bundle: true, write: false, outdir: path.join(GOC, '.nhap_thu'), format: 'iife', jsx: 'automatic', logLevel: 'silent', external: ['/anh/*', '/fonts/*'],
    loader: { '.json': 'json', '.svg': 'dataurl', '.webp': 'dataurl', '.png': 'dataurl', '.woff2': 'dataurl' }, define: { 'process.env.NODE_ENV': '"production"', 'import.meta.env.VITE_POS_API': '""' },
  }).outputFiles;
  const goi = kq.find((f) => f.path.endsWith('.js')).text, css = (kq.find((f) => f.path.endsWith('.css')) || { text: '' }).text;
  const html = doc('index.html').replace(/<script type="module" src="\/src\/main.jsx"><\/script>/, '<script src="/bundle.js"></script>').replace(/<link[^>]*(googleapis|gstatic|preload)[^>]*>/g, '').replace('</head>', '<link rel="stylesheet" href="/bundle.css"></head>');
  const SDT = '0901234567', GOC_URL = 'http://localhost:4599' /* localhost = ngữ cảnh an toàn: crypto.subtle (băm mã khoá) chạy được như ở https thật */, MOC_GIO = '2026-11-10T02:00:00Z'; // = 09:00 ngày 10.11.2026 giờ VN
  const HN = { d: 10, m: 11, y: 2026 }, hn = LP.jd(HN), ngay = (j) => LP.chuoiJd(hn + j), NAY = ngay(0);
  const trinh = await pw.chromium.launch();

  async function ca(ten, { rong = 390, luu = {}, xung = 'chi', khach = {}, ua } = {}, chay) {
    const ctx = await trinh.newContext({ viewport: { width: rong, height: 844 }, ...(ua ? { userAgent: ua } : {}) });
    const t = await ctx.newPage(), loi = [];
    t.on('pageerror', (e) => loi.push(e.message));
    await t.addInitScript(({ luu }) => { if (!sessionStorage.getItem('da_gieo')) { sessionStorage.setItem('da_gieo', '1'); for (const [x, v] of Object.entries(luu)) localStorage.setItem(x, v); } }, { luu: { kh_token: 'tok-' + SDT, kh_chu: LM.dauVet(SDT), ...luu } });
    await t.clock.install({ time: new Date(MOC_GIO) });
    await t.route(`${GOC_URL}/**`, async (r) => {
      const p = new URL(r.request().url()).pathname, json = (status, o) => r.fulfill({ status, contentType: 'application/json', body: JSON.stringify(o) });
      if (p === '/bundle.js') return r.fulfill({ contentType: 'text/javascript', body: goi });
      if (p === '/bundle.css') return r.fulfill({ contentType: 'text/css', body: css });
      if (!p.startsWith('/api/kh')) return /\.[a-z0-9]+$/.test(p) ? r.fulfill({ status: 204, body: '' }) : r.fulfill({ contentType: 'text/html', body: html });
      if (p === '/api/kh/toi') return json(200, { khach: { sdt: SDT, ten: 'Khách thử', xung_ho: xung, ngay_tao: '2026-01-01 00:00:00', qr: 'QR', dia_chi: null, ...khach } });
      if (p === '/api/kh/gio-vang') return json(200, { success: true, dang_chay: false, bat_dau: null, ket_thuc: null, phan_tram: 0, mon: [] });
      if (p === '/api/kh/chuong-trinh') return json(200, { success: true, data: [] });
      return json(500, { error: 'chưa giả', code: 'LOI_GIA' });
    });
    try { await chay(t, loi); } finally { await ctx.close(); }
  }
  const mo = async (t, duong) => { await t.goto(GOC_URL + duong); await t.waitForSelector('.phone'); };
  const duong = (t) => new URL(t.url()).pathname;
  const luuTho = async (t) => JSON.parse(await t.evaluate(() => localStorage.getItem('kh_kehoach') || '{}'));
  const thanTrong = (t) => t.locator('#toolBody');
  const bang1 = (t) => t.locator('[role=dialog]');
  const toast = (t) => t.locator('.toast');
  const tran = (t) => t.evaluate(() => document.documentElement.scrollWidth - innerWidth);

  await ca('luoi', {}, async (t, loi) => {
    await mo(t, '/kehoach'); await t.locator('#toolGrid').waitFor();
    k('D1 lưới 6 ô: chữ nhỏ ba ô mới thành thật — "Thêm xe" · "Thêm thuốc" · "Bật" (không còn "Sắp có")', bang(await t.locator('#toolGrid .tl small').allInnerTexts(), ['Mùa Đông', 'Rằm · 13 ng', 'Nhà giáo Việt Nam · 10 ng', 'Thêm xe', 'Thêm thuốc', 'Bật']), JSON.stringify(await t.locator('#toolGrid .tl small').allInnerTexts()));
    await t.locator('#toolGrid .tl', { hasText: 'Xe cộ' }).click(); await t.waitForURL('**/kehoach/xeco');
    k('D1 bấm ô Xe cộ → /kehoach/xeco', duong(t) === '/kehoach/xeco' && (await t.locator('h1').first().innerText()) === 'Xe cộ');
    await t.goBack(); await t.locator('#toolGrid').waitFor();
    await t.locator('#toolGrid .tl', { hasText: 'Uống thuốc' }).click(); await t.waitForURL('**/kehoach/uongthuoc');
    await t.goBack(); await t.locator('#toolGrid').waitFor();
    await t.locator('#toolGrid .tl', { hasText: 'Chu kỳ' }).click(); await t.waitForURL('**/kehoach/chuky');
    k('D1 Uống thuốc → /kehoach/uongthuoc, Chu kỳ → /kehoach/chuky; Back về /kehoach đúng', (await t.locator('h1').first().innerText()) === 'Chu kỳ');
    await t.goBack(); await t.locator('#toolGrid').waitFor();
    k('D1 Back từ Chu kỳ → về Kế hoạch (không thoát app)', duong(t) === '/kehoach');
    k('F4 không lỗi JS', loi.length === 0, loi.join(' | '));
  });

  await ca('xe', {}, async (t, loi) => {
    await mo(t, '/kehoach/xeco'); await thanTrong(t).waitFor();
    k('A1 chưa có xe: lời mời thêm xe (không xe mẫu), nút "＋ Thêm xe"', (await thanTrong(t).innerText()).includes('Chưa có xe nào') && (await t.locator('.today-btn', { hasText: '＋ Thêm xe' }).count()) === 1);
    await t.locator('.today-btn', { hasText: '＋ Thêm xe' }).click(); await bang1(t).waitFor();
    const mauNote = await bang1(t).locator('.tl-note').innerText();
    k('A2 bảng Thêm xe: 4 loại (Xe máy · Ô tô · Xe đạp điện · Khác), lịch mẫu của Xe máy hiện sẵn', bang(await bang1(t).locator('.pf-chips button').allInnerTexts(), ['Xe máy', 'Ô tô', 'Xe đạp điện', 'Khác']) && mauNote.includes('Thay dầu máy (mỗi 1.500 km hoặc mỗi 2 tháng)') && mauNote.includes('Bảo hiểm bắt buộc'), mauNote);
    await bang1(t).getByRole('button', { name: 'Thêm xe', exact: true }).click();
    k('A2 chưa nhập tên → báo "Nhập tên gọi trước nhé", bảng vẫn mở, chưa lưu', (await toast(t).innerText()).includes('Nhập tên gọi trước nhé') && (await bang1(t).count()) === 1 && !(await luuTho(t)).xe);
    await bang1(t).getByLabel('Tên gọi').fill('Honda Lead'); await bang1(t).getByLabel('Biển số (không bắt buộc)').fill('29X1-123.45'); await bang1(t).getByLabel('Số km hiện tại').fill('12000');
    await bang1(t).getByRole('button', { name: 'Thêm xe', exact: true }).click(); await bang1(t).waitFor({ state: 'detached' });
    const luu1 = await luuTho(t);
    k('A2 lưu → kho kh_kehoach có xe (loại xm, 12000 km, 3 hạng mục mặc định, 1 giấy tờ), mở thẳng màn một xe', luu1.xe.length === 1 && luu1.xe[0].loai === 'xm' && luu1.xe[0].km === 12000 && luu1.xe[0].lich.length === 3 && luu1.xe[0].giayTo.length === 1 && (await t.locator('h1').first().innerText()) === 'Honda Lead');
    const dau = await thanTrong(t).innerText();
    k('A3 một xe: ô số km 12000, "Lịch bảo dưỡng", 3 hạng mục "Chưa ghi lần nào", "mỗi 1.500 km hoặc mỗi 2 tháng", giấy tờ chưa nhập ngày, "Lịch sử bảo dưỡng" trống', (await t.getByLabel('Số km hiện tại').inputValue()) === '12000' && dau.includes('Lịch bảo dưỡng') && (dau.match(/Chưa ghi lần nào/g) || []).length === 3 && dau.includes('mỗi 1.500 km hoặc mỗi 2 tháng') && dau.includes('Chưa nhập ngày hết hạn') && dau.includes('Chưa có lần sửa nào'));
    await t.locator('.sch', { hasText: 'Thay dầu máy' }).getByRole('button', { name: '✓ Vừa làm hôm nay' }).click();
    const sch = await t.locator('.sch', { hasText: 'Thay dầu máy' }).innerText();
    k('A3 "Vừa làm hôm nay" ở Thay dầu máy → trạng thái đổi "còn 1.500 km hoặc 61 ngày" + thanh tiến độ; lịch sử có 1 dòng 10/11; toast', sch.includes('còn 1.500 km hoặc 61 ngày') && sch.includes('lần cuối 10/11') && (await t.locator('.sch', { hasText: 'Thay dầu máy' }).locator('.car-bar').count()) === 1 && (await thanTrong(t).innerText()).includes('Thay dầu máy') && (await luuTho(t)).xe[0].nhatKy.length === 1 && (await toast(t).innerText()).includes('Đã ghi: Thay dầu máy hôm nay, 12.000 km'), sch);
    await t.getByLabel('Số km hiện tại').fill('13400'); await t.getByLabel('Số km hiện tại').blur();
    k('A3 sửa nhanh số km → 13.400 lưu ngay; Thay dầu máy còn 100 km (≤ 150) → sắp tới hạn lên đầu, viền cảnh báo', (await luuTho(t)).xe[0].km === 13400 && (await t.locator('.sch').first().innerText()).includes('Thay dầu máy') && (await t.locator('.sch.soon').count()) === 1 && (await t.locator('.sch').first().innerText()).includes('còn 100 km hoặc'));
    await t.locator('.today-btn', { hasText: '＋ Ghi lần sửa' }).click(); await bang1(t).waitFor();
    await bang1(t).getByRole('button', { name: 'Rửa xe', exact: true }).click(); await bang1(t).getByLabel('Chi phí (đ)').fill('50000'); await bang1(t).getByLabel('Nơi làm').fill('Tiệm Ba');
    await bang1(t).getByLabel('Việc khác, tự điền: VD thay gương, sơn lại yếm').fill('Thay gương'); await bang1(t).getByRole('button', { name: '＋ Thêm', exact: true }).click();
    await bang1(t).getByRole('button', { name: 'Lưu', exact: true }).click(); await bang1(t).waitFor({ state: 'detached' });
    const nk = (await luuTho(t)).xe[0].nhatKy;
    k('A3 Ghi lần sửa (ngày hôm nay, km 13.400, chọn "Rửa xe" + tự thêm "Thay gương", chi phí, nơi làm) → lịch sử + tổng chi phí 50.000đ', nk.length === 2 && nk[1].viec.sort().join() === 'Rửa xe,Thay gương' && nk[1].phi === 50000 && nk[1].noi === 'Tiệm Ba' && nk[1].km === 13400 && (await thanTrong(t).innerText()).includes('50.000đ') && (await thanTrong(t).innerText()).includes('Tiệm Ba'));
    await t.locator('.tl-row', { hasText: 'Bảo hiểm bắt buộc' }).getByRole('button').click(); await bang1(t).waitFor();
    await bang1(t).getByRole('button', { name: 'Lưu', exact: true }).click(); await bang1(t).waitFor({ state: 'detached' });
    k('A3 giấy tờ: chọn ngày hết hạn (mặc định hôm nay) → "Hết hạn 10/11 · còn 0 ngày", ≤ 30 ngày nên cảnh báo', (await t.locator('.tl-row', { hasText: 'Bảo hiểm bắt buộc' }).innerText()).includes('Hết hạn 10/11 · còn 0 ngày') && (await t.locator('.tl-row small.warn').count()) === 1);
    await t.locator('.more', { hasText: '＋ Hạng mục' }).click(); await bang1(t).waitFor();
    await bang1(t).getByRole('button', { name: 'Lưu', exact: true }).click();
    k('A3 thêm hạng mục: thiếu tên → nhắc; có tên nhưng thiếu km lẫn tháng → nhắc "Điền số km hoặc số tháng"', (await toast(t).innerText()).includes('Nhập tên hạng mục'));
    await bang1(t).getByLabel('Tên hạng mục').fill('Thay nhông xích'); await bang1(t).getByRole('button', { name: 'Lưu', exact: true }).click();
    k('A3 thiếu km lẫn tháng → "Điền số km hoặc số tháng", chưa lưu', (await toast(t).innerText()).includes('Điền số km hoặc số tháng') && (await luuTho(t)).xe[0].lich.length === 3);
    await bang1(t).getByLabel('Số km', { exact: true }).fill('20000'); await bang1(t).getByRole('button', { name: 'Lưu', exact: true }).click(); await bang1(t).waitFor({ state: 'detached' });
    k('A3 lưu hạng mục mới (20.000 km) → 4 hạng mục', (await luuTho(t)).xe[0].lich.length === 4 && (await thanTrong(t).innerText()).includes('Thay nhông xích'));
    await t.getByText('Xoá xe', { exact: true }).click();
    k('A2 Xoá xe → hỏi lại một lần ngay tại chỗ, chưa xoá', (await t.locator('.hoi-xoa').innerText()).includes('Xoá xe «Honda Lead»?') && (await luuTho(t)).xe.length === 1);
    await t.locator('.hoi-xoa').getByRole('button', { name: 'Huỷ', exact: true }).click();
    await t.locator('.back-btn').click();
    const ds = await thanTrong(t).innerText();
    k('A1 quay lại danh sách: xe "Honda Lead", biển số · 13.400 km, trạng thái sắp tới hạn "● Thay dầu máy · còn 100 km…"; ô lưới "1 xe · 1 sắp tới hạn"', ds.includes('Honda Lead') && ds.includes('29X1-123.45 · 13.400 km') && ds.includes('● Thay dầu máy · còn 100 km'), ds);
    await t.locator('.back-btn').click(); await t.locator('#toolGrid').waitFor();
    k('D1 ô Xe cộ ở lưới: "1 xe · 1 sắp tới hạn"', (await t.locator('#toolGrid .tl', { hasText: 'Xe cộ' }).locator('small').innerText()) === '1 xe · 1 sắp tới hạn');
    await t.locator('.up-strip').waitFor();
    const st = await t.locator('.up-strip').innerText();
    k('D2 Sắp tới có dòng xe (Thay dầu máy · Honda Lead) và giấy tờ hôm nay; bấm → mở Xe cộ', st.includes('Thay dầu máy · Honda Lead') || (await t.locator('.up-r', { hasText: 'Honda Lead' }).count()) >= 1);
    await t.locator('.up-r', { hasText: 'Honda Lead' }).first().click(); await t.waitForURL('**/kehoach/xeco');
    k('D2 bấm dòng xe ở Sắp tới → /kehoach/xeco', duong(t) === '/kehoach/xeco');
    await t.reload(); await t.waitForSelector('.phone');
    k('D3 tải lại trang: xe còn nguyên trong danh sách', (await thanTrong(t).innerText()).includes('Honda Lead'));
    k('F4 không lỗi JS', loi.length === 0, loi.join(' | '));
  });

  await ca('xeXoa', { luu: { kh_kehoach: JSON.stringify({ v: 1, xe: [{ id: 'a', ten: 'Vios', bien: '', loai: 'oto', km: 100, nhac: true, lich: [], giayTo: [], nhatKy: [] }] }) } }, async (t) => {
    await mo(t, '/kehoach/xeco'); await t.locator('.veh').first().click();
    await t.getByText('Xoá xe', { exact: true }).click(); await t.locator('.hoi-xoa').getByRole('button', { name: 'Xoá', exact: true }).click();
    k('A2 xác nhận Xoá → xe biến mất khỏi kho, về danh sách trống', (await luuTho(t)).xe.length === 0 && (await thanTrong(t).innerText()).includes('Chưa có xe nào'));
  });

  await ca('thuoc', {}, async (t, loi) => {
    await mo(t, '/kehoach/uongthuoc'); await thanTrong(t).waitFor();
    k('B1 chưa có thuốc: lời mời, KHÔNG ô tổng "0/0" (không số bịa), ghi chú riêng tư cuối màn', (await thanTrong(t).innerText()).includes('Chưa có thuốc nào') && (await t.locator('.med-sum').count()) === 0 && (await thanTrong(t).innerText()).includes('không ghi tên thuốc'));
    await t.locator('.today-btn', { hasText: '＋ Thêm' }).click(); await bang1(t).waitFor();
    await bang1(t).getByRole('button', { name: 'Lưu và nhắc', exact: true }).click();
    k('B2 thiếu tên → "Nhập tên thuốc trước nhé", bảng vẫn mở', (await toast(t).innerText()).includes('Nhập tên thuốc trước nhé') && (await bang1(t).count()) === 1);
    await bang1(t).getByLabel('Tên thuốc').fill('Thuốc sắc Hoàng Kỳ'); await bang1(t).getByLabel('Liều mỗi lần').fill('1 chén');
    await bang1(t).getByText('＋ Thêm giờ').click();
    await bang1(t).locator('.thuoc-gio').nth(1).getByRole('spinbutton', { name: 'Giờ' }).locator('div', { hasText: /^20$/ }).click();
    k('B2 bảng thêm thuốc: 2 bánh xe giờ (07:30 và 20:30), "Uống trong" 4 lựa chọn (mặc định 14 ngày)', (await bang1(t).locator('.thuoc-gio').count()) === 2 && bang(await bang1(t).locator('.pf-chips button').allInnerTexts(), ['7 ngày', '14 ngày', '30 ngày', 'Dài ngày']) && (await bang1(t).locator('.pf-chips button.on').innerText()) === '14 ngày');
    await bang1(t).getByRole('button', { name: 'Lưu và nhắc', exact: true }).click(); await bang1(t).waitFor({ state: 'detached' });
    const l1 = (await luuTho(t)).thuoc;
    k('B2 lưu → kho có thuốc: giờ 07:30 + 20:30, đến hôm nay + 13 ngày (14 ngày), liều "1 chén"; toast "nhắc lúc 07:30, 20:30"', l1.length === 1 && bang(l1[0].gio, ['07:30', '20:30']) && l1[0].den === ngay(13) && l1[0].lieu === '1 chén' && (await toast(t).innerText()).includes('nhắc lúc 07:30, 20:30'));
    k('B1 ô tổng "0/2" "lần uống hôm nay", 7 chấm + chấm hôm nay, mỗi giờ là nút "07:30 Chưa uống"', (await t.locator('.med-sum b').innerText()) === '0/2' && (await t.locator('.med-7 i').count()) === 8 && (await t.locator('.med-times button').allInnerTexts()).join('|').replace(/\s+/g, ' ') === '07:30 Chưa uống|20:30 Chưa uống');
    await t.locator('.med-times button', { hasText: '07:30' }).click();
    k('B1 bấm giờ 07:30 → "Đã uống", tổng 1/2, kho ghi dấu; bấm lại → bỏ (0/2)', (await t.locator('.med-sum b').innerText()) === '1/2' && (await t.locator('.med-times button.ok').count()) === 1 && (await luuTho(t)).thuocXong[NAY].length === 1);
    await t.locator('.med-times button', { hasText: '07:30' }).click();
    k('B1 bấm lại → bỏ đánh dấu (0/2)', (await t.locator('.med-sum b').innerText()) === '0/2');
    await t.locator('.med-times button', { hasText: '07:30' }).click();
    await t.reload(); await t.waitForSelector('.phone');
    k('D3 tải lại: vẫn 1/2 (dấu đã uống lưu trên máy)', (await t.locator('.med-sum b').innerText()) === '1/2');
    await t.goto(GOC_URL + '/kehoach'); await t.waitForSelector('.phone');
    k('D1 ô Uống thuốc ở lưới: "1/2 hôm nay"', (await t.locator('#toolGrid .tl', { hasText: 'Uống thuốc' }).locator('small').innerText()) === '1/2 hôm nay');
    const sap = await t.locator('.up-strip').innerText();
    k('D2/B3 Sắp tới: giờ 20:30 còn phải uống hiện "Đến giờ uống thuốc" — KHÔNG tên thuốc', sap.includes('Đến giờ uống thuốc') && !sap.includes('Hoàng Kỳ'), sap);
    await t.clock.fastForward('11:29:00'); await t.waitForTimeout(100); // tới 20:29 (nhảy xa hơn 3 phút thì dải nhắc bỏ qua mốc cũ — đúng thiết kế)
    await t.clock.fastForward('00:02:00');
    await t.locator('.dai-nhac').waitFor({ timeout: 8000 });
    const banner = await t.locator('.dai-nhac').innerText();
    k('B3 20:30 dải nhắc mở app chỉ nói "Đến giờ uống thuốc (20:30)" — KHÔNG tên thuốc, KHÔNG liều', banner.includes('Đến giờ uống thuốc (20:30)') && !banner.includes('Hoàng Kỳ') && !banner.includes('chén'), banner);
    await t.goto(GOC_URL + '/kehoach/uongthuoc'); await t.waitForSelector('.phone');
    await t.locator('.med-card').getByText('Xoá thuốc này').click();
    k('B1 xoá thuốc → hỏi lại một lần; Xoá → hết thuốc, dấu đã uống cũng xoá', (await t.locator('.hoi-xoa').innerText()).includes('Xoá thuốc «Thuốc sắc Hoàng Kỳ»?') && (await luuTho(t)).thuoc.length === 1);
    await t.locator('.hoi-xoa').getByRole('button', { name: 'Xoá', exact: true }).click();
    k('B1 xác nhận Xoá → kho hết thuốc', (await luuTho(t)).thuoc.length === 0 && (await thanTrong(t).innerText()).includes('Chưa có thuốc nào'));
    k('F4 không lỗi JS', loi.length === 0, loi.join(' | '));
  });

  const kho = (o) => ({ kh_kehoach: JSON.stringify({ v: 1, ...o }) });
  await ca('thuocHetHan', { luu: kho({ thuoc: [{ id: 'a', ten: 'Cũ', lieu: '1', ghi: '', gio: ['08:00'], den: ngay(-1), bd: ngay(-10), nhac: true }] }) }, async (t) => {
    await mo(t, '/kehoach/uongthuoc'); await thanTrong(t).waitFor();
    const noi = await thanTrong(t).innerText();
    k('B2 hết đợt uống: thuốc vẫn trong danh sách, ghi "đã xong", không còn nút giờ, xoá được', noi.includes('Cũ') && noi.includes('đã xong') && (await t.locator('.med-times').count()) === 0 && (await t.getByText('Xoá thuốc này').count()) === 1);
  });

  await ca('chuky', {}, async (t, loi) => {
    await mo(t, '/kehoach/chuky'); await thanTrong(t).waitFor();
    k('C1 chưa bật: thẻ giới thiệu + nút "Bắt đầu"; chưa có dữ liệu chu kỳ trong kho', (await thanTrong(t).innerText()).includes('Theo dõi chu kỳ') && (await t.getByRole('button', { name: 'Bắt đầu', exact: true }).count()) === 1 && !(await luuTho(t)).chuKy);
    await t.getByRole('button', { name: 'Bắt đầu', exact: true }).click(); await bang1(t).waitFor();
    k('C1 bấm Bắt đầu → hỏi ngày bắt đầu kỳ gần nhất (bánh xe ngày)', (await bang1(t).innerText()).includes('Kỳ kinh gần nhất của bạn bắt đầu ngày nào?'));
    await bang1(t).getByRole('button', { name: 'Lưu và bắt đầu', exact: true }).click(); await bang1(t).waitFor({ state: 'detached' });
    const tt = await thanTrong(t).innerText();
    k('C2 đã bật (bắt đầu hôm nay): "Ngày 1", "Hành kinh", "Kỳ kinh tới (dự kiến)" 7/12 "còn 28 ngày", chữ dưỡng sinh cyc.0 ("Giữ ấm bụng…")', tt.includes('Ngày 1') && tt.includes('Hành kinh') && tt.includes('còn 28 ngày') && tt.includes('Dưỡng sinh lúc này') && tt.includes('Giữ ấm bụng, lưng và bàn chân'), tt);
    k('C2 dải 28 ô, 1 ô "hôm nay", chú giải 4 giai đoạn, ± độ dài (28 ngày) và hành kinh (5 ngày), "Nhắc trước kỳ 2 ngày", ghi chú tham khảo', (await t.locator('.cyc-strip i').count()) === 28 && (await t.locator('.cyc-strip i.now').count()) === 1 && (await t.locator('.cyc-lg span').count()) === 4 && tt.includes('28 ngày') && tt.includes('5 ngày') && tt.includes('Nhắc trước kỳ 2 ngày') && tt.includes('không dùng để tránh thai') && tt.includes('Chưa có chu kỳ nào được ghi'));
    await t.locator('.cyc-set > div').first().getByRole('button', { name: '+', exact: true }).click(); await t.locator('.cyc-set > div').nth(1).getByRole('button', { name: '−', exact: true }).click();
    k('C2 chỉnh + độ dài → 29, − hành kinh → 4; lưu trên máy', (await luuTho(t)).chuKy.dai === 29 && (await luuTho(t)).chuKy.hanh === 4);
    await t.locator('.cyc-set > div').first().getByRole('button', { name: '−', exact: true }).click();
    await t.getByRole('button', { name: 'Kỳ kinh bắt đầu hôm nay', exact: true }).click();
    k('C2 "Kỳ kinh bắt đầu hôm nay" (kỳ vừa bắt đầu hôm nay, 0 ngày) → không ghi vào lịch sử, toast "Đã ghi…"', (await luuTho(t)).chuKy.ls.length === 0 && (await toast(t).innerText()).includes('Đã ghi: kỳ kinh bắt đầu hôm nay'));
    await t.locator('.switch').click(); await bang1(t).waitFor();
    for (const c of ['1', '2', '3', '4']) await bang1(t).locator('.pin-pad button', { hasText: new RegExp(`^${c}$`) }).click();
    await bang1(t).getByRole('button', { name: 'Xác nhận', exact: true }).click();
    k('C3 bật "Khoá bằng mã khi mở" → bảng đặt mã 4 số (khác PIN ví), bước 1 xong thì yêu cầu nhập lại', (await bang1(t).innerText()).includes('Nhập lại mã để xác nhận'));
    for (const c of ['1', '2', '3', '5']) await bang1(t).locator('.pin-pad button', { hasText: new RegExp(`^${c}$`) }).click();
    await bang1(t).getByRole('button', { name: 'Xác nhận', exact: true }).click();
    k('C3 nhập lại sai → báo "Hai lần nhập chưa giống nhau", chưa khoá', (await bang1(t).innerText()).includes('Hai lần nhập chưa giống nhau') && !(await luuTho(t)).chuKy.khoa);
    for (let lan = 0; lan < 2; lan++) { for (const c of ['1', '2', '3', '4']) await bang1(t).locator('.pin-pad button', { hasText: new RegExp(`^${c}$`) }).click(); await bang1(t).getByRole('button', { name: 'Xác nhận', exact: true }).click(); }
    await bang1(t).waitFor({ state: 'detached' });
    const kt = await luuTho(t);
    k('C3 đặt xong → khoá bật; kho chỉ có muối + băm SHA-256, KHÔNG có mã gốc; vẫn ở trong màn (không bị khoá ngay)', !!kt.chuKy.khoa && /^[0-9a-f]{64}$/.test(kt.chuKy.khoa.bam) && !JSON.stringify(kt).includes('"1234"') && (await t.locator('.switch.on').count()) === 1);
    k('D1/C4 ô lưới Chu kỳ khi khoá: "Riêng tư" (không hiện số ngày)', await (async () => { await t.goto(GOC_URL + '/kehoach'); await t.waitForSelector('.phone'); return (await t.locator('#toolGrid .tl', { hasText: 'Chu kỳ' }).locator('small').innerText()) === 'Riêng tư'; })());
    const sapRieng = await t.locator('.up-strip').innerText();
    await t.goto(GOC_URL + '/kehoach/saptoi'); await thanTrong(t).waitFor();
    const sapAll = await thanTrong(t).innerText();
    k('C4 khoá thì Sắp tới hiện "Lời nhắc riêng tư", KHÔNG "Kỳ kinh dự kiến", không chữ kinh / chu kỳ', sapAll.includes('Lời nhắc riêng tư') && !/Kỳ kinh|chu kỳ/i.test(sapAll + sapRieng), sapAll);
    await mo(t, '/kehoach/chuky'); await t.locator('.pin-pad').waitFor();
    k('C3 mở lại Chu kỳ → hỏi mã (không hiện dữ liệu chu kỳ phía sau)', (await thanTrong(t).innerText()).includes('Nhập mã để mở Chu kỳ') && (await t.locator('.cyc-card').count()) === 0);
    for (const c of ['9', '9', '9', '9']) await t.locator('.pin-pad button', { hasText: new RegExp(`^${c}$`) }).click();
    await t.getByRole('button', { name: 'Xác nhận', exact: true }).click();
    await t.getByText('Mã chưa đúng · còn 4 lần thử').waitFor();
    k('C3 mã sai → "Mã chưa đúng · còn 4 lần thử", vẫn khoá', (await t.locator('.cyc-card').count()) === 0);
    for (const c of ['1', '2', '3', '4']) await t.locator('.pin-pad button', { hasText: new RegExp(`^${c}$`) }).click();
    await t.getByRole('button', { name: 'Xác nhận', exact: true }).click(); await t.locator('.cyc-card').waitFor();
    k('C3 mã đúng → mở Chu kỳ, "Ngày 1"', (await thanTrong(t).innerText()).includes('Ngày 1'));
    await mo(t, '/kehoach/chuky'); await t.locator('.pin-pad').waitFor();
    for (let lan = 0; lan < 5; lan++) { for (const c of ['9', '9', '9', '9']) await t.locator('.pin-pad button', { hasText: new RegExp(`^${c}$`) }).click(); await t.getByRole('button', { name: 'Xác nhận', exact: true }).click(); await t.waitForTimeout(150); }
    await t.getByText(/Nhập sai nhiều lần, thử lại sau \d+ giây/).waitFor();
    k('C3 sai 5 lần → "Nhập sai nhiều lần, thử lại sau N giây", bàn phím bị khoá', (await t.locator('.pin-pad button').first().isDisabled()));
    await t.reload(); await t.waitForSelector('.phone'); await t.locator('.pin-pad').waitFor();
    k('C3 tải lại trang vẫn đang chờ (đếm sai lưu trên máy, không lách bằng cách tải lại)', (await t.locator('.pin-pad button').first().isDisabled()));
    await t.getByText('Quên mã? Xoá dữ liệu chu kỳ để đặt lại').click();
    k('C3 "Quên mã?" → hỏi lại một lần, chưa xoá', (await t.locator('.hoi-xoa').innerText()).includes('Xoá dữ liệu «chu kỳ»?') && !!(await luuTho(t)).chuKy.bat);
    await t.locator('.hoi-xoa').getByRole('button', { name: 'Xoá', exact: true }).click();
    k('C3 xác nhận Xoá → dữ liệu chu kỳ xoá thật trên máy (về chưa bật), hiện lại thẻ giới thiệu để đặt lại', !(await luuTho(t)).chuKy.bat && !(await luuTho(t)).chuKy.khoa && (await thanTrong(t).innerText()).includes('Theo dõi chu kỳ'));
    k('F4 không lỗi JS', loi.length === 0, loi.join(' | '));
  });

  await ca('chukyTat', { luu: kho({ chuKy: { bat: true, bd: ngay(-28), dai: 28, hanh: 5, ls: [27, 29], nhac: true } }) }, async (t) => {
    await mo(t, '/kehoach/chuky'); await t.locator('.cyc-card').waitFor();
    const nd = await thanTrong(t).innerText();
    k('C2 chu kỳ đã đủ 28 ngày: "Ngày 29" "Chậm kinh"; "2 kỳ" trung bình 28 ngày', nd.includes('Ngày 29') && nd.includes('Chậm kinh') && nd.includes('27 · 29 ngày · trung bình 28 ngày') && nd.includes('đã tới'), nd);
    await t.getByRole('button', { name: 'Kỳ kinh bắt đầu hôm nay', exact: true }).click();
    const c = (await luuTho(t)).chuKy;
    k('C2 "Kỳ kinh bắt đầu hôm nay" → ghi độ dài 28 vào lịch sử, kỳ mới hôm nay (Ngày 1)', bang(c.ls, [27, 29, 28]) && c.bd === NAY && (await thanTrong(t).innerText()).includes('Ngày 1'));
    await t.getByText('Tắt & xoá dữ liệu chu kỳ').click(); await t.locator('.hoi-xoa').getByRole('button', { name: 'Huỷ', exact: true }).click();
    k('C2 Tắt & xoá → hỏi lại; Huỷ → còn nguyên', !!(await luuTho(t)).chuKy.bat);
    await t.getByText('Tắt & xoá dữ liệu chu kỳ').click(); await t.locator('.hoi-xoa').getByRole('button', { name: 'Xoá', exact: true }).click();
    k('C2 xác nhận → xoá thật trên máy', !(await luuTho(t)).chuKy.bat && (await thanTrong(t).innerText()).includes('Theo dõi chu kỳ'));
  });

  await ca('vankhan', { khach: { ten: 'Nguyễn Văn An', dia_chi: '12 Lê Lợi, Hà Nội' } }, async (t, loi) => {
    await mo(t, '/kehoach/vankhan'); await t.locator('.vk-khung').waitFor();
    k('E1 khung "Thông tin gia đình khi khấn" ở đầu danh sách, điền sẵn từ tài khoản: Tín chủ "Nguyễn Văn An", Họ gia tiên "Nguyễn", Địa chỉ "12 Lê Lợi, Hà Nội"', (await t.getByLabel('Tín chủ').inputValue()) === 'Nguyễn Văn An' && (await t.getByLabel('Họ gia tiên').inputValue()) === 'Nguyễn' && (await t.getByLabel('Địa chỉ').inputValue()) === '12 Lê Lợi, Hà Nội' && (await t.locator('.vk-khung').innerText()).includes('Thông tin gia đình khi khấn') && !(await luuTho(t)).vk);
    await t.getByLabel('Họ gia tiên').fill('Trần');
    k('E1 khách sửa Họ gia tiên → lưu trên máy (chỉ trường đã sửa), Tín chủ / Địa chỉ vẫn theo tài khoản (chưa lưu)', (await luuTho(t)).vk.ho === 'Trần' && (await luuTho(t)).vk.ten === null && (await luuTho(t)).vk.dc === null);
    await t.locator('.vk-hero').click(); await t.waitForURL('**/kehoach/vankhan/r');
    const dong = await t.locator('.vk-dong').innerText();
    k('E2 đầu bài: dòng gọn "Tín chủ: Nguyễn Văn An · Địa chỉ: 12 Lê Lợi, Hà Nội  Sửa ›"; bài khấn tô màu tên + địa chỉ + họ "Trần"', dong.includes('Tín chủ: Nguyễn Văn An · Địa chỉ: 12 Lê Lợi, Hà Nội') && dong.includes('Sửa ›') && (await t.locator('.vk-txt mark', { hasText: 'Nguyễn Văn An' }).count()) >= 1 && (await t.locator('.vk-txt mark', { hasText: '12 Lê Lợi' }).count()) >= 1 && (await t.locator('.vk-txt mark', { hasText: 'Trần' }).count()) >= 1);
    k('E4 dưới Lễ vật một dòng gợi ý "Có thể dâng thêm hoa quả, trà tươi", KHÔNG nút đặt hàng', (await t.locator('.vk-goiy').innerText()) === 'Có thể dâng thêm hoa quả, trà tươi' && (await t.getByText(/Đặt hoa quả|Đặt hàng|Mua/).count()) === 0);
    await t.locator('.vk-txt mark[data-cho="dc"]').first().click(); await bang1(t).waitFor();
    k('E3 chạm chỗ tô màu Địa chỉ → mở đúng ô nhập Địa chỉ (con trỏ ở ô đó)', (await bang1(t).locator('input:focus').getAttribute('aria-label')) === 'Địa chỉ');
    await bang1(t).getByLabel('Địa chỉ').fill('5 Hàng Bài'); await bang1(t).locator('.bn-x').click();
    k('E3 sửa Địa chỉ trong bảng → dòng gọn và bài khấn đổi theo', (await t.locator('.vk-dong').innerText()).includes('Địa chỉ: 5 Hàng Bài') && (await t.locator('.vk-txt mark', { hasText: '5 Hàng Bài' }).count()) >= 1);
    await t.locator('.vk-dong em').click(); await bang1(t).waitFor();
    k('E2 bấm "Sửa ›" → bảng sửa Tín chủ / Họ / Địa chỉ', (await bang1(t).locator('input').count()) === 3);
    await bang1(t).locator('.bn-x').click();
    k('F4 không lỗi JS', loi.length === 0, loi.join(' | '));
  });

  await ca('vankhanTrong', {}, async (t) => {
    await mo(t, '/kehoach/vankhan/r'); await t.locator('.vk-txt').waitFor();
    const txt = await t.locator('.vk-txt').innerText(), dong = await t.locator('.vk-dong').innerText();
    k('E3 tài khoản chưa có địa chỉ: chỗ trống hiện "(chạm để điền Địa chỉ)" thay vì để trắng; dòng nhắc nhẹ "Bạn chưa điền Địa chỉ"', txt.includes('(chạm để điền Địa chỉ)') && dong.includes('Địa chỉ: …') && (await t.locator('.tl-note', { hasText: 'Bạn chưa điền Địa chỉ' }).count()) === 1);
    await t.locator('.vk-txt mark.trong').first().click(); await bang1(t).waitFor();
    await bang1(t).getByLabel('Địa chỉ').fill('9 Nguyễn Du'); await bang1(t).locator('.bn-x').click();
    k('E3 điền xong → bài khấn có địa chỉ, hết nhắc; lưu trên máy (không gửi đi)', (await t.locator('.vk-txt').innerText()).includes('9 Nguyễn Du') && (await t.locator('.tl-note', { hasText: 'Bạn chưa điền' }).count()) === 0 && (await luuTho(t)).vk.dc === '9 Nguyễn Du');
  });

  await ca('sapToi', { luu: kho({ xe: [{ id: 'a', ten: 'Wave', bien: '', loai: 'xm', km: 12200, nhac: true, lich: [{ ten: 'Thay dầu máy', km: 1500, thang: 2 }], giayTo: [{ ten: 'Đăng kiểm', ngay: ngay(5) }], nhatKy: [{ ngay: ngay(-20), km: 10800, viec: ['Thay dầu máy'], phi: 0, noi: '' }] }] }) }, async (t) => {
    await mo(t, '/kehoach/saptoi'); await thanTrong(t).waitFor();
    const noi = await thanTrong(t).innerText();
    k('D2 Sắp tới có hạng mục xe sắp tới hạn + giấy tờ ≤ 30 ngày (nhãn Xe), bấm mở Xe cộ', noi.includes('Thay dầu máy · Wave') && noi.includes('Đăng kiểm · Wave') && noi.includes('còn 100 km') && (await t.locator('.up-tag', { hasText: /^Xe$/ }).count()) === 2);
    await t.locator('.tl-row', { hasText: 'Đăng kiểm · Wave' }).click(); await t.waitForURL('**/kehoach/xeco');
    k('D2 bấm dòng xe → /kehoach/xeco', duong(t) === '/kehoach/xeco');
  });

  await ca('zalo', { ua: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36 Zalo/22.11.1' }, async (t, loi) => {
    await mo(t, '/kehoach/vankhan/r'); await t.locator('.vk-txt').waitFor();
    k('F5 trình duyệt Zalo: mở thẳng /kehoach/vankhan/r → đúng bài Mùng 1 & Rằm, dòng gọn Tín chủ, bài khấn', duong(t) === '/kehoach/vankhan/r' && (await t.locator('h1').first().innerText()).includes('Mùng 1') && (await t.locator('.vk-dong').count()) === 1);
    await t.locator('.back-btn').click(); await t.waitForURL('**/kehoach/vankhan');
    k('F5 nút quay lại (mở thẳng, không lịch sử) → về /kehoach/vankhan, không thoát app', duong(t) === '/kehoach/vankhan' && (await t.locator('.vk-khung').count()) === 1);
    k('F4 không lỗi JS', loi.length === 0, loi.join(' | '));
  });

  for (const rong of [360, 430]) {
    await ca('rong' + rong, { rong, luu: kho({ xe: [{ id: 'a', ten: 'Honda Lead rất dài tên để thử tràn', bien: '29X1-123.45', loai: 'xm', km: 123456, nhac: true, lich: [{ ten: 'Thay dầu máy', km: 1500, thang: 2 }], giayTo: [{ ten: 'Bảo hiểm bắt buộc', ngay: ngay(10) }], nhatKy: [] }], thuoc: [{ id: 't', ten: 'Thuốc sắc Hoàng Kỳ Đảng Sâm', lieu: '1 chén lớn', ghi: 'sau ăn 30 phút', gio: ['07:30', '12:00', '20:30'], den: '', bd: ngay(-3), nhac: true }], chuKy: { bat: true, bd: ngay(-5), dai: 28, hanh: 5, ls: [28], nhac: true } }) }, async (t) => {
      for (const p of ['/kehoach', '/kehoach/xeco', '/kehoach/uongthuoc', '/kehoach/chuky', '/kehoach/vankhan', '/kehoach/vankhan/r']) {
        await mo(t, p); await t.waitForTimeout(120);
        k(`F3 ${rong}px ${p}: trang không cuộn ngang`, (await tran(t)) <= 1, String(await tran(t)));
      }
      await mo(t, '/kehoach/xeco'); await t.locator('.veh').first().click(); await t.waitForTimeout(120);
      k(`F3 ${rong}px một xe: không cuộn ngang`, (await tran(t)) <= 1, String(await tran(t)));
    });
  }
  await trinh.close();
}
