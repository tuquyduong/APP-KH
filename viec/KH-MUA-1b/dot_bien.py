#!/usr/bin/env python3
"""Đột biến KH-MUA-1b: sửa cố ý code đã vá, chạy cong_cu/thu_KHMUA1b.js, bài thử PHẢI đỏ; luôn khôi phục file sau mỗi lần.
VS- = vá sai (bản vá làm sai cách); BV- = bỏ vá (gỡ chỗ vá). Chạy: python3 viec/KH-MUA-1b/dot_bien.py (từ gốc kho).
Đối chứng: chạy bài thử trên code KHÔNG đột biến trước — phải xanh, không thì dừng (đỏ sẵn thì "bắt được" là vô nghĩa).
Cột cuối: True = chạy cả phần trình duyệt (Chromium); False = phần 1 đủ (đặt KHONG_TRINH_DUYET=1 cho nhanh)."""
import os
import subprocess
import sys

DD = 'src/datDon.js'
TT = 'src/pages/ThanhToan.jsx'
APP = 'src/App.jsx'
CO = 'src/noiDung/caiDat.js'

DOT_BIEN = [
    ('VS-GUI-LAI-KHOA-MOI', DD, "const don = docDatDon(await gui(than));", "const don = docDatDon(await gui({ ...than, khoa_gui: taoKhoaGui() }));", True),
    ('VS-GUI-LAI-THAN-KHAC', DD, "const don = docDatDon(await gui(than));", "const don = docDatDon(await gui(JSON.parse(JSON.stringify({ ...than, mon: [...than.mon].reverse() }))));", True),
    ('VS-5XX-LA-CHUA-TAO', DD, "return e && e.status >= 400 && e.status < 500 && e.status !== 401 && e.code ? 'chua_tao' : 'khong_biet';", "return e && e.status >= 400 && e.status !== 401 && e.code ? 'chua_tao' : 'khong_biet';", False),
    ('VS-4XX-LA-KHONG-BIET', DD, "return e && e.status >= 400 && e.status < 500 && e.status !== 401 && e.code ? 'chua_tao' : 'khong_biet';", "return e && e.status === 400 && e.status !== 401 && e.code ? 'chua_tao' : 'khong_biet';", True),
    ('BV-LUAT-4XX', DD, "return e && e.status >= 400 && e.status < 500 && e.status !== 401 && e.code ? 'chua_tao' : 'khong_biet';", "return e && ['PIN_SAI', 'VI_KHONG_DU', 'HET_HANG', 'NGOAI_GIO', 'QUA_GIO_NHAN_DON'].includes(e.code) ? 'chua_tao' : 'khong_biet';", True),
    ('BV-TONG-DA-XEM', DD, "khoa_gui: khoaGui, tong_da_xem: tongDaXem };", "khoa_gui: khoaGui };", True),
    ('VS-TONG-TU-TINH', TT, "khoaGui: taoKhoaGui(), tongDaXem: bg.tong });", "khoaGui: taoKhoaGui(), tongDaXem: bg.tamTinh - bg.giam.reduce((s, g) => s + g.soTien, 0) + 1 });", True),
    ('VS-LUU-PIN', DD, "  const { pin, ...con } = than;", "  const { ...con } = than;", True),
    ('BV-CHAN-KHI-CHUA-RO', TT, "|| dsDon.dangTai || chuaRo || !!donKhac || !!donCho ||", "|| dsDon.dangTai || !!donKhac || !!donCho ||", True),
    ('BV-CHAN-DON-CHO-TRA', TT, "|| dsDon.dangTai || chuaRo || !!donKhac || !!donCho ||", "|| dsDon.dangTai || chuaRo || !!donKhac ||", True),
    ('BV-KIEM-O-DIEM-GUI', TT, ": chanBoiBanGhi(g, daThay.current) || !bg) {", ": !bg) {", True),
    ('BV-KIEM-GUI-LAI', TT, "if (cu ? !conChuaRo(g, cu.khoa_gui) :", "if (cu ? false :", True),
    ('BV-GHI-HONG', DD, "  if (ghiHong) return boNho();\n", "", False),
    ('VS-DATHAY-CA-CHUA-RO', TT, "useRef(guiDo && guiDo.ma_don ? guiDo.khoa_gui : null);", "useRef(guiDo && guiDo.khoa_gui);", True),
    ('BV-QUEN-BO-NHO-KHI-DOI-KHACH', 'src/luuMay.js', "ghiChu(sdt, k); quenBoNho(); }", "ghiChu(sdt, k); }", False),
    ('BV-AN-GUI-LAI-QUA-HAN', TT, "{!guiDo.quaHan && <button type=\"button\" className=\"checkout-btn\" onClick={guiLaiDungDon}>", "{<button type=\"button\" className=\"checkout-btn\" onClick={guiLaiDungDon}>", True),
    ('BV-GIU-BO-NHO', DD, "  banGhiBoNho = con;\n", "", True),
    ('BV-GUI-LAI-GIA-DOI', TT, "if (cu && e.code === 'GIA_DA_DOI') {", "if (false) {", True),
    ('VS-XOA-BAN-GHI-KHI-XONG', APP, "ghiGuiDo({ ...g, xong: true });", "ghiGuiDo(null);", True),
    ('BV-GHI-TRUOC-GUI', TT, "    ghiGuiDo(ghi); // TRƯỚC", "    // TRƯỚC", True),
    ('BV-GIA-DA-DOI', TT, "const b = docBaoGia(dl.bao_gia); if (b) datBg(b);", "const b = docBaoGia(dl.bao_gia); void b;", True),
    ('VS-BAT-CO-TRUOC-NOI-CUA', DD, "{ gui = canMo(datDonApp),", "{ gui = canMo(() => Promise.reject(Object.assign(new Error('Chưa nối cửa'), { status: 0, code: 'MANG_LOI' }))),", True),
    ('BV-CO-TAT', CO, "export const DAT_ONLINE = true;", "export const DAT_ONLINE = false;", False),
    ('BV-QUAY-LAI-SAU-THEM', APP, "datThongBao(`Đã thêm ${mon.ten} vào giỏ`); luiVe(); };", "vaoGio(`Đã thêm ${mon.ten} vào giỏ`); };", True),
    # vòng sửa 4 (chat soát cuối 03.11): S1 401 = chưa rõ, S2 gửi lại + sai PIN giữ bản ghi
    ('VS-401-CHUA-TAO', DD, " && e.status !== 401 && e.code ? 'chua_tao'", " && e.code ? 'chua_tao'", True),
    ('VS-401-TU-GUI-LAI', DD, "if (loi.status === 401 || (xuLy", "if (false || (xuLy", False),
    ('BV-401-XOA-BAN-GHI', DD, "if (loi.status === 401 || (xuLy", "if (loi.status === 401) throw loi; if ((xuLy", True),
    ('VS-PIN-GUI-LAI-XOA', TT, "if (MA_PIN.includes(e.code)) { if (!cu) ghiGuiDo(null); throw e; }", "if (MA_PIN.includes(e.code)) { ghiGuiDo(null); throw e; }", True),
]


def chay_thu(trinh_duyet):
    moi_truong = dict(os.environ)
    if not trinh_duyet:
        moi_truong['KHONG_TRINH_DUYET'] = '1'
    r = subprocess.run(['node', 'cong_cu/thu_KHMUA1b.js'], capture_output=True, text=True, env=moi_truong)
    dong = [d for d in r.stdout.splitlines() if d.strip()]
    return r.returncode, (dong[-1] if dong else '(không có đầu ra)')


def main():
    ma, dong = chay_thu(True)
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
