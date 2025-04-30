import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiPlus, FiEdit, FiTrash2, FiActivity } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { getExercises, createExercise } from '../../redux/exerciseSlice';

// Mock exercises data for demonstration
const MOCK_EXERCISES = [
  {
    _id: '1',
    name: 'Bench Press',
    description: 'A compound exercise that targets the chest, shoulders, and triceps.',
    muscleGroup: 'Chest',
    difficulty: 'intermediate',
    equipment: 'Barbell, Bench',
    instructions: 'Lie on a flat bench, grip the barbell, lower to chest, and press up.'
  },
  {
    _id: '2',
    name: 'Squat',
    description: 'A compound exercise that primarily targets the quadriceps, hamstrings, and glutes.',
    muscleGroup: 'Legs',
    difficulty: 'intermediate',
    equipment: 'Barbell, Rack',
    instructions: 'Stand with feet shoulder-width apart, barbell on upper back, squat down, and stand up.'
  },
  {
    _id: '3',
    name: 'Pull-up',
    description: 'A compound exercise that targets the back, biceps, and shoulders.',
    muscleGroup: 'Back',
    difficulty: 'advanced',
    equipment: 'Pull-up bar',
    instructions: 'Hang from a pull-up bar with palms facing away, pull up until chin is over the bar.'
  }
];

const AdminExercises = () => {
  const dispatch = useDispatch();
  const { exercises: apiExercises, isLoading: apiLoading } = useSelector((state) => state.exercises);
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    muscleGroup: '',
    difficulty: 'beginner',
    equipment: '',
    instructions: '',
  });
  
  const muscleGroups = [
    'Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core', 'Full Body', 'Cardio'
  ];
  
  const difficultyLevels = [
    'beginner', 'intermediate', 'advanced'
  ];

  useEffect(() => {
    // Try to fetch from API but fallback to mock data if not available
    dispatch(getExercises());
    // Set loading state
    setIsLoading(true);
  }, [dispatch]);
  
  useEffect(() => {
    // If API data is available, use it
    if (apiExercises && apiExercises.length > 0) {
      setExercises(apiExercises);
      setIsLoading(false);
    } else if (!apiLoading) {
      // If API call completed but no data, use mock data
      setExercises(MOCK_EXERCISES);
      setIsLoading(false);
    }
  }, [apiExercises, apiLoading]);

  // Filter exercises based on search term
  const filteredExercises = exercises?.filter(exercise => 
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exercise.muscleGroup.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle opening the add/edit modal
  const handleOpenModal = (exercise = null) => {
    if (exercise) {
      setSelectedExercise(exercise);
      setFormData({
        name: exercise.name,
        description: exercise.description,
        muscleGroup: exercise.muscleGroup,
        difficulty: exercise.difficulty,
        equipment: exercise.equipment || '',
        instructions: exercise.instructions || '',
      });
    } else {
      setSelectedExercise(null);
      setFormData({
        name: '',
        description: '',
        muscleGroup: '',
        difficulty: 'beginner',
        equipment: '',
        instructions: '',
      });
    }
    setShowModal(true);
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission (add or update)
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.description || !formData.muscleGroup) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (selectedExercise) {
      // Update existing exercise
      const updatedExercise = {
        ...selectedExercise,
        ...formData
      };
      
      // In a real app, dispatch update action here
      // For now, update local state
      setExercises(exercises.map(ex => 
        ex._id === selectedExercise._id ? updatedExercise : ex
      ));
      toast.success('Exercise updated successfully');
    } else {
      // Add new exercise
      const newExercise = {
        _id: `new-${Date.now()}`,
        ...formData
      };
      
      // In a real app, dispatch create action here
      // For now, update local state
      setExercises([...exercises, newExercise]);
      toast.success('Exercise added successfully');
      
      // Try API call as well (this may fail if the API isn't ready)
      try {
        dispatch(createExercise(formData));
      } catch (error) {
        console.log('API not ready', error);
      }
    }
    
    setShowModal(false);
  };

  // Handle delete exercise
  const handleDelete = (exerciseId) => {
    if (window.confirm('Are you sure you want to delete this exercise?')) {
      // In a real app, dispatch delete action
      // For now, update local state
      setExercises(exercises.filter(ex => ex._id !== exerciseId));
      toast.success('Exercise deleted successfully');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Exercise Management</h1>
          <p className="text-gray-600 mt-1">Create and manage workout exercises</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn btn-primary flex items-center mt-4 md:mt-0"
        >
          <FiPlus className="mr-2" />
          Add New Exercise
        </button>
      </div>

      {/* Search & Filter */}
      <div className="card">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              className="form-input pl-10 w-full"
              placeholder="Search by name or muscle group"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiActivity className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Exercises List */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">All Exercises</h2>
        {isLoading ? (
          <div className="py-8 text-center">
            <p>Loading exercises...</p>
          </div>
        ) : !filteredExercises || filteredExercises.length === 0 ? (
          <div className="text-center py-8">
            <FiActivity className="mx-auto text-4xl text-gray-400 mb-3" />
            <p className="text-gray-600">No exercises found</p>
            <button
              onClick={() => handleOpenModal()}
              className="mt-4 text-primary hover:underline flex items-center mx-auto"
            >
              <FiPlus className="mr-1" />
              Add your first exercise
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExercises.map(exercise => (
              <div key={exercise._id} className="border rounded-lg overflow-hidden bg-white">
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg">{exercise.name}</h3>
                    <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                      {exercise.muscleGroup}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mt-2 line-clamp-2">{exercise.description}</p>
                  
                  <div className="flex gap-2 mt-3">
                    <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                      {exercise.difficulty}
                    </span>
                    {exercise.equipment && (
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                        {exercise.equipment}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="border-t p-3 bg-gray-50 flex justify-end space-x-2">
                  <button
                    onClick={() => handleOpenModal(exercise)}
                    className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(exercise._id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Exercise Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {selectedExercise ? 'Edit Exercise' : 'Add New Exercise'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="name">
                    Exercise Name*
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
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
                    rows="3"
                    required
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2" htmlFor="muscleGroup">
                      Muscle Group*
                    </label>
                    <select
                      className="form-input"
                      id="muscleGroup"
                      name="muscleGroup"
                      value={formData.muscleGroup}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Muscle Group</option>
                      {muscleGroups.map(group => (
                        <option key={group} value={group}>{group}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2" htmlFor="difficulty">
                      Difficulty Level*
                    </label>
                    <select
                      className="form-input"
                      id="difficulty"
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleChange}
                      required
                    >
                      {difficultyLevels.map(level => (
                        <option key={level} value={level}>
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="equipment">
                    Equipment (Optional)
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    id="equipment"
                    name="equipment"
                    value={formData.equipment}
                    onChange={handleChange}
                    placeholder="e.g., Dumbbells, Barbell, Machine"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="instructions">
                    Step-by-Step Instructions (Optional)
                  </label>
                  <textarea
                    className="form-input"
                    id="instructions"
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Provide detailed instructions for performing this exercise"
                  ></textarea>
                </div>
                
                <div className="flex items-center space-x-4 pt-2">
                  <button
                    type="submit"
                    className="btn btn-primary flex-1"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : selectedExercise ? 'Update Exercise' : 'Add Exercise'}
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

export default AdminExercises; 