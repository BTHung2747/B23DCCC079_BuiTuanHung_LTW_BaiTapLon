// ratingRoutes.js
const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController'); // Import controller

// Các route liên quan đến đánh giá
router.get('/:documentId', ratingController.getRatingsByDocumentId); // Lấy tất cả đánh giá của tài liệu
router.post('/', ratingController.addRating); // Thêm đánh giá mới
router.put('/:id', ratingController.updateRating); // Cập nhật đánh giá
router.delete('/:id', ratingController.deleteRating); // Xóa đánh giá

module.exports = router;
