import React, { useState, useEffect } from 'react';
import Recipe from './Components/Recipe';
import './App.css'; 
import { v4 as uuidv4 } from 'uuid';

const App = () => {
  const [recipes, setRecipes] = useState([]);
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newRecipeName, setNewRecipeName] = useState('');
  const [newRecipeIngredients, setNewRecipeIngredients] = useState([]);
  const [newRecipeInstructions, setNewRecipeInstructions] = useState([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [newInstruction, setNewInstruction] = useState('');
  const [showAddRecipeForm, setShowAddRecipeForm] = useState(false);

  const addRecipe = () => {
    const newRecipe = {
      id: uuidv4(),
      name: newRecipeName,
      image: '',
      ingredients: newRecipeIngredients,
      instructions: newRecipeInstructions, };
    setRecipes([...recipes, newRecipe]);
    setNewRecipeName('');
    setNewRecipeIngredients([]);
    setNewRecipeInstructions([]);
    setShowAddRecipeForm(false);};

  const addIngredient = () => {
    setNewRecipeIngredients([...newRecipeIngredients, { item: newIngredient }]);
    setNewIngredient('');};

  const addInstruction = () => {
    setNewRecipeInstructions([...newRecipeInstructions, newInstruction]);
    setNewInstruction('');};

  const editRecipe = (updatedRecipe) => {
    setRecipes(recipes.map(recipe => recipe.id === updatedRecipe.id ? updatedRecipe : recipe));
  };

  const deleteRecipe = (id) => {
    setRecipes(recipes.filter(recipe => recipe.id !== id));
    setCurrentRecipeIndex(prevIndex => (prevIndex === recipes.length - 1 ? prevIndex - 1 : prevIndex));
  };

  const nextRecipe = () => {
    if (currentRecipeIndex < recipes.length - 1) {
      setCurrentRecipeIndex(currentRecipeIndex + 1);
    }};

  const previousRecipe = () => {
    if (currentRecipeIndex > 0) {
      setCurrentRecipeIndex(currentRecipeIndex - 1);
    }};

  useEffect(() => {
    fetch('/DB.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response error');
        }
        return response.json();})
      .then(data => {
        const recipesWithIds = data.recipes.map(recipe => ({
          ...recipe,
          id: uuidv4(),}));
        setRecipes(recipesWithIds);
        setLoading(false);})
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error);
        setLoading(false);});
  }, []);

  if (loading) {
    return <div>Loading...</div>;}

  if (error) {
    return <div>Error: {error.message}</div>;}

  if (recipes.length === 0) {
    return <div>No recipes available.</div>;}

  return (
    <div className="app">
      <h1>Recipe Book</h1>
      <div className="buttons-container">
        <button onClick={previousRecipe} disabled={currentRecipeIndex === 0}>Back</button>
        <button onClick={nextRecipe} disabled={currentRecipeIndex === recipes.length - 1}>Next</button>
        <button onClick={() => setShowAddRecipeForm(!showAddRecipeForm)}>Add Recipe</button>
      </div>
      {showAddRecipeForm && (
        <div className="add-recipe-form">
          <input type="text" value={newRecipeName}
            onChange={(e) => setNewRecipeName(e.target.value)}
            placeholder="New Recipe Name"/>
          <div>
            <input type="text" value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              placeholder="New Ingredient"/>
            <button onClick={addIngredient}>Add Ingredient</button>
          </div>
          <div>
            <input type="text" value={newInstruction}
              onChange={(e) => setNewInstruction(e.target.value)}
              placeholder="New Instruction"/>
            <button onClick={addInstruction}>Add Instruction</button>
          </div>
          <button onClick={addRecipe}>Save Recipe</button>
        </div>
      )}
      <Recipe
        recipe={recipes[currentRecipeIndex]}
        onEdit={editRecipe}
        onDelete={deleteRecipe}/>
    </div>
  );
};

export default App;