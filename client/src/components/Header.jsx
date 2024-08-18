import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ isLoggedIn }) => {
  return (
    <header className="header">
      <nav className="nav">
        <Link to="/" className="nav-item">Home</Link>
        {!isLoggedIn ? (
          <Link to="/login" className="nav-item">Login</Link>
        ) : (
          <Link to="/logout" className="nav-item">Logout</Link>
        )}
      </nav>
    </header>
  );
};

export default Header;