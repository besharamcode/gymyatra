import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  dietPlans: [],
  dietPlan: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Get all diet plans
export const getDietPlans = createAsyncThunk(
  'dietPlans/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get('/api/admin/diet-plans', config);
      return response.data.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create diet plan
export const createDietPlan = createAsyncThunk(
  'dietPlans/create',
  async (dietPlanData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post('/api/admin/diet-plans', dietPlanData, config);

      return response.data.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update diet plan
export const updateDietPlan = createAsyncThunk(
  'dietPlans/update',
  async ({ id, dietPlanData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.put(`/api/admin/diet-plans/${id}`, dietPlanData, config);

      return response.data.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

const dietPlanSlice = createSlice({
  name: 'dietPlans',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all diet plans
      .addCase(getDietPlans.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDietPlans.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.dietPlans = action.payload;
      })
      .addCase(getDietPlans.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Create diet plan
      .addCase(createDietPlan.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createDietPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.dietPlans.push(action.payload);
      })
      .addCase(createDietPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update diet plan
      .addCase(updateDietPlan.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateDietPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.dietPlans = state.dietPlans.map((dietPlan) => 
          dietPlan._id === action.payload._id ? action.payload : dietPlan
        );
      })
      .addCase(updateDietPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = dietPlanSlice.actions;
export default dietPlanSlice.reducer; 