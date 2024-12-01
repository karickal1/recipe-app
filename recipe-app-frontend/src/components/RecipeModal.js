import React from "react";
import "./RecipeModal.css";

const RecipeModal = ({ recipe, onClose }) => {
  if (!recipe) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target.className === "modal-overlay") {
          onClose();
        }
      }}
    >
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h2>{recipe.title}</h2>
        {recipe.image && <img src={recipe.image} alt={recipe.title} />}
        <p>
          <strong>Description:</strong> {recipe.summary.replace(/<[^>]*>/g, "")}
        </p>
        <h3>Instructions</h3>
        <p
          dangerouslySetInnerHTML={{
            __html: recipe.instructions || "No instructions available.",
          }}
        ></p>
      </div>
    </div>
  );
};

export default RecipeModal;
