const express = require('express');
const router = express.Router();
const { query, escape } = require('../db');
const authMiddleware = require('../middleware/auth');

// Protect all orders routes with auth middleware
router.use(authMiddleware);

// GET /api/orders - List orders (clients see theirs, admins see all)
router.get('/', (req, res) => {
  try {
    let sql;
    if (req.user.role === 'admin') {
      sql = `SELECT o.*, u.name AS client_name, u.email AS client_email FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC`;
    } else {
      sql = `SELECT * FROM orders WHERE user_id = ${req.user.id} ORDER BY created_at DESC`;
    }
    const orders = query(sql);
    return res.json({ orders });
  } catch (err) {
    console.error('Error fetching orders:', err);
    return res.status(500).json({ error: err.message || 'An error occurred fetching orders.' });
  }
});

// POST /api/orders - Create order (brief text)
router.post('/', (req, res) => {
  const { brief } = req.body;

  if (!brief) {
    return res.status(400).json({ error: 'Brief is required.' });
  }

  try {
    const insertSql = `INSERT INTO orders (user_id, status, brief) VALUES (${req.user.id}, 'pending', '${escape(brief)}')`;
    query(insertSql);

    // Get the newly created order
    const orders = query(`SELECT * FROM orders WHERE user_id = ${req.user.id} ORDER BY id DESC LIMIT 1`);
    if (!orders || orders.length === 0) {
      return res.status(500).json({ error: 'Failed to retrieve newly created order.' });
    }

    return res.status(201).json({ order: orders[0] });
  } catch (err) {
    console.error('Error creating order:', err);
    return res.status(500).json({ error: err.message || 'An error occurred creating order.' });
  }
});

// GET /api/orders/:id - Get order detail
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const orderId = parseInt(id, 10);

  if (isNaN(orderId)) {
    return res.status(400).json({ error: 'Invalid order ID.' });
  }

  try {
    const sql = `SELECT o.*, u.name AS client_name, u.email AS client_email FROM orders o JOIN users u ON o.user_id = u.id WHERE o.id = ${orderId}`;
    const orders = query(sql);

    if (!orders || orders.length === 0) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    const order = orders[0];

    // Access control: admins can see all, clients only see their own
    if (req.user.role !== 'admin' && order.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied. You do not have permission to view this order.' });
    }

    return res.json({ order });
  } catch (err) {
    console.error('Error fetching order details:', err);
    return res.status(500).json({ error: err.message || 'An error occurred fetching order details.' });
  }
});

// PUT /api/orders/:id - Update order (admin only: status and site_url changes)
router.put('/:id', (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin privilege required.' });
  }

  const { id } = req.params;
  const orderId = parseInt(id, 10);

  if (isNaN(orderId)) {
    return res.status(400).json({ error: 'Invalid order ID.' });
  }

  const { status, site_url } = req.body;

  try {
    const existing = query(`SELECT * FROM orders WHERE id = ${orderId}`);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    const allowedStatuses = ['pending', 'brief_received', 'in_progress', 'review', 'live'];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}` });
    }

    const updates = [];
    if (status) updates.push(`status = '${escape(status)}'`);
    if (site_url !== undefined) updates.push(`site_url = '${escape(site_url)}'`);

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields provided for update.' });
    }

    query(`UPDATE orders SET ${updates.join(', ')} WHERE id = ${orderId}`);

    const updatedOrders = query(`SELECT o.*, u.name AS client_name, u.email AS client_email FROM orders o JOIN users u ON o.user_id = u.id WHERE o.id = ${orderId}`);
    return res.json({ order: updatedOrders[0] });
  } catch (err) {
    console.error('Error updating order:', err);
    return res.status(500).json({ error: err.message || 'An error occurred updating order.' });
  }
});

// PUT /api/orders/:id/brief - Client updates their brief
router.put('/:id/brief', (req, res) => {
  const { id } = req.params;
  const orderId = parseInt(id, 10);

  if (isNaN(orderId)) {
    return res.status(400).json({ error: 'Invalid order ID.' });
  }

  const { brief } = req.body;

  if (!brief) {
    return res.status(400).json({ error: 'Brief content is required.' });
  }

  try {
    const existing = query(`SELECT * FROM orders WHERE id = ${orderId}`);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    const order = existing[0];

    // Access control: only the client who owns the order (or an admin) can update the brief
    if (req.user.role !== 'admin' && order.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied. You do not have permission to update this order.' });
    }

    query(`UPDATE orders SET brief = '${escape(brief)}' WHERE id = ${orderId}`);

    const updatedOrders = query(`SELECT o.*, u.name AS client_name, u.email AS client_email FROM orders o JOIN users u ON o.user_id = u.id WHERE o.id = ${orderId}`);
    return res.json({ order: updatedOrders[0] });
  } catch (err) {
    console.error('Error updating brief:', err);
    return res.status(500).json({ error: err.message || 'An error occurred updating the brief.' });
  }
});

module.exports = router;
