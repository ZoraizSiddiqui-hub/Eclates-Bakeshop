import React, { useState } from 'react';
import './CategorySlider.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const categories = [
  'Cakes',
  'Brownies',
  'Desserts',
  'Cupcakes',
  'Sundae',
  'Cookies',
  'Mini Donuts',
];

const CategorySlider = ({ foodItems }) => {
  console.log("Food items in CategorySlider:", foodItems);
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  const getImage = (category) => {
    if (!Array.isArray(foodItems)) return null;
    const items = foodItems.filter((item) => item.category === category);
    if (items.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * items.length);
    return `${import.meta.env.VITE_BACKEND_URL}/images/${items[randomIndex].image}`;
    console.log("Image URL:", url); // Debug log
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + categories.length) % categories.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % categories.length);
  };

  const getVisibleIndices = () => {
    const total = categories.length;
    return [
      (activeIndex - 2 + total) % total,
      (activeIndex - 1 + total) % total,
      activeIndex,
      (activeIndex + 1) % total,
      (activeIndex + 2) % total,
    ];
  };

  return (
    <div className="category-carousel">
      <h2 className="section-title">Our Products</h2>

      <div className="carousel-wrapper">
        <button className="carousel-arrow left" onClick={handlePrev}>
          <FaChevronLeft />
        </button>

        <div className="carousel-track">
          {getVisibleIndices().map((i, idx) => {
            const cat = categories[i];
            const image = getImage(cat);
            const position = idx - 2; // -2 to +2 relative to center
            const isActive = i === activeIndex;

            return (
              <div
                key={idx}
                className={`carousel-card position-${position} ${isActive ? 'active' : ''}`}
                onClick={() => navigate(`/menu/${cat}`)}
              >
                {image ? (
                  <img src={image} alt={cat} className="carousel-image" />
                ) : (
                  <div className="carousel-image placeholder">No Image</div>
                )}
                <p className="carousel-label">{cat}</p>
              </div>
            );
          })}
        </div>

        <button className="carousel-arrow right" onClick={handleNext}>
          <FaChevronRight />
        </button>
      </div>

      <div className="carousel-dots">
        {categories.map((_, i) => (
          <span
            key={i}
            className={`dot ${i === activeIndex ? 'active-dot' : ''}`}
            onClick={() => setActiveIndex(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default CategorySlider;
