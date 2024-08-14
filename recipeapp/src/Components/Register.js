import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './auth.css'; 

const Register = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem('users')) || [];
    console.log('Users:', users);

    if (users.find(user => user.username === username)) {
      alert('Username Exists');
    } else if (users.find(user => user.email === email)) {
      alert('Email Already Registered');
    } else if (!/^\d{10}$/.test(phone)) {
      alert('Enter a Valid 10-digit Phone Number');
    } else {
      const newUser = { username, password, email, phone };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      alert('Registration Successful!');
      onRegister();
    }
  };

  return (
    <div className="auth-container"> 
      <div className="logo-container">
        <video className="logo-video" autoPlay loop muted>
          <source src="https://cdnl.iconscout.com/lottie/premium/preview-watermark/meal-8820888-7140050.mp4" type="video/mp4" />
          Need a better browser.
        </video>
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <input type="text" placeholder="Username" 
            value={username} onChange={(e) => setUsername(e.target.value)} 
            required />
          <input type="password" placeholder="Password" 
            value={password} onChange={(e) => setPassword(e.target.value)} 
            required />
          <input type="email" placeholder="Email" 
            value={email} onChange={(e) => setEmail(e.target.value)} 
            required />
          <input type="tel" placeholder="Phone Number (10 digits)" 
            value={phone} onChange={(e) => setPhone(e.target.value)} 
            required maxLength={10} />
          <button type="submit">Register</button>
        </form>
        <div className="link-container">
          <p>Already registered? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;