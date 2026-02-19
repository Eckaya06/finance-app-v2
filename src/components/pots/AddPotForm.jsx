// src/components/pots/AddPotForm.jsx
import { useState } from 'react';

const themeOptions = [
  { value: 'blue',   label: 'Blue',   color: '#3b82f6' },
  { value: 'cyan',   label: 'Cyan',   color: '#06b6d4' },
  { value: 'green',  label: 'Green',  color: '#22c55e' },
  { value: 'orange', label: 'Orange', color: '#f97316' },
  { value: 'indigo', label: 'Indigo', color: '#6366f1' },
  { value: 'red',    label: 'Red',    color: '#ef4444' },
  { value: 'purple', label: 'Purple', color: '#8b5cf6' },
];

const AddPotForm = ({ onAddPot, onClose }) => {
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [theme, setTheme] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!theme) {
      alert("Please choose a theme.");
      return;
    }
    if (!name || !target || parseFloat(target) <= 0) {
      alert("Please fill in all fields with valid values.");
      return;
    }
    onAddPot({ name, target: parseFloat(target), theme });
    onClose();
  };
  
  const handleThemeSelect = (selectedTheme) => {
    setTheme(selectedTheme);
    setIsDropdownOpen(false);
  };

  const selectedThemeObject = themeOptions.find(opt => opt.value === theme);

  return (
    <form onSubmit={handleSubmit} className="add-pot-form">
      <h2>Add New Pot</h2>
      <p>Create a pot to help you track savings for special purchases.</p>
      
      <div className="form-group">
        <label htmlFor="pot-name">Pot Name</label>
        <input 
          id="pot-name" type="text" value={name} 
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Rainy Day" 
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="pot-target">Target</label>
        <input 
          id="pot-target" type="number" value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="e.g., 2000"
        />
      </div>

      <div className="form-group">
        <label>Theme</label>
        <div className="custom-select-container">
          <button 
            type="button" 
            className="select-selected-value" 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
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
            <span className={`select-arrow ${isDropdownOpen ? 'open' : ''}`}>▼</span>
          </button>

          {isDropdownOpen && (
            <ul className="select-options">
              <li 
                className="select-option" // 'disabled' class'ını kaldırdık
                // DEĞİŞİKLİK: Tıklandığında temayı 'null' olarak ayarla
                onClick={() => handleThemeSelect(null)}
              >
                Choose a theme
              </li>
              
              {themeOptions.map(option => (
                <li 
                  key={option.value} 
                  className="select-option"
                  onClick={() => handleThemeSelect(option.value)}
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
      
      <button type="submit" className="btn-primary form-submit-btn">Add Pot</button>
    </form>
  );
};

export default AddPotForm;