const express = require('express');
const router = express.Router();
const db = require('../db');
const upload = require('../middleware/upload'); // Import multer middleware

// GET all items
router.get('/', async (req, res) => {
  try {
    const { rows: categories } = await db.query('SELECT * FROM categories');
    const { rows: featuredCategories } = await db.query('SELECT * FROM categories ORDER BY RANDOM() LIMIT 3');
    const { rows: featuredItems } = await db.query('SELECT * FROM items ORDER BY RANDOM() LIMIT 3');
    res.render('home', { categories, featuredCategories, featuredItems });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET form to create a new item
router.get('/new', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM categories');
    const selectedCategoryId = req.query.category_id || null;
    res.render('items/new', { categories: rows, selectedCategoryId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST to create a new item with file upload
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const { name, description, quantity, price, category_id } = req.body;
    const photo_url = req.file ? `/uploads/${req.file.filename}` : null;
    await db.query(
      'INSERT INTO items (name, description, quantity, price, category_id, photo_url) VALUES ($1, $2, $3, $4, $5, $6)',
      [name, description, quantity, price, category_id, photo_url]
    );
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

// POST to update an item with file upload
router.post('/:id', upload.single('photo'), async (req, res) => {
  try {
    const { name, description, quantity, price, category_id } = req.body;
    const photo_url = req.file ? `/uploads/${req.file.filename}` : req.body.existing_photo;
    await db.query(
      'UPDATE items SET name = $1, description = $2, quantity = $3, price = $4, category_id = $5, photo_url = $6 WHERE id = $7',
      [name, description, quantity, price, category_id, photo_url, req.params.id]
    );
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

// GET detailed information for a specific item
router.get('/:id', async (req, res) => {
  try {
    const { rows: itemRows } = await db.query(
      `SELECT items.*, categories.name AS category_name 
       FROM items 
       LEFT JOIN categories ON items.category_id = categories.id 
       WHERE items.id = $1`,
      [req.params.id]
    );
    if (itemRows.length > 0) {
      res.render('items/detail', { item: itemRows[0] });
    } else {
      res.status(404).send('Item not found');
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
