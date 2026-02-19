import React from 'react';
import './DeleteBudgetModal.css';

const DeleteBudgetModal = ({ budget, onConfirm, onClose }) => {
  return (
    <div className="delete-modal-container">
      <h2>Delete ‘{budget?.category}’?</h2>
      <p>
        Are you sure you want to delete this budget? This action cannot be reversed, 
        and all the data inside it will be removed forever.
      </p>
      <div className="delete-modal-actions">
        <button className="btn-delete-confirm" onClick={onConfirm}>
          Yes, Confirm Deletion
        </button>
        <button className="btn-delete-cancel" onClick={onClose}>
          No, Go Back
        </button>
      </div>
    </div>
  );
};

export default DeleteBudgetModal;