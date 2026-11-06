#!/usr/bin/env python3
"""Đột biến KH-BAO-1: sửa cố ý code đã vá, chạy cong_cu/thu_KHBAO1.js, bài thử PHẢI đỏ; luôn khôi phục file sau mỗi lần.
VS- = vá sai (bản vá làm sai cách); BV- = bỏ vá (gỡ chỗ vá). Chạy: python3 viec/KH-BAO-1/dot_bien.py (từ gốc kho).
Đối chứng: chạy bài thử trên code KHÔNG đột biến trước — phải xanh, không thì dừng (đỏ sẵn thì "bắt được" là vô nghĩa).
Cột cuối: True = chạy cả phần trình duyệt (Chromium); False = phần 1 đủ (đặt KHONG_TRINH_DUYET=1 cho nhanh)."""
import os
import subprocess
import sys

BD = 'src/baoDonXong.js'
BX = 'src/components/BaoDonXong.jsx'
APP = 'src/App.jsx'
TT = 'src/pages/ThanhToan.jsx'
LM = 'src/luuMay.js'
HD = 'src/components/HoaDonKhach.jsx'
TD = 'src/pages/TheoDoiDon.jsx'

DOT_BIEN = [
    ('VS-BAO-DON-CHUA-TUNG-THAY', BD, "x.tt === 'xong' && nho.thay.includes(x.ma) && !nho.bao.includes(x.ma)", "x.tt === 'xong' && !nho.bao.includes(x.ma)", False),
    ('BV-BAO-LAI-DON-DA-TAT', BD, "x.tt === 'xong' && nho.thay.includes(x.ma) && !nho.bao.includes(x.ma)", "x.tt === 'xong' && nho.thay.includes(x.ma)", False),
    ('VS-BAO-DA-HUY', BD, "x.tt === 'xong' && nho.thay", "(x.tt === 'xong' || x.tt === 'da_huy') && nho.thay", False),
    ('VS-HOI-KHI-TAB-AN', BX, "setInterval(hoiNgay, MS_HOI)", "setInterval(() => cuaDon.lay(), MS_HOI)", True),
    ('VS-HOI-LAP-KHI-KHONG-DON', BX, "if (!kq.dangChay) return undefined;", "", True),
    ('VS-CHU-KY-HOI', BD, "export const MS_HOI = 15000;", "export const MS_HOI = 5000;", False),
    ('BV-NHO-DA-TAT-QUA-TAI-LAI', BX, "datNho(n); ghiNho(n); };", "datNho(n); };", True),
    ('BV-XOA-NHO-KHI-DANG-XUAT', BX, "xoaNho(); datTieuDe('');", "datTieuDe('');", True),
    ('VS-TIEU-DE-BI-GHI-DE', APP, " if (tieuXong) document.title = tieuXong;", "", False),
    ('BV-DA-TRA-LAM-MOI-DON', APP, "lamMoi([cuaDon]) /* đơn QR vừa trả: dải báo đơn xong bắt đầu hỏi */; ", "", False),
    ('VS-BAO-DON-VE-GHI-NO', HD, ".filter((d) => d.loai !== 'ghi_no')", "", True),
    ('BV-TO-HOA-DON-THEO-DOI', TD, "{docHoaDon(don).length > 0 ? <div className=\"order-card\">", "{false ? <div className=\"order-card\">", True),
    ('VS-CONG-TAC-BAT-SAN-KHI-TOI-LOI', TT, "const cachTra = !dungVi ? 'qr' : duoc.vi ? 'vi' : duoc.viQr ? 'vi_qr' : 'qr';", "const cachTra = !dungVi ? 'qr' : duoc.vi ? 'vi' : duoc.viQr ? 'vi_qr' : 'vi';", True),
    ('VS-CONG-TAC-KHONG-NHO', TT, "const [dungVi, datDungViTho] = useState(docDungVi);", "const [dungVi, datDungViTho] = useState(false);", True),
    ('BV-HOI-PIN-KHI-NHO-VI', TT, "if (cachTra === 'qr') guiDon(); else datMoPin({});", "guiDon();", True),
    ('BV-GIU-BAN-GHI-KHI-CHUA-MO', TT, "if (cu && e.code === 'CHUA_MO') { datMoPin(null); datThongBao(e.message); return; }", "", True),
    ('VS-NUT-GUI-LAI-KHONG-KHOA-CHUA-MO', TT, "{!DAT_ONLINE ? CHU_CHUA_MO : conGiay ?", "{conGiay ?", True),
    ('VS-DUNG-VI-NHU-VANG-LAI', LM, "const KHOA_VANG_LAI = [KHOA_GIO, KHOA_GIA_HAN];", "const KHOA_VANG_LAI = [KHOA_GIO, KHOA_GIA_HAN, KHOA_DUNG_VI];", False),
    ('BV-DUNG-VI-KHONG-XOA', LM, "KHOA_TOM_TAT, KHOA_DON_GUI, KHOA_DUNG_VI];", "KHOA_TOM_TAT, KHOA_DON_GUI];", False),
]


def chay_thu(trinh_duyet):
    moi_truong = dict(os.environ)
    if not trinh_duyet:
        moi_truong['KHONG_TRINH_DUYET'] = '1'
    r = subprocess.run(['node', 'cong_cu/thu_KHBAO1.js'], capture_output=True, text=True, env=moi_truong)
    dong = [d for d in r.stdout.splitlines() if d.strip()]
    hong = [d.strip()[:110] for d in dong if d.strip().startswith('✗')]
    return r.returncode, (dong[-1] if dong else '(không có đầu ra)'), hong[:2]


def main():
    ma, dong, _ = chay_thu(True)
    print(f'ĐỐI CHỨNG (không đột biến): {"XANH" if not ma else "ĐỎ"} — {dong}', flush=True)
    if ma:
        print('Bài thử đỏ sẵn trên code đã vá — dừng.')
        sys.exit(2)
    xanh = []
    for ten, tep, cu, moi, trinh_duyet in DOT_BIEN:
        with open(tep, encoding='utf8') as f:
            goc = f.read()
        if goc.count(cu) != 1:
            print(f'{ten}: KHÔNG ÁP ĐƯỢC ({cu[:40]!r} xuất hiện {goc.count(cu)} lần)')
            xanh.append(ten)
            continue
        try:
            with open(tep, 'w', encoding='utf8') as f:
                f.write(goc.replace(cu, moi))
            ma, dong, hong = chay_thu(trinh_duyet)
        finally:
            with open(tep, 'w', encoding='utf8') as f:
                f.write(goc)
        print(f'{ten}: {"ĐỎ" if ma else "XANH (bài thử KHÔNG bắt được)"} — {dong} {" | ".join(hong)}', flush=True)
        if not ma:
            xanh.append(ten)
    print('TẤT CẢ ĐỘT BIẾN ĐỀU BỊ BẮT' if not xanh else 'CÒN SỐNG: ' + ', '.join(xanh))
    sys.exit(1 if xanh else 0)


main()
