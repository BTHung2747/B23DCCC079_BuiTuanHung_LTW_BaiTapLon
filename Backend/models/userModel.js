const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  findByEmail: (email, callback) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results[0]);
    });
  },

  findById: (id, callback) => {
    const query = 'SELECT id, username, email, role FROM users WHERE id = ?';
    db.query(query, [id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results[0]);
    });
  },

  createUser: (username, email, password_hash, role, callback) => {
    const query = 'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)';
    db.query(query, [username, email, password_hash, role], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  },

  comparePassword: (password, hashedPassword, callback) => {
    bcrypt.compare(password, hashedPassword, (err, isMatch) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, isMatch);
    });
  },
};

module.exports = User;
