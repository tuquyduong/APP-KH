// Dữ liệu hiển thị của Trắc nghiệm thể trạng — chép từ thiet_ke/app_kh_demo.html (patch39): TRAITS, VIS, PROD_KEY; bộ 60 câu + 9 nhóm ở tracNghiem.json,
// bảng ghép món ở tracNghiemMenu.json. Khoá nhóm theo file dữ liệu (bh kh dh ah dt tn hu ku db), KHÔNG dùng khoá nội bộ binh/khi/duong… của demo.
import DL from './tracNghiem.json';
import MENU from './tracNghiemMenu.json';

export { DL, MENU };

/** Thứ tự hiện 9 thể trạng (demo: ['binh'].concat(TC_GROUPS)). */
export const THU_TU_NHOM = ['bh', 'kh', 'dh', 'ah', 'dt', 'tn', 'hu', 'ku', 'db'];

export const TRAITS = {
  bh:['Thể trạng cân đối, sắc mặt hồng nhuận, mắt sáng','Ít mệt, ngủ ngon, ăn ngon, chịu được nóng lạnh','Tâm trạng thường ổn định, thích nghi tốt'],
  kh:['Thường dễ mệt, hụt hơi, nói nhỏ, dễ ra mồ hôi','Cơ bắp thường mềm, sức bền kém, dễ cảm vặt','Tính cách thường trầm, hướng nội'],
  dh:['Thường sợ lạnh, tay chân lạnh, thích đồ ấm','Ăn uống đồ lạnh dễ khó chịu, dễ đi ngoài','Chịu được mùa nóng, kém chịu mùa lạnh và gió'],
  ah:['Thường thấy nóng trong, lòng bàn tay chân nóng, khô miệng, da khô','Dễ táo bón, người thường gầy','Tính thường nóng vội, hiếu động; kém chịu nóng'],
  dt:['Thường thấy người nặng nề, bụng to mềm, dễ buồn ngủ','Hay có đờm, miệng dính, da nhờn, ra mồ hôi dính','Tính thường ôn hòa, nhẫn nại; kém chịu thời tiết ẩm'],
  tn:['Thường mặt bóng dầu, dễ nổi mụn, đắng miệng, hơi thở có mùi','Người hay nặng mỏi, tiểu vàng; kém chịu thời tiết nóng ẩm','Tính thường dễ cáu, sốt ruột'],
  hu:['Da thường sạm, dễ nám, dễ bầm, môi sẫm, quầng thâm mắt','Hay đau mỏi ở một chỗ cố định; phụ nữ dễ đau bụng kinh','Dễ hay quên, hay phiền; kém chịu lạnh'],
  ku:['Thường hay buồn bực, lo nghĩ, dễ xúc động, hay thở dài','Hay tức ngực sườn, vướng họng; người thường gầy','Nhạy cảm với áp lực và thời tiết âm u'],
  db:['Thường hay hắt hơi, sổ mũi, ngứa khi giao mùa dù không cảm','Dễ dị ứng thức ăn, thuốc, phấn hoa; dễ nổi mề đay','Kém thích nghi khi đổi môi trường, đổi đồ ăn lạ']
};

// biểu tượng (file trong public/anh/the-chat-<tên>.svg tách từ demo) · màu · chữ Hán
const VIS = {
  bh: ['lotus', '#E7A8BE', '平和'],
  kh: ['sprig', '#8FC79C', '氣虛'],
  dh: ['sun', '#E9B06A', '陽虛'],
  ah: ['moon', '#B4A0E2', '陰虛'],
  dt: ['cloud', '#9FB4CC', '痰濕'],
  tn: ['drop', '#7FCBB2', '濕熱'],
  hu: ['blossom', '#E595A3', '血瘀'],
  ku: ['fan', '#D59FC6', '氣鬱'],
  db: ['gourd', '#C9B08A', '特稟'],
};

/** Một thể trạng để hiện: tên, đặc điểm, chăm sóc, thức uống, bảng món nên / tránh. Khoá = khoá nhóm của file dữ liệu. */
export const THE_CHAT = Object.fromEntries(Object.entries(DL.groups).map(([k, g]) => [k, {
  khoa: k, ten: g.name, phai: g.phai, han: VIS[k][2], anh: `/anh/the-chat-${VIS[k][0]}.svg`, mau: VIS[k][1],
  dacDiem: TRAITS[k], chamSoc: g.care, tra: g.tea, menu: MENU.nhom[k],
}]));

/** Mã món demo → từ khoá trong tên món (demo PROD_KEY). Món POS ghép bằng từ khoá này (tracNghiem.js), không bằng mã demo. */
export const TU_KHOA_MON = {
  'tra-duong-nhan': 'dưỡng nhan',
  'tra-ngoc-thanh': 'ngọc thanh',
  'tra-pho-nhi': 'phổ nhĩ',
  'tra-luc-bao': 'lục bảo',
  'ep-hong-tan-sinh': 'hồng tân sinh',
  'ep-thanh-tan-duong': 'thanh tân dưỡng',
  'cf-den': 'cà phê',
  'cf-nau': 'cà phê',
  'cf-muoi': 'cà phê',
  'ds-tau-hu': 'tàu hũ',
  'ds-nep-cam': 'nếp cẩm',
  'ds-canh-dai-bo': 'canh đại bổ',
  'ds-sup-le': 'súp lê',
  'ds-linh-chi': 'linh chi',
  'hq-theo-ngay': 'hoa quả theo ngày',
};
