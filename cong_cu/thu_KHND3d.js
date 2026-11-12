#!/usr/bin/env node
// THỬ KH-ND-3d — gom nội dung Kế hoạch + mọi tiện ích (lịch, bảng việc, Ngày cần nhớ, Sắp tới, Theo mùa, Văn khấn, tiết khí) về danh mục
// `src/noiDung/nd/keHoach.js` + `tienIch.js` (mọi chữ đọc qua nd()), lịch cố định ở `src/noiDung/coDinh/lich.js` + sửa nhỏ B1 (ô ẩn thì đường dẫn không mở),
// B2 (cột giá theo hạng không cắt chữ 'đ' cứng), B3 (`tel:` chỉ số). Phần 1 luôn chạy (kể cả KHONG_TRINH_DUYET=1): danh mục hợp lệ, chữ gốc còn nguyên
// (chu_goc.json trích từ bản trước việc), tệp A1 hết chữ cứng, mọi khoá có chỗ dùng + chỗ gắn, macDinh khớp demo, bài khấn điền đủ chỗ, B1 / B2 / B3.
// Phần 2: App thật trong Chromium + POS giả — bản giả đổi khoá → màn đổi; bản rỗng → như cũ; xưng hô "anh" mở /kehoach/chuky → về /kehoach.
// Chạy: node cong_cu/thu_KHND3d.js → dòng cuối "n đạt · m hỏng". Không có Playwright / KHONG_TRINH_DUYET=1 → phần 2 BỎ QUA (không tính hỏng).
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
const bang = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const thoat = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const duyet = (d, ra = []) => { for (const f of fs.readdirSync(tep(d), { withFileTypes: true })) { const p = `${d}/${f.name}`; if (f.isDirectory()) { if (!/noiDung|kiemKhop/.test(p)) duyet(p, ra); } else if (/\.jsx?$/.test(f.name)) ra.push(p); } return ra; };

// Dựng một thành phần của app thành CommonJS rồi vẽ ra HTML tĩnh (react-dom/server).
function dung(tepNguon, xuat) {
  const esbuild = require('esbuild');
  const kq = esbuild.buildSync({
    stdin: { contents: xuat, resolveDir: tep('src'), loader: 'jsx' },
    bundle: true, platform: 'node', format: 'cjs', jsx: 'automatic', write: false, logLevel: 'silent', loader: { '.json': 'json', '.css': 'empty', '.svg': 'dataurl', '.webp': 'dataurl', '.png': 'dataurl' }, define: { 'process.env.NODE_ENV': '"production"' },
  });
  const m = { exports: {} };
  new vm.Script(`(function (module, exports, require) {${kq.outputFiles[0].text}\n})`, { filename: tepNguon }).runInThisContext()(m, m.exports, require);
  return m.exports;
}
// Mỗi gói dựng riêng có BẢN nd.js riêng → trả cả `datBan` của đúng gói đó (đổi nội dung ở gói khác không ảnh hưởng).
const goiVe = (tepNguon, ten = 'default') => dung(tepNguon, `import React from 'react'; import { renderToStaticMarkup } from 'react-dom/server'; import { ${ten === 'default' ? 'default as T' : ten + ' as T'} } from './${tepNguon}'; import { datBanNoiDung } from './noiDung/nd.js'; export const ve = (props) => renderToStaticMarkup(React.createElement(T, props)); export const datBan = datBanNoiDung;`);
const boDau = (h) => h.replace(/ data-nd(-khoa)?="[^"]*"/g, '');

// Tệp A1 (phiếu): số chữ cứng phải bằng 0.
const A1 = [
  'src/pages/KeHoach.jsx', 'src/pages/TienIch.jsx', 'src/components/BangNgay.jsx', 'src/components/BangQuaHan.jsx', 'src/components/BanhXoay.jsx', 'src/components/NguoiThan.jsx',
  'src/components/VanKhanMan.jsx', 'src/components/DaiNhacViec.jsx', 'src/components/HoiXoa.jsx', 'src/components/BangNoi.jsx', 'src/components/KhoaTienIch.jsx',
  'src/kehoach.js', 'src/kehoachLap.js', 'src/lich.js', 'src/vanKhan.js', 'src/components/GiaMon.jsx',
];
// Khoá cố ý KHÔNG có `data-nd` / `<Chu>` (chữ đi vào chỗ không có phần tử riêng) → nhóm lý do.
const KHONG_GAN = {
  'thông báo nổi hoặc lời lỗi do hàm trả về (Thongbao.jsx nhận chuỗi, ngoài Phạm vi)': ['kh.daXoaHet', 'kh.khongXoaDuoc', 'kh.loiKho', 'kh.boDau', 'kh.daXong', 'kh.daBatNhac', 'kh.daTatNhac', 'bn.nhapTen', 'bn.daDay', 'bn.daThem', 'bn.daThemNgay',
    'bn.chuaLuu', 'bn.daLuu', 'bn.daXoa', 'qh.daLam', 'qh.daDanhDau', 'qh.daDoiHom', 'qh.daDoiMai', 'qh.daDoiHet', 'ngt.nhapTen', 'ngt.daDay', 'ngt.ngayLoi', 'ngt.daLuu', 'ngt.daThem'],
  'aria-label hoặc placeholder (không có phần tử chữ)': ['kh.timGoiY', 'kh.timAria', 'kh.thangTruoc', 'kh.thangSau', 'bn.nhan', 'bn.boXongAria', 'bn.xongAria', 'bn.goiY', 'bn.tenAria', 'bn.soLan', 'bn.denNgayAria', 'hx.aria',
    'bx.gio', 'bx.phut', 'bx.soNgay', 'bx.gioNhac', 'bx.phutNhac', 'bx.ngay', 'bx.thang', 'bx.nam', 'qh.nhan', 'ngt.nhan', 'ngt.tenAria', 'ngt.tenGoiY', 'ngt.namAria', 'ngt.namGoiY', 'vk.nmGoiY', 'vk.chuNho', 'vk.chuTo'],
  'hàm thuần trả chuỗi (kehoach.js · kehoachLap.js · vanKhan.js): chữ ghép sẵn, chỗ hiện gắn data-nd theo khối bao ngoài': ['kh.thuHomNay', 'kh.thangNam', 'kh.nhuan', 'kh.namCC', 'kh.thangNgayCC', 'kh.chipTiet', 'kh.tietBatDau', 'kh.tietMai',
    'kh.tietCon', 'kh.leAm', 'kh.calDuong', 'kh.calAm', 'kh.conHom', 'kh.conNgay', 'kh.caNgay', 'kh.tagViec', 'kh.tagGio', 'kh.tagSn', 'kh.tagCung', 'kh.tagLe', 'kh.gioTen', 'kh.snTen', 'kh.tronTuoi', 'kh.badgeMua', 'kh.badgeNg',
    'kh.badgeNay', 'kh.badgeBoTienTo', 'kh.alRam', 'kh.alMung', 'kh.alNgay', 'kh.alThang', 'kh.alNhuan', 'kh.alThieu', 'kh.nhacNguoi0', 'kh.nhacNguoi1', 'kh.nhacNguoi2', 'kh.nhacNguoi3', 'lap.sau', 'lap.moi', 'lap.dvNgay',
    'lap.dvTuan', 'lap.dvThang', 'lap.dvNam', 'lap.hangNgay', 'lap.hangTuan', 'lap.hangThang', 'lap.hangNam', 'lap.tu', 'lap.den', 'lap.chuaHan', 'lap.hanNay', 'lap.quaHan', 'lap.han', 'lap.nhacDung', 'lap.nhacTruoc1', 'lap.nhacGio',
    'lap.nhacPhut', 'lap.nhacCung', 'lap.nhacHomTruoc', 'lap.nhacNgay', 'lap.conNgay', 'lap.hom', 'lap.ngayMai', 'lap.dangToi', 'lap.phutNua', 'lap.conGio', 'lap.nhacDai', 'lap.caNgayThuong', 'bn.tietNhan', 'bn.tieuNgay', 'bn.gioChua',
    'bn.gioDat', 'bn.nhacChua', 'bn.nhacDat', 'bn.lapChua', 'bn.lapDat', 'bn.toiTruoc', 'bn.sangCung', 'bn.sauNgay', 'qh.tieuDe', 'qh.phu', 'qh.lo', 'qh.qua', 'dnv.nhieu', 'vk.dongDip', 'vk.ldMung', 'vk.cacCu', 'hx.loaiViec', 'mua.nay'],
  'gắn qua biến (ndDau(khoa) / khoaTieuDe / khoaPhu / ndDau(`vkd.${…}`)) — kiểm bằng ca "mọi chỗ gắn động"': ['kh.tieuDe', 'kh.phu', 'ngc.tieuDe', 'ngc.phuNguoi', 'ngc.phuLe', 'ngc.tabNguoi', 'ngc.tabLe', 'sap.tieuDe', 'sap.phu', 'mua.tieuDe', 'mua.phu', 'vk.tieuDe',
    'vk.phu', 'hx.lap', 'hx.thuong', 'bn.them', 'ngt.loaiGio', 'ngt.loaiSn', 'ngt.formThem', 'ngt.formSua', 'vk.nguoiGio', 'vk.huongLinh', 'vk.khongGio', 'kh.dangNhac', 'kh.coNhac', 'qh.nhan'],
  'chữ của chip / nút nội bộ chỉ nhận children (Chip trong NguoiThan.jsx)': ['ngt.chipSn', 'ngt.chipGio', 'ngt.chipDuong', 'ngt.chipAm'],
  'danh sách dùng ở nhiều chỗ (bảng tra ngày lễ, gợi ý quà, lời khuyên tiết khí) — ca "danh sách có chỗ gắn" kiểm bản giả': ['kh.leAmLich', 'kh.leQua', 'kh.tiet'],
};
const COTIEP = ['kh.o.', 'vkd.', 'mua.nhan.', 'kh.nhacNguoi']; // khoá dựng bằng mẫu `…${id}`: kiểm mẫu có mặt trong mã
const khoaMoi = (m) => /^(kh|lap|bn|hx|bx|qh|dnv|ngc|ngt|sap)\./.test(m.khoa) || /^(mua|vkd)\./.test(m.khoa) || /^vk\.(tieuDe|phu|khongGio|dauDip|dongDip|sapToi|xemLe|nguoiGio|huongLinh|nmGoiY|leVat|daSam|cachSap|vanKhan|chuNho|chuTo|ldMung|cacCu|ghiChuDs|ghiChuBai)$/.test(m.khoa);

(async () => {
  console.log('Phần 1 — A. Danh mục');
  const DM = (await nap('src/noiDung/nd/index.js')).DANH_MUC || [];
  const ND = await nap('src/noiDung/nd.js');
  const KE = (await nap('src/noiDung/nd/keHoach.js')).KE_HOACH || [];
  const TI = (await nap('src/noiDung/nd/tienIch.js')).TIEN_ICH || [];
  const theo = new Map(DM.map((m) => [m.khoa, m]));
  const moi = [...KE, ...TI].filter(khoaMoi);
  const theoLoai = {}; for (const m of moi) theoLoai[m.khoaBoi ? 'khoa' : m.loai] = (theoLoai[m.khoaBoi ? 'khoa' : m.loai] || 0) + 1;
  console.log(`  (keHoach.js: ${KE.length} mục · tienIch.js: ${TI.length} mục · khoá của việc này: ${moi.length} — ${JSON.stringify(theoLoai)})`);
  k('A1 keHoach.js xuất MẢNG ≥ 200 mục (đã điền, gộp vào danh mục chung); mỗi mục có man / ten', KE.length >= 200 && KE.every((m) => theo.get(m.khoa) === m && m.man && m.ten), `${KE.length} mục${ND.loiNap ? ' · ' + ND.loiNap : ''}`);
  k('A1 kiemDanhMuc(TOÀN BỘ danh mục) = 0 lỗi', typeof ND.kiemDanhMuc === 'function' && ND.kiemDanhMuc(DM).length === 0, ND.kiemDanhMuc ? ND.kiemDanhMuc(DM).join(' | ') : 'thiếu hàm');
  k('A1 danh mục không có chữ "nợ" (quán không có công nợ); bản giả "Công nợ" bị bắt', !/nợ/i.test(JSON.stringify([...KE, ...TI])) && /nợ/i.test(JSON.stringify([{ macDinh: 'Công nợ' }])));
  const nd = (x, b) => ND.nd(x, b);
  k('A1 danh mục: 4 khoá ngày lễ / tiết khí / theo mùa / 11 dịp có đủ (kh.leDuong · kh.leAmLich · kh.leQua · kh.tiet · mua.noiDung · vkd.<11 dịp>.ten/le/cach/khan)', ['kh.leDuong', 'kh.leAmLich', 'kh.leQua', 'kh.tiet', 'mua.noiDung'].every((x) => theo.get(x)?.loai === 'danhsach')
    && ['r', 'tao', 'gt', 'tet', 'tt', 'rg', 'tm', 'dn', 'vl', 'ttu', 'gio'].every((d) => ['ten', 'le', 'cach', 'khan'].every((p) => theo.has(`vkd.${d}.${p}`))));
  k('A1 ngày lễ KHÔNG khoá cấu trúc (thêm / bớt được), theo mùa + tiết khí có khoá cấu trúc (mùa / tiết cố định)', !theo.get('kh.leDuong').khoaCauTruc && !theo.get('kh.leAmLich').khoaCauTruc && bang(theo.get('mua.noiDung').khoaCauTruc, ['mua']) && bang(theo.get('kh.tiet').khoaCauTruc, ['tiet']));
  k('A1 bài khấn: `bien` của mỗi dịp = đúng các chỗ {tự điền} có trong bài (không thừa, không thiếu)', ['r', 'tao', 'gt', 'tet', 'tt', 'rg', 'tm', 'dn', 'vl', 'ttu', 'gio'].every((d) => { const m = theo.get(`vkd.${d}.khan`); const c = [...new Set([...m.macDinh.matchAll(/\{(\w+)\}/g)].map((x) => x[1]))]; return bang([...c].sort(), [...(m.bien || [])].sort()) && c.every((x) => ['ten', 'dc', 'ho', 'ld', 'lm', 'ny', 'nyc', 'nm'].includes(x)); }));

  console.log('Phần 1 — A1. Tệp hết chữ cứng, chữ gốc còn nguyên, khoá dùng có trong danh mục');
  let H = {};
  try { H = require(tep('cong_cu/ha_no_chu.js')); } catch { /* thiếu */ }
  const conChu = A1.filter((f) => H.demChuCung(doc(f)) !== 0).map((f) => `${f} (${H.demChuCung(doc(f))})`);
  k(`A1 ${A1.length} tệp A1: số chữ cứng = 0`, typeof H.demChuCung === 'function' && conChu.length === 0, conChu.join(', '));
  const goc = co('viec/KH-ND-3d/chu_goc.json') ? JSON.parse(doc('viec/KH-ND-3d/chu_goc.json')) : {};
  const coDinh = await nap('src/noiDung/coDinh/lich.js');
  const ho = [];
  const them = (x) => { if (typeof x === 'string') ho.push(x.replace(/\s+/g, ' ')); else if (Array.isArray(x)) x.forEach(them); else if (x && typeof x === 'object') Object.values(x).forEach(them); };
  DM.forEach((m) => them(m.macDinh)); them(Object.values(coDinh));
  const tong = Object.values(goc).reduce((a, d) => a + d.length, 0), thieu = [];
  for (const [f, ds] of Object.entries(goc)) for (const s of ds) if (!ho.some((p) => p.includes(s))) thieu.push(`${f}: ${s}`);
  k(`A1 ${tong} chuỗi có dấu của bản gốc (chu_goc.json, trích bằng @babel/parser từ ${Object.keys(goc).length} tệp trước việc) đều còn trong danh mục / coDinh`, tong >= 450 && thieu.length === 0, thieu.slice(0, 4).join(' | '));
  const MA = duyet('src').map(doc).join('\n');
  const dungKhoa = [...new Set([...MA.matchAll(/\b(?:nd|ndPhan|ndNut|ndDs|ndHien|ndDau)\('([\w.]+)'/g)].map((m) => m[1]))].filter((x) => /^(kh|lap|bn|hx|bx|qh|dnv|ngc|ngt|sap|mua|vk|vkd)\./.test(x));
  k(`A1 mọi khoá của nhóm Kế hoạch / tiện ích viết thẳng trong mã (${dungKhoa.length}) đều có trong danh mục`, dungKhoa.length >= 150 && dungKhoa.every((x) => theo.has(x)), dungKhoa.filter((x) => !theo.has(x)).join());
  const dungMapKey = [...MA.matchAll(/'((?:kh|lap|bn|hx|bx|qh|dnv|ngc|ngt|sap|mua|vk)\.[A-Za-z0-9.]+)'/g)].map((m) => m[1]).filter((x) => !theo.has(x));
  k('A1 mọi chuỗi dạng khoá (bảng ánh xạ DAU, KHOA_DON_VI…) trong mã đều có trong danh mục (không khoá mồ côi)', dungMapKey.length === 0, dungMapKey.join());
  const khongDung = moi.filter((m) => !COTIEP.some((p) => m.khoa.startsWith(p)) && !MA.includes(`'${m.khoa}'`)).map((m) => m.khoa);
  k('A1 mỗi khoá của việc này được dùng trong mã (không mục thừa)', khongDung.length === 0, khongDung.join());
  k('A1 khoá dựng bằng mẫu (kh.o.<ô> · vkd.<dịp>.* · mua.nhan.<trường>) có mặt trong mã kèm ndDau', /ndDau\(`kh\.o\.\$\{id\}`\)/.test(MA) && /nd\(`vkd\.\$\{v\.id\}\.ten`\)/.test(MA) && /ndDau\(`vkd\.\$\{v\.id\}\.khan`\)/.test(MA) && /ndDau\(`mua\.nhan\.\$\{f\}`\)/.test(MA));
  const gan = (x) => new RegExp(`(?:ndDau\\(|data-nd="|\\bk=")'?${thoat(x)}['")]`).test(MA) || new RegExp(`ndDau\\('${thoat(x)}'`).test(MA);
  const daCo = new Set(Object.values(KHONG_GAN).flat());
  const chuaGan = moi.filter((m) => !m.khoaBoi && !COTIEP.some((p) => m.khoa.startsWith(p)) && !gan(m.khoa) && !daCo.has(m.khoa)).map((m) => m.khoa);
  k('A1 mỗi khoá chữ mới có `data-nd` / <Chu> trong mã, hoặc khai cờ KHONG_GAN + lý do (CLAUDE.md §11)', chuaGan.length === 0, chuaGan.join());
  const codaGan = [...daCo].filter((x) => gan(x) && !/gắn qua biến/.test(Object.entries(KHONG_GAN).find(([, v]) => v.includes(x))[0]) && !['hx.loaiViec'].includes(x));
  k('A1 cờ KHONG_GAN không che khoá thật ra ĐÃ gắn data-nd (khai thừa → bỏ khỏi danh sách)', codaGan.length === 0, codaGan.join());
  k('A1 khoá mục khoá: kh.lich là khoaBoi tutinh + chỉ đường "Lịch âm — App tự tính", gắn ở thẻ ngày, đầu lịch tháng, thẻ mùa', theo.get('kh.lich')?.khoaBoi === 'tutinh' && /App tự tính/.test(theo.get('kh.lich').chiDuong) && (MA.match(/ndDau\('kh\.lich'\)/g) || []).length >= 3);

  console.log('Phần 1 — A2. macDinh chép nguyên từ demo');
  const demoSrc = doc('thiet_ke/app_kh_demo.html');
  const hangDemo = (ten) => {
    const dau = demoSrc.indexOf(`const ${ten} = `); if (dau < 0) throw new Error('demo không có ' + ten);
    const bd = dau + `const ${ten} = `.length, mo = demoSrc[bd], dong = mo === '{' ? '}' : ']';
    let d = 0, ch = null;
    for (let j = bd; j < demoSrc.length; j++) { const c = demoSrc[j]; if (ch) { if (c === '\\') j++; else if (c === ch) ch = null; continue; } if (c === '"' || c === "'" || c === '`') ch = c; else if (c === mo) d++; else if (c === dong && --d === 0) return vm.runInNewContext('(' + demoSrc.slice(bd, j + 1) + ')'); }
    throw new Error('không đọc được ' + ten);
  };
  const KH = await nap('src/kehoach.js'), L = await nap('src/lich.js'), VKJ = await nap('src/vanKhan.js'), VKM = await nap('src/noiDung/vanKhan.js');
  const SS = Object.fromEntries(ND.ndDs('mua.noiDung').map((z) => [z.mua, { tang: z.tang, an: z.an, uong: z.uong, sh: z.sh, tt: z.tt, han: z.han, p: z.p.split(',') }]));
  const nguon = { SOLAR_HOL: KH.leDuong && KH.leDuong(), LUNAR_HOL: KH.leAmLich && KH.leAmLich(), GIFT_HOL: KH.leCoQua && KH.leCoQua(), SS, SS_F: ['tang', 'an', 'uong', 'sh', 'tt', 'han'].map((f) => [f, nd('mua.nhan.' + f)]), WD: coDinh.WD };
  k('A2 ngày lễ dương / âm, ngày lễ gợi ý quà, 4 mùa + nhãn trường, thứ — đọc từ danh mục / coDinh — giống demo từng byte', Object.keys(nguon).every((t) => bang(nguon[t], hangDemo(t))), Object.keys(nguon).filter((t) => !bang(nguon[t], hangDemo(t))).join());
  const tipsDemo = hangDemo('TERM_TIPS');
  k('A2 lời khuyên 24 tiết khí + mã món (tipTiet / TERM_TIPS) giống demo từng byte; TERM_TIPS giữ dạng mảng 24 phần tử cho tracNghiem.js', L.TERM_TIPS && L.TERM_TIPS.length === 24 && tipsDemo.every((t, i) => bang(L.tipTiet(i), t) && bang(L.TERM_TIPS[i], t)) && !/TERM_TIPS = \[/.test(doc('src/lich.js')));
  const a0 = demoSrc.indexOf('  const VK_OPEN'), a1 = demoSrc.indexOf('  const VKI');
  let vkDemo = null;
  try { const c = vm.createContext({ nextMot15() {}, nextGiaoThua() {}, nextThanhMinh() {} }); vm.runInContext(demoSrc.slice(a0, a1) + '\nthis.VK = VK;', c); vkDemo = c.VK; } catch { /* ca dưới đỏ */ }
  k('A2 11 dịp văn khấn: tên · lễ vật · cách sắp lễ · bài khấn đầy đủ (đọc từ danh mục) giống demo từng byte; phần máy (id, biểu tượng) ở noiDung/vanKhan.js', !!vkDemo && vkDemo.length === 11 && VKM.VK.every((v, i) => v.id === vkDemo[i].id && v.ic === vkDemo[i].ic && !('n' in v) && !('vk' in v)
    && VKJ.tenDip(v) === vkDemo[i].n && VKJ.leVatDip(v) === vkDemo[i].le && VKJ.cachSapDip(v) === vkDemo[i].cach && VKJ.baiKhanDip(v) === vkDemo[i].vk.join('\n')));
  // Bản tham chiếu: thuật toán điền CŨ (trước việc) chạy trên chữ của demo.
  const dienCu = (v, vkd, tt, j) => {
    const lm = L.LUNAR.solar2lunar(...Object.values(L.LUNAR.jdToDate(j)).slice(0, 3)), gia = {
      ten: tt.ten || '', dc: tt.dc || '', ho: tt.ho || '', ld: lm.d <= 10 ? 'mùng ' + lm.d : String(lm.d), lm: coDinh.LNUM[lm.m] || String(lm.m),
      ny: L.LUNAR.yearName(v.newYear ? lm.y + 1 : lm.y), nyc: L.LUNAR.yearName(lm.y), nm: tt.nm || 'các cụ Tổ tiên' };
    return vkd.vk.join('\n').split('\n').map((dong) => dong.split(/\{(\w+)\}/g).map((p, i) => (i % 2 ? { t: gia[p] ?? `{${p}}`, mark: true, p } : { t: p, mark: false })).filter((d) => d.mark || d.t));
  };
  const tt1 = { ten: 'Nguyễn Văn An', dc: '12 Lê Lợi, Q1', ho: 'Nguyễn', nm: 'cụ ông Nguyễn Văn A' }, tt0 = { ten: '', dc: '', ho: '', nm: '' };
  const jTest = [2461000, 2461100, 2461200];
  k('A2 dienBai (đọc bài từ danh mục) cho kết quả y hệt thuật toán điền cũ trên chữ demo: 11 dịp × 3 ngày × (đủ thông tin / thiếu thông tin)', !!vkDemo && VKM.VK.every((v, i) => jTest.every((j) => [tt1, tt0].every((tt) => bang(VKJ.dienBai(v, tt, j), dienCu(v, vkDemo[i], tt, j))))));
  k('A2 bài khấn đã điền không còn chỗ {…} chưa thay (mọi chỗ tự điền có giá trị hoặc đoạn tô màu trống)', VKM.VK.every((v) => VKJ.dienBai(v, tt1, 2461100).every((dong) => dong.every((d) => d.mark || !/[{}]/.test(d.t)))));
  const saiDang = (() => { ND.datBanNoiDung({ so_ban: 1, gia_tri: { 'kh.leAmLich': [{ ngay: '1/1', ten: 'Mùng Một' }, { ngay: '15', ten: 'Sai' }, { ngay: '31/1', ten: 'Quá 30' }, { ngay: '5/13', ten: 'Tháng 13' }, { ngay: '', ten: 'Trống' }, { ngay: '10/3', ten: '' }] } }); const b = KH.leAmLich(); const l = KH.thongTinNgay(1, 1, 2026); ND.datBanNoiDung(null); return { b, ok: l.wd >= 0 }; })();
  k('A2 ngày lễ sai dạng (thiếu /, ngày > 30 âm, tháng 13, trống, tên trống) bị BỎ QUA khi hiện — màn không vỡ', bang(saiDang.b, { '1/1': 'Mùng Một' }) && saiDang.ok);
  k('A2 bản lưu cũ kh_kehoach mở như cũ (leNhac tên lễ mặc định vẫn nhận; xe / thuốc / chu kỳ còn)', (() => { const kho = { d: { kh_kehoach: JSON.stringify({ v: 1, viec: [], leNhac: { 'Tết Trung thu': true, 'Lễ lạ': true }, nguoi: [], vk: {}, xe: [], thuoc: [], thuocXong: {}, chuKy: {} }) }, getItem(x) { return this.d[x] ?? null; } }; const b = KH.docKeHoach(() => kho); return b.leNhac['Tết Trung thu'] === true && !b.leNhac['Lễ lạ']; })());

  console.log('Phần 1 — A3 / A4. Lịch cố định, tên xuất');
  k('A3 coDinh/lich.js: WD (7) · CAN (10) · CHI (12) · TERMS (24) · LNUM (13) · MUA (4) · SEASON, KHÔNG nằm trong danh mục; lich.js không còn khai CAN / CHI / TERMS', coDinh.WD?.length === 7 && coDinh.CAN?.length === 10 && coDinh.CHI?.length === 12 && coDinh.TERMS?.length === 24 && coDinh.LNUM?.length === 13 && coDinh.MUA?.length === 4
    && typeof coDinh.SEASON === 'function' && !DM.some((m) => /^(coDinh|lich)\./.test(m.khoa)) && !/const (CAN|CHI|TERMS) = \[/.test(doc('src/lich.js')) && !co('src/noiDung/keHoach.js'));
  const TEN_XUAT = { 'src/kehoach.js': ['homNayTuGio', 'thongTinNgay', 'muaNgay', 'theNgay', 'luoiThang', 'leTrongThang', 'holList', 'conLai', 'ngayNgan', 'dayThang', 'upList', 'coChuKy', 'chuThich', 'keHoachTrong', 'docKeHoach', 'ghiKeHoach', 'xoaKeHoach', 'themViec', 'suaViec',
    'xoaViec', 'doiNhacLe', 'themNguoi', 'suaNguoi', 'xoaNguoi', 'nguoiSapXep', 'tronTuoi', 'datThongTinVk', 'tickLeVat', 'doiNhacDip', 'doiCoChu', 'bangCoNhac', 'thongTinVk', 'themXe', 'suaXe', 'datKmXe', 'xoaXe', 'doiNhacXe', 'ghiXongHang', 'ghiLanSua', 'luuHang',
    'xoaHang', 'datNgayGiay', 'themThuoc', 'xoaThuoc', 'doiNhacThuoc', 'doiUong', 'bayNgayThuoc', 'thuNgayNgan', 'tenTiet', 'thuTrongTuan', 'amLichChu', 'TERM_TIPS', 'CO_CHU', 'TOI_DA_NGUOI', 'TEN_NGUOI_TOI_DA', 'KHOA_KE_HOACH', 'SO_NGAY_SAP_TOI', 'docNgay', 'ngayChuoi', 'viecNgay'],
    'src/lich.js': ['LUNAR', 'TERM_TIPS', 'tietKhiNgay', 'tipTiet'], 'src/vanKhan.js': ['timDip', 'gioSapToi', 'vkNext', 'dipSapXep', 'dienBai', 'tenNganDip', 'tuJd', 'chuConLai', 'tenDip', 'leVatDip', 'cachSapDip', 'baiKhanDip'], 'src/noiDung/vanKhan.js': ['VK', 'MA_DIP'] };
  const thieuXuat = []; for (const [f, ds] of Object.entries(TEN_XUAT)) { const m = await nap(f); for (const x of ds) if (!(x in m)) thieuXuat.push(`${f}:${x}`); }
  k('A4 tên xuất của kehoach.js / lich.js / vanKhan.js / noiDung/vanKhan.js còn nguyên (nơi gọi ngoài Phạm vi không phải sửa)', thieuXuat.length === 0, thieuXuat.join(' '));
  const dongKh = doc('src/kehoach.js').split('\n').length;
  k(`A4 kehoach.js ${dongKh} dòng ≤ 450; phần xe / thuốc / chu kỳ tách sang kehoachXe.js theo việc, kehoach.js \`export … from\` lại`, dongKh <= 450 && co('src/kehoachXe.js') && /from '\.\/kehoachXe\.js'/.test(doc('src/kehoach.js')) && doc('src/kehoachXe.js').split('\n').length < 450);

  console.log('Phần 1 — B. Sửa nhỏ');
  const DK = await nap('src/components/dungKeHoach.js');
  k('B1 ocHien(ô, xưng hô): Chu kỳ ẩn với anh · chú · bác · ông, hiện với chị · em · rỗng; Xe cộ / Uống thuốc / Chu kỳ theo công tắc hien.ocXe · ocThuoc · ocChuKy; ô khác luôn hiện', typeof DK.ocHien === 'function'
    && ['anh', 'chu', 'bac', 'ong'].every((x) => DK.ocHien('chuky', x) === false) && ['chi', 'em', '', undefined].every((x) => DK.ocHien('chuky', x) === true) && DK.ocHien('xeco', 'anh') === true && DK.ocHien('theomua', 'anh') === true
    && ((ND.datBanNoiDung({ so_ban: 1, gia_tri: { 'hien.ocXe': false, 'hien.ocThuoc': false, 'hien.ocChuKy': false } }), true) && DK.ocHien('xeco', 'chi') === false && DK.ocHien('uongthuoc', 'chi') === false && DK.ocHien('chuky', 'chi') === false && DK.ocHien('vankhan', 'chi') === true) && (ND.datBanNoiDung(null), true));
  const tiJsx = doc('src/pages/TienIch.jsx'), khJsx = doc('src/pages/KeHoach.jsx');
  k('B1 MỘT hàm quyết định: KeHoach.jsx và TienIch.jsx cùng gọi ocHien (không còn coChuKy / HIEN_O chép lại); TienIch thay về /kehoach qua prop thayVeLich; App.jsx chỉ truyền thêm thayVeLich', /ocHien\(/.test(khJsx) && /ocHien\(/.test(tiJsx) && !/coChuKy|HIEN_O/.test(khJsx + tiJsx) && /props\.thayVeLich/.test(tiJsx) && /thayVeLich=\{\(\) => thay\(taoDuongDan\('kehoach'\)\)\}/.test(doc('src/App.jsx')));
  const TI_GOI = goiVe('pages/TienIch.jsx'), manTi = TI_GOI.ve, cb = { veLich() {}, moTienIch() {}, homNay: { d: 10, m: 11, y: 2026 } };
  globalThis.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };
  k('B1 TienIch id=chuky: xưng hô "anh" → không vẽ gì (rồi thay về /kehoach); "chị" → màn Chu kỳ; ô tắt ở /admin (hien.ocXe) → không vẽ Xe cộ', boDau(manTi({ ...cb, id: 'chuky', xungHo: 'anh' })) === '' && boDau(manTi({ ...cb, id: 'chuky', xungHo: 'chi' })).includes('Chu kỳ')
    && ((TI_GOI.datBan({ so_ban: 1, gia_tri: { 'hien.ocXe': false } }), boDau(manTi({ ...cb, id: 'xeco', xungHo: 'chi' }))) === '') && (TI_GOI.datBan(null), boDau(manTi({ ...cb, id: 'xeco', xungHo: 'chi' })).includes('Xe cộ')));
  const DD = await nap('src/dinhDang.js');
  k('B2 dinhDangSoTien(25000) = "25.000" (số có dấu chấm, không đơn vị), không phải số → ""; dinhDangGia vẫn kèm đơn vị', DD.dinhDangSoTien?.(25000) === '25.000' && DD.dinhDangSoTien?.('x') === '' && DD.dinhDangSoTien?.(NaN) === '' && DD.dinhDangGia(25000) === '25.000đ');
  ND.datBanNoiDung({ so_ban: 1, gia_tri: { 'gia.donVi': 'VNĐ' } });
  const giaVND = [DD.dinhDangGia(25000), DD.dinhDangSoTien(25000)];
  ND.datBanNoiDung({ so_ban: 1, gia_tri: { 'gia.donVi': ' VNĐ' } }); // 4 ký tự > toiDa 3 của mục → bị bỏ, về 'đ' (phiếu ghi ví dụ ' VNĐ')
  const giaQuaDai = DD.dinhDangGia(25000);
  ND.datBanNoiDung(null);
  k('B2 đối chứng: bản giả gia.donVi = "VNĐ" làm dinhDangGia thành "25.000VNĐ" nhưng dinhDangSoTien vẫn "25.000" (đổi đơn vị ở /admin không ảnh hưởng cột giá hạng); " VNĐ" (4 ký tự, quá toiDa 3) bị bỏ về "đ"', bang(giaVND, ['25.000VNĐ', '25.000']) && giaQuaDai === '25.000đ', JSON.stringify([giaVND, giaQuaDai]));
  const GM = goiVe('components/GiaMon.jsx', 'BacGia'), BacGia = GM.ve;
  const bac = [{ ten: 'Thường', gia: 35000, laToi: false }, { ten: 'Vàng', gia: 31500, laToi: true }];
  const hBac0 = boDau(BacGia({ bac }));
  GM.datBan({ so_ban: 1, gia_tri: { 'gia.donVi': 'VNĐ' } });
  const hBac1 = boDau(BacGia({ bac }));
    GM.datBan(null);
  k('B2 bản nội dung giả gia.donVi = "VNĐ" → cột giá theo hạng vẫn chỉ có số ("35.000", "31.500"), không "VNĐ" / "đ"; bản mặc định cũng chỉ số', /<b>35\.000<\/b>/.test(hBac1) && /<b>31\.500<\/b>/.test(hBac1) && !/VNĐ|đ</.test(hBac1) && /<b>35\.000<\/b>/.test(hBac0) && !/>35\.000đ</.test(hBac0));
  const tdd = doc('src/pages/TheoDoiDon.jsx');
  const dongTel = tdd.split('\n').filter((d) => d.includes('href={`tel:'));
  k('B3 TheoDoiDon: nút gọi quán dùng tel: chỉ số và dấu + (như HoTro.jsx); bản giả "0901 234 567" ra "0901234567"', dongTel.length === 1 && /\.replace\(\/\[\^\\d\+\]\/g, ''\)/.test(dongTel[0]) && '0901 234 567'.replace(/[^\d+]/g, '') === '0901234567' && /replace\(\/\[\^\\d\+\]\/g/.test(doc('src/pages/HoTro.jsx')));

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
const GHD = { success: true, bay_gio: BAY('09:00:00'), dang_mo: true, nhan_don: true, hom_nay: { mo: '08:00', dong: '22:00' }, mo_lai_luc: null, thong_bao: '', lich_tuan: [], ngay_nghi: [] };
const KHACH = (xung) => ({ sdt: SDT, ten: 'Nguyễn Thị Linh', xung_ho: xung, ngay_tao: '2026-01-01 00:00:00', qr: 'TQD-DEMO-QR-0001-ABCDEFGHIJ', dia_chi: '12 Lê Lợi', ngay_sinh: null, so_du_vi: 150000, hang: { id: 1, ten: 'Vàng', phan_tram: 10, phan_tram_nhom_dac_biet: 5, het_han: '2027-01-01T00:00:00' } });

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
    goi = kq.find((f) => f.path.endsWith('.js')).text; cssGoi = (kq.find((f) => f.path.endsWith('.css')) || { text: '' }).text;
  } catch (e) { k('E1 dựng gói App có datBanNoiDung', false, String(e && e.message).split('\n')[0]); return; }
  const tr = await pw.chromium.launch({ args: ['--no-sandbox'] });
  const URL0 = 'http://kh.test';
  const html = doc('index.html').replace(/<script type="module"[^>]*><\/script>/, '<script src="/bundle.js"></script>').replace(/<link[^>]*(googleapis|gstatic|preload)[^>]*>/g, '').replace('</head>', '<link rel="stylesheet" href="/bundle.css"></head>');
  // `o`: { xung: xưng hô của khách }
  async function ca(ten, o, chay) {
    const ctx = await tr.newContext({ viewport: { width: 390, height: 844 }, timezoneId: 'Asia/Ho_Chi_Minh' });
    const t = await ctx.newPage(), loi = [];
    t.on('pageerror', (e) => loi.push(e.message));
    await t.addInitScript(({ chu }) => {
      try {
        sessionStorage.setItem('kh_da_xem_man_dau', '1');
        if (!sessionStorage.getItem('da_gieo')) { sessionStorage.setItem('da_gieo', '1'); localStorage.setItem('kh_token', 'tok-' + chu.sdt); localStorage.setItem('kh_chu', chu.vet); }
      } catch { /* bỏ qua */ }
    }, { chu: { sdt: SDT, vet: LM.dauVet ? LM.dauVet(SDT) : '' } });
    await t.route(`${URL0}/**`, async (r) => {
      const p = new URL(r.request().url()).pathname, json = (s, x) => r.fulfill({ status: s, contentType: 'application/json', body: JSON.stringify(x) });
      if (p === '/bundle.js') return r.fulfill({ contentType: 'text/javascript', body: goi });
      if (p === '/bundle.css') return r.fulfill({ contentType: 'text/css', body: cssGoi });
      if (!p.startsWith('/api/kh')) return /\.[a-z0-9]+$/.test(p) ? r.fulfill({ status: 204, body: '' }) : r.fulfill({ contentType: 'text/html', body: html });
      const d = p.slice(7);
      if (d === '/gio-hoat-dong') return json(200, GHD);
      if (d === '/menu') return json(200, { success: true, data: [] });
      if (d === '/gio-vang') return json(200, { success: true, dang_chay: false, bat_dau: null, ket_thuc: null, phan_tram: 0, mon: [] });
      if (d === '/hang') return json(200, { success: true, data: [] });
      if (d === '/chuong-trinh') return json(200, { success: true, data: [] });
      if (d === '/toi') return json(200, { khach: KHACH(o.xung || 'chi') });
      if (d === '/diem') return json(200, { points: 0, history: [] });
      if (d.startsWith('/voucher')) return json(200, { ma_khach_moi: [], data: [] });
      if (d.startsWith('/don')) return json(200, { success: true, data: [], tong: 0 });
      return json(404, { error: 'chưa giả', code: 'LOI_GIA' });
    });
    t.setDefaultTimeout(6000);
    try { await chay(t, loi); } catch (e) { k(`[${ten}] ca Chromium dừng giữa chừng`, false, String(e && e.message).split('\n')[0]); } finally { await ctx.close(); }
  }
  const mo = async (t, duong) => { await t.goto(URL0 + duong); await t.waitForSelector('.phone'); };
  const chuTrong = (t, sel) => t.evaluate((s) => { const e = document.querySelector(s); return e ? e.innerText.replace(/\s+/g, ' ').trim() : null; }, sel);
  const datBan = (t, gt) => t.evaluate((g) => window.__datBan({ so_ban: 9, gia_tri: g }), gt);
  const lamRong = (t) => t.evaluate(() => window.__datBan({ so_ban: 0, gia_tri: {} }));
  try {
    await ca('Kế hoạch + tiện ích', {}, async (t, loi) => {
      await mo(t, '/kehoach'); await t.waitForSelector('#toolGrid .tl');
      const v0 = await t.evaluate(() => ({ h1: document.querySelector('.topbar h1')?.textContent, hom: document.querySelector('.today-btn')?.textContent, ds: document.querySelector('.ds-h')?.textContent, nd: document.querySelectorAll('[data-nd]').length, khoa: document.querySelectorAll('[data-nd-khoa]').length, o: [...document.querySelectorAll('#toolGrid .tl b')].map((b) => b.textContent) }));
      k('E1 Kế hoạch mặc định như cũ: "Kế Hoạch và Nhắc Việc", nút "Hôm nay", "Dưỡng sinh tiết …", 6 ô tiện ích; có data-nd (≥ 15) và data-nd-khoa (≥ 1: lịch App tự tính)', v0.h1 === 'Kế Hoạch và Nhắc Việc' && v0.hom === 'Hôm nay' && /^Dưỡng sinh tiết /.test(v0.ds) && v0.o.length === 6 && v0.nd >= 15 && v0.khoa >= 1, JSON.stringify(v0));
      // ngày đang chọn ở thẻ ngày (hôm nay): thêm đúng ngày đó thành ngày lễ dương trong danh mục
      const ngayChon = await t.evaluate(() => `${document.querySelector('.cal-hero .big').textContent}/${/Tháng (\d+)/.exec(document.querySelector('.cal-hero .my').textContent)[1]}`);
      await datBan(t, { 'kh.tieuDe': 'Kế Hoạch Của Tôi', 'kh.leDuong': [{ ngay: ngayChon, ten: 'Ngày thử nghiệm' }] });
      await t.waitForFunction(() => document.querySelector('.topbar h1')?.textContent === 'Kế Hoạch Của Tôi');
      const v1 = await t.evaluate(() => ({ h1: document.querySelector('.topbar h1')?.textContent, hero: document.querySelector('.ch-hol')?.textContent || '', le: document.querySelector('#calHols')?.innerText || '' }));
      k('E1 bản giả đổi 2 khoá Kế hoạch (tiêu đề, ngày lễ): tiêu đề đổi; ngày lễ mới "Ngày thử nghiệm" hiện ở thẻ ngày và danh sách ngày lễ trong tháng', v1.h1 === 'Kế Hoạch Của Tôi' && /Ngày thử nghiệm/.test(v1.hero) && /Ngày thử nghiệm/.test(v1.le), JSON.stringify(v1));
      await lamRong(t);
      await t.waitForFunction(() => document.querySelector('.topbar h1')?.textContent === 'Kế Hoạch và Nhắc Việc');
      k('E1 bản rỗng → như cũ (tiêu đề, ngày lễ mặc định)', (await chuTrong(t, '#calHols')) !== null && !/Ngày thử nghiệm/.test((await chuTrong(t, '#calHols')) || '') && !/Ngày thử nghiệm/.test((await chuTrong(t, '.ch-hol')) || ''));
      // Văn khấn: đổi một câu bài khấn
      await mo(t, '/kehoach/vankhan/r'); await t.waitForSelector('#vkTxt');
      const bai0 = await chuTrong(t, '#vkTxt');
      await datBan(t, { 'vkd.r.khan': 'Câu thử nghiệm của {ten} ({dc}) họ {ho}.\nNgày {ld} tháng {lm} năm {ny}.' });
      await t.waitForFunction(() => /Câu thử nghiệm/.test(document.querySelector('#vkTxt')?.textContent || ''));
      const bai1 = await chuTrong(t, '#vkTxt'), marks = await t.evaluate(() => document.querySelectorAll('#vkTxt mark').length);
      k('E1 bản giả đổi 1 câu bài khấn (vkd.r.khan): bài đổi, đủ 6 chỗ tự điền vẫn tô màu; bản gốc bắt đầu "Nam mô A Di Đà Phật"', /^Nam mô A Di Đà Phật/.test(bai0) && /^Câu thử nghiệm của/.test(bai1) && marks === 6, `${marks} · ${bai1}`);
      await lamRong(t);
      await t.waitForFunction(() => /^Nam mô/.test(document.querySelector('#vkTxt')?.textContent || ''));
      k('E1 bản rỗng → bài khấn như cũ', (await chuTrong(t, '#vkTxt')) === bai0);
      // Xe cộ: đổi nhãn
      await mo(t, '/kehoach/xeco'); await t.waitForSelector('.topbar h1');
      const xe0 = await chuTrong(t, '.topbar h1');
      await datBan(t, { 'xe.tieuDe': 'Phương tiện' });
      await t.waitForFunction(() => document.querySelector('.topbar h1')?.textContent === 'Phương tiện');
      await lamRong(t);
      await t.waitForFunction(() => document.querySelector('.topbar h1')?.textContent === 'Xe cộ');
      k('E1 bản giả đổi nhãn Xe cộ (xe.tieuDe) → "Phương tiện"; bản rỗng → "Xe cộ"', xe0 === 'Xe cộ');
      k('E1 không lỗi trang', loi.length === 0, loi.join(' | '));
    });
    await ca('Xưng hô anh', { xung: 'anh' }, async (t, loi) => {
      await mo(t, '/kehoach'); await t.waitForSelector('#toolGrid .tl');
      const dai = await t.evaluate(() => history.length);
      await t.evaluate(() => { history.pushState({ kh: 1 }, '', '/kehoach/chuky'); window.dispatchEvent(new PopStateEvent('popstate')); });
      await t.waitForFunction(() => location.pathname === '/kehoach');
      const nhan = await t.evaluate(() => [...document.querySelectorAll('#toolGrid .tl b')].map((b) => b.textContent));
      k('B1 xưng hô "anh" mở /kehoach/chuky → về /kehoach (thay, không kẹt Back), lưới 5 ô không có Chu kỳ', (await t.evaluate(() => location.pathname)) === '/kehoach' && nhan.length === 5 && !nhan.includes('Chu kỳ'), nhan.join());
      void dai;
      await mo(t, '/kehoach/chuky'); await t.waitForFunction(() => location.pathname === '/kehoach');
      k('B1 mở THẲNG /kehoach/chuky (tải lại) với "anh" → về /kehoach', (await t.evaluate(() => location.pathname)) === '/kehoach');
      k('B1 không lỗi trang', loi.length === 0, loi.join(' | '));
    });
    await ca('Xưng hô chị', { xung: 'chi' }, async (t, loi) => {
      await mo(t, '/kehoach/chuky'); await t.waitForSelector('.topbar h1');
      k('B1 xưng hô "chị" mở /kehoach/chuky → màn Chu kỳ (đứng nguyên đường dẫn)', (await chuTrong(t, '.topbar h1')) === 'Chu kỳ' && (await t.evaluate(() => location.pathname)) === '/kehoach/chuky');
      await datBan(t, { 'hien.ocChuKy': false });
      await t.waitForFunction(() => location.pathname === '/kehoach');
      k('B1 ô Chu kỳ tắt ở /admin (hien.ocChuKy = false) khi đang mở → về /kehoach', (await t.evaluate(() => location.pathname)) === '/kehoach');
      k('B1 không lỗi trang', loi.length === 0, loi.join(' | '));
    });
  } finally { await tr.close(); }
}
