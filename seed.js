// seed.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const categoriesData = [
  { name: 'Consoles', description: 'Various gaming consoles and systems', image_url: 'https://images.pexels.com/photos/21067/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', photo_url: 'https://images.pexels.com/photos/21067/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { name: 'Games', description: 'A variety of video games', image_url: 'http://example.com/games.jpg', photo_url: 'https://images.pexels.com/photos/7862595/pexels-photo-7862595.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { name: 'Accessories', description: 'Gaming accessories and equipment', image_url: 'http://example.com/accessories.jpg', photo_url: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { name: 'Collectibles', description: 'Gaming-themed collectible items', image_url: 'http://example.com/collectibles.jpg', photo_url: 'https://images.pexels.com/photos/1422220/pexels-photo-1422220.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { name: 'Merchandise', description: 'Gaming-related merchandise', image_url: 'http://example.com/merchandise.jpg', photo_url: 'https://images.pexels.com/photos/2356344/pexels-photo-2356344.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }
];

const itemsData = [
  { name: 'PlayStation 5', description: 'Next-gen gaming console', price: 499.99, quantity: 25, category_id: null, image_url: 'http://example.com/ps5.jpg', photo_url: 'https://images.pexels.com/photos/5961216/pexels-photo-5961216.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { name: 'Xbox Series X', description: 'New Xbox console', price: 499.99, quantity: 20, category_id: null, image_url: 'http://example.com/xbox_series_x.jpg', photo_url: 'https://images.pexels.com/photos/5626726/pexels-photo-5626726.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { name: 'The Legend of Zelda: Breath of the Wild', description: 'Action-packed open-world game', price: 59.99, quantity: 30, category_id: null, image_url: 'http://example.com/zelda.jpg', photo_url: 'https://www.nintendo.com/eu/media/images/10_share_images/portals_3/2x1_Hub_TheLegendOfZelda_ToTK_image1600w.jpg' },
  { name: 'Gaming Mouse', description: 'Ergonomic and high-precision gaming mouse', price: 49.99, quantity: 40, category_id: null, image_url: 'http://example.com/gaming_mouse.jpg', photo_url: 'https://images.pexels.com/photos/26732223/pexels-photo-26732223/free-photo-of-teknoloji-modern-cihaz-aygit.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { name: 'Limited Edition Game Controller', description: 'Special edition collectible controller', price: 79.99, quantity: 15, category_id: null, image_url: 'http://example.com/limited_edition_controller.jpg', photo_url: 'https://images.pexels.com/photos/596750/pexels-photo-596750.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { name: 'Gaming T-Shirt', description: 'Cool gaming-themed T-shirt', price: 19.99, quantity: 50, category_id: null, image_url: 'http://example.com/gaming_tshirt.jpg', photo_url: 'https://images.pexels.com/photos/2560894/pexels-photo-2560894.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { name: 'Retro Arcade Machine', description: 'Classic arcade machine with built-in games', price: 899.99, quantity: 10, category_id: null, image_url: 'http://example.com/arcade_machine.jpg', photo_url: 'https://images.pexels.com/photos/4836371/pexels-photo-4836371.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { name: 'High-Performance Gaming Headset', description: 'Noise-canceling gaming headset', price: 89.99, quantity: 25, category_id: null, image_url: 'http://example.com/gaming_headset.jpg', photo_url: 'https://www.pcworld.com/wp-content/uploads/2024/08/Wireless-gaming-headset_edited.jpg?quality=50&strip=all' }
];

async function seedDatabase() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Clear existing data
    await client.query('DELETE FROM items');
    await client.query('DELETE FROM categories');
    
    // Insert new data into categories and retrieve their IDs
    const categoryIdMap = {};
    for (const category of categoriesData) {
      const res = await client.query(
        'INSERT INTO categories(name, description, image_url, photo_url) VALUES($1, $2, $3, $4) RETURNING id',
        [category.name, category.description, category.image_url, category.photo_url]
      );
      categoryIdMap[category.name] = res.rows[0].id;
    }
    
    // Update items with the correct category IDs and insert them
    for (const item of itemsData) {
      const categoryName = getCategoryNameForItem(item.name); // Define a function to get category names for items
      item.category_id = categoryIdMap[categoryName];
      await client.query(
        'INSERT INTO items(name, description, price, quantity, category_id, image_url, photo_url) VALUES($1, $2, $3, $4, $5, $6, $7)',
        [item.name, item.description, item.price, item.quantity, item.category_id, item.image_url, item.photo_url]
      );
    }
    
    await client.query('COMMIT');
    console.log('Database seeded successfully');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error seeding database:', err);
  } finally {
    client.release();
    pool.end();
  }
}

function getCategoryNameForItem(itemName) {
  // Map item names to their category names
  const categoryMap = {
    'PlayStation 5': 'Consoles',
    'Xbox Series X': 'Consoles',
    'The Legend of Zelda: Breath of the Wild': 'Games',
    'Gaming Mouse': 'Accessories',
    'Limited Edition Game Controller': 'Collectibles',
    'Gaming T-Shirt': 'Merchandise',
    'Retro Arcade Machine': 'Collectibles',
    'High-Performance Gaming Headset': 'Accessories'
  };
  return categoryMap[itemName] || 'Unknown';
}

seedDatabase();
