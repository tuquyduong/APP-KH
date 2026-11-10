/** Hỏi lại MỘT lần ngay tại chỗ khi xoá một việc (hoặc một người thân — `loai`; KH-UI-5d C1, KH-UI-5e B2; không dùng hộp thoại của trình duyệt, không Hoàn tác). `lap` = việc lặp. */
export default function HoiXoa({ tieu, lap, xoa, huy, loai = 'việc' }) {
  return (
    <div className="hoi-xoa" role="alertdialog" aria-label="Xác nhận xoá">
      <div>{lap ? `Xoá việc lặp «${tieu}»? Mọi lần lặp sẽ mất.` : `Xoá ${loai} «${tieu}»?`}</div>
      <div className="bn-cuoi"><button type="button" className="bn-phu" onClick={huy}>Huỷ</button><button type="button" className="bn-phu bn-xoa" onClick={xoa}>Xoá</button></div>
    </div>
  );
}
