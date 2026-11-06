#!/usr/bin/env python3
"""Đột biến KH-CT-1: sửa cố ý code đã vá, chạy cong_cu/thu_KHCT1.js, bài thử PHẢI đỏ; luôn khôi phục file sau mỗi lần.
VS- = vá sai (bản vá làm sai cách); BV- = bỏ vá (gỡ chỗ vá). Chạy: python3 viec/KH-CT-1/dot_bien.py (từ gốc kho).
Cột cuối: True = cần trình duyệt (Chromium) mới bắt được, chạy cả phần 2; False = phần 1 đủ (đặt KHONG_TRINH_DUYET=1 cho nhanh)."""
import os
import subprocess
import sys

CT = 'src/chuongTrinh.js'
UUDAI = 'src/pages/UuDai.jsx'
API = 'src/api.js'

DOT_BIEN = [
    ('VS-KHONG-LOC-DANG-BAT', CT, "&& c.dang_bat !== false", "", False),
    ('VS-LOAI-LA-GIU-NGUYEN', CT, "LOAI.includes(c.loai) ? c.loai : 'khac'", "c.loai", False),
    ('VS-SAP-LAI-THU-TU', CT, ".map((c) => ({ ma: c.ma,", ".sort((a, b) => a.ten.localeCompare(b.ten)).map((c) => ({ ma: c.ma,", False),
    ('VS-29-02-KHONG-NHUAN-BO-QUA', CT, "s.thang === 2 && s.ngay === 29 && !nhuan(h.nam) ? 28 : s.ngay", "s.ngay", False),
    ('VS-SINH-NHAT-CHI-SO-NGAY', CT, "s.thang === h.thang && ngay === h.ngay", "ngay === h.ngay", False),
    ('BV-KHONG-CONG-KHAI', API, "'/gio-hoat-dong', '/chuong-trinh']", "'/gio-hoat-dong']", False),
    ('VS-HOM-NAY-THEO-DONG-HO-MAY', UUDAI, "bayGio().slice(0, 10)", "new Date().toISOString().slice(0, 10)", True),
    ('BV-AN-KHOI-KHI-RONG', UUDAI, "const ds = docChuongTrinh(dl);\n  if (ds.length === 0) return null;", "const ds = docChuongTrinh(dl);", True),
    ('VS-MOI-NHAP-KHI-CHUA-BIET', UUDAI, "ngaySinh === null) ghiChu", "ngaySinh == null) ghiChu", True),
    ('BV-THE-SINH-NHAT-LEN-DAU', UUDAI, "homNay ? [...ds.filter((c) => c.loai === 'sinh_nhat'), ...ds.filter((c) => c.loai !== 'sinh_nhat')] : ds", "ds", True),
    ('BV-BAM-MO-HO-SO', UUDAI, "{...bam(moHoSo)}", "", True),
]


def chay_thu(trinh_duyet):
    moi_truong = dict(os.environ)
    if not trinh_duyet:
        moi_truong['KHONG_TRINH_DUYET'] = '1'
    r = subprocess.run(['node', 'cong_cu/thu_KHCT1.js'], capture_output=True, text=True, env=moi_truong)
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
