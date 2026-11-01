#!/usr/bin/env python3
"""Đột biến KH-NHANH-1: sửa cố ý code đã vá, chạy cong_cu/thu_KHNHANH1.js, bài thử PHẢI đỏ; luôn khôi phục file sau mỗi lần.
VS- = vá sai (bản vá làm sai cách); BV- = bỏ vá (gỡ chỗ vá). Chạy: python3 viec/KH-NHANH-1/dot_bien.py (từ gốc kho).
Cột cuối: True = chạy cả phần trình duyệt (Chromium); False = phần 1 đủ (đặt KHONG_TRINH_DUYET=1 cho nhanh)."""
import os
import subprocess
import sys

KHO = 'src/duLieuKhach.js'
TOMTAT = 'src/tomTatLuu.js'
LUUMAY = 'src/luuMay.js'
APP = 'src/App.jsx'
TT = 'src/pages/ThanhToan.jsx'
UUDAI = 'src/pages/UuDai.jsx'
MANDAU = 'src/components/ManDau.jsx'

DOT_BIEN = [
    ('VS-TT-DUNG-SO-DU-KHO', TT, "import { layToi } from '../api.js';\nimport { dungTai } from '../dungTai.js';", "import { cuaToi as layToi, dungCua as dungTai } from '../duLieuKhach.js';", True),
    ('VS-TOMTAT-KHACH-KHAC', KHO, "const ban = tomTatCuaKhach(docTomTat(k), docChu(k));", "const ban = docTomTat(k);", False),
    ('VS-GOP-HO-SO-PHIEN-CU', KHO, "  if (khach && khach.sdt && cu.sdt && khach.sdt !== cu.sdt) return;", "", False),
    ('VS-TOMTAT-MAT-DIEM', KHO, "diem && !diem.tuMay ? diem : cu && { points: cu.points }", "diem && !diem.tuMay ? diem : null", False),
    ('VS-TAB-GOI-LAI', KHO, "useEffect(() => { cua.napNeuCu(); }, [cua]);", "useEffect(() => { cua.lay(); }, [cua]);", True),
    ('VS-DANGXUAT-GIU-TOMTAT', LUUMAY, "KHOA_GIA_HAN, KHOA_TOM_TAT];", "KHOA_GIA_HAN];", True),
    ('VS-MANDAU-LAN-HAI', MANDAU, "doc(KHOA_DA_XEM) !== '1' && canHienManDau(docNgayDaXem(), homNayMay())", "doc(KHOA_DA_XEM) !== '1'", True),
    ('VS-TOMTAT-CO-QR', TOMTAT, "so_du_vi: so(o.so_du_vi) ? o.so_du_vi : null };", "so_du_vi: so(o.so_du_vi) ? o.so_du_vi : null, qr: o.qr };", True),
    ('VS-KHONG-DUNG-CHUNG-LENH', KHO, "    if (cho) return cho;\n", "", False),
    ('VS-KET-QUA-PHIEN-CU', KHO, "if (p !== phien) return null; ", "", False),
    ('VS-LOI-XOA-BAN-CU', KHO, "kho.dat({ ...kho.lay(), loi: e.message })", "kho.dat({ dl: null, luc: 0, loi: e.message })", False),
    ('VS-QUAY-LAI-KHONG-SO-GIO', KHO, "c.napNeuCu(GIAY_QUAY_LAI, bay)", "c.lay()", False),
    ('VS-HANG-0-CON-HIEN', 'src/giaHang.js', "typeof h.phan_tram === 'number' && h.phan_tram > 0", "typeof h.phan_tram === 'number' && h.phan_tram >= 0", True),
    ('BV-TAI-TRUOC', APP, "    lamMoi(CUA_KHACH);\n", "", True),
    ('BV-XOA-KHO-KHI-DOI-PHIEN', APP, "tnGoc.donBoNho(); xoaKhoKhach(); };", "tnGoc.donBoNho(); };", False),
    ('BV-DOIKHACH-KHI-DANG-NHAP', APP, "<DangNhap khiXong={(k) => { if (k && doiKhach(k.sdt)) docLaiGio(); datDangNhap(true); }}", "<DangNhap khiXong={() => datDangNhap(true)}", True),
    ('BV-LAM-MOI-NGAM', APP, "  dungLamMoiNgam(dangNhap);", "", True),
    ('BV-NHAN-MA-LAM-MOI', UUDAI, "khiXong={() => lamMoi([cuaDiem, cuaVoucher, cuaToi])}", "khiXong={tai.taiLai}", True),
    ('BV-SO-DU-DANG-CAP-NHAT', TT, "toi.dangTai ? 'Đang cập nhật số dư…' : ", "", True),
    ('BV-HANG-0', UUDAI, "const ds = hangCoGiam(dsHang);", "const ds = Array.isArray(dsHang) ? dsHang : [];", True),
]


def chay_thu(trinh_duyet):
    moi_truong = dict(os.environ)
    if not trinh_duyet:
        moi_truong['KHONG_TRINH_DUYET'] = '1'
    r = subprocess.run(['node', 'cong_cu/thu_KHNHANH1.js'], capture_output=True, text=True, env=moi_truong)
    dong = [d for d in r.stdout.splitlines() if d.strip()]
    return r.returncode, (dong[-1] if dong else '(không có đầu ra)')


def main():
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
            ma, dong = chay_thu(trinh_duyet)
        finally:
            with open(tep, 'w', encoding='utf8') as f:
                f.write(goc)
        print(f'{ten}: {"ĐỎ" if ma else "XANH (bài thử KHÔNG bắt được)"} — {dong}', flush=True)
        if not ma:
            xanh.append(ten)
    print('TẤT CẢ ĐỘT BIẾN ĐỀU BỊ BẮT' if not xanh else 'CÒN SỐNG: ' + ', '.join(xanh))
    sys.exit(1 if xanh else 0)


main()
