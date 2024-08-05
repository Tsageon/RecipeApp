import React, { useState } from 'react';
import './Recipe.css';

const Recipe = ({ recipe, onEdit, onDelete }) => {
  const [showAllInstructions, setShowAllInstructions] = useState(false);
  const [editable, setEditable] = useState(false);
  const [editedRecipe, setEditedRecipe] = useState(recipe);
  const [newIngredient, setNewIngredient] = useState({ quantity: '', item: '' });
  const [newInstruction, setNewInstruction] = useState('');

  const handleEdit = () => {
    if (editable) {
      onEdit(editedRecipe);
    }
    setEditable(!editable);
  };

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

  const handleAddIngredient = () => {
    if (newIngredient.quantity && newIngredient.item) {
      setEditedRecipe({
        ...editedRecipe,
        ingredients: [...editedRecipe.ingredients, newIngredient],
      });
      setNewIngredient({ quantity: '', item: '' });
      alert('Ingredient added!');
    } else {
      alert('Please enter both quantity and item.');
    }
  };

  const handleAddInstruction = () => {
    if (newInstruction) {
      setEditedRecipe({
        ...editedRecipe,
        instructions: [...editedRecipe.instructions, newInstruction],
      });
      setNewInstruction('');
      alert('Instruction added!');
    } else {
      alert('Please enter an instruction.');
    }
  };

  return (
    <div className="recipe">
      {editable ? (
        <input type="text" name="name" value={editedRecipe.name} onChange={handleChange} />
      ) : (
        <h2>{recipe.name}</h2>
      )}
      {editable ? (
        <input type="text" name="image" value={editedRecipe.image} onChange={handleChange} />
      ) : (
        <img src={recipe.image} alt={recipe.name} />
      )}
      <h3>Ingredients:</h3>
      <ul>
        {editedRecipe.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient.quantity} of {ingredient.item}</li>
        ))}
      </ul>
      {editable && (
        <div className="add-ingredient">
          <input
            type="text"
            placeholder="Quantity"
            value={newIngredient.quantity}
            onChange={(e) => setNewIngredient({ ...newIngredient, quantity: e.target.value })}
          />
          <input
            type="text"
            placeholder="Item"
            value={newIngredient.item}
            onChange={(e) => setNewIngredient({ ...newIngredient, item: e.target.value })}
          />
          <button onClick={handleAddIngredient}>Add Ingredient</button>
        </div>
      )}
      <h3>Instructions:</h3>
      <ol>
        {editedRecipe.instructions.slice(0, showAllInstructions ? editedRecipe.instructions.length : 4).map((instruction, index) => (
          <li key={index}>
            {editable ? (
              <input
                type="text"
                value={instruction}
                onChange={(e) => handleInstructionChange(index, e.target.value)}
              />
            ) : (
              instruction
            )}
          </li>
        ))}
      </ol>
      {editedRecipe.instructions.length > 4 && (
        <button onClick={() => setShowAllInstructions(!showAllInstructions)}>
          {showAllInstructions ? 'Read Less' : 'Read More'}
        </button>
      )}
      {editable && (
        <div className="add-instruction">
          <input
            type="text"
            placeholder="New Instruction"
            value={newInstruction}
            onChange={(e) => setNewInstruction(e.target.value)}
          />
          <button onClick={handleAddInstruction}>Add Instruction</button>
        </div>
      )}
      <button onClick={handleEdit}>{editable ? 'Save' : 'Edit'}</button>
      <button onClick={() => onDelete(recipe.id)}>Delete</button>
    </div>
  );
};

export default Recipe;