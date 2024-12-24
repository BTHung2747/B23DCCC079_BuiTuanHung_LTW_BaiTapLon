const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Kiểm tra và tạo thư mục nếu không tồn tại
const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = file.mimetype.startsWith('image') ? 'images' : 'documents';
    const fullPath = path.join(__dirname, '../uploads', uploadPath); // Chỉnh sửa lại đường dẫn
    ensureDirExists(fullPath);
    console.log(`Saving file to ${fullPath}`); // Log đường dẫn lưu trữ
    cb(null, fullPath);
  },
  filename: (req, file, cb) => {
    const filename = Date.now() + path.extname(file.originalname);
    console.log(`File saved as ${filename}`); // Log tên file
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Invalid file type. Only images and PDFs are allowed.'));
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Giới hạn tệp tối đa 10MB
  fileFilter: fileFilter
});

module.exports = upload;
