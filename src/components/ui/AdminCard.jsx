import React from "react";

const AdminCard = ({ 
  children, 
  title,
  className = "",
  noPadding = false,
  fullWidth = false
}) => {
  return (
    <div 
      className={`bg-card glass-effect backdrop-blur-sm text-card-foreground rounded-xl border border-border/30 shadow-md ${
        noPadding ? "" : "p-6"
      } ${className}`}
    >
      {title && <h2 className="text-xl font-semibold mb-6">{title}</h2>}
      {children}
    </div>
  );
};

export default AdminCard; 