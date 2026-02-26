import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 
import logoImg from '../../assets/Logo.png';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); 
  const [loading, setLoading] = useState(false); 
  
  const navigate = useNavigate();
  const { signup } = useAuth(); 

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); 

    if (!email || !password) {
      setError("Please fill in the blanks");
      return;
    }

    try {
      setLoading(true);
      await signup(email, password);
      navigate('/home'); 
    } catch (error) {
      console.error("Signup error:", error);
      if (error.code === 'auth/email-already-in-use') {
        setError('This email address is already in use.');
      } else if (error.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError('An error occurred during registration.');
      }
    } finally {
      setLoading(false); 
    }
  }

  return (
    <div className="container">
      <div className="auth-page">
        <div className="auth-hero">
          <img src={logoImg} className="auth-hero-logo" alt="logo resmi" />
          <div className='background-hero'></div>
          <div className='text-content'>
            <h1>Manage your money smarter</h1>
            <p>Create an account to start tracking income, expenses and budgets.</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-card">
          <h2>Sign up</h2>
          
          {error && <div style={{ color: '#e74c3c', marginBottom: '15px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading} 
              autoComplete="email" // ✅ EKLENDİ
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password"
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="new-password" // ✅ EKLENDİ
            />
          </div>

          <button type="submit" className="primary" disabled={loading}>
            {loading ? "Creating account..." : "Sign up"}
          </button>
          
          <p className="small">Do you already have an account? <Link to="/login">Sign in</Link></p>
        </form>
      </div>
    </div>
  );
}

export default Signup;



























































/*import React, { useState } from 'react';
import { saveUser } from '../../utils/auth';

const Signup = ({ onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignup = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage('Lütfen tüm alanları doldurun.');
      return;
    }

    const newUser = { email, password };
    saveUser(newUser);

    setMessage('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
    setEmail('');
    setPassword('');

    // Başarılı kayıt sonrası bir üst bileşene haber veriyoruz.
    onAuthSuccess();
  };

  return (
    <form className="auth-form" onSubmit={handleSignup}>
      <h2>Kayıt Ol</h2>
      {message && <p>{message}</p>}
      <input
        type="email"
        placeholder="E-posta"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Şifre"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Kayıt Ol</button>
    </form>
  );
};

export default Signup;*/