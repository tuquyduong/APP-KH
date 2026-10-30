#!/usr/bin/env python3
"""Đột biến KH-LUU-1: sửa cố ý code đã vá, chạy cong_cu/thu_KHLUU1.js, bài thử PHẢI đỏ; luôn khôi phục file sau mỗi lần.
VS- = vá sai (bản vá làm sai cách); BV- = bỏ vá (gỡ chỗ vá). Chạy: python3 viec/KH-LUU-1/dot_bien.py (từ gốc kho)."""
import subprocess
import sys

LUU = 'src/luuMay.js'
APP = 'src/App.jsx'
HOOK = 'src/dungTracNghiem.js'

DOT_BIEN = [
    ('VS-SO-CHU-NGUOC', LUU, "return chu === null ? 'chuaBiet' : chu === dauVet(sdt);", "return chu === null ? 'chuaBiet' : chu !== dauVet(sdt);"),
    ('VS-DAU-VET-KHONG-CHUAN-HOA', LUU, "if (so.startsWith('84')) so = '0' + so.slice(2);", ''),
    ('VS-KHONG-XOA-KHI-KHAC', LUU, "const xoa = cung === false ||", "const xoa = false ||"),
    ('BV-BO-CA-BAN-CU', LUU, "(cung === 'chuaBiet' && coDuLieu(k))", "false"),
    ('VS-XOA-TAT-CA-GIU-CHU', LUU, "  try { lay(k).removeItem(KHOA_CHU); } catch { /* kho chặn */ }\n", ''),
    ('BV-BO-DOI-KHACH', APP, "doiKhach(r.khach.sdt); ", ''),
    ('BV-BO-NAP', APP, " tn.nap();", ''),
    ('BV-BO-XOA-DANG-XUAT', APP, "xoaToken(); xoaTatCa();", "xoaToken();"),
    ('VS-HET-PHIEN-XOA-KHOA', HOOK, "const donBoNho = () => { datLuu(null);", "const donBoNho = () => { xoaKetQua(); datLuu(null);"),
    ('VS-LO-KET-QUA-KHI-CHUA-DANG-NHAP', APP, "const klLuu = dangNhap ? tn.klLuu : null;", "const klLuu = tn.klLuu;"),
]


def chay_thu():
    r = subprocess.run(['node', 'cong_cu/thu_KHLUU1.js'], capture_output=True, text=True)
    dong = [d for d in r.stdout.splitlines() if d.strip()]
    return r.returncode, (dong[-1] if dong else '(không có đầu ra)')


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
        print(f'{ten}: {"ĐỎ" if ma else "XANH (bài thử KHÔNG bắt được)"} — {dong}')
        if not ma:
            xanh.append(ten)
    print('TẤT CẢ ĐỘT BIẾN ĐỀU BỊ BẮT' if not xanh else 'CÒN SỐNG: ' + ', '.join(xanh))
    sys.exit(1 if xanh else 0)


main()
