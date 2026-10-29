import { LIEN_HE } from '../noiDung/lienHe.js';
import Man, { DauManCon } from '../components/Man.jsx';
import { Med } from '../components/BieuTuong.jsx';

// Liên hệ hỗ trợ theo demo (support): mỗi cách liên hệ một hàng. Chỉ hiện hàng có giá trị trong noiDung/lienHe.js. Video hướng dẫn / câu hỏi thường gặp → KH-UI-5.
export default function HoTro({ lui }) {
  const { dienThoai, zalo, email } = LIEN_HE;
  const hang = [
    dienThoai && { bt: 'phone', ten: 'Gọi quán', phu: dienThoai, href: `tel:${dienThoai.replace(/[^\d+]/g, '')}` },
    zalo && { bt: 'chat', ten: 'Nhắn Zalo', phu: zalo, href: `https://zalo.me/${zalo.replace(/\D/g, '')}`, ngoai: true },
    email && { bt: 'mail', ten: 'Email', phu: email, href: `mailto:${email}` },
  ].filter(Boolean);
  return (
    <Man id="support">
      <DauManCon tieuDe="Liên hệ hỗ trợ" lui={lui} />
      {hang.map((h) => (
        <a className="support-row" key={h.bt} href={h.href} {...(h.ngoai ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          <div className="ic"><Med ten={h.bt} s={44} /></div>
          <div className="info"><div className="t">{h.ten}</div><div className="s">{h.phu}</div></div>
        </a>
      ))}
    </Man>
  );
}
