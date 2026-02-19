import { Outlet, useLocation } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import Sidebar from '../components/sidebar/Sidebar.jsx';
import './DashboardLayout.css';

const DashboardLayout = () => {
  // 2. Main content div'ine takmak için bir ref oluştur
  const mainContentRef = useRef(null);
  const { pathname } = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prevState => !prevState);
  };

  // 3. ScrollToTop bileşenindeki mantığı buraya taşıdık
  useEffect(() => {
    // Eğer ref'imiz bağlıysa (yani element ekrandaysa)
    // ve kaydırılabiliyorsa, onu en üste kaydır.
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo(0, 0);
    }
  }, [pathname]); // Sadece URL değiştiğinde çalış

  const layoutClassName = `dashboard-layout ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`;

return (
    // 5. Dinamik class'ı ana div'e ekle
    <div className={layoutClassName}>
      {/* 6. State'i ve toggle fonksiyonunu Sidebar'a prop olarak geçir */}
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
      <main className="main-content" ref={mainContentRef}>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;