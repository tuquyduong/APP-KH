// TRANG TẠM, CÔNG KHAI (chủ quán chốt 31.10): /kiemkhop cho chủ quán xem App KH cần gì từ POS và POS đã có gì thật.
// Việc KH-ADMIN-1 (sau khai trương) chuyển trang này vào /admin và XOÁ đường dẫn công khai /kiemkhop (duongDan.js, main.jsx).
// Chỉ ĐỌC: mỗi cửa GET một lần mỗi lần mở / bấm "Kiểm lại"; không POST/PUT, không gọi theo giờ, không hiện hay lưu dữ liệu khách.
import { useEffect, useState } from 'react';
import { docToken, layHang, layGioVang, layGioHoatDong, layToi, layMenu, layDiem, layVoucher, layDon, layChiTietDon } from '../api.js';
import { ghepDiaChi } from '../dinhDang.js';
import { CAN_TU_POS } from '../kiemKhop/canTuPos.js';
import { trangThaiMuc, xepNhom, cuaCanGoi, phanLoaiKetNoi, doLechGiay } from '../kiemKhop/kiemKhop.js';
import Man from '../components/Man.jsx';

const GOI = { 'GET /hang': layHang, 'GET /gio-vang': layGioVang, 'GET /gio-hoat-dong': layGioHoatDong, 'GET /toi': layToi, 'GET /menu': layMenu, 'GET /diem': layDiem, 'GET /voucher': () => layVoucher(false), 'GET /don': () => layDon(1) };
const CUA_CHI_TIET = 'GET /don/:ma'; // mã đơn lấy từ /don vừa gọi; không hiện, không lưu
const MS_CHONG_DON = 5000;
const DAU = { ok: '✓', thieu: '✗', loi: '✗', cho: '⏳', rong: '?', hd: '•', dn: '–', dang: '…' };
const LOP = { ok: ' done', thieu: ' cancelled', loi: ' cancelled' };

const bao = (lenh) => lenh.then((dl) => ({ ok: true, dl }), (e) => ({ ok: false, loi: { status: e.status, code: e.code, message: e.message } }));

export default function KiemKhop() {
  const [dangNhap] = useState(() => !!docToken());
  const [kq, datKq] = useState({});
  const [lan, datLan] = useState(0);
  const [khoa, datKhoa] = useState(true);

  useEffect(() => {
    document.title = 'Kiểm khớp POS · Tứ Quý Đường';
    const khongChiMuc = Object.assign(document.createElement('meta'), { name: 'robots', content: 'noindex' });
    document.head.appendChild(khongChiMuc);
    let huy = false;
    const ghi = (cua, r) => { if (!huy) datKq((c) => ({ ...c, [cua]: r })); };
    const cuaGoi = cuaCanGoi(CAN_TU_POS, dangNhap);
    for (const cua of cuaGoi.filter((c) => c !== CUA_CHI_TIET)) {
      bao(GOI[cua]()).then((r) => {
        ghi(cua, cua === 'GET /gio-hoat-dong' && r.ok ? { ...r, lech: doLechGiay(r.dl.bay_gio, Date.now()) } : r);
        if (cua === 'GET /don' && cuaGoi.includes(CUA_CHI_TIET)) {
          const ma = r.ok && Array.isArray(r.dl.data) && r.dl.data[0] && r.dl.data[0].ma;
          if (!r.ok) ghi(CUA_CHI_TIET, r); else if (ma && !huy) bao(layChiTietDon(ma)).then((x) => ghi(CUA_CHI_TIET, x)); else ghi(CUA_CHI_TIET, { trong: true });
        }
      });
    }
    const id = setTimeout(() => datKhoa(false), MS_CHONG_DON);
    return () => { huy = true; clearTimeout(id); khongChiMuc.remove(); };
  }, [lan, dangNhap]);

  const kiemLai = () => { if (khoa) return; datKq({}); datKhoa(true); datLan((n) => n + 1); };
  const gh = kq['GET /gio-hoat-dong'];
  const kn = phanLoaiKetNoi(gh);

  return (
    <div className="phone"><div className="screens">
      <Man id="kiemkhop">
        <div className="topbar"><div><h1>Kiểm khớp POS</h1><div className="sub">Chỉ đọc · dành cho chủ quán</div></div></div>
        <div className="order-card">
          <div className="top"><div><div className="code">Kết nối</div><div className="date">{ghepDiaChi(import.meta.env.VITE_POS_API, '')}</div></div><span className={`order-status${LOP[kn.tt === 'thong' ? 'ok' : kn.tt === 'dang' ? '' : 'loi'] || ''}`}>{kn.tt === 'thong' ? '✓' : kn.tt === 'dang' ? '…' : '✗'}</span></div>
          <div className="items ket-noi">
            {kn.chu}
            {gh && gh.ok && <><br />Giờ POS: {String(gh.dl.bay_gio || '').replace('T', ' ')}{gh.lech === null || gh.lech === undefined ? '' : ` · lệch với đồng hồ máy ${gh.lech >= 0 ? '+' : ''}${gh.lech} giây (chỉ để xem)`}</>}
          </div>
        </div>
        {xepNhom(CAN_TU_POS).map((nhom) => (
          <div key={nhom.khi}>
            <div className="sec-head"><h2>{nhom.ten}</h2></div>
            {nhom.ds.map((m) => {
              const t = trangThaiMuc(m, kq[m.cua], dangNhap);
              return (
                <div className="order-card muc" key={m.ma}>
                  <div className="top"><div><div className="code">{m.ten}</div><div className="date">{m.cua}{m.viec_pos ? ` · ${m.viec_pos}` : ''}</div></div><span className={`order-status${LOP[t.tt] || ''}`}>{DAU[t.tt]}</span></div>
                  <div className="items">{t.chu}</div>
                </div>
              );
            })}
          </div>
        ))}
        <button type="button" className={`checkout-btn giua${khoa ? ' btn-disabled' : ''}`} disabled={khoa} onClick={kiemLai}>Kiểm lại</button>
      </Man>
    </div></div>
  );
}
