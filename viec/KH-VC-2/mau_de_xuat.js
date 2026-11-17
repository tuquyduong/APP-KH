// MẪU ĐỀ XUẤT (chat App KH, 16.11.2026) — dùng để dựng ảnh cột "Đề xuất" của bản thiết kế Nạp tiền & Voucher (Artifact Qy5PSiVPvSfCLaRn8viF7G):
// markup viết bằng ĐÚNG lớp CSS của App, bơm vào App thật đang chạy rồi chụp. CHỈ là tham khảo CẤU TRÚC — không chép nguyên vào src/.
// Màu trong khối CSS dưới đây KHÔNG đảm bảo thuộc bảng màu demo: khi làm thật dùng màu demo gần nhất (K9). Chữ / số trong mẫu là VÍ DỤ.
// KH-NAP-1: MAN_VI, SHEET_GOI, MAN_TT_NAP, MAN_DA_NAP, UU_DAI_VI.  KH-VC-2: UU_DAI_VC + VC_DATA, GIO_VC + GIO_DATA.
'use strict';
const I = (ten, s = 18) => `<svg class="ico" width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-${ten}"/></svg>`;
const LUI = `<button type="button" class="back-btn" aria-label="Quay lại">${I('back', 20)}</button>`;

const CSS = `
.vi-hero{position:relative;overflow:hidden;border-radius:20px;padding:20px 20px 18px;color:#fff;background:linear-gradient(135deg,#7A2647 0%,#B23D6B 58%,#D0688F 100%);box-shadow:0 10px 26px rgba(122,38,71,.28)}
.vi-hero::before{content:"";position:absolute;top:-56px;right:-46px;width:180px;height:180px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.24),transparent 70%)}
.vi-hero>*{position:relative}
.vi-hero .lbl{font-size:12.5px;opacity:.9}
.vi-hero .amt{font-size:32px;font-weight:800;letter-spacing:-.4px;margin-top:4px;line-height:1.15}
.vi-hero .vi-cong{display:inline-block;margin-top:10px;font-size:13px;font-weight:700;background:rgba(255,255,255,.22);padding:5px 11px;border-radius:999px}
.vi-hero-nut{margin-top:16px;display:flex;align-items:center;justify-content:center;gap:6px;width:100%;min-height:46px;border:none;border-radius:14px;background:#fff;color:#7A2647;font:inherit;font-size:14.5px;font-weight:700}
.vi-luat{font-size:12px;color:var(--muted);margin:10px 4px 0;line-height:1.5}
.tx-ds{padding:2px 14px}
.tx{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--line)}
.tx:last-child{border-bottom:none}
.tx-ic{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex:none;font-size:18px;font-weight:700}
.tx-ic.vao{background:#E4F2E6;color:#2F6B3A}.tx-ic.ra{background:#FBE7EE;color:#B23D6B}.tx-ic.dc{background:#EEF0F4;color:#5D6470}
.tx-info{flex:1;min-width:0}
.tx-t{font-size:13.5px;font-weight:600;color:var(--ink)}
.tx-d{font-size:11.5px;color:var(--muted);margin-top:2px}
.tx-thuong{font-size:11.5px;color:#2F6B3A;margin-top:2px;font-weight:600}
.tx-phai{display:flex;align-items:center;gap:4px}
.tx-so{font-size:14px;font-weight:700;white-space:nowrap}.tx-so.cong{color:#2F6B3A}.tx-so.tru{color:var(--ink)}
.tx-chev{color:var(--muted);font-size:18px}
.goi{display:flex;align-items:center;gap:12px;padding:13px 14px;border-radius:16px;background:#fff;box-shadow:0 0 0 1.5px var(--line);margin-bottom:10px}
.goi.chon{box-shadow:0 0 0 2px #B23D6B,0 6px 16px rgba(178,61,107,.16)}
.goi-o{width:22px;height:22px;border-radius:50%;border:2px solid #D9C3CC;flex:none;display:flex;align-items:center;justify-content:center;color:#fff}
.goi.chon .goi-o{border-color:#B23D6B;background:#B23D6B}
.goi-ten{font-size:14px;font-weight:700;color:var(--ink)}
.goi-so{font-size:12.5px;color:var(--muted);margin-top:3px}
.goi-so b{color:#2F6B3A;font-weight:700}
.goi-thuong{margin-left:auto;font-size:12px;font-weight:700;color:#2F6B3A;background:#E4F2E6;padding:5px 9px;border-radius:999px;white-space:nowrap}
.goi-nho{font-size:11.5px;color:var(--muted);text-align:center;margin-top:12px;line-height:1.5}
.panel .panel-phu{font-size:12.5px;color:var(--muted);margin:-6px 0 14px}
.nap-ic{width:46px;height:46px;border-radius:14px;background:linear-gradient(135deg,#7A2647,#B23D6B);color:#fff;display:flex;align-items:center;justify-content:center;flex:none;font-size:22px;font-weight:800}
.summary-row.vao-vi{color:#2F6B3A;font-weight:600}
.wallet-box.vi-mo{cursor:pointer;box-shadow:0 0 0 1.5px #F0C9D7,0 1px 4px rgba(26,54,93,.08)}
.vi-nap-chip{display:inline-flex;align-items:center;gap:2px;margin-top:8px;font-size:11.5px;font-weight:700;color:#fff;background:#B23D6B;padding:5px 12px;border-radius:999px}
.voucher .body>div:first-child{min-width:0;flex:1}
.voucher .body{gap:10px}
.voucher .t{line-height:1.4}
.vc-dong{display:flex;gap:6px;align-items:center;margin-top:7px;flex-wrap:wrap}
.vc-chip{font-size:10.5px;font-weight:700;padding:3px 8px;border-radius:999px;background:#FBE7EE;color:#B23D6B}
.vc-ma{font-size:10.5px;font-weight:700;letter-spacing:.05em;color:#8B6877;border:1px dashed #D9C3CC;padding:2px 7px;border-radius:6px}
.voucher.ship .strip{background:#C9BDC3}.voucher.ship .t{color:#8B6877}
.vc-sap{font-size:10.5px;font-weight:600;color:#8B6877;background:#F1ECEE;padding:6px 9px;border-radius:8px;text-align:center;line-height:1.3;max-width:84px}
.vc-chon{display:flex;align-items:flex-start;gap:10px;padding:12px;border-radius:14px;background:#fff;box-shadow:0 0 0 1.5px var(--line);margin-bottom:8px}
.vc-chon.chon{box-shadow:0 0 0 2px #B23D6B;background:#FFF9FB}
.vc-o{width:22px;height:22px;border-radius:7px;border:2px solid #D9C3CC;flex:none;display:flex;align-items:center;justify-content:center;margin-top:1px;color:#fff}
.vc-chon.chon .vc-o{background:#B23D6B;border-color:#B23D6B}
.vc-chon .t{font-size:12.5px;font-weight:600;color:var(--ink);line-height:1.4}
.vc-chon .vc-ma{margin-top:6px;display:inline-block}
.vc-loi{font-size:11.5px;color:#B3261E;font-weight:600;margin-top:6px;line-height:1.4}
.vc-chon.tat{opacity:.62;box-shadow:0 0 0 1.5px #EEE6E9}
.vc-chon.tat .vc-o{border-style:dashed}
.vc-chu-tat{font-size:11px;color:#8B6877;font-weight:600;margin-top:6px}
.sec-head .sec-phu{font-size:11.5px;color:var(--muted);font-weight:600}
.ma-nho{font-size:11.5px;color:var(--muted);margin:-6px 2px 0}
.phone>.sheet{z-index:300}
.ghost-btn.giua,.checkout-btn.giua{display:flex;justify-content:center;text-align:center}
.tt-mau{display:flex;gap:10px;align-items:flex-start;background:#FFF4E0;border-radius:12px;padding:12px;font-size:12.5px;color:#7A4A12;line-height:1.5;margin-top:12px}
`;

// ---- Màn Ví (dùng chung cho mẫu 2 và 3) ----
const TX = (ic, lop, t, d, so, cong, thuong, mo) => `<div class="tx"><div class="tx-ic ${lop}">${ic}</div><div class="tx-info"><div class="tx-t">${t}</div><div class="tx-d">${d}</div>${thuong ? `<div class="tx-thuong">${thuong}</div>` : ''}</div><div class="tx-phai"><span class="tx-so ${cong ? 'cong' : 'tru'}">${so}</span>${mo ? '<span class="tx-chev">›</span>' : ''}</div></div>`;
const MAN_VI = `
<div class="topbar trai">${LUI}<div><h1>Ví của tôi</h1><div class="sub">Số dư · nạp tiền · lịch sử</div></div></div>
<div class="vi-hero"><div class="lbl">Số dư</div><div class="amt">180.600đ</div><button type="button" class="vi-hero-nut">${I('plus', 18)}Nạp tiền</button></div>
<div class="vi-luat">Số dư trả được đồ uống ở quầy và trên App. Thẻ hội viên chỉ trả bằng chuyển khoản hoặc tiền mặt.</div>
<div class="sec-head"><h2>Lịch sử ví</h2></div>
<div class="card tx-ds">
${TX('+', 'vao', 'Nạp tiền', '14:05 · 16/11/2026 · Nạp gói 100K', '+105.000đ', true, 'gồm 5.000đ tiền thưởng', true)}
${TX('−', 'ra', 'Trả đơn APP0051', '09:12 · 15/11/2026', '−58.200đ', false, '', true)}
${TX('+', 'vao', 'Hoàn tiền đơn APP0047', '18:40 · 12/11/2026', '+29.100đ', true, '', true)}
${TX('+', 'vao', 'Nạp tiền', '08:30 · 10/11/2026 · Nạp tại quầy', '+105.000đ', true, 'gồm 5.000đ tiền thưởng', false)}
${TX('±', 'dc', 'Quán điều chỉnh', '17:02 · 09/11/2026', '−400đ', false, '', false)}
</div>
<button type="button" class="ghost-btn giua" style="margin-top:12px">Xem thêm</button>`;

const SHEET_GOI = `
<div class="sheet show bang-noi" role="presentation"><div class="panel" role="dialog" aria-label="Chọn gói nạp">
<h3>Chọn gói nạp</h3><div class="panel-phu">Tiền vào ví ngay khi quán nhận được chuyển khoản.</div>
<div class="goi"><span class="goi-o"></span><div><div class="goi-ten">Gói 100K</div><div class="goi-so">Trả 100.000đ → vào ví <b>105.000đ</b></div></div><span class="goi-thuong">+5.000đ</span></div>
<div class="goi chon"><span class="goi-o">${I('check', 14)}</span><div><div class="goi-ten">Gói 200K</div><div class="goi-so">Trả 200.000đ → vào ví <b>210.000đ</b></div></div><span class="goi-thuong">+10.000đ</span></div>
<div class="goi"><span class="goi-o"></span><div><div class="goi-ten">Gói 500K</div><div class="goi-so">Trả 500.000đ → vào ví <b>530.000đ</b></div></div><span class="goi-thuong">+30.000đ</span></div>
<div class="goi"><span class="goi-o"></span><div><div class="goi-ten">Nạp 50K</div><div class="goi-so">Trả 50.000đ → vào ví <b>50.000đ</b></div></div></div>
<button type="button" class="checkout-btn" style="display:flex;justify-content:space-between"><span>Tiếp tục · trả 200.000đ</span><span>→</span></button>
<div class="goi-nho">Chỉ trả bằng chuyển khoản QR. Tiền đã nạp không hoàn lại.</div>
</div></div>`;

const MAN_TT_NAP = `
<div class="topbar trai">${LUI}<div><h1>Thanh toán</h1><div class="sub"><span>Nạp tiền vào ví</span></div></div></div>
<div class="card the-tom"><span class="nap-ic">+</span><div class="the-tom-chu"><b>Gói 200K</b><span>Vào ví 210.000đ</span></div><span class="the-tom-gia">200.000đ</span></div>
<div class="nt-state on the-kich">${I('check', 18)}<div>Tiền vào ví ngay khi quán nhận được chuyển khoản, không cần ra quầy.</div></div>
<div class="sec-head"><h2>Cách trả tiền</h2></div>
<div class="tt-qr" aria-checked="true" role="radio" aria-disabled="true"><span class="tt-qr-ic">${I('qr', 20)}</span><div><b>Chuyển khoản QR</b><small>Quét mã bằng app ngân hàng bất kỳ</small></div>${I('check', 22).replace('class="ico"', 'class="ico tt-qr-v"')}</div>
<div class="the-khoa">${I('card', 16)}<span>Nạp tiền chỉ trả bằng chuyển khoản, không dùng số dư ví và không dùng mã giảm giá. Tiền đã nạp không hoàn lại.</span></div>
<div class="card bang-tien"><div class="summary-row"><span>Tiền nạp</span><span>200.000đ</span></div><div class="summary-row total"><span>Tổng cộng</span><span>200.000đ</span></div><div class="summary-row vao-vi"><span>Vào ví sau khi trả</span><span>210.000đ</span></div></div>
<button type="button" class="checkout-btn nut-dat" aria-disabled="false"><span>Quét QR · 200.000đ</span><span>→</span></button>`;

const MAN_DA_NAP = `
<div class="topbar trai">${LUI}<div><h1>Đơn APP0054</h1><div class="sub">Đặt lúc 14:31 16/11/2026</div></div></div>
<div class="cm-dau">
<div class="vi-hero" style="width:100%;text-align:left"><div class="lbl">Số dư mới</div><div class="amt">390.600đ</div><span class="vi-cong">+210.000đ vừa vào ví</span></div>
<h2>Đã nạp 210.000đ vào ví!</h2>
<p>Gồm 10.000đ tiền thưởng. Dùng trả đồ uống ở quầy và trên App.</p>
<span class="cm-don">Đơn APP0054 · 200.000đ</span>
</div>
<button type="button" class="checkout-btn cm-nut giua">Đặt đồ uống ngay</button>
<button type="button" class="ghost-btn cm-gio giua">Xem ví</button>`;

// ---- Ưu đãi: ô Số dư ví bấm được + nút Nạp ----
const UU_DAI_VI = () => {
  const box = [...document.querySelectorAll('.wallet-box')][1];
  box.classList.add('vi-mo');
  box.insertAdjacentHTML('beforeend', '<span class="vi-nap-chip">+ Nạp tiền</span>');
  const b0 = [...document.querySelectorAll('.wallet-box')][0];
  b0.insertAdjacentHTML('beforeend', '<span class="vi-nap-chip" style="visibility:hidden">.</span>');
};

// ---- Ưu đãi: ví voucher + nhận ưu đãi khách mới ----
const VC = (t, nguon, ma, nut) => `<div class="voucher"><div class="strip"></div><div class="body"><div><div class="t">${t}</div><div class="vc-dong"><span class="vc-chip">${nguon}</span><span class="vc-ma">${ma}</span></div></div>${nut}</div></div>`;
const UU_DAI_VC = (vc) => {
  const vi = [...document.querySelectorAll('.wallet-box')][1];
  vi.classList.add('vi-mo');
  vi.insertAdjacentHTML('beforeend', '<span class="vi-nap-chip">+ Nạp tiền</span>');
  [...document.querySelectorAll('.wallet-box')][0].insertAdjacentHTML('beforeend', '<span class="vi-nap-chip" style="visibility:hidden">.</span>');
  const inp = document.querySelector('#ma-bill');
  inp.setAttribute('value', 'HD8F2K');
  document.querySelectorAll('.promo-box button, .ghost-btn').forEach((b) => b.removeAttribute('disabled'));
  document.querySelector('.ghost-btn').insertAdjacentHTML('afterend', vc.nhan);
  const cu = document.querySelector('.voucher');
  cu.insertAdjacentHTML('beforebegin', vc.ds);
  cu.remove();
};
const VC_DATA = (I) => ({
  nhan: `<div class="nt-state on the-kich" style="margin-top:10px">${I}<div>Đã thêm vào ví voucher: <b>Giảm 10% tối đa 30.000đ · HSD 05/12/2026</b></div></div>`,
  ds: [
    VC('Giảm 10% tối đa 30.000đ · HSD 05/12/2026', 'Khách mới', 'KM8F2K', '<div class="use">Dùng ngay</div>'),
    VC('Giảm 20.000đ cho đơn từ 50.000đ · HSD 30/11/2026', 'Đổi điểm', 'VC7', '<div class="use">Dùng ngay</div>'),
    VC('Giảm 15.000đ phí giao hàng · HSD 31/12/2026', 'Giới thiệu bạn', 'GT3', '<div class="vc-sap">Dùng khi đặt giao hàng</div>').replace('class="voucher"', 'class="voucher ship"'),
  ].join(''),
});

// ---- Giỏ hàng: chọn voucher + một mã khuyến mãi ----
const GIO_VC = (h) => {
  const pb = document.querySelector('.promo-box');
  pb.insertAdjacentHTML('beforebegin', h.ds);
  const inp = pb.querySelector('input');
  inp.setAttribute('value', ''); inp.value = ''; inp.setAttribute('placeholder', 'Nhập mã khuyến mãi (nếu có)');
  pb.querySelector('button').textContent = 'Áp dụng';
  pb.insertAdjacentHTML('beforebegin', '<div class="sec-head"><h2>Mã khuyến mãi</h2><span class="sec-phu">1 mã / đơn</span></div>');
  pb.style.marginTop = '0';
  document.querySelector('.bang-tien').innerHTML = h.bang;
  const nut = document.querySelector('.checkout-btn span:last-child'); nut.textContent = '68.239đ →';
};
const VCC = (lop, t, ma, them) => `<div class="vc-chon ${lop}"><span class="vc-o">${lop.includes('chon') ? '%CHECK%' : ''}</span><div><div class="t">${t}</div><span class="vc-ma">${ma}</span>${them || ''}</div></div>`;
const GIO_DATA = (chk) => ({
  ds: (`<div class="sec-head"><h2>Voucher của bạn</h2><span class="sec-phu">Tự chọn sẵn · chạm để bỏ</span></div>`
    + VCC('chon', 'Giảm 20.000đ cho đơn từ 50.000đ · HSD 30/11/2026', 'VC7')
    + VCC('chon', 'Giảm 10% tối đa 30.000đ · HSD 05/12/2026', 'KM8F2K')
    + VCC('', 'Giảm 50.000đ cho đơn từ 150.000đ · HSD 20/12/2026', 'VC9', '<div class="vc-loi">Voucher VC9: Đơn chưa đủ tối thiểu 150.000đ (tính trên món thường)</div>')
    + VCC('tat', 'Giảm 15.000đ phí giao hàng · HSD 31/12/2026', 'GT3', '<div class="vc-chu-tat">Dùng khi đặt giao hàng</div>')).replace(/%CHECK%/g, chk),
  bang: '<div class="summary-row"><span>Tiền hàng</span><span>99.000đ</span></div>'
    + '<div class="summary-row discount"><span>Voucher VC7</span><span>−20.000đ</span></div>'
    + '<div class="summary-row discount"><span>Voucher KM8F2K</span><span>−7.900đ</span></div>'
    + '<div class="summary-row discount"><span>Ưu đãi hạng Hạng vàng</span><span>−2.861đ</span></div>'
    + '<div class="summary-row total"><span>Tổng cộng</span><span>68.239đ</span></div>',
});

module.exports = { I, CSS, MAN_VI, SHEET_GOI, MAN_TT_NAP, MAN_DA_NAP, UU_DAI_VI, UU_DAI_VC, VC_DATA, GIO_VC, GIO_DATA };
