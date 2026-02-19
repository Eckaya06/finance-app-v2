// src/components/income-expense/AddTransactionForm.jsx
import { useState, useRef, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const AddTransactionForm = ({ onAdd, onClose }) => {
  const [type, setType] = useState('expense');
  const [formData, setFormData] = useState({
    name: '',
    category: '', // Başlangıçta boş (Placeholder görünür)
    amount: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const expenseCategories = [
    'Entertainment',
    'Bills',
    'Groceries',
    'Dining Out',
    'Transportation',
    'Personal Care',
    'Education',
    'Lifestyle',
    'Shopping',
    'General'
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategorySelect = (category) => {
    // Eğer "Select Category" seçilirse değeri boşalt (Reset)
    if (category === 'Select Category') {
      setFormData({ ...formData, category: '' });
    } else {
      setFormData({ ...formData, category });
    }
    setIsDropdownOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.category && type === 'expense') {
        alert("Please select a category");
        return;
    }

    onAdd({
      ...formData,
      category: type === 'income' ? 'Income' : formData.category,
      type,
      id: Date.now(),
    });
    onClose();
  };

  return (
    <div className="add-transaction-form">
      <h2>Add New Transaction</h2>
      <p>Fill in the details to log your {type === 'expense' ? 'spending' : 'earnings'}.</p>
      
      <div className="ie-type-selector">
        <button 
          className={type === 'expense' ? 'active expense' : ''} 
          type="button"
          onClick={() => { setType('expense'); setFormData({...formData, category: ''}); }}
        >Expense</button>
        <button 
          className={type === 'income' ? 'active income' : ''} 
          type="button"
          onClick={() => { setType('income'); setFormData({...formData, category: 'Income'}); }}
        >Income</button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Category</label>
          
          {type === 'income' ? (
            <div className="read-only-input">Salary / Income</div>
          ) : (
            <div className="custom-dropdown-container" ref={dropdownRef}>
              <button 
                type="button" 
                // Kategori boşsa 'placeholder', doluysa normal stil uygulayacağız (CSS'te tanımlayacağız)
                className={`dropdown-trigger ${isDropdownOpen ? 'open' : ''} ${!formData.category ? 'placeholder-mode' : ''}`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {/* Kategori varsa onu yaz, yoksa 'Select Category' yaz */}
                <span>{formData.category || 'Select Category'}</span>
                <FiChevronDown className="dropdown-arrow" />
              </button>

              {isDropdownOpen && (
                <ul className="dropdown-menu">
                  {/* 1. EN BAŞA 'Select Category' SEÇENEĞİNİ EKLİYORUZ */}
                  <li 
                    className={`dropdown-item ${formData.category === '' ? 'selected' : ''}`}
                    onClick={() => handleCategorySelect('Select Category')}
                  >
                    Select Category
                  </li>

                  {/* Diğer kategoriler */}
                  {expenseCategories.map((cat) => (
                    <li 
                      key={cat} 
                      className={`dropdown-item ${formData.category === cat ? 'selected' : ''}`}
                      onClick={() => handleCategorySelect(cat)}
                    >
                      {cat}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="form-group">
          <label>{type === 'expense' ? 'Paid to' : 'Received from'}</label>
          <input 
            type="text" 
            placeholder={type === 'expense' ? "e.g. Burger King" : "e.g. Company Name"}
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Amount</label>
          <input 
            type="number" 
            step="0.01"
            placeholder="$ 0.00"
            value={formData.amount} 
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Date</label>
          <input 
            type="date"
            value={formData.date} 
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            required
          />
        </div>

        <button type="submit" className={`btn-primary full-width ${type}`}>
          Add {type === 'expense' ? 'Expense' : 'Income'}
        </button>
      </form>
    </div>
  );
};

export default AddTransactionForm;