import { useState, useEffect } from 'react';

export default function Navbar() {
  // สร้าง State เพื่อจัดการสถานะธีม
  // อ่านค่าเริ่มต้นจาก localStorage หรือใช้ 'light' เป็นค่าเริ่มต้น
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 'light'
  );

  // ใช้ useEffect เพื่ออัปเดต data-theme บนแท็ก <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // สร้างฟังก์ชันสำหรับสลับธีม
  const handleThemeToggle = (e) => {
    setTheme(e.target.checked ? 'dark' : 'light');
  };

  return (
    
    <div className="navbar shadow-lg px-4 sm:px-6 lg:px-8 bg-base-200 text-base-content">
      <div className="navbar-start">
        <div className="dropdown dropdown-start">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 text-base-content rounded-box z-[1] mt-3 w-52 p-2 shadow-xl">
            <li><a href="/health_services" className="font-semibold hover:bg-base-200">การใช้บริการสาธารณสุข</a></li>
            <li>
              <a href="/service_plan" className="font-semibold hover:bg-base-200">ข้อมูลตอบสนอง Service plan</a>
            </li>
          </ul>
        </div>
        <a href="/" className="btn btn-accent text-xl font-bold transition-transform duration-300 transform hover:scale-105">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        HDP</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><a href="/health_services" className="text-lg font-medium hover:text-green-300 transition-colors duration-200">การใช้บริการสาธารณสุข</a></li>
          <li><a href="/service_plan" className="text-lg font-medium hover:text-green-300 transition-colors duration-200">ข้อมูลตอบสนอง Service plan</a></li>
        </ul>
      </div>
      <div className="navbar-end">
        <a className="btn bg-base-100 text-base-content mr-1 hover:bg-base-200 transition-colors duration-200">เข้าสู่ระบบ</a>
        {/* เชื่อมต่อ input กับ state ของธีม */}
        <label className="toggle text-base-content">
          <input
            type="checkbox"
            checked={theme === 'dark'}
            onChange={handleThemeToggle}
            value="synthwave"
            className="theme-controller"
          />
          <svg aria-label="sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></g></svg>
          <svg aria-label="moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></g></svg>
        </label>
      </div>
    </div>
  )
}