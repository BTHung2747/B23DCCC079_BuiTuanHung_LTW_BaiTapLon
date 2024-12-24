const mysql = require('mysql2');  

// Tạo kết nối đến MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Hung350132@',
  database: 'ptit_documents',
});

// Kết nối cơ sở dữ liệu
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database');
});

module.exports = db;  // Export db để sử dụng trong các model
