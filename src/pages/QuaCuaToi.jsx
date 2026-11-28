import { dungCua, cuaQuaToi } from '../duLieuKhach.js';
import { docQuaCuaToi, ngayPos } from '../doiQua.js';
import { dinhDangSo } from '../dinhDang.js';
import { nd, ndDau, ndPhan } from '../noiDung/nd.js';
import Chu from '../components/Chu.jsx';
import Man, { DauManCon } from '../components/Man.jsx';
import TrangTai from '../components/TrangTai.jsx';
import { Ico } from '../components/BieuTuong.jsx';
import { bam } from '../components/bam.js';
import AnhQua from '../components/AnhQua.jsx';
import '../giaoDien/doi_qua.css';

// Quà của tôi (/uudai/qua, KH-DOI-1 B6): phiếu quà hiện vật của khách (GET /qua-cua-toi, mới trước). "Chờ nhận" (chua_dung — `nhac` POS → chữ hồng; bấm → Phiếu quà)
// và "Đã xong" (da_dung "Đã nhận <ngày>"; het_han "Hết hạn <ngày> · đã hoàn N điểm" khi POS có hoan_diem), thẻ mờ. App không tự tính hạn.
const POS = ndDau('dq.pos');

/** Dòng phụ của phiếu: [khoá, chữ] theo trạng thái; không có ngày POS → null (không bịa). */
function dongPhu(p) {
  const ngay = ngayPos(p.trangThai === 'da_dung' ? p.dungLuc : p.hetHan);
  if (!ngay) return null;
  if (p.trangThai === 'chua_dung') { const k = p.nhac ? 'dq.qt.sapHet' : 'dq.qt.han'; return [k, nd(k, { ngay })]; }
  if (p.trangThai === 'da_dung') return ['dq.qt.daNhan', nd('dq.qt.daNhan', { ngay })];
  return ['dq.qt.hetHan', nd('dq.qt.hetHan', { ngay }) + (p.hoanDiem !== null ? nd('dq.qt.hoanDiem', { so: dinhDangSo(p.hoanDiem) }) : '')];
}

function ThePhieu({ p, mo }) {
  const cho = p.trangThai === 'chua_dung';
  const phu = dongPhu(p);
  const kTt = cho ? 'dq.qt.xem' : p.trangThai === 'da_dung' ? 'dq.qt.ttDaNhan' : 'dq.qt.ttHetHan';
  return (
    <div className={`dq-phieu${cho ? ' cho' : ' cu'}`} {...(cho ? bam(() => mo(p.ma)) : {})}>
      <AnhQua anh={p.anh} loai="hien_vat" />
      <div className="info">
        <div className="t" {...POS}>{p.ten}</div>
        {phu && <div className={`d${p.nhac ? ' nhac' : ''}`} {...ndDau(phu[0])}>{phu[1]}</div>}
      </div>
      <span className={`dq-tt${cho ? ' cho' : ''}`} {...ndDau(kTt)}>{nd(kTt)}</span>
    </div>
  );
}

export default function QuaCuaToi({ lui, moPhieu }) {
  const tai = dungCua(cuaQuaToi);
  return (
    <Man id="quatoi">
      <DauManCon tieuDe={nd('dq.qt.tieuDe')} lui={lui} />
      <div className="dq-nhac" {...ndDau('dq.qt.nhac')}><Ico ten="warning" s={16} /><div>{ndPhan('dq.qt.nhac', { hoan: <b key="hoan" {...ndDau('dq.qt.hoan')}>{nd('dq.qt.hoan')}</b> })}</div></div>
      <TrangTai tai={tai}>
        {(dl) => {
          const { cho, xong } = docQuaCuaToi(dl);
          if (!cho.length && !xong.length) return <Chu k="dq.qt.rong" as="div" className="empty-note" />;
          return (
            <>
              {cho.length > 0 && <><div className="sec-head"><Chu k="dq.qt.cho" as="h2" /></div>{cho.map((p) => <ThePhieu key={p.ma} p={p} mo={moPhieu} />)}</>}
              {xong.length > 0 && <><div className="sec-head"><Chu k="dq.qt.xong" as="h2" /></div>{xong.map((p) => <ThePhieu key={p.ma} p={p} mo={moPhieu} />)}</>}
            </>
          );
        }}
      </TrangTai>
    </Man>
  );
}
