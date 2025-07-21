
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const Database = require('better-sqlite3');
const db = new Database(process.env.DB_PATH || './calculator.db');
const app = express();

app.use(cors());
app.use(express.json());

db.exec(`CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  department TEXT,
  category TEXT,
  name TEXT,
  price INTEGER
)`);


// 批次查詢是否有重複（以 department, category, name 為依據）
app.post('/api/items/check-duplicates', (req, res) => {
  const items = req.body.items; // [{department, category, name}]
  const duplicates = [];

  for (const item of items) {
    const found = db.prepare(
      'SELECT * FROM items WHERE department=? AND category=? AND name=?'
    ).get(item.department, item.category, item.name);

    if (found) {
      duplicates.push(item);
    }
  }
  res.json({ duplicates }); // 回傳重複的陣列
});



// 查詢全部
app.get('/api/items', (req, res) => {
  const items = db.prepare('SELECT * FROM items').all();
  res.json(items);
});

// 查詢單筆
app.get('/api/items/:id', (req, res) => {
  const item = db.prepare('SELECT * FROM items WHERE id = ?').get(req.params.id);
  res.json(item);
});

// 新增
app.post('/api/items', (req, res) => {
  const { department, category, name, price } = req.body;
  db.prepare('INSERT INTO items (department, category, name, price) VALUES (?, ?, ?, ?)')
    .run(department, category, name, price);
  res.json({ success: true });
});

// 更新
app.put('/api/items/:id', (req, res) => {
  const { department, category, name, price } = req.body;
  db.prepare('UPDATE items SET department=?, category=?, name=?, price=? WHERE id=?')
    .run(department, category, name, price, req.params.id);
  res.json({ success: true });
});

// 刪除
app.delete('/api/items/:id', (req, res) => {
  db.prepare('DELETE FROM items WHERE id=?').run(req.params.id);
  res.json({ success: true });
});

// 讀取 .env 設定的 port，沒有就 3001
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));


