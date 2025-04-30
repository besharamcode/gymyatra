import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  progressHistory: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Get user's progress history
export const getProgressHistory = createAsyncThunk(
  'progress/getHistory',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.get('/api/user/progress-history', config);
      
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

// Submit progress
export const submitProgress = createAsyncThunk(
  'progress/submit',
  async (progressData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.post('/api/user/progress', progressData, config);
      
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

// Get user progress (for admin)
export const getUserProgress = createAsyncThunk(
  'progress/getUserProgress',
  async (userId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.get(`/api/admin/users/${userId}/progress`, config);
      
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

const progressSlice = createSlice({
  name: 'progress',
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
      // Get progress history
      .addCase(getProgressHistory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProgressHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.progressHistory = action.payload;
      })
      .addCase(getProgressHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Submit progress
      .addCase(submitProgress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(submitProgress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.progressHistory.unshift(action.payload);
      })
      .addCase(submitProgress.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get user progress (admin)
      .addCase(getUserProgress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserProgress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.progressHistory = action.payload;
      })
      .addCase(getUserProgress.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = progressSlice.actions;
export default progressSlice.reducer; 