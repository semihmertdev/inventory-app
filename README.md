# Game Inventory Management Application

This is a web-based application designed to help you manage a game inventory, including categories of items, individual items, and associated details. The application allows you to create, read, update, and delete categories and items, as well as view featured categories and items on the homepage.

## Features

- **Category Management**: Add, edit, delete, and view categories with associated images and descriptions.
- **Item Management**: Add, edit, delete, and view items, including details like name, description, price, quantity, and associated category.
- **Homepage**: Displays featured categories and items with randomized selection for showcasing.
- **Responsive Design**: The application is designed to be responsive, providing a good user experience on both desktop and mobile devices.
- **Confirmation Modals**: Includes confirmation prompts for deleting categories and items.

## Technologies Used

- **Node.js**: JavaScript runtime environment.
- **Express**: Web framework for Node.js.
- **EJS**: Embedded JavaScript templating engine for rendering HTML templates.
- **PostgreSQL**: Relational database for storing categories and items.
- **CSS**: Styling for the front-end, with responsive design considerations.

## Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/game-inventory-app.git
    cd game-inventory-app
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Set up the database**:
    - Create a PostgreSQL database and configure the connection string in a `.env` file at the root of your project:
    ```plaintext
    DATABASE_URL=your_database_url_here
    ```
    - Seed the database with initial data:
    ```bash
    node seed.js
    ```

4. **Run the application**:
    ```bash
    npm start
    ```
    The application will be available at `http://localhost:3001`.

## Usage

- **Homepage**: Displays featured categories and items.
- **Categories Page**: View all categories, add new categories, edit or delete existing categories.
- **Items Page**: View all items, add new items, edit or delete existing items.
- **Category Details**: View a specific category and the items associated with it.

## File Structure

- `app.js`: Main application file, sets up the Express server and routes.
- `db.js`: Handles PostgreSQL database connection.
- `seed.js`: Seeds the database with initial data.
- `views/`: Contains all the EJS templates for rendering HTML.
- `public/`: Contains static files like CSS and JavaScript.
- `routes/`: Contains the route handlers for categories and items.
- `.env`: Environment variables configuration file.

## Deployment

The application can be deployed to any platform that supports Node.js, such as Heroku or Koyeb. For deployment on Koyeb:

1. Push your code to a Git repository.
2. Create a new application in Koyeb and connect it to your Git repository.
3. Set up your environment variables in the Koyeb dashboard.
4. Deploy the application.
