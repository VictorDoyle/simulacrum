import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header>
      <h1>Shop Logo </h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/product"> Product </Link>
        <Link to="/about"> About </Link>
        <Link to="/cart">Cart</Link>
      </nav>
    </header>
  );
};

export default Header;
