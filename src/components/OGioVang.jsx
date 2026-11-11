import { dungGia } from '../heThong.js';
import GvDem from './GvDem.jsx';
import { bam } from './bam.js';
import { nd, ndDau } from '../noiDung/nd.js';
import Chu from './Chu.jsx';

/** Ô "Giờ vàng" ở Trang chủ (demo hb-t-flash, hbFlash): −X%, số món, đếm ngược. LUÔN có mặt (hai ô một hàng như demo): POS tắt Giờ vàng / không món ghép được / chưa tải được → ô MỜ "Hiện chưa có", không bấm. Không chữ về suất. */
export default function OGioVang({ mo }) {
  const { tt, maGv, coMenu, soMon } = dungGia();
  if (!tt || (coMenu && maGv.size === 0)) {
    return (
      <div className="hb-tile hb-t-flash hb-mo">
        <div className="hb-ic"><b className="hb-off">−%</b></div>
        <div className="hb-tx">
          <Chu k="home.gvk" as="div" className="hb-k" />
          <Chu k="home.gv.chua" as="div" className="hb-h" />
        </div>
      </div>
    );
  }
  const dang = tt.pha === 'dang';
  const n = coMenu ? maGv.size : soMon;
  return (
    <div className="hb-tile hb-t-flash" {...bam(mo)}>
      <div className="hb-ic" {...ndDau('home.gv.so')}><b className="hb-off">−{tt.phanTram}%</b></div>
      <div className="hb-tx">
        <Chu k="home.gvk" as="div" className="hb-k" />
        <Chu k={dang ? 'home.gv.dang' : 'home.gv.cuoi'} as="div" className="hb-h" bien={{ so: n }} />
        <div className={`hb-s${dang ? ' live' : ''}`}><GvDem kieu="short" /></div>
      </div>
    </div>
  );
}
