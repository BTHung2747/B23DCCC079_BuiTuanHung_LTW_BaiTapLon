const db = require('../config/db');

const Comment = {
  // Lấy bình luận của tài liệu cùng với thông tin người dùng
  getCommentsByDocumentId: (documentId, callback) => {
    const query = `
      SELECT comments.*, users.username AS user_name 
      FROM comments 
      JOIN users ON comments.user_id = users.id 
      WHERE comments.document_id = ?`;
    db.query(query, [documentId], (err, results) => {
      if (err) {
        console.error("Error fetching comments:", err);
        callback(err, null);
        return;
      }
      callback(null, results);
    });
  },

  // Thêm bình luận
  addComment: (documentId, userId, comment, callback) => {
    const query = 'INSERT INTO comments (document_id, user_id, comment) VALUES (?, ?, ?)';
    db.query(query, [documentId, userId, comment], (err, results) => {
      if (err) {
        console.error("Error adding comment:", err);
        callback(err, null);
        return;
      }
      callback(null, results);
    });
  },

  // Cập nhật bình luận
  updateComment: (id, comment, callback) => {
    const query = 'UPDATE comments SET comment = ? WHERE id = ?';
    db.query(query, [comment, id], (err, results) => {
      if (err) {
        console.error("Error updating comment:", err);
        callback(err, null);
        return;
      }
      callback(null, results);
    });
  },

  // Xóa bình luận
  deleteComment: (id, callback) => {
    const query = 'DELETE FROM comments WHERE id = ?';
    db.query(query, [id], (err, results) => {
      if (err) {
        console.error("Error deleting comment:", err);
        callback(err, null);
        return;
      }
      callback(null, results);
    });
  },
};

module.exports = Comment;
