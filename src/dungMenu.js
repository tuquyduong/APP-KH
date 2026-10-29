import { useCallback, useEffect, useRef, useState } from 'react';
import { layMenu, docToken } from './api.js';
import { docMenuLuu, ghiMenuLuu, gioVn, chonMenu, menuConMoi } from './menuLuu.js';

/**
 * Menu cho cả app, tải MỘT chỗ: mở app là hiện ngay bản đã lưu trên máy (nếu có), rồi lấy bản mới thay vào.
 * Bản lấy chưa quá 5 phút thì KHÔNG gọi lại /menu, trừ khi khách chủ động làm mới (taiLai(true)) hoặc phiên đổi (đăng nhập / đăng xuất / 401).
 * Chỉ LƯU lên máy bản lấy lúc chưa đăng nhập (menu công khai); kết quả của lệnh bay từ phiên cũ bị bỏ.
 * { dl, luc, cu, canDN, loi, dangTai, taiLai } — `cu` = đang hiện bản đã lưu; `canDN` = POS còn đòi đăng nhập mới cho xem menu.
 */
export function dungMenu(dangNhap) {
  const ban = useRef(undefined);
  if (ban.current === undefined) ban.current = docMenuLuu();
  const lanLay = useRef(ban.current ? ban.current.at : 0); // lúc (ms) lấy gần nhất
  const phien = useRef(dangNhap);
  phien.current = dangNhap;
  const [tt, datTt] = useState(() => ({ dl: ban.current ? ban.current.dl : null, luc: ban.current ? ban.current.luc : '', cu: !!ban.current, canDN: false, loi: '', dangTai: true }));
  const taiLai = useCallback((ep) => {
    if (ep !== true && menuConMoi(lanLay.current, Date.now())) { datTt((t) => ({ ...t, dangTai: false })); return; }
    datTt((t) => ({ ...t, dangTai: true }));
    const coPhien = !!docToken();
    layMenu().then(
      (dl) => {
        if (phien.current !== dangNhap) return; // phiên đã đổi trong lúc chờ
        const luc = gioVn(); lanLay.current = Date.now();
        if (!coPhien) ghiMenuLuu(dl, luc, lanLay.current);
        datTt({ ...chonMenu(null, dl, null, luc), dangTai: false });
      },
      (e) => { if (phien.current === dangNhap) datTt((t) => ({ ...chonMenu(e, null, t.dl ? { dl: t.dl, luc: t.luc } : docMenuLuu()), dangTai: false })); },
    );
  }, [dangNhap]);
  const truoc = useRef(dangNhap);
  useEffect(() => { const doiPhien = truoc.current !== dangNhap; truoc.current = dangNhap; taiLai(doiPhien); }, [taiLai]);
  return { ...tt, taiLai };
}
