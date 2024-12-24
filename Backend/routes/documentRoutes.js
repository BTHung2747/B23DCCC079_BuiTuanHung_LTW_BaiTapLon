const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const upload = require('../middlewares/upload');  // Đảm bảo đường dẫn đúng đến file upload.js

// Định tuyến cho các hành động CRUD của tài liệu
router.get('/', documentController.getDocuments);  // Sử dụng controller để xử lý

router.get('/:id', documentController.getDocumentById);

// Sử dụng upload.fields() để tải lên nhiều tệp
router.post('/', upload.fields([
  { name: 'file', maxCount: 1 }, // Tải lên 1 tệp tài liệu
  { name: 'image', maxCount: 1 }     // Tải lên 1 hình ảnh
]), documentController.uploadDocument);

// Cập nhật tài liệu (tải lên hình ảnh)
router.put('/:id', upload.fields([
  { name: 'file', maxCount: 1 }, // Tải lên 1 tệp tài liệu (nếu cần)
  { name: 'image', maxCount: 1 }     // Tải lên 1 hình ảnh (nếu cần)
]), documentController.updateDocument);

// Xóa tài liệu
router.delete('/:id', documentController.deleteDocument);

module.exports = router;
