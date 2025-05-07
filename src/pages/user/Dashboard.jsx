import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  FiCalendar,
  FiActivity,
  FiBarChart2,
  FiClipboard,
  FiArrowRight,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getUserPlans } from "../../redux/planSlice";
import { getProgressHistory } from "../../redux/progressSlice";
import GreetingHeader from "../../components/ui/GreetingHeader";
import Tooltip from "../../components/ui/Tooltip";
import WorkoutMissedIndicator from "../../components/ui/WorkoutMissedIndicator";
import { CardSkeleton, ExerciseSkeleton } from "../../components/ui/Skeleton";
import GradientBackground from "../../components/ui/GradientBackground";
import AnimationWrapper from "../../components/ui/AnimationWrapper";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { userPlans, isLoading: plansLoading } = useSelector(
    (state) => state.plans
  );
  const { progressHistory, isLoading: progressLoading } = useSelector(
    (state) => state.progress
  );

  const dispatch = useDispatch();

  // Get current day of the week (0-6, where 0 is Sunday)
  const currentDay = new Date().getDay();
  // Map to our day1-day7 schema (where day1 is Monday)
  const dayKey = currentDay === 0 ? "day7" : `day${currentDay}`;

  const [todaysWorkout, setTodaysWorkout] = useState([]);

  useEffect(() => {
    dispatch(getUserPlans());
    dispatch(getProgressHistory());
  }, [dispatch]);

  useEffect(() => {
    if (userPlans && userPlans.length > 0) {
      // Get today's exercises
      const plan = userPlans[0]; // Use the first assigned plan
      if (plan.schedule && plan.schedule[dayKey]) {
        setTodaysWorkout(plan.schedule[dayKey]);
      }
    }
  }, [userPlans, dayKey]);

  // Get latest weight entry
  const latestWeight =
    progressHistory && progressHistory.length > 0
      ? progressHistory[0].weight
      : null;

  // Count completed workouts in the last 30 days
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);

  const workoutsLast30Days = progressHistory
    ? progressHistory.filter((entry) => new Date(entry.date) > last30Days)
        .length
    : 0;

  // Get user's plan name
  const planName =
    userPlans && userPlans.length > 0 ? userPlans[0].title : "No Plan Assigned";

  // Get diet plan name
  const dietPlanName =
    userPlans && userPlans.length > 0 && userPlans[0].dietPlan
      ? userPlans[0].dietPlan.title
      : "No Diet Plan Assigned";

  const isLoading = plansLoading || progressLoading;

  return (
    <div className="min-h-screen text-foreground bg-background transition-colors duration-300">
      <div className="relative min-h-[30vh] flex flex-col justify-center overflow-hidden">
        <GradientBackground
          intensity="low"
          variant="primary"
          className="absolute inset-0 z-0"
        />

        {/* Floating Element */}
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

        <div className=" mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12">
          <AnimationWrapper
            variant="fadeInUp"
            className="flex flex-col md:flex-row justify-between items-start md:items-center"
          >
            <GreetingHeader
              name={user?.user?.name || "User"}
              className="text-foreground"
            />
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 md:mt-0"
            >
              <Link
                to="/user/progress"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-full shadow-md transition-colors inline-flex items-center"
              >
                Log Today's Progress
                <FiArrowRight className="ml-2" />
              </Link>
            </motion.div>
          </AnimationWrapper>
        </div>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-12 relative z-10">
        <AnimationWrapper variant="fadeInUp">
          {/* Workout Missed Warning */}
          <WorkoutMissedIndicator progressHistory={progressHistory} />

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {isLoading ? (
              <>
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </>
            ) : (
              <>
                <div className="bg-card glass-effect backdrop-blur-sm text-card-foreground p-6 rounded-xl border border-border/30 shadow-md flex items-center transform hover:scale-105 transition-all duration-300">
                  <div className="rounded-full bg-primary/10 p-4 mr-4">
                    <FiActivity className="text-primary text-xl" />
                  </div>
                  <div>
                    <Tooltip text="The workout plan currently assigned to you by your trainer.">
                      <h3 className="text-lg font-semibold">Current Plan</h3>
                    </Tooltip>
                    <p className="text-muted-foreground">{planName}</p>
                  </div>
                </div>

                <div className="bg-card glass-effect backdrop-blur-sm text-card-foreground p-6 rounded-xl border border-border/30 shadow-md flex items-center transform hover:scale-105 transition-all duration-300">
                  <div className="rounded-full bg-primary/10 p-4 mr-4">
                    <FiClipboard className="text-primary text-xl" />
                  </div>
                  <div>
                    <Tooltip text="Your current diet plan with nutritional guidelines.">
                      <h3 className="text-lg font-semibold">Diet Plan</h3>
                    </Tooltip>
                    <p className="text-muted-foreground">{dietPlanName}</p>
                  </div>
                </div>

                <div className="bg-card glass-effect backdrop-blur-sm text-card-foreground p-6 rounded-xl border border-border/30 shadow-md flex items-center transform hover:scale-105 transition-all duration-300">
                  <div className="rounded-full bg-primary/10 p-4 mr-4">
                    <FiCalendar className="text-primary text-xl" />
                  </div>
                  <div>
                    <Tooltip text="The number of workouts you've completed in the past 30 days.">
                      <h3 className="text-lg font-semibold">
                        Workouts (30 days)
                      </h3>
                    </Tooltip>
                    <p className="text-muted-foreground">
                      {workoutsLast30Days} completed
                    </p>
                  </div>
                </div>

                <div className="bg-card glass-effect backdrop-blur-sm text-card-foreground p-6 rounded-xl border border-border/30 shadow-md flex items-center transform hover:scale-105 transition-all duration-300">
                  <div className="rounded-full bg-primary/10 p-4 mr-4">
                    <FiBarChart2 className="text-primary text-xl" />
                  </div>
                  <div>
                    <Tooltip text="Your most recently logged weight.">
                      <h3 className="text-lg font-semibold">Current Weight</h3>
                    </Tooltip>
                    <p className="text-muted-foreground">
                      {latestWeight ? `${latestWeight} kg` : "Not logged"}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Today's Workout */}
          <div className="bg-card glass-effect backdrop-blur-sm text-card-foreground p-6 rounded-xl border border-border/30 shadow-lg mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Today's Workout</h2>
              <Tooltip
                text="These are the exercises scheduled for today according to your current plan."
                position="left"
                icon={true}
              >
                <span className="text-sm text-muted-foreground">
                  Need help?
                </span>
              </Tooltip>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                <ExerciseSkeleton />
                <ExerciseSkeleton />
                <ExerciseSkeleton />
              </div>
            ) : todaysWorkout && todaysWorkout.length > 0 ? (
              <div className="space-y-4">
                {todaysWorkout.map((exercise, index) => (
                  <AnimationWrapper
                    key={exercise._id}
                    delay={0.1 * index}
                    variant="fadeInUp"
                  >
                    <div className="border-b border-border/50 pb-4 last:border-0 hover:bg-background/50 p-4 rounded-lg transition-all duration-300">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-lg">
                          {exercise.name}
                        </h3>
                        {exercise.imageUrl && (
                          <img
                            src={exercise.imageUrl}
                            alt={exercise.name}
                            className="w-12 h-12 object-cover rounded-lg border border-border/30"
                          />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {exercise.description}
                      </p>
                      <div className="flex space-x-4 text-sm">
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                          {exercise.sets} sets
                        </span>
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                          {exercise.reps} reps
                        </span>
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                          {exercise.muscleGroup}
                        </span>
                      </div>
                    </div>
                  </AnimationWrapper>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 animate-fadeIn">
                <p className="text-muted-foreground mb-4">
                  No workout scheduled for today
                </p>
                <p className="text-sm text-muted-foreground">
                  Take a rest day or check your workout plan for modifications
                </p>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/user/workout-plan"
              className="bg-card glass-effect backdrop-blur-sm text-card-foreground p-6 rounded-xl border border-border/30 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:border-primary/30"
            >
              <h3 className="font-semibold mb-2 text-lg">
                View Full Workout Plan
              </h3>
              <p className="text-sm text-muted-foreground">
                See your complete workout schedule for the week
              </p>
            </Link>

            <Link
              to="/user/progress"
              className="bg-card glass-effect backdrop-blur-sm text-card-foreground p-6 rounded-xl border border-border/30 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:border-primary/30"
            >
              <h3 className="font-semibold mb-2 text-lg">
                Track Your Progress
              </h3>
              <p className="text-sm text-muted-foreground">
                Log your workouts and track improvements over time
              </p>
            </Link>

            <Link
              to="/user/profile"
              className="bg-card glass-effect backdrop-blur-sm text-card-foreground p-6 rounded-xl border border-border/30 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:border-primary/30"
            >
              <h3 className="font-semibold mb-2 text-lg">Update Profile</h3>
              <p className="text-sm text-muted-foreground">
                Manage your account settings and personal information
              </p>
            </Link>
          </div>
        </AnimationWrapper>
      </div>
    </div>
  );
};

export default Dashboard;
