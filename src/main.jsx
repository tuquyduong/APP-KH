import { createRoot } from 'react-dom/client'
import './giaoDien/demo.css'
import './giaoDien/demo_tracnghiem.css'
import './giaoDien/demo_gv.css'
import './giaoDien/demo_mua.css'
import './giaoDien/giaoDien.css'
import './giaoDien/khau_hieu.css'
import './giaoDien/che_do_sua.css'
import './giaoDien/cho.css'
import App from './App.jsx'
import QuanTri from './pages/QuanTri.jsx'
import { dangKySW } from './dangKySW.js'
import { docDuongDan } from './duongDan.js'
import { batDauNoiDung } from './noiDung/khoNoiDung.js'

// Bản nội dung trên máy nạp ĐỒNG BỘ trước lần vẽ đầu (không chớp chữ mặc định) + chặn ghi nếu đang Chế độ sửa (KH-ADMIN-1 B2, D7).
batDauNoiDung()
// /admin* (KH-ADMIN-1) dựng riêng, không mount vỏ App khách: vỏ (khi mount) tự gọi /hang, /gio-vang, /menu… và có thanh tab.
const duong = docDuongDan(window.location.pathname + window.location.search)
createRoot(document.getElementById('root')).render(duong.quanTri ? <QuanTri duong={duong} /> : <App />)
dangKySW()
