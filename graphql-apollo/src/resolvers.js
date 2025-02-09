const axios = require('axios');

const API_BASE_URL = "http://localhost:8080/api"; // Update if needed

const resolvers = {
  Query: {
    // Fetch all Todos
    getTodos: async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/todos`);
        return Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        console.error("Error fetching todos:", error.message);
        throw new Error("Failed to fetch todos");
      }
    },

    // Fetch a single Todo by ID
    getTodo: async (_, { id }) => {
      try {
        const response = await axios.get(`${API_BASE_URL}/todos/${id}`);
        return response.data || null;
      } catch (error) {
        console.error(`Error fetching todo ${id}:`, error.message);
        throw new Error("Todo not found");
      }
    },

    // Fetch all Projects
    getProjects: async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/projects`);
        return Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        console.error("Error fetching projects:", error.message);
        throw new Error("Failed to fetch projects");
      }
    },

    // Fetch a single Project by ID
    getProject: async (_, { id }) => {
      try {
        const response = await axios.get(`${API_BASE_URL}/projects/${id}`);
        return response.data || null;
      } catch (error) {
        console.error(`Error fetching project ${id}:`, error.message);
        throw new Error("Project not found");
      }
    },

    // Fetch linked projects for a Todo
    getLinkedProjects: async (_, { todoId }) => {
      try {
        const response = await axios.get(`${API_BASE_URL}/todos/${todoId}/projects`);
        const linkedProjects = response.data || [];

        const projectDetails = await Promise.all(
          linkedProjects.map(async (link) => {
            const projectResponse = await axios.get(`${API_BASE_URL}/projects/${link.projectId}`);
            return projectResponse.data;
          })
        );

        return projectDetails;
      } catch (error) {
        console.error(`Error fetching linked projects for todo ${todoId}:`, error.message);
        return [];
      }
    },

    // Fetch linked todos for a Project
    getLinkedTodos: async (_, { projectId }) => {
      try {
        const response = await axios.get(`${API_BASE_URL}/projects/${projectId}/todos`);
        const linkedTodos = response.data || [];

        const todoDetails = await Promise.all(
          linkedTodos.map(async (link) => {
            const todoResponse = await axios.get(`${API_BASE_URL}/todos/${link.todoId}`);
            return todoResponse.data;
          })
        );

        return todoDetails;
      } catch (error) {
        console.error(`Error fetching linked todos for project ${projectId}:`, error.message);
        return [];
      }
    },
  },

  Mutation: {
    // Create a new Todo
    createTodo: async (_, { text, type, name }) => {
      try {
        const response = await axios.post(`${API_BASE_URL}/todos`, { text, type, name });
        return response.data;
      } catch (error) {
        console.error("Error creating todo:", error.message);
        throw new Error("Failed to create todo");
      }
    },

    // Create a new Project
    createProject: async (_, { name, type, status, description }) => {
      try {
        const response = await axios.post(`${API_BASE_URL}/projects`, { name, type, status, description });
        return response.data;
      } catch (error) {
        console.error("Error creating project:", error.message);
        throw new Error("Failed to create project");
      }
    },

    // Link a Todo to a Project
    linkTodoToProject: async (_, { todoId, projectId }) => {
      try {
        await axios.post(`${API_BASE_URL}/projects/${projectId}/link-todo/${todoId}`);
        return true;
      } catch (error) {
        console.error("Error linking todo to project:", error.message);
        return false;
      }
    },

    // Unlink a Todo from a Project
    unlinkTodoFromProject: async (_, { todoId, projectId }) => {
      try {
        await axios.delete(`${API_BASE_URL}/projects/${projectId}/unlink-todo/${todoId}`);
        return true;
      } catch (error) {
        console.error("Error unlinking todo from project:", error.message);
        return false;
      }
    },
  },

  // Resolver to fetch nested Projects for each Todo
  Todo: {
    projects: async (todo) => {
      try {
        const response = await axios.get(`${API_BASE_URL}/todos/${todo.id}/projects`);
        const linkedProjects = response.data || [];

        const projectDetails = await Promise.all(
          linkedProjects.map(async (link) => {
            const projectResponse = await axios.get(`${API_BASE_URL}/projects/${link.projectId}`);
            return projectResponse.data;
          })
        );

        return projectDetails;
      } catch (error) {
        console.error(`Error fetching projects for todo ${todo.id}:`, error.message);
        return [];
      }
    },
  },

  // Resolver to fetch nested Todos for each Project
  Project: {
    todos: async (project) => {
      try {
        const response = await axios.get(`${API_BASE_URL}/projects/${project.id}/todos`);
        const linkedTodos = response.data || [];

        const todoDetails = await Promise.all(
          linkedTodos.map(async (link) => {
            const todoResponse = await axios.get(`${API_BASE_URL}/todos/${link.todoId}`);
            return todoResponse.data;
          })
        );

        return todoDetails;
      } catch (error) {
        console.error(`Error fetching todos for project ${project.id}:`, error.message);
        return [];
      }
    },
  },
};

module.exports = resolvers;
