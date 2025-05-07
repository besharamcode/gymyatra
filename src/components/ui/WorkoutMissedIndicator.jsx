import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

/**
 * Component to highlight missed or incomplete workouts
 * @param {Object} props
 * @param {Array} props.progressHistory - User's workout progress history
 * @param {number} props.daysToCheck - Number of days to check for missed workouts
 */
const WorkoutMissedIndicator = ({ progressHistory = [], daysToCheck = 7 }) => {
  // Check if there are any missed workouts in the past week
  const missedWorkouts = calculateMissedWorkouts(progressHistory, daysToCheck);
  
  if (missedWorkouts === 0) {
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center bg-card glass-effect backdrop-blur-sm text-card-foreground p-4 rounded-xl border border-amber-200/50 shadow-md mb-6"
    >
      <div className="bg-amber-400/10 p-2 rounded-full mr-3 flex-shrink-0">
        <FiAlertCircle className="text-amber-500" size={20} />
      </div>
      <div>
        <p className="font-medium text-amber-700 dark:text-amber-400">
          {missedWorkouts === 1 
            ? "You missed a workout recently." 
            : `You've missed ${missedWorkouts} workouts recently.`
          }
        </p>
        <p className="text-sm mt-1 text-amber-600/80 dark:text-amber-400/80">
          Consistent training leads to better results. Keep pushing!
        </p>
      </div>
    </motion.div>
  );
};

/**
 * Calculate number of missed workouts in a given period
 * @param {Array} progressHistory - User's progress history
 * @param {number} daysToCheck - Number of days to check
 * @returns {number} - Number of missed workouts
 */
const calculateMissedWorkouts = (progressHistory, daysToCheck) => {
  if (!progressHistory || progressHistory.length === 0) {
    return daysToCheck; // If no history, consider all days missed
  }

  // Get dates from the last N days
  const today = new Date();
  const dates = [];
  
  for (let i = 0; i < daysToCheck; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    dates.push(date.getTime());
  }
  
  // Get dates with logged workouts
  const workoutDates = progressHistory
    .filter(entry => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      const entryTime = entryDate.getTime();
      
      return dates.includes(entryTime);
    })
    .map(entry => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime();
    });
  
  // Count unique workout dates
  const uniqueWorkoutDates = [...new Set(workoutDates)];
  
  // Calculate missed days
  return Math.max(0, dates.length - uniqueWorkoutDates.length);
};

export default WorkoutMissedIndicator; 