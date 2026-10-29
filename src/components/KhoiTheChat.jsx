import { DL, THE_CHAT } from '../noiDung/theChat.js';
import { KET_QUA as CHU } from '../noiDung/tracNghiemChu.js';
import { dauHieuRieng } from '../tracNghiem.js';
import { IcoVe } from './BieuTuong.jsx';
import AnhTheChat from './AnhTheChat.jsx';

/**
 * Một khối thể trạng trong kết quả (demo tcBlock): tên + chữ Hán, "Dựa trên lựa chọn của bạn", đặc điểm, gợi ý chăm sóc, thức uống.
 * `nhe` = mức còn nhẹ (chỉ nhắc, không gợi ý chăm sóc). `ds` / `tra` = bài vừa làm (còn trong bộ nhớ trang); mở lại bản đã lưu thì không có → bỏ dòng "dựa trên lựa chọn".
 */
export default function KhoiTheChat({ khoa, nhan, nhe, ds, tra }) {
  const g = DL.groups[khoa], the = THE_CHAT[khoa];
  const rieng = ds && khoa !== 'bh' ? dauHieuRieng(ds, tra, khoa) : null;
  return (
    <div className="card tcr-sec tblock">
      <div className="tb-h"><AnhTheChat khoa={khoa} s={34} /><div><small>{nhan}</small><b>{g.phai}</b><span>{the.han}</span></div></div>
      {rieng && (rieng.length
        ? <div className="tb-own"><b>{CHU.duaTren}</b> {rieng.join('; ')}.</div>
        : <div className="tb-own">{CHU.khongNoiBat}</div>)}
      <div className="tt">{CHU.dacDiem}</div>
      <ul className="tb-ul">{the.dacDiem.map((x) => <li key={x}>{x}</li>)}</ul>
      {nhe ? (
        <div className="tx">{CHU.mucNhe}{g.tea.split(':')[0].toLowerCase()}.</div>
      ) : (
        <>
          <div className="tt">{CHU.chamSoc}</div>
          <ul className="tb-ul">{g.care.map((x) => <li key={x}>{x}</li>)}</ul>
          <div className="tb-tea"><IcoVe ten="sparkle" s={13} /> <span><b>{CHU.thucUong}</b> {g.tea}</span></div>
        </>
      )}
    </div>
  );
}
