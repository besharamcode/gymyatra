import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * Generates a personalized greeting based on the time of day
 * @param {Object} props
 * @param {string} props.name - User's name
 * @param {string} props.className - Additional CSS classes
 */
const GreetingHeader = ({ name, className = '' }) => {
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      return 'Good Morning';
    } else if (hour >= 12 && hour < 17) {
      return 'Good Afternoon';
    } else if (hour >= 17 && hour < 22) {
      return 'Good Evening';
    } else {
      return 'Good Night';
    }
  }, []);

  return (
    <div className={className}>
      <h1 className="text-2xl md:text-3xl font-bold mb-1 gradient-text">
        {greeting}, {name}!
      </h1>
      <motion.p 
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="text-muted-foreground"
      >
        {getMotivationalQuote()}
      </motion.p>
    </div>
  );
};

// Helper function to get a random motivational quote
const getMotivationalQuote = () => {
  const quotes = [
    "Ready to crush your fitness goals today?",
    "Your future self will thank you for today's workout.",
    "Progress is progress, no matter how small.",
    "Small steps lead to big changes.",
    "Every workout brings you closer to your goals.",
    "Your body can stand almost anything. It's your mind you have to convince.",
    "The hardest lift of all is lifting your butt off the couch.",
    "No matter how slow you go, you're still lapping everyone on the couch.",
    "Dedication, determination, and discipline equals results."
  ];
  
  // Get a random quote using the current date as seed for consistency throughout the day
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const index = seed % quotes.length;
  
  return quotes[index];
};

export default GreetingHeader; 