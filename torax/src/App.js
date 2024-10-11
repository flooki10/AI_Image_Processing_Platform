import React from "react";
import './App.css';
import Navbar from './components/Navbar';
import Main from "./components/Main";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="App">
      <Navbar />
      <Main />
      <footer className="footer"> 
        <Footer />
      </footer>
      
    </div>
    
    
  );
}
