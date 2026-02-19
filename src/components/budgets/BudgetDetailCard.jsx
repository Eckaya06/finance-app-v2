import { useState } from 'react'; // 1. useState import et
import { FiMoreHorizontal } from 'react-icons/fi';
import './BudgetDetailCard.css';
import { transactions as allTransactions } from '../../data/mockTransactions.js';
import { Link } from 'react-router-dom';
import BudgetOptionsMenu from './BudgetOptionsMenu.jsx'; // 2. Yeni menüyü import et

// 3. Yeni propları al: onEditRequest, onDeleteRequest
const BudgetDetailCard = ({ budget, onEditRequest, onDeleteRequest }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // 4. Menü state'i

  const relevantTransactions = allTransactions.filter(
    tx => tx.category === budget.category && tx.type === 'expense'
  );
  
  const spent = budget.spent ?? relevantTransactions.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
  const remaining = budget.maxSpend - spent;
  const progressPercentage = budget.maxSpend > 0 ? (spent / budget.maxSpend) * 100 : 0;

  const theme = themeOptions.find(t => t.value === budget.theme) || themeOptions[0];

  return (
    // 5. position: relative ekle
    <div className="budget-detail-card" style={{ position: 'relative' }}>
      <div className="card-header">
        <div className="theme-option-display">
          <span className="theme-color-swatch" style={{ backgroundColor: theme.color }}></span>
          <h3>{budget.category}</h3>
        </div>
        {/* 6. Butonu işlevsel hale getir */}
        <button className="pot-options-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <FiMoreHorizontal />
        </button>
      </div>

      {/* 7. Menüyü koşullu olarak render et */}
      {isMenuOpen && (
        <BudgetOptionsMenu 
          onEdit={() => {
            onEditRequest();
            setIsMenuOpen(false);
          }}
          onDelete={() => {
            onDeleteRequest();
            setIsMenuOpen(false);
          }}
        />
      )}

      {/* ... (kartın geri kalanı aynı) ... */}
      <p className="budget-limit-text">Maximum of ${budget.maxSpend.toFixed(2)}</p>
      <div className="progress-bar-container">
        <div 
          className="progress-bar-fill" 
          style={{ 
            width: `${progressPercentage > 100 ? 100 : progressPercentage}%`,
            backgroundColor: theme.color 
          }}
        ></div>
      </div>
      <div className="budget-spend-summary">
        <div className="summary-item">
          <span className="summary-label">Spent</span>
          <span className="summary-value">${spent.toFixed(2)}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Remaining</span>
          <span className={`summary-value ${remaining < 0 ? 'negative' : ''}`}>
            ${remaining.toFixed(2)}
          </span>
        </div>
      </div>
      <div className="latest-spending">
        <div className="latest-spending-header">
          <h4>Latest Spending</h4>
          <Link to="/transactions" className="see-all-link">See All ▸</Link>
        </div>
        {(() => {
          const latest = Array.isArray(budget?.latestSpending) ? budget.latestSpending : [];
          return latest.length === 0 ? (
            <div className="latest-empty">No spending yet.</div>
          ) : (
            latest.map((tx) => (
              <div className="latest-row" key={tx.id}>
                <div className="latest-left">
                  <div className="latest-name">{tx.name}</div>
                  <div className="latest-date">{tx.date}</div>
                </div>
                <div className="latest-amount">{tx.amount}</div>
              </div>
            ))
          );
        })()}
      </div>
    </div>
  );
};

// Pots formundan tema listesini kopyalıyoruz
const themeOptions = [
  { value: 'blue',   label: 'Blue',   color: '#3b82f6' },
  { value: 'cyan',   label: 'Cyan',   color: '#06b6d4' },
  { value: 'green',  label: 'Green',  color: '#22c55e' },
  { value: 'orange', label: 'Orange', color: '#f97316' },
  { value: 'indigo', label: 'Indigo', color: '#6366f1' },
  { value: 'red',    label: 'Red',    color: '#ef4444' },
  { value: 'purple', label: 'Purple', color: '#8b5cf6' },
];

export default BudgetDetailCard;
