import React from "react";
import './App.css';
import Navbar from './components/Navbar';
import Basededatos from "./components/Basededatos";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="App">
      <Navbar />
      <Basededatos />
      <footer className="footer"> 
        <Footer />
      </footer>
      
    </div>
    
    
  );
}
