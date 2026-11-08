#!/usr/bin/env python3
"""Đột biến KH-PWA-1: sửa cố ý code đã vá, chạy cong_cu/thu_KHPWA1.js, bài thử PHẢI đỏ; luôn khôi phục file sau mỗi lần.
VS- = vá sai (bản vá làm sai cách); BV- = bỏ vá (gỡ chỗ vá). Chạy: python3 viec/KH-PWA-1/dot_bien.py (từ gốc kho).
Cột cuối: True = chạy cả phần trình duyệt (Chromium); False = phần 1 đủ (đặt KHONG_TRINH_DUYET=1 cho nhanh)."""
import os
import subprocess
import sys

SW = 'public/sw.js'
DK = 'src/dangKySW.js'

DOT_BIEN = [
    ('VS-SW-LUU-API', SW, "if (/^\\/api(\\/|$)/.test(p) || p === '/kiemkhop'", "if (p === '/kiemkhop'", False),
    ('VS-SW-KHAC-MIEN', SW, "if (cach.method !== 'GET' || u.origin !== self.location.origin) return null;", "if (cach.method !== 'GET') return null;", False),
    ('VS-SW-POST', SW, "if (cach.method !== 'GET' || u.origin", "if (u.origin", False),
    ('VS-SW-KIEMKHOP', SW, " || p === '/kiemkhop'", "", False),
    ('VS-SW-TRANG-LUU-TRUOC', SW, "if (cach.mode === 'navigate') return 'trang';", "if (cach.mode === 'navigate') return 'luuTruoc';", False),
    ('VS-SW-KHONG-CHO-3-GIAY', SW, "const het = new Promise((r) => setTimeout(r, CHO_MANG));", "const het = new Promise(() => {});", True),
    ('VS-SW-DON-KHI-LUU-DE-CUNG-BAN', SW, "  if (tenBan(htmlCu) === tenBan(html)) return html;", "", True),
    ('VS-SW-ASSETS-LUU-HTML', SW, "if (dung(res) && !laHtml(res)) await", "if (dung(res)) await", False),
    ('VS-SW-TENBAN-HONG', SW, "  return m ? m[1] : '';", "  return m ? m[1] : 'hong';", False),
    ('VS-DK-BO-HOP-THOAI', DK, "  if (dangMoHopThoai) return false;\n", "", False),
    ('VS-DK-THANHTOAN-AN-TOAN', DK, "giohang|thanhtoan|don", "giohang|don", True),
    ('VS-DK-KIEM-MOI-LAN-HIEN', DK, "return lucAn > 0 && bayGio - lucAn >= n && bayGio - lanKiem >= n;", "return lucAn > 0;", True),
    ('VS-DK-TEN-RONG-LA-DOI', DK, "!!tenMoi && !!tenDangChay && tenMoi !== tenDangChay", "tenMoi !== tenDangChay", False),
    ('VS-DK-DANG-KY-CA-DEV', DK, "if (!import.meta.env?.PROD || !('serviceWorker' in navigator)) return;", "if (!('serviceWorker' in navigator)) return;", False),
    ('VS-DK-ENV-KHONG-HOI', DK, "if (!import.meta.env?.PROD ||", "if (!import.meta.env.PROD ||", False),
    ('BV-SW-BO-LUU-SAN', SW, "  e.waitUntil(layVo('reload').then", "  if (0) e.waitUntil(layVo('reload').then", True),
    ('BV-SW-BO-CLAIM', SW, ".then(() => self.clients.claim())", "", True),
    ('BV-SW-BO-DON-ASSETS', SW, "    if (p.startsWith('/assets/') && !giu.has(p)) await kho.delete(r);\n", "", True),
    ('BV-DK-BO-TAI-LAI', DK, "    location.reload();\n", "", True),
    ('BV-MAIN-BO-DANG-KY', 'src/main.jsx', "\ndangKySW()\n", "\n", True),
    ('BV-HEADERS-BO-ASSETS', 'public/_headers', "/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n", "", False),
]


def chay_thu(trinh_duyet):
    moi_truong = dict(os.environ)
    if not trinh_duyet:
        moi_truong['KHONG_TRINH_DUYET'] = '1'
    r = subprocess.run(['node', 'cong_cu/thu_KHPWA1.js'], capture_output=True, text=True, env=moi_truong)
    dong = [d for d in r.stdout.splitlines() if d.strip()]
    hong = [d.strip() for d in dong if d.strip().startswith('✗')]
    return r.returncode, (dong[-1] if dong else '(không có đầu ra)') + (' · ' + hong[0][:90] if hong else '')


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
