const express = require('express');
const router = express.Router();
const db = require('../db');
const upload = require('../middleware/upload'); // Import multer middleware

// GET all categories
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

// GET form to create a new category
router.get('/new', (req, res) => {
  res.render('categories/new');
});

// POST to create a new category with file upload
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const { name, description } = req.body;
    const photo_url = req.file ? `/uploads/${req.file.filename}` : null;
    await db.query('INSERT INTO categories (name, description, photo_url) VALUES ($1, $2, $3)', [name, description, photo_url]);
    res.redirect('/categories');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET category details and associated items
router.get('/:id', async (req, res) => {
  try {
    const { rows: [category] } = await db.query('SELECT * FROM categories WHERE id = $1', [req.params.id]);
    if (!category) {
      return res.status(404).send('Category not found');
    }
    const { rows: items } = await db.query('SELECT * FROM items WHERE category_id = $1', [req.params.id]);
    res.render('categories/show', { category, items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET form to edit a category
router.get('/:id/edit', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM categories WHERE id = $1', [req.params.id]);
    res.render('categories/edit', { category: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST to update a category with file upload
router.post('/:id', upload.single('photo'), async (req, res) => {
  try {
    const { name, description } = req.body;
    const photo_url = req.file ? `/uploads/${req.file.filename}` : req.body.existing_photo;
    await db.query('UPDATE categories SET name = $1, description = $2, photo_url = $3 WHERE id = $4', [name, description, photo_url, req.params.id]);
    res.redirect('/categories');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET form to confirm category deletion
router.get('/:id/delete', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM categories WHERE id = $1', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).send('Category not found');
    }
    res.render('categories/delete', { category: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST to delete a category
router.post('/:id/delete', async (req, res) => {
  try {
    // Delete associated items
    await db.query('DELETE FROM items WHERE category_id = $1', [req.params.id]);

    // Delete the category
    await db.query('DELETE FROM categories WHERE id = $1', [req.params.id]);

    res.redirect('/categories');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
