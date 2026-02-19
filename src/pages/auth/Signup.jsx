import { useState } from 'react';
import { register } from '../../utils/auth';
import { Link } from 'react-router-dom';



const Signup =() =>{

  const[email,setEmail] = useState('');
  const[password,setPassword] = useState('');



  const handleSubmit = (event) =>{

    event.preventDefault();

    if(!email || !password){

      alert(" Please fill in the blanks ")
      return;
    }

    try{

      register(email,password);
      alert('Registration completed successfully! You can now log in from the Login page.');

      setEmail('');
      setPassword('');

    } catch (error) {
      alert('An error occurred during registration.');
      console.error("Signup error:", error);
    }

  }



  return (
  <div className="container">
    <div className="auth-page">
      <div className="auth-hero">

        <img src="/src/assets/logo.png" className='auth-hero-logo' alt="logo resmi" />
        <div className='background-hero'>


        </div>
        <div className='text-content'>
          <h1>Manage your money smarter</h1>
          <p>Create an account to start tracking income, expenses and budgets.</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="auth-card" >
        <h2>Sign up</h2>
        <div className="form-group" >
          <label htmlFor="email">Email</label>
          <input 
            type="email"
            id ="email"
            value= {email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group" >
          
          <label htmlFor="password" >Password</label>
          <input 
          type="password"
          id = "password" 
          value = {password}
          onChange={(e)=>setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="primary" >Sign up</button>
        <p className="small"> Do you already have an account? <Link to="/login">Sign in</Link></p>
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