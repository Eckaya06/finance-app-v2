import { useState } from 'react';
import { login} from '../../utils/auth';
import { Link, useNavigate } from 'react-router-dom';




const Login = () =>{





  const [email,setEmail] = useState('')
  const [password,setPassword]=useState('')

  const navigate = useNavigate();

  const handleSubmit = (event) =>{

    event.preventDefault();

    if(!email || !password){

      alert(" Please fill in the blanks ")
      return;
    }

    const isSuccess = login(email, password);

    if(isSuccess){

      alert('Giriş başarılı! Ana sayfaya yönlendiriliyorsunuz...');
      navigate('/home');

    }else {

      alert('Email veya şifre hatalı. Lütfen tekrar deneyin.');


    }
}
  


  






  return(
    <div className="container">
      <div className="auth-page">
        <div className="auth-hero">

          <img src="/src/assets/logo.png" alt="logo resmi" />

          <div className='background-hero'>

            


          </div>

          

          <div className='text-content'>
            <h1>  <span>Keep track of your money</span>
                  <span>and save for your future</span>
            </h1>
            <p>
            Personal finance app that helps you track transactions, set budgets,
            and grow your savings.
            </p>
            
            
          </div>
        </div>
      
        <form onSubmit={handleSubmit} className= "auth-card" >
          <h2>Login</h2>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email"
              id ="email"
              value= {email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group" >
              
            <label htmlFor="password">Password</label>
            <input 
            type="password"
            id = "password" 
            value = {password}
            onChange={(e)=>setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="primary">Login</button>
          <p className="small">Don't you have a account? <Link to="/signup">Sign up</Link></p>
        </form>





      </div>
    </div>
    );
  };

export default Login;




































































/*import React, { useState } from 'react';
import { findUser, setLoggedInUser } from '../../utils/auth';

const Login = ({ onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    const user = findUser(email, password);

    if (user) {
      setLoggedInUser(user); // Kullanıcıyı "giriş yapmış" olarak işaretle.
      setMessage('Giriş başarılı!');
      onAuthSuccess(user); // Üst bileşene girişin başarılı olduğunu bildir.
    } else {
      setMessage('E-posta veya şifre yanlış.');
    }
  };

  return (
    <form className="auth-form" onSubmit={handleLogin}>
      <h2>Giriş Yap</h2>
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
      <button type="submit">Giriş Yap</button>
    </form>
  );
};

export default Login;*/