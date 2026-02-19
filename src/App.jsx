import { Routes, Route, Navigate } from 'react-router-dom'; // Navigate'i geri ekliyoruz
import Login from './pages/auth/Login.jsx';
import Signup from './pages/auth/Signup.jsx';
import Home from './pages/home/Home.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx'; 
import DashboardLayout from './layouts/DashboardLayout.jsx';
import TransactionsPage from './pages/transactions/TransactionsPage.jsx';
import PotsPage from './pages/pots/PotsPage.jsx';
import IncomeExpensePage from './pages/income-expense/IncomeExpensePage.jsx';
import BudgetsPage from './pages/budgets/BudgetsPage.jsx'; // ✅ BudgetsPage import edildi
import SettingsPage from './pages/settings/SettingsPage.jsx';
import AnalyticsPage from './pages/analytics/AnalyticsPage.jsx';


// Yer tutucu bileşenler
const Transactions = () => <h1 style={{ padding: '2rem' }}>Transactions Page</h1>;
const Budgets = () => <h1 style={{ padding: '2rem' }}>Budgets Page</h1>;
const Pots = () => <h1 style={{ padding: '2rem' }}>Pots Page</h1>;
const Bills = () => <h1 style={{ padding: '2rem' }}>Recurring Bills Page</h1>;

const App = () => {
  return (
    <div>

      
      <Routes>
        {/* Auth Rotaları */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* Kök dizin ('/') için en doğru kullanım yönlendirmedir */}
        <Route path="/" element={<Navigate to="/login" />} />


        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>

          

          <Route path="/home" element={<Home />} />
          <Route path="/income-expense" element={<IncomeExpensePage />} />
          <Route path="/transactions" element={ <TransactionsPage />}/>
          <Route path="/budgets" element={<BudgetsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/pots" element={<PotsPage />} />
          <Route path="/bills" element={<Bills />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        
      </Routes>
    </div>
  );
};

export default App;