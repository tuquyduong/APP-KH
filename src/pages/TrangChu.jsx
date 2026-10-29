import { layToi, layDiem } from '../api.js';
import { dungTai } from '../dungTai.js';
import { loiChao, dinhDangSo } from '../dinhDang.js';
import { nhuCauCoMon } from '../menuLoc.js';
import { MON } from '../noiDung/mon.js';
import { NHU_CAU } from '../noiDung/nhuCau.js';
import { BANNER, HOM_NAY, MON_NOI_BAT } from '../noiDung/trangChu.js';
import Man, { NutQR } from '../components/Man.jsx';
import MonO from '../components/MonO.jsx';
import BannerHomNay from '../components/BannerHomNay.jsx';
import TheMoi from '../components/TheMoi.jsx';
import OTracNghiem from '../components/OTracNghiem.jsx';
import { THE_MOI } from '../noiDung/dangNhap.js';

// Trang chủ theo demo, đúng thứ tự khối. Khối thuộc VIỆC SAU để TRỐNG (không thay bằng gì):
//   thẻ "Xem cách dùng app", ô "Kế hoạch và nhắc việc" → KH-UI-5b · ô Giờ vàng (cạnh ô Trắc nghiệm, nên ô Trắc nghiệm đang rộng hết hàng), hạng trên thẻ, giá 3 hạng → KH-UI-3 · Mời bạn bè, combo → sau khai trương.
// Đầu Trang chủ (lời chào + QR + thẻ). Tách hai bản để chỉ khách ĐÃ đăng nhập mới gọi /toi và /diem.
function DauChung({ chao, moQR, the }) {
  return (
    <>
      <div className="topbar">
        <div>
          <h1>{chao}</h1>
          <div className="sub">Tứ Quý Đường — Sức khỏe mỗi ngày</div>
        </div>
        <div className="topbar-right"><NutQR moQR={moQR} /></div>
      </div>
      <div className="top-row mot">{the}</div>
    </>
  );
}

function DauHoiVien({ moQR, moUuDai }) {
  const toi = dungTai(layToi);
  const diem = dungTai(layDiem);
  return (
    <DauChung
      chao={loiChao(toi.dl && toi.dl.khach.ten)}
      moQR={moQR}
      the={(
        <div className="points-card pc-mini" role="button" tabIndex={0} onClick={moUuDai} onKeyDown={(e) => { if (e.key === 'Enter') moUuDai(); }}>
          <div className="card-top">
            <div className="hang-logo"><img className="tqd-logo tqd-mini" src="/anh/logo-nho.webp" alt="" /><div className="brand">TỨ QUÝ ĐƯỜNG<small>Thẻ hội viên</small></div></div>
          </div>
          <div className="card-bottom"><div><div className="num">{diem.dl ? dinhDangSo(diem.dl.points) : '—'} <span>điểm</span></div></div></div>
        </div>
      )}
    />
  );
}

// `menu` = menu của App (tải một chỗ, kể cả khi chưa đăng nhập). Chưa đăng nhập: "Chào bạn" + thẻ mời thay thẻ hội viên; khối cần dữ liệu riêng của khách bị ẩn.
export default function TrangChu({ menu, dangNhap, klLuu, moQR, moMenu, moUuDai, moDangNhap, moDangNhapTai, moTracNghiem, locNhuCau, chonMon }) {
  const ds = menu.dl ? menu.dl.data : [];
  const nhuCau = nhuCauCoMon(NHU_CAU, ds, MON);
  const noiBat = MON_NOI_BAT.map((ma) => ds.find((m) => m.ma === ma)).filter(Boolean);
  const coHomNay = !!HOM_NAY.tieuDe;

  return (
    <Man id="home">
      {dangNhap
        ? <DauHoiVien moQR={moQR} moUuDai={moUuDai} />
        : <DauChung chao={loiChao('')} moQR={moQR} the={<TheMoi chu={THE_MOI} moDangNhap={moDangNhap} />} />}

      <div className="hb-one">
        {coHomNay ? (
          <div id="todayHome"><BannerHomNay anh={BANNER.anh} tieuDe={HOM_NAY.tieuDe} phu={HOM_NAY.phu} nut={HOM_NAY.nut} chon={moMenu} /></div>
        ) : (
          <div className="hero-banner" role="button" tabIndex={0} onClick={moMenu} onKeyDown={(e) => { if (e.key === 'Enter') moMenu(); }}>
            <img className="slot-img" src={BANNER.anh} alt="" />
            <div className="txt">
              <div className="k">{BANNER.nhan}</div>
              <div className="h">{BANNER.dong1}<br />{BANNER.dong2}</div>
              <span className="b">{BANNER.nut}</span>
            </div>
          </div>
        )}
        <div className="hb-tiles"><OTracNghiem dangNhap={dangNhap} klLuu={klLuu} mo={moTracNghiem} moDangNhap={moDangNhapTai} /></div>
      </div>

      {nhuCau.length > 0 && (
        <>
          <div className="sec-head"><h2>Chăm sóc theo nhu cầu</h2></div>
          <div className="need-grid">
            {nhuCau.map((n) => (
              <div key={n.ten} className="need" role="button" tabIndex={0} onClick={() => locNhuCau(n.ten)} onKeyDown={(e) => { if (e.key === 'Enter') locNhuCau(n.ten); }}>
                <div className="em ph-need"><img className="need-ph" src={n.anh} alt="" /></div>
                <div className="t">{n.ten}</div>
              </div>
            ))}
          </div>
          <div className="care-disclaimer">Chỉ mang tính gợi ý theo dịp dùng — TQD kinh doanh thực phẩm thông thường, không phải thực phẩm bảo vệ sức khỏe.</div>
        </>
      )}

      {noiBat.length > 0 && (
        <>
          <div className="sec-head"><h2>Món nổi bật</h2></div>
          <div className="grid2">{noiBat.map((m) => <MonO key={m.ma} mon={m} chon={chonMon} />)}</div>
          <div className="more-l"><span role="button" tabIndex={0} onClick={moMenu} onKeyDown={(e) => { if (e.key === 'Enter') moMenu(); }}>Xem tất cả</span></div>
        </>
      )}
    </Man>
  );
}
