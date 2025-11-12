const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data.sqlite');
const SALT_ROUNDS = 10;
const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize DB
const db = new sqlite3.Database(DB_PATH);
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    fullname TEXT,
    dob TEXT,
    gender TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    createdAt TEXT
  );`, (err) => { if (err) console.error('DB init error', err); });
});

// Register patient
app.post('/api/patient/register', async (req, res) => {
  try {
    const { username, password, fullname, dob, gender, email, phone, address } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Username and password required' });

    db.get('SELECT id FROM patients WHERE username = ?', [username], async (err, row) => {
      if (err) return res.status(500).json({ message: 'DB error' });
      if (row) return res.status(409).json({ message: 'Username already exists' });

      const hash = await bcrypt.hash(password, SALT_ROUNDS);
      const createdAt = new Date().toISOString();
      db.run(`INSERT INTO patients (username, password, fullname, dob, gender, email, phone, address, createdAt)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [username, hash, fullname || '', dob || '', gender || '', email || '', phone || '', address || '', createdAt],
        function(err2){
          if (err2) return res.status(500).json({ message: 'Insert error' });
          return res.json({ message: 'Registered', id: this.lastID });
        });
    });
  } catch(e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login patient
app.post('/api/patient/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'username and password required' });

  db.get('SELECT id, username, password, fullname, dob, gender, email, phone, address, createdAt FROM patients WHERE username = ?', [username], async (err, row) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (!row) return res.status(401).json({ message: 'Invalid username or password' });

    const match = await bcrypt.compare(password, row.password);
    if (!match) return res.status(401).json({ message: 'Invalid username or password' });

    // remove password before returning
    delete row.password;
    res.json({ patient: row });
  });
});

// Optional: serve static files if you want (adjust as needed)
// app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
