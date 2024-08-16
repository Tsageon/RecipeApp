import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import Login from './Components/Login';
import Register from './Components/Register';
import Recipe from './Components/Recipe';
import AddRecipeForm from './Components/AddRecipeForm';
import UserProfile from './Components/UserProfile';
import './App.css';
import { v4 as uuidv4 } from 'uuid';

const RECIPES_PER_PAGE = 3;

const App = () => {
  const [recipes, setRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null); // Added state
  const [isProfileVisible, setIsProfileVisible] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (storedUser) {
      setIsAuthenticated(true);
      setLoggedInUser(storedUser);
    }
  }, []);

  const handleLogin = () => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    setLoggedInUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    setLoggedInUser(null);
    setIsAuthenticated(false);
  };

  const handleAddRecipe = (recipe) => {
    setRecipes([...recipes, recipe]);
    setFilteredRecipes([...recipes, recipe]);
    setIsFormVisible(false);
    alert('Recipe Added!');
  };

  const editRecipe = (updatedRecipe) => {
    const updatedRecipes = recipes.map(recipe =>
      recipe.id === updatedRecipe.id ? updatedRecipe : recipe
    );
    setRecipes(updatedRecipes);
    setFilteredRecipes(updatedRecipes);
    alert('Recipe Updated!');
  };

  const deleteRecipe = (id) => {
    const updatedRecipes = recipes.filter(recipe => recipe.id !== id);
    setRecipes(updatedRecipes);
    setFilteredRecipes(updatedRecipes);
    if (currentPage > Math.ceil(updatedRecipes.length / RECIPES_PER_PAGE)) {
      setCurrentPage(Math.ceil(updatedRecipes.length / RECIPES_PER_PAGE));
    }
  };

  const nextRecipePage = () => {
    if (currentPage < Math.ceil(filteredRecipes.length / RECIPES_PER_PAGE)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousRecipePage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    fetch('/DB.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network Response Error');
        }
        return response.json();
      })
      .then(data => {
        const recipesWithIds = data.recipes.map(recipe => ({
          ...recipe,
          id: uuidv4(),
        }));
        setRecipes(recipesWithIds);
        setFilteredRecipes(recipesWithIds);
        setCategories([...new Set(recipesWithIds.map(recipe => recipe.category))]);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error Fetching Data:', error);
        setError(error);
        setLoading(false);
      });
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchClick = () => {
    const results = recipes.filter(recipe =>
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (results.length === 0) {
      alert('Recipe Not Found/Added Yet.');
    }
    setFilteredRecipes(results);
    setCurrentPage(1);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setFilteredRecipes(recipes);
    } else {
      setFilteredRecipes(recipes.filter((recipe) => recipe.category === category));
    }
  
    if (activeCategory === category) {
      setActiveCategory(null);
    } else {
      setActiveCategory(category);
    }
  };

  const handleDismiss = () => {
    setIsProfileVisible(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (filteredRecipes.length === 0) {
    return <div>No Recipes Available.</div>;
  }

  const startIndex = (currentPage - 1) * RECIPES_PER_PAGE;
  const currentRecipes = filteredRecipes.slice(startIndex, startIndex + RECIPES_PER_PAGE);

  return (
    <Router>
      <div className="app">
        {isAuthenticated ? (
          <>
            <h1 className='heading'>Recipe Book</h1>
            <div className="user-info">
              {loggedInUser ? (
                <p>Welcome, {loggedInUser.email}!</p>
              ) : (
                <p>Loading user Information...</p>
              )}
            </div>
            <div className="header-buttons">
              <button className='profile-button' onClick={() => setIsProfileVisible(true)}>
                <Link to="/profile">User</Link>
              </button>
              <button className="logout-button" onClick={handleLogout}>Logout</button>
              <button onClick={() => setIsFormVisible(true)}>Add New Recipe</button>
            </div>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search recipes"
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-input"/>
              <button className="search-button" onClick={handleSearchClick}>Search</button>
            </div>
            <div className="category-list">
  <button
    className={`category-button ${selectedCategory === 'All' ? 'selected' : ''}`}
    onClick={() => handleCategoryClick('All')}
  >
    All
  </button>
  {categories.map((category) => (
    <button
      key={category}
      className={`category-button ${selectedCategory === category ? 'selected' : ''}`}
      onClick={() => handleCategoryClick(category)}>
      {category}
    </button>
  ))}
            </div>
            {isFormVisible && (
              <AddRecipeForm onAdd={handleAddRecipe} onDismiss={() => setIsFormVisible(false)} />
            )}
            {isProfileVisible && (
              <UserProfile user={loggedInUser} onUpdate={handleLogin} onDismiss={handleDismiss} />
            )}
            {!isFormVisible && !isProfileVisible && (
              <div>
                {currentRecipes.map(recipe => (
                  <Recipe
                    key={recipe.id}
                    recipe={recipe}
                    onEdit={editRecipe}
                    onDelete={deleteRecipe}/>
                ))}
              </div>
            )}
            <div className="pagination-buttons">
              <button onClick={previousRecipePage} disabled={currentPage === 1}>Back</button>
              <span>Page {currentPage} of {Math.ceil(filteredRecipes.length / RECIPES_PER_PAGE)}</span>
              <button onClick={nextRecipePage} disabled={currentPage === Math.ceil(filteredRecipes.length / RECIPES_PER_PAGE)}>Next</button>
            </div>

            <Routes>
              <Route path="/profile" element={<UserProfile user={loggedInUser} onUpdate={handleLogin} onDismiss={handleDismiss} />} />
            </Routes>
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin}/>}/>
            <Route path="/register" element={<Register onRegister={handleLogin}/>}/>
            <Route path="*" element={<Navigate to="/login"/>}/>
          </Routes>
        )}
      </div>
    </Router>
  );
};

export default App;