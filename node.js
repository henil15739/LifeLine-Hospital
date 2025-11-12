const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const app = express();

app.use(express.json());

// MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',      // Use 'localhost' if running locally
    user: 'root',           // Your MySQL username
    password: '123456',     // Your MySQL password
    database: 'project'    // Your database name
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

// Register API
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;
    const password_hash = await bcrypt.hash(password, 10);
    db.query(
        'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
        [username, email, password_hash],
        (err, result) => {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ message: 'Registration successful!' });
        }
    );
});

// Login API
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.query(
        'SELECT * FROM users WHERE username = ?',
        [username],
        (err, results) => {
            if (err || results.length === 0) return res.status(400).json({ error: 'Invalid credentials' });
            const user = results[0];
            bcrypt.compare(password, user.password_hash)
                .then(match => {
                    if (match) res.json({ message: 'Login successful!' });
                    else res.status(400).json({ error: 'Invalid credentials' });
                })
                .catch(() => res.status(500).json({ error: 'Server error' }));
        }
    );
});

app.listen(3000, () => console.log('API running on port 3000'));