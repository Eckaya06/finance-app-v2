import { createContext, useState, useEffect, useContext } from 'react';
import { db } from '../firebase'; 
import { 
  collection, 
  addDoc, 
  deleteDoc,
  doc,
  updateDoc, // ✅ Firestore Güncelleme Fonksiyonu
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
  const [pots, setPots] = useState([]); 
  const [loading, setLoading] = useState(true);

  const user = authContext ? authContext.user : null;

  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setBudgets([]);
      setPots([]); 
      setLoading(false);
      return;
    }

    const qTransactions = query(collection(db, "transactions"), where("userId", "==", user.uid), orderBy("date", "desc"));
    const unsubscribeTrans = onSnapshot(qTransactions, (snapshot) => {
      const transData = snapshot.docs.map(doc => {
        const data = doc.data();
        const dateObject = data.date?.toDate() || new Date();
        const formattedDate = dateObject.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        return { ...data, id: doc.id, date: formattedDate };
      });
      setTransactions(transData);
      setLoading(false);
    }, (err) => console.error("Firestore Sorgu Hatası:", err));

    const qBudgets = query(collection(db, "budgets"), where("userId", "==", user.uid));
    const unsubscribeBudgets = onSnapshot(qBudgets, (snapshot) => {
      setBudgets(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });

    const qPots = query(collection(db, "pots"), where("userId", "==", user.uid));
    const unsubscribePots = onSnapshot(qPots, (snapshot) => {
      const potsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setPots(potsData.sort((a,b) => (b.createdAt || 0) - (a.createdAt || 0)));
    });

    return () => {
      unsubscribeTrans();
      unsubscribeBudgets();
      unsubscribePots(); 
    };
  }, [user]);

  const computedBudgets = budgets.map(budget => {
    const budgetCategory = String(budget.category || "").trim().toLowerCase();
    const relevantTransactions = transactions.filter(t => {
      const tCategory = String(t.category || "").trim().toLowerCase();
      const tType = String(t.type || "").trim().toLowerCase();
      return tCategory === budgetCategory && tType === 'expense' && (t.createdAt || 0) >= (budget.createdAt || 0);
    });
    const spentAmount = relevantTransactions.reduce((sum, t) => sum + Number(t.amount || 0), 0);
    return {
      ...budget,
      spent: spentAmount,
      latestSpending: relevantTransactions.sort((a,b) => (b.createdAt || 0) - (a.createdAt || 0)).slice(0, 3)
    };
  });

  const addTransaction = async (transactionData) => {
    if (!user) return;
    try {
      await addDoc(collection(db, "transactions"), { ...transactionData, userId: user.uid, amount: Number(transactionData.amount), date: serverTimestamp(), createdAt: Date.now() });
      if (transactionData.type === 'expense') checkBudgetAlert(transactionData.category, Number(transactionData.amount));
    } catch (err) { console.error("Ekleme Hatası:", err); }
  };

  const deleteTransaction = async (transactionId) => {
    if (!user || !transactionId) return;
    try { await deleteDoc(doc(db, "transactions", String(transactionId))); } 
    catch (err) { console.error("Firestore Silme Hatası:", err); }
  };

  const addBudget = async (budgetData) => {
    if (!user) return;
    try { await addDoc(collection(db, "budgets"), { ...budgetData, userId: user.uid }); } 
    catch (err) { console.error("Bütçe Ekleme Hatası:", err); }
  };

  const deleteBudget = async (budgetId) => {
    if (!user || !budgetId) return;
    try { await deleteDoc(doc(db, "budgets", String(budgetId))); } 
    catch (err) { console.error("Bütçe Silme Hatası:", err); }
  };

  const updateBudget = async (budgetId, updatedData) => {
    if (!user || !budgetId) return;
    try { await updateDoc(doc(db, "budgets", String(budgetId)), updatedData); } 
    catch (err) { console.error("Bütçe Güncelleme Hatası:", err); }
  };

  // --- POTS İŞLEMLERİ ---
  const addPot = async (potData) => {
    if (!user) return;
    try { await addDoc(collection(db, "pots"), { ...potData, userId: user.uid, createdAt: Date.now() }); } 
    catch (err) { console.error("Pot Ekleme Hatası:", err); }
  };

  const deletePot = async (potId) => {
    if (!user || !potId) return;
    try { await deleteDoc(doc(db, "pots", String(potId))); } 
    catch (err) { console.error("Pot Silme Hatası:", err); }
  };

  const updatePotBalance = async (potId, newBalance) => {
    if (!user || !potId) return;
    try { await updateDoc(doc(db, "pots", String(potId)), { saved: Number(newBalance) }); } 
    catch (err) { console.error("Pot Bakiye Güncelleme Hatası:", err); }
  };

  // ✅ YENİ: POT GÜNCELLEME İŞLEMİ
  const updatePot = async (potId, updatedData) => {
    if (!user || !potId) return;
    try {
      const potRef = doc(db, "pots", String(potId));
      await updateDoc(potRef, updatedData);
    } catch (err) { 
      console.error("Pot Güncelleme Hatası:", err); 
    }
  };
  // --------------------------------

  const checkBudgetAlert = (category, amount) => {
    const budgetCategory = String(category || "").trim().toLowerCase();
    const budget = computedBudgets.find(b => String(b.category || "").trim().toLowerCase() === budgetCategory);
    if (budget) {
      const limitNum = Number(budget.limit || 0);
      const relevantTotal = budget.spent + amount;
      if (limitNum > 0 && (relevantTotal / limitNum) >= 0.75) {
        addMessage('bot', `⚠️ Budget Alert: You've used %${((relevantTotal / limitNum) * 100).toFixed(0)} of your ${category} budget!`);
      }
    }
  };

  return (
    <TransactionContext.Provider value={{ 
      transactions, addTransaction, deleteTransaction, 
      budgets: computedBudgets, addBudget, deleteBudget, updateBudget, 
      pots, addPot, deletePot, updatePotBalance, updatePot, // ✅ updatePot DIŞARI AÇILDI
      loading 
    }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionContext);