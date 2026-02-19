// src/components/pots/WithdrawMoneyForm.jsx
import { useState, useEffect } from 'react';

const WithdrawMoneyForm = ({ pot, onConfirm, onClose }) => {
  const [amountToWithdraw, setAmountToWithdraw] = useState('');
  const [remainingAmount, setRemainingAmount] = useState(pot.saved);
  const [newProgress, setNewProgress] = useState(0);
  // --- 1. ADD: State to hold the error message ---
  const [error, setError] = useState(''); 

  // Calculate remaining amount, progress, and check for errors as amount changes
  useEffect(() => {
    const withdrawnValue = parseFloat(amountToWithdraw) || 0;
    
    // --- 2. ADD: Check if withdrawal amount exceeds saved amount ---
    if (withdrawnValue > pot.saved) {
      setError("Withdrawal amount cannot exceed the saved amount.");
    } else {
      setError(''); // Clear error if amount is valid
    }
    // --- End Add ---

    const potentialRemainingAmount = Math.max(0, pot.saved - withdrawnValue); 
    setRemainingAmount(potentialRemainingAmount);
    setNewProgress(pot.target > 0 ? (potentialRemainingAmount / pot.target) * 100 : 0);
  }, [amountToWithdraw, pot.saved, pot.target]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const withdrawnValue = parseFloat(amountToWithdraw);

    // --- 3. MODIFY: Check error state before submitting ---
    // Prevent submission if there's already an error displayed
    if (error) return; 

    // Use setError instead of alert for invalid amount
    if (isNaN(withdrawnValue) || withdrawnValue <= 0) {
      setError("Please enter a valid positive amount."); // Use state for error
      return;
    }
    // --- End Modify ---

    // The check in useEffect handles the > saved amount case, 
    // but this double-check is fine too (kept from your original code)
    if (withdrawnValue > pot.saved) {
       setError("Withdrawal amount cannot exceed the saved amount."); // Use state here too
       return;
     }

    onConfirm(pot.id, withdrawnValue);
    onClose();
  };

  // --- 4. ADD: Determine if the button should be disabled ---
  const isInvalid = error || isNaN(parseFloat(amountToWithdraw)) || parseFloat(amountToWithdraw) <= 0;
  // --- End Add ---

  return (
    <form onSubmit={handleSubmit} className="withdraw-money-form"> 
      <h2>Withdraw from '{pot.name}'</h2>
      <p>Withdraw money from your pot. This will be added back to your main balance.</p>

      {/* Preview section remains the same */}
      <div className="preview-section"> 
        <p className="preview-label">Remaining Amount</p>
        <p className="preview-amount">${remainingAmount.toFixed(2)}</p>
        <div className="progress-bar preview-progress">
          <div 
            className={`progress-bar-fill theme-${pot.theme}`} 
            style={{ width: `${Math.min(newProgress, 100)}%` }}
          ></div>
        </div>
        <div className="preview-target">
          <span>{Math.min(newProgress, 100).toFixed(0)}%</span>
          <span>Target of ${pot.target.toFixed(0)}</span>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="amount-to-withdraw">Amount to Withdraw</label>
        <input 
          id="amount-to-withdraw" 
          type="number" 
          value={amountToWithdraw}
          onChange={(e) => setAmountToWithdraw(e.target.value)}
          placeholder="$ 20" 
          step="0.01"
          // --- 5. MODIFY: Add error class conditionally ---
          className={error ? 'input-error' : ''} 
        />
        {/* --- 6. ADD: Display error message conditionally --- */}
        {error && <p className="form-error">{error}</p>}
      </div>
      
      {/* --- 7. MODIFY: Add disabled prop to the button --- */}
      <button 
        type="submit" 
        className="btn-primary form-submit-btn"
        disabled={isInvalid} 
      >
        Confirm Withdrawal
      </button>
    </form>
  );
};

export default WithdrawMoneyForm;