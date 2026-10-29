import { useEffect, useRef, useState } from 'react';
import { dinhDangNgay } from '../dinhDang.js';
import { slug } from '../duongDan.js';
import { timMon, locTheoNhuCau, nhomTheoTen, bieuTuongNhom, NHOM_MAC_DINH } from '../menuLoc.js';
import { MON } from '../noiDung/mon.js';
import Man, { NutQR } from '../components/Man.jsx';
import TrangTai from '../components/TrangTai.jsx';
import MonO from '../components/MonO.jsx';
import TheMoi from '../components/TheMoi.jsx';
import { THE_MOI_MENU } from '../noiDung/dangNhap.js';
import { Ico, En } from '../components/BieuTuong.jsx';

// Menu theo demo: ô tìm + lưới ô nhóm món (nhóm của POS) + lưới món theo nhóm. Màn này luôn được giữ nguyên khi vào một món rồi quay lại
// (App giữ nó trong cây, chỉ ẩn) nên ô tìm, nhóm đang chọn và vị trí cuộn còn nguyên. Giờ vàng / Topping của demo → KH-UI-3 / TOPPING-1.
const TAT_CA = { id: '', ten: 'Tất cả', ic: NHOM_MAC_DINH.ic };
const LECH_CUON_NHOM = 60; // chừa chỗ cho thanh nhóm thu nhỏ khi nhảy tới lưới (demo catPick)

// `nhomSlug` = nhóm đang chọn lấy từ đường dẫn (/menu/<nhom>); chọn nhóm khác → doiNhom(slug) thay đường dẫn, không thêm lịch sử.
export default function Menu({ tai, hien, lanVao, nhuCau, boNhuCau, chonMon, moQR, moDangNhap, nhomSlug, doiNhom }) {
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

  const nhomCo = nhomTheoTen(ds).map(([ten]) => ({ id: ten, ten, ic: bieuTuongNhom(ten).ic }));
  const oChon = [...nhomCo, TAT_CA];
  const nhom = (nhomCo.find((n) => slug(n.ten) === nhomSlug) || TAT_CA).id;
  const q = tu.trim();
  let loc = nhuCau ? locTheoNhuCau(ds, MON, nhuCau) : ds;
  loc = timMon(loc, tu);
  if (nhom && !q) loc = loc.filter((m) => (m.nhom || 'Khác') === nhom);
  const phan = q ? [[null, loc]] : nhomTheoTen(loc);
  const conHang = ds.filter((m) => m.con_hang !== false).length;

  return (
    <Man id="catalog" hien={hien}>
      <div className="topbar">
        <div><h1>Menu</h1>{tai.dl && <div className="sub">{tai.cu ? `Giá cập nhật lúc ${dinhDangNgay(tai.luc)}` : `${conHang} món đang có`}</div>}</div>
        <NutQR moQR={moQR} />
      </div>
      <div className={`active-filter-bar${nhuCau ? ' show' : ''}`}>
        <span>Đang lọc theo: {nhuCau}</span>
        <span className="x" role="button" tabIndex={0} onClick={boNhuCau} onKeyDown={(e) => { if (e.key === 'Enter') boNhuCau(); }}>Xóa lọc <Ico ten="close" s={12} /></span>
      </div>
      <div className="search-box">
        <Ico ten="search" s={16} />
        <input type="text" enterKeyHint="search"aria-label="Tìm món" placeholder="Tìm món, ví dụ: phổ nhĩ…" value={tu} onChange={(e) => datTu(e.target.value)} />
      </div>
      {tai.canDN && <div className="menu-moi"><TheMoi chu={THE_MOI_MENU} moDangNhap={moDangNhap} /></div>}
      {!tai.canDN && <TrangTai tai={{ ...tai, taiLai: () => tai.taiLai(true) }}>
        {() => (
          <>
            <div className="cat-tiles" ref={oNhom}>
              {oChon.map((o) => (
                <div key={o.id || 'tat-ca'} className={`ct${nhom === o.id ? ' on' : ''}`} role="button" tabIndex={0} onClick={() => chonNhom(o.id)} onKeyDown={(e) => { if (e.key === 'Enter') chonNhom(o.id); }}>
                  <En ten={o.ic} s={34} /><b>{o.ten}</b>
                </div>
              ))}
            </div>
            <div className="cat-mini-wrap">
              <div className={`cat-mini${mini ? ' show' : ''}`}>
                {oChon.map((o) => (
                  <div key={o.id || 'tat-ca'} className={`cm${nhom === o.id ? ' on' : ''}`} role="button" tabIndex={0} title={o.ten} aria-label={o.ten} onClick={() => chonNhom(o.id)} onKeyDown={(e) => { if (e.key === 'Enter') chonNhom(o.id); }}>
                    <En ten={o.ic} s={26} />
                  </div>
                ))}
              </div>
            </div>
            <div id="catGrid" ref={luoi}>
              {ds.length === 0 && <div className="empty-note">Chưa có món nào.</div>}
              {ds.length > 0 && loc.length === 0 && <div className="empty-note">Chưa có món phù hợp. Thử bỏ bớt bộ lọc nhé.</div>}
              {phan.map(([ten, mon]) => (
                <div key={ten || 'tim'}>
                  {ten && <div className="cat-title"><En ten={bieuTuongNhom(ten).ic} s={22} /> {ten}<span>{mon.length} món</span></div>}
                  <div className="grid2">{mon.map((m) => <MonO key={m.ma} mon={m} chon={chonMon} />)}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </TrangTai>}
    </Man>
  );
}
