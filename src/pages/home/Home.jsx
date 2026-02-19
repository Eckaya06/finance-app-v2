// src/pages/home/Home.jsx

// src/pages/home/Home.jsx

import StatCard from '../../components/statcard/StatCard.jsx';
import TransactionsList from '../../components/transactions/TransactionsList.jsx';
import PotsCard from '../../components/pots/PotsCard.jsx';
import BudgetsCard from '../../components/budgets/BudgetsCard.jsx';
import RecurringBillsCard from '../../components/bills/RecurringBillsCard.jsx'; // 1. Yeni kartı import et
import './Home.css';

const Home = () => {
  return (
    <div>
      <h1 className="page-title">Overview</h1>
      <div className="stat-cards-grid">
        <StatCard title="Current Balance" amount="$4,836.00" variant="primary" />
        <StatCard title="Income" amount="$3,814.25" />
        <StatCard title="Expenses" amount="$1,700.50" />
      </div>

      <div className="dashboard-main-grid">
        <div className="main-left-column">
          <PotsCard />
          <TransactionsList limit={5} showViewAll={true} />
        </div>
        
        <div className="main-right-column">
          <BudgetsCard />
          {/* 2. RecurringBillsCard'ı buraya yerleştir */}
          <RecurringBillsCard />
        </div>
      </div>
    </div>
  );
};

export default Home;