import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './auth.css'; 

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      onLogin();
    } else {
      alert('Invalid Email or Password');
    }
  };

  return (
    <div className="auth-container">
      <video className="logo-video" autoPlay loop muted>
        <source src="https://cdnl.iconscout.com/lottie/premium/preview-watermark/meal-8820888-7140050.mp4" type="video/mp4" />
        Need a better browser.
      </video>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required/>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required/>
        <button type="submit">Login</button>
      </form>
      <div className="link-container">
        <p>New User? <Link to="/register">Register here</Link></p>
      </div>
    </div>
  );
};

export default Login;