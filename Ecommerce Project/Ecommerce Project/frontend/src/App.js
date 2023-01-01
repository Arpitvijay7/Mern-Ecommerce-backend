import "./App.css";
import Header from "./components/layout/Header/Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WebFont from "webfontloader";
import React, { useEffect } from "react";
import Footer from "./components/layout/Footer/Footer";
import Home from "./components/Home/Home";
import Loader from "./components/layout/Loader/Loader";
import ProductDetails from "./components/Product/ProductDetails";
import Products from  "./components/Product/Products.jsx"
import Search from "./components/Product/Search.jsx"
import  Pagination from 'react-js-pagination'
import LoginSignUp from "./components/User/LoginSignUp";



function App() {
  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid sans", "Chilanka"],
      },
    });
  }, []);

  return (
    
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:Keyword" element={<Products />} />
        <Route path="/Search" element={<Search />} />
        <Route path="/login" element={<LoginSignUp />} />
        
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
