import { layToi, layDiem } from '../api.js';
import { dungTai } from '../dungTai.js';
import { loiChao, dinhDangSo } from '../dinhDang.js';
import { bayGio, coBayGio } from '../bayGio.js';
import { nhuCauCoMon } from '../menuLoc.js';
import { MON } from '../noiDung/mon.js';
import { NHU_CAU } from '../noiDung/nhuCau.js';
import { KHAU_HIEU } from '../noiDung/thuongHieu.js';
import { BANNER, HOM_NAY, MON_NOI_BAT } from '../noiDung/trangChu.js';
import Man, { NutQR } from '../components/Man.jsx';
import MonO from '../components/MonO.jsx';
import BannerHomNay from '../components/BannerHomNay.jsx';
import TheMoi from '../components/TheMoi.jsx';
import OTracNghiem from '../components/OTracNghiem.jsx';
import OGioVang from '../components/OGioVang.jsx';
import { IcoVe } from '../components/BieuTuong.jsx';
import { khoGioHoatDong, trangThaiQuan } from '../gioHoatDong.js';
import { dungKho } from '../kho.js';
import { THE_MOI, tenXungHo } from '../noiDung/dangNhap.js';

// Trang chủ theo demo, đúng thứ tự khối. Khối thuộc VIỆC SAU để TRỐNG (không thay bằng gì):
//   thẻ "Xem cách dùng app", ô "Kế hoạch và nhắc việc" → KH-UI-5b · Mời bạn bè, combo → sau khai trương.
// Demo không có dòng "quán đang mở / đóng": thêm MỘT dòng nhỏ (kiểu `.sub`) dưới lời chào, chữ lấy từ `/gio-hoat-dong` (xem `## Phát hiện` của KH-UI-3a).
// Đầu Trang chủ (lời chào + QR + thẻ). Tách hai bản để chỉ khách ĐÃ đăng nhập mới gọi /toi và /diem.
function DauChung({ chao, moQR, the }) {
  const quan = trangThaiQuan(dungKho(khoGioHoatDong));
  return (
    <>
      <div className="topbar">
        <div>
          <h1>{chao}</h1>
          <div className="sub">Tứ Quý Đường — {KHAU_HIEU}</div>
          {quan && <div className="sub">{quan.dangMo ? 'Quán đang mở cửa' : quan.thongBao}</div>}
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
  const hang = toi.dl && toi.dl.khach.hang; // null = chưa có hạng → không hiện nhãn hạng
  dungKho(khoGioHoatDong); // vẽ lại mỗi khi POS báo giờ (bayGio() đổi theo `bay_gio` của POS, KHÔNG theo đồng hồ máy)
  const k = toi.dl && toi.dl.khach;
  return (
    <DauChung
      chao={loiChao(coBayGio() ? bayGio() : '', tenXungHo(k && k.xung_ho), k && k.ten)}
      moQR={moQR}
      the={(
        <div className="points-card pc-mini" role="button" tabIndex={0} onClick={moUuDai} onKeyDown={(e) => { if (e.key === 'Enter') moUuDai(); }}>
          <div className="card-top">
            <div className="hang-logo"><img className="tqd-logo tqd-mini" src="/anh/logo-nho.webp" alt="" /><div className="brand">TỨ QUÝ ĐƯỜNG<small>Thẻ hội viên</small></div></div>
          </div>
          <div className="card-bottom">
            <div>
              {hang && <div className="tier"><IcoVe ten="crown" s={12} /> Hạng {hang.ten}</div>}
              <div className="num">{diem.dl ? dinhDangSo(diem.dl.points) : '—'} <span>điểm</span></div>
            </div>
          </div>
        </div>
      )}
    />
  );
}

// `menu` = menu của App (tải một chỗ, kể cả khi chưa đăng nhập). Chưa đăng nhập: "Chào bạn" + thẻ mời thay thẻ hội viên; khối cần dữ liệu riêng của khách bị ẩn.
export default function TrangChu({ menu, dangNhap, klLuu, moQR, moMenu, moGioVang, moUuDai, moDangNhap, moDangNhapTai, moTracNghiem, locNhuCau, chonMon }) {
  const ds = menu.dl ? menu.dl.data : [];
  const nhuCau = nhuCauCoMon(NHU_CAU, ds, MON);
  const noiBat = MON_NOI_BAT.map((ma) => ds.find((m) => m.ma === ma)).filter(Boolean);
  const coHomNay = !!HOM_NAY.tieuDe;

  return (
    <Man id="home">
      {dangNhap
        ? <DauHoiVien moQR={moQR} moUuDai={moUuDai} />
        : <DauChung chao={loiChao('', '', '')} moQR={moQR} the={<TheMoi chu={THE_MOI} moDangNhap={moDangNhap} />} />}

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
        <div className="hb-tiles"><OGioVang mo={moGioVang} /><OTracNghiem dangNhap={dangNhap} klLuu={klLuu} mo={moTracNghiem} moDangNhap={moDangNhapTai} /></div>
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
