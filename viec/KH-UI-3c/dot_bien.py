#!/usr/bin/env python3
"""Đột biến KH-UI-3c: sửa cố ý code đã vá, chạy cong_cu/thu_KHUI3c.js, bài thử PHẢI đỏ; luôn khôi phục file sau mỗi lần.
VS- = vá sai (bản vá làm sai cách); BV- = bỏ vá (gỡ chỗ vá). Chạy: python3 viec/KH-UI-3c/dot_bien.py (từ gốc kho)."""
import subprocess
import sys

GV = 'src/components/OGioVang.jsx'
TN = 'src/components/OTracNghiem.jsx'
CSS = 'src/giaoDien/giaoDien.css'

DOT_BIEN = [
    ('BV-GIO-VANG-QUAY-LAI-RETURN-NULL', GV, '  if (!tt || (coMenu && maGv.size === 0)) {\n    return (', '  if (!tt || (coMenu && maGv.size === 0)) {\n    return null;\n    return ('),
    ('VS-O-MO-CHO-BAM-DUOC', GV, '<div className="hb-tile hb-t-flash hb-mo">', '<div className="hb-tile hb-t-flash hb-mo" {...bam(mo)}>'),
    ('VS-O-MO-CO-DEM-NGUOC', GV, '<div className="hb-h">Hiện chưa có</div>', '<div className="hb-h">Hiện chưa có</div><div className="hb-s"><GvDem kieu="short" /></div>'),
    ('VS-DONG-KHOA-QUAY-VE-DONG-PHU-CU', TN, '<div className="hb-h hb-khoa"><DongKhoa /></div>', '<div className="hb-h two">{CHU.hoi}</div>'),
    ('VS-DONG-KHOA-BI-MO', CSS, '.hb-mo .hb-tx > :not(.hb-khoa){ opacity:.55; }', '.hb-mo .hb-tx > *{ opacity:.55; }'),
    ('VS-O-KHOA-MAT-DO-MO', CSS, '.hb-mo > .hb-ic, .hb-mo .hb-tx > :not(.hb-khoa){ opacity:.55; }', '.hb-mo > .hb-ic, .hb-mo .hb-tx > :not(.hb-khoa){ opacity:1; }'),
    ('VS-DONG-KHOA-CAO-HON-O-THUONG', CSS, 'line-height:15px; min-height:30px;', 'line-height:15px; min-height:45px;'),
    ('VS-KHACH-LO-THE-TRANG-DA-LUU', TN, 'const the = dangNhap && klLuu ?', 'const the = klLuu ?'),
    ('VS-CHAM-O-KHOA-SAI-TRANG-TIEP', TN, "{...bam(dangNhap ? mo : () => moDangNhap(taoDuongDan('tracnghiem')))}", "{...bam(dangNhap ? mo : () => moDangNhap('/uudai'))}"),
    ('BV-LUAT-GIAN-HET-HANG-QUAY-LAI', CSS, '.hb-mo:not([role="button"]){ cursor:default; }', '.hb-tiles:has(> :only-child){ grid-template-columns:1fr; }\n.hb-mo:not([role="button"]){ cursor:default; }'),
]


def chay_thu():
    r = subprocess.run(['node', 'cong_cu/thu_KHUI3c.js'], capture_output=True, text=True)
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
