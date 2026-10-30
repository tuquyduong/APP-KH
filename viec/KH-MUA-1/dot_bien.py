#!/usr/bin/env python3
"""Đột biến KH-MUA-1: sửa cố ý code đã vá, chạy cong_cu/thu_KHMUA1.js, bài thử PHẢI đỏ; luôn khôi phục file sau mỗi lần.
VS- = vá sai (bản vá làm sai cách); BV- = bỏ vá (gỡ chỗ vá). Chạy: python3 viec/KH-MUA-1/dot_bien.py (từ gốc kho).
Mọi đột biến dưới đây bị phần 1 (không trình duyệt) bắt: chạy KHONG_TRINH_DUYET=1 python3 viec/KH-MUA-1/dot_bien.py cho nhanh."""
import subprocess
import sys

DAT = 'src/datDon.js'
GIO = 'src/gio.js'
LUU = 'src/luuMay.js'

DOT_BIEN = [
    ('VS-TU-CONG-TONG', DAT, "    tong: r.tong,\n", "    tong: (r.tam_tinh || 0) - (Array.isArray(r.giam) ? r.giam.reduce((s, g) => s + g.so_tien, 0) : 0) + (r.phi_giao || 0),\n"),
    ('VS-BO-KHOA-BAM-DOI', DAT, "    if (dang) return null;\n", ''),
    ('VS-LUU-GIA-VAO-GIO', GIO, "  return { ma: d.ma, so_luong: kep(d.so_luong),", "  return { ...d, ma: d.ma, so_luong: kep(d.so_luong),"),
    ('VS-GOI-MANG-KHI-CO-TAT', DAT, "  if (!DAT_ONLINE || !cong) {", "  if (!cong) {"),
    ('VS-TRA-VI-KHI-THIEU', DAT, "Math.max(0, tong - soDu)", "0"),
    ('VS-PIN-KHI-TRA-QR', DAT, "  if (t.cach_tra === 'vi') t.pin = pin;", "  t.pin = pin;"),
    ('VS-GOP-KHONG-GOP', DAT, "  const gop = (f) => { clearTimeout(h); h = setTimeout(f, ms); };", "  const gop = (f) => { h = setTimeout(f, ms); };"),
    ('BV-BO-KH-GIO-KHOI-LUU-MAY', LUU, "const KHOA_DU_LIEU = [KHOA_TRAC_NGHIEM, KHOA_GIO];", "const KHOA_DU_LIEU = [KHOA_TRAC_NGHIEM];"),
    ('BV-BO-GIU-GIO-VANG-LAI', LUU, "!KHOA_VANG_LAI.includes(x) && ", ''),
]
# Chỗ vá ở màn (vòng soát 1): chỉ phần 2 (Chromium) bắt → chạy riêng: python3 viec/KH-MUA-1/dot_bien.py man (KHÔNG đặt KHONG_TRINH_DUYET).
DOT_BIEN_MAN = [
    ('VS-VI-MAT-MANG-MOI-NHAP-PIN', 'src/pages/ThanhToan.jsx', "if (cachTra === 'vi' && !matMang) throw e;", "if (cachTra === 'vi') throw e;"),
    ('BV-DAT-LAI-KHONG-QUA-CO', 'src/App.jsx', "datLai={DAT_ONLINE ? datLai : null}", "datLai={datLai}"),
    ('VS-DA-AP-DUNG-THEO-O-NHAP', 'src/pages/GioHang.jsx', " && !!bg && bg.giam.length > 0; //", "; //"),
    ('BV-KHOA-GIO-KHI-CHUA-CO-MENU', 'src/pages/GioHang.jsx', "const coThe = coMenu ? duocThanhToan(gio, ds) : gio.length > 0;", "const coThe = duocThanhToan(gio, ds);"),
]


def chay_thu():
    r = subprocess.run(['node', 'cong_cu/thu_KHMUA1.js'], capture_output=True, text=True)
    dong = [d for d in r.stdout.splitlines() if d.strip()]
    return r.returncode, (dong[-1] if dong else '(không có đầu ra)')


def main():
    xanh = []
    for ten, tep, cu, moi in (DOT_BIEN_MAN if sys.argv[1:] == ['man'] else DOT_BIEN):
        with open(tep, encoding='utf8') as f:
            goc = f.read()
        if goc.count(cu) != 1:
            print(f'{ten}: KHÔNG ÁP ĐƯỢC ({cu[:40]!r} xuất hiện {goc.count(cu)} lần)')
            xanh.append(ten)
            continue
        try:
            with open(tep, 'w', encoding='utf8') as f:
                f.write(goc.replace(cu, moi))
            ma, dong = chay_thu()
        finally:
            with open(tep, 'w', encoding='utf8') as f:
                f.write(goc)
        print(f'{ten}: {"ĐỎ" if ma else "XANH (bài thử KHÔNG bắt được)"} — {dong}')
        if not ma:
            xanh.append(ten)
    print('TẤT CẢ ĐỘT BIẾN ĐỀU BỊ BẮT' if not xanh else 'CÒN SỐNG: ' + ', '.join(xanh))
    sys.exit(1 if xanh else 0)


main()
