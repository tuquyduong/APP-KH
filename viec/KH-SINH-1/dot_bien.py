#!/usr/bin/env python3
"""Đột biến KH-SINH-1: sửa cố ý code đã vá, chạy cong_cu/thu_KHSINH1.js, bài thử PHẢI đỏ; luôn khôi phục file sau mỗi lần.
VS- = vá sai (bản vá làm sai cách); BV- = bỏ vá (gỡ chỗ vá). Chạy: python3 viec/KH-SINH-1/dot_bien.py (từ gốc kho).
Cột cuối: True = cần trình duyệt (Chromium) mới bắt được, chạy cả phần 2; False = phần 1 đủ (đặt KHONG_TRINH_DUYET=1 cho nhanh)."""
import os
import subprocess
import sys

DINHDANG = 'src/dinhDang.js'
HOSO = 'src/pages/HoSo.jsx'
GIO = 'src/gio.js'
GIOHANG = 'src/pages/GioHang.jsx'

DOT_BIEN = [
    ('VS-TEN-CHI-TU-CUOI', DINHDANG, "String(ten || '').trim().replace(/\\s+/g, ' ') ||", "String(ten || '').trim().split(/\\s+/).pop() ||", False),
    ('VS-TEN-KHONG-GOP-KHOANG-TRANG', DINHDANG, "String(ten || '').trim().replace(/\\s+/g, ' ') ||", "String(ten || '').trim() ||", False),
    ('VS-NGAY-30-02-HOP-LE', DINHDANG, "ngay <= toiDa ?", "ngay <= 31 ?", False),
    ('VS-NAM-NHUAN-SAI', DINHDANG, "const nhuan = (nam % 4 === 0 && nam % 100 !== 0) || nam % 400 === 0;", "const nhuan = false;", False),
    ('VS-NGAY-SINH-GOP-KHOA-KHAC', HOSO, "s.luu({ ngay_sinh: v })", "s.luu({ ngay_sinh: v, ten: ho.ten })", True),
    ('BV-HOI-LAI-TRUOC-KHI-LUU', HOSO, "onClick={() => datHoi(true)}", "onClick={gui}", True),
    ('BV-CHAN-NGAY-TUONG-LAI', HOSO, "max={homNay} ", "", True),
    ('VS-DA-CO-HIEN-LOI-THAY-VI-DOC-LAI', HOSO, "(e) => e.code === 'NGAY_SINH_DA_CO' && (lamMoi([cuaToi]), true)", "() => false", True),
    ('BV-CHE-O-SUA-KHI-DA-CO', HOSO, "{daCo ? (", "{false ? (", True),
    ('VS-CHEN-LAI-SAI-CHO', GIO, "Math.min(Math.max(vitri, 0), gio.length)", "gio.length", False),
    ('VS-CHEN-LAI-NHAN-DOI-DONG', GIO, "  if (gio.some((d) => d.ma === dong.ma && d.ghi_chu === dong.ghi_chu)) return themMon(gio, dong.ma, dong.so_luong, dong.ghi_chu);\n", "", False),
    ('BV-NUT-XOA-MON', GIOHANG, "onClick={() => xoa(i)}", "onClick={() => {}}", True),
    ('VS-HOAN-TAC-KHONG-TRA-DONG', GIOHANG, "doi(chenDong(gio, daXoa.dong, daXoa.vitri)); datDaXoa(null);", "datDaXoa(null);", True),
    ('VS-THONG-BAO-KHONG-TU-TAT', GIOHANG, "setTimeout(het, GIAY_HOAN_TAC)", "setTimeout(() => {}, GIAY_HOAN_TAC)", True),
]


def chay_thu(trinh_duyet):
    moi_truong = dict(os.environ)
    if not trinh_duyet:
        moi_truong['KHONG_TRINH_DUYET'] = '1'
    r = subprocess.run(['node', 'cong_cu/thu_KHSINH1.js'], capture_output=True, text=True, env=moi_truong)
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
