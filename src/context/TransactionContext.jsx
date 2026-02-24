import { createContext, useState, useEffect, useContext } from 'react';
import { db } from '../firebase'; 
import { 
  collection, 
  addDoc, 
  deleteDoc,
  doc,
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { useChat } from './ChatContext';

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const authContext = useAuth();
  const { addMessage } = useChat();
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = authContext ? authContext.user : null;

  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setBudgets([]);
      setLoading(false);
      return;
    }

    // 1. Transactions Dinleyici (Hata ve Index kontrolü ile)
    const qTransactions = query(
      collection(db, "transactions"),
      where("userId", "==", user.uid),
      orderBy("date", "desc")
    );

    const unsubscribeTrans = onSnapshot(qTransactions, (snapshot) => {
      const transData = snapshot.docs.map(doc => {
        const data = doc.data();
        
        // Tarih objesini React'in seveceği bir String'e çeviriyoruz
        const dateObject = data.date?.toDate() || new Date();
        const formattedDate = dateObject.toLocaleDateString('tr-TR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });

        return {
          ...data,       // Önce verileri yayıyoruz
          id: doc.id,    // ✅ KRİTİK: Firestore'un gerçek ID'sini en sona koyuyoruz ki çakışmasın
          date: formattedDate
        };
      });
      setTransactions(transData);
      setLoading(false);
    }, (err) => {
      console.error("Firestore Sorgu Hatası:", err);
    });

    // 2. Budgets Dinleyici
    const qBudgets = query(
      collection(db, "budgets"),
      where("userId", "==", user.uid)
    );

    const unsubscribeBudgets = onSnapshot(qBudgets, (snapshot) => {
      const budgetData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBudgets(budgetData);
    });

    return () => {
      unsubscribeTrans();
      unsubscribeBudgets();
    };
  }, [user]);

  // ✅ İŞLEM EKLEME
  const addTransaction = async (transactionData) => {
    if (!user) return;
    try {
      await addDoc(collection(db, "transactions"), {
        ...transactionData,
        userId: user.uid,
        amount: Number(transactionData.amount),
        date: serverTimestamp(), 
        createdAt: Date.now()
      });

      if (transactionData.type === 'expense') {
        checkBudgetAlert(transactionData.category, Number(transactionData.amount));
      }
    } catch (err) {
      console.error("Ekleme Hatası:", err);
    }
  };

  // ✅ İŞLEM SİLME (Hata Giderilmiş Versiyon)
  const deleteTransaction = async (transactionId) => {
    if (!user || !transactionId) return;
    try {
      // Firebase, ID'nin mutlaka metin (string) olmasını ister. 
      // Aldığımız ID'yi garantiye almak için String() içine alıyoruz.
      const stringId = String(transactionId);
      
      console.log("Firebase'den siliniyor, ID:", stringId);
      const docRef = doc(db, "transactions", stringId);
      await deleteDoc(docRef);
      console.log("Silme işlemi başarılı.");
    } catch (err) {
      console.error("Firestore Silme Hatası:", err);
    }
  };

  const checkBudgetAlert = (category, amount) => {
    const budget = budgets.find(b => b.category === category);
    if (budget) {
      const limitNum = Number(budget.limit || 0);
      const relevantTotal = transactions
        .filter(t => t.category === category && t.type === 'expense')
        .reduce((acc, curr) => acc + Number(curr.amount), 0) + amount;

      if (limitNum > 0 && (relevantTotal / limitNum) >= 0.75) {
        addMessage('bot', `⚠️ Budget Alert: You've used %${((relevantTotal / limitNum) * 100).toFixed(0)} of your ${category} budget!`);
      }
    }
  };

  return (
    <TransactionContext.Provider value={{ transactions, addTransaction, deleteTransaction, budgets, loading }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionContext);