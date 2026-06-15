import React from 'react';
import LogoSource from '../assets/pulsefi.png'; 

const PulseFiLogo = ({ className = "w-full h-full" }) => {
  return (
    <div className={`${className} flex items-center justify-center overflow-hidden`}>
      <img 
        src={LogoSource} 
        alt="PulseFi Premium Logo" 
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default PulseFiLogo;