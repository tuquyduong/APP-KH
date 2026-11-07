// Mã QR thương hiệu Tứ Quý Đường (KH-SOHD-1) — hàm thuần: chuỗi → danh sách hình SVG; KHÔNG vẽ, KHÔNG gọi mạng.
// Quy cách theo thư POS 06.11 (mẫu chủ quán đã duyệt): mức sửa lỗi H; chấm TRÒN; 3 ô góc là khối bo tròn TÔ ĐẶC (không vòng rỗng);
// màu theo 4 phần tư như 4 mảnh logo; viền trắng ≥ 3 ô; đĩa trắng tròn ở giữa cho logo (đường kính ≤ 20% bề ngang mã); nền mã luôn TRẮNG.
import qrcode from 'qrcode-generator';

// Màu 4 phần tư — ngoại lệ ngoài demo do chủ quán duyệt 06.11 (K9: chỉ cho tệp này và the_qr.css).
export const MAU_QR = { trenTrai: '#253A6E', trenPhai: '#966923', duoiTrai: '#347042', duoiPhai: '#B2342C' };
export const VIEN_QR = 3;            // ô trắng quanh mã
export const TI_LE_LOGO = 0.2;       // đường kính đĩa logo / bề ngang mã
const BAN_KINH_CHAM = 0.45;          // chấm tròn trong ô 1×1
const CANH_FINDER = 7;

const mauO = (n, r, c) => (r + 0.5 < n / 2 ? (c + 0.5 < n / 2 ? MAU_QR.trenTrai : MAU_QR.trenPhai) : (c + 0.5 < n / 2 ? MAU_QR.duoiTrai : MAU_QR.duoiPhai));
const trongFinder = (n, r, c) => (r < CANH_FINDER && (c < CANH_FINDER || c >= n - CANH_FINDER)) || (r >= n - CANH_FINDER && c < CANH_FINDER);

/** Ma trận mức H của `chuoi` → { n, vien, tong, cham[{mau,d}] (chấm tròn gom theo màu), finder[{x,y,mau}] (3 ô góc 7×7), logo{cx,cy,r} (đĩa trắng) }. */
export function dungTheQR(chuoi) {
  const q = qrcode(0, 'H');
  q.addData(String(chuoi));
  q.make();
  const n = q.getModuleCount();
  const logo = { cx: n / 2, cy: n / 2, r: (TI_LE_LOGO * n) / 2 };
  const nhom = new Map();
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (!q.isDark(r, c) || trongFinder(n, r, c)) continue;
      if (Math.hypot(c + 0.5 - logo.cx, r + 0.5 - logo.cy) < logo.r) continue; // dưới đĩa logo
      const mau = mauO(n, r, c);
      const b = BAN_KINH_CHAM;
      nhom.set(mau, `${nhom.get(mau) || ''}M${c + 0.5 - b} ${r + 0.5}a${b} ${b} 0 1 0 ${2 * b} 0a${b} ${b} 0 1 0 ${-2 * b} 0z`);
    }
  }
  return {
    n, vien: VIEN_QR, tong: n + 2 * VIEN_QR, logo,
    cham: [...nhom].map(([mau, d]) => ({ mau, d })),
    finder: [{ x: 0, y: 0, mau: MAU_QR.trenTrai }, { x: n - CANH_FINDER, y: 0, mau: MAU_QR.trenPhai }, { x: 0, y: n - CANH_FINDER, mau: MAU_QR.duoiTrai }],
  };
}

// Đọc chuỗi TLV của VietQR / EMV: `IDDDnội dung…` (ID 2 số, độ dài 2 số). Hỏng (không số, dài quá chuỗi) → null.
function docTlv(s) {
  const ra = {};
  let i = 0;
  while (i < s.length) {
    const id = s.slice(i, i + 2);
    const dai = s.slice(i + 2, i + 4);
    if (!/^\d{2}$/.test(id) || !/^\d{2}$/.test(dai) || i + 4 + Number(dai) > s.length) return null;
    if (!(id in ra)) ra[id] = s.slice(i + 4, i + 4 + Number(dai));
    i += 4 + Number(dai);
  }
  return ra;
}

/** Nội dung chuyển khoản trong `qr.chuoi` (trường 62 → trường con 08). Không đọc được → ''. */
export function noiDungCK(chuoi) {
  const t = typeof chuoi === 'string' ? docTlv(chuoi) : null;
  const con = t && t['62'] ? docTlv(t['62']) : null;
  return con && con['08'] ? con['08'].trim() : '';
}
