import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { FiCalendar } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { getUserPlans } from '../../redux/planSlice';
import GradientBackground from '../../components/ui/GradientBackground';
import AnimationWrapper from '../../components/ui/AnimationWrapper';

const WorkoutPlan = () => {
  const { user } = useSelector((state) => state.auth);
  const { userPlans, isLoading } = useSelector((state) => state.plans);
  const dispatch = useDispatch();
  
  // Active plan (first one assigned)
  const [activePlan, setActivePlan] = useState(null);
  // Day tabs (1-7)
  const [activeDay, setActiveDay] = useState(1);
  // Array of weekday names
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  useEffect(() => {
    dispatch(getUserPlans());
  }, [dispatch]);
  
  useEffect(() => {
    if (userPlans && userPlans.length > 0) {
      setActivePlan(userPlans[0]);
    }
  }, [userPlans]);

  // Get exercises for the active day
  const getDayExercises = () => {
    if (!activePlan || !activePlan.schedule) return [];
    const dayKey = `day${activeDay}`;
    return activePlan.schedule[dayKey] || [];
  };

  // Get current day of week (1-7, Monday is 1)
  const getCurrentDay = () => {
    const day = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    return day === 0 ? 7 : day; // Convert to 1-7 where 1 is Monday
  };

  return (
    <div className="min-h-screen text-foreground bg-background transition-colors duration-300">
      <div className="relative min-h-[20vh] flex flex-col justify-center overflow-hidden">
        <GradientBackground
          intensity="low"
          variant="blue"
          className="absolute inset-0 z-0"
        />
        
        {/* Floating Elements */}
        <motion.div 
          className="absolute top-1/3 right-[15%] w-12 h-12 rounded-2xl border border-primary/20 bg-primary/10 backdrop-blur-sm shadow-md"
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, 5, 0],
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div 
          className="absolute bottom-1/3 left-[15%] w-8 h-8 rounded-full border border-primary/20 bg-primary/10 backdrop-blur-sm shadow-md"
          animate={{ 
            y: [0, 15, 0],
            rotate: [0, -5, 0],
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />

        <div className="mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12">
          <AnimationWrapper variant="fadeInUp">
            <h1 className="text-3xl md:text-4xl font-bold gradient-text">Your Workout Plan</h1>
            <p className="text-xl text-muted-foreground mt-2">View your weekly exercise schedule</p>
          </AnimationWrapper>
        </div>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-12 relative z-10">
        <AnimationWrapper variant="fadeInUp">
          {isLoading ? (
            <div className="bg-card glass-effect backdrop-blur-sm text-card-foreground p-6 rounded-xl border border-border/30 shadow-md flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              <span className="ml-3 text-muted-foreground">Loading workout plan...</span>
            </div>
          ) : !activePlan ? (
            <div className="bg-card glass-effect backdrop-blur-sm text-card-foreground p-12 rounded-xl border border-border/30 shadow-md text-center">
              <FiCalendar className="mx-auto text-5xl text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Workout Plan Assigned</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                You don't have any workout plans assigned yet. Please contact your trainer to get started.
              </p>
            </div>
          ) : (
            <>
              {/* Plan Details */}
              <div className="bg-card glass-effect backdrop-blur-sm text-card-foreground p-6 rounded-xl border border-border/30 shadow-md mb-6">
                <h2 className="text-xl font-semibold mb-2">{activePlan.title}</h2>
                {activePlan.description && (
                  <p className="text-muted-foreground">{activePlan.description}</p>
                )}
                
                <div className="flex flex-wrap gap-3 mt-4">
                  {activePlan.level && (
                    <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
                      {activePlan.level.charAt(0).toUpperCase() + activePlan.level.slice(1)}
                    </span>
                  )}
                  {activePlan.targetGroup && (
                    <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
                      {activePlan.targetGroup}
                    </span>
                  )}
                  {activePlan.duration && (
                    <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
                      {activePlan.duration} weeks
                    </span>
                  )}
                </div>
              </div>

              {/* Day Selector Tabs */}
              <div className="flex overflow-x-auto pb-2 -mx-4 px-4 mb-6">
                <div className="flex space-x-2">
                  {weekdays.map((day, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setActiveDay(index + 1)}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-md whitespace-nowrap transition-all duration-200 ${
                        activeDay === index + 1
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : getCurrentDay() === index + 1
                          ? 'bg-primary/10 text-primary border border-primary/30'
                          : 'bg-background/50 text-foreground hover:bg-background/80 border border-border/30'
                      }`}
                    >
                      {day}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Exercises for Selected Day */}
              <div className="bg-card glass-effect backdrop-blur-sm text-card-foreground p-6 rounded-xl border border-border/30 shadow-md mb-6">
                <h2 className="font-semibold text-lg mb-4">
                  {weekdays[activeDay - 1]}'s Exercises
                </h2>
                
                {getDayExercises().length === 0 ? (
                  <div className="text-center py-12 bg-background/30 rounded-lg border border-border/20">
                    <p className="text-muted-foreground mb-2">No exercises scheduled for this day</p>
                    <p className="text-sm text-muted-foreground">Rest day or check with your trainer</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {getDayExercises().map((exercise, index) => (
                      <AnimationWrapper key={exercise._id || index} variant="fadeInUp" delay={0.05 * index}>
                        <motion.div 
                          whileHover={{ y: -2 }}
                          className="border-b border-border/30 pb-6 last:border-0 last:pb-0 hover:bg-background/30 p-4 rounded-lg transition-all duration-200"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-lg">{exercise.name}</h3>
                            <span className="bg-primary/10 text-primary text-sm px-2 py-1 rounded-full">
                              {exercise.muscleGroup}
                            </span>
                          </div>
                          <p className="text-muted-foreground mb-4">{exercise.description}</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="bg-background/50 p-3 rounded-lg border border-border/20">
                              <p className="text-xs text-muted-foreground">Sets</p>
                              <p className="font-semibold">{exercise.sets}</p>
                            </div>
                            <div className="bg-background/50 p-3 rounded-lg border border-border/20">
                              <p className="text-xs text-muted-foreground">Reps</p>
                              <p className="font-semibold">{exercise.reps}</p>
                            </div>
                            <div className="bg-background/50 p-3 rounded-lg border border-border/20">
                              <p className="text-xs text-muted-foreground">Rest</p>
                              <p className="font-semibold">60-90 sec</p>
                            </div>
                            <div className="bg-background/50 p-3 rounded-lg border border-border/20">
                              <p className="text-xs text-muted-foreground">Order</p>
                              <p className="font-semibold">#{index + 1}</p>
                            </div>
                          </div>
                        </motion.div>
                      </AnimationWrapper>
                    ))}
                  </div>
                )}
              </div>

              {/* Diet Plan Link */}
              {activePlan.dietPlan && (
                <div className="bg-card glass-effect backdrop-blur-sm text-card-foreground p-6 rounded-xl border border-border/30 shadow-md">
                  <h2 className="font-semibold text-lg mb-2">Diet Plan</h2>
                  <div className="flex justify-between items-center">
                    <p className="text-muted-foreground">
                      {activePlan.dietPlan.title || 'Nutrition Plan'}
                    </p>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-full shadow-sm transition-all text-sm"
                    >
                      View Diet Details
                    </motion.button>
                  </div>
                </div>
              )}
            </>
          )}
        </AnimationWrapper>
      </div>
    </div>
  );
};

export default WorkoutPlan; 