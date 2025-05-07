import React, { useState } from 'react';
import { FiHelpCircle } from 'react-icons/fi';

/**
 * Tooltip component for displaying helpful information
 * @param {Object} props
 * @param {string} props.text - Tooltip text to display
 * @param {React.ReactNode} props.children - Element to wrap with tooltip
 * @param {string} props.position - Position of tooltip (top, right, bottom, left)
 */
const Tooltip = ({ 
  text, 
  children, 
  position = 'top',
  icon = true
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2'
  };

  return (
    <div className="relative inline-block" onMouseLeave={() => setIsVisible(false)}>
      <div 
        className="inline-flex items-center cursor-help"
        onMouseEnter={() => setIsVisible(true)}
      >
        {children}
        {icon && <FiHelpCircle className="ml-1 text-muted-foreground hover:text-primary transition-colors" size={14} />}
      </div>
      
      {isVisible && (
        <div 
          className={`
            absolute z-10 max-w-xs bg-card glass-effect backdrop-blur-md
            text-card-foreground text-sm border border-border/30
            rounded-lg py-2 px-3 shadow-lg
            ${positionClasses[position]}
          `}
        >
          <div 
            className={`
              absolute w-2 h-2 bg-card transform rotate-45 border
              ${position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1 border-t-0 border-l-0 border-border/30' : ''}
              ${position === 'right' ? 'right-full top-1/2 -translate-y-1/2 mr-1 border-t-0 border-r-0 border-border/30' : ''}
              ${position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 mb-1 border-b-0 border-r-0 border-border/30' : ''}
              ${position === 'left' ? 'left-full top-1/2 -translate-y-1/2 ml-1 border-b-0 border-l-0 border-border/30' : ''}
            `}
          />
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip; 