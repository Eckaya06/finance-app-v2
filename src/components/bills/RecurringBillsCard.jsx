// src/components/bills/RecurringBillsCard.jsx
// RecurringBillsCard.js

import './RecurringBillsCard.css';
import { recurringBills } from '../../data/mockBills';

const RecurringBillsCard = () => {
  return (
    <div className="card-container">
      <div className="card-header">
        <h2>Recurring Bills</h2>
        {/* Daha iyi bir görünüm için ok işareti eklendi */}
        <a href="#" className="see-details-link">See Details ▸</a>
      </div>
      <div className="bills-list">
        {recurringBills.map(bill => (
          // 👇 DEĞİŞİKLİK BURADA: Faturanın durumuna göre dinamik olarak sınıf ekleniyor
          <div key={bill.id} className={`bill-item bill-item--${bill.status}`}>
            <p className="bill-name">{bill.name}</p>
            <p className="bill-amount">${bill.amount.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecurringBillsCard;