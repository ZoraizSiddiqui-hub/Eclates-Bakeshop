import React from 'react';
import './AboveFooter.css';
import { useNavigate } from 'react-router-dom';

import bestSellers from '../../assets/food_17.png';
import birthday from '../../assets/food_18.png';
import seasonal from '../../assets/food_19.png';
import custom from '../../assets/food_20.png';

const categories = [
  { name: 'Best Sellers', image: bestSellers, link: '/best-sellers' },
  { name: 'Birthday', image: birthday, link: '/birthday' },
  { name: 'Seasonal Specials', image: seasonal, link: '/seasonal-specials' },
  { name: 'Custom Orders', image: custom, link: '/custom-orders' },
];

const AboveFooter = () => {
  const navigate = useNavigate();

  return (
    <div className="above-footer">
      <h2 className="above-footer-heading">Treats for Any Occasion</h2>
      <p className="above-footer-subtext">
        We've got you covered for any holiday, special occasion, or cause for celebration.
      </p>

      <div className="card-grid">
        {categories.map((cat, index) => (
          <div
            key={index}
            className="card"
            onClick={() => navigate(cat.link)}
          >
            <div className="card-image-wrapper">
              <img src={cat.image} alt={cat.name} className="card-image" />
            </div>
            <p className="card-title">{cat.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboveFooter;
