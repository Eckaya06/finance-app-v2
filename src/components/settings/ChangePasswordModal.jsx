import { useState } from "react";
import "./ChangePasswordModal.css";
import { auth } from "../../firebase";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

const ChangePasswordModal = ({ onClose }) => {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (newPw.length < 6) {
      setErr("New password must be at least 6 characters.");
      return;
    }
    if (newPw !== confirmPw) {
      setErr("New password and confirm password do not match.");
      return;
    }

    const user = auth.currentUser;
    if (!user || !user.email) {
      setErr("No authenticated user found.");
      return;
    }

    try {
      setLoading(true);
      const cred = EmailAuthProvider.credential(user.email, currentPw);
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, newPw);
      onClose();
      window.alert("Password updated successfully.");
    } catch (e2) {
      // common: auth/wrong-password, auth/too-many-requests, auth/requires-recent-login
      setErr(e2?.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cp-modal">
      <div className="cp-header">
        <h2>Change password</h2>
        <button className="cp-close" onClick={onClose} aria-label="Close">×</button>
      </div>

      <p className="cp-desc">
        For security, please confirm your current password before setting a new one.
      </p>

      {err ? <div className="cp-error">{err}</div> : null}

      <form className="cp-form" onSubmit={handleSubmit}>
        <div className="cp-field">
          <label>Current password</label>
          <input
            type="password"
            value={currentPw}
            onChange={(e) => setCurrentPw(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        <div className="cp-field">
          <label>New password</label>
          <input
            type="password"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>

        <div className="cp-field">
          <label>Confirm new password</label>
          <input
            type="password"
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>

        <button className="cp-primary" type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update password"}
        </button>

        <button className="cp-link" type="button" onClick={onClose} disabled={loading}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordModal;