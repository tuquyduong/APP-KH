import BieuTuong from './BieuTuong.jsx';

// Đúng 4 mục; mục mua hàng thêm ở KH-MUA-1.
const CAC_TAB = [
  ['trangchu', 'Trang chủ', 'nha'],
  ['menu', 'Menu', 'menu'],
  ['uudai', 'Ưu đãi', 'qua'],
  ['taikhoan', 'Tài khoản', 'nguoi'],
];

export default function ThanhTab({ tab, chon }) {
  return (
    <nav className="tab" aria-label="Điều hướng chính">
      {CAC_TAB.map(([ma, ten, bt]) => (
        <button key={ma} className={ma === tab ? 'dang-chon' : ''} aria-current={ma === tab ? 'page' : undefined} onClick={() => chon(ma)}>
          <BieuTuong ten={bt} />
          {ten}
        </button>
      ))}
    </nav>
  );
}
