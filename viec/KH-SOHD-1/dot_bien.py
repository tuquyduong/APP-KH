#!/usr/bin/env python3
"""Đột biến KH-SOHD-1: sửa cố ý code đã vá, chạy cong_cu/thu_KHSOHD1.js, bài thử PHẢI đỏ; luôn khôi phục file sau mỗi lần.
VS- = vá sai (bản vá làm sai cách); BV- = bỏ vá (gỡ chỗ vá). Chạy: python3 viec/KH-SOHD-1/dot_bien.py (từ gốc kho).
Đối chứng: chạy bài thử trên code KHÔNG đột biến trước — phải xanh, không thì dừng.
Cột cuối: True = chạy cả phần trình duyệt (Chromium); False = phần 1 đủ (đặt KHONG_TRINH_DUYET=1 cho nhanh)."""
import os
import subprocess
import sys

HD = 'src/hoaDon.js'
DD = 'src/datDon.js'
QR = 'src/qrThuongHieu.js'
TQ = 'src/components/TheQR.jsx'
TD = 'src/pages/TheoDoiDon.jsx'
DN = 'src/pages/Don.jsx'
TT = 'src/pages/ThanhToan.jsx'
BX = 'src/components/BaoDonXong.jsx'

DOT_BIEN = [
    ('VS-SODON-THIEU-DAU-THANG', HD, "return so || `#${chu(ma)}`;", "return so || chu(ma);", False),
    ('BV-SODON-KHONG-DUNG-SOHD', HD, "return so || `#${chu(ma)}`;", "return `#${chu(ma)}`;", False),
    ('VS-TIENVE-NHAN-CHUOI-SO', HD, "typeof tien === 'number' && tien > 0", "tien > 0", False),
    ('VS-GHINO-LOC-NGUOC', HD, "&& d.loai !== 'ghi_no')", "&& d.loai === 'ghi_no')", False),
    ('BV-GHINO-KHONG-LOC', HD, "&& d.loai !== 'ghi_no')", ")", False),
    ('BV-MAGD-NHOM-TRA', HD, "'tm', 'ma_gd', 'ghi_no'", "'tm', 'ghi_no'", False),
    ('BV-DOCDON-SOHD', DD, "soHd: chu(d.so_hd) || null, cauTienVe: cauTienVe(d),", "soHd: null, cauTienVe: '',", False),
    ('VS-QR-MUC-M', QR, "qrcode(0, 'H')", "qrcode(0, 'M')", False),
    ('BV-QR-FINDER-CHAM-ROI', QR, "if (!q.isDark(r, c) || trongFinder(n, r, c)) continue;", "if (!q.isDark(r, c)) continue;", False),
    ('VS-QR-LOGO-QUA-TO', QR, "TI_LE_LOGO = 0.2;", "TI_LE_LOGO = 0.3;", False),
    ('VS-QR-VIEN-HEP', QR, "VIEN_QR = 3;", "VIEN_QR = 2;", False),
    ('VS-QR-MAU-PHAN-TU', QR, "(c + 0.5 < n / 2 ? MAU_QR.trenTrai : MAU_QR.trenPhai)", "(c + 0.5 < n / 2 ? MAU_QR.trenPhai : MAU_QR.trenTrai)", False),
    ('VS-QR-DOC-CK-TRUONG-SAI', QR, "return con && con['08'] ? con['08'].trim() : '';", "return con && con['01'] ? con['01'].trim() : '';", False),
    ('VS-THEQR-VONG-RONG', TQ, 'rx="2" fill={f.mau}', 'rx="2" fill="none" stroke={f.mau}', False),
    ('VS-THEQR-CHU-CUOI-THE', TQ, '{dong && <div className="the-qr-dong">{dong}</div>}\n      </div>\n    </div>', '{dong && <div className="the-qr-dong">{dong}</div>}\n      </div>\n      <div className="the-qr-chan">Cảm ơn bạn</div>\n    </div>', True),
    ('VS-THEODOI-HIEN-MA-APP', TD, '<div className="n">{soDon(don.soHd, don.ma)}</div>', '<div className="n">#{don.ma}</div>', False),
    ('VS-THEODOI-CAU-CU-LUON', TD, "{don.cauTienVe || 'Quán đã nhận tiền, nhân viên sẽ liên hệ với bạn.'}", "{'Quán đã nhận tiền, nhân viên sẽ liên hệ với bạn.'}", True),
    ('VS-THEQR-SO-TIEN-VI-QR', TD, ": Number.isFinite(tra.con_lai) ? tra.con_lai : null;", ": (don && don.tong);", True),
    ('BV-CHITIET-TIEN-VE', DN, '{cauTienVe(don) && <div className="nt-state" role="alert"><Ico ten="warning" s={16} /><div>{cauTienVe(don)}</div></div>}', '', True),
    ('VS-LICHSU-HIEN-MA-APP', DN, '<div className="code">{soDon(d.so_hd, d.ma)}</div>', '<div className="code">#{d.ma}</div>', False),
    ('VS-THANHTOAN-CHO-TRA-MA-APP', TT, 'Bạn có đơn ${nhanDon(donCho.ma)} đang chờ trả', 'Bạn có đơn ${donCho.ma} đang chờ trả', True),
    ('VS-THANHTOAN-MO-DON-BANG-SO-HD', TT, 'moDon(donCho.ma)', 'moDon(nhanDon(donCho.ma))', False),
    ('BV-BAO-DON-TIEU-DE', BX, 'tieuDeXong(kq.nhan[ma])', 'tieuDeXong(ma)', True),
]


def chay_thu(trinh_duyet):
    moi_truong = dict(os.environ)
    if not trinh_duyet:
        moi_truong['KHONG_TRINH_DUYET'] = '1'
    r = subprocess.run(['node', 'cong_cu/thu_KHSOHD1.js'], capture_output=True, text=True, env=moi_truong)
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
