import React from 'react';

/**
 * Skeleton component for loading states
 * @param {Object} props
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.height - Height of the skeleton
 * @param {string} props.width - Width of the skeleton
 * @param {boolean} props.rounded - Whether the skeleton is rounded
 * @param {boolean} props.circle - Whether the skeleton is a circle
 */
const Skeleton = ({ 
  className = '', 
  height = 'h-6', 
  width = 'w-full', 
  rounded = true, 
  circle = false 
}) => {
  return (
    <div 
      className={`
        animate-pulse bg-primary/10 
        ${height} 
        ${width} 
        ${rounded && !circle ? 'rounded-lg' : ''} 
        ${circle ? 'rounded-full' : ''}
        ${className}
      `}
    />
  );
};

export const CardSkeleton = () => {
  return (
    <div className="bg-card glass-effect backdrop-blur-sm text-card-foreground p-6 rounded-xl border border-border/30 shadow-md">
      <Skeleton height="h-6" className="mb-4" />
      <Skeleton height="h-4" className="mb-2" />
      <Skeleton height="h-4" className="mb-2" width="w-3/4" />
      <Skeleton height="h-4" className="mb-2" width="w-1/2" />
    </div>
  );
};

export const ExerciseSkeleton = () => {
  return (
    <div className="border-b border-border/30 pb-4 last:border-0">
      <Skeleton height="h-5" className="mb-2" width="w-1/3" />
      <Skeleton height="h-4" className="mb-2" />
      <div className="flex space-x-4">
        <Skeleton height="h-8" width="w-20" rounded={true} />
        <Skeleton height="h-8" width="w-20" rounded={true} />
        <Skeleton height="h-8" width="w-24" rounded={true} />
      </div>
    </div>
  );
};

export const ChartSkeleton = () => {
  return (
    <div className="w-full">
      <Skeleton height="h-64" className="mb-2 rounded-xl" />
    </div>
  );
};

export default Skeleton; 