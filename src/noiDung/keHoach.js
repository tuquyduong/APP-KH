// Dữ liệu Kế hoạch và nhắc việc — CHÉP NGUYÊN từ thiet_ke/app_kh_demo.html (patch39): ngày lễ, bốn mùa, gợi ý quà. Không sửa chữ / số
// (muốn đổi → hỏi chủ quán). Bài thử cong_cu/thu_KHUI5b.js so từng byte với demo. TERM_TIPS và LUNAR ở src/lich.js.
export const WD = ['Chủ nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'];
export const SOLAR_HOL = { '1/1':'Tết Dương lịch', '14/2':'Lễ Tình nhân', '8/3':'Quốc tế Phụ nữ', '30/4':'Giải phóng miền Nam', '1/5':'Quốc tế Lao động',
  '1/6':'Quốc tế Thiếu nhi', '2/9':'Quốc khánh', '20/10':'Phụ nữ Việt Nam', '20/11':'Nhà giáo Việt Nam', '24/12':'Đêm Giáng sinh' };
export const LUNAR_HOL = { '1/1':'Tết Nguyên đán', '2/1':'Tết Nguyên đán', '3/1':'Tết Nguyên đán', '15/1':'Tết Nguyên tiêu', '10/3':'Giỗ Tổ Hùng Vương',
  '5/5':'Tết Đoan ngọ', '15/7':'Lễ Vu Lan', '15/8':'Tết Trung thu', '23/12':'Ông Công ông Táo' };
export const SEASON = idx => idx >= 21 || idx <= 2 ? { n:'Xuân', ic:'blossom' } : idx <= 8 ? { n:'Hạ', ic:'sun' } : idx <= 14 ? { n:'Thu', ic:'fan' } : { n:'Đông', ic:'moon' };
export const SS = { 'Xuân':{ tang:'Can (Mộc)', an:'Rau xanh non, giá đỗ, hành lá, các loại mầm; vị ngọt nhẹ, bớt chua.', uong:'Trà hoa cúc, trà xanh pha nhẹ, nước ấm buổi sáng.',
    sh:'Ngủ sớm dậy sớm, đi bộ, vươn vai; giữ ấm cổ gáy khi trời nồm ẩm.', tt:'Thư thái, cởi mở, tránh nóng giận.', han:'Đồ chiên rán, rượu, thức khuya.', p:['tra-luc-bao','tra-ngoc-thanh'] },
  'Hạ':{ tang:'Tâm (Hoả)', an:'Thanh đạm, nhiều rau quả: bí, mướp, đậu xanh, sen, dưa.', uong:'Uống đủ nước, từng ngụm; không uống nhiều đá một lúc.',
    sh:'Ngủ trưa ngắn 20–30 phút; tránh nắng 11–15 giờ; tắm nước ấm, không tắm lạnh ngay khi vừa ra nắng.', tt:'Tĩnh tâm, nhẹ nhàng, tránh nóng vội.', han:'Đồ cay nóng, đồ quá lạnh.', p:['ep-thanh-tan-duong','ds-tau-hu'] },
  'Thu':{ tang:'Phế (Kim)', an:'Món nhuận: lê, nấm tuyết, củ sen, mật ong, mè, bách hợp.', uong:'Nước ấm, trà nhuận; uống đều trong ngày vì trời hanh khô.',
    sh:'Ngủ sớm dậy sớm; giữ ấm cổ họng buổi sáng; dưỡng ẩm da.', tt:'Lạc quan, tránh buồn bã kéo dài.', han:'Đồ cay, đồ nướng khô, thuốc lá.', p:['ds-sup-le','tra-duong-nhan'] },
  'Đông':{ tang:'Thận (Thuỷ)', an:'Món ấm và bổ: đậu đen, óc chó, táo đỏ, gừng, canh hầm.', uong:'Trà ấm, nước gừng; tránh đồ uống lạnh.',
    sh:'Ngủ sớm, dậy muộn hơn một chút; giữ ấm chân, lưng, bụng; vận động vừa đủ, không ra mồ hôi nhiều.', tt:'Tĩnh, giữ gìn sức lực.', han:'Đồ sống lạnh, thức khuya.', p:['ds-canh-dai-bo','tra-pho-nhi'] } };
export const SS_F = [['tang','Tạng cần dưỡng'],['an','Ăn'],['uong','Uống'],['sh','Sinh hoạt'],['tt','Tinh thần'],['han','Nên hạn chế']];
export const GIFT_HOL = ['Quốc tế Phụ nữ','Phụ nữ Việt Nam','Nhà giáo Việt Nam','Lễ Tình nhân','Tết Trung thu','Tết Nguyên đán'];
