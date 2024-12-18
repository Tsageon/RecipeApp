import React, { useState, useEffect } from 'react';
import './Recipe.css';
import Loader from './loader';
import Swal from 'sweetalert2';

const Recipe = ({ recipe, onEdit, onDelete }) => {
  const [showAllInstructions, setShowAllInstructions] = useState(false);
  const [editable, setEditable] = useState(false);
  const [editedRecipe, setEditedRecipe] = useState(recipe);
  const [newIngredient, setNewIngredient] = useState({ quantity: '', item: '' });
  const [newInstruction, setNewInstruction] = useState('');

  useEffect(() => {
    if (recipe) {
      setEditedRecipe(recipe);
    }
  }, [recipe]);

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

  const handleIngredientChange = (index, e) => {
    const { name, value } = e.target;
    const updatedIngredients = [...editedRecipe.ingredients];
    updatedIngredients[index][name] = value;
    setEditedRecipe({
      ...editedRecipe,
      ingredients: updatedIngredients,
    });
  };

  const handleAddIngredient = () => {
    if (newIngredient.quantity && newIngredient.item) {
      setEditedRecipe({
        ...editedRecipe,
        ingredients: [...editedRecipe.ingredients, newIngredient],
      });
      setNewIngredient({ quantity: '', item: '' });
  
      Swal.fire({
        icon: 'success',
        title: 'Ingredient Added!',
        text: 'The ingredient has been successfully added to the recipe.',
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Enter Both Quantity and Item',
        text: 'Please fill in both the quantity and item fields before adding.',
      });
    }
  };
  
  const handleAddInstruction = () => {
    if (newInstruction) {
      setEditedRecipe({
        ...editedRecipe,
        instructions: [...editedRecipe.instructions, newInstruction],
      });
      setNewInstruction('');
  
      Swal.fire({
        icon: 'success',
        title: 'Instruction Added!',
        text: 'Your new instruction has been added to the recipe.',
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Enter An Instruction',
        text: 'Please enter an instruction before adding.',
      });
    }
  };
  
  if (!recipe) {
    return <Loader />;
  }

  return (
    <div className="recipe">
      {editable ? (
        <input
          type="text"
          name="name"
          className='input'
          value={editedRecipe.name}
          onChange={handleChange}/>
      ) : (
        <h2>{recipe.name}</h2>
      )}
      {editable ? (
        <input
          type="text"
          name="image"
          className='input'
          value={editedRecipe.image}
          onChange={handleChange}/>
      ) : (
        <img src={recipe.image} alt={recipe.name}/>
      )}

      {editable ? (
        <>
          <input
            type="text"
            name="category"
            className='input'
            placeholder="Category"
            value={editedRecipe.category}
            onChange={handleChange}/>
          <input
            type="text"
            name="prepTime"
            className='input'
            placeholder="Prep Time"
            value={editedRecipe.prepTime}
            onChange={handleChange}/>
          <input
            type="text"
            className='input'
            name="servingTime"
            placeholder="Serving Time"
            value={editedRecipe.servingTime}
            onChange={handleChange}/>
          <input
            type="number"
            name="servings"
            className='input'
            placeholder="Servings"
            value={editedRecipe.servings}
            onChange={handleChange}/>
        </>
      ) : (
        <p>
          {recipe.category} | Prep: {recipe.prepTime} | Serve: {recipe.servingTime} | Servings: {recipe.servings}
        </p>
      )}

      <h3>Ingredients</h3>
      <ul>
        {editable ? (
          <>
            {editedRecipe.ingredients.map((ingredient, index) => (
              <li key={index}>
                <input
                  type="text"
                  name="quantity"
                  className='input'
                  value={ingredient.quantity}
                  onChange={(e) => handleIngredientChange(index, e)}
                  placeholder="Quantity"/>
                <input
                  type="text"
                  name="item"
                  className='input'
                  value={ingredient.item}
                  onChange={(e) => handleIngredientChange(index, e)}
                  placeholder="Item"/>
              </li>
            ))}
            <button onClick={handleAddIngredient}>Add Ingredient</button>
            <input
              className='input'
              type="text"
              value={newIngredient.quantity}
              onChange={(e) => setNewIngredient({...newIngredient, quantity: e.target.value })}
              placeholder="New Quantity"/>
            <input
              type="text"
              className='input'
              value={newIngredient.item}
              onChange={(e) => setNewIngredient({...newIngredient, item: e.target.value })}
              placeholder="New Item"/>
          </>
        ) : (
          editedRecipe.ingredients.map((ingredient, index) => (
            <li key={index}>
              {ingredient.quantity} {ingredient.item}
            </li>
          ))
        )}
      </ul>

      {showAllInstructions && (
        <>
          <h3>Instructions</h3>
          <ol>
            {editable ? (
              <>
                {editedRecipe.instructions.map((instruction, index) => (
                  <li key={index}>
                    <textarea
                      value={instruction}
                      onChange={(e) => handleInstructionChange(index, e.target.value)}
                      placeholder={`Instruction ${index + 1}`}/>
                  </li>
                ))}
                <button onClick={handleAddInstruction}>Add Instruction</button>
                <input className='input'
                  type="text"
                  placeholder="New Instruction"
                  value={newInstruction} onChange={(e) => setNewInstruction(e.target.value)}/>
              </>
            ) : (
              editedRecipe.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))
            )}
          </ol>
        </>
      )}

      <button onClick={handleEdit}>
        {editable ? 'Save Changes' : 'Edit'}
      </button>
      <button onClick={() => onDelete(recipe.id)}>Delete</button>
      {editable && (
        <button onClick={() => setEditable(false)}>Cancel</button>
      )}
    <button onClick={() => setShowAllInstructions(!showAllInstructions)}> {showAllInstructions ? 'Show Less' : 'Read More'}</button>
    </div>
  );
};

export default Recipe;