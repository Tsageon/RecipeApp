import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import Login from './Components/Login';
import Register from './Components/Register';
import Recipe from './Components/Recipe';
import AddRecipeForm from './Components/AddRecipeForm';
import UserProfile from './Components/UserProfile';
import './App.css';


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

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (storedUser) {
      setIsAuthenticated(true);
      setLoggedInUser(storedUser);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/DB.json');
        if (!response.ok) {
          throw new Error('Network Response Error');
        }
        const data = await response.json();
        setRecipes(data.recipes); 
        setFilteredRecipes(data.recipes);  
        setCategories([...new Set(data.recipes.map(recipe => recipe.category))]); 
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

  const handleAddRecipe = async (newRecipe) => {
    try {
      const response = await fetch('http://localhost:3001/recipes', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',},
        body: JSON.stringify(newRecipe),
      });
    
      if (!response.ok) {
        throw new Error('Failed to add recipe');
      }
      const savedRecipe = await response.json();
      setRecipes(prevRecipes => [...prevRecipes, savedRecipe]);
      setFilteredRecipes(prevRecipes => [...prevRecipes, savedRecipe]);
    } catch (error) {
      console.error('Error adding recipe:', error);
    }
  };
  
  const handleUpdateRecipe = async (updatedRecipe) => {
    try {
      const response = await fetch(`http://localhost:3001/recipes/${updatedRecipe.id}`, { 
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',},
        body: JSON.stringify(updatedRecipe),
      });
      if (!response.ok) {
        throw new Error('Failed to update recipe');
      }
      const updatedData = await response.json();
      setRecipes(prevRecipes => prevRecipes.map(recipe => recipe.id === updatedRecipe.id ? updatedData : recipe));
      setFilteredRecipes(prevRecipes => prevRecipes.map(recipe => recipe.id === updatedRecipe.id ? updatedData : recipe));
    } catch (error) {
      console.error('Error updating recipe:', error);
    }};

  const handleDeleteRecipe = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/recipes/${id}`, { 
        method: 'DELETE',});
    
      if (!response.ok) {
        throw new Error('Failed to delete recipe');
      }
    
      setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== id));
      setFilteredRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== id));
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }};
  

  const nextRecipePage = () => {
    if (currentPage < Math.ceil(filteredRecipes.length / RECIPES_PER_PAGE)) {
      setCurrentPage(currentPage + 1);
    }};

  const previousRecipePage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }};

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
    <h1 className="heading">Recipe Book</h1>
    <div className="user-info">
      {loggedInUser ? (
        <p>Welcome, {loggedInUser.email}!</p>
      ) : (
        <p>Loading User Information...Awaiting Refresh</p>
      )}
    </div>
    <div className="header-buttons">
    <button className="profile-button" onClick={() => setIsProfileVisible(prev => !prev)}>
  {isProfileVisible ? 'Close Profile' : 'Profile'}
</button>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
      <button onClick={() => setIsFormVisible(true)}>Add New Recipe</button>
    </div>
    
    <div className="search-container">
      <input
        type="text"
        placeholder="Search recipes"
        className="search-input"
        value={searchQuery}
        onChange={handleSearchChange}/>
      <button className="search-button" onClick={handleSearchClick}>Search</button>
    </div>
    <div className="category-list">
      <button key="all"
        className={`category-button ${selectedCategory === 'All' ? 'selected' : ''}`}
        onClick={() => handleCategoryClick('All')}>All</button>
      {categories.map((category) => (
        <button key={category}
          className={`category-button ${selectedCategory === category ? 'selected' : ''}`}
          onClick={() => handleCategoryClick(category)}>{category}</button>
      ))}
    </div>

    {isFormVisible ? (
      <AddRecipeForm onAdd={handleAddRecipe} onDismiss={() => setIsFormVisible(false)}/>
    ) : (
      <>
        {isProfileVisible && (
          <UserProfile user={loggedInUser} onUpdate={handleLogin} onDismiss={handleDismiss}/>
        )}
        {!isProfileVisible && (
          <div>
            {currentRecipes.map(recipe => (
              <Recipe key={recipe.id} recipe={recipe}
                onEdit={handleUpdateRecipe} onDelete={handleDeleteRecipe}/>
            ))}
          </div>
        )}
        {!isFormVisible && (
          <div className="pagination-buttons">
            <button onClick={previousRecipePage} disabled={currentPage === 1}>Back</button>
            <span>
              Page {currentPage} of {Math.ceil(filteredRecipes.length / RECIPES_PER_PAGE)}
            </span>
            <button onClick={nextRecipePage}
              disabled={currentPage === Math.ceil(filteredRecipes.length / RECIPES_PER_PAGE)}>Next</button>
          </div>
        )}
      </>
    )}

    <Routes>
    <Route path="/profile" element={isAuthenticated ? <UserProfile user={loggedInUser} onUpdate={handleLogin} onDismiss={handleDismiss} /> : <Navigate to="/login" />} />
    </Routes>
  </>
) : (
  <Routes>
    <Route path="/login" element={<Login onLogin={handleLogin}/>}/>
    <Route path="/register" element={<Register/>}/>
    <Route path="*" element={<Navigate to="/login"/>}/>
  </Routes>
)} 
      </div>
    </Router>
  );
};

export default App;