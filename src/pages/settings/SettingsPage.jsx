import { useEffect, useState } from "react";
import "./SettingsPage.css";
import { transactions as mockTransactions } from "../../data/mockTransactions.js";

const SettingsPage = () => {
  const [profile, setProfile] = useState({ displayName: "", email: "" });

  const [prefs, setPrefs] = useState({
    theme: "light",      // light | dark
    language: "en",      // en | tr
    currency: "USD",     // USD | EUR | TRY
    dateFormat: "DD/MM/YYYY",
  });

  const [notifications, setNotifications] = useState({
    weeklySummary: false,
    budgetWarning: false,
  });

  // Load settings
  useEffect(() => {
    const saved = localStorage.getItem("settings");
    if (!saved) return;

    try {
      const s = JSON.parse(saved);
      if (s.profile) setProfile(s.profile);
      if (s.prefs) setPrefs(s.prefs);
      if (s.notifications) setNotifications(s.notifications);
    } catch {
      // ignore broken JSON
    }
  }, []);

  // Save settings
  useEffect(() => {
    localStorage.setItem("settings", JSON.stringify({ profile, prefs, notifications }));
  }, [profile, prefs, notifications]);

  // Apply dark mode (only body class)
  useEffect(() => {
    if (prefs.theme === "dark") document.body.classList.add("theme-dark");
    else document.body.classList.remove("theme-dark");
  }, [prefs.theme]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  const handlePrefChange = (e) => {
    const { name, value } = e.target;
    setPrefs((p) => ({ ...p, [name]: value }));
  };

  const toggleNotification = (name) => {
    setNotifications((n) => ({ ...n, [name]: !n[name] }));
  };

  const toggleDarkMode = () => {
    setPrefs((p) => ({ ...p, theme: p.theme === "dark" ? "light" : "dark" }));
  };

  // Export transactions as JSON
  const exportTransactions = () => {
    const fromLS = localStorage.getItem("transactions");
    let data = [];

    if (fromLS) {
      try {
        data = JSON.parse(fromLS);
      } catch {
        data = [];
      }
    } else {
      data = mockTransactions || [];
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.json";
    a.click();

    URL.revokeObjectURL(url);
  };

  // (Phase 2 later) Import could go here. For now disabled.
  const clearLocalData = () => {
    const ok = window.confirm("Are you sure you want to clear all local data? This cannot be undone.");
    if (!ok) return;
    localStorage.clear();
    window.alert("Local data cleared. Refresh the page.");
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
      </div>

      {/* 1) Profile */}
      <section className="settings-section">
        <h2>1) Profile & Account</h2>

        <div className="field-row">
          <label>Display name</label>
          <div className="row-right">
            <input
              className="input"
              name="displayName"
              value={profile.displayName}
              onChange={handleProfileChange}
              placeholder="Your name"
            />
          </div>
        </div>

        <div className="field-row">
          <label>Email</label>
          <div className="row-right">
            <input
              className="input"
              name="email"
              value={profile.email}
              onChange={handleProfileChange}
              placeholder="(Phase 2 - Firebase auth)"
            />
            <span className="badge">Phase 2</span>
          </div>
        </div>

        <div className="field-row">
          <label>Password</label>
          <div className="row-right">
            <button className="btn btn-ghost" disabled>
              Change password
            </button>
            <span className="badge">Phase 2</span>
          </div>
        </div>

        <div className="field-row">
          <label>Delete account</label>
          <div className="row-right">
            <button className="btn btn-danger" disabled>
              Delete account
            </button>
            <span className="badge">Phase 2</span>
          </div>
        </div>
      </section>

      {/* 2) Preferences */}
      <section className="settings-section">
        <h2>2) Preferences</h2>

        <div className="field-row">
          <label>Dark mode</label>
          <div className="row-right">
            <button
              type="button"
              className="toggle"
              data-on={prefs.theme === "dark"}
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
            >
              <span className="toggle-knob" />
            </button>
            <span className="muted">{prefs.theme === "dark" ? "On" : "Off"}</span>
          </div>
        </div>

        <div className="field-row">
          <label>Language</label>
          <div className="row-right">
            <select className="select" name="language" value={prefs.language} onChange={handlePrefChange}>
              <option value="en">EN</option>
              <option value="tr">TR</option>
            </select>
            <span className="badge">UI only</span>
          </div>
        </div>

        <div className="field-row">
          <label>Currency</label>
          <div className="row-right">
            <select className="select" name="currency" value={prefs.currency} onChange={handlePrefChange}>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="TRY">TRY</option>
            </select>
          </div>
        </div>

        <div className="field-row">
          <label>Date format</label>
          <div className="row-right">
            <select className="select" name="dateFormat" value={prefs.dateFormat} onChange={handlePrefChange}>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </section>

      {/* 3) Data */}
      <section className="settings-section">
        <h2>3) Data & Privacy</h2>

        <div className="field-row">
          <label>Export data (transactions)</label>
          <div className="row-right">
            <button className="btn btn-primary" onClick={exportTransactions}>
              Export JSON
            </button>
          </div>
        </div>

        <div className="field-row">
          <label>Import data</label>
          <div className="row-right">
            <button className="btn btn-ghost" disabled>
              Import (Phase 2)
            </button>
            <span className="badge">Phase 2</span>
          </div>
        </div>

        <div className="field-row">
          <label>Clear local data</label>
          <div className="row-right">
            <button className="btn btn-danger" onClick={clearLocalData}>
              Clear localStorage
            </button>
          </div>
        </div>

        <p className="muted-note">
          Phase 1 stores data locally in your browser. Phase 2 will support cloud sync (Firebase).
        </p>
      </section>

      {/* 4) Notifications */}
      <section className="settings-section">
        <h2>4) Notifications</h2>

        <div className="field-row">
          <label>Weekly summary</label>
          <div className="row-right">
            <input
              type="checkbox"
              checked={notifications.weeklySummary}
              onChange={() => toggleNotification("weeklySummary")}
            />
            <span className="muted">(UI only)</span>
          </div>
        </div>

        <div className="field-row">
          <label>Budget warning</label>
          <div className="row-right">
            <input
              type="checkbox"
              checked={notifications.budgetWarning}
              onChange={() => toggleNotification("budgetWarning")}
            />
            <span className="muted">(UI only)</span>
          </div>
        </div>
      </section>

      {/* 5) App info */}
      <section className="settings-section">
        <h2>5) App Info</h2>

        <div className="field-row">
          <label>Version</label>
          <div className="row-right">
            <span>v1.0</span>
          </div>
        </div>

        <div className="field-row">
          <label>Tech stack</label>
          <div className="row-right">
            <span>React (Vite)</span>
          </div>
        </div>

        <div className="field-row">
          <label>Support</label>
          <div className="row-right">
            <a href="mailto:support@example.com">support@example.com</a>
            <span className="badge">Replace</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SettingsPage;
