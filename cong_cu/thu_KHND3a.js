#!/usr/bin/env node
// THỬ KH-ND-3a — nền "Nội dung sửa được": danh mục khoá (src/noiDung/nd/), hàm nd() + nguồn bản cập nhật, <Chu>, bộ kiểm K10 "chữ cứng chỉ được giảm",
// Trang chủ / thanh tab / màn mở / tên màn / câu báo lỗi đọc qua nd().
// Phần 1 (luôn chạy, kể cả KHONG_TRINH_DUYET=1): hàm thuần, đọc nguồn, bộ kiểm trên bản chép. Phần 2: App thật trong Chromium + POS giả.
// Chạy: node cong_cu/thu_KHND3a.js → dòng cuối "n đạt · m hỏng". Không có Playwright / KHONG_TRINH_DUYET=1 → phần 2 BỎ QUA (không tính hỏng).
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');
const { spawnSync } = require('child_process');
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
const nem = (f) => { try { f(); return ''; } catch (e) { return String(e && e.message); } };

// Dựng một thành phần bằng esbuild + react-dom/server; `them` = mã chèn thêm vào gói (vd define).
function dung(noiDung, define = {}) {
  const esbuild = require('esbuild');
  const kq = esbuild.buildSync({
    stdin: { contents: noiDung, resolveDir: tep('src'), loader: 'jsx' }, bundle: true, platform: 'node', format: 'cjs', jsx: 'automatic', write: false,
    logLevel: 'silent', define: { 'process.env.NODE_ENV': '"production"', ...define },
  });
  const m = { exports: {} };
  new vm.Script(`(function (module, exports, require) {${kq.outputFiles[0].text}\n})`).runInThisContext()(m, m.exports, require);
  return m.exports;
}

const D1 = ['src/pages/TrangChu.jsx', 'src/components/OKeHoach.jsx', 'src/components/OGioVang.jsx', 'src/components/BannerHomNay.jsx', 'src/components/TheMoi.jsx',
  'src/components/OTracNghiem.jsx', 'src/components/ThanhTab.jsx', 'src/components/ManDau.jsx', 'src/components/Man.jsx', 'src/duongDan.js', 'src/dinhDang.js'];
// Khoá demo (data-cms) của Trang chủ / màn mở mà App có khối → phải dùng lại đúng tên (phần sau dấu ":").
const KHOA_DEMO = ['brand.slogan', 'home.sub', 'home.bk', 'home.bb', 'home.gvk', 'home.qk', 'home.qh', 'home.needs', 'home.disc', 'home.fmore', 'home.cala', 'home.calb',
  'today.t', 'today.s', 'today.cta', 'today.bg', 'home.banner', 'home.need'];
const SECS_APP = ['home.member', 'home.cal', 'home.hb', 'home.gv', 'home.quiz', 'home.needs', 'home.feat'];

(async () => {
  console.log('Phần 1 — A. Danh mục');
  for (const f of ['src/noiDung/nd/khungChung.js', 'src/noiDung/nd/trangChu.js', 'src/noiDung/nd/index.js', 'src/noiDung/nd.js', 'src/components/Chu.jsx'])
    k(`A1 có ${f}`, co(f));
  const ND = await nap('src/noiDung/nd.js');
  const DM = (await nap('src/noiDung/nd/index.js')).DANH_MUC || [];
  const theo = new Map(DM.map((m) => [m.khoa, m]));
  k('A1 danh mục gộp có ≥ 80 mục', DM.length >= 80, `${DM.length} mục${ND.loiNap ? ' · ' + ND.loiNap : ''}`);
  k('A1 mỗi tệp nhóm xuất MẢNG mục', Array.isArray((await nap('src/noiDung/nd/khungChung.js')).default || (await nap('src/noiDung/nd/khungChung.js')).KHUNG_CHUNG)
    && Array.isArray((await nap('src/noiDung/nd/trangChu.js')).TRANG_CHU));
  const thieuDemo = KHOA_DEMO.filter((x) => !theo.has(x));
  k('A1 dùng lại khoá demo data-cms (home.needs, home.bb, brand.slogan…)', thieuDemo.length === 0, thieuDemo.join(', '));
  const loaiCo = new Set(DM.filter((m) => !m.khoaBoi).map((m) => m.loai));
  k('A1 đủ 6 loại: chu doan anh nut danhsach battat', ['chu', 'doan', 'anh', 'nut', 'danhsach', 'battat'].every((l) => loaiCo.has(l)), [...loaiCo].join(','));
  k('A1 nút có { chu, dich }: home.bb → Xem Menu → / menu', JSON.stringify(theo.get('home.bb')?.macDinh) === JSON.stringify({ chu: 'Xem Menu →', dich: 'menu' }));
  k('A1 ẩn / hiện: mỗi khối SECS App có một mục battat hien.<mã> (mặc định hiện)', SECS_APP.every((s) => theo.get('hien.' + s)?.loai === 'battat' && theo.get('hien.' + s).macDinh === true),
    SECS_APP.filter((s) => theo.get('hien.' + s)?.loai !== 'battat').join(','));
  const nc = theo.get('home.need');
  const NHU_CAU = (await nap('src/noiDung/nhuCau.js')).NHU_CAU || [];
  k('A1 danhsach nhu cầu: tên lọc món là khoaCauTruc, chữ hiện (nhan) = tên đang chạy', nc?.loai === 'danhsach' && (nc.khoaCauTruc || []).includes('ten')
    && nc.macDinh.length === NHU_CAU.length && nc.macDinh.every((x, i) => x.ten === NHU_CAU[i].ten && x.nhan === NHU_CAU[i].ten && x.anh === NHU_CAU[i].anh));
  k('A1 macDinh = chữ đang chạy: brand.slogan = KHAU_HIEU, home.sub, home.disc, home.bh', theo.get('brand.slogan')?.macDinh === (await nap('src/noiDung/thuongHieu.js')).KHAU_HIEU
    && theo.get('home.sub')?.macDinh === 'Tứ Quý Đường — {khauHieu}' && /^Chỉ mang tính gợi ý theo dịp dùng — TQD/.test(theo.get('home.disc')?.macDinh || '')
    && theo.get('home.bh')?.macDinh === 'Hôm nay bạn muốn\nuống gì?');
  k('A1 bien khai đúng chỗ điền (tab.soMon: so)', JSON.stringify(theo.get('tab.soMon')?.bien) === '["so"]' && /\{so\}/.test(theo.get('tab.soMon')?.macDinh || ''));
  const khoa = DM.filter((m) => m.khoaBoi);
  k('A2 có mục khoá pos + tutinh, mỗi mục có chiDuong', ['pos', 'tutinh'].every((b) => khoa.some((m) => m.khoaBoi === b)) && khoa.every((m) => m.chiDuong && m.man && m.ten));
  k('A2 home.diem.so khoá bởi POS, chỉ đường sang POS', theo.get('home.diem.so')?.khoaBoi === 'pos' && /POS/.test(theo.get('home.diem.so')?.chiDuong || ''));
  k('A3 kiemDanhMuc(toàn bộ danh mục) = 0 lỗi', typeof ND.kiemDanhMuc === 'function' && ND.kiemDanhMuc(DM).length === 0, ND.kiemDanhMuc ? ND.kiemDanhMuc(DM).join(' | ') : 'thiếu hàm');
  if (typeof ND.kiemDanhMuc === 'function') {
    const g = (m) => ({ khoa: 'x.a', man: 'M', ten: 'T', loai: 'chu', macDinh: 'Chào', ...m });
    const loi = (ds) => ND.kiemDanhMuc(ds).join(' | ');
    k('A3 bắt khoá trùng', /trùng/.test(loi([g(), g()])));
    k('A3 bắt thiếu ten / loai / macDinh', /ten/.test(loi([g({ ten: '' })])) && /loai/.test(loi([g({ loai: undefined })])) && /macDinh/.test(loi([g({ macDinh: undefined })])));
    k('A3 bắt bien khai mà macDinh không có {…} và ngược lại', /bien/.test(loi([g({ bien: ['giay'] })])) && /bien/.test(loi([g({ macDinh: 'Gửi lại sau {giay} giây' })])));
    k('A3 bắt toiDa < độ dài mặc định', /toiDa/.test(loi([g({ toiDa: 2 })])));
    k('A3 bắt nut.dich lạ', /dich/.test(loi([g({ loai: 'nut', macDinh: { chu: 'Đi', dich: 'khongco' } })])));
    k('A3 bắt danhsach có trường không khai', /trường/.test(loi([g({ loai: 'danhsach', truong: { ten: 'chu' }, macDinh: [{ ten: 'a', la: 'b' }] })])));
    k('A3 bắt ảnh thiếu tiLe, mục khoá thiếu chiDuong', /tiLe/.test(loi([g({ loai: 'anh', macDinh: '/a.webp' })])) && /chiDuong/.test(loi([{ khoa: 'x.b', man: 'M', ten: 'T', khoaBoi: 'pos' }])));
    k('A3 mục hợp lệ → 0 lỗi (không chặn oan)', loi([g(), g({ khoa: 'x.n', loai: 'nut', macDinh: { chu: 'Đi', dich: 'menu' } }), g({ khoa: 'x.b', loai: 'battat', macDinh: true }),
      g({ khoa: 'x.c', bien: ['so'], macDinh: '{so} món', toiDa: 20 })]) === '');
  }

  console.log('Phần 1 — B. nd() + nguồn');
  if (typeof ND.nd === 'function') {
    k('B1 nd điền biến: tab.soMon {so: 3} → "3 món trong giỏ"', ND.nd('tab.soMon', { so: 3 }) === '3 món trong giỏ', ND.nd('tab.soMon', { so: 3 }));
    k('B1 nd thiếu biến → giữ nguyên {so} (không bịa số)', ND.nd('tab.soMon') === '{so} món trong giỏ');
    k('B1 khoá lạ khi chạy thử → ném lỗi rõ', /không có trong danh mục/.test(nem(() => ND.nd('khong.co'))));
    k('B1 ndNut / ndAnh / ndDs / ndHien trả mặc định', ND.ndNut('home.bb').dich === 'menu' && ND.ndAnh('home.banner') === '/anh/banner-trang-chu.webp'
      && ND.ndDs('home.need').length === NHU_CAU.length && ND.ndHien('hien.home.needs') === true);
    const nghe = []; const bo = ND.ngheNoiDung(() => nghe.push(ND.phienNoiDung()));
    const p0 = ND.phienNoiDung();
    ND.datBanNoiDung({ so_ban: 3, gia_tri: { 'home.needs': 'Nhu cầu của bạn', 'home.bb': { chu: 'Đi Menu', dich: 'uudai' }, 'hien.home.feat': false, 'tab.soMon': '{so} món' } });
    k('B2 bản hợp lệ thay chữ / nút / bật tắt', ND.nd('home.needs') === 'Nhu cầu của bạn' && ND.ndNut('home.bb').dich === 'uudai' && ND.ndHien('hien.home.feat') === false && ND.nd('tab.soMon', { so: 2 }) === '2 món');
    k('B2 báo người nghe, phiên tăng', nghe.length === 1 && ND.phienNoiDung() === p0 + 1);
    ND.datBanNoiDung({ so_ban: 4, gia_tri: { 'home.needs': 5, 'tab.soMon': 'món trong giỏ', 'home.bb': { chu: 'Đi', dich: 'khongco' }, 'hien.home.feat': 'không',
      'home.need': [{ ten: 'Bịa', nhan: 'x', anh: '/a.webp', bieuTuong: 'need-moon' }], 'brand.slogan': 'x'.repeat(500) } });
    k('B2 sai loại / mất chỗ điền / đích lạ / bật tắt sai → macDinh', ND.nd('home.needs') === 'Chăm sóc theo nhu cầu' && ND.nd('tab.soMon', { so: 1 }) === '1 món trong giỏ'
      && ND.ndNut('home.bb').dich === 'menu' && ND.ndHien('hien.home.feat') === true);
    k('B2 danhsach đổi tên lọc (khoaCauTruc) → macDinh; quá toiDa → macDinh', ND.ndDs('home.need')[0].ten === NHU_CAU[0].ten && ND.nd('brand.slogan') === theo.get('brand.slogan').macDinh);
    ND.datBanNoiDung({ so_ban: 5, gia_tri: { 'home.need': NHU_CAU.map((n) => ({ ten: n.ten, nhan: n.ten + '!', anh: n.anh, bieuTuong: n.bieuTuong })) } });
    k('B2 danhsach đổi chữ hiện (giữ tên lọc) → nhận', ND.ndDs('home.need')[0].nhan === NHU_CAU[0].ten + '!');
    ND.datBanNoiDung({ so_ban: 0, gia_tri: {} }); ND.datBanNoiDung(null);
    k('B2 bản rỗng / null → mặc định', ND.nd('home.needs') === 'Chăm sóc theo nhu cầu' && ND.ndDs('home.need')[0].nhan === NHU_CAU[0].ten);
    bo();
    k('B3 ndDau: mục thường → data-nd; mục khoá → thêm data-nd-khoa', JSON.stringify(ND.ndDau('home.needs')) === '{"data-nd":"home.needs"}'
      && ND.ndDau('home.diem.so')['data-nd-khoa'] === 'pos');
  } else k('B1 src/noiDung/nd.js xuất nd()', false, ND.loiNap || '');
  try {
    const goi = dung(`import React from 'react'; import { renderToStaticMarkup } from 'react-dom/server'; import Chu from './components/Chu.jsx';
      export const ve = (p) => renderToStaticMarkup(React.createElement(Chu, p));`);
    k('B3 <Chu k="home.needs" as="h2" /> → <h2 data-nd="home.needs">Chăm sóc theo nhu cầu</h2>', goi.ve({ k: 'home.needs', as: 'h2' }) === '<h2 data-nd="home.needs">Chăm sóc theo nhu cầu</h2>', goi.ve({ k: 'home.needs', as: 'h2' }));
    const that = dung(`import { nd, ndHien } from './noiDung/nd.js'; export const a = () => [nd('khong.co'), ndHien('khong.co')];`, { 'import.meta.env': '{"DEV":false}' });
    k('B1 khoá lạ ở bản dựng thật (import.meta.env.DEV=false) → "" không vỡ màn', JSON.stringify(that.a()) === '["",true]', JSON.stringify(that.a()));
  } catch (e) { k('B3 dựng Chu.jsx / nd.js bằng esbuild', false, String(e && e.message).split('\n')[0]); }
  const app = doc('src/App.jsx');
  k('B2 vỏ App nghe nguồn nội dung ở MỘT chỗ (useSyncExternalStore(ngheNoiDung, phienNoiDung))', (app.match(/ngheNoiDung/g) || []).length === 2 && /useSyncExternalStore\(ngheNoiDung, phienNoiDung\)/.test(app));

  console.log('Phần 1 — C. Bộ kiểm K10');
  let H = {};
  try { H = require(tep('cong_cu/ha_no_chu.js')); } catch { /* thiếu */ }
  if (typeof H.demChuCung === 'function') {
    k('C1 chú thích không tính', H.demChuCung("// Chào bạn\n/* Xin chào */ const a = 1;") === 0);
    k('C1 chuỗi có dấu tính, chuỗi không dấu không tính', H.demChuCung("const a = 'Chào'; const b = \"Menu\"; const c = `${a} món`;") === 2);
    k('C1 chữ JSX tính, thẻ đóng không làm vỡ', H.demChuCung('const X = () => <div className="a">Xem tất cả <b>{n}</b> món</div>;') === 2);
    k('C1 regex có dấu nháy không làm vỡ bộ đếm', H.demChuCung("const r = /['\"`]/g; const s = 'Đúng';") === 1);
    const tam = fs.mkdtempSync(path.join(os.tmpdir(), 'k10-'));
    try {
      for (const f of ['kiem_tra_truoc_khi_giao.js', 'cong_cu/ha_no_chu.js', 'cong_cu/no_chu_cung.txt', 'package.json', 'package-lock.json', 'index.html', 'thiet_ke/app_kh_demo.html',
        'thiet_ke/HOP_DONG_API_KH.md']) { fs.mkdirSync(path.dirname(path.join(tam, f)), { recursive: true }); if (co(f)) fs.copyFileSync(tep(f), path.join(tam, f)); }
      fs.cpSync(tep('src'), path.join(tam, 'src'), { recursive: true });
      const K10 = () => (spawnSync(process.execPath, [path.join(tam, 'kiem_tra_truoc_khi_giao.js')], { cwd: tam, encoding: 'utf8', timeout: 60000 }).stdout || '').split('\n').find((d) => /K10/.test(d)) || '';
      const them = (f, s) => { fs.mkdirSync(path.dirname(path.join(tam, f)), { recursive: true }); fs.appendFileSync(path.join(tam, f), s); };
      const goc = (f) => fs.writeFileSync(path.join(tam, f), doc(f));
      k('C2 K10 xanh trên bản chép của src thật', /✓ K10/.test(K10()), K10());
      them('src/noiDung/moi.js', "export const A = 'Chữ nội dung';\n"); them('src/kiemKhop/moi.js', "export const B = 'Kiểm khớp';\n");
      k('C1 tệp trong src/noiDung, src/kiemKhop không tính', /✓ K10/.test(K10()), K10());
      them('src/pages/HoTro.jsx', "\nexport const CHU_MOI = 'Chữ cứng mới';\n");
      const tang = K10();
      k('C2 thêm chữ cứng vào tệp đang nợ → ĐỎ "chữ cứng mới ở <tệp>: dùng nd()"', /✗ K10/.test(tang) && /chữ cứng mới ở src\/pages\/HoTro\.jsx/.test(tang) && /nd\(\)/.test(tang), tang);
      goc('src/pages/HoTro.jsx'); them('src/components/TepMoi.jsx', "export default () => <b>Tệp mới</b>;\n");
      k('C2 tệp MỚI có chữ cứng → ĐỎ', /✗ K10.*TepMoi\.jsx/.test(K10()), K10());
      fs.rmSync(path.join(tam, 'src/components/TepMoi.jsx'));
      const no = H.docNo(tam) || {};
      const fGiam = Object.keys(no).find((f) => no[f] >= 2 && /\.js$/.test(f));
      const nguon = doc(fGiam);
      const bot = [...nguon.matchAll(/'[^'\n]+'/g)].map((m) => nguon.slice(0, m.index) + "''" + nguon.slice(m.index + m[0].length))
        .find((s) => H.demChuCung(s) === no[fGiam] - 1);
      fs.writeFileSync(path.join(tam, fGiam), bot || nguon);
      const giam = K10();
      k('C2 bớt chữ mà chưa hạ số nợ → ĐỎ "đã giảm … chạy node cong_cu/ha_no_chu.js"', /✗ K10/.test(giam) && /đã giảm/.test(giam) && /ha_no_chu\.js/.test(giam), `${fGiam}: ${giam}`);
      spawnSync(process.execPath, [path.join(tam, 'cong_cu/ha_no_chu.js')], { cwd: tam, encoding: 'utf8' });
      const no2 = H.docNo(tam) || {};
      k('C2 ha_no_chu.js hạ đúng tệp vừa bớt (−1), K10 xanh lại', no2[fGiam] === no[fGiam] - 1 && /✓ K10/.test(K10()), `${no[fGiam]} → ${no2[fGiam]} · ${K10()}`);
      them('src/pages/HoTro.jsx', "\nexport const CHU_MOI = 'Chữ cứng mới';\n"); them('src/components/TepMoi.jsx', "export default () => <b>Tệp mới</b>;\n");
      spawnSync(process.execPath, [path.join(tam, 'cong_cu/ha_no_chu.js')], { cwd: tam, encoding: 'utf8' });
      const no3 = H.docNo(tam) || {};
      k('C2 ha_no_chu.js KHÔNG BAO GIỜ nâng: tệp tăng giữ số cũ, tệp mới không được thêm dòng', no3['src/pages/HoTro.jsx'] === no2['src/pages/HoTro.jsx'] && !('src/components/TepMoi.jsx' in no3) && /✗ K10/.test(K10()));
      fs.writeFileSync(path.join(tam, 'src/pages/HoTro.jsx'), 'export default () => null;\n');
      spawnSync(process.execPath, [path.join(tam, 'cong_cu/ha_no_chu.js')], { cwd: tam, encoding: 'utf8' });
      k('C2 tệp hết chữ → xoá dòng trong số nợ', !('src/pages/HoTro.jsx' in (H.docNo(tam) || {})));
    } catch (e) { k('C2 ca bộ kiểm trên bản chép dừng giữa chừng', false, String(e && e.message).split('\n')[0]); } finally { fs.rmSync(tam, { recursive: true, force: true }); }
    const txt = doc('cong_cu/no_chu_cung.txt');
    const dong = txt.split('\n');
    const coChu = dong.filter((d) => d.trim());
    k('C1 no_chu_cung.txt: mỗi tệp một dòng "<đường dẫn> <số>", sắp theo đường dẫn, giữa hai dòng MỘT dòng trống',
      coChu.length > 0 && coChu.every((d) => /^src\/\S+ \d+$/.test(d)) && JSON.stringify(coChu) === JSON.stringify([...coChu].sort()) && txt === coChu.join('\n\n') + '\n');
    const dem = H.demTatCa(GOC);
    k('C1 số nợ khớp số đếm hiện tại', JSON.stringify(dem) === JSON.stringify(H.docNo(GOC)));
    const bk = doc('kiem_tra_truoc_khi_giao.js');
    k('C2 K10 nằm trong kiem_tra_truoc_khi_giao.js', /K10/.test(bk) && /ha_no_chu/.test(bk));
    console.log('Phần 1 — D. Chuyển mẫu');
    const conChu = D1.filter((f) => H.demChuCung(doc(f)) > 0).map((f) => `${f} (${H.demChuCung(doc(f))})`);
    k('D1 các tệp đã chuyển không còn chữ tiếng Việt viết thẳng (trừ dinhDang.js — phiếu chỉ chuyển lời báo lỗi / lời chào)', conChu.filter((x) => !x.startsWith('src/dinhDang.js')).length === 0, conChu.join(', '));
    const dd = doc('src/dinhDang.js').replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, '');
    const chuoiDD = [...dd.matchAll(/'[^'\n]*'|`[^`]*`/g)].map((m) => m[0]).filter((x) => H.demChuCung(x) > 0);
    k('D1 dinhDang.js: lời báo lỗi + lời chào đã ra danh mục; chỉ còn đơn vị "đ" và "giảm …" (định dạng giá)', chuoiDD.length > 0 && chuoiDD.every((x) => x === "'đ'" || /^`giảm /.test(x)), chuoiDD.join(' | '));
  } else k('C1 cong_cu/ha_no_chu.js xuất demChuCung', false);
  k('D1 noiDung/trangChu.js cũ đã gộp vào danh mục (bỏ tệp)', !co('src/noiDung/trangChu.js'));
  const tc = doc('src/pages/TrangChu.jsx');
  k('D1 Trang chủ không đọc thẳng NHU_CAU / KHAU_HIEU / THE_MOI (qua nd)', !/NHU_CAU|KHAU_HIEU|THE_MOI/.test(tc) && /ndDs\('home\.need'\)/.test(tc));
  k('D1 Trang chủ ẩn / hiện từng khối qua ndHien', SECS_APP.every((s) => tc.includes(`ndHien('hien.${s}')`) || doc('src/components/OGioVang.jsx').includes(`ndHien('hien.${s}')`) || doc('src/components/OTracNghiem.jsx').includes(`ndHien('hien.${s}')`)));
  k('D1 phần POS / tự tính gắn data-nd-khoa (điểm, hạng, Giờ vàng, lịch, quán)', ['home.diem.so', 'home.hang.ten', 'home.quan', 'home.mon'].every((x) => tc.includes(`ndDau('${x}')`))
    && /ndDau\('home\.gv\.so'\)/.test(doc('src/components/OGioVang.jsx')) && /ndDau\('home\.lich'\)/.test(doc('src/components/OKeHoach.jsx')));

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

const BAY = (g) => `2026-10-30T${g}`;
const MENU = { success: true, data: [{ ma: 'juice_1', ten: 'Nước ép Hồng Tân Sinh', nhom: 'Nước ép', gia: 35000, con_hang: true, ton_cu: false, ton_luc: null, gia_hang: [] }] };
const GHD = { success: true, bay_gio: BAY('20:30:00'), dang_mo: true, nhan_don: true, hom_nay: { mo: '08:00', dong: '22:00' }, mo_lai_luc: null, thong_bao: '', lich_tuan: [], ngay_nghi: [] };

async function trinhDuyet(pw) {
  const esbuild = require('esbuild');
  let goi = '';
  try {
    goi = esbuild.buildSync({
      stdin: { contents: "import './main.jsx'; import { datBanNoiDung } from './noiDung/nd.js'; window.__datBan = datBanNoiDung;", resolveDir: tep('src'), loader: 'jsx' },
      bundle: true, write: false, format: 'iife', jsx: 'automatic', logLevel: 'silent', loader: { '.css': 'empty', '.json': 'json' },
      define: { 'process.env.NODE_ENV': '"production"', 'import.meta.env.VITE_POS_API': '""' },
    }).outputFiles[0].text;
  } catch (e) { k('E1 dựng gói App có datBanNoiDung', false, String(e && e.message).split('\n')[0]); return; }
  const tr = await pw.chromium.launch({ args: ['--no-sandbox'] });
  const URL0 = 'http://kh.test';
  const html = doc('index.html').replace(/<script type="module"[^>]*><\/script>/, '<script src="/bundle.js"></script>');
  const ctx = await tr.newContext({ viewport: { width: 390, height: 844 }, timezoneId: 'Asia/Ho_Chi_Minh' });
  const t = await ctx.newPage();
  const loi = [];
  t.on('pageerror', (e) => loi.push(e.message));
  await t.addInitScript(() => { try { sessionStorage.setItem('kh_da_xem_man_dau', '1'); } catch { /* bỏ qua */ } });
  await t.route(`${URL0}/**`, async (r) => {
    const p = new URL(r.request().url()).pathname;
    const json = (s, o) => r.fulfill({ status: s, contentType: 'application/json', body: JSON.stringify(o) });
    if (p === '/bundle.js') return r.fulfill({ contentType: 'text/javascript', body: goi });
    if (!p.startsWith('/api/kh')) return /\.[a-z0-9]+$/.test(p) ? r.fulfill({ status: 204, body: '' }) : r.fulfill({ contentType: 'text/html', body: html });
    const d = p.slice(7);
    if (d === '/gio-hoat-dong') return json(200, GHD);
    if (d === '/menu') return json(200, MENU);
    if (d === '/gio-vang') return json(200, { success: true, dang_chay: false, bat_dau: null, ket_thuc: null, phan_tram: 0, mon: [] });
    if (d === '/hang') return json(200, { success: true, data: [] });
    return json(401, { error: 'Cần đăng nhập', code: 'KH_PHIEN_SAI' });
  });
  t.setDefaultTimeout(4000);
  try {
    await t.goto(`${URL0}/trangchu`);
    await t.waitForSelector('.need-grid');
    const truoc = await t.evaluate(() => ({ nd: document.querySelectorAll('[data-nd]').length, khoa: document.querySelectorAll('[data-nd-khoa]').length,
      h2: document.querySelector('h2[data-nd="home.needs"]')?.textContent, bk: document.querySelector('.hero-banner .k')?.textContent, tab: document.querySelector('.tabbar [data-nd="tab.trangchu"]')?.textContent }));
    k('E1 Trang chủ có phần tử data-nd (≥ 15) và data-nd-khoa', truoc.nd >= 15 && truoc.khoa >= 1, JSON.stringify(truoc));
    k('E1 chữ mặc định như cũ: "Chăm sóc theo nhu cầu", "Tứ Quý Đường", tab "Trang chủ"', truoc.h2 === 'Chăm sóc theo nhu cầu' && truoc.bk === 'Tứ Quý Đường' && truoc.tab === 'Trang chủ', JSON.stringify(truoc));
    await t.evaluate(() => window.__datBan({ so_ban: 2, gia_tri: { 'home.bk': 'Bản mới', 'home.bb': { chu: 'Đi Ưu đãi', dich: 'uudai' }, 'hien.home.needs': false, 'tieuDe.trangchu': 'Nhà' } }));
    await t.waitForFunction(() => document.querySelector('.hero-banner .k')?.textContent === 'Bản mới');
    const sau = await t.evaluate(() => ({ bb: document.querySelector('.hero-banner .b')?.textContent, needs: !!document.querySelector('.need-grid'), tieuDe: document.title }));
    k('E1 bản giả đổi 3 khoá → chữ, nút đổi, khối Nhu cầu ẩn; tên tab trình duyệt đổi', sau.bb === 'Đi Ưu đãi' && !sau.needs && sau.tieuDe === 'Nhà · Tứ Quý Đường', JSON.stringify(sau));
    await t.click('.hero-banner .b');
    await t.waitForFunction(() => location.pathname !== '/trangchu');
    k('E1 nút đi đúng trang đích mới (uudai)', /\/uudai|tiep=%2Fuudai/.test(await t.evaluate(() => location.pathname + location.search)), await t.evaluate(() => location.href));
    await t.goBack();
    await t.evaluate(() => window.__datBan({ so_ban: 0, gia_tri: {} }));
    await t.waitForSelector('.need-grid');
    const ve = await t.evaluate(() => ({ bk: document.querySelector('.hero-banner .k')?.textContent, bb: document.querySelector('.hero-banner .b')?.textContent, tieuDe: document.title }));
    k('E1 bản rỗng → về như cũ', ve.bk === 'Tứ Quý Đường' && ve.bb === 'Xem Menu →' && ve.tieuDe === 'Trang chủ · Tứ Quý Đường', JSON.stringify(ve));
    k('E1 không lỗi trang', loi.length === 0, loi.join(' | '));
  } catch (e) { k('E1 ca Chromium dừng giữa chừng', false, String(e && e.message).split('\n')[0]); } finally { await ctx.close(); await tr.close(); }
}
