import React from "react";
import './App.css';
import Navbar from './components/Navbar';
import Home from "./components/Home";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="App">
      <Navbar />
      <Home />
      <footer class="footer"> 
        <Footer />
      </footer>
      
    </div>
    
    
  );
}
