import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Components/Login';
import Register from './Components/Register';
import Recipe from './Components/Recipe';
import AddRecipeForm from './Components/AddRecipeForm';
import './App.css';
import { v4 as uuidv4 } from 'uuid';

const App = () => {
  const [recipes, setRecipes] = useState([]);
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

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
    setCurrentRecipeIndex(prevIndex => (prevIndex === recipes.length - 1 ? prevIndex - 1 : prevIndex));
  };

  const nextRecipe = () => {
    if (currentRecipeIndex < filteredRecipes.length - 1) {
      setCurrentRecipeIndex(currentRecipeIndex + 1);
    }
  };

  const previousRecipe = () => {
    if (currentRecipeIndex > 0) {
      setCurrentRecipeIndex(currentRecipeIndex - 1);
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
    setCurrentRecipeIndex(0);
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

  return (
    <Router>
      <div className="app">
        {isAuthenticated ? (
          <>
            <div className="logo-container">
              <video className="logo-video" autoPlay loop muted>
                <source src="https://cdnl.iconscout.com/lottie/premium/preview-watermark/meal-8820888-7140050.mp4" type="video/mp4" />
                Need a better browser.
              </video>
            </div>
            <h1>Recipe Book</h1>
            <div className="user-info">
              {loggedInUser ? (
                <p>Welcome, {loggedInUser.username}!</p>
              ) : (
                <p>Loading user Information...</p>
              )}
            </div>
            <div className="header-buttons">
              <button onClick={handleLogout}>Logout</button>
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
            {isFormVisible && (
              <AddRecipeForm onAdd={handleAddRecipe} onDismiss={() => setIsFormVisible(false)}/>
            )}
            {filteredRecipes.length > 0 && !isFormVisible && (
              <Recipe
                recipe={filteredRecipes[currentRecipeIndex]}
                onEdit={editRecipe}
                onDelete={deleteRecipe}/>
            )}
            <div className="pagination-buttons">
              <button onClick={previousRecipe} disabled={currentRecipeIndex === 0}>Back</button>
              <button onClick={nextRecipe} disabled={currentRecipeIndex === filteredRecipes.length - 1}>Next</button>
            </div>
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin}/>}/>
            <Route path="/register" element={<Register onRegister={handleLogin}/>}/>
            <Route path="*" element={<Navigate to="/login" />}/>
          </Routes>
        )}
      </div>
    </Router>
  );
};

export default App;