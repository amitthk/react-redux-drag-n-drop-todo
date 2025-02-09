import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../services/apiClient';

const API_BASE_URL = '/api/todos';

// ✅ **Async Actions for Todos**
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
  return response.data;
});

// ✅ **Fetch Projects Linked to a Todo**
export const fetchLinkedProjects = createAsyncThunk('todos/fetchLinkedProjects', async (todoId) => {
  const response = await apiClient.get(`${API_BASE_URL}/${todoId}/projects`);
  return { todoId, projects: response.data };
});

// ✅ **Link a Todo to a Project**
export const linkTodoToProject = createAsyncThunk(
  'todos/linkTodoToProject',
  async ({ todoId, projectId }) => {
    await apiClient.post(`${API_BASE_URL}/link`, null, { params: { todoId, projectId } });
    return { todoId, projectId };
  }
);

// ✅ **Unlink a Todo from a Project**
export const unlinkTodoFromProject = createAsyncThunk(
  'todos/unlinkTodoFromProject',
  async ({ todoId, projectId }) => {
    await apiClient.delete(`${API_BASE_URL}/unlink`, { params: { todoId, projectId } });
    return { todoId, projectId };
  }
);

// ✅ **Initial State**
const initialState = {
  todos: [],
  linkedProjects: {}, // { todoId: [projects] }
  status: 'idle',
  error: null,
};

// ✅ **Todo Slice**
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
      // 🔹 Fetch Todos
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.todos = action.payload;
      })

      // 🔹 Create Todo
      .addCase(createTodo.fulfilled, (state, action) => {
        state.todos.push(action.payload);
      })

      // 🔹 Update Todo
      .addCase(updateTodo.fulfilled, (state, action) => {
        const index = state.todos.findIndex((todo) => todo.id === action.payload.id);
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
      })

      // 🔹 Delete Todo
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.todos = state.todos.filter((todo) => todo.id !== action.payload);
      })

      // 🔹 Update Todos Order
      .addCase(updateTodos.fulfilled, (state, action) => {
        state.todos = action.payload;
      })

      // 🔹 Fetch Linked Projects for a Todo
      .addCase(fetchLinkedProjects.fulfilled, (state, action) => {
        state.linkedProjects[action.payload.todoId] = action.payload.projects;
      })

      // 🔹 Link Todo to Project
      .addCase(linkTodoToProject.fulfilled, (state, action) => {
        const { todoId, projectId } = action.payload;
        if (!state.linkedProjects[todoId]) {
          state.linkedProjects[todoId] = [];
        }
        state.linkedProjects[todoId].push({ id: projectId });
      })

      // 🔹 Unlink Todo from Project
      .addCase(unlinkTodoFromProject.fulfilled, (state, action) => {
        const { todoId, projectId } = action.payload;
        state.linkedProjects[todoId] = state.linkedProjects[todoId].filter(
          (project) => project.id !== projectId
        );
      });
  },
});

export const { setTodos } = todoSlice.actions;
export default todoSlice.reducer;
