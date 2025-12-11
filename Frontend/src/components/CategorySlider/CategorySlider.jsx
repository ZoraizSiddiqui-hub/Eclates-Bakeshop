import React, { useState } from 'react';
import './CategorySlider.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import sandwich from '../../assets/food_17.png';
import ramadan from '../../assets/food_18.png';
import appetizers from '../../assets/food_19.png';
import breakfast from '../../assets/food_20.png';
import desserts from '../../assets/food_21.png';
import drinks from '../../assets/food_22.png';
import snacks from '../../assets/food_23.png';

const categories = [
    { name: 'Sandwiches', image: sandwich, link: '/sandwiches' },
    { name: 'Ramadan', image: ramadan, link: '/ramadan' },
    { name: 'Appetizers', image: appetizers, link: '/appetizers' },
    { name: 'Breakfast', image: breakfast, link: '/breakfast' },
    { name: 'Desserts', image: desserts, link: '/desserts' },
    { name: 'Drinks', image: drinks, link: '/drinks' },
    { name: 'Snacks', image: snacks, link: '/snacks' },
];

const CategorySlider = () => {
    const [startIndex, setStartIndex] = useState(0);
    const navigate = useNavigate();

    const visibleCards = categories.slice(startIndex, startIndex + 4);

    const handleNext = () => {
        setStartIndex((prev) => (prev + 1) % categories.length);
    };

    const handlePrev = () => {
        setStartIndex((prev) =>
            (prev - 1 + categories.length) % categories.length
        );
    };

    const getVisibleCards = () => {
        const cards = [];
        for (let i = 0; i < 4; i++) {
            const index = (startIndex + i) % categories.length;
            cards.push(categories[index]);
        }
        return cards;
    };

    return (
        <div className="category-section">
            <h2 className="section-title">Our Products</h2>
            <div className="category-slider">
                <button className="arrow left" onClick={handlePrev}>
                    <FaChevronLeft />
                </button>

                <div className="slider-track">
                    {getVisibleCards().map((cat, index) => (
                        <div
                            key={index}
                            className="category-card"
                            onClick={() => navigate(cat.link)}
                        >
                            <img src={cat.image} alt={cat.name} className="card-image" />
                            <p className="card-label">{cat.name}</p>
                        </div>
                    ))}
                </div>

                <button className="arrow right" onClick={handleNext}>
                    <FaChevronRight />
                </button>
            </div>
        </div>
    );
};

export default CategorySlider;
