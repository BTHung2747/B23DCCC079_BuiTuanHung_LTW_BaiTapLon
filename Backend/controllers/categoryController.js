const Category = require('../models/categoryModel');

// Lấy danh sách chuyên mục
const getCategories = (req, res) => {
  Category.getCategories((err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching categories', error: err.message });
    }
    res.json({ categories: results });
  });
};

// Thêm chuyên mục mới
const addCategory = (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    return res.status(400).json({ message: 'Name and description are required' });
  }

  Category.addCategory(name, description, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error adding category', error: err.message });
    }
    res.status(201).json({ message: 'Category added successfully', categoryId: results.insertId });
  });
};

// Cập nhật chuyên mục
const updateCategory = (req, res) => {
  const { id } = req.params;  // Lấy id từ URL params
  const { name, description } = req.body;
  if (!name || !description) {
    return res.status(400).json({ message: 'Name and description are required' });
  }

  Category.updateCategory(id, name, description, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error updating category', error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category updated successfully' });
  });
};

// Xóa chuyên mục
const deleteCategory = (req, res) => {
  const { id } = req.params;  // Lấy id từ URL params

  if (!Number(id)) {
    return res.status(400).json({ message: 'Invalid category ID' });
  }

  Category.deleteCategory(id, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error deleting category', error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  });
};

module.exports = { getCategories, addCategory, updateCategory, deleteCategory };
