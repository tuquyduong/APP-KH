import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { docToken, xoaToken, datKhiHetPhien, layToi } from './api.js';
import { docMaTuDiaChi, boMaKhoiDiaChi } from './maBill.js';
import { dungDuongDan, viTriCuonKhiDoiMan } from './dieuHuong.js';
import { taoDuongDan, slugMon, timMonTheoSlug, tieuDeTrang } from './duongDan.js';
import { dungMenu } from './dungMenu.js';
import { dungTracNghiem } from './dungTracNghiem.js';
import { dungHeThong, dungNguCanhGia, NguCanhGia } from './heThong.js';
import { LIEN_HE, coLienHe } from './noiDung/lienHe.js';
import { xoaMenuLuu } from './menuLuu.js';
import { doiKhach, xoaTatCa } from './luuMay.js';
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
import TracNghiem from './pages/TracNghiem.jsx';
import TracNghiemLam from './pages/TracNghiemLam.jsx';
import TracNghiemKetQua from './pages/TracNghiemKetQua.jsx';
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
const RONG = [];

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
  const tnGoc = dungTracNghiem();
  dungHeThong(); // hạng, Giờ vàng, giờ hoạt động + "bây giờ" của POS: nạp một lần ở đây, các màn chỉ đọc
  const [hangToi, datHangToi] = useState(null); // { id, ten } của khách đang đăng nhập (từ /toi); không lưu trên máy
  // Bản lưu trên máy chỉ hiện khi đã đăng nhập VÀ đã biết khách là ai (luuMay.doiKhach xong): chưa đăng nhập, hết phiên, hoặc đang chờ GET /toi thì
  // bản của khách trước không hiện ra. Lỗi mạng khi hỏi /toi → vẫn ẩn (an toàn hơn hiện nhầm).
  const [daBiet, datDaBiet] = useState(false);
  const tn = daBiet ? tnGoc : { ...tnGoc, luu: null, klLuu: null, hien: null };
  const klLuu = dangNhap ? tn.klLuu : null;
  const ds = menu.dl ? menu.dl.data : RONG;
  const nguCanhGia = dungNguCanhGia(ds, hangToi);
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
  const donPhien = () => { thay('/trangchu'); xoaMenuLuu(); datDangNhap(false); datDaVaoMenu(false); datNhuCau(''); quayLaiMenu.current = false; viTriMenu.current = 0; datDaBiet(false); datHangToi(null); tnGoc.donBoNho(); };
  useEffect(() => { datKhiHetPhien(donPhien); });

  // Mỗi lần có phiên (mở app khi còn token, hoặc vừa đăng nhập): biết khách là ai → khác khách trước thì xoá dữ liệu trên máy (luuMay.js), rồi nạp bản lưu.
  useEffect(() => {
    if (!dangNhap) return undefined;
    let huy = false;
    layToi().then((r) => { if (!huy && r.khach) { datHangToi(r.khach.hang ? { id: r.khach.hang.id, ten: r.khach.hang.ten } : null); doiKhach(r.khach.sdt); tnGoc.nap(); datDaBiet(true); } }).catch(() => { /* 401: api.js đã dọn phiên; mạng lỗi: lần mở sau sẽ kiểm */ });
    return () => { huy = true; };
  }, [dangNhap]);

  // Trang cần đăng nhập mà chưa đăng nhập → /dangnhap?tiep=<trang> (thay, không thêm lịch sử). Đăng nhập xong → rời /dangnhap tới tiep.
  useLayoutEffect(() => {
    if (canDangNhap(trang, dangNhap)) thay(taoDuongDan('dangnhap', { tiep: r.chuan }));
    else if (dangNhap && trang === 'dangnhap') thay(dichSauDangNhap(r.tham.tiep, maCho));
  }, [trang, dangNhap, r.chuan]);

  // Trắc nghiệm: mở thẳng /lam khi không có bài đang làm, hoặc /ketqua khi chưa có kết quả → về màn giới thiệu.
  useLayoutEffect(() => {
    if (dangNhap && ((trang === 'tracnghiemlam' && !tn.bai) || (trang === 'tracnghiemketqua' && !tn.hien))) thay(taoDuongDan('tracnghiem'));
  }, [trang, dangNhap, tn.bai, tn.hien]);

  useEffect(() => { document.title = tieuDeTrang(trang, monLink && monLink.ten); }, [trang, monLink]);

  useLayoutEffect(() => {
    if (khungCuon.current) khungCuon.current.scrollTop = viTriCuonKhiDoiMan({ tab: trang, coManCon: false, quayLaiMenu: quayLaiMenu.current, daLuu: viTriMenu.current });
  }, [trang]);

  // Bấm tab Menu khi đang ở Menu (kể cả /menu/<nhom>): không đổi địa chỉ, giữ nhóm đang chọn, chỉ làm mới menu.
  const vaoTab = (t) => {
    quayLaiMenu.current = false;
    if (t === 'menu') datLanVaoMenu((n) => n + 1);
    if (!(t === 'menu' && trang === 'menu')) di(taoDuongDan(t));
  };
  const chonTab = (t) => { datNhuCau(''); vaoTab(t); };
  const moDangNhap = (tiep) => di(taoDuongDan('dangnhap', { tiep }));
  const dangXuat = () => { xoaToken(); xoaTatCa(); datMaCho(''); donPhien(); };
  const luiVe = () => lui(r.cha);

  // Mở một món: đang ở Menu thì nhớ vị trí cuộn để quay lại đúng chỗ.
  const chonMon = (mon) => {
    if (trang === 'menu' && khungCuon.current) { viTriMenu.current = khungCuon.current.scrollTop; quayLaiMenu.current = true; }
    di(taoDuongDan('mon', { slug: slugMon(mon, ds) }));
  };
  const moQR = () => di(taoDuongDan('qr'));
  const moTracNghiem = () => { if (klLuu) tn.xemBanLuu(); di(taoDuongDan(klLuu ? 'tracnghiemketqua' : 'tracnghiem')); };
  const moUuDai = () => chonTab('uudai');
  const moMenu = () => chonTab('menu');
  const moGioVang = () => { quayLaiMenu.current = false; datNhuCau(''); di(taoDuongDan('menu', { nhom: 'gio-vang' })); datLanVaoMenu((n) => n + 1); };
  const taiTab = (t) => trang === t;

  return (
    <NguCanhGia.Provider value={nguCanhGia}>
    <div className="phone">
      <div className="screens" ref={khungCuon}>
        {daVaoMenu && <Menu hien={taiTab('menu')} tai={menu} lanVao={lanVaoMenu} nhuCau={nhuCau} boNhuCau={() => datNhuCau('')} chonMon={chonMon} moQR={moQR} moDangNhap={() => moDangNhap(r.chuan)} nhomSlug={nhomCuoi.current} doiNhom={(nhom) => thay(taoDuongDan('menu', { nhom }))} />}
        {taiTab('trangchu') && <TrangChu menu={menu} dangNhap={dangNhap} klLuu={klLuu} moTracNghiem={moTracNghiem} moDangNhapTai={moDangNhap} moQR={moQR} moMenu={moMenu} moGioVang={moGioVang} moUuDai={moUuDai} moDangNhap={() => moDangNhap('/uudai')} chonMon={chonMon} locNhuCau={(ten) => { vaoTab('menu'); datNhuCau(ten); }} />}
        {dangNhap && taiTab('uudai') && <UuDai maSan={maCho} khiNhanXong={() => datMaCho('')} moQR={moQR} />}
        {dangNhap && taiTab('taikhoan') && <TaiKhoan luu={tn.luu} klLuu={klLuu} moTracNghiem={moTracNghiem} moQR={moQR} moDon={() => di(taoDuongDan('donhang'))} moHoSo={() => di(taoDuongDan('thongtin'))} moHoTro={() => di(taoDuongDan('hotro'))} moUuDai={moUuDai} dangXuat={dangXuat} />}
        {dangNhap && trang === 'tracnghiem' && <TracNghiem tn={tn} lui={luiVe} vaoLam={() => di(taoDuongDan('tracnghiemlam'))} moKetQua={() => { tn.xemBanLuu(); di(taoDuongDan('tracnghiemketqua')); }} />}
        {dangNhap && trang === 'tracnghiemlam' && <TracNghiemLam tn={tn} thoat={() => { tn.bo(); thay(taoDuongDan('tracnghiem')); }} xemKetQua={() => thay(taoDuongDan('tracnghiemketqua'))} />}
        {dangNhap && trang === 'tracnghiemketqua' && <TracNghiemKetQua tn={tn} menu={menu} lui={luiVe} chonMon={chonMon} moHoTro={coLienHe(LIEN_HE) ? () => di(taoDuongDan('hotro')) : null} veGioiThieu={() => thay(taoDuongDan('tracnghiem'))} lamLai={() => { if (tn.batDau(tn.hien.kl.gioiTinh)) di(taoDuongDan('tracnghiemlam')); }} />}
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
    </NguCanhGia.Provider>
  );
}
