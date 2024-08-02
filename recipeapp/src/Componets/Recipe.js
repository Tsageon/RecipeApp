import './Recipe.css'
import React from 'react';

const Recipe = ({ recipe }) => {
  return (
    <div className="recipe">
      <h2>{recipe.name}</h2>
      <img src={recipe.image} alt={recipe.name}/>
      <h3>Ingredients:</h3>
      <ul>
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient.quantity} of {ingredient.item}</li>
        ))}
      </ul>
      <h3>Instructions:</h3>
      <ol>
        {recipe.instructions.map((instruction, index) => (
          <li key={index}>{instruction}</li>
        ))}
      </ol>
    </div>
  );
};

export default Recipe;