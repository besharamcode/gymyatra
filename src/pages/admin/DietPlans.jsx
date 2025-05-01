import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiPlus, FiEdit, FiTrash2, FiCoffee } from "react-icons/fi";
import { toast } from "react-toastify";
import {
  getDietPlans,
  createDietPlan,
  updateDietPlan,
} from "../../redux/dietPlanSlice";

const AdminDietPlans = () => {
  const dispatch = useDispatch();
  const { dietPlans: apiDietPlans, isLoading: apiLoading } = useSelector(
    (state) => state.dietPlans
  );
  const [dietPlans, setDietPlans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
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

  // Filter diet plans based on search term
  const filteredPlans = dietPlans?.filter(
    (plan) =>
      plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.targetGroup?.toLowerCase().includes(searchTerm.toLowerCase())
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
            toast.success("Diet plan created successfully");
            setShowModal(false);
          })
          .catch((error) => {
            toast.error(error || "Failed to create diet plan");
          });
      } catch (error) {
        toast.error("An error occurred while creating the diet plan");
      }
    }
  };

  // Handle delete diet plan
  const handleDelete = (planId) => {
    if (window.confirm("Are you sure you want to delete this diet plan?")) {
      // In a real app, dispatch delete action
      // For now, update local state
      setDietPlans(dietPlans.filter((plan) => plan._id !== planId));
      toast.success("Diet plan deleted successfully");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Diet Plan Management
          </h1>
          <p className="text-gray-600 mt-1">
            Create and manage nutrition plans
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn btn-primary flex items-center mt-4 md:mt-0"
        >
          <FiPlus className="mr-2" />
          Add New Diet Plan
        </button>
      </div>

      {/* Search & Filter */}
      <div className="card">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              className="form-input pl-10 w-full"
              placeholder="Search by title or target group"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiCoffee className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Diet Plans List */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">All Diet Plans</h2>
        {apiLoading ? (
          <div className="py-8 text-center">
            <p>Loading diet plans...</p>
          </div>
        ) : !filteredPlans || filteredPlans.length === 0 ? (
          <div className="text-center py-8">
            <FiCoffee className="mx-auto text-4xl text-gray-400 mb-3" />
            <p className="text-gray-600">No diet plans found</p>
            <button
              onClick={() => handleOpenModal()}
              className="mt-4 text-primary hover:underline flex items-center mx-auto"
            >
              <FiPlus className="mr-1" />
              Create your first diet plan
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPlans.map((plan) => (
              <div
                key={plan._id}
                className="border rounded-lg overflow-hidden bg-white"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg">{plan.title}</h3>
                    <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                      {plan.targetGroup}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {plan.description}
                  </p>

                  <div className="grid grid-cols-4 gap-2 mb-4">
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <p className="text-xs text-gray-500">Calories</p>
                      <p className="font-semibold">
                        {plan.dailyCalories || "—"}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <p className="text-xs text-gray-500">Protein</p>
                      <p className="font-semibold">{plan.protein || "—"} g</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <p className="text-xs text-gray-500">Carbs</p>
                      <p className="font-semibold">{plan.carbs || "—"} g</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <p className="text-xs text-gray-500">Fat</p>
                      <p className="font-semibold">{plan.fat || "—"} g</p>
                    </div>
                  </div>

                  <div className="text-sm">
                    <p className="font-medium mb-2">Meals:</p>
                    <ul className="space-y-1">
                      {plan.meals && plan.meals.length > 0 ? (
                        plan.meals.slice(0, 3).map((meal, index) => (
                          <li
                            key={index}
                            className="flex justify-between items-center"
                          >
                            <span className="text-gray-700 text-start">
                              {meal.time}
                            </span>
                            <span className="text-gray-700 text-start">
                              {meal.name}
                            </span>
                            <span className="text-gray-500">
                              {meal.calories} kcal
                            </span>
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-500 italic">
                          No meals defined
                        </li>
                      )}

                      {plan.meals && plan.meals.length > 3 && (
                        <li className="text-primary text-xs">
                          + {plan.meals.length - 3} more meals
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="border-t p-3 bg-gray-50 flex justify-end space-x-2">
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
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Diet Plan Modal */}
      {showModal && (
        <div className="fixed inset-0 !-mt-8 pt-8 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-5xl mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {selectedPlan ? "Edit Diet Plan" : "Add New Diet Plan"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
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
                  <label
                    className="block text-gray-700 mb-2"
                    htmlFor="description"
                  >
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

                <div>
                  <label
                    className="block text-gray-700 mb-2"
                    htmlFor="targetGroup"
                  >
                    Target Group*
                  </label>
                  <select
                    className="form-input"
                    id="targetGroup"
                    name="targetGroup"
                    value={formData.targetGroup}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Target Group</option>
                    {targetGroups.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label
                      className="block text-gray-700 mb-2"
                      htmlFor="dailyCalories"
                    >
                      Daily Calories
                    </label>
                    <input
                      type="number"
                      className="form-input"
                      id="dailyCalories"
                      name="dailyCalories"
                      min="0"
                      value={formData.dailyCalories}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-gray-700 mb-2"
                      htmlFor="protein"
                    >
                      Protein (g)
                    </label>
                    <input
                      type="number"
                      className="form-input"
                      id="protein"
                      name="protein"
                      min="0"
                      value={formData.protein}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2" htmlFor="carbs">
                      Carbs (g)
                    </label>
                    <input
                      type="number"
                      className="form-input"
                      id="carbs"
                      name="carbs"
                      min="0"
                      value={formData.carbs}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2" htmlFor="fat">
                      Fat (g)
                    </label>
                    <input
                      type="number"
                      className="form-input"
                      id="fat"
                      name="fat"
                      min="0"
                      value={formData.fat}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-gray-700">Meals</label>
                    <button
                      type="button"
                      onClick={addMeal}
                      className="text-primary flex items-center text-sm hover:underline"
                    >
                      <FiPlus className="mr-1" />
                      Add Meal
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.meals.map((meal, index) => (
                      <div
                        key={index}
                        className="border p-4 rounded-md bg-gray-50"
                      >
                        <div className="flex justify-between mb-3">
                          <h4 className="font-medium">{`Meal ${index + 1}`}</h4>
                          {formData.meals.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeMeal(index)}
                              className="text-red-500 text-sm hover:underline"
                            >
                              Remove
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">
                              Meal Name
                            </label>
                            <input
                              type="text"
                              className="form-input"
                              value={meal.name}
                              onChange={(e) =>
                                handleMealChange(index, "name", e.target.value)
                              }
                              required
                            />
                          </div>

                          <div className="md:col-span-1">
                            <label className="block text-xs text-gray-500 mb-1">
                              Calories
                            </label>
                            <input
                              type="number"
                              className="form-input"
                              min="0"
                              value={meal.calories}
                              onChange={(e) =>
                                handleMealChange(
                                  index,
                                  "calories",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="md:col-span-1">
                            <label className="block text-xs text-gray-500 mb-1">
                              Time
                            </label>
                            <input
                              type="time"
                              className="form-input"
                              min="0"
                              value={meal.time}
                              onChange={(e) =>
                                handleMealChange(index, "time", e.target.value)
                              }
                            />
                          </div>

                          <div className="md:col-span-1">
                            <label className="block text-xs text-gray-500 mb-1">
                              Foods
                            </label>
                            <input
                              type="text"
                              className="form-input"
                              value={meal.foods}
                              onChange={(e) =>
                                handleMealChange(index, "foods", e.target.value)
                              }
                              placeholder="e.g., Eggs, Toast, Avocado"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-4 pt-2">
                  <button
                    type="submit"
                    className="btn btn-primary flex-1"
                    disabled={apiLoading}
                  >
                    {apiLoading
                      ? "Saving..."
                      : selectedPlan
                      ? "Update Diet Plan"
                      : "Create Diet Plan"}
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

export default AdminDietPlans;
