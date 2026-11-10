#!/usr/bin/env python3
"""Đột biến KH-PWA-2: sửa cố ý public/sw.js đã vá, chạy cong_cu/thu_KHPWA1.js (KHONG_TRINH_DUYET=1), bài thử PHẢI đỏ; luôn khôi phục file.
VS- = vá sai (vá sai cách); BV- = bỏ vá (gỡ chỗ vá). Chạy từ gốc kho: python3 viec/KH-PWA-2/dot_bien.py"""
import os
import subprocess
import sys

SW = 'public/sw.js'

DOT_BIEN = [
    ('BV-SW-AMTHANH-QUA-SW', SW, "/^\\/(fonts|anh)\\/|", "/^\\/(fonts|anh|am_thanh)\\/|"),
    ('VS-SW-AMTHANH-LUU-TRUOC', SW, "  if (p.startsWith('/assets/')) return 'luuTruoc';", "  if (p.startsWith('/assets/') || p.startsWith('/am_thanh/')) return 'luuTruoc';"),
    ('BV-SW-KHO-V1', SW, "const KHO = 'tqd-v2';", "const KHO = 'tqd-v1';"),
    ('BV-SW-TRANG-5XX', SW, "res.status >= 500 || ", ""),
    ('VS-SW-TRANG-CHI-503', SW, "res.status >= 500 ||", "res.status === 503 ||"),
    ('BV-SW-TRANG-404', SW, " || res.status === 404", ""),
    ('BV-SW-TRANG-KHONG-PHAI-HTML', SW, " || !laHtml(res));", ");"),
    ('VS-SW-TRANG-CHUYEN-HUONG', SW, "res.type !== 'opaqueredirect' && ", ""),
    ('BV-SW-TRANG-KHONG-CHON', SW, ".then(chon).catch(", ".catch("),
    ('VS-SW-TRANG-HONG-CHI-DUNG-VO-KHI-MAT-MANG', SW, "(trangHong(res) ? voLuu().then((vo) => vo || res) : res)", "res"),
    ('BV-SW-TRANG-LA-VAN-LUU', SW, "  if (!tenBan(html)) return ''; // trang lạ (wifi quán, lỗi nhà mạng…): không lưu, giữ vỏ cũ\n", ""),
    ('VS-SW-TRANG-LA-CHI-KIEM-RONG', SW, "if (!tenBan(html)) return '';", "if (!html) return '';"),
]


def chay_thu():
    moi_truong = dict(os.environ, KHONG_TRINH_DUYET='1')
    r = subprocess.run(['node', 'cong_cu/thu_KHPWA1.js'], capture_output=True, text=True, env=moi_truong)
    dong = [d for d in r.stdout.splitlines() if d.strip()]
    hong = [d.strip() for d in dong if d.strip().startswith('✗')]
    return r.returncode, (dong[-1] if dong else '(không có đầu ra)') + (' · ' + hong[0][:90] if hong else '')


def main():
    xanh = []
    for ten, tep, cu, moi in DOT_BIEN:
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
        print(f'{ten}: {"ĐỎ" if ma else "XANH (bài thử KHÔNG bắt được)"} — {dong}', flush=True)
        if not ma:
            xanh.append(ten)
    print('TẤT CẢ ĐỘT BIẾN ĐỀU BỊ BẮT' if not xanh else 'CÒN SỐNG: ' + ', '.join(xanh))
    sys.exit(1 if xanh else 0)


main()
