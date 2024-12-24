import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { FaUser } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi'; // Thêm FiLogOut

const Navbar = ({ handleLogout }) => {
  const token = localStorage.getItem('token'); // Kiểm tra token trong localStorage

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo hoặc tên trang */}
        <Link to="/" className="navbar-logo">
          Hệ thống tài liệu
        </Link>
        
        {/* Menu điều hướng */}
        <div className="navbar-menu">
          <Link to="/documents" className="navbar-item">Document</Link>
          <Link to="/upload" className="navbar-item">Upload</Link>

          {/* Nếu đã đăng nhập, hiển thị icon người dùng và nút đăng xuất */}
          {token ? (
            <>
              <button onClick={handleLogout} className="navbar-logout">
                <FiLogOut />
              </button>
            </>
          ) : (
            // Nếu không có token, điều hướng đến trang đăng nhập
            <Link to="/login" className="navbar-login">
              <FaUser />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
