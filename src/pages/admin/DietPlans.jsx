import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiPlus, FiEdit, FiTrash2, FiCoffee, FiSearch, FiFilter } from "react-icons/fi";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  getDietPlans,
  createDietPlan,
  updateDietPlan,
} from "../../redux/dietPlanSlice";
import AdminPageLayout from "../../components/ui/AdminPageLayout";
import AdminCard from "../../components/ui/AdminCard";

const AdminDietPlans = () => {
  const dispatch = useDispatch();
  const { dietPlans: apiDietPlans, isLoading: apiLoading } = useSelector(
    (state) => state.dietPlans
  );
  const [dietPlans, setDietPlans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [filterTarget, setFilterTarget] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetGroup: "",
    dailyCalories: "",
    protein: "",
    carbs: "",
    fat: "",
    meals: [
      { name: "Breakfast", foods: "", calories: "", time: "" },
      { name: "Lunch", foods: "", calories: "", time: "" },
      { name: "Snack", foods: "", calories: "", time: "" },
      { name: "Dinner", foods: "", calories: "", time: "" },
    ],
  });

  const targetGroups = [
    "Weight Loss",
    "Muscle Gain",
    "Maintenance",
    "Performance",
    "General Health",
  ];

  useEffect(() => {
    // Try to fetch from API but fallback to mock data if not available
    dispatch(getDietPlans());
  }, [dispatch]);

  useEffect(() => {
    // If API data is available, use it
    if (apiDietPlans && apiDietPlans.length > 0) {
      setDietPlans(apiDietPlans);
    }
  }, [apiDietPlans, apiLoading]);

  // Filter diet plans based on search term and target filter
  const filteredPlans = dietPlans?.filter(
    (plan) => {
      const matchesSearch = plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.targetGroup?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTarget = !filterTarget || plan.targetGroup === filterTarget;
      
      return matchesSearch && matchesTarget;
    }
  );

  // Handle opening the add/edit modal
  const handleOpenModal = (plan = null) => {
    if (plan) {
      // Ensure plan.meals is an array with at least 3 meals
      const meals =
        plan.meals && plan.meals.length > 0
          ? [...plan.meals]
          : [
              { name: "Breakfast", foods: "", calories: "", time: "" },
              { name: "Lunch", foods: "", calories: "", time: "" },
              { name: "Snack", foods: "", calories: "", time: "" },
              { name: "Dinner", foods: "", calories: "", time: "" },
            ];

      setSelectedPlan(plan);
      setFormData({
        title: plan.title || "",
        description: plan.description || "",
        targetGroup: plan.targetGroup || "",
        dailyCalories: plan.dailyCalories || "",
        protein: plan.protein || "",
        carbs: plan.carbs || "",
        fat: plan.fat || "",
        meals,
      });
    } else {
      setSelectedPlan(null);
      setFormData({
        title: "",
        description: "",
        targetGroup: "",
        dailyCalories: "",
        protein: "",
        carbs: "",
        fat: "",
        meals: [
          { name: "Breakfast", foods: "", calories: "", time: "" },
          { name: "Lunch", foods: "", calories: "", time: "" },
          { name: "Snack", foods: "", calories: "", time: "" },
          { name: "Dinner", foods: "", calories: "", time: "" },
        ],
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

  // Handle meal input changes
  const handleMealChange = (index, field, value) => {
    const updatedMeals = [...formData.meals];
    updatedMeals[index] = {
      ...updatedMeals[index],
      [field]: value,
    };

    setFormData({
      ...formData,
      meals: updatedMeals,
    });
  };

  // Add a new meal to the form
  const addMeal = () => {
    setFormData({
      ...formData,
      meals: [
        ...formData.meals,
        { name: `Meal ${formData.meals.length + 1}`, foods: "", calories: "" },
      ],
    });
  };

  // Remove a meal from the form
  const removeMeal = (index) => {
    if (formData.meals.length <= 1) {
      toast.error("You must have at least one meal");
      return;
    }

    const updatedMeals = [...formData.meals];
    updatedMeals.splice(index, 1);

    setFormData({
      ...formData,
      meals: updatedMeals,
    });
  };

  // Handle form submission (add or update)
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.title || !formData.description || !formData.targetGroup) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate that at least one meal has both foods and calories
    const validMeals = formData.meals.filter(
      (meal) => meal.name && meal.foods && meal.calories
    );

    if (validMeals.length === 0) {
      toast.error("Please provide details for at least one meal");
      return;
    }

    if (selectedPlan) {
      // Update existing diet plan
      try {
        dispatch(
          updateDietPlan({
            id: selectedPlan._id,
            dietPlanData: formData,
          })
        )
          .unwrap()
          .then(() => {
            toast.success("Diet plan updated successfully");
            setShowModal(false);
          })
          .catch((error) => {
            toast.error(error || "Failed to update diet plan");
          });
      } catch (error) {
        toast.error("An error occurred while updating the diet plan");
      }
    } else {
      // Add new diet plan
      try {
        dispatch(createDietPlan(formData))
          .unwrap()
          .then(() => {
            toast.success("Diet plan added successfully");
            setShowModal(false);
          })
          .catch((error) => {
            toast.error(error || "Failed to add diet plan");
          });
      } catch (error) {
        toast.error("An error occurred while adding the diet plan");
      }
    }
  };

  // Handle delete diet plan
  const handleDelete = (planId) => {
    if (window.confirm("Are you sure you want to delete this diet plan?")) {
      // Filter out the deleted plan from local state
      setDietPlans(dietPlans.filter((plan) => plan._id !== planId));
      toast.success("Diet plan deleted successfully");
    }
  };

  return (
    <AdminPageLayout
      title="Diet Plan Management"
      description="Create and manage nutrition plans for clients"
      gradient="green"
    >
      {/* Search & Filter */}
      <AdminCard className="mb-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                className="w-full bg-background/50 border border-border/50 rounded-lg py-2 px-4 pl-10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                placeholder="Search diet plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              className="bg-background/50 border border-border/50 rounded-lg py-2 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              value={filterTarget}
              onChange={(e) => setFilterTarget(e.target.value)}
            >
              <option value="">All Target Groups</option>
              {targetGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
            
            <button 
              onClick={() => handleOpenModal()}
              className="flex items-center bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <FiPlus className="mr-2" /> Add Diet Plan
            </button>
          </div>
        </div>
      </AdminCard>

      {/* Diet Plans List */}
      <AdminCard title="All Diet Plans">
        {apiLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            <span className="ml-3 text-muted-foreground">
              Loading diet plans...
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
                      <FiCoffee className="text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">{plan.title}</h3>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleOpenModal(plan)}
                      className="p-2 rounded-full hover:bg-background/80 text-primary transition-colors"
                      title="Edit Diet Plan"
                    >
                      <FiEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(plan._id)}
                      className="p-2 rounded-full hover:bg-red-100 text-red-500 dark:hover:bg-red-900/30 transition-colors"
                      title="Delete Diet Plan"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="mb-4">
                    <span className="inline-block px-2 py-1 bg-primary/10 text-primary rounded-full text-xs mb-2">
                      {plan.targetGroup}
                    </span>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {plan.description}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center p-2 bg-background/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Calories</p>
                      <p className="font-semibold">{plan.dailyCalories || "N/A"}</p>
                    </div>
                    <div className="text-center p-2 bg-background/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Protein</p>
                      <p className="font-semibold">{plan.protein ? `${plan.protein}g` : "N/A"}</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-border/30 pt-3">
                    <h4 className="text-sm font-medium mb-2">Meal Plan Preview</h4>
                    <ul className="space-y-1">
                      {plan.meals?.slice(0, 3).map((meal, index) => (
                        <li key={index} className="text-xs flex justify-between">
                          <span className="font-medium">{meal.name}</span>
                          <span className="text-muted-foreground">{meal.calories ? `${meal.calories} cal` : ""}</span>
                        </li>
                      ))}
                      {plan.meals?.length > 3 && (
                        <li className="text-xs text-muted-foreground">
                          +{plan.meals.length - 3} more meals
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No diet plans found
          </div>
        )}
      </AdminCard>

      {/* Add/Edit Diet Plan Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card text-card-foreground rounded-xl border border-border shadow-lg p-6 w-full max-w-4xl m-4 max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-xl font-bold mb-6">
              {selectedPlan ? "Edit Diet Plan" : "Add New Diet Plan"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Plan Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full bg-background/50 border border-border/50 rounded-lg py-2 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Target Group *
                  </label>
                  <select
                    name="targetGroup"
                    value={formData.targetGroup}
                    onChange={handleChange}
                    className="w-full bg-background/50 border border-border/50 rounded-lg py-2 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    required
                  >
                    <option value="">Select Target</option>
                    {targetGroups.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
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

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Daily Calories
                  </label>
                  <input
                    type="number"
                    name="dailyCalories"
                    value={formData.dailyCalories}
                    onChange={handleChange}
                    className="w-full bg-background/50 border border-border/50 rounded-lg py-2 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="e.g. 2000"
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">
                      Protein (g)
                    </label>
                    <input
                      type="number"
                      name="protein"
                      value={formData.protein}
                      onChange={handleChange}
                      className="w-full bg-background/50 border border-border/50 rounded-lg py-2 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="e.g. 150"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">
                      Carbs (g)
                    </label>
                    <input
                      type="number"
                      name="carbs"
                      value={formData.carbs}
                      onChange={handleChange}
                      className="w-full bg-background/50 border border-border/50 rounded-lg py-2 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="e.g. 200"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">
                      Fat (g)
                    </label>
                    <input
                      type="number"
                      name="fat"
                      value={formData.fat}
                      onChange={handleChange}
                      className="w-full bg-background/50 border border-border/50 rounded-lg py-2 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="e.g. 60"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Meals</h3>
                  <button
                    type="button"
                    onClick={addMeal}
                    className="text-primary hover:text-primary/80 text-sm flex items-center"
                  >
                    <FiPlus className="mr-1" /> Add Meal
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.meals.map((meal, index) => (
                    <div
                      key={index}
                      className="p-4 border border-border/50 rounded-lg bg-background/50"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={meal.name}
                            onChange={(e) =>
                              handleMealChange(index, "name", e.target.value)
                            }
                            className="bg-transparent border-b border-border/30 py-1 px-2 font-medium focus:outline-none focus:border-primary w-full"
                            placeholder="Meal Name"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeMeal(index)}
                          className="text-red-500 hover:text-red-600 transition-colors p-1"
                          title="Remove Meal"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block text-xs text-muted-foreground mb-1">
                            Foods
                          </label>
                          <textarea
                            value={meal.foods}
                            onChange={(e) =>
                              handleMealChange(index, "foods", e.target.value)
                            }
                            rows="2"
                            className="w-full bg-background/80 border border-border/30 rounded py-1 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30"
                            placeholder="Foods included in this meal"
                          ></textarea>
                        </div>
                        <div className="flex flex-col gap-2">
                          <div>
                            <label className="block text-xs text-muted-foreground mb-1">
                              Calories
                            </label>
                            <input
                              type="text"
                              value={meal.calories}
                              onChange={(e) =>
                                handleMealChange(
                                  index,
                                  "calories",
                                  e.target.value
                                )
                              }
                              className="w-full bg-background/80 border border-border/30 rounded py-1 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30"
                              placeholder="e.g. 500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-muted-foreground mb-1">
                              Time
                            </label>
                            <input
                              type="text"
                              value={meal.time}
                              onChange={(e) =>
                                handleMealChange(index, "time", e.target.value)
                              }
                              className="w-full bg-background/80 border border-border/30 rounded py-1 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30"
                              placeholder="e.g. 8:00 AM"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-background/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {selectedPlan ? "Update Diet Plan" : "Add Diet Plan"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AdminPageLayout>
  );
};

export default AdminDietPlans;
