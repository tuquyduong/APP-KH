import { layToi, layDiem, layMenu } from '../api.js';
import { dungTai } from '../dungTai.js';
import { loiChao, dinhDangSo } from '../dinhDang.js';
import { nhuCauCoMon } from '../menuLoc.js';
import { MON } from '../noiDung/mon.js';
import { NHU_CAU } from '../noiDung/nhuCau.js';
import { BANNER, MON_NOI_BAT } from '../noiDung/trangChu.js';
import BieuTuong from '../components/BieuTuong.jsx';
import MonO from '../components/MonO.jsx';

// Trang chủ: lời chào, thẻ hội viên (CHỈ điểm — chưa hạng), banner, nhu cầu, món nổi bật.
// Khối nào chưa có nội dung / dữ liệu thì ẨN cả khối (không bịa).
export default function TrangChu({ moQR, moMenu, locNhuCau, chonMon }) {
  const toi = dungTai(layToi);
  const diem = dungTai(layDiem);
  const menu = dungTai(layMenu);
  const ds = menu.dl ? menu.dl.data : [];
  const nhuCau = nhuCauCoMon(NHU_CAU, ds, MON);
  const noiBat = MON_NOI_BAT.map((ma) => ds.find((m) => m.ma === ma)).filter(Boolean);

  return (
    <div>
      <div className="chao">
        <div>
          <h1>{loiChao(toi.dl && toi.dl.khach.ten)}</h1>
          <div className="phu">Tứ Quý Đường — Sức khỏe mỗi ngày</div>
        </div>
        <button className="nut-tron" aria-label="Mã QR thành viên" onClick={moQR}><BieuTuong ten="qr" /></button>
      </div>

      <div className="the-hoi-vien" role="button" tabIndex={0} onClick={moQR} onKeyDown={(e) => { if (e.key === 'Enter') moQR(); }}>
        <div className="hang"><img src="/anh/logo-nho.webp" alt="" /><div>TỨ QUÝ ĐƯỜNG<small>Thẻ hội viên</small></div></div>
        {diem.dl && <div className="diem">{dinhDangSo(diem.dl.points)} <span>điểm</span></div>}
        {diem.loi && <div className="diem"><span>{diem.loi}</span></div>}
      </div>
      {diem.loi && <button className="nut phu-nut nho" onClick={diem.taiLai}>Thử lại</button>}

      <div className="banner">
        <img src={BANNER.anh} alt="" />
        <div className="chu-banner">
          <div className="nhan">{BANNER.nhan}</div>
          <div className="tieu">{BANNER.tieuDe}</div>
          <button onClick={moMenu}>{BANNER.nut}</button>
        </div>
      </div>

      {nhuCau.length > 0 && (
        <>
          <div className="tieu-de">Chăm sóc theo nhu cầu</div>
          <div className="luoi-nhu-cau">
            {nhuCau.map((n) => (
              <button key={n.ten} className="nhu-cau" onClick={() => locNhuCau(n.ten)}><img src={n.anh} alt="" />{n.ten}</button>
            ))}
          </div>
        </>
      )}

      {noiBat.length > 0 && (
        <>
          <div className="tieu-de">Món nổi bật</div>
          <div className="luoi-mon">{noiBat.map((m) => <MonO key={m.ma} mon={m} chon={chonMon} />)}</div>
        </>
      )}
    </div>
  );
}
