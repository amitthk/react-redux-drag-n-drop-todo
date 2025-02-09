import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../services/apiClient';

const API_BASE_URL = '/api/projects';

// ✅ **Fetch All Projects**
export const fetchProjects = createAsyncThunk('projects/fetchProjects', async () => {
  const response = await apiClient.get(API_BASE_URL);
  return response.data;
});

// ✅ Fetch project by ID
export const fetchProjectById = createAsyncThunk('projects/fetchProjectById', async (projectId) => {
    const response = await apiClient.get(`${API_BASE_URL}/${projectId}`);
    return response.data;
  });

// ✅ **Fetch Linked Todos for a Project**
export const fetchLinkedTodos = createAsyncThunk('projects/fetchLinkedTodos', async (projectId) => {
  if (!projectId) return { projectId, todos: [] }; // Prevent API call if no valid ID
  const response = await apiClient.get(`${API_BASE_URL}/${projectId}/todos`);
  return { projectId, todos: response.data };
});

// ✅ **Fetch Linked Projects for a Todo (Previously Missing)**
export const fetchLinkedProjects = createAsyncThunk('projects/fetchLinkedProjects', async (todoId) => {
  if (!todoId) return { todoId, projects: [] }; // Prevent API call if no valid ID
  const response = await apiClient.get(`${API_BASE_URL}/${todoId}/projects`);
  return { todoId, projects: response.data };
});

// ✅ **Create, Update & Delete Projects**
export const createProject = createAsyncThunk('projects/createProject', async (project) => {
  const response = await apiClient.post(API_BASE_URL, project);
  return response.data;
});

export const updateProject = createAsyncThunk('projects/updateProject', async ({ id, updates }) => {
  const response = await apiClient.put(`${API_BASE_URL}/${id}`, updates);
  return response.data;
});

export const deleteProject = createAsyncThunk('projects/deleteProject', async (id) => {
  await apiClient.delete(`${API_BASE_URL}/${id}`);
  return id;
});

// ✅ **Link & Unlink Projects and Todos**
export const linkProjectToTodo = createAsyncThunk(
  'projects/linkProjectToTodo',
  async ({ projectId, todoId }) => {
    await apiClient.post(`${API_BASE_URL}/${projectId}/link-todo/${todoId}`);
    return { projectId, todoId };
  }
);

export const unlinkProjectFromTodo = createAsyncThunk(
  'projects/unlinkProjectFromTodo',
  async ({ projectId, todoId }) => {
    await apiClient.delete(`${API_BASE_URL}/${projectId}/unlink-todo/${todoId}`);
    return { projectId, todoId };
  }
);

// ✅ **Initial State**
const initialState = {
  projects: [],
  linkedTodos: {}, // { projectId: [todos] }
  linkedProjects: {}, // { todoId: [projects] }
  status: 'idle',
  error: null,
};

// ✅ **Project Slice**
const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setSelectedProject: (state, action) => {
      state.selectedProject = action.payload;
    },
    clearSelectedProject: (state) => {
      state.selectedProject = null;
      state.linkedTodos = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 Fetch Projects
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.projects = action.payload;
      })

    // Fetch project by ID (used when fetching linked projects)
    .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.projects = [...state.projects.filter((p) => p.id !== action.payload.id), action.payload];
        })

      // 🔹 Fetch Linked Todos for a Project
      .addCase(fetchLinkedTodos.fulfilled, (state, action) => {
        state.linkedTodos[action.payload.projectId] = action.payload.todos;
      })

      // 🔹 Fetch Linked Projects for a Todo (Previously Missing)
      .addCase(fetchLinkedProjects.fulfilled, (state, action) => {
        state.linkedProjects[action.payload.todoId] = action.payload.projects;
      })

      // 🔹 Link Project to Todo
      .addCase(linkProjectToTodo.fulfilled, (state, action) => {
        const { projectId, todoId } = action.payload;
        if (!state.linkedTodos[projectId]) {
          state.linkedTodos[projectId] = [];
        }
        state.linkedTodos[projectId].push({ id: todoId });
      })

      // 🔹 Unlink Project from Todo
      .addCase(unlinkProjectFromTodo.fulfilled, (state, action) => {
        const { projectId, todoId } = action.payload;
        state.linkedTodos[projectId] = state.linkedTodos[projectId].filter((todo) => todo.id !== todoId);
      });
  },
});

export const { setSelectedProject, clearSelectedProject } = projectSlice.actions;
export default projectSlice.reducer;
