// src/components/pots/PotCard.jsx
import './PotCard.css';
import { FiMoreHorizontal } from 'react-icons/fi';

// ✅ YENİ: onEditClick prop'u eklendi
const PotCard = ({ pot, onAddMoneyClick, onWithdrawClick, potActionError, onOptionsToggle, isOptionsMenuOpen, onDeleteClick, onEditClick }) => {
  
  if (!pot) { return null; } // Koruma

  const progressPercentage = pot.target > 0 ? (pot.saved / pot.target) * 100 : 0;

  // ✅ YENİ: Sadece konsola yazdırmak yerine ana sayfadaki Edit fonksiyonunu çağırıyoruz
  const handleEdit = () => {
    onEditClick(pot.id); 
  };

  const showError = potActionError && potActionError.potId === pot.id;

  return (
    <div className={`pot-card theme-${pot.theme}`} data-pot-id={pot.id}>
      <div className="pot-card-header">
        <div className="pot-icon"></div>
        <h3>{pot.name}</h3>
        
        <button 
          className="pot-options-btn" 
          onClick={(e) => {
            e.stopPropagation(); 
            onOptionsToggle(pot.id); 
          }}
        >
          <FiMoreHorizontal />
        </button>
        
        {/* AÇILIR MENÜ */}
        {isOptionsMenuOpen && (
          <div className="pot-options-menu" onClick={(e) => e.stopPropagation()}>
            {/* ✅ Tıklandığında handleEdit çalışıp Modal'ı açacak */}
            <button onClick={handleEdit}>Edit Pot</button>
            <button 
              onClick={() => onDeleteClick(pot.id)} 
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