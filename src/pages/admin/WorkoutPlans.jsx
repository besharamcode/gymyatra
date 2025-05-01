import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiPlus, FiEdit, FiTrash2, FiCalendar } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { getUserPlans, createPlan } from '../../redux/planSlice';
import { getExercises } from '../../redux/exerciseSlice';
import { getDietPlans } from '../../redux/dietPlanSlice';

// Mock workout plans data
const MOCK_PLANS = [
  {
    _id: '1',
    title: 'Beginner Strength Program',
    description: 'A balanced program designed for beginners to build strength and muscle.',
    level: 'beginner',
    duration: '8',
    targetGroup: 'Strength',
    dietPlan: { _id: '1', title: 'Weight Loss Plan' },
    schedule: {
      day1: [
        { _id: '1', name: 'Bench Press', muscleGroup: 'Chest', sets: 3, reps: 10 },
        { _id: '2', name: 'Squat', muscleGroup: 'Legs', sets: 3, reps: 10 }
      ],
      day2: [],
      day3: [
        { _id: '3', name: 'Pull-up', muscleGroup: 'Back', sets: 3, reps: 8 }
      ],
      day4: [],
      day5: [
        { _id: '1', name: 'Bench Press', muscleGroup: 'Chest', sets: 3, reps: 10 },
        { _id: '2', name: 'Squat', muscleGroup: 'Legs', sets: 3, reps: 10 }
      ],
      day6: [],
      day7: []
    }
  },
  {
    _id: '2',
    title: 'Intermediate Hypertrophy Plan',
    description: 'A program focused on building muscle size with moderate to high volume.',
    level: 'intermediate',
    duration: '12',
    targetGroup: 'Muscle Gain',
    dietPlan: { _id: '2', title: 'Muscle Gain Plan' },
    schedule: {
      day1: [
        { _id: '1', name: 'Bench Press', muscleGroup: 'Chest', sets: 4, reps: 12 }
      ],
      day2: [
        { _id: '2', name: 'Squat', muscleGroup: 'Legs', sets: 4, reps: 12 }
      ],
      day3: [
        { _id: '3', name: 'Pull-up', muscleGroup: 'Back', sets: 4, reps: 10 }
      ],
      day4: [],
      day5: [
        { _id: '1', name: 'Bench Press', muscleGroup: 'Chest', sets: 4, reps: 12 }
      ],
      day6: [
        { _id: '2', name: 'Squat', muscleGroup: 'Legs', sets: 4, reps: 12 }
      ],
      day7: []
    }
  }
];

const AdminWorkoutPlans = () => {
  const dispatch = useDispatch();
  const { userPlans: apiPlans, isLoading: apiLoading } = useSelector((state) => state.plans);
  const { exercises } = useSelector((state) => state.exercises);
  const { dietPlans } = useSelector((state) => state.dietPlans);
  
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [activeDay, setActiveDay] = useState(1); // For the form tabs
  
  // Form data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    level: 'beginner',
    duration: '4',
    targetGroup: '',
    dietPlan: '',
    schedule: {
      day1: [],
      day2: [],
      day3: [],
      day4: [],
      day5: [],
      day6: [],
      day7: []
    }
  });
  
  // Exercise selection for the current active day
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [selectedExercises, setSelectedExercises] = useState([]);
  
  const difficultyLevels = ['beginner', 'intermediate', 'advanced'];
  const durations = ['4', '6', '8', '12', '16'];
  const targetGroups = ['Weight Loss', 'Muscle Gain', 'Strength', 'Endurance', 'General Fitness'];
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Fetch data on mount
  useEffect(() => {
    dispatch(getUserPlans());
    dispatch(getExercises());
    dispatch(getDietPlans());
    setIsLoading(true);
  }, [dispatch]);
  
  useEffect(() => {
    // If API data is available, use it
    if (apiPlans && apiPlans.length > 0) {
      setPlans(apiPlans);
      setIsLoading(false);
    } else if (!apiLoading) {
      // If API call completed but no data, use mock data
      setPlans(MOCK_PLANS);
      setIsLoading(false);
    }
  }, [apiPlans, apiLoading]);

  // Filter plans based on search term
  const filteredPlans = plans?.filter(plan => 
    plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.level?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.targetGroup?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter exercises for selection
  const filteredExercises = exercises?.filter(exercise => 
    exercise.name.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
    exercise.muscleGroup.toLowerCase().includes(exerciseSearch.toLowerCase())
  );

  // Handle opening the add/edit modal
  const handleOpenModal = (plan = null) => {
    if (plan) {
      setSelectedPlan(plan);
      
      // Create a proper schedule object if it doesn't exist or is incomplete
      const schedule = plan.schedule || {};
      for (let i = 1; i <= 7; i++) {
        if (!schedule[`day${i}`]) {
          schedule[`day${i}`] = [];
        }
      }
      
      setFormData({
        title: plan.title || '',
        description: plan.description || '',
        level: plan.level || 'beginner',
        duration: plan.duration?.toString() || '4',
        targetGroup: plan.targetGroup || '',
        dietPlan: plan.dietPlan?._id || '',
        schedule
      });
      
      // Set up first day exercises
      setSelectedExercises(schedule.day1 || []);
    } else {
      setSelectedPlan(null);
      setFormData({
        title: '',
        description: '',
        level: 'beginner',
        duration: '4',
        targetGroup: '',
        dietPlan: '',
        schedule: {
          day1: [],
          day2: [],
          day3: [],
          day4: [],
          day5: [],
          day6: [],
          day7: []
        }
      });
      setSelectedExercises([]);
    }
    
    setActiveDay(1);
    setShowModal(true);
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle day tab selection
  const handleDaySelect = (day) => {
    // Save current day exercises to form data before switching
    const updatedSchedule = { ...formData.schedule };
    updatedSchedule[`day${activeDay}`] = [...selectedExercises];
    
    setFormData({
      ...formData,
      schedule: updatedSchedule
    });
    
    // Switch to new day and load its exercises
    setActiveDay(day);
    setSelectedExercises(formData.schedule[`day${day}`] || []);
  };

  // Add exercise to the current day
  const addExerciseToDay = (exercise) => {
    const isAlreadyAdded = selectedExercises.some(ex => ex._id === exercise._id);
    
    if (!isAlreadyAdded) {
      const newExercise = {
        ...exercise,
        sets: 3,
        reps: 10
      };
      setSelectedExercises([...selectedExercises, newExercise]);
    } else {
      toast.info('This exercise is already in your plan for this day');
    }
  };

  // Remove exercise from current day
  const removeExerciseFromDay = (exerciseId) => {
    setSelectedExercises(selectedExercises.filter(ex => ex._id !== exerciseId));
  };

  // Update exercise details (sets/reps)
  const updateExerciseDetails = (index, field, value) => {
    const updatedExercises = [...selectedExercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      [field]: parseInt(value, 10)
    };
    setSelectedExercises(updatedExercises);
  };

  // Reorder exercises in the day
  const moveExercise = (index, direction) => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === selectedExercises.length - 1)
    ) {
      return;
    }
    
    const newExercises = [...selectedExercises];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newExercises[index], newExercises[targetIndex]] = 
      [newExercises[targetIndex], newExercises[index]];
    
    setSelectedExercises(newExercises);
  };

  // Handle form submission (add or update)
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save current day exercises before submission
    const finalSchedule = { ...formData.schedule };
    finalSchedule[`day${activeDay}`] = [...selectedExercises];
    
    // Validate form
    if (!formData.title || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Check if at least one day has exercises
    const hasExercises = Object.values(finalSchedule).some(day => day.length > 0);
    if (!hasExercises) {
      toast.error('Please add exercises to at least one day');
      return;
    }
    
    // Prepare the data for submission
    const planData = {
      ...formData,
      schedule: finalSchedule
    };
    
    if (selectedPlan) {
      // Update existing plan
      const updatedPlan = {
        ...selectedPlan,
        ...planData
      };
      
      // In a real app, dispatch update action
      // For now, update local state
      setPlans(plans.map(plan => 
        plan._id === selectedPlan._id ? updatedPlan : plan
      ));
      toast.success('Workout plan updated successfully');
    } else {
      // Add new plan
      const newPlan = {
        _id: `new-${Date.now()}`,
        ...planData
      };
      
      // In a real app, dispatch create action
      // For now, update local state
      setPlans([...plans, newPlan]);
      toast.success('Workout plan created successfully');
      
      // Try API call as well (this may fail if API isn't ready)
      try {
        dispatch(createPlan(planData));
      } catch (error) {
        console.log('API not ready', error);
      }
    }
    
    setShowModal(false);
  };

  // Handle delete plan
  const handleDelete = (planId) => {
    if (window.confirm('Are you sure you want to delete this workout plan?')) {
      // In a real app, dispatch delete action
      // For now, update local state
      setPlans(plans.filter(plan => plan._id !== planId));
      toast.success('Workout plan deleted successfully');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Workout Plan Management</h1>
          <p className="text-gray-600 mt-1">Create and manage weekly workout plans</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn btn-primary flex items-center mt-4 md:mt-0"
        >
          <FiPlus className="mr-2" />
          Create New Plan
        </button>
      </div>

      {/* Search & Filter */}
      <div className="card">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              className="form-input pl-10 w-full"
              placeholder="Search by title, level or target group"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Workout Plans List */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">All Workout Plans</h2>
        {isLoading ? (
          <div className="py-8 text-center">
            <p>Loading workout plans...</p>
          </div>
        ) : !filteredPlans || filteredPlans.length === 0 ? (
          <div className="text-center py-8">
            <FiCalendar className="mx-auto text-4xl text-gray-400 mb-3" />
            <p className="text-gray-600">No workout plans found</p>
            <button
              onClick={() => handleOpenModal()}
              className="mt-4 text-primary hover:underline flex items-center mx-auto"
            >
              <FiPlus className="mr-1" />
              Create your first workout plan
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredPlans.map(plan => (
              <div key={plan._id} className="border rounded-lg overflow-hidden bg-white">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{plan.title}</h3>
                      <div className="flex gap-2 mt-1">
                        <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                          {plan.level}
                        </span>
                        {plan.targetGroup && (
                          <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                            {plan.targetGroup}
                          </span>
                        )}
                        <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                          {plan.duration} weeks
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleOpenModal(plan)}
                        className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(plan._id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                  
                  <div className="border-t pt-4 mt-2">
                    <h4 className="font-medium text-sm mb-2">Weekly Schedule:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {weekdays.map((day, i) => {
                        const dayKey = `day${i+1}`;
                        const exerciseCount = plan.schedule && plan.schedule[dayKey] ? plan.schedule[dayKey].length : 0;
                        
                        return (
                          <div key={i} className="border rounded p-2 text-sm bg-gray-50">
                            <p className="font-medium">{day}</p>
                            {exerciseCount > 0 ? (
                              <p className="text-gray-600">{exerciseCount} exercise{exerciseCount !== 1 ? 's' : ''}</p>
                            ) : (
                              <p className="text-gray-500 italic">Rest day</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {plan.dietPlan && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm">
                        <span className="font-medium">Diet Plan: </span>
                        <span className="text-gray-600">{plan.dietPlan.title}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Workout Plan Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {selectedPlan ? 'Edit Workout Plan' : 'Create New Workout Plan'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Basic Plan Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2" htmlFor="title">
                      Plan Title*
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2" htmlFor="targetGroup">
                      Target Group
                    </label>
                    <select
                      className="form-input"
                      id="targetGroup"
                      name="targetGroup"
                      value={formData.targetGroup}
                      onChange={handleChange}
                    >
                      <option value="">Select Target Group</option>
                      {targetGroups.map(group => (
                        <option key={group} value={group}>{group}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="description">
                    Description*
                  </label>
                  <textarea
                    className="form-input"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="2"
                    required
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2" htmlFor="level">
                      Difficulty Level
                    </label>
                    <select
                      className="form-input"
                      id="level"
                      name="level"
                      value={formData.level}
                      onChange={handleChange}
                    >
                      {difficultyLevels.map(level => (
                        <option key={level} value={level}>
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2" htmlFor="duration">
                      Duration (weeks)
                    </label>
                    <select
                      className="form-input"
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                    >
                      {durations.map(duration => (
                        <option key={duration} value={duration}>{duration} weeks</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2" htmlFor="dietPlan">
                      Diet Plan (Optional)
                    </label>
                    <select
                      className="form-input"
                      id="dietPlan"
                      name="dietPlan"
                      value={formData.dietPlan}
                      onChange={handleChange}
                    >
                      <option value="">No Diet Plan</option>
                      {dietPlans && dietPlans.map(plan => (
                        <option key={plan._id} value={plan._id}>{plan.title}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Weekly Schedule */}
                <div className="border-t pt-6 mt-2">
                  <h3 className="font-semibold mb-4">Weekly Schedule</h3>
                  
                  {/* Day Tabs */}
                  <div className="flex overflow-x-auto mb-4 pb-2 -mx-6 px-6">
                    <div className="flex space-x-2">
                      {weekdays.map((day, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleDaySelect(index + 1)}
                          className={`px-4 py-2 rounded-md whitespace-nowrap ${
                            activeDay === index + 1
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Day Content */}
                  <div className="bg-gray-50 border rounded-md p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium">{weekdays[activeDay - 1]} Exercises</h4>
                      <span className="text-sm text-gray-500">
                        {selectedExercises.length} exercise{selectedExercises.length !== 1 ? 's' : ''} selected
                      </span>
                    </div>
                    
                    {/* Exercise Selector */}
                    <div className="mb-6">
                      <div className="relative">
                        <input
                          type="text"
                          className="form-input pl-10 w-full"
                          placeholder="Search exercises by name or muscle group"
                          value={exerciseSearch}
                          onChange={(e) => setExerciseSearch(e.target.value)}
                        />
                        <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      </div>
                      
                      {filteredExercises && filteredExercises.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-3 max-h-40 overflow-y-auto p-2">
                          {filteredExercises.map(exercise => (
                            <div
                              key={exercise._id}
                              onClick={() => addExerciseToDay(exercise)}
                              className="border rounded p-2 text-sm cursor-pointer hover:bg-gray-100 flex justify-between items-center"
                            >
                              <div>
                                <p className="font-medium">{exercise.name}</p>
                                <p className="text-xs text-gray-500">{exercise.muscleGroup}</p>
                              </div>
                              <FiPlus className="text-primary" />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 mt-2">
                          {exerciseSearch 
                            ? 'No exercises found. Try a different search term.'
                            : 'Type to search for exercises'}
                        </p>
                      )}
                    </div>
                    
                    {/* Selected Exercises */}
                    <div className="space-y-3">
                      {selectedExercises.length === 0 ? (
                        <div className="text-center py-6 border border-dashed rounded-md">
                          <p className="text-gray-500">No exercises added for this day yet</p>
                          <p className="text-sm text-gray-400 mt-1">Search and add exercises above</p>
                        </div>
                      ) : (
                        selectedExercises.map((exercise, index) => (
                          <div key={index} className="border bg-white rounded-md p-3">
                            <div className="flex flex-wrap justify-between items-center mb-2">
                              <div className="flex-1 min-w-0">
                                <h5 className="font-medium truncate">{exercise.name}</h5>
                                <p className="text-xs text-gray-500">{exercise.muscleGroup}</p>
                              </div>
                              <div className="flex space-x-1 mt-2 sm:mt-0">
                                <button 
                                  type="button" 
                                  onClick={() => moveExercise(index, 'up')}
                                  className="p-1 text-gray-500 hover:bg-gray-100 rounded"
                                  disabled={index === 0}
                                >
                                  ↑
                                </button>
                                <button 
                                  type="button" 
                                  onClick={() => moveExercise(index, 'down')}
                                  className="p-1 text-gray-500 hover:bg-gray-100 rounded"
                                  disabled={index === selectedExercises.length - 1}
                                >
                                  ↓
                                </button>
                                <button 
                                  type="button" 
                                  onClick={() => removeExerciseFromDay(exercise._id)}
                                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 mt-2">
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">
                                  Sets
                                </label>
                                <input
                                  type="number"
                                  min="1"
                                  max="10"
                                  className="form-input"
                                  value={exercise.sets || 3}
                                  onChange={(e) => updateExerciseDetails(index, 'sets', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">
                                  Reps
                                </label>
                                <input
                                  type="number"
                                  min="1"
                                  max="100"
                                  className="form-input"
                                  value={exercise.reps || 10}
                                  onChange={(e) => updateExerciseDetails(index, 'reps', e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 pt-4">
                  <button
                    type="submit"
                    className="btn btn-primary flex-1"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : selectedPlan ? 'Update Plan' : 'Create Plan'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline flex-1"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWorkoutPlans; 