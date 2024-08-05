import './Recipe.css';
import React, { useState } from 'react';

const Recipe = ({ recipe, onEdit, onDelete }) => {
  const [showAllInstructions, setShowAllInstructions] = useState(false);
  const [editable, setEditable] = useState(false);
  const [editedRecipe, setEditedRecipe] = useState(recipe);

  const handleEdit = () => {
    if (editable) {
      onEdit(editedRecipe);
    }
    setEditable(!editable);};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedRecipe({
      ...editedRecipe,
      [name]: value,
    });
  };

  const handleInstructionChange = (index, value) => {
    const updatedInstructions = [...editedRecipe.instructions];
    updatedInstructions[index] = value;
    setEditedRecipe({
      ...editedRecipe,
      instructions: updatedInstructions,
    });
  };

  return (
    <div className="recipe">
      {editable ? (
        <input type="text" name="name"
          value={editedRecipe.name}
          onChange={handleChange}/>
      ) : (
        <h2>{recipe.name}</h2>
      )}
      {editable ? (
        <input type="text" name="image"
          value={editedRecipe.image}
          onChange={handleChange}/>
      ) : (
        <img src={recipe.image} alt={recipe.name}/>
      )}
      <h3>Ingredients:</h3>
      <ul>
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient.quantity} of {ingredient.item}</li>
        ))}
      </ul>
      <h3>Instructions:</h3>
      <ol>
        {recipe.instructions.slice(0, showAllInstructions ? recipe.instructions.length : 4).map((instruction, index) => (
          <li key={index}>
            {editable ? (
              <input type="text" value={instruction}
                onChange={(e) => handleInstructionChange(index, e.target.value)}/>
            ) : (
              instruction
            )}
          </li>
        ))}
      </ol>
      {recipe.instructions.length > 4 && (
        <button onClick={() => setShowAllInstructions(!showAllInstructions)}>
          {showAllInstructions ? 'Read Less' : 'Read More'}
        </button>
      )}
      <button onClick={handleEdit}>{editable ? 'Save' : 'Edit'}</button>
      <button onClick={() => onDelete(recipe.id)}>Delete</button>
    </div>
  );
};

export default Recipe;