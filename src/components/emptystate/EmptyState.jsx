import './EmptyState.css';

const EmptyState = ({ title, message, buttonText, onAction, icon, backgroundImage }) => {
  return (
    <div className="empty-state-container">
      
      {/* YENİ: Inline style yerine resmi doğrudan img olarak ekliyoruz. 
          Tarayıcı bunu CSS'i beklemeden anında indirecek! */}
      {backgroundImage && (
        <img 
          src={backgroundImage} 
          alt="background" 
          className="empty-state-bg-img" 
          fetchPriority="high" // Tarayıcıya öncelik verdirir
        />
      )}

      {backgroundImage && <div className="empty-state-overlay" />}

      <div className="empty-state-content">
        {icon && <div className="empty-state-icon">{icon}</div>}

        <h2 className="empty-state-title">{title}</h2>
        <p className="empty-state-message-text">{message}</p>

        {buttonText && (
          <button className="btn-primary" onClick={onAction}>
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
