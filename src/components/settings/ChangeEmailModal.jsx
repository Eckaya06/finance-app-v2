import { useEffect, useState } from "react";
import "./ChangeEmailModal.css";
import { auth } from "../../firebase";
import {
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  verifyBeforeUpdateEmail,
  updateEmail,
} from "firebase/auth";

const ChangeEmailModal = ({ onClose }) => {
  const [user, setUser] = useState(null);
  const [currentPw, setCurrentPw] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [mode, setMode] = useState("verify"); // "verify" | "direct"
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!user || !user.email) {
      setErr("You must be logged in to change your email.");
      return;
    }
    if (!newEmail.includes("@")) {
      setErr("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      // re-auth required
      const cred = EmailAuthProvider.credential(user.email, currentPw);
      await reauthenticateWithCredential(user, cred);

      if (mode === "verify") {
        // safer: sends verification link to new email
        await verifyBeforeUpdateEmail(user, newEmail);
        onClose();
        window.alert(
          "Verification email sent to your new address. Please verify to complete the change."
        );
      } else {
        // direct: updates immediately (less safe)
        await updateEmail(user, newEmail);
        onClose();
        window.alert("Email updated successfully.");
      }
    } catch (e2) {
      setErr(e2?.message || "Failed to update email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ce-modal">
      <div className="ce-header">
        <h2>Change email</h2>
        <button className="ce-close" onClick={onClose} aria-label="Close">×</button>
      </div>

      <p className="ce-desc">
        For security, we’ll ask for your current password. Choose a method below.
      </p>

      {err ? <div className="ce-error">{err}</div> : null}

      <form className="ce-form" onSubmit={handleSubmit}>
        <div className="ce-field">
          <label>Current password</label>
          <input
            type="password"
            value={currentPw}
            onChange={(e) => setCurrentPw(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        <div className="ce-field">
          <label>New email</label>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="name@example.com"
            required
          />
        </div>

        <div className="ce-radio">
          <label className="ce-radio-row">
            <input
              type="radio"
              name="emailMode"
              checked={mode === "verify"}
              onChange={() => setMode("verify")}
            />
            <span>
              Send verification to new email (recommended)
            </span>
          </label>

          <label className="ce-radio-row">
            <input
              type="radio"
              name="emailMode"
              checked={mode === "direct"}
              onChange={() => setMode("direct")}
            />
            <span>
              Update immediately (direct)
            </span>
          </label>
        </div>

        <button className="ce-primary" type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update email"}
        </button>

        <button className="ce-link" type="button" onClick={onClose} disabled={loading}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default ChangeEmailModal;