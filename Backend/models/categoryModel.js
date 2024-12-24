// catecate
const db = require('../config/db');

const Category = {
  // Lấy danh sách các chuyên mục
  getCategories: (callback) => {
    const query = 'SELECT * FROM categories';
    db.query(query, callback);
  },

  // Thêm mới chuyên mục
  addCategory: (name, description, callback) => {
    const query = 'INSERT INTO categories (name, description) VALUES (?, ?)';
    db.query(query, [name, description], callback);
  },

  // Cập nhật thông tin chuyên mục
  updateCategory: (id, name, description, callback) => {
    const query = 'UPDATE categories SET name = ?, description = ? WHERE id = ?';
    db.query(query, [name, description, id], callback);
  },

  // Xóa chuyên mục
  deleteCategory: (id, callback) => {
    const query = 'DELETE FROM categories WHERE id = ?';
    db.query(query, [id], callback);
  },
};

module.exports = Category;
