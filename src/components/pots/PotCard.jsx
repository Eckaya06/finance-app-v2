// src/components/pots/PotCard.jsx
import './PotCard.css';
import { FiMoreHorizontal } from 'react-icons/fi';

// 1. Yeni propları ekle: onOptionsToggle, isOptionsMenuOpen
const PotCard = ({ pot, onAddMoneyClick, onWithdrawClick, potActionError, onOptionsToggle, isOptionsMenuOpen, onDeleteClick }) => {
  
  if (!pot) { return null; } // Koruma

  const progressPercentage = pot.target > 0 ? (pot.saved / pot.target) * 100 : 0;

  // 2. Edit ve Delete için geçici fonksiyonlar
  const handleEdit = () => {
    console.log("Edit clicked for pot:", pot.id);
    onOptionsToggle(null); // Menüyü kapat
    // TODO: Edit modalını aç
  };


  const showError = potActionError && potActionError.potId === pot.id;

  return (
    <div className={`pot-card theme-${pot.theme}`} data-pot-id={pot.id}>
      <div className="pot-card-header"> {/* Bu div relative olmalı (CSS'te var) */}
        <div className="pot-icon"></div>
        <h3>{pot.name}</h3>
        {/* 3. Üç nokta butonuna onClick ekle */}
        <button 
          className="pot-options-btn" 
          onClick={(e) => {
            e.stopPropagation(); // Olayın dışarıya yayılmasını engelle (önemli!)
            onOptionsToggle(pot.id); 
          }}
        >
          <FiMoreHorizontal />
        </button>
        
        {/* 4. AÇILIR MENÜYÜ EKLE */}
        {isOptionsMenuOpen && (
          <div className="pot-options-menu" onClick={(e) => e.stopPropagation()}> {/* Menü içindeki tıklamaların menüyü kapatmasını engelle */}
            <button onClick={handleEdit}>Edit Pot</button>
            <button 
              onClick={() => onDeleteClick(pot.id)} // <-- Tıklandığında ana sayfadaki fonksiyonu çağır
              className="delete"
            >
              Delete Pot
            </button>
          </div>
        )}
      </div>
      
      <div className="pot-amounts">
        <p className="amount-label">Total Saved</p>
        <p className="amount-saved">${pot.saved.toFixed(2)}</p>
      </div>
      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
      </div>
      <div className="pot-target">
        <span>{progressPercentage.toFixed(0)}%</span>
        <span>Target of ${pot.target.toFixed(0)}</span>
      </div>
      <div className="pot-actions">
        <button 
          className="btn-secondary" 
          onClick={() => onAddMoneyClick(pot.id)}
        >
          + Add Money
        </button>
        <button 
          className="btn-secondary"
          onClick={() => onWithdrawClick(pot.id)} 
        >
          Withdraw
        </button>
      </div>
        
      {showError && (
        <p className="pot-action-error">{potActionError.message}</p>
      )}
    </div>
  );
};
export default PotCard;