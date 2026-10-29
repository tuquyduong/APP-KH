// Biểu tượng nét đơn giản (viền theo màu chữ hiện tại). Một chỗ, dùng lại ở thanh tab, nút tròn, ô tìm.
const NET = {
  nha: 'M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10',
  menu: 'M5 4h14l-1.5 12a3 3 0 0 1-3 2.5h-5a3 3 0 0 1-3-2.5L5 4zM6 9h12M9 21h6',
  qua: 'M4 9h16v4H4zM6 13v8h12v-8M12 9v12M12 9c-3 0-4-4-1-4 2 0 1 4 1 4zM12 9c3 0 4-4 1-4-2 0-1 4-1 4z',
  nguoi: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4 3.5-6 8-6s8 2 8 6',
  qr: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z',
  tim: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4',
  lui: 'M15 5l-7 7 7 7',
  dienThoai: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z',
};

export default function BieuTuong({ ten }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={NET[ten]} />
    </svg>
  );
}
