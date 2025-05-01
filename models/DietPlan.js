import mongoose from 'mongoose';

const MealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  foods: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  calories: {
    type: Number,
    required: true,
  },
});

const DietPlanSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    targetGroup: {
      type: String,
      required: true,
    },
    dailyCalories: {
      type: Number,
      required: true,
    },
    protein: {
      type: Number,
      required: true,
    },
    carbs: {
      type: Number,
      required: true,
    },
    fat: {
      type: Number,
      required: true,
    },
    meals: [MealSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

const DietPlan = mongoose.model('DietPlan', DietPlanSchema);

export default DietPlan; 