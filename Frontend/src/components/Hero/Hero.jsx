import React from 'react';
import './Hero.css';
import heroVideo from '../../assets/Herovideo1.mp4'; // Adjust path if needed

const Hero = () => {
  return (
    <section className="hero-section">
      <video
        className="hero-video"
        src={heroVideo}
        autoPlay
        muted
        loop
        playsInline
      />
    </section>
  );
};

export default Hero;
