import React, { useState, useCallback } from "react";
import "./SearchBar.css";

const SearchBar = (props) => {
  const [term, setTerm] = useState("");

  const handleTermChange = useCallback((event) => {
    setTerm(event.target.value);
  }, []);

  const search = useCallback(() => {
    props.onSearch(term);
  }, [props.onSearch, term]);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      // Call the search function when Enter key is pressed
      search();
    }
  };

  return (
    <div className="SearchBar">
      <input placeholder="Add Track Title" onChange={handleTermChange} 
      onKeyDown={handleKeyPress}/>
      <button className="SearchButton" onClick={search}>
        SEARCH
      </button>
    </div>
  );
};

export default SearchBar;
