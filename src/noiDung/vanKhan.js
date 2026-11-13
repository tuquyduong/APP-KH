// Văn khấn & lễ cúng — PHẦN MÁY CẦN của 11 dịp (KH-ND-3d): mã dịp, biểu tượng, cách tính ngày (kieu / lunar / gio), dịp đổi năm (newYear), dịp cần tên người mất (needNm).
// MỌI CHỮ (tên dịp, lễ vật, cách sắp lễ, bài khấn, ghi chú) ở danh mục src/noiDung/nd/tienIch.js, khoá vkd.<mã dịp>.ten · .le · .cach · .khan (sửa được ở /admin). Tên mùa / tên tháng âm: noiDung/coDinh/lich.js.
// Cách tính ngày: src/vanKhan.js. Chỗ tự điền trong bài khấn: {ten} {dc} {ho} {ld} {lm} {ny} {nyc} {nm}.
export const VK = [
  {id: 'r', ic: 'lantern', kieu: 'mot15'},
  {id: 'tao', ic: 'flame', lunar: [23, 12]},
  {id: 'gt', ic: 'moon', kieu: 'giaothua', newYear: true},
  {id: 'tet', ic: 'blossom', lunar: [1, 1]},
  {id: 'tt', ic: 'token', lunar: [10, 1]},
  {id: 'rg', ic: 'lantern', lunar: [15, 1]},
  {id: 'tm', ic: 'sprig', kieu: 'thanhminh', needNm: true},
  {id: 'dn', ic: 'gourd', lunar: [5, 5]},
  {id: 'vl', ic: 'lotus', lunar: [15, 7]},
  {id: 'ttu', ic: 'moon', lunar: [15, 8]},
  {id: 'gio', ic: 'house', gio: true, needNm: true} ];

export const MA_DIP = VK.map((v) => v.id);
