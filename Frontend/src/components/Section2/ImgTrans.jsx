import React, { useEffect, useState, useRef } from 'react';
import './ImgTrans.css';
import videoSrc from '../../assets/viduuu.mp4';
import catpic2 from '../../assets/catpic2.png';


const ImgTrans = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!wrapperRef.current) return;

      const rect = wrapperRef.current.getBoundingClientRect();
      const percent = Math.min(
        Math.max((window.innerHeight - rect.top) / rect.height, 0),
        1
      );

      setScrollProgress(percent);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ✅ Transition starts at 45%, ends at 70%
  const transitionProgress = Math.min(Math.max((scrollProgress - 0.45) / 0.25, 0), 1);

  // ✅ Lock position only after transition completes
  const isLocked = scrollProgress >= 0.7;

  // ✅ Smooth movement toward left center
  const translateX = transitionProgress * 2;
  const translateY = transitionProgress * 50;

  // ✅ Smooth width and height reduction (no snapping)
  const width = `${100 - transitionProgress * (100 - 60)}vw`;   // from 100vw to 60vw
  const height = `${100 - transitionProgress * (100 - 70)}vh`;  // from 100vh to 70vh

  const videoStyle = {
    transform: `translate(-${translateX}%, -${translateY}%)`,
    transition: 'transform 0.2s ease-out, width 0.2s ease-out, height 0.2s ease-out',
    position: isLocked ? 'relative' : 'absolute',
    top: isLocked ? '50%' : `${transitionProgress * 50}%`,
    left: isLocked ? '30px' : `${transitionProgress * 30}px`,
    width,
    height,
    zIndex: 10,
    transformOrigin: 'center left',
  };

  const popupStyle = {
    position: 'relative',
    top: '15%',
    right: '-63%',
    transform: 'translateY(100%)', // initial off-screen position
    opacity: 0,
    animation: isLocked ? 'popupEnter 1.5s ease forwards' : 'none',
    zIndex: 9,
  };



  return (
    <div className="img-trans-wrapper" ref={wrapperRef}>
      <div className="img-trans-video-container" style={videoStyle}>
        <video
          className="img-trans-video"
          src={videoSrc}
          autoPlay
          muted
          loop
        />
      </div>
      {isLocked && (
        <div className="img-trans-popup" style={popupStyle}>
          <h2>Eclates</h2>
          <h4>BAKESHOP</h4>
          <p>Welcome to <strong>Eclates Bakeshop,</strong> where every bite is a delightful escape!

            At Eclates, we believe in the simple joy of a perfectly crafted treat. Our bakeshop is a labor of love, dedicated to creating exquisite cakes, cupcakes, cookies, and desserts that not only taste incredible but also look like a work of art.

            <br /> Whether you're celebrating a special moment or just treating yourself, our mission is to make your day a little sweeter.</p>
        </div>
      )}
      {isLocked && (
        <div className="img-trans-bridge">
          <img src={catpic2} alt="Sweet transition" />
        </div>
      )}
    </div>
    
  );
};

export default ImgTrans;
