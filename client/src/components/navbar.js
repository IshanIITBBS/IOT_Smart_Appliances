import React, { useState } from 'react';
import './navbar.css'; // Importing CSS for styling

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="/" className="navbar-logo">
          IoT Dashboard
        </a>
        <button className="navbar-toggle" onClick={toggleNavbar}>
          <span className="toggle-icon">&#9776;</span>
        </button>
        <div className={`navbar-links ${isOpen ? 'active' : ''}`}>
          <a href="#home" onClick={() => setIsOpen(false)}>Home</a>
          <a href="#devices" onClick={() => setIsOpen(false)}>Devices</a>
          <a href="#about" onClick={() => setIsOpen(false)}>About</a>
          <a href="#contact" onClick={() => setIsOpen(false)}>Contact</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
