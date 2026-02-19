// src/pages/transactions/TransactionsPage.jsx

import { useState, useMemo, useEffect } from 'react';
import { useTransactions } from '../../context/TransactionContext.jsx';
import CustomDropdown from '../../components/dropdown/CustomDropdown.jsx';
import SearchInput from '../../components/search/SearchInput.jsx';
import Pagination from '../../components/pagination/Pagination.jsx';
import { getCategoryTheme } from '../../utils/categoryIcons.jsx';
import './TransactionsPage.css';

const categoryOptions = [
  "All", "Entertainment", "Bills", "Groceries", "Dining Out", "Transportation", 
  "Personal Care", "Education", "Lifestyle", "Shopping", "General", "Income"
];

const sortOptions = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'highest', label: 'Highest' },
  { value: 'lowest', label: 'Lowest' },
  { value: 'a-z', label: 'A to Z' },
  { value: 'z-a', label: 'Z to A' },
];

const TransactionsPage = () => {
  const { transactions } = useTransactions();
  const [sortType, setSortType] = useState('latest');
  const [filterCategory, setFilterCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleDropdownToggle = (dropdownName) => {
    setOpenDropdown(prev => (prev === dropdownName ? null : dropdownName));
  };

  const filteredAndSortedTransactions = useMemo(() => {
    // 1. Orijinal diziyi kopyala
    let result = [...transactions];

    // 2. Arama Filtresi
    if (searchTerm) {
      result = result.filter(tx => tx.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    
    // 3. Kategori Filtresi
    if (filterCategory !== 'All') {
      result = result.filter(tx => tx.category === filterCategory);
    }

    // 4. Sıralama (Sorting) - GÜNCELLENDİ
    switch (sortType) {
      case 'latest': 
        result.sort((a, b) => {
          const dateDiff = new Date(b.date) - new Date(a.date);
          // Eğer tarihler farklıysa tarihe göre sırala
          if (dateDiff !== 0) return dateDiff;
          // Tarihler aynıysa ID'ye (oluşturulma zamanına) göre sırala (Yeni olan üstte)
          return b.id - a.id;
        }); 
        break;

      case 'oldest': 
        result.sort((a, b) => {
          const dateDiff = new Date(a.date) - new Date(b.date);
          // Eğer tarihler farklıysa tarihe göre sırala
          if (dateDiff !== 0) return dateDiff;
          // Tarihler aynıysa ID'ye göre sırala (Eski olan üstte)
          return a.id - b.id;
        }); 
        break;

      case 'highest': 
        result.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount)); 
        break;

      case 'lowest': 
        result.sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount)); 
        break;

      case 'a-z': 
        result.sort((a, b) => a.name.localeCompare(b.name)); 
        break;

      case 'z-a': 
        result.sort((a, b) => b.name.localeCompare(a.name)); 
        break;

      default: break;
    }
    return result;
  }, [transactions, sortType, filterCategory, searchTerm]);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [filterCategory, sortType, searchTerm]);

  const totalPages = Math.ceil(filteredAndSortedTransactions.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAndSortedTransactions.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="page-container">
      <h1 className="page-title">Transactions</h1>
      <div className="filters-bar">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by Recipient / Sender..."
        />
        <div className="dropdowns">
          <CustomDropdown 
            options={sortOptions.map(opt => opt.value)}
            selectedValue={sortType}
            onChange={setSortType}
            labelPrefix="Sort by"
            displayTransformer={(value) => sortOptions.find(opt => opt.value === value)?.label || value}
            isOpen={openDropdown === 'sort'}
            onToggle={() => handleDropdownToggle('sort')}
          />
          <CustomDropdown 
            options={categoryOptions}
            selectedValue={filterCategory}
            onChange={setFilterCategory}
            labelPrefix="Category"
            isOpen={openDropdown === 'category'}
            onToggle={() => handleDropdownToggle('category')}
          />
        </div>
      </div>
      
      <div className="transaction-table">
        <div className="table-header">
          <p>Recipient / Sender</p>
          <p>Category</p>
          <p>Transaction Date</p>
          <p>Amount</p>
        </div>
        <div className="table-body">
          {currentItems.length === 0 ? (
             <div className="no-data-message">No transactions found.</div>
          ) : (
            currentItems.map((tx) => {
              const theme = getCategoryTheme(tx.category);

              const formattedAmount = tx.type === 'income' 
                ? `+$${parseFloat(tx.amount).toFixed(2)}` 
                : `-$${parseFloat(tx.amount).toFixed(2)}`;
              
              const amountClassName = `transaction-amount ${tx.type}`;
              
              return (
                <div key={tx.id} className="table-row">
                  <div className="recipient-cell">
                    <div 
                      className="tx-avatar"
                      style={{ backgroundColor: theme.bg }}
                    >
                      <img 
                        src={theme.image} 
                        alt={tx.category} 
                        className="category-img-icon"
                      />
                    </div>
                    <span className="tx-name">{tx.name}</span>
                  </div>
                  <p className="category-cell">{tx.category}</p>
                  <p className="date-cell">{tx.date}</p>
                  <p className={amountClassName}>{formattedAmount}</p>
                </div>
              );
            })
          )}
        </div>
        
        {currentItems.length > 0 && (
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default TransactionsPage;