import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  userPlans: [],
  plans: [],
  plan: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Get user's plans
export const getUserPlans = createAsyncThunk(
  'plans/getUserPlans',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get('/api/user/my-plan', config);

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

// Create plan (for admin)
export const createPlan = createAsyncThunk(
  'plans/create',
  async (planData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post('/api/admin/plans', planData, config);

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

const planSlice = createSlice({
  name: 'plans',
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
      // Get user's plans
      .addCase(getUserPlans.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserPlans.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userPlans = action.payload;
      })
      .addCase(getUserPlans.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Create plan
      .addCase(createPlan.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.plans.push(action.payload);
      })
      .addCase(createPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = planSlice.actions;
export default planSlice.reducer; 