const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const register = (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  User.findByEmail(email, (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }
    if (user) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ message: 'Error hashing password', error: err.message });
      }

      User.createUser(username, email, hashedPassword, role || 'student', (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error creating user', error: err.message });
        }
        res.status(201).json({ message: 'User registered successfully' });
      });
    });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  User.findByEmail(email, (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    bcrypt.compare(password, user.password_hash, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: 'Error comparing passwords', error: err.message });
      }
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid password' });
      }

      const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ message: 'Login successful', token });
    });
  });
};

const getProfile = (req, res) => {
  const userId = req.userId;

  User.findById(userId, (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ id: user.id, username: user.username, email: user.email, role: user.role });
  });
};

const getRegister = (req, res) => {
  res.status(200).json({ message: 'Register form' });
};

const getLogin = (req, res) => {
  res.status(200).json({ message: 'Login form' });
};

module.exports = { getRegister, register, getLogin, login, getProfile };
