const Rating = require('../models/ratingModel'); // Import Rating model

// Lấy tất cả đánh giá của tài liệu theo documentId
const getRatingsByDocumentId = (req, res) => {
  const { documentId } = req.params; // Lấy documentId từ URL

  console.log("Fetching ratings for documentId:", documentId); // Thêm log

  Rating.getRatingsByDocumentId(documentId, (err, ratings) => {
    if (err) {
      console.error("Error fetching ratings:", err); // Thêm log lỗi chi tiết
      return res.status(500).json({ message: 'Error fetching ratings', error: err.message });
    }
    if (ratings.length === 0) {
      console.log("No ratings found for documentId:", documentId); // Thêm log
      return res.status(404).json({ message: 'No ratings found for this document' });
    }
    res.json({ ratings });
  });
};

// Thêm đánh giá mới
const addRating = (req, res) => {
  const { documentId, userId, rating } = req.body;
  console.log("Received rating payload:", { documentId, userId, rating }); 

  if (!documentId || !userId || rating == null) {
    console.error("All fields are required"); // Thêm log lỗi chi tiết
    return res.status(400).json({ message: 'All fields are required' });
  }

  Rating.addRating(documentId, userId, rating, (err, result) => {
    if (err) {
      console.error("Error adding rating:", err); // Thêm log lỗi chi tiết
      return res.status(500).json({ message: 'Error adding rating', error: err.message });
    }
    res.status(201).json({ message: 'Rating added successfully' });
  });
};

// Cập nhật đánh giá
const updateRating = (req, res) => {
  const { id } = req.params; // Lấy ID của rating từ URL
  const { rating } = req.body; // Lấy rating mới từ body

  Rating.updateRating(id, rating, (err, result) => {
    if (err) {
      console.error("Error updating rating:", err); // Thêm log lỗi chi tiết
      return res.status(500).json({ message: 'Error updating rating', error: err.message });
    }
    res.json({ message: 'Rating updated successfully' });
  });
};

// Xóa đánh giá
const deleteRating = (req, res) => {
  const { id } = req.params; // Lấy ID của rating từ URL

  Rating.deleteRating(id, (err, result) => {
    if (err) {
      console.error("Error deleting rating:", err); // Thêm log lỗi chi tiết
      return res.status(500).json({ message: 'Error deleting rating', error: err.message });
    }
    res.json({ message: 'Rating deleted successfully' });
  });
};

module.exports = { getRatingsByDocumentId, addRating, updateRating, deleteRating };
