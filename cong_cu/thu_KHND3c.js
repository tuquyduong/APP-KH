#!/usr/bin/env node
// THỬ KH-ND-3c — gom nội dung Ưu đãi, Tài khoản, Hồ sơ, Hỗ trợ, Đăng nhập, Mã thành viên, Trắc nghiệm về danh mục `src/noiDung/nd/taiKhoan.js` (mọi chữ / ảnh / nút đọc qua nd()),
// + Mã thành viên dễ quét ở quầy (B: mã to, nền trắng, viền ≥ 4 ô, giữ màn sáng) + sửa nhỏ (C1 nhớ chương trình trên máy, C2 khoá dải quảng cáo, C3 số nợ giữ dòng 0, C4 vệt sáng luôn chạy → thu_KHUI5g).
// Phần 1 (luôn chạy, kể cả KHONG_TRINH_DUYET=1): danh mục hợp lệ, chữ gốc còn nguyên (chu_goc.json trích từ bản trước việc), tệp A1 hết chữ cứng, mọi khoá có chỗ gắn, hàm thuần đọc qua nd(), C1–C3, VeQR.
// Phần 2: App thật trong Chromium + POS giả — bản giả đổi khoá → màn đổi; bản rỗng → như cũ; Mã thành viên (kích thước, nền, viền, Wake Lock); banner Trang chủ nhớ chương trình.
// Chạy: node cong_cu/thu_KHND3c.js → dòng cuối "n đạt · m hỏng". Không có Playwright / KHONG_TRINH_DUYET=1 → phần 2 BỎ QUA (không tính hỏng).
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { pathToFileURL } = require('url');

const GOC = path.join(__dirname, '..');
let dat = 0, hong = 0;
const k = (ten, dung, them = '') => {
  if (dung) { dat++; console.log(`  ✓ ${ten}`); } else { hong++; console.log(`  ✗ ${ten}${them ? '  — ' + them : ''}`); }
};
const tep = (f) => path.join(GOC, f);
const co = (f) => fs.existsSync(tep(f));
const doc = (f) => (co(f) ? fs.readFileSync(tep(f), 'utf8') : '');
const nap = async (f) => { try { return await import(pathToFileURL(tep(f)).href); } catch (e) { return { loiNap: String(e && e.message).split('\n')[0] }; } };
const boChuThich = (t) => t.replace(/\/\*[\s\S]*?\*\/|(^|[^:])\/\/[^\n]*/g, '$1');

// Dựng một thành phần của app thành CommonJS rồi vẽ ra HTML tĩnh (react-dom/server).
function dung(tepNguon, xuat) {
  const esbuild = require('esbuild');
  const kq = esbuild.buildSync({
    stdin: { contents: xuat, resolveDir: tep('src'), loader: 'jsx' },
    bundle: true, platform: 'node', format: 'cjs', jsx: 'automatic', write: false, logLevel: 'silent', loader: { '.json': 'json' }, define: { 'process.env.NODE_ENV': '"production"' },
  });
  const m = { exports: {} };
  new vm.Script(`(function (module, exports, require) {${kq.outputFiles[0].text}\n})`, { filename: tepNguon }).runInThisContext()(m, m.exports, require);
  return m.exports;
}

// Tệp A1 → số chữ cứng còn lại (0 = hết; chữ MÁY không hiện cho khách thì ghi lý do).
const A1 = [
  'src/pages/UuDai.jsx', 'src/pages/TaiKhoan.jsx', 'src/pages/HoSo.jsx', 'src/pages/HoTro.jsx', 'src/pages/DangNhap.jsx', 'src/pages/ManQR.jsx', 'src/pages/TracNghiem.jsx',
  'src/pages/TracNghiemLam.jsx', 'src/pages/TracNghiemKetQua.jsx', 'src/components/NhanMa.jsx', 'src/components/TheMoi.jsx', 'src/giaHang.js', 'src/dinhDang.js', 'src/App.jsx',
];
const MAN = ['Tài khoản', 'Ưu đãi', 'Hồ sơ', 'Hỗ trợ', 'Đăng nhập', 'Mã thành viên', 'Trắc nghiệm', 'Khung chung'];
// Khoá cố ý KHÔNG gắn `data-nd` (chữ đi vào chỗ không có phần tử riêng: thông báo nổi, thuộc tính aria / placeholder, tên màn do DauManCon vẽ — Man.jsx ngoài Phạm vi) → lý do.
const KHONG_GAN = {
  'app.daThem': 'thông báo nổi (Thongbao.jsx nhận chuỗi, ngoài Phạm vi)', 'app.daThemNhieu': 'thông báo nổi', 'app.boQua': 'thông báo nổi', 'app.menuChua': 'thông báo nổi', 'app.donRong': 'thông báo nổi',
  'tnk.daLuuToast': 'thông báo nổi', 'tnk.khongLuuDuoc': 'thông báo nổi', 'tnk.daSaoChep': 'thông báo nổi', 'tnk.chuanBiGopY': 'thông báo nổi',
  'nm.aria': 'aria-label của ô nhập', 'nm.goiY': 'placeholder của ô nhập', 'dn.dong': 'aria-label nút đóng', 'dn.ma.aria': 'aria-label ô mã', 'mqr.aria': 'aria-label hình QR (VeQR)',
  'hs.tieuDe': 'tên màn do DauManCon (Man.jsx) vẽ', 'hs.phu': 'DauManCon', 'ht.tieuDe': 'DauManCon', 'mqr.tieuDe': 'DauManCon', 'tn.tieuDe': 'DauManCon', 'tn.phu': 'DauManCon', 'tnk.tieuDe': 'DauManCon', 'tnk.phu': 'DauManCon',
  'tnk.gopYMau': 'placeholder ô góp ý', 'gia.donVi': 'hàm thuần dinhDangGia (không có phần tử)', 'gia.giam': 'hàm thuần moTaGiam',
  'dn.ma.quay': 'lời của hàm loiMa (dangNhap.js); màn gắn ndDau theo loại', 'dn.ma.zalo': 'như trên', 'dn.ma.zaloChung': 'như trên',
  'hien.ud.the': 'mục bật / tắt khối thẻ hội viên (ndHien) — không phải chữ, không có phần tử riêng', // KH-THE-2 (ud.hang.goi / ud.hang.db bỏ cùng thẻ cũ)
  'ud.voucher.donTu': 'ghép vào dòng phụ của thẻ voucher (data-nd="ud.khach")', 'ud.voucher.han': 'như trên',
  'tnk.duaTren': 'KhoiTheChat.jsx (ngoài Phạm vi) đọc qua getter trong tracNghiemChu.js — chưa gắn data-nd; ghi ở ## Phát hiện', 'tnk.khongNoiBat': 'như trên', 'tnk.dacDiem': 'như trên', 'tnk.chamSoc': 'như trên', 'tnk.thucUong': 'như trên', 'tnk.mucNhe': 'như trên',
  'tnk.tinhNguoc': 'nối vào dòng câu hỏi trong bảng xem lại (data-nd="tnk.diem" của cả bảng)',
};
const CHU_MAY = ['anh', 'chị', 'cô', 'chú', 'bác', 'em', 'bạn']; // XUNG_HO của noiDung/dangNhap.js: chữ hiện của mã gửi POS (mục khoá tutinh)

(async () => {
  console.log('Phần 1 — A. Danh mục');
  const DM = (await nap('src/noiDung/nd/index.js')).DANH_MUC || [];
  const ND = await nap('src/noiDung/nd.js');
  const TK = (await nap('src/noiDung/nd/taiKhoan.js')).TAI_KHOAN || [];
  const theo = new Map(DM.map((m) => [m.khoa, m]));
  const sua = TK.filter((m) => !m.khoaBoi), khoa = TK.filter((m) => m.khoaBoi);
  const theoLoai = {}; for (const m of sua) theoLoai[m.loai] = (theoLoai[m.loai] || 0) + 1;
  console.log(`  (taiKhoan.js: ${TK.length} mục — ${JSON.stringify(theoLoai)} · khoá pos ${khoa.filter((m) => m.khoaBoi === 'pos').length} · tutinh ${khoa.filter((m) => m.khoaBoi === 'tutinh').length})`);
  k('A1 taiKhoan.js xuất MẢNG ≥ 250 mục, đã gộp vào danh mục chung', Array.isArray(TK) && TK.length >= 250 && TK.every((m) => theo.get(m.khoa) === m), `${TK.length} mục${ND.loiNap ? ' · ' + ND.loiNap : ''}`);
  k('A1 man của mục thuộc 8 màn: Tài khoản · Ưu đãi · Hồ sơ · Hỗ trợ · Đăng nhập · Mã thành viên · Trắc nghiệm · Khung chung', TK.every((m) => MAN.includes(m.man)) && MAN.slice(0, 7).every((x) => TK.some((m) => m.man === x)), [...new Set(TK.map((m) => m.man))].join('|'));
  k('A1 kiemDanhMuc(TOÀN BỘ danh mục) = 0 lỗi', typeof ND.kiemDanhMuc === 'function' && ND.kiemDanhMuc(DM).length === 0, ND.kiemDanhMuc ? ND.kiemDanhMuc(DM).join(' | ') : 'thiếu hàm');
  k('A1 danh mục không có chữ "nợ" (quán không có công nợ); bản giả "Công nợ" bị bắt', !/nợ/i.test(JSON.stringify(TK)) && /nợ/i.test(JSON.stringify([{ macDinh: 'Công nợ' }])));
  const phanPOS = ['tk.khach', 'ud.gv.so', 'ud.ct.pos', 'ud.the.pos', 'ud.khach', 'nm.loi', 'hs.khach', 'hs.loi', 'dn.loi', 'mqr.ma'];
  k('A1 phần POS (khách, hạng, điểm, ví, voucher, chương trình, Giờ vàng, mã, lời lỗi) có mục khoá pos + chỉ đường POS ›', phanPOS.every((x) => theo.get(x)?.khoaBoi === 'pos' && /POS/.test(theo.get(x).chiDuong)), phanPOS.filter((x) => theo.get(x)?.khoaBoi !== 'pos').join(','));
  // A2 — trắc nghiệm chuyên môn KHOÁ
  const chuyenMon = ['tn.the', 'tnl.cauHoi', 'tnk.the', 'tnk.diem'];
  k('A2 nội dung chuyên môn trắc nghiệm (9 thể, câu hỏi, cách chấm, lời khuyên) là mục KHOÁ tutinh + chỉ đường "thay bằng bản trắc nghiệm mới"', chuyenMon.every((x) => theo.get(x)?.khoaBoi === 'tutinh' && /chuyên môn.*bản trắc nghiệm mới/.test(theo.get(x).chiDuong))
    && theo.get('tk.tracNghiem.kq')?.khoaBoi === 'tutinh' && theo.get('tnk.mon')?.khoaBoi === 'tutinh');
  k('A2 src/tracNghiem.js, tracNghiem.json, tracNghiemMenu.json KHÔNG đổi (số chữ cứng tracNghiem.js còn 62; json còn đủ 62 câu = 60 mỗi giới)', ((H) => H && H.docNo(GOC)['src/tracNghiem.js'] === 62 && H.demChuCung(doc('src/tracNghiem.js')) === 62)((() => { try { return require(tep('cong_cu/ha_no_chu.js')); } catch { return null; } })())
    && JSON.parse(doc('src/noiDung/tracNghiem.json')).questions.length === 62);
  // macDinh = chữ đang chạy (chép nguyên từ mã cũ) — mẫu tay
  const GOC_CHU = {
    'tk.nhomSucKhoe': 'Sức khỏe', 'tk.tracNghiem.chua': 'Làm trắc nghiệm 7–8 phút', 'tk.donHang.phu': 'Lịch sử các đơn đã mua', 'tk.thongTin.phu': 'Xưng hô, mã PIN, địa chỉ', 'tk.hoTro.phu': 'Gọi, nhắn Zalo cho quán',
    'ud.ct.chuc': 'Chúc mừng sinh nhật! Mời bạn đến quán, đưa căn cước để nhận ưu đãi hôm nay.', 'ud.ct.moiNhap': 'Nhập ngày sinh ở Thông tin cá nhân để nhận ưu đãi sinh nhật',
    'ud.moi.p': 'Đăng nhập để xem điểm, ví và voucher', 'ud.voucher.donTu': 'đơn từ {gia}', 'ud.voucher.han': 'hạn dùng đến {ngay}',
    'nm.loiDang': 'Mã chỉ gồm chữ và số (tối đa 32 ký tự). Kiểm tra lại mã trên hoá đơn.', 'nm.daNhanMoi': 'Đã nhận ưu đãi khách mới: mã {ma} {giam}', 'nm.goiY': 'Dán hoặc gõ mã trên hoá đơn',
    'hs.ns.hoi': 'Ngày sinh {ngay} — sau khi lưu bạn không tự sửa được. Lưu?', 'hs.ns.goiY': 'Nhập đúng như căn cước — quán đối chiếu khi áp ưu đãi sinh nhật. Chỉ nhập được một lần.',
    'hs.dc.goiY': 'Địa chỉ này dùng chung với quầy và được in trên hoá đơn. Để trống rồi lưu là xoá địa chỉ.', 'hs.pin.phu': '4 số · đặt hoặc đổi mã PIN của bạn', 'hs.pin.ghiChu': 'Nhân viên quán không xem được mã PIN của bạn.',
    'dn.tt.dcGhiChu': 'Dùng làm địa chỉ giao hàng mặc định khi bạn đặt online; sửa được trong Tài khoản.', 'dn.maHoaDon': 'Đăng nhập để nhận điểm cho hoá đơn này', 'dn.ma.quay': 'Hỏi nhân viên quầy để lấy mã đăng nhập',
    'dn.ma.zalo': 'Mã đã gửi qua Zalo tới số {sdt}', 'dn.sdt.phu': 'Nhận mã đăng nhập qua Zalo', 'dn.tt.dc': 'Địa chỉ nhận hàng (không bắt buộc)', 'mqr.dua': 'Đưa mã này cho nhân viên quầy', 'mqr.chua': 'Chưa có mã QR. Thử lại sau.',
    'mqr.sang': 'Tăng độ sáng màn hình để quầy quét nhanh', 'tn.camKet': 'Thông tin bạn cung cấp chỉ dùng để gợi ý thức uống phù hợp và không được dùng vào mục đích khác.', 'tn.dong2': 'Gợi ý thức uống và cách chăm sóc dưỡng sinh theo 9 thể chất',
    'tnl.luuY': 'Chọn mô tả giống bạn nhất trong 3 tháng gần đây. Không có đúng sai.', 'tnl.thoatPhu': 'Các câu bạn đã trả lời sẽ không được lưu.', 'tnl.conLai': 'còn khoảng {so} phút', 'tnl.cau': 'Câu {so}/{tong}',
    'tnk.xungDot': 'Hai xu hướng trái tính chất cùng cao (Dương hư cùng với Âm hư hoặc Thấp nhiệt). Trường hợp này nên dùng thức uống tính bình và trao đổi trực tiếp với người phụ trách chuyên môn trước khi chọn món ấm hay mát.',
    'tnk.luuYThuong': 'Món và topping trong quán được chọn theo hướng thức uống trên; nhân viên sẽ xác nhận lại theo công thức thực tế.', 'tnk.daLuu': 'Đã lưu trên máy này · bạn xem lại được ở Tài khoản → Thể trạng của tôi',
    'tnk.chuThichDiem': 'Điểm quy đổi 0–100. Vạch mờ là ngưỡng 30 (thiên hướng) và 40 (có xu hướng rõ); nhóm Bình hòa dùng ngưỡng 60.', 'tnk.khiHauLanh': 'chịu nóng tốt hơn, sợ lạnh', 'tnk.khiHauNong': 'chịu lạnh tốt hơn, sợ nóng',
    'tnk.deRiengCau': 'nhóm {nhom} có điểm khá cao, nhưng bạn cho biết mình {khiHau}, nên chưa đưa vào kết luận. Nếu muốn rõ hơn, bạn có thể trao đổi trực tiếp.', 'gia.donVi': 'đ', 'gia.giam': 'giảm {giaTri}',
    'app.daThem': 'Đã thêm {ten} vào giỏ', 'app.menuChua': 'Menu chưa tải xong, thử lại sau ít giây', 'app.boQua': '{so} món không còn bán, đã bỏ qua', 'app.donRong': 'Đơn này không có món để đặt lại',
    'home.q.kq': 'Thể trạng', 'home.q.xem': 'Xem kết quả ›', 'home.qk': 'Trắc nghiệm', 'home.qh': 'Bạn thuộc thể chất nào?',
  };
  const saiGoc = Object.entries(GOC_CHU).filter(([x, v]) => theo.get(x)?.macDinh !== v).map(([x]) => x);
  k(`A1 macDinh = chữ đang chạy (${Object.keys(GOC_CHU).length} khoá kiểm lại với chữ cũ, gồm 4 khoá O_TRAC_NGHIEM ở Trang chủ)`, saiGoc.length === 0, saiGoc.join(', '));
  k('A1 danh sách đáp án khí hậu giữ mã máy lanh / nong / deu (khoaCauTruc) và đúng 3 chữ', JSON.stringify(theo.get('tnl.khiHau')?.macDinh.map((x) => x.ma)) === '["lanh","nong","deu"]' && JSON.stringify(theo.get('tnl.khiHau')?.khoaCauTruc) === '["ma"]'
    && theo.get('tnl.khiHau').macDinh.map((x) => x.nhan).join('|') === 'Chịu nóng tốt hơn, sợ lạnh|Chịu lạnh tốt hơn, sợ nóng|Như nhau, không rõ bên nào hơn');
  // Mọi chữ có dấu của 14 + 3 tệp A1 ở bản TRƯỚC việc (chu_goc.json, trích bằng @babel/parser) phải còn trong danh mục (gồm cả các nhóm khác), trừ mã xưng hô
  const gocJson = co('viec/KH-ND-3c/chu_goc.json') ? JSON.parse(doc('viec/KH-ND-3c/chu_goc.json')) : {};
  const mo = [];
  const tron = (x) => { if (typeof x === 'string') mo.push(x); else if (Array.isArray(x)) x.forEach(tron); else if (x && typeof x === 'object') Object.values(x).forEach(tron); };
  DM.forEach((m) => tron(m.macDinh));
  const kho = mo.join('\u0001');
  const thieu = [];
  // KH-THE-2 bỏ thẻ hạng cũ ở Ưu đãi (bảng mọi hạng, dòng gói "N tháng — giá", "% món thường", "Thẻ hết hạn:") — các chữ chỉ thuộc thẻ đó không còn trong danh mục
  const BO_THE2 = [' · nhóm đặc biệt ', '% món thường', 'Thẻ hết hạn:', '— giảm', ' tháng — '];
  for (const [f, ds] of Object.entries(gocJson)) for (const s of ds) { if (f === 'src/noiDung/dangNhap.js' && CHU_MAY.includes(s)) continue; if (['src/pages/UuDai.jsx', 'src/giaHang.js'].includes(f) && BO_THE2.includes(s)) continue; if (!kho.includes(s.trim())) thieu.push(`${f}: ${s.slice(0, 50)}`); }
  const tongGoc = Object.values(gocJson).reduce((a, b) => a + b.length, 0);
  k(`A1 mọi chữ có dấu của 17 tệp A1 ở bản trước việc (${tongGoc} chuỗi) còn trong danh mục (trừ 7 chữ xưng hô của mã gửi POS)`, tongGoc > 200 && thieu.length === 0, thieu.slice(0, 6).join(' | '));

  console.log('Phần 1 — B. Tệp A1 hết chữ cứng, khoá dùng có trong danh mục, mỗi khoá có chỗ gắn');
  let H = {};
  try { H = require(tep('cong_cu/ha_no_chu.js')); } catch { /* thiếu */ }
  const conChu = A1.filter((f) => H.demChuCung(doc(f)) !== 0).map((f) => `${f} (${H.demChuCung(doc(f))})`);
  k(`C1 ${A1.length} tệp A1: số chữ cứng = 0 (K10, CLAUDE.md §11)`, typeof H.demChuCung === 'function' && conChu.length === 0, conChu.join(', '));
  k('C1 noiDung/dangNhap.js chỉ còn 5 chữ có dấu của mã xưng hô (chị, cô, chú, bác, bạn); lienHe.js và tracNghiemChu.js không còn chữ cứng', H.demChuCung(doc('src/noiDung/dangNhap.js')) === 5 && H.demChuCung(doc('src/noiDung/lienHe.js')) === 0 && H.demChuCung(doc('src/noiDung/tracNghiemChu.js')) === 0);
  const DUNG_TEP = [...A1, 'src/noiDung/dangNhap.js', 'src/noiDung/lienHe.js', 'src/noiDung/tracNghiemChu.js', 'src/quangCao.js', 'src/components/DaiQuangCao.jsx'];
  const dung_ = new Map(), thieuKhoa = [];
  for (const f of DUNG_TEP) {
    const nguon = boChuThich(doc(f));
    // chỉ khoá <nhóm>.<tên> (có dấu chấm) — tên biểu tượng như "warning" không phải khoá
    for (const m of nguon.matchAll(/\b(?:nd|ndPhan|ndDau|ndNut|ndAnh|ndDs|ndHien)\(([^)]*)\)|\bk="([^"]+)"|\b(?:ten|phu|chu|khoa|khoaTen|khoaNhan)=\{?"([\w.]+)"|(['"])((?:tk|ud|nm|hs|ht|dn|mqr|tn|tnl|tnk|app|gia|qc)\.[\w.]+)\4/g)) {
      const trongHam = m[1] !== undefined ? [...m[1].matchAll(/(['"])([\w]+(?:\.\w+)+)\1/g)].map((x) => x[2]) : [];
      for (const x of [...trongHam, m[2], m[3], m[5]].filter((y) => y && y.includes('.'))) { if (!dung_.has(x)) dung_.set(x, new Set()); dung_.get(x).add(f); if (!theo.has(x)) thieuKhoa.push(`${f}: ${x}`); }
    }
  }
  k(`C1 mọi khoá các tệp A1 dùng (${dung_.size} khoá) đều có trong danh mục`, thieuKhoa.length === 0 && dung_.size >= 150, [...new Set(thieuKhoa)].join(', '));
  // Khoá ghép chuỗi: tn.<nam|nu>.t / .phu ; thẻ mời ; tk.* truyền qua DongMenu
  const dong = ['tn.nam.t', 'tn.nam.phu', 'tn.nu.t', 'tn.nu.phu', 'tn.meta1', 'tn.meta2', 'tn.meta3', 'tnl.cuoi', 'tnl.cau'];
  k('C1 khoá ghép chuỗi / mảng (tn.<nam|nu>.t|phu, tn.meta1-3, tnl.cau|cuoi) có đủ trong danh mục và mã ghép đúng', dong.every((x) => theo.has(x)) && /`tn\.\$\{ma\}\.t`/.test(doc('src/pages/TracNghiem.jsx')) && /'tn\.meta1', 'tn\.meta2', 'tn\.meta3'/.test(doc('src/pages/TracNghiem.jsx')));
  // Mỗi khoá của taiKhoan.js có chỗ dùng trong mã; khoá không gắn phải khai cờ + lý do (bài học KH-ND-3b)
  const chuaDung = TK.filter((m) => !dung_.has(m.khoa) && !['tn.nam.t', 'tn.nam.phu', 'tn.nu.t', 'tn.nu.phu', 'tn.meta1', 'tn.meta2', 'tn.meta3'].includes(m.khoa)).map((m) => m.khoa);
  k('D1 mỗi khoá mới của taiKhoan.js CÓ chỗ dùng trong mã (nd / Chu / ndDau / ndAnh / ndDs / khoá truyền qua prop)', chuaDung.length === 0, chuaDung.join(', '));
  const khongGan = [];
  const DONG = ['tn.nam.t', 'tn.nam.phu', 'tn.nu.t', 'tn.nu.phu']; // ghép chuỗi `tn.${ma}.t` — đã kiểm ở ca "khoá ghép chuỗi"
  const DAU_GAN = /ndDau\(|<Chu |\bk=|\bten=|\bphu=|\bten:|\bchu=|khoa|LOAI_DIEM|TRANG_THAI_VOUCHER|const META/; // dòng có khoá phải kèm một dấu hiệu gắn (ndDau / <Chu> / khoá truyền qua prop)
  for (const m of TK) {
    if (KHONG_GAN[m.khoa] !== undefined || DONG.includes(m.khoa)) continue;
    const ganDuoc = [...(dung_.get(m.khoa) || [])].some((f) => doc(f).split('\n').some((d) => (d.includes(`'${m.khoa}'`) || d.includes(`"${m.khoa}"`)) && DAU_GAN.test(d)));
    if (!ganDuoc) khongGan.push(m.khoa);
  }
  const kiemGan = (f, re) => re.test(doc(f));
  k('D1 các khoá hay quên: ndDau thật ở màn (không chỉ có tên khoá trong mã)', kiemGan('src/pages/TaiKhoan.jsx', /ndDau\('tk\.khach'\)/) && kiemGan('src/pages/TaiKhoan.jsx', /<Chu k="tk\.dangXuat"/) && kiemGan('src/pages/UuDai.jsx', /ndDau\('ud\.the\.pos'\)/)
    && kiemGan('src/pages/UuDai.jsx', /ndDau\('ud\.khach'\)/) && kiemGan('src/pages/HoSo.jsx', /ndDau\('hs\.xh\.chu'\)/) && kiemGan('src/pages/HoSo.jsx', /ndDau\('hs\.khach'\)/) && kiemGan('src/pages/DangNhap.jsx', /ndDau\('dn\.xh\.chu'\)/)
    && kiemGan('src/pages/DangNhap.jsx', /ndDau\('dn\.loi'\)/) && kiemGan('src/pages/ManQR.jsx', /ndDau\('mqr\.ma'\)/) && kiemGan('src/pages/TracNghiem.jsx', /ndDau\('tn\.the'\)/) && kiemGan('src/pages/TracNghiemLam.jsx', /ndDau\('tnl\.cauHoi'\)/)
    && kiemGan('src/pages/TracNghiemKetQua.jsx', /ndDau\('tnk\.the'\)/) && kiemGan('src/pages/TracNghiemKetQua.jsx', /ndDau\('tnk\.diem'\)/) && kiemGan('src/pages/TracNghiemKetQua.jsx', /ndDau\('tnk\.mon'\)/) && kiemGan('src/pages/HoTro.jsx', /ndDau\(h\.so\)/));
  k('D1 mọi khoá còn lại có chỗ gắn (ndDau / <Chu> / khoá truyền qua prop) hoặc khai cờ KHONG_GAN + lý do', khongGan.length === 0, khongGan.join(', '));
  k('D1 mọi khoá KHONG_GAN đều có thật trong danh mục (không khai cờ cho khoá không tồn tại)', Object.keys(KHONG_GAN).every((x) => theo.has(x)), Object.keys(KHONG_GAN).filter((x) => !theo.has(x)).join(', '));

  console.log('Phần 1 — C. Màn Ưu đãi, Hồ sơ, TheMoi, KhongTimThay, App');
  const hs = boChuThich(doc('src/pages/HoSo.jsx'));
  k('A4 HoSo.jsx không còn so `=== \'Chào\'`; dùng `coBuoi` của chiaLoiChao để đặt dấu phẩy', !/===\s*['"]Chào['"]/.test(hs) && /coBuoi/.test(hs) && /\{coBuoi \? ',' : ''\}/.test(hs));
  const DD = await nap('src/dinhDang.js');
  if (DD.chiaLoiChao && ND.datBanNoiDung) {
    const g = DD.chiaLoiChao('2026-11-08T08:00:00', 'chi', 'Nguyễn Thị Linh'), g0 = DD.chiaLoiChao('', 'chi', 'Nguyễn Thị Linh');
    ND.datBanNoiDung({ so_ban: 1, gia_tri: { 'chao.dau': 'Xin chào' } });
    const g2 = DD.chiaLoiChao('2026-11-08T08:00:00', 'chi', 'Linh'), g3 = DD.chiaLoiChao('', 'chi', 'Linh');
    ND.datBanNoiDung(null);
    k('A4 chiaLoiChao: có giờ POS → coBuoi true; không có giờ → coBuoi false; đổi chữ chao.dau ("Xin chào") vẫn đúng cờ', g.coBuoi === true && g.dau === 'Chào buổi sáng' && g0.coBuoi === false && g0.dau === 'Chào' && g2.coBuoi === true && g2.dau === 'Xin chào buổi sáng' && g3.coBuoi === false && g3.dau === 'Xin chào');
  } else k('A4 nạp được dinhDang.js + nd.js', false, DD.loiNap || ND.loiNap);
  const tm = boChuThich(doc('src/components/TheMoi.jsx')), ud = boChuThich(doc('src/pages/UuDai.jsx')), tc = boChuThich(doc('src/pages/TrangChu.jsx'));
  k('A3 TheMoi không còn ảnh mặc định riêng (không có `/anh/logo-nho.webp`, không `anh =`); Ưu đãi truyền ảnh + khoá ud.moi.anh; Trang chủ vẫn truyền home.logo', !/logo-nho/.test(tm) && !/\banh\s*=\s*['"]/.test(tm) && /ndAnh\('ud\.moi\.anh'\)/.test(ud) && /anh: 'ud\.moi\.anh'/.test(ud) && /ndAnh\('home\.logo'\)/.test(tc) && theo.get('ud.moi.anh')?.macDinh === '/anh/logo-nho.webp');
  const app = boChuThich(doc('src/App.jsx'));
  k('C1 (phiếu) App.jsx: KhongTimThay không nhận chữ từ ngoài (bỏ tieuDe / nut); KhongTimThay tự đọc khoá khongthay.* / mon.khongThay.*', /<KhongTimThay chon=/.test(app) && !/<KhongTimThay[^>]*(tieuDe|nut)=/.test(app) && /khongthay\.t/.test(doc('src/pages/KhongTimThay.jsx')) && /mon\.khongThay\.nut/.test(doc('src/pages/KhongTimThay.jsx')));
  k('C1 (phiếu) App.jsx: thông báo thêm vào giỏ / đặt lại đọc qua nd("app.…")', ['app.daThem', 'app.menuChua', 'app.boQua', 'app.donRong', 'app.daThemNhieu'].every((x) => app.includes(`nd('${x}'`)));
  const DN = await nap('src/noiDung/dangNhap.js');
  if (DN.loiMa && ND.datBanNoiDung) {
    const a = [DN.loiMa(true, '0901234567'), DN.loiMa(false, '0901234567'), DN.loiMa(false, '09')];
    ND.datBanNoiDung({ so_ban: 2, gia_tri: { 'dn.ma.quay': 'Lấy mã ở quầy nhé', 'dn.ma.zalo': 'Zalo gửi {sdt}', 'dn.ma.zaloChung': 'Zalo gửi bạn' } });
    const b = [DN.loiMa(true, '0901234567'), DN.loiMa(false, '0901234567'), DN.loiMa(false, '09')];
    ND.datBanNoiDung({ so_ban: 3, gia_tri: { 'dn.ma.zalo': 'không có chỗ điền' } });
    const c = DN.loiMa(false, '0901234567');
    ND.datBanNoiDung(null);
    k('B1 loiMa: mặc định như cũ; bản giả đổi chữ → đổi; bản mất chỗ điền {sdt} → về mặc định; bản rỗng → như cũ', a[0] === 'Hỏi nhân viên quầy để lấy mã đăng nhập' && a[1] === 'Mã đã gửi qua Zalo tới số 090 xxx 4567' && a[2] === 'Mã đã gửi qua Zalo tới số điện thoại của bạn'
      && b[0] === 'Lấy mã ở quầy nhé' && b[1] === 'Zalo gửi 090 xxx 4567' && b[2] === 'Zalo gửi bạn' && c === 'Mã đã gửi qua Zalo tới số 090 xxx 4567' && DN.loiMa(true, '1') === a[0]);
  } else k('B1 nạp được noiDung/dangNhap.js', false, DN.loiNap);
  const GH = await nap('src/giaHang.js');
  if (GH.tenDongThe && DD.dinhDangGia && ND.datBanNoiDung) { // KH-THE-2: dongGoi bỏ cùng thẻ cũ — hàm chữ của giaHang.js còn lại là tenDongThe
    const ds = [{ id: 2, ten: 'Vàng' }], d = { loai: 'the', hang_id: 2, so_thang: 3 };
    const a = [GH.tenDongThe(d, ds), GH.tenDongThe({ ...d, hang_id: 9 }, ds), DD.dinhDangGia(25000), DD.moTaGiam('percent', 10), DD.moTaGiam('fixed', 20000)];
    ND.datBanNoiDung({ so_ban: 4, gia_tri: { 'the.tt.dong': '{hang} {so}T', 'gia.donVi': '₫', 'gia.giam': 'bớt {giaTri}' } });
    const b = [GH.tenDongThe(d, ds), GH.tenDongThe({ ...d, hang_id: 9 }, ds), DD.dinhDangGia(25000), DD.moTaGiam('percent', 10), DD.moTaGiam('fixed', 20000)];
    ND.datBanNoiDung(null);
    k('B1 tenDongThe / dinhDangGia / moTaGiam: mặc định ("Thẻ hội viên Vàng · 3 tháng", "25.000đ", "giảm 10%", "giảm 20.000đ"); bản giả đổi chữ / đơn vị → đổi theo; không còn dongGoi / CHU_HANG_TANG / CHU_KHONG_THOI_HAN',
      JSON.stringify(a) === JSON.stringify(['Thẻ hội viên Vàng · 3 tháng', 'Thẻ hội viên', '25.000đ', 'giảm 10%', 'giảm 20.000đ']) && JSON.stringify(b) === JSON.stringify(['Vàng 3T', 'Thẻ hội viên', '25.000₫', 'bớt 10%', 'bớt 20.000₫'])
      && !('dongGoi' in GH) && !('CHU_HANG_TANG' in GH) && !('CHU_KHONG_THOI_HAN' in GH) && DD.dinhDangGia('x') === '');
  } else k('B1 nạp được giaHang.js + dinhDang.js', false, GH.loiNap || DD.loiNap);
  const LH = await nap('src/noiDung/lienHe.js');
  if (LH.LIEN_HE && ND.datBanNoiDung) {
    const a = [LH.LIEN_HE.dienThoai, LH.LIEN_HE.zalo, LH.LIEN_HE.email, LH.coLienHe(LH.LIEN_HE)];
    ND.datBanNoiDung({ so_ban: 5, gia_tri: { 'ht.dienThoai': ' 0901 234 567 ', 'ht.email': 'chao@tuquyduong.vn' } });
    const b = [LH.LIEN_HE.dienThoai, LH.LIEN_HE.zalo, LH.LIEN_HE.email, LH.coLienHe(LH.LIEN_HE)];
    ND.datBanNoiDung(null);
    k('A1 lienHe.js: mặc định TRỐNG (mục Hỗ trợ ẩn); điền ht.dienThoai / ht.email ở bản cập nhật → có liên hệ (hiện mục Hỗ trợ); bản rỗng → trống lại', JSON.stringify(a) === JSON.stringify(['', '', '', false]) && JSON.stringify(b) === JSON.stringify(['0901 234 567', '', 'chao@tuquyduong.vn', true]) && !LH.coLienHe(LH.LIEN_HE));
  } else k('A1 nạp được lienHe.js', false, LH.loiNap);

  console.log('Phần 1 — D. Mã thành viên dễ quét ở quầy (POS QUET-1)');
  let VeQR = null, loiVe = '';
  let datBanVe = null;
  try { const goiVe = dung('src/pages/ManQR.jsx', "import React from 'react'; import { renderToStaticMarkup } from 'react-dom/server'; import { VeQR } from './pages/ManQR.jsx'; export { datBanNoiDung } from './noiDung/nd.js'; export const ve = (props) => renderToStaticMarkup(React.createElement(VeQR, props));"); VeQR = goiVe.ve; datBanVe = goiVe.datBanNoiDung; } catch (e) { loiVe = String(e && e.message).split('\n')[0]; }
  if (VeQR) {
    const mac = VeQR({ noiDung: 'TQD-DEMO-QR' }), bon = VeQR({ noiDung: 'TQD-DEMO-QR', vien: 4 });
    const vb = (h) => (/viewBox="(-?\d+) (-?\d+) (\d+) (\d+)"/.exec(h) || []).slice(1).map(Number);
    const a = vb(mac), b = vb(bon);
    k('B1 VeQR nhận độ rộng viền qua tham số `vien`: mặc định 2 ô (nơi khác — QR trả tiền Theo dõi đơn — giữ nguyên), vien=4 → viền 4 ô quanh mã', a[0] === -2 && b[0] === -4 && b[2] === a[2] + 4 && a[2] === a[3] && b[2] === b[3] && /shape-rendering="crispEdges"/.test(bon) && /fill="#000"/.test(bon));
    k('B1 VeQR có tên đọc cho máy đọc màn hình đọc từ danh mục (mqr.aria); đổi chữ → đổi theo', /aria-label="Mã QR thành viên"/.test(mac) && (() => { datBanVe({ so_ban: 1, gia_tri: { 'mqr.aria': 'Mã của tôi' } }); const x = VeQR({ noiDung: 'A' }); datBanVe(null); return /aria-label="Mã của tôi"/.test(x); })());
  } else { k('B1 dựng được VeQR để thử', false, loiVe); k('B1 VeQR tên đọc', false, loiVe); }
  const mq = boChuThich(doc('src/pages/ManQR.jsx')), css = doc('src/giaoDien/giaoDien.css');
  k('B1 ManQR: viền ≥ 4 ô (hằng VIEN_QUET = 4) chỉ ở màn này; TheoDoiDon gọi VeQR không truyền vien (giữ 2)', /const VIEN_QUET = 4;/.test(mq) && /vien=\{VIEN_QUET\}/.test(mq) && !/vien=/.test(doc('src/pages/TheoDoiDon.jsx')));
  const kq = /\.khung-qr\{([^}]*)\}/.exec(css);
  k('B1 CSS .khung-qr: rộng min(78vw, 320px), nền TRẮNG #fff (kể cả giao diện tối — không đọc biến màu), svg rộng hết thẻ', !!kq && /width:min\(78vw, 320px\)/.test(kq[1]) && /background:#fff;/.test(kq[1]) && !/var\(--tq-card\)/.test(kq[1]) && /\.khung-qr svg\{ display:block; width:100%; height:auto; \}/.test(css));
  k('B2 Wake Lock: ManQR xin navigator.wakeLock.request(\'screen\') khi mở, xin lại khi quay lại tab (visibilitychange), thả khi rời màn; không có trình duyệt hỗ trợ / bị từ chối → bỏ qua không báo lỗi', /navigator\.wakeLock\.request\('screen'\)/.test(mq) && /visibilitychange/.test(mq) && /removeEventListener\('visibilitychange'/.test(mq) && /\.release\(\)/.test(mq) && /!navigator\.wakeLock/.test(mq) && /\}, \(\) => \{\}\)/.test(mq));
  k('B3 dòng nhắc "Tăng độ sáng màn hình để quầy quét nhanh" là mục danh mục mqr.sang, hiện dưới mã; vẫn giữ dòng "Đưa mã này cho nhân viên quầy" + SĐT che', theo.get('mqr.sang')?.macDinh === 'Tăng độ sáng màn hình để quầy quét nhanh' && /<Chu k="mqr\.sang"/.test(mq) && /<Chu k="mqr\.dua"/.test(mq) && /cheSdt\(khach\.sdt\)/.test(mq));

  console.log('Phần 1 — E. Sửa nhỏ (C1 nhớ chương trình, C2 khoá dải quảng cáo, C3 số nợ)');
  // C1 — chạy ĐÚNG hai hàm trong App.jsx với kho giả
  const a0 = doc('src/App.jsx'), iDau = a0.indexOf('const KHOA_CT_MAY'), iCuoi = a0.indexOf('// Điều hướng bằng đường dẫn thật');
  let CT = null;
  if (iDau > 0 && iCuoi > iDau) {
    const khoG = (d = {}, chan = false) => ({ getItem: (x) => { if (chan) throw new Error('chặn'); return x in d ? d[x] : null; }, setItem: (x, v) => { if (chan) throw new Error('chặn'); d[x] = String(v); }, removeItem: (x) => { if (chan) throw new Error('chặn'); delete d[x]; }, d });
    try { CT = (ls) => new Function('localStorage', `${a0.slice(iDau, iCuoi)}\nreturn { docCtMay, ghiCtMay };`)(ls); } catch { CT = null; }
    const nho = khoG({ kh_chuong_trinh: JSON.stringify([{ ma: 'c1', ten: ' Quà sinh nhật ', moTa: 'Tặng 1 ly', loai: 'sinh_nhat', rieng: 'KHÔNG ĐƯỢC ĐỌC' }, { ten: '' }, null, { ten: 'Lạ', loai: 'lạ', moTa: 5 }]) });
    const r1 = CT && CT(nho).docCtMay();
    k('C1 đọc bản nhớ: giữ chương trình hợp lệ ({ ma, ten (cắt khoảng trắng), moTa, loai}), bỏ dòng hỏng / không tên, loai lạ → "khac", moTa sai kiểu → "", KHÔNG mang trường lạ',
      JSON.stringify(r1) === JSON.stringify([{ ma: 'c1', ten: 'Quà sinh nhật', moTa: 'Tặng 1 ly', loai: 'sinh_nhat' }, { ma: undefined, ten: 'Lạ', moTa: '', loai: 'khac' }]), JSON.stringify(r1));
    const hong = [CT(khoG({ kh_chuong_trinh: '{hỏng' })).docCtMay(), CT(khoG({ kh_chuong_trinh: '"abc"' })).docCtMay(), CT(khoG({})).docCtMay(), CT(khoG({}, true)).docCtMay()];
    k('C1 đọc hỏng (JSON hỏng, sai dạng, chưa có, kho bị chặn) → rỗng, không ném', hong.every((x) => Array.isArray(x) && x.length === 0));
    const k2 = khoG({});
    CT(k2).ghiCtMay([{ ma: 'c1', ten: 'A', moTa: 'b', loai: 'khac', dang_bat: true, riengTu: 'x' }]);
    const luu = JSON.parse(k2.d.kh_chuong_trinh || '[]');
    CT(k2).ghiCtMay([]);
    let ne = false; try { CT(khoG({}, true)).ghiCtMay([{ ma: 'x', ten: 'Y', moTa: '', loai: 'khac' }]); } catch { ne = true; }
    k('C1 ghi: chỉ { ma, ten, moTa, loai }; hết chương trình → XOÁ khoá; kho bị chặn không ném (không vỡ)', JSON.stringify(luu) === JSON.stringify([{ ma: 'c1', ten: 'A', moTa: 'b', loai: 'khac' }]) && !('kh_chuong_trinh' in k2.d) && !ne);
  } else { k('C1 tìm thấy hai hàm đọc / ghi chương trình trong App.jsx', false); k('C1 đọc hỏng', false); k('C1 ghi', false); }
  k('C1 App.jsx: state khởi tạo từ bản nhớ (useState(docCtMay)); /chuong-trinh về → thay bằng bản mới VÀ ghi lại; khoá nằm NGOÀI luuMay.js (công khai, không xoá khi đăng xuất)', /useState\(docCtMay\)/.test(app) && /layChuongTrinh\(\)\.then\(\(d\) => \{ const ds = docChuongTrinh\(d\); datChuongTrinh\(ds\); ghiCtMay\(ds\);/.test(app)
    && !/kh_chuong_trinh/.test(doc('src/luuMay.js')));
  const QC = await nap('src/quangCao.js');
  if (QC.chonQuangCao) {
    const BAY = '2026-11-08 09:00:00';
    const GV = (o = {}) => ({ dang_chay: true, bat_dau: '2026-11-08T08:00:00', ket_thuc: '2026-11-08T10:00:00', phan_tram: 30, mon: ['M1'], ...o });
    const ct = [{ ma: 'c1', ten: 'Quà sinh nhật', moTa: 'x', loai: 'sinh_nhat' }];
    const chon = (o) => QC.chonQuangCao({ gioVang: null, chuongTrinh: [], bayGio: BAY, quangCao: [], ...o });
    const pos = chon({ quangCao: [{ chu_dai: '🎁 Mua 1 tặng 1', uu_tien: 1 }] }), gv = chon({ gioVang: GV() }), gvR = chon({ gioVang: GV(), quangCao: [{ id: 'gio_vang', chu_dai: '⏰ GV riêng' }] }), ctr = chon({ chuongTrinh: ct }), mac = chon({});
    k('C2 chonQuangCao trả khoaDai theo LOẠI dòng: lời POS → qc.pos · Giờ vàng App tự viết → qc.dai.gv · Giờ vàng POS viết riêng → qc.pos · chương trình → qc.dai.ct · chữ mặc định → rỗng (dải ẩn)', pos.khoaDai === 'qc.pos' && gv.khoaDai === 'qc.dai.gv' && gvR.khoaDai === 'qc.pos' && ctr.khoaDai === 'qc.dai.ct' && mac.khoaDai === '' && mac.macDinh === true, JSON.stringify([pos.khoaDai, gv.khoaDai, gvR.khoaDai, ctr.khoaDai, mac.khoaDai]));
    k('C2 các khoá khoaDai có thật trong danh mục (qc.dai.gv, qc.dai.ct chữ sửa được · qc.pos khoá pos)', theo.get('qc.dai.gv')?.loai === 'chu' && theo.get('qc.dai.ct')?.loai === 'chu' && theo.get('qc.pos')?.khoaBoi === 'pos');
  } else k('C2 nạp được quangCao.js', false, QC.loiNap);
  const dq = boChuThich(doc('src/components/DaiQuangCao.jsx'));
  k('C2 DaiQuangCao gắn data-nd bằng ndDau(khoa) của dòng đang hiện (không còn cố định qc.pos); App truyền khoa={quangCao.khoaDai}', /\{\.\.\.ndDau\(khoa\)\}/.test(dq) && !/ndDau\('qc\.pos'\)/.test(dq) && /khoa=\{quangCao\.khoaDai\}/.test(app));
  if (H.haNo) {
    const a = H.haNo({ 'src/a.js': 3, 'src/b.js': 1, 'src/c.js': 2 }, { 'src/a.js': 3, 'src/c.js': 0 });
    const txt = H.vietNo(a), doc2 = (() => { const m = {}; for (const d of txt.split('\n')) { const x = /^(\S+) (\d+)$/.exec(d.trim()); if (x) m[x[1]] = +x[2]; } return m; })();
    k('C3 haNo: tệp hết chữ (hoặc không còn trong số đếm) GIỮ dòng với số 0; tệp tăng giữ số cũ; không thêm tệp mới; vietNo ghi dòng 0 và docNo đọc lại được', JSON.stringify(a) === JSON.stringify({ 'src/a.js': 3, 'src/b.js': 0, 'src/c.js': 0 }) && /src\/b\.js 0\n\nsrc\/c\.js 0\n/.test(txt) && doc2['src/b.js'] === 0 && H.haNo({ 'src/x.js': 1 }, { 'src/x.js': 5, 'src/y.js': 4 })['src/x.js'] === 1 && !('src/y.js' in H.haNo({ 'src/x.js': 1 }, { 'src/y.js': 4 })));
  } else k('C3 ha_no_chu.js xuất haNo', false);
  const soNo = H.docNo ? H.docNo(GOC) : null, dem = H.demTatCa ? H.demTatCa(GOC) : {};
  const TUNG_NO = A1.filter((f) => !['src/pages/TracNghiem.jsx', 'src/components/TheMoi.jsx'].includes(f)); // 2 tệp này vốn không có dòng nợ (đã 0 từ trước việc)
  k('C3 no_chu_cung.txt: mọi tệp A1 từng có nợ nay hết chữ cứng GIỮ dòng "<tệp> 0" (không xoá dòng); số nợ khớp số đếm; K10 nhận dòng 0', !!soNo && TUNG_NO.length === 12 && TUNG_NO.every((f) => soNo[f] === 0) && [...new Set([...Object.keys(dem), ...Object.keys(soNo)])].every((f) => (dem[f] || 0) === (soNo[f] || 0))
    && /\(dem\[f\] \|\| 0\)|dem\[f\] \|\| 0/.test(doc('kiem_tra_truoc_khi_giao.js')), JSON.stringify(TUNG_NO.filter((f) => !(soNo && soNo[f] === 0))));
  k('C4 vệt sáng LUÔN chạy: kiểm ở thu_KHUI5g (luật @media ghi đè trong giaoDien.css, ca Chromium reduce → sweepP); demo_*.css KHÔNG bị sửa', /prefers-reduced-motion/.test(doc('src/giaoDien/demo_2.css')) && /\.fx-a, \.fx-a::before\{ animation:none !important; \}/.test(doc('src/giaoDien/demo_2.css')) && /sweepP/.test(css) && /sweepL/.test(css));

  console.log('Phần 2 — Chromium');
  if (process.env.KHONG_TRINH_DUYET === '1') console.log('  BỎ QUA: KHONG_TRINH_DUYET=1 — các ca trong trình duyệt không chạy ở đây');
  else {
    let pw = null;
    try { pw = require('playwright'); } catch { /* không có */ }
    if (!pw) console.log('  BỎ QUA: không có Playwright ở máy này — các ca trong trình duyệt CHƯA chạy');
    else await trinhDuyet(pw);
  }
  console.log(`\n${dat} đạt · ${hong} hỏng`);
  process.exit(hong ? 1 : 0);
})();

const BAY = (g) => `2026-11-08T${g}`;
const SDT = '0901234567';
const MENU_POS = { success: true, data: [{ ma: 'juice_1', ten: 'Nước ép Hồng Tân Sinh', nhom: 'Nước ép', gia: 35000, con_hang: true, ton_cu: false, ton_luc: null, gia_hang: [] }] };
const GHD = { success: true, bay_gio: BAY('09:00:00'), dang_mo: true, nhan_don: true, hom_nay: { mo: '08:00', dong: '22:00' }, mo_lai_luc: null, thong_bao: '', lich_tuan: [], ngay_nghi: [] };
const GVANG = { success: true, dang_chay: true, bat_dau: BAY('08:00:00'), ket_thuc: BAY('21:00:00'), phan_tram: 30, mon: ['juice_1'] };
const HANG = { success: true, data: [{ id: 1, ten: 'Vàng', phan_tram: 10, phan_tram_nhom_dac_biet: 5, thu_bac: 1, chi_cap: false, goi: [{ so_thang: 3, gia: 300000 }] }] };
const KHACH = { sdt: SDT, ten: 'Nguyễn Thị Linh', xung_ho: 'chi', ngay_tao: '2026-01-01 00:00:00', qr: 'TQD-DEMO-QR-0001-ABCDEFGHIJ', dia_chi: '12 Lê Lợi', ngay_sinh: null, so_du_vi: 150000, hang: { id: 1, ten: 'Vàng', phan_tram: 10, phan_tram_nhom_dac_biet: 5, het_han: '2027-01-01T00:00:00' } };

async function trinhDuyet(pw) {
  const esbuild = require('esbuild');
  const LM = await nap('src/luuMay.js');
  let goi = '', cssGoi = '';
  try {
    const kq = esbuild.buildSync({
      stdin: { contents: "import './main.jsx'; import { datBanNoiDung } from './noiDung/nd.js'; window.__datBan = datBanNoiDung;", resolveDir: tep('src'), loader: 'jsx' },
      bundle: true, write: false, outdir: tep('.nhap_thu'), format: 'iife', jsx: 'automatic', logLevel: 'silent', external: ['/anh/*', '/fonts/*'],
      loader: { '.json': 'json', '.svg': 'dataurl', '.webp': 'dataurl', '.png': 'dataurl', '.woff2': 'dataurl' },
      define: { 'process.env.NODE_ENV': '"production"', 'import.meta.env.VITE_POS_API': '""' },
    }).outputFiles;
    goi = kq.find((f) => f.path.endsWith('.js')).text; cssGoi = (kq.find((f) => f.path.endsWith('.css')) || { text: '' }).text; // có CSS thật: ca Mã thành viên đo kích thước / nền
  } catch (e) { k('E1 dựng gói App có datBanNoiDung', false, String(e && e.message).split('\n')[0]); return; }
  const tr = await pw.chromium.launch({ args: ['--no-sandbox'] });
  const URL0 = 'http://kh.test';
  const html = doc('index.html').replace(/<script type="module"[^>]*><\/script>/, '<script src="/bundle.js"></script>').replace(/<link[^>]*(googleapis|gstatic|preload)[^>]*>/g, '').replace('</head>', '<link rel="stylesheet" href="/bundle.css"></head>');
  // `o`: { dn: đã đăng nhập, ct: chương trình POS, ctCho: ms chậm của /chuong-trinh, gio: có bay_gio không, luu: khoá localStorage gieo, wake: giả navigator.wakeLock, tối: giao diện tối }
  async function ca(ten, o, chay) {
    const ctx = await tr.newContext({ viewport: { width: 390, height: 844 }, timezoneId: 'Asia/Ho_Chi_Minh', colorScheme: o.toi ? 'dark' : 'light' });
    const t = await ctx.newPage(), loi = [];
    t.on('pageerror', (e) => loi.push(e.message));
    await t.addInitScript(({ dn, chu, luu, wake }) => {
      try {
        sessionStorage.setItem('kh_da_xem_man_dau', '1');
        if (!sessionStorage.getItem('da_gieo')) { sessionStorage.setItem('da_gieo', '1'); if (dn) { localStorage.setItem('kh_token', 'tok-' + chu.sdt); localStorage.setItem('kh_chu', chu.vet); } for (const [x, v] of Object.entries(luu || {})) localStorage.setItem(x, v); }
      } catch { /* bỏ qua */ }
      if (wake) {
        window.__wake = { xin: 0, tha: 0 };
        Object.defineProperty(navigator, 'wakeLock', { configurable: true, value: { request: (loai) => { window.__wake.xin++; window.__wake.loai = loai; const ds = []; return Promise.resolve({ release() { window.__wake.tha++; ds.forEach((f) => f()); return Promise.resolve(); }, addEventListener: (_, f) => ds.push(f) }); } } });
      }
    }, { dn: !!o.dn, chu: { sdt: SDT, vet: LM.dauVet ? LM.dauVet(SDT) : '' }, luu: o.luu, wake: !!o.wake });
    await t.route(`${URL0}/**`, async (r) => {
      const p = new URL(r.request().url()).pathname, json = (s, x) => r.fulfill({ status: s, contentType: 'application/json', body: JSON.stringify(x) });
      if (p === '/bundle.js') return r.fulfill({ contentType: 'text/javascript', body: goi });
      if (p === '/bundle.css') return r.fulfill({ contentType: 'text/css', body: cssGoi });
      if (!p.startsWith('/api/kh')) return /\.[a-z0-9]+$/.test(p) ? r.fulfill({ status: 204, body: '' }) : r.fulfill({ contentType: 'text/html', body: html });
      const d = p.slice(7);
      if (d === '/gio-hoat-dong') return o.gio === false ? json(500, { error: 'x', code: 'LOI_MAY_CHU' }) : json(200, GHD);
      if (d === '/menu') return json(200, MENU_POS);
      if (d === '/gio-vang') return json(200, o.gv === false ? { success: true, dang_chay: false, bat_dau: null, ket_thuc: null, phan_tram: 0, mon: [] } : GVANG);
      if (d === '/hang') return json(200, HANG);
      if (d === '/chuong-trinh') { if (o.ctCho) await new Promise((x) => setTimeout(x, o.ctCho)); return json(200, { success: true, data: o.ct || [] }); }
      if (d === '/dang-nhap/xin-ma') return json(200, { success: true });
      if (d === '/dang-nhap/xac-minh') return json(400, { error: 'Cần tên', code: 'CAN_TEN' });
      if (d === '/toi') return json(200, { khach: KHACH });
      if (d === '/diem') return json(200, { points: 1250, history: [{ id: 1, reason: 'Hoá đơn #12', type: 'earn', created_at: '2026-11-01T10:00:00', points: 50 }] });
      if (d.startsWith('/voucher')) return json(200, { ma_khach_moi: [], data: [] });
      if (d.startsWith('/don')) return json(200, { success: true, data: [], tong: 0 });
      return json(404, { error: 'chưa giả', code: 'LOI_GIA' });
    });
    t.setDefaultTimeout(6000);
    try { await chay(t, loi); } catch (e) { k(`[${ten}] ca Chromium dừng giữa chừng`, false, String(e && e.message).split('\n')[0]); } finally { await ctx.close(); }
  }
  const mo = async (t, duong) => { await t.goto(URL0 + duong); await t.waitForSelector('.phone'); };
  const chuTrong = (t, sel) => t.evaluate((s) => { const e = document.querySelector(s); return e ? e.innerText.replace(/\s+/g, ' ').trim() : null; }, sel);
  const dau = (t, sel) => t.evaluate((s) => ({ nd: document.querySelectorAll(`${s} [data-nd]`).length, khoa: document.querySelectorAll(`${s} [data-nd-khoa]`).length }), sel);
  const datBan = (t, gt) => t.evaluate((g) => window.__datBan({ so_ban: 9, gia_tri: g }), gt);
  const lamRong = (t) => t.evaluate(() => window.__datBan({ so_ban: 0, gia_tri: {} }));
  try {
    // ── Ưu đãi (chưa đăng nhập) + thẻ mời + banner Giờ vàng ──
    await ca('Ưu đãi khách', { dn: false }, async (t, loi) => {
      await mo(t, '/uudai'); await t.waitForSelector('#rewards .the-moi');
      const v0 = await t.evaluate(() => ({ h1: document.querySelector('#rewards h1')?.textContent, nut: document.querySelector('#rewards .the-moi .nut')?.textContent, brand: document.querySelector('#rewards .the-moi .brand')?.textContent, gv: document.querySelector('#rewards .rw-b')?.textContent, anh: document.querySelector('#rewards .the-moi img')?.getAttribute('src') }));
      const d0 = await dau(t, '#rewards');
      k('E1 Ưu đãi (khách) mặc định như cũ: "Ưu đãi", thẻ mời "Điểm, ví và voucher" + nút "Đăng nhập", ảnh logo nhỏ, nút Giờ vàng; có data-nd (≥ 6) và data-nd-khoa (≥ 1: hạng POS)', v0.h1 === 'Ưu đãi' && v0.brand === 'Điểm, ví và voucher' && v0.nut === 'Đăng nhập' && v0.gv === 'Xem món Giờ vàng →' && /logo-nho/.test(v0.anh || '') && d0.nd >= 6 && d0.khoa >= 1, JSON.stringify({ v0, d0 }));
      await datBan(t, { 'ud.tieuDe': 'Quà tặng', 'ud.moi.nut': 'Vào ngay', 'ud.moi.t': 'Tích điểm nhé', 'ud.moi.anh': '/anh/logo.webp', 'ud.gv.nut': 'Mua giờ vàng' });
      await t.waitForFunction(() => document.querySelector('#rewards h1')?.textContent === 'Quà tặng');
      const v1 = await t.evaluate(() => ({ nut: document.querySelector('#rewards .the-moi .nut')?.textContent, brand: document.querySelector('#rewards .the-moi .brand')?.textContent, gv: document.querySelector('#rewards .rw-b')?.textContent, anh: document.querySelector('#rewards .the-moi img')?.getAttribute('src') }));
      k('E1 bản giả đổi 5 khoá Ưu đãi (tên màn, nút + tiêu đề + ảnh thẻ mời, nút Giờ vàng) → màn đổi theo (ảnh thẻ mời đi theo khoá ud.moi.anh, không còn ảnh riêng trong TheMoi)', v1.nut === 'Vào ngay' && v1.brand === 'Tích điểm nhé' && v1.gv === 'Mua giờ vàng' && /logo\.webp/.test(v1.anh || '') && !/logo-nho/.test(v1.anh || ''), JSON.stringify(v1));
      await lamRong(t);
      await t.waitForFunction(() => document.querySelector('#rewards h1')?.textContent === 'Ưu đãi');
      const v2 = await t.evaluate(() => ({ nut: document.querySelector('#rewards .the-moi .nut')?.textContent, gv: document.querySelector('#rewards .rw-b')?.textContent, anh: document.querySelector('#rewards .the-moi img')?.getAttribute('src') }));
      k('E1 bản rỗng → Ưu đãi như cũ; không lỗi trang', v2.nut === 'Đăng nhập' && v2.gv === 'Xem món Giờ vàng →' && /logo-nho/.test(v2.anh || '') && loi.length === 0, JSON.stringify(v2) + loi.join('|'));
    });
    // ── Ưu đãi (đã đăng nhập) ──
    await ca('Ưu đãi hội viên', { dn: true }, async (t, loi) => {
      await mo(t, '/uudai'); await t.waitForSelector('#rewards .wallet-row'); await t.waitForSelector('#rewards .tx-item');
      const v0 = await t.evaluate(() => ({ h1: document.querySelector('#rewards h1')?.textContent, heads: [...document.querySelectorAll('#rewards .sec-head h2')].map((e) => e.textContent), nhan: [...document.querySelectorAll('#rewards .wallet-box .l')].map((e) => e.textContent), more: document.querySelector('#rewards .more-l span')?.textContent, ten: document.querySelector('#rewards .the-ud .ud-ten')?.textContent, pct: document.querySelector('#rewards .the-ud .ud-giam')?.textContent, hh: document.querySelector('#rewards .the-ud .ud-day span')?.textContent }));
      const d0 = await dau(t, '#rewards');
      k('E1 Ưu đãi (hội viên) mặc định như cũ: "Ưu đãi của tôi", 3 tiêu đề, nhãn điểm / ví, "Xem tất cả", thẻ hội viên (tên, % giảm, hạn thẻ — KH-THE-2); có data-nd (≥ 12) và data-nd-khoa (≥ 5)', v0.h1 === 'Ưu đãi của tôi' && v0.heads.join('|') === 'Nhập mã trên hoá đơn|Ví voucher|Lịch sử điểm' && v0.nhan.join('|') === 'Điểm tích lũy|Số dư ví' && v0.more === 'Xem tất cả'
        && v0.ten === 'Vàng' && v0.pct === 'Giảm 10% mọi đơn hàng' && /^Hết hạn 01\/01\/2027$/.test(v0.hh || '') && d0.nd >= 12 && d0.khoa >= 5, JSON.stringify({ v0, d0 }));
      await datBan(t, { 'ud.tieuDeToi': 'Của tôi nè', 'ud.diem': 'Điểm hiện có', 'ud.xemTatCa': 'Mở hết', 'ud.the.giam': 'Bớt {phanTram}%', 'ud.the.hetHan': 'Hết hạn thẻ {ngay}', 'ud.lichSu': 'Điểm đã dùng', 'nm.nhanDiem': 'Cộng điểm' });
      await t.waitForFunction(() => document.querySelector('#rewards h1')?.textContent === 'Của tôi nè');
      const v1 = await t.evaluate(() => ({ nhan: document.querySelector('#rewards .wallet-box .l')?.textContent, more: document.querySelector('#rewards .more-l span')?.textContent, ten: document.querySelector('#rewards .the-ud .ud-giam')?.textContent, hh: document.querySelector('#rewards .the-ud .ud-day span')?.textContent, ls: [...document.querySelectorAll('#rewards .sec-head h2')].map((e) => e.textContent)[2], nut: document.querySelector('#rewards .promo-box button')?.textContent }));
      k('E1 bản giả đổi 7 khoá Ưu đãi hội viên (tên màn, nhãn điểm, Xem tất cả, % giảm của thẻ, hạn thẻ, lịch sử, nút Nhận điểm) → đổi theo', v1.nhan === 'Điểm hiện có' && v1.more === 'Mở hết' && v1.ten === 'Bớt 10%' && v1.hh === 'Hết hạn thẻ 01/01/2027' && v1.ls === 'Điểm đã dùng' && v1.nut === 'Cộng điểm', JSON.stringify(v1));
      await lamRong(t);
      await t.waitForFunction(() => document.querySelector('#rewards h1')?.textContent === 'Ưu đãi của tôi');
      k('E1 bản rỗng → như cũ; không lỗi trang', (await chuTrong(t, '#rewards .the-ud .ud-day span')) === 'Hết hạn 01/01/2027' && loi.length === 0, loi.join('|'));
    });
    // ── Tài khoản + Hồ sơ + Hỗ trợ ──
    await ca('Tài khoản', { dn: true }, async (t, loi) => {
      await mo(t, '/taikhoan'); await t.waitForSelector('#account .acc-card');
      const v0 = await t.evaluate(() => ({ h1: document.querySelector('#account h1')?.textContent, nhom: [...document.querySelectorAll('#account .acc-g')].map((e) => e.textContent), out: document.querySelector('#account .acc-out')?.textContent, hoTro: [...document.querySelectorAll('#account .acc-it .t')].map((e) => e.textContent) }));
      const d0 = await dau(t, '#account');
      k('E1 Tài khoản mặc định như cũ: "Tài khoản", nhóm Của tôi / Sức khỏe / Cài đặt, "Đăng xuất"; chưa có liên hệ → KHÔNG có mục Hỗ trợ; có data-nd (≥ 10) và data-nd-khoa (≥ 2)', v0.h1 === 'Tài khoản' && v0.nhom.join('|') === 'Của tôi|Sức khỏe|Cài đặt' && v0.out === 'Đăng xuất' && !v0.hoTro.some((x) => /Hỗ trợ/.test(x)) && d0.nd >= 10 && d0.khoa >= 2, JSON.stringify({ v0, d0 }));
      await datBan(t, { 'tk.tieuDe': 'Của bạn', 'tk.nhomCuaToi': 'Mục của tôi', 'tk.dangXuat': 'Thoát', 'tk.donHang': 'Các đơn', 'ht.zalo': '0901 234 567' });
      await t.waitForFunction(() => document.querySelector('#account h1')?.textContent === 'Của bạn');
      const v1 = await t.evaluate(() => ({ nhom: document.querySelector('#account .acc-g')?.textContent, out: document.querySelector('#account .acc-out')?.textContent, it: [...document.querySelectorAll('#account .acc-it .t')].map((e) => e.textContent) }));
      k('E1 bản giả đổi chữ Tài khoản → đổi theo; điền ht.zalo ở bản cập nhật → mục Hỗ trợ HIỆN (điện thoại / Zalo / email là mục sửa được)', v1.nhom === 'Mục của tôi' && v1.out === 'Thoát' && /^Các đơn/.test(v1.it[0] || '') && v1.it.some((x) => /^Hỗ trợ/.test(x)), JSON.stringify(v1));
      await t.locator('#account .acc-it', { hasText: 'Hỗ trợ' }).click();
      await t.waitForSelector('#support .support-row');
      const ht = await t.evaluate(() => ({ h1: document.querySelector('#support h1')?.textContent, hang: [...document.querySelectorAll('#support .support-row')].map((e) => e.innerText.replace(/\s+/g, ' ').trim()), href: document.querySelector('#support .support-row')?.getAttribute('href'), nd: document.querySelectorAll('#support [data-nd]').length }));
      k('E1 Hỗ trợ: chỉ hàng có giá trị ("Nhắn Zalo 0901 234 567", href zalo.me), tên màn "Liên hệ hỗ trợ", có data-nd (≥ 2)', ht.h1 === 'Liên hệ hỗ trợ' && ht.hang.length === 1 && /^Nhắn Zalo 0901 234 567$/.test(ht.hang[0]) && ht.href === 'https://zalo.me/0901234567' && ht.nd >= 2, JSON.stringify(ht));
      await lamRong(t);
      await t.waitForFunction(() => document.querySelectorAll('#support .support-row').length === 0);
      k('E1 bản rỗng → liên hệ trống lại (hết hàng), không lỗi trang', loi.length === 0, loi.join('|'));
    });
    await ca('Hồ sơ', { dn: true }, async (t, loi) => {
      await mo(t, '/taikhoan/thongtin'); await t.waitForSelector('#profile .pf-card');
      const lay = () => t.evaluate(() => ({ tt: [...document.querySelectorAll('#profile .pf-card > .tt')].map((e) => e.textContent), xh: document.querySelector('#profile .pf-prev span')?.textContent, luu: [...document.querySelectorAll('#profile .hq-b')].map((e) => e.textContent), lbl: [...document.querySelectorAll('#profile label')].map((e) => e.textContent) }));
      const v0 = await lay(), d0 = await dau(t, '#profile');
      k('E1 Hồ sơ mặc định như cũ: 5 thẻ (Quán gọi bạn là, Thông tin, Ngày sinh, Giao hàng, Bảo mật), lời chào xem trước "Chào buổi sáng, chị Linh!", nút Lưu tên / Lưu / Lưu địa chỉ; có data-nd (≥ 20) và data-nd-khoa (≥ 4: xưng hô, tên, SĐT, địa chỉ)', v0.tt.join('|') === 'Quán gọi bạn là|Thông tin|Ngày sinh|Giao hàng|Bảo mật' && /^“Chào buổi sáng, chị Linh!”$/.test(v0.xh || '') && v0.luu.join('|') === 'Lưu tên|Lưu|Lưu địa chỉ' && d0.nd >= 20 && d0.khoa >= 4, JSON.stringify({ v0, d0 }));
      await datBan(t, { 'hs.xh.t': 'Gọi tôi là', 'hs.ten.nut': 'Cập nhật tên', 'hs.dc.nhan': 'Nơi giao', 'hs.bm.t': 'An toàn', 'chao.dau': 'Xin chào' });
      await t.waitForFunction(() => document.querySelector('#profile .pf-card > .tt')?.textContent === 'Gọi tôi là');
      const v1 = await lay();
      k('E1 bản giả đổi 4 khoá Hồ sơ (tiêu đề thẻ, nút, nhãn ô, thẻ Bảo mật) → đổi theo', v1.tt[0] === 'Gọi tôi là' && v1.tt[4] === 'An toàn' && v1.luu[0] === 'Cập nhật tên' && v1.lbl.includes('Nơi giao'), JSON.stringify(v1));
      k('A4 đổi chữ chao.dau thành "Xin chào" (có giờ POS) → xem trước "Xin chào buổi sáng, chị Linh!" — dấu phẩy đúng', /^“Xin chào buổi sáng, chị Linh!”$/.test(v1.xh || ''), v1.xh);
      await lamRong(t);
      await t.waitForFunction(() => document.querySelector('#profile .pf-card > .tt')?.textContent === 'Quán gọi bạn là');
      k('E1 bản rỗng → Hồ sơ như cũ', (await lay()).xh === '“Chào buổi sáng, chị Linh!”' && loi.length === 0, loi.join('|'));
    });
    // A4 — không có giờ POS: không buổi → KHÔNG dấu phẩy sau "Xin chào" (trước đây so `=== 'Chào'` nên "Xin chào" bị thêm phẩy thừa)
    await ca('Hồ sơ không giờ POS', { dn: true, gio: false }, async (t, loi) => {
      await mo(t, '/taikhoan/thongtin'); await t.waitForSelector('#profile .pf-prev span');
      await datBan(t, { 'chao.dau': 'Xin chào' });
      await t.waitForFunction(() => /^“Xin chào/.test(document.querySelector('#profile .pf-prev span')?.textContent || ''));
      const x1 = await chuTrong(t, '#profile .pf-prev span');
      await lamRong(t);
      await t.waitForFunction(() => /^“Chào/.test(document.querySelector('#profile .pf-prev span')?.textContent || ''));
      const x0 = await chuTrong(t, '#profile .pf-prev span');
      k('A4 không biết giờ POS (không có buổi): "Xin chào chị Linh!" KHÔNG có dấu phẩy thừa; mặc định "Chào chị Linh!"; không lỗi trang', x1 === '“Xin chào chị Linh!”' && x0 === '“Chào chị Linh!”' && loi.length === 0, `${x1} / ${x0}`);
    });
    // ── Đăng nhập 3 bước ──
    await ca('Đăng nhập', { dn: false }, async (t, loi) => {
      await mo(t, '/dangnhap'); await t.waitForSelector('#login #sdt');
      const b1 = () => t.evaluate(() => ({ h1: document.querySelector('#login h1')?.textContent, lbl: document.querySelector('#login label')?.textContent, phu: document.querySelector('#login .dn-phu')?.textContent, nut: document.querySelector('#login .checkout-btn')?.textContent, dong: document.querySelector('#login .back-btn')?.getAttribute('aria-label'), alt: document.querySelector('#login .dn-logo')?.getAttribute('alt'), nd: document.querySelectorAll('#login [data-nd]').length }));
      const v0 = await b1();
      k('E1 Đăng nhập bước 1 mặc định như cũ: "Đăng nhập / Đăng ký", "Số điện thoại", "Nhận mã đăng nhập qua Zalo", "Tiếp tục", nút đóng, logo; có data-nd (≥ 4)', v0.h1 === 'Đăng nhập / Đăng ký' && v0.lbl === 'Số điện thoại' && v0.phu === 'Nhận mã đăng nhập qua Zalo' && v0.nut === 'Tiếp tục' && v0.dong === 'Đóng' && v0.alt === 'Tứ Quý Đường' && v0.nd >= 4, JSON.stringify(v0));
      await datBan(t, { 'dn.sdt.t': 'Vào app', 'dn.sdt.nut': 'Đi tiếp', 'dn.sdt.phu': 'Mã gửi qua Zalo', 'dn.ma.t': 'Gõ mã', 'dn.ma.nut': 'Vào', 'dn.ma.guiLaiSau': ' sau {giay}s', 'dn.tt.t': 'Về bạn', 'dn.tt.nut': 'Xong' });
      await t.waitForFunction(() => document.querySelector('#login h1')?.textContent === 'Vào app');
      const v1 = await b1();
      await t.fill('#sdt', SDT); await t.click('#login .checkout-btn');
      await t.waitForSelector('#login .otp-in');
      const b2 = await t.evaluate(() => ({ h1: document.querySelector('#login h1')?.textContent, s: document.querySelector('#login .otp-s')?.textContent, nut: document.querySelector('#login .checkout-btn')?.textContent, re: document.querySelector('#login .otp-re')?.textContent.replace(/\s+/g, ' ').trim(), nd: document.querySelectorAll('#login [data-nd]').length }));
      await t.fill('#login .otp-in', '123456'); await t.click('#login .checkout-btn');
      await t.waitForSelector('#login #ten');
      const b3 = await t.evaluate(() => ({ h1: document.querySelector('#login h1')?.textContent, nut: document.querySelector('#login .checkout-btn')?.textContent, xh: [...document.querySelectorAll('#login .xh')].map((e) => e.textContent).join(','), lbl: [...document.querySelectorAll('#login label')].map((e) => e.textContent), khoa: document.querySelectorAll('#login [data-nd-khoa]').length }));
      k('E1 bản giả đổi 8 khoá Đăng nhập (3 bước) → đổi theo; chữ chờ gửi lại mã đổi qua ndPhan; 7 chữ xưng hô vẫn đủ và gắn data-nd-khoa', v1.h1 === 'Vào app' && v1.nut === 'Đi tiếp' && v1.phu === 'Mã gửi qua Zalo' && b2.h1 === 'Gõ mã' && b2.nut === 'Vào' && /^Gửi lại mã sau \d+s · Đổi số điện thoại$/.test(b2.re || '') && /090 xxx 4567/.test(b2.s || '')
        && b3.h1 === 'Về bạn' && b3.nut === 'Xong' && b3.xh === 'anh,chị,cô,chú,bác,em,bạn' && b3.khoa >= 1, JSON.stringify({ v1, b2, b3 }));
      await lamRong(t);
      await t.waitForFunction(() => document.querySelector('#login h1')?.textContent === 'Thông tin của bạn');
      const b3r = await t.evaluate(() => ({ nut: document.querySelector('#login .checkout-btn')?.textContent, lbl: [...document.querySelectorAll('#login label')].map((e) => e.textContent), q: document.querySelector('#login .otp-re b')?.textContent }));
      k('E1 bản rỗng → bước 3 như cũ: "Hoàn tất", nhãn Tên / Cách xưng hô / địa chỉ, "Quay lại"; không lỗi trang', b3r.nut === 'Hoàn tất' && b3r.lbl.join('|') === 'Tên|Cách xưng hô|Địa chỉ nhận hàng (không bắt buộc)' && b3r.q === 'Quay lại' && loi.length === 0, JSON.stringify(b3r) + loi.join('|'));
    });
    // ── Mã thành viên (B) ──
    await ca('Mã thành viên', { dn: true, wake: true }, async (t, loi) => {
      await mo(t, '/mathanhvien'); await t.waitForSelector('#member .khung-qr svg');
      await t.waitForFunction(() => window.__wake && window.__wake.xin >= 1);
      const m = await t.evaluate(() => {
        const svg = document.querySelector('#member .khung-qr svg'), kh = document.querySelector('#member .khung-qr'), r = svg.getBoundingClientRect();
        return { rong: r.width, ban: window.innerWidth, nen: getComputedStyle(kh).backgroundColor, vb: svg.getAttribute('viewBox'), sdt: document.querySelector('#member .qr-sdt')?.textContent, dua: [...document.querySelectorAll('#member .qr-chu')].map((e) => e.textContent), nd: document.querySelectorAll('#member [data-nd]').length, khoa: document.querySelectorAll('#member [data-nd-khoa]').length, h1: document.querySelector('#member h1')?.textContent };
      });
      const vb = (m.vb || '').split(' ').map(Number);
      k('B1 Mã thành viên ở 390: mã rộng ≥ 70% bề ngang, thẻ nền TRẮNG (rgb(255, 255, 255)) kể cả khi hệ thống đặt giao diện sáng, viền ≥ 4 ô (viewBox bắt đầu −4)', m.rong / m.ban >= 0.7 && m.nen === 'rgb(255, 255, 255)' && vb[0] <= -4 && vb[2] === vb[3], JSON.stringify(m));
      k('B3 dòng nhắc "Tăng độ sáng màn hình để quầy quét nhanh" + giữ "Đưa mã này cho nhân viên quầy" và SĐT che "090 xxx 4567"; tên màn "Mã thành viên"', m.dua.join('|') === 'Đưa mã này cho nhân viên quầy|Tăng độ sáng màn hình để quầy quét nhanh' && m.sdt === '090 xxx 4567' && m.h1 === 'Mã thành viên', JSON.stringify(m));
      k('B4 Mã thành viên có data-nd (≥ 3) và data-nd-khoa (≥ 2: mã QR + SĐT thuộc POS)', m.nd >= 3 && m.khoa >= 2, JSON.stringify({ nd: m.nd, khoa: m.khoa }));
      const w = await t.evaluate(() => ({ ...window.__wake }));
      k('B2 Wake Lock: xin ĐÚNG 1 lần với \'screen\' khi mở màn; chưa thả khi còn ở màn', w.xin === 1 && w.loai === 'screen' && w.tha === 0, JSON.stringify(w));
      await t.click('#member .back-btn');
      await t.waitForFunction(() => window.__wake.tha >= 1, null, { timeout: 3000 }).catch(() => {});
      const w2 = await t.evaluate(() => ({ ...window.__wake }));
      k('B2 rời màn Mã thành viên → thả Wake Lock (release 1 lần); không lỗi trang', w2.tha === 1 && loi.length === 0, JSON.stringify(w2) + loi.join('|'));
    });
    await ca('Mã thành viên tối', { dn: true, toi: true }, async (t) => {
      await mo(t, '/mathanhvien'); await t.waitForSelector('#member .khung-qr svg');
      const nen = await t.evaluate(() => getComputedStyle(document.querySelector('#member .khung-qr')).backgroundColor);
      k('B1 giao diện tối (prefers-color-scheme: dark): thẻ mã VẪN nền trắng', nen === 'rgb(255, 255, 255)', nen);
    });
    await ca('Mã thành viên không Wake Lock', { dn: true }, async (t, loi) => {
      await mo(t, '/mathanhvien'); await t.waitForSelector('#member .khung-qr svg');
      await t.evaluate(() => { try { delete Navigator.prototype.wakeLock; } catch (e) { /* bỏ qua */ } });
      k('B2 trình duyệt không có / không cho Wake Lock → màn vẫn dùng bình thường, không lỗi trang', (await t.evaluate(() => !!document.querySelector('#member .qr-sdt'))) && loi.length === 0, loi.join('|'));
    });
    await ca('Mã thành viên bị từ chối Wake Lock', { dn: true }, async (t, loi) => {
      await t.addInitScript(() => { Object.defineProperty(navigator, 'wakeLock', { configurable: true, value: { request: () => Promise.reject(new Error('NotAllowedError')) } }); });
      await mo(t, '/mathanhvien'); await t.waitForSelector('#member .khung-qr svg'); await t.waitForTimeout(300);
      k('B2 Wake Lock bị từ chối (pin yếu…) → không báo lỗi, màn vẫn hiện mã', loi.length === 0 && (await t.evaluate(() => !!document.querySelector('#member .khung-qr svg'))), loi.join('|'));
    });
    // ── Trắc nghiệm ──
    await ca('Trắc nghiệm', { dn: true }, async (t, loi) => {
      await mo(t, '/tracnghiem'); await t.waitForSelector('#tc .sex-row');
      const gt = () => t.evaluate(() => ({ h1: document.querySelector('#tc h1')?.textContent, k: document.querySelector('#tc .pt-k')?.textContent, meta: [...document.querySelectorAll('#tc .pt-meta span')].map((e) => e.textContent), buoc: document.querySelector('#tc .pt-step-h')?.textContent.replace(/\s+/g, ' ').trim(), sex: [...document.querySelectorAll('#tc .sex b')].map((e) => e.textContent), bat: document.querySelector('#tc .checkout-btn')?.textContent, chin: [...document.querySelectorAll('#tc .sec-head h2')].map((e) => e.textContent), nd: document.querySelectorAll('#tc [data-nd]').length, khoa: document.querySelectorAll('#tc [data-nd-khoa]').length }));
      const v0 = await gt();
      k('E1 Trắc nghiệm giới thiệu mặc định như cũ (tên màn, nhãn, 3 viên, "Bước 1 Bạn là", Nam / Nữ, "Bắt đầu làm bài", "9 thể chất"); có data-nd (≥ 15) và data-nd-khoa (≥ 1: 9 thể chuyên môn)', v0.h1 === 'Trắc nghiệm thể trạng' && v0.k === 'TỨ QUÝ ĐƯỜNG' && v0.meta.join('|') === '60 câu|khoảng 7–8 phút|có kết quả ngay' && v0.buoc === 'BƯỚC 1 Bạn là'.replace('BƯỚC', 'Bước') && v0.sex.join('|') === 'Nam giới|Nữ giới' && v0.bat === 'Bắt đầu làm bài' && v0.chin.includes('9 thể chất') && v0.nd >= 15 && v0.khoa >= 1, JSON.stringify(v0));
      await datBan(t, { 'tn.tieuDe': 'Đo thể trạng', 'tn.batDau': 'Làm ngay', 'tn.nam.t': 'Anh', 'tn.meta2': '8 phút', 'tn.buoc1.b': 'Bạn thuộc giới' });
      await t.waitForFunction(() => document.querySelector('#tc .checkout-btn')?.textContent === 'Làm ngay');
      const v1 = await gt();
      k('E1 bản giả đổi 5 khoá Trắc nghiệm (tên màn, nút, nút Nam, viên nhỏ 2, câu hỏi Bước 1) → đổi theo; nhãn "Bước 1" giữ kiểu viên (không dính kiểu của chữ sau)', v1.bat === 'Làm ngay' && v1.sex[0] === 'Anh' && v1.meta[1] === '8 phút' && /Bạn thuộc giới$/.test(v1.buoc || ''), JSON.stringify(v1));
      await lamRong(t);
      await t.waitForFunction(() => document.querySelector('#tc .checkout-btn')?.textContent === 'Bắt đầu làm bài');
      await t.click('#tc .sex'); await t.click('#tc .checkout-btn'); await t.waitForSelector('#tcq .tc-opt.abcd');
      const q1 = await t.evaluate(() => ({ h1: document.querySelector('#tcq h1')?.textContent, ba: document.querySelector('#tcq .tcq-card .k')?.textContent.replace(/\s+/g, ' ').trim(), luuY: document.querySelector('#tcq .care-disclaimer')?.textContent, nd: document.querySelectorAll('#tcq [data-nd]').length, khoa: document.querySelectorAll('#tcq [data-nd-khoa]').length }));
      await datBan(t, { 'tnl.cau': 'Hỏi {so} trên {tong}', 'tnl.ba': 'Gần đây', 'tnl.luuY': 'Chọn cái giống nhất.', 'tnl.conLai': 'còn ~{so} phút' });
      await t.waitForFunction(() => /^Hỏi 1 trên 60$/.test(document.querySelector('#tcq h1')?.textContent || ''));
      const q2 = await t.evaluate(() => ({ ba: document.querySelector('#tcq .tcq-card .k')?.textContent.replace(/\s+/g, ' ').trim(), luuY: document.querySelector('#tcq .care-disclaimer')?.textContent }));
      k('E1 màn làm bài: mặc định "Câu 1/60", "Trong 3 tháng gần đây … còn khoảng N phút", lưu ý; có data-nd (≥ 5) và data-nd-khoa (câu hỏi chuyên môn); bản giả đổi 4 khoá → đổi theo', q1.h1 === 'Câu 1/60' && /^Trong 3 tháng gần đây(?: · Dành cho (?:nam|nữ))?còn khoảng \d+ phút$/.test(q1.ba.replace(/\s·\s/, ' · ').replace(/\s+còn/, 'còn')) && q1.luuY === 'Chọn mô tả giống bạn nhất trong 3 tháng gần đây. Không có đúng sai.' && q1.nd >= 5 && q1.khoa >= 1
        && /^Gần đây/.test(q2.ba) && /còn ~\d+ phút$/.test(q2.ba) && q2.luuY === 'Chọn cái giống nhất.', JSON.stringify({ q1, q2 }));
      k('E1 Trắc nghiệm không lỗi trang', loi.length === 0, loi.join('|'));
    });
    // ── C1 — banner Trang chủ nhớ chương trình ──
    const CT_POS = [{ ma: 'c1', ten: 'Quà sinh nhật', mo_ta: 'Tặng 1 ly cho khách sinh nhật', loai: 'sinh_nhat' }];
    const NHO = JSON.stringify([{ ma: 'c1', ten: 'Quà sinh nhật', moTa: 'Tặng 1 ly cho khách sinh nhật', loai: 'sinh_nhat' }]);
    const banner = (t) => t.evaluate(() => document.querySelector('.today.fx-a b')?.textContent || null);
    await ca('Banner nhớ chương trình', { dn: false, gv: false, ct: CT_POS, ctCho: 2500, luu: { kh_chuong_trinh: NHO } }, async (t, loi) => {
      await mo(t, '/trangchu'); await t.waitForSelector('.today.fx-a');
      const som = await banner(t);
      k('C1 lần mở sau: banner Trang chủ có NGAY tên chương trình đã nhớ ("Quà sinh nhật"), không nháy câu mặc định trong lúc /chuong-trinh còn chậm (2,5 giây)', som === 'Quà sinh nhật', String(som));
      await t.waitForFunction(() => JSON.parse(localStorage.getItem('kh_chuong_trinh') || '[]').length === 1, null, { timeout: 6000 }).catch(() => {});
      const luu = await t.evaluate(() => JSON.parse(localStorage.getItem('kh_chuong_trinh') || 'null'));
      k('C1 /chuong-trinh về → ghi lại đúng { ma, ten, moTa, loai } (không trường lạ); banner vẫn "Quà sinh nhật"; không lỗi trang', JSON.stringify(luu) === NHO && (await banner(t)) === 'Quà sinh nhật' && loi.length === 0, JSON.stringify(luu) + loi.join('|'));
    });
    await ca('Banner hết chương trình', { dn: false, gv: false, ct: [], luu: { kh_chuong_trinh: NHO } }, async (t) => {
      await mo(t, '/trangchu'); await t.waitForSelector('.today.fx-a');
      await t.waitForFunction(() => !localStorage.getItem('kh_chuong_trinh'), null, { timeout: 6000 }).catch(() => {});
      await t.waitForFunction(() => document.querySelector('.today.fx-a b')?.textContent === 'Hôm nay bạn muốn uống gì?', null, { timeout: 6000 }).catch(() => {});
      k('C1 POS hết chương trình → BỎ bản nhớ (xoá khoá) và banner về chữ mặc định', (await t.evaluate(() => localStorage.getItem('kh_chuong_trinh'))) === null && (await banner(t)) === 'Hôm nay bạn muốn uống gì?', String(await banner(t)));
    });
    await ca('Banner bản nhớ hỏng', { dn: false, gv: false, ct: [], ctCho: 1500, luu: { kh_chuong_trinh: '{hỏng' } }, async (t, loi) => {
      await mo(t, '/trangchu'); await t.waitForSelector('.today.fx-a');
      k('C1 bản nhớ hỏng → coi như rỗng (banner chữ mặc định), không vỡ trang', (await banner(t)) === 'Hôm nay bạn muốn uống gì?' && loi.length === 0, loi.join('|'));
    });
    await ca('Đăng xuất không xoá chương trình', { dn: true, gv: false, ct: CT_POS, luu: { kh_chuong_trinh: NHO } }, async (t) => {
      await mo(t, '/taikhoan'); await t.waitForSelector('#account .acc-out');
      await t.click('#account .acc-out');
      await t.waitForFunction(() => location.pathname === '/trangchu');
      k('C1 khách bấm Đăng xuất → bản nhớ chương trình (thông tin công khai của quán) VẪN còn', (await t.evaluate(() => localStorage.getItem('kh_chuong_trinh'))) !== null);
    });
    // ── C2 — dải quảng cáo gắn đúng khoá theo loại dòng ──
    await ca('Dải quảng cáo khoá', { dn: false, gv: true }, async (t) => {
      await mo(t, '/menu'); await t.waitForSelector('.dai-qc');
      k('C2 dải Giờ vàng (câu App tự viết) gắn data-nd="qc.dai.gv"', (await t.evaluate(() => document.querySelector('.dai-qc-chu')?.getAttribute('data-nd'))) === 'qc.dai.gv');
    });
    await ca('Dải quảng cáo chương trình', { dn: false, gv: false, ct: CT_POS }, async (t) => {
      await mo(t, '/menu'); await t.waitForSelector('.dai-qc');
      k('C2 dải chương trình đặc biệt gắn data-nd="qc.dai.ct" (câu "🎁 {ten}" sửa được; tên do POS)', (await t.evaluate(() => document.querySelector('.dai-qc-chu')?.getAttribute('data-nd'))) === 'qc.dai.ct');
    });
  } finally { await tr.close(); }
}
