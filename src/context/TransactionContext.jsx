import { createContext, useState, useEffect, useContext } from 'react';
import { useChat } from './ChatContext'; 

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const { addMessage, isOpen } = useChat();

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem('budgets');
    return saved ? JSON.parse(saved) : []; 
  });

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  const addTransaction = (transaction) => {
    setTransactions((prev) => [transaction, ...prev]);

    if (transaction.type === 'expense') {
      const category = transaction.category;
      const amount = Number(transaction.amount);
      const budget = budgets.find(b => b.category === category);

      // ✅ DÜZELTME: Sadece bütçe oluşturulduktan sonraki harcamaları hesaba katıyoruz
      if (budget) {
        const limitNum = Number(budget.limit || budget.maxSpend || 0);
        
        const relevantTotal = transactions
          .filter(t => 
            t.category === category && 
            t.type === 'expense' &&
            t.id >= (budget.createdAt || 0) // Bütçe tarihinden önceki harcamaları ele
          )
          .reduce((acc, curr) => acc + Number(curr.amount), 0) + amount;

        if (limitNum > 0) {
          const percentageUsed = (relevantTotal / limitNum) * 100;

          // ✅ KRİTİK EŞİK: %75 ve üzeri (yani %25 ve altı bakiye)
          if (percentageUsed >= 75) {
            // toFixed(1) kullanarak karttaki hassasiyeti yakalıyoruz
            addMessage('bot', `⚠️ Budget Alert: You've used ${percentageUsed.toFixed(1)}% of your ${category} budget!`);
          }
        }
      }
    }
  };

  return (
    <TransactionContext.Provider value={{ transactions, addTransaction, budgets, setBudgets }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionContext);