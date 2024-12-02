import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext"; // Correct path to AuthContext
import "./NavBar.css";

const NavBar = ({ activeTab, setActiveTab, onHomeClick }) => {
  const { user, logout } = useContext(AuthContext);

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
      <div className="auth-buttons">
        {!user ? (
          <>
            <Link to="/login" className="auth-link">Login</Link>
            <Link to="/signup" className="auth-link">Signup</Link>
          </>
        ) : (
          <button onClick={logout} className="auth-link">Logout</button>
        )}
      </div>
    </div>
  );
};

export default NavBar;
