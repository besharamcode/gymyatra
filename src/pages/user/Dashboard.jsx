import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { FiCalendar, FiActivity, FiBarChart2, FiClipboard } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { getUserPlans } from '../../redux/planSlice';
import { getProgressHistory } from '../../redux/progressSlice';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { userPlans, isLoading: plansLoading } = useSelector((state) => state.plans);
  const { progressHistory, isLoading: progressLoading } = useSelector((state) => state.progress);
  
  const dispatch = useDispatch();
  
  // Get current day of the week (0-6, where 0 is Sunday)
  const currentDay = new Date().getDay();
  // Map to our day1-day7 schema (where day1 is Monday)
  const dayKey = currentDay === 0 ? 'day7' : `day${currentDay}`;
  
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
  const latestWeight = progressHistory && progressHistory.length > 0 
    ? progressHistory[0].weight 
    : null;
  
  // Count completed workouts in the last 30 days
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);
  
  const workoutsLast30Days = progressHistory 
    ? progressHistory.filter(entry => new Date(entry.date) > last30Days).length 
    : 0;
  
  // Get user's plan name
  const planName = userPlans && userPlans.length > 0 ? userPlans[0].title : 'No Plan Assigned';
  
  // Get diet plan name
  const dietPlanName = userPlans && userPlans.length > 0 && userPlans[0].dietPlan 
    ? userPlans[0].dietPlan.title 
    : 'No Diet Plan Assigned';

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Welcome, {user?.user?.name}!</h1>
          <p className="text-gray-600 mt-1">Here's your fitness summary for today</p>
        </div>
        <Link to="/user/progress" className="btn btn-primary mt-4 md:mt-0">
          Log Today's Progress
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card flex items-center">
          <div className="rounded-full bg-primary/10 p-4 mr-4">
            <FiActivity className="text-primary text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Current Plan</h3>
            <p className="text-gray-600">{planName}</p>
          </div>
        </div>
        
        <div className="card flex items-center">
          <div className="rounded-full bg-primary/10 p-4 mr-4">
            <FiClipboard className="text-primary text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Diet Plan</h3>
            <p className="text-gray-600">{dietPlanName}</p>
          </div>
        </div>
        
        <div className="card flex items-center">
          <div className="rounded-full bg-primary/10 p-4 mr-4">
            <FiCalendar className="text-primary text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Workouts (30 days)</h3>
            <p className="text-gray-600">{workoutsLast30Days} completed</p>
          </div>
        </div>
        
        <div className="card flex items-center">
          <div className="rounded-full bg-primary/10 p-4 mr-4">
            <FiBarChart2 className="text-primary text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Current Weight</h3>
            <p className="text-gray-600">{latestWeight ? `${latestWeight} kg` : 'Not logged'}</p>
          </div>
        </div>
      </div>

      {/* Today's Workout */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Today's Workout</h2>
        
        {plansLoading ? (
          <p>Loading workout plan...</p>
        ) : todaysWorkout && todaysWorkout.length > 0 ? (
          <div className="space-y-4">
            {todaysWorkout.map((exercise) => (
              <div key={exercise._id} className="border-b pb-4 last:border-0">
                <h3 className="font-semibold">{exercise.name}</h3>
                <p className="text-sm text-gray-600 mb-1">{exercise.description}</p>
                <div className="flex space-x-4 text-sm">
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                    {exercise.sets} sets
                  </span>
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                    {exercise.reps} reps
                  </span>
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                    {exercise.muscleGroup}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No workout scheduled for today</p>
            <p className="text-sm">Take a rest day or check your workout plan for modifications</p>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/user/workout-plan" className="card hover:shadow-md transition-shadow">
          <h3 className="font-semibold mb-2">View Full Workout Plan</h3>
          <p className="text-sm text-gray-600">See your complete workout schedule for the week</p>
        </Link>
        
        <Link to="/user/progress" className="card hover:shadow-md transition-shadow">
          <h3 className="font-semibold mb-2">Track Your Progress</h3>
          <p className="text-sm text-gray-600">Log your workouts and track improvements over time</p>
        </Link>
        
        <Link to="/user/profile" className="card hover:shadow-md transition-shadow">
          <h3 className="font-semibold mb-2">Update Profile</h3>
          <p className="text-sm text-gray-600">Manage your account settings and personal information</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard; 