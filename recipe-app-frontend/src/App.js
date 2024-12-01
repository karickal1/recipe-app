import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "./components/NavBar";
import RecipeCard from "./components/RecipeCard";
import RecipeModal from "./components/RecipeModal";
import SearchBar from "./components/SearchBar";
import "./App.css";

const App = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem("favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(
          `https://api.spoonacular.com/recipes/random`,
          {
            params: {
              apiKey: process.env.REACT_APP_SPOONACULAR_API_KEY,
              number: 10,
            },
          }
        );
        setRecipes(response.data.recipes);
        setFilteredRecipes(response.data.recipes);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const handleSearch = (query) => {
    const lowerCaseQuery = query.toLowerCase();
    const filtered = recipes.filter((recipe) => {
      const titleMatch = recipe.title.toLowerCase().includes(lowerCaseQuery);
      const summaryMatch = recipe.summary
        ? recipe.summary.toLowerCase().includes(lowerCaseQuery)
        : false;

      return titleMatch || summaryMatch;
    });
    setFilteredRecipes(filtered);
  };

  const toggleFavorite = (recipe) => {
    const isFavorite = favorites.some((fav) => fav.id === recipe.id);
    if (isFavorite) {
      setFavorites(favorites.filter((fav) => fav.id !== recipe.id));
    } else {
      setFavorites([...favorites, recipe]);
    }
  };

  const handleRecipeClick = async (recipeId) => {
    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/${recipeId}/information`,
        {
          params: {
            apiKey: process.env.REACT_APP_SPOONACULAR_API_KEY,
          },
        }
      );
      setSelectedRecipe(response.data);
    } catch (error) {
      console.error("Error fetching recipe details:", error);
    }
  };

  const renderRecipes = () => {
    const recipesToDisplay = activeTab === "favorites" ? favorites : filteredRecipes;
    return (
      <div className="recipe-list">
        {recipesToDisplay.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            isFavorite={favorites.some((fav) => fav.id === recipe.id)}
            onToggleFavorite={() => toggleFavorite(recipe)}
            onRecipeClick={() => handleRecipeClick(recipe.id)}
          />
        ))}
      </div>
    );
  };

  const handleHomeClick = () => {
    window.location.reload();
  };

  return (
    <div className="app">
      <NavBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onHomeClick={handleHomeClick}
      />
      <div className="content">
        {loading ? (
          <p>Loading recipes...</p>
        ) : (
          <>
            <SearchBar onSearch={handleSearch} />
            {activeTab === "favorites" && favorites.length === 0 && (
              <p>You have no favorite recipes yet.</p>
            )}
            {renderRecipes()}
          </>
        )}
        {selectedRecipe && (
          <RecipeModal
            recipe={selectedRecipe}
            onClose={() => setSelectedRecipe(null)}
          />
        )}
      </div>
    </div>
  );
};

export default App;
