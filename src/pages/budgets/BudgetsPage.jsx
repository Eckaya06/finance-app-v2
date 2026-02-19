import { useState, useEffect } from 'react';
import Modal from '../../components/modal/Modal.jsx';
import AddBudgetForm from '../../components/budgets/AddBudgetForm.jsx';
import EmptyState from '../../components/emptystate/EmptyState.jsx';
import { FiPieChart } from 'react-icons/fi';
import './BudgetsPage.css';
import BudgetDetailCard from '../../components/budgets/BudgetDetailCard.jsx';
import DeleteBudgetModal from '../../components/budgets/DeleteBudgetModal.jsx';

// ✅ (ÖNERİLEN) Görseli import ederek kullan (Vite için en sağlam yol)
import emptyBudgetImg from '../../assets/empty-budget.png';

// Sayfa yüklendiğinde localStorage'dan veriyi okuyan fonksiyon
const getInitialBudgets = () => {
  const savedBudgets = localStorage.getItem('financeapp_budgets');
  return savedBudgets ? JSON.parse(savedBudgets) : [];
};

const BudgetsPage = () => {
  const [budgets, setBudgets] = useState(getInitialBudgets());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [budgetToDelete, setBudgetToDelete] = useState(null);
  const [budgetToEdit, setBudgetToEdit] = useState(null); // şimdilik durabilir

  useEffect(() => {
    localStorage.setItem('financeapp_budgets', JSON.stringify(budgets));
  }, [budgets]);

  const handleCreateBudget = (newBudgetData) => {
    const newBudget = {
      id: Date.now(),
      ...newBudgetData,
      spent: 0,
    };
    setBudgets((prev) => [newBudget, ...prev]);
  };

  const handleDeleteConfirm = () => {
    if (!budgetToDelete) return;

    setBudgets((prev) => prev.filter((b) => b.id !== budgetToDelete.id));
    setBudgetToDelete(null);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Budgets</h1>
        <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
          + Add New Budget
        </button>
      </div>

      {budgets.length === 0 ? (
        <EmptyState
          icon={<FiPieChart />}
          title="Create Your First Budget"
          message="Set spending limits for different categories to help you monitor and control your spending."
          buttonText="+ Create First Budget"
          onAction={() => setIsAddModalOpen(true)}
          // ✅ yeni eklenen satır: arkaplan görseli
          backgroundImage={emptyBudgetImg}
        />
      ) : (
        // ✅ Artık tek alan: Budgets grid (Pots gibi)
        <div className="budget-cards-grid">
          {budgets.map((budget) => (
            <BudgetDetailCard
              key={budget.id}
              budget={{
                ...budget,
                latestSpending: Array.isArray(budget.latestSpending) ? budget.latestSpending : [],
              }}
              onDeleteRequest={() => setBudgetToDelete(budget)}
              onEditRequest={() => {
                // setBudgetToEdit(budget);
                alert(`Editing ${budget.category}`);
              }}
            />
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <AddBudgetForm
          onAddBudget={handleCreateBudget}
          onClose={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={!!budgetToDelete} onClose={() => setBudgetToDelete(null)}>
        <DeleteBudgetModal
          budget={budgetToDelete}
          onConfirm={handleDeleteConfirm}
          onClose={() => setBudgetToDelete(null)}
        />
      </Modal>
    </div>
  );
};

export default BudgetsPage;
