import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import './auth.css'; 

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate('')

  const handleRegister = (e) => {
    e.preventDefault();
  
    const users = JSON.parse(localStorage.getItem('users')) || [];
    console.log('Users:', users);
  
    if (users.find(user => user.username === username)) {
      Swal.fire({
        icon: 'error',
        title: 'Username Exists',
        text: 'Please choose a different username.',
      });
    } else if (users.find(user => user.email === email)) {
      Swal.fire({
        icon: 'error',
        title: 'Email Already Registered',
        text: 'This email is already registered. Try logging in.',
      });
    } else if (!/^\d{10}$/.test(phone)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Phone Number',
        text: 'Enter a valid 10-digit phone number.',
      });
    } else {
      const newUser = { username, password, email, phone };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
  
      Swal.fire({
        icon: 'success',
        title: 'Registration Successful!',
        text: 'You can now log in with your credentials.',
      });
  
      navigate('/login');
    }
  };
  


  return (
    <div className="auth-container"> 
      <div className="logo-container">
        <video className="logo-video" autoPlay loop muted>
          <source src="https://cdnl.iconscout.com/lottie/premium/preview-watermark/meal-8820888-7140050.mp4" type="video/mp4" />
          Need a better browser.
        </video>
        <p><b><i>Cooking With Tlhogi</i></b></p>
        <h2>Register</h2>
        <p><i>It's Always Pleasure To Have a New Connoisseur Of The Culinary Arts Join Us!</i></p> {}
        <form onSubmit={handleRegister}>
          <input className='username' type="text" placeholder="Username" 
            value={username} onChange={(e) => setUsername(e.target.value)} 
            required/> 
          <input type="email" placeholder="Email" 
            value={email} onChange={(e) => setEmail(e.target.value)} 
            required/>
            <input type="tel" placeholder="Phone Number (10 digits)" 
            value={phone} onChange={(e) => setPhone(e.target.value)} 
            required maxLength={10}/>
          <input type="password" placeholder="Password" 
            value={password} onChange={(e) => setPassword(e.target.value)} 
            required/>
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