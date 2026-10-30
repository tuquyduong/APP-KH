import { dungGia } from '../heThong.js';
import GvDem from './GvDem.jsx';
import { bam } from './bam.js';

/** Ô "Giờ vàng" ở Trang chủ (demo hb-t-flash, hbFlash): −X%, số món, đếm ngược. POS tắt Giờ vàng / không món ghép được → không có ô. Không chữ về suất. */
export default function OGioVang({ mo }) {
  const { tt, maGv, coMenu, soMon } = dungGia();
  if (!tt || (coMenu && maGv.size === 0)) return null;
  const dang = tt.pha === 'dang';
  const n = coMenu ? maGv.size : soMon;
  return (
    <div className="hb-tile hb-t-flash" {...bam(mo)}>
      <div className="hb-ic"><b className="hb-off">−{tt.phanTram}%</b></div>
      <div className="hb-tx">
        <div className="hb-k">Giờ vàng</div>
        <div className="hb-h">{dang ? `${n} món đang giảm` : `${n} món cuối ngày`}</div>
        <div className={`hb-s${dang ? ' live' : ''}`}><GvDem kieu="short" /></div>
      </div>
    </div>
  );
}
