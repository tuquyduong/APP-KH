import { createRoot } from 'react-dom/client'
import './giaoDien/demo.css'
import './giaoDien/demo_tracnghiem.css'
import './giaoDien/demo_gv.css'
import './giaoDien/demo_mua.css'
import './giaoDien/giaoDien.css'
import './giaoDien/khau_hieu.css'
import App from './App.jsx'
import KiemKhop from './pages/KiemKhop.jsx'

// /kiemkhop (KH-KHOP-1) là trang riêng, dựng riêng, không mount vỏ App: vỏ (khi mount) tự gọi /hang, /gio-vang, /menu… và hỏi lại mỗi phút, trái "mỗi cửa một lần".
const laKiemKhop = window.location.pathname.toLowerCase().replace(/\/+$/, '') === '/kiemkhop'
createRoot(document.getElementById('root')).render(laKiemKhop ? <KiemKhop /> : <App />)
