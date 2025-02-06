import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './todoSlice';
import schedulerSlice from './schedulerSlice';
import projectSlice from './projectSlice';

export const store = configureStore({
  reducer: {
    todos: todoReducer,
    schedules: schedulerSlice,
    projects: projectSlice
  },
});
