import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiFilter,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { getExercises, createExercise } from "../../redux/exerciseSlice";
import GradientBackground from "../../components/ui/GradientBackground";
import AnimationWrapper from "../../components/ui/AnimationWrapper";
import AdminPageLayout from "../../components/ui/AdminPageLayout";
import AdminCard from "../../components/ui/AdminCard";

// Mock exercises data for demonstration
const MOCK_EXERCISES = [
  {
    _id: "1",
    name: "Bench Press",
    description:
      "A compound exercise that targets the chest, shoulders, and triceps.",
    muscleGroup: "Chest",
    difficulty: "intermediate",
    equipment: "Barbell, Bench",
    instructions:
      "Lie on a flat bench, grip the barbell, lower to chest, and press up.",
  },
  {
    _id: "2",
    name: "Squat",
    description:
      "A compound exercise that primarily targets the quadriceps, hamstrings, and glutes.",
    muscleGroup: "Legs",
    difficulty: "intermediate",
    equipment: "Barbell, Rack",
    instructions:
      "Stand with feet shoulder-width apart, barbell on upper back, squat down, and stand up.",
  },
  {
    _id: "3",
    name: "Pull-up",
    description:
      "A compound exercise that targets the back, biceps, and shoulders.",
    muscleGroup: "Back",
    difficulty: "advanced",
    equipment: "Pull-up bar",
    instructions:
      "Hang from a pull-up bar with palms facing away, pull up until chin is over the bar.",
  },
];

const AdminExercises = () => {
  const dispatch = useDispatch();
  const { exercises: apiExercises, isLoading: apiLoading } = useSelector(
    (state) => state.exercises
  );
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    muscleGroup: "",
    difficulty: "beginner",
    equipment: "",
    instructions: "",
  });
  const [filterMuscleGroup, setFilterMuscleGroup] = useState("");

  const muscleGroups = [
    "Chest",
    "Back",
    "Shoulders",
    "Arms",
    "Legs",
    "Core",
    "Full Body",
    "Cardio",
  ];

  const difficultyLevels = ["beginner", "intermediate", "advanced"];

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
  const filteredExercises = exercises?.filter(
    (exercise) =>
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
        equipment: exercise.equipment || "",
        instructions: exercise.instructions || "",
      });
    } else {
      setSelectedExercise(null);
      setFormData({
        name: "",
        description: "",
        muscleGroup: "",
        difficulty: "beginner",
        equipment: "",
        instructions: "",
      });
    }
    setShowModal(true);
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission (add or update)
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.name || !formData.description || !formData.muscleGroup) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (selectedExercise) {
      // Update existing exercise
      const updatedExercise = {
        ...selectedExercise,
        ...formData,
      };

      // In a real app, dispatch update action here
      // For now, update local state
      setExercises(
        exercises.map((ex) =>
          ex._id === selectedExercise._id ? updatedExercise : ex
        )
      );
      toast.success("Exercise updated successfully");
    } else {
      // Add new exercise
      const newExercise = {
        _id: `new-${Date.now()}`,
        ...formData,
      };

      // In a real app, dispatch create action here
      // For now, update local state
      setExercises([...exercises, newExercise]);
      toast.success("Exercise added successfully");

      // Try API call as well (this may fail if the API isn't ready)
      try {
        dispatch(createExercise(formData));
      } catch (error) {
        console.log("API not ready", error);
      }
    }

    setShowModal(false);
  };

  // Handle delete exercise
  const handleDelete = (exerciseId) => {
    if (window.confirm("Are you sure you want to delete this exercise?")) {
      // In a real app, dispatch delete action
      // For now, update local state
      setExercises(exercises.filter((ex) => ex._id !== exerciseId));
      toast.success("Exercise deleted successfully");
    }
  };

  return (
    <AdminPageLayout
      title="Exercise Management"
      description="Create and manage exercises for workout plans"
      gradient="blue"
    >
      {/* Search & Filter */}
      <AdminCard className="mb-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                className="w-full bg-background/50 border border-border/50 rounded-lg py-2 px-4 pl-10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                placeholder="Search exercises..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              className="bg-background/50 border border-border/50 rounded-lg py-2 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              value={filterMuscleGroup}
              onChange={(e) => setFilterMuscleGroup(e.target.value)}
            >
              <option value="">All Muscle Groups</option>
              {muscleGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
            
            <button 
              onClick={() => setShowModal(true)}
              className="flex items-center bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <FiPlus className="mr-2" /> Add Exercise
            </button>
          </div>
        </div>
      </AdminCard>

      {/* Exercises List */}
      <AdminCard title="All Exercises">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            <span className="ml-3 text-muted-foreground">
              Loading exercises...
            </span>
          </div>
        ) : filteredExercises.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExercises.map((exercise) => (
              <div
                key={exercise._id}
                className="bg-card border border-border/50 rounded-xl overflow-hidden hover:shadow-md transition-all duration-200"
              >
                <div className="aspect-video bg-primary/10 relative flex items-center justify-center">
                  {exercise.imageUrl ? (
                    <img
                      src={exercise.imageUrl}
                      alt={exercise.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-4xl text-primary/40">{exercise.name.charAt(0)}</div>
                  )}
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <button
                      onClick={() => handleEdit(exercise)}
                      className="p-2 rounded-full bg-background/80 text-foreground hover:bg-background transition-colors"
                      title="Edit Exercise"
                    >
                      <FiEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(exercise._id)}
                      className="p-2 rounded-full bg-background/80 text-foreground hover:bg-red-500 hover:text-white transition-colors"
                      title="Delete Exercise"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{exercise.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {exercise.muscleGroup}
                  </p>
                  <p className="text-sm line-clamp-2 mb-3">
                    {exercise.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                      {exercise.difficulty}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-secondary/10 text-secondary-foreground">
                      {exercise.type}
                    </span>
                    {exercise.equipment && (
                      <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                        {exercise.equipment}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No exercises found
          </div>
        )}
      </AdminCard>

      {/* Add/Edit Exercise Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card glass-effect text-card-foreground rounded-xl border border-border/30 shadow-lg p-6 w-full max-w-2xl m-4"
          >
            <h2 className="text-xl font-semibold mb-6">
              {selectedExercise ? "Edit Exercise" : "Add New Exercise"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Exercise Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-background/50 border border-border/50 rounded-lg py-2 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Muscle Group *
                  </label>
                  <select
                    name="muscleGroup"
                    value={formData.muscleGroup}
                    onChange={handleChange}
                    className="w-full bg-background/50 border border-border/50 rounded-lg py-2 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    required
                  >
                    <option value="">Select Muscle Group</option>
                    {muscleGroups.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Difficulty Level
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    className="w-full bg-background/50 border border-border/50 rounded-lg py-2 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {difficultyLevels.map((level) => (
                      <option key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Equipment
                  </label>
                  <input
                    type="text"
                    name="equipment"
                    value={formData.equipment}
                    onChange={handleChange}
                    className="w-full bg-background/50 border border-border/50 rounded-lg py-2 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="E.g., Barbell, Dumbbells, Machine"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full bg-background/50 border border-border/50 rounded-lg py-2 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    required
                  ></textarea>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Instructions
                  </label>
                  <textarea
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleChange}
                    rows="4"
                    className="w-full bg-background/50 border border-border/50 rounded-lg py-2 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="Step-by-step instructions for performing the exercise"
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-background/50 border border-border text-foreground hover:bg-background/80 px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg transition-colors"
                >
                  {selectedExercise ? "Update Exercise" : "Add Exercise"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AdminPageLayout>
  );
};

export default AdminExercises;
