import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../services/apiClient';

const API_BASE_URL = '/api/todos';

// Async actions
export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const response = await apiClient.get(API_BASE_URL);
  return response.data;
});

export const createTodo = createAsyncThunk('todos/createTodo', async (todo) => {
  const response = await apiClient.post(API_BASE_URL, todo);
  return response.data;
});

export const updateTodo = createAsyncThunk('todos/updateTodo', async ({ id, updates }) => {
  const response = await apiClient.put(`${API_BASE_URL}/${id}`, updates);
  return response.data;
});

export const deleteTodo = createAsyncThunk('todos/deleteTodo', async (id) => {
  await apiClient.delete(`${API_BASE_URL}/${id}`);
  return id;
});

export const updateTodos = createAsyncThunk('todos/updateTodos', async (todos) => {
  const response = await apiClient.put(`${API_BASE_URL}/order`, todos);
  return response.data; // Backend should return the updated todos
});

// Initial state
const initialState = {
  todos: [],
  status: 'idle',
  error: null,
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setTodos: (state, action) => {
      state.todos = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.todos = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        state.todos.push(action.payload);
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        const index = state.todos.findIndex((todo) => todo.id === action.payload.id);
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.todos = state.todos.filter((todo) => todo.id !== action.payload);
      })
      .addCase(updateTodos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateTodos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.todos = action.payload; // Replace the todos with the updated list
      })
      .addCase(updateTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setTodos } = todoSlice.actions;

export default todoSlice.reducer;
