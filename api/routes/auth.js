const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query, escape } = require('../db');
const authMiddleware = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'spark-dev-secret-key-2025';

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { email, password, name, phone, role } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name are required.' });
  }

  if (!email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  try {
    const existingUsers = query(`SELECT id FROM users WHERE email = '${escape(email)}'`);
    if (existingUsers && existingUsers.length > 0) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);
    const userRole = role === 'admin' ? 'admin' : 'client';

    const insertSql = `INSERT INTO users (email, password_hash, name, phone, role) VALUES ('${escape(email)}', '${escape(passwordHash)}', '${escape(name)}', '${escape(phone)}', '${userRole}')`;
    query(insertSql);

    const users = query(`SELECT id, email, name, role FROM users WHERE email = '${escape(email)}'`);
    if (!users || users.length === 0) {
      return res.status(500).json({ error: 'Failed to retrieve registered user.' });
    }
    const user = users[0];

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({ token, user });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: err.message || 'An error occurred during registration.' });
  }
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const users = query(`SELECT id, email, password_hash, name, role FROM users WHERE email = '${escape(email)}'`);
    if (!users || users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = users[0];
    const isPasswordValid = bcrypt.compareSync(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    delete user.password_hash;

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    return res.json({ token, user });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: err.message || 'An error occurred during login.' });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, (req, res) => {
  return res.json({ user: req.user });
});

module.exports = router;
