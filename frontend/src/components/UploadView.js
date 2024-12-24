import React, { useState } from "react";
import { FaSpinner, FaUpload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import './UploadView.css';
import axios from "axios";

const UploadView = ({ categories, user }) => {
  const [formData, setFormData] = useState({
    title: "",
    category_id: "",
    description: "",
    file: null,
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("Vui lòng đăng nhập trước khi tải lên tài liệu.");
      return;
    }
    console.log("User ID:", user.id);

    const uploadData = new FormData();
    uploadData.append("title", formData.title);
    uploadData.append("category_id", formData.category_id);
    uploadData.append("description", formData.description);
    uploadData.append("file", formData.file);
    uploadData.append("image", formData.image);
    uploadData.append("user_id", user.id); // Đảm bảo user_id được truyền đúng

    // Log chi tiết về các trường dữ liệu
    for (let [key, value] of uploadData.entries()) {
      console.log(`${key}:`, value);
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/api/documents", uploadData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      console.log("Upload Response:", response.data);
      setLoading(false);
      navigate("/documents");
    } catch (error) {
      console.error("Error uploading document:", error);
      setError("Lỗi khi tải lên tài liệu. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-box">
        <h2 className="upload-title">Upload Document</h2>
        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              required
              className="form-input"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              required
              className="form-input"
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              required
              className="form-input"
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">Document File</label>
            <input
              type="file"
              required
              className="form-input-file"
              onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Cover Image</label>
            <input
              type="file"
              accept="image/*"
              required
              className="form-input-file"
              onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => window.history.back()}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="submit-btn"
            >
              {loading ? <FaSpinner className="animate-spin" /> : <FaUpload />}
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default UploadView;
