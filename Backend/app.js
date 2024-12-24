const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');

// Cấu hình môi trường
dotenv.config();

// Import các route
const authRoutes = require('./routes/authRoutes');
const documentRoutes = require('./routes/documentRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const commentRoutes = require('./routes/commentRoutes');
const ratingRoutes = require('./routes/ratingRoutes');

// Middleware
app.use(cors());  // Cấu hình CORS cho phép yêu cầu từ các nguồn khác
app.use(express.json());  // Middleware cho phép phân tích dữ liệu JSON
app.use(express.urlencoded({ extended: true }));  // Middleware cho phép phân tích dữ liệu từ form (xử lý dữ liệu URL-encoded)

// Kiểm tra và tạo thư mục nếu không tồn tại
const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};
// Phục vụ các tệp tĩnh từ thư mục uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Static file hosting
// Phục vụ các tệp tĩnh từ thư mục uploads

// Route gốc
app.get('/', (req, res) => {
  res.status(200).send('Welcome to the Document Management System');
});

// Sử dụng các route cho các API
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/ratings', ratingRoutes);



// Lỗi 404 nếu route không tìm thấy
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found', path: req.originalUrl });
});

// Middleware xử lý lỗi
app.use((err, req, res, next) => {
  console.error(`[Error] ${err.message}`);
  res.status(err.status || 500).json({
    message: err.message,
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
});

// Cấu hình port và chạy server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
