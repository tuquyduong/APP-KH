import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { docToken, xoaToken, datKhiHetPhien } from './api.js';
import { docMaTuDiaChi, boMaKhoiDiaChi } from './maBill.js';
import { dungDuongDan, viTriCuonKhiDoiMan } from './dieuHuong.js';
import { taoDuongDan, slugMon, timMonTheoSlug, tieuDeTrang } from './duongDan.js';
import { dungMenu } from './dungMenu.js';
import { xoaMenuLuu } from './menuLuu.js';
import { canDangNhap, dichSauDangNhap } from './luongDangNhap.js';
import ThanhTab from './components/ThanhTab.jsx';
import ManDau from './components/ManDau.jsx';
import DangNhap from './pages/DangNhap.jsx';
import TrangChu from './pages/TrangChu.jsx';
import Menu from './pages/Menu.jsx';
import MonTheoDuong from './pages/MonTheoDuong.jsx';
import KhongTimThay from './pages/KhongTimThay.jsx';
import UuDai from './pages/UuDai.jsx';
import TaiKhoan from './pages/TaiKhoan.jsx';
import HoSo from './pages/HoSo.jsx';
import HoTro from './pages/HoTro.jsx';
import ManQR from './pages/ManQR.jsx';
import LichSuDon, { ChiTietDon } from './pages/Don.jsx';

// Link QR trên hoá đơn: `?ma=<mã>` — đọc một lần, xoá khỏi thanh địa chỉ NGAY (và đi thẳng Ưu đãi để nhận điểm, trên MỌI đường dẫn),
// giữ mã trong bộ nhớ trang (không lưu localStorage).
function docVaXoaMaTrenDiaChi() {
  const ma = docMaTuDiaChi(window.location.search);
  if (new URLSearchParams(window.location.search).has('ma')) {
    window.history.replaceState(window.history.state, '', '/uudai' + boMaKhoiDiaChi(window.location.search) + window.location.hash);
  }
  return ma;
}
const MA_TU_LINK = docVaXoaMaTrenDiaChi();

// Điều hướng bằng đường dẫn thật (dieuHuong.js + duongDan.js): thanh địa chỉ là trạng thái, mở thẳng / tải lại / Back / Tiến đều đúng trang.
// Khách chưa đăng nhập vẫn xem Trang chủ / Menu / Trang món; vào trang cần tài khoản (Ưu đãi, Tài khoản, mã QR) thì thay bằng /dangnhap?tiep=<trang>
// và đăng nhập xong về đúng trang đó. Hết phiên / 401 → api.js xoá phiên và gọi `donPhien` → chế độ khách.
// Khung `.phone` / `.screens` / `.screen` y demo. Menu được GIỮ trong cây (chỉ ẩn) từ lần vào đầu → vào một món rồi quay lại còn nguyên ô tìm, nhóm, vị trí cuộn.
export default function App() {
  const [dangNhap, datDangNhap] = useState(() => !!docToken());
  const [maCho, datMaCho] = useState(MA_TU_LINK);
  const { duong: r, di, thay, lui } = dungDuongDan();
  const trang = r.trang;
  const menu = dungMenu(dangNhap);
  const ds = menu.dl ? menu.dl.data : [];
  const [daVaoMenu, datDaVaoMenu] = useState(false);
  const [lanVaoMenu, datLanVaoMenu] = useState(0);
  const [nhuCau, datNhuCau] = useState('');
  const khungCuon = useRef(null);
  const viTriMenu = useRef(0);
  const quayLaiMenu = useRef(false);
  const tabCuoi = useRef('trangchu'); // trang không thuộc tab nào (QR, Đăng nhập, trang lạ) giữ tab đang sáng
  const nhomCuoi = useRef('');        // nhóm Menu đang chọn: giữ khi Menu bị ẩn lúc xem một món
  if (trang === 'menu' && !daVaoMenu) datDaVaoMenu(true);
  if (r.tab) tabCuoi.current = r.tab;
  if (trang === 'menu') nhomCuoi.current = r.tham.nhom || '';
  const monLink = trang === 'mon' ? timMonTheoSlug(ds, r.tham.slug) : null;

  // 401 giữa phiên / đăng xuất: về chế độ khách VÀ về Trang chủ (không giữ trang của người trước). `maCho` giữ để nhận sau khi đăng nhập lại.
  // Dọn phiên ở MỘT chỗ cho cả đăng xuất lẫn 401 (hai đường từng dọn khác nhau). Bản menu lưu trên máy cũng xoá (có thể mang giá theo hạng của khách trước).
  const donPhien = () => { thay('/trangchu'); xoaMenuLuu(); datDangNhap(false); datDaVaoMenu(false); datNhuCau(''); quayLaiMenu.current = false; viTriMenu.current = 0; };
  useEffect(() => { datKhiHetPhien(donPhien); });

  // Trang cần đăng nhập mà chưa đăng nhập → /dangnhap?tiep=<trang> (thay, không thêm lịch sử). Đăng nhập xong → rời /dangnhap tới tiep.
  useLayoutEffect(() => {
    if (canDangNhap(trang, dangNhap)) thay(taoDuongDan('dangnhap', { tiep: r.chuan }));
    else if (dangNhap && trang === 'dangnhap') thay(dichSauDangNhap(r.tham.tiep, maCho));
  }, [trang, dangNhap, r.chuan]);

  useEffect(() => { document.title = tieuDeTrang(trang, monLink && monLink.ten); }, [trang, monLink]);

  useLayoutEffect(() => {
    if (khungCuon.current) khungCuon.current.scrollTop = viTriCuonKhiDoiMan({ tab: trang, coManCon: false, quayLaiMenu: quayLaiMenu.current, daLuu: viTriMenu.current });
  }, [trang]);

  const vaoTab = (t) => { quayLaiMenu.current = false; di(taoDuongDan(t)); if (t === 'menu') datLanVaoMenu((n) => n + 1); };
  const chonTab = (t) => { datNhuCau(''); vaoTab(t); };
  const moDangNhap = (tiep) => di(taoDuongDan('dangnhap', { tiep }));
  const dangXuat = () => { xoaToken(); datMaCho(''); donPhien(); };
  const luiVe = () => lui(r.cha);

  // Mở một món: đang ở Menu thì nhớ vị trí cuộn để quay lại đúng chỗ.
  const chonMon = (mon) => {
    if (trang === 'menu' && khungCuon.current) { viTriMenu.current = khungCuon.current.scrollTop; quayLaiMenu.current = true; }
    di(taoDuongDan('mon', { slug: slugMon(mon, ds) }));
  };
  const moQR = () => di(taoDuongDan('qr'));
  const moUuDai = () => chonTab('uudai');
  const moMenu = () => chonTab('menu');
  const taiTab = (t) => trang === t;

  return (
    <div className="phone">
      <div className="screens" ref={khungCuon}>
        {daVaoMenu && <Menu hien={taiTab('menu')} tai={menu} lanVao={lanVaoMenu} nhuCau={nhuCau} boNhuCau={() => datNhuCau('')} chonMon={chonMon} moQR={moQR} moDangNhap={() => moDangNhap(r.chuan)} nhomSlug={nhomCuoi.current} doiNhom={(nhom) => thay(taoDuongDan('menu', { nhom }))} />}
        {taiTab('trangchu') && <TrangChu menu={menu} dangNhap={dangNhap} moQR={moQR} moMenu={moMenu} moUuDai={moUuDai} moDangNhap={() => moDangNhap('/uudai')} chonMon={chonMon} locNhuCau={(ten) => { vaoTab('menu'); datNhuCau(ten); }} />}
        {dangNhap && taiTab('uudai') && <UuDai maSan={maCho} khiNhanXong={() => datMaCho('')} moQR={moQR} />}
        {dangNhap && taiTab('taikhoan') && <TaiKhoan moQR={moQR} moDon={() => di(taoDuongDan('donhang'))} moHoSo={() => di(taoDuongDan('thongtin'))} moHoTro={() => di(taoDuongDan('hotro'))} moUuDai={moUuDai} dangXuat={dangXuat} />}
        {trang === 'mon' && <MonTheoDuong mon={monLink} tai={menu} lui={luiVe} moQR={moQR} moMenu={moMenu} moDangNhap={() => moDangNhap(r.chuan)} />}
        {!dangNhap && trang === 'dangnhap' && <DangNhap khiXong={() => datDangNhap(true)} dong={luiVe} coMaHoaDon={!!maCho} />}
        {dangNhap && trang === 'qr' && <ManQR lui={luiVe} />}
        {dangNhap && trang === 'donhang' && <LichSuDon chonDon={(ma) => di(taoDuongDan('don', { ma }))} lui={luiVe} />}
        {dangNhap && trang === 'don' && <ChiTietDon ma={r.tham.ma} lui={luiVe} />}
        {dangNhap && trang === 'thongtin' && <HoSo lui={luiVe} />}
        {trang === 'hotro' && <HoTro lui={luiVe} />}
        {(trang === 'khongthay' || r.giuCho) && <KhongTimThay tieuDe="Không tìm thấy trang" nut="Về Trang chủ" chon={() => vaoTab('trangchu')} />}
      </div>
      <ThanhTab tab={r.tab || tabCuoi.current} chon={chonTab} />
      <ManDau />
    </div>
  );
}
