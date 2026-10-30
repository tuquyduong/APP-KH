// Thanh tab như demo: nền lụa + huy hiệu ngũ hành, 5 mục (Giỏ hàng từ KH-MUA-1). Màu chữ khi chọn lấy từ demo (--c).
// `soMon` > 0 → số món trên tab Giỏ hàng (phiếu KH-MUA-1 A1; demo không vẽ — xem viec/KH-MUA-1/doi_chieu_demo.md).
const CAC_TAB = [
  ['trangchu', 'Trang chủ', 'nhA-tho', '#C98712'],
  ['menu', 'Menu', 'nhA-moc', '#23804A'],
  ['giohang', 'Giỏ hàng', 'nhA-kim', '#7C8696'],
  ['uudai', 'Ưu đãi', 'nhA-hoa', '#C22A2A'],
  ['taikhoan', 'Tài khoản', 'nhA-thuy', '#1E3F86'],
];

export default function ThanhTab({ tab, chon, soMon = 0 }) {
  return (
    <nav className="tabbar" aria-label="Điều hướng chính">
      <svg className="tab-silk" viewBox="0 0 300 90" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="tsG" x1="0" x2="1"><stop offset="0" stopColor="#FFE7A3" /><stop offset=".25" stopColor="#CDEFD6" /><stop offset=".5" stopColor="#EEF1F7" /><stop offset=".75" stopColor="#FFD5CC" /><stop offset="1" stopColor="#D3E2FB" /></linearGradient>
          <linearGradient id="tsS" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".85" /><stop offset=".35" stopColor="#fff" stopOpacity="0" /><stop offset=".62" stopColor="#fff" stopOpacity=".3" /><stop offset=".8" stopColor="#fff" stopOpacity="0" /></linearGradient>
          <linearGradient id="tsT" x1="0" x2="1"><stop offset="0" stopColor="#F6E3AE" /><stop offset=".5" stopColor="#C9A25A" /><stop offset="1" stopColor="#EBD28F" /></linearGradient>
        </defs>
        <path d="M0 1 H300 V90 H0 Z" fill="url(#tsG)" />
        <path d="M0 1 H300 V90 H0 Z" fill="url(#tsS)" />
        <path d="M0 1.5 H300" stroke="url(#tsT)" strokeWidth="2.5" fill="none" vectorEffect="non-scaling-stroke" />
        <path d="M0 4 H300" stroke="#fff" strokeWidth="1" opacity=".8" fill="none" vectorEffect="non-scaling-stroke" />
      </svg>
      {CAC_TAB.map(([ma, ten, bt, mau]) => (
        <button key={ma} type="button" className={`tab${ma === tab ? ' active' : ''}`} style={{ '--c': mau }} aria-current={ma === tab ? 'page' : undefined} onClick={() => chon(ma)}>
          <svg className="med tabmed" width="32" height="32" viewBox="0 0 64 64" aria-hidden="true"><use href={`#${bt}`} /></svg>
          {ten}
          {ma === 'giohang' && soMon > 0 && <span className="tab-so" aria-label={`${soMon} món trong giỏ`}>{soMon}</span>}
        </button>
      ))}
    </nav>
  );
}
