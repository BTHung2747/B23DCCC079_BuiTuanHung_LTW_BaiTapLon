// RegisterPage.js
import React, { useState } from 'react';
import axios from 'axios';
import './RegisterPage.css';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError('Đăng ký không thành công. Vui lòng thử lại.');
    }
  };

  return (
    <div className="register-page">
      <div className="register-form">
        <h2>Đăng ký</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>Tài khoản</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Tài khoản"
          />
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
          />
          <label>Mật khẩu</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Mật khẩu"
          />
          <button type="submit">Đăng ký</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
