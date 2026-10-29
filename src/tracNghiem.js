// Trắc nghiệm thể trạng — hàm thuần (không DOM, không mạng, không đọc đồng hồ). CHÉP logic từ thiet_ke/app_kh_demo.html (patch39):
// tcScore → chamDiem, tcFinish → ketLuan, ownSigns → dauHieuRieng, tcPicks → goiYMon. Dữ liệu (bộ câu hỏi, nhóm…) truyền vào qua tham số
// `DL` (= noiDung/tracNghiem.json) để bài thử nạp thẳng file này. Bài thử cong_cu/thu_KHUI5a.js so từng kết quả với chính hàm của demo.
import { boDau } from './menuLoc.js';
import { TERM_TIPS, tietKhiNgay } from './lich.js';

const NGUONG_CO = 40;        // điểm quy đổi từ đây = có xu hướng rõ
const NGUONG_THIEN_HUONG = 30;
const NGUONG_BINH_HOA = 60;

const nhomLech = (DL) => Object.keys(DL.groups).filter((g) => g !== 'bh');

/** Câu hỏi hiện cho giới tính này: câu chung + câu dành riêng (`only`). */
export const locCau = (DL, gioiTinh) => DL.questions.filter((q) => !q.only || q.only === gioiTinh);

/** Điểm gốc 1–5 (câu `reverse` = 6 − điểm), quy đổi (gốc − n) / (4n) × 100 cho từng nhóm → { t: {nhóm: 0–100}, raw, n }. */
export function chamDiem(DL, danhSach, traLoi) {
  const raw = {}, n = {};
  danhSach.forEach((q, i) => q.scales.forEach((s) => {
    const v = s.reverse ? 6 - traLoi[i] : traLoi[i];
    raw[s.group] = (raw[s.group] || 0) + v;
    n[s.group] = (n[s.group] || 0) + 1;
  }));
  const t = {};
  Object.keys(raw).forEach((g) => { t[g] = Math.round((raw[g] - n[g]) / (4 * n[g]) * 100); });
  return { t, raw, n };
}

/** Mức của một nhóm lệch theo điểm: 'có' (≥ 40) · 'thiên hướng' (≥ 30) · 'không'. */
export const mucDiem = (diem) => (diem >= NGUONG_CO ? 'có' : diem >= NGUONG_THIEN_HUONG ? 'thiên hướng' : 'không');

// Câu kiểm tra chéo: sợ lạnh thì loại Âm hư / Thấp nhiệt; sợ nóng thì loại Dương hư.
const mauThuan = (g, khiHau) => (khiHau === 'lanh' && (g === 'ah' || g === 'tn')) || (khiHau === 'nong' && g === 'dh');

/**
 * Điểm 9 nhóm + câu trả lời kiểm tra chéo + tình trạng đặc biệt → kết luận (demo tcScore + tcFinish):
 * kind 'main' (xu hướng rõ) · 'tend' (mới thiên hướng) · 'binh' (Bình hòa) · 'none' (chưa rõ); picks = tối đa 2 nhóm (khoá nhóm file dữ liệu).
 */
export function ketLuan(DL, t, { gioiTinh, khiHau, anToan }) {
  const offs = nhomLech(DL);
  const muc = {};
  offs.forEach((g) => { muc[g] = mucDiem(t[g]); });
  const maxOff = Math.max(...offs.map((g) => t[g]));
  let bhLevel = 'không';
  if (t.bh >= NGUONG_BINH_HOA && maxOff < NGUONG_THIEN_HUONG) bhLevel = 'có';
  else if (t.bh >= NGUONG_BINH_HOA && maxOff < NGUONG_CO) bhLevel = 'cơ bản có';
  const ranked = offs.slice().sort((a, b) => t[b] - t[a]);
  const main = ranked.filter((g) => t[g] >= NGUONG_CO);
  const tend = ranked.filter((g) => t[g] >= NGUONG_THIEN_HUONG && t[g] < NGUONG_CO);

  const conflict = t.dh >= NGUONG_CO && (t.ah >= NGUONG_CO || t.tn >= NGUONG_CO);
  const dropped = [...main, ...tend].filter((g) => mauThuan(g, khiHau));
  const mainOk = main.filter((g) => !mauThuan(g, khiHau));
  const tendOk = tend.filter((g) => !mauThuan(g, khiHau));
  const maxOk = Math.max(0, ...[...mainOk, ...tendOk].map((g) => t[g]));
  let bhOk = bhLevel;
  if (t.bh >= NGUONG_BINH_HOA && main.length > 0 && mainOk.length === 0) bhOk = maxOk < NGUONG_THIEN_HUONG ? 'có' : 'cơ bản có';
  let kind, picks;
  if (bhOk !== 'không' && mainOk.length === 0) { kind = 'binh'; picks = ['bh', ...tendOk.slice(0, 1)]; }
  else if (mainOk.length === 0 && tendOk.length === 0) { kind = 'none'; picks = ['bh']; }
  else { kind = mainOk.length ? 'main' : 'tend'; picks = (mainOk.length ? mainOk : tendOk).slice(0, 2); }
  return {
    t, muc, bhLevel, ranked, main, tend, conflict, dropped, mainOk, tendOk, bhOk, kind, picks,
    many: main.length >= 3, khiHau, anToan: anToan.slice(), gioiTinh,
  };
}

/** Câu bạn đã chọn mức C / D thuộc nhóm `g` (không tính câu đảo), viết gọn như demo ownSigns. */
export function dauHieuRieng(danhSach, traLoi, g) {
  return danhSach.map((q, i) => ({ q, i })).filter((x) => x.q.scales.some((s) => s.group === g && !s.reverse) && traLoi[x.i] >= 4)
    .map((x) => x.q.text.replace(/^Tôi /, '').replace(/^Dù không bị cảm, tôi /, 'dù không bị cảm ')
      .replace(/^Khi môi trường, thời tiết hay hoàn cảnh thay đổi, cơ thể tôi /, 'khi môi trường thay đổi cơ thể ').replace(/\.$/, ''));
}

// ----- Gợi ý món của quán: ghép tên món trong bảng "nên / tránh" với menu POS bằng tên đã bỏ dấu + chữ thường -----

const tenKhop = (ten, tuKhoa) => {
  const t = boDau(ten), k = boDau(tuKhoa);
  return t.includes(k) && !(k === 'duong nhan' && t.includes('thach duong nhan'));
};

/**
 * Món POS mà các dòng chữ `dong` nhắc tới (demo matchProds): món có tên chứa một từ khoá VÀ dòng nào đó cũng chứa từ khoá ấy.
 * Bỏ món đang hết (con_hang === false) và combo (không phải món đơn dữ liệu nêu). Giữ thứ tự menu. `tuKhoa` = TU_KHOA_MON.
 */
export function ghepMon(dsMenu, dong, tuKhoa) {
  const cacTu = [...new Set(Object.values(tuKhoa))];
  const trung = cacTu.filter((k) => dong.some((s) => tenKhop(s, k)));
  return (dsMenu || []).filter((m) => m.con_hang !== false && !/^combo\b/.test(boDau(m.ten)) && trung.some((k) => tenKhop(m.ten, k)));
}

/**
 * Giải pháp + món của quán cho một kết luận (demo tcPicks, bỏ topping vì /menu chưa có topping — TOPPING-1).
 * { nen, tranh } = chữ nên chọn / nên hạn chế; mon = món POS còn bán hợp với "nên"; an = có tình trạng đặc biệt (chỉ món tính bình).
 * `gio` = giờ VN "YYYY-MM-DD…" để chọn món hợp tiết khí hôm nay khi Bình hòa.
 */
export function goiYMon(DL, MENU, tuKhoa, kl, dsMenu, gio) {
  if (kl.anToan.length) {
    return { nen: DL.safeSolution.nen, tranh: DL.safeSolution.tranh, mon: ghepMon(dsMenu, MENU.anToan.nen, tuKhoa), an: true };
  }
  const nen = [], tranh = [];
  kl.picks.forEach((g) => DL.groups[g].solution.nen.forEach((x) => nen.includes(x) || nen.push(x)));
  kl.picks.forEach((g) => DL.groups[g].solution.tranh.forEach((x) => (tranh.includes(x) || nen.includes(x)) || tranh.push(x)));
  const mNen = [];
  kl.picks.forEach((g) => MENU.nhom[g].nen.forEach((x) => mNen.push(x)));
  if (kl.khiHau === 'lanh' && !tranh.some((x) => /lạnh|đá/.test(x))) tranh.push('Đồ uống đá, lạnh (vì bạn sợ lạnh)');
  if (kl.khiHau === 'nong' && !tranh.some((x) => /cay|ấm|quế/.test(x))) tranh.push('Món cay ấm, nhiều quế gừng (vì bạn sợ nóng)');
  const mon = ghepMon(dsMenu, mNen, tuKhoa);
  const tiet = kl.picks[0] === 'bh' ? tietKhiNgay(gio) : null;
  if (tiet) {
    TERM_TIPS[tiet.idx][1].forEach((id) => ghepMon(dsMenu, [tuKhoa[id]], tuKhoa).forEach((m) => mon.includes(m) || mon.unshift(m)));
  }
  return { nen, tranh, mon, an: false };
}

/** Chữ phần đầu màn kết quả (demo renderTcResult): tiêu đề, dòng phụ, huy hiệu mức và kết luận tổng thể. */
export function moTaKetQua(DL, kl) {
  const { t, kind, picks, tendOk, mainOk, bhOk } = kl, G = DL.groups;
  let tieuDe, phu;
  if (kind === 'binh') {
    tieuDe = 'Thể trạng Bình hòa' + (bhOk === 'cơ bản có' ? ' (cơ bản)' : '');
    phu = tendOk.length ? 'Thể trạng khá cân đối, có chút thiên hướng ' + G[tendOk[0]].name + '.' : 'Thể trạng cân đối, không thấy xu hướng lệch rõ.';
  } else if (kind === 'none') {
    tieuDe = 'Chưa thấy xu hướng rõ';
    phu = 'Các câu trả lời chưa đủ để xếp vào một nhóm. Bạn có thể dùng thức uống theo mùa, hoặc trao đổi trực tiếp để được tư vấn kỹ hơn.';
  } else {
    tieuDe = 'Thể trạng ' + picks.map((g) => G[g].name).join(' kèm ');
    phu = 'Bạn có xu hướng ' + G[picks[0]].name + ' (' + t[picks[0]] + ' điểm)' + (picks[1] ? ', kèm xu hướng phụ ' + G[picks[1]].name + ' (' + t[picks[1]] + ' điểm)' : '') + '.';
    if (kind === 'tend') phu = 'Mới ở mức thiên hướng (30–39 điểm), chưa rõ rệt. ' + phu;
  }
  const huy = kind === 'main' ? 'Xu hướng rõ · ' + t[picks[0]] + ' điểm' : kind === 'tend' ? 'Thiên hướng · ' + t[picks[0]] + ' điểm' : kind === 'binh' ? 'Bình hòa · ' + t.bh + ' điểm' : 'Chưa rõ';
  const thap = kl.ranked.filter((g) => t[g] < NGUONG_THIEN_HUONG).map((g) => G[g].name);
  const tong = picks[0] === 'bh'
    ? 'Cơ thể bạn đang khá cân bằng' + (picks[1] ? ', chỉ hơi thiên về ' + G[picks[1]].name : '') + '. Các nhóm lệch khác đều ở mức thấp, không cần điều chỉnh gì đặc biệt, chỉ cần duy trì nếp sinh hoạt tốt.'
    : 'Cơ thể bạn đang thiên về ' + G[picks[0]].name + (picks[1] ? ', kèm ' + G[picks[1]].name : '') + '. '
      + (mainOk.length ? 'Đây là xu hướng rõ (từ 40 điểm trở lên), nên ưu tiên chọn thức uống và nếp sinh hoạt theo hướng này trong vài tháng tới, rồi làm lại bài để xem thay đổi.' : 'Mức độ còn nhẹ, chỉ cần lưu ý chọn thức uống phù hợp, chưa cần thay đổi gì lớn.')
      + (thap.length ? ' Các nhóm ' + thap.slice(0, 4).join(', ') + (thap.length > 4 ? '…' : '') + ' đều ở mức thấp.' : '');
  return { tieuDe, phu, huy, tong };
}

/** Nội dung "Sao chép kết quả và góp ý" (demo tcCopy). `tra` = câu trả lời còn trong bộ nhớ trang; mở lại bản đã lưu thì không có → bỏ dòng này. */
export function soanGopY(DL, kl, tra, gopY) {
  const G = DL.groups;
  const ten = (ds) => ds.map((g) => G[g].name).join(', ');
  const dong = [
    'Trắc nghiệm thể trạng – Tứ Quý Đường (dữ liệu ' + DL.meta.version + ')',
    'Giới tính: ' + (kl.gioiTinh === 'nu' ? 'Nữ' : 'Nam'),
    'Điểm quy đổi: ' + Object.keys(G).map((g) => G[g].name + ' ' + kl.t[g]).join('; '),
    'Nhóm ≥40: ' + (kl.main.length ? ten(kl.main) : 'không') + ' | Thiên hướng: ' + (kl.tend.length ? ten(kl.tend) : 'không') + ' | Bình hòa: ' + kl.bhLevel,
    'Kết luận: ' + kl.picks.map((g) => G[g].name).join(' + '),
    'Chịu nóng/lạnh: ' + (kl.khiHau === 'lanh' ? 'sợ lạnh' : kl.khiHau === 'nong' ? 'sợ nóng' : 'như nhau'),
    'Tình trạng đặc biệt: ' + (kl.anToan.length ? kl.anToan.join('; ') : 'không'),
  ];
  if (tra) dong.push('Trả lời: ' + tra.map((a, i) => (i + 1) + '=' + a).join(' '));
  dong.push('Góp ý: ' + (gopY || '(chưa ghi)'));
  return dong.join('\n');
}
