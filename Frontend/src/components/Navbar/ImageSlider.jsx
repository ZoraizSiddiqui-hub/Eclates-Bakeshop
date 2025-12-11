import React, { useEffect, useState } from 'react';
import './ImageSlider.css';
import cake1 from '../../assets/cake1.png';
import cake2 from '../../assets/cake2.png';
import cake3 from '../../assets/cake3.png';
import cake4 from '../../assets/cake4.png';
const images = [cake1, cake2, cake3, cake4];


const ImageSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => {
    setCurrent(index);
  };

  return (
    <div className="slider-container">
      <div className="slider">
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`slide-${index}`}
            className={`slide ${index === current ? 'active' : ''}`}
          />
        ))}
      </div>
      <div className="dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === current ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
