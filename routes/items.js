const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all items
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT items.*, categories.name AS category_name FROM items LEFT JOIN categories ON items.category_id = categories.id');
    res.render('items/index', { items: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET form to create a new item
router.get('/new', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM categories');
    res.render('items/new', { categories: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST to create a new item
router.post('/', async (req, res) => {
  try {
    const { name, description, quantity, price, category_id } = req.body;
    await db.query('INSERT INTO items (name, description, quantity, price, category_id) VALUES ($1, $2, $3, $4, $5)', 
      [name, description, quantity, price, category_id]);
    res.redirect('/items');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET form to edit an item
router.get('/:id/edit', async (req, res) => {
  try {
    const { rows: itemRows } = await db.query('SELECT * FROM items WHERE id = $1', [req.params.id]);
    const { rows: categoryRows } = await db.query('SELECT * FROM categories');
    res.render('items/edit', { item: itemRows[0], categories: categoryRows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST to update an item
router.post('/:id', async (req, res) => {
  try {
    const { name, description, quantity, price, category_id } = req.body;
    await db.query('UPDATE items SET name = $1, description = $2, quantity = $3, price = $4, category_id = $5 WHERE id = $6', 
      [name, description, quantity, price, category_id, req.params.id]);
    res.redirect('/items');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET form to confirm item deletion
router.get('/:id/delete', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM items WHERE id = $1', [req.params.id]);
    res.render('items/delete', { item: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST to delete an item
router.post('/:id/delete', async (req, res) => {
  try {
    await db.query('DELETE FROM items WHERE id = $1', [req.params.id]);
    res.redirect('/items');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
