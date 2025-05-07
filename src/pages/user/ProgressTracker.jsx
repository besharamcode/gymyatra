import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { FiPlus, FiBarChart2, FiCalendar, FiActivity, FiTrash2 } from 'react-icons/fi';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from 'chart.js';
import { getProgressHistory, submitProgress } from '../../redux/progressSlice';
import { getUserPlans } from '../../redux/planSlice';
import Tooltip from '../../components/ui/Tooltip';
import { CardSkeleton, ChartSkeleton } from '../../components/ui/Skeleton';
import GreetingHeader from '../../components/ui/GreetingHeader';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

const ProgressTracker = () => {
  const { user } = useSelector((state) => state.auth);
  const { progressHistory, isLoading: progressLoading } = useSelector((state) => state.progress);
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
          fill: true,
          tension: 0.3,
          borderWidth: 2,
          pointBackgroundColor: '#1E40AF',
          pointBorderColor: '#fff',
          pointBorderWidth: 1,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          font: {
            size: 12,
            weight: 'bold',
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 12,
        },
        padding: 10,
        cornerRadius: 4,
        titleMarginBottom: 8,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `Weight: ${context.formattedValue} kg`;
          }
        }
      },
      title: {
        display: true,
        text: 'Weight Progress Over Time',
        font: {
          size: 16,
          weight: 'bold',
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          font: {
            size: 12,
          },
          callback: function(value) {
            return value + ' kg';
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        ticks: {
          font: {
            size: 12,
          },
        },
        grid: {
          display: false,
        },
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    elements: {
      line: {
        borderJoinStyle: 'round',
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

  const isLoading = progressLoading || plansLoading;
  const chartData = prepareChartData();

  return (
    <div className="space-y-8 animate-fadeIn">
      <GreetingHeader 
        name={user?.user?.name || 'User'}
        className="mb-6"
      />

      {/* Weight Progress Chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Weight Progress</h2>
          <Tooltip text="Track your weight changes over time to monitor your fitness journey." position="left">
            <span className="text-sm text-gray-500">Understanding your chart</span>
          </Tooltip>
        </div>
        
        {isLoading ? (
          <ChartSkeleton />
        ) : chartData ? (
          <div className="animate-scaleIn">
            <Line data={chartData} options={chartOptions} />
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-2">No weight data recorded yet</p>
            <p className="text-sm text-gray-500">Log your progress below to start tracking</p>
          </div>
        )}
      </div>

      {/* Log Progress Form */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-6">Log Today's Progress</h2>
        
        <form onSubmit={onSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="weight">
              Current Weight (kg)
              <Tooltip text="Enter your current weight in kilograms.">
                <span></span>
              </Tooltip>
            </label>
            <input
              type="number"
              step="0.1"
              className="form-input"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={onChange}
              placeholder="Enter your weight"
              min="20"
              max="250"
            />
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="text-gray-700 font-medium" htmlFor="exercises">
                Completed Exercises
                <Tooltip text="Add the exercises you completed today along with the sets, reps, and weight.">
                  <span></span>
                </Tooltip>
              </label>
              <button
                type="button"
                onClick={addExercise}
                className="flex items-center text-primary font-medium text-sm"
              >
                <FiPlus className="mr-1" /> Add Exercise
              </button>
            </div>
            
            {selectedExercises.length > 0 ? (
              <div className="space-y-4">
                {selectedExercises.map((exercise, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50 animate-fadeIn">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">Exercise #{index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeExercise(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm text-gray-600 mb-1">Exercise</label>
                        <select
                          className="form-input"
                          value={exercise.exercise}
                          onChange={(e) => handleExerciseChange(index, 'exercise', e.target.value)}
                          required
                        >
                          <option value="">Select an exercise</option>
                          {availableExercises.map((ex) => (
                            <option key={ex._id} value={ex._id}>
                              {ex.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Sets</label>
                        <input
                          type="number"
                          className="form-input"
                          value={exercise.sets}
                          onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
                          placeholder="Sets"
                          min="1"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Reps</label>
                        <input
                          type="number"
                          className="form-input"
                          value={exercise.reps}
                          onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                          placeholder="Reps"
                          min="1"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <label className="block text-sm text-gray-600 mb-1">Weight (kg)</label>
                      <input
                        type="number"
                        step="0.5"
                        className="form-input"
                        value={exercise.weight}
                        onChange={(e) => handleExerciseChange(index, 'weight', e.target.value)}
                        placeholder="Weight used"
                        min="0"
                        required
                      />
                    </div>
                    
                    {/* Display exercise image if available */}
                    {exercise.exercise && availableExercises.length > 0 && (
                      <div className="mt-3">
                        {(() => {
                          const selectedExercise = availableExercises.find(
                            (ex) => ex._id === exercise.exercise
                          );
                          if (selectedExercise && selectedExercise.imageUrl) {
                            return (
                              <div className="mt-2">
                                <img 
                                  src={selectedExercise.imageUrl} 
                                  alt={selectedExercise.name}
                                  className="h-24 object-cover rounded-md border border-gray-200"
                                />
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 border border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500">No exercises added yet. Click "Add Exercise" to begin.</p>
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="notes">
              Notes (Optional)
            </label>
            <textarea
              className="form-input h-24"
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={onChange}
              placeholder="How did you feel during today's workout? Any challenges or achievements?"
            />
          </div>
          
          <button
            type="submit"
            className="btn btn-primary w-full md:w-auto transition-all-smooth transform hover:scale-105"
            disabled={isLoading}
          >
            {isLoading ? 'Submitting...' : 'Log Progress'}
          </button>
        </form>
      </div>

      {/* Progress History */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Recent Progress History</h2>
        
        {isLoading ? (
          <div className="space-y-4">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : progressHistory && progressHistory.length > 0 ? (
          <div className="space-y-4">
            {progressHistory.slice(0, 5).map((entry) => (
              <div 
                key={entry._id} 
                className="border-b pb-4 last:border-0 animate-slideIn hover:bg-gray-50 p-3 rounded transition-all-smooth"
              >
                <div className="flex justify-between">
                  <h3 className="font-semibold">
                    {new Date(entry.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </h3>
                  <span className="text-primary font-medium">{entry.weight} kg</span>
                </div>
                
                <div className="mt-2">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Completed Exercises:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {entry.completedExercises.map((ex, i) => (
                      <div key={i} className="text-sm bg-gray-50 p-2 rounded flex items-center">
                        <div className="bg-primary/10 p-1 rounded mr-2">
                          <FiActivity className="text-primary" size={14} />
                        </div>
                        <div>
                          <span className="font-medium">{ex.exercise.name}</span>
                          <div className="text-xs text-gray-500">
                            {ex.sets} sets × {ex.reps} reps × {ex.weight} kg
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {entry.notes && (
                  <div className="mt-2 text-sm text-gray-600 italic">
                    <span className="font-medium">Notes:</span> {entry.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No progress entries yet</p>
            <p className="text-sm mt-2">Start logging your workouts to track your progress</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressTracker; 