import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../services/apiClient';

const API_BASE_URL = '/api/projects';

// Async actions
export const fetchProjects = createAsyncThunk('projects/fetchProjects', async () => {
  const response = await apiClient.get(API_BASE_URL);
  return response.data;
});

export const createProject = createAsyncThunk('projects/createProject', async (project) => {
  const response = await apiClient.post(API_BASE_URL, project);
  return response.data;
});

export const deleteProject = createAsyncThunk('projects/deleteProject', async (id) => {
  await apiClient.delete(`${API_BASE_URL}/${id}`);
  return id;
});

const projectSlice = createSlice({
  name: 'projects',
  initialState: { projects: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.projects = action.payload;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.push(action.payload);
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter((project) => project.id !== action.payload);
      });
  },
});

export default projectSlice.reducer;
