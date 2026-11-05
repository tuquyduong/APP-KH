#!/usr/bin/env python3
"""Đột biến KH-MUA-1c: sửa cố ý code đã vá, chạy cong_cu/thu_KHMUA1c.js, bài thử PHẢI đỏ; luôn khôi phục file sau mỗi lần.
VS- = vá sai (bản vá làm sai cách); BV- = bỏ vá (gỡ chỗ vá). Chạy: python3 viec/KH-MUA-1c/dot_bien.py (từ gốc kho).
Đối chứng: chạy bài thử trên code KHÔNG đột biến trước — phải xanh, không thì dừng (đỏ sẵn thì "bắt được" là vô nghĩa).
Cột cuối: True = chạy cả phần trình duyệt (Chromium); False = phần 1 đủ (đặt KHONG_TRINH_DUYET=1 cho nhanh)."""
import os
import subprocess
import sys

DD = 'src/datDon.js'
TT = 'src/pages/ThanhToan.jsx'
TD = 'src/pages/TheoDoiDon.jsx'
PS = 'src/components/PinSheet.jsx'
CSS = 'src/giaoDien/giaoDien.css'
TRA = "const tra = don && don.cachTra !== undefined ? (don.cachTra && { cach_tra: don.cachTra, giu_vi: don.giuVi, con_lai: don.conLai }) : banGhiCuaDon(ma);"

DOT_BIEN = [
    ('VS-KHO-BAN-CHUA-TAO', DD, "const LUOT_GUI_LAI = { DANG_XU_LY: 30, KHO_BAN: 8 };", "const LUOT_GUI_LAI = { DANG_XU_LY: 30 };", True),
    ('VS-KHO-BAN-KHOA-MOI', DD, "const don = docDatDon(await gui(than));", "const don = docDatDon(await gui(lan ? { ...than, khoa_gui: taoKhoaGui() } : than));", True),
    ('VS-KHO-BAN-THAN-KHAC', DD, "const don = docDatDon(await gui(than));", "const don = docDatDon(await gui(lan ? { ...than, tong_da_xem: than.tong_da_xem + 1 } : than));", True),
    ('VS-KHO-BAN-429-CHUA-TAO', DD, "if (loai === 'chua_tao' && lan === 0) throw loi;", "if (loai === 'chua_tao') throw loi;", True),
    ('VS-KHOA-DA-DUNG-XOA', TT, "ghiGuiDo({ ...ghi, da_dung: true });", "ghiGuiDo(null);", True),
    ('VS-GIU-VI-TU-TINH', DD, "giuVi: so(d.giu_vi) ? d.giu_vi : null,", "giuVi: so(d.tong) && so(d.con_lai) ? d.tong - d.con_lai : null,", False),
    ('VS-GIU-VI-BAN-GHI-TRUOC', TD, TRA, "const tra = banGhiCuaDon(ma) || (don && don.cachTra ? { cach_tra: don.cachTra, giu_vi: don.giuVi, con_lai: don.conLai } : null);", True),
    ('VS-DON-QUAY-DONG-VI', TD, TRA, "const tra = don && don.cachTra ? { cach_tra: don.cachTra, giu_vi: don.giuVi, con_lai: don.conLai } : banGhiCuaDon(ma);", True),
    ('BV-DIEM-GUI-BAO-GIA', TT, ": chanBoiBanGhi(g, daThay.current) || !bg) {", ": chanBoiBanGhi(g, daThay.current)) {", True),
    ('VS-401-CHUA-TAO', DD, "if (e && (e.status === 401 || MA_DUNG.includes(e.code))) return 'dung';", "if (e && MA_DUNG.includes(e.code)) return 'dung';", True),
    ('VS-PIN-DANG-KHOA-XOA', TT, "if (MA_PIN.includes(e.code)) { if (!cu) ghiGuiDo(null); throw e; }", "if (MA_PIN.includes(e.code)) { if (!cu || e.code === 'PIN_DANG_KHOA') ghiGuiDo(null); throw e; }", True),
    ('BV-GHI-HONG-DOC-KHO', DD, "  let tho;\n", "  if (ghiHong) return boNho();\n  let tho;\n", False),
    ('VS-PIN-TU-GUI', PS, "  function xacNhan() {", "  useEffect(() => { if (so.length === DO_DAI) xacNhan(); }, [so]);\n  function xacNhan() {", True),
    ('VS-PIN-XOA-HET', PS, "datSo(so.slice(0, -1));", "datSo('');", True),
    ('BV-PIN-GIUA', CSS, ".pin-pad button{ text-align:center; }\n", "", True),
]


def chay_thu(trinh_duyet):
    moi_truong = dict(os.environ)
    if not trinh_duyet:
        moi_truong['KHONG_TRINH_DUYET'] = '1'
    r = subprocess.run(['node', 'cong_cu/thu_KHMUA1c.js'], capture_output=True, text=True, env=moi_truong)
    dong = [d for d in r.stdout.splitlines() if d.strip()]
    hong = [d.strip()[:110] for d in dong if d.strip().startswith('✗')]
    return r.returncode, (dong[-1] if dong else '(không có đầu ra)'), hong[:2]


def main():
    ma, dong, _ = chay_thu(True)
    print(f'ĐỐI CHỨNG (không đột biến): {"XANH" if not ma else "ĐỎ"} — {dong}', flush=True)
    if ma:
        print('Bài thử đỏ sẵn trên code đã vá — dừng.')
        sys.exit(2)
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
            ma, dong, hong = chay_thu(trinh_duyet)
        finally:
            with open(tep, 'w', encoding='utf8') as f:
                f.write(goc)
        print(f'{ten}: {"ĐỎ" if ma else "XANH (bài thử KHÔNG bắt được)"} — {dong} {" | ".join(hong)}', flush=True)
        if not ma:
            xanh.append(ten)
    print('TẤT CẢ ĐỘT BIẾN ĐỀU BỊ BẮT' if not xanh else 'CÒN SỐNG: ' + ', '.join(xanh))
    sys.exit(1 if xanh else 0)


main()
