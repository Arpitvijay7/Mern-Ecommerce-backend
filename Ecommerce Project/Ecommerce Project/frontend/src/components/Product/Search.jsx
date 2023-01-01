import React, { useState, Fragment } from "react";
import './Search.css'
import { useNavigate } from "react-router";

const Search = () => {
  const [keyword, setKeyword] = useState("");
  
  let Navigate = useNavigate()
  
  const searchSubmitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      Navigate(`/products/${keyword}`);
    } else {
      Navigate("/products");
    }
  };
  return (
    <Fragment>
      <form action="" className="searchBox" onSubmit={searchSubmitHandler}>
        <input
          type="text"
          placeholder="Search a Product ..."
          onChange={(e) => setKeyword(e.target.value)}
        />
        <input type="submit" value="Search" />
      </form>
    </Fragment>
  );
};

export default Search;
