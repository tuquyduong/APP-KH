// Chữ khối thể chất ở màn kết quả trắc nghiệm (components/KhoiTheChat.jsx đọc `KET_QUA`). Chữ nằm ở danh mục nội dung (src/noiDung/nd/taiKhoan.js, khoá tnk.*);
// tệp này chỉ là cầu đọc (getter) để KhoiTheChat không phải sửa. Nạp tệp này KHÔNG kéo vòng với danh mục (danh mục không import tệp này).
import { nd } from './nd.js';

export const KET_QUA = {
  get duaTren() { return nd('tnk.duaTren'); },
  get khongNoiBat() { return nd('tnk.khongNoiBat'); },
  get dacDiem() { return nd('tnk.dacDiem'); },
  get mucNhe() { return nd('tnk.mucNhe'); },
  get chamSoc() { return nd('tnk.chamSoc'); },
  get thucUong() { return nd('tnk.thucUong'); },
};
