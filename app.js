const express = require('express');
const path = require('path');
const db = require('./db');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const categoriesRouter = require('./routes/categories');
const itemsRouter = require('./routes/items');

app.use('/categories', categoriesRouter);
app.use('/items', itemsRouter);

// Home route
app.get('/', async (req, res) => {
  try {
    const { rows: categories } = await db.query('SELECT * FROM categories');
    const { rows: featuredCategories } = await db.query('SELECT * FROM categories ORDER BY RANDOM() LIMIT 3');
    const { rows: featuredItems } = await db.query('SELECT * FROM items ORDER BY RANDOM() LIMIT 3');
    res.render('home', { categories, featuredCategories, featuredItems });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});