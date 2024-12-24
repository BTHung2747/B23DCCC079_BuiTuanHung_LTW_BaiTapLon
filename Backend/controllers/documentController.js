const Document = require('../models/documentModel');

// Lấy danh sách tài liệu
const getDocuments = (req, res) => {
  Document.getDocuments((err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching documents', error: err.message });
    }
    res.json({ documents: results });
  });
};

// Lấy tài liệu theo ID
const getDocumentById = (req, res) => {
  const { id } = req.params;
  Document.getDocumentById(id, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching document', error: err.message });
    }
    if (!result) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.json({ document: result });
  });
};

// Upload tài liệu
const uploadDocument = (req, res) => {
  const { title, description, category_id, user_id } = req.body; // Đảm bảo nhận đúng category_id và user_id
  const file = req.files?.file ? req.files.file[0] : null;
  const imageFile = req.files?.image ? req.files.image[0] : null;

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  console.log("Received Data:", { title, description, category_id, user_id, file, imageFile });

  const filePath = `/uploads/documents/${file.filename}`;
  const imagePath = imageFile ? `/uploads/images/${imageFile.filename}` : null;

  Document.uploadDocument(title, description, filePath, imagePath, category_id, user_id, (err, result) => {
    if (err) {
      console.error("Error uploading document:", err);
      return res.status(500).json({ message: 'Error uploading document', error: err.message });
    }
    res.status(201).json({ message: 'Document uploaded successfully', documentId: result.insertId });
  });
};




// Cập nhật tài liệu
const updateDocument = (req, res) => {
  const { id } = req.params;
  const { title, description, categoryId } = req.body;
  const imageFile = req.files?.image; // Trường hợp có file ảnh

  const imagePath = imageFile ? `/uploads/images/${imageFile[0].filename}` : null;

  Document.updateDocument(id, title, description, categoryId, imagePath, (err, result) => {
    if (err) {
      if (err.message === 'Document not found') {
        return res.status(404).json({ message: 'Document not found' });
      }
      return res.status(500).json({ message: 'Error updating document', error: err.message });
    }
    res.json({ message: 'Document updated successfully' });
  });
};

// Xóa tài liệu
const deleteDocument = (req, res) => {
  const { id } = req.params;

  Document.deleteDocument(id, (err, result) => {
    if (err) {
      if (err.message === 'Document not found') {
        return res.status(404).json({ message: 'Document not found' });
      }
      return res.status(500).json({ message: 'Error deleting document', error: err.message });
    }
    res.json({ message: 'Document deleted successfully' });
  });
};

module.exports = { getDocuments, getDocumentById, uploadDocument, updateDocument, deleteDocument };
