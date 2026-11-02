import { useCallback, useEffect, useRef, useState } from 'react';
import { layDon, layChiTietDon } from '../api.js';
import { dungTai } from '../dungTai.js';
import { dungCua, cuaDon } from '../duLieuKhach.js';
import { dinhDangGia, dinhDangNgay } from '../dinhDang.js';
import Man, { DauManCon } from '../components/Man.jsx';
import TrangTai, { KhungLoi } from '../components/TrangTai.jsx';

// Lịch sử đơn theo demo (orderhistory). Danh sách `/don` chưa có tên món → không dòng "items"; nút "Đặt lại" (KH-MUA-1, chỉ khi App truyền
// `datLai` — cùng cờ DAT_ONLINE) để App đọc chi tiết đơn rồi bỏ món vào giỏ theo `ma`;
// ô lọc (Đang giao / Hoàn thành / Đã hủy) ẩn vì POS chưa ghi giá trị `trang_thai`. Chỉ hiện trạng thái POS trả — KHÔNG tính tiền chưa trả.
// Đơn App chưa có đơn thật: trang_thai / thanh_toan = null (hợp đồng v5) → đọc tien_trinh.
function NhanDon({ don }) {
  if (don.trang_thai === 'cancelled' || don.tien_trinh === 'da_huy') return <div className="order-status cancelled">Đã hủy</div>;
  if (don.tien_trinh === 'cho_tra') return <div className="order-status shipping">Chờ thanh toán</div>;
  if (don.thanh_toan === 'paid' || ['da_tra', 'dang_lam', 'xong'].includes(don.tien_trinh)) return <div className="order-status done">Đã thanh toán</div>;
  return null;
}

export function ChiTietDon({ ma, lui }) {
  const tai = dungTai(useCallback(() => layChiTietDon(ma), [ma]));
  return (
    <Man id="orderdetail">
      <DauManCon tieuDe={`Đơn #${ma}`} lui={lui} />
      <TrangTai tai={tai}>
        {({ don }) => (
          <div className="order-card">
            <div className="top">
              <div><div className="code">#{don.ma || ma}</div><div className="date">{dinhDangNgay(don.ngay)}</div></div>
              <NhanDon don={don} />
            </div>
            {don.mon.map((m, i) => (
              <div className="summary-row" key={i}>
                <span>{m.so_luong} × {m.ten}{m.ghi_chu && <div className="date">{m.ghi_chu}</div>}</span>
                <span>{dinhDangGia(m.thanh_tien)}</span>
              </div>
            ))}
            <div className="summary-row total"><span>Tổng</span><span>{dinhDangGia(don.tong)}</span></div>
          </div>
        )}
      </TrangTai>
    </Man>
  );
}

const TRANG_SAU_RONG = { ds: [], trang: 1, conNua: null, dang: false, loi: '' };

export default function LichSuDon({ chonDon, lui, datLai }) {
  const dau = dungCua(cuaDon); // trang 1 ở kho chung (tải trước khi mở app); trang 2 trở đi gọi khi khách bấm "Xem thêm" (không giữ)
  const [sau, datSau] = useState(TRANG_SAU_RONG);
  // Trang 1 làm mới mà danh sách mã ĐỔI (đơn mới đẩy đơn cũ sang trang sau — phân trang OFFSET): bỏ các trang sau đã xem, tránh hụt dòng.
  // So NỘI DUNG (mã đơn), không so đối tượng: làm mới ngầm không có đơn mới thì giữ nguyên các trang khách đã mở.
  const khoaTrang1 = dau.dl ? dau.dl.data.map((d) => d.ma).join(',') : '';
  const khoaTruoc = useRef(khoaTrang1);
  useEffect(() => {
    if (khoaTruoc.current && khoaTrang1 !== khoaTruoc.current) datSau(TRANG_SAU_RONG);
    khoaTruoc.current = khoaTrang1;
  }, [khoaTrang1]);
  const conNua = sau.conNua === null ? !!(dau.dl && dau.dl.con_nua) : sau.conNua;
  // Phân trang theo OFFSET: đơn mới làm trang sau lặp lại đơn cuối trang trước → bỏ đơn đã có (key trùng).
  const ds = (dau.dl ? dau.dl.data : []).concat(sau.ds).filter((d, i, a) => a.findIndex((c) => c.ma === d.ma) === i);
  const dang = dau.dangTai || sau.dang;
  const loi = dau.loi || sau.loi;

  async function xemThem() {
    const t = sau.trang + 1;
    datSau((s) => ({ ...s, dang: true, loi: '' }));
    try {
      const r = await layDon(t);
      datSau((s) => ({ ds: [...s.ds, ...r.data], trang: t, conNua: r.con_nua, dang: false, loi: '' }));
    } catch (e) {
      datSau((s) => ({ ...s, dang: false, loi: e.message }));
    }
  }
  const thuLai = dau.loi ? dau.taiLai : xemThem;

  return (
    <Man id="orderhistory">
      <DauManCon tieuDe="Lịch sử đơn hàng" phu={ds.length > 0 && !conNua ? `${ds.length} đơn` : ''} lui={lui} />
      {ds.length === 0 && !dang && !loi && <div className="empty-note">Bạn chưa có đơn nào.</div>}
      {ds.map((d) => (
        <div className="order-card" key={d.ma} role="button" tabIndex={0} onClick={() => chonDon(d)} onKeyDown={(e) => { if (e.key === 'Enter') chonDon(d); }}>
          <div className="top">
            <div><div className="code">#{d.ma}</div><div className="date">{dinhDangNgay(d.ngay)}</div></div>
            <NhanDon don={d} />
          </div>
          <div className="bottom"><div className="total">{dinhDangGia(d.tong)}</div>{datLai && <button type="button" className="reorder-btn" onClick={(e) => { e.stopPropagation(); datLai(d.ma); }}>Đặt lại</button>}</div>
        </div>
      ))}
      {dang && <div className="khung-tai" aria-busy="true" />}
      {loi && <KhungLoi loi={loi} thuLai={thuLai} />}
      {conNua && !dang && !loi && <div className="more-l"><span role="button" tabIndex={0} onClick={xemThem} onKeyDown={(e) => { if (e.key === 'Enter') xemThem(); }}>Xem thêm</span></div>}
    </Man>
  );
}
