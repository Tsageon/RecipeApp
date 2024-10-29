# Recipe Application

## Overview
The Recipe Application is a full-stack app developed with **React.js** for the frontend and **JSON Server** for backend data storage. It enables users to store, manage, and access their favorite recipes efficiently.

## Features

### Pages
1. **Login Page**: Allows users to log in with their credentials.
2. **Registration Page**: Enables new users to register by providing necessary information.
3. **Home Page**: Displays a list of saved recipes.

### Recipe Features
- **Search Function**: Users can search for recipes using keywords.
- **Add Recipe**: Users can add new recipes, including details such as:
  - Recipe Name
  - Ingredients
  - Instructions
  - Category (e.g., Dessert, Main Course, Appetizer)
  - Preparation Time
  - Cooking Time
  - Servings
- **Delete Recipe**: Users can remove recipes they no longer need.
- **Update Recipe**: Users can edit the details of existing recipes.
- **Recipe Categories**: Recipes can be classified into categories (e.g., Breakfast, Lunch, Dinner).

### General Requirements
- **CRUD Operations**: Supports Create, Read, Update, and Delete functionalities for recipes.
- **JSON Server**: Utilizes JSON Server for recipe storage and management.

### Endpoints
- `GET /recipes` - Fetch all recipes
- `POST /recipes` - Add a new recipe
- `DELETE /recipes/:id` - Delete an existing recipe
- `PUT/PATCH /recipes/:id` - Update a recipe

### Additional Requirements
- **Responsive Design**: Ensures compatibility across different devices and screen sizes.
- **Validation**: Input fields are validated to prevent errors.
- **User Authentication and Authorization**: Implements authentication to secure user data.

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Tsageon/RecipeApp.git
   cd recipeapp

2. **Install the depedencies**
   ```bash
   npm install -g json-server

3. **Run the "server"**
   ```bash
   json-server --watch db.json(if the json file is in the src folder and not within another subfolder in the src folder)
   json-server --watch src/DB/db.json(if the json file is in the src folder and within another subfolder in my case)

4.  **Run The App** 
    ```bash
    npm start  
