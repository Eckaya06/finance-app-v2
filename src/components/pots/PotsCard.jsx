// src/components/pots/PotsCard.jsx
import './PotsCard.css';
import { pots } from '../../data/mockPots';
import { FiDollarSign } from 'react-icons/fi'; // Örnek bir ikon

const PotsCard = () => {
  // Toplam birikim miktarını 'reduce' metodu ile dinamik olarak hesaplayalım
  const totalSaved = pots.reduce((sum, pot) => sum + pot.amount, 0);

  return (
    <div className="card-container">
      <div className="card-header">
        <h2>Pots</h2>
        <a href="#" className="see-details-link">See Details ▸</a>
      </div>
      <div className="pots-content">
        <div className="total-saved-section">
          <div className="total-saved-icon">
            <FiDollarSign size={24} />
          </div>
          <p className="total-saved-label">Total Saved</p>
          <p className="total-saved-amount">${totalSaved}</p>
        </div>
        <div className="pots-list">
          {pots.map(pot => (
            <div key={pot.id} className="pot-item">
              <div
                className="pot-indicator"
                style={{ backgroundColor: pot.color }} 
              > </div>
              <div className="pot-details">
                <p className="pot-name">{pot.name}</p>
                <p className="pot-amount">${pot.amount}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PotsCard;