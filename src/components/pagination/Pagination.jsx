// src/components/pagination/Pagination.jsx
import './Pagination.css';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Sayfa numaralarını içeren bir dizi oluşturalım. Örn: [1, 2, 3]
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination-container">
      <button 
        className="pagination-button"
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1}
      >
        <FiChevronLeft /> Prev
      </button>

      <div className="page-numbers">
        {pageNumbers.map(number => (
          <button 
            key={number} 
            onClick={() => onPageChange(number)}
            // O anki sayfa ise 'active' class'ı ekle
            className={`pagination-button page-number ${currentPage === number ? 'active' : ''}`}
          >
            {number}
          </button>
        ))}
      </div>

      <button 
        className="pagination-button"
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages}
      >
        Next <FiChevronRight />
      </button>
    </div>
  );
};

export default Pagination;