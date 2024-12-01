import React from "react";
import "./NavBar.css";

const NavBar = ({ activeTab, setActiveTab, onHomeClick }) => {
  return (
    <div className="navbar">
      <button className="logo" onClick={onHomeClick}>
        Recipe App
      </button>
      <div className="tabs">
        <button
          className={`tab ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          All Recipes
        </button>
        <button
          className={`tab ${activeTab === "favorites" ? "active" : ""}`}
          onClick={() => setActiveTab("favorites")}
        >
          Favorites
        </button>
      </div>
    </div>
  );
};

export default NavBar;
