// src/components/transactions/TransactionItem.jsx
import './Transactions.css';

const TransactionItem = ({ transaction }) => {
  const { name, date, amount, type, avatar } = transaction;

  // Miktarı formatlayalım: income ise başına '+', değilse zaten '-' var.
  const formattedAmount = type === 'income' ? `+$${amount.toFixed(2)}` : `-$${Math.abs(amount).toFixed(2)}`;

  // Miktarın class'ını tipine göre belirleyelim (yeşil veya varsayılan)
  const amountClassName = `transaction-amount ${type}`; // "transaction-amount income" veya "transaction-amount expense"

  return (
    <li className="transaction-item">
      <div className="transaction-details">
        <img src={avatar} alt={name} className="transaction-avatar" />
        <div>
          <p className="transaction-name">{name}</p>
          <p className="transaction-date">{date}</p>
        </div>
      </div>
      <p className={amountClassName}>{formattedAmount}</p>
    </li>
  );
};

export default TransactionItem;