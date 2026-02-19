// src/components/budgets/BudgetsCard.jsx
import './BudgetsCard.css';
import { budgetData } from '../../data/mockBudgets';
// Recharts'tan gerekli bileşenleri import ediyoruz
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const BudgetsCard = () => {
  // Toplam harcamayı ve limiti hesaplayalım
  const totalSpent = budgetData.reduce((sum, item) => sum + item.value, 0);
  const limit = 975; // Tasarımdaki limit

  return (
    <div className="card-container">
      <div className="card-header">
        <h2>Budgets</h2>
        <a href="#" className="see-details-link">See Details ▸</a>
      </div>
      <div className="budget-content">
        <div className="chart-container">
          {/* ResponsiveContainer, grafiğin bulunduğu alana sığmasını sağlar */}
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={budgetData}
                cx="50%"
                cy="50%"
                innerRadius={60} // Bu, grafiği halka (doughnut) şeklinde yapar
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5} // Dilimler arası boşluk
                dataKey="value"
              >
                {budgetData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="chart-center-text">
            <p className="spent-amount">${totalSpent.toFixed(0)}</p>
            <p className="limit-text">of ${limit} limit</p>
          </div>
        </div>
        <div className="budget-legend">
          {budgetData.map((item) => (
            <div key={item.name} className="legend-item">
              <div className="legend-info">
                <span className="legend-color-box" style={{ backgroundColor: item.color }}></span>
                <p className="legend-name">{item.name}</p>
              </div>
              <p className="legend-value">${item.value.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BudgetsCard;