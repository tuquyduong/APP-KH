import { LIEN_HE } from '../noiDung/lienHe.js';
import { nd, ndDau } from '../noiDung/nd.js';
import Man, { DauManCon } from '../components/Man.jsx';
import { Med } from '../components/BieuTuong.jsx';

// Liên hệ hỗ trợ theo demo (support): mỗi cách liên hệ một hàng. Chỉ hiện hàng có giá trị (danh mục ht.dienThoai / ht.zalo / ht.email). Video hướng dẫn / câu hỏi thường gặp → KH-UI-5.
export default function HoTro({ lui }) {
  const { dienThoai, zalo, email } = LIEN_HE;
  const hang = [
    dienThoai && { bt: 'phone', ten: 'ht.goi', so: 'ht.dienThoai', phu: dienThoai, href: `tel:${dienThoai.replace(/[^\d+]/g, '')}` },
    zalo && { bt: 'chat', ten: 'ht.zalo.t', so: 'ht.zalo', phu: zalo, href: `https://zalo.me/${zalo.replace(/\D/g, '')}`, ngoai: true },
    email && { bt: 'mail', ten: 'ht.email.t', so: 'ht.email', phu: email, href: `mailto:${email}` },
  ].filter(Boolean);
  return (
    <Man id="support">
      <DauManCon tieuDe={nd('ht.tieuDe')} lui={lui} />
      {hang.map((h) => (
        <a className="support-row" key={h.bt} href={h.href} {...(h.ngoai ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          <div className="ic"><Med ten={h.bt} s={44} /></div>
          <div className="info"><div className="t" {...ndDau(h.ten)}>{nd(h.ten)}</div><div className="s" {...ndDau(h.so)}>{h.phu}</div></div>
        </a>
      ))}
    </Man>
  );
}
