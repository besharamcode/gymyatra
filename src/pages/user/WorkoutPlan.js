import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { FiCalendar } from 'react-icons/fi';
import { getUserPlans } from '../../redux/planSlice';

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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Your Workout Plan</h1>
        <p className="text-gray-600 mt-1">View your weekly exercise schedule</p>
      </div>

      {isLoading ? (
        <div className="card py-8">
          <p className="text-center">Loading workout plan...</p>
        </div>
      ) : !activePlan ? (
        <div className="card py-12 text-center">
          <FiCalendar className="mx-auto text-5xl text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Workout Plan Assigned</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            You don't have any workout plans assigned yet. Please contact your trainer to get started.
          </p>
        </div>
      ) : (
        <>
          {/* Plan Details */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">{activePlan.title}</h2>
            {activePlan.description && (
              <p className="text-gray-600 mb-4">{activePlan.description}</p>
            )}
          </div>

          {/* Day Selector Tabs */}
          <div className="flex overflow-x-auto pb-2 -mx-4 px-4">
            <div className="flex space-x-2">
              {weekdays.map((day, index) => (
                <button
                  key={index}
                  onClick={() => setActiveDay(index + 1)}
                  className={`px-4 py-2 rounded-md whitespace-nowrap ${
                    activeDay === index + 1
                      ? 'bg-primary text-white'
                      : getCurrentDay() === index + 1
                      ? 'bg-primary/10 text-primary border border-primary/30'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Exercises for Selected Day */}
          <div className="card">
            <h2 className="font-semibold text-lg mb-4">
              {weekdays[activeDay - 1]}'s Exercises
            </h2>
            
            {getDayExercises().length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No exercises scheduled for this day</p>
                <p className="text-sm text-gray-500 mt-2">Rest day or check with your trainer</p>
              </div>
            ) : (
              <div className="space-y-6">
                {getDayExercises().map((exercise, index) => (
                  <div 
                    key={exercise._id || index} 
                    className="border-b pb-6 last:border-0 last:pb-0"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{exercise.name}</h3>
                      <span className="bg-primary/10 text-primary text-sm px-2 py-1 rounded">
                        {exercise.muscleGroup}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{exercise.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-xs text-gray-500">Sets</p>
                        <p className="font-semibold">{exercise.sets}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-xs text-gray-500">Reps</p>
                        <p className="font-semibold">{exercise.reps}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-xs text-gray-500">Rest</p>
                        <p className="font-semibold">60-90 sec</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-xs text-gray-500">Order</p>
                        <p className="font-semibold">#{index + 1}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Diet Plan Link */}
          {activePlan.dietPlan && (
            <div className="card">
              <h2 className="font-semibold text-lg mb-2">Diet Plan</h2>
              <div className="flex justify-between items-center">
                <p className="text-gray-600">
                  {activePlan.dietPlan.title || 'Nutrition Plan'}
                </p>
                <button className="btn-outline text-sm">
                  View Diet Details
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WorkoutPlan; 