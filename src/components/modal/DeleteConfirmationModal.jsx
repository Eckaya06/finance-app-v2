// src/components/modal/DeleteConfirmationModal.jsx
import './Modal.css'; // Genel modal stillerini kullanabiliriz

const DeleteConfirmationModal = ({ potName, onConfirm, onCancel }) => {
  return (
    <div className="delete-confirmation">
      <h2>Delete '{potName}'?</h2>
      <p>Are you sure you want to delete this pot? This action cannot be reversed, and all the data inside it will be removed forever.</p>
      <div className="confirmation-buttons">
        <button className="btn-danger" onClick={onConfirm}>
          Yes, Confirm Deletion
        </button>
        <button className="btn-secondary-outline" onClick={onCancel}>
          No, Go Back
        </button>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;