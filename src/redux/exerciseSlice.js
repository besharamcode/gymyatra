import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  exercises: [],
  exercise: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Get all exercises
export const getExercises = createAsyncThunk(
  'exercises/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.get('/api/admin/exercises', config);
      
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

// Create exercise
export const createExercise = createAsyncThunk(
  'exercises/create',
  async (exerciseData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.post('/api/admin/exercises', exerciseData, config);
      
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

const exerciseSlice = createSlice({
  name: 'exercises',
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
      // Get all exercises
      .addCase(getExercises.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getExercises.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.exercises = action.payload;
      })
      .addCase(getExercises.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Create exercise
      .addCase(createExercise.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createExercise.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.exercises.push(action.payload);
      })
      .addCase(createExercise.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = exerciseSlice.actions;
export default exerciseSlice.reducer; 