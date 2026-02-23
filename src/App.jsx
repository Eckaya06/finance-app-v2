import { Routes, Route, Navigate, useLocation } from 'react-router-dom'; // useLocation eklendi
import Login from './pages/auth/Login.jsx';
import Signup from './pages/auth/Signup.jsx';
import Home from './pages/home/Home.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx'; 
import DashboardLayout from './layouts/DashboardLayout.jsx';
import TransactionsPage from './pages/transactions/TransactionsPage.jsx';
import PotsPage from './pages/pots/PotsPage.jsx';
import IncomeExpensePage from './pages/income-expense/IncomeExpensePage.jsx';
import BudgetsPage from './pages/budgets/BudgetsPage.jsx';
import SettingsPage from './pages/settings/SettingsPage.jsx';
import AnalyticsPage from './pages/analytics/AnalyticsPage.jsx';

import AiChatSystem from './components/chatbot/AiChatSystem.jsx';
import { TransactionProvider } from './context/TransactionContext.jsx';
import { ChatProvider } from './context/ChatContext.jsx';

// Asistanın nerede görüneceğini kontrol eden yardımcı bileşen
const AssistantWrapper = () => {
  const location = useLocation();
  // Asistanın GÖRÜNMEYECEĞİ sayfalar
  const authPaths = ['/login', '/signup', '/']; 
  
  if (authPaths.includes(location.pathname)) {
    return null;
  }
  
  return <AiChatSystem />;
};

const App = () => {
  return (
    <ChatProvider>
      <TransactionProvider>
        <div>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Navigate to="/login" />} />

            <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route path="/home" element={<Home />} />
              <Route path="/income-expense" element={<IncomeExpensePage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/budgets" element={<BudgetsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/pots" element={<PotsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Routes>

          {/* ✅ ARTIK AKILLI: Sadece giriş yaptıktan sonra görünür */}
          <AssistantWrapper />
        </div>
      </TransactionProvider>
    </ChatProvider>
  );
};

export default App;