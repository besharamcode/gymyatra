import mongoose from 'mongoose';

const ExerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    sets: {
      type: Number,
      required: true,
    },
    reps: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    muscleGroup: {
      type: String,
      required: true,
      enum: ['chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'cardio', 'full body'],
    },
  },
  { timestamps: true },
);

const Exercise = mongoose.model('Exercise', ExerciseSchema);

export default Exercise; 