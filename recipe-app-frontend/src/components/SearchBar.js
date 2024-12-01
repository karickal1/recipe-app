import React, { useState, useEffect } from "react";
import "./SearchBar.css";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    onSearch(query); // Trigger search on every keystroke
  }, [query, onSearch]);

  const handleClear = () => {
    setQuery(""); // Clear the input
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search for recipes..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {query && <button onClick={handleClear} className="clear-btn">X</button>}
    </div>
  );
};

export default SearchBar;
