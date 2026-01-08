import React, { useState } from 'react';
import './AboveFooter.css';
import { useNavigate } from 'react-router-dom';

import bestSellers from '../../assets/food_17.png';
import chocolateSpecials from '../../assets/food_18.png';
import customOrders from '../../assets/food_20.png';

const categories = [
  { name: 'Best Sellers', image: bestSellers, link: '/best-sellers' },
  { name: 'Chocolate Specials', image: chocolateSpecials, link: '/chocolate-specials' },
  { name: 'Custom Orders', image: customOrders, link: '/custom-orders' },
];

const AboveFooter = () => {
  const navigate = useNavigate();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="above-footer">
      <div className="card-container">
        {categories.map((cat, index) => (
          <div
            key={index}
            className={`hover-card ${hoveredIndex === index ? 'active' : hoveredIndex !== null ? 'inactive' : ''}`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => navigate(cat.link)}
          >
            <img src={cat.image} alt={cat.name} className="hover-card-image" />
            <div className={`hover-card-label ${hoveredIndex === index ? 'horizontal' : 'vertical'}`}>
              {cat.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboveFooter;
