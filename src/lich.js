// Lịch âm / tiết khí — CHÉP NGUYÊN từ thiet_ke/app_kh_demo.html (patch39: `LUNAR`, `TERM_TIPS`), hàm thuần, không đụng DOM.
// Bài thử cong_cu/thu_KHUI5a.js so từng ngày với bảng lấy từ chính hàm của demo (cong_cu/thu_KHUI5a_mau.json). KH-UI-5b dùng lại.
// TERM_TIPS: [lời dưỡng sinh, [mã món demo…]] theo thứ tự LUNAR.TERMS (bắt đầu từ Xuân phân); mã món demo → từ khoá tên món POS ở tracNghiem.js.

export const LUNAR = (() => {
  const TZ = 7, PI = Math.PI, INT = Math.floor;
  function jdFromDate(dd, mm, yy){
    const a = INT((14 - mm) / 12), y = yy + 4800 - a, m = mm + 12 * a - 3;
    let jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - INT(y / 100) + INT(y / 400) - 32045;
    if (jd < 2299161) jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - 32083;
    return jd;
  }
  function newMoonDay(k){
    const T = k / 1236.85, T2 = T * T, T3 = T2 * T, dr = PI / 180;
    let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
    Jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
    const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
    const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
    const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
    let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
    C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
    C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr);
    C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
    C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
    C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
    C1 = C1 + 0.0010 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
    const deltat = T < -11 ? 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3
                           : -0.000278 + 0.000265 * T + 0.000262 * T2;
    return INT(Jd1 + C1 - deltat + 0.5 + TZ / 24);
  }
  // kinh độ mặt trời (độ, 0–360) lúc 0 giờ (giờ VN) của ngày jdn
  function sunDeg(jdn){
    const T = (jdn - 2451545.5 - TZ / 24) / 36525, T2 = T * T, dr = PI / 180;
    const M = 357.52910 + 35999.05030 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
    const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
    let DL = (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
    DL += (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.000290 * Math.sin(dr * 3 * M);
    let L = (L0 + DL) % 360; if (L < 0) L += 360;
    return L;
  }
  const sunSector = jdn => INT(sunDeg(jdn) / 30);   // 12 cung, dùng để xác định tháng âm
  function lunarMonth11(yy){
    const off = jdFromDate(31, 12, yy) - 2415021;
    const k = INT(off / 29.530588853);
    let nm = newMoonDay(k);
    if (sunSector(nm) >= 9) nm = newMoonDay(k - 1);
    return nm;
  }
  function leapMonthOffset(a11){
    const k = INT((a11 - 2415021.076998695) / 29.530588853 + 0.5);
    let last, i = 1, arc = sunSector(newMoonDay(k + i));
    do { last = arc; i++; arc = sunSector(newMoonDay(k + i)); } while (arc !== last && i < 14);
    return i - 1;
  }
  function solar2lunar(dd, mm, yy){
    const dayNumber = jdFromDate(dd, mm, yy);
    const k = INT((dayNumber - 2415021.076998695) / 29.530588853);
    let monthStart = newMoonDay(k + 1);
    if (monthStart > dayNumber) monthStart = newMoonDay(k);
    let a11 = lunarMonth11(yy), b11 = a11, lunarYear;
    if (a11 >= monthStart){ lunarYear = yy; a11 = lunarMonth11(yy - 1); }
    else { lunarYear = yy + 1; b11 = lunarMonth11(yy + 1); }
    const lunarDay = dayNumber - monthStart + 1;
    const diff = INT((monthStart - a11) / 29);
    let leap = false, lunarMonth = diff + 11;
    if (b11 - a11 > 365){
      const lo = leapMonthOffset(a11);
      if (diff >= lo){ lunarMonth = diff + 10; if (diff === lo) leap = true; }
    }
    if (lunarMonth > 12) lunarMonth -= 12;
    if (lunarMonth >= 11 && diff < 4) lunarYear -= 1;
    return { d: lunarDay, m: lunarMonth, y: lunarYear, leap, jd: dayNumber };
  }
  const CAN = ['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'];
  const CHI = ['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
  const TERMS = ['Xuân phân','Thanh minh','Cốc vũ','Lập hạ','Tiểu mãn','Mang chủng','Hạ chí','Tiểu thử','Đại thử','Lập thu','Xử thử','Bạch lộ',
                 'Thu phân','Hàn lộ','Sương giáng','Lập đông','Tiểu tuyết','Đại tuyết','Đông chí','Tiểu hàn','Đại hàn','Lập xuân','Vũ thủy','Kinh trập'];
  const yearName = y => CAN[(y + 6) % 10] + ' ' + CHI[(y + 8) % 12];
  const dayName = jd => CAN[(jd + 9) % 10] + ' ' + CHI[(jd + 1) % 12];
  const monthName = (m, y) => CAN[(y * 12 + m + 3) % 10] + ' ' + CHI[(m + 1) % 12];
  // tiết khí đang hiệu lực trong ngày jd (tính theo cuối ngày) + ngày bắt đầu tiết đó
  function term(jd){
    const idx = INT(sunDeg(jd + 1) / 15);
    let s = jd; while (INT(sunDeg(s) / 15) === idx) s--;   // lùi tới ngày tiết bắt đầu
    let e = jd; while (INT(sunDeg(e + 2) / 15) === idx) e++;     // ngày cuối của tiết
    return { idx, name: TERMS[idx], startJd: s, endJd: e, nextName: TERMS[(idx + 1) % 24], startsToday: s === jd };
  }
  function jdToDate(jd){
    const a = jd + 32044, b = INT((4 * a + 3) / 146097), c = a - INT(b * 146097 / 4);
    const d = INT((4 * c + 3) / 1461), e = c - INT(1461 * d / 4), m = INT((5 * e + 2) / 153);
    return { d: e - INT((153 * m + 2) / 5) + 1, m: m + 3 - 12 * INT(m / 10), y: b * 100 + d - 4800 + INT(m / 10) };
  }
  return { jdFromDate, jdToDate, solar2lunar, yearName, dayName, monthName, term, TERMS };
})();

export const TERM_TIPS = [
  ['Ngày đêm dài bằng nhau, giữ nếp ngủ dậy đều giờ; ăn uống cân bằng, không quá nóng hay quá lạnh.', ['tra-luc-bao','tra-ngoc-thanh']],
  ['Trời ấm, ẩm dần; đi bộ ngoài trời, ăn rau xanh, giữ nhà cửa khô thoáng.', ['tra-luc-bao','ep-thanh-tan-duong']],
  ['Mưa xuân nhiều, độ ẩm cao; ăn thanh đạm, hạn chế đồ ngọt béo.', ['tra-pho-nhi','tra-luc-bao']],
  ['Bắt đầu mùa hạ, ngày dài; ngủ trưa ngắn, uống nước đều trong ngày.', ['tra-ngoc-thanh','ep-thanh-tan-duong']],
  ['Nóng ẩm tăng; chọn món thanh mát, ăn nhiều rau quả.', ['ep-thanh-tan-duong','ds-tau-hu']],
  ['Nắng gắt, mưa rào; tránh ra nắng giữa trưa, uống đủ nước.', ['tra-luc-bao','ds-tau-hu']],
  ['Ngày dài nhất năm; nghỉ ngơi đủ, không uống quá nhiều đá một lúc.', ['ep-thanh-tan-duong','tra-ngoc-thanh']],
  ['Oi bức; ăn nhẹ, chia nhỏ bữa, giữ tâm trạng thư thái.', ['ds-tau-hu','tra-luc-bao']],
  ['Nóng nhất năm; uống nước từng ngụm, ưu tiên món thanh, hạn chế đồ chiên.', ['ep-thanh-tan-duong','ds-sup-le']],
  ['Đầu thu, trời bắt đầu hanh; ngủ sớm dậy sớm, thêm món nhuận.', ['ds-sup-le','tra-duong-nhan']],
  ['Hết nóng, sáng tối mát dần; giữ ấm bụng khi đêm xuống.', ['tra-duong-nhan','ds-tau-hu']],
  ['Sương trắng xuất hiện, trời khô; uống đủ nước ấm, dưỡng ẩm cho da.', ['ds-sup-le','tra-duong-nhan']],
  ['Ngày đêm cân bằng; ăn uống điều hoà, thêm món nhuận như lê, nấm tuyết.', ['ds-sup-le','ds-tau-hu']],
  ['Sương lạnh, sáng sớm se lạnh; giữ ấm cổ và bàn chân, ưu tiên đồ uống ấm.', ['ds-sup-le','tra-pho-nhi']],
  ['Sương giáng, cuối thu; ngủ đủ giấc, ăn món ấm mềm, hạn chế đồ sống lạnh.', ['tra-pho-nhi','ds-canh-dai-bo']],
  ['Bắt đầu mùa đông; ngủ sớm dậy muộn hơn chút, giữ ấm cơ thể, món hầm nóng.', ['ds-canh-dai-bo','tra-pho-nhi']],
  ['Trời lạnh dần, khô; thêm món ấm, uống nước ấm thay nước đá.', ['tra-pho-nhi','ds-linh-chi']],
  ['Lạnh rõ; giữ ấm đầu, cổ, bàn chân; vận động nhẹ buổi sáng có nắng.', ['ds-canh-dai-bo','ds-nep-cam']],
  ['Đêm dài nhất năm; nghỉ ngơi nhiều hơn, món hầm ấm, giữ tinh thần an nhiên.', ['ds-canh-dai-bo','ds-linh-chi']],
  ['Lạnh sâu; ăn đủ bữa, ưu tiên món nóng, tránh ra gió lạnh khi vừa ra mồ hôi.', ['tra-pho-nhi','ds-canh-dai-bo']],
  ['Lạnh nhất năm; giữ ấm toàn thân, uống trà nóng sau bữa ăn.', ['tra-pho-nhi','ds-nep-cam']],
  ['Bắt đầu mùa xuân; vận động nhẹ ngoài trời, ăn rau mầm, giữ tinh thần vui vẻ.', ['tra-ngoc-thanh','ep-hong-tan-sinh']],
  ['Mưa phùn, ẩm; giữ ấm khi giao mùa, ăn thanh nhẹ.', ['tra-luc-bao','ep-hong-tan-sinh']],
  ['Vạn vật thức giấc; ra ngoài trời nhiều hơn, ăn rau xanh, ngủ đủ giấc.', ['tra-ngoc-thanh','tra-luc-bao']]
];

/** Tiết khí đang hiệu lực của một ngày VN. `gio` = chuỗi giờ VN "YYYY-MM-DD…" (không dùng đồng hồ múi giờ của máy); không đọc được → null. */
export function tietKhiNgay(gio) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(gio || ''));
  return m ? LUNAR.term(LUNAR.jdFromDate(+m[3], +m[2], +m[1])) : null;
}
