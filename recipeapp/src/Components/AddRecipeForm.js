import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './AddRecipeForm.css';

const AddRecipeForm = ({ onAdd, onDismiss }) => {
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [ingredients, setIngredients] = useState([{ quantity: '', item: '' }]);
  const [instructions, setInstructions] = useState(['']);

  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index][field] = value;
    setIngredients(updatedIngredients);
  };

  const handleInstructionChange = (index, value) => {
    const updatedInstructions = [...instructions];
    updatedInstructions[index] = value;
    setInstructions(updatedInstructions);
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { quantity: '', item: '' }]);
  };

  const handleAddInstruction = () => {
    setInstructions([...instructions, '']);
  };

  const handleRemoveIngredient = (index) => {
    const updatedIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(updatedIngredients);
  };

  const handleRemoveInstruction = (index) => {
    const updatedInstructions = instructions.filter((_, i) => i !== index);
    setInstructions(updatedInstructions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && image.trim()) {
      const newRecipe = {
        id: uuidv4(),
        name,
        image,
        ingredients,
        instructions,
      };
      onAdd(newRecipe);
      setName('');
      setImage('');
      setIngredients([{ quantity: '', item: '' }]);
      setInstructions(['']);
    } else {
      alert('Enter a name and an image URL for the recipe.');
    }
  };

  return (
    <form className="add-recipe-form" onSubmit={handleSubmit}>
      <h2>Add New Recipe</h2>
      <input
        type="text"
        placeholder="Recipe Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Image URL"
        value={image}
        onChange={(e) => setImage(e.target.value)}/>
      <h3>Ingredients</h3>
      {ingredients.map((ingredient, index) => (
        <div key={index} className="ingredient">
          <input type="text" placeholder="Quantity"
            value={ingredient.quantity}
            onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}/>
          <input
            type="text"
            placeholder="Item"
            value={ingredient.item}
            onChange={(e) => handleIngredientChange(index, 'item', e.target.value)}
          />
          <button type="button" onClick={() => handleRemoveIngredient(index)}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={handleAddIngredient}>
        Add Ingredient
      </button>
      <h3>Instructions</h3>
      {instructions.map((instruction, index) => (
        <div key={index} className="instruction">
          <input
            type="text"
            placeholder="Instruction"
            value={instruction}
            onChange={(e) => handleInstructionChange(index, e.target.value)}
          />
          <button type="button" onClick={() => handleRemoveInstruction(index)}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={handleAddInstruction}>
        Add Instruction
      </button>
      <button type="submit">Save Recipe</button>
      <button type="button" onClick={onDismiss}>Dismiss</button>
    </form>
  );
};

export default AddRecipeForm;