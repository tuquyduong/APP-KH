#!/usr/bin/env python3
"""Đột biến KH-UI-3b: sửa cố ý code đã vá, chạy cong_cu/thu_KHUI3b.js, bài thử PHẢI đỏ; luôn khôi phục file sau mỗi lần.
VS- = vá sai (bản vá làm sai cách); BV- = bỏ vá (gỡ chỗ vá). Chạy: python3 viec/KH-UI-3b/dot_bien.py (từ gốc kho).
Cột cuối: True = cần trình duyệt (Chromium) mới bắt được, chạy cả phần 2; False = phần 1 đủ (đặt KHONG_TRINH_DUYET=1 cho nhanh)."""
import os
import subprocess
import sys

GIAHAN = 'src/giaHan.js'
LUU = 'src/luuMay.js'
CHAO = 'src/pages/TrangChu.jsx'
DINHDANG = 'src/dinhDang.js'
HOSO = 'src/pages/HoSo.jsx'
MENU = 'src/dungMenu.js'
KIEM = 'src/pages/KiemKhop.jsx'

DOT_BIEN = [
    ('VS-GIA-HAN-HAI-LAN-MOT-NGAY', GIAHAN, "  if (daLam === ngay) return Promise.resolve();\n", '', False),
    ('VS-GIA-HAN-GHI-NGAY-KHI-LOI', GIAHAN, "}, () => { /* im lặng */ })", "}, () => { ngayTrongTrang = ngay; try { kho().setItem(KHOA_GIA_HAN, ngay); } catch { /* x */ } })", False),
    ('VS-GIA-HAN-SONG-LAI-PHIEN', GIAHAN, " || docToken() !== token) return;", ") return;", False),
    ('BV-KHOA-GIA-HAN-NGOAI-LUU-MAY', LUU, "const KHOA_DU_LIEU = [KHOA_TRAC_NGHIEM, KHOA_GIO, KHOA_GIA_HAN];", "const KHOA_DU_LIEU = [KHOA_TRAC_NGHIEM, KHOA_GIO];", False),
    ('VS-CHAO-DUNG-DONG-HO-MAY', CHAO, "coBayGio() ? bayGio() : ''", "new Date().toISOString().replace('T', ' ')", False),
    ('VS-CHAO-MOC-SANG-SAI', DINHDANG, "h >= 5 && h < 11 ? ' buổi sáng'", "h >= 6 && h < 11 ? ' buổi sáng'", False),
    ('VS-PUT-GUI-CA-KHOA-KHONG-DOI', HOSO, "s.luu({ ten: ten.trim() })", "s.luu({ ten: ten.trim(), xung_ho: ho.xung_ho })", True),
    ('VS-MENU-401-HIEN-LOI', MENU, "if (e.status === 401 && coPhien) {", "if (false && coPhien) {", False),
    ('VS-MENU-LUU-BO-GIA-HANG', MENU, "ghiMenuLuu(dl, luc, lanLay.current)", "ghiMenuLuu(boGiaHang(dl), luc, lanLay.current)", False),
    ('BV-KIEMKHOP-DOC-LAI-DANG-NHAP', KIEM, "datDangNhap(!!docToken()); ", "", False),
]


def chay_thu(trinh_duyet):
    moi_truong = dict(os.environ)
    if not trinh_duyet:
        moi_truong['KHONG_TRINH_DUYET'] = '1'
    r = subprocess.run(['node', 'cong_cu/thu_KHUI3b.js'], capture_output=True, text=True, env=moi_truong)
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
