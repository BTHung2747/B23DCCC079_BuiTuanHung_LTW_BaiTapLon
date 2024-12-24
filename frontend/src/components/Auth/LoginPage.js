import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import './LoginPage.css';

const LoginPage = ({ setUser, setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      // Đăng nhập để lấy token
      const response = await axios.post("http://localhost:3000/api/auth/login", { email, password });
      const { token } = response.data;
      localStorage.setItem("token", token);
      setToken(token);

      // Sử dụng token để lấy thông tin người dùng
      const userResponse = await axios.get("http://localhost:3000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const user = userResponse.data;
      setUser(user);

      console.log("User:", user);
      console.log("Token:", token);

      navigate("/documents");
    } catch (err) {
      setError("Thông tin đăng nhập không hợp lệ, vui lòng thử lại.");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLoginSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Login</button>
      </form>
      <p>Không có tài khoản? <Link to="/register">Đăng ký</Link></p>
    </div>
  );
};

export default LoginPage;
