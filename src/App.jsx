import { useEffect, useState } from 'react';
import { docToken, xoaToken, datKhiHetPhien } from './api.js';
import { docMaTuDiaChi, boMaKhoiDiaChi } from './maBill.js';
import { dungNganXep } from './dieuHuong.js';
import ThanhTab from './components/ThanhTab.jsx';
import ManDau from './components/ManDau.jsx';
import BieuTuong from './components/BieuTuong.jsx';
import DangNhap from './pages/DangNhap.jsx';
import TrangChu from './pages/TrangChu.jsx';
import Menu from './pages/Menu.jsx';
import TrangMon from './pages/TrangMon.jsx';
import UuDai from './pages/UuDai.jsx';
import TaiKhoan from './pages/TaiKhoan.jsx';
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
export default function App() {
  const [dangNhap, datDangNhap] = useState(() => !!docToken());
  const [maCho, datMaCho] = useState(MA_TU_LINK);
  const [tab, datTab] = useState(MA_TU_LINK && docToken() ? 'uudai' : 'trangchu');
  const [nhuCau, datNhuCau] = useState('');
  const nx = dungNganXep();

  useEffect(() => {
    datKhiHetPhien(() => datDangNhap(false));
  }, []);

  const chonTab = (t) => { nx.veDau(); datNhuCau(''); datTab(t); };
  const dangXuat = () => { xoaToken(); nx.veDau(); datMaCho(''); datDangNhap(false); datTab('trangchu'); };
  const khiDangNhapXong = () => { datDangNhap(true); datTab(maCho ? 'uudai' : 'trangchu'); };

  const moQR = () => nx.mo({ k: 'qr' });
  const chonMon = (mon) => nx.mo({ k: 'mon', mon });

  let noiDung;
  if (nx.man) {
    const { k } = nx.man;
    noiDung = (
      <>
        <button className="quay-lai" onClick={nx.lui}><BieuTuong ten="lui" />Quay lại</button>
        {k === 'qr' && <ManQR />}
        {k === 'mon' && <TrangMon mon={nx.man.mon} />}
        {k === 'donds' && <LichSuDon chonDon={(ma) => nx.mo({ k: 'don', ma })} />}
        {k === 'don' && <ChiTietDon ma={nx.man.ma} />}
      </>
    );
  } else if (tab === 'trangchu') {
    noiDung = <TrangChu moQR={moQR} moMenu={() => chonTab('menu')} chonMon={chonMon} locNhuCau={(ten) => { datNhuCau(ten); datTab('menu'); }} />;
  } else if (tab === 'menu') {
    noiDung = <Menu nhuCau={nhuCau} boNhuCau={() => datNhuCau('')} chonMon={chonMon} />;
  } else if (tab === 'uudai') {
    noiDung = <UuDai maSan={maCho} khiNhanXong={() => datMaCho('')} />;
  } else {
    noiDung = <TaiKhoan moQR={moQR} moDon={() => nx.mo({ k: 'donds' })} dangXuat={dangXuat} />;
  }

  return (
    <div className="khung">
      {dangNhap ? (
        <>
          <main className="noi-dung">{noiDung}</main>
          <ThanhTab tab={tab} chon={chonTab} />
        </>
      ) : <DangNhap khiXong={khiDangNhapXong} />}
      <ManDau />
    </div>
  );
}
