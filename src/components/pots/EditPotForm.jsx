import { useState } from 'react';
import './EditPotForm.css';

const themeOptions = [
  { value: 'blue',   label: 'Blue',   color: '#3b82f6' },
  { value: 'cyan',   label: 'Cyan',   color: '#06b6d4' },
  { value: 'green',  label: 'Green',  color: '#22c55e' },
  { value: 'orange', label: 'Orange', color: '#f97316' },
  { value: 'indigo', label: 'Indigo', color: '#6366f1' },
  { value: 'red',    label: 'Red',    color: '#ef4444' },
  { value: 'purple', label: 'Purple', color: '#8b5cf6' },
];

const EditPotForm = ({ pot, onUpdatePot, onClose }) => {
  // Mevcut pot verileriyle state'leri başlatıyoruz
  const [name, setName] = useState(pot?.name || '');
  const [target, setTarget] = useState(pot?.target || '');
  const [theme, setTheme] = useState(pot?.theme || null);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name || !target || parseFloat(target) <= 0 || !theme) {
      alert("Please fill in all fields with valid values.");
      return;
    }
    
    onUpdatePot(pot.id, { 
      name, 
      target: parseFloat(target), 
      theme 
    });
  };

  const selectedThemeObject = themeOptions.find(opt => opt.value === theme);

  return (
    <form onSubmit={handleSubmit} className="edit-pot-form">
      <h2>Edit Pot</h2>
      <p>Update the name, target amount, or theme for this pot.</p>
      
      <div className="form-group">
        <label htmlFor="pot-name">Pot Name</label>
        <input 
          id="pot-name"
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Rainy Day"
          className="form-input"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="pot-target">Target</label>
        <input 
          id="pot-target"
          type="number" 
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="e.g., 2000"
          className="form-input"
        />
      </div>

      {/* TEMA SEÇİMİ (ŞIK AÇILIR MENÜ) */}
      <div className="form-group">
        <label>Theme</label>
        <div className="custom-select-container">
          <button 
            type="button" 
            className="select-selected-value" 
            onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
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

export default EditPotForm;