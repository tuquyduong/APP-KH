import { useEffect, useState } from 'react';
import { khoGioVang, napGioVang } from '../heThong.js';
import { dungKho } from '../kho.js';
import { bayGio } from '../bayGio.js';
import { trangThaiGioVang, chuGioVang } from '../gioVang.js';

/** Chữ đếm ngược / trạng thái Giờ vàng (demo `gv-cd`), tự chạy mỗi giây theo "bây giờ" của POS; chỉ phần chữ này vẽ lại, không kéo cả màn. */
export default function GvDem({ kieu }) {
  const gv = dungKho(khoGioVang);
  const [nhip, datNhip] = useState(0);
  useEffect(() => {
    const id = setInterval(() => { if (!document.hidden) datNhip((n) => n + 1); }, 1000);
    return () => clearInterval(id);
  }, []);
  const tt = trangThaiGioVang(gv, bayGio());
  const cho = !!tt && tt.pha === 'cho';
  useEffect(() => { if (cho) napGioVang(); }, [cho, nhip]); // tới giờ mà POS chưa báo "đang chạy" → hỏi lại (hệ thống giới hạn tần suất)
  return tt ? chuGioVang(tt, kieu) : '';
}
