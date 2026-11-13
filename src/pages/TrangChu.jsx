import { dungCua, cuaToi, cuaDiem } from '../duLieuKhach.js';
import { loiChao, dinhDangSo } from '../dinhDang.js';
import { bayGio, coBayGio } from '../bayGio.js';
import { nhuCauCoMon } from '../menuLoc.js';
import { MON } from '../noiDung/mon.js';
import { nd, ndNut, ndAnh, ndDs, ndHien, ndDau } from '../noiDung/nd.js';
import Chu from '../components/Chu.jsx';
import Man, { NutQR } from '../components/Man.jsx';
import MonO from '../components/MonO.jsx';
import BannerHomNay from '../components/BannerHomNay.jsx';
import TheMoi from '../components/TheMoi.jsx';
import OTracNghiem from '../components/OTracNghiem.jsx';
import OGioVang from '../components/OGioVang.jsx';
import { IcoVe } from '../components/BieuTuong.jsx';
import OKeHoach from '../components/OKeHoach.jsx';
import KhoaTienIch from '../components/KhoaTienIch.jsx';
import { dungKeHoach } from '../components/dungKeHoach.js';
import { homNayTuGio, ngayChuoi } from '../kehoach.js';
import { viecNgay, quaHan } from '../kehoachLap.js';
import { taoDuongDan } from '../duongDan.js';
import '../giaoDien/ke_hoach.css';
import { khoGioHoatDong, trangThaiQuan } from '../gioHoatDong.js';
import { dungKho } from '../kho.js';
import { tenXungHo } from '../noiDung/dangNhap.js';
import { dungGia } from '../heThong.js';
import { nhacGiaHan } from '../giaHang.js';
import { Ico } from '../components/BieuTuong.jsx';

// Trang chủ theo demo, đúng thứ tự khối. Khối thuộc VIỆC SAU để TRỐNG (không thay bằng gì):
//   thẻ "Xem cách dùng app" (chưa có video) · Mời bạn bè, combo → sau khai trương. Ô "Kế hoạch và nhắc việc" (KH-UI-5b) nằm cạnh thẻ hội viên như demo.
// Demo không có dòng "quán đang mở / đóng": thêm MỘT dòng nhỏ (kiểu `.sub`) dưới lời chào, chữ lấy từ `/gio-hoat-dong` (xem `## Phát hiện` của KH-UI-3a).
// Mọi chữ / ảnh / nút đọc qua nd() (danh mục src/noiDung/nd/trangChu.js); phần POS / tự tính gắn ndDau(<mục khoá>). Khối ẩn / hiện theo `hien.<mã SECS demo>`.
// Đầu Trang chủ (lời chào + QR + thẻ). Tách hai bản để chỉ khách ĐÃ đăng nhập mới gọi /toi và /diem.
// Nhắc gia hạn thẻ (KH-THE-1 D4) ngay dưới thẻ hội viên: hạng bán được còn ≤ NGAY_NHAC_GIA_HAN ngày (đếm theo giờ POS) → mở màn Hạng thành viên của hạng đó.
function NhacGiaHan({ hang, moHang }) {
  const { dsHang } = dungGia();
  const nh = ndHien('hien.nhacGiaHan') && coBayGio() ? nhacGiaHan(dsHang, hang, bayGio()) : null;
  if (!nh) return null;
  const k = nh.soNgay > 0 ? 'home.nhac.giaHan' : 'home.nhac.homNay';
  return <div className="nt-state" role="button" tabIndex={0} onClick={() => moHang(nh.id)} onKeyDown={(e) => { if (e.key === 'Enter') moHang(nh.id); }}><Ico ten="warning" s={16} /><div {...ndDau(k)}>{nd(k, { hang: nh.ten, so: nh.soNgay })}</div></div>;
}

function DauChung({ chao, moQR, the, ke, nhac }) {
  const quan = trangThaiQuan(dungKho(khoGioHoatDong));
  return (
    <>
      <div className="topbar">
        <div>
          <h1 {...ndDau('chao.dau')}>{chao}</h1>
          <Chu k="home.sub" as="div" className="sub" bien={{ khauHieu: nd('brand.slogan') }} />
          {quan && (quan.dangMo ? <Chu k="home.mo" as="div" className="sub" /> : <div className="sub" {...ndDau('home.quan')}>{quan.thongBao}</div>)}
        </div>
        <div className="topbar-right"><NutQR moQR={moQR} /></div>
      </div>
      <div className="top-row">{ndHien('hien.home.member') && the}{ndHien('hien.home.cal') && ke}</div>
      {nhac}
    </>
  );
}

// Ô Kế hoạch và nhắc việc (demo utilCal) bọc KhoaTienIch: chưa đăng nhập → mờ + khoá, chạm → đăng nhập rồi về /kehoach. Chưa đăng nhập không đếm việc (số của khách trước).
function OKeHoachTrangChu({ dangNhap, daBiet, moKeHoach, moDangNhapTai }) {
  const { bang } = dungKeHoach(daBiet);
  const homNay = homNayTuGio(bayGio());
  const so = dangNhap && daBiet ? viecNgay(bang, ngayChuoi(homNay)).filter((v) => !v.xong).length : null;
  const qua = dangNhap && daBiet ? quaHan(bang, homNay).length : 0; // số đỏ nhỏ: việc quá hạn (KH-UI-5c D1)
  return (
    <KhoaTienIch dangNhap={dangNhap} tiep={taoDuongDan('kehoach')} moDangNhap={moDangNhapTai}>
      <OKeHoach homNay={homNay} soViec={so} quaHan={qua} mo={moKeHoach} />
    </KhoaTienIch>
  );
}

function DauHoiVien({ moQR, moUuDai, ke, moHang }) {
  const toi = dungCua(cuaToi);
  const diem = dungCua(cuaDiem);
  const hang = toi.dl && toi.dl.khach.hang; // null = chưa có hạng → không hiện nhãn hạng
  dungKho(khoGioHoatDong); // vẽ lại mỗi khi POS báo giờ (bayGio() đổi theo `bay_gio` của POS, KHÔNG theo đồng hồ máy)
  const k = toi.dl && toi.dl.khach;
  return (
    <DauChung
      chao={loiChao(coBayGio() ? bayGio() : '', tenXungHo(k && k.xung_ho), k && k.ten)}
      moQR={moQR}
      ke={ke}
      nhac={<NhacGiaHan hang={hang} moHang={moHang} />}
      the={(
        <div className="points-card pc-mini" role="button" tabIndex={0} onClick={moUuDai} onKeyDown={(e) => { if (e.key === 'Enter') moUuDai(); }}>
          <div className="card-top">
            <div className="hang-logo"><img className="tqd-logo tqd-mini" src={ndAnh('home.logo')} alt="" {...ndDau('home.logo')} /><div className="brand"><Chu k="home.the.nhan" /><Chu k="home.the.phu" as="small" /></div></div>
          </div>
          <div className="card-bottom">
            <div>
              {hang && <div className="tier" {...ndDau('home.hang.ten')}><IcoVe ten="crown" s={12} /> <Chu k="home.hang" bien={{ hang: hang.ten }} /></div>}
              <div className="num" {...ndDau('home.diem.so')}>{diem.dl ? dinhDangSo(diem.dl.points) : '—'} <Chu k="home.diem" /></div>
            </div>
          </div>
        </div>
      )}
    />
  );
}

// `menu` = menu của App (tải một chỗ, kể cả khi chưa đăng nhập). Chưa đăng nhập: "Chào bạn!" + thẻ mời thay thẻ hội viên; khối cần dữ liệu riêng của khách bị ẩn.
export default function TrangChu({ quangCao, moQuangCao, menu, dangNhap, daBiet = false, klLuu, moQR, moMenu, moGioVang, moUuDai, moDangNhap, moDangNhapTai, moTracNghiem, moKeHoach, locNhuCau, chonMon, moHang }) {
  const ds = menu.dl ? menu.dl.data : [];
  const ke = <OKeHoachTrangChu dangNhap={dangNhap} daBiet={daBiet} moKeHoach={moKeHoach} moDangNhapTai={moDangNhapTai} />;
  const nhuCau = nhuCauCoMon(ndDs('home.need'), ds, MON);
  const noiBat = ndDs('home.feat.mon').map((x) => ds.find((m) => m.ma === x.ma)).filter(Boolean);
  const fmore = ndNut('home.fmore');
  const DICH = { menu: moMenu, giovang: moGioVang, tracnghiem: moTracNghiem, kehoach: moKeHoach, uudai: moUuDai, hang: moHang }; // mọi mã trong DICH (noiDung/nd/index.js)
  const di = (dich) => () => DICH[dich]();
  const moi = { tieuDe: nd('home.moi.t'), phu: nd('home.moi.p'), nut: nd('home.moi.nut') };
  const { bang: keHoach } = dungKeHoach(daBiet);

  return (
    <Man id="home">
      {dangNhap
        ? <DauHoiVien moQR={moQR} moUuDai={moUuDai} ke={ke} moHang={moHang} />
        : <DauChung chao={loiChao('', '', '')} moQR={moQR} the={<TheMoi chu={moi} khoa={{ tieuDe: 'home.moi.t', phu: 'home.moi.p', nut: 'home.moi.nut', anh: 'home.logo' }} anh={ndAnh('home.logo')} moDangNhap={moDangNhap} />} ke={ke} />}

      {ndHien('hien.home.hb') && (
      <div className="hb-one">
        <div id="todayHome"><BannerHomNay anh={ndAnh('today.bg')} qc={quangCao} chon={!quangCao.dich ? null : quangCao.macDinh ? di(quangCao.dich) : moQuangCao} /></div>
        <div className="hb-tiles">{ndHien('hien.home.gv') && <OGioVang mo={moGioVang} />}{ndHien('hien.home.quiz') && <OTracNghiem dangNhap={dangNhap} klLuu={klLuu} mo={moTracNghiem} moDangNhap={moDangNhapTai} />}</div>
      </div>
      )}

      {ndHien('hien.home.needs') && nhuCau.length > 0 && (
        <>
          <div className="sec-head"><Chu k="home.needs" as="h2" /></div>
          <div className="need-grid" {...ndDau('home.need')}>
            {nhuCau.map((n) => (
              <div key={n.ten} className="need" role="button" tabIndex={0} onClick={() => locNhuCau(n.ten)} onKeyDown={(e) => { if (e.key === 'Enter') locNhuCau(n.ten); }}>
                <div className="em ph-need"><img className="need-ph" src={n.anh} alt="" /></div>
                <div className="t">{n.nhan}</div>
              </div>
            ))}
          </div>
          <Chu k="home.disc" as="div" className="care-disclaimer" />
        </>
      )}

      {ndHien('hien.home.feat') && noiBat.length > 0 && (
        <>
          <div className="sec-head"><Chu k="home.feat" as="h2" /></div>
          <div className="grid2" {...ndDau('home.mon')}>{noiBat.map((m) => <MonO key={m.ma} mon={m} chon={chonMon} />)}</div>
          <div className="more-l"><span role="button" tabIndex={0} onClick={di(fmore.dich)} onKeyDown={(e) => { if (e.key === 'Enter') di(fmore.dich)(); }} {...ndDau('home.fmore')}>{fmore.chu}</span></div>
        </>
      )}
    </Man>
  );
}
