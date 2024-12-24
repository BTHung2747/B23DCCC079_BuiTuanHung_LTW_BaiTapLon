const db = require('../config/db'); // Kết nối cơ sở dữ liệu

const Rating = {
  // Lấy tất cả đánh giá của tài liệu theo documentId
  getRatingsByDocumentId: (documentId, callback) => {
    const query = 'SELECT * FROM ratings WHERE document_id = ?';
    db.query(query, [documentId], (err, results) => {
      if (err) {
        console.error("Error fetching ratings:", err); // Thêm log lỗi chi tiết
        callback(err, null);
        return;
      }
      callback(null, results); // Trả về danh sách đánh giá
    });
  },

  // Thêm đánh giá mới
  addRating: (documentId, userId, rating, callback) => {
    const query = 'INSERT INTO ratings (document_id, user_id, rating) VALUES (?, ?, ?)';
    db.query(query, [documentId, userId, rating], (err, results) => {
      if (err) {
        console.error("Error adding rating:", err); // Thêm log lỗi chi tiết
        callback(err, null);
        return;
      }
      callback(null, results);
    });
  },
  
  // Cập nhật đánh giá
  updateRating: (id, rating, callback) => {
    const query = 'UPDATE ratings SET rating = ? WHERE id = ?';
    db.query(query, [rating, id], (err, results) => {
      if (err) {
        console.error("Error updating rating:", err); // Thêm log lỗi chi tiết
        callback(err, null);
        return;
      }
      callback(null, results); // Trả về kết quả cập nhật
    });
  },

  // Xóa đánh giá
  deleteRating: (id, callback) => {
    const query = 'DELETE FROM ratings WHERE id = ?';
    db.query(query, [id], (err, results) => {
      if (err) {
        console.error("Error deleting rating:", err); // Thêm log lỗi chi tiết
        callback(err, null);
        return;
      }
      callback(null, results); // Trả về kết quả xóa
    });
  }
};

module.exports = Rating;
