import { NavLink } from 'react-router-dom';
import './Sidebar.css';

// react-icons kütüphanesinden ikonları import edelim (Feather Icons setini kullandım)
import { FiHome, FiRepeat, FiPieChart, FiBox, FiClipboard, FiChevronsLeft, FiChevronsRight,FiPlusCircle, FiSettings, FiBarChart2 } from 'react-icons/fi'; // <-- EKSİK İKONLARI EKLEDİK

// Menü elemanlarını bir dizi olarak tanımlamak, kodu daha temiz ve yönetilebilir yapar.
const menuItems = [
  { name: 'Overview', path: '/home', icon: <FiHome size={20} /> },
  { name: 'Income & Expense', icon: <FiPlusCircle size={20} />, path: '/income-expense' },
  { name: 'Transactions', path: '/transactions', icon: <FiRepeat size={20} /> },
  { name: 'Budgets', path: '/budgets', icon: <FiPieChart size={20} /> },

  // ✅ NEW
  { name: 'Analytics', path: '/analytics', icon: <FiBarChart2 size={20} /> },

  { name: 'Pots', path: '/pots', icon: <FiBox size={20} /> },
  { name: 'Recurring Bills', path: '/bills', icon: <FiClipboard size={20} /> },
  { name: 'Settings', path: '/settings', icon: <FiSettings size={20} /> },
];

const Sidebar = ({ isCollapsed, onToggle }) => {

  // 2. Duruma göre ana class'ı belirle
  const sidebarClassName = `sidebar ${isCollapsed ? 'collapsed' : ''}`;

  return (
    <aside className={sidebarClassName}>
      <div className="sidebar-logo">
        {/* İsteğe bağlı: Küçülünce logoyu da farklı gösterebiliriz */}
        <h2 className="logo-text">{isCollapsed ? 'f' : 'finance'}</h2>
      </div>
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => (
            <li key={item.name} className="nav-item">
              <NavLink to={item.path} title={item.name}> {/* title ekledik */}
                <span className="nav-icon">{item.icon}</span>
                {/* 3. Sadece menü açıkken metni göster */}
                {!isCollapsed && <span className="nav-text">{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="sidebar-footer">
        {/* 4. Butonun onClick'ine onToggle'ı bağla ve ikonu/metni değiştir */}
        <button className="minimize-btn" onClick={onToggle} title={isCollapsed ? "Expand Menu" : "Minimize Menu"}>
          {isCollapsed ? <FiChevronsRight size={20} /> : <FiChevronsLeft size={20} />}
          {!isCollapsed && <span>Minimize Menu</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;