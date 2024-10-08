import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './auth.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      onLogin();
    } else {
      alert('Invalid Username or Password');
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="submit">Login</button>
      </form>
      <div className="link-container">
        <p>New User? <Link to="/register">Register here</Link></p>
      </div>
    </div>
  );
};

const Register = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem('users')) || [];

    if (users.find(user => user.username === username)) {
      alert('Username Exists');
    } else {
      const newUser = { username, password };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      alert('Registration Successful!');
      onRegister();
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="submit">Register</button>
      </form>
      <div className="link-container">
        <p>Already registered? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
};

export { Login, Register };