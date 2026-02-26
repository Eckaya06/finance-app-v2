import { useState, useRef, useEffect } from 'react';
import './EditBudgetForm.css';

const themeOptions = [
  { value: 'blue',   label: 'Blue',   color: '#3b82f6' },
  { value: 'cyan',   label: 'Cyan',   color: '#06b6d4' },
  { value: 'green',  label: 'Green',  color: '#22c55e' },
  { value: 'orange', label: 'Orange', color: '#f97316' },
  { value: 'indigo', label: 'Indigo', color: '#6366f1' },
  { value: 'red',    label: 'Red',    color: '#ef4444' },
  { value: 'purple', label: 'Purple', color: '#8b5cf6' },
];

const categoryOptions = [
  "Entertainment", "Bills", "Groceries", "Dining Out", "Transportation", 
  "Personal Care", "Education", "Lifestyle", "Shopping", "General"
];

const EditBudgetForm = ({ budget, onUpdateBudget, onClose }) => {
  const [category, setCategory] = useState(budget?.category || '');
  const [limit, setLimit] = useState(budget?.limit || budget?.maxSpend || '');
  const [theme, setTheme] = useState(budget?.theme || null);

  // Dropdown'ların açık/kapalı durumları
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);

  // Form gönderimi
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!category || !limit || parseFloat(limit) <= 0 || !theme) {
      alert("Please fill in all fields with valid values.");
      return;
    }
    
    onUpdateBudget(budget.id, { 
      category, 
      limit: parseFloat(limit), 
      theme 
    });
  };

  const selectedThemeObject = themeOptions.find(opt => opt.value === theme);

  return (
    <form onSubmit={handleSubmit} className="edit-budget-form">
      <h2>Edit Budget</h2>
      <p>Update the category, maximum spend, or theme for this budget.</p>
      
      {/* KATEGORİ SEÇİMİ (AÇILIR MENÜ) */}
      <div className="form-group">
        <label>Budget Category</label>
        <div className="custom-select-container">
          <button 
            type="button" 
            className="select-selected-value" 
            onClick={() => {
              setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
              setIsThemeDropdownOpen(false); // Diğerini kapat
            }}
          >
            {category ? (
              <span className="selected-label-text">{category}</span>
            ) : (
              <span className="select-placeholder">Choose a category</span>
            )}
            <span className={`select-arrow ${isCategoryDropdownOpen ? 'open' : ''}`}>▼</span>
          </button>

          {isCategoryDropdownOpen && (
            <ul className="select-options">
              {categoryOptions.map(option => (
                <li 
                  key={option} 
                  className="select-option"
                  onClick={() => {
                    setCategory(option);
                    setIsCategoryDropdownOpen(false);
                  }}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      {/* LİMİT SEÇİMİ */}
      <div className="form-group">
        <label>Maximum Spend</label>
        <input 
          type="number" 
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          placeholder="e.g., 2000"
          className="form-input"
        />
      </div>

      {/* TEMA SEÇİMİ (AÇILIR MENÜ - AddPotForm Mantığı) */}
      <div className="form-group">
        <label>Theme</label>
        <div className="custom-select-container">
          <button 
            type="button" 
            className="select-selected-value" 
            onClick={() => {
              setIsThemeDropdownOpen(!isThemeDropdownOpen);
              setIsCategoryDropdownOpen(false); // Diğerini kapat
            }}
          >
            {selectedThemeObject ? (
              <div className="theme-option-display">
                <span 
                  className="theme-color-swatch" 
                  style={{ backgroundColor: selectedThemeObject.color }}
                ></span>
                <span className="selected-label-text">{selectedThemeObject.label}</span>
              </div>
            ) : (
              <span className="select-placeholder">Choose a theme</span>
            )}
            <span className={`select-arrow ${isThemeDropdownOpen ? 'open' : ''}`}>▼</span>
          </button>

          {isThemeDropdownOpen && (
            <ul className="select-options">
              {themeOptions.map(option => (
                <li 
                  key={option.value} 
                  className="select-option"
                  onClick={() => {
                    setTheme(option.value);
                    setIsThemeDropdownOpen(false);
                  }}
                >
                  <div className="theme-option-display">
                    <span 
                      className="theme-color-swatch" 
                      style={{ backgroundColor: option.color }}
                    ></span>
                    {option.label}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      <button type="submit" className="form-submit-btn">
        Save Changes
      </button>
    </form>
  );
};

export default EditBudgetForm;