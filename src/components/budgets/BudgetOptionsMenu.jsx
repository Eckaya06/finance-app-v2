import React from 'react';
import './BudgetOptionsMenu.css';

const BudgetOptionsMenu = ({ onEdit, onDelete }) => {
  return (
    <div className="budget-options-menu">
      <button onClick={onEdit} className="options-menu-item">
        Edit Budget
      </button>
      <div className="options-menu-divider" />
      <button onClick={onDelete} className="options-menu-item delete">
        Delete Budget
      </button>
    </div>
  );
};

export default BudgetOptionsMenu;

