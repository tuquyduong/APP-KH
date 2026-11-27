// Mẫu "Đề xuất" KH-DOI-1 (Đổi điểm) — viết bằng lớp CSS của App + CSS thêm (màu CHỈ biến của bảng demo). Chat App KH 26.11.2026.
'use strict';
const fs = require('fs');
const SYM = fs.readFileSync(__dirname + '/sym.txt', 'utf8');
const I = (t, s = 18) => `<svg class="ico" width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-${t}"/></svg>`;
const MD = (t, s = 44) => `<svg class="med" width="${s}" height="${s}" viewBox="0 0 64 64" aria-hidden="true"><use href="#m-${t}"/></svg>`;

const CSS = `
.dq-o{ cursor:pointer; }
.dq-nut{ margin-top:8px; font:inherit; font-size:11.5px; font-weight:700; color:var(--white); background:var(--pink-dark); border:none; padding:5px 12px; border-radius:999px; }
.dq-hero{ position:relative; overflow:hidden; border-radius:18px; padding:18px 20px; color:var(--white); background:linear-gradient(135deg, var(--peach), var(--peach-dark)); text-align:center; }
.dq-hero .amt{ font-size:28px; font-weight:800; line-height:1.15; }
.dq-hero .lbl{ font-size:11.5px; opacity:.9; margin-top:2px; }
.dq-cua{ display:flex; align-items:center; gap:10px; background:var(--white); border-radius:14px; padding:12px 14px; margin-top:12px; box-shadow:0 1px 4px rgba(26,54,93,.08); font-size:13px; font-weight:600; color:var(--ink); }
.dq-cua .so{ margin-left:auto; font-size:11px; font-weight:700; color:var(--white); background:var(--pink-dark); border-radius:999px; padding:2px 8px; }
.dq-cua .mui{ color:var(--muted); }
.dq-nhac{ display:flex; gap:8px; align-items:center; margin-top:10px; padding:10px 12px; border-radius:12px; background:var(--cream); font-size:12px; color:var(--ink); line-height:1.4; }
.dq-nhac b{ color:var(--pink-dark); }
.dq-the{ display:flex; align-items:center; gap:12px; background:var(--white); border-radius:14px; padding:12px; margin-bottom:10px; box-shadow:0 1px 4px rgba(26,54,93,.08); }
.dq-the.mo{ opacity:.55; }
.dq-the .ic{ width:48px; height:48px; border-radius:12px; background:var(--cream); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.dq-the .info{ flex:1; min-width:0; }
.dq-the .t{ font-size:13px; font-weight:700; color:var(--ink); line-height:1.35; }
.dq-the .m{ font-size:11px; color:var(--muted); margin-top:2px; line-height:1.4; }
.dq-the .pts{ font-size:11.5px; color:var(--pink-dark); font-weight:700; margin-top:4px; }
.dq-chip{ display:inline-block; font-size:10px; font-weight:700; padding:2px 7px; border-radius:999px; background:var(--line); color:var(--forest); margin-left:4px; vertical-align:1px; }
.dq-doi{ font:inherit; font-size:11.5px; font-weight:700; color:var(--white); background:var(--pink-dark); padding:8px 12px; border-radius:10px; border:none; flex-shrink:0; }
.dq-doi.tat{ background:var(--line); color:var(--muted); max-width:96px; line-height:1.3; text-align:center; }
.dq-doi.vien{ background:var(--white); color:var(--pink-dark); box-shadow:inset 0 0 0 1.5px var(--pink-dark); }
.dq-xn{ text-align:center; padding:2px 4px 6px; }
.dq-xn .ten{ font-size:14px; font-weight:700; color:var(--ink); }
.dq-xn .tru{ display:flex; justify-content:space-between; font-size:12.5px; color:var(--muted); margin-top:10px; padding:10px 12px; border-radius:12px; background:var(--cream); }
.dq-xn .tru b{ color:var(--ink); }
.dq-phieu{ background:var(--white); border-radius:14px; padding:12px; margin-bottom:10px; box-shadow:0 1px 4px rgba(26,54,93,.08); display:flex; gap:12px; align-items:center; }
.dq-phieu .info{ flex:1; min-width:0; }
.dq-phieu .t{ font-size:13px; font-weight:700; color:var(--ink); }
.dq-phieu .d{ font-size:11px; color:var(--muted); margin-top:2px; }
.dq-phieu .nhac{ color:var(--pink-dark); font-weight:700; }
.dq-phieu.cu{ opacity:.6; }
.dq-tt{ font-size:10.5px; font-weight:700; padding:3px 8px; border-radius:999px; background:var(--cream); color:var(--muted); flex-shrink:0; }
.dq-tt.cho{ background:var(--pink-dark); color:var(--white); }
.dq-ma{ font-size:12px; font-weight:800; letter-spacing:.08em; color:var(--ink); background:var(--white); border:1px dashed var(--muted); border-radius:8px; padding:4px 10px; }
`;

const QUA = [
  { loai: 'voucher', md: 'ticket', ten: 'Voucher giảm 20.000đ', mo_ta: 'Cho đơn từ 50.000đ · dùng trong 30 ngày', diem: 500, nut: 'doi' },
  { loai: 'voucher', md: 'ticket', ten: 'Voucher giảm 10%', mo_ta: 'Tối đa 30.000đ · dùng trong 30 ngày', diem: 800, nut: 'doi' },
  { loai: 'hien_vat', md: 'coffee', ten: 'Tặng 1 ly Cà phê Muối', mo_ta: 'Nhận tại quầy trong 14 ngày', diem: 1200, nut: 'doi' },
  { loai: 'voucher', md: 'ticket', ten: 'Miễn phí giao hàng', mo_ta: 'Đơn giao Ahamove · 1 lần / tháng', diem: 300, nut: 'luot' },
  { loai: 'hien_vat', md: 'bag', ten: 'Túi tote Tứ Quý Đường', mo_ta: 'Phiên bản giới hạn · nhận tại quầy', diem: 2500, nut: 'thieu' },
  { loai: 'hien_vat', md: 'gift', ten: 'Hộp trà Lục Bảo 10 gói', mo_ta: 'Nhận tại quầy trong 14 ngày', diem: 3000, nut: 'het' },
];
const chip = (q) => (q.loai === 'hien_vat' ? '<span class="dq-chip">Quà tại quầy</span>' : '');
const nut = (q, kieuB) => {
  if (q.nut === 'thieu') return `<button class="dq-doi tat">Cần thêm ${(q.diem - 1250).toLocaleString('vi-VN')} điểm</button>`;
  if (q.nut === 'het') return '<button class="dq-doi tat">Tạm hết</button>';
  if (q.nut === 'luot') return '<button class="dq-doi tat">Hết lượt tháng này</button>';
  if (kieuB && q.loai === 'hien_vat') return '<button class="dq-doi vien">Đổi tại quầy</button>';
  return '<button class="dq-doi">Đổi ngay</button>';
};
const the = (q, kieuB) => `<div class="dq-the${q.nut === 'het' || q.nut === 'luot' ? ' mo' : ''}"><div class="ic">${MD(q.md, 44)}</div><div class="info"><div class="t">${q.ten}${chip(q)}</div><div class="m">${q.mo_ta}</div><div class="pts">${q.diem.toLocaleString('vi-VN')} điểm</div></div>${nut(q, kieuB)}</div>`;
const dau = (tieu) => `<div class="topbar"><button type="button" class="back-btn">${I('back')}</button><div><h1>${tieu}</h1></div></div>`;

const KHO = (kieuB) => `${dau('Đổi quà bằng điểm')}
<div class="dq-hero"><div class="amt">1.250 điểm</div><div class="lbl">Điểm của bạn · đổi quà ngay trên App</div></div>
<div class="dq-cua">${MD('gift', 30)}<span>Quà của tôi</span><span class="so">2 chờ nhận</span><span class="mui">›</span></div>
<div class="dq-nhac">${I('warning', 16)}<div>Phiếu <b>Tặng 1 ly Cà phê Muối</b> còn 2 ngày — nhớ ghé quầy nhận nhé.</div></div>
<div class="sec-head"><h2>Kho quà</h2></div>
${QUA.map((q) => the(q, kieuB)).join('')}
<div class="care-disclaimer qr-chu">Mô tả quà do quán soạn ở POS · đổi xong không trả lại điểm.</div>`;

const XAC_NHAN = `<div class="sheet pin-sheet show"><div class="panel">
<h3 style="text-align:center">Nhập PIN để đổi quà</h3>
<div class="dq-xn"><div class="ten">Voucher giảm 20.000đ</div><div class="tru"><span>Trừ <b>500 điểm</b></span><span>Còn lại <b>750 điểm</b></span></div></div>
<div class="pin-dots"><i class="on"></i><i class="on"></i><i></i><i></i></div>
<div class="pin-msg"></div>
<div class="pin-pad">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => `<button type="button">${k}</button>`).join('')}<button type="button" class="lk">Xoá</button><button type="button">0</button><button type="button" class="lk pin-ok" disabled>Xác nhận</button></div>
</div></div>`;

const XONG_VC = `${dau('Đổi quà bằng điểm')}
<div class="cm-dau">
<div class="dq-hero" style="width:100%"><div class="lbl">Điểm còn lại</div><div class="amt">750 điểm</div></div>
${MD('ticket', 84)}
<h2>Đã đổi quà!</h2>
<p>Voucher giảm 20.000đ đã vào Ví voucher của bạn — App tự chọn sẵn khi bạn đặt món.</p>
<span class="dq-ma">DD7K2Q</span>
</div>
<button type="button" class="checkout-btn cm-nut"><span>Đặt món dùng ngay</span><span>→</span></button>
<button type="button" class="ghost-btn cm-gio">Về kho quà</button>`;

const QUA_TOI = `${dau('Quà của tôi')}
<div class="dq-nhac">${I('warning', 16)}<div>Đưa mã QR của phiếu cho nhân viên ở quầy để nhận quà. Quá hạn chưa nhận, quán <b>hoàn lại điểm</b>.</div></div>
<div class="sec-head"><h2>Chờ nhận</h2></div>
<div class="dq-phieu"><div>${MD('coffee', 44)}</div><div class="info"><div class="t">Tặng 1 ly Cà phê Muối</div><div class="d nhac">Còn 2 ngày · hạn 28/11/2026</div></div><span class="dq-tt cho">Xem mã ›</span></div>
<div class="dq-phieu"><div>${MD('bag', 44)}</div><div class="info"><div class="t">Túi tote Tứ Quý Đường</div><div class="d">Hạn 09/12/2026</div></div><span class="dq-tt cho">Xem mã ›</span></div>
<div class="sec-head"><h2>Đã xong</h2></div>
<div class="dq-phieu cu"><div>${MD('gift', 44)}</div><div class="info"><div class="t">Hộp trà Lục Bảo 10 gói</div><div class="d">Đã nhận 20/11/2026</div></div><span class="dq-tt">Đã nhận</span></div>
<div class="dq-phieu cu"><div>${MD('coffee', 44)}</div><div class="info"><div class="t">Tặng 1 ly Cà phê Muối</div><div class="d">Hết hạn 10/11 · đã hoàn 1.200 điểm</div></div><span class="dq-tt">Hết hạn</span></div>`;

module.exports = { CSS, SYM, KHO, XAC_NHAN, XONG_VC, QUA_TOI, I, MD };
