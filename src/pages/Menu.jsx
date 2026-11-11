import { useEffect, useRef, useState } from 'react';
import { dinhDangNgay } from '../dinhDang.js';
import { slug } from '../duongDan.js';
import { timMon, locTheoNhuCau, nhomTheoTen, bieuTuongNhom, NHOM_MAC_DINH } from '../menuLoc.js';
import { MON } from '../noiDung/mon.js';
import Man, { NutQR } from '../components/Man.jsx';
import TrangTai from '../components/TrangTai.jsx';
import MonO from '../components/MonO.jsx';
import { Ico, En, DenLong } from '../components/BieuTuong.jsx';
import GvDem from '../components/GvDem.jsx';
import { dungGia } from '../heThong.js';
import Chu from '../components/Chu.jsx';
import { nd, ndPhan, ndDau, ndDs } from '../noiDung/nd.js';

// Menu theo demo: ô tìm + lưới ô nhóm món (nhóm của POS) + lưới món theo nhóm. Màn này luôn được giữ nguyên khi vào một món rồi quay lại
// (App giữ nó trong cây, chỉ ẩn) nên ô tìm, nhóm đang chọn và vị trí cuộn còn nguyên. Topping của demo → TOPPING-1.
// Ô "Giờ vàng" (đường dẫn /menu/gio-vang) chỉ có khi POS báo Giờ vàng bật và có món ghép được với menu.
const GV_SLUG = 'gio-vang';
const TAT_CA = { id: '', ic: NHOM_MAC_DINH.ic }; // chữ "Tất cả" đọc từ danh mục (menu.tatCa) khi vẽ
const LECH_CUON_NHOM = 60; // chừa chỗ cho thanh nhóm thu nhỏ khi nhảy tới lưới (demo catPick)

// `nhomSlug` = nhóm đang chọn lấy từ đường dẫn (/menu/<nhom>); chọn nhóm khác → doiNhom(slug) thay đường dẫn, không thêm lịch sử.
export default function Menu({ tai, hien, lanVao, nhuCau, boNhuCau, chonMon, moQR, nhomSlug, doiNhom }) {
  // Menu được giữ trong cây nên hỏi lại menu mỗi lần khách BẤM tab Menu (lanVao tăng; menu lấy chưa quá 5 phút thì dungMenu bỏ qua); quay lại từ màn con thì giữ nguyên.
  const lanTruoc = useRef(lanVao);
  useEffect(() => {
    if (lanTruoc.current !== lanVao) { lanTruoc.current = lanVao; tai.taiLai(); }
  }, [lanVao, tai.taiLai]);
  const [tu, datTu] = useState('');
  const [mini, datMini] = useState(false);
  const oNhom = useRef(null);
  const luoi = useRef(null);
  const ds = tai.dl ? tai.dl.data : [];

  useEffect(() => {
    const el = oNhom.current;
    if (!el || typeof IntersectionObserver !== 'function') return undefined;
    const io = new IntersectionObserver((es) => es.forEach((e) => datMini(!e.isIntersecting && e.boundingClientRect.top < 0)), { root: el.closest('.screens'), threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [tai.dl]);

  const chonNhom = (id) => {
    doiNhom(id ? slug(id) : '');
    requestAnimationFrame(() => {
      const g = luoi.current; const sc = g && g.closest('.screens');
      if (!g || !sc) return;
      const lech = g.getBoundingClientRect().top - sc.getBoundingClientRect().top;
      if (lech < LECH_CUON_NHOM) sc.scrollTop += lech - LECH_CUON_NHOM;
    });
  };

  const { tt, maGv, coMenu } = dungGia();
  const coGv = !!tt && (!coMenu || maGv.size > 0); // Giờ vàng tắt / không món ghép được → ẩn mọi chỗ
  const chonGv = coGv && nhomSlug === GV_SLUG;
  const nhomCo = nhomTheoTen(ds).map(([ten]) => ({ id: ten, ten, ic: bieuTuongNhom(ten).ic }));
  const oChon = [...nhomCo, { ...TAT_CA, ten: nd('menu.tatCa') }];
  const nhom = chonGv ? GV_SLUG : (nhomCo.find((n) => slug(n.ten) === nhomSlug) || TAT_CA).id;
  const q = tu.trim();
  let loc = nhuCau ? locTheoNhuCau(ds, MON, nhuCau) : ds;
  loc = timMon(loc, tu);
  if (chonGv && !q) loc = loc.filter((m) => maGv.has(m.ma));
  else if (nhom && !q) loc = loc.filter((m) => (m.nhom || nd('menu.nhomKhac')) === nhom);
  const phan = q ? [[null, loc]] : chonGv ? [[GV_SLUG, loc]] : nhomTheoTen(loc);
  const conHang = ds.filter((m) => m.con_hang !== false).length;
  const nhanNhuCau = (ndDs('home.need').find((n) => n.ten === nhuCau) || { nhan: nhuCau }).nhan; // `ten` để lọc, `nhan` để hiện (một nguồn với Trang chủ)

  return (
    <Man id="catalog" hien={hien}>
      <div className="topbar">
        <div><Chu k="menu.tieuDe" as="h1" />{tai.dl && (tai.cu ? <Chu k="menu.giaCu" as="div" className="sub" bien={{ ngay: dinhDangNgay(tai.luc) }} /> : <Chu k="menu.conMon" as="div" className="sub" bien={{ so: conHang }} />)}</div>
        <NutQR moQR={moQR} />
      </div>
      <div className={`active-filter-bar${nhuCau ? ' show' : ''}`}>
        <span {...ndDau('menu.dangLoc')}>{ndPhan('menu.dangLoc', { nhuCau: nhanNhuCau })}</span>
        <span className="x" role="button" tabIndex={0} onClick={boNhuCau} onKeyDown={(e) => { if (e.key === 'Enter') boNhuCau(); }} {...ndDau('menu.xoaLoc')}>{nd('menu.xoaLoc')} <Ico ten="close" s={12} /></span>
      </div>
      <div className="search-box">
        <Ico ten="search" s={16} />
        <input type="text" enterKeyHint="search" aria-label={nd('menu.timAria')} placeholder={nd('menu.timGoiY')} {...ndDau('menu.timGoiY')} value={tu} onChange={(e) => datTu(e.target.value)} />
      </div>
      <TrangTai tai={{ ...tai, taiLai: () => tai.taiLai(true) }}>
        {() => (
          <>
            <div className="cat-tiles" ref={oNhom}>
              {coGv && (
                <div className={`ct gv${tt.pha === 'dang' ? ' live' : ''}${chonGv ? ' on' : ''}`} role="button" tabIndex={0} onClick={() => chonNhom(GV_SLUG)} onKeyDown={(e) => { if (e.key === 'Enter') chonNhom(GV_SLUG); }}>
                  <DenLong s={34} /><b {...ndDau('menu.gv.ten')}>{nd('menu.gv.ten')}</b><small {...ndDau('menu.gv.dem')}><GvDem kieu="tile" /></small>
                </div>
              )}
              {oChon.map((o) => (
                <div key={o.id || 'tat-ca'} className={`ct${nhom === o.id ? ' on' : ''}`} role="button" tabIndex={0} onClick={() => chonNhom(o.id)} onKeyDown={(e) => { if (e.key === 'Enter') chonNhom(o.id); }}>
                  <En ten={o.ic} s={34} /><b {...(o.id ? ndDau('menu.nhom') : ndDau('menu.tatCa'))}>{o.ten}</b>
                </div>
              ))}
            </div>
            <div className="cat-mini-wrap">
              <div className={`cat-mini${mini ? ' show' : ''}`}>
                {coGv && (
                  <div className={`cm${chonGv ? ' on' : ''}${tt.pha === 'dang' ? ' live' : ''}`} role="button" tabIndex={0} title={nd('menu.gv.ten')} aria-label={nd('menu.gv.ten')} onClick={() => chonNhom(GV_SLUG)} onKeyDown={(e) => { if (e.key === 'Enter') chonNhom(GV_SLUG); }}>
                    <DenLong s={26} />
                  </div>
                )}
                {oChon.map((o) => (
                  <div key={o.id || 'tat-ca'} className={`cm${nhom === o.id ? ' on' : ''}`} role="button" tabIndex={0} title={o.ten} aria-label={o.ten} onClick={() => chonNhom(o.id)} onKeyDown={(e) => { if (e.key === 'Enter') chonNhom(o.id); }}>
                    <En ten={o.ic} s={26} />
                  </div>
                ))}
              </div>
            </div>
            <div id="catGrid" ref={luoi}>
              {ds.length === 0 && <Chu k="menu.rong" as="div" className="empty-note" />}
              {ds.length > 0 && loc.length === 0 && <Chu k="menu.khongKhop" as="div" className="empty-note" />}
              {phan.map(([ten, mon]) => (
                <div key={ten || 'tim'}>
                  {ten === GV_SLUG && (
                    <div className={`gv-head${tt.pha === 'dang' ? ' live' : ''}`}>
                      <DenLong s={46} />
                      <div className="gv-ht">
                        <Chu k="menu.gv.dau" as="b" />
                        <small {...ndDau('menu.gv.khung')}>{ndPhan('menu.gv.khung', { batDau: tt.batDau, ketThuc: tt.ketThuc, phanTram: tt.phanTram })}</small>
                        <span className="gv-st"><i /><span {...ndDau('menu.gv.dem')}><GvDem kieu="long" /></span></span>
                      </div>
                    </div>
                  )}
                  {ten && ten !== GV_SLUG && <div className="cat-title" {...ndDau('menu.nhom')}><En ten={bieuTuongNhom(ten).ic} s={22} /> {ten}<span {...ndDau('menu.soMon')}>{ndPhan('menu.soMon', { so: mon.length })}</span></div>}
                  <div className="grid2">{mon.map((m) => <MonO key={m.ma} mon={m} chon={chonMon} />)}</div>
                  {ten === GV_SLUG && <Chu k="menu.gv.luuY" as="div" className="care-disclaimer" style={{ marginTop: 10 }} />}
                </div>
              ))}
            </div>
          </>
        )}
      </TrangTai>
    </Man>
  );
}
