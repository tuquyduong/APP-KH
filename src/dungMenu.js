import { useCallback, useEffect, useRef, useState } from 'react';
import { layMenu } from './api.js';
import { docMenuLuu, ghiMenuLuu, gioVn, chonMenu, menuConMoi } from './menuLuu.js';

/**
 * Menu cho cả app, tải MỘT chỗ: mở app là hiện ngay bản đã lưu trên máy (nếu có), rồi lấy bản mới thay vào.
 * Bản lấy chưa quá 5 phút thì KHÔNG gọi lại /menu, trừ khi khách chủ động làm mới (taiLai(true)).
 * Chưa đăng nhập thì gọi không phiên (api.js chỉ gắn phiên khi có); đổi trạng thái đăng nhập → tải lại (nếu bản không còn mới).
 * { dl, luc, cu, canDN, loi, dangTai, taiLai } — `cu` = đang hiện bản đã lưu; `canDN` = POS còn đòi đăng nhập mới cho xem menu.
 */
export function dungMenu(dangNhap) {
  const ban = useRef(undefined);
  if (ban.current === undefined) ban.current = docMenuLuu();
  const lanLay = useRef(ban.current ? ban.current.at : 0); // lúc (ms) lấy gần nhất
  const [tt, datTt] = useState(() => ({ dl: ban.current ? ban.current.dl : null, luc: ban.current ? ban.current.luc : '', cu: !!ban.current, canDN: false, loi: '', dangTai: true }));
  const taiLai = useCallback((ep) => {
    if (ep !== true && menuConMoi(lanLay.current, Date.now())) { datTt((t) => ({ ...t, dangTai: false })); return; }
    datTt((t) => ({ ...t, dangTai: true }));
    layMenu().then(
      (dl) => { const luc = gioVn(); lanLay.current = Date.now(); ghiMenuLuu(dl, luc, lanLay.current); datTt({ ...chonMenu(null, dl, null, luc), dangTai: false }); },
      (e) => datTt((t) => ({ ...chonMenu(e, null, t.dl ? { dl: t.dl, luc: t.luc } : docMenuLuu()), dangTai: false })),
    );
  }, [dangNhap]); // phiên đổi (đăng nhập / đăng xuất / 401) → tải lại menu
  useEffect(() => { taiLai(); }, [taiLai]);
  return { ...tt, taiLai };
}
