import { layToi, layDiem, layVoucher } from '../api.js';
import { dungTai } from '../dungTai.js';
import { cheSdt, dinhDangSo, dinhDangGia, dinhDangNgay } from '../dinhDang.js';
import { THE_CHAT } from '../noiDung/theChat.js';
import { DONG_TAI_KHOAN } from '../noiDung/tracNghiemChu.js';
import { LIEN_HE, coLienHe } from '../noiDung/lienHe.js';
import Man, { NutQR } from '../components/Man.jsx';
import TrangTai from '../components/TrangTai.jsx';
import { Med } from '../components/BieuTuong.jsx';
import { bam } from '../components/bam.js';

// Tài khoản theo demo (account): thẻ tên + 3 ô nhanh, nhóm "Của tôi" / "Cài đặt", đăng xuất.
// Bỏ: Ví & Thẻ quà tặng (nạp / tặng thẻ → KH-MUA-1), Gia đình (sau khai trương), Thông báo & âm thanh, Quản trị (không thuộc app khách).
// Ô nhanh Ví · Điểm · Voucher; hạng cạnh số điện thoại. Ví = `so_du_vi` của /toi, lấy mới mỗi lần mở màn (không lưu trên máy); chưa có số thì ẩn ô.

function DongMenu({ bieuTuong, ten, phu, chon }) {
  return (
    <div className="menu-item acc-it" {...bam(chon)}>
      <div className="ic"><Med ten={bieuTuong} s={44} /></div>
      <div className="t">{ten}<small>{phu}</small></div>
      <div className="chev">›</div>
    </div>
  );
}

export default function TaiKhoan({ luu, klLuu, moDon, moQR, moHoSo, moHoTro, moTracNghiem, moUuDai, dangXuat }) {
  const tai = dungTai(layToi);
  const diem = dungTai(layDiem);
  const voucher = dungTai(layVoucher);
  // `/voucher` không `?all` chỉ trả mã còn dùng (hợp đồng) → đếm thẳng, không dựa trường trạng thái ngoài hợp đồng.
  const soVoucher = voucher.dl ? voucher.dl.ma_khach_moi.length + voucher.dl.data.length : null;
  return (
    <Man id="account">
      <div className="topbar"><div><h1>Tài khoản</h1></div><NutQR moQR={moQR} /></div>
      <TrangTai tai={tai}>
        {({ khach }) => (
          <>
            <div className="acc-card" {...bam(moHoSo)}>
              <div className="acc-top">
                <div className="avatar">{(khach.ten || '?').trim().charAt(0).toUpperCase()}</div>
                <div className="acc-n"><b>{khach.ten}</b><small>{cheSdt(khach.sdt)}{khach.hang ? ` · Hạng ${khach.hang.ten}` : ''}</small></div>
                <span className="acc-edit">Sửa ›</span>
              </div>
              {(typeof khach.so_du_vi === 'number' || diem.dl || soVoucher !== null) && (
                <div className="acc-q" onClick={(e) => e.stopPropagation()}>
                  {typeof khach.so_du_vi === 'number' && <div><b>{dinhDangGia(khach.so_du_vi)}</b><small>Ví</small></div>}
                  {diem.dl && <div {...bam(moUuDai)}><b>{dinhDangSo(diem.dl.points)}</b><small>Điểm</small></div>}
                  {soVoucher !== null && <div {...bam(moUuDai)}><b>{soVoucher}</b><small>Voucher</small></div>}
                </div>
              )}
            </div>
            <div className="acc-g">Của tôi</div>
            <DongMenu bieuTuong="package" ten="Đơn hàng" phu="Lịch sử các đơn đã mua" chon={moDon} />
            <div className="acc-g">{DONG_TAI_KHOAN.nhom}</div>
            <div className="menu-item acc-it" {...bam(moTracNghiem)}>
              <div className="ic"><img className="en" src="/anh/the-chat-scale.svg" width="40" height="40" alt="" /></div>
              <div className="t">{DONG_TAI_KHOAN.ten}<small>{klLuu ? `${THE_CHAT[klLuu.picks[0]].phai} · ${dinhDangNgay(luu.ngay.slice(0, 10))}` : DONG_TAI_KHOAN.chuaLam}</small></div>
              <div className="chev">›</div>
            </div>
            <div className="acc-g">Cài đặt</div>
            <DongMenu bieuTuong="name" ten="Thông tin cá nhân" phu="Tên hiển thị, mã PIN" chon={moHoSo} />
            {coLienHe(LIEN_HE) && <DongMenu bieuTuong="chat" ten="Hỗ trợ" phu="Gọi, nhắn Zalo cho quán" chon={moHoTro} />}
            <div className="acc-out" {...bam(dangXuat)}>Đăng xuất</div>
          </>
        )}
      </TrangTai>
    </Man>
  );
}
