import BannerHomNay from './BannerHomNay.jsx';

/**
 * Banner "hôm nay" bản nhỏ ở đầu màn Kế hoạch và các màn tiện ích (demo #todayLich / #todayTool). Cùng chữ + đích bấm với banner Trang chủ;
 * chưa có chữ khuyến mãi (banner.tieuDe rỗng) hoặc khách đã bấm ✕ hôm nay (`an`) thì không hiện gì. Bản nhỏ KHÔNG có ✕ (đúng demo): ✕ nằm ở banner Trang chủ, bấm thì ẩn bản nhỏ ở đây.
 */
export default function BannerNho({ banner, an, chon }) {
  if (!banner || !banner.tieuDe || an) return null;
  return <div className="today-slot"><BannerHomNay anh={banner.anh} tieuDe={banner.tieuDe} phu={banner.phu} nut={banner.nut} chon={chon} mini /></div>;
}
