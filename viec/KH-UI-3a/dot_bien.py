#!/usr/bin/env python3
"""Đột biến KH-UI-3a: sửa cố ý code đã vá, chạy cong_cu/thu_KHUI3a.js, bài thử PHẢI đỏ; luôn khôi phục file sau mỗi lần.
VS- = vá sai (bản vá làm sai cách); BV- = bỏ vá (gỡ chỗ vá). Chạy: python3 viec/KH-UI-3a/dot_bien.py (từ gốc kho)."""
import subprocess
import sys

GIA = 'src/giaHang.js'
MON_O = 'src/components/MonO.jsx'
MENU = 'src/dungMenu.js'
GV = 'src/gioVang.js'
BAY = 'src/bayGio.js'
HT = 'src/heThong.js'
CHU = 'src/pages/TrangChu.jsx'
TK = 'src/pages/TaiKhoan.jsx'
CSS = 'src/giaoDien/giaoDien.css'

DOT_BIEN = [
    ('VS-TU-NHAN-PHAN-TRAM', GIA, "return dong && typeof dong.gia === 'number' && Number.isFinite(dong.gia) ? dong.gia : mon.gia;", "return dong ? Math.round(mon.gia * 0.9) : mon.gia;"),
    ('VS-TRA-SAI-HANG', GIA, "d.hang_id === hangToi.id)", "d.hang_id !== hangToi.id)"),
    ('BV-GIA-HANG-CONG-VAO-GIO-VANG', MON_O, "const bac = dangGv ? null : bacThang(dsHang, mon, hangToi);", "const bac = bacThang(dsHang, mon, hangToi);"),
    ('BV-GIA-HANG-NGUOI-TRUOC-CON-LAI', MENU, "if (doiPhien) datTt((t) => ({ ...t, dl: boGiaHang(t.dl) }));", ""),
    ('VS-LUU-MENU-KEM-GIA-HANG', MENU, "ghiMenuLuu(boGiaHang(dl), luc, lanLay.current)", "ghiMenuLuu(dl, luc, lanLay.current)"),
    ('VS-GIO-VANG-BO-CO-DANG-CHAY', GV, "if (gv.dang_chay === true && bayGiay < b)", "if (bayGiay >= a && bayGiay < b)"),
    ('VS-GIO-VANG-GHEP-CA-MA-LA', GV, ".filter((ma) => mon.has(ma))", ".filter(() => true)"),
    ('VS-LECH-GIO-NGUOC-DAU', BAY, "lech = moc - GIO_VN_LECH - mayMs;", "lech = mayMs - (moc - GIO_VN_LECH);"),
    ('BV-BO-GIO-POS-DUNG-MAY', BAY, "lech = moc - GIO_VN_LECH - mayMs;", "lech = 0;"),
    ('BV-BO-DOI-PHA-KHONG-TAI-LAI', HT, "if ((n ? n.pha : '') !== pha) ve((x) => x + 1);", ""),
    ('BV-BO-BAT-LOI-CUA-HANG', HT, "if (Array.isArray(d.data)) khoHang.dat(d.data); }, () => {});", "if (Array.isArray(d.data)) khoHang.dat(d.data); });"),
    ('VS-THONG-BAO-QUAN-KHONG-NGUYEN-VAN', CHU, "{quan.dangMo ? 'Quán đang mở cửa' : quan.thongBao}", "{quan.dangMo ? 'Quán đang mở cửa' : 'Quán đã đóng cửa'}"),
    ('VS-VI-0-BI-AN', TK, "{typeof khach.so_du_vi === 'number' && <div><b>", "{khach.so_du_vi && <div><b>"),
    ('VS-NHAN-KHOA-NEN-TRONG', CSS, "background:#fff; box-shadow:0 0 0 1px var(--tq-line); text-align:center;", "background:transparent; box-shadow:0 0 0 1px var(--tq-line); text-align:center;"),
    ('VS-NHAN-KHOA-QUA-RONG', CSS, "max-width:90%; box-sizing:border-box; padding:3px 9px;", "max-width:100%; box-sizing:border-box; padding:3px 9px;"),
]


def chay_thu():
    r = subprocess.run(['node', 'cong_cu/thu_KHUI3a.js'], capture_output=True, text=True)
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
