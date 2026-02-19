// src/components/search/SearchInput.jsx
import './SearchInput.css';
import { FiSearch, FiX } from 'react-icons/fi'; // FiX ikonunu import ettik

const SearchInput = ({ value, onChange, placeholder }) => {

  const iconClassName = `search-icon ${value ? 'hidden' : ''}`;

  return (
    <div className="search-input-container">
      {/* Sol taraftaki Arama İkonu (Yazı yazınca gizleniyor, senin yapın) */}
      <FiSearch className={iconClassName} />
      
      <input
        type="text"
        className="search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Search...'}
      />

      {/* YENİ KISIM: Eğer yazı varsa (value varsa) X butonu göster */}
      {value && (
        <button 
          className="search-clear-btn"
          onClick={() => onChange('')} // Tıklayınca içeriği sıfırlar
        >
          <FiX />
        </button>
      )}
    </div>
  );
};

export default SearchInput;