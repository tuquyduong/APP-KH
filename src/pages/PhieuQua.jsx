import { dungCua, cuaQuaToi } from '../duLieuKhach.js';
import { docQuaCuaToi, ngayPos } from '../doiQua.js';
import { dinhDangSo } from '../dinhDang.js';
import { nd, ndDau, ndPhan } from '../noiDung/nd.js';
import Chu from '../components/Chu.jsx';
import Man, { DauManCon } from '../components/Man.jsx';
import TrangTai from '../components/TrangTai.jsx';
import { VeQR, VIEN_QUET, dungGiuManSang } from './ManQR.jsx';
import '../giaoDien/doi_qua.css';

// Phiếu quà (/uudai/qua/<mã>, KH-DOI-1 B5): khuôn màn "Mã thành viên" — VeQR vẽ từ `qr` POS (App chỉ vẽ) + viền quét rộng + giữ màn sáng. Quầy quét mã / tra SĐT để "Đã trao".
// Phiếu đọc từ kho Quà của tôi (đổi xong đã lamMoi). Đã nhận / hết hạn → không vẽ mã.
const POS = ndDau('dq.pos');

export default function PhieuQua({ ma, lui }) {
  dungGiuManSang();
  const tai = dungCua(cuaQuaToi);
  return (
    <Man id="phieuqua">
      <DauManCon tieuDe={nd('dq.ph.tieuDe')} lui={lui} />
      <TrangTai tai={tai}>
        {(dl) => {
          const { cho, xong } = docQuaCuaToi(dl);
          const p = cho.concat(xong).find((x) => x.ma === ma);
          if (!p) return <Chu k="dq.ph.khong" as="div" className="empty-note" />;
          const ngay = ngayPos(p.hetHan);
          return (
            <>
              <div className="dq-ph-ten" {...POS}>{p.ten}</div>
              {p.diem !== null && ngay && <div className="dq-ph-phu" {...ndDau('dq.ph.doi')}>{ndPhan('dq.ph.doi', { so: dinhDangSo(p.diem), ngay: <b key="ngay">{ngay}</b> })}</div>}
              {p.trangThai === 'chua_dung'
                ? p.qr && <div className="khung-qr" {...POS}><VeQR noiDung={p.qr} nhan={nd('dq.ph.ma', { ma: p.ma })} vien={VIEN_QUET} /></div>
                : <Chu k={p.trangThai === 'da_dung' ? 'dq.ph.daNhan' : 'dq.ph.hetHan'} as="div" className="empty-note" />}
              <div className="dq-ph-ma" {...ndDau('dq.ph.ma')}>{nd('dq.ph.ma', { ma: p.ma })}</div>
              {p.trangThai === 'chua_dung' && <><Chu k="dq.ph.dua" as="div" className="care-disclaimer qr-chu" /><Chu k="dq.ph.sang" as="div" className="care-disclaimer qr-chu qr-sang" /></>}
            </>
          );
        }}
      </TrangTai>
    </Man>
  );
}
