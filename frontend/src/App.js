import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomeView from "./components/HomeView";
import DocumentsView from "./components/DocumentsView";
import DocumentDetail from "./components/DocumentDetail";
import UploadView from "./components/UploadView";
import LoginPage from './components/Auth/LoginPage';
import RegisterPage from './components/Auth/RegisterPage'; 
import axios from "axios";
import "./App.css";

const API_BASE_URL = "http://localhost:3000"; // Đảm bảo rằng server của bạn đang chạy ở cổng này

const App = () => {
  const [categories, setCategories] = useState([]); // Danh mục tài liệu
  const [documents, setDocuments] = useState([]); // Danh sách tài liệu
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [selectedDocument, setSelectedDocument] = useState(null); // Tài liệu được chọn
  const [searchTerm, setSearchTerm] = useState(""); // Từ khóa tìm kiếm
  const [selectedCategory, setSelectedCategory] = useState("all"); // Danh mục được chọn
  const [user, setUser] = useState(null); // Thông tin người dùng
  const [error, setError] = useState(null); // Thông báo lỗi khi upload tài liệu
  const [token, setToken] = useState(localStorage.getItem("token")); // Lấy token từ localStorage

  useEffect(() => {
    fetchCategories();
    fetchDocuments();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/categories`);
      console.log("Dữ liệu categories nhận được:", response.data);
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error("Lỗi khi fetch categories:", error.message);
    }
  };

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/documents`);
      console.log("Dữ liệu documents nhận được:", response.data);
      setDocuments(response.data.documents || []);
    } catch (error) {
      console.error("Lỗi khi fetch documents:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadDocument = async (formData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/documents`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Tài liệu đã tải lên thành công:", response.data);
      setDocuments([...documents, response.data]); // Cập nhật tài liệu sau khi tải lên
      setError(null); // Reset lỗi nếu upload thành công
    } catch (error) {
      console.error("Lỗi khi upload tài liệu:", error.message);
      setError("Lỗi khi tải lên tài liệu. Vui lòng thử lại."); // Hiển thị lỗi nếu có
    }
  };

  const handleAddComment = async (documentId, comment) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/comments`, {
        documentId,
        userId: user.id,
        comment,
      });
      setSelectedDocument((prev) => ({
        ...prev,
        comments: [...prev.comments, response.data],
      }));
    } catch (error) {
      console.error("Lỗi khi thêm comment:", error.message);
    }
  };

  const handleAddRating = async (documentId, rating) => {
    try {
      await axios.post(`${API_BASE_URL}/api/ratings`, { documentId, userId: user.id, rating });
      const response = await axios.get(`${API_BASE_URL}/api/documents/${documentId}`);
      setSelectedDocument(response.data);
    } catch (error) {
      console.error("Lỗi khi thêm rating:", error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesCategory = selectedCategory === "all" || doc.category_id.toString() === selectedCategory;
    const matchesSearchTerm =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearchTerm;
  });

  return (
    <Router>
      <div className="App">
        <InnerApp
          categories={categories}
          documents={filteredDocuments}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedDocument={selectedDocument}
          setSelectedDocument={setSelectedDocument}
          handleUploadDocument={handleUploadDocument}
          handleAddComment={handleAddComment}
          handleAddRating={handleAddRating}
          user={user} // Truyền đối tượng user vào đây
          setUser={setUser}
          loading={loading}
          error={error} // Truyền error xuống để hiển thị
          token={token} // Truyền token để xác thực đăng nhập
          setToken={setToken} // Cập nhật token khi đăng nhập
          handleLogout={handleLogout} // Thêm hàm đăng xuất
        />
      </div>
    </Router>
  );
};

const InnerApp = ({
  categories,
  documents,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedDocument,
  setSelectedDocument,
  handleUploadDocument,
  handleAddComment,
  handleAddRating,
  user, // Nhận đối tượng user
  setUser,
  loading,
  error,
  token,
  setToken,
  handleLogout,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="App">
      {/* Hiển thị Navbar ngoại trừ trang chủ */}
      {location.pathname !== "/" && <Navbar user={user} handleLogout={handleLogout} />}
      <div className="content-container">
        {/* Hiển thị thông báo lỗi nếu có */}
        {error && <div className="error-message">{error}</div>}
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route
            path="/documents"
            element={
              <DocumentsView
                categories={categories}
                documents={documents}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                setSelectedDocument={(doc) => {
                  setSelectedDocument(doc);
                  navigate(`/documents/${doc.id}`); // Điều hướng đến trang chi tiết tài liệu
                }}
                loading={loading}
              />
            }
          />
          <Route
            path="/documents/:id"
            element={
              <DocumentDetail
                selectedDocument={selectedDocument}
                setSelectedDocument={setSelectedDocument}
                handleAddComment={handleAddComment}
                handleAddRating={handleAddRating}
                user={user} // Truyền user vào DocumentDetail
              />
            }
          />
          <Route
            path="/upload"
            element={<UploadView categories={categories} handleUploadDocument={handleUploadDocument} user={user} />} // Truyền user vào UploadView
          />
          <Route path="/login" element={<LoginPage setToken={setToken} setUser={setUser} />} /> {/* Truyền setUser vào LoginPage để cập nhật trạng thái người dùng */}
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
