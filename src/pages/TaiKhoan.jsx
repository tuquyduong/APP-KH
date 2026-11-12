import { dungCua, cuaToi, cuaDiem, cuaVoucher } from '../duLieuKhach.js';
import { cheSdt, dinhDangSo, dinhDangGia, dinhDangNgay } from '../dinhDang.js';
import { THE_CHAT } from '../noiDung/theChat.js';
import { LIEN_HE, coLienHe } from '../noiDung/lienHe.js';
import { nd, ndAnh, ndDau } from '../noiDung/nd.js';
import Chu from '../components/Chu.jsx';
import Man, { NutQR } from '../components/Man.jsx';
import TrangTai from '../components/TrangTai.jsx';
import { Med } from '../components/BieuTuong.jsx';
import { bam } from '../components/bam.js';

// Tài khoản theo demo (account): thẻ tên + 3 ô nhanh, nhóm "Của tôi" / "Cài đặt", đăng xuất.
// Bỏ: Ví & Thẻ quà tặng (nạp / tặng thẻ → KH-MUA-1), Gia đình (sau khai trương), Thông báo & âm thanh, Quản trị (không thuộc app khách).
// Ô nhanh Ví · Điểm · Voucher; hạng cạnh số điện thoại. Đọc kho chung (duLieuKhach.js): có sẵn thì hiện ngay, cập nhật ngầm; chưa có số thì ẩn ô.

// `ten` / `phu` = KHOÁ nội dung (không phải chữ): chữ lấy từ danh mục.
function DongMenu({ bieuTuong, ten, phu, chon }) {
  return (
    <div className="menu-item acc-it" {...bam(chon)}>
      <div className="ic"><Med ten={bieuTuong} s={44} /></div>
      <div className="t"><Chu k={ten} /><Chu k={phu} as="small" /></div>
      <div className="chev">›</div>
    </div>
  );
}

export default function TaiKhoan({ luu, klLuu, moDon, moQR, moHoSo, moHoTro, moTracNghiem, moUuDai, dangXuat }) {
  const tai = dungCua(cuaToi);
  const diem = dungCua(cuaDiem);
  const voucher = dungCua(cuaVoucher);
  // `/voucher` không `?all` chỉ trả mã còn dùng (hợp đồng) → đếm thẳng, không dựa trường trạng thái ngoài hợp đồng.
  const soVoucher = voucher.dl ? voucher.dl.ma_khach_moi.length + voucher.dl.data.length : null;
  return (
    <Man id="account">
      <div className="topbar"><div><Chu k="tk.tieuDe" as="h1" /></div><NutQR moQR={moQR} /></div>
      <TrangTai tai={tai}>
        {({ khach }) => (
          <>
            <div className="acc-card" {...bam(moHoSo)}>
              <div className="acc-top">
                <div className="avatar" {...ndDau('tk.khach')}>{(khach.ten || '?').trim().charAt(0).toUpperCase()}</div>
                <div className="acc-n" {...ndDau('tk.khach')}><b>{khach.ten}</b><small>{[cheSdt(khach.sdt), khach.hang && nd('tk.hang', { hang: khach.hang.ten })].filter(Boolean).join(' · ')}</small></div>
                <Chu k="tk.sua" className="acc-edit" />
              </div>
              {(typeof khach.so_du_vi === 'number' || diem.dl || soVoucher !== null) && (
                <div className="acc-q" onClick={(e) => e.stopPropagation()}>
                  {typeof khach.so_du_vi === 'number' && <div {...ndDau('tk.khach')}><b>{dinhDangGia(khach.so_du_vi)}</b><Chu k="tk.vi" as="small" /></div>}
                  {diem.dl && <div {...bam(moUuDai)} {...ndDau('tk.khach')}><b>{dinhDangSo(diem.dl.points)}</b><Chu k="tk.diem" as="small" /></div>}
                  {soVoucher !== null && <div {...bam(moUuDai)} {...ndDau('tk.khach')}><b>{soVoucher}</b><Chu k="tk.voucher" as="small" /></div>}
                </div>
              )}
            </div>
            <Chu k="tk.nhomCuaToi" as="div" className="acc-g" />
            <DongMenu bieuTuong="package" ten="tk.donHang" phu="tk.donHang.phu" chon={moDon} />
            <Chu k="tk.nhomSucKhoe" as="div" className="acc-g" />
            <div className="menu-item acc-it" {...bam(moTracNghiem)}>
              <div className="ic"><img className="en" src={ndAnh('tk.tracNghiem.anh')} width="40" height="40" alt="" {...ndDau('tk.tracNghiem.anh')} /></div>
              <div className="t"><Chu k="tk.tracNghiem" />{klLuu ? <small {...ndDau('tk.tracNghiem.kq')}>{`${THE_CHAT[klLuu.picks[0]].phai} · ${dinhDangNgay(luu.ngay.slice(0, 10))}`}</small> : <Chu k="tk.tracNghiem.chua" as="small" />}</div>
              <div className="chev">›</div>
            </div>
            <Chu k="tk.nhomCaiDat" as="div" className="acc-g" />
            <DongMenu bieuTuong="name" ten="tk.thongTin" phu="tk.thongTin.phu" chon={moHoSo} />
            {coLienHe(LIEN_HE) && <DongMenu bieuTuong="chat" ten="tk.hoTro" phu="tk.hoTro.phu" chon={moHoTro} />}
            <Chu k="tk.dangXuat" as="div" className="acc-out" {...bam(dangXuat)} />
          </>
        )}
      </TrangTai>
    </Man>
  );
}
