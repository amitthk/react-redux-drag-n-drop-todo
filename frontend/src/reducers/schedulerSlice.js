import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../services/apiClient';
import { formatDate } from '../services/util';

const API_BASE_URL = '/api/schedules';

// Async actions
export const fetchSchedules = createAsyncThunk('schedules/fetchSchedules', async () => {
  const response = await apiClient.get(API_BASE_URL);
  return response.data;
});

export const fetchScheduleByDate = createAsyncThunk('schedules/fetchScheduleByDate', async (date) => {
  const formattedDate = formatDate(date);
  if (!formattedDate) throw new Error('Invalid date format');
  const response = await apiClient.get(`${API_BASE_URL}/${formattedDate}`);
  return response.data;
});

export const addTodoToSchedule = createAsyncThunk(
  'schedules/addTodoToSchedule',
  async ({ date, todo }) => {
    const formattedDate = formatDate(date);
    if (!formattedDate) throw new Error('Invalid date format');
    const response = await apiClient.post(`${API_BASE_URL}/${formattedDate}/todo`, todo);
    return response.data;
  }
);

export const reorderTodosInSchedule = createAsyncThunk(
  'schedules/reorderTodosInSchedule',
  async ({ date, reorderedTodos }) => {
    const formattedDate = formatDate(date);
    if (!formattedDate) throw new Error('Invalid date format');
    //const todoIds = reorderedTodos.map((todo) => todo.todo.id); // Send only the IDs
    const response = await apiClient.put(`${API_BASE_URL}/${formattedDate}/reorder`, reorderedTodos);
    return response.data;
  }
);


const initialState = {
  schedules: [],
  selectedDate: new Date().toISOString(),
  status: 'idle',
  error: null,
};

const updateScheduleInState = (state, newSchedule) => {
  const index = state.schedules.findIndex((schedule) => schedule.date === newSchedule.date);
  if (index !== -1) {
    state.schedules[index] = newSchedule;
  } else {
    state.schedules.push(newSchedule);
  }
};

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchedules.fulfilled, (state, action) => {
        state.schedules = action.payload;
      })
      .addCase(fetchScheduleByDate.fulfilled, (state, action) => {
        updateScheduleInState(state, action.payload);
      })
      .addCase(addTodoToSchedule.fulfilled, (state, action) => {
        updateScheduleInState(state, action.payload);
      })
      .addCase(reorderTodosInSchedule.fulfilled, (state, action) => {
        updateScheduleInState(state, action.payload);
      });
  },
});

export const { setSelectedDate } = scheduleSlice.actions;
export default scheduleSlice.reducer;
