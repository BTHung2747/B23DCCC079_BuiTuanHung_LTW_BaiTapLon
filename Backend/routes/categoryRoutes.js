const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Lấy danh sách chuyên mục
router.get('/', categoryController.getCategories);

// Thêm chuyên mục mới
router.post('/', categoryController.addCategory);

// Cập nhật chuyên mục
router.put('/:id', categoryController.updateCategory);  // Đảm bảo sử dụng `:id`

// Xóa chuyên mục
router.delete('/:id', categoryController.deleteCategory);  // Đảm bảo sử dụng `:id`

module.exports = router;
