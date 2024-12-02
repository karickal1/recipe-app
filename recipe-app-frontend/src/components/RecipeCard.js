import React from "react";
import "./RecipeCard.css";

const RecipeCard = ({ recipe, isFavorite, onToggleFavorite, onRecipeClick }) => {
  if (!recipe) return null;

  return (
    <div className="recipe-card" onClick={onRecipeClick}>
      <h3>{recipe.title}</h3>
      <button
        className={`favorite-button ${isFavorite ? "favorited" : ""}`}
        onClick={(e) => {
          e.stopPropagation(); // Prevents the card's onClick event from being triggered
          onToggleFavorite();
        }}
      >
        {isFavorite ? "Unfavorite" : "Favorite"}
      </button>
    </div>
  );
};

export default RecipeCard;
