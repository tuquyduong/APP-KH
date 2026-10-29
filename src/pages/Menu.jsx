import { useMemo, useState } from 'react';
import { layMenu } from '../api.js';
import { dungTai } from '../dungTai.js';
import { timMon, locTheoNhuCau, nhomTheoTen } from '../menuLoc.js';
import { MON } from '../noiDung/mon.js';
import TrangTai from '../components/TrangTai.jsx';
import MonO from '../components/MonO.jsx';
import BieuTuong from '../components/BieuTuong.jsx';

// Menu theo nhóm của POS: ô tìm (không dấu cũng ra) + chip nhóm + (từ Trang chủ) lọc theo nhu cầu.
export default function Menu({ nhuCau, boNhuCau, chonMon }) {
  const tai = dungTai(layMenu);
  const [nhom, datNhom] = useState('');
  const [tu, datTu] = useState('');

  return (
    <div>
      <h2>Menu</h2>
      <TrangTai tai={tai}>
        {(dl) => <NoiDung ds={dl.data} nhom={nhom} datNhom={datNhom} tu={tu} datTu={datTu} nhuCau={nhuCau} boNhuCau={boNhuCau} chonMon={chonMon} />}
      </TrangTai>
    </div>
  );
}

function NoiDung({ ds, nhom, datNhom, tu, datTu, nhuCau, boNhuCau, chonMon }) {
  const tenNhom = useMemo(() => nhomTheoTen(ds).map(([ten]) => ten), [ds]);
  let hien = nhuCau ? locTheoNhuCau(ds, MON, nhuCau) : ds;
  hien = timMon(hien, tu);
  const phan = nhomTheoTen(locNhom(hien, nhom));

  return (
    <>
      <div className="tim">
        <BieuTuong ten="tim" />
        <input type="search" aria-label="Tìm món" placeholder="Tìm món…" value={tu} onChange={(e) => datTu(e.target.value)} />
      </div>
      {nhuCau && (
        <div className="loc-nhom">
          <button className="chip dang-chon" onClick={boNhuCau}>{nhuCau} ✕</button>
        </div>
      )}
      {tenNhom.length > 1 && (
        <div className="loc-nhom">
          {['', ...tenNhom].map((t) => (
            <button key={t} className={`chip${t === nhom ? ' dang-chon' : ''}`} onClick={() => datNhom(t)}>{t || 'Tất cả'}</button>
          ))}
        </div>
      )}
      {ds.length === 0 && <div className="giua">Chưa có món nào.</div>}
      {ds.length > 0 && hien.length === 0 && <div className="giua">Không tìm thấy món phù hợp.</div>}
      {phan.map(([ten, mon]) => (
        <div key={ten}>
          <div className="tieu-de">{ten}</div>
          <div className="luoi-mon">{mon.map((m) => <MonO key={m.ma} mon={m} chon={chonMon} />)}</div>
        </div>
      ))}
    </>
  );
}

const locNhom = (ds, nhom) => (nhom ? ds.filter((m) => (m.nhom || 'Khác') === nhom) : ds);
