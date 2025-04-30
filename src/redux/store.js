import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import exerciseReducer from './exerciseSlice';
import dietPlanReducer from './dietPlanSlice';
import planReducer from './planSlice';
import progressReducer from './progressSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    exercises: exerciseReducer,
    dietPlans: dietPlanReducer,
    plans: planReducer,
    progress: progressReducer,
  },
}); 