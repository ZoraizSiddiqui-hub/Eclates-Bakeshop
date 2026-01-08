import React, { useEffect } from 'react';
import './AboutUs.css';
import storyImage from '../../assets/story.png';
import chef1 from '../../assets/chef1.png';
import chef2 from '../../assets/chef2.png';

const AboutUs = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
          } else {
            entry.target.classList.remove('animate');
          }
        });
      },
      { threshold: 0.2 }
    );

    const elements = document.querySelectorAll(
      '.story-text, .story-image, .value-card'
    );
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="about-page">
      <section className="about-banner">
        <h1>About Us</h1>
      </section>

      <section className="about-tagline">
        <p>Crafting sweet memories since 2024</p>
        <p>Blending tradition with innovation to bring you premium desserts.</p>
      </section>

      {/* Story Section */}
      <section className="about-story">
        <div className="story-text hidden-left">
          <h2>Our Journey</h2>
          <p>
            What started in a small kitchen in Lahore has grown into a brand
            loved by thousands. From our very first cake to our latest
            creations, we’ve always believed in combining quality ingredients
            with passion and creativity.
          </p>
        </div>
        <div className="story-image hidden-right">
          <img src={storyImage} alt="Our Story" />
        </div>
      </section>

      {/* Mission & Values */}
      <section className="about-values">
        <h2>What We Stand For</h2>
        <div className="values-grid">
          <div className="value-card hidden-bottom">Quality Ingredients</div>
          <div className="value-card hidden-bottom">Innovation in Flavors</div>
          <div className="value-card hidden-bottom">Customer Happiness</div>
        </div>
      </section>

      {/* Team Section */}
      <section className="about-team">
        <h2>Meet Our Team</h2>
        <div className="team-grid">
          <div className="team-member">
            <img src={chef2} alt="Head Chef" />
            <p>Head Chef</p>
          </div>
          <div className="team-member">
            <img src={chef1} alt="Pastry Artist" />
            <p>Pastry Artist</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="about-stats">
        <div className="stat">10,000+ Cakes Baked</div>
        <div className="stat">5,000+ Happy Customers</div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <h2>Ready to Taste the Difference?</h2>
        <button onClick={() => (window.location.href = '/menu')}>
          Explore Our Menu
        </button>
      </section>
    </div>
  );
};

export default AboutUs;
