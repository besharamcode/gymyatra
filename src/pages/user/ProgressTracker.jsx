import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { FiPlus, FiBarChart2, FiCalendar, FiActivity } from 'react-icons/fi';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { getProgressHistory, submitProgress } from '../../redux/progressSlice';
import { getUserPlans } from '../../redux/planSlice';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ProgressTracker = () => {
  const { user } = useSelector((state) => state.auth);
  const { progressHistory, isLoading } = useSelector((state) => state.progress);
  const { userPlans, isLoading: plansLoading } = useSelector((state) => state.plans);
  
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    weight: '',
    completedExercises: [],
    notes: '',
  });
  
  const [availableExercises, setAvailableExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  
  // Get all exercises from plans for dropdown
  useEffect(() => {
    dispatch(getProgressHistory());
    dispatch(getUserPlans());
  }, [dispatch]);
  
  // Extract exercises from user plans
  useEffect(() => {
    if (userPlans && userPlans.length > 0) {
      const plan = userPlans[0];
      const exercises = [];
      
      // Extract exercises from each day's schedule
      if (plan.schedule) {
        for (let i = 1; i <= 7; i++) {
          const dayKey = `day${i}`;
          if (plan.schedule[dayKey] && Array.isArray(plan.schedule[dayKey])) {
            plan.schedule[dayKey].forEach(exercise => {
              if (!exercises.some(e => e._id === exercise._id)) {
                exercises.push(exercise);
              }
            });
          }
        }
      }
      
      setAvailableExercises(exercises);
    }
  }, [userPlans]);

  // Prepare chart data from progress history
  const prepareChartData = () => {
    if (!progressHistory || progressHistory.length === 0) {
      return null;
    }
    
    // Get last 10 entries, but display oldest to newest
    const recentEntries = [...progressHistory].slice(0, 10).reverse();
    
    return {
      labels: recentEntries.map(entry => new Date(entry.date).toLocaleDateString()),
      datasets: [
        {
          label: 'Weight (kg)',
          data: recentEntries.map(entry => entry.weight),
          borderColor: '#1E40AF',
          backgroundColor: 'rgba(30, 64, 175, 0.2)',
          tension: 0.3,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Weight Progress',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  // Handle adding an exercise to the form
  const addExercise = () => {
    setSelectedExercises([
      ...selectedExercises,
      {
        exercise: '',
        sets: '',
        reps: '',
        weight: '',
      },
    ]);
  };

  // Handle removing an exercise from the form
  const removeExercise = (index) => {
    const updated = [...selectedExercises];
    updated.splice(index, 1);
    setSelectedExercises(updated);
  };

  // Handle change in exercise form fields
  const handleExerciseChange = (index, field, value) => {
    const updatedExercises = [...selectedExercises];
    updatedExercises[index][field] = value;
    setSelectedExercises(updatedExercises);
  };

  // Handle form input changes
  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const onSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.weight) {
      toast.error('Please enter your current weight');
      return;
    }
    
    if (selectedExercises.length === 0) {
      toast.error('Please add at least one exercise');
      return;
    }
    
    // Validate completed exercises
    const validExercises = selectedExercises.filter(
      ex => ex.exercise && ex.sets && ex.reps && ex.weight
    );
    
    if (validExercises.length !== selectedExercises.length) {
      toast.error('Please complete all exercise fields');
      return;
    }
    
    const progressData = {
      weight: parseFloat(formData.weight),
      completedExercises: selectedExercises.map(ex => ({
        exercise: ex.exercise,
        sets: parseInt(ex.sets),
        reps: parseInt(ex.reps),
        weight: parseFloat(ex.weight),
      })),
      notes: formData.notes,
    };
    
    dispatch(submitProgress(progressData));
    
    // Reset form after submission
    setFormData({
      weight: '',
      notes: '',
    });
    setSelectedExercises([]);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Progress Tracker</h1>
          <p className="text-gray-600 mt-1">Log your workouts and track your progress</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Progress Chart */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Weight Progress</h2>
          
          {isLoading ? (
            <div className="py-8 text-center">
              <p>Loading progress data...</p>
            </div>
          ) : progressHistory && progressHistory.length > 0 ? (
            <div className="chart-container" style={{ height: '300px' }}>
              <Line data={prepareChartData()} options={chartOptions} />
            </div>
          ) : (
            <div className="text-center py-8">
              <FiBarChart2 className="mx-auto text-4xl text-gray-400 mb-3" />
              <p className="text-gray-600">No progress data yet</p>
              <p className="text-sm text-gray-500 mt-1">Log your first workout below to start tracking</p>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          
          {isLoading ? (
            <div className="py-4 text-center">
              <p>Loading recent activity...</p>
            </div>
          ) : progressHistory && progressHistory.length > 0 ? (
            <div className="space-y-4">
              {progressHistory.slice(0, 5).map((entry, index) => (
                <div key={entry._id || index} className="border-b pb-4 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <FiCalendar className="text-primary mr-2" />
                        <span className="font-medium">
                          {new Date(entry.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Weight: {entry.weight} kg
                      </p>
                    </div>
                    <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                      {entry.completedExercises.length} exercises
                    </span>
                  </div>
                  
                  {entry.notes && (
                    <p className="text-sm text-gray-500 mt-2 italic">
                      "{entry.notes}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FiActivity className="mx-auto text-4xl text-gray-400 mb-3" />
              <p className="text-gray-600">No workout history yet</p>
              <p className="text-sm text-gray-500 mt-1">Log your first workout below</p>
            </div>
          )}
        </div>
      </div>

      {/* Log Workout Form */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Log Today's Workout</h2>
        
        <form onSubmit={onSubmit}>
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="weight">
                Current Weight (kg)
              </label>
              <input
                type="number"
                min="30"
                step="0.1"
                className="form-input"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={onChange}
                placeholder="Enter your current weight"
                required
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-gray-700">Completed Exercises</label>
                <button
                  type="button"
                  onClick={addExercise}
                  className="text-primary flex items-center text-sm hover:underline"
                >
                  <FiPlus className="mr-1" />
                  Add Exercise
                </button>
              </div>
              
              {selectedExercises.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-gray-300 rounded-md">
                  <p className="text-gray-500">No exercises added yet</p>
                  <button
                    type="button"
                    onClick={addExercise}
                    className="mt-2 text-primary hover:underline text-sm"
                  >
                    Add your first exercise
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedExercises.map((ex, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 border rounded-md bg-gray-50">
                      <div className="md:col-span-2">
                        <label className="block text-xs text-gray-500 mb-1">Exercise</label>
                        <select
                          className="form-input"
                          value={ex.exercise}
                          onChange={(e) => handleExerciseChange(index, 'exercise', e.target.value)}
                          required
                        >
                          <option value="">Select Exercise</option>
                          {availableExercises.map((exercise) => (
                            <option key={exercise._id} value={exercise._id}>
                              {exercise.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Sets</label>
                        <input
                          type="number"
                          min="1"
                          className="form-input"
                          value={ex.sets}
                          onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Reps</label>
                        <input
                          type="number"
                          min="1"
                          className="form-input"
                          value={ex.reps}
                          onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Weight (kg)</label>
                        <div className="flex">
                          <input
                            type="number"
                            min="0"
                            step="0.5"
                            className="form-input flex-1"
                            value={ex.weight}
                            onChange={(e) => handleExerciseChange(index, 'weight', e.target.value)}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => removeExercise(index)}
                            className="ml-2 px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="notes">
                Notes (Optional)
              </label>
              <textarea
                className="form-input"
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={onChange}
                placeholder="Any notes about today's workout..."
                rows="3"
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Log Workout'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProgressTracker; 