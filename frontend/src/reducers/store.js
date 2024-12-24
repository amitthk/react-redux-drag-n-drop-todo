import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './todoSlice';
import schedulerSlice from './schedulerSlice';

export const store = configureStore({
  reducer: {
    todos: todoReducer,
    schedules: schedulerSlice
  },
});
