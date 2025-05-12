import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './user.css'
import GoogalLogo from './img/glogo.png'

function UserLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login attempt:', formData);
    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('userID', data.id); // Save user ID in local storage
        alert('Login successful!');
        navigate('/allPost');
      } else if (response.status === 401) {
        alert('Invalid credentials!');
      } else {
        alert('Failed to login!');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="login-container" style={{ 
      background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)' 
    }}>
      <div className="login-box">
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Sign in to continue your journey</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="login-input"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className="login-input"
          />

          <button type="submit" className="login-button" style={{ backgroundColor: '#4CAF50' }}>
            Sign In
          </button>

          <div className="divider">
            <span>or continue with</span>
          </div>

          <button
            type="button"
            onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/google'}
            className="google-login-button"
          >
            <img src={GoogalLogo} alt='Google' className='google-icon' />
            Continue with Google
          </button>

          <p className="signup-text">
            Don't have an account?
            <span 
              onClick={() => (window.location.href = '/register')} 
              className="signup-link"
            >
              Sign up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default UserLogin;
