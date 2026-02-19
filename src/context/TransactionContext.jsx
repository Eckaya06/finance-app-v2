import { createContext, useState, useEffect, useContext } from 'react';

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  // 1. Verileri LocalStorage'dan yükle (yoksa boş dizi)
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });

  // 2. Her değişimde LocalStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Yeni İşlem Ekleme
  const addTransaction = (transaction) => {
    // Yeni eklenen en üste gelsin diye spread operatörünü bu sırada kullanıyoruz
    setTransactions((prev) => [transaction, ...prev]);
  };

  // İşlem Silme
  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <TransactionContext.Provider value={{ transactions, addTransaction, deleteTransaction }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionContext);