// MẪU BẢN THỬ 18.11 (chat) — CHỈ kiểu "b" là kiểu chủ quán chọn (vòng xoay giữa màn, KHÔNG nền, KHÔNG mờ). Kiểu a / c / "hien-nay" chỉ để so trên bản thử — KHÔNG làm.
// Mẫu đếm MỌI lượt hỏi POS — phiếu A1: lượt ngầm KHÔNG tính.
// BẢN THỬ — biểu tượng chờ (chủ quán chọn kiểu ở trang demo). window.__KIEU: 'hien-nay' | 'a' | 'b' | 'c'.
// a: thanh mảnh chạy trên đầu màn (hiện khi hỏi POS quá 0,3 giây) · b: vòng xoay giữa màn (KHÔNG làm mờ, không chặn bấm — chủ quán 18.11) · c: như a + logo xoay lúc mở App.
import { useEffect, useState } from 'react';
import { theoDoiDangHoi } from '../api.js';

const TRE_HIEN = 300;

export default function ChoDemo() {
  const kieu = window.__KIEU || 'hien-nay';
  const [hien, datHien] = useState(false);
  const [moApp, datMoApp] = useState(kieu === 'c');
  useEffect(() => {
    let hen = null, daHoi = false;
    const batDau = Date.now();
    const tat = () => { clearTimeout(hen); hen = null; datHien(false); };
    const go = theoDoiDangHoi((so) => {
      if (so > 0) {
        daHoi = true;
        if (!hen) hen = setTimeout(() => datHien(true), TRE_HIEN);
      } else {
        tat();
        if (daHoi) setTimeout(() => datMoApp(false), Math.max(0, 700 - (Date.now() - batDau)));
      }
    });
    const chan = setTimeout(() => datMoApp(false), 8000);
    return () => { go(); tat(); clearTimeout(chan); };
  }, []);
  if (kieu === 'hien-nay') return null;
  return (
    <>
      {kieu === 'c' && (
        <div className={`cho-mo-app${moApp ? '' : ' tat'}`} aria-hidden={!moApp}>
          <img src="anh/logo-bieu-tuong.webp" alt="" className="cho-logo" />
          <div className="cho-mo-chu">Tứ Quý Đường</div>
        </div>
      )}
      {(kieu === 'a' || kieu === 'c') && <div className={`cho-thanh${hien ? ' bat' : ''}`} role="progressbar" aria-label="Đang tải" aria-hidden={!hien} />}
      {kieu === 'b' && hien && (
        <div className="cho-phu" role="progressbar" aria-label="Đang tải"><span className="cho-nen"><span className="cho-xoay to" /></span></div>
      )}
    </>
  );
}
