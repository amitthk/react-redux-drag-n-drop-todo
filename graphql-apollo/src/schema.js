const { gql } = require('graphql-tag');

const typeDefs = gql`
  type Todo {
    id: ID!
    text: String!
    type: String!
    priorityOrder: Int
    name: String!
    estimatedCost: Float
    displayOrder: Int
    priority: Int
    projects: [Project]  # Allow null if there are no linked projects
  }

  type Project {
    id: ID!
    name: String!
    type: String!
    status: String!
    description: String!
    priority: Int
    displayOrder: Int
    costEstimate: Float
    todos: [Todo]  # Allow null if there are no linked todos
  }

  type Query {
    getTodos: [Todo]!
    getTodo(id: ID!): Todo
    getProjects: [Project]!
    getProject(id: ID!): Project
    getLinkedProjects(todoId: ID!): [Project]!
    getLinkedTodos(projectId: ID!): [Todo]!
  }

  type Mutation {
    createTodo(text: String!, type: String!, name: String!): Todo!
    createProject(name: String!, type: String!, status: String!, description: String!): Project!
    linkTodoToProject(todoId: ID!, projectId: ID!): Boolean!
    unlinkTodoFromProject(todoId: ID!, projectId: ID!): Boolean!
  }
`;

module.exports = typeDefs;
