import { useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { docToken, xoaToken, datKhiHetPhien, layChiTietDon, layChuongTrinh } from './api.js';
import { cuaToi, cuaDiem, cuaDon, CUA_KHACH, lamMoi, xoaKhoKhach, napTomTat, luuTomTat, dungLamMoiNgam } from './duLieuKhach.js';
import { docMaTuDiaChi, boMaKhoiDiaChi } from './maBill.js';
import { dungDuongDan, viTriCuonKhiDoiMan } from './dieuHuong.js';
import { taoDuongDan, slugMon, timMonTheoSlug, tieuDeTrang } from './duongDan.js';
import { dungMenu } from './dungMenu.js';
import { dungTracNghiem } from './dungTracNghiem.js';
import { dungHeThong, dungNguCanhGia, NguCanhGia, khoGioVang } from './heThong.js';
import { chonQuangCao, coDai } from './quangCao.js';
import { docChuongTrinh } from './chuongTrinh.js';
import { LIEN_HE, coLienHe } from './noiDung/lienHe.js';
import { xoaMenuLuu } from './menuLuu.js';
import { doiKhach, xoaTatCa } from './luuMay.js';
import { giaHanNeuCan } from './giaHan.js';
import { bayGio, coBayGio } from './bayGio.js';
import { khoGioHoatDong } from './gioHoatDong.js';
import { dungKho } from './kho.js';
import { canDangNhap, dichSauDangNhap } from './luongDangNhap.js';
import { docGio, ghiGio, themMon, demMon, themThe, boDongDaGui, coDoUong } from './gio.js';
import { banGhiCuaDon, docGuiDo, ghiGuiDo, maDonDaTra, moTheoDoi, monDatLai, thamThanhToanLai } from './datDon.js';
import { DAT_ONLINE } from './noiDung/caiDat.js';
import { SPRITE_MUA } from './noiDung/bieuTuongMua.js';
import { nd, ngheNoiDung, phienNoiDung } from './noiDung/nd.js';
import Thongbao from './components/Thongbao.jsx';
import BaoDonXong from './components/BaoDonXong.jsx';
import DaiNhacViec from './components/DaiNhacViec.jsx';
import DaiQuangCao from './components/DaiQuangCao.jsx';
import GioHang from './pages/GioHang.jsx';
import ThanhToan from './pages/ThanhToan.jsx';
import TheoDoiDon from './pages/TheoDoiDon.jsx';
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
import KeHoach from './pages/KeHoach.jsx';
import TienIch from './pages/TienIch.jsx';
import HangThanhVien from './pages/HangThanhVien.jsx';
import { quenKeHoach } from './components/dungKeHoach.js';

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

// Chương trình đặc biệt lần gần nhất (thông tin CÔNG KHAI của quán — không phải dữ liệu riêng của khách, nên không nằm trong luuMay.js và không xoá khi đăng xuất):
// lần mở sau banner Trang chủ có ngay tên chương trình, không nháy chữ mặc định trong lúc chờ /chuong-trinh. Chỉ { ma, ten, moTa, loai }; đọc hỏng → rỗng; kho bị chặn → bỏ qua.
const KHOA_CT_MAY = 'kh_chuong_trinh';
const LOAI_CT = ['sinh_nhat', 'hoc_sinh_gioi', 'khac'];
function docCtMay() {
  try {
    const v = JSON.parse(localStorage.getItem(KHOA_CT_MAY));
    return Array.isArray(v) ? v.filter((c) => c && typeof c.ten === 'string' && c.ten.trim()).map((c) => ({ ma: c.ma, ten: c.ten.trim(), moTa: typeof c.moTa === 'string' ? c.moTa : '', loai: LOAI_CT.includes(c.loai) ? c.loai : 'khac' })) : [];
  } catch { return []; }
}
const gonCt = (ds) => ds.map(({ ma, ten, moTa, loai }) => ({ ma, ten, moTa, loai })); // chỉ bốn trường công khai
function ghiCtMay(ds) {
  try { if (ds.length) localStorage.setItem(KHOA_CT_MAY, JSON.stringify(gonCt(ds))); else localStorage.removeItem(KHOA_CT_MAY); } catch { /* kho bị chặn: bỏ qua */ }
}

// Điều hướng bằng đường dẫn thật (dieuHuong.js + duongDan.js): thanh địa chỉ là trạng thái, mở thẳng / tải lại / Back / Tiến đều đúng trang.
// Khách chưa đăng nhập vẫn xem Trang chủ / Menu / Trang món; vào trang cần tài khoản (Ưu đãi, Tài khoản, mã QR) thì thay bằng /dangnhap?tiep=<trang>
// và đăng nhập xong về đúng trang đó. Hết phiên / 401 → api.js xoá phiên và gọi `donPhien` → chế độ khách.
// Khung `.phone` / `.screens` / `.screen` y demo. Menu được GIỮ trong cây (chỉ ẩn) từ lần vào đầu → vào một món rồi quay lại còn nguyên ô tìm, nhóm, vị trí cuộn.
export default function App() {
  const [dangNhap, datDangNhap] = useState(() => !!docToken());
  const [maCho, datMaCho] = useState(MA_TU_LINK);
  const { duong: r, di, thay, lui } = dungDuongDan();
  const trang = r.trang;
  const banNoiDung = useSyncExternalStore(ngheNoiDung, phienNoiDung); // bản nội dung mới (noiDung/nd.js) → vẽ lại cả cây, đổi tên tab trình duyệt
  const menu = dungMenu(dangNhap);
  const tnGoc = dungTracNghiem();
  dungHeThong(); // hạng, Giờ vàng, giờ hoạt động + "bây giờ" của POS: nạp một lần ở đây, các màn chỉ đọc
  dungLamMoiNgam(dangNhap); // dữ liệu khách (duLieuKhach.js): quay lại app sau 60 giây / mỗi 5 phút → lấy lại ngầm
  const coGioPos = dungKho(khoGioHoatDong) !== null && coBayGio();
  // Tự gia hạn đăng nhập (KH-UI-3b D): có phiên + đã biết giờ POS → giaHan.js tự giữ "tối đa một lần mỗi ngày"; không chặn màn nào.
  useEffect(() => { if (dangNhap && coGioPos) giaHanNeuCan(bayGio()); }, [dangNhap, coGioPos]);
  // Bản lưu trên máy chỉ hiện khi đã đăng nhập VÀ đã biết khách là ai (luuMay.doiKhach xong): chưa đăng nhập, hết phiên, hoặc đang chờ GET /toi thì
  // bản của khách trước không hiện ra. Lỗi mạng khi hỏi /toi → vẫn ẩn (an toàn hơn hiện nhầm).
  const [daBiet, datDaBiet] = useState(false);
  // Hạng của khách { id, ten } ĐỌC kho /toi (KH-THE-1 D1: mua thẻ xong lamMoi /toi → giá theo hạng mới ngay); chỉ khi đã biết khách. Không lưu trên máy.
  const toiKho = dungKho(cuaToi.kho);
  const hk = daBiet && toiKho.dl && toiKho.dl.khach ? toiKho.dl.khach.hang : null;
  const hangToi = useMemo(() => (hk ? { id: hk.id, ten: hk.ten } : null), [hk && hk.id, hk && hk.ten]);
  const tn = daBiet ? tnGoc : { ...tnGoc, luu: null, klLuu: null, hien: null };
  const klLuu = dangNhap ? tn.klLuu : null;
  const ds = menu.dl ? menu.dl.data : RONG;
  const nguCanhGia = dungNguCanhGia(ds, hangToi);
  const gioVangPos = dungKho(khoGioVang);
  // /chuong-trinh cho dải và banner Trang chủ: tối đa MỘT lần mỗi lần mở App, hỏi khi tới Trang chủ hoặc trang có dải đầu tiên (Ưu đãi tự hỏi lấy rồi; dải ở đó thừa nên không hỏi trùng); lỗi mạng → bỏ nguồn này, không báo
  const [chuongTrinh, datChuongTrinh] = useState(docCtMay);
  const daHoiCt = useRef(false);
  useEffect(() => {
    if (daHoiCt.current || !(coDai(trang) || trang === 'trangchu') || trang === 'uudai') return;
    daHoiCt.current = true;
    layChuongTrinh().then((d) => { const ds = docChuongTrinh(d); datChuongTrinh(ds); ghiCtMay(ds); }, () => {});
  }, [trang]);
  const [daVaoMenu, datDaVaoMenu] = useState(false);
  const [lanVaoMenu, datLanVaoMenu] = useState(0);
  const [nhuCau, datNhuCau] = useState('');
  // Giỏ hàng (KH-MUA-1): trên máy `kh_gio` (gio.js; luật xoá ở luuMay.js). Đơn vừa tạo { ma, qr } giữ trong bộ nhớ trang (QR chỉ có lúc tạo đơn).
  const [gio, datGio] = useState(docGio);
  const [maGiam, datMaGiam] = useState('');
  const [thongBao, datThongBao] = useState('');
  const [tieuXong, datTieuXong] = useState(''); // "(Xong) Đơn #…" do BaoDonXong đặt; thắng tiêu đề của trang tới khi khách tắt / xem đơn
  const [monLoi, datMonLoi] = useState(null); // { ma, chu } POS vừa báo HET_HANG / MON_KHONG_BAN — dòng giỏ đánh dấu tới khi giỏ đổi
  const doiGio = (g) => { datGio(g); ghiGio(g); datMonLoi(null); };
  const docLaiGio = () => { datGio(docGio()); datMaGiam(''); quenKeHoach(); }; // luuMay.doiKhach vừa xoá dữ liệu của khách trước
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
  // Giỏ và bản ghi lần gửi đơn (kh_don_gui) GIỮ khi hết phiên (như dữ liệu trên máy, §8); mã giảm thuộc phiên → dọn cùng chỗ.
  const donPhien = () => { thay('/trangchu'); datMaGiam(''); xoaMenuLuu(); datDangNhap(false); datDaVaoMenu(false); datNhuCau(''); quayLaiMenu.current = false; viTriMenu.current = 0; datDaBiet(false); tnGoc.donBoNho(); xoaKhoKhach(); quenKeHoach(); };
  useEffect(() => { datKhiHetPhien(donPhien); });

  // Mỗi lần có phiên (mở app khi còn token, hoặc vừa đăng nhập): hiện ngay bản tóm tắt của đúng khách, tải trước CẢ BỐN cửa khách cùng lúc (KH-NHANH-1 B);
  // /toi về → biết khách là ai → khác khách trước thì xoá dữ liệu trên máy (luuMay.js), rồi nạp bản lưu. `cuaToi.lay()` dùng chung lệnh vừa gửi (không gọi trùng).
  useLayoutEffect(() => {
    if (!dangNhap) return undefined;
    let huy = false;
    napTomTat();
    lamMoi(CUA_KHACH);
    cuaToi.lay().then((r) => { if (!huy && r && r.khach) { if (doiKhach(r.khach.sdt)) docLaiGio(); luuTomTat() /* gọi tay SAU doiKhach: người nghe kho đã bỏ qua khi chủ máy chưa đúng */; tnGoc.nap(); datDaBiet(true); } }); // lỗi → null: 401 api.js đã dọn phiên; mạng lỗi: lần mở sau sẽ kiểm
    return () => { huy = true; };
  }, [dangNhap]);

  // Trang cần đăng nhập mà chưa đăng nhập → /dangnhap?tiep=<trang> (thay, không thêm lịch sử). Đăng nhập xong → rời /dangnhap tới tiep.
  useLayoutEffect(() => {
    if (canDangNhap(trang, dangNhap, maCho)) thay(taoDuongDan('dangnhap', { tiep: r.chuan }));
    else if (dangNhap && trang === 'dangnhap') thay(dichSauDangNhap(r.tham.tiep, maCho));
  }, [trang, dangNhap, r.chuan, maCho]);

  // Trắc nghiệm: mở thẳng /lam khi không có bài đang làm, hoặc /ketqua khi chưa có kết quả → về màn giới thiệu.
  useLayoutEffect(() => {
    if (dangNhap && ((trang === 'tracnghiemlam' && !tn.bai) || (trang === 'tracnghiemketqua' && !tn.hien))) thay(taoDuongDan('tracnghiem'));
  }, [trang, dangNhap, tn.bai, tn.hien]);

  useEffect(() => { document.title = tieuDeTrang(trang, monLink && monLink.ten); if (tieuXong) document.title = tieuXong; }, [trang, monLink, tieuXong, banNoiDung]);

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
  const dangXuat = () => { xoaToken(); xoaTatCa(); ghiGuiDo(null) /* cả bản trong bộ nhớ trang khi kho bị chặn */; datGio([]); datMaCho(''); donPhien(); };
  const luiVe = () => lui(r.cha);
  const quangCaoTho = chonQuangCao({ gioVang: gioVangPos, chuongTrinh, bayGio: bayGio() }); // MỘT lần: dải các trang + banner Trang chủ cùng đọc
  const quangCao = coDai(trang) && (dangNhap || !r.canDN) && !quangCaoTho.macDinh && !(quangCaoTho.dich === 'uudai' && trang === 'uudai') ? quangCaoTho : null; // dải dẫn tới chính trang đang đứng thì thừa

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
  const moDichQuangCao = ({ dich, maMon }) => {
    const mon = dich === 'mon' ? ds.find((m) => m.ma === maMon) : null;
    if (dich === 'uudai') moUuDai(); else if (dich === 'tracnghiem') moTracNghiem(); else if (mon) chonMon(mon); else moMenu();
  };
  const taiTab = (t) => trang === t;
  const vaoGio = (chu) => { datThongBao(chu); di(taoDuongDan('giohang')); };
  // Thêm món xong QUAY LẠI trang trước (QĐ 31.10; mở thẳng link món → /menu, cha của /mon) — không nhảy vào giỏ.
  const themVaoGio = (mon, so, ghiChu) => { doiGio(themMon(gio, mon.ma, so, ghiChu)); datThongBao(nd('app.daThem', { ten: mon.ten })); luiVe(); };
  // "Đặt lại" đọc `mon[].ma` (hợp đồng v5) — mở cùng cờ DAT_ONLINE; vẫn vào giỏ (G2).
  const datLai = (ma) => (!ds.length ? Promise.resolve(datThongBao(nd('app.menuChua'))) : layChiTietDon(ma).then((r) => {
    const { them, boQua } = monDatLai(r.don, ds);
    const boChu = boQua ? nd('app.boQua', { so: boQua }) : '';
    if (!them.length) { datThongBao(boChu || nd('app.donRong')); return; }
    doiGio(them.reduce((g, d) => themMon(g, d.ma, d.so_luong, d.ghi_chu), gio));
    vaoGio(`${nd('app.daThemNhieu', { so: demMon(them) })}${boChu ? ' · ' + boChu : ''}`);
  }, (e) => datThongBao(e.message)));
  const xongDatDon = (don) => { lamMoi([cuaToi, cuaDon, cuaDiem]); di(taoDuongDan('theodoi', { ma: don.ma })); };
  // Đơn vừa đặt từ máy này (bản ghi kh_don_gui, còn sau khi tải lại) đã trả → dọn giỏ + mã giảm MỘT lần (đánh dấu `xong`). Bản ghi GIỮ (không xoá) để tab
  // Thanh toán đang mở ở cửa sổ khác vẫn thấy "Bạn vừa đặt đơn …" (ra-soát vòng 1); đơn mới ghi đè, đăng xuất / đổi khách xoá. Huỷ → làm mới /don, /toi (ví nhả).
  // KH-THE-1: dọn ĐÚNG các dòng đã gửi (đơn "trả thẻ trước" giữ đồ uống + mã giảm — mã chỉ bỏ khi đơn có gửi mã); làm mới /toi + menu (hạng mới, giá mới).
  const daTra = (ma) => { lamMoi([cuaDon]) /* đơn QR vừa trả: dải báo đơn xong bắt đầu hỏi */; const g = banGhiCuaDon(ma); if (g && !g.xong) { ghiGuiDo({ ...g, xong: true }); doiGio(boDongDaGui(gio, g.than.mon)); if (g.than.ma_giam) datMaGiam(''); lamMoi([cuaToi]); menu.taiLai(true); } };
  // C7: đơn của bản ghi đã trả mà Theo dõi đơn không mở — kho /don (mở App, làm mới ngầm, dải báo đơn, Lịch sử đơn) thấy thì dọn giỏ, đúng MỘT lần (cờ xong).
  const khoDon = dungKho(cuaDon.kho);
  const maDaTra = dangNhap ? maDonDaTra(docGuiDo(), khoDon.dl && khoDon.dl.data) : '';
  useEffect(() => { if (maDaTra) daTra(maDaTra); }, [maDaTra]);
  const moHang = (h) => di(taoDuongDan('hang', h ? { h } : {}));
  // Mua / gia hạn thẻ (KH-THE-1 B3): cần đăng nhập (xong quay về đúng màn); thêm dòng thẻ, ở lại màn, báo như thêm món.
  const muaThe = (h, g) => {
    if (!dangNhap) { moDangNhap(r.chuan); return; }
    const { gio: moi, doi } = themThe(gio, h.id, g.so_thang);
    doiGio(moi); datThongBao(nd(doi ? 'tier.daDoi' : 'tier.daThem', { hang: h.ten, so: g.so_thang }));
  };
  const daHuy = () => lamMoi([cuaDon, cuaToi]);

  return (
    <NguCanhGia.Provider value={nguCanhGia}>
    <div className="phone">
      <div className="screens" ref={khungCuon}>
        {quangCao && <DaiQuangCao chu={quangCao.chu} khoa={quangCao.khoaDai} chon={quangCao.dich ? () => moDichQuangCao(quangCao) : null} />}
        {daVaoMenu && <Menu hien={taiTab('menu')} tai={menu} lanVao={lanVaoMenu} nhuCau={nhuCau} boNhuCau={() => datNhuCau('')} chonMon={chonMon} moQR={moQR} nhomSlug={nhomCuoi.current} doiNhom={(nhom) => thay(taoDuongDan('menu', { nhom }))} moHang={moHang} />}
        {taiTab('giohang') && <GioHang gio={gio} ds={ds} doi={doiGio} dangNhap={dangNhap} maGiam={maGiam} datMaGiam={datMaGiam} tiepTuc={() => di(taoDuongDan('thanhtoan'))} moMenu={moMenu} monLoi={monLoi} traTheTruoc={() => di(taoDuongDan('thanhtoan', { chi: 'the' }))} />}
        {dangNhap && trang === 'thanhtoan' && <ThanhToan key={r.tham.chi || 'ca'} chiThe={r.tham.chi === 'the'} daTra={daTra} gio={gio} ds={ds} maGiam={maGiam} lui={luiVe} xong={xongDatDon} moLichSu={() => di(taoDuongDan('donhang'))} moDon={(ma) => di(taoDuongDan('theodoi', { ma }))} veGio={() => di(taoDuongDan('giohang'))} danhDauMon={datMonLoi} sauHuy={daHuy} />}
        {dangNhap && trang === 'theodoi' && <TheoDoiDon key={r.tham.ma} ma={r.tham.ma} lui={luiVe} daTra={daTra} daHuy={daHuy} veThanhToan={() => di(taoDuongDan('thanhtoan', thamThanhToanLai(banGhiCuaDon(r.tham.ma))))} conDoUong={coDoUong(gio)} veGio={() => di(taoDuongDan('giohang'))} />}
        {dangNhap && trang === 'kehoach' && <KeHoach san={daBiet} lui={luiVe} moTienIch={(id) => di(taoDuongDan('tienich', { tienich: id }))} moTracNghiem={moTracNghiem} coKetQuaTn={!!klLuu} ds={ds} chonMon={chonMon} />}
        {dangNhap && trang === 'tienich' && <TienIch key={r.tham.tienich} id={r.tham.tienich} san={daBiet} veLich={() => di(taoDuongDan('kehoach'))} moTienIch={(id) => di(taoDuongDan('tienich', { tienich: id }))} ds={ds} chonMon={chonMon} />}
        {taiTab('trangchu') && <TrangChu quangCao={quangCaoTho} moQuangCao={() => moDichQuangCao(quangCaoTho)} menu={menu} dangNhap={dangNhap} daBiet={daBiet} moKeHoach={() => di(taoDuongDan('kehoach'))} klLuu={klLuu} moTracNghiem={moTracNghiem} moDangNhapTai={moDangNhap} moQR={moQR} moMenu={moMenu} moGioVang={moGioVang} moUuDai={moUuDai} moDangNhap={() => moDangNhap('/uudai')} chonMon={chonMon} locNhuCau={(ten) => { vaoTab('menu'); datNhuCau(ten); }} moHang={moHang} />}
        {taiTab('uudai') && <UuDai dangNhap={dangNhap} maSan={maCho} khiNhanXong={() => datMaCho('')} moQR={moQR} moGioVang={moGioVang} moDangNhap={() => moDangNhap('/uudai')} moHoSo={() => di(taoDuongDan('thongtin'))} moHang={moHang} />}
        {trang === 'hang' && <HangThanhVien dangNhap={dangNhap} hId={r.tham.h} doiHang={(h) => thay(taoDuongDan('hang', { h }))} lui={luiVe} mua={muaThe} />}
        {dangNhap && taiTab('taikhoan') && <TaiKhoan luu={tn.luu} klLuu={klLuu} moTracNghiem={moTracNghiem} moQR={moQR} moDon={() => di(taoDuongDan('donhang'))} moHoSo={() => di(taoDuongDan('thongtin'))} moHoTro={() => di(taoDuongDan('hotro'))} moUuDai={moUuDai} dangXuat={dangXuat} />}
        {dangNhap && trang === 'tracnghiem' && <TracNghiem tn={tn} lui={luiVe} vaoLam={() => di(taoDuongDan('tracnghiemlam'))} moKetQua={() => { tn.xemBanLuu(); di(taoDuongDan('tracnghiemketqua')); }} />}
        {dangNhap && trang === 'tracnghiemlam' && <TracNghiemLam tn={tn} thoat={() => { tn.bo(); thay(taoDuongDan('tracnghiem')); }} xemKetQua={() => thay(taoDuongDan('tracnghiemketqua'))} />}
        {dangNhap && trang === 'tracnghiemketqua' && <TracNghiemKetQua tn={tn} menu={menu} lui={luiVe} chonMon={chonMon} moHoTro={coLienHe(LIEN_HE) ? () => di(taoDuongDan('hotro')) : null} veGioiThieu={() => thay(taoDuongDan('tracnghiem'))} lamLai={() => { if (tn.batDau(tn.hien.kl.gioiTinh)) di(taoDuongDan('tracnghiemlam')); }} />}
        {trang === 'mon' && <MonTheoDuong mon={monLink} tai={menu} lui={luiVe} moQR={moQR} moMenu={moMenu} them={themVaoGio} />}
        {!dangNhap && trang === 'dangnhap' && <DangNhap khiXong={(k) => { if (k && doiKhach(k.sdt)) docLaiGio(); datDangNhap(true); }} dong={luiVe} coMaHoaDon={!!maCho} />}
        {dangNhap && trang === 'qr' && <ManQR lui={luiVe} />}
        {dangNhap && trang === 'donhang' && <LichSuDon chonDon={(d) => di(taoDuongDan(moTheoDoi(d.tien_trinh) ? 'theodoi' : 'don', { ma: d.ma }))} lui={luiVe} datLai={DAT_ONLINE ? datLai : null} />}
        {dangNhap && trang === 'don' && <ChiTietDon ma={r.tham.ma} lui={luiVe} />}
        {dangNhap && trang === 'thongtin' && <HoSo lui={luiVe} />}
        {trang === 'hotro' && <HoTro lui={luiVe} />}
        {(trang === 'khongthay' || r.giuCho) && <KhongTimThay chon={() => vaoTab('trangchu')} />}
      </div>
      <ThanhTab tab={r.tab || tabCuoi.current} chon={chonTab} soMon={demMon(gio)} />
      <Thongbao chu={thongBao} het={() => datThongBao('')} />
      {dangNhap && <BaoDonXong moDon={(ma) => di(taoDuongDan('theodoi', { ma }))} datTieuDe={datTieuXong} />}
      {dangNhap && <DaiNhacViec san={daBiet} moNgay={() => di(taoDuongDan('kehoach'))} />}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false" dangerouslySetInnerHTML={{ __html: SPRITE_MUA }} />
      <ManDau />
    </div>
    </NguCanhGia.Provider>
  );
}
