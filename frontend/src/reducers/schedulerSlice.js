import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../services/apiClient';

const API_BASE_URL = '/api/schedules';

// Helper function to format dates
const formatDate = (date) => {
  try {
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // Extract yyyy-MM-dd
  } catch {
    return null; // Return null for invalid dates
  }
};

// Async actions

// Fetch all schedules
export const fetchSchedules = createAsyncThunk('schedules/fetchSchedules', async () => {
  const response = await apiClient.get(API_BASE_URL);
  return response.data;
});

// Fetch a specific schedule by date
export const fetchScheduleByDate = createAsyncThunk(
  'schedules/fetchScheduleByDate',
  async (date) => {
    const formattedDate = formatDate(date);
    if (!formattedDate) throw new Error('Invalid date format');
    const response = await apiClient.get(`${API_BASE_URL}/${formattedDate}`);
    return response.data;
  }
);

// Add or update a schedule
export const createOrUpdateSchedule = createAsyncThunk(
  'schedules/createOrUpdateSchedule',
  async (schedule) => {
    const response = await apiClient.post(API_BASE_URL, schedule);
    return response.data;
  }
);

// Add a todo to an existing schedule
export const addTodoToSchedule = createAsyncThunk(
  'schedules/addTodoToSchedule',
  async ({ date, todo }) => {
    const formattedDate = formatDate(date);
    if (!formattedDate) throw new Error('Invalid date format');
    const response = await apiClient.post(`${API_BASE_URL}/${formattedDate}/todo`, todo);
    return response.data;
  }
);

// Reorder todos within a schedule
export const reorderTodosInSchedule = createAsyncThunk(
  'schedules/reorderTodosInSchedule',
  async ({ date, reorderedTodos }) => {
    const formattedDate = formatDate(date);
    if (!formattedDate) throw new Error('Invalid date format');
    const response = await apiClient.put(`${API_BASE_URL}/${formattedDate}/reorder`, reorderedTodos);
    return response.data;
  }
);

// Initial state
const initialState = {
  schedules: [],
  selectedDate: new Date().toISOString(), // Default to current date
  status: 'idle',
  error: null,
};

// Utility function to update schedules array
const updateScheduleInState = (state, newSchedule) => {
  const existingIndex = state.schedules.findIndex(
    (schedule) => schedule.date === newSchedule.date
  );

  if (existingIndex !== -1) {
    // Update existing schedule
    state.schedules[existingIndex] = newSchedule;
  } else {
    // Add new schedule
    state.schedules.push(newSchedule);
  }
};

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    // Reorder todos locally within a specific schedule
    reorderScheduleTodos: (state, action) => {
      const { date, sourceIndex, destinationIndex } = action.payload;
      const existingSchedule = state.schedules.find((schedule) => schedule.date === date);

      if (existingSchedule && existingSchedule.todos) {
        const updatedTodos = Array.from(existingSchedule.todos);
        const [movedTodo] = updatedTodos.splice(sourceIndex, 1);
        updatedTodos.splice(destinationIndex, 0, movedTodo);

        existingSchedule.todos = updatedTodos;
      }
    },
    // Update selected date
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all schedules
      .addCase(fetchSchedules.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSchedules.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.schedules = action.payload;
      })
      .addCase(fetchSchedules.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Fetch schedule by date
      .addCase(fetchScheduleByDate.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchScheduleByDate.fulfilled, (state, action) => {
        state.status = 'succeeded';
        updateScheduleInState(state, action.payload);
      })
      .addCase(fetchScheduleByDate.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Add or update schedule
      .addCase(createOrUpdateSchedule.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createOrUpdateSchedule.fulfilled, (state, action) => {
        state.status = 'succeeded';
        updateScheduleInState(state, action.payload);
      })
      .addCase(createOrUpdateSchedule.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Add a todo to schedule
      .addCase(addTodoToSchedule.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addTodoToSchedule.fulfilled, (state, action) => {
        state.status = 'succeeded';
        updateScheduleInState(state, action.payload);
      })
      .addCase(addTodoToSchedule.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Reorder todos in schedule
      .addCase(reorderTodosInSchedule.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(reorderTodosInSchedule.fulfilled, (state, action) => {
        state.status = 'succeeded';
        updateScheduleInState(state, action.payload);
      })
      .addCase(reorderTodosInSchedule.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { reorderScheduleTodos, setSelectedDate } = scheduleSlice.actions;

export default scheduleSlice.reducer;
