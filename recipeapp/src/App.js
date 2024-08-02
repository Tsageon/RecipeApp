import React, { useState, useEffect } from 'react';
import Recipe from './Componets/Recipe';
import './App.css'; 

const App = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/DB.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setRecipes(data.recipes);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (recipes.length === 0) {
    return <div>No recipes available.</div>;
  }

  return (
    <div className="app">
      <h1>Recipe Book</h1>
      <div className="recipes-list">
        {recipes.map((recipe, index) => (
          <Recipe key={index} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default App;