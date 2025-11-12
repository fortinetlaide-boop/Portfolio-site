const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database('./users.db', (err) => {
  if (err) console.error('Database error:', err.message);
  else console.log('Connected to SQLite database');
});

// Create users table if not exists
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT UNIQUE,
  password TEXT
)`);

// Signup route
app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json({ error: err.message });

    db.run(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hash],
      (err) => {
        if (err) return res.status(400).json({ error: 'User already exists' });
        res.json({ message: 'Signup successful!' });
      }
    );
  });
});

// Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(400).json({ error: 'User not found' });

    bcrypt.compare(password, user.password, (err, result) => {
      if (!result) return re
      
s.status(401).json({ error: 'Invalid password' });
      res.json({ message: `Welcome back, ${user.name}!` });
    });
  });
});

app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
