import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { docToken, xoaToken, datKhiHetPhien } from './api.js';
import { docMaTuDiaChi, boMaKhoiDiaChi } from './maBill.js';
import { dungNganXep, viTriCuonKhiDoiMan } from './dieuHuong.js';
import ThanhTab from './components/ThanhTab.jsx';
import ManDau from './components/ManDau.jsx';
import DangNhap from './pages/DangNhap.jsx';
import TrangChu from './pages/TrangChu.jsx';
import Menu from './pages/Menu.jsx';
import TrangMon from './pages/TrangMon.jsx';
import UuDai from './pages/UuDai.jsx';
import TaiKhoan from './pages/TaiKhoan.jsx';
import HoSo from './pages/HoSo.jsx';
import HoTro from './pages/HoTro.jsx';
import ManQR from './pages/ManQR.jsx';
import LichSuDon, { ChiTietDon } from './pages/Don.jsx';

// Link QR trên hoá đơn: `?ma=<mã>` — đọc một lần, xoá khỏi thanh địa chỉ NGAY, giữ trong bộ nhớ trang (không lưu localStorage).
function docVaXoaMaTrenDiaChi() {
  const ma = docMaTuDiaChi(window.location.search);
  if (new URLSearchParams(window.location.search).has('ma')) {
    window.history.replaceState(window.history.state, '', window.location.pathname + boMaKhoiDiaChi(window.location.search) + window.location.hash);
  }
  return ma;
}
const MA_TU_LINK = docVaXoaMaTrenDiaChi();

// Không router: một trạng thái `tab` + ngăn xếp màn con (dieuHuong.js). Hết phiên / 401 → api.js xoá phiên và gọi lại về màn đăng nhập.
// Khung `.phone` / `.screens` / `.screen` y demo. Menu được GIỮ trong cây (chỉ ẩn) từ lần vào đầu → vào một món rồi quay lại còn nguyên ô tìm, nhóm, vị trí cuộn.
export default function App() {
  const [dangNhap, datDangNhap] = useState(() => !!docToken());
  const [maCho, datMaCho] = useState(MA_TU_LINK);
  const [tab, datTab] = useState(MA_TU_LINK && docToken() ? 'uudai' : 'trangchu');
  const [daVaoMenu, datDaVaoMenu] = useState(false);
  const [lanVaoMenu, datLanVaoMenu] = useState(0);
  const [nhuCau, datNhuCau] = useState('');
  const nx = dungNganXep();
  const khungCuon = useRef(null);
  const viTriMenu = useRef(0);
  const quayLaiMenu = useRef(false);

  // 401 giữa phiên: về đăng nhập VÀ dọn màn con (người đăng nhập sau không thấy màn của người trước). `maCho` giữ để nhận sau khi đăng nhập lại.
  // Dọn phiên ở MỘT chỗ cho cả đăng xuất lẫn 401 (hai đường từng dọn khác nhau).
  const donPhien = () => { nx.veDau(); datDangNhap(false); datDaVaoMenu(false); datNhuCau(''); quayLaiMenu.current = false; viTriMenu.current = 0; datTab('trangchu'); };
  useEffect(() => { datKhiHetPhien(donPhien); });

  useLayoutEffect(() => {
    if (khungCuon.current) khungCuon.current.scrollTop = viTriCuonKhiDoiMan({ tab, coManCon: !!nx.man, quayLaiMenu: quayLaiMenu.current, daLuu: viTriMenu.current });
  }, [tab, nx.man]);

  const vaoTab = (t) => { quayLaiMenu.current = false; nx.veDau(); datTab(t); if (t === 'menu') { datDaVaoMenu(true); datLanVaoMenu((n) => n + 1); } };
  const chonTab = (t) => { datNhuCau(''); vaoTab(t); };
  const dangXuat = () => { xoaToken(); datMaCho(''); donPhien(); };
  const khiDangNhapXong = () => { datDangNhap(true); datTab(maCho ? 'uudai' : 'trangchu'); };

  // Mở màn con: đang ở Menu thì nhớ vị trí cuộn để quay lại đúng chỗ.
  const moManCon = (man) => {
    if (tab === 'menu' && !nx.man && khungCuon.current) { viTriMenu.current = khungCuon.current.scrollTop; quayLaiMenu.current = true; }
    nx.mo(man);
  };
  const moQR = () => moManCon({ k: 'qr' });
  const chonMon = (mon) => moManCon({ k: 'mon', mon });
  const moUuDai = () => chonTab('uudai');

  let manCon = null;
  if (nx.man) {
    const { k } = nx.man;
    manCon = (
      <>
        {k === 'qr' && <ManQR lui={nx.lui} />}
        {k === 'mon' && <TrangMon mon={nx.man.mon} lui={nx.lui} moQR={moQR} />}
        {k === 'donds' && <LichSuDon chonDon={(ma) => moManCon({ k: 'don', ma })} lui={nx.lui} />}
        {k === 'don' && <ChiTietDon ma={nx.man.ma} lui={nx.lui} />}
        {k === 'hoso' && <HoSo lui={nx.lui} />}
        {k === 'hotro' && <HoTro lui={nx.lui} />}
      </>
    );
  }
  const taiTab = (t) => !nx.man && tab === t;

  return (
    <div className="phone">
      <div className="screens" ref={khungCuon}>
        {!dangNhap && <DangNhap khiXong={khiDangNhapXong} />}
        {dangNhap && (
          <>
            {daVaoMenu && <Menu hien={taiTab('menu')} lanVao={lanVaoMenu} nhuCau={nhuCau} boNhuCau={() => datNhuCau('')} chonMon={chonMon} moQR={moQR} />}
            {taiTab('trangchu') && <TrangChu moQR={moQR} moMenu={() => chonTab('menu')} moUuDai={moUuDai} chonMon={chonMon} locNhuCau={(ten) => { vaoTab('menu'); datNhuCau(ten); }} />}
            {taiTab('uudai') && <UuDai maSan={maCho} khiNhanXong={() => datMaCho('')} moQR={moQR} />}
            {taiTab('taikhoan') && <TaiKhoan moQR={moQR} moDon={() => moManCon({ k: 'donds' })} moHoSo={() => moManCon({ k: 'hoso' })} moHoTro={() => moManCon({ k: 'hotro' })} moUuDai={moUuDai} dangXuat={dangXuat} />}
            {manCon}
          </>
        )}
      </div>
      {dangNhap && <ThanhTab tab={tab} chon={chonTab} />}
      <ManDau />
    </div>
  );
}
