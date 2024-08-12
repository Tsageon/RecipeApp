import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem('users')) || [];

    if (users.find(user => user.username === username)) {
      alert('Username already exists');
    } else {
      const newUser = { username, password };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      alert('Registration successful!');
      onRegister();
    }
  };

  return (
    <div className="register-container">
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
        <button type="submit">Register</button>
      </form>
      <div className="login-link">
        <p>Already registered? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
};

export default Register;