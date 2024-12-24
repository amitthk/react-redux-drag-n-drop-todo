import { createSlice } from '@reduxjs/toolkit';

// Initial state for the slice
const initialState = {
  schedules: [], // Array of schedules, each with a date and an array of todos
};

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    // Add or update a schedule for a specific date
    addOrUpdateSchedule: (state, action) => {
      const { date, todos } = action.payload;
      const existingScheduleIndex = state.schedules.findIndex((schedule) => schedule.date === date);

      if (existingScheduleIndex !== -1) {
        // Update the existing schedule
        state.schedules[existingScheduleIndex].todos = todos;
      } else {
        // Add a new schedule
        state.schedules.push({ date, todos });
      }
    },

    // Add a todo to a specific schedule
    addTodoToSchedule: (state, action) => {
      const { date, todo } = action.payload;
      const existingSchedule = state.schedules.find((schedule) => schedule.date === date);

      if (existingSchedule) {
        // Append the todo to the existing schedule
        existingSchedule.todos.push(todo);
      } else {
        // Create a new schedule with the todo
        state.schedules.push({ date, todos: [todo] });
      }
    },

    // Reorder todos within a specific schedule
    reorderScheduleTodos: (state, action) => {
      const { date, sourceIndex, destinationIndex } = action.payload;
      const existingSchedule = state.schedules.find((schedule) => schedule.date === date);

      if (existingSchedule) {
        const [movedTodo] = existingSchedule.todos.splice(sourceIndex, 1);
        existingSchedule.todos.splice(destinationIndex, 0, movedTodo);
      }
    },
  },
});

// Export actions
export const { addOrUpdateSchedule, addTodoToSchedule, reorderScheduleTodos } =
  scheduleSlice.actions;

// Export reducer
export default scheduleSlice.reducer;
