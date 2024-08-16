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
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeCategory, setActiveCategory] = useState(null); 
  const [isProfileVisible, setIsProfileVisible] = useState(false);

  // Load user authentication state
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (storedUser) {
      setIsAuthenticated(true);
      setLoggedInUser(storedUser);
    }
  }, []);

  // Load recipes from localStorage or fetch from DB.json
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedRecipes = JSON.parse(localStorage.getItem('recipes'));
        if (storedRecipes && storedRecipes.length > 0) {
          setRecipes(storedRecipes);
          setFilteredRecipes(storedRecipes);
          setCategories([...new Set(storedRecipes.map(recipe => recipe.category))]);
        } else {
          const response = await fetch('/DB.json');
          if (!response.ok) {
            throw new Error('Network Response Error');
          }
          const data = await response.json();
          const recipesWithIds = data.recipes.map(recipe => ({
            ...recipe,
            id: uuidv4(),
          }));
          localStorage.setItem('recipes', JSON.stringify(recipesWithIds));
          setRecipes(recipesWithIds);
          setFilteredRecipes(recipesWithIds);
          setCategories([...new Set(recipesWithIds.map(recipe => recipe.category))]);
        }
      } catch (error) {
        console.error('Error Fetching Data:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
    if (!recipe.name || !recipe.image) {
      alert('Recipe must have,name and an image URL.');
      return;
    }
    const storedRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
    const updatedRecipes = [...storedRecipes, { ...recipe, id: uuidv4() }];
    localStorage.setItem('recipes', JSON.stringify(updatedRecipes));
    setRecipes(updatedRecipes);
    setFilteredRecipes(updatedRecipes);
    setIsFormVisible(false);
    alert('Recipe Added!');
  };

  const editRecipe = (updatedRecipe) => {
    const updatedRecipes = recipes.map(recipe =>
      recipe.id === updatedRecipe.id ? updatedRecipe : recipe
    );
    setRecipes(updatedRecipes);
    setFilteredRecipes(updatedRecipes);
    localStorage.setItem('recipes', JSON.stringify(updatedRecipes));
    alert('Recipe Updated!');
  };

  const deleteRecipe = (id) => {
    const updatedRecipes = recipes.filter(recipe => recipe.id !== id);
    setRecipes(updatedRecipes);
    setFilteredRecipes(updatedRecipes);
    localStorage.setItem('recipes', JSON.stringify(updatedRecipes));
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
    setActiveCategory(category === activeCategory ? null : category);
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
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
};

export default App;