#!/usr/bin/env python3
"""Đột biến KH-KHOP-1: sửa cố ý code đã làm, chạy cong_cu/thu_KHKHOP1.js (có Chromium), bài thử PHẢI đỏ; luôn khôi phục file sau mỗi lần.
VS- = vá sai (làm sai cách); BV- = bỏ vá (gỡ chỗ vá). Chạy: python3 viec/KH-KHOP-1/dot_bien.py (từ gốc kho, không chạy song song với npm test)."""
import subprocess
import sys

KK = 'src/kiemKhop/kiemKhop.js'
TR = 'src/pages/KiemKhop.jsx'
CTP = 'src/kiemKhop/canTuPos.js'
MAIN = 'src/main.jsx'

DOT_BIEN = [
    ('VS-GOI-CUA-NGOAI-HOP-DONG', CTP, "cua: 'POST /gio/bao-gia', token: true, truong: [], khi: T, co: false", "cua: 'GET /gio/bao-gia', token: true, truong: [], khi: T, co: true"),
    ('VS-GOI-HAI-LAN-MOI-CUA', TR, 'cuaGoi.filter((c) => c !== CUA_CHI_TIET)', '[...cuaGoi, ...cuaGoi].filter((c) => c !== CUA_CHI_TIET)'),
    ('VS-BAO-CO-KHI-THIEU-TRUONG', KK, "if (v === undefined || (mang && !Array.isArray(v))) return 'thieu';", "if (v === undefined || (mang && !Array.isArray(v))) continue;"),
    ('VS-MANG-RONG-BAO-CO', KK, "if (!cuoi && !tiep.length) return 'rong';", "if (!cuoi && !tiep.length) return 'co';"),
    ('VS-TRUONG-MOI-THIEU-BAO-LOI', KK, 'return m.moi ? cho(', 'return false ? cho('),
    ('VS-401-CUA-TUY-CHON-BAO-LOI', KK, "kq.loi.status === 401 && m.token === 'tuy_chon' ?", 'false ?'),
    ('VS-GHI-BO-NHO-MAY', TR, "document.title = 'Kiểm khớp POS · Tứ Quý Đường';", "document.title = 'Kiểm khớp POS · Tứ Quý Đường'; try { localStorage.setItem('kh_kiem', '1'); } catch { /* chặn */ }"),
    ('BV-BO-NHANH-KIEMKHOP-O-MAIN', MAIN, 'laKiemKhop ? <KiemKhop /> : <App />', '<App />'),
    ('BV-BO-KHOA-KIEM-LAI-LUC-MO', TR, 'const [khoa, datKhoa] = useState(true);', 'const [khoa, datKhoa] = useState(false);'),
    ('VS-CHONG-DON-HET-NGAY', TR, 'setTimeout(() => datKhoa(false), MS_CHONG_DON)', 'setTimeout(() => datKhoa(false), 0)'),
]


def chay_thu():
    r = subprocess.run(['node', 'cong_cu/thu_KHKHOP1.js'], capture_output=True, text=True)
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
