/**
 * TQD Sao Lưu Tự Động — BẢN 2 (15.11.2026). Chat App KH giữ mã từ nay (POS đồng ý, thư 15.11 SAOLUU_b). POS cần đổi gì → gửi thư cho App.
 *
 * Cất MỌI bản sao lưu vào Drive `TQD-SAO-LUU` (riêng tư, tài khoản Google của quán). GitHub vẫn là nơi làm việc.
 *   App KH/Noi dung/  nội dung App (GET /api/nd/xuat)         mỗi đêm ~2 giờ   chỉ lưu khi đổi   giữ 7 ngày + 4 tuần + 12 tháng
 *   POS/Du lieu/      dữ liệu POS (GET /api/pos/backup/tu-dong) mỗi đêm ~3 giờ   lưu mỗi đêm       giữ 7 ngày + 4 tuần + 12 tháng
 *   App KH/Ma nguon/  kho tuquyduong/APP-KH (bỏ ảnh chụp thử)  Chủ nhật ~4 giờ  chỉ lưu khi đổi   giữ 4 tuần + 6 tháng
 *   POS/Ma nguon/     kho pos-tuquyduong/pos-tuquyduong (nguyên) Chủ nhật ~4 giờ  chỉ lưu khi đổi   giữ 4 tuần + 6 tháng
 *   App KH/Thiet ke/, POS/Thiet ke/   chat tải lên qua kết nối Google Drive (script chỉ tạo thư mục)
 *   Nhat ky sao luu   (Google Sheet ở thư mục gốc) mỗi lần chạy mỗi phần một dòng
 *
 * KHOÁ: chỉ đọc từ Thuộc tính tập lệnh, KHÔNG bao giờ ghi ra nhật ký / tên tệp.
 *   KHOA_ND  = khoá ndk_… (nếu chưa có tên này, script tự dùng thuộc tính sẵn có mà giá trị bắt đầu "ndk_" — khoá bản 1)
 *   KHOA_POS = khoá posk_… (chủ quán thêm SAU khi POS gộp SAOLUU-DEM-1; chưa có → phần POS/Du lieu "bỏ qua", không tính lỗi)
 *
 * LỖI: mỗi phần chạy riêng (phần này hỏng phần khác vẫn chạy); cuối lượt còn lỗi thì `throw` → Google tự email chủ quán
 *   (Trình kích hoạt › mỗi hẹn giờ › "Thông báo lỗi: Ngay lập tức"). Chạy tốt thì im.
 *
 * CÀI: dán đè toàn bộ mã cũ → Lưu → chọn hàm `caiHenGio` → Chạy (cho phép quyền Drive, Sheets, gọi mạng) → chọn `thuNgay` → Chạy để thử.
 */

const CAI = {
  MUI_GIO: 'Asia/Ho_Chi_Minh',
  GOC: 'TQD-SAO-LUU',
  SO_TAY: 'Nhat ky sao luu',
  THU_LAI: 3,              // số lần thử mỗi cửa
  CHO_GIAY: 20,            // giây chờ giữa hai lần thử
  CHO_TOI_DA_NGAY: 4,      // mã nguồn App: GitHub hạn lượt quá ngần này đêm liền → báo lỗi
  TRAN_GIAY: 300,          // một lượt chạy dừng an toàn trước 6 phút của Google
  CHO_TRONG_MB: 300,       // Drive còn ít hơn → báo lỗi (vẫn cố lưu)
};

const PHAN = {
  ND:     { ten: 'App KH / Noi dung', thu: ['App KH', 'Noi dung'], giu: { ngay: 7, tuan: 4, thang: 12 } },
  POS_DL: { ten: 'POS / Du lieu',     thu: ['POS', 'Du lieu'],      giu: { ngay: 7, tuan: 4, thang: 12 } },
  MN_APP: { ten: 'App KH / Ma nguon', thu: ['App KH', 'Ma nguon'],  giu: { ngay: 0, tuan: 4, thang: 6 } },
  MN_POS: { ten: 'POS / Ma nguon',    thu: ['POS', 'Ma nguon'],     giu: { ngay: 0, tuan: 4, thang: 6 } },
};
const THU_MUC_KHAC = [['App KH', 'Thiet ke'], ['POS', 'Thiet ke']];

const DIA_CHI = {
  ND_XUAT: 'https://www.pos-tuquyduong.io.vn/api/nd/xuat',
  POS_DL: 'https://www.pos-tuquyduong.io.vn/api/pos/backup/tu-dong',
  APP_REFS: 'https://github.com/tuquyduong/APP-KH.git/info/refs?service=git-upload-pack',   // không tính lượt API
  APP_CAY: (sha) => `https://api.github.com/repos/tuquyduong/APP-KH/git/trees/${sha}?recursive=1`,  // 1 lần gọi API / tuần
  APP_RAW: (sha, duong) => `https://raw.githubusercontent.com/tuquyduong/APP-KH/${sha}/${duong.split('/').map(encodeURIComponent).join('/')}`,
  POS_ZIP: 'https://codeload.github.com/pos-tuquyduong/pos-tuquyduong/zip/refs/heads/main',
};
const BO_KHOI_MA_APP = /^viec\/.+\.(png|jpe?g|webp|gif)$/i;   // ảnh chụp thử từng việc (~156 MB) — lịch sử vẫn ở GitHub

// ───────────── Hẹn giờ ─────────────

function caiHenGio() {
  ScriptApp.getProjectTriggers().forEach((t) => ScriptApp.deleteTrigger(t));   // xoá MỌI hẹn cũ (kể cả của bản 1) trước khi cài
  ScriptApp.newTrigger('chay2gio').timeBased().atHour(2).everyDays(1).inTimezone(CAI.MUI_GIO).create();
  ScriptApp.newTrigger('chay3gio').timeBased().atHour(3).everyDays(1).inTimezone(CAI.MUI_GIO).create();
  ScriptApp.newTrigger('chay4gio').timeBased().atHour(4).everyDays(1).inTimezone(CAI.MUI_GIO).create();
  layThuMucPhan_();   // tạo sẵn thư mục + chuyển tệp cũ
  Logger.log('Đã cài 3 hẹn giờ: 2 giờ (nội dung App), 3 giờ (dữ liệu POS), 4 giờ (mã nguồn — Chủ nhật hoặc đêm cần thử lại).');
}

function chay2gio() { chayLuot_(['ND'], false); }
function chay3gio() { chayLuot_(['POS_DL'], false); }
function chay4gio() { chayLuot_(['MN_APP', 'MN_POS'], false); }
/** Thử tay ngay: chạy hết 4 phần, kể cả mã nguồn (không đợi Chủ nhật). Vẫn bỏ qua phần không đổi. */
function thuNgay() { chayLuot_(['ND', 'POS_DL', 'MN_APP', 'MN_POS'], true); }

// ───────────── Một lượt ─────────────

function chayLuot_(dsPhan, epTuan) {
  const batDau = Date.now();
  const loi = [];
  let tm;
  try { tm = layThuMucPhan_(); } catch (e) { ghiNhatKy_('Chung', 'lỗi', '', 0, thongDiep_(e)); throw e; }
  canhChoTrong_(loi);
  for (const ma of dsPhan) {
    if (Date.now() - batDau > CAI.TRAN_GIAY * 1000) { ghiNhatKy_(PHAN[ma].ten, 'bỏ qua', '', 0, 'hết giờ lượt này — đêm sau chạy'); danhDauCho_(ma); continue; }
    try {
      const kq = LAM[ma](tm[ma], epTuan, batDau);
      ghiNhatKy_(PHAN[ma].ten, kq.ket, kq.tep || '', kq.co || 0, kq.ghi || '');
      if (kq.loi) loi.push(`${PHAN[ma].ten}: ${kq.ghi}`);
    } catch (e) {
      const td = thongDiep_(e);
      ghiNhatKy_(PHAN[ma].ten, 'lỗi', '', 0, td);
      loi.push(`${PHAN[ma].ten}: ${td}`);
    }
  }
  if (loi.length) throw new Error('Sao lưu có lỗi — ' + loi.join(' | '));   // Google email chủ quán
}

const LAM = {
  ND: lamNoiDung_,
  POS_DL: lamDuLieuPos_,
  MN_APP: lamMaNguonApp_,
  MN_POS: lamMaNguonPos_,
};

// ───────────── Phần 1: nội dung App ─────────────

function lamNoiDung_(thuMuc) {
  const khoa = docKhoaNd_();
  if (!khoa) return { ket: 'lỗi', loi: true, ghi: 'chưa có khoá ndk_ trong Thuộc tính tập lệnh (KHOA_ND)' };
  const r = goi_(DIA_CHI.ND_XUAT, { Authorization: 'Bearer ' + khoa }, { dungKhi: [401, 403] });
  if (r.ma !== 200) return { ket: 'lỗi', loi: true, ghi: `máy chủ nội dung trả ${r.ma}${r.ma === 401 ? ' (khoá sai / đã thu hồi)' : ''}` };
  const chu = r.res.getContentText('UTF-8');
  let d;
  try { d = JSON.parse(chu); } catch (e) { return { ket: 'lỗi', loi: true, ghi: 'tệp xuất không phải JSON' }; }
  if (!d || d.dinh_dang !== 1 || !Array.isArray(d.ban)) return { ket: 'lỗi', loi: true, ghi: 'tệp xuất sai định dạng (cần dinh_dang 1 + ban[])' };
  const tt = PropertiesService.getScriptProperties();
  if (d.ban.length === 0) {
    if (tt.getProperty('ND_DA_CO') === '1') return { ket: 'lỗi', loi: true, ghi: 'kho nội dung trả RỖNG dù trước đã có bản — không lưu, giữ nguyên bản cũ' };
    return { ket: 'bỏ qua', ghi: 'kho nội dung chưa có bản nào' };
  }
  // So băm phần nội dung thật (bỏ xuat_luc và nhat_ky — mỗi lần xuất nhật ký tự thêm một dòng "xuat")
  const bam = bamChu_(JSON.stringify([d.ban, d.nhap || [], d.anh || []]));
  if (bam === tt.getProperty('ND_BAM')) return { ket: 'bỏ qua', ghi: 'nội dung không đổi' };
  const ten = 'noi_dung_app_' + ngay_('yyyy-MM-dd_HHmm');
  const zip = Utilities.zip([Utilities.newBlob(chu, 'application/json', ten + '.json')], ten + '.zip');
  const tep = thuMuc.createFile(zip);
  const ra = Utilities.unzip(tep.getBlob());   // kiểm đọc lại
  const lai = ra.length === 1 ? JSON.parse(ra[0].getDataAsString('UTF-8')) : null;
  if (!lai || lai.dinh_dang !== 1 || !Array.isArray(lai.ban) || lai.ban.length !== d.ban.length) {
    tep.setTrashed(true);
    return { ket: 'lỗi', loi: true, ghi: 'kiểm lại tệp vừa lưu không khớp — đã bỏ tệp đó' };
  }
  tt.setProperty('ND_BAM', bam);
  tt.setProperty('ND_DA_CO', '1');
  const bo = giuTheoTang_(thuMuc, PHAN.ND.giu, tep.getId());
  return { ket: 'đã lưu', tep: tep.getName(), co: tep.getSize(), ghi: `${d.ban.length} bản${bo ? ` · bỏ ${bo} tệp quá hạn` : ''}` };
}

function docKhoaNd_() {
  const tt = PropertiesService.getScriptProperties();
  const k = tt.getProperty('KHOA_ND');
  if (k) return k.trim();
  const tatCa = tt.getProperties();
  const ung = Object.keys(tatCa).filter((t) => String(tatCa[t]).trim().startsWith('ndk_'));
  return ung.length === 1 ? String(tatCa[ung[0]]).trim() : null;   // khoá bản 1 (tên thuộc tính cũ) — không đổi tên, không in ra
}

// ───────────── Phần 2: dữ liệu POS ─────────────

function lamDuLieuPos_(thuMuc) {
  const k = PropertiesService.getScriptProperties().getProperty('KHOA_POS');
  if (!k) return { ket: 'bỏ qua', ghi: 'chưa có khoá (KHOA_POS) — chờ POS gộp SAOLUU-DEM-1' };
  const r = goi_(DIA_CHI.POS_DL, { Authorization: 'Bearer ' + k.trim() }, { dungKhi: [401, 403] });
  if (r.ma !== 200) {
    const nghia = { 401: ' (khoá sai / đã thu hồi)', 404: ' (cửa chưa có — POS chưa gộp?)', 429: ' (quá 6 lần / giờ)' }[r.ma] || '';
    return { ket: 'lỗi', loi: true, ghi: `POS trả ${r.ma}${nghia}` };
  }
  const blob = r.res.getBlob();   // NHỊ PHÂN — không dùng getContentText (hỏng tệp)
  const ten = 'du_lieu_pos_' + ngay_('yyyy-MM-dd_HHmm') + '.xlsx';
  if (blob.getBytes().length <= 5 * 1024) return { ket: 'lỗi', loi: true, ghi: 'tệp Excel POS ≤ 5 KB — không lưu' };
  if (!coTrongZip_(blob, (n) => n === 'xl/workbook.xml')) return { ket: 'lỗi', loi: true, ghi: 'tệp POS không phải Excel (thiếu xl/workbook.xml) — không lưu' };
  const tep = thuMuc.createFile(blob.setName(ten));
  if (!coTrongZip_(tep.getBlob(), (n) => n === 'xl/workbook.xml')) { tep.setTrashed(true); return { ket: 'lỗi', loi: true, ghi: 'kiểm lại tệp vừa lưu hỏng — đã bỏ tệp đó' }; }
  const bo = giuTheoTang_(thuMuc, PHAN.POS_DL.giu, tep.getId());
  return { ket: 'đã lưu', tep: ten, co: tep.getSize(), ghi: bo ? `bỏ ${bo} tệp quá hạn` : '' };
}

// ───────────── Phần 3: mã nguồn App KH (Chủ nhật) ─────────────

function lamMaNguonApp_(thuMuc, epTuan, batDau) {
  if (!denLuotTuan_('MN_APP', epTuan)) return { ket: 'bỏ qua', ghi: 'chưa tới Chủ nhật' };
  const tt = PropertiesService.getScriptProperties();
  const refs = goi_(DIA_CHI.APP_REFS, {}, {});
  const m = refs.ma === 200 ? /([0-9a-f]{40}) refs\/heads\/main(?:\n|\u0000|$)/.exec(refs.res.getContentText()) : null;
  if (!m) return choHoacLoi_('MN_APP', `không đọc được commit main (GitHub trả ${refs.ma})`);
  const sha = m[1];
  if (sha === tt.getProperty('MN_APP_SHA')) { boCho_('MN_APP'); return { ket: 'bỏ qua', ghi: `kho không đổi (${sha.slice(0, 7)})` }; }
  const cay = goi_(DIA_CHI.APP_CAY(sha), { Accept: 'application/vnd.github+json' }, { dungKhi: [403, 404] });
  if (cay.ma === 403 || cay.ma === 429) return choHoacLoi_('MN_APP', 'GitHub hạn lượt API (IP Google dùng chung) — thử lại đêm mai', true);
  if (cay.ma !== 200) return choHoacLoi_('MN_APP', `GitHub trả ${cay.ma} khi lấy danh sách tệp`);
  const ds = JSON.parse(cay.res.getContentText());
  if (ds.truncated) return choHoacLoi_('MN_APP', 'danh sách tệp bị cắt (kho quá lớn)');
  const tepCan = ds.tree.filter((x) => x.type === 'blob' && !BO_KHOI_MA_APP.test(x.path));
  const blobs = [];
  for (let i = 0; i < tepCan.length; i += 40) {
    if (Date.now() - batDau > CAI.TRAN_GIAY * 1000) return choHoacLoi_('MN_APP', 'tải chưa xong trong giờ của lượt — đêm sau tải lại', true);
    const nhom = tepCan.slice(i, i + 40);
    const ra = taiNhieu_(nhom.map((x) => DIA_CHI.APP_RAW(sha, x.path)));
    ra.forEach((res, j) => { if (res) blobs.push(res.getBlob().setName('APP-KH/' + nhom[j].path)); });
  }
  if (blobs.length !== tepCan.length) return choHoacLoi_('MN_APP', `chỉ tải được ${blobs.length}/${tepCan.length} tệp`);
  const ten = `ma_nguon_app_${ngay_('yyyy-MM-dd')}_${sha.slice(0, 7)}.zip`;
  const tep = thuMuc.createFile(Utilities.zip(blobs, ten));
  const lai = Utilities.unzip(tep.getBlob());
  if (lai.length !== tepCan.length || !lai.some((b) => b.getName() === 'APP-KH/package.json')) {
    tep.setTrashed(true);
    return choHoacLoi_('MN_APP', 'kiểm lại zip vừa lưu không khớp — đã bỏ tệp đó');
  }
  tt.setProperty('MN_APP_SHA', sha);
  boCho_('MN_APP');
  const bo = giuTheoTang_(thuMuc, PHAN.MN_APP.giu, tep.getId());
  return { ket: 'đã lưu', tep: ten, co: tep.getSize(), ghi: `${tepCan.length} tệp${bo ? ` · bỏ ${bo} tệp quá hạn` : ''}` };
}

// ───────────── Phần 4: mã nguồn POS (Chủ nhật) ─────────────

function lamMaNguonPos_(thuMuc, epTuan) {
  if (!denLuotTuan_('MN_POS', epTuan)) return { ket: 'bỏ qua', ghi: 'chưa tới Chủ nhật' };
  const r = goi_(DIA_CHI.POS_ZIP, {}, { dungKhi: [404] });
  if (r.ma !== 200) return choHoacLoi_('MN_POS', `GitHub trả ${r.ma} khi tải zip kho POS`);
  const blob = r.res.getBlob();
  const tt = PropertiesService.getScriptProperties();
  const bam = bamByte_(blob.getBytes());
  if (bam === tt.getProperty('MN_POS_BAM')) { boCho_('MN_POS'); return { ket: 'bỏ qua', ghi: 'kho POS không đổi' }; }
  let ra;
  try { ra = Utilities.unzip(blob); } catch (e) { return choHoacLoi_('MN_POS', 'zip kho POS không mở được'); }
  const soTep = ra.filter((b) => !/\/$/.test(b.getName())).length;
  if (soTep < 500 || !ra.some((b) => /^[^/]+\/package\.json$/.test(b.getName()))) return choHoacLoi_('MN_POS', `zip kho POS lạ (${soTep} tệp, cần ≥ 500 + package.json)`);
  const ten = `ma_nguon_pos_${ngay_('yyyy-MM-dd')}.zip`;
  const tep = thuMuc.createFile(blob.setName(ten));
  if (bamByte_(tep.getBlob().getBytes()) !== bam) { tep.setTrashed(true); return choHoacLoi_('MN_POS', 'kiểm lại tệp vừa lưu không khớp — đã bỏ tệp đó'); }
  tt.setProperty('MN_POS_BAM', bam);
  boCho_('MN_POS');
  const bo = giuTheoTang_(thuMuc, PHAN.MN_POS.giu, tep.getId());
  return { ket: 'đã lưu', tep: ten, co: tep.getSize(), ghi: `${soTep} tệp${bo ? ` · bỏ ${bo} tệp quá hạn` : ''}` };
}

// Phần tuần: chạy Chủ nhật; hỏng thì đánh dấu "chờ" để đêm sau (4 giờ) thử lại.
function denLuotTuan_(ma, epTuan) {
  if (epTuan) return true;
  if (Utilities.formatDate(new Date(), CAI.MUI_GIO, 'u') === '7') return true;   // 7 = Chủ nhật
  return !!PropertiesService.getScriptProperties().getProperty('CHO_' + ma);
}
function danhDauCho_(ma) {
  const tt = PropertiesService.getScriptProperties();
  if (!tt.getProperty('CHO_' + ma)) tt.setProperty('CHO_' + ma, ngay_('yyyy-MM-dd'));
}
function boCho_(ma) { PropertiesService.getScriptProperties().deleteProperty('CHO_' + ma); }
/** Phần tuần hỏng: đánh dấu chờ. `nhe` (GitHub hạn lượt / hết giờ) chỉ thành lỗi khi đã chờ ≥ CHO_TOI_DA_NGAY đêm. */
function choHoacLoi_(ma, ghi, nhe) {
  danhDauCho_(ma);
  if (!nhe) return { ket: 'lỗi', loi: true, ghi: ghi + ' — đêm sau thử lại' };
  const tu = PropertiesService.getScriptProperties().getProperty('CHO_' + ma);
  const soNgay = Math.round((ngayLaSo_(ngay_('yyyy-MM-dd')) - ngayLaSo_(tu)) / 86400000);
  if (soNgay >= CAI.CHO_TOI_DA_NGAY) return { ket: 'lỗi', loi: true, ghi: `${ghi} (đã chờ ${soNgay} đêm)` };
  return { ket: 'bỏ qua', ghi };
}

// ───────────── Giữ bản theo tầng ─────────────

/**
 * Giữ bản MỚI NHẤT của mỗi ngày (giu.ngay ngày gần nhất), mỗi tuần (giu.tuan tuần), mỗi tháng (giu.thang tháng) — tính theo giờ VN, theo ngày tạo tệp.
 * Còn lại → Thùng rác (30 ngày cứu được). Không bao giờ bỏ tệp vừa lưu. Chỉ chạy SAU khi lưu + kiểm thành công.
 */
function giuTheoTang_(thuMuc, giu, idMoi) {
  const tep = [];
  const it = thuMuc.getFiles();
  while (it.hasNext()) { const f = it.next(); if (!f.isTrashed()) tep.push(f); }
  tep.sort((a, b) => b.getDateCreated() - a.getDateCreated());   // mới trước
  const giuLai = new Set([idMoi]);
  const chon = (khoaCua, soKhoa) => {
    if (!soKhoa) return;
    const daCo = [];
    for (const f of tep) {
      const k = khoaCua(f.getDateCreated());
      if (daCo.includes(k)) continue;
      if (daCo.length >= soKhoa) break;
      daCo.push(k);
      giuLai.add(f.getId());
    }
  };
  chon((d) => Utilities.formatDate(d, CAI.MUI_GIO, 'yyyy-MM-dd'), giu.ngay);
  chon(tuanCua_, giu.tuan);
  chon((d) => Utilities.formatDate(d, CAI.MUI_GIO, 'yyyy-MM'), giu.thang);
  let bo = 0;
  for (const f of tep) if (!giuLai.has(f.getId())) { f.setTrashed(true); bo++; }
  return bo;
}
function tuanCua_(d) {   // ngày thứ Hai của tuần (giờ VN)
  const s = Utilities.formatDate(d, CAI.MUI_GIO, 'yyyy-MM-dd');
  const t = new Date(s + 'T12:00:00Z');
  t.setUTCDate(t.getUTCDate() - ((t.getUTCDay() + 6) % 7));
  return t.toISOString().slice(0, 10);
}

// ───────────── Thư mục ─────────────

function layThuMucPhan_() {
  const goc = layGoc_();
  const app = layCon_(goc, 'App KH');
  const nd = layCon_(app, 'Noi dung');
  chuyenTepCu_(app, nd);
  const ra = {};
  for (const ma of Object.keys(PHAN)) { const [a, b] = PHAN[ma].thu; ra[ma] = layCon_(layCon_(goc, a), b); }
  THU_MUC_KHAC.forEach(([a, b]) => layCon_(layCon_(goc, a), b));
  return ra;
}
function layGoc_() {
  const ds = [];
  const it = DriveApp.getFoldersByName(CAI.GOC);
  while (it.hasNext()) { const f = it.next(); if (!f.isTrashed()) ds.push(f); }
  if (ds.length === 1) return ds[0];
  if (ds.length === 0) throw new Error(`không thấy thư mục ${CAI.GOC} (đã xoá / đổi tên?) — script KHÔNG tự tạo lại thư mục gốc`);
  throw new Error(`có ${ds.length} thư mục tên ${CAI.GOC} — đổi tên bớt cho còn một`);
}
function layCon_(cha, ten) {
  const it = cha.getFoldersByName(ten);
  while (it.hasNext()) { const f = it.next(); if (!f.isTrashed()) return f; }
  return cha.createFolder(ten);
}
/** Bản 1 cất tệp nội dung thẳng trong "App KH/" → chuyển (moveTo, không chép-xoá) vào "App KH/Noi dung/". Đếm trước / sau phải khớp. */
function chuyenTepCu_(app, nd) {
  const cu = [];
  const it = app.getFiles();
  while (it.hasNext()) { const f = it.next(); if (!f.isTrashed()) cu.push(f); }
  if (!cu.length) return;
  const truoc = demTep_(nd);
  cu.forEach((f) => f.moveTo(nd));
  if (demTep_(nd) !== truoc + cu.length || demTep_(app) !== 0) throw new Error(`chuyển tệp cũ vào App KH/Noi dung lệch số (${cu.length} tệp)`);
  ghiNhatKy_('App KH / Noi dung', 'chuyển', '', 0, `chuyển ${cu.length} tệp bản 1 vào Noi dung/`);
}
function demTep_(thuMuc) { let n = 0; const it = thuMuc.getFiles(); while (it.hasNext()) if (!it.next().isTrashed()) n++; return n; }

// ───────────── Nhật ký (Google Sheet) ─────────────

function ghiNhatKy_(phan, ket, tep, co, ghi) {
  try {
    const so = laySoTay_();
    so.appendRow([Utilities.formatDate(new Date(), CAI.MUI_GIO, 'yyyy-MM-dd HH:mm'), phan, ket, tep, co ? Math.round(co / 1024) : '', ghi]);
    const thua = so.getLastRow() - 2001;
    if (thua > 0) so.deleteRows(2, thua);   // giữ ~2000 dòng gần nhất
  } catch (e) { Logger.log('Không ghi được nhật ký: ' + thongDiep_(e)); }
}
function laySoTay_() {
  const goc = layGoc_();
  const it = goc.getFilesByName(CAI.SO_TAY);
  while (it.hasNext()) { const f = it.next(); if (!f.isTrashed()) return SpreadsheetApp.openById(f.getId()).getSheets()[0]; }
  const ss = SpreadsheetApp.create(CAI.SO_TAY);
  DriveApp.getFileById(ss.getId()).moveTo(goc);
  const s = ss.getSheets()[0];
  s.appendRow(['Lúc (giờ VN)', 'Phần', 'Kết quả', 'Tệp', 'Cỡ (KB)', 'Ghi chú']);
  s.setFrozenRows(1);
  return s;
}

// ───────────── Gọi mạng ─────────────

/** Thử tối đa CAI.THU_LAI lần, cách CAI.CHO_GIAY giây. Mã trong `dungKhi` (vd 401 / 403) → dừng ngay, không thử tiếp. Trả { ma, res }. */
function goi_(url, tieuDe, { dungKhi = [] }) {
  let res = null, ma = 0;
  for (let lan = 1; lan <= CAI.THU_LAI; lan++) {
    try {
      res = UrlFetchApp.fetch(url, { method: 'get', headers: tieuDe, muteHttpExceptions: true, followRedirects: true });
      ma = res.getResponseCode();
      if (ma === 200 || dungKhi.includes(ma) || (ma >= 400 && ma < 500 && ma !== 429)) break;
    } catch (e) { ma = 0; }   // mất mạng / hết giờ chờ — thử lại
    if (lan < CAI.THU_LAI) Utilities.sleep(CAI.CHO_GIAY * 1000);
  }
  return { ma, res };
}
/** Tải nhiều địa chỉ (raw.githubusercontent — không tính lượt API); hỏng lần đầu thì thử lại từng cái. Trả mảng res | null. */
function taiNhieu_(urls) {
  let ds;
  try { ds = UrlFetchApp.fetchAll(urls.map((u) => ({ url: u, muteHttpExceptions: true }))); } catch (e) { ds = urls.map(() => null); }
  return ds.map((r, i) => {
    if (r && r.getResponseCode() === 200) return r;
    const g = goi_(urls[i], {}, { dungKhi: [404] });
    return g.ma === 200 ? g.res : null;
  });
}

// ───────────── Tiện ích ─────────────

function canhChoTrong_(loi) {
  try {
    const han = DriveApp.getStorageLimit(), dung = DriveApp.getStorageUsed();
    if (han > 0 && (han - dung) / 1048576 < CAI.CHO_TRONG_MB) {
      const ghi = `Drive còn ${Math.round((han - dung) / 1048576)} MB — sắp đầy`;
      ghiNhatKy_('Chung', 'lỗi', '', 0, ghi);
      loi.push(ghi);
    }
  } catch (e) { /* không đọc được dung lượng — bỏ qua */ }
}
function coTrongZip_(blob, dk) { try { return Utilities.unzip(blob).some((b) => dk(b.getName())); } catch (e) { return false; } }
function bamChu_(s) { return hex_(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, s, Utilities.Charset.UTF_8)); }
function bamByte_(b) { return hex_(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, b)); }
function hex_(b) { return b.map((x) => ('0' + (x & 0xff).toString(16)).slice(-2)).join(''); }
function ngay_(dang) { return Utilities.formatDate(new Date(), CAI.MUI_GIO, dang); }
function ngayLaSo_(s) { return new Date(s + 'T00:00:00Z').getTime(); }
/** Thông điệp lỗi KHÔNG chứa khoá: cắt mọi chuỗi giống khoá trước khi ghi. */
function thongDiep_(e) { return String((e && e.message) || e).replace(/\b(ndk|posk)_[A-Za-z0-9_-]+/g, '$1_***').slice(0, 300); }
