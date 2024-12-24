const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// Định nghĩa các route liên quan đến bình luận
router.get('/', commentController.getComments); // Lấy danh sách bình luận
router.post('/', commentController.createComment); // Thêm bình luận
router.put('/:id', commentController.updateComment); // Cập nhật bình luận
router.delete('/:id', commentController.deleteComment); // Xóa bình luận

module.exports = router;
