// src/components/budgets/AddBudgetForm.jsx
import { useState } from 'react';

// 1. Pots formundaki tema seçeneklerinin aynısını buraya kopyalıyoruz
const themeOptions = [
  { value: 'blue',   label: 'Blue',   color: '#3b82f6' },
  { value: 'cyan',   label: 'Cyan',   color: '#06b6d4' },
  { value: 'green',  label: 'Green',  color: '#22c55e' },
  { value: 'orange', label: 'Orange', color: '#f97316' },
  { value: 'indigo', label: 'Indigo', color: '#6366f1' },
  { value: 'red',    label: 'Red',    color: '#ef4444' },
  { value: 'purple', label: 'Purple', color: '#8b5cf6' },
];

// 2. Bütçe kategorisi seçeneklerini (Transactions sayfasından) tanımlıyoruz
const categoryOptions = [
  "Entertainment", "Bills", "Groceries", "Dining Out", "Transportation", 
  "Personal Care", "Education", "Lifestyle", "Shopping", "General"
];

const AddBudgetForm = ({ onAddBudget, onClose }) => {
  // 3. Form alanları için state'lerimizi oluşturuyoruz
  const [category, setCategory] = useState(null);
  const [maxSpend, setMaxSpend] = useState('');
  const [theme, setTheme] = useState(null);

  // Dropdown'ların açık/kapalı durumlarını ayrı ayrı yönetiyoruz
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!category || !maxSpend || parseFloat(maxSpend) <= 0 || !theme) {
      alert("Please fill in all fields correctly.");
      return;
    }
    
    onAddBudget({ 
      category, 
      maxSpend: parseFloat(maxSpend), 
      theme 
    });
    
    onClose(); // Modalı kapat
  };

  // Tema seçildiğinde çalışan fonksiyon (Pots'tan kopyalandı)
  const handleThemeSelect = (selectedTheme) => {
    setTheme(selectedTheme);
    setIsThemeOpen(false);
  };
  const selectedThemeObject = themeOptions.find(opt => opt.value === theme);

  // Kategori seçildiğinde çalışan fonksiyon
  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory);
    setIsCategoryOpen(false);
  };

  return (
    // 'add-pot-form' class'ını yeniden kullanıyoruz, çünkü stiller aynı
    <form onSubmit={handleSubmit} className="add-pot-form">
      <h2>Add New Budget</h2>
      <p>Choose a category to set a spending budget. These categories can help you monitor spending.</p>
      
      {/* 1. Budget Category Dropdown */}
      <div className="form-group">
        <label>Budget Category</label>
        <div className="custom-select-container">
          <button 
            type="button" 
            className="select-selected-value" 
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          >
            <span className={!category ? 'select-placeholder' : ''}>
              {category || 'Choose a category'}
            </span>
            <span className={`select-arrow ${isCategoryOpen ? 'open' : ''}`}>▼</span>
          </button>
          {isCategoryOpen && (
            <ul className="select-options">
              <li className="select-option" onClick={() => handleCategorySelect(null)}>
                Choose a category
              </li>
              {categoryOptions.map(option => (
                <li key={option} className="select-option" onClick={() => handleCategorySelect(option)}>
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      {/* 2. Maximum Spend Input (Dolar işaretli) */}
      <div className="form-group">
        <label htmlFor="max-spend">Maximum Spend</label>
        <div className="input-with-prefix">
          <span>$</span>
          <input 
            id="max-spend"
            type="number"
            value={maxSpend}
            onChange={(e) => setMaxSpend(e.target.value)}
            placeholder="0.00"
          />
        </div>
      </div>

      {/* 3. Theme Dropdown (Pots'tan kopyalandı) */}
      <div className="form-group">
        <label>Theme</label>
        <div className="custom-select-container">
          <button 
            type="button" 
            className="select-selected-value" 
            onClick={() => setIsThemeOpen(!isThemeOpen)}
          >
            {selectedThemeObject ? (
              <div className="theme-option-display">
                <span className="theme-color-swatch" style={{ backgroundColor: selectedThemeObject.color }}></span>
                <span className="selected-label-text">{selectedThemeObject.label}</span>
              </div>
            ) : (
              <span className="select-placeholder">Choose a theme</span>
            )}
            <span className={`select-arrow ${isThemeOpen ? 'open' : ''}`}>▼</span>
          </button>
          {isThemeOpen && (
            <ul className="select-options">
              <li className="select-option" onClick={() => handleThemeSelect(null)}>
                Choose a theme
              </li>
              {themeOptions.map(option => (
                <li key={option.value} className="select-option" onClick={() => handleThemeSelect(option.value)}>
                  <div className="theme-option-display">
                    <span className="theme-color-swatch" style={{ backgroundColor: option.color }}></span>
                    {option.label}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      <button type="submit" className="btn-primary form-submit-btn">Add Budget</button>
    </form>
  );
};

export default AddBudgetForm;