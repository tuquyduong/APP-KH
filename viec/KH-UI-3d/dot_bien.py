#!/usr/bin/env python3
"""Đột biến KH-UI-3d: sửa cố ý code đã vá, chạy cong_cu/thu_KHUI3d.js, bài thử PHẢI đỏ; luôn khôi phục file sau mỗi lần.
VS- = vá sai (bản vá làm sai cách); BV- = bỏ vá (gỡ chỗ vá). Chạy: python3 viec/KH-UI-3d/dot_bien.py (từ gốc kho).
Cột cuối: True = cần trình duyệt (Chromium) mới bắt được, chạy cả phần 2; False = phần 1 đủ (đặt KHONG_TRINH_DUYET=1 cho nhanh)."""
import os
import subprocess
import sys

DINHDANG = 'src/dinhDang.js'
DANGNHAP = 'src/noiDung/dangNhap.js'
DUONGDAN = 'src/duongDan.js'
LUONG = 'src/luongDangNhap.js'
APP = 'src/App.jsx'
UUDAI = 'src/pages/UuDai.jsx'

DOT_BIEN = [
    ('VS-XUNG-HO-VIET-HOA-GIUA-CAU', DINHDANG, "const xung = String(xungHo || '').trim().toLowerCase();", "const xung = String(xungHo || '').trim().replace(/^./, (c) => c.toUpperCase());", False),
    ('VS-THIEU-CHAM-THAN', DINHDANG, "[xung, t].filter(Boolean).join(' ')}!`;", "[xung, t].filter(Boolean).join(' ')}`;", False),
    ('VS-TEN-NGAN-KHONG-VIET-HOA', DINHDANG, "return t.charAt(0).toUpperCase() + t.slice(1); };", "return t; };", False),
    ('VS-NUT-XUNG-HO-VIET-HOA', DANGNHAP, "{ ma: 'anh', ten: 'anh' }", "{ ma: 'anh', ten: 'Anh' }", False),
    ('VS-VANGLAI-THAY-DIEM-VOUCHER', UUDAI, "      {dangNhap\n        ? <UuDaiToi", "      {true\n        ? <UuDaiToi", True),
    ('VS-BANNER-GIO-VANG-KHI-POS-KHONG-CO', UUDAI, "  if (!tt || tt.pha === 'sau' || (coMenu && maGv.size === 0)) return null;", "  if (tt && (tt.pha === 'sau' || (coMenu && maGv.size === 0))) return null;\n  if (!tt) return <div className=\"rw-ban\" />;", True),
    ('VS-MA-HOA-DON-MAT-KHI-VANG-LAI', LUONG, " || (trang === 'uudai' && !!maCho))", ")", False),
    ('VS-APP-KHONG-TRUYEN-MA-CHO', APP, "canDangNhap(trang, dangNhap, maCho)) thay", "canDangNhap(trang, dangNhap)) thay", False),
    ('BV-CANDN-UU-DAI', DUONGDAN, "tab: 'uudai', tieuDe", "tab: 'uudai', canDN: true, tieuDe", False),
]


def chay_thu(trinh_duyet):
    moi_truong = dict(os.environ)
    if not trinh_duyet:
        moi_truong['KHONG_TRINH_DUYET'] = '1'
    r = subprocess.run(['node', 'cong_cu/thu_KHUI3d.js'], capture_output=True, text=True, env=moi_truong)
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
