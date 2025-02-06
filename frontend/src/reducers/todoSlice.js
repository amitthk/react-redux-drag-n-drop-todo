import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../services/apiClient';

const API_BASE_URL = '/api/todos';
const PROJECTS_API_URL = '/api/todos';
const LINKS_API_URL = '/api/todos';

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

// ✅ **Async Actions for Projects**
export const fetchProjects = createAsyncThunk('projects/fetchProjects', async () => {
  const response = await apiClient.get(PROJECTS_API_URL);
  return response.data;
});

export const createProject = createAsyncThunk('projects/createProject', async (project) => {
  const response = await apiClient.post(PROJECTS_API_URL, project);
  return response.data;
});

export const updateProject = createAsyncThunk('projects/updateProject', async ({ id, updates }) => {
  const response = await apiClient.put(`${PROJECTS_API_URL}/${id}`, updates);
  return response.data;
});

export const deleteProject = createAsyncThunk('projects/deleteProject', async (id) => {
  await apiClient.delete(`${PROJECTS_API_URL}/${id}`);
  return id;
});

// ✅ **Async Actions for Todo-Project Links**
export const fetchTodoProjectLinks = createAsyncThunk('links/fetchTodoProjectLinks', async () => {
  const response = await apiClient.get(LINKS_API_URL);
  return response.data;
});

export const linkTodoToProject = createAsyncThunk(
  'links/linkTodoToProject',
  async ({ todoId, projectId }) => {
    const response = await apiClient.post(`${LINKS_API_URL}/link`, { todoId, projectId });
    return response.data;
  }
);

export const unlinkTodoFromProject = createAsyncThunk(
  'links/unlinkTodoFromProject',
  async ({ todoId, projectId }) => {
    await apiClient.delete(`${LINKS_API_URL}/unlink?todoId=${todoId}&projectId=${projectId}`);
    return { todoId, projectId };
  }
);

// ✅ **Initial State**
const initialState = {
  todos: [],
  projects: [],
  todoProjectLinks: [],
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
      .addCase(updateTodos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateTodos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.todos = action.payload;
      })
      .addCase(updateTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // 🔹 Fetch Projects
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.projects = action.payload;
      })

      // 🔹 Create Project
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.push(action.payload);
      })

      // 🔹 Update Project
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex((project) => project.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      })

      // 🔹 Delete Project
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter((project) => project.id !== action.payload);
      })

      // 🔹 Fetch Todo-Project Links
      .addCase(fetchTodoProjectLinks.fulfilled, (state, action) => {
        state.todoProjectLinks = action.payload;
      })

      // 🔹 Link Todo to Project
      .addCase(linkTodoToProject.fulfilled, (state, action) => {
        state.todoProjectLinks.push(action.payload);
      })

      // 🔹 Unlink Todo from Project
      .addCase(unlinkTodoFromProject.fulfilled, (state, action) => {
        state.todoProjectLinks = state.todoProjectLinks.filter(
          (link) => !(link.todoId === action.payload.todoId && link.projectId === action.payload.projectId)
        );
      });
  },
});

export const { setTodos } = todoSlice.actions;
export default todoSlice.reducer;
