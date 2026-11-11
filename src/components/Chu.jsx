import { nd, ndDau } from '../noiDung/nd.js';

/** Chữ nội dung sửa được: <Chu k="home.needs" as="h2" /> → <h2 data-nd="home.needs">Chăm sóc theo nhu cầu</h2>. `bien` = chỗ điền; thuộc tính khác chuyển thẳng xuống thẻ. */
export default function Chu({ k, as: The = 'span', bien, ...con }) {
  return <The {...con} {...ndDau(k)}>{nd(k, bien)}</The>;
}
