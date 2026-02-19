// src/components/transactions/TransactionsList.jsx

import './Transactions.css';
import { transactions as allTransactions } from '../../data/mockTransactions.js';
import TransactionItem from './TransactionItem.jsx';
import { Link } from 'react-router-dom'; // Sayfa geçişi için Link'i import ediyoruz

// Bileşenin dışarıdan 'limit' ve 'showViewAll' proplarını almasını sağlıyoruz
const TransactionsList = ({ limit, showViewAll = false }) => {
  
  // Eğer bir limit prop'u gönderildiyse, veri dizisini o limite göre kısaltıyoruz.
  // Gönderilmediyse, tüm listeyi kullanıyoruz.
  const transactionsToDisplay = limit ? allTransactions.slice(0, limit) : allTransactions;

  return (
    <div className="transactions-container">
      <div className="transactions-header">
        <h2>Transactions</h2>
        {/* Eğer showViewAll prop'u true ise, "View All" linkini gösteriyoruz */}
        {showViewAll && (
          <Link to="/transactions" className="view-all-link">
            View All ▸
          </Link>
        )}
      </div>
      <ul className="transactions-list">
        {/* Artık tüm liste yerine, kısaltılmış olan 'transactionsToDisplay' listesini map'liyoruz */}
        {transactionsToDisplay.map((tx) => (
          <TransactionItem key={tx.id} transaction={tx} />
        ))}
      </ul>
    </div>
  );
};

export default TransactionsList;