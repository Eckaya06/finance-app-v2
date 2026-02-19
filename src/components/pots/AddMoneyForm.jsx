// src/components/pots/AddMoneyForm.jsx
import { useState, useEffect } from 'react';

// Bu bileşen, hangi pot'a para ekleneceğini (pot),
// ekleme işlemini onaylama (onConfirm) ve modalı kapatma (onClose) fonksiyonlarını dışarıdan alır.
const AddMoneyForm = ({ pot, onConfirm, onClose }) => {
  const [amountToAdd, setAmountToAdd] = useState('');
  const [newAmount, setNewAmount] = useState(pot.saved);
  const [newProgress, setNewProgress] = useState(0);

  // Eklenecek miktar değiştikçe yeni toplamı ve ilerlemeyi hesapla
  useEffect(() => {
    const addedValue = parseFloat(amountToAdd) || 0;
    const potentialNewAmount = pot.saved + addedValue;
    setNewAmount(potentialNewAmount);
    setNewProgress(pot.target > 0 ? (potentialNewAmount / pot.target) * 100 : 0);
  }, [amountToAdd, pot.saved, pot.target]);


  const handleSubmit = (event) => {
    event.preventDefault();
    const addedValue = parseFloat(amountToAdd);
    if (isNaN(addedValue) || addedValue <= 0) {
      alert("Please enter a valid amount to add.");
      return;
    }
    // Ana bileşendeki güncelleme fonksiyonunu çağır
    onConfirm(pot.id, addedValue);
    onClose(); // Modalı kapat
  };

  return (
    <form onSubmit={handleSubmit} className="add-money-form">
      {/* Dinamik başlık */}
      <h2>Add to '{pot.name}'</h2>
      <p>Add money to your pot to keep it separate from your main balance.</p>

      {/* Resimdeki gibi yeni durumu gösteren önizleme */}
      <div className="preview-section">
        <p className="preview-label">New Amount</p>
        <p className="preview-amount">${newAmount.toFixed(2)}</p>
        <div className="progress-bar preview-progress">
          <div 
            className={`progress-bar-fill theme-${pot.theme}`} 
            style={{ width: `${Math.min(newProgress, 100)}%` }} // %100'ü geçmesin
          ></div>
        </div>
        <div className="preview-target">
          <span>{Math.min(newProgress, 100).toFixed(0)}%</span>
          <span>Target of ${pot.target.toFixed(0)}</span>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="amount-to-add">Amount to Add</label>
        <input 
          id="amount-to-add"
          type="number"
          value={amountToAdd}
          onChange={(e) => setAmountToAdd(e.target.value)}
          placeholder="$ 400"
          step="0.01" // Kuruş girişi için
        />
      </div>
      <button type="submit" className="btn-primary form-submit-btn">Confirm Addition</button>
    </form>
  );
};

export default AddMoneyForm;