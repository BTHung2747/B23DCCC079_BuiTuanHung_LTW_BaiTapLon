const db = require('../config/db'); // Kết nối với cơ sở dữ liệu

const Document = {
  // Lấy danh sách tài liệu
  getDocuments: (callback) => {
    const query = 'SELECT * FROM documents';
    db.query(query, (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  },

  // Lấy tài liệu theo ID
  getDocumentById: (id, callback) => {
    const query = 'SELECT * FROM documents WHERE id = ?';
    db.query(query, [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0] || null);  // Trả về null nếu không tìm thấy tài liệu
    });
  },

  // Upload tài liệu
  uploadDocument: (title, description, filePath, imagePath, categoryId, userId, callback) => {
    console.log("Uploading document with data:", { title, description, filePath, imagePath, categoryId, userId });
    
    // Kiểm tra nếu thiếu file chính hoặc hình ảnh nếu cần thiết
    if (!filePath) {
      return callback(new Error('File không được tải lên'));
    }

    const query = 'INSERT INTO documents (title, description, file_path, image_path, category_id, user_id) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [title, description, filePath, imagePath, categoryId, userId], (err, results) => {
      if (err) {
        console.error("Database error:", err); // Log lỗi cơ sở dữ liệu
        return callback(err);
      }
      callback(null, results); // Trả lại kết quả sau khi lưu vào DB
    });
  },

  // Cập nhật tài liệu
  updateDocument: (id, title, description, categoryId, imagePath, callback) => {
    // Kiểm tra nếu thiếu thông tin bắt buộc
    if (!title || !description || !categoryId) {
      return callback(new Error('Thiếu thông tin bắt buộc để cập nhật'));
    }

    const query = 'UPDATE documents SET title = ?, description = ?, category_id = ?, image_path = ? WHERE id = ?';
    db.query(query, [title, description, categoryId, imagePath, id], (err, results) => {
      if (err) return callback(err);
      if (results.affectedRows === 0) {
        return callback(new Error('Tài liệu không tồn tại'));
      }
      callback(null, results); // Trả về kết quả sau khi cập nhật
    });
  },

  // Xóa tài liệu
  deleteDocument: (id, callback) => {
    const query = 'DELETE FROM documents WHERE id = ?';
    db.query(query, [id], (err, results) => {
      if (err) return callback(err);
      if (results.affectedRows === 0) {
        return callback(new Error('Tài liệu không tồn tại'));
      }
      callback(null, results); // Trả về kết quả sau khi xóa
    });
  },
};

module.exports = Document;
