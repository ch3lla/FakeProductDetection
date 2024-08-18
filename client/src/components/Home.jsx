import React, { useState } from 'react';
import Header from './Header';

const Home = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div>
    <Header isLoggedIn={isLoggedIn} />
      <div className="container">
        <div className="text-container">
          <h1 className="title">Fake Product Identification System</h1>
          <p className="description">
            Ensure the authenticity of your products with our state-of-the-art detection system.
          </p>
        </div>
        <div className="image-container">
          <img
            src="/illustration.png"
            alt="Product Identification"
            className="image"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
