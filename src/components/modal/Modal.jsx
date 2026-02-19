// src/components/modal/Modal.jsx
import './Modal.css';
import { FiX } from 'react-icons/fi';

const Modal = ({ isOpen, onClose, children }) => {
  // Eğer modal açık değilse, hiçbir şey gösterme (null render et)
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <FiX size={24} />
        </button>
        {/* Dışarıdan gelen içerik (form vb.) burada gösterilecek */}
        {children}
      </div>
    </div>
  );
};

export default Modal;