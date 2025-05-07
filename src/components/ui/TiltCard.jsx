import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * A card component with 3D tilt effect on hover
 */
const TiltCard = ({ 
  children, 
  className = "", 
  glareEnabled = true,
  tiltMaxAngleX = 10,
  tiltMaxAngleY = 10,
  glareColor = "rgba(255, 255, 255, 0.5)",
  perspectiveAmount = 1000,
  scale = 1.05,
  ...props 
}) => {
  const cardRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [glarePosition, setGlarePosition] = useState({ x: 0, y: 0 });

  // Handle mouse movement over the card
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    // Get card dimensions and mouse position
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Calculate rotation based on mouse position
    const rotateY = tiltMaxAngleX * (mouseX / width - 0.5) * 2;
    const rotateX = -tiltMaxAngleY * (mouseY / height - 0.5) * 2;
    
    // Update rotation state
    setRotation({ x: rotateX, y: rotateY });
    
    // Update glare position
    if (glareEnabled) {
      setGlarePosition({
        x: (mouseX / width) * 100,
        y: (mouseY / height) * 100,
      });
    }
  };

  // Handle mouse enter
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };
  
  return (
    <motion.div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: `${perspectiveAmount}px`,
        transformStyle: "preserve-3d",
      }}
      animate={{
        rotateX: rotation.x,
        rotateY: rotation.y,
        scale: isHovered ? scale : 1,
      }}
      transition={{
        type: "spring", 
        stiffness: 400, 
        damping: 25
      }}
      {...props}
    >
      {children}
      
      {glareEnabled && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, ${glareColor} 0%, rgba(255,255,255,0) 80%)`,
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.3s ease",
            mixBlendMode: "overlay",
          }}
        />
      )}
    </motion.div>
  );
};

export default TiltCard; 