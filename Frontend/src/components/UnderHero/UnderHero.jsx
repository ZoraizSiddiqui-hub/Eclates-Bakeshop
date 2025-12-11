import React from 'react';
import './UnderHero.css';
import cakeImage from '../../assets/food_17.png';
import cupcakeImage from '../../assets/food_18.png';

const UnderHero = () => {
  return (
    <section className="under-hero">
      <div className="under-hero__text">
        <h2>INTRODUCING OUR<br /><span>Wide Variety of Delicious Cakes</span></h2>
        <p>
          Being the quintessential representation of aesthetics and taste, a Layers dessert is consumed by the eyes well before delighting the tastebuds!<br /><br />
          A Layers dessert sweeps you away into a sweet fantasy, where your wildest dessert dreams are realized. Infused with decadent magic, every flavor dances on the palette to a sweet symphony.
        </p>
        <button className="menu-button">ECLATES MENU</button>
      </div>

      <div className="under-hero__center">
        <img src={cakeImage} alt="Chocolate Cake" className="cake-image" />
      </div>

      <div className="under-hero__right">
        <img src={cupcakeImage} alt="Cupcake" className="cupcake-image" />
      </div>
    </section>
  );
};

export default UnderHero;
