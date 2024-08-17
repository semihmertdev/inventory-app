const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all categories
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM categories');
    res.render('categories/index', { categories: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET form to create a new category
router.get('/new', (req, res) => {
  res.render('categories/new');
});

// POST to create a new category
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    await db.query('INSERT INTO categories (name, description) VALUES ($1, $2)', [name, description]);
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

// POST to update a category
router.post('/:id', async (req, res) => {
  try {
    const { name, description } = req.body;
    await db.query('UPDATE categories SET name = $1, description = $2 WHERE id = $3', [name, description, req.params.id]);
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
    const { rows } = await db.query('SELECT COUNT(*) FROM items WHERE category_id = $1', [req.params.id]);
    if (rows[0].count > 0) {
      return res.status(400).json({ error: 'Cannot delete category with associated items' });
    }
    await db.query('DELETE FROM categories WHERE id = $1', [req.params.id]);
    res.redirect('/categories');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
