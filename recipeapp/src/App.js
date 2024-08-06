import React, { useState, useEffect } from 'react';
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

  const handleAddRecipe = (recipe) => {
    console.log('Recipe added:', recipe);
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
    <div className="app">
      <h1>Recipe Book</h1>
      <div className="buttons-container">
        <div className="search-container">
          <input type="text" placeholder="Search recipes"
            value={searchQuery} onChange={handleSearchChange}
            className="search-input"/>
          <button className="search-button" onClick={handleSearchClick}>Search</button>
        </div>
        <button onClick={() => setIsFormVisible(true)}>Add New Recipe</button>
        {isFormVisible && (
          <AddRecipeForm onAdd={handleAddRecipe} onDismiss={() => setIsFormVisible(false)}/>
        )}
        <button onClick={previousRecipe} disabled={currentRecipeIndex === 0}>Back</button>
        <button onClick={nextRecipe} disabled={currentRecipeIndex === filteredRecipes.length - 1}>Next</button>
      </div>
      {filteredRecipes.length > 0 && !isFormVisible && (
        <Recipe
          recipe={filteredRecipes[currentRecipeIndex]}
          onEdit={editRecipe}
          onDelete={deleteRecipe}/>
      )}
    </div>
  );
};

export default App;