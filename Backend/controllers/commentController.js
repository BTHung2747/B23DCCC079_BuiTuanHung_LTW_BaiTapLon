const Comment = require('../models/commentModel');

// Lấy danh sách bình luận theo documentId
const getComments = (req, res) => {
  const { documentId } = req.query;

  if (!documentId) {
    console.error("documentId is required");
    return res.status(400).json({ message: 'documentId is required' });
  }

  Comment.getCommentsByDocumentId(documentId, (err, results) => {
    if (err) {
      console.error("Error fetching comments:", err);
      return res.status(500).json({ message: 'Error fetching comments', error: err.message });
    }
    res.json({ comments: results });
  });
};

// Thêm bình luận
const createComment = (req, res) => {
  const { documentId, userId, comment } = req.body;
  console.log("Received comment payload:", { documentId, userId, comment });

  if (!documentId || !userId || !comment) {
    console.error("All fields are required");
    return res.status(400).json({ message: 'All fields are required' });
  }

  Comment.addComment(documentId, userId, comment, (err, results) => {
    if (err) {
      console.error("Error adding comment:", err);
      return res.status(500).json({ message: 'Error adding comment', error: err.message });
    }
    res.status(201).json({ message: 'Comment added successfully', commentId: results.insertId });
  });
};

// Cập nhật bình luận
const updateComment = (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;

  if (!comment) {
    console.error("Comment is required");
    return res.status(400).json({ message: 'Comment is required' });
  }

  Comment.updateComment(id, comment, (err, results) => {
    if (err) {
      console.error("Error updating comment:", err);
      return res.status(500).json({ message: 'Error updating comment', error: err.message });
    }
    if (results.affectedRows === 0) {
      console.error("Comment not found");
      return res.status(404).json({ message: 'Comment not found' });
    }
    res.json({ message: 'Comment updated successfully' });
  });
};

// Xóa bình luận
const deleteComment = (req, res) => {
  const { id } = req.params;

  Comment.deleteComment(id, (err, results) => {
    if (err) {
      console.error("Error deleting comment:", err);
      return res.status(500).json({ message: 'Error deleting comment', error: err.message });
    }
    if (results.affectedRows === 0) {
      console.error("Comment not found");
      return res.status(404).json({ message: 'Comment not found' });
    }
    res.json({ message: 'Comment deleted successfully' });
  });
};

module.exports = { getComments, createComment, updateComment, deleteComment };
