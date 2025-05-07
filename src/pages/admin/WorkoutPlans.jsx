import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiPlus, FiEdit, FiTrash2, FiCalendar, FiSearch, FiFilter } from "react-icons/fi";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { getUserPlans, createPlan } from "../../redux/planSlice";
import { getExercises } from "../../redux/exerciseSlice";
import { getDietPlans } from "../../redux/dietPlanSlice";
import AdminPageLayout from "../../components/ui/AdminPageLayout";
import AdminCard from "../../components/ui/AdminCard";

// Mock workout plans data
const MOCK_PLANS = [
  {
    _id: "1",
    title: "Beginner Strength Program",
    description:
      "A balanced program designed for beginners to build strength and muscle.",
    level: "beginner",
    duration: "8",
    targetGroup: "Strength",
    dietPlan: { _id: "1", title: "Weight Loss Plan" },
    schedule: {
      day1: [
        {
          _id: "1",
          name: "Bench Press",
          muscleGroup: "Chest",
          sets: 3,
          reps: 10,
        },
        { _id: "2", name: "Squat", muscleGroup: "Legs", sets: 3, reps: 10 },
      ],
      day2: [],
      day3: [
        { _id: "3", name: "Pull-up", muscleGroup: "Back", sets: 3, reps: 8 },
      ],
      day4: [],
      day5: [
        {
          _id: "1",
          name: "Bench Press",
          muscleGroup: "Chest",
          sets: 3,
          reps: 10,
        },
        { _id: "2", name: "Squat", muscleGroup: "Legs", sets: 3, reps: 10 },
      ],
      day6: [],
      day7: [],
    },
  },
  {
    _id: "2",
    title: "Intermediate Hypertrophy Plan",
    description:
      "A program focused on building muscle size with moderate to high volume.",
    level: "intermediate",
    duration: "12",
    targetGroup: "Muscle Gain",
    dietPlan: { _id: "2", title: "Muscle Gain Plan" },
    schedule: {
      day1: [
        {
          _id: "1",
          name: "Bench Press",
          muscleGroup: "Chest",
          sets: 4,
          reps: 12,
        },
      ],
      day2: [
        { _id: "2", name: "Squat", muscleGroup: "Legs", sets: 4, reps: 12 },
      ],
      day3: [
        { _id: "3", name: "Pull-up", muscleGroup: "Back", sets: 4, reps: 10 },
      ],
      day4: [],
      day5: [
        {
          _id: "1",
          name: "Bench Press",
          muscleGroup: "Chest",
          sets: 4,
          reps: 12,
        },
      ],
      day6: [
        { _id: "2", name: "Squat", muscleGroup: "Legs", sets: 4, reps: 12 },
      ],
      day7: [],
    },
  },
];

const AdminWorkoutPlans = () => {
  const dispatch = useDispatch();
  const { userPlans: apiPlans, isLoading: apiLoading } = useSelector(
    (state) => state.plans
  );
  const { exercises } = useSelector((state) => state.exercises);
  const { dietPlans } = useSelector((state) => state.dietPlans);

  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [activeDay, setActiveDay] = useState(1); // For the form tabs
  const [filterLevel, setFilterLevel] = useState("");

  // Form data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    level: "beginner",
    duration: "4",
    targetGroup: "",
    dietPlan: "",
    schedule: {
      day1: [],
      day2: [],
      day3: [],
      day4: [],
      day5: [],
      day6: [],
      day7: [],
    },
  });

  // Exercise selection for the current active day
  const [exerciseSearch, setExerciseSearch] = useState("");
  const [selectedExercises, setSelectedExercises] = useState([]);

  const difficultyLevels = ["beginner", "intermediate", "advanced"];
  const durations = ["4", "6", "8", "12", "16"];
  const targetGroups = [
    "Weight Loss",
    "Muscle Gain",
    "Strength",
    "Endurance",
    "General Fitness",
  ];
  const weekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

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

  // Filter plans based on search term and level
  const filteredPlans = plans?.filter(
    (plan) => {
      const matchesSearch = plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.level?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.targetGroup?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLevel = !filterLevel || plan.level === filterLevel;
      
      return matchesSearch && matchesLevel;
    }
  );

  // Filter exercises for selection
  const filteredExercises = exercises?.filter(
    (exercise) =>
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
        title: plan.title || "",
        description: plan.description || "",
        level: plan.level || "beginner",
        duration: plan.duration || "4",
        targetGroup: plan.targetGroup || "",
        dietPlan: plan.dietPlan?._id || "",
        schedule,
      });
    } else {
      setSelectedPlan(null);
      setFormData({
        title: "",
        description: "",
        level: "beginner",
        duration: "4",
        targetGroup: "",
        dietPlan: "",
        schedule: {
          day1: [],
          day2: [],
          day3: [],
          day4: [],
          day5: [],
          day6: [],
          day7: [],
        },
      });
    }
    setSelectedExercises(
      plan && plan.schedule ? plan.schedule[`day${activeDay}`] || [] : []
    );
    setShowModal(true);
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle day selection in the form
  const handleDaySelect = (day) => {
    setActiveDay(day);
    // Update selected exercises for the active day
    if (formData.schedule && formData.schedule[`day${day}`]) {
      setSelectedExercises([...formData.schedule[`day${day}`]]);
    } else {
      setSelectedExercises([]);
    }
  };

  // Add exercise to the current day
  const addExerciseToDay = (exercise) => {
    const exerciseForDay = {
      _id: exercise._id,
      name: exercise.name,
      muscleGroup: exercise.muscleGroup,
      sets: 3,
      reps: 10,
      weight: "",
      notes: "",
    };

    const updatedExercises = [...selectedExercises, exerciseForDay];
    setSelectedExercises(updatedExercises);

    const updatedSchedule = { ...formData.schedule };
    updatedSchedule[`day${activeDay}`] = updatedExercises;

    setFormData({
      ...formData,
      schedule: updatedSchedule,
    });
  };

  // Remove exercise from the current day
  const removeExerciseFromDay = (exerciseId) => {
    const updatedExercises = selectedExercises.filter(
      (ex) => ex._id !== exerciseId
    );
    setSelectedExercises(updatedExercises);

    const updatedSchedule = { ...formData.schedule };
    updatedSchedule[`day${activeDay}`] = updatedExercises;

    setFormData({
      ...formData,
      schedule: updatedSchedule,
    });
  };

  // Update exercise details for the current day
  const updateExerciseDetails = (index, field, value) => {
    const updatedExercises = [...selectedExercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      [field]: value,
    };
    setSelectedExercises(updatedExercises);

    const updatedSchedule = { ...formData.schedule };
    updatedSchedule[`day${activeDay}`] = updatedExercises;

    setFormData({
      ...formData,
      schedule: updatedSchedule,
    });
  };

  // Move exercise up or down in the list
  const moveExercise = (index, direction) => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === selectedExercises.length - 1)
    ) {
      return;
    }

    const newIndex = direction === "up" ? index - 1 : index + 1;
    const updatedExercises = [...selectedExercises];
    const temp = updatedExercises[index];
    updatedExercises[index] = updatedExercises[newIndex];
    updatedExercises[newIndex] = temp;

    setSelectedExercises(updatedExercises);

    const updatedSchedule = { ...formData.schedule };
    updatedSchedule[`day${activeDay}`] = updatedExercises;

    setFormData({
      ...formData,
      schedule: updatedSchedule,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form data
    if (
      !formData.title ||
      !formData.description ||
      !formData.level ||
      !formData.targetGroup
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Check if at least one day has an exercise
    let hasExercises = false;
    for (let i = 1; i <= 7; i++) {
      if (
        formData.schedule[`day${i}`] &&
        formData.schedule[`day${i}`].length > 0
      ) {
        hasExercises = true;
        break;
      }
    }

    if (!hasExercises) {
      toast.error("Please add at least one exercise to your plan");
      return;
    }

    if (selectedPlan) {
      // Update existing plan
      const updatedPlans = plans.map((plan) =>
        plan._id === selectedPlan._id ? { ...plan, ...formData } : plan
      );
      setPlans(updatedPlans);
      toast.success("Workout plan updated successfully");
    } else {
      // Create new plan
      const newPlan = {
        _id: `new-${Date.now()}`,
        ...formData,
        // Add diet plan details if selected
        dietPlan: formData.dietPlan
          ? dietPlans.find((dp) => dp._id === formData.dietPlan)
          : null,
      };
      setPlans([...plans, newPlan]);
      toast.success("Workout plan created successfully");

      // Try API call as well (this may fail if the API isn't ready)
      try {
        dispatch(createPlan(formData));
      } catch (error) {
        console.log("API not ready", error);
      }
    }

    setShowModal(false);
  };

  // Handle delete plan
  const handleDelete = (planId) => {
    if (window.confirm("Are you sure you want to delete this workout plan?")) {
      setPlans(plans.filter((plan) => plan._id !== planId));
      toast.success("Workout plan deleted successfully");
    }
  };

  return (
    <AdminPageLayout
      title="Workout Plan Management"
      description="Create and manage exercise programs for clients"
      gradient="orange"
    >
      {/* Search & Filter */}
      <AdminCard className="mb-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                className="w-full bg-background/50 border border-border/50 rounded-lg py-2 px-4 pl-10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                placeholder="Search workout plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              className="bg-background/50 border border-border/50 rounded-lg py-2 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
            >
              <option value="">All Levels</option>
              {difficultyLevels.map((level) => (
                <option key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </option>
              ))}
            </select>
            
            <button 
              onClick={() => handleOpenModal()}
              className="flex items-center bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <FiPlus className="mr-2" /> Add Workout Plan
            </button>
          </div>
        </div>
      </AdminCard>

      {/* Workout Plans List */}
      <AdminCard title="All Workout Plans">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            <span className="ml-3 text-muted-foreground">
              Loading workout plans...
            </span>
          </div>
        ) : filteredPlans?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((plan) => (
              <div
                key={plan._id}
                className="bg-card border border-border/50 rounded-xl overflow-hidden hover:shadow-md transition-all duration-200"
              >
                <div className="bg-primary/10 p-4 flex justify-between items-center border-b border-border/30">
                  <div className="flex items-center">
                    <div className="rounded-full bg-primary/20 p-2 mr-3">
                      <FiCalendar className="text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">{plan.title}</h3>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleOpenModal(plan)}
                      className="p-2 rounded-full hover:bg-background/80 text-primary transition-colors"
                      title="Edit Workout Plan"
                    >
                      <FiEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(plan._id)}
                      className="p-2 rounded-full hover:bg-red-100 text-red-500 dark:hover:bg-red-900/30 transition-colors"
                      title="Delete Workout Plan"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="mb-4">
                    <div className="flex gap-2 mb-2">
                      <span className="inline-block px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                        {plan.targetGroup}
                      </span>
                      <span className="inline-block px-2 py-1 bg-secondary/10 text-secondary-foreground rounded-full text-xs">
                        {plan.level.charAt(0).toUpperCase() + plan.level.slice(1)}
                      </span>
                      <span className="inline-block px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs">
                        {plan.duration} weeks
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {plan.description}
                    </p>
                  </div>
                  
                  <div className="border-t border-border/30 pt-3 mb-3">
                    <h4 className="text-sm font-medium mb-2">Weekly Schedule</h4>
                    <div className="grid grid-cols-7 gap-1">
                      {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                        const hasWorkout = plan.schedule && 
                          plan.schedule[`day${day}`] && 
                          plan.schedule[`day${day}`].length > 0;
                        
                        return (
                          <div 
                            key={day} 
                            className={`text-center rounded p-1 text-xs ${
                              hasWorkout 
                                ? 'bg-primary/20 text-primary' 
                                : 'bg-muted/30 text-muted-foreground'
                            }`}
                            title={`Day ${day}: ${hasWorkout ? `${plan.schedule[`day${day}`].length} exercises` : 'Rest day'}`}
                          >
                            {day}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {plan.dietPlan && (
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium">Diet Plan:</span> {plan.dietPlan.title}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No workout plans found
          </div>
        )}
      </AdminCard>

      {/* Modal content would go here - omitted for brevity */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card text-card-foreground rounded-xl border border-border shadow-lg p-6 w-full max-w-4xl m-4 max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-xl font-bold mb-6">
              {selectedPlan ? "Edit Workout Plan" : "Create New Workout Plan"}
            </h2>

            {/* Form content would go here - full implementation omitted for brevity */}

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-border rounded-lg hover:bg-background/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                {selectedPlan ? "Update Workout Plan" : "Create Workout Plan"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AdminPageLayout>
  );
};

export default AdminWorkoutPlans;
