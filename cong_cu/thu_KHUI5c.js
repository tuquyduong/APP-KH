#!/usr/bin/env node
// THỬ KH-UI-5c — Kế hoạch: bấm ngày → bảng việc của ngày, việc lặp, hẹn giờ nhắc, quá hạn, hoàn tác, gõ nhanh có ngày, tìm việc.
// Phần 1 (luôn chạy, kể cả KHONG_TRINH_DUYET=1): hàm thuần src/kehoachLap.js + src/kehoach.js (lặp, nhắc, quá hạn, gõ ngày, tìm, đọc bản lưu cũ / hỏng) + nguồn.
// Phần 2: App thật trong Chromium (Playwright có sẵn ở máy; không có / KHONG_TRINH_DUYET=1 → in "BỎ QUA", không tính ca): bundle esbuild (có CSS), POS giả
// bằng page.route, đồng hồ giả (page.clock) để "hôm nay" = 8.11.2026 09:00 giờ VN. Không mạng ngoài. Chạy: node cong_cu/thu_KHUI5c.js → dòng cuối "n đạt · m hỏng".
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
const doc = (f) => fs.readFileSync(path.join(GOC, f), 'utf8');
const bang = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const khoGia = (d = {}, chan = false) => ({ d, getItem: (x) => { if (chan) throw new Error('SecurityError'); return x in d ? d[x] : null; }, setItem: (x, v) => { if (chan) throw new Error('SecurityError'); d[x] = String(v); }, removeItem: (x) => { delete d[x]; } });

(async () => {
  const LP = await nap('src/kehoachLap.js'), KH = await nap('src/kehoach.js'), { LUNAR } = await nap('src/lich.js');
  const N = (d, m, y) => ({ d, m, y }), J = (d, m, y) => LP.jd(N(d, m, y)), S = (j) => LP.chuoiJd(j);
  const lan = (v, tu, den) => LP.cacLan(v, J(...tu), J(...den)).map(S);
  const viec = (o) => ({ id: 'x', ngay: '2026-01-31', gio: '', tieu: 'T', nhac: null, xong: false, ...o });
  const HN = N(8, 11, 2026);

  console.log('C1 — Lặp lại (tính thẳng từ ngày bắt đầu, không trôi)');
  const thang = viec({ lap: { k: 'thang', n: 1, den: '' } });
  k('C1 hằng tháng từ 31/1/2026: 28/2 (năm thường), 31/3, 30/4, 31/5 — không trôi', bang(lan(thang, [1, 1, 2026], [31, 5, 2026]), ['2026-01-31', '2026-02-28', '2026-03-31', '2026-04-30', '2026-05-31']));
  k('C1 hằng tháng từ 31/1/2028: 29/2/2028 (năm nhuận)', bang(lan(viec({ ngay: '2028-01-31', lap: { k: 'thang', n: 1, den: '' } }), [1, 2, 2028], [1, 3, 2028]), ['2028-02-29']));
  k('C1 mỗi 2 tuần từ 1/11/2026: 1/11, 15/11, 29/11', bang(lan(viec({ ngay: '2026-11-01', lap: { k: 'tuan', n: 2, den: '' } }), [1, 11, 2026], [30, 11, 2026]), ['2026-11-01', '2026-11-15', '2026-11-29']));
  k('C1 mỗi 3 ngày, tìm từ giữa chuỗi: mốc đúng bội số của 3', bang(lan(viec({ ngay: '2026-11-01', lap: { k: 'ngay', n: 3, den: '' } }), [10, 11, 2026], [16, 11, 2026]), ['2026-11-10', '2026-11-13', '2026-11-16']));
  k('C1 hằng năm 29/2/2028: 28/2/2029 (năm thường), 29/2/2032 (nhuận)', bang(lan(viec({ ngay: '2028-02-29', lap: { k: 'nam', n: 1, den: '' } }), [1, 1, 2029], [31, 12, 2029]), ['2029-02-28']) && lan(viec({ ngay: '2028-02-29', lap: { k: 'nam', n: 1, den: '' } }), [1, 1, 2032], [31, 12, 2032])[0] === '2032-02-29');
  const am = viec({ ngay: '2025-01-29', lap: { k: 'amlich', n: 1, den: '' } }), lanAm = LP.cacLan(am, J(29, 1, 2025), J(16, 2, 2026));
  const dauAm = lanAm.map((j) => { const x = LP.tuJd(j); return LUNAR.solar2lunar(x.d, x.m, x.y); });
  k('C1 Mùng 1 & Rằm âm lịch qua năm có tháng nhuận (2025: nhuận 6): 13 tháng × 2 = 26 lần, mọi lần là mùng 1 hoặc 15, có cả hai ngày của tháng nhuận', lanAm.length === 26 && dauAm.every((a) => a.d === 1 || a.d === 15) && dauAm.filter((a) => a.leap).length === 2);
  k('C1 "đến ngày": hằng ngày từ 1/11 đến 3/11 chỉ 3 lần', bang(lan(viec({ ngay: '2026-11-01', lap: { k: 'ngay', n: 1, den: '2026-11-03' } }), [1, 11, 2026], [30, 11, 2026]), ['2026-11-01', '2026-11-02', '2026-11-03']));
  k('C1 không lặp / "sau khi xong": đúng một lần ở ngày của việc', bang(lan(viec({ ngay: '2026-11-08' }), [1, 11, 2026], [30, 11, 2026]), ['2026-11-08']) && bang(lan(viec({ ngay: '2026-11-08', lap: { k: 'sau', n: 30, den: '' } }), [1, 11, 2026], [30, 12, 2026]), ['2026-11-08']));

  console.log('C1 — Tick một lần, "sau khi xong", mốc đã rà');
  const tuan = viec({ id: 'w', ngay: '2026-10-01', gio: '09:00', lap: { k: 'tuan', n: 1, den: '' }, lanXong: [] });
  const bw = { viec: [tuan], leNhac: {}, anBanner: '' };
  const t1 = LP.tickLan(bw, 'w', '2026-10-08', N(29, 10, 2026));
  k('C1 tick một việc lặp CHỈ đánh dấu lần đó (8/10); 1/10, 15/10, 22/10 vẫn chưa xong', bang(t1.viec[0].lanXong, ['2026-10-08']) && !LP.daXongLan(t1.viec[0], J(1, 10, 2026)) && LP.daXongLan(t1.viec[0], J(8, 10, 2026)) && !LP.daXongLan(t1.viec[0], J(15, 10, 2026)));
  k('C1 tick lần hai cùng ngày thì bỏ đánh dấu; viecNgay trả đúng bản của ngày (xong theo lần)', LP.tickLan(t1, 'w', '2026-10-08', HN).viec[0].lanXong.length === 0 && LP.viecNgay(t1, '2026-10-08')[0].xong === true && LP.viecNgay(t1, '2026-10-15')[0].xong === false && LP.viecNgay(t1, '2026-10-09').length === 0);
  const sau = viec({ id: 's', ngay: '2026-11-05', lap: { k: 'sau', n: 30, den: '' } }), bs = { viec: [sau], leNhac: {}, anBanner: '' };
  const ts = LP.tickLan(bs, 's', '2026-11-05', HN);
  k('C1 "sau khi xong 30 ngày": bấm xong ngày 8/11 → dời sang 8/12 (N ngày sau NGÀY BẤM, không phải sau ngày hẹn); bản cũ không bị sửa (hoàn tác = giữ bản cũ)', ts.viec[0].ngay === '2026-12-08' && !ts.viec[0].xong && bs.viec[0].ngay === '2026-11-05');
  let day = { viec: [viec({ id: 'd', ngay: '2026-09-01', lap: { k: 'ngay', n: 1, den: '' }, lanXong: [] })], leNhac: {}, anBanner: '' };
  for (let i = 1; i <= 30; i++) if (i !== 25) day = LP.tickLan(day, 'd', S(J(1, 9, 2026) + i - 1), N(1, 10, 2026));
  const vd = day.viec[0];
  const qd = LP.quaHan(day, N(1, 10, 2026));
  k('C1 giữ tối đa 24 lần đã xong (30 ngày tick, bỏ sót 25/9); 5 lần cũ nhất rời danh sách nhưng KHÔNG hiện lại là "lỡ" (mốc đã rà nhích tới 6/9); chỉ 25/9 còn lỡ', vd.lanXong.length === 24 && vd.moc === '2026-09-06' && qd.length === 1 && bang(qd[0].lan.map(S), ['2026-09-25']));
  k('C1 "Đánh dấu cả N lần" (raSoatDen): mọi lần trước hôm nay coi như xong', LP.quaHan(LP.raSoatDen(day, 'd', N(1, 10, 2026)), N(1, 10, 2026)).length === 0);

  const bm = LP.raSoatDen(day, 'd', N(1, 10, 2026));
  k('C1 tick một lần dưới mốc đã rà (5/9) không đảo được (không báo sai "đã bỏ đánh dấu")', bang(LP.tickLan(bm, 'd', '2026-09-05', N(1, 10, 2026)), bm) && LP.daXongLan(LP.tickLan(bm, 'd', '2026-09-05', N(1, 10, 2026)).viec[0], J(5, 9, 2026)));
  console.log('D1 — Quá hạn');
  const qb = { viec: [viec({ id: 'a', ngay: '2026-11-07', gio: '10:00', tieu: 'Nộp hồ sơ' }), viec({ id: 'b', ngay: '2026-11-08', tieu: 'Hôm nay' }), viec({ id: 'c', ngay: '2026-11-01', xong: true }),
    viec({ id: 'w', ngay: '2026-10-11', lap: { k: 'tuan', n: 1, den: '' }, lanXong: ['2026-10-18'] })], leNhac: {}, anBanner: '' };
  const q = LP.quaHan(qb, HN);
  k('D1 chỉ việc chưa xong mà hạn đã qua; việc hôm nay và việc đã xong không tính', q.length === 2 && q.some((x) => x.v.id === 'a' && x.soLan === 1) && !q.some((x) => ['b', 'c'].includes(x.v.id)));
  k('D2 việc lặp lỡ nhiều lần: 11/10, 25/10, 1/11 (18/10 đã xong) → lỡ 3 lần, từ 11/10 đến 1/11', (() => { const w = q.find((x) => x.v.id === 'w'); return w && w.soLan === 3 && S(w.lan[0]) === '2026-10-11' && S(w.lan[2]) === '2026-11-01'; })());
  const dh = LP.doiHetSangNay(qb, HN);
  k('D2 "Dời cả N việc sang hôm nay": chỉ việc thường (không lặp), việc lặp giữ nguyên', dh.so === 1 && dh.bang.viec[0].ngay === '2026-11-08' && dh.bang.viec[3].ngay === '2026-10-11');
  k('D3 hạn bằng chữ: hôm nay · quá hạn dd/mm · hạn dd/mm · chưa có hạn', LP.chuHan('2026-11-08', false, HN).chu === 'hạn hôm nay' && bang(LP.chuHan('2026-11-07', false, HN), { chu: 'quá hạn 7/11', qua: true }) && LP.chuHan('2026-11-20', false, HN).chu === 'hạn 20/11' && LP.chuHan('2026-11-07', true, HN).qua === false && LP.chuHan('', false, HN).chu === 'chưa có hạn');
  k('D1 việc thường quá hạn hơn 400 ngày vẫn vào danh sách quá hạn (khớp chuông trên lịch); việc lặp mới bị giới hạn lùi', LP.quaHan({ viec: [viec({ id: 'o', ngay: '2024-01-01' })], leNhac: {}, anBanner: '' }, HN).length === 1);
  const dd = LP.danhDauNgay(qb, J(1, 11, 2026), J(30, 11, 2026), HN);
  k('A5 chuông: ngày có việc chưa xong = "viec", ngày có việc quá hạn = "qua" (ưu tiên); việc đã xong không chấm', dd.get(J(7, 11, 2026)) === 'qua' && dd.get(J(8, 11, 2026)) === 'viec' && dd.get(J(1, 11, 2026)) === 'qua' && !dd.has(J(9, 11, 2026)));

  console.log('C2 — Hẹn giờ nhắc');
  const R = (kieu, gio) => LP.nhacRaPhut(kieu, gio);
  k('C2 nút nhanh có giờ 09:00: Đúng giờ 540 · trước 15 phút 525 · trước 1 giờ 480 · trước 1 ngày −900', R({ k: 'truoc', p: 0 }, '09:00') === 540 && R({ k: 'truoc', p: 15 }, '09:00') === 525 && R({ k: 'truoc', p: 60 }, '09:00') === 480 && R({ k: 'truoc', p: 1440 }, '09:00') === -900);
  k('C2 nút nhanh không giờ: Sáng cùng ngày 08:00 = 480 · Tối hôm trước 20:00 = −240', bang(LP.NHAC_CA_NGAY.map((x) => R(x, '')), [480, -240]));
  k('C2 "Chọn ngày giờ khác": 3 ngày trước lúc 08:00 = −3840; 30 ngày trước 00:00 = −43200 (giới hạn); 31 ngày → không nhận (null)', R({ k: 'luc', ngay: 3, g: '08:00' }, '') === -3840 && R({ k: 'luc', ngay: 30, g: '00:00' }, '') === -43200 && R({ k: 'luc', ngay: 31, g: '00:00' }, '') === null);
  k('C2 thiếu giờ sự kiện mà nhắc kiểu "trước N phút" → null (không lưu số bịa)', R({ k: 'truoc', p: 15 }, '') === null);
  k('C2 đổi giờ sự kiện thì "Trước 15 phút" đi theo: 09:00 → 525, 10:30 → 615', R({ k: 'truoc', p: 15 }, '09:00') === 525 && R({ k: 'truoc', p: 15 }, '10:30') === 615);
  k('C2 đọc lại số phút đã lưu thành dạng tương đối để sửa: 525 @09:00 = trước 15 phút; −240 = hôm trước 20:00; −3840 = 3 ngày trước 08:00', bang(LP.nhacTuPhut(525, '09:00'), { k: 'truoc', p: 15 }) && bang(LP.nhacTuPhut(-240, ''), { k: 'luc', ngay: 1, g: '20:00' }) && bang(LP.nhacTuPhut(-3840, ''), { k: 'luc', ngay: 3, g: '08:00' }) && LP.nhacTuPhut(null, '09:00') === null);
  k('C2 chữ hiện: Đúng giờ · Trước 15 phút · Trước 1 giờ · Trước 1 ngày · Hôm trước lúc 20:00 · Trước 3 ngày lúc 08:00', [LP.chuNhac({ k: 'truoc', p: 0 }), LP.chuNhac({ k: 'truoc', p: 15 }), LP.chuNhac({ k: 'truoc', p: 60 }), LP.chuNhac({ k: 'truoc', p: 1440 }), LP.chuNhac({ k: 'luc', ngay: 1, g: '20:00' }), LP.chuNhac({ k: 'luc', ngay: 3, g: '08:00' })].join('|') === 'Đúng giờ|Trước 15 phút|Trước 1 giờ|Trước 1 ngày|Hôm trước lúc 20:00|Trước 3 ngày lúc 08:00');
  const nb = { viec: [viec({ id: 'e', ngay: '2026-11-10', gio: '', tieu: 'Đóng tiền điện', nhac: -2 * 1440 + 8 * 60 }), viec({ id: 'k', ngay: '2026-11-08', gio: '09:00', tieu: 'Hẹn bác sĩ', nhac: 525 }),
    viec({ id: 'l', ngay: '2026-11-09', gio: '', tieu: 'Việc lặp', nhac: 480, lap: { k: 'ngay', n: 1, den: '' }, lanXong: ['2026-11-09'] })], leNhac: {}, anBanner: '' };
  const co = (gio) => LP.nhacDangCo(nb, gio, N(...gio.slice(0, 10).split('-').reverse().map(Number))).map((x) => x.chu);
  k('C2 thanh nhắc: 8/11 08:50 → "Còn 2 ngày: Đóng tiền điện (10/11)" (đã tới mốc 8/11 08:00); "15 phút nữa: Hẹn bác sĩ (09:00)" lúc 08:46 nhưng chưa tới mốc lúc 08:44', co('2026-11-08 08:50:00').includes('Còn 2 ngày: Đóng tiền điện (10/11)') && co('2026-11-08 08:50:00').some((c) => c.startsWith('10 phút nữa: Hẹn bác sĩ (09:00)')) && !co('2026-11-08 08:44:00').some((c) => c.includes('Hẹn bác sĩ')));
  k('C2 thanh nhắc: qua giờ (sau 60 phút) hoặc đã xong (lần 9/11 của việc lặp) thì không hiện; việc không nhắc không hiện', !co('2026-11-08 10:30:00').some((c) => c.includes('Hẹn bác sĩ')) && !co('2026-11-09 09:00:00').some((c) => c.includes('Việc lặp')) && co('2026-11-10 09:00:00').some((c) => c.includes('Việc lặp')));
  const moc = LP.mocNhacTrong(nb, LP.phutTuGio('2026-11-08 08:44:00'), LP.phutTuGio('2026-11-08 09:06:00')).map((x) => x.v.id);
  k('C2 dải khi App mở: mốc rơi trong (lần hỏi trước, nay] — 08:44→09:06 có "Hẹn bác sĩ" (09:05) và "Đóng tiền điện" (08:00 → không, đã qua); khoảng rỗng không có mốc', moc.includes('k') && !moc.includes('e') && LP.mocNhacTrong(nb, LP.phutTuGio('2026-11-08 09:06:00'), LP.phutTuGio('2026-11-08 09:07:00')).length === 0);

  console.log('B1 — Gõ nhanh có ngày');
  const G = (t, h = HN) => LP.tachNgayCuoi(t, h);
  k('B1 "Mua quà 20/11" → tên "Mua quà", 20/11/2026', bang(G('Mua quà 20/11'), { tieu: 'Mua quà', ngay: '2026-11-20' }));
  k('B1 "Đóng tiền điện 5/12/2026" có năm; "Họp 5/12/26" năm hai chữ số', bang(G('Đóng tiền điện 5/12/2026'), { tieu: 'Đóng tiền điện', ngay: '2026-12-05' }) && G('Họp 5/12/26').ngay === '2026-12-05');
  k('B1 khoảng ngày "Đi khám 3-5/12" → hạn = ngày cuối 5/12', bang(G('Đi khám 3-5/12'), { tieu: 'Đi khám', ngay: '2026-12-05' }));
  k('B1 không ghi năm: đã qua quá 60 ngày → năm sau (1/1 → 2027); chưa quá 60 ngày (20/10) → giữ năm nay', G('Họp 1/1').ngay === '2027-01-01' && G('Nộp 20/10').ngay === '2026-10-20');
  k('B1 ngày sai lịch (31/2) hoặc không ở cuối → giữ nguyên chữ, không đặt ngày', bang(G('Nộp 31/2'), { tieu: 'Nộp 31/2', ngay: '' }) && bang(G('Mua 2/3 cân gạo'), { tieu: 'Mua 2/3 cân gạo', ngay: '' }) && bang(G('20/11'), { tieu: '20/11', ngay: '' }) && G('Khám 5-3/12').ngay === '');
  k('B1 29/2 chỉ nhận ở năm nhuận (tính từ hôm nay 2026 → 29/2/2026 không có)', G('Đám cưới 29/2').ngay === '' && G('Đám cưới 29/2/2028').ngay === '2028-02-29');

  console.log('E2 — Tìm việc');
  const tb = { viec: [viec({ id: '1', ngay: '2026-11-09', tieu: 'Cà phê với bạn' }), viec({ id: '2', ngay: '2026-11-08', tieu: 'Đi khám răng' }), viec({ id: '3', ngay: '2026-11-07', tieu: 'Đón con' })], leNhac: {}, anBanner: '' };
  k('E2 tìm bỏ dấu: "ca phe" ra "Cà phê…", "di kham" ra "Đi khám răng", "DON" ra "Đón con"; rỗng → không có; sắp theo ngày', bang(LP.timViec(tb, 'ca phe').map((v) => v.id), ['1']) && bang(LP.timViec(tb, 'di kham').map((v) => v.id), ['2']) && LP.timViec(tb, 'DON').length === 1 && LP.timViec(tb, '  ').length === 0 && LP.timViec(tb, 'o').map((v) => v.id).join() === '3,1');

  console.log('G1 — Lưu trên máy (kh_kehoach)');
  const cu = khoGia({ kh_kehoach: JSON.stringify({ v: 1, viec: [{ id: 'a', ngay: '2026-11-08', gio: '09:00', tieu: 'Bản 5b nhắc', nhac: true, xong: false }, { id: 'b', ngay: '2026-11-08', gio: '09:00', tieu: 'Bản 5b không nhắc', nhac: false, xong: true }], leNhac: {}, anBanner: '' }) });
  const dc = KH.docKeHoach(cu);
  k('G1 đọc bản lưu của KH-UI-5b: nhac true → đúng giờ của việc (540), false → null; không lặp, không trường lạ', dc.viec.length === 2 && dc.viec[0].nhac === 540 && dc.viec[1].nhac === null && !('lap' in dc.viec[0]) && !('lanXong' in dc.viec[0]));
  const hongKho = khoGia({ kh_kehoach: JSON.stringify({ v: 1, viec: [
    { id: 'a', ngay: '2026-11-08', gio: '', tieu: 'Cả ngày hợp lệ', nhac: null, xong: false, lap: { k: 'thang', n: 1, den: '' }, lanXong: ['2026-11-08', 'hỏng', 5], moc: 'sai' },
    { id: 'b', ngay: '2026-11-08', gio: '', tieu: 'Lặp hỏng', nhac: null, xong: false, lap: { k: 'bịa', n: 1 } },
    { id: 'c', ngay: '2026-11-08', gio: '', tieu: 'Số lần sai', nhac: null, xong: false, lap: { k: 'ngay', n: 0 } },
    { id: 'd', ngay: '2026-11-08', gio: '', tieu: 'Nhắc quá xa', nhac: -99999, xong: false },
    { id: 'e', ngay: '2026-11-08', gio: '', tieu: 'Đến ngày sai', nhac: null, xong: false, lap: { k: 'tuan', n: 2, den: '2026-02-31' } }], leNhac: {}, anBanner: '' }) });
  const dh2 = KH.docKeHoach(hongKho);
  k('G1 dữ liệu hỏng từng phần: bỏ việc nhắc quá xa; lặp hỏng / số lần sai → việc coi như không lặp; lần xong hỏng và mốc sai bị bỏ; "đến ngày" sai → bỏ phần đó', dh2.viec.length === 4 && !dh2.viec.some((v) => v.id === 'd') && dh2.viec[0].lap.k === 'thang' && bang(dh2.viec[0].lanXong, ['2026-11-08']) && !('moc' in dh2.viec[0]) && !('lap' in dh2.viec[1]) && !('lap' in dh2.viec[2]) && dh2.viec[3].lap.den === '');
  const k1 = khoGia(), b0 = KH.themViec(KH.keHoachTrong(), { ngay: '2026-11-08', gio: '09:00', tieu: 'Có lặp', nhac: 525, lap: { k: 'thang', n: 1, den: '2026-12-31' } });
  k('G1 ghi rồi đọc lại đủ lặp + nhắc; chỉ khoá kh_kehoach; kho bị chặn → ghi trả false (màn không được báo "đã lưu")', KH.ghiKeHoach(b0, k1) === true && bang(KH.docKeHoach(k1).viec[0].lap, { k: 'thang', n: 1, den: '2026-12-31' }) && KH.docKeHoach(k1).viec[0].nhac === 525 && Object.keys(k1.d).join() === 'kh_kehoach' && KH.ghiKeHoach(b0, khoGia({}, true)) === false);
  const sv = KH.suaViec(b0, b0.viec[0].id, { tieu: 'Đổi tên', gio: '', nhac: null, lap: null });
  k('A3 sửa việc: đổi tên / giờ / lặp / nhắc, giữ nguyên ngày bắt đầu và id; tên trống → không sửa', sv.viec[0].tieu === 'Đổi tên' && sv.viec[0].gio === '' && !('lap' in sv.viec[0]) && sv.viec[0].ngay === '2026-11-08' && sv.viec[0].id === b0.viec[0].id && KH.suaViec(b0, b0.viec[0].id, { tieu: ' ' }) === null);
  k('A4 thêm chỉ với tên → việc cả ngày: gio rỗng, không nhắc, không lặp', (() => { const v = KH.themViec(KH.keHoachTrong(), { ngay: '2026-11-08', tieu: 'Gọi điện' }).viec[0]; return v.gio === '' && v.nhac === null && !('lap' in v) && v.xong === false; })());
  const chuAm = (d, m, y) => KH.amLichChu(N(d, m, y)), ngayAm = (ld) => { for (let d = 1; d <= 30; d++) if (LUNAR.solar2lunar(d, 11, 2026).d === ld) return chuAm(d, 11, 2026); return ''; };
  k('A1 dòng âm lịch của bảng ngày: ngày rằm = "Rằm tháng N âm", mùng 1 = "Mùng 1 tháng N âm", ngày 12 = "Ngày 12 tháng N âm"; tháng nhuận ghi "nhuận" (6 nhuận 2025); tháng 29 ngày ghi "tháng thiếu"', /^Rằm tháng \d+ âm/.test(ngayAm(15)) && /^Mùng 1 tháng \d+ âm/.test(ngayAm(1)) && /^Ngày 12 tháng/.test(ngayAm(12)) && /nhuận/.test(chuAm(1, 8, 2025)) && !/nhuận/.test(chuAm(1, 11, 2026)));

  console.log('E1 — Nguồn: nối vào App, không gửi dữ liệu đi, giờ VN');
  const app = doc('src/App.jsx'), tc = doc('src/pages/TrangChu.jsx'), moi = ['src/kehoachLap.js', 'src/kehoach.js', 'src/pages/KeHoach.jsx', 'src/components/BangNgay.jsx', 'src/components/BangQuaHan.jsx', 'src/components/BangNoi.jsx', 'src/components/BanhXoay.jsx', 'src/components/DaiNhacViec.jsx', 'src/components/ThongBaoHoanTac.jsx'].map(doc).join('\n');
  k('E1 App gắn đúng MỘT dải nhắc việc cạnh BaoDonXong, chỉ khi đã đăng nhập, truyền san=daBiet', (app.match(/<DaiNhacViec /g) || []).length === 1 && /dangNhap && <DaiNhacViec san=\{daBiet\}/.test(app) && app.indexOf('<DaiNhacViec') > app.indexOf('<BaoDonXong'));
  k('E1 không gọi mạng, không gửi việc đi: không import api.js, fetch, XMLHttpRequest, sendBeacon, Notification', !/api\.js|fetch\(|XMLHttpRequest|sendBeacon|new Notification|serviceWorker/.test(moi));
  k('E1 giờ VN: không new Date(chuỗi giờ POS); bảng quá hạn / dải nhắc / thanh nhắc lấy giờ từ bayGio()', !/new Date\(\s*(gio|chuoi|bayGio|String|ngay)/.test(moi) && /bayGio\(\)/.test(doc('src/components/DaiNhacViec.jsx')) && /gioCho \|\| bayGio\(\)/.test(doc('src/pages/KeHoach.jsx')));
  k('E1 chỉ kehoach.js chạm localStorage; các tệp mới không lưu khoá mới', !/localStorage|sessionStorage/.test(moi.replace(/const kho = \(\) => localStorage;/, '')));
  k('K3 không có chữ "nợ", không số mẫu của demo', !/\bnợ\b/i.test(moi) && !/1\.250|1900|support@/.test(moi));
  k('D1 Trang chủ chỉ thêm số đỏ quá hạn trên ô Kế hoạch (+ ✕ banner, F1): dùng quaHan() chỉ khi đã đăng nhập và biết khách', /dangNhap && daBiet \? quaHan\(bang, homNay\)\.length : 0/.test(tc) && /quaHan=\{qua\}/.test(tc));
  k('F1 ✕ ẩn banner đặt ở banner LỚN Trang chủ (demo todayHide): gọi anBannerHomNay + báo "Ẩn ở Lịch và tiện ích đến hết hôm nay"; bản nhỏ không có ✕', /khiAn=\{anBanner\}/.test(tc) && /anBannerHomNay\(keHoach/.test(tc) && /khiAn && !mini/.test(doc('src/components/BannerHomNay.jsx')) && !/khiAn/.test(doc('src/components/BannerNho.jsx').replace(/\/\*[^]*?\*\//, '')));
  k('F2 ô "hôm nay" của lưới giữ cỡ thường: ke_hoach.css không đặt chiều cao 150px cho .cd.today', !/\.cd\.today[^}]*height\s*:\s*150/.test(doc('src/giaoDien/ke_hoach.css') + doc('src/giaoDien/bang_ngay.css')));
  k('D1 ThemViec cũ đã gỡ (không code chết): không còn import', !fs.existsSync(path.join(GOC, 'src/components/ThemViec.jsx')) && !/ThemViec/.test(doc('src/pages/KeHoach.jsx')));

  console.log('Phần 2 — App thật trong Chromium');
  let pw = null;
  if (process.env.KHONG_TRINH_DUYET !== '1') { try { pw = require('playwright'); } catch { /* không có */ } } // CLAUDE.md §9
  if (!pw) console.log('  BỎ QUA: không có Playwright ở máy này (hoặc KHONG_TRINH_DUYET=1) — các ca trình duyệt CHƯA chạy');
  else await trinhDuyet(pw);

  console.log(`\n${dat} đạt · ${hong} hỏng`);
  process.exit(hong ? 1 : 0);
})().catch((e) => { console.error(e); console.log(`\n${dat} đạt · ${hong + 1} hỏng`); process.exit(1); });

async function trinhDuyet(pw) {
  const esbuild = require('esbuild');
  const kq = esbuild.buildSync({
    entryPoints: [path.join(GOC, 'src/main.jsx')], bundle: true, write: false, outdir: path.join(GOC, '.nhap_thu'), format: 'iife', jsx: 'automatic', logLevel: 'silent', external: ['/anh/*', '/fonts/*'],
    loader: { '.json': 'json', '.svg': 'dataurl', '.webp': 'dataurl', '.png': 'dataurl', '.woff2': 'dataurl' }, define: { 'process.env.NODE_ENV': '"production"', 'import.meta.env.VITE_POS_API': '""' },
  }).outputFiles;
  const goi = kq.find((f) => f.path.endsWith('.js')).text, css = (kq.find((f) => f.path.endsWith('.css')) || { text: '' }).text;
  const html = doc('index.html').replace(/<script type="module" src="\/src\/main.jsx"><\/script>/, '<script src="/bundle.js"></script>').replace(/<link[^>]*(googleapis|gstatic|preload)[^>]*>/g, '').replace('</head>', '<link rel="stylesheet" href="/bundle.css"></head>');
  const LM = await nap('src/luuMay.js');
  const SDT = '0901234567', GOC_URL = 'http://kh.test';
  const trinh = await pw.chromium.launch();
  const MOC_GIO = '2026-11-08T02:00:00Z'; // = 09:00 ngày 8.11.2026 giờ VN (máy + 7)

  async function ca(ten, { rong = 390, luu = {} } = {}, chay) {
    const ctx = await trinh.newContext({ viewport: { width: rong, height: 844 } });
    const t = await ctx.newPage(), loi = [], hop = [];
    t.on('pageerror', (e) => loi.push(e.message)); t.on('dialog', (d) => { hop.push(d.message()); d.dismiss(); });
    await t.addInitScript(({ luu }) => { if (!sessionStorage.getItem('da_gieo')) { sessionStorage.setItem('da_gieo', '1'); for (const [x, v] of Object.entries(luu)) localStorage.setItem(x, v); } }, { luu: { kh_token: 'tok-' + SDT, kh_chu: LM.dauVet(SDT), ...luu } });
    await t.clock.install({ time: new Date(MOC_GIO) });
    await t.route(`${GOC_URL}/**`, async (r) => {
      const p = new URL(r.request().url()).pathname, json = (status, o) => r.fulfill({ status, contentType: 'application/json', body: JSON.stringify(o) });
      if (p === '/bundle.js') return r.fulfill({ contentType: 'text/javascript', body: goi });
      if (p === '/bundle.css') return r.fulfill({ contentType: 'text/css', body: css });
      if (!p.startsWith('/api/kh')) return /\.[a-z0-9]+$/.test(p) ? r.fulfill({ status: 204, body: '' }) : r.fulfill({ contentType: 'text/html', body: html });
      if (p === '/api/kh/toi') return json(200, { khach: { sdt: SDT, ten: 'Khách thử', ngay_tao: '2026-01-01 00:00:00', qr: 'QR' } });
      return json(500, { error: 'chưa giả', code: 'LOI_GIA' });
    });
    try { await chay(t, loi, hop); } finally { await ctx.close(); }
  }
  const mo = async (t, duong) => { await t.goto(GOC_URL + duong); await t.waitForSelector('.phone'); };
  const luuTho = async (t) => JSON.parse(await t.evaluate(() => localStorage.getItem('kh_kehoach') || '{"viec":[]}')).viec;
  const bangNgay = (t) => t.locator('[role=dialog]');
  const nutPill = (t, chu) => t.locator('.bn-hang .filter-pill', { hasText: chu });

  // ----- 1. Bấm ngày → bảng; chỉ gõ tên + Thêm
  await ca('ngay', {}, async (t, loi, hop) => {
    await mo(t, '/kehoach'); await t.getByText('Tháng 11 · 2026').waitFor();
    const hom = await t.evaluate(() => { const h = document.querySelector('.cd.today'), x = document.querySelector('.cd:not(.today):not(.out)'); return { h: h.getBoundingClientRect().height, x: x.getBoundingClientRect().height, nen: getComputedStyle(h).backgroundImage, b: getComputedStyle(h.querySelector('b')).fontSize }; });
    k('F2 ô "hôm nay" trong lưới giữ cỡ thường (cao bằng ô khác, không nền gradient, số 14px) — không chép lỗi cao 150px của demo', Math.abs(hom.h - hom.x) <= 2 && hom.nen === 'none' && hom.b === '14px', JSON.stringify(hom));
    await t.locator('.cd:not(.out)', { has: t.locator('b', { hasText: /^20$/ }) }).first().click();
    await bangNgay(t).waitFor();
    const dau = await bangNgay(t).innerText();
    k('A1 chạm ngày 20 → bảng nổi từ dưới lên: "Thứ Sáu, 20/11", dòng âm lịch, ✕; mục "Trong ngày" có Nhà giáo Việt Nam; "Việc của tôi · 0 việc"', /Thứ Sáu, 20\/11/.test(dau) && /âm/.test(dau) && /Trong ngày/.test(dau) && /Nhà giáo Việt Nam/.test(dau) && /Việc của tôi · 0 việc/.test(dau) && (await t.getByRole('button', { name: 'Đóng' }).count()) === 1);
    await t.getByLabel('Tên việc').fill('Gọi điện'); await bangNgay(t).getByRole('button', { name: 'Thêm', exact: true }).click();
    await bangNgay(t).getByText('Việc của tôi · 1 việc').waitFor();
    const v = (await luuTho(t))[0];
    k('A4 chỉ gõ tên rồi Thêm là xong: việc cả ngày (gio rỗng), không nhắc, không lặp; ô trống lại; bảng giữ mở; báo "Đã thêm: Gọi điện"', v && v.tieu === 'Gọi điện' && v.ngay === '2026-11-20' && v.gio === '' && v.nhac === null && !v.lap && (await t.getByLabel('Tên việc').inputValue()) === '' && (await bangNgay(t).count()) === 1 && (await t.locator('.toast').innerText()).includes('Đã thêm: Gọi điện'));
    k('A4 ba nút một hàng, chữ mờ khi chưa chọn: "Giờ sự kiện" · "Hẹn giờ nhắc" · "Lặp lại"; không tiêu đề "GIỜ (24 giờ)" / "Không đặt giờ"', (await t.locator('.bn-hang .filter-pill').allInnerTexts()).join('|') === '🕘 Giờ sự kiện|🔔 Hẹn giờ nhắc|↻ Lặp lại' && !/GIỜ \(24 giờ\)|Không đặt giờ/.test(await bangNgay(t).innerText()));
    k('A5 thêm xong → ô ngày 20 có chuông "Việc của tôi" (biểu tượng sẵn của bộ demo), khác chấm ngày lễ', (await t.locator('.cd', { has: t.locator('b', { hasText: /^20$/ }) }).first().locator('.cd-chuong').count()) === 1 && (await t.locator('.cd.hol .dh').count()) >= 1);
    // Đóng: ✕, Esc, nền mờ, vuốt xuống
    await t.getByRole('button', { name: 'Đóng' }).click();
    k('A1 đóng bằng ✕', (await bangNgay(t).count()) === 0);
    const cell = () => t.locator('.cd:not(.out)', { has: t.locator('b', { hasText: /^20$/ }) }).first();
    await cell().click(); await bangNgay(t).waitFor(); await t.keyboard.press('Escape');
    k('A1 đóng bằng phím Esc', (await bangNgay(t).count()) === 0);
    await cell().click(); await bangNgay(t).waitFor(); await t.locator('.bang-noi').click({ position: { x: 5, y: 5 } });
    k('A1 đóng bằng chạm nền mờ', (await bangNgay(t).count()) === 0);
    await cell().click(); await bangNgay(t).waitFor();
    const keo = await t.locator('.bn-keo').boundingBox();
    await t.mouse.move(keo.x + keo.width / 2, keo.y + 2); await t.mouse.down(); await t.mouse.move(keo.x + keo.width / 2, keo.y + 160, { steps: 8 }); await t.mouse.up();
    k('A1 đóng bằng vuốt xuống (kéo thanh đầu > 80px)', (await bangNgay(t).count()) === 0);
    await cell().click(); await bangNgay(t).waitFor(); await t.mouse.move(keo.x + keo.width / 2, keo.y + 2); await t.mouse.down(); await t.mouse.move(keo.x + keo.width / 2, keo.y + 30, { steps: 4 }); await t.mouse.up();
    k('A1 kéo ngắn (< 80px) thì bảng không đóng', (await bangNgay(t).count()) === 1);
    k('E1 trang không lỗi JS, không hộp thoại của trình duyệt', loi.length === 0 && hop.length === 0, loi.join(' | '));
  });

  // ----- 2. Giờ sự kiện + Hẹn giờ nhắc (bánh xoay), một khung một lúc
  await ca('gio', {}, async (t) => {
    await mo(t, '/kehoach'); await t.getByText('Tháng 11 · 2026').waitFor();
    await t.locator('.cd:not(.out)', { has: t.locator('b', { hasText: /^20$/ }) }).first().click(); await bangNgay(t).waitFor();
    await t.getByLabel('Tên việc').fill('Mua hoa');
    await nutPill(t, 'Giờ sự kiện').click();
    const gio = bangNgay(t).getByRole('spinbutton', { name: 'Giờ', exact: true });
    await gio.waitFor();
    k('A4 mở khung "Giờ sự kiện": bánh xoay 24 giờ (giờ + phút), mặc định 08:00; nút đổi chữ thành "🕘 08:00"; nhắc tự đặt "Đúng giờ"', (await gio.getAttribute('aria-valuetext')) === '08' && (await nutPill(t, '08:00').count()) === 1 && (await nutPill(t, 'Đúng giờ').count()) === 1);
    await gio.focus(); await t.keyboard.press('ArrowDown');
    k('A4 phím ↓ trên bánh xoay giờ: 08 → 09, nút thành "🕘 09:00" và nhắc đúng giờ đi theo', (await gio.getAttribute('aria-valuetext')) === '09' && (await nutPill(t, '09:00').count()) === 1);
    await gio.evaluate((e) => { e.scrollTop = 36 * 14; });
    for (let i = 0; i < 10 && (await gio.getAttribute('aria-valuetext')) !== '14'; i++) { await t.waitForTimeout(100); await t.clock.runFor(200); } // bánh xoay chờ 90 ms sau khi ngừng cuộn mới chốt giá trị — đồng hồ giả phải chạy
    k('A4 vuốt (cuộn) bánh xoay giờ tới dòng 14 → "🕘 14:00"', (await nutPill(t, '14:00').count()) === 1, (await t.locator('.bn-hang').innerText()).replace(/\n/g, ' | ') + ' · giờ=' + (await gio.getAttribute('aria-valuetext')));
    await bangNgay(t).getByRole('button', { name: 'Cả ngày (không giờ)' }).click();
    k('A4 "Cả ngày (không giờ)" bỏ giờ: nút về "Giờ sự kiện" và bỏ nhắc kiểu "trước N phút"', (await nutPill(t, 'Giờ sự kiện').count()) === 1 && (await nutPill(t, 'Đúng giờ').count()) === 0);
    await nutPill(t, 'Giờ sự kiện').click(); await gio.waitFor(); await gio.focus(); await t.keyboard.press('ArrowDown');
    await t.locator('.bn-hang .filter-pill').nth(1).click(); // nút giữa (nhắc đã tự đặt "Đúng giờ" nên chữ không còn là "Hẹn giờ nhắc")
    k('A4 chạm nút khác thì khung kia tự đóng: chỉ MỘT khung (.bn-khung) mở', (await t.locator('.bn-khung').count()) === 1 && (await gio.count()) === 0);
    const nhacChu = await t.locator('.bn-khung').innerText();
    k('C2 việc có giờ: nút nhanh Đúng giờ · Trước 15 phút · Trước 1 giờ · Trước 1 ngày + "Chọn ngày giờ khác…" + "Không nhắc"; dòng "Nhắc hiện khi bạn đang mở App."', ['Đúng giờ', 'Trước 15 phút', 'Trước 1 giờ', 'Trước 1 ngày', 'Chọn ngày giờ khác…', 'Không nhắc', 'Nhắc hiện khi bạn đang mở App.'].every((c) => nhacChu.includes(c)));
    await t.locator('.bn-khung .filter-pill', { hasText: 'Chọn ngày giờ khác…' }).click();
    const bn = (ten) => bangNgay(t).getByRole('spinbutton', { name: ten, exact: true });
    k('C2 "Chọn ngày giờ khác…" → bánh xoay 3 cột: ngày trước · giờ · phút', (await bn('Số ngày trước').count()) === 1 && (await bn('Giờ nhắc').count()) === 1 && (await bn('Phút nhắc').count()) === 1);
    await bn('Số ngày trước').focus(); await t.keyboard.press('ArrowDown');
    k('C2 chọn "2 ngày trước lúc 20:00" → nút "🔔 Trước 2 ngày lúc 20:00"', (await nutPill(t, 'Trước 2 ngày lúc 20:00').count()) === 1);
    await t.locator('.bn-khung').getByRole('button', { name: 'Xong', exact: true }).click();
    await bangNgay(t).getByRole('button', { name: 'Thêm', exact: true }).click(); await bangNgay(t).getByText('Việc của tôi · 1 việc').waitFor();
    const v = (await luuTho(t))[0];
    k('C2 lưu đúng: giờ 09:00, nhac = −2 ngày + 20:00 = −1680 phút (từ 00:00 của ngày việc), cùng ngày 20/11', v && v.gio === '09:00' && v.nhac === -1680 && v.ngay === '2026-11-20');
    k('A3 dòng việc trong bảng: giờ · tên · hạn bằng chữ ("hạn 20/11") · 🔔 chữ nhắc', /09:00/.test(await bangNgay(t).locator('.ag').innerText()) && /hạn 20\/11/.test(await bangNgay(t).locator('.ag').innerText()) && /Trước 2 ngày lúc 20:00/.test(await bangNgay(t).locator('.ag').innerText()));
  });

  // ----- 3. Gõ nhanh có ngày; lặp "Sau khi xong 30 ngày" + Hoàn tác
  await ca('lap', {}, async (t) => {
    await mo(t, '/kehoach'); await t.getByText('Tháng 11 · 2026').waitFor();
    await t.locator('.cd.today').first().click(); await bangNgay(t).waitFor();
    k('A1 bảng hôm nay: tiêu đề "Hôm nay"', /^Hôm nay/.test(await bangNgay(t).innerText()));
    await t.getByLabel('Tên việc').fill('Mua quà 20/11'); await t.keyboard.press('Enter');
    await t.waitForFunction(() => document.querySelector('.toast.show'));
    const v1 = (await luuTho(t))[0];
    k('B1 ở bảng ngày 8 gõ "Mua quà 20/11" + Enter → việc vào 20/11 (tên "Mua quà", không kèm ngày); báo "Đã thêm vào 20/11"; bảng ngày 8 vẫn 0 việc', v1 && v1.tieu === 'Mua quà' && v1.ngay === '2026-11-20' && (await t.locator('.toast').innerText()).includes('Đã thêm vào 20/11') && /Việc của tôi · 0 việc/.test(await bangNgay(t).innerText()));
    await t.getByLabel('Tên việc').fill('Uống thuốc bổ'); await nutPill(t, 'Lặp lại').click();
    await t.locator('.bn-khung .filter-pill', { hasText: 'Sau khi xong…' }).click();
    k('C1 "Sau khi xong…" hiện thêm 7 · 30 · 60 · 90 ngày; mặc định 30 ngày được chọn; nút đổi chữ "↻ Sau khi xong 30 ngày"', (await t.locator('.bn-khung .filter-pill.active').allInnerTexts()).includes('30 ngày') && (await nutPill(t, 'Sau khi xong 30 ngày').count()) === 1 && (await t.locator('.bn-khung .filter-pill', { hasText: /^(7|60|90) ngày$/ }).count()) === 3);
    await t.locator('.bn-khung').getByRole('button', { name: 'Xong', exact: true }).click();
    await bangNgay(t).getByRole('button', { name: 'Thêm', exact: true }).click(); await bangNgay(t).getByText('Việc của tôi · 1 việc').waitFor();
    await bangNgay(t).getByRole('button', { name: 'Đánh dấu xong' }).click();
    await t.locator('.toast.co-nut').waitFor();
    const sau = (await luuTho(t)).find((x) => x.tieu === 'Uống thuốc bổ');
    k('C1+E1 tick "Uống thuốc bổ" (sau khi xong 30 ngày) → dời sang 8/12; thông báo "Đã xong Uống thuốc bổ · Hoàn tác"', sau.ngay === '2026-12-08' && /Đã xong Uống thuốc bổ · Hoàn tác/.test(await t.locator('.toast.co-nut').innerText()));
    await t.locator('.toast.co-nut button', { hasText: 'Hoàn tác' }).click();
    const lai = (await luuTho(t)).find((x) => x.tieu === 'Uống thuốc bổ');
    k('E1 Hoàn tác trả việc về đúng ngày hẹn cũ 8/11 (không phải 8/12) và chưa xong', lai.ngay === '2026-11-08' && lai.xong === false && (await t.locator('.toast.co-nut').count()) === 0);
    await bangNgay(t).getByRole('button', { name: 'Đánh dấu xong' }).click(); await t.locator('.toast.co-nut').waitFor();
    await t.clock.runFor(5200);
    k('E1 thông báo Hoàn tác tự mất sau 5 giây', (await t.locator('.toast.co-nut').count()) === 0);
  });

  // ----- 4. Xoá + Hoàn tác, sửa việc, tìm
  await ca('sua', { luu: { kh_kehoach: JSON.stringify({ v: 1, viec: [{ id: 'a', ngay: '2026-11-08', gio: '10:00', tieu: 'Đi khám răng', nhac: 585, xong: false }, { id: 'b', ngay: '2026-11-12', gio: '', tieu: 'Cà phê với bạn', nhac: null, xong: false }], leNhac: {}, anBanner: '' }) } }, async (t) => {
    await mo(t, '/kehoach'); await t.getByText('Tháng 11 · 2026').waitFor();
    await t.locator('#timViec').fill('ca phe');
    k('E2 tìm "ca phe" (bỏ dấu) → "Cà phê với bạn"; không có việc khác', (await t.locator('#timKetQua').innerText()).includes('Cà phê với bạn') && !(await t.locator('#timKetQua').innerText()).includes('Đi khám'));
    await t.locator('#timKetQua .tl-row').click(); await bangNgay(t).waitFor();
    k('E2 chạm kết quả → mở bảng của ngày đó (12/11)', /Thứ Năm, 12\/11/.test(await bangNgay(t).innerText()) && (await bangNgay(t).innerText()).includes('Cà phê với bạn'));
    await t.keyboard.press('Escape'); await t.locator('#timViec').fill('');
    await t.locator('.cd.today').first().click(); await bangNgay(t).waitFor();
    await bangNgay(t).locator('.ti', { hasText: 'Đi khám răng' }).click();
    k('A3 chạm tên việc → form sửa có sẵn tên, giờ 10:00 ("🕘 10:00"), nhắc "Trước 15 phút" ("🔔 Trước 15 phút"), nút Lưu / Xoá việc', (await t.getByLabel('Tên việc').inputValue()) === 'Đi khám răng' && (await nutPill(t, '10:00').count()) === 1 && (await nutPill(t, 'Trước 15 phút').count()) === 1 && (await bangNgay(t).getByRole('button', { name: 'Xoá việc' }).count()) === 1);
    await t.getByLabel('Tên việc').fill('Đi khám mắt'); await bangNgay(t).getByRole('button', { name: 'Lưu', exact: true }).click();
    k('A3 sửa tên → lưu "Đi khám mắt", giữ giờ + nhắc', (await luuTho(t)).find((x) => x.id === 'a').tieu === 'Đi khám mắt' && (await luuTho(t)).find((x) => x.id === 'a').nhac === 585);
    await bangNgay(t).locator('.ti', { hasText: 'Đi khám mắt' }).click(); await bangNgay(t).getByRole('button', { name: 'Xoá việc' }).click();
    await t.locator('.toast.co-nut').waitFor();
    k('E1 xoá việc → "Đã xoá Đi khám mắt · Hoàn tác"; việc mất khỏi máy', /Đã xoá Đi khám mắt · Hoàn tác/.test(await t.locator('.toast.co-nut').innerText()) && !(await luuTho(t)).some((x) => x.id === 'a'));
    await t.locator('.toast.co-nut button').click();
    k('E1 Hoàn tác xoá → việc trở lại đúng như trước (giờ 10:00, nhắc 585)', (await luuTho(t)).some((x) => x.id === 'a' && x.gio === '10:00' && x.nhac === 585));
  });

  // ----- 5. Quá hạn: dải, bảng rà soát, Xoá thật?, Dời cả
  const qua = (id, tieu, ngay, them = {}) => ({ id, ngay, gio: '', tieu, nhac: null, xong: false, ...them });
  await ca('qua', { luu: { kh_kehoach: JSON.stringify({ v: 1, viec: [qua('a', 'Nộp hồ sơ', '2026-11-07', { gio: '10:00' }), qua('b', 'Trả sách', '2026-11-03'), qua('c', 'Tập thể dục', '2026-10-25', { lap: { k: 'tuan', n: 1, den: '' }, lanXong: [] })], leNhac: {}, anBanner: '' }) } }, async (t, loi, hop) => {
    await mo(t, '/trangchu');
    k('D1 Trang chủ (đã đăng nhập): ô "Kế hoạch và nhắc việc" có số đỏ nhỏ = số việc quá hạn (3)', (await t.locator('.u-qh').innerText()) === '3');
    await mo(t, '/kehoach');
    await t.locator('#calQuaHan').waitFor();
    k('D1 đầu màn Kế hoạch có dải "⚠️ 3 việc quá hạn"; ô lịch 7/11 có chuông màu cảnh báo (quá hạn)', /⚠️ 3 việc quá hạn/.test(await t.locator('#calQuaHan').innerText()) && (await t.locator('.cd-chuong.qua').count()) >= 1);
    await t.locator('#calQuaHan').click(); await bangNgay(t).waitFor();
    const bq = await bangNgay(t).innerText();
    k('D2 bảng "Việc quá hạn chưa làm": "Quá 1 ngày · 7/11 · 10:00"; việc lặp "Lỡ 3 lần · từ 25/10 đến 8/11"? (25/10, 1/11 → 2 lần)', /Việc quá hạn chưa làm/.test(bq) && /Quá 1 ngày · 7\/11 · 10:00/.test(bq) && /Quá 5 ngày · 3\/11/.test(bq) && /Lỡ 2 lần · từ 25\/10 đến 1\/11/.test(bq));
    k('D2 việc lặp có "✓ Đánh dấu cả 2 lần" + "Bỏ qua lần này"; có "Dời cả 2 việc sang hôm nay" (2 việc thường)', bq.includes('✓ Đánh dấu cả 2 lần') && bq.includes('Bỏ qua lần này') && bq.includes('Dời cả 2 việc sang hôm nay'));
    const the = (ten) => bangNgay(t).locator('.qh-the', { hasText: ten });
    await the('Trả sách').getByRole('button', { name: 'Xoá', exact: true }).click();
    k('D2 "Xoá" bấm một lần chỉ hỏi lại "Xoá thật?" (không xoá, không hộp thoại trình duyệt)', (await the('Trả sách').getByRole('button', { name: 'Xoá thật?' }).count()) === 1 && (await luuTho(t)).some((x) => x.id === 'b') && hop.length === 0);
    await the('Trả sách').getByRole('button', { name: 'Xoá thật?' }).click();
    k('D2 bấm "Xoá thật?" → xoá (kèm Hoàn tác)', !(await luuTho(t)).some((x) => x.id === 'b') && (await t.locator('.toast.co-nut').count()) === 1);
    await the('Nộp hồ sơ').getByRole('button', { name: '→ Hôm nay' }).click();
    k('D2 "→ Hôm nay": việc dời sang 8/11 và rời bảng quá hạn', (await luuTho(t)).find((x) => x.id === 'a').ngay === '2026-11-08' && (await the('Nộp hồ sơ').count()) === 0);
    await the('Tập thể dục').getByRole('button', { name: '✓ Đánh dấu cả 2 lần' }).click();
    k('D2 hết việc quá hạn → "✓ Đã rà soát xong — không còn việc quá hạn"; dải đầu màn mất', (await bangNgay(t).innerText()).includes('Đã rà soát xong — không còn việc quá hạn'));
    await t.keyboard.press('Escape');
    k('D1 dải "quá hạn" biến mất khi không còn việc; trang không lỗi', (await t.locator('#calQuaHan').count()) === 0);
  });

  // ----- 6. Nhắc khi App đang mở (đồng hồ giả): dải ở màn bất kỳ
  await ca('nhac', { luu: { kh_kehoach: JSON.stringify({ v: 1, viec: [{ id: 'n', ngay: '2026-11-08', gio: '09:20', tieu: 'Hẹn bác sĩ', nhac: 545, xong: false }], leNhac: {}, anBanner: '' }) } }, async (t) => {
    await mo(t, '/trangchu');
    k('C2 chưa tới mốc (09:05) lúc 09:00: chưa có dải nhắc', (await t.locator('.dai-nhac').count()) === 0);
    await t.clock.runFor(6 * 60 * 1000);
    await t.locator('.dai-nhac').waitFor();
    k('C2 App đang mở ở Trang chủ, tới mốc 09:05 → dải trên cùng "Nhắc việc: Hẹn bác sĩ (09:20)" kèm nút Xem và ✕', /Nhắc việc: Hẹn bác sĩ \(09:20\)/.test(await t.locator('.dai-nhac').innerText()) && (await t.locator('.dai-nhac .bao-don-xem').count()) === 1 && (await t.locator('.dai-nhac .bao-don-tat').count()) === 1);
    await t.locator('.dai-nhac .bao-don-tat').click(); await t.clock.runFor(60 * 1000);
    k('C2 mỗi mốc chỉ báo một lần: tắt rồi chờ thêm → không báo lại', (await t.locator('.dai-nhac').count()) === 0);
    await t.reload(); await t.waitForSelector('.phone'); await t.clock.runFor(30000);
    k('C2 mở lại App sau mốc: dải KHÔNG báo (mốc đã qua lúc App tắt); thanh nhắc ở màn Kế hoạch lo phần đó', (await t.locator('.dai-nhac').count()) === 0);
    await mo(t, '/kehoach');
    k('C2 màn Kế hoạch có thanh nhắc "… : Hẹn bác sĩ (09:20)" (đang trong thời gian nhắc)', /Hẹn bác sĩ \(09:20\)/.test(await t.locator('#calNoti').innerText()));
  });
  await ca('nhac2', { luu: { kh_kehoach: JSON.stringify({ v: 1, viec: [{ id: 'n', ngay: '2026-11-08', gio: '09:20', tieu: 'Hẹn bác sĩ', nhac: 545, xong: false }], leNhac: {}, anBanner: '' }) } }, async (t) => {
    await mo(t, '/trangchu'); await t.clock.runFor(6 * 60 * 1000); await t.locator('.dai-nhac').waitFor();
    await t.locator('.dai-nhac .bao-don-xem').click(); await bangNgay(t).waitFor();
    k('C2 nút "Xem" của dải → mở màn Kế hoạch và bảng của ngày 8/11 (Hôm nay) có việc "Hẹn bác sĩ"', /^Hôm nay/.test(await bangNgay(t).innerText()) && (await bangNgay(t).innerText()).includes('Hẹn bác sĩ'));
  });

  // ----- 7. Mọi cỡ màn: không tràn ở 360 / 430
  for (const rong of [360, 430]) {
    await ca('rong' + rong, { rong, luu: { kh_kehoach: JSON.stringify({ v: 1, viec: [qua('a', 'Việc quá hạn tên khá dài để thử xuống dòng không vỡ ô', '2026-11-20', { gio: '09:00', nhac: 525 }), qua('b', 'Họp', '2026-11-06')], leNhac: {}, anBanner: '' }) } }, async (t) => {
      await mo(t, '/kehoach'); await t.getByText('Tháng 11 · 2026').waitFor();
      const tran = () => t.evaluate(() => ({ trang: document.documentElement.scrollWidth - innerWidth, o: Math.max(...[...document.querySelectorAll('.cd')].map((e) => e.scrollWidth - e.clientWidth)) }));
      const a = await tran();
      k(`A5 ${rong}px: lịch có chuông + chấm lễ + tên tiết khí không tràn ô, trang không cuộn ngang`, a.trang <= 1 && a.o <= 1, JSON.stringify(a));
      await t.locator('.cd:not(.out)', { has: t.locator('b', { hasText: /^20$/ }) }).first().click(); await bangNgay(t).waitFor();
      await nutPill(t, 'Lặp lại').click();
      const b = await t.evaluate(() => { const p = document.querySelector('.bang-noi .panel'); return { w: p.scrollWidth - p.clientWidth, nut: [...document.querySelectorAll('.bn-hang .filter-pill')].map((e) => e.scrollWidth - e.clientWidth), dong: document.documentElement.scrollWidth - innerWidth }; });
      k(`A4 ${rong}px: bảng ngày + 3 nút + khung Lặp lại không tràn ngang`, b.w <= 1 && b.dong <= 1, JSON.stringify(b));
    });
  }
  await trinh.close();
}
